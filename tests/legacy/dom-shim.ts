import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const LEGACY_SRC = readFileSync(
  fileURLToPath(new URL('./original-engine.js', import.meta.url)),
  'utf8',
);

/** Values keyed by element id (number/date inputs). */
export type IdValues = Record<string, string>;
/** Values keyed by input name — radios hold a value, checkboxes a boolean. */
export type NameValues = Record<string, string | boolean>;

export interface LegacyOutput {
  html: Record<string, string>;
  text: Record<string, string>;
  display: Record<string, string>;
}

/**
 * Runs the ORIGINAL inline engine against a minimal fake DOM.
 *
 * The legacy script touches only five DOM APIs, so a real jsdom document is
 * unnecessary — and a shim keeps the harness in-process and deterministic,
 * which is what lets us fuzz thousands of input combinations rather than
 * hand-picking a few dozen.
 *
 * The hero-gauge IIFE references bare globals (hg1, hg1v, …) that only exist
 * as implicit window properties in a real browser. Here they throw a
 * ReferenceError, which the original's own try/catch swallows — the gauge is
 * explicitly decorative and isolated, so this is faithful, not a workaround.
 */
export function runLegacy(ids: IdValues, names: NameValues): LegacyOutput {
  const html: Record<string, string> = {};
  const text: Record<string, string> = {};
  const display: Record<string, string> = {};
  const handlers: Record<string, Array<() => void>> = {};

  const makeNode = (id: string) => {
    const style = {
      set display(v: string) {
        display[id] = v;
      },
      get display() {
        return display[id] ?? '';
      },
    };
    return {
      get value() {
        return ids[id] ?? '';
      },
      style,
      set innerHTML(v: string) {
        html[id] = v;
      },
      get innerHTML() {
        return html[id] ?? '';
      },
      set textContent(v: string) {
        text[id] = v;
      },
      get textContent() {
        return text[id] ?? '';
      },
      addEventListener(type: string, fn: () => void) {
        (handlers[`${id}:${type}`] ??= []).push(fn);
      },
      scrollIntoView() {},
      closest: () => null,
      querySelector: () => null,
      querySelectorAll: () => [],
      classList: { toggle() {}, add() {}, remove() {} },
    };
  };

  const nodes: Record<string, ReturnType<typeof makeNode>> = {};
  const node = (id: string) => (nodes[id] ??= makeNode(id));

  const document = {
    getElementById: (id: string) => node(id),
    querySelector: (sel: string) => {
      const checkedMatch = /input\[name="(.+?)"\]:checked/.exec(sel);
      if (checkedMatch) {
        const v = names[checkedMatch[1]!];
        return v === undefined ? null : { value: String(v) };
      }
      const plainMatch = /input\[name="(.+?)"\]/.exec(sel);
      if (plainMatch) {
        const v = names[plainMatch[1]!];
        return v === undefined ? null : { checked: v === true || v === 'true' };
      }
      return null;
    },
    // The option-pill visual sync iterates `.opts` groups; with no groups the
    // loop is a no-op, which is exactly right — it only toggles CSS classes.
    querySelectorAll: () => [] as unknown[],
  };

  const windowStub = {
    innerWidth: 1200,
    matchMedia: () => ({ matches: true }),
  };

  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  new Function(
    'document',
    'window',
    'performance',
    'requestAnimationFrame',
    'setTimeout',
    LEGACY_SRC,
  )(
    document,
    windowStub,
    { now: () => 0 },
    () => 0,
    () => 0,
  );

  handlers['tpRun:click']?.forEach((fn) => fn());
  handlers['ddRun:click']?.forEach((fn) => fn());

  return { html, text, display };
}

/**
 * Pull every number out of rendered output so the comparison survives markup
 * changes. The ported renderer legitimately emits different HTML; what must
 * not change is the arithmetic.
 */
export function extractNumbers(s: string): number[] {
  const out: number[] = [];
  const re = /€\s?([\d,]+)|×(\d+\.\d{2})|(\d+)%/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s)) !== null) {
    const raw = m[1] ?? m[2] ?? m[3]!;
    out.push(Number(raw.replace(/,/g, '')));
  }
  return out;
}
