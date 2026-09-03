import { meta, nav, footer, notFound } from './common';
import {
  hero,
  strip,
  why,
  how,
  software,
  pricing,
  bundles,
  proof,
  team,
  faq,
  resources,
  contact,
} from './content';
import { tpCalc, ddCalc } from './calc';
import { engine } from './engine';

export const en = {
  meta,
  nav,
  footer,
  notFound,
  hero,
  strip,
  why,
  how,
  software,
  pricing,
  bundles,
  proof,
  team,
  faq,
  resources,
  contact,
  tpCalc,
  ddCalc,
  engine,
};

/**
 * English is the source of truth for the message shape. Every other locale is
 * typed against this, so a missing or misspelled key is a BUILD ERROR rather
 * than a silently English string in production — which is the only tractable
 * way to keep an 8,000-word translation complete.
 */
export type Dict = typeof en;
