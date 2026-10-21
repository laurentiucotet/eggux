# Audit

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Change Item](#change-item) | 1 | - |
| [Version Item](#version-item) | 3 | - |
| [Release Note Item](#release-note-item) | 3 | - |

On the Figma page: "Example / in audit log", "Stress test / Change Item", "Stress test / Release Note Item", "Stress test / Version Item"

## Change Item

Component · 1 variant · default size 560 × 24

One field changed in an audit entry: field, old value, new value. Empty old value shows "(empty)". Sensitive values are masked (••••).

**Use for**

- Expanded rows of an audit log
- History tab on a record page
- Conflict and history views when edits clash

**Not for**

- The event itself (who, what, when): use the audit log row
- Approval decisions: use Approval Step

**Anatomy**

1. Field
2. Old value
3. Arrow-right
4. New value

**Content and behavior**

- An empty old value shows "(empty)"
- Sensitive values are masked (••••)
- Read only: never edit or delete entries from the UI
- Dates and amounts follow the locale format

**Accessibility**

- The arrow is decorative; read as "Due date changed from 7 Oct 2026 to 21 Oct 2026"
- Old and new values differ by position and text, not color alone
- Masked values are announced as hidden, not read as dots

| Property | Type | Default |
|---|---|---|
| Field | text | Due date |
| Old | text | 7 Oct 2026 |
| New | text | 21 Oct 2026 |

Icons: arrow-right

Tokens and styles:
- Colors: `background/accent`, `background/muted`, `foreground/accent`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/1_5`, `spacing/3`
- Radius: `radius/sm`
- Text styles: `body/small`, `ui/caption`

Guides: [audit-log](../../skills/build-ui/patterns/audit-log.md), [errors-and-recovery](../../skills/build-ui/patterns/errors-and-recovery.md)

Code: custom

## Version Item

Component set · 3 variants · default size 480 × 84

One saved version in a version history panel: who, when, what changed, and Restore. The current version is marked and has no Restore. Selecting a version previews it (State=selected) with a Diff Viewer; restoring creates a new version, it never deletes the newer ones.

**Use for**

- Version history of a document, template or contract
- History of a configuration (workflow, price list)
- A Side Panel next to the editor with the versions newest first

**Not for**

- Field-level changes of a record: use Change Item
- Events by many people on a record: use Timeline Item
- Product release notes: use Release Note Item

**Anatomy**

1. Avatar
2. Version and Current Badge (State=current)
3. Meta: name · date and time
4. Summary: what changed
5. Restore Button (State=past and selected)

**Content and behavior**

- Newest first; the current version is marked and has no Restore
- Selecting a version previews it (State=selected) with a Diff Viewer
- Restoring creates a new version; it never deletes the newer ones
- Summary says what changed in one line; autosaved versions say "Autosave"
- Group autosaves by session or day when there are many

**Accessibility**

- The list is a listbox or a list of buttons; the selected one has aria-selected or aria-current
- Restore is a labelled button ("Restore version from 12 Oct, 15:40")
- Dates in a <time> element

| Variant property | Values |
|---|---|
| State | current, past, selected |

| Property | Type | Default |
|---|---|---|
| Meta | text | Elena Popa · 12 Oct 2026, 15:40 |
| Summary | text | Changed payment terms to 14 days |

Built from: `Avatar`, `Badge`, `Button`

Tokens and styles:
- Colors: `background/accent`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/2`, `spacing/3`
- Radius: `radius/md`
- Text styles: `body/small`, `ui/caption`, `ui/label`

Guides: [audit-log](../../skills/build-ui/patterns/audit-log.md)

Code: custom list with shadcn `Avatar`, `Badge`, `Button`; preview in `Diff Viewer` (Restore creates a new version)

## Release Note Item

Component set · 3 variants · default size 640 × 205

One entry of a changelog or "What's new": type badge (New, Improved, Fixed), version and date, a title that says the benefit, two sentences on how to use it, optional screenshot and link. Newest first. In-app "What's new" shows the last 3-5 with a link to the full changelog.

**Use for**

- Public changelog pages
- In-app What's new: the last 3-5 entries with a link to the full changelog
- Release notes in a help center

**Not for**

- Version history of a document: use Version Item
- A system notice people must act on: use Alert
- A one-off product tip: use Coachmark

**Anatomy**

1. Type: Badge (New info, Improved secondary, Fixed success)
2. Date: version · date
3. Title: the benefit
4. Text: two sentences on how to use it
5. Image (Show image): Image Placeholder
6. Link (Show link): Button link

**Content and behavior**

- Newest first; one entry per change
- Title says the benefit for the user, not the feature name
- Text: two sentences: what changed and where to find it (Settings → Reminders)
- Type from the variant: new, improved, fixed
- Screenshot only when it shows where to click; link to the help article

**Accessibility**

- Each entry is an <article> with the title as a heading
- The type is text in the Badge, never color alone
- Dates in a <time> element; the screenshot has alt text that says what it shows

| Variant property | Values |
|---|---|
| Type | new, improved, fixed |

| Property | Type | Default |
|---|---|---|
| Title | text | Payment reminders in the client's language |
| Text | text | Reminders now go out in German, French or Romanian, based on the language set on the customer. Edit the templates in Settings → Reminders. |
| Date | text | v2.14 · 12 Oct 2026 |
| Show image | boolean | false |
| Show link | boolean | true |

Built from: `Badge`, `Button`, `Image Placeholder`

Tokens and styles:
- Colors: `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/2`, `spacing/3`, `spacing/6`
- Text styles: `body/large`, `body/small`, `ui/caption`

Guides: [content-and-docs](../../skills/build-ui/patterns/content-and-docs.md)

Code: `<article>` with shadcn `Badge`, `<time>`, optional `<img>`, `Button variant="link"` (New info, Improved secondary, Fixed success)
