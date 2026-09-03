import { makeFormat } from '../lib/format';
import type { Lang } from '../i18n';

/**
 * Hero gauge animation — decorative only, and isolated in a try/catch exactly
 * as the legacy version was, so a failure here can never affect the
 * calculators below it.
 */
try {
  const lang = ((window as unknown as { __paritasLang?: Lang }).__paritasLang ??
    'en') as Lang;
  const fmt = makeFormat(lang);

  const el = (id: string) => document.getElementById(id);
  const bar1 = el('hg1');
  const bar2 = el('hg2');
  const bar3 = el('hg3');
  const val1 = el('hg1v');
  const val2 = el('hg2v');
  const valX = el('hgx');
  const status1 = el('hg1s');
  const status2 = el('hg2s');

  if (bar1 && bar2 && bar3 && val1 && val2 && valX) {
    /* Illustrative sample figures, unchanged from the legacy page. */
    const t1 = 627_000;
    const thr1 = 465_000;
    const t2 = 205_000;
    const thr2 = 250_000;
    const exposure = 64_000;

    const settle = () => {
      if (status1) status1.textContent = window.__paritasGaugeStatus1 ?? '';
      if (status2) status2.textContent = window.__paritasGaugeStatus2 ?? '';
    };

    const jumpToEnd = () => {
      bar1.style.width = '100%';
      val1.textContent = fmt.eur(t1);
      bar2.style.width = '82%';
      val2.textContent = fmt.eur(t2);
      bar3.style.width = '100%';
      valX.textContent = fmt.eur(exposure);
      settle();
    };

    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      jumpToEnd();
    } else {
      setTimeout(() => {
        const start = performance.now();
        const duration = 1400;
        const frame = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          const e = 1 - Math.pow(1 - p, 3);
          bar1.style.width = `${Math.min(100, (e * t1 * 100) / thr1)}%`;
          val1.textContent = fmt.eur(e * t1);
          bar2.style.width = `${(e * t2 * 100) / thr2}%`;
          val2.textContent = fmt.eur(e * t2);
          bar3.style.width = `${e * 100}%`;
          valX.textContent = fmt.eur(e * exposure);
          if (p < 1) requestAnimationFrame(frame);
          else settle();
        };
        requestAnimationFrame(frame);
      }, 400);
    }
  }
} catch {
  /* decorative only */
}

declare global {
  interface Window {
    __paritasLang?: Lang;
    __paritasGaugeStatus1?: string;
    __paritasGaugeStatus2?: string;
  }
}
