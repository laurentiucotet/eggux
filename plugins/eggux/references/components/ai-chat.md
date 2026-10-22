# AI Chat

Generated from the EGG UI master library on 2026-10-22 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Prompt Input](#prompt-input) | 4 | Attachments, Tools |
| [Attachment](#attachment) | 4 | - |
| [User Message](#user-message) | 1 | - |
| [Assistant Message](#assistant-message) | 3 | Content |
| [Reasoning](#reasoning) | 3 | - |
| [Tool Call](#tool-call) | 4 | - |
| [Sources](#sources) | 1 | Items |
| [Source Item](#source-item) | 1 | - |
| [Citation](#citation) | 1 | - |
| [Prompt Suggestion](#prompt-suggestion) | 2 | - |
| [Model Picker](#model-picker) | 3 | - |
| [Model Option](#model-option) | 4 | - |
| [Chat History Item](#chat-history-item) | 3 | - |
| [Context Chip](#context-chip) | 3 | - |
| [Response Feedback](#response-feedback) | 1 | - |
| [Voice Recorder](#voice-recorder) | 2 | - |
| [Agent Plan](#agent-plan) | 1 | Steps |
| [Plan Step](#plan-step) | 4 | - |
| [Artifact Card](#artifact-card) | 6 | - |
| [AI Summary](#ai-summary) | 3 | Content |
| [AI Notice](#ai-notice) | 2 | - |
| [AI Suggestion](#ai-suggestion) | 2 | - |
| [AI Loading](#ai-loading) | 1 | - |
| [Confidence Indicator](#confidence-indicator) | 3 | - |
| [AI Review Bar](#ai-review-bar) | 1 | - |

On the Figma page: "Example / AI on a record page", "Example / agent at work", "Example / chat history", "Example / context added to a request", "Example / dictating a request", "Example / feedback after a bad answer", "Example / in ai assistant panel", "Example / in ai chat empty", "Example / in ai conversation", "Example / model choice in the assistant", "Example / report made by the assistant", "Example / suggested category on a new invoice", "Stress test / AI Loading", "Stress test / AI Review Bar", "Stress test / AI Suggestion", "Stress test / AI Summary", "Stress test / AI components", "Stress test / Agent Plan", "Stress test / Artifact Card", "Stress test / Assistant Message", "Stress test / Chat History Item", "Stress test / Confidence Indicator", "Stress test / Context Chip", "Stress test / Prompt Input", "Stress test / Prompt Suggestion", "Stress test / Reasoning", "Stress test / Response Feedback", "Stress test / Sources", "Stress test / Tool Call", "Stress test / User Message", "Stress test / Voice Recorder"

## Prompt Input

Component set · 4 variants · default size 768 × 118

Main input of an AI chat: grows with the text, attachments above, tools and model on the left, voice and send on the right. Enter sends, Shift+Enter new line. While the answer streams, send becomes stop. Send disabled while empty.

**Use for**

- Full chat page, docked assistant panel or inline AI where people type a request
- Requests that need files or context: turn on Show attachments and fill the Attachments slot
- Model or tool choices users really make: Model Picker in the Tools slot

**Not for**

- One known task (summarize, classify): use a Button with sparkles or a Prompt Suggestion
- Chat between people: use Chat Composer
- While dictating: the Voice Recorder replaces it until the transcript is ready

**Anatomy**

1. Attachments slot above the text: Attachment and Context Chip (Show attachments)
2. Text area with Placeholder or Value
3. Tools slot on the left: tools and Model Picker (Show tools)
4. Voice Button Icon on the right (Show voice)
5. Send Button Icon (arrow-up); Stop (square) while State=streaming

**Content and behavior**

- Enter sends, Shift+Enter adds a new line
- Grows to about 8 lines, then scrolls
- Send is disabled while the field is empty
- State=streaming: Send becomes Stop; Stop keeps what was generated so far
- Hide Tools and voice where they do not apply (panel, inline)
- Never a blank box alone: pair the empty chat with 3-4 starter Suggestions
- Keep drafts per conversation; show limits (file size, context) before they are hit

**Accessibility**

- Text area has an accessible label; the Placeholder is an example, never the label
- Send, Stop, voice and attach have accessible labels and tooltips
- Focus returns to the input after sending
- State=focus shows the border/ring focus ring around the whole field

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

## User Message

Component · 1 variant · default size 768 × 48

A message the user sent: muted bubble on the right, max 576 wide, hugs short text. Actions (copy, edit and resend) on hover. Attachments go above the bubble.

**Use for**

- Every message the person sends in an AI chat
- Shown at once on send, before the assistant starts
- Above the bubble, the files sent with it (Attachment)

**Not for**

- Answers from the assistant: use Assistant Message
- Chat between people: use Chat Message
- Comments on a record: use Comment

**Anatomy**

1. Attachments above the bubble (Attachment)
2. Bubble with Text: muted, max 576 wide, hugs short text
3. Actions under the bubble: copy, edit and resend (Show actions)

**Content and behavior**

- Text is shown as sent; never rewrite or trim it
- Actions show on hover on desktop and always on touch
- Edit and resend continues the conversation from that message
- The user's message is never lost, even when the answer fails

**Accessibility**

- Copy and Edit Button Icons have accessible labels and tooltips with the same text
- Actions shown on hover also show on keyboard focus
- Each message says who sent it to screen readers (visually hidden "You")

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

**Use for**

- Every answer in a chat page or assistant panel
- Answers that include Reasoning, Tool Calls, lists, tables, Code Blocks and Sources
- Streaming replies (State=streaming) and failed replies (State=error)

**Not for**

- Messages the user sent: use User Message
- A one-off AI result on a record page: use AI Summary
- Messages between people: use Chat Message

**Anatomy**

1. Avatar with the sparkles icon, marks the speaker
2. Content slot: Reasoning, Tool Calls, text, lists, tables, Code Blocks, in the order they happened
3. Sources, with Citations in the text
4. Actions: copy, regenerate, good, bad (Show actions)
5. Alert with the reason and Retry (State=error)

**Content and behavior**

- Lead with the answer, then the detail; short paragraphs in body/default (panel: body/small)
- State=streaming: text grows with a caret, no actions, Prompt Input shows Stop
- State=error: keep the partial answer, say what happened, offer Retry
- Facts from data get a Citation; with no source, say "I could not find…" instead of guessing
- Do not auto-scroll when the user scrolled up; show "Jump to latest"
- Sanitize model output before rendering HTML

**Accessibility**

- Streaming text is announced with aria-live="polite", once per finished paragraph, not per token
- Action tooltips and labels: Copy, Regenerate, Good response, Bad response
- Actions show on keyboard focus as well as hover
- Reduced motion: no typing animation, show text in chunks

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

**Use for**

- Answers where the model reasons before replying
- Inside the Assistant Message Content slot, before the answer
- Long waits before an answer, so people see the model is working

**Not for**

- Actions the assistant runs (search, create, send): use Tool Call
- The answer itself: write it in the Assistant Message, never inside Reasoning
- Multi-step tasks with progress: use Agent Plan

**Anatomy**

1. Chevron: chevron-right closed, chevron-down open
2. Label: Spinner and "Thinking…" while running, "Thought for 12 s" when done
3. Details: muted summary with a left rule (State=expanded)

**Content and behavior**

- State=running appears within 100 ms of sending
- Collapsed by default when done; the person opens it
- Label says how long it took ("Thought for 12 s")
- Details is a summary that explains; never show raw chain of thought as the answer

**Accessibility**

- The Label row is a button with aria-expanded
- Running state is announced once (role="status"), not on every update
- Details text in foreground/muted still meets 4.5:1

| Variant property | Values |
|---|---|
| State | running, collapsed, expanded |

| Property | Type | Default |
|---|---|---|
| Label | text | Thought for 12 s |
| Details | text | The user wants the open invoices for Acme. Search invoices by customer and status, then sum the amounts and sort by due date. |
| Status | text | Thinking… |

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

**Use for**

- Each tool the assistant uses while answering
- Actions that change data, send messages or spend money: Status=approval before they run
- Steps of an Agent Plan that act outside the product

**Not for**

- The model's thinking: use Reasoning
- A task with more than 2 steps: use Agent Plan with Plan Steps

**Anatomy**

1. Wrench icon, or Spinner while running
2. Title: what runs ("Search invoices")
3. Description: the input ("customer: Acme, status: open")
4. Status Badge
5. Chevron to open the input and the result
6. Approve and Deny (Status=approval) or Retry (Status=error)

**Content and behavior**

- Reading is free; writing asks: changes, messages, payments and hard-to-undo actions use Status=approval
- Approval shows what, to whom, with a preview; never act silently
- Status=done collapses; Status=error explains what failed and offers Retry
- After an approved action, confirm what changed with a link, and offer Undo when possible
- The assistant cannot do what the user cannot

**Accessibility**

- Status is in text (Show badge), never color alone
- Status changes are announced politely (aria-live)
- Approve and Deny are buttons in reading order, reachable by keyboard

| Variant property | Values |
|---|---|
| Status | running, done, error, approval |

| Property | Type | Default |
|---|---|---|
| Title | text | Search invoices |
| Description | text | customer: Acme, status: open |

Built from: `Badge`, `Button`, `Spinner`. Icons: chevron-down, wrench

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `border/default`, `border/input`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1_5`, `spacing/2`, `spacing/3`
- Radius: `radius/lg`
- Text styles: `body/small`, `ui/caption`, `ui/label`

Guides: [ai-chat](../../skills/build-ui/components/ai-chat.md), [ai-chat](../../skills/build-ui/patterns/ai-chat.md)

Code: Vercel AI SDK + AI Elements, or assistant-ui

## Sources

Component · 1 variant · default size 720 × 128

Sources behind an answer, under the text. Collapsed: favicons + "3 sources"; open: list of Source Items. Every factual claim from a source gets a Citation.

**Use for**

- Answers with facts from data, documents or the web
- AI Summary, to show exactly what was used
- Assistant panel answers about the current record, linking the records used

**Not for**

- A marker after one claim: use Citation
- Records the user will act on: link them in the text

**Anatomy**

1. Favicons and Label ("3 sources") when collapsed
2. Chevron-down
3. Items slot: Source Items with Number, favicon or initial, Title and Domain (Show list)
4. Citations in the text, numbered like the Source Items

**Content and behavior**

- Every factual claim from a source gets a Citation with its Source Item number
- A Source Item opens the source in a new tab
- List only sources the user can open
- Citation hover shows a Hover Card with the source; click opens it

**Accessibility**

- The toggle is a button with aria-expanded and the count in its name
- Links that open a new tab say so to screen readers
- Each Citation has a label naming the source ("Source 1: Invoice INV-1024")

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

## Prompt Suggestion

Component set · 2 variants · default size 195 × 32

Starter prompt or follow-up. chip: under the input or after an answer (2-4 follow-ups). card: empty state, 4 tasks the assistant does well. Click fills the input (or sends, for follow-ups).

**Use for**

- Empty chat: Layout=card, 4 tasks the assistant does well
- Under the input or after an answer: Layout=chip for follow-ups
- Next to content for one known task (summarize, suggest a reply)

**Not for**

- Filters and selections: use Chip
- A command that runs at once with no prompt: use a Button with sparkles

**Anatomy**

1. Icon (instance swap, Layout=card)
2. Label: the prompt, starting with a verb
3. Description: what the result contains (Layout=card)

**Content and behavior**

- Starters come from real user tasks, never generic examples
- Follow-ups: 2-4 chips, only when the next step is predictable
- Click fills the input; follow-up chips send at once
- Label is short: "Summarize open invoices"

**Accessibility**

- Each Suggestion is a button named by its Label
- Reachable with Tab; focus shows the border/ring focus ring

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
- Spacing and size: `spacing/1_5`, `spacing/2`, `spacing/3`, `spacing/4`
- Radius: `radius/full`, `radius/xl`
- Text styles: `body/small`, `ui/label`

Guides: [ai-chat](../../skills/build-ui/components/ai-chat.md), [ai-chat](../../skills/build-ui/patterns/ai-chat.md)

Code: Vercel AI SDK + AI Elements, or assistant-ui

## Model Picker

Component set · 3 variants · default size 121 × 32

Model picker in the Prompt Input Tools slot or a chat header. Opens a menu of Model Options. Show it only when users really choose (cost, speed, data rules); otherwise pick the model for them.

**Use for**

- Users really choose between cost, speed or data rules
- Products that offer 2-4 models
- Chat header of a full chat page, when the choice applies to the whole conversation

**Not for**

- One sensible model: pick it for the user and leave the selector out
- Choosing a value in a form: use Select

**Anatomy**

1. Sparkles icon
2. Model: the current model name
3. Chevron-down
4. Menu of Model Options: Name, Description, optional Badge, check on the selected one

**Content and behavior**

- Describe models by what they are good for, not by version numbers
- 2-4 Model Options; the default first
- Description states the trade-off in one line: quality, speed, cost

**Accessibility**

- Trigger is a button with aria-haspopup and a name like "Model: Acme Pro"
- Arrow keys move in the menu, Enter selects, Esc closes and returns focus
- The selected option has a check and aria-checked, not color alone

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

## Chat History Item

Component set · 3 variants · default size 256 × 50

One conversation in the history list (Sidebar or a panel): title from the first request (one line), relative time, pin. Menu on hover: rename, pin, share, delete (with undo). Group by Today, Previous 7 days, Older; pinned on top.

**Use for**

- History of an AI chat app in the Sidebar
- A list of past conversations in an assistant panel
- Pinned conversations, at the top of the list (Pinned on)

**Not for**

- Navigation between product pages: use Sidebar menu items
- A list of records: use a table of Table Cells or List Items

**Anatomy**

1. Pin icon (Pinned)
2. Title: one line, from the first request
3. Time: relative, "2 h ago" (Show time)
4. Menu Button Icon on hover: rename, pin, share, delete

**Content and behavior**

- Title is generated from the first message, one line, editable
- Group by date (Today, Previous 7 days, older); pinned items on top
- State=active marks the open conversation
- Delete offers Undo
- Search the list when there are more than about 20 conversations; New chat at the top

**Accessibility**

- The item is a link; the open one has aria-current="page"
- The menu button has a label ("Options for <title>") and shows on keyboard focus
- A truncated Title is available in full in a tooltip

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

**Use for**

- The current page or record in an assistant panel, added by default
- Files, records and people added with @ or the paperclip
- Above a sent message, to show what it used

**Not for**

- Files uploading or failing: use Attachment
- Filters: use Chip
- Status of an object: use Badge

**Anatomy**

1. Icon by Type: file-text (file), link (record), user (person)
2. Label from the File, Record or Person text property
3. Remove x (Show remove)

**Content and behavior**

- Each Type has its own text property: File, Record, Person
- Labels truncate at 180
- The current page or record is added by default and says so; the user can remove it
- Never use data the user cannot open

**Accessibility**

- Remove x is a button labeled "Remove <label>"
- A truncated label is available in full in a tooltip
- Adding or removing a chip is announced politely

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

**Use for**

- After Bad response on an Assistant Message or an AI Summary
- Answers people can rate as wrong, incomplete or unsafe
- Only after the user chose Bad response; never open it unasked

**Not for**

- Good response: send at once, no form
- General product feedback: use a feedback form in a Dialog

**Anatomy**

1. Title ("What went wrong?")
2. Reasons as Chips, one or more
3. Details Textarea, optional (Show details)
4. Note: what is shared
5. Send Button and close Button Icon

**Content and behavior**

- Opens under the answer, as an inline Card or a Popover
- One or more reasons; details are optional
- The Note says what is shared before Send ("Sends this conversation to the Acme team.")
- After Send: toast "Thanks, this helps"; the thumb stays filled
- Send with the message id

**Accessibility**

- Focus moves into the form on open; Esc closes and returns focus to Bad response
- Reason Chips are toggle buttons with aria-pressed
- The Textarea has a visible label

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

**Use for**

- Prompt Input with Show voice on, while recording and transcribing
- Mobile and hands-busy input
- Long requests that are easier to say than to type

**Not for**

- Panel and inline AI: hide voice (Show voice off)
- Products without speech-to-text: turn Show voice off

**Anatomy**

1. Cancel Button Icon
2. Recording dot and time
3. Live waveform
4. Send Button Icon
5. Spinner and "Transcribing…" (State=processing)

**Content and behavior**

- Ask for microphone permission only on the first tap, with a reason
- State=processing shows "Transcribing…"
- The transcript lands in the Prompt Input for review; never send it unread
- Cancel returns to the Prompt Input

**Accessibility**

- Cancel and Send have accessible labels and tooltips
- Recording and its time are announced, not shown by the red dot alone
- Focus returns to the Prompt Input with the transcript

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

## Agent Plan

Component · 1 variant · default size 640 × 334

A multi-step task the assistant runs: title, where it is and time left, Stop, progress, the steps (Plan Steps in the Steps slot), and what it will not do without approval. Steps that act outside the product (send, pay, delete) become a Tool Call with approval. Keep the plan visible after it finishes, collapsed to its result.

**Use for**

- Tasks with more than 2 steps
- Long tasks that run in the background
- Agent work that produces Artifact Cards (report, chart, table)

**Not for**

- A single action: use Tool Call
- The model's thinking: use Reasoning
- Progress of an upload or import: use Progress

**Anatomy**

1. Sparkles icon and Title
2. Status: step N of M and time left
3. Stop Button (Show stop)
4. Progress bar
5. Steps slot: Plan Steps (pending, running, done, error) with Title, Detail and Time
6. Footer: what it will not do without approval (Show footer)

**Content and behavior**

- Steps say what they do in the user's words ("Check payment history"), not tool names
- Steps that send, pay or delete become a Tool Call with Status=approval
- A failed step says what failed and what happens next; the plan never stops silently
- Background tasks say so and notify when done
- After it finishes, keep the plan in the conversation, collapsed to its result

**Accessibility**

- Stop has a label and is always reachable by keyboard
- Step changes are announced politely, once per step
- Step status is in icon and text, never color alone
- Progress has role="progressbar" with aria-valuenow

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

## Plan Step

Component set · 4 variants · default size 560 × 38

One step of an agent plan: pending (outline circle, muted), running (spinner), done (check), error (alert, Error text says what failed and what happens next). Title says what the step does in the user's words; Detail says what it found.

| Variant property | Values |
|---|---|
| Status | pending, running, done, error |

| Property | Type | Default |
|---|---|---|
| Title | text | Find overdue invoices in Q3 |
| Description | text | Found 24 invoices from 9 customers |
| Error | text | The invoices service did not respond. Retrying in 10 s. |
| Show description | boolean | true |
| Time | text | 4 s |
| Show time | boolean | true |

Built from: `Spinner`. Icons: circle-alert, circle-check

Tokens and styles:
- Colors: `background/destructive`, `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/3`
- Text styles: `body/small`, `ui/caption`

Guides: [ai-chat](../../skills/build-ui/components/ai-chat.md), [ai-chat](../../skills/build-ui/patterns/ai-chat.md)

Code: AI Elements (model select, task, artifact) or custom on `DropdownMenu`, `Badge`, `Card` (Plan steps from the agent's tool events)

## Artifact Card

Component set · 6 variants · default size 360 × 66

Something the assistant made (document, chart, table) shown in the conversation as a card; Open shows it in a side canvas or its page, where people edit, export or save it. Meta says the type, size and version. Each regeneration makes a new version; never overwrite silently.

**Use for**

- Reports, charts, tables and drafts an agent produces
- Results people will edit, export or save
- Every new version of a result the assistant regenerated

**Not for**

- Short answers: write them in the Assistant Message
- Files the user attached: use Attachment
- Sources used for an answer: use Sources

**Anatomy**

1. Icon by Type: file-text, chart-column, columns-3
2. Title: Document title, Chart title or Table title
3. Meta: type, size and version
4. Open Button

**Content and behavior**

- Open shows it in a side canvas or its page, where people edit, export or save
- Meta names type, size and version ("Document · 3 pages · v2")
- Each regeneration makes a new version; never overwrite silently
- Each Type has its own title and meta properties

**Accessibility**

- Open has a name with the title ("Open Q3 overdue invoices report")
- The type is in the Meta text, not only in the icon
- Keyboard focus shows the border/ring focus ring

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

**Use for**

- Record pages (customer, project, invoice) and report pages
- Long histories people need in a few lines
- Report pages, to state what changed in the period in numbers

**Not for**

- Open questions about the record: use the assistant panel
- A proposed value for a field: use AI Suggestion
- One number people check: use Stat Card

**Anatomy**

1. Sparkles icon and Title
2. Meta: sources and age ("4 sources · generated 2 min ago")
3. Content slot: 2-4 sentences
4. Feedback and regenerate Button Icons (Show feedback)
5. AI Notice disclaimer (Show disclaimer)

**Content and behavior**

- 2-4 sentences with numbers and dates, from named sources
- Opening the sources shows exactly what was used
- State=generating shows what it reads; State=error says what failed and offers Try again
- Regenerate keeps the previous version until the new one is ready
- The disclaimer uses the same words everywhere

**Accessibility**

- Generating and ready are announced politely
- Feedback and regenerate have labels and tooltips
- Disclaimer text in foreground/muted still meets 4.5:1

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

## AI Suggestion

Component set · 2 variants · default size 320 × 124

A value the AI proposes for a form field: dashed tinted box with the value, the reason, Accept and Dismiss. Nothing is saved until the person accepts. Accepted values keep an "AI generated" label until edited, with Undo. Several suggestions on one form: offer "Accept all" at the top, still one by one below.

**Use for**

- Form fields AI can fill from existing data (category, tags, owner)
- Several suggestions on one form, with "Accept all" at the top
- Imported or scanned documents, to propose values for review

**Not for**

- Values only the person knows: use a plain Input
- A summary of a record: use AI Summary

**Anatomy**

1. Label: the field
2. Dashed tinted box with the Value
3. Reason ("Based on 12 earlier invoices from this vendor.")
4. Accept and Dismiss Buttons
5. AI Notice label and Undo (State=accepted)

**Content and behavior**

- Nothing is saved until the person accepts
- Accepted values keep an "AI generated" label until edited, with Undo
- Low confidence says so in the Reason
- Several suggestions: "Accept all" at the top, still one by one below
- Store who accepted the value and when

**Accessibility**

- Accept and Dismiss name the field ("Accept Expense category")
- After Accept or Dismiss, focus moves to the field
- The dashed border is not the only signal: the AI Notice says it in text

| Variant property | Values |
|---|---|
| State | suggested, accepted |

| Property | Type | Default |
|---|---|---|
| Label | text | Expense category |
| Value | text | Office supplies |
| Reason | text | Based on 12 earlier invoices from this vendor. |
| Note | text | Suggested by AI and accepted by you. Undo |

Built from: `AI Notice`, `Button`. Icons: sparkles

Tokens and styles:
- Colors: `background/accent`, `background/default`, `border/input`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1_5`, `spacing/2`, `spacing/3`
- Radius: `radius/md`
- Text styles: `body/small`, `ui/caption`, `ui/label`

Guides: [ai-chat](../../skills/build-ui/components/ai-chat.md), [ai-chat](../../skills/build-ui/patterns/ai-chat.md)

Code: custom on `Card`, `Input`, `Badge` (Store who accepted an AI value and when)

## AI Loading

Component · 1 variant · default size 560 × 152

Placeholder while AI writes an answer or a summary in place: what it is doing now ("Reading 12 invoices"), shimmer lines in the shape of the result, step and time left, Stop. Replace the status text as steps change; stream text into place as soon as it arrives. Under 1 second, show nothing.

**Use for**

- A summary written into a page
- Values extracted from files
- An answer generated outside chat

**Not for**

- The model's thinking in chat: use Reasoning
- Steps an agent runs: use Agent Plan
- Content that is not AI: use Skeleton
- AI work that runs for minutes: use Background Job

**Anatomy**

1. Status row: sparkles icon, status ("Reading 12 invoices…"), Stop Button (Show stop)
2. Lines: shimmer in the shape of the result
3. Progress (Show progress): step and time left, ui/caption, muted

**Content and behavior**

- The status says what it does now; replace it as steps change
- Stream text into place as soon as it arrives
- Under 1 second, show nothing
- Stop keeps what arrived and says it stopped
- Time left only when it is known

**Accessibility**

- Status text is in role="status" (aria-live="polite"), updated per step, not per token
- The region has aria-busy="true"; Stop is reachable by keyboard and Esc
- The shimmer stops with prefers-reduced-motion

| Property | Type | Default |
|---|---|---|
| Status | text | Reading 12 invoices… |
| Progress | text | Step 2 of 3 · about 10 seconds left |
| Show progress | boolean | true |
| Show stop | boolean | true |

Built from: `Button`. Icons: sparkles

Tokens and styles:
- Colors: `background/card`, `background/muted`, `border/default`, `foreground/card`, `foreground/muted`
- Spacing and size: `spacing/2`, `spacing/3`, `spacing/4`
- Radius: `radius/full`, `radius/lg`
- Text styles: `ui/caption`, `ui/label`

Guides: [ai-chat](../../skills/build-ui/patterns/ai-chat.md), [loading-states](../../skills/build-ui/patterns/loading-states.md)

Code: shadcn `Skeleton`, `Tooltip`, `Button` + custom; Vercel AI SDK for streaming; review bar on Tiptap track changes or a diff of the form state (Never apply low-confidence values automatically; store who accepted an AI value)

## Confidence Indicator

Component set · 3 variants · default size 137 × 16

Says how sure the AI is about an extracted value, match or answer: high, medium, low. Put it next to the value; the info icon opens a Tooltip with why (source found, partial match, guess). Low confidence asks people to check and never auto-applies. Use 3 levels; never show raw percentages.

**Use for**

- Values extracted from a document
- Matches in a reconciliation
- Answers with weak sources

**Not for**

- The status of a record: use Badge
- A score toward a goal: use Progress
- A rating: use Rating

**Anatomy**

1. Bars: 3, filled by level
2. Label: "High confidence", ui/caption
3. Info (Show info): icon that opens a Tooltip with the reason

**Content and behavior**

- Three levels; never raw percentages
- Next to the value it describes
- The Tooltip says why (source found, partial match, guess)
- Low asks people to check and never auto-applies
- Level is in bars and words; color supports it

**Accessibility**

- The word is read with the value
- Info is a button named "Why medium confidence"; the Tooltip opens on focus
- Bars are aria-hidden

| Variant property | Values |
|---|---|
| Level | high, medium, low |

| Property | Type | Default |
|---|---|---|
| Show info | boolean | true |

Icons: info

Tokens and styles:
- Colors: `background/destructive`, `background/success`, `background/warning`, `border/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/2`
- Radius: `radius/full`
- Text styles: `ui/caption`

Guides: [ai-chat](../../skills/build-ui/patterns/ai-chat.md)

Code: shadcn `Skeleton`, `Tooltip`, `Button` + custom; Vercel AI SDK for streaming; review bar on Tiptap track changes or a diff of the form state (Never apply low-confidence values automatically; store who accepted an AI value)

## AI Review Bar

Component · 1 variant · default size 690 × 50

Floating bar for reviewing AI edits in a document or form one by one: position, previous and next, accept or reject the current one, accept or reject all. Each suggestion shows inline as AI Suggestion. Keyboard: Tab next, Enter accept, Backspace reject. Accept all asks once when changes are many.

**Use for**

- AI edits in a document
- A form AI filled from a file
- Bulk AI categorization to review

**Not for**

- One suggestion inline: use AI Suggestion
- An action the AI wants to run: use Tool Call
- Unsaved form changes: use Save Bar

**Anatomy**

1. Icon: sparkles
2. Count: "3 of 7 suggestions"
3. Navigation: previous and next Button Icons
4. Reject and Accept Buttons
5. Reject all and Accept all (Show bulk actions)

**Content and behavior**

- Each suggestion shows inline as AI Suggestion; the bar moves between them
- Keyboard: Tab next, Enter accept, Backspace reject
- Accept all asks once when the changes are many
- Floats at the bottom center of the document until all are reviewed
- Accepted changes can be undone; at the end the bar sums up and leaves

**Accessibility**

- role="toolbar" with aria-label "Review suggestions"
- The position is announced politely as it changes; focus moves to the current suggestion
- Shortcuts show in Tooltips with Kbd

| Property | Type | Default |
|---|---|---|
| Count | text | 3 of 7 suggestions |
| Show bulk actions | boolean | true |

Built from: `Button`, `Button Icon`. Icons: sparkles

Tokens and styles:
- Colors: `background/popover`, `border/default`, `foreground/popover`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/3`
- Radius: `radius/lg`
- Text styles: `ui/label`
- Effects: `shadow/lg`

Guides: [ai-chat](../../skills/build-ui/patterns/ai-chat.md)

Code: shadcn `Skeleton`, `Tooltip`, `Button` + custom; Vercel AI SDK for streaming; review bar on Tiptap track changes or a diff of the form state (Never apply low-confidence values automatically; store who accepted an AI value)
