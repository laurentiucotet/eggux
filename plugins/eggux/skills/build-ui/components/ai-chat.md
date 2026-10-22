# AI chat components

Usage guidelines only. Visual specs live in the Figma components (AI Chat page). When to use
which surface and the behavior rules: `patterns/ai-chat.md`.

| Component | Variants | Use |
|---|---|---|
| `Prompt Input` | State: default, focus, streaming, disabled | Main input: Attachments and Tools slots, voice, send (stop while streaming) |
| `Attachment` | Type: file, image. State: default, uploading, error | File in the input or above a user message |
| `User Message` | - | Muted bubble on the right, hugs short text, max 576 |
| `Assistant Message` | State: default, streaming, error | Full-width answer with a small avatar; Content slot; copy, regenerate, good, bad |
| `Reasoning` | State: running, collapsed, expanded | Thinking status and its summary |
| `Tool Call` | Status: running, done, error, approval | An action the assistant runs; approval waits for the user |
| `Sources`, `Source Item` | - | Sources under an answer, numbered like the Citations |
| `Citation` | - | Inline marker after a claim, number or domain |
| `Prompt Suggestion` | Layout: chip, card | Starter prompts (cards or chips) and follow-ups (chips) |
| `Model Picker`, `Model Option` | Picker: default, hover, focus. Option: Selected × State | Model picker in the Tools slot and its menu rows (name, trade-off, badge) |
| `Context Chip` | Type: file, record, person | What the assistant will use; in the Attachments slot |
| `Voice Recorder` | State: recording, processing | Replaces the Prompt Input while dictating |
| `Chat History Item` | State: default, hover, active | One conversation in the history list; Pinned, Time |
| `Response Feedback` | - | Reasons, details and Send after Bad response |
| `Agent Plan`, `Plan Step` | Step: pending, running, done, error | Multi-step task with progress, Stop and steps |
| `Artifact Card` | Type: document, chart, table. State: default, hover | Something the assistant made, with Open |
| `AI Summary` | State: ready, generating, error | Summary on a record or report page, with sources and feedback |
| `AI Suggestion` | State: suggested, accepted | AI-proposed value for a form field, Accept / Dismiss |
| `AI Notice` | Type: label, disclaimer | "AI generated" label; one-line disclaimer |

## Rules
- Put Reasoning, Tool Calls, paragraphs, lists, Code Blocks, tables and Sources in the
  `Assistant Message` Content slot, in the order they happened.
- User messages in a bubble, assistant answers without one: long answers need the full width.
- The conversation column is 768 (`layout/container/3xl`); in the panel everything is FILL.
- Message actions appear on hover on desktop and always on touch. Each icon button has a
  tooltip: Copy, Regenerate, Good response, Bad response, Edit.
- Prompt Input: hide Tools and voice where they do not apply (panel, inline).
- Icons: `sparkles` marks AI (use it for AI entry points, not decoration), `square` is Stop,
  `arrow-up` is Send.

## Figma
- Blocks: `Block / AI Chat Empty`, `Block / AI Conversation`, `Block / AI Assistant Panel`,
  `Block / Inline AI` on the AI page; example "AI chat app" (Sidebar history + conversation).
- Examples on the AI Chat page: "agent at work" (plan, artifact, context chips, model picker),
  "AI on a record page" (summary, suggestions, notice), "chat history" (groups, pinned, active).
  `Stress test / AI components` in the Stress tests section.
- Text in the Content slot uses `body/default` (panel: `body/small`).

## Code
Vercel AI SDK (`useChat`) or assistant-ui for state and streaming; render messages with the
product's markdown renderer and shadcn components. Sanitize model output before rendering
HTML.
