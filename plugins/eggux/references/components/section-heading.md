# Section Heading

Generated from the EGG UI master library on 2026-10-27 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Section Heading](#section-heading) | 3 | Actions |

On the Figma page: "Example / sections on a page", "Stress test / Section Heading"

## Section Heading

Component set · 3 variants · default size 720 × 56

Title and description that open a section of an app or content page, or a group inside a card or a long form, with an optional overline and one row of actions on the right (View all, Add, a search Input). lg (h2) for a content page section, default (h3) for a section of an app page, sm (h4) for a group inside a card or panel. Show icon puts an icon (Icon swap) before the title: 24 px in lg, 20 px in default and sm; use it on all sections of a page or none. Centered marketing sections use the Section Header block; card titles use Card Header; the page title uses a Page Header block.

**Use for**

- A section of an app page: Reports, Integrations, Audit log
- A content page section with a View all link
- A group inside a card or a long form (Size=sm)
- A search Input or a filter next to the title of a list

**Not for**

- Centered marketing sections: use the Section Header block
- The title of a Card: use Card Header
- The page title: use Page Header

**Anatomy**

1. Overline (Show overline): ui/overline, muted
2. Icon (Show icon, Icon swap): 24 px (lg), 20 px (default, sm), foreground/default, centered on the title line
3. Title: heading/h2 (lg), heading/h3 (default), heading/h4 (sm)
4. Description (Show description): body/lead (lg), body/small
5. Actions slot (Show actions): Buttons, a search Input, a Toggle Group

**Content and behavior**

- One title per section, in sentence case, a noun or a short phrase
- Description says what the section holds in one sentence
- At most two buttons in Actions; one primary
- Show icon on all sections of a page or none; one icon per content type (reports, events, news)
- Same Size for sections on the same level of a page
- Resize: the text column fills (at least 192); the row wraps, so in narrow columns the Actions slot drops under the text; title 2 lines, description 3 lines with an ellipsis

**Accessibility**

- The title is a real heading (h2, h3, h4) that follows the page outline
- Actions come after the heading in tab order
- A search Input in Actions has a label
- The icon is decorative (aria-hidden); the title says what the section is

| Variant property | Values |
|---|---|
| Size | lg, default, sm |

| Property | Type | Default |
|---|---|---|
| Title | text | Section title |
| Description | text | One sentence that says what this section holds and why it matters. |
| Overline | text | Overline |
| Show overline | boolean | false |
| Show description | boolean | true |
| Show actions | boolean | true |
| Show icon | boolean | false |
| Icon | instance swap | Icon/file-text |

Slots (fill them in the instance, never detach): `Actions`

Built from: `Button`. Icons: file-text

Tokens and styles:
- Colors: `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/3`, `spacing/4`
- Text styles: `body/lead`, `body/small`, `heading/h2`, `heading/h3`, `heading/h4`, `ui/overline`

Guides: [content](../../skills/build-ui/components/content.md)

Code: custom (`flex flex-wrap gap-3`; text column `min-w-48 flex-1`; title `line-clamp-2`, description `line-clamp-3`)
