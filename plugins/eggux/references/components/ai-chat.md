# AI Chat

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Attachment](#attachment) | 4 | - |
| [Prompt Input](#prompt-input) | 4 | Attachments, Tools |
| [User Message](#user-message) | 1 | - |
| [Assistant Message](#assistant-message) | 3 | Content |
| [Reasoning](#reasoning) | 3 | - |
| [Tool Call](#tool-call) | 4 | - |
| [Source Item](#source-item) | 1 | - |
| [Sources](#sources) | 1 | Items |
| [Citation](#citation) | 1 | - |
| [Suggestion](#suggestion) | 2 | - |
| [Model Option](#model-option) | 4 | - |
| [Model Selector](#model-selector) | 3 | - |
| [Chat History Item](#chat-history-item) | 3 | - |
| [Context Chip](#context-chip) | 3 | - |
| [Response Feedback](#response-feedback) | 1 | - |
| [Voice Recorder](#voice-recorder) | 2 | - |
| [AI Notice](#ai-notice) | 2 | - |
| [Plan Step](#plan-step) | 4 | - |
| [Agent Plan](#agent-plan) | 1 | Steps |
| [Artifact Card](#artifact-card) | 6 | - |
| [AI Summary](#ai-summary) | 3 | Content |
| [AI Suggestion](#ai-suggestion) | 2 | - |

On the Figma page: "Example / AI on a record page", "Example / agent at work", "Example / chat history", "Stress test / AI components"

## Attachment

Component set · 4 variants · default size 224 × 54

A file or image attached to a prompt or message. Uploading shows progress; error keeps the item with a reason so the user can remove or retry. Put the image as fill on the thumbnail.

| Variant property | Values |
|---|---|
| Type | file, image |
| State | default, uploading, error |

| Property | Type | Default |
|---|---|---|
| Name | text | Q3-report.pdf |
| Meta | text | PDF · 240 KB |
| Show remove | boolean | true |

Built from: `Spinner`. Icons: circle-alert, file-text, x

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `background/muted`, `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/2`, `spacing/6`, `spacing/9`
- Radius: `radius/full`, `radius/lg`, `radius/md`
- Text styles: `ui/caption`, `ui/label`

Guides: [ai-chat](../../skills/build-ui/components/ai-chat.md), [ai-chat](../../skills/build-ui/patterns/ai-chat.md)

Code: react-dropzone + custom

## Prompt Input

Component set · 4 variants · default size 768 × 118

Main input of an AI chat: grows with the text, attachments above, tools and model on the left, voice and send on the right. Enter sends, Shift+Enter new line. While the answer streams, send becomes stop. Send disabled while empty.

| Variant property | Values |
|---|---|
| State | default, focus, streaming, disabled |

| Property | Type | Default |
|---|---|---|
| Placeholder | text | Ask anything… |
| Value | text | Summarize the open invoices for Acme and draft a reminder email. |
| Show attachments | boolean | false |
| Show tools | boolean | true |
| Show voice | boolean | true |

Slots (fill them in the instance, never detach): `Attachments`, `Tools`

Built from: `Attachment`, `Button`, `Button Icon`

Tokens and styles:
- Colors: `background/default`, `border/input`, `border/ring`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/3`
- Radius: `radius/xl`
- Text styles: `body/default`

Guides: [ai-chat](../../skills/build-ui/components/ai-chat.md), [ai-chat](../../skills/build-ui/patterns/ai-chat.md)

Code: Vercel AI SDK + AI Elements, or assistant-ui

## User Message

Component · 1 variant · default size 768 × 48

A message the user sent: muted bubble on the right, max 576 wide, hugs short text. Actions (copy, edit and resend) on hover. Attachments go above the bubble.

| Property | Type | Default |
|---|---|---|
| Text | text | Which invoices for Acme are still open? |
| Show actions | boolean | false |

Built from: `Button Icon`

Tokens and styles:
- Colors: `background/muted`, `foreground/default`
- Spacing and size: `spacing/0_5`, `spacing/1`, `spacing/2_5`, `spacing/4`
- Radius: `radius/xl`
- Text styles: `body/default`

Guides: [ai-chat](../../skills/build-ui/components/ai-chat.md), [ai-chat](../../skills/build-ui/patterns/ai-chat.md)

Code: Vercel AI SDK + AI Elements, or assistant-ui

## Assistant Message

Component set · 3 variants · default size 768 × 232

A reply from the assistant: no bubble, full width for long answers; small avatar marks the speaker. streaming: text grows with a caret, no actions, Prompt Input shows Stop. error: keep the partial answer, explain, offer Retry. Actions under a finished answer: copy, regenerate, good, bad.

| Variant property | Values |
|---|---|
| State | default, streaming, error |

| Property | Type | Default |
|---|---|---|
| Show actions | boolean | true |

Slots (fill them in the instance, never detach): `Content`

Built from: `Alert`, `Button`, `Button Icon`. Icons: sparkles

Tokens and styles:
- Colors: `background/default`, `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/1`, `spacing/2`, `spacing/3`, `spacing/4`, `spacing/8`
- Radius: `radius/full`
- Text styles: `body/default`

Guides: [ai-chat](../../skills/build-ui/components/ai-chat.md), [ai-chat](../../skills/build-ui/patterns/ai-chat.md)

Code: Vercel AI SDK + AI Elements, or assistant-ui

## Reasoning

Component set · 3 variants · default size 720 × 20

The model's thinking, collapsed by default. running: spinner + "Thinking…"; done: "Thought for 12 s" opens a muted summary with a left rule. Never show raw chain of thought as the answer.

| Variant property | Values |
|---|---|
| State | running, collapsed, expanded |

| Property | Type | Default |
|---|---|---|
| Label | text | Thought for 12 s |
| Details | text | The user wants the open invoices for Acme. Search invoices by customer and status, then sum the amounts and sort by due date. |

Built from: `Spinner`. Icons: chevron-down, chevron-right

Tokens and styles:
- Colors: `border/default`, `foreground/muted`
- Spacing and size: `spacing/1_5`, `spacing/2`, `spacing/4`
- Text styles: `body/small`, `ui/label`

Guides: [ai-chat](../../skills/build-ui/components/ai-chat.md), [ai-chat](../../skills/build-ui/patterns/ai-chat.md)

Code: Vercel AI SDK + AI Elements, or assistant-ui

## Tool Call

Component set · 4 variants · default size 720 × 62

An action the assistant takes (search, create, send). Shows what runs and with which input; done collapses, error explains and offers Retry. approval: actions that change data, spend money or contact people wait for the user (Approve / Deny).

| Variant property | Values |
|---|---|
| Status | running, done, error, approval |

| Property | Type | Default |
|---|---|---|
| Title | text | Search invoices |
| Detail | text | customer: Acme, status: open |

Built from: `Badge`, `Button`, `Spinner`. Icons: chevron-down, wrench

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `border/default`, `border/input`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1_5`, `spacing/2`, `spacing/3`
- Radius: `radius/lg`
- Text styles: `body/small`, `ui/caption`, `ui/label`

Guides: [ai-chat](../../skills/build-ui/components/ai-chat.md), [ai-chat](../../skills/build-ui/patterns/ai-chat.md)

Code: Vercel AI SDK + AI Elements, or assistant-ui

## Source Item

Component · 1 variant · default size 320 × 48

One source used in an answer: number (matches the Citation), favicon or initial, title, domain. Opens the source in a new tab; hover = accent background.

| Property | Type | Default |
|---|---|---|
| Number | text | 1 |
| Title | text | Invoice INV-1024 |
| Domain | text | billing.acme.com |

Tokens and styles:
- Colors: `background/muted`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1_5`, `spacing/2`, `spacing/5`
- Radius: `radius/full`, `radius/md`
- Text styles: `ui/caption`, `ui/label`

Guides: [ai-chat](../../skills/build-ui/components/ai-chat.md)

## Sources

Component · 1 variant · default size 720 × 128

Sources behind an answer, under the text. Collapsed: favicons + "3 sources"; open: list of Source Items. Every factual claim from a source gets a Citation.

| Property | Type | Default |
|---|---|---|
| Label | text | 3 sources |
| Show list | boolean | true |

Slots (fill them in the instance, never detach): `Items`

Built from: `Source Item`. Icons: chevron-down

Tokens and styles:
- Colors: `background/default`, `background/muted`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/5`
- Radius: `radius/full`
- Text styles: `ui/caption`, `ui/label`

Guides: [ai-chat](../../skills/build-ui/components/ai-chat.md), [ai-chat](../../skills/build-ui/patterns/ai-chat.md)

Code: Vercel AI SDK + AI Elements, or assistant-ui

## Citation

Component · 1 variant · default size 20 × 20

Inline marker after a claim: number ("1") or domain ("acme.com +2"). Hover shows a Hover Card with the source; click opens it.

| Property | Type | Default |
|---|---|---|
| Label | text | 1 |

Tokens and styles:
- Colors: `background/muted`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/1_5`
- Radius: `radius/full`
- Text styles: `ui/caption`

Guides: [ai-chat](../../skills/build-ui/components/ai-chat.md), [ai-chat](../../skills/build-ui/patterns/ai-chat.md)

Code: Vercel AI SDK + AI Elements, or assistant-ui

## Suggestion

Component set · 2 variants · default size 197 × 38

Starter prompt or follow-up. chip: under the input or after an answer (2-4 follow-ups). card: empty state, 4 tasks the assistant does well. Click fills the input (or sends, for follow-ups).

| Variant property | Values |
|---|---|
| Layout | chip, card |

| Property | Type | Default |
|---|---|---|
| Label | text | Summarize open invoices |
| Description | text | Totals, overdue days and who to remind first |
| Icon | instance swap | Icon/file-text |

Icons: file-text

Tokens and styles:
- Colors: `background/default`, `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/2`, `spacing/3`, `spacing/4`
- Radius: `radius/full`, `radius/xl`
- Text styles: `body/small`, `ui/label`

Guides: [ai-chat](../../skills/build-ui/components/ai-chat.md), [ai-chat](../../skills/build-ui/patterns/ai-chat.md)

Code: Vercel AI SDK + AI Elements, or assistant-ui

## Model Option

Component set · 4 variants · default size 288 × 78

One model in the model menu: name, one-line trade-off (quality, speed, cost), optional badge (exposed: edit its Label and Variant), check on the selected one. Describe models by what they are good for, not by version numbers. 2-4 models; put the default first.

| Variant property | Values |
|---|---|
| Selected | false, true |
| State | default, hover |

| Property | Type | Default |
|---|---|---|
| Name | text | Acme Pro |
| Description | text | Long reports, analysis and code. Slower. |
| Show badge | boolean | true |

Built from: `Badge`. Icons: check, sparkles

Tokens and styles:
- Colors: `background/accent`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/2`, `spacing/3`
- Radius: `radius/sm`
- Text styles: `body/small`, `ui/label`

Guides: [ai-chat](../../skills/build-ui/components/ai-chat.md), [ai-chat](../../skills/build-ui/patterns/ai-chat.md)

Code: AI Elements (model select, task, artifact) or custom on `DropdownMenu`, `Badge`, `Card` (Plan steps from the agent's tool events)

## Model Selector

Component set · 3 variants · default size 121 × 32

Model picker in the Prompt Input Tools slot or a chat header. Opens a menu of Model Options. Show it only when users really choose (cost, speed, data rules); otherwise pick the model for them.

| Variant property | Values |
|---|---|
| State | default, hover, focus |

| Property | Type | Default |
|---|---|---|
| Model | text | Acme Pro |

Icons: chevron-down, sparkles

Tokens and styles:
- Colors: `background/accent`, `foreground/default`
- Spacing and size: `spacing/1_5`, `spacing/2`, `spacing/8`
- Radius: `radius/md`
- Text styles: `ui/label`

Guides: [ai-chat](../../skills/build-ui/components/ai-chat.md), [ai-chat](../../skills/build-ui/patterns/ai-chat.md)

Code: AI Elements (model select, task, artifact) or custom on `DropdownMenu`, `Badge`, `Card` (Plan steps from the agent's tool events)

## Chat History Item

Component set · 3 variants · default size 256 × 50

One conversation in the history list (Sidebar or a panel): title from the first request (one line), relative time, pin. Menu on hover: rename, pin, share, delete (with undo). Group by Today, Previous 7 days, Older; pinned on top.

| Variant property | Values |
|---|---|
| State | default, hover, active |

| Property | Type | Default |
|---|---|---|
| Title | text | Overdue invoices for Northwind |
| Time | text | 2 h ago |
| Pinned | boolean | false |
| Show time | boolean | true |

Built from: `Button Icon`. Icons: pin

Tokens and styles:
- Colors: `background/accent`, `foreground/default`, `foreground/muted`, `sidebar/accent`, `sidebar/accent-foreground`
- Spacing and size: `spacing/0_5`, `spacing/1_5`, `spacing/2`
- Radius: `radius/md`
- Text styles: `body/small`, `ui/caption`

Guides: [ai-chat](../../skills/build-ui/components/ai-chat.md), [ai-chat](../../skills/build-ui/patterns/ai-chat.md)

Code: shadcn `SidebarMenuItem` + `DropdownMenu`

## Context Chip

Component set · 3 variants · default size 127 × 24

What the assistant will use, shown in the Prompt Input (Attachments slot) or above a message: a file, a record (INV-1041) or a person. Each type has its own text property (File, Record, Person). Users add with @ or the paperclip and remove with x. The current page or record is added by default and says so. Labels truncate at 180.

| Variant property | Values |
|---|---|
| Type | file, record, person |

| Property | Type | Default |
|---|---|---|
| Show remove | boolean | true |
| File | text | Q3 report.pdf |
| Record | text | INV-1041 |
| Person | text | Ana Popescu |

Icons: file-text, link, user, x

Tokens and styles:
- Colors: `background/muted`, `foreground/default`
- Spacing and size: `spacing/1`, `spacing/1_5`, `spacing/2`, `spacing/6`
- Radius: `radius/sm`
- Text styles: `ui/label-small`

Guides: [ai-chat](../../skills/build-ui/components/ai-chat.md), [ai-chat](../../skills/build-ui/patterns/ai-chat.md)

Code: AI Elements (model select, task, artifact) or custom on `DropdownMenu`, `Badge`, `Card` (Plan steps from the agent's tool events)

## Response Feedback

Component · 1 variant · default size 480 × 274

Opens under an answer after Bad response: reasons as chips (one or more), optional details, Send. Say what is shared. After Send: toast "Thanks, this helps", the thumb stays filled. Good response sends at once, no form.

| Property | Type | Default |
|---|---|---|
| Title | text | What went wrong? |
| Show details | boolean | true |
| Note | text | Sends this conversation to the Acme team. |

Built from: `Button`, `Button Icon`, `Chip`, `Textarea`

Tokens and styles:
- Colors: `background/card`, `border/default`, `foreground/card`, `foreground/muted`
- Spacing and size: `spacing/2`, `spacing/3`, `spacing/4`
- Radius: `radius/lg`
- Text styles: `ui/caption`, `ui/label`

Guides: [ai-chat](../../skills/build-ui/components/ai-chat.md), [ai-chat](../../skills/build-ui/patterns/ai-chat.md)

Code: `Popover` or inline `Card` with `ToggleGroup` (multiple) and `Textarea` (Send with the message id)

## Voice Recorder

Component set · 2 variants · default size 768 × 62

Replaces the Prompt Input while dictating: cancel, recording dot and time, live waveform, send. Processing shows "Transcribing…"; the text then lands in the input for review, never sent unread. Ask for microphone permission only on the first tap, with a reason.

| Variant property | Values |
|---|---|
| State | recording, processing |

Built from: `Button Icon`, `Spinner`

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `border/default`, `border/input`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/3`
- Radius: `radius/sm`, `radius/xl`
- Text styles: `body/small`, `ui/label`

Guides: [ai-chat](../../skills/build-ui/components/ai-chat.md), [ai-chat](../../skills/build-ui/patterns/ai-chat.md)

Code: MediaRecorder + speech-to-text API; custom UI (Ask for the microphone on first tap)

## AI Notice

Component set · 2 variants · default size 106 × 20

Label: marks content written by AI (summaries, drafts, suggested values) until a person edits or approves it. Disclaimer: one line under AI answers and summaries; keep the same words everywhere. Never hide that content is AI generated.

| Variant property | Values |
|---|---|
| Type | label, disclaimer |

| Property | Type | Default |
|---|---|---|
| Label | text | AI generated |
| Disclaimer | text | AI can make mistakes. Check important details. |

Icons: info, sparkles

Tokens and styles:
- Colors: `background/muted`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/1`, `spacing/1_5`, `spacing/2`
- Radius: `radius/full`
- Text styles: `ui/caption`, `ui/label-small`

Guides: [ai-chat](../../skills/build-ui/components/ai-chat.md), [ai-chat](../../skills/build-ui/patterns/ai-chat.md)

Code: custom on `Card`, `Input`, `Badge` (Store who accepted an AI value and when)

## Plan Step

Component set · 4 variants · default size 560 × 38

One step of an agent plan: pending (outline circle, muted), running (spinner), done (check), error (alert, Error text says what failed and what happens next). Title says what the step does in the user's words; Detail says what it found.

| Variant property | Values |
|---|---|
| Status | pending, running, done, error |

| Property | Type | Default |
|---|---|---|
| Title | text | Find overdue invoices in Q3 |
| Detail | text | Found 24 invoices from 9 customers |
| Error | text | The invoices service did not respond. Retrying in 10 s. |
| Show detail | boolean | true |
| Time | text | 4 s |
| Show time | boolean | true |

Built from: `Spinner`. Icons: circle-alert, circle-check

Tokens and styles:
- Colors: `background/destructive`, `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/3`
- Text styles: `body/small`, `ui/caption`

Guides: [ai-chat](../../skills/build-ui/components/ai-chat.md), [ai-chat](../../skills/build-ui/patterns/ai-chat.md)

Code: AI Elements (model select, task, artifact) or custom on `DropdownMenu`, `Badge`, `Card` (Plan steps from the agent's tool events)

## Agent Plan

Component · 1 variant · default size 640 × 334

A multi-step task the assistant runs: title, where it is and time left, Stop, progress, the steps (Plan Steps in the Steps slot), and what it will not do without approval. Steps that act outside the product (send, pay, delete) become a Tool Call with approval. Keep the plan visible after it finishes, collapsed to its result.

| Property | Type | Default |
|---|---|---|
| Title | text | Preparing the Q3 overdue report |
| Status | text | Step 3 of 5 · about 1 min left |
| Footer | text | Runs in the background. Nothing is sent without your approval. |
| Show stop | boolean | true |
| Show footer | boolean | true |

Slots (fill them in the instance, never detach): `Steps`

Built from: `Button`, `Plan Step`, `Progress`. Icons: info, sparkles

Tokens and styles:
- Colors: `background/card`, `border/default`, `foreground/card`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/1_5`, `spacing/2`, `spacing/3`, `spacing/4`
- Radius: `radius/lg`
- Text styles: `ui/caption`, `ui/label`

Guides: [ai-chat](../../skills/build-ui/components/ai-chat.md), [ai-chat](../../skills/build-ui/patterns/ai-chat.md)

Code: AI Elements (model select, task, artifact) or custom on `DropdownMenu`, `Badge`, `Card` (Plan steps from the agent's tool events)

## Artifact Card

Component set · 6 variants · default size 360 × 66

Something the assistant made (document, chart, table) shown in the conversation as a card; Open shows it in a side canvas or its page, where people edit, export or save it. Meta says the type, size and version. Each regeneration makes a new version; never overwrite silently.

| Variant property | Values |
|---|---|
| Type | document, chart, table |
| State | default, hover |

| Property | Type | Default |
|---|---|---|
| Document title | text | Q3 overdue invoices report |
| Document meta | text | Document · 3 pages · v2 |
| Chart title | text | Overdue by customer |
| Chart meta | text | Chart · bar · 9 customers |
| Table title | text | Reminder list |
| Table meta | text | Table · 24 rows · 5 columns |

Built from: `Button`. Icons: chart-column, columns-3, file-text

Tokens and styles:
- Colors: `background/accent`, `background/card`, `background/muted`, `border/default`, `foreground/card`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/10`, `spacing/3`
- Radius: `radius/lg`, `radius/md`
- Text styles: `ui/caption`, `ui/label`

Guides: [ai-chat](../../skills/build-ui/components/ai-chat.md), [ai-chat](../../skills/build-ui/patterns/ai-chat.md)

Code: AI Elements (model select, task, artifact) or custom on `DropdownMenu`, `Badge`, `Card` (Plan steps from the agent's tool events)

## AI Summary

Component set · 3 variants · default size 640 × 218

AI summary on a record or report page: what matters now, in 2-4 sentences with numbers and dates, from named sources. Generating shows what it reads; error says what failed and offers Try again. Regenerate keeps the previous version until the new one is ready. Opening the sources shows exactly what was used.

| Variant property | Values |
|---|---|
| State | ready, generating, error |

| Property | Type | Default |
|---|---|---|
| Title | text | Summary |
| Meta | text | 4 sources · generated 2 min ago |
| Show feedback | boolean | true |
| Show disclaimer | boolean | true |

Slots (fill them in the instance, never detach): `Content`

Built from: `AI Notice`, `Button`, `Button Icon`, `Skeleton`, `Spinner`. Icons: sparkles

Tokens and styles:
- Colors: `background/card`, `border/default`, `foreground/card`, `foreground/muted`
- Spacing and size: `spacing/2`, `spacing/3`, `spacing/4`
- Radius: `radius/lg`
- Text styles: `body/small`, `ui/caption`, `ui/label`

Guides: [ai-chat](../../skills/build-ui/components/ai-chat.md), [ai-chat](../../skills/build-ui/patterns/ai-chat.md)

Code: custom on `Card`, `Input`, `Badge` (Store who accepted an AI value and when)

## AI Suggestion

Component set · 2 variants · default size 320 × 124

A value the AI proposes for a form field: dashed tinted box with the value, the reason, Accept and Dismiss. Nothing is saved until the person accepts. Accepted values keep an "AI generated" label until edited, with Undo. Several suggestions on one form: offer "Accept all" at the top, still one by one below.

| Variant property | Values |
|---|---|
| State | suggested, accepted |

| Property | Type | Default |
|---|---|---|
| Label | text | Expense category |
| Value | text | Office supplies |
| Reason | text | Based on 12 earlier invoices from this vendor. |

Built from: `AI Notice`, `Button`. Icons: sparkles

Tokens and styles:
- Colors: `background/accent`, `background/default`, `border/input`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1_5`, `spacing/2`, `spacing/3`
- Radius: `radius/md`
- Text styles: `body/small`, `ui/caption`, `ui/label`

Guides: [ai-chat](../../skills/build-ui/components/ai-chat.md), [ai-chat](../../skills/build-ui/patterns/ai-chat.md)

Code: custom on `Card`, `Input`, `Badge` (Store who accepted an AI value and when)
