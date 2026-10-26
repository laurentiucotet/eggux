# Charts

Usage guidelines only. Visual specs live in the Figma components (Chart page). Palette and its
validation: `references/tokens.md` § Data visualization.

## Pick the form first
| Question | Form |
|---|---|
| One number people check (revenue today) | Stat Card, not a chart |
| Change over time | Line (area for one series or a total) |
| Compare categories | Bar (horizontal when labels are long) |
| Rank items (top customers, reasons) | Bar Chart Horizontal, sorted |
| Intensity over two dimensions (day × hour, team × week) | Heatmap |
| One number against a target (quota, budget, SLA) | Gauge, or Progress in tables and dense dashboards |
| Part of a whole with many parts or a hierarchy | Treemap (6+ parts); fewer parts read better as Bar Chart Horizontal |
| Part of a whole over categories | Stacked bar (≤ 4 segments) |
| Trend next to a number | Sparkline |
| Two measures with different units | Two charts, never two y axes |
| Exact values matter more than shape | Table |

Pie and donut only for 2-5 parts of one whole, largest first, the rest in "Other", always with
the legend showing values and percentages; to compare parts, use Bar Chart Horizontal.

## Rules
- Title says what is measured, description the period and unit; footer states the insight.
- Series colors `chart/1..8` in order; color follows the entity, never its rank.
- Legend always for 2+ series, none for one. Label selectively: the end value or the extreme.
- Text (labels, values, legend) uses text tokens, never the series color.
- One y axis (Combo Chart is the one exception), starting at 0 for bars; round ticks (0, 15K, 30K); compact numbers (48.2K).
- Thin marks: bars ≤ 24 px with 4 px radius at the data end; lines 2 px; 2 px gaps between
  touching bars and stacked segments; grid hairlines, recessive.
- Hover: crosshair + tooltip on lines and areas, per-bar tooltip on bars; hit targets bigger
  than the marks. Time range control (7 days / 30 days / 6 months) in the card header.
- Every chart has a table view (toggle or "View data") for screen readers and exact values.
- Empty: say why and what to do ("No sales yet in this period"); loading: Skeleton in the chart's
  shape; error: inline Alert with retry.
- Dark mode uses the same tokens; check the chart on `background/card`.
- Stacked bars start with chart/1 at the base, like every other chart; one dashboard uses chart/1 to chart/6 so series stay distinct.

## Figma
`Bar Chart` (single, grouped, stacked), `Bar Chart Horizontal`, `Line Chart` (line, area),
`Donut Chart` (donut, pie; segments with `arcData`, 2 px surface separators), `Heatmap` (one
hue in 5 opacity steps + muted for zero), `Sparkline`, `Chart Legend` (rows of
`Chart Legend Item`), `Chart Tooltip` (rows of `Chart Tooltip Row`),
`Chart Card` (Actions and Chart slots), `Gauge` (on-track, at-risk, off-track: status written,
not only colored; target tick), `Treemap` (tinted cells with a colored edge so labels stay
readable in every mode). Edit bar heights and line points for real
data. Block: `Block / Analytics` on the App page.
- Radar, Sankey and Choropleth go inside a Chart Card Chart slot; turn off Show legend when the chart labels itself (Sankey, Choropleth).

## Funnel and Scatter
- `Funnel Chart`: drop-off between ordered steps (created → sent → viewed → paid). Each stage
  shows its count and the conversion from the previous one; the overall rate under it. 3-6
  stages, one color. Unordered categories go in `Bar Chart Horizontal`. Min width 480.
- `Scatter Chart`: relation between two numbers per item (amount vs days to pay). Name both
  axes with units; one or two series with a legend; tooltip names the item. Many points: lower
  opacity or a `Heatmap`.

## Waterfall and Combo
- `Waterfall Chart`: a start total, the steps that raise or lower it, the end total (cash bridge,
  budget to actual, revenue to profit). Totals `color/neutral/400`, increases `color/blue/600`,
  decreases `color/red/600` (diverging arms, not series slots); signed label on every bar;
  connector at each running total; at most 8 steps.
- `Combo Chart`: bars (left axis, chart/1) and one line (right axis, chart/2) for two measures in
  different units that explain each other (volume and rate). Both axes from 0 with units on the
  ticks; the legend names each series' axis. The only exception to "one y axis"; anything else is
  two charts.
- Both resize with their container: gridlines stretch, bars and labels scale, axes stay put.
  Examples: "cash bridge", "volume and on-time rate" (in Chart Card).

## Code
shadcn `Chart` (Recharts) with `ChartContainer`, `ChartTooltip`, `ChartLegend`; series colors via
`var(--chart-N)` in `chartConfig`. Donut: `PieChart` with `innerRadius`; horizontal bars:
`BarChart layout="vertical"`; heatmap: a CSS grid of cells with `opacity` steps (or nivo).
Funnel: `FunnelChart` or plain bars with widths from the data; scatter: `ScatterChart` with `XAxis`/`YAxis` `type="number"`.
Waterfall: `BarChart` with a transparent offset bar stacked under each step; combo: `ComposedChart`
with `Bar yAxisId="left"` and `Line yAxisId="right"`.

## Related components
- More forms: `Distribution Bar` for 2-6 parts of one whole in one line, `Bullet Chart` for a
  measure against target and bands (dense KPI reviews), `Radar Chart` for 1-3 items across 5-8
  qualities on one scale, `Sankey Chart` for flows from sources to outcomes (2-3 columns, under 12
  nodes), `Choropleth Map` for one measure by region (one hue, 5 steps). Customizable dashboards put
  each chart in a `Dashboard Widget` (react-grid-layout, 12 columns); fixed reports keep
  `Chart Card`.
