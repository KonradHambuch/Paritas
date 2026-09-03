# Paritas

Bilingual (EN/HU) static marketing site for Paritas — transfer pricing
documentation and financial due diligence for cross-border startups in CEE.

Astro 5 · Tailwind 4 · TypeScript · static output, deployed on Cloudflare Pages.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server on :4321 |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the built output |
| `npm test` | Engine parity, dates, i18n completeness, formatting |

## Layout

```
src/lib/calc/     pure calculator engines — no DOM, no locale, no formatting
src/i18n/         en/ is the source of truth; hu/ is typed against it
src/scripts/      client entry points (calculators, gauge, nav) + DOM renderers
src/components/   ui/ primitives, calc/ form parts, sections/, nav/
tests/            parity harness against the original engine, plus unit tests
legacy/           the original single-file site, kept as the reference
docs/             Hungarian glossary; threshold source citations (to fill in)
```

## Things worth knowing before you change anything

**`src/lib/calc/config.ts` is the only place a threshold or a price may live.**
The prose reads its numbers from there too — the old page claimed Poland's
services line was "~€470k" in one paragraph, "~€464k" in the gauge, and used
464 000 in the engine. `assertRulebookFresh()` fails the build once
`CONFIG.lastVerified` is more than twelve months old.

**The engines return message keys, not sentences.** `runTp` / `runDd` emit
`{ key, params }` descriptors and raw numbers; the renderer resolves them
against the active dictionary and formats the money. That is what keeps the
arithmetic testable in one language and makes a third locale a dictionary-only
change.

**The parity tests are not optional.** `tests/parity.test.ts` runs the original
inline engine (extracted verbatim to `tests/legacy/original-engine.js`) against
a small DOM shim and compares 2 000 generated scenarios with the ported
engines. If you touch pricing logic, this is what proves you did not silently
move someone's quote.

**One deliberate behavioural change from the original:** deadlines are computed
in UTC. The old code built dates with local-time constructors and printed them
with `toISOString()`, which rendered the previous day in every UTC+ timezone —
so every visitor in Poland, Hungary, Czechia or Romania saw every filing
deadline one day early. See `src/lib/calc/dates.ts` and `tests/dates.test.ts`.

**Two token layers in `src/styles/global.css`.** A fixed `ink` scale for the
brand's permanently-dark panels (result cards, gauge, footer, contact), and
semantic roles (`--surface`, `--text`, …) that flip with the theme. The bridge
block uses `@theme inline` — without `inline`, Tailwind bakes the `:root` value
into each utility and both dark mode and `.surface-ink` silently stop working.

**Tailwind scans `.ts` files**, so class names in the renderers must be literal
strings. `SEV_PILL[severity]` works; `` `pill-${severity}` `` produces nothing.

## Known gaps

- `docs/thresholds-sources.md` has no citations yet.
- The Hungarian legal disclaimer needs review — see `docs/glossary-hu.md`.
- The founder guide and Excel toolkit do not exist; both CTAs request them by
  email instead of linking to a missing file.
- "Book a 20-minute slot" points at a mailto. Swap in a scheduler URL when there
  is one (`contact.bookCta` in the dictionaries, `Contact.astro`).
