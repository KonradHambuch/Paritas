# Sources for the published numbers

`src/lib/tools/config.ts` is the single source for every figure the site
publishes. The values came from the reference pages; **the citations below are
still to be filled in.**

For a firm whose pitch is that numbers hold up when somebody else looks at
them, an unsourced threshold is the one thing the repository cannot afford.
`assertRulebookFresh()` runs on every build and fails it once
`RULEBOOK.lastVerified` is more than twelve months old.

## Transfer pricing (Hungary)

| Constant | Value | Stands for | Statute | Verified |
|---|---|---|---|---|
| `TP.threshold` | 150,000,000 HUF | documentation threshold per aggregated transaction, per tax year | _to be cited_ | 2026-09 |
| `TP.masterFile` | 500,000,000 HUF | master file trigger on total related-party transactions | _to be cited_ | 2026-09 |
| `TP.simplifiedRecharge` | 500,000,000 HUF | cost recharges above this may use a simplified local file | _to be cited_ | 2026-09 |
| `TP.penalty` | 5,000,000 HUF | default penalty per transaction and per document | _to be cited_ | 2026-09 |
| `TP.penaltyRepeat` | 10,000,000 HUF | penalty for a repeated default | _to be cited_ | 2026-09 |

The filing deadline the calculator states — the corporate tax return date,
31 May for calendar-year taxpayers — should be cited alongside these.

## Valuation multiples

`SECTOR_MULTIPLES` are indicative EBITDA bands for Hungarian mid-market
transactions. They are market observation rather than statute, so what they
need is a stated basis and a date: which transactions, over what period, and
who compiled them. Without that the calculator asserts a range it cannot
defend, which is the failure the site's own copy warns about.

## Readiness weights

`READINESS_WEIGHTS` are a judgement about which gaps cost the most in a
transaction, not a measured quantity. They sum to 100, which the tests assert.
They are worth revisiting after a handful of real engagements.
