/* Nav behaviour: theme toggle, mobile disclosure, hash-preserving language
   switch. Everything here is enhancement — the nav is fully usable without it,
   because the menu is a native <details> and the switcher is a real <a>. */

/* ── theme ─────────────────────────────────────────────────────── */
const root = document.documentElement;

document.getElementById('themeToggle')?.addEventListener('click', () => {
  const nowDark = !root.classList.contains('dark');
  root.classList.toggle('dark', nowDark);
  try {
    localStorage.setItem('theme', nowDark ? 'dark' : 'light');
  } catch {
    /* private mode — the toggle still works for this page view */
  }
});

/* Follow the OS while the visitor has not made an explicit choice. */
try {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', (e) => {
    if (localStorage.getItem('theme') === null) {
      root.classList.toggle('dark', e.matches);
    }
  });
} catch {
  /* ignore */
}

/* ── mobile menu ───────────────────────────────────────────────── */
const mobileNav = document.getElementById('mobileNav') as HTMLDetailsElement | null;

if (mobileNav) {
  /* Same-page anchors do not navigate, so without this the panel would stay
     open on top of the section the visitor just asked for. */
  mobileNav.addEventListener('click', (e) => {
    if ((e.target as Element).closest('a')) mobileNav.open = false;
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.open) {
      mobileNav.open = false;
      mobileNav.querySelector('summary')?.focus();
    }
  });
}

/* ── language switch, preserving the anchor ────────────────────── */
/* Capture phase: the href must be rewritten before the browser acts on it. */
document.addEventListener(
  'click',
  (e) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('#langSwitch');
    if (a?.dataset.base) a.href = a.dataset.base + location.hash;
  },
  true,
);
