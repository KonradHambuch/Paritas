import { describe, expect, it } from 'vitest';
import { runTp } from '../src/lib/calc/tp';
import { runDd, bundleTotal } from '../src/lib/calc/dd';
import type { DdInput, TpInput } from '../src/lib/calc/types';
import { extractNumbers, runLegacy } from './legacy/dom-shim';

/**
 * The extractor pulls every euro/percent/multiplier out of rendered output.
 * A few of those tokens are LABEL PROSE, not computed data, and the ported
 * renderer keeps them in the message catalogue instead of the number stream:
 *   - "Loans (interest ~5%, indicative)"  — the RO interest proxy in a label
 *   - "both products together, -15%"      — the bundle discount in a label
 * Stripping them keeps the comparison about arithmetic.
 */
const stripLabelProse = (s: string) =>
  s.replace(/≈5%/g, '').replace(/−15%/g, '');

/* Legacy formatters, reproduced exactly (paritas.html:770-771). */
const fmt = (n: number) => Math.round(n);
const fmtK = (n: number) => Math.round(n / 100) * 100;

/* ── deterministic case generation ────────────────────────────────────── */

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PARENTS = ['us', 'foreign', 'cee', 'planned'] as const;
const SIZES = [1, 1.15, 1.35, 1.6] as const;
const URGENCIES = [1, 1.1, 1.25] as const;
const DD_SCOPES = ['rf', 'a', 'b'] as const;
const DD_REV = [0.9, 1, 1.2, 1.4, 1.65] as const;
const DD_QUAL = [0.9, 1, 1.15] as const;
const DD_MODEL = [1, 1.1, 1.2] as const;
const FY_ENDS = ['2025-12-31', '2026-03-31', '2026-06-30', '2025-09-30'] as const;

/* Flow magnitudes chosen to straddle every threshold and both out-of-scope
   rules: zero, well under, just under, just over, way over, and absurd. */
const FLOW_STEPS = [
  0, 50_000, 250_000, 320_000, 380_000, 464_000, 465_000, 600_000, 2_000_000,
  2_320_000, 12_000_000, 26_000_000, 61_000_000,
];

function pick<T>(rnd: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rnd() * arr.length)]!;
}

interface Case {
  tp: TpInput;
  dd: DdInput;
}

function makeCase(seed: number): Case {
  const r = mulberry32(seed);
  return {
    tp: {
      parent: pick(r, PARENTS),
      flipYears: Math.floor(r() * 11),
      countries: {
        PL: r() < 0.65,
        HU: r() < 0.45,
        CZ: r() < 0.35,
        RO: r() < 0.35,
      },
      flows: {
        dev: pick(r, FLOW_STEPS),
        mgmt: pick(r, FLOW_STEPS),
        loan: pick(r, FLOW_STEPS),
        ip: pick(r, FLOW_STEPS),
      },
      sizeFactor: pick(r, SIZES),
      smallPl: r() < 0.4,
      have: {
        agreement: r() < 0.4,
        benchmark: r() < 0.3,
        localFile: r() < 0.25,
        forms5471: r() < 0.4,
        dataRoom: r() < 0.4,
      },
      fiscalYearEnd: pick(r, FY_ENDS),
      urgency: pick(r, URGENCIES),
      today: '2026-09-01',
    },
    dd: {
      side: r() < 0.5 ? 'buy' : 'sell',
      scope: pick(r, DD_SCOPES),
      entities: 1 + Math.floor(r() * 8),
      revFactor: pick(r, DD_REV),
      acctFactor: pick(r, DD_QUAL),
      roomFactor: pick(r, DD_QUAL),
      modelFactor: pick(r, DD_MODEL),
      consolidation: r() < 0.4,
      rush: r() < 0.3,
      instrumentLayers: Math.floor(r() * 7),
      addOns: { tp: r() < 0.6, tax: r() < 0.3, stamp: r() < 0.3 },
    },
  };
}

/* ── translate a case into the legacy shim's input shape ─────────────── */

function toLegacy(c: Case) {
  return {
    ids: {
      flipYears: String(c.tp.flipYears),
      fDev: String(c.tp.flows.dev),
      fMgmt: String(c.tp.flows.mgmt),
      fLoan: String(c.tp.flows.loan),
      fIp: String(c.tp.flows.ip),
      fyEnd: c.tp.fiscalYearEnd,
      ddEntities: String(c.dd.entities),
      ddInstr: String(c.dd.instrumentLayers),
    },
    names: {
      parent: c.tp.parent,
      c_pl: c.tp.countries.PL,
      c_hu: c.tp.countries.HU,
      c_cz: c.tp.countries.CZ,
      c_ro: c.tp.countries.RO,
      rev: String(c.tp.sizeFactor),
      smallco: c.tp.smallPl ? '1' : '0',
      d_agree: c.tp.have.agreement,
      d_bench: c.tp.have.benchmark,
      d_lf: c.tp.have.localFile,
      d_5471: c.tp.have.forms5471,
      d_room: c.tp.have.dataRoom,
      urgency: String(c.tp.urgency),
      ddside: c.dd.side,
      ddscope: c.dd.scope,
      ddrev: String(c.dd.revFactor),
      ddacct: String(c.dd.acctFactor),
      ddroom: String(c.dd.roomFactor),
      ddmodel: String(c.dd.modelFactor),
      dd_consol: c.dd.consolidation,
      dd_rush: c.dd.rush,
      dd_tp: c.dd.addOns.tp,
      dd_tax: c.dd.addOns.tax,
      dd_stamp: c.dd.addOns.stamp,
    },
  };
}

