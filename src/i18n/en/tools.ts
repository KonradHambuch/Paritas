export const tools = {
  eyebrow: 'Tools',
  heading: 'Four free calculators.',
  lede: 'No sign-up, no email. Indicative — but built on real numbers.',

  /** The guide request form is present but not yet wired to anything. */
  mail: {
    lead: 'The longer version, as a PDF',
    placeholder: 'email address',
    send: 'Send',
    /* Shown instead of a success message, because nothing is sent yet. Saying
       "check your inbox" when no mail leaves would be a plain untruth. */
    pending: 'Coming soon — the guides are being finalised.',
    docs: {
      tp: { title: 'Transfer pricing guide', pages: '4 pages' },
      valuation: { title: 'Company sale guide', pages: '3 pages' },
      readiness: { title: 'Due diligence guide', pages: '3 pages' },
      tax: { title: 'Tax recovery guide', pages: '3 pages' },
    },
  },

  /* ── 01 · transfer pricing ─────────────────────────────────── */
  tp: {
    num: '01 — Transfer pricing',
    h: 'Do you have a documentation obligation?',
    /** {threshold} is filled from the engine config. */
    p: 'Hungarian transfer pricing documentation is required per aggregated transaction, per tax year, above {threshold}.',
    rowsLabel:
      'Enter your related-party transactions — by type, with annual value',
    add: '+ Add transaction',
    remove: 'Remove row',
    valuePlaceholder: 'annual value, HUF',
    types: {
      loan: 'Loan / financing',
      management: 'Management service',
      products: 'Sale of products',
      otherService: 'Other service',
      royalty: 'Royalty / licence',
      costRecharge: 'Cost recharge',
      intangibles: 'Transfer of intangibles',
    },
    /** {threshold} filled from config. */
    disclaimerLead: 'These examples apply to Hungarian companies.',
    disclaimerBody:
      'Other countries in the CEE region and elsewhere in Europe have different thresholds, different deadlines and different penalties. Brazil and Saudi Arabia introduced transfer pricing rules recently and penalties are already being issued — a subsidiary of a Hungarian parent can be caught there too.',
    disclaimerTail:
      'The threshold applies per aggregated transaction, per tax year, at arm’s length value, excluding VAT. Rules change — verify against current legislation.',
    result: {
      required: 'Documentation required',
      notRequired: 'No documentation obligation',
      /** {threshold} filled from config. */
      thresholdNote: 'Threshold: {threshold} per aggregated transaction',
      colTransaction: 'Aggregated transaction',
      colValue: 'Annual value',
      colDocumentation: 'Documentation',
      yes: 'Required',
      no: 'Not required',
      total: 'Total related-party transactions',
      /** {masterFile} filled from config. */
      masterYes: 'Master file also required (above {masterFile})',
      masterNo: 'No master file (below {masterFile})',
      penalty: 'Penalty exposure',
      /** {penaltyRepeat} filled from config. */
      penaltyNote:
        'per transaction and per document, {penaltyRepeat} for repeated default — these amounts add up',
      deadline:
        'Deadline: by the corporate tax return filing date, 31 May for calendar-year taxpayers.',
      aggregationNote:
        'Transactions of the same type must be aggregated. The calculator does this automatically.',
      armsLength:
        'No document is required, but the price must still be at arm’s length and you must be able to show it.',
      empty: 'Add at least one transaction.',
    },
  },

  /* ── 02 · valuation ────────────────────────────────────────── */
  valuation: {
    num: '02 — Company value',
    h: 'What is your company worth?',
    p: 'Choose a sector and the calculator shows which logic applies — not every company is priced on its profit.',
    sectorLabel: 'Sector',
    selectSector: 'Select a sector',
    debtLabel: 'Net debt (borrowings minus cash, HUF)',
    sectors: {
      svc: 'Services',
      prod: 'Manufacturing',
      trade: 'Trade / distribution',
      it: 'IT / software',
      saas: 'SaaS / subscription',
      constr: 'Construction',
      health: 'Healthcare',
      realest: 'Real estate / asset-heavy',
      holding: 'Holding company',
      other: 'Other',
    },
    methodLabel: {
      ebitda: 'EBITDA-based valuation',
      revenue: 'Revenue-based valuation',
      asset: 'Asset-based valuation',
    },
    methodWhy: {
      ebitda: 'In this sector buyers price the sustainable annual profit.',
      revenue:
        'For subscription models recurring revenue is the reference, because profit is still being reinvested into growth.',
      asset:
        'For asset-heavy companies the balance sheet decides, not the profit: value starts from the market value of the assets.',
    },
    baseLabel: {
      ebitda: 'Annual EBITDA (HUF)',
      revenue: 'Annual recurring revenue (HUF)',
      asset: 'Estimated market value of assets (HUF)',
    },
    unit: {
      ebitda: '× EBITDA',
      revenue: '× revenue',
      asset: '× asset value',
    },
    result: {
      heading: 'Indicative valuation range',
      multiple: 'Multiple applied',
      enterprise: 'Enterprise value',
      equity: 'Equity value',
      note: 'Equity value = enterprise value − net debt',
      negativeNote:
        'At the low end of the range the net debt exceeds the enterprise value, so the equity value is negative. In a sale that usually means the debt is settled from the proceeds, or the structure has to change.',
      adjusts: 'What moves this significantly',
      f1: '<b>Customer concentration.</b> If one client is more than 30% of revenue, the multiple typically drops by a full point.',
      f2: '<b>Owner dependence.</b> If the business does not run without the owner, you are not selling a company, you are selling a job. This is the single largest discount.',
      f3: '<b>Repeatability of revenue.</b> Contracted, recurring revenue pulls up. Project-to-project work pulls down.',
      f4: '<b>Whether the numbers are real.</b> If profit is suppressed for tax reasons, it has to be proven — otherwise the buyer prices what they can see.',
      f5: '<b>Order.</b> Missing contracts, company assets held personally, undocumented related-party transactions — all of it shows up in the price.',
      demo: 'This calculator is a simplified demonstration of the logic behind a first estimate. A real valuation is established by getting to know the company in detail: the financial statements, the contracts, the customer base and the market.',
    },
  },

  /* ── 03 · diligence readiness ──────────────────────────────── */
  readiness: {
    num: '03 — Diligence',
    h: 'Would your company survive a due diligence?',
    p: 'Ten questions a buyer or investor will ask anyway — weighted by how much each one moves the price.',
    yes: 'Yes',
    no: 'No',
    disclaimer:
      'This is a self-check, not a diligence exercise. The real process examines documents.',
    questions: {
      accountsReal:
        'Are the last three years of accounts finalised, and does the reported profit reflect how the business actually performs?',
      ownerIndependence: 'Would the company run for three months without the owner?',
      concentration:
        'Do you know what percentage of revenue your largest customer represents?',
      customerContracts:
        'Do you have written, in-force contracts with your top five customers?',
      assetsOwned:
        'Are the assets the business needs — and the brand — owned by the company rather than by the owner personally?',
      employmentContracts:
        'Does every employee and long-term contractor have a proper written contract?',
      relatedParty: 'Are transactions with related companies documented?',
      loans: 'Is the register of loans, guarantees, sureties and liens current?',
      ownership:
        'Is the ownership structure clean and current, with no disputed shareholdings?',
      disputes:
        'Are there no pending or threatened disputes or regulatory proceedings — or, if there are, are they documented?',
    },
    why: {
      accountsReal:
        'If profit is suppressed for tax reasons, it must be proven. What you cannot prove, the buyer will not pay for.',
      ownerIndependence:
        'This is the single largest discount. If the business depends on the owner, you are not selling a company, you are selling a job.',
      concentration:
        'Above 30% the multiple typically drops by a full point. A buyer works this out in five minutes.',
      customerContracts:
        'Revenue without a contract is, to a buyer, revenue that does not transfer.',
      assetsOwned:
        'This is the most common hidden problem in owner-managed companies: the property, the vehicle or the trademark sits in a private name.',
      employmentContracts:
        'Disguised employment is a retrospective payroll liability, and a buyer will price it in.',
      relatedParty:
        'An undocumented related-party transaction is a tax risk and a deal risk at the same time.',
      loans:
        'A hidden liability is the one thing that can still break a deal after it is agreed.',
      ownership: 'An unresolved shareholding pushes closing back by months.',
      disputes: 'Having one is not the problem. Finding out during diligence is.',
    },
    result: {
      score: 'Diligence readiness',
      ready: 'Ready for diligence',
      mostly: 'Mostly in order, a few gaps',
      gaps: 'Significant gaps — start here',
      costly: 'In this state, diligence will cost you price',
      gapHeading: 'What needs work — by weight',
      none: 'No gaps found. That is rare.',
      points: 'points',
      note: 'Missing items rarely stop a deal. But they slow it down, and they usually show up in the price or in the warranties — meaning you pay for the gap anyway, just more expensively.',
      /** {answered} / {total} while the visitor is still answering. */
      progress: '{answered} of {total} answered',
    },
  },

  /* ── 04 · tax recovery ─────────────────────────────────────── */
  tax: {
    num: '04 — Tax recovery',
    h: 'How much tax did you overpay?',
    p: 'Several items are deductible from the Hungarian local business tax base — but only under strict conditions. What was missed can be recovered five years back.',
    revenueLabel: 'Annual net revenue (HUF)',
    revenuePlaceholder: 'e.g. 1 200 000 000',
    sizeLabel: 'Company size',
    sizes: { sme: 'SME (under 250 staff)', large: 'Large (over 250 staff)' },
    subLabel: 'Of which subcontractor and recharged cost (HUF)',
    subPlaceholder: 'e.g. 300 000 000',
    rdLabel: 'Annual R&D-type spend (HUF)',
    rdPlaceholder: 'e.g. 40 000 000',
    disclaimer:
      'An estimate for Hungarian local business tax and innovation contribution. The actual recoverable amount depends on the contracts and the invoicing — the conditions for deduction are strict, and that is precisely why the money stays behind.',
    result: {
      heading: 'Estimated recoverable amount',
      base: 'Annual tax base reduction available',
      capped:
        'Capped: the costs entered exceed what is plausible against this revenue.',
      rate: 'Rate applied',
      annual: 'Annual saving',
      /** {years} filled from config. */
      total: 'Over {years} years, retrospectively',
      note: 'Self-revision in Hungary is possible five years back. The range reflects that some items cannot be claimed for documentation reasons.',
      what: 'Where the money usually gets stuck',
      w1: '<b>Subcontractor performance.</b> Deductible from the local business tax base — but only where there is a written contract with both the customer and the subcontractor. This is the condition that most often fails.',
      w2: '<b>Recharged services.</b> Also deductible — but the contract must allow the recharge and the invoice must show it. If the invoice does not state that it contains a recharged service, the deduction is lost.',
      w3: '<b>R&D spend.</b> Reduces the local business tax base, and a separate corporate tax credit may also apply. Many companies do development that qualifies as R&D without ever calling it that.',
      w4: '<b>Innovation contribution.</b> Sits on the same tax base as the local business tax. If the base falls, this falls too — and most companies forget it.',
      w5: '<b>Material cost and cost of goods sold.</b> Misclassified items that would be deductible.',
      empty: 'Enter revenue and the deductible-type costs.',
    },
  },
};
