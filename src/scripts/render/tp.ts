import type { Dict } from '../../i18n/en';
import { fill, resolve } from '../../i18n/util';
import type { Formatter } from '../../lib/format';
import type { Country, FlowKind, TpResult } from '../../lib/calc/types';
import {
  DEADLINE_TEXT,
  el,
  emptyNote,
  quoteLine,
  replace,
  SEV_PILL,
  show,
} from './dom';

/** Resolve a `{key, params}` descriptor against the active dictionary. */
function msg(
  dict: Record<string, unknown>,
  key: string,
  params: Record<string, unknown> = {},
): string {
  const leaf = key.split('.').reduce<unknown>(
    (acc, part) => (acc as Record<string, unknown>)?.[part],
    dict,
  );
  if (leaf === undefined) return key; // never throw in front of a visitor
  return resolve(leaf as string | ((p: never) => string), params);
}

export function renderTp(
  result: TpResult,
  t: Dict,
  fmt: Formatter,
  nodes: {
    obligations: HTMLElement;
    deadlines: HTMLElement;
    exposure: HTMLElement;
    exposureSub: HTMLElement;
    quote: HTMLElement;
    quoteCta: HTMLElement | null;
    quoteFootnote: HTMLElement | null;
    methodCard: HTMLElement | null;
    methods: HTMLElement | null;
    reco: HTMLElement | null;
    status: HTMLElement | null;
  },
  bundle: { ddTotal: number | null },
): void {
  const e = t.engine;

  /* ── obligations ───────────────────────────────────────────── */
  replace(
    nodes.obligations,
    ...result.obligations.map((o) => {
      const p = o.text.params ?? {};
      const flowKey = p.flow as FlowKind | undefined;
      const flowLabel = flowKey
        ? o.text.key.endsWith('Indicative')
          ? e.flowIndicative[flowKey]
          : e.flow[flowKey]
        : undefined;

      const text = msg(e as unknown as Record<string, unknown>, o.text.key, {
        ...p,
        country: p.country as Country,
        flow: flowLabel ?? p.flow,
        value: typeof p.value === 'number' ? fmt.eur(p.value) : p.value,
        pct: typeof p.pct === 'number' ? fmt.pctInt(p.pct) : p.pct,
      });

      return el(
        'div',
        { class: 'oblig-row' },
        el('span', { class: 'pill pill-cat' }, e.category[o.category]),
        el('span', { class: SEV_PILL[o.severity] }, msg(e as unknown as Record<string, unknown>, o.tag.key)),
        el('span', {}, text),
      );
    }),
  );

  /* ── deadlines ─────────────────────────────────────────────── */
  if (result.deadlines.length === 0) {
    replace(nodes.deadlines, emptyNote(t.tpCalc.results.deadlinesNone));
  } else {
    replace(
      nodes.deadlines,
      ...result.deadlines.map((d) => {
        const name = e.deadline[d.key];
        if (d.date === null || d.daysRemaining === null) {
          return quoteLine(
            name,
            el(
              'span',
              { class: `font-mono text-sm ${DEADLINE_TEXT.onRequest}` },
              e.deadline.onRequest,
            ),
          );
        }
        const label = el(
          'span',
          { class: 'text-sm' },
          `${name} · `,
          el('time', { datetime: d.date }, fmt.date(d.date)),
        );
        const txt =
          d.daysRemaining < 0
            ? e.deadline.daysOverdue({ days: Math.abs(d.daysRemaining) })
            : e.deadline.daysLeft({ days: d.daysRemaining });
        return quoteLine(
          label,
          el('span', { class: `font-mono text-sm ${DEADLINE_TEXT[d.status]}` }, txt),
        );
      }),
    );
  }

  /* ── exposure ──────────────────────────────────────────────── */
  if (result.outOfScope) {
    nodes.exposure.textContent = t.tpCalc.results.exposureManual;
  } else if (result.exposure.total > 0) {
    nodes.exposure.textContent = fmt.eurRange(result.exposure.low, result.exposure.high);
  } else {
    nodes.exposure.textContent = t.tpCalc.results.exposureNone;
  }

  nodes.exposureSub.textContent =
    result.exposure.parts.length > 0
      ? result.exposure.parts
          .map((part) =>
            msg(e as unknown as Record<string, unknown>, part.key, {
              ...part.params,
              amount:
                typeof part.params?.amount === 'number'
                  ? fmt.eurK(part.params.amount)
                  : part.params?.amount,
            }),
          )
          .join(' · ')
      : t.tpCalc.results.exposureSubEmpty;

  /* ── quote ─────────────────────────────────────────────────── */
  const q = result.quote;

  if (result.outOfScope) {
    replace(nodes.quote, emptyNote(t.tpCalc.results.quoteOutOfScope));
    show(nodes.quoteCta, false);
    show(nodes.quoteFootnote, false);
  } else if (!q) {
    replace(nodes.quote, emptyNote(t.tpCalc.results.quoteNoScope));
    show(nodes.quoteCta, false);
    show(nodes.quoteFootnote, false);
  } else {
    const rows: HTMLElement[] = q.items.map((item) =>
      quoteLine(
        msg(e as unknown as Record<string, unknown>, item.key, item.params ?? {}),
        fmt.eurK(item.amount * q.modifier),
      ),
    );

    rows.push(
      quoteLine(
        el('span', { class: 'text-sm' }, el('b', {}, t.tpCalc.results.quoteTotal)),
        el(
          'span',
          {},
          el(
            'span',
            { class: 'font-mono text-xs text-text-muted line-through' },
            e.quote.midTierTypically({ range: fmt.eurRange(q.anchor[0], q.anchor[1]) }),
          ),
          ' ',
          el(
            'span',
            { class: 'font-mono text-base font-semibold whitespace-nowrap text-text-strong' },
            fmt.eurRange(q.range[0], q.range[1]),
          ),
        ),
      ),
    );

    if (bundle.ddTotal !== null) {
      rows.push(
        quoteLine(
          el(
            'span',
            { class: 'text-sm' },
            el('b', {}, e.quote.bundleWithDd),
            ` ${e.quote.bundleSuffix}`,
          ),
          fmt.eurK((q.total + bundle.ddTotal) * 0.85),
        ),
      );
    }

    replace(nodes.quote, ...rows);
    show(nodes.quoteCta, true);
    show(nodes.quoteFootnote, true);
  }

  /* ── benchmarking methods ──────────────────────────────────── */
  if (nodes.methodCard && nodes.methods) {
    if (result.methods.length > 0) {
      replace(
        nodes.methods,
        ...result.methods.map((m) => {
          const method = e.method[m.flow];
          return el(
            'div',
            { class: 'quote-line' },
            el(
              'span',
              { class: 'text-sm' },
              el('b', {}, method.name),
              el('br', {}),
              el(
                'span',
                { class: 'text-xs text-text-muted' },
                `${method.method} · ${method.party} · ${method.pli}`,
              ),
            ),
          );
        }),
      );
      show(nodes.methodCard, true);
    } else {
      show(nodes.methodCard, false);
    }
  }

  /* ── recommendation ────────────────────────────────────────── */
  if (nodes.reco) {
    const r = e.reco[result.recommendation];
    replace(
      nodes.reco,
      el('h4', { class: 'mb-1.5 text-lg font-semibold' }, r.title),
      el('p', { class: 'text-sm text-text-muted' }, r.body),
    );
    show(nodes.reco, true);
  }

  /* ── screen-reader summary ─────────────────────────────────── */
  /* The legacy page put aria-live on the container wrapping all six result
     cards, so a run announced roughly sixty lines. One sentence here; the
     detail panels are aria-live="off". */
  if (nodes.status) {
    nodes.status.textContent =
      q && !result.outOfScope
        ? fill(t.tpCalc.results.status, {
            obligations: result.obligations.length,
            deadlines: result.deadlines.length,
            quote: fmt.eurRange(q.range[0], q.range[1]),
          })
        : fill(t.tpCalc.results.statusNoQuote, {
            obligations: result.obligations.length,
            deadlines: result.deadlines.length,
          });
  }
}

export function renderTpFailure(t: Dict, node: HTMLElement): void {
  replace(node, emptyNote(t.tpCalc.results.failure));
}
