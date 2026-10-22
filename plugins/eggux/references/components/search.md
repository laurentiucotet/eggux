# Search

Generated from the EGG UI master library on 2026-10-22 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Search Result Item](#search-result-item) | 1 | - |

On the Figma page: "Example / help center search results", "Stress test / Search Result Item"

## Search Result Item

Component · 1 variant · default size 640 × 140

One result on a search page: where it lives (path), title that links to it, a two-line snippet around the matched words, type and date. Bold the matched terms in the title and snippet. Records (customers, invoices) can show their status Badge in meta. Group results by type when there are several kinds.

**Use for**

- Search results pages for help centers and docs
- Global search across records (customers, invoices, articles)
- Results grouped by type

**Not for**

- Suggestions while typing: use Command Dialog
- A list of records to manage: use a table of Table Cells or List Items
- Related links under an article: use Post Card

**Anatomy**

1. Path (Show path): Path (first segment, "Help center"), Icon/chevron-right, Section (second segment, "Invoices"); body/small, muted
2. Title: link, heading/h4
3. Snippet: two lines around the matched words
4. Meta (Show meta): type Badge and Updated ("Updated 12 Oct 2026")

**Content and behavior**

- Bold the matched terms in the title and snippet
- Snippet is cut to two lines around the first match
- Records can show their status Badge in meta
- Group results by type when there are several kinds
- No results: Empty State that repeats the query and suggests other words

**Accessibility**

- Results are a list; each title is a link and a heading
- Matched terms use <mark> (or strong), with contrast that does not rely on color alone
- The result count is announced in a live region when the query changes

| Property | Type | Default |
|---|---|---|
| Title | text | Send a payment reminder for an overdue invoice |
| Snippet | text | Open the invoice and choose Send reminder. Acme emails the client with the amount due and a payment link, and logs it in the activity. |
| Show path | boolean | true |
| Show meta | boolean | true |
| Path | text | Help center |
| Updated | text | Updated 12 Oct 2026 |
| Section | text | Invoices |

Built from: `Badge`. Icons: chevron-right

Tokens and styles:
- Colors: `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/3`
- Text styles: `body/large`, `ui/caption`

Guides: [search-and-filter](../../skills/build-ui/patterns/search-and-filter.md)

Code: custom `<li>`: path, `<a>` heading, `line-clamp-2` snippet, `Badge` (Matched terms in `<mark>`)
