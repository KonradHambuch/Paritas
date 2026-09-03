import type { Dict } from './en';
import type { Lang } from './util';

/**
 * Dynamic, per-locale dictionary loader for the browser.
 *
 * Vite splits each branch into its own chunk, so the English page never
 * downloads the Hungarian strings and vice versa. Importing `getDict` from
 * ./index instead would pull both into every page's bundle.
 */
export function loadDict(lang: Lang): Promise<Dict> {
  return lang === 'hu'
    ? import('./hu').then((m) => m.hu)
    : import('./en').then((m) => m.en);
}
