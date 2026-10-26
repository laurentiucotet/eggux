# Quote

Generated from the EGG UI master library on 2026-10-26 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Quote](#quote) | 3 | - |
| [Testimonial Card](#testimonial-card) | 4 | - |
| [Footnote](#footnote) | 1 | - |

On the Figma page: "Example / Quote styles", "Example / Testimonial Card styles", "Example / pull quote between sections", "Example / quote in an article", "Example / report page with footnotes", "Stress test / Footnote", "Stress test / Quote", "Stress test / Testimonial Card"

## Quote

Component set · 3 variants · default size 672 × 64

A quotation in running content. Variant: default (left rule, body/large) inside an article or case study; pull (centered, heading/h3, quote mark) to break up a long page with one strong line; large (centered, display size, quote mark) for one quote that is a page section on its own, such as the proof section of a landing page. Attribution: name and role, optional avatar. Quote real people with permission, word for word; no quotation marks in the text, the component adds the emphasis. Keep a large quote under 20 words and use it once per page. Customer quotes in grids use Testimonial Card.


Usage: eggux build-ui/components/content.md

**Use for**

- A sentence from a person quoted in an article or case study
- One strong line between sections of a long page (Variant=pull)
- An expert's view next to data
- One quote as its own page section, such as the proof section of a landing page (Variant=large)

**Not for**

- Customer proof on a marketing page: use Testimonial Card or Block / Testimonials
- Notes and warnings: use Alert
- Code or commands: use Code Block

**Anatomy**

1. Rule on the left (default) or a quote mark (pull, large: display/xl mark)
2. Quote text: body/large (default), heading/h3 (pull), display (large, 720 wide)
3. Attribution: Avatar (Show avatar), Name, Role (Show attribution)

**Content and behavior**

- Word for word, with permission; no quotation marks in the text
- One pull quote per page section, never two in a row
- Variant=large once per page, under 20 words, with generous space above and below
- Attribution names the person and their role at the time
- Under 40 words; longer passages stay in the body text

**Accessibility**

- Code as blockquote with a figcaption for the attribution
- The quote mark is decorative
- Text contrast as body text, never muted

| Variant property | Values |
|---|---|
| Variant | default, pull, large |

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
- Text styles: `body/large`, `body/small`, `display`, `display/xl`, `heading/h3`, `ui/label`

Guides: [content](../../skills/build-ui/components/content.md), [marketing-pages](../../skills/build-ui/patterns/marketing-pages.md)

Code: `<figure><blockquote>` + `<figcaption>` (Default: `border-l-2`; pull: centered, larger type)

## Testimonial Card

Component set · 4 variants · default size 352 × 216

One customer quote for testimonial sections. Variant: default (card with optional rating, the quote, Byline) for grids and carousels; featured (wide card with a large photo or the customer's image, the company Logo and a heading-size quote) for one lead story above a grid or on a case study page, turn Show image off for a logo-only version; minimal (no card: quote and Byline only) for quiet rows under a hero or next to a sign-up form; logo (card with the customer's Logo / * mark above the quote) when the company name sells more than the person. Logo swaps any Logo / * mark. Real people with permission; numbers beat praise. Same Variant and length across a grid (2-4 lines). Quotes inside an article use Quote.


Usage: eggux build-ui/components/content.md

**Use for**

- Variant=default: Block / Testimonial Grid and Testimonial Carousel, next to a pricing or sign-up section
- Variant=featured: one lead story above a grid or on a case study page (large photo or the customer's image, Logo, heading-size quote)
- Variant=logo: when the company name sells more than the person (Logo / * mark above the quote)
- Variant=minimal: a quiet row of quotes under a hero or next to a sign-up form, no card
- Case study lists

**Not for**

- A quote inside an article: use Quote
- Product reviews from buyers: use Review Item
- One large quote for a section: use Block / Testimonial Single

**Anatomy**

1. Variant: default, minimal, logo, featured
2. Rating (Show rating): default only
3. Logo (swap: Logo / *, default Northwind): logo and featured
4. Image (Show image, exposed Image Placeholder 3:4, 280 wide, default Image / Person / 03): featured only; turn it off for a logo-only featured card
5. Quote: body/default (default, logo), body/large (minimal), heading/h3 (featured); 2-4 lines
6. Byline (exposed): Avatar, name, role and company
7. Surface: card with border/default and radius/xl (default, logo, featured); none (minimal)

**Content and behavior**

- Real people with permission; name, role and company
- Specific results beat praise ("closed the books four days faster")
- Same Variant and length across a grid (2-4 lines)
- One featured card per section, above or beside a grid of default or logo cards
- Logo only with the customer's written permission to use their mark
- Minimal quotes sit on the page background; never put them inside another card
- Rating only when it comes with the quote from the same customer
- Real photos or initials; no stock photos

**Accessibility**

- Code as <figure> with <blockquote> and the Byline in <figcaption>
- Rating has aria-label="Rated 5 out of 5"
- The Logo has the company name as alt text; the featured photo has alt="" when the Byline names the person
- In a carousel, one card per slide with a pause control

| Variant property | Values |
|---|---|
| Variant | default, minimal, logo, featured |

| Property | Type | Default |
|---|---|---|
| Quote | text | "We closed the books four days faster in the first quarter. Approvals no longer live in email." |
| Show rating | boolean | true |
| Logo | instance swap | Logo / Northwind |
| Show image | boolean | true |

Built from: `Byline`, `Image Placeholder`, `Logo / Northwind`, `Rating`

Tokens and styles:
- Colors: `background/card`, `border/default`, `foreground/card`
- Spacing and size: `spacing/0`, `spacing/4`, `spacing/6`, `spacing/8`
- Radius: `radius/xl`
- Text styles: `body/default`, `body/large`, `heading/h3`

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
