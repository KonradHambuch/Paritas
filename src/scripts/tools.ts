import { runTp, type TpRow } from '../lib/tools/tp';
import { runValuation } from '../lib/tools/valuation';
import { runReadiness, type ReadinessAnswers } from '../lib/tools/readiness';
import { runTaxRecovery } from '../lib/tools/taxRecovery';
import {
  SECTOR_KEYS,
  SECTORS,
  TP,
  TP_TYPE_KEYS,
  type CompanySize,
  type ReadinessKey,
  type SectorKey,
  type TpTypeKey,
} from '../lib/tools/config';
import { makeFormat, parseAmount } from '../lib/format';
import { loadDict } from '../i18n/client';
import { fill, langFromDocument } from '../i18n/util';
import { el, replace } from './render/dom';

const lang = langFromDocument();
const fmt = makeFormat(lang);

/* Start the dictionary fetch immediately so it has long resolved before
   anyone finishes typing. Only this page's locale is ever requested. */
const dictReady = loadDict(lang);

const byId = <T extends HTMLElement = HTMLElement>(id: string) =>
  document.getElementById(id) as T | null;

/* ── shared result-panel pieces ─────────────────────────────────── */

const verdict = (text: string, warn = false) =>
  el('div', { class: warn ? 'verdict verdict-warn' : 'verdict' }, text);

const detail = (label: string, value?: Node | string, trailing?: string) =>
  el(
    'div',
    { class: 'detail' },
    el('b', {}, `${label}:`),
    ' ',
    value === undefined
      ? null
      : typeof value === 'string'
        ? el('span', { class: 'figure' }, value)
        : value,
    trailing ? ` ${trailing}` : null,
  );

const note = (text: string) =>
  el('p', { class: 'mt-2 max-w-none text-[0.9375rem] text-muted' }, text);

/** List items may contain author-written <b>; never visitor input. */
const richList = (items: string[]) =>
  el(
    'ul',
    { class: 'plain' },
    ...items.map((html) => {
      const li = el('li', {});
      li.innerHTML = html;
      return li;
    }),
  );

const pending = (text: string) =>
  el(
    'div',
    { class: 'result border-t-line' },
    el('div', { class: 'detail text-muted' }, text),
  );

/* ── 01 · transfer pricing ──────────────────────────────────────── */

function readTpRows(): TpRow[] {
  const rows: TpRow[] = [];
  for (const row of document.querySelectorAll<HTMLElement>('#tp-rows .trrow')) {
    const type = row.querySelector<HTMLSelectElement>('[data-field="type"]')?.value;
    const raw = row.querySelector<HTMLInputElement>('[data-field="value"]')?.value ?? '';
    if (!type || !(TP_TYPE_KEYS as readonly string[]).includes(type)) continue;
    rows.push({ type: type as TpTypeKey, value: parseAmount(raw) });
  }
  return rows;
}

/** Keep the visible numbering contiguous after a removal. */
function renumberTpRows() {
  const rows = [...document.querySelectorAll<HTMLElement>('#tp-rows .trrow')];
  rows.forEach((row, i) => {
    const n = row.querySelector('.trn');
    if (n) n.textContent = `${i + 1}.`;
  });
  const remove = byId('tp-rows')?.querySelectorAll<HTMLButtonElement>('[data-remove]');
  // With one row left, removing it would leave nothing to type into.
  remove?.forEach((b) => (b.disabled = rows.length <= 1));
}

