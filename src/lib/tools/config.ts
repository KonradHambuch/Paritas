/**
 * Every regulatory and market constant used by the three calculators lives
 * here and only here, so the prose on the page can read the same numbers the
 * engines use and the two cannot drift apart.
 *
 * lastVerified is the date the Hungarian rules below were last checked.
 * `assertRulebookFresh()` fails the build once it is more than a year old —
 * a site that publishes a threshold and a penalty should not quietly go stale.
 */
export const TP = {
  /** Documentation threshold per aggregated transaction, per tax year (HUF). */
  threshold: 150_000_000,
  /** Above this total of related-party transactions a master file is due. */
  masterFile: 500_000_000,
  /** Cost recharges above this may use a simplified local file. */
  simplifiedRecharge: 500_000_000,
  /** Default penalty per transaction and per document (HUF). */
  penalty: 5_000_000,
  /** Penalty for a repeated default (HUF). */
  penaltyRepeat: 10_000_000,
} as const;

/** Indicative EBITDA multiple bands for Hungarian mid-market transactions. */
export const SECTOR_MULTIPLES = {
  svc: [4.0, 6.0],
  prod: [4.5, 6.5],
  trade: [3.0, 4.5],
  it: [5.5, 8.5],
  constr: [3.0, 4.5],
  health: [5.0, 7.0],
  other: [3.5, 5.5],
} as const satisfies Record<string, readonly [number, number]>;

export type SectorKey = keyof typeof SECTOR_MULTIPLES;
export const SECTOR_KEYS = Object.keys(SECTOR_MULTIPLES) as SectorKey[];

/**
 * Diligence readiness questions, with the weight each carries out of 100.
 * Weights are not uniform: an unassigned IP chain kills more deals than an
 * unfinished loan register, and the scoring should say so.
 */
export const READINESS_WEIGHTS = {
  accounts: 12,
  capTable: 10,
  contracts: 10,
  ip: 14,
  customerContracts: 12,
  concentration: 8,
  relatedParty: 12,
  loans: 8,
  disputes: 8,
  ownerIndependence: 6,
} as const;

export type ReadinessKey = keyof typeof READINESS_WEIGHTS;
export const READINESS_KEYS = Object.keys(READINESS_WEIGHTS) as ReadinessKey[];

/** Score bands, checked from the top down. */
export const READINESS_BANDS = { ready: 90, mostly: 70, gaps: 45 } as const;

export const RULEBOOK = { lastVerified: '2026-09' } as const;

export function assertRulebookFresh(now: Date = new Date()): void {
  const [year, month] = RULEBOOK.lastVerified.split('-').map(Number);
  const ageMonths =
    (now.getUTCFullYear() - year!) * 12 + (now.getUTCMonth() + 1 - month!);
  if (ageMonths > 12) {
    throw new Error(
      `RULEBOOK.lastVerified is ${RULEBOOK.lastVerified} (${ageMonths} months old). ` +
        `Re-check the Hungarian thresholds and penalties in src/lib/tools/config.ts.`,
    );
  }
}
