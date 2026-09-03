export type Lang = 'en' | 'hu';

/**
 * Locale-aware formatting for money, percentages and dates.
 *
 * Notes on the choices, all verified against Node's full-ICU:
 *
 *  - `en-IE` rather than `en-US`: a genuine English EUR locale that produces
 *    byte-identical output to the legacy `'€' + n.toLocaleString('en-US')`
 *    (`€5,500`), so the English page does not visibly change.
 *
 *  - `currencyDisplay: 'narrowSymbol'` is REQUIRED for Hungarian. The CLDR
 *    default renders EUR as the literal "EUR" in `hu-HU` (`5500 EUR`), which
 *    reads as a spreadsheet export rather than a price.
 *
 *  - Grouping is left at the locale default on purpose. Hungarian groups from
 *    five digits up, so `5500 €` and `13 500 €` are both correct and forcing a
 *    separator onto the four-digit case would be an orthography error.
 *
 *  - `formatRange` puts the symbol once and in the right place
 *    (`13 500–196 000 €`, `€13,500–€196,000`) instead of repeating it.
 */
export function makeFormat(lang: Lang) {
  const loc = lang === 'hu' ? 'hu-HU' : 'en-IE';

  const money = new Intl.NumberFormat(loc, {
    style: 'currency',
    currency: 'EUR',
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const percent = new Intl.NumberFormat(loc, {
    style: 'percent',
    maximumFractionDigits: 0,
  });

  const plain = new Intl.NumberFormat(loc, { maximumFractionDigits: 2 });

  const dateFmt = new Intl.DateTimeFormat(loc, {
    dateStyle: 'medium',
    // Mandatory. Without it the formatter shifts UTC-midnight dates back a day
    // in UTC- zones and reintroduces exactly the bug ./calc/dates.ts fixes.
    timeZone: 'UTC',
  });

  /** Matches the legacy fmtK: round to the nearest 100 before display. */
  const round100 = (n: number) => Math.round(n / 100) * 100;

  return {
    lang,
    locale: loc,
    /** Exact euros. */
    eur: (n: number) => money.format(Math.round(n)),
    /** Euros rounded to the nearest 100 — the quote-line convention. */
    eurK: (n: number) => money.format(round100(n)),
    /** A range with the currency symbol placed once. */
    eurRange: (a: number, b: number) => money.formatRange(round100(a), round100(b)),
    /** `pct(1.29)` → "129%" */
    pct: (ratio: number) => percent.format(ratio),
    /** Already-integer percentages coming out of the engine. */
    pctInt: (whole: number) => percent.format(whole / 100),
    /** `×1.15` */
    multiplier: (n: number) => `×${n.toFixed(2)}`,
    num: (n: number) => plain.format(n),
    /** ISO 'YYYY-MM-DD' → "31 Oct 2026" / "2026. okt. 31." */
    date: (iso: string) => dateFmt.format(new Date(`${iso}T00:00:00Z`)),
  };
}

export type Formatter = ReturnType<typeof makeFormat>;