async function renderTp() {
  const out = byId('tp-out');
  if (!out) return;
  const t = (await dictReady).tools.tp;
  const labels = t.types as Record<string, string>;

  const result = runTp(readTpRows());
  if (!result) {
    replace(out, pending(t.result.empty));
    return;
  }

  const head = el(
    'thead',
    {},
    el(
      'tr',
      {},
      el('th', {}, t.result.colTransaction),
      el('th', { class: 'text-right' }, t.result.colValue),
      el('th', { class: 'text-right' }, t.result.colDocumentation),
    ),
  );

  const body = el(
    'tbody',
    {},
    ...result.aggregates.map((a) =>
      el(
        'tr',
        {},
        el('td', {}, labels[a.type] ?? a.type),
        el('td', { class: 'figure text-right' }, fmt.huf(a.total)),
        el(
          'td',
          { class: 'text-right' },
          el(
            'b',
            { class: a.required ? 'font-normal text-warn' : 'font-normal text-ink' },
            a.required ? t.result.yes : t.result.no,
          ),
        ),
      ),
    ),
  );

  const foot = el(
    'tfoot',
    {},
    el(
      'tr',
      {},
      el('td', {}, el('b', { class: 'font-normal text-ink' }, t.result.total)),
      el(
        'td',
        { class: 'figure text-right' },
        el('b', { class: 'font-normal' }, fmt.huf(result.total)),
      ),
      el(
        'td',
        { class: 'text-right' },
        el(
          'b',
          { class: 'font-normal text-ink' },
          fill(result.masterFileRequired ? t.result.masterYes : t.result.masterNo, {
            masterFile: fmt.huf(result.masterFileThreshold),
          }),
        ),
      ),
    ),
  );

  const rows: (Node | null)[] = [
    verdict(
      result.anyRequired ? t.result.required : t.result.notRequired,
      result.anyRequired,
    ),
    el(
      'div',
      { class: 'detail mb-3.5 text-[0.90625rem] text-muted' },
      fill(t.result.thresholdNote, { threshold: fmt.huf(result.threshold) }),
    ),
    el('table', { class: 'tpt' }, head, body, foot),
  ];

  if (result.anyRequired) {
    rows.push(
      detail(
        t.result.penalty,
        fmt.huf(result.penalty),
        `— ${fill(t.result.penaltyNote, {
          penaltyRepeat: fmt.huf(result.penaltyRepeat),
        })}`,
      ),
      note(t.result.deadline),
    );
  } else {
    rows.push(el('p', { class: 'mt-3.5 max-w-none text-sm' }, t.result.armsLength));
  }

  rows.push(note(t.result.aggregationNote));
  replace(out, el('div', { class: 'result' }, ...rows));
}

/* ── 02 · valuation ─────────────────────────────────────────────── */

async function renderValuationInputs() {
  const wrap = byId('cv-inputs');
  const out = byId('cv-out');
  if (!wrap || !out) return;
  const t = (await dictReady).tools.valuation;

  const raw = byId<HTMLSelectElement>('cv-sect')?.value ?? '';
  const sector = (SECTOR_KEYS as string[]).includes(raw) ? (raw as SectorKey) : null;

  if (!sector) {
    replace(wrap);
    replace(out);
    return;
  }

  const { method } = SECTORS[sector];
  const methodLabel = t.methodLabel as Record<string, string>;
  const methodWhy = t.methodWhy as Record<string, string>;
  const baseLabel = t.baseLabel as Record<string, string>;

  /* The method is stated before the input appears, so the reader knows why
     they are being asked for revenue rather than profit. */
  const box = el(
    'div',
    { class: 'methodbox' },
    el('b', {}, methodLabel[method] ?? ''),
    el('br', {}),
    el('span', {}, methodWhy[method] ?? ''),
  );

  const baseField = el(
    'div',
    { class: 'field' },
    el('label', { for: 'cv-base' }, baseLabel[method] ?? ''),
    el('input', {
      id: 'cv-base',
      type: 'text',
      inputmode: 'numeric',
      autocomplete: 'off',
    }),
  );

  const debtField = el(
    'div',
    { class: 'field' },
    el('label', { for: 'cv-debt' }, t.debtLabel),
    el('input', {
      id: 'cv-debt',
      type: 'text',
      inputmode: 'numeric',
      autocomplete: 'off',
    }),
  );

  replace(wrap, box, el('div', { class: 'calc-row mt-5' }, baseField, debtField));

  for (const id of ['cv-base', 'cv-debt']) {
    const input = byId<HTMLInputElement>(id);
    if (!input) continue;
    input.addEventListener('input', () => void renderValuation());
    attachGrouping(input);
  }

  void renderValuation();
}

