# Prose

Generated from the EGG UI master library on 2026-10-29 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Prose](#prose) | 3 | Content |
| [Prose Heading](#prose-heading) | 9 | - |
| [Prose Paragraph](#prose-paragraph) | 3 | - |
| [Prose List Item](#prose-list-item) | 6 | - |
| [Prose Blockquote](#prose-blockquote) | 3 | - |
| [Highlight](#highlight) | 2 | - |

On the Figma page: "Example / Prose", "Stress test / Highlight", "Stress test / Prose"

## Prose

Component set · 3 variants · default size 672 × 1408

Long-form text styled for reading: articles, help articles, legal pages, docs, release notes and long AI answers. The Content slot holds Prose parts in reading order: Prose Heading (h2 to h4), Prose Paragraph, Prose List Item (bullet or number), Prose Blockquote, Code Block, Image Figure and Separator; tables use Table parts. Size sm (14 px body, side panels and AI answers), default (16 px, articles) or lg (18 px, marketing and long reads). Every part in the slot uses the same Size as the Prose. Width fills its column up to the reading measure (max 576, 672, 768; min 280). Links are underlined foreground/brand runs, inline code is a code-style run, search or AI marks use the Highlight recipe on the run.


Usage: eggux build-ui/components/content.md

**Use for**

- Articles and blog posts (Block / Article)
- Legal pages (Block / Legal Page), help articles and docs
- Release notes, long AI answers and email bodies

**Not for**

- Short UI copy, labels and descriptions: use the text styles directly
- Marketing sections with layout: use Section Header and Feature blocks
- Editable rich text: use Rich Text Editor (its Content slot can hold Prose parts)

**Anatomy**

1. Size: sm (14 px body), default (16 px), lg (18 px)
2. Content slot: Prose Heading (h2 to h4), Prose Paragraph, Prose List Item (bullet or number), Prose Blockquote, Code Block, Image Figure, Separator; tables from Table parts
3. Gap: sm 12, default 16, lg 20; headings add their own space above
4. Width: Fill up to the reading measure (576, 672, 768), min 280

**Content and behavior**

- Every part in the slot uses the same Size as the Prose
- The page title (h1) sits outside the Prose; the Prose starts at h2 and never skips a level
- Links are underlined runs in foreground/brand; inline code is a code-style run; marks use the Highlight recipe on the run
- One idea per paragraph; lists for 3 or more parallel items
- Resize: text wraps, no line limits; images and code blocks fill the column

**Accessibility**

- Real heading levels (h2 to h4) in order, lists as ul and ol
- Links say where they go; body text keeps 4.5:1 or more
- Blockquote uses blockquote with cite

| Variant property | Values |
|---|---|
| Size | default, sm, lg |

Slots (fill them in the instance, never detach): `Content`

Built from: `Code Block`, `Image Figure`, `Prose Blockquote`, `Prose Heading`, `Prose List Item`, `Prose Paragraph`, `Separator`

Tokens and styles:
- Spacing and size: `spacing/3`, `spacing/4`, `spacing/5`

Guides: [ai-chat](../../skills/build-ui/components/ai-chat.md), [content](../../skills/build-ui/components/content.md)

Code: Tailwind Typography `<article className="prose prose-neutral dark:prose-invert max-w-prose">` (Size sm `prose-sm`, default `prose-base`, lg `prose-lg`), or shadcn/typeset (Override `prose-a:text-primary prose-code:bg-muted prose-code:rounded-sm prose-code:px-1 prose-code:before:content-none prose-code:after:content-none`)

## Prose Heading

Component set · 9 variants · default size 672 × 56

A heading inside Prose. Level h2 (section), h3 (subsection), h4 (small group); Size follows the Prose (sm, default, lg). Extra space above comes from the part itself, so the slot keeps one gap. Never skip levels; the page title (h1) sits outside the Prose.


Usage: eggux build-ui/components/content.md

| Variant property | Values |
|---|---|
| Level | h2, h3, h4 |
| Size | default, sm, lg |

| Property | Type | Default |
|---|---|---|
| Text | text | Getting paid on time |

Tokens and styles:
- Colors: `foreground/default`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/3`, `spacing/4`, `spacing/5`, `spacing/6`, `spacing/8`
- Text styles: `heading/h2`, `heading/h3`, `heading/h4`, `ui/label`

Guides: [content](../../skills/build-ui/components/content.md)

Code: plain `h2`-`h4`, `p`, `ul`/`ol` > `li`, `blockquote` + `cite` inside `Prose` (Styled by the prose classes; no component in code)

## Prose Paragraph

Component set · 3 variants · default size 672 × 56

A paragraph inside Prose. Size follows the Prose. Style runs inside the text: links (foreground/brand, underline), inline code (code style), marks (Highlight recipe). Text wraps; no line limit.


Usage: eggux build-ui/components/content.md

| Variant property | Values |
|---|---|
| Size | default, sm, lg |

| Property | Type | Default |
|---|---|---|
| Text | text | Send each invoice on the day the work is done. Clients pay faster when the due date, the amount and the payment details sit at the top of the page. |

Tokens and styles:
- Colors: `foreground/default`
- Text styles: `body/default`, `body/large`, `body/small`

Guides: [content](../../skills/build-ui/components/content.md)

Code: plain `h2`-`h4`, `p`, `ul`/`ol` > `li`, `blockquote` + `cite` inside `Prose` (Styled by the prose classes; no component in code)

## Prose List Item

Component set · 6 variants · default size 672 × 28

One item of a bulleted or numbered list inside Prose. Type bullet (dot in foreground/muted) or number (Number text, 1. 2. 3.). Size follows the Prose. Add one instance per item; the text wraps under itself, not under the marker.


Usage: eggux build-ui/components/content.md

| Variant property | Values |
|---|---|
| Type | bullet, number |
| Size | default, sm, lg |

| Property | Type | Default |
|---|---|---|
| Text | text | Add the purchase order number when the client asks for one. |
| Number | text | 1. |

Tokens and styles:
- Colors: `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/5`
- Text styles: `body/default`, `body/large`, `body/small`

Guides: [content](../../skills/build-ui/components/content.md)

Code: plain `h2`-`h4`, `p`, `ul`/`ol` > `li`, `blockquote` + `cite` inside `Prose` (Styled by the prose classes; no component in code)

## Prose Blockquote

Component set · 3 variants · default size 672 × 80

A quotation inside Prose: quote text with a left rule and an optional Cite (Show cite). Size follows the Prose. For a large testimonial in a section use Quote.


Usage: eggux build-ui/components/content.md

| Variant property | Values |
|---|---|
| Size | default, sm, lg |

| Property | Type | Default |
|---|---|---|
| Text | text | We stopped chasing late payments once every invoice showed the due date and a pay button at the top. |
| Cite | text | Ana Popescu, Finance lead at Acme |
| Show cite | boolean | true |

Tokens and styles:
- Colors: `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/2`, `spacing/3`, `spacing/4`, `spacing/5`
- Text styles: `body/default`, `body/large`, `body/small`, `ui/caption`

Guides: [content](../../skills/build-ui/components/content.md)

Code: plain `h2`-`h4`, `p`, `ul`/`ol` > `li`, `blockquote` + `cite` inside `Prose` (Styled by the prose classes; no component in code)

## Highlight

Component set · 2 variants · default size 57 × 28

A marked run of text. Tone default (highlight/mark): search matches in Search Result Item snippets, Search Suggestions, Command items and Mention Menu. Tone ai (highlight/ai): text an AI added or changed, when there is nothing to accept or reject (otherwise use AI Suggestion). Drawn with the Comment Highlight recipe (Underline 100% thick, offset -80%, skip ink off, color = token) so it wraps with the paragraph: apply the same recipe to a run inside any text. Comments use Comment Highlight.


Usage: eggux build-ui/components/content.md

**Use for**

- Search matches in Search Result Item snippets, Search Suggestions, Command items, Mention Menu
- Text an AI added or changed when there is nothing to accept or reject (Tone=ai)

**Not for**

- Comments: use Comment Highlight
- AI changes to review: use AI Suggestion
- Emphasis in prose: use strong text, not a tint

**Anatomy**

1. Tone: default (highlight/mark, warning tint) or ai (highlight/ai, brand tint)
2. Text: body/default run with Underline 100% thick, offset -80%, skip ink off, color = the token

**Content and behavior**

- Apply the same recipe to a run inside any text; the component is for single runs and snippets
- Mark the matched characters only, not the whole word or line
- Body text only, never on muted text

**Accessibility**

- Rendered as mark; foreground/default on the tint keeps 6.3:1 or more
- Never rely on the tint alone for meaning (search results also bold or count matches)

| Variant property | Values |
|---|---|
| Tone | default, ai |

| Property | Type | Default |
|---|---|---|
| Text | text | late fee |

Tokens and styles:
- Colors: `foreground/default`
- Text styles: `body/default`

Guides: [ai-chat](../../skills/build-ui/components/ai-chat.md), [content](../../skills/build-ui/components/content.md)

Code: `<mark className="bg-[var(--highlight-mark)] text-foreground rounded-[2px]">`; Tone=ai `bg-[var(--highlight-ai)]` (Tokens `--highlight-mark` (= comment highlight), `--highlight-ai` (= primary/10, dark /20))
