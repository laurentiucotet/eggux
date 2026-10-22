# Content components: Section Heading, Feature Item, Post Card, Quote, Code Block, Table of Contents

Usage guidelines only. Visual specs live in the Figma components.

## Section Heading
- Opens a section of an app or content page, or a group inside a card or a long form: title,
  one-sentence description, optional overline, one row of actions on the right (View all, Add, a
  search Input, a Toggle Group).
- `Size=lg` (h2) for content page sections, `default` (h3) for sections of an app page, `sm` (h4)
  for groups inside a card or panel. Same Size for sections on the same level.
- Centered marketing sections use the Section Header block; card titles use Card Header; the page
  title uses a Page Header block.
- Figma: `Section Heading` (own page) Size; Title, Description, Overline, Show overline, Show
  description, Show actions; Actions slot. Used in Integrations, Audit Log, Report, Record Form,
  Import Mapping and Status Page.

## Feature Item
- One benefit, capability or step: icon tile (Marker=icon) or step number (Marker=number), title
  in 2-5 words, one or two lines of text, optional link. `stacked` in grids of 3 or 4, `inline` in two-column lists and asides, `centered` under a
  centered Section Header.
- Same Layout, icon style and text length across a grid; one idea per item.
- Plan feature lists with checks are `Check Item`s; numbers are Figure or Stat Card.
- Marker=number with the Number property for "How it works" sections (3-4 steps), only when
  order matters.
- Figma: `Feature Item` (own page) Layout × Marker; Title, Description, Number, Icon (swap), Show
  description, Show link. Used in the Features, Bento Grid and Careers Benefits blocks.

## Post Card
- Articles, news, case studies, changelog entries. Image 16:9, category + date · reading time,
  title, excerpt (3 lines max), author. The whole card is one link.
- `Layout=horizontal` for the featured post at the top of a list; `vertical` in grids of 3.
- `Layout=compact` for related, most read and up next lists in an aside or under an article:
  title on 2 lines, meta in Date ("Guide · 12 Oct 2026"), optional 1:1 image (Show image) on all
  items or none; 3-5 items.
- Figma: `Post Card` (Card page), Title, Excerpt, Date, Author, Show author, Show excerpt, Show image (compact); Badge
  exposed for the category.

## Quote
- `default` (left rule, body/large) inside an article or case study; `pull` (centered,
  heading/h3) for one strong line between sections of a long page; never two in a row.
- Word for word, with permission, under 40 words; no quotation marks in the text. Attribution:
  name and role at the time, optional avatar.
- Customer proof on marketing pages: `Testimonial Card` or `Block / Testimonials`. Notes and warnings: Alert.
- Figma: `Quote` Variant default, pull; Quote, Name, Role, Show avatar, Show attribution.
  `Block / Article` uses the default variant.

## Code Block
- Commands, snippets, API examples. Language label + Copy; Copy confirms with "Copied" for 2 s.
- No wrapping: long lines scroll horizontally. Syntax colors come from the highlighter theme.
- Inline code inside prose: `code` style on `background/muted`, radius sm, no Code Block.
- Figma: `Code Block` (Code Block page), Language, Code, Show header.

## Table of Contents
- Long articles and docs pages (3+ sections). Built from the h2 / h3 headings; the section in view
  is active (scroll spy); clicking scrolls with an offset for sticky headers.
- Sticky on the right from 1280; below that, a collapsible "On this page" at the top.
- Figma: `Table of Contents Item` Level (1, 2) × State, `Table of Contents` (Items slot), Navigation page.

## Related components
- Next to `Code Block`: `Command Snippet` for a single command to copy (the $ is never copied),
  `Diff Viewer` for changes between two versions of a text (one `Diff Line` per line), and
  `JSON Viewer` for collapsible payloads.
- `Image Compare Slider` shows the same view before and after, with a handle to drag between
  the two images (retouching, redesigns, a site before and after a change).
- `Testimonial Card` is customer proof in grids and carousels; `Quote` stays for quotes in running
  text. `Footnote` explains a claim in the text with a numbered note and a back link.
