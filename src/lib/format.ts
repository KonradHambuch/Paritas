export type Lang = 'en' | 'hu';

/**
 * Locale-aware formatting.
 *
 * Amounts are Hungarian forint. The currency is written as a trailing "HUF"
 * rather than through `style: 'currency'` on purpose: hu-HU renders HUF as
 * "Ft" and en-US as "HUF 180,000,000", while the reference design uses one
 * consistent "180 000 000 HUF" in both languages. Only the digit grouping is
 * locale-dependent — spaces in Hungarian, commas in English.
 */
export function makeFormat(lang: Lang) {
  const loc = lang === 'hu' ? 'hu-HU' : 'en-US';
  const number = new Intl.NumberFormat(loc, { maximumFractionDigits: 0 });
  const decimal = new Intl.NumberFormat(loc, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  const huf = (n: number) => `${number.format(Math.round(n))} HUF`;

  return {
    lang,
    locale: loc,
    /** "180 000 000 HUF" / "180,000,000 HUF" */
    huf,
    /** A range sharing one currency suffix. */
    hufRange: (a: number, b: number) => `${number.format(Math.round(a))} – ${huf(b)}`,
    /** Bare grouped number, for input fields. */
    number: (n: number) => number.format(Math.round(n)),
    /** "4.5x" with a multiplication sign. */
    multiple: (n: number) => `${decimal.format(n)}×`,
    multipleRange: (a: number, b: number) =>
      `${decimal.format(a)}× – ${decimal.format(b)}×`,
  };
}

export type Formatter = ReturnType<typeof makeFormat>;

/** Strip grouping and stray characters back to an integer. */
export function parseAmount(raw: string): number {
  const digits = raw.replace(/[^0-9-]/g, '');
  if (!digits || digits === '-') return 0;
  const n = Number.parseInt(digits, 10);
  return Number.isFinite(n) ? n : 0;
}
