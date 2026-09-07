import { describe, expect, it } from 'vitest';
import { runTp } from '../src/lib/tools/tp';
import { runValuation } from '../src/lib/tools/valuation';
import { runReadiness } from '../src/lib/tools/readiness';
import {
  READINESS_KEYS,
  READINESS_WEIGHTS,
  SECTOR_MULTIPLES,
  TP,
  assertRulebookFresh,
} from '../src/lib/tools/config';
import { makeFormat, parseAmount } from '../src/lib/format';

describe('transfer pricing threshold', () => {
  const base = { related: true as const };

  it('returns nothing until the inputs can answer the question', () => {
    expect(runTp({ related: null, amount: 200_000_000 })).toBeNull();
    expect(runTp({ related: false, amount: 200_000_000 })).toBeNull();
    expect(runTp({ ...base, amount: 0 })).toBeNull();
    expect(runTp({ ...base, amount: Number.NaN })).toBeNull();
  });

  it('applies at the threshold, not just above it', () => {
    expect(runTp({ ...base, amount: TP.threshold - 1 })?.applies).toBe(false);
    expect(runTp({ ...base, amount: TP.threshold })?.applies).toBe(true);
    expect(runTp({ ...base, amount: TP.threshold + 1 })?.applies).toBe(true);
  });

  it('reports the distance from the threshold in both directions', () => {
    expect(runTp({ ...base, amount: 180_000_000 })?.difference).toBe(30_000_000);
    expect(runTp({ ...base, amount: 120_000_000 })?.difference).toBe(30_000_000);
    expect(runTp({ ...base, amount: TP.threshold })?.difference).toBe(0);
  });

  it('carries the published penalty and secondary thresholds', () => {
    const r = runTp({ ...base, amount: 200_000_000 })!;
    expect(r.penalty).toBe(5_000_000);
    expect(r.penaltyRepeat).toBe(10_000_000);
    expect(r.masterFileThreshold).toBe(500_000_000);
    expect(r.simplifiedRechargeThreshold).toBe(500_000_000);
  });
});

describe('valuation', () => {
  it('refuses to price a loss or a missing sector', () => {
    expect(runValuation({ sector: null, ebitda: 80_000_000, netDebt: 0 })).toBeNull();
    expect(runValuation({ sector: 'it', ebitda: 0, netDebt: 0 })).toBeNull();
    expect(runValuation({ sector: 'it', ebitda: -5_000_000, netDebt: 0 })).toBeNull();
  });

  it('multiplies EBITDA by the sector band and deducts net debt', () => {
    const r = runValuation({ sector: 'svc', ebitda: 80_000_000, netDebt: 30_000_000 })!;
    expect(r.multiple).toEqual([4.0, 6.0]);
    expect(r.enterprise).toEqual([320_000_000, 480_000_000]);
    expect(r.equity).toEqual([290_000_000, 450_000_000]);
    expect(r.equityNegativeAtLowEnd).toBe(false);
  });

  it('treats net cash as an addition', () => {
    const r = runValuation({ sector: 'trade', ebitda: 10_000_000, netDebt: -5_000_000 })!;
    expect(r.equity).toEqual([35_000_000, 50_000_000]);
  });

  it('flags a negative equity value rather than printing it bare', () => {
    const r = runValuation({ sector: 'trade', ebitda: 10_000_000, netDebt: 40_000_000 })!;
    expect(r.equity[0]).toBeLessThan(0);
    expect(r.equityNegativeAtLowEnd).toBe(true);
  });

  it('has a low end below the high end for every sector', () => {
    for (const [key, band] of Object.entries(SECTOR_MULTIPLES)) {
      expect(band[0], key).toBeLessThan(band[1]);
      expect(band[0], key).toBeGreaterThan(0);
    }
  });
});

describe('diligence readiness', () => {
  const all = (value: boolean) =>
    Object.fromEntries(READINESS_KEYS.map((k) => [k, value]));

  it('weights sum to exactly 100', () => {
    const total = Object.values(READINESS_WEIGHTS).reduce((a, b) => a + b, 0);
    expect(total).toBe(100);
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
    const partial = runReadiness({ accounts: true, ip: true });
    expect(partial.answered).toBe(2);
    expect(partial.complete).toBe(false);
    expect(partial.score).toBe(READINESS_WEIGHTS.accounts + READINESS_WEIGHTS.ip);
  });

  it('places each band at its documented boundary', () => {
    const bandFor = (excluded: string[]) =>
      runReadiness(
        Object.fromEntries(READINESS_KEYS.map((k) => [k, !excluded.includes(k)])),
      ).band;

    expect(bandFor([])).toBe('ready');
    // 100 - 6 = 94, still at or above the 90 boundary
    expect(bandFor(['ownerIndependence'])).toBe('ready');
    // 100 - 6 - 8 = 86, below 90 but at or above 70
    expect(bandFor(['ownerIndependence', 'loans'])).toBe('mostly');
  });

  it('lists gaps in question order', () => {
    const r = runReadiness({ ...all(true), ip: false, accounts: false });
    expect(r.gaps).toEqual(['accounts', 'ip']);
  });
});

describe('formatting', () => {
  it('groups digits per locale and keeps one currency convention', () => {
    expect(makeFormat('en').huf(180_000_000)).toBe('180,000,000 HUF');
    expect(makeFormat('hu').huf(180_000_000)).toMatch(/^180\s000\s000 HUF$/);
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
