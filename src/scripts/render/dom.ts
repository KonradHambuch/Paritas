/**
 * Tiny DOM builder.
 *
 * The legacy renderer concatenated HTML strings and assigned them with
 * `innerHTML`, interpolating labels and figures straight into markup. Building
 * nodes instead removes that injection surface entirely and keeps the
 * severity classes as literal strings, which matters for Tailwind: it scans
 * .ts files, so `'bg-sev-red/15'` is found but a constructed `` `bg-sev-${s}` ``
 * would produce nothing at all.
 */

type Child = Node | string | null | undefined | false;

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Record<string, string> = {},
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else node.setAttribute(k, v);
  }
  for (const c of children) {
    if (c === null || c === undefined || c === false) continue;
    node.append(typeof c === 'string' ? document.createTextNode(c) : c);
  }
  return node;
}

export function clear(node: Element): void {
  node.replaceChildren();
}

export function replace(node: Element, ...children: Child[]): void {
  node.replaceChildren(
    ...children
      .filter((c): c is Node | string => c !== null && c !== undefined && c !== false)
      .map((c) => (typeof c === 'string' ? document.createTextNode(c) : c)),
  );
}

/** Severity → utility classes. Literal strings only, one per key. */
export const SEV_PILL = {
  red: 'pill pill-red',
  amber: 'pill pill-amber',
  ok: 'pill pill-ok',
} as const;

export const SEV_TEXT = {
  red: 'text-sev-red',
  amber: 'text-sev-amber',
  ok: 'text-sev-ok',
} as const;

export const DEADLINE_TEXT = {
  overdue: 'text-sev-red',
  soon: 'text-sev-amber',
  ok: 'text-sev-ok',
  onRequest: 'text-sev-amber',
} as const;

/** A "label ......... value" row, the shared shape of every result line. */
export function quoteLine(
  label: Node | string,
  value: Node | string,
  valueClass = 'font-mono text-base font-semibold whitespace-nowrap text-text-strong',
): HTMLElement {
  return el(
    'div',
    { class: 'quote-line' },
    typeof label === 'string' ? el('span', { class: 'text-sm' }, label) : label,
    typeof value === 'string' ? el('span', { class: valueClass }, value) : value,
  );
}

export function emptyNote(text: string): HTMLElement {
  return el('p', { class: 'italic text-sm text-text-muted' }, text);
}

export function show(node: HTMLElement | null, visible: boolean): void {
  if (node) node.hidden = !visible;
}
