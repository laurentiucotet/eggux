# Pattern: AI chat and AI features

**Problem:** AI features feel unpredictable: users do not know what the assistant can do, cannot
tell when it is working or wrong, and fear it will act without asking.
**Heuristic:** visibility of system status, user control and freedom, error prevention, help
users recognize and recover from errors.

## Choose the surface
| Need | Surface | Figma |
|---|---|---|
| Open-ended questions, long tasks, the assistant is the product | Full chat page (App shell, history in the Sidebar) | `Block / AI Chat Empty`, `Block / AI Conversation`, example "AI chat app" |
| Help with what is on screen (an invoice, a project, a ticket) | Docked panel on the right, 400 wide | `Block / AI Assistant Panel` |
| Edit or write text in place | Inline popover on the selection or field | `Block / Inline AI` |
| One known task (summarize, classify, suggest a reply) | A button or a Prompt Suggestion next to the content, result shown inline | `Prompt Suggestion`, `Button` with sparkles |

Prefer the smallest surface that does the job. A chat box is not a substitute for a button that
does one thing well.

## Before the first message
- Say what the assistant can do, with 3-4 starter prompts taken from real user tasks
  (`Prompt Suggestion` chips or cards). Never a blank box with "Ask me anything" alone.
- Say what data it uses ("Answers use your workspace's invoices and customers") and keep a
  short disclaimer under the input ("… can make mistakes. Check important information.").
- In a panel, show the context it will use (badge "Invoice INV-1024"); the user can remove it.

## While it works
- Show the state within 100 ms: user message appears at once, then `Reasoning` ("Thinking…")
  or a `Tool Call` (running), then the answer streams.
- Send becomes Stop while streaming. Stop keeps what was generated so far.
- Long steps show what is happening ("Searching invoices"), not only a spinner.
- Do not auto-scroll if the user scrolled up to read; show a "Jump to latest" button.
- Users can type the next message while the answer streams; it sends after.

## The answer
- Lead with the answer, then the detail. Short paragraphs, lists, tables and Code Blocks;
  text styles of the product (`body/default`).
- Facts from data or documents get a `Citation` and appear in `Sources`. No source, no
  certainty: say "I could not find…" instead of guessing.
- Numbers, names and dates the user will act on link to the record.
- Reasoning stays collapsed ("Thought for 12 s"); it explains, it is not the answer.
- After the answer: copy, regenerate, good / bad feedback (`Assistant Message` actions) and
  2-3 follow-up `Prompt Suggestion` chips when the next step is predictable.
- Bad feedback opens `Response Feedback` under the answer: reasons as chips, optional details,
  what is shared, Send. Good feedback sends at once.

## Actions the assistant takes
- Reading is free; writing asks. Anything that changes data, sends messages, spends money or
  is hard to undo shows a `Tool Call` with Status=approval: what, to whom, with a preview,
  Approve / Deny. Never act silently.
- After an approved action, confirm with what changed and a link ("Email sent to
  billing@acme.com. View in Activity"), and offer Undo when possible.
- Permissions are the user's: the assistant cannot do what the user cannot.

## Agents (multi-step work)
- A task with more than 2 steps shows an `Agent Plan`: title, step N of M and time left, Stop,
  progress, `Plan Step`s (pending, running, done, error) and what needs approval.
- Steps say what they do in the user's words ("Check payment history"), not tool names.
- A failed step says what failed and what happens next (retry, skip, ask). The plan never stops
  silently.
- Long tasks run in the background: say so, notify when done (`notifications.md`), keep the
  plan in the conversation collapsed to its result.
- What the agent makes (report, chart, table, draft) appears as an `Artifact Card`; Open shows
  it in a side canvas or its page. Each run makes a new version.

## Context
- Show what the assistant will use as `Context Chip`s in the input: the current record or page
  (added by default, removable), files, people. Add with @ or the paperclip.
- The answer names what it used (Sources); never use data the user cannot open.

## AI in the product (outside chat)
- `AI Summary` on record and report pages: 2-4 sentences with numbers and dates, sources,
  regenerate, feedback, disclaimer. Generating shows what it reads; error offers Try again.
- `AI Suggestion` for form fields: the proposed value in a dashed box with the reason, Accept
  and Dismiss. Nothing is saved until accepted; accepted values keep an "AI generated" label
  until edited, with Undo. Low confidence says so in the reason.
- `AI Notice`: the "AI generated" label on content written by AI, and one disclaimer line under
  answers and summaries, same words everywhere.
- Use `sparkles` for AI entry points and AI-made content only.

## Errors and limits
- A failed answer keeps the partial text, says what happened and offers Retry
  (`Assistant Message` State=error). The user's message is never lost.
- Out of scope or not allowed: say so and point to where it can be done.
- Limits (messages, file size, context) are shown before they are hit, not after.
- Attachments that fail stay in the input with the reason (`Attachment` State=error).

## Input
- `Prompt Input`: Enter sends, Shift+Enter new line; grows to ~8 lines then scrolls; send
  disabled while empty; attachments above the text; tools and model picker only when users
  need to choose.
- Model choice (`Model Picker` in the Tools slot, `Model Option` rows) only when users really
  choose between cost, speed or data rules; describe models by what they are good for.
- Voice: `Voice Recorder` replaces the input while dictating; the transcript lands in the input
  for review, never sent unread.
- Edit a sent message (`User Message` actions): the conversation continues from there.
- Keep drafts per conversation.

## History
- Conversations in the Sidebar grouped by date (Today, Previous 7 days, older by month), with
  a title generated from the first message and editable. New chat at the top. Search when
  there are more than ~20.
- Rename, pin, share and delete (with undo) from a menu on each item (`Chat History Item`);
  pinned conversations on top.

## Inline AI
- Select text, then "Ask AI" or a list of actions (improve, shorter, fix spelling, tone,
  translate). The result shows next to the original: Replace, Insert below, Try again, Discard.
  Nothing changes until the user accepts; ⌘Z undoes a replace.

## Accessibility
- Streaming text is announced politely (`aria-live="polite"`), once per finished paragraph,
  not per token.
- Stop, Regenerate and feedback buttons have labels and tooltips. Focus returns to the input
  after sending.
- Respect reduced motion: no typing animation, show text in chunks.

## Figma
Components on the AI Chat page, blocks on the AI blocks page. See `components/ai-chat.md`.
- Outside chat, start AI actions with a `Button` with Show leading icon on and the `sparkles` icon
  (a verb, never just "AI"; example "AI action" on the Button page), show `AI Loading` while it
  writes, mark extracted values with `Confidence Indicator` (3 levels, low never auto-applies)
  and review many edits with `AI Review Bar`.
