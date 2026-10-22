# Stepper

Usage guidelines only. Visual specs live in the Figma components (Stepper page).

## Use
- Multi-step forms and wizards with 3-6 steps where order matters (booking, onboarding, checkout).
- Not for 2 steps (use one page or a Dialog) and not for navigation between independent sections
  (use Tabs).

## Rules
- Step titles are nouns for what is filled in ("Account", "Plan", "Confirm").
- Completed steps show a check and can be revisited; upcoming steps are not clickable.
- Validate each step before moving on; an invalid step that was left shows `error`.
- Keep entered data when going back. The last step is a review with edit links per section.
- Primary button says what happens next ("Continue to plan"), the last one the outcome
  ("Start subscription").
- Mobile: "Step 2 of 3 · Plan" + a progress bar instead of the full stepper.

## Figma
`Step` Orientation (horizontal, vertical) × State (completed, current, upcoming, error) with
Title, Description, Number, Show connector. `Stepper` has a `Steps` slot: steps with a connector
FILL, the last one HUG with Show connector off.
- Steps on a marketing or onboarding page that people only read use `Feature Item`
  Marker=number; delivery progress of an order uses `Shipment Tracker`. Stepper stays for steps
  people do in the product.
