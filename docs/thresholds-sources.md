# Threshold and pricing sources

`src/lib/calc/config.ts` is the single source for every regulatory constant and
every price on the site. The values were carried over unchanged from the
original single-file page; **the citations below are still to be filled in.**

For a firm whose pitch is that every important number is traceable to a rule, a
source or a labelled assumption, an unsourced constant is the one thing the
repository cannot afford. `assertRulebookFresh()` runs on every build and fails
it once `lastVerified` is more than twelve months old.

## Documentation thresholds

| Constant | Value (EUR) | Stands for | Statute | Verified |
|---|---|---|---|---|
| `thresholds.PL_serv` | 464 000 | PLN 2M services line | _to be cited_ | 2026-08 |
| `thresholds.PL_fin` | 2 320 000 | PLN 10M financial line | _to be cited_ | 2026-08 |
| `thresholds.HU` | 380 000 | HUF 150M aggregate | _to be cited_ | 2026-08 |
| `thresholds.RO_serv` | 250 000 | RO services band | _to be cited_ | 2026-08 |
| `thresholds.RO_int` | 200 000 | RO interest band | _to be cited_ | 2026-08 |
| `thresholds.RO_loanInterestProxy` | 5% | assumed annual interest on principal | assumption, labelled in the UI | 2026-08 |
| `thresholds.warn` | 70% | "approaching" band | internal policy | — |

## Open question for the Hungarian page

`thresholds.HU` is an EUR approximation of a HUF statutory figure. A Hungarian
reader — and their auditor — will cite the HUF number. Options:

1. Keep EUR only (consistent with the firm quoting in EUR everywhere).
2. Show the statutory HUF figure with EUR in parentheses on the `/hu/` page.

Option 2 needs a dated FX assumption and a policy for refreshing it, and would
add a currency dimension to `CONFIG`. Not implemented — decide before launch.

## Exposure and pricing

`exposure.*` and `tp.*` / `dd.*` are commercial policy rather than statute,
except the penalty figures (`plFiscal`, `huPerRecord`, `usFormPerYear`) which
approximate published penalty ranges and should be cited alongside the
thresholds above.
