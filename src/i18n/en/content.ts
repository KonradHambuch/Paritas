export const meta = {
  title: 'Cardo — Transfer pricing, due diligence, company sale and acquisition',
  description:
    'Transfer pricing documentation, financial due diligence, company sale and acquisition advisory for mid-market companies.',
  ogLocale: 'en_GB',
  notFoundTitle: 'Page not found — Cardo',
};

export const brand = {
  name: 'CARDO',
  tagline: 'Transfer pricing · Diligence · Transactions',
};

export const nav = {
  skip: 'Skip to content',
  menu: 'Menu',
  otherLanguage: 'HU',
  otherLanguageLabel: 'Magyar',
  links: {
    services: 'Services',
    sale: 'Company sale',
    acquisition: 'Acquisition',
    tax: 'Tax',
    tools: 'Tools',
    contact: 'Contact',
  },
};

export const hero = {
  line1: 'Transfer pricing, diligence,',
  line2: 'company sale and acquisition.',
  lede: 'Numbers matter when somebody else looks at them — a tax inspector, a buyer or an investor. That is what we prepare you for.',
};

export const services = {
  eyebrow: 'Services',
  heading: 'Five areas, one purpose: that the numbers hold when it matters.',
  feeBadge: 'Success fee',
  items: [
    {
      h: 'Transfer pricing',
      p: 'Local file and master file, benchmark studies, intercompany agreements, loan pricing, and the annual refresh that keeps a study defensible.',
    },
    {
      h: 'Financial due diligence',
      p: 'Buy-side and sell-side. Revenue quality, customer concentration, working capital, ownership chain and risk — before the other side finds it.',
    },
    {
      h: 'Company sale',
      p: 'From the idea to the closing. Preparation, valuation, documentation, buyer search, offer management, negotiation and representation.',
    },
    {
      h: 'Company acquisition',
      p: 'Target search, valuation, negotiation strategy, diligence and post-acquisition integration.',
    },
    {
      h: 'Tax recovery',
      p: 'We review five years back for what was left in the local business tax base. If we find nothing, it costs nothing.',
    },
  ],
  nameNote:
    '<b>About the name.</b> <i>Cardo</i> is Latin for the hinge — the point a door turns on. It is also the root of “cardinal”: the thing that matters most, because everything else depends on it. Selling a company, making an acquisition or facing a tax audit is exactly that kind of point in an owner’s life.',
};

export const sale = {
  eyebrow: 'Company sale',
  heading: 'Selling a company is not about finding a buyer.',
  p1: 'It is about the company being in the state that reflects its value on the day the buyer arrives. A sale process typically takes <b>four to six months</b> — but the preparation before it decides what you are paid.',
  p2: 'Most price reductions are not negotiated. They happen when diligence finds something the seller did not know about — a missing contract, an undocumented related-party transaction, revenue that depends on a single customer.',
  colStage: 'Stage',
  colWhat: 'What happens',
  stages: [
    {
      stage: 'Preparation',
      what: 'We examine the company from the buyer’s point of view. What is missing gets fixed before the process starts, not during it.',
    },
    {
      stage: 'Valuation',
      what: 'A real valuation with a stated methodology and reasoning — not a rule of thumb.',
    },
    {
      stage: 'Documentation',
      what: 'Information memorandum, teaser, data room. What the buyer sees is what they price.',
    },
    {
      stage: 'Buyer search',
      what: 'Targeted approach. Not an advertisement — a selected list of likely buyers.',
    },
    {
      stage: 'Offers and negotiation',
      what: 'Offer management, structure, terms, and representation at the table.',
    },
    {
      stage: 'Diligence and closing',
      what: 'Managing the buyer’s diligence through to signature.',
    },
  ],
  tool: {
    lbl: 'Free tool',
    h: 'What is your company worth?',
    p: 'An indicative valuation range from sector, EBITDA and net debt, using Hungarian mid-market transaction multiples.',
    cta: 'Open the valuation calculator →',
  },
};

