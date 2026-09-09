import { describe, expect, it } from 'vitest';
import { runTp } from '../src/lib/tools/tp';
import { runValuation } from '../src/lib/tools/valuation';
import { runReadiness } from '../src/lib/tools/readiness';
import { runTaxRecovery } from '../src/lib/tools/taxRecovery';
import {
  READINESS_KEYS,
  READINESS_WEIGHTS,
  SECTORS,
  TAX,
  TP,
  assertRulebookFresh,
  type ReadinessKey,
} from '../src/lib/tools/config';
import { makeFormat, parseAmount } from '../src/lib/format';

describe('transfer pricing', () => {
  it('returns nothing until something has been entered', () => {
    expect(runTp([])).toBeNull();
    expect(runTp([{ type: 'loan', value: 0 }])).toBeNull();
    expect(runTp([{ type: 'loan', value: Number.NaN }])).toBeNull();
  });

  /* The whole point of the tool: two loans of 80m are one 160m transaction
     and cross the threshold, even though neither does alone. */
  it('aggregates rows of the same type before testing the threshold', () => {
    const r = runTp([
      { type: 'loan', value: 80_000_000 },
      { type: 'loan', value: 80_000_000 },
    ])!;
    expect(r.aggregates).toHaveLength(1);
    expect(r.aggregates[0]!.total).toBe(160_000_000);
    expect(r.aggregates[0]!.required).toBe(true);
    expect(r.anyRequired).toBe(true);
  });

  it('keeps different types apart', () => {
    const r = runTp([
      { type: 'loan', value: 100_000_000 },
      { type: 'royalty', value: 100_000_000 },
    ])!;
    expect(r.aggregates.map((a) => a.total)).toEqual([100_000_000, 100_000_000]);
    expect(r.anyRequired).toBe(false);
    expect(r.total).toBe(200_000_000);
  });

  it('applies at the threshold, not only above it', () => {
    expect(runTp([{ type: 'loan', value: TP.threshold - 1 }])!.anyRequired).toBe(false);
    expect(runTp([{ type: 'loan', value: TP.threshold }])!.anyRequired).toBe(true);
  });

  it('tests the master file against the total across all types', () => {
    const under = runTp([
      { type: 'loan', value: 200_000_000 },
      { type: 'products', value: 200_000_000 },
    ])!;
    expect(under.masterFileRequired).toBe(false);

    const over = runTp([
      { type: 'loan', value: 200_000_000 },
      { type: 'products', value: 200_000_000 },
      { type: 'royalty', value: 100_000_000 },
    ])!;
    expect(over.total).toBe(500_000_000);
    expect(over.masterFileRequired).toBe(true);
  });

  it('ignores blank rows without dropping the ones that follow', () => {
    const r = runTp([
      { type: 'loan', value: 0 },
      { type: 'products', value: 160_000_000 },
    ])!;
    expect(r.aggregates).toHaveLength(1);
    expect(r.aggregates[0]!.type).toBe('products');
  });

  it('carries the published penalties', () => {
    const r = runTp([{ type: 'loan', value: 200_000_000 }])!;
    expect(r.penalty).toBe(5_000_000);
    expect(r.penaltyRepeat).toBe(10_000_000);
  });
});

describe('valuation', () => {
  it('refuses a loss or a missing sector', () => {
    expect(runValuation({ sector: null, base: 80_000_000, netDebt: 0 })).toBeNull();
    expect(runValuation({ sector: 'it', base: 0, netDebt: 0 })).toBeNull();
    expect(runValuation({ sector: 'it', base: -5_000_000, netDebt: 0 })).toBeNull();
  });

  it('multiplies the base by the sector band and deducts net debt', () => {
    const r = runValuation({ sector: 'svc', base: 80_000_000, netDebt: 30_000_000 })!;
    expect(r.method).toBe('ebitda');
    expect(r.multiple).toEqual([4.0, 6.0]);
    expect(r.enterprise).toEqual([320_000_000, 480_000_000]);
    expect(r.equity).toEqual([290_000_000, 450_000_000]);
  });

  /* The sector picks the METHOD, not just the number — pricing SaaS or an
     asset-heavy business on EBITDA would be confidently wrong. */
  it('selects the method from the sector', () => {
    expect(runValuation({ sector: 'saas', base: 100, netDebt: 0 })!.method).toBe('revenue');
    expect(runValuation({ sector: 'realest', base: 100, netDebt: 0 })!.method).toBe('asset');
    expect(runValuation({ sector: 'holding', base: 100, netDebt: 0 })!.method).toBe('asset');
    expect(runValuation({ sector: 'prod', base: 100, netDebt: 0 })!.method).toBe('ebitda');
  });

  it('treats net cash as an addition', () => {
    const r = runValuation({ sector: 'trade', base: 10_000_000, netDebt: -5_000_000 })!;
    expect(r.equity).toEqual([35_000_000, 50_000_000]);
  });

  it('flags a negative equity value rather than printing it bare', () => {
    const r = runValuation({ sector: 'trade', base: 10_000_000, netDebt: 40_000_000 })!;
    expect(r.equity[0]).toBeLessThan(0);
    expect(r.equityNegativeAtLowEnd).toBe(true);
  });

  it('has a low end below the high end for every sector', () => {
    for (const [key, s] of Object.entries(SECTORS)) {
      expect(s.range[0], key).toBeLessThan(s.range[1]);
      expect(s.range[0], key).toBeGreaterThan(0);
    }
  });
});

