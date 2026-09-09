/**
 * Every regulatory and market constant the four calculators use lives here and
 * only here, so the prose on the page can read the same numbers the engines
 * use and the two cannot drift apart.
 *
 * `assertRulebookFresh()` fails the build once `lastVerified` is more than a
 * year old — a site that publishes thresholds, penalties and tax rates should
 * not quietly go stale.
 */

/* ── transfer pricing ─────────────────────────────────────────── */
export const TP = {
  /** Documentation threshold per AGGREGATED transaction, per tax year (HUF). */
  threshold: 150_000_000,
  /** Master file trigger on the total of all related-party transactions. */
  masterFile: 500_000_000,
  /** Default penalty per transaction and per document (HUF). */
  penalty: 5_000_000,
  /** Penalty for a repeated default (HUF). */
  penaltyRepeat: 10_000_000,
  /** Rows the visitor may add before the form stops being a form. */
  maxRows: 8,
} as const;

export const TP_TYPE_KEYS = [
  'loan',
  'management',
  'products',
  'otherService',
  'royalty',
  'costRecharge',
  'intangibles',
] as const;
export type TpTypeKey = (typeof TP_TYPE_KEYS)[number];

/* ── valuation ────────────────────────────────────────────────── */
/**
 * The sector decides the METHOD, not just the multiple. A SaaS business is
 * priced on recurring revenue because its profit is still being reinvested;
 * an asset-heavy company is priced off the balance sheet. Applying an EBITDA
 * multiple to either would produce a confident, wrong number.
 */
export type ValuationMethod = 'ebitda' | 'revenue' | 'asset';

export const SECTORS = {
  svc: { method: 'ebitda', range: [4.0, 6.0] },
  prod: { method: 'ebitda', range: [4.5, 6.5] },
  trade: { method: 'ebitda', range: [3.0, 4.5] },
  it: { method: 'ebitda', range: [5.5, 8.5] },
  saas: { method: 'revenue', range: [1.8, 3.5] },
  constr: { method: 'ebitda', range: [3.0, 4.5] },
  health: { method: 'ebitda', range: [5.0, 7.0] },
  realest: { method: 'asset', range: [0.85, 1.0] },
  holding: { method: 'asset', range: [0.8, 0.95] },
  other: { method: 'ebitda', range: [3.5, 5.5] },
} as const satisfies Record<
  string,
  { method: ValuationMethod; range: readonly [number, number] }
>;

export type SectorKey = keyof typeof SECTORS;
export const SECTOR_KEYS = Object.keys(SECTORS) as SectorKey[];

/* ── diligence readiness ──────────────────────────────────────── */
/**
 * Weights are not uniform: owner dependence and unprovable profit move a
 * price far more than an out-of-date lien register, and the scoring says so.
 * Gaps are reported heaviest-first so the reader starts where it pays.
 */
export const READINESS_WEIGHTS = {
  accountsReal: 14,
  ownerIndependence: 14,
  concentration: 12,
  customerContracts: 12,
  assetsOwned: 12,
  employmentContracts: 10,
  relatedParty: 10,
  loans: 6,
  ownership: 6,
  disputes: 4,
} as const;

export type ReadinessKey = keyof typeof READINESS_WEIGHTS;
export const READINESS_KEYS = Object.keys(READINESS_WEIGHTS) as ReadinessKey[];

/** Checked from the top down. */
export const READINESS_BANDS = { ready: 90, mostly: 70, gaps: 45 } as const;

/* ── tax recovery ─────────────────────────────────────────────── */
export const TAX = {
  /** Hungarian local business tax (iparűzési adó). */
  hipaRate: 0.02,
  /** Innovation contribution, payable by large companies on the same base. */
  innovationRate: 0.003,
  /** Self-revision reaches back this many years. */
  years: 5,
  /** Deductible items cannot plausibly exceed this share of revenue. */
  poolCapOfRevenue: 0.85,
  /** Share of the pool that typically survives the documentation test. */
  recoveryLow: 0.3,
  recoveryHigh: 0.65,
} as const;

export type CompanySize = 'sme' | 'large';

/* ── freshness ────────────────────────────────────────────────── */
export const RULEBOOK = { lastVerified: '2026-09' } as const;

export function assertRulebookFresh(now: Date = new Date()): void {
  const [year, month] = RULEBOOK.lastVerified.split('-').map(Number);
  const ageMonths =
    (now.getUTCFullYear() - year!) * 12 + (now.getUTCMonth() + 1 - month!);
  if (ageMonths > 12) {
    throw new Error(
      `RULEBOOK.lastVerified is ${RULEBOOK.lastVerified} (${ageMonths} months old). ` +
        `Re-check the Hungarian thresholds, penalties and tax rates in ` +
        `src/lib/tools/config.ts.`,
    );
  }
}
