import type { Dict } from '../en';
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

/**
 * Typed against the English dictionary: a missing or misspelled key fails the
 * build rather than silently rendering English on the Hungarian page.
 */
export const hu: Dict = {
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
