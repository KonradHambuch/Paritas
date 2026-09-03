/**
 * UTC-safe date helpers.
 *
 * WHY THIS FILE EXISTS — a real bug in the legacy engine.
 *
 * The original computed deadlines with local-time constructors and then
 * printed them with `.toISOString().slice(0,10)`:
 *
 *     new Date(fy.getFullYear() + 1, 4, 31).toISOString().slice(0, 10)
 *
 * In any UTC+ timezone that renders the PREVIOUS day. In Europe/Budapest
 * (UTC+2 in May) `new Date(2026, 4, 31)` is 2026-05-30T22:00:00Z, so the
 * Hungarian Local File deadline printed as "2026-05-30". The same off-by-one
 * hit every `eom()` result and the US 15 April date — verified locally:
 *
 *     HU Local File  legacy -> 2026-05-30  (should be 2026-05-31)
 *     PL Local File  legacy -> 2026-10-30  (should be 2026-10-31)
 *     US forms       legacy -> 2026-04-14  (should be 2026-04-15)
 *
 * Every visitor in the site's own target markets (PL/HU/CZ/RO are all UTC+1
 * or +2) saw every filing deadline one day early. Working in UTC throughout
 * fixes it. This is the ONLY deliberate numeric deviation from the legacy
 * engine, and it is asserted explicitly in tests/dates.test.ts rather than
 * being absorbed silently into a snapshot.
 */

/** Parse an ISO 'YYYY-MM-DD' as UTC midnight. */
export function parseIsoUtc(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`);
}

/** Format a Date back to ISO 'YYYY-MM-DD' using its UTC fields. */
export function toIsoUtc(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * End of the month `addMonths` after the month of `baseIso`.
 * eomUtc('2025-12-31', 10) === '2026-10-31'
 */
export function eomUtc(baseIso: string, addMonths: number): string {
  const b = parseIsoUtc(baseIso);
  return toIsoUtc(
    new Date(Date.UTC(b.getUTCFullYear(), b.getUTCMonth() + 1 + addMonths, 0)),
  );
}

/** A fixed month/day in the year after `baseIso`. `month` is 1-based. */
export function nextYearUtc(baseIso: string, month: number, day: number): string {
  const b = parseIsoUtc(baseIso);
  return toIsoUtc(new Date(Date.UTC(b.getUTCFullYear() + 1, month - 1, day)));
}

/** Whole days from `fromIso` to `toIso`; negative when `toIso` is past. */
export function daysBetweenUtc(fromIso: string, toIso: string): number {
  return Math.round(
    (parseIsoUtc(toIso).getTime() - parseIsoUtc(fromIso).getTime()) / 86_400_000,
  );
}

/** Matches the legacy colour thresholds: overdue < 0, soon < 60 days. */
export function deadlineStatus(days: number): 'overdue' | 'soon' | 'ok' {
  if (days < 0) return 'overdue';
  if (days < 60) return 'soon';
  return 'ok';
}
