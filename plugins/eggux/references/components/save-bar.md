# Save Bar

Generated from the EGG UI master library on 2026-10-22 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Save Bar](#save-bar) | 3 | - |

On the Figma page: "Example / in roles & permissions", "Stress test / Save Bar"

## Save Bar

Component set · 3 variants · default size 720 × 54

Sticky bar at the bottom of a long form or settings page while there are unsaved changes. Discard asks first when changes are large; Save validates and scrolls to the first error. Leaving the page triggers patterns/unsaved-changes.

**Use for**

- Long forms and record pages with explicit save
- Settings and permission pages where changes are reviewed together
- Forms whose changes affect others or can be invalid midway

**Not for**

- Autosave: show "Saving…" / "Saved" status near the title instead
- Short forms and dialogs: Save and Cancel buttons in the footer
- Never mix autosave and a Save Bar in the same form

**Anatomy**

1. Message: count of changes ("3 unsaved changes")
2. Error icon and message (State=error)
3. Discard button
4. Save button, with a Spinner in State=saving

**Content and behavior**

- Shown only while the form is dirty: values differ from the saved ones
- Save validates and scrolls to the first error; State=error says what failed
- Discard asks first when the changes are large
- Leaving the page with changes asks "Discard changes?" (Keep editing, Discard)
- After saving, the bar hides, the form is clean and a toast confirms

**Accessibility**

- Its appearance is announced politely ("3 unsaved changes")
- Save and Discard come after the form fields in the tab order
- State=saving disables Save; on error, focus moves to the first invalid field

| Variant property | Values |
|---|---|
| State | default, saving, error |

Built from: `Button`, `Spinner`. Icons: circle-alert

Tokens and styles:
- Colors: `background/destructive`, `background/popover`, `border/default`, `foreground/popover`
- Spacing and size: `spacing/2`, `spacing/2_5`, `spacing/4`
- Radius: `radius/md`
- Text styles: `ui/label`

Guides: [common-flows](../../skills/build-ui/patterns/common-flows.md), [record-page](../../skills/build-ui/patterns/record-page.md), [unsaved-changes](../../skills/build-ui/patterns/unsaved-changes.md)

Code: custom sticky footer (Listen to form dirty state)
