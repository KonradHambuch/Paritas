export const tools = {
  eyebrow: 'Tools',
  heading: 'Three free calculators.',
  lede: 'No sign-up, no email. Indicative — but built on real numbers.',

  /* ── 01 · transfer pricing ─────────────────────────────────── */
  tp: {
    num: '01 — Transfer pricing',
    h: 'Do you have a documentation obligation?',
    /** {threshold} is filled from the engine config. */
    p: 'Hungarian transfer pricing documentation is required per aggregated transaction, per tax year, above {threshold}.',
    relatedLabel: 'Are the parties related?',
    amountLabel: 'Annual value of the transaction (HUF)',
    amountPlaceholder: 'e.g. 180 000 000',
    select: 'Select',
    yes: 'Yes',
    no: 'No',
    disclaimer:
      'The threshold applies per transaction type, per tax year, on the arm’s length value, with certain transactions aggregated. Rules change — verify against current legislation.',
    result: {
      over: 'Documentation obligation applies',
      under: 'No documentation obligation',
      value: 'Transaction value',
      threshold: 'Threshold',
      gap: 'Above the threshold by',
      remaining: 'Remaining before the threshold',
      need: 'What must be prepared',
      /** {masterFile} is filled from the engine config. */
      need1: 'Local file for this aggregated transaction',
      need2: 'Master file, if total related-party transactions exceed {masterFile}',
      need3: 'Transaction-level reporting in the corporate tax return',
      deadline: 'Deadline',
      deadlineValue:
        'by the corporate tax return filing date — 31 May for calendar-year taxpayers',
      penalty: 'Default penalty exposure',
      /** {penaltyRepeat} is filled from the engine config. */
      penaltyValue:
        'per transaction and per document — {penaltyRepeat} for repeated default. These amounts add up',
      adjustment: 'Tax base adjustment exposure',
      adjustmentValue:
        'corporate tax on the adjustment, plus penalty and late payment interest',
      meta: 'The tax authority can check the document creation date. Documentation prepared after the fact triggers an automatic penalty.',
      armsLength: 'Arm’s length pricing still applies',
      armsLengthNote:
        'No document is required, but the price must be at arm’s length and you must be able to show it.',
      note: 'The threshold applies per aggregated transaction, at arm’s length value, excluding VAT.',
      /** {simplified} is filled from the engine config. */
      simplified:
        'For cost recharges above {simplified} a simplified local file is sufficient.',
    },
  },

  /* ── 02 · valuation ────────────────────────────────────────── */
  valuation: {
    num: '02 — Company value',
    h: 'What is your company worth?',
    p: 'An indicative range based on EBITDA multiples, using Hungarian mid-market transaction bands.',
    sectorLabel: 'Sector',
    ebitdaLabel: 'Annual EBITDA (HUF)',
    ebitdaPlaceholder: 'e.g. 80 000 000',
    debtLabel: 'Net debt (borrowings minus cash, HUF)',
    debtPlaceholder: 'e.g. 30 000 000',
    select: 'Select',
    sectors: {
      svc: 'Services',
      prod: 'Manufacturing',
      trade: 'Trade / distribution',
      it: 'IT / software',
      constr: 'Construction',
      health: 'Healthcare',
      other: 'Other',
    },
    disclaimer:
      'The multiple depends on sector, size, growth and the quality of the revenue. A real valuation examines the accounts, the contracts and the market.',
    result: {
      heading: 'Indicative valuation range',
      multiple: 'EBITDA multiple applied',
      enterprise: 'Enterprise value',
      equity: 'Equity value',
      note: 'Equity value = enterprise value − net debt',
      negativeNote:
        'At the low end of the range the net debt exceeds the enterprise value, so the equity value is negative. In a sale that usually means the debt has to be settled from the proceeds, or the structure has to change.',
      adjusts: 'What moves it',
      f1: 'Customer concentration — if one client is over 30% of revenue, the multiple drops',
      f2: 'Owner dependence — if the business does not run without the owner, the multiple drops sharply',
      f3: 'Growth and repeatability — recurring revenue pulls it up',
      f4: 'Clean accounts and contracts — mess always costs price',
    },
  },

  /* ── 03 · diligence readiness ──────────────────────────────── */
  readiness: {
    num: '03 — Diligence',
    h: 'Would your company survive a due diligence?',
    p: 'Ten questions a buyer or investor will ask anyway. Missing items usually show up in the price.',
    yes: 'Yes',
    no: 'No',
    disclaimer:
      'This is a self-check, not a diligence exercise. The real process examines documents.',
    questions: {
      accounts: 'Are the last three years of accounts finalised and approved?',
      capTable: 'Is there an up-to-date cap table and ownership record?',
      contracts: 'Does every employee and contractor have a written contract?',
      ip: 'Has intellectual property been assigned to the company in writing?',
      customerContracts:
        'Are there written, in-force contracts with the top five customers?',
      concentration: 'Do you know what percentage of revenue each customer represents?',
      relatedParty: 'Are related-party transactions documented?',
      loans: 'Is there a current record of loans, guarantees and sureties?',
      disputes: 'Are there no pending or threatened disputes, or are they documented?',
      ownerIndependence: 'Would the business run for three months without the owner?',
    },
    result: {
      score: 'Diligence readiness',
      ready: 'Ready for diligence',
      mostly: 'Mostly in order, a few gaps',
      gaps: 'Significant gaps',
      costly: 'Diligence in this state will cost you price',
      gapHeading: 'What needs work',
      none: 'No gaps found.',
      note: 'Missing items rarely stop a deal outright — but they slow it down, and they usually show up in the price or in the warranties.',
      /** {answered} / {total} while the visitor is still answering. */
      progress: '{answered} of {total} answered',
    },
  },
};
