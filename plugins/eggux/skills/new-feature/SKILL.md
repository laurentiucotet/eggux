---
name: new-feature
description: Turn a short feature idea into a complete feature by interviewing the user - goal, actors and permissions, entry point, flows, data, scenarios, edge cases, states, feedback, acceptance criteria - then write the feature folder (spec, scenarios, workflows, decisions, a developer handoff) with a task for it, and create the feature's Figma page with a section per flow, scenario and edge case. Use when the user says "/new-feature …", "we want to add …", "new feature", "let's spec …", or describes something to build that has no workflow yet.
---

# New feature

A feature is a set of flows plus everything around them that makes it shippable. This skill
asks only what cannot be inferred, proposes defaults from the patterns, writes the feature
folder and sets up its Figma page. Screens are designed afterwards with `/eggux:build-ui`, into
the page's sections. Later changes go through `/eggux:update-feature`.

Output:
```
eggux/features/<slug>/
├── feature.md     spec: goal, actors and access, data, states, feedback, screens, impact, changelog
├── scenarios.md   S-xx scenarios and E-xx edge cases, Given / When / Then, Figma sections
├── workflows.md   F-xx user flows: steps table and diagram
├── decisions.md   Inbox for new input + FD-xx feature decisions
└── handoff.md     the deliverable: one file a developer builds from (done-when list, screens,
                   components, rules, copy, open questions)
```
Plus a task in `eggux/tasks.md` whose deliverable is `handoff.md`, so the board shows what the
work produces.
Figma: a page named after the feature, after the `FEATURES` divider page, with the sections
Overview, Flows, one per scenario, one per edge case, States, Archive.

## 0. Read first
1. `eggux/decisions.md` (process the Inbox first, `decision-log`), `objects.md`, `actors.md`,
   `workflows.md`. Missing files: say which skill creates them and continue with what exists.
2. `${CLAUDE_PLUGIN_ROOT}/skills/build-ui/patterns/common-flows.md` and the patterns the idea
   touches (`action-feedback`, `permissions-and-access`, `errors-and-recovery`, …).
3. Existing features in `eggux/features/`: a similar feature may already exist; say so and
   offer `/eggux:update-feature` instead.

## 1. Play it back
In three lines: what you understood, which objects and actors it touches, which common flow it
looks like ("Based on: Request and approve"). Ask the user to correct it before going on.

## 2. Interview
Rounds of at most 4 questions. Use the AskUserQuestion tool when it is available, with options
taken from the client files (actors, objects, statuses) and a recommended default first. Skip
anything already answered by the idea, the client files or a decision. Stop when every section
is filled or explicitly marked out of scope.

