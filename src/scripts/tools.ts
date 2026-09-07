import { runTp } from '../lib/tools/tp';
import { runValuation } from '../lib/tools/valuation';
import { runReadiness, type ReadinessAnswers } from '../lib/tools/readiness';
import { SECTOR_KEYS, type ReadinessKey, type SectorKey } from '../lib/tools/config';
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

/** "Label: <figure>value</figure>" — the shape every result row uses. */
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
  el('p', { class: 'mt-3 max-w-none text-[0.9375rem] text-muted' }, text);

const list = (items: string[]) =>
  el('ul', { class: 'plain' }, ...items.map((i) => el('li', {}, i)));

/* ── 01 · transfer pricing ──────────────────────────────────────── */

async function renderTp() {
  const out = byId('tp-out');
  if (!out) return;
  const t = (await dictReady).tools.tp;

  const relValue = byId<HTMLSelectElement>('tp-rel')?.value ?? '';
  const related = relValue === 'yes' ? true : relValue === 'no' ? false : null;
  const amount = parseAmount(byId<HTMLInputElement>('tp-amt')?.value ?? '');

  const r = runTp({ related, amount });
  if (!r) {
    replace(out);
    return;
  }

  const rows: (Node | null)[] = [
    verdict(r.applies ? t.result.over : t.result.under, r.applies),
    detail(t.result.value, fmt.huf(r.amount)),
    detail(t.result.threshold, fmt.huf(r.threshold)),
    detail(r.applies ? t.result.gap : t.result.remaining, fmt.huf(r.difference)),
  ];

  if (r.applies) {
    rows.push(
      el('div', { class: 'detail mt-[18px]' }, el('b', {}, t.result.need)),
      list([
        t.result.need1,
        fill(t.result.need2, { masterFile: fmt.huf(r.masterFileThreshold) }),
        t.result.need3,
      ]),
      detail(t.result.deadline, undefined, t.result.deadlineValue),
      detail(
        t.result.penalty,
        fmt.huf(r.penalty),
        `— ${fill(t.result.penaltyValue, { penaltyRepeat: fmt.huf(r.penaltyRepeat) })}`,
      ),
      detail(t.result.adjustment, undefined, t.result.adjustmentValue),
      note(t.result.meta),
    );
  } else {
    rows.push(
      el('div', { class: 'detail mt-[18px]' }, el('b', {}, t.result.armsLength)),
      el('p', { class: 'max-w-none text-sm' }, t.result.armsLengthNote),
    );
  }

  rows.push(
    note(
      `${t.result.note} ${fill(t.result.simplified, {
        simplified: fmt.huf(r.simplifiedRechargeThreshold),
      })}`,
    ),
  );

  replace(out, el('div', { class: 'result' }, ...rows));
}

/* ── 02 · valuation ─────────────────────────────────────────────── */

async function renderValuation() {
  const out = byId('cv-out');
  if (!out) return;
  const t = (await dictReady).tools.valuation;

  const raw = byId<HTMLSelectElement>('cv-sect')?.value ?? '';
  const sector = (SECTOR_KEYS as string[]).includes(raw) ? (raw as SectorKey) : null;

  const r = runValuation({
    sector,
    ebitda: parseAmount(byId<HTMLInputElement>('cv-ebitda')?.value ?? ''),
    netDebt: parseAmount(byId<HTMLInputElement>('cv-debt')?.value ?? ''),
  });

  if (!r) {
    replace(out);
    return;
  }

  const rows: (Node | null)[] = [
    verdict(t.result.heading),
    detail(t.result.multiple, fmt.multipleRange(r.multiple[0], r.multiple[1])),
    detail(t.result.enterprise, fmt.hufRange(r.enterprise[0], r.enterprise[1])),
    detail(t.result.equity, fmt.hufRange(r.equity[0], r.equity[1])),
    note(t.result.note),
  ];

  /* A negative low-end equity value is arithmetically correct but reads as a
     glitch unless it is named. */
  if (r.equityNegativeAtLowEnd) rows.push(note(t.result.negativeNote));

  rows.push(
    el('div', { class: 'detail mt-[18px]' }, el('b', {}, t.result.adjusts)),
    list([t.result.f1, t.result.f2, t.result.f3, t.result.f4]),
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

  const r = runReadiness(answers);

  if (r.answered === 0) {
    replace(out);
    return;
  }

  if (!r.complete) {
    replace(
      out,
      el(
        'div',
        { class: 'result border-t-line' },
        el(
          'div',
          { class: 'detail text-muted' },
          fill(t.result.progress, { answered: r.answered, total: r.total }),
        ),
      ),
    );
    return;
  }

  const bandLabel = t.result[r.band];

  replace(
    out,
    el(
      'div',
      { class: 'result' },
      verdict(`${t.result.score}: ${r.score} / 100`, r.score < 70),
      el('div', { class: 'detail text-[1.1875rem] text-ink' }, bandLabel),
      el('div', { class: 'detail mt-[18px]' }, el('b', {}, t.result.gapHeading)),
      r.gaps.length
        ? list(r.gaps.map((k: ReadinessKey) => questions[k] ?? k))
        : el('p', { class: 'max-w-none text-sm' }, t.result.none),
      note(t.result.note),
    ),
  );
}

/* ── wiring ─────────────────────────────────────────────────────── */

for (const id of ['tp-rel', 'tp-amt']) {
  byId(id)?.addEventListener('input', renderTp);
}
for (const id of ['cv-sect', 'cv-ebitda', 'cv-debt']) {
  byId(id)?.addEventListener('input', renderValuation);
}

/* Group the digits when a field loses focus and strip them again on focus, so
   the value stays easy to read without fighting the person typing it. */
for (const id of ['tp-amt', 'cv-ebitda', 'cv-debt']) {
  const input = byId<HTMLInputElement>(id);
  if (!input) continue;
  input.addEventListener('blur', () => {
    const raw = input.value.replace(/[^0-9-]/g, '');
    if (raw) input.value = fmt.number(parseAmount(raw));
  });
  input.addEventListener('focus', () => {
    input.value = input.value.replace(/[^0-9-]/g, '');
  });
}

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
