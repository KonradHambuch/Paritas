import { en, type Dict } from './en';
import { hu } from './hu';
import type { Lang } from './util';

export * from './util';
export type { Dict };

const DICTS: Record<Lang, Dict> = { en, hu };

/** Synchronous accessor — for .astro files, which run at build time only. */
export function getDict(lang: Lang): Dict {
  return DICTS[lang] ?? en;
}
