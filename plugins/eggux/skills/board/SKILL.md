---
name: board
description: Open the EGG UX board, a local web interface for the client project's context, documents, research (Understand), questions (Decide), feature flows and handoffs, decision log, task list and notes, all in eggux/ markdown files. Also the rules for writing tasks and notes in those files from the chat. Use when the user wants to see or manage decisions, tasks or notes in a browser ("deschide board-ul", "/eggux:board", "arată-mi taskurile"), adds a task or a note in the chat, or asks what is open in the pipeline.
---

# Board

A local web app in `${CLAUDE_PLUGIN_ROOT}/app`. It has no dependencies, needs no build and no
database. It reads and writes the markdown files in the project's `eggux/` folder, and those
files stay the source of truth: Claude, git, the skills and the board all edit the same text, and
the board updates live when a file changes on disk.

| View | File | What it shows |
|---|---|---|
| Context | `eggux/actors.md`, `objects.md`, `workflows.md`, `brand.md` (read-only), `eggux/context/<slug>.md` | Sections with entries; add, edit, delete entries; edit a section's field template; new sections from presets or empty; "Ask Claude" for a suggested entry to keep or delete. Terminology (from `decisions.md`) and Notes are listed here too |
| Documents | `eggux/docs/` | Upload files; Claude reads each one and adds suggested entries to the Context sections; `.board.json` records where each went |
| Understand | `eggux/research/<slug>.md` | Research requests run by Claude: full report and findings; accept or reject each finding; an accepted finding becomes a question in Decide |
| Decide | `eggux/questions.md` | Questions (from findings, unknowns, blindspots) with options proposed by Claude or added by you; choosing one records a decision in `decisions.md` and a task in `tasks.md` |
| Flows | `eggux/features/<slug>/` | Each feature with its spec status, scenario and edge case counts, open questions and the task that delivers it; read-only tabs Handoff (the developer deliverable), Spec, Scenarios and Decisions (one collapsible row per item), Flows; Mermaid diagrams drawn, full screen with zoom. New flow: empty from the templates, or drafted by Claude from an idea (flows, scenarios, edge cases, open questions); `group:` and `figma:` in `feature.md` group the list and add an Open in Figma button |
| Working board | `eggux/tasks.md` | To do / Doing / Done with drag and drop (Review tasks show in Doing); a task opens a side panel with what it delivers, the decision it applies, its Result (what changed and where, with links into the board) and the git commits that mention it, with their files |
| Decision log | `eggux/decisions.md` and `eggux/features/<slug>/decisions.md` | Collapsible Inbox (add, record as decision, dismiss), searchable list, detail with status change and linked tasks; the new decision dialog asks for what was decided, details and status, the rest under More details |
| Notes (under Context) | `eggux/notes/*.md` | List and search, editor with preview and autosave, a selected line to the Inbox or to a task |

**Claude from the board.** Ask Claude, research, options and document reading run the local
`claude` command (Claude Code) in the project folder, with read-only tools; the board writes the
files from its answer. It uses the person's own Claude Code sign-in, so no API key. When it is
signed out, the board says so: run `claude` in a terminal and sign in. Jobs run in the
background; the page updates when the file changes.

**File formats** (so Claude and people can edit them by hand):
- Context entry: `## Title`, then one `- **Field:** value` line per field; list fields as indented
  `  - item` lines. The template is the frontmatter line `template: "Name; Goals (list 3); Notes (long)"`;
  the first field is the heading. `<!-- suggested by Claude, to review -->` under a heading marks
  a suggestion.
- Research: frontmatter `title`, `status` (running, done, error), `kind`; `## Report`; `## Findings`
  with `### F-01 · Title`, `- Source:`, `- Vote: open | accepted | rejected`, `- Question: Q-xxx`.
- Questions: `## Q-001 · Title` with `- Type:`, `- Source:`, `- Category:`, `- Status: open | decided A (D-xxx)`,
  `- Recommended:`; options `### A · Title` with `- Pro:`, `- Con:`, `- By: claude | you`.

## Open it
1. Check that `eggux/` exists at the project root. If not, offer `/eggux:init` first (the board
   still opens and says so).
2. Start the server in the background (Bash with `run_in_background`):
   `node "${CLAUDE_PLUGIN_ROOT}/app/server.js" --root "<project root>"`
   It listens on `127.0.0.1:4317` (or the next free port) and prints the URL. Read the port
   from its output.
3. Give the user the URL. In a cloud or remote session, report the port with the preview tool
   if one is available. Do not start a second server when one already runs for this project.
4. Stop it when the user asks (kill the process); nothing is lost, the files hold everything.

## Write tasks and notes from the chat
When the user asks for a task or a note in the chat, write the file directly in the same format
the board writes; the open board picks it up within a second.

Task entry in `eggux/tasks.md` under `## Tasks`, newest first, next free `T-xxx` id (create the
file from `skills/init/templates/tasks.md` if missing):
```
### T-012 · Design the approvals inbox
- Status: todo
- Stage: design
- Deliverable: Figma page with F-01 to F-03, all states, mobile
- Links: FD-02, feature:approvals
- Due: 2026-11-20
- Created: 2026-11-05
```
- Status: `todo | doing | review | done`. Stage: one of the nine stages in
  `references/pipeline.md`. Links: decision ids, `feature:<slug>`, `component:<Name>`,
  `note:<file>` or a URL, comma separated. Every field fits on one line.
- When a skill finishes the work a task names (a review done, a component approved, a decision
  applied), set the task to `review` or `done`, add one line `- Result:` saying what changed and
  where (file paths such as `features/<slug>/handoff.md`, Figma frame names or links, component
  names), and say so. Put the task id (and the decision id it applies) in the commit message
  ("T-003 · Apply D-006: 48 px buttons"): the board's task panel lists those commits with the
  files they changed.

Note in `eggux/notes/<YYYY-MM-DD>-<slug>.md`:
```
---
title: "Kickoff meeting with Acme"
date: "2026-11-05"
tags: [meeting, client]
---

Markdown body.
```
Decisions found in a note go to the Inbox of `decisions.md` (one line each, with date, time and
who), never straight into Decisions; `/eggux:decision-log` records them.

## Safety
The server binds to 127.0.0.1, answers only requests addressed to 127.0.0.1 or localhost (no DNS
rebinding), refuses writes from other origins, and only touches files inside `eggux/`. Writes are
atomic (temp file and rename). Edits carry the version of the file the page showed; if Claude, a
skill or an editor changed the file meanwhile, the board refuses the write and reloads, so an edit
never lands on the wrong entry. A note edited on disk while open is not overwritten either. Lines
the board does not recognise in `questions.md` and research files are kept. "Draft with Claude"
never overwrites flow files edited while it ran; the draft goes to `claude-draft.json`. Deleted
notes, documents, research and sections move to `eggux/.trash/` (add it to `.gitignore` or empty
it now and then). Documents are passed to Claude as untrusted input, with only the Read tool;
its suggestions stay marked until someone keeps them. Mermaid is bundled, so diagrams work
offline. Tests: `node --test plugins/eggux/app/test/store.test.js plugins/eggux/app/test/workspace.test.js`.
