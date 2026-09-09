export type Lang = 'en' | 'hu';

/**
 * Locale-aware formatting.
 *
 * Amounts are Hungarian forint, written with a trailing unit rather than
 * through `style: 'currency'`, which would give "HUF 180,000,000" in English.
 * Hungarian readers get "Ft", English readers "HUF" — the reference pages
 * mixed the two, printing an English heading of "HUF 150,000,000" above
 * results labelled "Ft".
 */
export function makeFormat(lang: Lang) {
  const loc = lang === 'hu' ? 'hu-HU' : 'en-US';
  const number = new Intl.NumberFormat(loc, { maximumFractionDigits: 0 });
  const decimal = new Intl.NumberFormat(loc, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  const unit = lang === 'hu' ? 'Ft' : 'HUF';
  const huf = (n: number) => `${number.format(Math.round(n))} ${unit}`;

  return {
    lang,
    locale: loc,
    /** "180 000 000 Ft" / "180,000,000 HUF" */
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
