export const tpCalc = {
  tag: 'Calculator 1 · Transfer pricing',
  heading: 'Your TP obligations, exposure and price — right now.',
  lede: 'Answer honestly; nothing is stored until you ask for the report. Outputs are informational scoping estimates based on published thresholds — not tax advice; final quotes are fixed after a 20-minute call.',

  step1: "1 · Your group's parent company",
  parent: {
    us: 'US (Delaware flip)',
    foreign: 'Other foreign',
    cee: 'CEE / domestic',
    planned: 'US flip planned',
  },
  flipYears: 'Years since the US parent was created',

  step2: '2 · Countries where group entities operate',
  countries: { PL: 'Poland', HU: 'Hungary', CZ: 'Czechia', RO: 'Romania' },

  step3: '3 · Intercompany flows — annual value, EUR',
  flows: {
    dev: 'Development / R&D services',
    mgmt: 'Management / admin services',
    loan: 'Intercompany loans (principal)',
    ip: 'IP royalty / license',
  },
  flowsHint:
    'Thresholds test per flow, per country — and in Poland separately on the buy and sell side, so enter each direction as its own figure if you both provide and receive the same service type. Romanian loan testing uses estimated annual interest (~5% of principal).',

  step4: '4 · Largest CEE entity — annual revenue',
  revenue: { a: '< €2M', b: '€2–10M', c: '€10–25M', d: '> €25M' },

  step5: '5 · Entity size (Poland — affects whether a benchmark is compulsory)',
  smallCo: { yes: 'Under 50 staff and under €10M turnover', no: 'Larger, or not sure' },
  smallCoHint:
    "Polish micro and small enterprises are exempt from the compulsory comparability analysis — the Local File is still required, but the benchmark isn't. If that's you, we say so and the price drops.",

  step6: '6 · What already exists on paper?',
  have: {
    agreement: 'Signed intercompany agreement',
    benchmark: 'Benchmark study',
    localFile: 'Local File (current)',
    forms5471: 'US Forms 5471/5472 filed',
    dataRoom: 'Organized data room',
  },

  step7: '7 · Timing',
  fyEnd: 'Fiscal year end (the year you need documented)',
  urgency: { rush: 'Deadline / raise < 6 weeks', quarter: 'This quarter', none: 'No rush' },

  run: 'Compute TP obligations & quote →',

  results: {
    obligationsTitle: 'Indicative obligations — labeled by category',
    obligationsEmpty:
      'Run the calculator to see what the published rules indicate per country — TP documentation, US filing duties and governance gaps, each labeled.',
    deadlinesTitle: 'Your deadlines',
    deadlinesEmpty: 'Deadlines compute from your fiscal year end.',
    deadlinesNone:
      "No filing deadlines triggered by these inputs — arm's-length pricing still applies year-round.",
    exposureTitle: 'Illustrative exposure range if audited or diligenced today',
    exposureSub: 'TP adjustment risk + documentation penalties + fixed US form penalties',
    exposureSubEmpty: 'exposure starts accruing with your first undocumented flow',
    exposureNone: '€0 — for now',
    exposureManual: 'Scoped manually',
    quoteTitle: 'Transfer pricing quote — fixed-fee, fenced under mid-tier',
    quoteEmpty:
      'Your itemized TP quote appears here, next to the typical mid-tier fee for the same scope.',
    quoteNoScope: 'No TP scope detected from your inputs.',
    quoteOutOfScope:
      'Your transaction values are beyond what this self-serve estimator prices reliably — groups at this size need a scoped proposal rather than a calculator number. The obligations and deadlines above still apply; send them to us and you’ll have a fixed fee within one working day.',
    quoteTotal: 'Transfer pricing — total',
    footnote:
      'Comparison range reflects published fee ranges and quotes we see clients receive for equivalent scope from international mid-tier firms. It is an indication, not a quote on their behalf — always get your own.',
    cta: 'Book the 20-minute scoping call',
    methodTitle: 'Benchmarking method per flow',
    methodFootnote:
      'The applicable method, tested party and profit-level indicator for each flow — this is what your benchmark study will apply. Indicative; confirmed at scoping.',
    failure:
      'Something went wrong computing this — please adjust the inputs, or just email us the numbers and we’ll quote by hand.',
    /** Announced to screen readers instead of the full sixty-line panel. */
    status:
      '{obligations} obligations, {deadlines} deadlines. Indicative quote {quote}. Full detail follows below.',
    statusNoQuote: '{obligations} obligations, {deadlines} deadlines. No priced TP scope.',
  },
};

export const ddCalc = {
  tag: 'Calculator 2 · Due diligence',
  heading: 'Price a financial due diligence in sixty seconds.',
  lede: 'For funds pricing a live deal, and for founders budgeting sell-side readiness. Financial DD with integrated TP review is ours end-to-end; full tax DD is scoped with partner tax advisors and shows as a separate line.',

  step1: '1 · Which side are you on?',
  side: { buy: 'Buy-side (investor)', sell: 'Sell-side (company)' },

  step2: '2 · Scope',
  scope: {
    rf: 'Red-Flag DD (seed)',
    a: 'Financial DD (Series A)',
    b: 'Full FDD (Series B)',
  },

  step3: '3 · The target',
  entities: 'Entities in the group',
  revenue: {
    a: 'Rev < €1M',
    b: '€1–3M',
    c: '€3–10M',
    d: '€10–25M',
    e: '> €25M',
  },

  step4: '4 · Data quality',
  accounts: { audited: 'Audited accounts', reviewed: 'Reviewed', neither: 'Neither' },
  dataRoom: { organized: 'Organized data room', partial: 'Partial', none: 'None' },

  step5: '5 · Complexity',
  consolidation: 'Consolidation must be rebuilt',
  rush: 'Report needed < 2 weeks',
  layers: 'Cap-table instrument layers (SAFE stacks, notes, warrants, phantom ESOP)',
  model: {
    saas: 'SaaS / clean ARR',
    usage: 'Usage / marketplace',
    hardware: 'Hardware / mixed',
  },

  step6: '6 · Add-ons',
  addOns: {
    tp: 'TP deep-dive module (+€2,500)',
    tax: 'Full tax DD via partner (+€4–8k, quoted per country)',
    stamp: 'Recognized-firm review (+40–70%)',
  },

  run: 'Compute DD quote →',

  results: {
    quoteTitle: 'Due diligence quote — factor breakdown',
    quoteEmpty: 'Your DD quote appears here with every pricing factor shown — no black box.',
    feeLabel: '{scope} — our fee',
    baseLabel: '{scope} — base',
    floorNote: 'floor applied',
    footnote:
      "Comparison range reflects published fee ranges and quotes we see clients receive for equivalent scope. It is an indication, not a quote on another firm's behalf.",
    cta: 'Get the fixed quote & timeline',
    failure:
      'Something went wrong computing this — please adjust the inputs, or email us the deal outline for a manual quote.',
    status: 'Indicative {scope} fee {quote}. Factor breakdown follows below.',
    buyNote:
      '<b>Independence:</b> on buy-side engagements we do not concurrently act for the target. If we already prepare that company’s transfer pricing, we disclose it before scoping and you decide — usually we step back from the DD and hand you our TP file instead, which is faster and cheaper for you anyway. <b>Who pays:</b> buy-side DD is invoiced to the fund as a fund expense.',
    sellNote:
      '<b>Sell-side readiness</b> is preparation, not assurance: we build and stress-test your data room against the checklists investors actually use, and fix what we find. It is invoiced to the company, and it is not a substitute for the investor’s own diligence.',
  },
};
