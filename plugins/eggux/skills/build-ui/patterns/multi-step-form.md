# Multi-step form (wizard)

## When
More than ~8 fields that split into clear groups with an order (booking, onboarding, checkout),
or later steps depend on earlier answers. Otherwise one page with sections is faster.

## Structure
`Block / Multi-step Form`: Stepper on top, one Card per step, Back (outline) + Continue (primary)
in the card footer. 768 wide.

## Rules
- 3-6 steps; the last one is a review with "Edit" links per section.
- Validate a step on Continue; errors follow `form-validation.md`. Do not block going back.
- Keep data across steps and after reload (draft); leaving mid-way follows `unsaved-changes.md`.
- Continue names the next step ("Continue to confirm"); the last button names the outcome
  ("Place order").
- Mobile: "Step 2 of 3 · Shipping" + progress bar instead of the full Stepper.

## Shell
Long or blocking flows (onboarding, setup, checkout, import) use `Page Shell / Wizard`: no sidebar,
step counter, "Save and exit", progress bar, sticky Back / Continue, content 672 wide. Short flows
inside the app keep the App shell and use `Block / Multi-step Form` with a Stepper.
