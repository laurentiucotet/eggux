---
feature: "{{name}}"
status: draft            # draft → ready for dev → built → verified
version: 1
figma: "{{figma_page_url}}"
storybook: "{{storybook_url}}"
updated: "{{date}}"
---

# Handoff: {{name}}

What a developer needs to build this feature, in one file. It is compiled from `feature.md`,
`scenarios.md`, `workflows.md` and `decisions.md` in this folder; those stay the source. Change
them with `/eggux:update-feature`, which also refreshes this file. Send this file (or its link)
to the team; it is ready when `status` is `ready for dev` and no open question blocks the build.

## What to build
Three lines at most: what the user can do after this ships, for whom, and the entry point.

## Done when
One line per scenario and edge case, so the list doubles as the QA checklist. Full Given / When /
Then is in `scenarios.md`.
- [ ] S-01 · {{title}}: when …, then …
- [ ] E-01 · {{title}}: when …, then …

## Routes and state
How each screen is reached and what survives a refresh. Keep personal data (emails, names) and
secrets (tokens) out of query strings.
| Screen | Route | Gets data from | On refresh |
|---|---|---|---|

## Screens and states
One row per screen, named the same here, in Routes and state, in the Copy rows ("<Screen> · title")
and in the scenarios' Screens lines: the board's Screens tab joins them into one view per screen.
Components by their EGG UI name, comma separated, so the Components view can show where each
one is used.
| Screen | States to build | Figma frame | Components |
|---|---|---|---|

## Components
Props checked against the component source, not guessed from the name.
| Component | Props | Storybook |
|---|---|---|
| Button | `size="touch"` on mobile, `loading` while sending | Components/Button/Button |

Composed here (no ready component): what it is built from, logged as a library gap. New or
changed components: list them with the task that builds them, or "none".

## Rules
Validation, limits, permissions and timing rules, one per line, each with its source (FD-xx,
D-xxx or "pattern default"). Say when errors show (on submit, on blur, while typing).
- 

## Security
Only when the feature touches accounts, payments, personal data or permissions: what must not
leak (account existence, tokens, emails in logs or URLs), headers, limits per user and per IP.

## Copy
Every visible string the developer would otherwise invent: titles, labels, buttons, helper text,
errors, empty states, emails. Final wording only; drafts are marked "(draft)".
| Where | Text |
|---|---|

## Feedback, notifications and logging
| Action | User sees | Sent | Logged |
|---|---|---|---|

## Analytics
| Event | When | Properties |
|---|---|---|

## Open questions
Each one is a Q-xxx in `eggux/questions.md`. Anything that blocks the build keeps the status at
`draft`; say what can be built meanwhile and which proposed answer to build with.
| ID | Question | Blocks build | Build meanwhile with |
|---|---|---|---|

## Not in this version

## Changes since the last handoff
Newest first: version, date, what changed for the developer.
- v1 · {{date}} · first handoff.
