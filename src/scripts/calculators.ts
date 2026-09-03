import { runTp } from '../lib/calc/tp';
import { runDd } from '../lib/calc/dd';
import { FLOW_CAP } from '../lib/calc/config';
import type { DdInput, DdScope, DdSide, ParentKind, TpInput } from '../lib/calc/types';
import { loadDict } from '../i18n/client';
import { langFromDocument } from '../i18n/util';
import { makeFormat } from '../lib/format';
import { renderTp, renderTpFailure } from './render/tp';
import { renderDd, renderDdFailure } from './render/dd';

const lang = langFromDocument();
const fmt = makeFormat(lang);

/* Start fetching this page's dictionary immediately so it is resolved long
   before anyone can fill in a seven-step form and click. Only one locale's
   chunk is ever requested. */
const dictReady = loadDict(lang);

const byId = <T extends HTMLElement = HTMLElement>(id: string) =>
  document.getElementById(id) as T | null;

const radio = (name: string): string | null =>
  document.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`)?.value ?? null;

const checked = (name: string): boolean =>
  document.querySelector<HTMLInputElement>(`input[name="${name}"]`)?.checked ?? false;

const num = (id: string): number => {
  const raw = Number(byId<HTMLInputElement>(id)?.value) || 0;
  return Math.min(FLOW_CAP, Math.max(0, raw));
};

/* ── option pills ────────────────────────────────────────────────
   Native inputs own the state; script only mirrors it into a class. That is
   already the right architecture: it is keyboard-accessible for free, arrow
   keys move within a radio group, and nothing breaks if this script fails. */
document.querySelectorAll<HTMLElement>('.opts').forEach((group) => {
  const sync = () =>
    group.querySelectorAll<HTMLElement>('.opt').forEach((opt) => {
      opt.classList.toggle('sel', !!opt.querySelector<HTMLInputElement>('input')?.checked);
    });

  group.querySelectorAll<HTMLInputElement>('input').forEach((input) => {
    input.addEventListener('change', () => {
      if (input.type === 'radio') {
        // Radios sharing a name may be rendered across several groups.
        document
          .querySelectorAll<HTMLInputElement>(`input[name="${input.name}"]`)
          .forEach((r) => r.closest('.opt')?.classList.toggle('sel', r.checked));
      }
      sync();
      if (input.name === 'parent') {
        const row = byId('flipYearsRow');
        if (row) row.hidden = radio('parent') !== 'us';
      }
    });
  });

  sync();
});

/* Set the initial visibility of the flip-years row from the checked default. */
const flipRow = byId('flipYearsRow');
if (flipRow) flipRow.hidden = radio('parent') !== 'us';

/* ── cross-sell cache ────────────────────────────────────────────
   A cached quote is only valid while its own inputs are untouched. */
let lastTp: number | null = null;
let lastDd: number | null = null;

const invalidate = (formId: string, reset: () => void) => {
  const form = byId(formId);
  form?.addEventListener('input', reset);
  form?.addEventListener('change', reset);
};
invalidate('tpform', () => {
  lastTp = null;
});
invalidate('ddform', () => {
  lastDd = null;
});

/** Only scroll on narrow viewports, where the panel is below the form. */
const revealResults = (id: string) => {
  if (window.innerWidth < 1024) {
    byId(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

/* ── TP ──────────────────────────────────────────────────────────── */
function readTpForm(): TpInput {
  return {
    parent: (radio('parent') ?? 'us') as ParentKind,
    flipYears: Math.max(0, Number(byId<HTMLInputElement>('flipYears')?.value) || 0),
    countries: {
      PL: checked('c_pl'),
      HU: checked('c_hu'),
      CZ: checked('c_cz'),
      RO: checked('c_ro'),
    },
    flows: { dev: num('fDev'), mgmt: num('fMgmt'), loan: num('fLoan'), ip: num('fIp') },
    sizeFactor: Number(radio('rev')) || 1,
    smallPl: radio('smallco') === '1',
    have: {
      agreement: checked('d_agree'),
      benchmark: checked('d_bench'),
      localFile: checked('d_lf'),
      forms5471: checked('d_5471'),
      dataRoom: checked('d_room'),
    },
    fiscalYearEnd: byId<HTMLInputElement>('fyEnd')?.value || '2025-12-31',
    urgency: Number(radio('urgency')) || 1,
    today: new Date().toISOString().slice(0, 10),
  };
}

byId('tpRun')?.addEventListener('click', async () => {
  const quoteNode = byId('tpQuoteOut');
  if (!quoteNode) return;
  let t;
  try {
    t = await dictReady;
    const result = runTp(readTpForm());
    renderTp(
      result,
      t,
      fmt,
      {
        obligations: byId('obligOut')!,
        deadlines: byId('dlOut')!,
        exposure: byId('expOut')!,
        exposureSub: byId('expSub')!,
        quote: quoteNode,
        quoteCta: byId('tpCta'),
        quoteFootnote: byId('tpFn'),
        methodCard: byId('methodCard'),
        methods: byId('methodOut'),
        reco: byId('recoOut'),
        status: byId('tpStatus'),
      },
      { ddTotal: lastDd },
    );
    // Cached even when out of scope — matches the legacy cross-sell behaviour.
    lastTp = result.quote ? result.quote.total : null;
    revealResults('tpResults');
  } catch {
    if (t) renderTpFailure(t, quoteNode);
  }
});

/* ── DD ──────────────────────────────────────────────────────────── */
function readDdForm(): DdInput {
  return {
    side: (radio('ddside') ?? 'buy') as DdSide,
    scope: (radio('ddscope') ?? 'rf') as DdScope,
    entities: Math.max(1, Number(byId<HTMLInputElement>('ddEntities')?.value) || 2),
    revFactor: Number(radio('ddrev')) || 1,
    acctFactor: Number(radio('ddacct')) || 1,
    roomFactor: Number(radio('ddroom')) || 1,
    modelFactor: Number(radio('ddmodel')) || 1,
    consolidation: checked('dd_consol'),
    rush: checked('dd_rush'),
    instrumentLayers: Math.max(0, Number(byId<HTMLInputElement>('ddInstr')?.value) || 0),
    addOns: { tp: checked('dd_tp'), tax: checked('dd_tax'), stamp: checked('dd_stamp') },
  };
}

byId('ddRun')?.addEventListener('click', async () => {
  const quoteNode = byId('ddQuoteOut');
  if (!quoteNode) return;
  let t;
  try {
    t = await dictReady;
    const result = runDd(readDdForm());
    renderDd(
      result,
      t,
      fmt,
      {
        quote: quoteNode,
        cta: byId('ddCta'),
        footnote: byId('ddFn'),
        note: byId('ddNote'),
        sideNote: byId('ddSideNote'),
        status: byId('ddStatus'),
      },
      { tpTotal: lastTp },
    );
    lastDd = result.cachedTotal;
    revealResults('ddResults');
  } catch {
    if (t) renderDdFailure(t, quoteNode);
  }
});
