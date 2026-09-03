import type { Dict } from '../../i18n/en';
import { fill, resolve } from '../../i18n/util';
import type { Formatter } from '../../lib/format';
import type { DdResult } from '../../lib/calc/types';
import { el, emptyNote, quoteLine, replace, show } from './dom';

function msg(
  dict: Record<string, unknown>,
  key: string,
  params: Record<string, unknown> = {},
): string {
  const leaf = key.split('.').reduce<unknown>(
    (acc, part) => (acc as Record<string, unknown>)?.[part],
    dict,
  );
  if (leaf === undefined) return key;
  return resolve(leaf as string | ((p: never) => string), params);
}

export function renderDd(
  result: DdResult,
  t: Dict,
  fmt: Formatter,
  nodes: {
    quote: HTMLElement;
    cta: HTMLElement | null;
    footnote: HTMLElement | null;
    note: HTMLElement | null;
    sideNote: HTMLElement | null;
    status: HTMLElement | null;
  },
  bundle: { tpTotal: number | null },
): void {
  const e = t.engine;
  const scopeName = e.ddScopeName[result.scope];

  const rows: HTMLElement[] = [
    quoteLine(
      fill(t.ddCalc.results.baseLabel, { scope: scopeName }),
      el(
        'span',
        { class: 'font-mono text-sm font-normal text-text-muted' },
        fmt.eurK(result.base),
      ),
    ),
    ...result.factors.map((f) =>
      quoteLine(
        msg(e as unknown as Record<string, unknown>, f.key, f.params ?? {}),
        el(
          'span',
          { class: 'font-mono text-sm font-normal text-text-muted' },
          fmt.multiplier(f.multiplier),
        ),
      ),
    ),
  ];

  rows.push(
    quoteLine(
      el(
        'span',
        { class: 'text-sm' },
        el('b', {}, fill(t.ddCalc.results.feeLabel, { scope: scopeName })),
        result.flooredAt !== null
          ? el(
              'span',
              { class: 'ml-2 font-mono text-2xs text-text-muted' },
              `(${t.ddCalc.results.floorNote})`,
            )
          : null,
      ),
      el(
        'span',
        {},
        el(
          'span',
          { class: 'font-mono text-xs text-text-muted line-through' },
          e.quote.midTierTypically({
            range: fmt.eurRange(result.anchor[0], result.anchor[1]),
          }),
        ),
        ' ',
        el(
          'span',
          { class: 'font-mono text-base font-semibold whitespace-nowrap text-text-strong' },
          fmt.eurRange(result.range[0], result.range[1]),
        ),
      ),
    ),
  );

  for (const addOn of result.addOns) {
    const label = msg(e as unknown as Record<string, unknown>, addOn.key);
    if (addOn.key === 'dd.addon.taxDd') {
      rows.push(quoteLine(label, e.dd.addon.taxDdPrice));
    } else if (Array.isArray(addOn.amount)) {
      rows.push(quoteLine(label, fmt.eurRange(addOn.amount[0], addOn.amount[1])));
    } else if (addOn.amount !== null) {
      rows.push(quoteLine(label, fmt.eurK(addOn.amount)));
    }
  }

  if (bundle.tpTotal !== null) {
    rows.push(
      quoteLine(
        el(
          'span',
          { class: 'text-sm' },
          el('b', {}, e.quote.bundleWithTp),
          ` ${e.quote.bundleSuffix}`,
        ),
        fmt.eurK((bundle.tpTotal + result.cachedTotal) * 0.85),
      ),
    );
  }

  replace(nodes.quote, ...rows);
  show(nodes.cta, true);
  show(nodes.footnote, true);

  if (nodes.sideNote) {
    nodes.sideNote.innerHTML =
      result.independence === 'buy'
        ? t.ddCalc.results.buyNote
        : t.ddCalc.results.sellNote;
  }
  show(nodes.note, true);

  if (nodes.status) {
    nodes.status.textContent = fill(t.ddCalc.results.status, {
      scope: scopeName,
      quote: fmt.eurRange(result.range[0], result.range[1]),
    });
  }
}

export function renderDdFailure(t: Dict, node: HTMLElement): void {
  replace(node, emptyNote(t.ddCalc.results.failure));
}
