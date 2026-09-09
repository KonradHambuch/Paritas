import { TAX, type CompanySize } from './config';

export interface TaxInput {
  /** Annual net revenue, HUF. */
  revenue: number;
  size: CompanySize;
  /** Subcontractor and recharged cost, HUF. */
  subcontracted: number;
  /** R&D-type spend, HUF. */
  rd: number;
}

export interface TaxResult {
  /** Deductible pool available per year, capped against revenue. */
  pool: number;
  /** True when the cap bound — the inputs claimed more than is plausible. */
  poolCapped: boolean;
  /** Combined rate applied: local business tax, plus innovation for large. */
  rate: number;
  includesInnovation: boolean;
  hipaRate: number;
  innovationRate: number;
  /** Annual saving range. */
  annual: [number, number];
  /** Five-year total range. */
  total: [number, number];
  years: number;
}

/**
 * Estimated overpaid Hungarian local business tax, recoverable by
 * self-revision.
 *
 * The range is the honest part: the deductions exist, but each one carries a
 * documentation condition — a written contract with both parties, the recharge
 * named on the invoice — and in practice only part of the pool survives that
 * test. Quoting a single number here would promise a certainty the method
 * does not have.
 *
 * Returns null without revenue, or without at least one deductible-type cost.
 */
export function runTaxRecovery(input: TaxInput): TaxResult | null {
  const revenue = Number.isFinite(input.revenue) ? Math.max(0, input.revenue) : 0;
  const sub = Number.isFinite(input.subcontracted) ? Math.max(0, input.subcontracted) : 0;
  const rd = Number.isFinite(input.rd) ? Math.max(0, input.rd) : 0;

  if (revenue <= 0) return null;
  if (sub <= 0 && rd <= 0) return null;

  const claimed = sub + rd;
  const cap = revenue * TAX.poolCapOfRevenue;
  const pool = Math.min(claimed, cap);

  const includesInnovation = input.size === 'large';
  const rate = TAX.hipaRate + (includesInnovation ? TAX.innovationRate : 0);

  const annual: [number, number] = [
    pool * rate * TAX.recoveryLow,
    pool * rate * TAX.recoveryHigh,
  ];

  return {
    pool,
    poolCapped: claimed > cap,
    rate,
    includesInnovation,
    hipaRate: TAX.hipaRate,
    innovationRate: TAX.innovationRate,
    annual,
    total: [annual[0] * TAX.years, annual[1] * TAX.years],
    years: TAX.years,
  };
}
