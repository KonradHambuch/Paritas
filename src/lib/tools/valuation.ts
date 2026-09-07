import { SECTOR_MULTIPLES, type SectorKey } from './config';

export interface ValuationInput {
  sector: SectorKey | null;
  /** Annual EBITDA, HUF. */
  ebitda: number;
  /** Borrowings minus cash, HUF. May be negative (net cash). */
  netDebt: number;
}

export interface ValuationResult {
  sector: SectorKey;
  multiple: readonly [number, number];
  /** Enterprise value range. */
  enterprise: [number, number];
  /** Equity value range — enterprise value less net debt. */
  equity: [number, number];
  /** True when net debt exceeds the low end, so the low equity value is < 0. */
  equityNegativeAtLowEnd: boolean;
}

/**
 * Indicative valuation from an EBITDA multiple.
 *
 * Returns null without a sector or a positive EBITDA: a multiple applied to a
 * loss is not a valuation, it is a negative number pretending to be one.
 */
export function runValuation(input: ValuationInput): ValuationResult | null {
  if (!input.sector) return null;
  if (!Number.isFinite(input.ebitda) || input.ebitda <= 0) return null;

  const multiple = SECTOR_MULTIPLES[input.sector];
  const netDebt = Number.isFinite(input.netDebt) ? input.netDebt : 0;

  const enterprise: [number, number] = [
    input.ebitda * multiple[0],
    input.ebitda * multiple[1],
  ];
  const equity: [number, number] = [enterprise[0] - netDebt, enterprise[1] - netDebt];

  return {
    sector: input.sector,
    multiple,
    enterprise,
    equity,
    equityNegativeAtLowEnd: equity[0] < 0,
  };
}
