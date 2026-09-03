/**
 * Calculator OUTPUT strings.
 *
 * The engines in src/lib/calc emit `{ key, params }` descriptors and never see
 * this file — that is what keeps the maths language-free and testable once.
 * Every key here corresponds to one the engines can produce, and
 * tests/i18n.test.ts asserts both directions of that correspondence.
 *
 * Functions receive already-formatted strings (money, percentages, dates) from
 * the locale formatter, so pluralisation and word order can differ per
 * language without the engine knowing.
 */

export const engine = {
  category: {
    tp: 'TP',
    usFiling: 'US filing',
    governance: 'Governance',
  },

  flow: {
    dev: 'Dev services',
    mgmt: 'Mgmt services',
    loan: 'Loans',
    ip: 'IP royalty',
  },

  flowIndicative: {
    dev: 'Dev services (indicative)',
    mgmt: 'Mgmt services (indicative)',
    loan: 'Loans (interest ≈5%, indicative)',
    ip: 'IP royalty (indicative)',
  },

  tag: {
    localFileMandatory: 'Local File + benchmark mandatory',
    roFileMandatory: 'TP file mandatory / on request',
    planDocumentation: 'Approaching — plan documentation',
    armsLengthStillApplies: "Arm's-length still required",
    manualVerification: 'Manual verification required',
    defenseFileRecommended: 'Defense file recommended',
    irsPenaltyPerFormYear: 'Fixed IRS penalty per form / year',
    planWithFlip: 'Plan with the flip',
    fixFirst: 'Fix first — days, not weeks',
    verifyOnCall: 'Verify on the scoping call',
    setUpBeforeFlow: 'Set up before you flow',
    youSaveTheBenchmark: 'You save the benchmark fee',
  },

  oblig: {
    overThreshold: (p: { country: string; flow: string; value: string; pct: string }) =>
      `${p.country} · ${p.flow} — ${p.value} = ${p.pct} of threshold`,
    overThresholdIndicative: (p: {
      country: string;
      flow: string;
      value: string;
      pct: string;
    }) => `${p.country} · ${p.flow} — ${p.value} = ${p.pct} of threshold`,
    approaching: (p: { country: string; flow: string; pct: string }) =>
      `${p.country} · ${p.flow} — ${p.pct} of threshold`,
    underThreshold: (p: { country: string; flow: string; pct: string }) =>
      `${p.country} · ${p.flow} — ${p.pct} of threshold`,
    roFramework2026:
      'RO · 2026 documentation rules require taxpayer/transaction-specific verification',
    czBurdenOfProof:
      'CZ · No statutory Local File — but burden of proof shifts to you in audit',
    usFormsUnfiled: (p: { years: number }) =>
      `Forms 5471/5472 — ${p.years} year${p.years === 1 ? '' : 's'} unfiled`,
    usFormsAfterFlip: '5471/5472 due with the first return after the flip',
    noAgreement: 'No signed intercompany agreement behind live money flows',
    masterFileTrigger:
      'Group size suggests checking Master File triggers (PL: PLN 200M consolidated; HU: HUF 500M documented aggregate)',
    noFlows: 'No active intercompany flows — obligations start with the first euro moved',
    plSmallExempt:
      'PL micro/small enterprise — exempt from the compulsory comparability analysis. Local File still required; benchmark is not.',
  },

  exp: {
    plAdjustment: (p: { amount: string }) => `PL adjustment risk ${p.amount}`,
    plFiscal: (p: { amount: string }) => `PL fiscal-penal risk ~${p.amount}`,
    huPenalty: (p: { count: number; amount: string }) =>
      `HU penalty ${p.count} record${p.count === 1 ? '' : 's'} ${p.amount}`,
    roAssessment: (p: { amount: string }) => `RO assessment risk ${p.amount}`,
    czAudit: (p: { amount: string }) => `CZ audit risk ~${p.amount}`,
    usForms: (p: { amount: string }) => `US 5471/5472 penalties ${p.amount}`,
    noAgreement: (p: { amount: string }) =>
      `undocumented funding reclassification ~${p.amount}`,
  },

  deadline: {
    'pl.localFile': 'PL Local File',
    'pl.tpr': 'PL TPR filing',
    'hu.localFile': 'HU Local File + CIT return data',
    'ro.onRequest': 'RO file — on request, 30–60 days',
    'us.forms': 'US return + Forms 5471/5472',
    onRequest: 'be ready now',
    daysLeft: (p: { days: number }) => `${p.days} days left`,
    daysOverdue: (p: { days: number }) => `${p.days} days overdue`,
  },

  quote: {
    localFile: (p: { country: string; count: number }) =>
      `${p.country} Local File (${p.count} flow${p.count === 1 ? '' : 's'})`,
    czDefense: 'CZ audit-defense file',
    benchmark: (p: { count: number }) =>
      `Benchmark stud${p.count === 1 ? 'y' : 'ies'} (CEE library, de-duplicated)`,
    benchmarkNotRequired: 'Benchmark — not required for your size (we left it out)',
    firstYearSetup: 'First-year setup (agreements, functional analysis)',
    starter: 'TP Starter — agreement + policy + markup',
    starterLight: 'TP policy + library benchmark (Starter-light)',
    pack5471: '5471/5472 data pack (yr 1)',
    flipReady: 'Flip-Ready TP — IP path + day-1 agreements',
    midTierTypically: (p: { range: string }) => `mid-tier typically ${p.range}`,
    bundleWithDd: 'the DD quote you just ran',
    bundleWithTp: 'the TP quote you just ran',
    bundleSuffix: '— both products together, −15%',
  },

  reco: {
    flipPlanned: {
      title: 'Recommended: Post-Flip Bundle — €13,500',
      body: 'Your flip hasn’t closed: this is the cheapest moment you will ever have to set the IP path, day-one agreements and US-side filings. The window narrows permanently after a priced round.',
    },
    localFile: {
      title: 'Recommended: Local File package + tracker',
      body: 'At least one flow is over threshold — documentation is mandatory, and the exposure above is a multiple of the fee. The tracker keeps every other flow monitored so the next threshold doesn’t surprise you.',
    },
    czDefense: {
      title: 'Recommended: Czech defense file + tracker',
      body: 'Czechia has no filing threshold, which cuts both ways: nothing is due until an audit, and everything is due the day one starts. A defense file turns the burden of proof back in your favour.',
    },
    starter: {
      title: 'Recommended: TP Starter — from €3,500',
      body: 'You’re under every threshold, but arm’s-length pricing applies from the first euro. The Starter puts the agreement, policy and markup in place while it’s cheap and calm.',
    },
    preSetup: {
      title: 'Recommended: set up before the first transfer',
      body: 'No flows yet means no exposure yet — the cheapest compliance is the kind designed before the money moves.',
    },
  },

  method: {
    dev: {
      name: 'Development / R&D services',
      method: 'TNMM (cost-plus)',
      party: 'CEE subsidiary',
      pli: 'Full-cost markup (typ. 5–10%)',
    },
    mgmt: {
      name: 'Management / admin services',
      method: 'Cost-plus (check low-value-add safe harbour)',
      party: 'Provider',
      pli: 'Markup on costs (~5%)',
    },
    loan: {
      name: 'Intercompany loan',
      method: 'CUP — interest benchmark (PL safe harbour first)',
      party: 'Borrower / lender',
      pli: 'Interest-rate spread',
    },
    ip: {
      name: 'IP royalty / license',
      method: 'CUT/CUP if available, else TNMM/residual',
      party: 'Licensee',
      pli: 'Royalty % of revenue',
    },
  },

  ddScopeName: {
    rf: 'Red-Flag DD',
    a: 'Financial DD (Series A)',
    b: 'Full FDD (Series B)',
  },

  dd: {
    factor: {
      entities: (p: { count: number }) => `× entities (${p.count})`,
      revenue: '× revenue band',
      accounts: '× accounts quality',
      dataRoom: '× data room',
      model: '× revenue model',
      consolidation: '× consolidation rebuild',
      capTable: (p: { count: number }) => `× cap-table layers (${p.count})`,
      rush: '× rush (<2 weeks)',
    },
    addon: {
      tpModule: '+ TP deep-dive module',
      taxDd: '+ Full tax DD (partner tax advisors, per country)',
      taxDdPrice: '€4,000–8,000',
      recognizedFirm: '+ Recognized-firm review',
    },
  },
};