async function renderValuation() {
  const out = byId('cv-out');
  if (!out) return;
  const t = (await dictReady).tools.valuation;

  const raw = byId<HTMLSelectElement>('cv-sect')?.value ?? '';
  const sector = (SECTOR_KEYS as string[]).includes(raw) ? (raw as SectorKey) : null;

  const result = runValuation({
    sector,
    base: parseAmount(byId<HTMLInputElement>('cv-base')?.value ?? ''),
    netDebt: parseAmount(byId<HTMLInputElement>('cv-debt')?.value ?? ''),
  });

  if (!result) {
    replace(out);
    return;
  }

  const unit = (t.unit as Record<string, string>)[result.method] ?? '';

  const rows: (Node | null)[] = [
    verdict(t.result.heading),
    detail(
      t.result.multiple,
      `${fmt.multipleRange(result.multiple[0], result.multiple[1])} ${unit}`,
    ),
    detail(t.result.enterprise, fmt.hufRange(result.enterprise[0], result.enterprise[1])),
    detail(t.result.equity, fmt.hufRange(result.equity[0], result.equity[1])),
    note(t.result.note),
  ];

  if (result.equityNegativeAtLowEnd) rows.push(note(t.result.negativeNote));

  rows.push(
    el('div', { class: 'detail mt-5' }, el('b', {}, t.result.adjusts)),
    richList([
      t.result.f1,
      t.result.f2,
      t.result.f3,
      t.result.f4,
      t.result.f5,
    ]),
    el('div', { class: 'demo' }, t.result.demo),
  );

  replace(out, el('div', { class: 'result' }, ...rows));
}

/* ── 03 · diligence readiness ───────────────────────────────────── */

const answers: ReadinessAnswers = {};

async function renderReadiness() {
  const out = byId('dd-out');
  if (!out) return;
  const t = (await dictReady).tools.readiness;
  const questions = t.questions as Record<string, string>;
  const why = t.why as Record<string, string>;

  const result = runReadiness(answers);

  if (result.answered === 0) {
    replace(out);
    return;
  }

  if (!result.complete) {
    replace(
      out,
      pending(
        fill(t.result.progress, { answered: result.answered, total: result.total }),
      ),
    );
    return;
  }

  const gapItems = result.gaps.map((gap) =>
    el(
      'li',
      {},
      el('b', { class: 'font-normal text-ink' }, questions[gap.key] ?? gap.key),
      el('br', {}),
      el('span', { class: 'text-[0.9375rem] text-muted' }, why[gap.key] ?? ''),
      el('span', { class: 'wt' }, `${gap.weight} ${t.result.points}`),
    ),
  );

  replace(
    out,
    el(
      'div',
      { class: 'result' },
      verdict(`${t.result.score}: ${result.score} / 100`, result.score < 70),
      el('div', { class: 'detail text-[1.1875rem] text-ink' }, t.result[result.band]),
      el('div', { class: 'detail mt-5' }, el('b', {}, t.result.gapHeading)),
      gapItems.length
        ? el('ul', { class: 'plain' }, ...gapItems)
        : el('p', { class: 'max-w-none text-sm' }, t.result.none),
      note(t.result.note),
    ),
  );
}

/* ── 04 · tax recovery ──────────────────────────────────────────── */

