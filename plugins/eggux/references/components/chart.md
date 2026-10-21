# Chart

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Chart Legend Item](#chart-legend-item) | 16 | - |
| [Chart Legend](#chart-legend) | 1 | Items |
| [Chart Tooltip Row](#chart-tooltip-row) | 8 | - |
| [Chart Tooltip](#chart-tooltip) | 1 | Rows |
| [Bar Chart](#bar-chart) | 3 | - |
| [Line Chart](#line-chart) | 2 | - |
| [Sparkline](#sparkline) | 2 | - |
| [Chart Card](#chart-card) | 1 | Actions, Chart |
| [Donut Chart](#donut-chart) | 2 | - |
| [Bar Chart Horizontal](#bar-chart-horizontal) | 1 | - |
| [Heatmap](#heatmap) | 1 | - |
| [Gauge](#gauge) | 3 | - |
| [Treemap](#treemap) | 1 | - |
| [Funnel Chart](#funnel-chart) | 1 | - |
| [Scatter Chart](#scatter-chart) | 2 | - |

On the Figma page: "Stress test / Funnel and Scatter"

## Chart Legend Item

Component set · 16 variants · default size 50 × 16

Legend entry: colored key + label in text color (never the series color). swatch for bars/areas, line for line charts. Series = chart/N token, assigned in order.

| Variant property | Values |
|---|---|
| Key | swatch, line |
| Series | 1, 2, 3, 4, 5, 6, 7, 8 |

| Property | Type | Default |
|---|---|---|
| Label | text | Series |

Tokens and styles:
- Colors: `chart/1`, `chart/2`, `chart/3`, `chart/4`, `chart/5`, `chart/6`, `chart/7`, `chart/8`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/1_5`, `spacing/2`, `spacing/3`
- Radius: `radius/full`, `radius/sm`
- Text styles: `ui/caption`

## Chart Legend

Component · 1 variant · default size 187 × 16

Legend row above or below the plot. Clicking an item isolates the series in code.

Slots (fill them in the instance, never detach): `Items`

Built from: `Chart Legend Item`

Tokens and styles:
- Spacing and size: `spacing/4`

Guides: [charts](../../skills/build-ui/components/charts.md)

## Chart Tooltip Row

Component set · 8 variants · default size 160 × 16

One row in a Chart Tooltip: series swatch (chart/1..8), label, value aligned right. One row per visible series, in legend order.

| Variant property | Values |
|---|---|
| Series | 1, 2, 3, 4, 5, 6, 7, 8 |

| Property | Type | Default |
|---|---|---|
| Label | text | Series |
| Value | text | 1,284 |

Tokens and styles:
- Colors: `chart/1`, `chart/2`, `chart/3`, `chart/4`, `chart/5`, `chart/6`, `chart/7`, `chart/8`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/2`
- Radius: `radius/sm`
- Text styles: `ui/caption`, `ui/label-small`

## Chart Tooltip

Component · 1 variant · default size 176 × 92

Hover tooltip: crosshair on line/area, per-mark on bar. Title = the x value; one row per series; values in text color.

| Property | Type | Default |
|---|---|---|
| Title | text | March 2026 |

Slots (fill them in the instance, never detach): `Rows`

Built from: `Chart Tooltip Row`

Tokens and styles:
- Colors: `background/popover`, `border/default`, `foreground/default`
- Spacing and size: `spacing/1`, `spacing/1_5`, `spacing/2`
- Radius: `radius/md`
- Text styles: `ui/label-small`

Guides: [charts](../../skills/build-ui/components/charts.md)

## Bar Chart

Component set · 3 variants · default size 560 × 240

Vertical bars (shadcn Chart / Recharts BarChart). Bars max 24 wide, 4 px radius at the data end only, 2 px surface gap between touching bars and stacked segments. single = one series in chart/1 (no legend); grouped = up to 4 series; stacked = part-to-whole. Edit bar heights for real data; y ticks round (0, 15K, 30K).

| Variant property | Values |
|---|---|
| Type | single, grouped, stacked |

Tokens and styles:
- Colors: `border/default`, `border/input`, `chart/1`, `chart/2`, `chart/3`, `foreground/muted`
- Spacing and size: `border-width/DEFAULT`, `spacing/10`, `spacing/2`
- Radius: `radius/sm`
- Text styles: `ui/caption`

Guides: [charts](../../skills/build-ui/components/charts.md)

Code: shadcn `Chart` (Recharts) (`var(--chart-N)`)

## Line Chart

Component set · 2 variants · default size 560 × 240

Change over time (Recharts LineChart / AreaChart). Lines 2 px, round joins; end dot 8 px with a 2 px surface ring; area wash = series at 10%. One y axis only. Label the end value or the extreme, never every point.

| Variant property | Values |
|---|---|
| Type | line, area |

Tokens and styles:
- Colors: `background/default`, `border/default`, `border/input`, `chart/1`, `chart/2`, `foreground/muted`
- Spacing and size: `border-width/2`, `border-width/DEFAULT`, `spacing/10`, `spacing/2`
- Text styles: `ui/caption`

Guides: [charts](../../skills/build-ui/components/charts.md)

Code: shadcn `Chart` (Recharts) (`var(--chart-N)`)

## Sparkline

Component set · 2 variants · default size 120 × 32

Trend without axes for stat cards and table cells (12 points). Direction is told by the delta text next to it (+12%), not by color.

| Variant property | Values |
|---|---|
| Trend | up, down |

Tokens and styles:
- Colors: `background/default`, `chart/1`
- Spacing and size: `border-width/2`

Guides: [charts](../../skills/build-ui/components/charts.md)

Code: shadcn `Chart` (Recharts) (`var(--chart-N)`)

## Chart Card

Component · 1 variant · default size 640 × 474

Card around one chart (shadcn chart card): title says what is measured, description the period; time range in Actions; legend for 2+ series; footer states the insight in words. Every chart needs a table view in code.

| Property | Type | Default |
|---|---|---|
| Title | text | Revenue vs costs |
| Description | text | January - June 2026 |
| Insight | text | Profit up 21% vs last half-year |
| Note | text | Costs grew slower than revenue every month since March. |
| Show legend | boolean | true |
| Show footer | boolean | true |

Slots (fill them in the instance, never detach): `Actions`, `Chart`

Built from: `Bar Chart`, `Chart Legend`, `Toggle Group`. Icons: trending-up

Tokens and styles:
- Colors: `background/card`, `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/4`, `spacing/6`
- Radius: `radius/xl`
- Text styles: `body/small`, `heading/h4`, `ui/label`

Guides: [charts](../../skills/build-ui/components/charts.md)

## Donut Chart

Component set · 2 variants · default size 440 × 200

Part of a whole (share by entity, status mix). 2-5 segments, largest first, starting at 12 o'clock; the rest goes into "Other". Always show the legend with values and percentages; donut puts the total in the center. Comparisons between parts read better in Bar Chart Horizontal. Set segment angles with arcData; 2 px surface separators.

| Variant property | Values |
|---|---|
| Type | donut, pie |

| Property | Type | Default |
|---|---|---|
| Total | text | €1.84M |
| Total label | text | Revenue |

Tokens and styles:
- Colors: `background/card`, `chart/1`, `chart/2`, `chart/3`, `chart/4`, `foreground/default`, `foreground/muted`
- Spacing and size: `border-width/2`, `spacing/2`, `spacing/8`
- Radius: `radius/sm`
- Text styles: `heading/h3`, `ui/caption`, `ui/label`

Guides: [charts](../../skills/build-ui/components/charts.md)

Code: Recharts `PieChart` (`innerRadius`), `BarChart layout="vertical"`

## Bar Chart Horizontal

Component · 1 variant · default size 560 × 136

Ranking and comparison of categories with long names (top customers, regions, reasons). Sorted by value, labels left, values right, one color (chart/1); highlight one bar with chart/2 only to make a point. Max ~10 rows; more goes to a table. Set bar width as a share of the track.

Tokens and styles:
- Colors: `chart/1`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/2`, `spacing/3`, `spacing/4`
- Text styles: `ui/caption`

Guides: [charts](../../skills/build-ui/components/charts.md)

Code: Recharts `PieChart` (`innerRadius`), `BarChart layout="vertical"`

## Heatmap

Component · 1 variant · default size 416 × 268

Intensity over two dimensions (weekday × hour, team × week). One hue (chart/1) in 5 steps of opacity plus muted for zero; legend from fewer to more; tooltip with the exact value on hover. Never use red/green scales.

Tokens and styles:
- Colors: `background/muted`, `chart/1`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/3`, `spacing/7`
- Radius: `radius/sm`
- Text styles: `ui/caption`

Guides: [charts](../../skills/build-ui/components/charts.md)

Code: custom CSS grid or nivo `HeatMap`

## Gauge

Component set · 3 variants · default size 240 × 176

Progress of one number toward a target (quota, budget, SLA). Status is written, not only colored (On track, At risk, Off track); the tick marks the target. Use sparingly: a Progress bar or Stat Card is clearer in tables and dashboards with many numbers.

| Variant property | Values |
|---|---|
| Status | on track, at risk, off track |

| Property | Type | Default |
|---|---|---|
| Label | text | Q4 revenue vs target |

Tokens and styles:
- Colors: `background/destructive`, `background/muted`, `background/warning`, `chart/1`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/2`
- Text styles: `heading/h2`, `ui/caption`, `ui/label`

Guides: [charts](../../skills/build-ui/components/charts.md)

Code: Recharts `RadialBarChart` (half circle) or custom SVG arc

## Treemap

Component · 1 variant · default size 560 × 320

Part of a whole with many parts or a hierarchy (revenue by product, spend by vendor). Rectangle area = value, largest top-left; label inside when it fits, otherwise on hover. Tinted fills with a colored edge keep text readable in every mode. For under 6 parts, a Bar Chart Horizontal is easier to compare.

Tokens and styles:
- Colors: `chart/1`, `chart/2`, `chart/3`, `chart/4`, `chart/5`, `chart/6`, `foreground/default`, `foreground/muted`
- Radius: `radius/sm`
- Text styles: `ui/caption`, `ui/label`

Guides: [charts](../../skills/build-ui/components/charts.md)

Code: Recharts `Treemap` with a custom cell renderer

## Funnel Chart

Component · 1 variant · default size 560 × 200

Drop-off between ordered steps (created → sent → viewed → paid, sign-up → active → paying). Each stage: name, count, a bar sized to its count, and the conversion from the previous stage; the overall rate at the bottom. 3 to 6 stages, one series (chart/1). Not for unordered categories: use Bar Chart Horizontal. Code: Recharts FunnelChart or plain bars. Min width 480; stage names wrap to two lines, then truncate.

Tokens and styles:
- Colors: `chart/1`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/2`, `spacing/3`
- Radius: `radius/sm`
- Text styles: `ui/caption`, `ui/label`

Guides: [charts](../../skills/build-ui/components/charts.md)

## Scatter Chart

Component set · 2 variants · default size 560 × 264

Relation between two numbers per item (invoice amount vs days to pay, deal size vs cycle length). One point per item; one or two series (chart/1, chart/2) with a Chart Legend for two. Name both axes with units; start at zero unless the range says otherwise. Hover shows the item in a Chart Tooltip. Over 500 points: lower opacity or use Heatmap. Code: Recharts ScatterChart.

| Variant property | Values |
|---|---|
| Series | one, two |

| Property | Type | Default |
|---|---|---|
| X title | text | X: invoice amount (EUR) |
| Y title | text | Y: days to pay |

Tokens and styles:
- Colors: `border/default`, `border/input`, `chart/1`, `chart/2`, `foreground/muted`
- Spacing and size: `spacing/10`, `spacing/2`
- Text styles: `ui/caption`

Guides: [charts](../../skills/build-ui/components/charts.md)
