import { TP } from './config';

export interface TpInput {
  /** null = not answered yet. */
  related: boolean | null;
  /** Annual value of the transaction, HUF. */
  amount: number;
}

export interface TpResult {
  /** Documentation is required. */
  applies: boolean;
  amount: number;
  threshold: number;
  /** Distance from the threshold — above it when `applies`, below otherwise. */
  difference: number;
  penalty: number;
  penaltyRepeat: number;
  masterFileThreshold: number;
  simplifiedRechargeThreshold: number;
}

/**
 * Hungarian transfer pricing documentation obligation.
 *
 * Returns null when the inputs cannot produce an answer — unrelated parties
 * have no obligation to test, and a missing amount is not a zero amount.
 * The caller renders nothing rather than a misleading "no obligation".
 */
export function runTp(input: TpInput): TpResult | null {
  if (input.related !== true) return null;
  if (!Number.isFinite(input.amount) || input.amount <= 0) return null;

  const applies = input.amount >= TP.threshold;

  return {
    applies,
    amount: input.amount,
    threshold: TP.threshold,
    difference: Math.abs(input.amount - TP.threshold),
    penalty: TP.penalty,
    penaltyRepeat: TP.penaltyRepeat,
    masterFileThreshold: TP.masterFile,
    simplifiedRechargeThreshold: TP.simplifiedRecharge,
  };
}