async function renderTax() {
  const out = byId('tax-out');
  if (!out) return;
  const t = (await dictReady).tools.tax;

  const size = (byId<HTMLSelectElement>('tax-size')?.value ?? 'sme') as CompanySize;

  const result = runTaxRecovery({
    revenue: parseAmount(byId<HTMLInputElement>('tax-rev')?.value ?? ''),
    size,
    subcontracted: parseAmount(byId<HTMLInputElement>('tax-sub')?.value ?? ''),
    rd: parseAmount(byId<HTMLInputElement>('tax-rd')?.value ?? ''),
  });

  if (!result) {
    replace(out, pending(t.result.empty));
    return;
  }

  const pct = (n: number) =>
    `${(n * 100).toFixed(1).replace('.', lang === 'hu' ? ',' : '.')}%`;

  const rateValue = result.includesInnovation
    ? el(
        'span',
        {},
        el('span', { class: 'figure' }, pct(result.rate)),
        el(
          'span',
          { class: 'ml-1.5 text-[0.90625rem] text-muted' },
          `(${pct(result.hipaRate)} + ${pct(result.innovationRate)})`,
        ),
      )
    : pct(result.rate);

  const rows: (Node | null)[] = [
    verdict(t.result.heading),
    detail(t.result.base, fmt.huf(result.pool)),
    result.poolCapped ? note(t.result.capped) : null,
    detail(t.result.rate, rateValue),
    detail(t.result.annual, fmt.hufRange(result.annual[0], result.annual[1])),
    el(
      'div',
      { class: 'detail mt-2 text-[1.25rem] text-ink' },
      el('b', {}, `${fill(t.result.total, { years: result.years })}:`),
      ' ',
      el(
        'span',
        { class: 'figure text-[1.25rem] text-accent' },
        fmt.hufRange(result.total[0], result.total[1]),
      ),
    ),
    note(t.result.note),
    el('div', { class: 'detail mt-5' }, el('b', {}, t.result.what)),
    richList([t.result.w1, t.result.w2, t.result.w3, t.result.w4, t.result.w5]),
  ];

  replace(out, el('div', { class: 'result' }, ...rows));
}

/* ── shared input behaviour ─────────────────────────────────────── */

/** Group digits on blur, strip them on focus, so the value stays readable
    without fighting the person typing it. */
function attachGrouping(input: HTMLInputElement) {
  input.addEventListener('blur', () => {
    const raw = input.value.replace(/[^0-9-]/g, '');
    if (raw) input.value = fmt.number(parseAmount(raw));
  });
  input.addEventListener('focus', () => {
    input.value = input.value.replace(/[^0-9-]/g, '');
  });
}

/* ── wiring ─────────────────────────────────────────────────────── */

const tpRowsHost = byId('tp-rows');

if (tpRowsHost) {
  tpRowsHost.addEventListener('input', () => void renderTp());
  tpRowsHost.addEventListener('change', () => void renderTp());

  tpRowsHost.addEventListener('click', (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>('[data-remove]');
    if (!button) return;
    if (tpRowsHost.querySelectorAll('.trrow').length <= 1) return;
    button.closest('.trrow')?.remove();
    renumberTpRows();
    void renderTp();
  });

  tpRowsHost
    .querySelectorAll<HTMLInputElement>('[data-field="value"]')
    .forEach(attachGrouping);

  byId<HTMLButtonElement>('tp-add')?.addEventListener('click', () => {
    const rows = tpRowsHost.querySelectorAll('.trrow');
    if (rows.length >= TP.maxRows) return;
    const clone = rows[0]!.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('input').forEach((i) => (i.value = ''));
    tpRowsHost.append(clone);
    attachGrouping(clone.querySelector<HTMLInputElement>('[data-field="value"]')!);
    renumberTpRows();
    clone.querySelector<HTMLSelectElement>('[data-field="type"]')?.focus();
  });

  renumberTpRows();
}

byId('cv-sect')?.addEventListener('change', () => void renderValuationInputs());

for (const id of ['tax-rev', 'tax-sub', 'tax-rd']) {
  const input = byId<HTMLInputElement>(id);
  if (!input) continue;
  input.addEventListener('input', () => void renderTax());
  attachGrouping(input);
}
byId('tax-size')?.addEventListener('change', () => void renderTax());

byId('dd-q')?.addEventListener('click', (event) => {
  const button = (event.target as Element).closest<HTMLButtonElement>('.ddb');
  if (!button?.dataset.q) return;

  const key = button.dataset.q as ReadinessKey;
  answers[key] = button.dataset.v === '1';

  for (const sibling of document.querySelectorAll<HTMLButtonElement>(
    `.ddb[data-q="${key}"]`,
  )) {
    sibling.setAttribute('aria-checked', String(sibling === button));
  }

  void renderReadiness();
});
