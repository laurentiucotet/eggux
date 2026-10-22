# Metrics

Generated from the EGG UI master library on 2026-10-22 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Trend Indicator](#trend-indicator) | 9 | - |
| [Metric Strip](#metric-strip) | 1 | Metrics |
| [Metric Strip Item](#metric-strip-item) | 1 | - |
| [Usage Meter](#usage-meter) | 3 | - |
| [Countdown](#countdown) | 1 | - |
| [Leaderboard Row](#leaderboard-row) | 2 | - |

On the Figma page: "Stress test / Countdown", "Stress test / Leaderboard Row", "Stress test / Metric Strip", "Stress test / Trend Indicator", "Stress test / Usage Meter"

## Trend Indicator

Component set · 9 variants · default size 141 × 20

A change against a period: arrow, signed percent or amount, and what it is compared to. Direction is up, down or flat; Tone says if that is good (positive), bad (negative) or neither, so rising costs can be up and negative. The sign and the words carry the meaning; color only supports it. Edit the value text per instance.

**Use for**

- The change under a value in a Metric Strip or a Stat Card
- A change next to a figure in a table row or a report header
- Rising costs or churn: Trend=up with Tone=negative

**Not for**

- A trend people read over time: use Sparkline or Line Chart
- A value against a target: use Bullet Chart or Progress Card
- A status with no change: use Badge

**Anatomy**

1. Icon: trending-up, trending-down or minus (from Trend)
2. Value: signed percent or amount, ui/label
3. Comparison (Show comparison): "vs last month", ui/caption, muted

**Content and behavior**

- Trend follows the data; Tone follows the meaning (costs up is negative, churn down is positive)
- Always signed: +12.4%, −3.1%, 0.0% for flat; one decimal for percentages
- The comparison names the period ("vs last month", "vs Q3"); hide it only when the period is said once nearby
- Edit the value text per instance; keep the same comparison for every item in a row
- Neutral tone when the change is too small to matter, or when up and down mean nothing good or bad

**Accessibility**

- The sign and the words carry the meaning; color only supports it
- The icon is decorative (aria-hidden); read as "Up 12.4% vs last month" with a visually hidden "Up" or "Down"
- Positive and negative text keeps 4.5:1 on card and page in every mode

| Variant property | Values |
|---|---|
| Trend | up, down, flat |
| Tone | positive, negative, neutral |

| Property | Type | Default |
|---|---|---|
| Comparison | text | vs last month |
| Show comparison | boolean | true |
| Value | text | 12.4% |

Icons: minus, trending-down, trending-up

Tokens and styles:
- Colors: `background/destructive`, `background/success`, `foreground/muted`
- Spacing and size: `spacing/1`
- Text styles: `ui/caption`, `ui/label`

Guides: [reports](../../skills/build-ui/patterns/reports.md)

Code: custom: lucide `TrendingUp` / `TrendingDown` / `Minus` + `<span class="tabular-nums">` (Direction from the data, tone from the meaning (`text-success`, `text-destructive`, `text-muted-foreground`); hidden "Up" / "Down" text)

## Metric Strip

Component · 1 variant · default size 1136 × 121

A row of 3-5 key figures at the top of a dashboard, report or record page, lighter than Stat Cards: label, value, trend, dividers between. Same period for every item, said once nearby. More context per figure (footnote, chart) needs Stat Card.

**Use for**

- Key figures above a report or dashboard: revenue, invoices, overdue, days to pay
- The summary at the top of a record page (customer totals)
- A dense header where a row of Stat Cards would take too much space

**Not for**

- Figures that need a footnote or a chart each: use Stat Card
- One figure against a target: use Progress Card or Gauge
- Counts in a page header with no trend: use Figure

**Anatomy**

1. Metrics slot: 3-5 Metric Strip Items, Show divider on after the first

**Content and behavior**

- 3-5 figures; more go in a table or a second section
- Same period for every item, said once nearby ("Last 30 days" in the header)
- Most important figure first, in the same order on every visit
- Items share the width equally; on narrow screens wrap to two columns, no horizontal scroll
- Loading: Skeleton in each value; no data: "No data" in muted text, never 0

**Accessibility**

- Code as a <dl> with one dt and dd per figure
- The period is in text near the strip, so each figure is read with it
- Trend reads as text ("Up 12% vs last month")

Slots (fill them in the instance, never detach): `Metrics`

Built from: `Metric Strip Item`

Tokens and styles:
- Colors: `border/default`
- Spacing and size: `spacing/4`

Guides: [reports](../../skills/build-ui/patterns/reports.md)

Code: `<dl class="grid grid-cols-2 md:grid-cols-4 divide-x">` with `dt` / `dd` + `Trend Indicator` (3-5 items; one period said once nearby)

## Metric Strip Item

Component · 1 variant · default size 260 × 88

One figure in a Metric Strip: label, value, optional Trend Indicator (exposed). Divider=true on every item after the first.

**Use for**

- Each figure of a Metric Strip

**Not for**

- A figure on its own with a footnote or chart: use Stat Card
- A number with no trend outside a strip: use Figure

**Anatomy**

1. Label: body/small, muted
2. Value: one line, heading
3. Trend (Show trend): Trend Indicator (exposed)
4. Divider on the left (Show divider)

**Content and behavior**

- Show divider off on the first item, on for every item after it
- Value stays on one line; amounts in the locale format and compact (€1.84M)
- Label is a noun of one to three words, sentence case
- Show trend on all items in a strip or on none

**Accessibility**

- Label and value are read together (dt and dd)
- The divider is decorative

| Property | Type | Default |
|---|---|---|
| Label | text | Revenue |
| Value | text | €1.84M |
| Show trend | boolean | true |
| Show divider | boolean | false |

Built from: `Trend Indicator`

Tokens and styles:
- Colors: `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/6`
- Text styles: `body/small`, `heading/h3`

Guides: [reports](../../skills/build-ui/patterns/reports.md)

Code: `<dl class="grid grid-cols-2 md:grid-cols-4 divide-x">` with `dt` / `dd` + `Trend Indicator` (3-5 items; one period said once nearby)

## Usage Meter

Component set · 3 variants · default size 320 × 60

How much of a plan limit is used: seats, storage, API calls, documents per month. Label, "used of limit", bar, a hint. near from 80% (warning, say what to do), over above 100% (error, say the consequence and the date). In billing settings and near the action that uses the limit. A goal people try to reach is Progress Card.

**Use for**

- Billing and plan settings: one meter per limit
- Next to the action that uses the limit (invite a member, upload a file)
- Team Members header: seats used

**Not for**

- A goal people try to reach: use Progress Card
- Progress of a running task: use Progress
- Parts of one total: use Distribution Bar

**Anatomy**

1. Label: "Seats"
2. Usage: "8 of 10", tabular
3. Bar: Progress (tone from Level)
4. Hint (Show hint): what to do, or the consequence and the date

**Content and behavior**

- Level=near from 80%: warning tone and say what to do ("Upgrade or remove members")
- Level=over above 100%: error tone, say the consequence and the date ("Uploads pause on 1 Nov")
- Usage shows used and limit with the unit ("4.2 of 5 GB"); unlimited plans show the count and no bar
- Say when the count resets for monthly limits ("Resets 1 Nov")
- Offer the fix in the hint or next to it: Upgrade, Buy more, Manage

**Accessibility**

- The bar has role="meter" with aria-valuenow, aria-valuemax and a label ("Seats used")
- Level is in the hint text, never color alone
- Crossing near or over is announced once in a polite live region, not on every render

| Variant property | Values |
|---|---|
| Level | normal, near, over |

| Property | Type | Default |
|---|---|---|
| Label | text | Seats |
| Show hint | boolean | true |

Built from: `Progress`

Tokens and styles:
- Colors: `background/destructive`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/2`
- Text styles: `body/small`, `ui/caption`, `ui/label`

Guides: [settings-and-admin](../../skills/build-ui/patterns/settings-and-admin.md)

Code: shadcn `Progress` with a tone class + label row (`role="meter"`, `aria-valuenow`, `aria-valuemax`; near from 80%, over above 100%)

## Countdown

Component · 1 variant · default size 280 × 66

Time left until a deadline people act on: an offer, a webinar start, a payment due, a session that expires. Days, hours, minutes; seconds only in the last hour. Always say what happens at zero next to it, and the exact date and time zone. Screen readers get the end time, not a ticking value.

**Use for**

- A real deadline: offer ends, registration closes, webinar starts
- A payment due or a session that expires
- A resend code timer (short form, minutes and seconds)

**Not for**

- Fake urgency that resets: use Meta Item with the real date, or nothing
- A date far ahead (more than 30 days): use the date with Meta Item
- Progress of a running job: use Progress

**Anatomy**

1. Days tile: value and unit
2. Hours tile
3. Minutes tile
4. Seconds tile (Show seconds)

**Content and behavior**

- Days, hours, minutes; seconds only in the last hour (Show seconds)
- Always say what happens at zero next to it, with the exact date and time zone ("Offer ends 24 Oct, 18:00 CEST")
- Two digits per tile (02, 14); drop the days tile when it is 00
- At zero, replace it with the outcome ("Registration closed") and remove the action it promoted
- Count from the server time, never only the device clock

**Accessibility**

- Screen readers get the end time, not a ticking value: role="timer" with aria-live="off" and a <time datetime> label
- Announce once at a meaningful step (5 minutes left) for session expiry, with a way to extend
- No flashing or color pulse in the last seconds

| Property | Type | Default |
|---|---|---|
| Days | text | 02 |
| Hours | text | 14 |
| Minutes | text | 36 |
| Seconds | text | 12 |
| Show seconds | boolean | true |

Tokens and styles:
- Colors: `background/muted`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/2`, `spacing/3`
- Radius: `radius/md`
- Text styles: `heading/h3`, `ui/caption`

Guides: [marketing-pages](../../skills/build-ui/patterns/marketing-pages.md)

Code: custom tiles from a `useCountdown` hook (1 s interval, server end time) (`role="timer"`, `aria-live="off"`; end time in `<time datetime>`)

## Leaderboard Row

Component set · 2 variants · default size 400 × 40

A ranked person or team: rank, avatar, name, value. Top 5-10 plus the viewer's own row (State=current) when they are below. Value says the unit; ties share a rank. Use for sales targets, support resolution, contributions; avoid public rankings where they shame people.

**Use for**

- Sales targets: top account managers this quarter
- Support resolution or contributions per team
- The viewer's own row under the top 10 (State=current)

**Not for**

- Public rankings that shame people: show the viewer their own progress with Progress Card
- Ranking categories or products: use Bar Chart Horizontal
- A plain list of people: use List Item or Byline

**Anatomy**

1. Rank: tabular, muted
2. Avatar
3. Name: ui/label
4. Value: tabular, right-aligned, with the unit
5. State=current: highlighted row for the viewer

**Content and behavior**

- Top 5-10, then the viewer's row (State=current) when they are below, with a gap marker between
- Value says the unit (€48,250, 312 tickets); same unit for every row
- Ties share a rank (1, 2, 2, 4)
- Say the period and the measure above the list ("Paid revenue, Q4")
- Long names truncate with a Tooltip; value never truncates

**Accessibility**

- Code as an <ol> or a table with rank, name and value columns
- The current row has aria-current="true" and a visible "You" label, not only a tint
- The Avatar is decorative next to the name (alt="")

| Variant property | Values |
|---|---|
| State | default, current |

| Property | Type | Default |
|---|---|---|
| Rank | text | 1 |
| Name | text | Elena Popa |
| Value | text | €48,250 |

Built from: `Avatar`

Tokens and styles:
- Colors: `background/muted`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/2`, `spacing/3`
- Radius: `radius/md`
- Text styles: `ui/label`

Guides: [reports](../../skills/build-ui/patterns/reports.md)

Code: `<ol>` of rows with shadcn `Avatar`, `tabular-nums` value (Current row `aria-current="true"` and `bg-accent`)
