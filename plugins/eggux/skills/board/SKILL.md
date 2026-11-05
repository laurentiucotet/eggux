---
name: board
description: Open the EGG UX board, a local web interface for the client project's decision log, task list and notes (eggux/decisions.md, eggux/tasks.md, eggux/notes/). Also the rules for writing tasks and notes in those files from the chat. Use when the user wants to see or manage decisions, tasks or notes in a browser ("deschide board-ul", "/eggux:board", "arată-mi taskurile"), adds a task or a note in the chat, or asks what is open in the pipeline.
---

# Board

A local web app in `${CLAUDE_PLUGIN_ROOT}/app`. It has no dependencies, needs no build and no
database. It reads and writes the markdown files in the project's `eggux/` folder, and those
files stay the source of truth: Claude, git, the skills and the board all edit the same text, and
the board updates live when a file changes on disk.

| View | File | What it shows |
|---|---|---|
| Decisions | `eggux/decisions.md` and `eggux/features/<slug>/decisions.md` | Inbox (add, record as decision, dismiss), decisions filtered by status, type and feature, detail with status change and linked tasks, Terminology |
| Tasks | `eggux/tasks.md` | Pipeline stages with open counts (`references/pipeline.md`), board To do / Doing / Review / Done with drag and drop, edit dialog |
| Notes | `eggux/notes/*.md` | List and search, editor with preview and autosave, a selected line to the Inbox or to a task |

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
- When a skill finishes the work a task names (a review done, a component approved), set the
  task to `review` or `done` and say so.

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
The server binds to 127.0.0.1, refuses writes from other origins, and only touches files inside
`eggux/`. Writes are atomic (temp file and rename). A note edited on disk while open in the
board is not overwritten: the editor asks to reload.
