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
| `Suggestion` | Layout: chip, card | Starter prompts (cards or chips) and follow-ups (chips) |

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
- Text in the Content slot uses `body/default` (panel: `body/small`).

## Code
Vercel AI SDK (`useChat`) or assistant-ui for state and streaming; render messages with the
product's markdown renderer and shadcn components. Sanitize model output before rendering
HTML.