| Round | Ask about | Defaults to propose |
|---|---|---|
| 1. Purpose | Goal for the actor and for the business; how we know it works (metric); who uses it and how often | The actor whose workflow it extends |
| 2. Access | Which actors can see, create, edit, approve, delete; what others see | Hide what a role can never do; disable with a reason otherwise |
| 3. Flows | Entry point, steps, decisions and branches, where the user lands, what triggers it (user, schedule, event) | The matching common flow, asking only for the differences |
| 4. Data | Objects and attributes shown and entered, required fields, validation rules, new objects or relationships | Attributes from objects.md; Field Presets for email, phone, card, address |
| 5. Scenarios | The main paths per actor (happy path, reject or cancel path, second actor's path) | One scenario per flow outcome |
| 6. Edge cases | Duplicates, limits and quotas, concurrent edits, partial failure in bulk, undo or restore, deletion consequences, time zones and currency, permissions changing mid-flow, mobile | Defaults from the patterns; ask which apply |
| 7. States, feedback, notifications | Empty, loading, error, no access, offline, large data; what the user sees after each action; who is notified; what is logged | `action-feedback.md`, `notifications.md`, audit log for approvals, permissions, exports, deletions |
| 8. Scope | What is out of this version; dependencies; deadline | Ship the smallest version that reaches the goal |

Rules for asking:
- One topic per question, concrete options, plain words; no question you can answer from the
  files.
- When the user says "you decide", choose the pattern default and mark it "(default)".
- Never invent client facts (numbers, names, policies): mark them as open questions. Every open
  question is a Q-xxx in `eggux/questions.md` (`- Type: unknown`, `- Source: feature:<slug>`,
  `- Category:`, `- Status: open`, `- Blocks:` what waits on it). When you have a sensible
  default, add it as option `### A · <default>` with `- By: you` and `- Recommended: A`. The
  tables in `feature.md` and `handoff.md` list only the IDs, so a question is answered once, in
  the board's Decide view or through decision-log, and every file follows.

## 3. Write the folder
From the templates in `templates/feature/` (next to this file):
1. `feature.md`: every section filled; defaults marked "(default)", inferences "(inferred)";
   open questions as Q-xxx IDs in the table (the questions themselves in `eggux/questions.md`); the Screens table lists each screen with the scenarios that use
   it and its Figma frames.
2. `scenarios.md`: S-01… and E-01…, each with actor, flow steps, Given / When / Then a tester can
   check, screens named `<ID> / <n> <screen>`, Figma section, status draft. Failure paths and
   permission cases are scenarios or edge cases, never left implicit.
3. `workflows.md`: F-01… with trigger, actors, steps table (actor, step, screen, object and CTA,
   next) and a Mermaid diagram; which scenarios run through it.
4. `decisions.md`: empty Inbox; FD-01 "Feature started"; one FD per choice made in the interview
   that someone could later question (rules, limits, defaults the user confirmed).
5. Outside the folder: update `objects.md`, `actors.md`, `workflows.md` when the feature adds
   objects, attributes, CTAs, roles or a workflow (merge, mark "from feature <slug>"); new names
   and product-wide rules go to `eggux/decisions.md` through `decision-log`. List every change
   in the "Impact on the product" table of `feature.md`.
6. `handoff.md`: compile it from the files above, for a developer who has not read them. Done
   when: one line per S-xx and E-xx. Screens and states, Rules, Feedback: from `feature.md`.
   Components: the library components each screen uses, with props checked in the component
   source or Storybook (`storybook-component-docs` when the project has one), never guessed;
   anything composed from parts is a library gap, noted.
   Copy: every title, label, button, error and email the flows show; propose wording from
   `brand.md` (voice) and `references/content.md`, marked "(draft)" until the user confirms.
   Routes and state: route per screen, where its data comes from, what a refresh keeps; no
   emails or tokens in query strings. Security, when accounts, payments or personal data are
   involved. Status `draft` while any open question blocks the build; say what can be built
   meanwhile.
   Then read it as the developer would: give `handoff.md` alone to a subagent playing a
   developer ("could you build from this file only? what would you ask?") and fix what it
   finds, in the source files too, before showing it to the user.
7. Task: add `T-xxx · <feature name>` to `eggux/tasks.md` (format in the `board` skill), Stage
   design, Deliverable `features/<slug>/handoff.md (ready for dev)`, Links `feature:<slug>` and
   the FD/D ids it depends on. When the user starts from an existing task, link that one
   instead of adding a second.

Show the folder summary (counts of flows, scenarios, edge cases, open questions) and ask to go
on with the Figma page.

## 4. Create the Figma page
In the client's Figma file (the URL is in `eggux/brand.md` or the init answers):
1. Read `${CLAUDE_PLUGIN_ROOT}/references/figma-api-notes.md` and the Figma `figma-use` skill.
2. Run `feature-page.js` (next to this file) with `CONFIG` filled from the folder: name, status,
   spec path, summary, actors, frame size (1440 x 900, or 390 x 844 for mobile-first), flows
   with their steps (decisions as `type: 'decision'` with yes / no), scenarios and edge cases
   with Given / When / Then and screen names, states.
3. It creates the page after a `FEATURES` divider (added at the end of the file if missing), in
   A-Z order, with: Overview (status, actors, spec path), Flows (one frame per flow), one section
   per scenario and edge case (a card with the ID, title, status and Given / When / Then, then
   one placeholder frame per screen), States (one placeholder per state), Archive.
4. Screenshot the page and look at it; put the page URL in `feature.md` (`figma:`).

## 5. Hand off
End with: the folder path and the Figma page link, the `handoff.md` status and what keeps it at
`draft` (open questions, draft copy, missing components), and the next step: `/eggux:build-ui` to design the screens scenario by scenario, replacing each
placeholder with a real screen of the same name. New decisions, details or review comments go
into the feature's `decisions.md` Inbox or straight to `/eggux:update-feature`.
Build-ui and review read the folder; review checks every scenario and edge case. When the
screens are designed and no question blocks the build, set `handoff.md` to `ready for dev`, add
the Figma frame links, and move the task to `review`; it is `done` once the developer confirms
they can build from it.