/* ── rebuild the legacy number sequences from the ported results ─────── */

function portedObligationNumbers(c: Case): number[] {
  const out: number[] = [];
  for (const o of runTp(c.tp).obligations) {
    const p = o.text.params;
    if (!p) continue;
    if (typeof p.value === 'number') out.push(fmt(p.value));
    if (typeof p.pct === 'number') out.push(p.pct);
  }
  return out;
}

function portedQuoteNumbers(c: Case): number[] {
  const res = runTp(c.tp);
  if (!res.quote) return [];
  if (res.outOfScope) return []; // legacy replaces the panel wholesale
  const { items, modifier, total, anchor, range } = res.quote;
  return [
    ...items.map((i) => fmtK(i.amount * modifier)),
    fmtK(anchor[0]),
    fmtK(anchor[1]),
    fmtK(range[0]),
    fmtK(range[1]),
  ].concat(total === 0 ? [] : []);
}

function portedExposureNumbers(c: Case): number[] {
  const res = runTp(c.tp);
  if (res.outOfScope) return []; // "Scoped manually"
  if (res.exposure.total <= 0) return [0]; // "€0 — for now"
  return [fmtK(res.exposure.low), fmtK(res.exposure.high)];
}

function portedDdNumbers(c: Case): number[] {
  const tp = runTp(c.tp);
  const dd = runDd(c.dd);
  const out: number[] = [fmtK(dd.base)];
  for (const f of dd.factors) {
    out.push(Number(f.multiplier.toFixed(2)));
  }
  out.push(fmtK(dd.anchor[0]), fmtK(dd.anchor[1]));
  out.push(fmtK(dd.range[0]), fmtK(dd.range[1]));
  for (const a of dd.addOns) {
    if (a.amount === null) continue;
    if (Array.isArray(a.amount)) {
      if (a.key === 'dd.addon.taxDd') {
        // Rendered as the literal "€4,000–8,000" — only the first figure
        // carries a currency symbol, so only the first is extracted.
        out.push(a.amount[0]);
      } else {
        out.push(fmtK(a.amount[0]), fmtK(a.amount[1]));
      }
    } else {
      out.push(fmtK(a.amount));
    }
  }
  // The shim runs TP first, so by the time DD renders the TP quote is cached
  // and the bundle line is appended. Legacy caches tpQ even when out of scope.
  if (tp.quote) {
    out.push(fmtK(bundleTotal(tp.quote.total, dd.cachedTotal)));
  }
  return out;
}

/* ── the tests ───────────────────────────────────────────────────────── */

const CASE_COUNT = 2000;
const cases = Array.from({ length: CASE_COUNT }, (_, i) => makeCase(i + 1));

describe('TP engine parity with the legacy implementation', () => {
  it(`matches obligation figures across ${CASE_COUNT} generated cases`, () => {
    const mismatches: string[] = [];
    for (const [i, c] of cases.entries()) {
      const { ids, names } = toLegacy(c);
      const legacy = extractNumbers(stripLabelProse(runLegacy(ids, names).html.obligOut ?? ''));
      const ported = portedObligationNumbers(c);
      if (JSON.stringify(legacy) !== JSON.stringify(ported)) {
        mismatches.push(`case ${i + 1}: legacy ${JSON.stringify(legacy)} vs ported ${JSON.stringify(ported)}`);
      }
    }
    expect(mismatches.slice(0, 5)).toEqual([]);
  });

  it(`matches the itemized quote across ${CASE_COUNT} generated cases`, () => {
    const mismatches: string[] = [];
    for (const [i, c] of cases.entries()) {
      const { ids, names } = toLegacy(c);
      const legacy = extractNumbers(runLegacy(ids, names).html.tpQuoteOut ?? '');
      const ported = portedQuoteNumbers(c);
      if (JSON.stringify(legacy) !== JSON.stringify(ported)) {
        mismatches.push(`case ${i + 1}: legacy ${JSON.stringify(legacy)} vs ported ${JSON.stringify(ported)}`);
      }
    }
    expect(mismatches.slice(0, 5)).toEqual([]);
  });

  it(`matches the exposure range across ${CASE_COUNT} generated cases`, () => {
    const mismatches: string[] = [];
    for (const [i, c] of cases.entries()) {
      const { ids, names } = toLegacy(c);
      const legacy = extractNumbers(runLegacy(ids, names).text.expOut ?? '');
      const ported = portedExposureNumbers(c);
      if (JSON.stringify(legacy) !== JSON.stringify(ported)) {
        mismatches.push(`case ${i + 1}: legacy ${JSON.stringify(legacy)} vs ported ${JSON.stringify(ported)}`);
      }
    }
    expect(mismatches.slice(0, 5)).toEqual([]);
  });
});

describe('DD engine parity with the legacy implementation', () => {
  it(`matches the factor breakdown and fee across ${CASE_COUNT} generated cases`, () => {
    const mismatches: string[] = [];
    for (const [i, c] of cases.entries()) {
      const { ids, names } = toLegacy(c);
      const legacy = extractNumbers(stripLabelProse(runLegacy(ids, names).html.ddQuoteOut ?? ''));
      const ported = portedDdNumbers(c);
      if (JSON.stringify(legacy) !== JSON.stringify(ported)) {
        mismatches.push(`case ${i + 1}: legacy ${JSON.stringify(legacy)} vs ported ${JSON.stringify(ported)}`);
      }
    }
    expect(mismatches.slice(0, 5)).toEqual([]);
  });
});
