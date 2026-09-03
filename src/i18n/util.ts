/**
 * Locale helpers with NO dictionary imports.
 *
 * This separation is load-bearing, not stylistic: the client renderers need
 * `fill` and `resolve`, and if they reached for them through src/i18n/index.ts
 * they would drag BOTH dictionaries into the browser bundle. Keeping these
 * here lets each page ship only its own locale.
 */

export type Lang = 'en' | 'hu';

export const LANGS = ['en', 'hu'] as const;
export const DEFAULT_LANG: Lang = 'en';

export const LANG_LABEL: Record<Lang, string> = { en: 'English', hu: 'Magyar' };
export const LANG_TAG: Record<Lang, string> = { en: 'en', hu: 'hu' };

/**
 * English is unprefixed at the apex; Hungarian lives under /hu/.
 * Forcing /en/ would cost a redirect on every root request and break existing
 * inbound links, for no gain on a two-locale site.
 */
export function localePath(lang: Lang, path = ''): string {
  const clean = path.replace(/^\/+/, '');
  const base = lang === DEFAULT_LANG ? '/' : `/${lang}/`;
  return clean ? `${base}${clean}` : base;
}

export function otherLang(lang: Lang): Lang {
  return lang === 'en' ? 'hu' : 'en';
}

export function langFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  return first === 'hu' ? 'hu' : 'en';
}

export function langFromDocument(): Lang {
  return typeof document !== 'undefined' && document.documentElement.lang === 'hu'
    ? 'hu'
    : 'en';
}

/**
 * Fill `{placeholder}` tokens. Used by the handful of strings that interpolate
 * a value computed from CONFIG, so prose and engine cannot disagree.
 */
export function fill(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

/**
 * Resolve a dictionary entry that is either a plain string or a function of
 * parameters. The engine catalogue mixes both — pluralisation and word order
 * need a function, static labels do not.
 */
export function resolve(
  entry: string | ((p: never) => string),
  params?: Record<string, unknown>,
): string {
  return typeof entry === 'function'
    ? (entry as (p: unknown) => string)(params ?? {})
    : entry;
}
