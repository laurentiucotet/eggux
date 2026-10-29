# Content components: Prose, Section Heading, Feature Item, Post Card, Quote, Code Block, Table of Contents

Usage guidelines only. Visual specs live in the Figma components.

## Prose (long text)
- Long text (articles, legal, help, docs, long AI answers) goes in `Prose` with Prose parts:
  `Prose Heading` (h2, h3, h4), `Prose Paragraph`, `Prose List Item` (bullet, number) and `Prose
  Blockquote`; Quote, Code Block, Image Figure and Alert sit in the same slot. Links, inline code
  and marks are styled runs inside the text, never separate boxes.
- Size default (672) for article and docs pages, sm (576) in side panels and narrow columns, lg
  (768) for one long read with no aside. One Size per page.
- Headings bring their own space above; never add spacers between Prose parts.
- Figma: `Prose` Size; Content slot (Prose page). `Block / Article` and `Block / Legal Page` use
  it. Example "Prose".

## Highlight and Inline Code
- `Inline Code` for code values in hints, cells and short text (a key, a path, a command name);
  max 320 with an ellipsis. Longer code is a Code Block or Command Snippet.
- `Highlight` Tone=default for search matches and marked text, Tone=ai for text the assistant
  changed or added. It is a text decoration on the run (like Comment Highlight), so the text
  stays editable.

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
- `Show icon`: on all sections of a page or on none.

## Feature Item
- One benefit, capability or step: icon tile (Marker=icon) or step number (Marker=number), title
  in 2-5 words, one or two lines of text, optional link. `stacked` in grids of 3 or 4, `inline` in two-column lists and asides, `centered` under a
  centered Section Header.
- Same Layout, icon style and text length across a grid; one idea per item.
- Plan feature lists with checks are `Check Item`s; numbers are Figure or Stat Card.
- Marker=number with the Number property for "How it works" sections (3-4 steps), only when
  order matters.
- `Layout=card` (bordered card around each item) for feature grids on muted or busy sections, or
  when each item links to its own page; the whole grid uses card.
- Figma: `Feature Item` (own page) Layout (stacked, inline, centered, card) × Marker; Title, Description, Number, Show
  description, Show link; Marker=icon holds an exposed Icon Tile (Icon and Style set on the tile). Used in the Features, Bento Grid and Careers Benefits blocks.

## Post Card
- Articles, news, case studies, changelog entries. Image 16:9, category + date · reading time,
  title, excerpt (3 lines max), author. The whole card is one link.
- `Layout=horizontal` for the featured post at the top of a list; `vertical` in grids of 3.
- `Layout=compact` for related, most read and up next lists in an aside or under an article:
  title on 2 lines, meta in Date ("Guide · 12 Oct 2026"), optional 1:1 image (Show image) on all
  items or none; 3-5 items.
- Figma: `Post Card` (Card page), Title, Excerpt, Date, Author, Show author, Show excerpt, Show image (compact); Badge
  (layer `Badge`) exposed for the category: set its Label.
- `Size=sm` for grids of 4 and for lists next to a featured story; never restyle the title on an instance.
- `Layout=overlay` for one lead story or a cover carousel: the photo fills the card and the text
  sits on `media/scrim` (black 60%), 5.7:1 over any photo. No excerpt. Example "Post Card styles".

## Quote
- `default` (left rule, body/large) inside an article or case study; `pull` (centered,
  heading/h3) for one strong line between sections of a long page; never two in a row.
- `large` (display size, 720 wide) is one quote as its own section, such as proof under a hero;
  once per page, under 20 words.
- Word for word, with permission, under 40 words; no quotation marks in the text. Attribution:
  name and role at the time, optional avatar.
- Customer proof on marketing pages: `Testimonial Card` or `Block / Testimonials`. Notes and warnings: Alert.
- Figma: `Quote` Variant default, pull, large; Quote, Name, Role, Show avatar, Show attribution.
  `Block / Article` uses the default variant.

## Code Block
- Commands, snippets, API examples. Language label + Copy; Copy confirms with "Copied" for 2 s.
- No wrapping: long lines scroll horizontally. Syntax colors come from the highlighter theme.
- Inline code inside prose: `Inline Code` (`code` style on `background/muted`, radius sm), no Code
  Block.
- Show tabs for alternatives (npm, pnpm, yarn), Show line numbers past 3 lines, Show highlight
  (`Code Highlight`, `code/line-highlight`) for the line the text refers to.
- Figma: `Code Block` (Code Block page), Language, Code, Show header, Show tabs, Show line
  numbers, Show highlight. Example "Code Block styles".
- API reference pages: Endpoint Row list (State=selected on the open one), a curl Command Snippet, a JSON Viewer response, recent Log Rows and schema changes in a Diff Viewer (`Block / API Reference`).

## Table of Contents
- Long articles and docs pages (3+ sections). Built from the h2 / h3 headings; the section in view
  is active (scroll spy); clicking scrolls with an offset for sticky headers.
- Sticky on the right from 1280; below that, a collapsible "On this page" at the top.
- Figma: `Table of Contents Item` Level (1, 2) × State, `Table of Contents` (Items slot), Navigation page.
- `Title` names the list ("On this page", "Other policies").

## Related components
- Next to `Code Block`: `Command Snippet` for a single command to copy (the $ is never copied),
  `Diff Viewer` for changes between two versions of a text (one `Diff Line` per line), and
  `JSON Viewer` for collapsible payloads.
- `Image Compare Slider` shows the same view before and after, with a handle to drag between
  the two images (retouching, redesigns, a site before and after a change).
- `Testimonial Card` is customer proof in grids and carousels; `Quote` stays for quotes in running
  text. `Footnote` explains a claim in the text with a numbered note and a back link.
- Social and podcast links use `Icon/brand/*` (Simple Icons), with an aria-label naming the network.
