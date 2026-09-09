import {
  meta, brand, nav, hero, services, sale, acquisition, method, taxRecovery,
  contact, footer, notFound,
} from './content';
import { tools } from './tools';

export const en = {
  meta, brand, nav, hero, services, sale, acquisition, method, taxRecovery,
  contact, footer, notFound, tools,
};

/**
 * English is the source of truth for the message shape. Every other locale is
 * typed against this, so a missing or misspelled key is a build error rather
 * than a silently English string in production.
 */
export type Dict = typeof en;