describe('diligence readiness', () => {
  const all = (value: boolean) =>
    Object.fromEntries(READINESS_KEYS.map((k) => [k, value]));

  it('weights sum to exactly 100', () => {
    expect(Object.values(READINESS_WEIGHTS).reduce((a, b) => a + b, 0)).toBe(100);
  });

  it('scores a perfect and an empty sheet', () => {
    const best = runReadiness(all(true));
    expect(best.score).toBe(100);
    expect(best.band).toBe('ready');
    expect(best.gaps).toEqual([]);

    const worst = runReadiness(all(false));
    expect(worst.score).toBe(0);
    expect(worst.band).toBe('costly');
    expect(worst.gaps).toHaveLength(READINESS_KEYS.length);
  });

  it('reports progress before every question is answered', () => {
    const partial = runReadiness({ accountsReal: true, ownerIndependence: true });
    expect(partial.answered).toBe(2);
    expect(partial.complete).toBe(false);
    expect(partial.score).toBe(28);
  });

  it('places each band at its documented boundary', () => {
    const bandFor = (excluded: ReadinessKey[]) =>
      runReadiness(
        Object.fromEntries(READINESS_KEYS.map((k) => [k, !excluded.includes(k)])),
      ).band;

    // Bands are inclusive lower bounds: 90 / 70 / 45, checked top-down.
    expect(bandFor([])).toBe('ready'); // 100
    expect(bandFor(['disputes', 'loans'])).toBe('ready'); // exactly 90
    expect(bandFor(['disputes', 'loans', 'ownership'])).toBe('mostly'); // 84
    expect(bandFor(['accountsReal', 'concentration', 'disputes'])).toBe('mostly'); // exactly 70
    expect(bandFor(['accountsReal', 'ownerIndependence', 'disputes'])).toBe('gaps'); // 68
    expect(
      bandFor(['accountsReal', 'ownerIndependence', 'concentration', 'customerContracts']),
    ).toBe('gaps'); // 48
    expect(
      bandFor([
        'accountsReal',
        'ownerIndependence',
        'concentration',
        'customerContracts',
        'disputes',
      ]),
    ).toBe('costly'); // 44
  });

  /* Heaviest first, so the reader starts where it pays. */
  it('sorts gaps by weight, descending', () => {
    const r = runReadiness({
      ...all(true),
      disputes: false,
      accountsReal: false,
      concentration: false,
    });
    expect(r.gaps.map((g) => g.key)).toEqual([
      'accountsReal',
      'concentration',
      'disputes',
    ]);
    expect(r.gaps.map((g) => g.weight)).toEqual([14, 12, 4]);
  });
});

describe('tax recovery', () => {
  const base = { revenue: 1_200_000_000, size: 'sme' as const, subcontracted: 0, rd: 0 };

  it('needs revenue and at least one deductible-type cost', () => {
    expect(runTaxRecovery(base)).toBeNull();
    expect(runTaxRecovery({ ...base, revenue: 0, subcontracted: 100 })).toBeNull();
    expect(runTaxRecovery({ ...base, subcontracted: 300_000_000 })).not.toBeNull();
    expect(runTaxRecovery({ ...base, rd: 40_000_000 })).not.toBeNull();
  });

  it('applies the local business tax rate for an SME', () => {
    const r = runTaxRecovery({ ...base, subcontracted: 300_000_000, rd: 40_000_000 })!;
    expect(r.pool).toBe(340_000_000);
    expect(r.rate).toBeCloseTo(0.02, 10);
    expect(r.includesInnovation).toBe(false);
    expect(r.annual[0]).toBeCloseTo(340_000_000 * 0.02 * 0.3, 6);
    expect(r.total[1]).toBeCloseTo(r.annual[1] * 5, 6);
  });

  it('adds the innovation contribution for a large company', () => {
    const r = runTaxRecovery({
      ...base,
      size: 'large',
      subcontracted: 300_000_000,
      rd: 40_000_000,
    })!;
    expect(r.includesInnovation).toBe(true);
    expect(r.rate).toBeCloseTo(0.023, 10);
  });

  /* Costs cannot plausibly exceed most of revenue; without the cap a typo
     would produce a triumphant, absurd figure. */
  it('caps the pool against revenue and says so', () => {
    const r = runTaxRecovery({
      revenue: 100_000_000,
      size: 'sme',
      subcontracted: 900_000_000,
      rd: 0,
    })!;
    expect(r.pool).toBe(100_000_000 * TAX.poolCapOfRevenue);
    expect(r.poolCapped).toBe(true);
  });

  it('does not flag a cap that did not bind', () => {
    const r = runTaxRecovery({ ...base, subcontracted: 300_000_000 })!;
    expect(r.poolCapped).toBe(false);
  });
});

describe('formatting', () => {
  it('groups digits per locale and labels the currency per locale', () => {
    expect(makeFormat('en').huf(180_000_000)).toBe('180,000,000 HUF');
    expect(makeFormat('hu').huf(180_000_000)).toMatch(/^180\s000\s000 Ft$/);
  });

  it('writes the currency once in a range', () => {
    expect(makeFormat('en').hufRange(320_000_000, 480_000_000)).toBe(
      '320,000,000 – 480,000,000 HUF',
    );
  });

  it('formats multiples to one decimal', () => {
    expect(makeFormat('en').multipleRange(4, 6.5)).toBe('4.0× – 6.5×');
  });

  it('parses grouped input back to a number', () => {
    expect(parseAmount('180 000 000')).toBe(180_000_000);
    expect(parseAmount('180,000,000')).toBe(180_000_000);
    expect(parseAmount('  ')).toBe(0);
    expect(parseAmount('-30 000')).toBe(-30_000);
  });
});

describe('rulebook freshness', () => {
  it('rejects a rule set older than twelve months', () => {
    expect(() => assertRulebookFresh(new Date('2028-01-01T00:00:00Z'))).toThrow(
      /Re-check the Hungarian thresholds/,
    );
  });

  it('is currently fresh', () => {
    expect(() => assertRulebookFresh()).not.toThrow();
  });
});
