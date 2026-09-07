/* Nav behaviour. Everything here is enhancement: the menu is a native
   <details> and the language switcher is a real <a>, so both work with no
   script at all. */

const mobileNav = document.getElementById('mobileNav') as HTMLDetailsElement | null;

if (mobileNav) {
  /* Same-page anchors do not navigate, so without this the panel would stay
     open on top of the section the reader just asked for. */
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

/* Carry the reader's place across a language switch. Capture phase, so the
   href is rewritten before the browser acts on it. */
document.addEventListener(
  'click',
  (e) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('#langSwitch');
    if (a?.dataset.base) a.href = a.dataset.base + location.hash;
  },
  true,
);
