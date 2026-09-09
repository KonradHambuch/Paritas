import { SECTORS, type SectorKey, type ValuationMethod } from './config';

export interface ValuationInput {
  sector: SectorKey | null;
  /** EBITDA, recurring revenue or asset value, depending on the method. */
  base: number;
  /** Borrowings minus cash, HUF. May be negative (net cash). */
  netDebt: number;
}

export interface ValuationResult {
  sector: SectorKey;
  method: ValuationMethod;
  multiple: readonly [number, number];
  enterprise: [number, number];
  equity: [number, number];
  /** Net debt exceeds the low end, so the low equity value is below zero. */
  equityNegativeAtLowEnd: boolean;
}

/**
 * Indicative valuation.
 *
 * The sector chooses the method before it chooses the multiple — see the note
 * in ./config.ts. Returns null without a sector or a positive base: a multiple
 * applied to a loss is a negative number pretending to be a valuation.
 */
export function runValuation(input: ValuationInput): ValuationResult | null {
  if (!input.sector) return null;
  if (!Number.isFinite(input.base) || input.base <= 0) return null;

  const { method, range } = SECTORS[input.sector];
  const netDebt = Number.isFinite(input.netDebt) ? input.netDebt : 0;

  const enterprise: [number, number] = [input.base * range[0], input.base * range[1]];
  const equity: [number, number] = [enterprise[0] - netDebt, enterprise[1] - netDebt];

  return {
    sector: input.sector,
    method,
    multiple: range,
    enterprise,
    equity,
    equityNegativeAtLowEnd: equity[0] < 0,
  };
}