export const acquisition = {
  eyebrow: 'Company acquisition',
  heading: 'An acquisition works when you know what you are buying.',
  lede: 'Companies following a deliberate acquisition strategy grow their value faster than their competitors. But every acquisition turns on the same two questions: <b>the right target, at the right price.</b>',
  items: [
    {
      h: 'Target',
      p: 'Market mapping and targeted identification — including companies that are not formally for sale.',
    },
    {
      h: 'Valuation',
      p: 'What it is actually worth, and the walk-away number above which it stops making sense.',
    },
    {
      h: 'Diligence',
      p: 'What the other side did not mention. Revenue quality, concentration, hidden liabilities.',
    },
    {
      h: 'Negotiation',
      p: 'Structure, price, terms, warranties. A good contract is one that is still good afterwards.',
    },
    {
      h: 'Financing',
      p: 'How the purchase should be structured, and where the money comes from.',
    },
    {
      h: 'Integration',
      p: 'The first hundred days. Most acquisitions fail here, not at the negotiating table.',
    },
  ],
  tool: {
    lbl: 'Free tool',
    h: 'Would your company survive a due diligence?',
    p: 'Ten questions a buyer or investor will ask anyway. You get a score and a specific list of what is missing.',
    cta: 'Open the readiness check →',
  },
};

export const method = {
  eyebrow: 'Transfer pricing & diligence',
  heading: 'Where documentation usually fails.',
  items: [
    {
      h: 'The agreement and the study disagree',
      p: 'The most common failure: the agreement is prepared first, the benchmarking later, and the two are never reconciled.',
    },
    {
      h: 'The rejection record is missing',
      p: 'Authorities rarely challenge the comparables you kept. They challenge the ones you removed — and why.',
    },
    {
      h: 'The study has gone stale',
      p: 'A benchmark older than three years is materially harder to defend. Financial data should be refreshed annually.',
    },
  ],
  tool: {
    lbl: 'Free tool',
    h: 'Do you have a documentation obligation?',
    /** {threshold} is filled from the engine config. */
    p: 'Enter your transactions, and it shows whether any of them reaches the {threshold} threshold, what must be prepared, and the penalty exposure.',
    cta: 'Open the transfer pricing check →',
  },
};

export const taxRecovery = {
  eyebrow: 'Tax recovery — success fee',
  heading: 'Most companies pay more local business tax than they need to.',
  lede: 'Not because they calculate it wrongly. Because the conditions for deduction are strict, and one missing sentence in a contract or on an invoice removes the whole item.',
  items: [
    {
      h: 'Subcontractor performance',
      p: 'Deductible — but only where there is a written contract with the customer <b>and</b> the subcontractor. This is the condition that fails most often.',
    },
    {
      h: 'Recharged services',
      p: 'Also deductible — but the contract must allow the recharge and the invoice must show it. If it is not on the invoice, the deduction is lost.',
    },
    {
      h: 'R&D spend',
      p: 'Reduces the tax base, and a separate corporate tax credit may apply. Many companies do development that qualifies as R&D without ever calling it that.',
    },
    {
      h: 'Innovation contribution',
      p: 'Sits on the same tax base. If the base falls, this falls too — and most companies forget it.',
    },
    {
      h: 'Material cost and COGS',
      p: 'Misclassified items that would be deductible.',
    },
    {
      h: 'Five years',
      p: 'Self-revision reaches back five years. Every year that passes, one year of recoverable tax is lost permanently.',
      urgent: true,
    },
  ],
  tool: {
    lbl: 'Free tool',
    h: 'How much tax did you overpay?',
    p: 'Four inputs, and it shows how much may still be sitting in the last five years.',
    cta: 'Open the tax recovery calculator →',
  },
  howHeading: 'How it works',
  how: [
    'We review the last five years of returns and the contracts behind them.',
    'We tell you what can be recovered — and what cannot be defended.',
    'We prepare the self-revision and run the procedure.',
    '<b>The fee is a percentage of what is recovered. If we find nothing, it costs nothing.</b>',
  ],
};

export const contact = {
  eyebrow: 'Contact',
  heading: 'Start with a conversation.',
  lede: 'Twenty minutes, no charge. If the honest answer is that it is not the right time, we will say so.',
  email: 'hello@cardoadvisory.com',
};

export const footer = {
  location: 'Budapest, Hungary',
  servicesHeading: 'Services',
  toolsHeading: 'Tools',
  fine: 'The calculators on this site are indicative and based on general assumptions. They do not constitute tax, legal or investment advice and do not replace a professional opinion on your specific circumstances. Where a licensed activity is required, it is carried out by the appropriately licensed adviser.',
  /** Rendered only where a translation needs to name the governing version. */
  governingLanguage: '',
};

export const notFound = {
  eyebrow: '404',
  heading: 'That page does not exist.',
  body: 'The link may be out of date, or the page may have moved. Everything on this site lives on one page — start at the top, or go straight to the tools.',
  home: 'Back to the homepage',
  tools: 'Open the calculators',
};
