export type Country = 'PL' | 'HU' | 'CZ' | 'RO';
export type ParentKind = 'us' | 'foreign' | 'cee' | 'planned';
export type FlowKind = 'dev' | 'mgmt' | 'loan' | 'ip';
export type Severity = 'red' | 'amber' | 'ok';
export type ObligationCategory = 'tp' | 'usFiling' | 'governance';

/**
 * A locale-free message descriptor.
 *
 * The engines never see a message bundle and never format a number — they
 * emit keys plus raw params, and the renderer resolves them against the
 * active dictionary. That keeps the maths testable in one language, lets the
 * same result be re-rendered in another, and means adding a third locale
 * never touches src/lib/calc.
 */
export interface Msg {
  key: string;
  params?: Record<string, string | number>;
}

/* ───────────────────────────── TP ───────────────────────────── */

export interface TpInput {
  parent: ParentKind;
  /** 0–10; only meaningful when parent === 'us'. */
  flipYears: number;
  countries: Record<Country, boolean>;
  /** EUR per year, clamped to [0, FLOW_CAP] by the reader. */
  flows: Record<FlowKind, number>;
  sizeFactor: number;
  /** Polish micro/small enterprise — exempt from the compulsory benchmark. */
  smallPl: boolean;
  have: {
    agreement: boolean;
    benchmark: boolean;
    localFile: boolean;
    forms5471: boolean;
    dataRoom: boolean;
  };
  /** 'YYYY-MM-DD' */
  fiscalYearEnd: string;
  urgency: number;
  /** 'YYYY-MM-DD' — injected so deadline output is deterministic in tests. */
  today: string;
}

export interface Obligation {
  category: ObligationCategory;
  severity: Severity;
  tag: Msg;
  text: Msg;
}

export type DeadlineKey =
  | 'pl.localFile'
  | 'pl.tpr'
  | 'hu.localFile'
  | 'ro.onRequest'
  | 'us.forms';

export interface Deadline {
  key: DeadlineKey;
  /** ISO 'YYYY-MM-DD', or null when the duty is "on request". */
  date: string | null;
  daysRemaining: number | null;
  status: 'overdue' | 'soon' | 'ok' | 'onRequest';
}

export interface QuoteItem {
  key: string;
  params?: Record<string, string | number>;
  amount: number;
}

export interface MethodRow {
  flow: FlowKind;
  methodKey: string;
  partyKey: string;
  pliKey: string;
}

export type RecommendationKey =
  | 'flipPlanned'
  | 'localFile'
  | 'czDefense'
  | 'starter'
  | 'preSetup';

export interface TpResult {
  obligations: Obligation[];
  deadlines: Deadline[];
  exposure: {
    total: number;
    low: number;
    high: number;
    parts: Msg[];
  };
  quote: {
    items: QuoteItem[];
    /** Pre-modifier sum. */
    subtotal: number;
    /** roomDiscount × urgency × tierReviewed. */
    modifier: number;
    /** subtotal × modifier. */
    total: number;
    range: [number, number];
    anchor: [number, number];
  } | null;
  outOfScope: boolean;
  recommendation: RecommendationKey;
  methods: MethodRow[];
  meta: { lastVerified: string };
}

/* ───────────────────────────── DD ───────────────────────────── */

export type DdScope = 'rf' | 'a' | 'b';
export type DdSide = 'buy' | 'sell';

export interface DdInput {
  side: DdSide;
  scope: DdScope;
  /** 1–8 */
  entities: number;
  revFactor: number;
  acctFactor: number;
  roomFactor: number;
  modelFactor: number;
  consolidation: boolean;
  rush: boolean;
  /** 0–6 */
  instrumentLayers: number;
  addOns: { tp: boolean; tax: boolean; stamp: boolean };
}

export interface DdFactor {
  key: string;
  params?: Record<string, string | number>;
  multiplier: number;
}

export interface DdAddOn {
  key: string;
  /** A fixed amount, a quoted range, or null when priced per country. */
  amount: number | [number, number] | null;
}

export interface DdResult {
  scope: DdScope;
  base: number;
  factors: DdFactor[];
  fee: number;
  /** Non-null when the floor clamp actually bound. */
  flooredAt: number | null;
  range: [number, number];
  anchor: [number, number];
  addOns: DdAddOn[];
  /** fee + fixed add-ons — what the cross-sell bundle line uses. */
  cachedTotal: number;
  independence: DdSide;
}
