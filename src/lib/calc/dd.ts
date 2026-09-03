import { CONFIG } from './config';
import type { DdAddOn, DdFactor, DdInput, DdResult } from './types';

/**
 * Due diligence engine — pure. Ported from the legacy inline handler
 * (paritas.html:962-1005). Multiplicative model, clamped to a per-scope floor.
 *
 * The factor list is ordered exactly as the legacy breakdown rendered it,
 * because the whole point of the panel is "no black box" — the reader should
 * be able to multiply the rows and land on the fee.
 */
export function runDd(input: DdInput): DdResult {
  const { scope } = input;
  const base = CONFIG.dd.base[scope];
  const floor = CONFIG.dd.floor[scope];

  const entities = Math.max(1, input.entities || 2);
  const layers = Math.max(0, input.instrumentLayers || 0);

  const entityFactor = 1 + CONFIG.dd.entStep * (entities - 1);
  const consolFactor = input.consolidation ? CONFIG.dd.consol : 1;
  const layerFactor = 1 + CONFIG.dd.instrStep * layers;
  const rushFactor = input.rush ? CONFIG.dd.rush : 1;

  const uncapped =
    base *
    entityFactor *
    input.revFactor *
    input.acctFactor *
    input.roomFactor *
    input.modelFactor *
    consolFactor *
    layerFactor *
    rushFactor;

  const fee = Math.max(uncapped, floor);

  const factors: DdFactor[] = [
    { key: 'dd.factor.entities', params: { count: entities }, multiplier: entityFactor },
    { key: 'dd.factor.revenue', multiplier: input.revFactor },
    { key: 'dd.factor.accounts', multiplier: input.acctFactor },
    { key: 'dd.factor.dataRoom', multiplier: input.roomFactor },
    { key: 'dd.factor.model', multiplier: input.modelFactor },
  ];
  if (input.consolidation) {
    factors.push({ key: 'dd.factor.consolidation', multiplier: CONFIG.dd.consol });
  }
  if (layers > 0) {
    factors.push({
      key: 'dd.factor.capTable',
      params: { count: layers },
      multiplier: layerFactor,
    });
  }
  if (input.rush) {
    factors.push({ key: 'dd.factor.rush', multiplier: CONFIG.dd.rush });
  }

  const addOns: DdAddOn[] = [];
  let fixedExtras = 0;

  if (input.addOns.tp) {
    fixedExtras += CONFIG.dd.tpModule;
    addOns.push({ key: 'dd.addon.tpModule', amount: CONFIG.dd.tpModule });
  }
  if (input.addOns.tax) {
    // Quoted per country by partner advisors — deliberately not a single number.
    addOns.push({ key: 'dd.addon.taxDd', amount: [4_000, 8_000] });
  }
  if (input.addOns.stamp) {
    // Legacy applied 40–70% to (fee + extras counted SO FAR), which at this
    // point is fee + tpModule only. Preserved exactly.
    addOns.push({
      key: 'dd.addon.recognizedFirm',
      amount: [(fee + fixedExtras) * 0.4, (fee + fixedExtras) * 0.7],
    });
  }

  const [anchorLow, anchorHigh] = CONFIG.dd.anchorBand;

  return {
    scope,
    base,
    factors,
    fee,
    flooredAt: uncapped < floor ? floor : null,
    range: [fee * 0.95, fee * 1.08],
    anchor: [fee * anchorLow, fee * anchorHigh],
    addOns,
    cachedTotal: fee + fixedExtras,
    independence: input.side,
  };
}

/** Cross-sell: both products together, −15%. */
export function bundleTotal(tp: number, dd: number): number {
  return (tp + dd) * CONFIG.dd.bundle;
}
