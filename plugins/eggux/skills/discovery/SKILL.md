---
name: discovery
description: Turn client interview notes, briefs, call transcripts or existing-product screenshots into structured objects (OOUX), actors and workflows for a client project. Use when starting a new client, after a discovery call, or when the user shares notes about how the client works.
---

# Discovery

Method: Object-Oriented UX first, workflows second. Workflows describe actions on objects, so
without clear objects they come out vague.

Read `${CLAUDE_PLUGIN_ROOT}/references/project-files.md`. Output goes to `eggux/objects.md`,
`eggux/actors.md` and `eggux/workflows.md` (run `/eggux:init` first if `eggux/` is missing).

## Steps

1. **Read the source material fully.** Notes, transcripts, briefs, screenshots of the current
   product. Mark what is stated by the client and what is your inference.
2. **Objects (ORCA)**, see `references/ooux.md`:
   - Objects: nouns the users talk about repeatedly (Customer, Order, Invoice).
   - Relationships: how objects connect (a Customer has many Orders).
   - CTAs: what can be done to each object, and by whom.
   - Attributes: what users need to see, marking the ones that belong on the card.
3. **Actors:** each role with goals, permissions (which CTAs) and constraints.
4. **Workflows:** sequences an actor follows to reach a goal. Every step names the object, the
   CTA and the pattern it uses (`${CLAUDE_PLUGIN_ROOT}/skills/build-ui/patterns/`). Include
   failure paths.
5. **Open questions:** list everything the material does not answer, at the end of each file
   under `## Open questions`. Do not invent answers. These become the agenda for the next call.
6. **Write the files.** Merge into existing content: keep what is there, add, and mark changes.
   Record any naming decision (what the client calls things) in `eggux/decisions.md` under
   Terminology.

## Quality checks before finishing
- Every CTA in a workflow exists on an object in objects.md.
- Every workflow actor exists in actors.md and has permission for its CTAs.
- No object is a screen ("Dashboard" is a view, not an object).
- Inferences are marked as such, never presented as client statements.

End with a short summary: objects found, workflows mapped, number of open questions.
