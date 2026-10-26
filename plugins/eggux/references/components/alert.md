# Alert

Generated from the EGG UI master library on 2026-10-26 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Alert](#alert) | 30 | Actions |
| [Service Status Row](#service-status-row) | 4 | - |
| [Uptime Bars](#uptime-bars) | 1 | - |
| [Uptime Day](#uptime-day) | 5 | - |

On the Figma page: "Example / Alert styles", "Example / in status page", "Stress test / Alert", "Stress test / Service Status Row", "Stress test / Uptime Bars"

## Alert

Component set · 30 variants · default size 480 × 68

Persistent message about a page or section. Layout inline (card above the content) or banner (full width, top of page or panel). Options: Actions (native slot), Dismiss. Warning uses the filled style in Style=default.


Style: default (bordered card, the standard look), soft (status tint fill like Badge soft, colored icon and title; calmer, for docs callouts, onboarding notes and pages with several alerts), accent (card with a 4 px status bar on the left; for dense settings pages, lists and logs where tint is too loud). Use one Style per product.


Usage: eggux build-ui/components/alert.md

**Use for**

- States such as trial ends in 3 days, read-only access, sync failed
- Layout=inline: a card above the content it concerns
- Layout=banner: full width at the top of a page or panel (maintenance, read-only mode)
- Notes and warnings inside documentation content
- Style=soft: calmer tint for docs callouts, onboarding notes and pages with several alerts
- Style=accent: a card with a 4 px status bar on the left for dense settings pages, lists and logs

**Not for**

- Confirming an action that just happened: use Toast
- A decision before continuing: use Alert Dialog
- An error in one field: show it under the field

**Anatomy**

1. Icon by Variant: info, circle-check, triangle-alert, circle-alert
2. Title: the situation in a few words
3. Description: what to do about it (Show description)
4. Actions slot: up to three small buttons or links (Show actions)
5. Dismiss x (Show close)
6. Style: default (bordered card), soft (badge/soft-* tint fill, no border; icon and title in badge/soft-*-fg, description foreground/default), accent (card + border/default, 4 px accent bar on the left in the status color; neutral uses foreground/muted)

**Content and behavior**

- Variant matches the meaning: default, info, success, warning, destructive; always with an icon
- Variant=warning is filled (background/warning) because amber fails contrast as text on white
- The action that resolves the situation comes first
- Dismiss only when no action is needed; remember the dismissal
- Never stack more than one alert in the same place; show the most important one
- Say what happened, then what to do; no blame, no "Oops"
- One Style per product; Variant still carries the meaning in every Style
- Style=soft and accent warning use badge/soft-warning-fg for icon and title (amber text fails on white); the amber accent bar is decorative

**Accessibility**

- An alert that appears after load uses role="alert" (destructive) or role="status"
- Meaning is in icon and text, never color alone
- Dismiss x has an accessible label and is reachable by keyboard

| Variant property | Values |
|---|---|
| Variant | default, destructive, success, warning, info |
| Layout | inline, banner |
| Style | default, soft, accent |

| Property | Type | Default |
|---|---|---|
| Title | text | Heads up |
| Description | text | You can add team members from the Settings page. |
| Show description | boolean | true |
| Show actions | boolean | false |
| Show close | boolean | false |

Slots (fill them in the instance, never detach): `Actions`

Built from: `Button`. Icons: circle-alert, circle-check, info, triangle-alert, x

Tokens and styles:
- Colors: `background/card`, `background/destructive`, `background/info`, `background/success`, `background/warning`, `badge/soft-destructive-bg`, `badge/soft-destructive-fg`, `badge/soft-info-bg`, `badge/soft-info-fg`, `badge/soft-neutral-bg`, `badge/soft-neutral-fg`, `badge/soft-success-bg`, `badge/soft-success-fg`, `badge/soft-warning-bg`, `badge/soft-warning-fg`, `border/default`, `foreground/card`, `foreground/default`, `foreground/muted`, `foreground/warning`
- Spacing and size: `border-width/4`, `spacing/0_5`, `spacing/2`, `spacing/3`, `spacing/4`, `spacing/6`
- Radius: `radius/lg`, `radius/sm`
- Text styles: `body/small`, `ui/label`

Guides: [alert](../../skills/build-ui/components/alert.md), [card](../../skills/build-ui/components/card.md), [errors-and-recovery](../../skills/build-ui/patterns/errors-and-recovery.md), [feedback-messages](../../skills/build-ui/patterns/feedback-messages.md), [permissions-and-access](../../skills/build-ui/patterns/permissions-and-access.md)

Code: shadcn `Alert`, `Sonner`

## Service Status Row

Component set · 4 variants · default size 720 × 45

One service on a status page or an admin health panel: name, uptime over the last 90 days and the current status in words with a Status Dot. Show bars adds Uptime Bars under the name line (90 days, select a nested Uptime Day to set its State; Show labels on the bars for "90 days ago" / "Today"). Order services the way customers think about the product; a status other than operational links to the incident. Usage: eggux build-ui/patterns/content-and-docs.md

**Use for**

- A public status page
- A health panel in admin
- The state of connected services on a settings page

**Not for**

- An incident message for the whole page: use Alert
- A status in a table cell: use Badge
- One integration with its settings: use Integration Card

**Anatomy**

1. Name: ui/label
2. Uptime (Show uptime): "99.98% uptime", body/small, muted
3. Status: Status Dot with a word (Operational, Degraded, Outage, Maintenance)
4. Bars (Show bars): Uptime Bars under the name line, 90 Uptime Day instances; Show labels on the nested bars for "90 days ago" / "Today"

**Content and behavior**

- Order services the way customers think about the product (Web app, API, Payments), never internal system names
- Status is always in words; the dot supports it
- A status other than operational links to the incident
- Uptime has two decimals over the same 90 days on every row
- Maintenance says until when, with the time zone, in the incident
- Status pages use Show bars on every row; select a nested Uptime Day to set the state of that day
- The bars and the uptime % cover the same 90 days

**Accessibility**

- Rows are a list or a table; the status word is read with the service name
- The dot is aria-hidden
- The incident link names the incident, not "here"
- Each uptime day has a tooltip and label with the date and state; color is never the only signal

| Variant property | Values |
|---|---|
| Status | operational, degraded, outage, maintenance |

| Property | Type | Default |
|---|---|---|
| Name | text | Payments API |
| Uptime | text | 99.98% uptime |
| Show uptime | boolean | true |
| Show bars | boolean | false |

Built from: `Status Dot`, `Uptime Bars`

Tokens and styles:
- Colors: `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/3`, `spacing/4`
- Text styles: `ui/caption`, `ui/label`

Guides: [content-and-docs](../../skills/build-ui/patterns/content-and-docs.md)

Code: custom row with `Status Dot`, `flex justify-between` (Data from your status provider; link non-operational states to the incident)

## Uptime Bars

Component · 1 variant · default size 720 × 56

Uptime history of one service: 90 Uptime Day bars, oldest on the left, with an optional caption row (Show labels: "90 days ago" and "Today"). Select a nested Uptime Day to set its State (operational, degraded, outage, maintenance, no-data). Every day with an incident links to it; the tooltip says the date and what happened. Used under the name line of Service Status Row (Show bars). Usage: eggux build-ui/patterns/content-and-docs.md

**Use for**

- Under each service of a public status page (Service Status Row Show bars)
- A health panel in admin that shows the last 90 days
- Any daily availability history of an integration or job

**Not for**

- A trend of a number over time: use a Chart or Sparkline
- Today's status only: use Service Status Row without bars
- Progress toward a goal: use Progress

**Anatomy**

1. Bars: 90 Uptime Day instances (State=operational, degraded, outage, maintenance, no-data), FILL width
2. Caption row (Show labels): Start label "90 days ago", End label "Today", ui/caption, muted

**Content and behavior**

- Always 90 days, oldest left, today right; the same period on every row of a page
- Select a nested Uptime Day to set its State; keep the real degraded and outage days
- Days before a service existed are no-data, not operational
- Each day with an incident links to it; the tooltip says the date, the state and the incident title
- Show labels on every row of a status page, or once under the last row

**Accessibility**

- Color is never the only signal: each day has a tooltip and an accessible label ("3 Oct 2026: degraded")
- The uptime % is also given as text next to the name
- The bar row is a list; keyboard users reach days with incidents

| Property | Type | Default |
|---|---|---|
| Start label | text | 90 days ago |
| End label | text | Today |
| Show labels | boolean | true |

Built from: `Uptime Day`

Tokens and styles:
- Colors: `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/2`, `spacing/3`
- Text styles: `ui/caption`

Guides: [content-and-docs](../../skills/build-ui/patterns/content-and-docs.md)

Code: flex row of 90 bars (`flex-1 h-7 rounded-sm`, `bg-success` / `bg-warning` / `bg-destructive` / `bg-info` / `bg-border` by state) with a shadcn `Tooltip` per day; caption "90 days ago" / "Today" (Each day has an accessible label with date and state)

## Uptime Day

Component set · 5 variants · default size 8 × 28

One day in Uptime Bars. State sets the color: operational (success), degraded (warning), outage (destructive), maintenance (info), no-data (muted, before the service existed). Only used inside Uptime Bars: select the nested day to change its State. Usage: eggux build-ui/patterns/content-and-docs.md

| Variant property | Values |
|---|---|
| State | operational, degraded, outage, maintenance, no-data |

Tokens and styles:
- Colors: `background/destructive`, `background/info`, `background/success`, `background/warning`, `border/input`
- Radius: `radius/sm`

Guides: [content-and-docs](../../skills/build-ui/patterns/content-and-docs.md)

Code: flex row of 90 bars (`flex-1 h-7 rounded-sm`, `bg-success` / `bg-warning` / `bg-destructive` / `bg-info` / `bg-border` by state) with a shadcn `Tooltip` per day; caption "90 days ago" / "Today" (Each day has an accessible label with date and state)
