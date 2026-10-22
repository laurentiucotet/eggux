# Code Block

Generated from the EGG UI master library on 2026-10-22 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Code Block](#code-block) | 1 | - |
| [Command Snippet](#command-snippet) | 1 | - |
| [Endpoint Row](#endpoint-row) | 5 | - |
| [Log Row](#log-row) | 4 | - |
| [Diff Viewer](#diff-viewer) | 1 | Lines |
| [Diff Line](#diff-line) | 3 | - |
| [JSON Viewer](#json-viewer) | 1 | - |

On the Figma page: "Example / in article", "Stress test / Code Block", "Stress test / Command Snippet", "Stress test / Diff Viewer", "Stress test / Endpoint Row", "Stress test / JSON Viewer", "Stress test / Log Row"

## Code Block

Component · 1 variant · default size 640 × 119

Code snippet with language label and Copy (docs, API keys, install steps). Monospace `code` style, no wrapping in code (horizontal scroll); syntax colors come from the code highlighter theme, not from tokens. Inline code in prose: `code` style on background/muted, radius sm.

**Use for**

- Commands and install steps
- API request and response examples
- Config snippets in docs and help articles

**Not for**

- Code inside a sentence: inline code style on background/muted, radius sm
- Editing code or config: use a code editor (Monaco, CodeMirror)

**Anatomy**

1. Header (Show header): Language label and Copy Button Icon
2. Code in the monospace code style
3. Body that scrolls horizontally

**Content and behavior**

- No wrapping: long lines scroll horizontally
- Syntax colors come from the highlighter theme, not from tokens
- Copy confirms with "Copied" for 2 s
- Language names the language in lowercase (bash, json)

**Accessibility**

- Copy is an icon button labelled "Copy code"; "Copied" is announced politely
- The scrolling body is focusable, so keyboard users can scroll it
- The highlighter theme keeps 4.5:1 on background/muted

| Property | Type | Default |
|---|---|---|
| Language | text | bash |
| Code | text | npx shadcn@latest add button ⏎ npx shadcn@latest add dialog |
| Show header | boolean | true |

Built from: `Button Icon`

Tokens and styles:
- Colors: `background/muted`, `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/4`
- Radius: `radius/lg`
- Text styles: `code`, `ui/caption`

Guides: [content](../../skills/build-ui/components/content.md), [rich-text-editor](../../skills/build-ui/components/rich-text-editor.md)

Code: Shiki or Prism + copy `Button`

## Command Snippet

Component · 1 variant · default size 480 × 36

One command or value people copy into a terminal or config: install line, CLI command, environment variable. Mono on muted, copy button (check for 2 s after copying). Several lines or output: Code Block. Never include the $ in what gets copied.

**Use for**

- Install steps in docs and onboarding (npm install @acme/sdk)
- A CLI command or one environment variable
- A value to paste into another tool: webhook URL, key id

**Not for**

- Several lines or command output: use Code Block
- A secret key shown once: use the API Keys block with a masked value and Copy
- Code inside a sentence: inline code style

**Anatomy**

1. Prompt (Show prompt): $, muted, not copied
2. Command: mono on background/muted, one line
3. Copy: Button Icon ghost sm (check for 2 s)

**Content and behavior**

- One command per snippet; never include the $ in what gets copied
- Long commands scroll horizontally, never wrap
- Copy shows a check for 2 s, then returns to the copy icon
- Show prompt off for values that are not terminal commands (URLs, env values)
- Placeholders the user must replace are named in caps (YOUR_API_KEY) and explained below

**Accessibility**

- Copy is labelled "Copy command"; "Copied" is announced politely (aria-live)
- The prompt is aria-hidden and excluded from selection (select-none)
- Mono text keeps 4.5:1 on background/muted

| Property | Type | Default |
|---|---|---|
| Command | text | npm install @acme/sdk |
| Show prompt | boolean | true |

Built from: `Button Icon`

Tokens and styles:
- Colors: `background/muted`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/2`, `spacing/3`
- Radius: `radius/md`
- Text styles: `code`

Guides: [content](../../skills/build-ui/components/content.md), [content-and-docs](../../skills/build-ui/patterns/content-and-docs.md)

Code: `<pre><code>` on `bg-muted` + shadcn `Button size="icon"` (`navigator.clipboard.writeText`) (Prompt `$` is `select-none aria-hidden`, never copied)

## Endpoint Row

Component set · 5 variants · default size 560 × 37

One API endpoint in a reference list: method badge, path in mono with parameters in braces, one-line summary. The row links to the endpoint page. Methods keep the same color everywhere (GET info, POST success, PUT and PATCH warning, DELETE destructive).

**Use for**

- API reference sidebar or overview lists
- The endpoints a webhook or integration uses
- Grouped lists per resource: Invoices, Customers

**Not for**

- The full request and response: use Code Block or JSON Viewer
- A navigation item with no method: use Nav Link
- One command to copy: use Command Snippet

**Anatomy**

1. Method: Badge (GET info, POST success, PUT and PATCH warning, DELETE destructive)
2. Path: mono, parameters in braces (/v1/invoices/{id})
3. Summary: body/small, muted

**Content and behavior**

- Methods keep the same color everywhere; the method name is always written
- Path in mono, parameters in braces, no host
- Summary starts with a verb: "Retrieve an invoice"
- The whole row links to the endpoint page
- Order within a resource: list, create, retrieve, update, delete

**Accessibility**

- The row is one link with an accessible name of method, path and summary
- Method is text in the Badge, never color alone
- Paths do not break mid-segment; long paths wrap at slashes

| Variant property | Values |
|---|---|
| Method | GET, POST, PUT, PATCH, DELETE |

| Property | Type | Default |
|---|---|---|
| Path | text | /v1/invoices/{id} |
| Summary | text | Retrieve an invoice |

Built from: `Badge`

Tokens and styles:
- Colors: `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/2`, `spacing/3`
- Text styles: `body/small`, `code`

Guides: [content-and-docs](../../skills/build-ui/patterns/content-and-docs.md)

Code: `<a>` row with shadcn `Badge` (method variant) + `<code>` path (GET info, POST success, PUT / PATCH warning, DELETE destructive)

## Log Row

Component set · 4 variants · default size 720 × 28

One line of a log or event stream: time with milliseconds, level, message in mono. Newest at the bottom in live tails, at the top in searches. Level filter and search above; long messages wrap, never truncate. Error rows carry a destructive rule on the left.

**Use for**

- Live tails of request, job or deploy logs
- Search results in a log viewer
- Webhook delivery and integration event history

**Not for**

- Who changed what on a record: use the Audit Log with Change Item
- Events people read as a story: use Timeline Item
- A structured payload: use JSON Viewer in the expanded row

**Anatomy**

1. Time: hh:mm:ss.SSS, mono, muted
2. Level: debug, info, warn, error
3. Message: mono
4. Destructive rule on the left (Level=error)

**Content and behavior**

- Newest at the bottom in live tails, at the top in searches
- Long messages wrap, never truncate
- Level filter and search above the list; pause the tail while the user scrolls up
- Time zone stated once in the header; times in the same zone
- Rows expand to show the payload (JSON Viewer) and the request id

**Accessibility**

- Code as a list or a log region (role="log", aria-live="polite" only for live tails, paused on demand)
- Level is text, never color alone
- The rows are keyboard focusable when they expand

| Variant property | Values |
|---|---|
| Level | debug, info, warn, error |

| Property | Type | Default |
|---|---|---|
| Time | text | 12:04:31.220 |
| Message | text | POST /v1/invoices 201 in 182 ms |

Tokens and styles:
- Colors: `background/destructive`, `background/warning`, `chart/1`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/3`
- Text styles: `code`

Guides: [audit-log](../../skills/build-ui/patterns/audit-log.md)

Code: virtualized list (`@tanstack/react-virtual`) of mono rows (`role="log"` for live tails; level as text)

## Diff Viewer

Component · 1 variant · default size 640 × 151

What changed between two versions of a text, contract, config or code: file name with counts, then Diff Lines (removed above added). Show 3 lines of context around each change and collapse the rest. Side-by-side only on wide screens. Field-level changes of a record use Change Item.

**Use for**

- Preview of a version in a version history (Version Item, State=selected)
- Changes to a contract, template or terms before approval
- Config or code changes in a deploy or review

**Not for**

- Field-level changes of a record: use Change Item
- A single code example: use Code Block
- Release notes for users: use Release Note Item

**Anatomy**

1. Header: file-text icon, file name, added count, removed count
2. Lines slot: Diff Lines

**Content and behavior**

- Show 3 lines of context around each change and collapse the rest ("Show 24 unchanged lines")
- Removed lines above added lines
- Counts in the header: +3 −1
- Unified by default; side by side only on wide screens (1024 and up)
- No changes: say "No differences" instead of an empty frame

**Accessibility**

- Each line names its type in hidden text (added, removed), so color is not the only cue
- Collapsed sections are buttons with the count in their label
- The header counts are text, read as "3 added, 1 removed"

| Property | Type | Default |
|---|---|---|
| File | text | payment-terms.md |
| Added | text | +1 |
| Removed | text | −1 |

Slots (fill them in the instance, never detach): `Lines`

Built from: `Diff Line`. Icons: file-text

Tokens and styles:
- Colors: `background/destructive`, `background/muted`, `background/success`, `border/default`, `foreground/default`
- Spacing and size: `spacing/2`, `spacing/3`
- Radius: `radius/md`
- Text styles: `code`, `ui/label`

Guides: [content](../../skills/build-ui/components/content.md), [audit-log](../../skills/build-ui/patterns/audit-log.md)

Code: jsdiff (`diffLines`) + custom rows; `react-diff-viewer-continued` for side by side (3 lines of context, rest collapsed; hidden "added" / "removed" text)

## Diff Line

Component set · 3 variants · default size 640 × 24

One line of a diff: number, marker, sign and text. added in success, removed in destructive with strikethrough, context plain. Part of Diff Viewer.

**Use for**

- Each line of a Diff Viewer

**Not for**

- One field that changed on a record: use Change Item

**Anatomy**

1. Line number: mono, muted
2. Marker: color strip (added success, removed destructive)
3. Sign: +, − or blank
4. Text: added, removed with strikethrough, or context

**Content and behavior**

- Type=added in success, Type=removed in destructive with strikethrough, context plain
- The sign is always shown for added and removed lines
- Removed lines come above the added lines that replace them
- Text keeps its whitespace; long lines wrap in prose and scroll in code

**Accessibility**

- The sign carries the meaning; screen readers get "added" or "removed" as visually hidden text
- Line numbers are aria-hidden

| Variant property | Values |
|---|---|
| Type | context, added, removed |

| Property | Type | Default |
|---|---|---|
| Text | text | Payment is due within 30 days of the invoice date. |
| Line | text | 12 |

Tokens and styles:
- Colors: `background/destructive`, `background/success`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/2`
- Text styles: `code`

Guides: [content](../../skills/build-ui/components/content.md)

Code: jsdiff (`diffLines`) + custom rows; `react-diff-viewer-continued` for side by side (3 lines of context, rest collapsed; hidden "added" / "removed" text)

## JSON Viewer

Component · 1 variant · default size 480 × 198

Structured data people inspect: webhook payloads, API responses, event properties, audit details. Keys in default text, strings, numbers and booleans in chart colors; objects and arrays collapse with a chevron; copy the whole payload from the header. Large payloads open collapsed after the first level.

**Use for**

- Webhook payloads and API responses in a log or delivery detail
- Event properties in analytics or audit details
- Metadata of a record in an admin view

**Not for**

- A short example people copy: use Code Block
- Editing data: use a form, or a code editor (Monaco, CodeMirror)
- Field changes: use Change Item

**Anatomy**

1. Header: label and Copy Button Icon
2. Lines: chevron for objects and arrays, key, value
3. Values: strings, numbers and booleans in chart colors; keys in default text

**Content and behavior**

- Large payloads open collapsed after the first level
- Collapsed nodes show a count ("items: [3]")
- Copy copies the whole payload, formatted
- Long strings wrap; null shows as null, never blank
- Mask secrets (tokens, card numbers) before they reach the viewer

**Accessibility**

- Code as a tree (role="tree", role="treeitem", aria-expanded); arrow keys open and close nodes
- Value types are readable without color: quotes for strings
- Value colors keep 4.5:1 on background/muted

Icons: chevron-down

Tokens and styles:
- Colors: `background/muted`, `foreground/default`
- Spacing and size: `spacing/0_5`, `spacing/1`, `spacing/3`, `spacing/4`, `spacing/8`
- Radius: `radius/md`
- Text styles: `code`

Guides: [content](../../skills/build-ui/components/content.md), [audit-log](../../skills/build-ui/patterns/audit-log.md), [content-and-docs](../../skills/build-ui/patterns/content-and-docs.md)

Code: custom tree on `<pre>`, or `react-json-view-lite` themed with tokens (`role="tree"`; collapsed after the first level for large payloads)
