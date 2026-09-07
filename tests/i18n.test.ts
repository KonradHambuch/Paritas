import { describe, expect, it } from 'vitest';
import { en } from '../src/i18n/en';
import { hu } from '../src/i18n/hu';
import { READINESS_KEYS, SECTOR_KEYS } from '../src/lib/tools/config';

type Shape = { [k: string]: string | Shape };

function shapeOf(obj: unknown): Shape {
  const out: Shape = {};
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    if (typeof v === 'function') out[k] = 'fn';
    else if (Array.isArray(v)) out[k] = `array:${v.length}`;
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

function walkStrings(obj: unknown, visit: (path: string, value: string) => void) {
  const go = (node: unknown, path: string) => {
    if (typeof node === 'string') return visit(path, node);
    if (Array.isArray(node)) return node.forEach((v, i) => go(v, `${path}[${i}]`));
    if (node && typeof node === 'object') {
      for (const [k, v] of Object.entries(node)) go(v, path ? `${path}.${k}` : k);
    }
  };
  go(obj, '');
}

describe('dictionary completeness', () => {
  /* The `Dict` type already fails the build on a missing key. This asserts the
     same at runtime and additionally pins ARRAY LENGTHS, which the type does
     not — a Hungarian section with five cards where English has six would
     otherwise ship silently. */
  it('Hungarian matches the English shape, array lengths included', () => {
    expect(flatten(shapeOf(hu)).sort()).toEqual(flatten(shapeOf(en)).sort());
  });

  it('has no empty strings', () => {
    const empties: string[] = [];
    walkStrings(hu, (path, value) => {
      // governingLanguage is intentionally empty until a translation needs it.
      if (value.trim() === '' && !path.endsWith('governingLanguage')) empties.push(path);
    });
    expect(empties).toEqual([]);
  });

  /* The reference HTML arrived with double-encoded UTF-8 in places
     ("DokumentÃ¡ciÃ³s", "Ã¼gyletenkÃ©nt") and a stray Cyrillic character. Both
     classes of damage are invisible in review but obvious to a reader. */
  it('has no mojibake or lookalike characters', () => {
    const bad: string[] = [];
    for (const dict of [en, hu]) {
      walkStrings(dict, (path, value) => {
        if (/Ã.|Å.|â€|Ð|Ñ/.test(value)) bad.push(`mojibake at ${path}: ${value.slice(0, 40)}`);
        if (/[Ͱ-ϿЀ-ӿ]/.test(value)) bad.push(`cyrillic/greek at ${path}`);
      });
    }
    expect(bad).toEqual([]);
  });
});

describe('dictionary covers every engine key', () => {
  it.each([
    ['en', en],
    ['hu', hu],
  ])('%s has a label for every sector', (_name, dict) => {
    const sectors = dict.tools.valuation.sectors as Record<string, string>;
    expect(Object.keys(sectors).sort()).toEqual([...SECTOR_KEYS].sort());
  });

  it.each([
    ['en', en],
    ['hu', hu],
  ])('%s has a question for every readiness key', (_name, dict) => {
    const questions = dict.tools.readiness.questions as Record<string, string>;
    expect(Object.keys(questions).sort()).toEqual([...READINESS_KEYS].sort());
  });
});

describe('placeholders resolve', () => {
  /* Strings that interpolate a value from the engine config must keep their
     token, or the page renders a literal "{threshold}" to a visitor. */
  const expected: Array<[string, (d: typeof en) => string]> = [
    ['{threshold}', (d) => d.tools.tp.p],
    ['{threshold}', (d) => d.method.tool.p],
    ['{masterFile}', (d) => d.tools.tp.result.need2],
    ['{penaltyRepeat}', (d) => d.tools.tp.result.penaltyValue],
    ['{simplified}', (d) => d.tools.tp.result.simplified],
    ['{answered}', (d) => d.tools.readiness.result.progress],
    ['{total}', (d) => d.tools.readiness.result.progress],
  ];

  it.each([
    ['en', en],
    ['hu', hu],
  ])('%s keeps every interpolation token', (_name, dict) => {
    for (const [token, pick] of expected) {
      expect(pick(dict as typeof en), token).toContain(token);
    }
  });

  it.each([
    ['en', en],
    ['hu', hu],
  ])('%s has no unresolved tokens anywhere else', (_name, dict) => {
    const known = new Set([
      'threshold',
      'masterFile',
      'penaltyRepeat',
      'simplified',
      'answered',
      'total',
    ]);
    const stray: string[] = [];
    walkStrings(dict, (path, value) => {
      for (const m of value.matchAll(/\{(\w+)\}/g)) {
        if (!known.has(m[1]!)) stray.push(`${path}: {${m[1]}}`);
      }
    });
    expect(stray).toEqual([]);
  });
});
