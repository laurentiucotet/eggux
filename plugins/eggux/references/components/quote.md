# Quote

Generated from the EGG UI master library on 2026-10-22 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Quote](#quote) | 2 | - |
| [Testimonial Card](#testimonial-card) | 1 | - |
| [Footnote](#footnote) | 1 | - |

On the Figma page: "Example / pull quote between sections", "Example / quote in an article", "Stress test / Footnote", "Stress test / Quote", "Stress test / Testimonial Card"

## Quote

Component set · 2 variants · default size 672 × 92

A quotation in running content: default (left rule, body/large) inside an article or case study; pull (centered, heading/h3, quote mark) to break up a long page with one strong line. Attribution: name and role, optional avatar. Quote real people with permission, word for word; no quotation marks in the text, the component adds the emphasis. Customer quotes on marketing pages use the Testimonial blocks.

**Use for**

- A sentence from a person quoted in an article or case study
- One strong line between sections of a long page (Variant=pull)
- An expert's view next to data

**Not for**

- Customer proof on a marketing page: use Testimonial Card or Block / Testimonials
- Notes and warnings: use Alert
- Code or commands: use Code Block

**Anatomy**

1. Rule on the left (default) or a quote mark (pull)
2. Quote text: body/large (default), heading/h3 (pull)
3. Attribution: Avatar (Show avatar), Name, Role (Show attribution)

**Content and behavior**

- Word for word, with permission; no quotation marks in the text
- One pull quote per page section, never two in a row
- Attribution names the person and their role at the time
- Under 40 words; longer passages stay in the body text

**Accessibility**

- Code as blockquote with a figcaption for the attribution
- The quote mark is decorative
- Text contrast as body text, never muted

| Variant property | Values |
|---|---|
| Variant | default, pull |

| Property | Type | Default |
|---|---|---|
| Quote | text | The best onboarding is the product itself, with the next step always visible. |
| Show avatar | boolean | true |
| Name | text | Maria Ilie |
| Role | text | Head of Finance Operations, Acme |
| Show attribution | boolean | true |

Built from: `Avatar`

Tokens and styles:
- Colors: `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/1`, `spacing/3`, `spacing/4`, `spacing/6`
- Text styles: `body/large`, `body/small`, `display`, `heading/h3`, `ui/label`

Guides: [content](../../skills/build-ui/components/content.md), [marketing-pages](../../skills/build-ui/patterns/marketing-pages.md)

Code: `<figure><blockquote>` + `<figcaption>` (Default: `border-l-2`; pull: centered, larger type)

## Testimonial Card

Component · 1 variant · default size 352 × 216

One customer quote as a card for testimonial grids and carousels: rating (optional), the quote with a specific result, Byline with name, role and company. Real people with permission; numbers beat praise. Same length across a grid (2-4 lines). Quotes inside an article use Quote.

**Use for**

- Block / Testimonial Grid and Testimonial Carousel
- Next to a pricing or sign-up section
- Case study lists

**Not for**

- A quote inside an article: use Quote
- Product reviews from buyers: use Review Item
- One large quote for a section: use Block / Testimonial Single

**Anatomy**

1. Rating (Show rating)
2. Quote: 2-4 lines
3. Byline: Avatar, name, role and company

**Content and behavior**

- Real people with permission; name, role and company
- Specific results beat praise ("closed the books four days faster")
- Same length across a grid (2-4 lines)
- Rating only when it comes with the quote from the same customer
- Real photos or initials; no stock photos

**Accessibility**

- Code as <figure> with <blockquote> and the Byline in <figcaption>
- Rating has aria-label="Rated 5 out of 5"
- In a carousel, one card per slide with a pause control

| Property | Type | Default |
|---|---|---|
| Quote | text | "We closed the books four days faster in the first quarter. Approvals no longer live in email." |
| Show rating | boolean | true |

Built from: `Byline`, `Rating`

Tokens and styles:
- Colors: `background/card`, `border/default`, `foreground/card`
- Spacing and size: `spacing/4`, `spacing/6`
- Radius: `radius/xl`
- Text styles: `body/default`

Guides: [content](../../skills/build-ui/components/content.md), [rating](../../skills/build-ui/components/rating.md), [marketing-pages](../../skills/build-ui/patterns/marketing-pages.md)

Code: shadcn `Card` + `<figure><blockquote>` + `Byline` in `<figcaption>`

## Footnote

Component · 1 variant · default size 560 × 60

A numbered note at the end of an article, report or pricing page that explains a claim in the text. The number matches a superscript link in the text; "Back to text" returns to it. Keep notes to one or two sentences; sources with links go in a Sources list.

**Use for**

- Pricing conditions (VAT, exchange rates)
- Reports and case studies that qualify a number
- Claims in a hero or a stats section

**Not for**

- Several sources with links: use Sources
- Warnings people must read: use Alert
- A short definition on hover: use Tooltip

**Anatomy**

1. Number: matches the superscript in the text
2. Text: one or two sentences
3. Back link (Show back link): arrow-up icon and "Back to text"

**Content and behavior**

- Numbers follow the order in the text, starting at 1
- The number matches a superscript link in the text
- Back to text returns to the same reference
- One or two sentences per note
- Notes sit together at the end of the page or section

**Accessibility**

- Code as an <ol> with an id per note
- The superscript link has an aria-label ("Footnote 1")
- The back link has an aria-label ("Back to reference 1") and moves focus to it

| Property | Type | Default |
|---|---|---|
| Number | text | 1 |
| Text | text | Amounts include VAT at the standard rate. Exchange rates from the European Central Bank on the invoice date. |
| Show back link | boolean | true |

Icons: arrow-up

Tokens and styles:
- Colors: `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/2`
- Text styles: `body/small`, `ui/caption`

Guides: [content](../../skills/build-ui/components/content.md)

Code: custom `<ol>` with ids; `<sup><a href="#fn-1">` in the text (Back link to `#fnref-1`)
