# Search

Generated from the EGG UI master library on 2026-10-27 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Search Result Item](#search-result-item) | 8 | Sources |

On the Figma page: "Example / help center search results", "Example / search results all types", "Example / search results tabbed by type", "Stress test / Search Result Item"

## Search Result Item

Component set · 8 variants · default size 640 × 140

One result on a search page, 640 wide. Type says what was found, and each type has its own text properties:
page: help or docs article. Path › Section, Title, Snippet (matched words bold), type Badge, Updated.
record: an object from the app (invoice, customer, project). Icon tile, Record, status Badge, Record details.
person: Avatar, Name, Role, Email, Message button.
file: file-type icon tile, File name, File details ("PDF · 2.4 MB · Updated 12 Oct"), Owner, download.
media: 16:9 Video Thumbnail with duration, Media title, Media summary, Media details.
product: 1:1 image, Product, Price, Rating, Product summary.
event: Date Tile, Event, format Badge, When and where.
answer: one featured or AI answer in a muted card. Label, Question, Answer (4 lines), Sources slot, feedback.


Pick the Type first: text does not carry over when you switch. Titles wrap to 2 lines, summaries to 2. One Type per result; group or tab results by type; at most one answer, at the top; one width per list. Avatars, Badges, Date Tile, Video Thumbnail, Price and Rating are exposed.


Usage: eggux build-ui/patterns/search-and-filter.md

**Use for**

- Search results pages for help centers and docs (Type=page)
- Global search across the app: records, people and files in one list or in tabs
- Search on content and shop sites: videos (media), products, events
- One featured or AI answer above the results (Type=answer)

**Not for**

- Suggestions while typing: use Command Dialog
- A list of records to manage: use a table of Table Cells or List Items
- Product grids and catalog listings: use Product Card
- Agenda or event listings: use Event Card
- Related links under an article: use Post Card

**Anatomy**

1. Type=page: Path (Show path): Path, Icon/chevron-right, Section; Title (body/large, 2 lines); Snippet (body/small, 2 lines, matched words bold); meta (Show meta): type Badge and Updated
2. Type=record: icon tile (Icon swap, 40, background/muted); Record (title, 2 lines) with a soft status Badge (exposed, soft-warning "Overdue" by default); Record details (Show meta): "Invoice · €1,240.00 · Due 30 Oct 2026 · Updated 12 Oct"
3. Type=person: Avatar lg (exposed: Initials or photo); Name; Role (role and team, 2 lines); Email (Show meta); action (Show action): outline Button sm "Message" (exposed)
4. Type=file: icon tile (Icon swap: file type); File name; meta (Show meta): File details ("PDF · 2.4 MB · Updated 12 Oct"), owner Avatar xs (exposed) and Owner; download (Show action): ghost Button Icon
5. Type=media: Video Thumbnail 160 x 90 with duration (exposed); Media title; Media summary (2 lines); Media details (Show meta): "Video · Acme Academy · Updated 12 Oct 2026"
6. Type=product: Image Placeholder 1:1, 80; Product; Price sm (exposed); Rating sm with count (exposed, Show meta); Product summary (2 lines)
7. Type=event: Date Tile (exposed); Event with a format Badge (exposed, "Webinar"); When and where (Show meta): date, time with time zone, place
8. Type=answer: muted card (background/muted, radius/lg, spacing/4); label: AI Notice label (exposed, "AI answer", or a Badge "Best answer"); Question; Answer (body/default, 4 lines); Sources slot (Source Items or Citations); feedback (Show feedback): "Was this helpful?" and thumbs up / down
9. Each type has its own text properties; Title, Snippet, Path, Section and Updated belong to page only. Show meta, Show action and Icon are shared

**Content and behavior**

- One Type per result: pick the one that matches what opens on click
- Pick the Type before typing text: text properties are per type, so text does not carry over when you switch
- Group results by type with a heading per group, or tab by type (All, Pages, People, Files with counts); inside a tab use one Type
- At most one answer, always first, and only when it is grounded in sources people can open
- Never mix widths or densities in one list; keep the same Show path and Show meta choice for every row of a group
- Titles wrap to 2 lines, snippets and summaries to 2 (Answer to 4), then ellipsis; bold the matched terms
- Status Badges in results are the soft variants (soft-success, soft-warning, soft-destructive, soft-info, soft-neutral), never solid
- Records show their status Badge; files show format and size before people click; people show role and team
- No results: Empty State that repeats the query and suggests other words
- Resize: path, meta and detail rows fill; their texts truncate to 1 line (path up to 160, last text fills); badges hug up to 128; title and snippet 2 lines

**Accessibility**

- Results are a list; each title is a link and a heading; the leading visual is decorative (alt="") unless it adds information
- Matched terms use <mark> (or strong), with contrast that does not rely on color alone
- The result count is announced in a live region when the query or tab changes
- Row actions (Message, download, feedback) are separate buttons whose labels name the result ("Download Q3 revenue report, PDF, 2.4 MB")
- The answer is a region labeled "AI answer" with its sources as links

| Variant property | Values |
|---|---|
| Type | page, record, person, file, media, product, event, answer |

| Property | Type | Default |
|---|---|---|
| Title | text | Send a payment reminder for an overdue invoice |
| Snippet | text | Open the invoice and choose Send reminder. Acme emails the client with the amount due and a payment link, and logs it in the activity. |
| Show path | boolean | true |
| Show meta | boolean | true |
| Path | text | Help center |
| Updated | text | Updated 12 Oct 2026 |
| Section | text | Invoices |
| Icon | instance swap | Icon/file-text |
| Show action | boolean | true |
| Owner | text | Ana Popescu |
| Show feedback | boolean | true |
| Record | text | INV-1041 · Northwind Traders |
| Record details | text | Invoice · €1,240.00 · Due 30 Oct 2026 · Updated 12 Oct |
| Name | text | Ana Popescu |
| Role | text | Finance lead · Billing team, Bucharest |
| Email | text | ana.popescu@acme.com |
| File name | text | Q3 revenue report.pdf |
| File details | text | PDF · 2.4 MB · Updated 12 Oct |
| Media title | text | Send your first invoice in three minutes |
| Media summary | text | A short walkthrough: add a client, add line items, then send the invoice with a payment link. |
| Media details | text | Video · Acme Academy · Updated 12 Oct 2026 |
| Product | text | Low-profile wireless keyboard |
| Product summary | text | Quiet keys, three devices, and a battery that lasts six months on one charge. |
| Event | text | Close the books in five days |
| When and where | text | Thu 12 Nov 2026 · 15:00-16:00 CET · Online |
| Question | text | How do I remind a client about an overdue invoice? |
| Answer | text | Open the invoice and choose Send reminder. Acme emails the client the amount due with a payment link and logs it in the activity. To stop chasing by hand, turn on automatic reminders in Settings > Reminders: before the due date, on the day, or every 7 days after it. |

Slots (fill them in the instance, never detach): `Sources`

Built from: `AI Notice`, `Avatar`, `Badge`, `Button`, `Button Icon`, `Date Tile`, `Image Placeholder`, `Price`, `Rating`, `Source Item`, `Video Thumbnail`. Icons: chevron-right, file-text

Tokens and styles:
- Colors: `background/muted`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/3`, `spacing/4`
- Radius: `radius/lg`, `radius/md`
- Text styles: `body/default`, `body/large`, `body/small`, `ui/caption`

Guides: [ai-chat](../../skills/build-ui/patterns/ai-chat.md), [commerce](../../skills/build-ui/patterns/commerce.md), [search-and-filter](../../skills/build-ui/patterns/search-and-filter.md)

Code: custom (Path, meta and detail rows `min-w-0`, texts `truncate` (path `max-w-40`), badges `max-w-32`; title and snippet `line-clamp-2`)
