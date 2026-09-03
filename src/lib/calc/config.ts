/**
 * CONFIG — every regulatory and pricing constant lives here and only here.
 *
 * Ported verbatim from the legacy inline script (paritas.html:831-837).
 * Values are unchanged; the parity tests in tests/ assert that.
 *
 * Thresholds are EUR approximations of local-currency statutory values
 * (PLN 2M / PLN 10M, HUF 150M, RO large-taxpayer bands).
 *
 * `lastVerified` is now the SINGLE source for the freshness claim. It used to
 * be repeated in three places (the constant, the hero note and the footer
 * disclaimer) and could drift; the prose sections now read it from here.
 */
export const CONFIG = {
  lastVerified: '2026-08',

  thresholds: {
    PL_serv: 464_000,
    PL_fin: 2_320_000,
    HU: 380_000,
    RO_serv: 250_000,
    RO_int: 200_000,
    RO_loanInterestProxy: 0.05,
    warn: 0.7,
  },

  exposure: {
    plAdjRate: 0.1 * 0.25,
    plFiscal: 8_000,
    huPerRecord: 12_500,
    roAdjRate: 0.08 * 0.25,
    czAudit: 5_000,
    czAuditMinFlows: 500_000,
    usFormPerYear: 11_500,
    noAgreement: 10_000,
  },

  tp: {
    lfBase: { PL: 5_500, HU: 5_000, RO: 5_000 },
    czDefense: 4_500,
    extraFlow: 1_800,
    benchFirst: 1_800,
    benchRepeat: 720,
    setup: 1_500,
    starter: 4_000,
    starterLight: 2_200,
    pack5471: 2_200,
    flipReady: 7_000,
    multiCountry: 0.92,
    roomDiscount: 0.9,
    tierReviewed: 1.0,
    anchorBand: [1.35, 1.75],
  },

  dd: {
    base: { rf: 5_500, a: 15_000, b: 32_000 },
    floor: { rf: 5_000, a: 12_000, b: 28_000 },
    entStep: 0.2,
    consol: 1.15,
    instrStep: 0.05,
    rush: 1.3,
    tpModule: 2_500,
    anchorBand: [1.5, 2.0],
    bundle: 0.85,
  },
} as const;

/** Beyond this per flow the self-serve engine is out of scope. */
export const FLOW_CAP = 250_000_000;

/** Above either of these the quote is replaced by "get a scoped proposal". */
export const OUT_OF_SCOPE = {
  absoluteFlows: 60_000_000,
  largeSizeFactor: 1.6,
  largeSizeFlows: 25_000_000,
} as const;

/**
 * Guard against shipping a stale claim of currency. The site tells visitors
 * its rulebook was verified in a specific month; if that is more than a year
 * old the site is misrepresenting itself, so fail the build instead.
 */
export function assertRulebookFresh(now: Date = new Date()): void {
  const [year, month] = CONFIG.lastVerified.split('-').map(Number);
  const ageMonths =
    (now.getUTCFullYear() - year) * 12 + (now.getUTCMonth() + 1 - month);
  if (ageMonths > 12) {
    throw new Error(
      `CONFIG.lastVerified is ${CONFIG.lastVerified} (${ageMonths} months old). ` +
        `Re-verify the thresholds in src/lib/calc/config.ts and update lastVerified, ` +
        `or the site is claiming a currency it does not have.`,
    );
  }
}
