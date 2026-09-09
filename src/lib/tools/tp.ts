import { TP, type TpTypeKey } from './config';

export interface TpRow {
  type: TpTypeKey;
  /** Annual value in HUF. Zero or blank rows are ignored. */
  value: number;
}

export interface TpAggregate {
  type: TpTypeKey;
  total: number;
  /** Documentation is required for this aggregated transaction. */
  required: boolean;
}

export interface TpResult {
  /** One entry per transaction TYPE, in the order the types were first used. */
  aggregates: TpAggregate[];
  /** Sum across every type. */
  total: number;
  /** At least one aggregated transaction is over the threshold. */
  anyRequired: boolean;
  /** The total triggers a master file. */
  masterFileRequired: boolean;
  threshold: number;
  masterFileThreshold: number;
  penalty: number;
  penaltyRepeat: number;
}

/**
 * Hungarian transfer pricing documentation obligation.
 *
 * The threshold applies per AGGREGATED transaction, so two loans of 80m each
 * are one 160m transaction and cross the line, even though neither does on its
 * own. Adding rows up per type is the whole point of the tool — it is the
 * mistake the reference page exists to prevent.
 *
 * Returns null when nothing has been entered yet: no rows is not the same
 * answer as no obligation.
 */
export function runTp(rows: TpRow[]): TpResult | null {
  const totals = new Map<TpTypeKey, number>();
  let total = 0;

  for (const row of rows) {
    if (!Number.isFinite(row.value) || row.value <= 0) continue;
    totals.set(row.type, (totals.get(row.type) ?? 0) + row.value);
    total += row.value;
  }

  if (totals.size === 0) return null;

  const aggregates: TpAggregate[] = [...totals].map(([type, sum]) => ({
    type,
    total: sum,
    required: sum >= TP.threshold,
  }));

  return {
    aggregates,
    total,
    anyRequired: aggregates.some((a) => a.required),
    masterFileRequired: total >= TP.masterFile,
    threshold: TP.threshold,
    masterFileThreshold: TP.masterFile,
    penalty: TP.penalty,
    penaltyRepeat: TP.penaltyRepeat,
  };
}
