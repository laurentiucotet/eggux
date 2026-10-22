# Pattern: reports

**Problem:** dashboards get used as reports: numbers without a period, comparison or source,
which nobody can export, schedule or trust.
**Heuristic:** match with the real world, visibility of system status, consistency.

## Dashboard or report
- Dashboard: live overview for the people doing the work; few numbers, links to act.
- Report: a fixed question over a fixed period for people who decide; comparable, exportable,
  schedulable. Use `Block / Report`.

## Rules
- Header states scope and period ("All entities · EUR · 1 Jul - 30 Sep 2026") and when the data
  was updated. The period picker has presets (this quarter, last quarter, year to date).
- Every KPI has a comparison (previous period or target) and says whether up is good.
- One trend chart for the main measure, then a breakdown table with totals and share.
- Numbers right-aligned, same decimals, units in the header; percentages with one decimal.
- Export (PDF for reading, CSV / XLSX for analysis) and Schedule (recipients, frequency,
  format) in the header.
- Drill down: clicking a breakdown row filters the list behind it.
- Charts follow `components/charts.md`; every chart has a table view.

## Figma
`Block / Report` on the Enterprise page: header with period and actions, Stat Cards, Chart Card,
breakdown grid with Progress for share and a total row.
- Lead a dashboard or report with a `Metric Strip` (3-5 `Metric Strip Item`s, one period said
  once, Show divider off on the first) when Stat Cards would take too much space; each change
  uses `Trend Indicator`, where Trend says the direction and Tone whether it is good. Use
  `Bullet Chart` stacks for KPI reviews against targets.
- Rankings (top customers, teams, products) use `Leaderboard Row`: rank, avatar, name and value,
  sorted by the value, 5-10 rows with "View all".
