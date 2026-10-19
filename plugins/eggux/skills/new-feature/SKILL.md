---
name: new-feature
description: Turn a short feature idea into a complete feature spec by interviewing the user - goal, actors and permissions, entry point, flow, data, states, edge cases, feedback, acceptance criteria - using the client's eggux/ files and the plugin's common flows as defaults. Use when the user says "/new-feature …", "we want to add …", "new feature", "let's spec …", or describes something to build that has no workflow yet.
---

# New feature

A feature is a workflow plus everything around it that makes it shippable. This skill asks
only what cannot be inferred, proposes defaults from the patterns, and writes
`eggux/features/<slug>.md`. It does not design screens; `/eggux:build-ui` does that from the spec.

## 0. Read first
1. `eggux/decisions.md` (process the Inbox first, `decision-log`), `objects.md`, `actors.md`,
   `workflows.md`. Missing files: say which skill creates them and continue with what exists.
2. `${CLAUDE_PLUGIN_ROOT}/skills/build-ui/patterns/common-flows.md` and the patterns the idea
   touches (`action-feedback`, `permissions-and-access`, `errors-and-recovery`, …).
3. Existing specs in `eggux/features/`: a similar feature may already exist; say so.

## 1. Play it back
In three lines: what you understood, which objects and actors it touches, which common flow it
looks like ("Based on: Request and approve"). Ask the user to correct it before going on.

## 2. Interview
Rounds of at most 4 questions. Use the AskUserQuestion tool when it is available, with options
taken from the client files (actors, objects, statuses) and a recommended default first. Skip
anything already answered by the idea, the client files or a decision. Stop when every section
of the spec is filled or explicitly marked out of scope.

| Round | Ask about | Defaults to propose |
|---|---|---|
| 1. Purpose | Goal for the actor and for the business; how we know it works (metric); who uses it and how often | The actor whose workflow it extends |
| 2. Access | Which actors can see, create, edit, approve, delete; what others see | Hide what a role can never do; disable with a reason otherwise |
| 3. Flow | Entry point (where it starts), steps, where the user lands, what triggers it (user, schedule, event) | The matching common flow, asking only for the differences |
| 4. Data | Objects and attributes shown and entered, required fields, validation rules, new objects or relationships | Attributes from objects.md; Field Presets for email, phone, card, address |
| 5. States | Empty, loading, error, no access, offline, very large data, first use | From empty-state, loading-states, errors-and-recovery |
| 6. Edge cases | Duplicates, limits and quotas, concurrent edits, partial failure in bulk, undo or restore, deletion consequences on related objects, time zones and currency, mobile | Defaults from the patterns; ask which apply |
| 7. Feedback and notifications | What the user sees after each action; who gets notified, on which channel; what is logged | `action-feedback.md`, `notifications.md`, audit log for approvals, permissions, exports, deletions |
| 8. Scope | What is out of this version; dependencies (integrations, other teams); deadline | Ship the smallest version that reaches the goal |

Rules for asking:
- One topic per question, concrete options, plain words; no question you can answer from the
  files.
- When the user says "you decide", choose the pattern default and mark it as such in the spec.
- Never invent client facts (numbers, names, policies): mark them as open questions.

## 3. Write
1. `eggux/features/<slug>.md` from `templates/feature.md` (next to this file): every section
   filled, defaults marked "(default)", inferences marked "(inferred)", open questions at the end.
2. Acceptance criteria as Given / When / Then, one per behavior that a tester can check,
   including failure paths and permissions.
3. Update `objects.md`, `actors.md`, `workflows.md` when the feature adds objects, CTAs, roles or a
   workflow (merge, mark changes). New names and rules go to `decisions.md` through
   `decision-log`.

## 4. Hand off
End with: the spec path, open questions (if any block building), and the next step:
`/eggux:build-ui` for the screens listed in the spec. Build-ui and review read the spec;
review checks the acceptance criteria.
