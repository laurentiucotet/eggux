---
name: update-feature
description: Apply new input to an existing feature - a decision, new details, a changed rule, review or client comments, meeting notes, answers to open questions - and update every file and Figma section it affects - spec, scenarios, edge cases, workflows, feature and product decisions, objects, actors, the Figma page - then check that everything still agrees and log the change. Use when the user says "/update-feature", "we decided …", "the client wants …", "new detail for <feature>", pastes comments or notes about a feature, or when a feature's decisions.md Inbox has lines.
---

# Update feature

One piece of input, every place it touches. A feature lives in `eggux/features/<slug>/`
(feature.md, scenarios.md, workflows.md, decisions.md) and on its Figma page. An update that
changes one of them and not the others is how specs drift from designs.

## 0. Read first
1. The whole feature folder, `eggux/decisions.md` (product decisions win over feature ones),
   `objects.md`, `actors.md`, `workflows.md`.
2. The feature's Figma page (URL in `feature.md`): sections, frame names, statuses and existing
   annotations, with a read-only `use_figma` call.
3. Old single-file spec (`eggux/features/<slug>.md`): migrate it first. Create the folder from
   `${CLAUDE_PLUGIN_ROOT}/skills/new-feature/templates/feature/`, move the spec into
   `feature.md`, turn its acceptance criteria and edge cases into S-xx and E-xx, its flow into
   F-01, keep the old file's history in the changelog, delete the old file. No Figma page yet:
   offer to create it with `new-feature`'s `feature-page.js`.

## 1. Collect the input
From the chat and from the Inbox of the feature's `decisions.md`, oldest first. Split it into
items, one change each, and keep the date, time and who for each. Classify:

| Type | Example |
|---|---|
| Decision | "Rejections need a reason" |
| New detail | "The limit is €5,000, €10,000 for directors" |
| Changed behavior | "Approvers no longer approve from email" |
| New scenario or edge case | "What if the invoice is edited after approval?" |
| Answer to an open question | "Yes, delegates can approve" |
| Design comment | "The approve button is hard to find" |
| Scope change | "Bulk approve moves to v2" |

## 2. Map the impact
For each item, list everything it touches before changing anything:
- **Feature files:** which sections of `feature.md` (access, data, states, feedback, screens, open
  questions), which S-xx and E-xx, which F-xx steps, earlier FD-xx it replaces.
- **Product files:** `objects.md` (attributes, statuses), `actors.md` (roles, permissions),
  `workflows.md`, `eggux/decisions.md` when the item changes the product beyond this feature
  (a component, a token, a term).
- **Figma:** flow frames, scenario and edge case sections, screen frames that show the change,
  States.
- **Other features:** search `eggux/features/*/` for the same objects, actors and flows.
- **Components:** a change to a component goes through `/eggux:update-component` or
  `/eggux:new-component`, not by editing screens.
- **Code** when the project has it: what must change, as a list for the developer.

Check conflicts: with earlier feature decisions (the newest wins; mark the old one superseded),
with product decisions (they win unless the user decides to change them through
`decision-log`), with `ux-rules.md` and accessibility (flag the risk, apply after the user
confirms).

## 3. Play it back
Show the impact map as a short table: item → what changes where (files, sections, IDs, Figma
frames), conflicts, and new open questions. Ask at most 3 questions, only where the item is
ambiguous (scope, which actors, which version). Apply after the user agrees or says to go on.

## 4. Apply
1. **`decisions.md` (feature):** an FD-xx per decision, detail or rule, in the format of the
   template: type, decision, affects (files, IDs, frames), source with date and time, status
   `applied <date>`. A product-wide item also becomes a `D-xxx` in `eggux/decisions.md` through
   `decision-log`, linked from the FD. Remove the processed Inbox lines.
2. **`feature.md`:** update the affected sections; answered open questions get their answer and
   date; Screens table statuses; "Impact on the product" rows; `updated` date; status back to
   `in design` when designed screens must change.
3. **`scenarios.md`:** edit Given / When / Then; add new S-xx or E-xx with the next free ID;
   removed ones keep their ID with status `removed` and the FD that removed them.
4. **`workflows.md`:** edit steps, branches and the Mermaid diagram.
5. **Product files:** merge into `objects.md`, `actors.md`, `workflows.md`, marked
   "from feature <slug>, FD-xx".
6. **Figma page** (helpers from `new-feature/feature-page.js`, same tokens and text styles):
   - rebuild the changed flow frames and the About card of each changed section;
   - add a section for each new scenario or edge case, with placeholders for its screens, placed
     with the others in ID order;
   - on every designed screen the change affects, add an annotation
     `**Needs update** · FD-xx: <what changes>`; when the user asks, redesign it with
     `/eggux:build-ui` and remove the annotation;
   - frames that no longer apply move to the Archive section, renamed
     `<name> (superseded <date>, FD-xx)`; never delete designed work;
   - removed scenarios: move the whole section's frames to Archive and delete the empty section.

## 5. Check that everything agrees
- Every S-xx and E-xx that is not removed has a Figma section with the same ID and title, and
  every screen it lists exists as a frame or a placeholder.
- Every F-xx step that names a screen has that screen in some scenario.
- No file or frame still describes the old behavior: search the folder and the page for the
  old values, labels and limits.
- Every FD-xx has status applied, its "Affects" matches what changed, and superseded ones say
  by what.
- Statuses agree: a scenario with "Needs update" screens is not `ready for dev`.

## 6. Log and report
Add one changelog entry at the top of `feature.md`: date and time · source · items · files and
sections changed · Figma sections and frames changed · FDs and Ds created.

End with: what changed where (short), screens marked Needs update, conflicts resolved, new open
questions, and the next step (`/eggux:build-ui` for the marked screens, or a review).
