# Charts

Usage guidelines only. Visual specs live in the Figma components (Chart page). Palette and its
validation: `references/tokens.md` § Data visualization.

## Pick the form first
| Question | Form |
|---|---|
| One number people check (revenue today) | Stat Card, not a chart |
| Change over time | Line (area for one series or a total) |
| Compare categories | Bar (horizontal when labels are long) |
| Part of a whole over categories | Stacked bar (≤ 4 segments) |
| Trend next to a number | Sparkline |
| Two measures with different units | Two charts, never two y axes |
| Exact values matter more than shape | Table |

Pie and donut only for 2-3 parts of one whole; otherwise a stacked bar.

## Rules
- Title says what is measured, description the period and unit; footer states the insight.
- Series colors `chart/1..8` in order; color follows the entity, never its rank.
- Legend always for 2+ series, none for one. Label selectively: the end value or the extreme.
- Text (labels, values, legend) uses text tokens, never the series color.
- One y axis, starting at 0 for bars; round ticks (0, 15K, 30K); compact numbers (48.2K).
- Thin marks: bars ≤ 24 px with 4 px radius at the data end; lines 2 px; 2 px gaps between
  touching bars and stacked segments; grid hairlines, recessive.
- Hover: crosshair + tooltip on lines and areas, per-bar tooltip on bars; hit targets bigger
  than the marks. Time range control (7 days / 30 days / 6 months) in the card header.
- Every chart has a table view (toggle or "View data") for screen readers and exact values.
- Empty: say why and what to do ("No sales yet in this period"); loading: Skeleton in the chart's
  shape; error: inline Alert with retry.
- Dark mode uses the same tokens; check the chart on `background/card`.

## Figma
`Bar Chart` (single, grouped, stacked), `Line Chart` (line, area), `Sparkline`, `Chart Legend`,
`Chart Tooltip`, `Chart Card` (Actions and Chart slots). Edit bar heights and line points for real
data. Block: `Block / Analytics` on the App page.

## Code
shadcn `Chart` (Recharts) with `ChartContainer`, `ChartTooltip`, `ChartLegend`; series colors via
`var(--chart-N)` in `chartConfig`.
