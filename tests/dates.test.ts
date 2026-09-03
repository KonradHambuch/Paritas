import { describe, expect, it } from 'vitest';
import { daysBetweenUtc, deadlineStatus, eomUtc, nextYearUtc } from '../src/lib/calc/dates';
import { runTp } from '../src/lib/calc/tp';
import type { TpInput } from '../src/lib/calc/types';

/**
 * The ONE deliberate behavioural deviation from the legacy engine.
 *
 * Legacy built deadlines with local-time constructors and printed them with
 * `.toISOString()`, which renders the previous day in every UTC+ timezone —
 * i.e. in all four of the site's own target markets. These assertions pin the
 * corrected dates explicitly rather than letting the change hide in a
 * snapshot, and they are timezone-independent by construction.
 */
describe('UTC-safe deadline arithmetic', () => {
  it('computes end-of-month offsets without drifting a day', () => {
    expect(eomUtc('2025-12-31', 10)).toBe('2026-10-31'); // PL Local File
    expect(eomUtc('2025-12-31', 11)).toBe('2026-11-30'); // PL TPR filing
    expect(eomUtc('2026-03-31', 10)).toBe('2027-01-31');
    expect(eomUtc('2026-06-30', 11)).toBe('2027-05-31');
  });

  it('handles leap years', () => {
    expect(eomUtc('2027-12-31', 2)).toBe('2028-02-29');
  });

  it('computes fixed dates in the following year', () => {
    expect(nextYearUtc('2025-12-31', 5, 31)).toBe('2026-05-31'); // HU Local File
    expect(nextYearUtc('2025-12-31', 4, 15)).toBe('2026-04-15'); // US Forms
  });

  it('counts days between dates inclusively of direction', () => {
    expect(daysBetweenUtc('2026-09-01', '2026-10-31')).toBe(60);
    expect(daysBetweenUtc('2026-09-01', '2026-08-01')).toBe(-31);
    expect(daysBetweenUtc('2026-09-01', '2026-09-01')).toBe(0);
  });

  it('classifies deadlines on the legacy colour thresholds', () => {
    expect(deadlineStatus(-1)).toBe('overdue');
    expect(deadlineStatus(0)).toBe('soon');
    expect(deadlineStatus(59)).toBe('soon');
    expect(deadlineStatus(60)).toBe('ok');
  });
});

describe('TP deadlines end to end', () => {
  const base: TpInput = {
    parent: 'us',
    flipYears: 2,
    countries: { PL: true, HU: true, CZ: false, RO: true },
    flows: { dev: 600_000, mgmt: 0, loan: 0, ip: 0 },
    sizeFactor: 1,
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

  it('emits the correct dates for a 31 December year end', () => {
    const { deadlines } = runTp(base);
    expect(deadlines).toEqual([
      { key: 'pl.localFile', date: '2026-10-31', daysRemaining: 60, status: 'ok' },
      { key: 'pl.tpr', date: '2026-11-30', daysRemaining: 90, status: 'ok' },
      { key: 'hu.localFile', date: '2026-05-31', daysRemaining: -93, status: 'overdue' },
      { key: 'ro.onRequest', date: null, daysRemaining: null, status: 'onRequest' },
      { key: 'us.forms', date: '2026-04-15', daysRemaining: -139, status: 'overdue' },
    ]);
  });

  it('is unaffected by the machine timezone', () => {
    const original = process.env.TZ;
    const runs = ['UTC', 'Europe/Budapest', 'Pacific/Auckland', 'America/Los_Angeles'].map(
      (tz) => {
        process.env.TZ = tz;
        return JSON.stringify(runTp(base).deadlines);
      },
    );
    process.env.TZ = original;
    expect(new Set(runs).size).toBe(1);
  });
});
