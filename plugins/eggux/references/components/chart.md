# Chart

Generated from the EGG UI master library on 2026-10-22 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Bar Chart](#bar-chart) | 3 | - |
| [Bar Chart Horizontal](#bar-chart-horizontal) | 1 | - |
| [Line Chart](#line-chart) | 2 | - |
| [Sparkline](#sparkline) | 2 | - |
| [Donut Chart](#donut-chart) | 2 | - |
| [Heatmap](#heatmap) | 1 | - |
| [Gauge](#gauge) | 3 | - |
| [Treemap](#treemap) | 1 | - |
| [Funnel Chart](#funnel-chart) | 1 | - |
| [Scatter Chart](#scatter-chart) | 2 | - |
| [Chart Legend](#chart-legend) | 1 | Items |
| [Chart Legend Item](#chart-legend-item) | 16 | - |
| [Chart Tooltip](#chart-tooltip) | 1 | Rows |
| [Chart Tooltip Row](#chart-tooltip-row) | 8 | - |
| [Chart Card](#chart-card) | 1 | Actions, Chart |
| [Waterfall Chart](#waterfall-chart) | 1 | - |
| [Combo Chart](#combo-chart) | 1 | - |
| [Dashboard Widget](#dashboard-widget) | 1 | Content |
| [Distribution Bar](#distribution-bar) | 1 | - |
| [Bullet Chart](#bullet-chart) | 1 | - |
| [Radar Chart](#radar-chart) | 1 | - |
| [Sankey Chart](#sankey-chart) | 1 | - |
| [Choropleth Map](#choropleth-map) | 1 | - |

On the Figma page: "Example / activity by weekday and hour", "Example / cash bridge", "Example / in analytics", "Example / in bento grid", "Example / in executive dashboard", "Example / invoice flow", "Example / payment behavior", "Example / payments analytics", "Example / quarter target", "Example / revenue by product", "Example / spend by vendor", "Example / trend next to a metric", "Example / values on hover", "Example / volume and on-time rate", "Stress test / Bar Chart", "Stress test / Bar Chart Horizontal", "Stress test / Bullet Chart", "Stress test / Chart Card", "Stress test / Chart Legend", "Stress test / Chart Tooltip", "Stress test / Choropleth Map", "Stress test / Combo Chart", "Stress test / Dashboard Widget", "Stress test / Distribution Bar", "Stress test / Donut Chart", "Stress test / Funnel and Scatter", "Stress test / Gauge", "Stress test / Heatmap", "Stress test / Line Chart", "Stress test / Radar Chart", "Stress test / Sankey Chart", "Stress test / Scatter Chart", "Stress test / Sparkline", "Stress test / Treemap", "Stress test / Waterfall Chart"

## Bar Chart

Component set · 3 variants · default size 560 × 240

Vertical bars (shadcn Chart / Recharts BarChart). Bars max 24 wide, 4 px radius at the data end only, 2 px surface gap between touching bars and stacked segments. single = one series in chart/1 (no legend); grouped = up to 4 series; stacked = part-to-whole. Edit bar heights for real data; y ticks round (0, 15K, 30K).

**Use for**

- Compare values across categories or periods, such as revenue per month
- Type=single: one series in chart/1, no legend
- Type=grouped: up to 4 series side by side
- Type=stacked: part of a whole per category, up to 4 segments

**Not for**

- Trend over time: use Line Chart
- Long category names or rankings: use Bar Chart Horizontal
- One number people check: use Stat Card
- Two measures with different units: Combo Chart when they explain each other, otherwise two charts

**Anatomy**

1. Y axis with round ticks (0, 15K, 30K)
2. Grid hairlines, recessive
3. Bars, max 24 wide, 4 px radius at the data end only
4. X axis labels
5. Chart Legend for 2 or more series (in Chart Card)

**Content and behavior**

- One y axis, starting at 0 (two axes only in Combo Chart)
- 2 px surface gap between touching bars and stacked segments
- Series colors chart/1..8 in order; color follows the entity, never its rank
- Labels and values use text tokens, never the series color
- Compact numbers (48.2K); edit bar heights for real data
- Empty: say why ("No sales yet in this period"); loading: Skeleton in the chart shape

**Accessibility**

- Every chart has a table view (toggle or "View data") for screen readers and exact values
- Color never carries meaning alone: the legend and labels name each series
- Per-bar tooltip on hover; hit targets bigger than the bars
- Check contrast on background/card in light and dark mode

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

## Bar Chart Horizontal

Component · 1 variant · default size 560 × 136

Ranking and comparison of categories with long names (top customers, regions, reasons). Sorted by value, labels left, values right, one color (chart/1); highlight one bar with chart/2 only to make a point. Max ~10 rows; more goes to a table. Set bar width as a share of the track.

**Use for**

- Rank items: top customers, regions, reasons for cancellation
- Category names too long for a vertical axis
- Compare parts of a whole with fewer than 6 parts, instead of Donut Chart or Treemap

**Not for**

- More than ~10 rows: use a table of Table Cells
- Trend over time: use Line Chart
- Ordered steps with drop-off: use Funnel Chart

**Anatomy**

1. Category label, left
2. Track with the bar; bar width is a share of the track
3. Value, right

**Content and behavior**

- Sorted by value, largest first
- One color (chart/1); chart/2 only to highlight one bar that makes a point
- Max ~10 rows; more goes to a table
- Labels and values use text tokens, never the bar color
- Compact numbers (48.2K)

**Accessibility**

- Table view for screen readers and exact values
- Values are written as text, so bar length is never the only carrier
- A highlighted bar is also named in the title or insight, not only colored

Tokens and styles:
- Colors: `chart/1`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/2`, `spacing/3`, `spacing/4`
- Text styles: `ui/caption`

Guides: [charts](../../skills/build-ui/components/charts.md)

Code: Recharts `PieChart` (`innerRadius`), `BarChart layout="vertical"`

## Line Chart

Component set · 2 variants · default size 560 × 240

Change over time (Recharts LineChart / AreaChart). Lines 2 px, round joins; end dot 8 px with a 2 px surface ring; area wash = series at 10%. One y axis only. Label the end value or the extreme, never every point.

**Use for**

- Trends over time: revenue per month, active customers per week
- Type=area: one series or a total
- Type=line: several series over the same period
- The main trend chart at the top of a report

**Not for**

- Comparing categories: use Bar Chart
- Trend next to a number, without axes: use Sparkline
- Two measures with different units: Combo Chart when they explain each other, otherwise two charts
- Exact values matter more than shape: use a table of Table Cells

**Anatomy**

1. Y axis with round ticks
2. Grid hairlines, recessive
3. Lines, 2 px, round joins
4. Area wash, series at 10% (Type=area)
5. End dot, 8 px with a 2 px surface ring
6. X axis (time)
7. Chart Legend for 2 or more series

**Content and behavior**

- One y axis only (two axes only in Combo Chart)
- Label the end value or the extreme, never every point
- Legend for 2 or more series, none for one
- Series colors chart/1..8 in order; text in text tokens
- Edit line points for real data

**Accessibility**

- Table view for screen readers and exact values
- Hover shows a crosshair and a Chart Tooltip; the hit area is larger than the line
- Series are told apart by legend and end labels, not by color alone

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

**Use for**

- Trend next to the main number of a Stat Card
- Trend per row in a table cell, such as revenue per customer
- Last 12 points of one measure

**Not for**

- Reading values or periods: use Line Chart with axes
- Progress toward a target: use Gauge or Progress
- A number with no trend: use Stat Card alone

**Anatomy**

1. Line, 2 px, chart/1, 12 points
2. Trend: up or down
3. Delta text beside it (+12%), in the Stat Card or cell

**Content and behavior**

- No axes, labels or legend
- Direction is told by the delta text, not by color
- Same period for every sparkline in a column or row of cards

**Accessibility**

- The delta text carries the meaning; the line is decorative (aria-hidden)
- The card or cell has a text summary, such as "Up 12% vs last month"

| Variant property | Values |
|---|---|
| Trend | up, down |

Tokens and styles:
- Colors: `background/default`, `chart/1`
- Spacing and size: `border-width/2`

Guides: [charts](../../skills/build-ui/components/charts.md)

Code: shadcn `Chart` (Recharts) (`var(--chart-N)`)

## Donut Chart

Component set · 2 variants · default size 440 × 200

Part of a whole (share by entity, status mix). 2-5 segments, largest first, starting at 12 o'clock; the rest goes into "Other". Always show the legend with values and percentages; donut puts the total in the center. Comparisons between parts read better in Bar Chart Horizontal. Set segment angles with arcData; 2 px surface separators.

**Use for**

- Share of one whole with 2-5 parts
- Type=donut: the total sits in the center (Total, Total label)
- Type=pie: the same, without a center total

**Not for**

- Comparing parts with each other: use Bar Chart Horizontal
- Many parts or a hierarchy: use Treemap
- Share over time or across categories: use a stacked Bar Chart

**Anatomy**

1. Segments, largest first, starting at 12 o'clock
2. 2 px surface separators
3. Center total and its label (donut)
4. Legend with values and percentages

**Content and behavior**

- 2-5 segments; the rest goes into "Other"
- Always show the legend with values and percentages
- Set segment angles with arcData
- Series colors chart/1..8 in order; color follows the entity
- Text uses text tokens, never the segment color

**Accessibility**

- Table view with values and percentages
- The legend names every segment, so color is not the only key
- Separators keep adjacent segments apart in every mode

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

## Heatmap

Component · 1 variant · default size 416 × 268

Intensity over two dimensions (weekday × hour, team × week). One hue (chart/1) in 5 steps of opacity plus muted for zero; legend from fewer to more; tooltip with the exact value on hover. Never use red/green scales.

**Use for**

- Activity by weekday and hour
- Workload per team and week
- Scatter data with more than 500 points, binned into cells

**Not for**

- One dimension: use Bar Chart
- Trend of one measure over time: use Line Chart
- Exact values matter: use a table of Table Cells

**Anatomy**

1. Row labels
2. Column labels
3. Cells: chart/1 in 5 opacity steps, background/muted for zero
4. Legend from fewer to more
5. Chart Tooltip with the exact value on hover

**Content and behavior**

- One hue only (chart/1) in 5 opacity steps, plus muted for zero
- Never use red/green scales
- The legend reads from fewer to more
- Exact value on hover, never only the shade

**Accessibility**

- Table view for screen readers and exact values
- Shade is never the only carrier: values are in the tooltip and the table
- Zero cells (muted) stay distinct from the lowest step in light and dark mode

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

**Use for**

- One headline measure against a target: Q4 revenue vs target
- Status matters: on-track, at-risk, off-track
- Dashboards with only a few numbers

**Not for**

- Tables and dense dashboards: use Progress or Stat Card
- Trend over time: use Line Chart
- Many targets side by side: use Progress bars in a list or table

**Anatomy**

1. Label ("Q4 revenue vs target")
2. Half-circle track and fill
3. Target tick
4. Value
5. Status text: On track, At risk, Off track

**Content and behavior**

- Status is written, not only colored
- The tick marks the target
- Status tone follows Status: on-track, at-risk (warning), off-track (destructive)
- Use sparingly

**Accessibility**

- Status is text, so meaning does not rely on color
- Value and target are text; in code use role="meter" with aria-valuenow and a label

| Variant property | Values |
|---|---|
| Status | on-track, at-risk, off-track |

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

**Use for**

- 6 or more parts of one whole
- Hierarchies, such as product line and product
- Spotting the biggest contributors at a glance

**Not for**

- Fewer than 6 parts: use Bar Chart Horizontal
- 2-5 parts where the share is the point: use Donut Chart
- Exact comparisons: use a table of Table Cells

**Anatomy**

1. Rectangles, area = value, largest top-left
2. Tinted fill with a colored edge (chart/1..6)
3. Label and value inside when they fit
4. Chart Tooltip on hover for cells too small for a label

**Content and behavior**

- Largest rectangle top-left
- Label inside when it fits, otherwise on hover
- Tinted fills with a colored edge keep text readable in every mode
- Color follows the entity, never its rank

**Accessibility**

- Table view with every part and its value
- Text on tinted fills keeps 4.5:1
- Small cells are covered by the tooltip and the table view

Tokens and styles:
- Colors: `chart/1`, `chart/2`, `chart/3`, `chart/4`, `chart/5`, `chart/6`, `foreground/default`, `foreground/muted`
- Radius: `radius/sm`
- Text styles: `ui/caption`, `ui/label`

Guides: [charts](../../skills/build-ui/components/charts.md)

Code: Recharts `Treemap` with a custom cell renderer

## Funnel Chart

Component · 1 variant · default size 560 × 200

Drop-off between ordered steps (created → sent → viewed → paid, sign-up → active → paying). Each stage: name, count, a bar sized to its count, and the conversion from the previous stage; the overall rate at the bottom. 3 to 6 stages, one series (chart/1). Not for unordered categories: use Bar Chart Horizontal. Code: Recharts FunnelChart or plain bars. Min width 480; stage names wrap to two lines, then truncate.

**Use for**

- Invoice flow: created, sent, viewed, paid
- Sign-up, active, paying
- 3 to 6 ordered stages of one series

**Not for**

- Unordered categories: use Bar Chart Horizontal
- More than 6 stages: use a table of Table Cells
- Change over time: use Line Chart

**Anatomy**

1. Stage name
2. Count
3. Bar sized to the count (chart/1)
4. Conversion from the previous stage
5. Overall rate at the bottom

**Content and behavior**

- 3 to 6 stages, one color (chart/1)
- Stages keep their real order, never sorted by value
- Min width 480
- Stage names wrap to two lines, then truncate

**Accessibility**

- Counts and rates are text, so bar width is not the only carrier
- Table view with stage, count and conversion
- Truncated stage names show in full on hover and in the table view

Tokens and styles:
- Colors: `chart/1`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/2`, `spacing/3`
- Radius: `radius/sm`
- Text styles: `ui/caption`, `ui/label`

Guides: [charts](../../skills/build-ui/components/charts.md)

Code: Recharts `FunnelChart`, or plain bars with widths from the data

## Scatter Chart

Component set · 2 variants · default size 560 × 264

Relation between two numbers per item (invoice amount vs days to pay, deal size vs cycle length). One point per item; one or two series (chart/1, chart/2) with a Chart Legend for two. Name both axes with units; start at zero unless the range says otherwise. Hover shows the item in a Chart Tooltip. Over 500 points: lower opacity or use Heatmap. Code: Recharts ScatterChart.

**Use for**

- Look for a relation between two measures per item
- Spot outliers, such as large deals with long cycles
- Series=two: compare two groups, with a Chart Legend

**Not for**

- More than 500 points: lower opacity or use Heatmap
- One measure across categories: use Bar Chart
- Change over time: use Line Chart

**Anatomy**

1. Y title with unit (Y title)
2. Y axis
3. Points, one per item (chart/1, chart/2)
4. X axis
5. X title with unit (X title)
6. Chart Legend for two series

**Content and behavior**

- Name both axes with units
- Axes start at zero unless the range says otherwise
- One or two series; legend only for two
- Hover shows the item in a Chart Tooltip

**Accessibility**

- Table view listing each item and both values
- The tooltip names the item, not only the coordinates
- Axis titles are text, so screen readers get the units

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

Code: Recharts `ScatterChart` with `XAxis` and `YAxis` `type="number"`

## Chart Legend

Component · 1 variant · default size 187 × 16

Legend row above or below the plot. Clicking an item isolates the series in code.

**Use for**

- Any chart with 2 or more series
- Scatter Chart with two series
- Inside Chart Card (Show legend)

**Not for**

- One series: no legend, the title names it
- Values at one point: use Chart Tooltip
- Donut Chart: the legend also shows values and percentages

**Anatomy**

1. Items slot
2. Chart Legend Item key: swatch for bars and areas, line for line charts
3. Chart Legend Item Label, in text color

**Content and behavior**

- Labels use text color, never the series color
- Series = chart/N token, assigned in order
- Same order as the series in the chart and in the tooltip
- Clicking an item isolates the series (in code)
- Fill the Items slot in the instance; never detach

**Accessibility**

- Labels name the series, so color is not the only key
- Clickable items are buttons that expose their isolated state

Slots (fill them in the instance, never detach): `Items`

Built from: `Chart Legend Item`

Tokens and styles:
- Spacing and size: `spacing/4`

Guides: [charts](../../skills/build-ui/components/charts.md)

Code: shadcn `ChartLegend` with `ChartLegendContent` (Recharts) (Colors from `chartConfig`)

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

Guides: [charts](../../skills/build-ui/components/charts.md)

Code: shadcn `ChartLegend` with `ChartLegendContent` (Recharts) (Colors from `chartConfig`)

## Chart Tooltip

Component · 1 variant · default size 176 × 92

Hover tooltip: crosshair on line/area, per-mark on bar. Title = the x value; one row per series; values in text color.

**Use for**

- Line and area charts: crosshair at the hovered x value
- Bar charts: values of the hovered bar
- Heatmap and Scatter Chart: the exact value or the item

**Not for**

- Values that must always be visible: label the end value or use a table of Table Cells
- Explaining a control: use Tooltip

**Anatomy**

1. Title: the x value ("March 2026")
2. Rows slot
3. Chart Tooltip Row: series swatch, Label, Value aligned right

**Content and behavior**

- One row per visible series, in legend order
- Values in text color, never the series color
- Compact numbers with units
- Hit targets bigger than the marks

**Accessibility**

- Hover is not available to everyone: the same values are in the table view
- Keyboard focus on a data point shows the same tooltip (Recharts accessibilityLayer)

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

Code: shadcn `ChartTooltip` with `ChartTooltipContent` (Recharts)

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

Guides: [charts](../../skills/build-ui/components/charts.md)

Code: shadcn `ChartTooltip` with `ChartTooltipContent` (Recharts)

## Chart Card

Component · 1 variant · default size 640 × 474

Card around one chart (shadcn chart card): title says what is measured, description the period; time range in Actions; legend for 2+ series; footer states the insight in words. Every chart needs a table view in code.

**Use for**

- Dashboards and reports: one card per chart
- Charts that need a time range control (7 days, 30 days, 6 months)
- Block / Report and Block / Analytics layouts

**Not for**

- One number people check: use Stat Card
- Several charts in one card: one Chart Card each
- Exact values: use a table of Table Cells, or the table view

**Anatomy**

1. Title: what is measured
2. Description: the period and unit
3. Actions slot: time range Toggle Group
4. Chart slot: Bar Chart, Line Chart or another chart
5. Chart Legend (Show legend)
6. Footer with Insight and Note (Show footer)

**Content and behavior**

- Title says what is measured ("Revenue vs costs"), never "Chart"
- Legend on for 2 or more series, off for one
- Footer states the insight in words ("Profit up 21% vs last half-year")
- Every chart has a table view in code
- Empty: say why; loading: Skeleton in the chart shape; error: inline Alert with retry
- Fill the Actions and Chart slots in the instance; never detach

**Accessibility**

- Table view toggle or "View data" action, reachable by keyboard
- The insight gives the takeaway without reading the chart
- The time range Toggle Group has a label

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

Code: shadcn `Card` + shadcn `Chart` (Recharts) + `ToggleGroup` for the time range

## Waterfall Chart

Component · 1 variant · default size 640 × 284

Waterfall (Recharts BarChart with stacked invisible offsets): how a starting total becomes an ending total through ups and downs, such as opening to closing cash, budget to actual, revenue to profit. Totals in color/neutral/400, increases color/blue/600, decreases color/red/600 (the diverging arms, not series slots); 4 px radius at the data end; a 1 px connector at each running total; every step labelled with its signed value (+€86K, −€64K). Steps in the order they happen, at most 8; fold small ones into "Other". Legend: Increase, Decrease, Total.

**Use for**

- Opening to closing cash or balance
- Budget to actual, plan to forecast
- Revenue to profit by cost line

**Not for**

- Parts of one total without a start and end: use stacked Bar Chart or Donut Chart
- Change over time: use Line Chart
- More than 8 steps: group the small ones or use a table

**Anatomy**

1. Y axis with currency ticks, gridlines, baseline
2. Total bars (start, end, subtotals) in color/neutral/400
3. Increase bars color/blue/600, decrease bars color/red/600
4. Connector at each running total
5. Signed value label on every bar
6. X axis step names, legend Increase / Decrease / Total

**Content and behavior**

- Steps in the order they happen; start and end are totals
- Every bar has its signed value (+€86K, −€64K); totals without a sign
- Increase and decrease use the diverging arms, never series slots; say in the legend which is which
- At most 8 steps; fold the small ones into "Other"
- The footer says the result in a sentence ("€14K above opening")

**Accessibility**

- Color is not the only cue: signs on the labels and the legend
- The table view lists each step with its value and the running total
- Red and blue keep 3:1 on card and page in every mode

Built from: `Chart Legend`

Tokens and styles:
- Colors: `border/default`, `border/input`, `color/blue/600`, `color/neutral/400`, `color/red/600`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/2`
- Text styles: `ui/caption`

Guides: [charts](../../skills/build-ui/components/charts.md)

Code: Recharts `BarChart` with a transparent offset bar per step (Increase `color/blue/600`, decrease `color/red/600`, totals `color/neutral/400`)

## Combo Chart

Component · 1 variant · default size 640 × 264

Combo (Recharts ComposedChart): bars and a line that share the x axis but measure different units, such as volume and rate (invoices sent and the share paid on time). Bars chart/1 on the left axis, line chart/2 on the right axis; both axes start at 0 with round ticks and their unit on the ticks; pick the left maximum so the line stays clear of the bars. The legend names the axis of each series. Use only when the two measures explain each other; otherwise use two charts. Label the end value of the line.

**Use for**

- Volume and a rate: invoices sent and the share paid on time
- Revenue and margin by month
- Orders and average order value

**Not for**

- Two measures in the same unit: use grouped bars or two lines
- Measures that do not explain each other: use two charts
- More than one line or more than one bar series

**Anatomy**

1. Left axis for the bars, right axis for the line, each with its unit on the ticks
2. Bars chart/1, line chart/2 (2 px, end dot)
3. End value label on the line
4. Legend naming the axis of each series

**Content and behavior**

- Both axes start at 0 with round ticks
- Pick the left maximum so the line stays clear of the bars
- Legend says which axis each series reads on ("left axis", "right axis")
- Label the end value of the line, not every point
- The footer states the relation in a sentence

**Accessibility**

- The table view has one column per measure with units
- Series are told apart by form (bar, line) and the legend, not color alone
- Axis text in foreground/muted, never the series color

Built from: `Chart Legend`

Tokens and styles:
- Colors: `background/default`, `border/default`, `border/input`, `chart/1`, `chart/2`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/2`
- Text styles: `ui/caption`

Guides: [charts](../../skills/build-ui/components/charts.md)

Code: Recharts `ComposedChart`: `Bar yAxisId="left"` + `Line yAxisId="right"` (Two `YAxis`, both from 0)

## Dashboard Widget

Component · 1 variant · default size 480 × 161

A movable, resizable tile on a customizable dashboard: drag handle, title, period, refresh, expand and menu, any chart, KPI or list in Content (fills the width, hugs the height), last updated. Snap to a 12-column grid; sizes 3, 4, 6 or 12 columns. Edit mode shows the handles; view mode hides them. A fixed report uses Chart Card.

**Use for**

- Dashboards people arrange themselves
- Home pages with a chosen set of KPIs and charts
- Saved dashboards shared with a team

**Not for**

- A fixed report: use Chart Card
- One number on a fixed page: use Stat Card
- Figures in one row: use Metric Strip

**Anatomy**

1. Drag handle: grip-vertical (edit mode)
2. Title and Period
3. Refresh, Expand and More: Button Icon ghost sm
4. Content slot: fills the widget width and hugs its content height; a chart, a Sparkline, a KPI or a list
5. Footer (Show footer): "Updated 5 min ago"

**Content and behavior**

- Snap to a 12-column grid; sizes 3, 4, 6 or 12 columns
- Edit mode shows the handles and resize corner; view mode hides them
- Period is written on every widget; a dashboard-wide period says so once
- Menu: edit, duplicate, change size, remove (with Undo)
- Each widget loads, fails and refreshes on its own: Skeleton, inline Alert with Retry, never a blank tile
- Widgets in one row share a height: the tallest hugs, the others fill the row so footers line up

**Accessibility**

- Moving and resizing work by keyboard: menu items "Move left", "Move right", "Change size"; the new place is announced
- Icon buttons have labels ("Refresh Invoices paid")
- The widget is a region named by its title

| Property | Type | Default |
|---|---|---|
| Title | text | Invoices paid |
| Period | text | Last 30 days |
| Updated | text | Updated 5 min ago |
| Show footer | boolean | true |

Slots (fill them in the instance, never detach): `Content`

Built from: `Button Icon`, `Sparkline`. Icons: grip-vertical

Tokens and styles:
- Colors: `background/card`, `border/default`, `foreground/card`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/2`, `spacing/3`, `spacing/4`
- Radius: `radius/lg`
- Text styles: `ui/caption`, `ui/label`

Guides: [charts](../../skills/build-ui/components/charts.md)

Code: react-grid-layout (12 cols, `draggableHandle`) with shadcn `Card` per item (Sizes 3, 4, 6, 12 columns; save the layout per user)

## Distribution Bar

Component · 1 variant · default size 560 × 72

Parts of one whole as a single 100% bar: invoices by status, budget by category, storage by type. 2-6 segments in a fixed order, largest or most important first, with a legend showing the share. Hover a segment for the count. More than 6 parts or comparisons across groups use a stacked Bar Chart.

**Use for**

- Invoices by status with a total
- Budget or spend by category
- Storage by file type in billing settings

**Not for**

- More than 6 parts or comparing groups: use stacked Bar Chart
- Part of a whole as the main visual of a card: use Donut Chart
- Usage of a limit: use Usage Meter

**Anatomy**

1. Header: Title and Total
2. Bar: 2-6 segments, chart/1..6
3. Legend (Show legend): swatch, label, share

**Content and behavior**

- 2-6 segments in a fixed order, largest or most important first; the rest in "Other"
- Segment colors follow the entity (chart/1..6) and stay the same across pages
- Legend shows the share (42%); hover a segment for the count
- 2 px gap between segments; tiny segments keep a 4 px minimum width
- Shares add to 100%; round the largest to fix rounding

**Accessibility**

- The legend carries label and share in text, so color is not the only cue
- Segments are focusable with a Tooltip that has the count; or the bar is aria-hidden and the legend is a list
- Adjacent segments keep 3:1 against each other or the gap separates them

| Property | Type | Default |
|---|---|---|
| Title | text | Invoices by status |
| Total | text | 1,284 total |
| Show legend | boolean | true |

Tokens and styles:
- Colors: `chart/1`, `chart/2`, `chart/3`, `chart/4`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/1_5`, `spacing/2`, `spacing/3`, `spacing/4`
- Radius: `radius/full`, `radius/sm`
- Text styles: `ui/caption`, `ui/label`

Guides: [charts](../../skills/build-ui/components/charts.md)

Code: flex row of segments (width from the share) + legend `<ul>`; or Recharts `BarChart layout="vertical"` stacked to 100% (`var(--chart-N)` per entity; 2-6 segments)

## Bullet Chart

Component · 1 variant · default size 640 × 38

One measure against its target and bands (poor, fair, good) in one line: revenue vs plan, SLA vs goal. The dark bar is the actual, the line the target, the grey bands the ranges. Stack several with the same scale for a KPI review. A single percent toward a goal uses Progress or Gauge.

**Use for**

- Revenue vs plan, SLA vs goal
- A stack of KPIs on the same scale for a review
- Tables and dense dashboards where a Gauge is too large

**Not for**

- A single percent toward a goal: use Progress or Gauge
- Trend over time: use Line Chart
- Many items compared to each other: use Bar Chart Horizontal

**Anatomy**

1. Label: Title and Unit ("EUR, this quarter")
2. Track: three range bands, grey
3. Value bar: the actual, dark
4. Target: a vertical line
5. Value text: actual and target

**Content and behavior**

- The dark bar is the actual, the line the target, the grey bands the ranges
- Bands are named in the legend or footnote (poor, fair, good) with their limits
- Stacked bullets share the same scale when the units match
- Scale starts at 0; values written as text next to the track (412k, target 480k)
- Unit and period in the label

**Accessibility**

- Actual and target are text, so the line and bar are not the only cue
- In code use role="meter" with aria-valuenow and a label that includes the target
- Value bar keeps 3:1 against the bands

| Property | Type | Default |
|---|---|---|
| Title | text | Revenue |
| Unit | text | EUR, this quarter |
| Value | text | 412k |
| Target | text | target 480k |

Tokens and styles:
- Colors: `chart/1`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/4`
- Text styles: `ui/caption`, `ui/label`

Guides: [charts](../../skills/build-ui/components/charts.md), [reports](../../skills/build-ui/patterns/reports.md)

Code: Recharts `BarChart layout="vertical"`: stacked range bars, thin value `Bar`, `ReferenceLine` for the target; or custom SVG (Same scale for stacked bullets)

## Radar Chart

Component · 1 variant · default size 360 × 320

Compares 1-3 items across 5-8 qualities on the same scale: vendor scores, skill profiles, plan features. Each axis is one quality; the shape is the item. Same scale on every axis, labels outside, a legend for series. More than 3 series or precise values read better in a grouped Bar Chart or a table.

**Use for**

- Vendor or tender scores across criteria
- Skill or competency profiles
- Comparing two plans on qualities with the same scale

**Not for**

- More than 3 series or precise values: use grouped Bar Chart or a table
- Change over time: use Line Chart
- Qualities on different scales: use a table

**Anatomy**

1. Grid rings: 25, 50, 75, 100
2. Axes: one per quality
3. Series areas and lines: chart/1, chart/2, chart/3
4. Axis labels outside the grid
5. Legend for 2+ series

**Content and behavior**

- 5-8 axes; same scale on every axis, starting at the center
- 1-3 series; area fill low opacity so overlaps stay readable
- Labels outside the grid, short (one or two words)
- Axis order stays fixed and groups related qualities
- Legend for 2+ series; tooltip lists every axis value of the hovered series

**Accessibility**

- Every Radar Chart has a table view with each quality and score
- Series differ by line style or markers too, not color alone
- Lines and labels keep 3:1 on card and page in every mode

Tokens and styles:
- Colors: `border/default`, `chart/1`, `chart/2`, `foreground/muted`
- Text styles: `ui/caption`

Guides: [charts](../../skills/build-ui/components/charts.md)

Code: shadcn `Chart` (Recharts) `RadarChart` with `PolarGrid`, `PolarAngleAxis`, `Radar` per series (1-3 series, 5-8 axes; `var(--chart-N)`)

## Sankey Chart

Component · 1 variant · default size 640 × 280

Shows how amounts flow from sources to outcomes: payment method to paid or overdue, traffic source to sign-up, budget to spend. Band width is the amount. Keep to 2-3 columns and under 12 nodes; label every node with its value; color bands by source. Hover a band for the exact amount.

**Use for**

- Payment method to paid or overdue
- Traffic source to sign-up and plan
- Budget lines to spend by department

**Not for**

- Drop-off between ordered steps: use Funnel Chart
- Parts of one total: use Distribution Bar or Donut Chart
- A start total changed by steps: use Waterfall Chart

**Anatomy**

1. Source nodes (left): fixed 12 wide, pinned left, heights scale
2. Flows: band width is the amount, colored by source; stretch with the width, scale with the height
3. Outcome nodes (right): fixed 12 wide, pinned right
4. Node labels with values, centered on their node

**Content and behavior**

- Resize the instance (or set it to Fill in a Chart Card) instead of redrawing; keep at least 480 x 210
- 2-3 columns and under 12 nodes; fold small flows into "Other"
- Label every node with its value (Card €184K)
- Color bands by source with chart/1..8; nodes in neutral
- Order nodes so bands cross as little as possible
- Hover a band for the exact amount and its share of the source

**Accessibility**

- The table view lists each flow: source, target, amount
- Labels are text on the node, not only in a tooltip
- Bands keep enough contrast on card (low opacity fills, darker on hover)

Tokens and styles:
- Colors: `background/destructive`, `chart/1`, `chart/2`, `chart/3`, `foreground/default`
- Radius: `radius/sm`
- Text styles: `ui/caption`

Guides: [charts](../../skills/build-ui/components/charts.md)

Code: Recharts `Sankey` with custom node and link renderers (Links colored by source with `var(--chart-N)`; under 12 nodes)

## Choropleth Map

Component · 1 variant · default size 480 × 328

Values by region on a map, shaded from light (low) to dark (high): revenue by county, customers by country. One measure, one hue, 5 steps, with a legend. Replace the tile regions with real map shapes, or keep the tile layout when equal-size regions read better. Hover a region for its name and value.

**Use for**

- Revenue or customers by country, county or region
- Where place matters to the decision (sales territories, shipping zones)
- A tile layout when equal-size regions read better than real shapes

**Not for**

- Ranking regions precisely: use Bar Chart Horizontal
- An address or office location: use Map
- Two dimensions that are not places: use Heatmap

**Anatomy**

1. Regions: shade and code (tile layout, or real map shapes)
2. Legend: low, 5-step scale, high

**Content and behavior**

- One measure, one hue, 5 steps; muted for no data, said in the legend
- Replace the tile regions with real map shapes, or keep tiles when equal size reads better
- Normalize when size skews the map (per customer, per capita)
- Legend states the unit and the step limits
- Hover a region for its name and value

**Accessibility**

- The table view lists every region with its value
- Regions are focusable with name and value in the label; or the map is aria-hidden next to the table
- Darkest and lightest steps keep 3:1 against the surface; borders separate neighbors

Tokens and styles:
- Colors: `chart/1`, `foreground/default`, `foreground/muted`, `foreground/primary`
- Spacing and size: `spacing/0_5`, `spacing/2`, `spacing/3`
- Radius: `radius/sm`
- Text styles: `ui/caption`

Guides: [charts](../../skills/build-ui/components/charts.md)

Code: react-simple-maps + d3-scale `scaleQuantize` (5 steps, one hue); tile layout as a CSS grid (Muted for no data; table view lists every region)
