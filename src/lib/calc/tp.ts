import { CONFIG, OUT_OF_SCOPE } from './config';
import { daysBetweenUtc, deadlineStatus, eomUtc, nextYearUtc } from './dates';
import type {
  Country,
  Deadline,
  Msg,
  Obligation,
  QuoteItem,
  RecommendationKey,
  Severity,
  TpInput,
  TpResult,
} from './types';

const THR = CONFIG.thresholds;

/**
 * Transfer pricing engine — pure. No DOM, no Date.now(), no locale, no
 * formatting. Ported from the legacy inline handler (paritas.html:847-959)
 * with the arithmetic preserved exactly; the only intentional behavioural
 * change is UTC-correct deadline dates (see ./dates.ts).
 *
 * Obligation and quote-item ORDER is part of the contract — the parity tests
 * compare sequences, and the rendered panel reads top-to-bottom.
 */
export function runTp(input: TpInput): TpResult {
  const { parent, countries: cs, flows, have } = input;

  const usParent = parent === 'us';
  const flipPlanned = parent === 'planned';
  const flipYears = usParent ? Math.max(0, input.flipYears || 0) : 0;

  const totalFlows = flows.dev + flows.mgmt + flows.loan + flows.ip;
  const sizeF = input.sizeFactor || 1;

  const outOfScope =
    totalFlows > OUT_OF_SCOPE.absoluteFlows ||
    (sizeF >= OUT_OF_SCOPE.largeSizeFactor && totalFlows > OUT_OF_SCOPE.largeSizeFlows);

  const obligations: Obligation[] = [];
  const lf: Record<'PL' | 'HU' | 'RO', number> = { PL: 0, HU: 0, RO: 0 };
  let benchNeeded = 0;
  let czDefense = false;

  const add = (
    category: Obligation['category'],
    severity: Severity,
    textKey: string,
    tagKey: string,
    params?: Record<string, string | number>,
  ) => {
    obligations.push({
      category,
      severity,
      tag: { key: tagKey },
      text: { key: textKey, params },
    });
  };

  /** One threshold test for one flow in one country. */
  const test = (
    country: Country,
    flow: string,
    value: number,
    threshold: number,
    indicative = false,
  ) => {
    if (value <= 0) return;
    const ratio = value / threshold;
    const pct = Math.round(ratio * 100);

    if (ratio >= 1) {
      add(
        'tp',
        'red',
        indicative ? 'oblig.overThresholdIndicative' : 'oblig.overThreshold',
        indicative ? 'tag.roFileMandatory' : 'tag.localFileMandatory',
        { country, flow, value, pct },
      );
      if (country !== 'CZ') lf[country as 'PL' | 'HU' | 'RO']++;
      benchNeeded++;
    } else if (ratio >= THR.warn) {
      add('tp', 'amber', 'oblig.approaching', 'tag.planDocumentation', {
        country,
        flow,
        pct,
      });
    } else {
      add('tp', 'ok', 'oblig.underThreshold', 'tag.armsLengthStillApplies', {
        country,
        flow,
        pct,
      });
    }
  };

  if (cs.PL) {
    test('PL', 'dev', flows.dev, THR.PL_serv);
    test('PL', 'mgmt', flows.mgmt, THR.PL_serv);
    test('PL', 'loan', flows.loan, THR.PL_fin);
    test('PL', 'ip', flows.ip, THR.PL_serv);
  }

  if (cs.HU) {
    test('HU', 'dev', flows.dev, THR.HU);
    test('HU', 'mgmt', flows.mgmt, THR.HU);
    test('HU', 'loan', flows.loan, THR.HU);
    test('HU', 'ip', flows.ip, THR.HU);
  }

  if (cs.RO) {
    add('tp', 'amber', 'oblig.roFramework2026', 'tag.manualVerification');
    test('RO', 'dev', flows.dev, THR.RO_serv, true);
    test('RO', 'mgmt', flows.mgmt, THR.RO_serv, true);
    test('RO', 'loan', flows.loan * THR.RO_loanInterestProxy, THR.RO_int, true);
    test('RO', 'ip', flows.ip, THR.RO_serv, true);
  }

  if (cs.CZ && totalFlows > 0) {
    czDefense = true;
    add('tp', 'amber', 'oblig.czBurdenOfProof', 'tag.defenseFileRecommended');
  }

  if (usParent && !have.forms5471) {
    add('usFiling', 'red', 'oblig.usFormsUnfiled', 'tag.irsPenaltyPerFormYear', {
      years: flipYears,
    });
  }

  if (flipPlanned) {
    add('usFiling', 'amber', 'oblig.usFormsAfterFlip', 'tag.planWithFlip');
  }

  if (totalFlows > 0 && !have.agreement) {
    add('governance', 'red', 'oblig.noAgreement', 'tag.fixFirst');
  }

  if (sizeF >= 1.35 && benchNeeded > 0) {
    add('tp', 'amber', 'oblig.masterFileTrigger', 'tag.verifyOnCall');
  }

  if (obligations.length === 0) {
    add('tp', 'ok', 'oblig.noFlows', 'tag.setUpBeforeFlow');
  }

  /* ───────────── exposure ───────────── */
  let exposureTotal = 0;
  const parts: Msg[] = [];

  if (lf.PL > 0 && !have.localFile && cs.PL) {
    const over =
      (flows.dev >= THR.PL_serv ? flows.dev : 0) +
      (flows.mgmt >= THR.PL_serv ? flows.mgmt : 0) +
      (flows.ip >= THR.PL_serv ? flows.ip : 0) +
      (flows.loan >= THR.PL_fin ? flows.loan : 0);
    const adj = over * CONFIG.exposure.plAdjRate;
    exposureTotal += adj;
    parts.push({ key: 'exp.plAdjustment', params: { amount: adj } });
    exposureTotal += CONFIG.exposure.plFiscal;
    parts.push({ key: 'exp.plFiscal', params: { amount: CONFIG.exposure.plFiscal } });
  }

  if (lf.HU > 0 && !have.localFile && cs.HU) {
    const penalty = lf.HU * CONFIG.exposure.huPerRecord;
    exposureTotal += penalty;
    parts.push({ key: 'exp.huPenalty', params: { count: lf.HU, amount: penalty } });
  }

  if (lf.RO > 0 && !have.localFile && cs.RO) {
    const adj = (flows.dev + flows.mgmt + flows.ip) * CONFIG.exposure.roAdjRate;
    exposureTotal += adj;
    parts.push({ key: 'exp.roAssessment', params: { amount: adj } });
  }

  if (czDefense && !have.localFile && totalFlows > CONFIG.exposure.czAuditMinFlows) {
    exposureTotal += CONFIG.exposure.czAudit;
    parts.push({ key: 'exp.czAudit', params: { amount: CONFIG.exposure.czAudit } });
  }

  if (usParent && !have.forms5471 && flipYears > 0) {
    const penalty = flipYears * CONFIG.exposure.usFormPerYear;
    exposureTotal += penalty;
    parts.push({ key: 'exp.usForms', params: { amount: penalty } });
  }

  if (totalFlows > 0 && !have.agreement) {
    exposureTotal += CONFIG.exposure.noAgreement;
    parts.push({
      key: 'exp.noAgreement',
      params: { amount: CONFIG.exposure.noAgreement },
    });
  }

  /* ───────────── quote ───────────── */
  const items: QuoteItem[] = [];
  let subtotal = 0;
  let first = true;

  (['PL', 'HU', 'RO'] as const).forEach((c) => {
    if (lf[c] > 0 && cs[c]) {
      let price =
        CONFIG.tp.lfBase[c] * sizeF + Math.max(0, lf[c] - 1) * CONFIG.tp.extraFlow;
      if (!first) price *= CONFIG.tp.multiCountry;
      first = false;
      subtotal += price;
      items.push({
        key: 'quote.localFile',
        params: { country: c, count: lf[c] },
        amount: price,
      });
    }
  });

  if (czDefense && !have.localFile) {
    let price = CONFIG.tp.czDefense * sizeF;
    if (!first) price *= CONFIG.tp.multiCountry;
    first = false;
    subtotal += price;
    items.push({ key: 'quote.czDefense', amount: price });
  }

  const benchExemptOnly =
    input.smallPl && lf.PL > 0 && lf.HU === 0 && lf.RO === 0 && !czDefense;

  if ((benchNeeded > 0 || czDefense) && !have.benchmark && !benchExemptOnly) {
    const n = Math.max(1, benchNeeded);
    const bench = CONFIG.tp.benchFirst + Math.max(0, n - 1) * CONFIG.tp.benchRepeat;
    subtotal += bench;
    items.push({ key: 'quote.benchmark', params: { count: n }, amount: bench });
  }

  if (benchExemptOnly) {
    add('tp', 'ok', 'oblig.plSmallExempt', 'tag.youSaveTheBenchmark');
    items.push({ key: 'quote.benchmarkNotRequired', amount: 0 });
  }

  if ((benchNeeded > 0 || czDefense) && !have.agreement && !have.localFile) {
    subtotal += CONFIG.tp.setup;
    items.push({ key: 'quote.firstYearSetup', amount: CONFIG.tp.setup });
  }

  if (benchNeeded === 0 && !czDefense && totalFlows > 0) {
    const starter = have.agreement ? CONFIG.tp.starterLight : CONFIG.tp.starter;
    subtotal += starter;
    items.push({
      key: have.agreement ? 'quote.starterLight' : 'quote.starter',
      amount: starter,
    });
  }

  if ((usParent || flipPlanned) && !have.forms5471) {
    subtotal += CONFIG.tp.pack5471;
    items.push({ key: 'quote.pack5471', amount: CONFIG.tp.pack5471 });
  }

  if (flipPlanned) {
    subtotal += CONFIG.tp.flipReady;
    items.push({ key: 'quote.flipReady', amount: CONFIG.tp.flipReady });
  }

  const modifier =
    (have.dataRoom ? CONFIG.tp.roomDiscount : 1) * input.urgency * CONFIG.tp.tierReviewed;
  const total = subtotal * modifier;
  const [anchorLow, anchorHigh] = CONFIG.tp.anchorBand;

  /* ───────────── deadlines ───────────── */
  const fy = input.fiscalYearEnd || '2025-12-31';
  const raw: Array<{ key: Deadline['key']; date: string | null }> = [];

  if (cs.PL && lf.PL > 0) {
    raw.push({ key: 'pl.localFile', date: eomUtc(fy, 10) });
    raw.push({ key: 'pl.tpr', date: eomUtc(fy, 11) });
  }
  if (cs.HU && lf.HU > 0) {
    raw.push({ key: 'hu.localFile', date: nextYearUtc(fy, 5, 31) });
  }
  if (cs.RO && lf.RO > 0) {
    raw.push({ key: 'ro.onRequest', date: null });
  }
  if ((usParent || flipPlanned) && !have.forms5471) {
    raw.push({ key: 'us.forms', date: nextYearUtc(fy, 4, 15) });
  }

  const deadlines: Deadline[] = raw.map(({ key, date }) => {
    if (date === null) {
      return { key, date: null, daysRemaining: null, status: 'onRequest' as const };
    }
    const daysRemaining = daysBetweenUtc(input.today, date);
    return { key, date, daysRemaining, status: deadlineStatus(daysRemaining) };
  });

  /* ───────────── recommendation ───────────── */
  let recommendation: RecommendationKey;
  if (flipPlanned) recommendation = 'flipPlanned';
  else if (benchNeeded > 0) recommendation = 'localFile';
  else if (czDefense) recommendation = 'czDefense';
  else if (totalFlows > 0) recommendation = 'starter';
  else recommendation = 'preSetup';

  /* ───────────── benchmarking methods ───────────── */
  const methods: TpResult['methods'] = [];
  const pushMethod = (
    value: number,
    flow: 'dev' | 'mgmt' | 'loan' | 'ip',
  ) => {
    if (value > 0) {
      methods.push({
        flow,
        methodKey: `method.${flow}.method`,
        partyKey: `method.${flow}.party`,
        pliKey: `method.${flow}.pli`,
      });
    }
  };
  pushMethod(flows.dev, 'dev');
  pushMethod(flows.mgmt, 'mgmt');
  pushMethod(flows.loan, 'loan');
  pushMethod(flows.ip, 'ip');

  return {
    obligations,
    deadlines,
    exposure: {
      total: exposureTotal,
      low: exposureTotal * 0.8,
      high: exposureTotal * 1.2,
      parts,
    },
    quote: items.length
      ? {
          items,
          subtotal,
          modifier,
          total,
          range: [total * 0.95, total * 1.08],
          anchor: [total * anchorLow, total * anchorHigh],
        }
      : null,
    outOfScope,
    recommendation,
    methods,
    meta: { lastVerified: CONFIG.lastVerified },
  };
}
