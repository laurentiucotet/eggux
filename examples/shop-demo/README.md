# Shop demo: a sample EGG UX project

An invented client (an online shop for home products) used to show the EGG UX workflow end to end.
Nothing here is real client data.

Start with `eggux/features/forgot-password/handoff.md`: the file a developer receives for one
feature. It was produced with `/eggux:new-feature` from:

- `eggux/brand.md`, `actors.md`, `objects.md`, `workflows.md`: the project context
- `eggux/decisions.md`: product decisions (D-xxx)
- `eggux/tasks.md`: the work item (T-001) whose deliverable is the handoff
- `eggux/features/forgot-password/`: spec, scenarios and edge cases, flows, feature decisions (FD-xx)

The handoff stays `draft` until the client answers two backend questions; the reasons are written
at the top of the file. There is no Figma file for this sample, so the screens are named but not
designed.

To see it in the board, run `/eggux:board` with this folder as the project root.
