import { describe, expect, it } from 'vitest';
import { en } from '../src/i18n/en';
import { hu } from '../src/i18n/hu';
import { assertRulebookFresh, CONFIG } from '../src/lib/calc/config';
import { runTp } from '../src/lib/calc/tp';
import { runDd } from '../src/lib/calc/dd';
import type { TpInput, DdInput } from '../src/lib/calc/types';
import { makeFormat } from '../src/lib/format';

type Shape = { [k: string]: 'string' | 'fn' | Shape | 'array' };

function shapeOf(obj: unknown): Shape {
  const out: Shape = {};
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    if (typeof v === 'function') out[k] = 'fn';
    else if (Array.isArray(v)) out[k] = 'array';
    else if (v && typeof v === 'object') out[k] = shapeOf(v);
    else out[k] = 'string';
  }
  return out;
}

function flatten(shape: Shape, prefix = ''): string[] {
  return Object.entries(shape).flatMap(([k, v]) => {
    const path = prefix ? `${prefix}.${k}` : k;
    return typeof v === 'object' ? flatten(v, path) : [`${path}:${v}`];
  });
}

describe('dictionary completeness', () => {
  /* The `Dict` type already fails the build on a missing key. This asserts the
     same at runtime and, more usefully, catches a key present but wired to the
     wrong KIND — a plain string where a parameterised function is expected
     would render "[object Object]" in front of a visitor. */
  it('Hungarian matches the English shape exactly', () => {
    const enKeys = flatten(shapeOf(en)).sort();
    const huKeys = flatten(shapeOf(hu)).sort();
    expect(huKeys).toEqual(enKeys);
  });

  it('has no empty Hungarian strings', () => {
    const empties: string[] = [];
    const walk = (obj: unknown, path: string) => {
      for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
        const p = path ? `${path}.${k}` : k;
        // governingLanguage is intentionally empty in English only.
        if (typeof v === 'string' && v.trim() === '') empties.push(p);
        else if (v && typeof v === 'object') walk(v, p);
      }
    };
    walk(hu, '');
    expect(empties).toEqual([]);
  });

  it('uses no Cyrillic or Greek lookalike characters', () => {
    const suspicious: string[] = [];
    const walk = (obj: unknown, path: string) => {
      for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
        const p = path ? `${path}.${k}` : k;
        if (typeof v === 'string') {
          if (/[Ͱ-ϿЀ-ӿ]/.test(v)) suspicious.push(p);
        } else if (v && typeof v === 'object') walk(v, p);
      }
    };
    walk(hu, '');
    walk(en, '');
    expect(suspicious).toEqual([]);
  });
});

describe('engine keys resolve in both locales', () => {
  const tpInput: TpInput = {
    parent: 'planned',
    flipYears: 3,
    countries: { PL: true, HU: true, CZ: true, RO: true },
    flows: { dev: 600_000, mgmt: 400_000, loan: 3_000_000, ip: 300_000 },
    sizeFactor: 1.35,
    smallPl: false,
    have: {
      agreement: false,
      benchmark: false,
      localFile: false,
      forms5471: false,
      dataRoom: false,
    },
    fiscalYearEnd: '2025-12-31',
    urgency: 1.1,
    today: '2026-09-01',
  };

  const ddInput: DdInput = {
    side: 'buy',
    scope: 'b',
    entities: 4,
    revFactor: 1.4,
    acctFactor: 1.15,
    roomFactor: 1.15,
    modelFactor: 1.2,
    consolidation: true,
    rush: true,
    instrumentLayers: 3,
    addOns: { tp: true, tax: true, stamp: true },
  };

  const lookup = (dict: Record<string, unknown>, key: string): unknown =>
    key.split('.').reduce<unknown>(
      (acc, part) => (acc as Record<string, unknown>)?.[part],
      dict,
    );

  /* A scenario deliberately chosen to trigger every category of output at
     once: all four countries, a planned flip, every flow type, no existing
     documentation, and every DD add-on. */
  const tp = runTp(tpInput);
  const dd = runDd(ddInput);

  const keys = [
    ...tp.obligations.flatMap((o) => [o.tag.key, o.text.key]),
    ...tp.exposure.parts.map((p) => p.key),
    ...(tp.quote?.items.map((i) => i.key) ?? []),
    ...dd.factors.map((f) => f.key),
    ...dd.addOns.map((a) => a.key),
  ];

  it.each([
    ['en', en],
    ['hu', hu],
  ])('every emitted key exists in %s', (_name, dict) => {
    const missing = keys.filter((k) => lookup(dict.engine, k) === undefined);
    expect([...new Set(missing)]).toEqual([]);
  });

  it.each([
    ['en', en],
    ['hu', hu],
  ])('deadline, recommendation and method keys exist in %s', (_name, dict) => {
    for (const d of tp.deadlines) expect(dict.engine.deadline[d.key]).toBeTruthy();
    expect(dict.engine.reco[tp.recommendation]).toBeTruthy();
    for (const m of tp.methods) expect(dict.engine.method[m.flow]).toBeTruthy();
    expect(dict.engine.ddScopeName[dd.scope]).toBeTruthy();
  });
});

describe('locale formatting', () => {
  it('English output is byte-identical to the legacy en-US format', () => {
    const fmt = makeFormat('en');
    expect(fmt.eur(5500)).toBe(`€${(5500).toLocaleString('en-US')}`);
    expect(fmt.eur(196000)).toBe(`€${(196000).toLocaleString('en-US')}`);
  });

  it('Hungarian uses the euro sign and correct grouping', () => {
    const fmt = makeFormat('hu');
    // ICU separates the number and the symbol with a NON-BREAKING space, so
    // these match on \s rather than a literal space.
    // Hungarian groups from five digits up, so 5500 is correctly ungrouped.
    expect(fmt.eur(5500)).toMatch(/^5500\s€$/);
    expect(fmt.eur(13500)).toMatch(/^13\s500\s€$/);
    expect(fmt.eurRange(13500, 196000)).toMatch(/€$/);
  });

  it('formats dates per locale without timezone drift', () => {
    expect(makeFormat('en').date('2026-10-31')).toBe('31 Oct 2026');
    expect(makeFormat('hu').date('2026-10-31')).toBe('2026. okt. 31.');
  });
});

describe('rulebook freshness', () => {
  it('accepts a recent verification date', () => {
    expect(() => assertRulebookFresh(new Date('2027-01-01T00:00:00Z'))).not.toThrow();
  });

  it('rejects a rule set older than twelve months', () => {
    expect(() => assertRulebookFresh(new Date('2028-01-01T00:00:00Z'))).toThrow(
      /Re-verify the thresholds/,
    );
  });

  it('is currently fresh', () => {
    expect(() => assertRulebookFresh()).not.toThrow();
    expect(CONFIG.lastVerified).toMatch(/^\d{4}-\d{2}$/);
  });
});
