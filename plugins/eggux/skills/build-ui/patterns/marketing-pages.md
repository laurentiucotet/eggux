# Marketing pages

Shell: `Page Shell / Marketing`. Blocks on the Hero, Sections, Content and Navigation pages,
grouped by family inside each page's `Blocks` section.

## Which block
| Family | Blocks | Use |
|---|---|---|
| Banner | Announcement Banner | One launch or event message above the Navbar, dismissible |
| Hero | Hero Centered, Hero Split, Hero with Screenshot | Screenshot when the product sells itself; split for a human or illustrative image |
| Features | Features, Features Split, Bento Grid | Grid for 3-6 short benefits (Feature Item, stacked); split rows for deep-dives; bento for a platform overview with real components |
| Testimonials | Testimonials, Testimonial Single, Grid, Split, Carousel | Single for one strong quote; grid for breadth; split (case study) for enterprise buyers; carousel only past six |
| CTA | CTA, CTA Split, CTA Card | Card (primary color) once per page near the end; split with a product image mid-page |
| Contact | Contact, Contact Cards, Contact with Map, Offices, Map Section | Cards for channels; map variants only when people visit; always the written address next to a map |
| Blog (Content page) | Blog Grid, Blog Featured, Blog Post Header, News List, Blog List, Article | Grid on the homepage; featured for a blog index; news list for corporate newsrooms |
| Pricing | Pricing, Pricing Single, Pricing Calculator, Comparison Table | One plan: Single; usage-based: Calculator with the exact math; several plans: Pricing then Comparison |
| FAQ | FAQ, FAQ Grid, FAQ Centered | Grid when answers are 1-2 sentences; accordion for longer answers; end with a contact option |
| Stats | Stats, Stats Cards, Stats Split | Real numbers with their period and source; Split when the method matters |
| Team | Team, Team Grid, Team List | Grid with photos for the company page; List with bios for leadership and investors |
| Page headers (Page Headers page) | Header Detail, Header Listing, Header Search Results, Header Profile, Header Event, Header Topic, Header Report, Header Simple | Top of inner pages, by page type: see § Page headers. Landing pages use Hero |
| Careers | Careers List, Careers Benefits, Job Header | List grouped by department with counts; benefits as facts; job page header with salary range |
| Gallery | Gallery Grid, Gallery Mosaic | Grid for places and events; Mosaic for a property, product or venue detail page |
| Navbar | Navbar, Navbar Centered, Navbar Search, Navbar Mega Menu, Navbar Mobile | Default for most sites; Centered for brand-led sites with few links; Search for docs and help; Mega Menu past 7 top-level links or for several products |
| Help center (Content page) | Help Hero, Help Categories, Help Popular Articles, Help Article List, Support Options, Docs Page Footer, Changelog, Status Page | See content-and-docs |
| Footer | Footer, Footer Simple, Footer Newsletter, Footer Corporate, Footer Centered | Simple for few pages; columns for large sites; Newsletter when updates matter; Corporate for enterprise (legal, certifications, status, language); Centered for landing pages and microsites |

## Page headers
Every inner page starts with the header for its type, right under the Navbar. One h1, one
primary action at most.

| Page | Block | Says |
|---|---|---|
| Product, dataset, service, solution | Header Detail | What it is (badges for type and scope), who is behind it, the main action; media on the right. Details and a Table of Contents follow |
| Hub or listing (resources, insights, library) | Header Listing | What is here; a type switch that filters the list; search that keeps the type |
| Search results | Header Search Results | The query, still editable; count; tabs by type with counts; sort |
| Person (author, expert, speaker) | Header Profile | Name, role, organization, short bio, three counts, follow and contact |
| Event, webinar | Header Event | Format, date and time with time zone, place or online, speakers, register and add to calendar; after the date, Watch the recording |
| Topic, category, tag | Header Topic | Scope in one line, how much and how fresh, subtopics as Chips, follow |
| Report, study | Header Report | Three headline figures with their source; download and read online |
| Legal, about, policy | Header Simple | Title, one sentence, last updated; centered at 720 |

Related links in an aside or under an article: `Post Card` Layout=compact, 3-5 items.
Event lists under Header Event or on a topic page: `Event Card`. Downloads on a detail page:
`Resource Item` rows in a card. A strong line between sections: `Quote` Variant=pull.

## Typical order (landing page)
1. Navbar (Navbar Mobile below 768; mega menu panels open on click, close on Escape)
2. Hero: one promise, one primary CTA, one secondary
3. Logo Cloud: proof right after the promise
4. Features (3-6), Stats
5. Testimonials
6. Pricing, then Comparison Table for the details
7. FAQ
8. CTA band, Newsletter
9. Contact (when sales talk to every customer)
10. Footer

## Rules
- One primary CTA repeated (same label) in Hero, Pricing and the final CTA band.
- Each section answers one question; its Section Header title says the answer, not the topic.
- Logos in one muted color; real customers only, with permission.
- Team: real photos or initials, name and role; link to bios only if they exist.
- Contact: response time promise, direct channels, short form (name, email, topic, message);
  inline success with what happens next.
- Comparison Table: plans as columns (recommended marked), features grouped, check / dash /
  value; mobile shows one plan at a time.
- Sections alternate background only when it helps scanning (`background/default` / `muted`).
- Testimonials: real name, role and company (Byline); specific results beat praise; no stock photos.
- Hero, CTA and page header buttons sit in an Action Bar (start, or center under centered text);
  one primary.
- Maps: never the only way to find an address; add directions and opening hours; lazy-load
  interactive maps and use a static image above the fold.
- Announcement banner: one at a time, dismissible, not for errors or outages.

## Cookie consent
- Needed before any non-essential cookie (analytics, ads, embeds that track). Necessary cookies
  need no consent but are listed.
- Accept all and Reject all have the same weight and sit side by side; Customize opens the
  preferences. Optional categories start off. Never block the page or hide Reject.
- Remember the choice; a "Cookie settings" link in the footer reopens the preferences.
- Marketing sites: `Cookie Consent` Type banner at the bottom. Apps: Type card in the
  bottom-left corner. Preferences: Type preferences (dialog with Switches; Necessary always on).
- Texts: say what each category does in one line; link the cookie policy. Legal review per
  country; record the decision in `decisions.md`.

## Related components
- Use `Countdown` only for real deadlines (offer end, webinar start, registration close), always
  with the exact date, time zone and what happens at zero. Never reset it to create urgency.
- Pricing blocks are built from `Plan Card` (2-4 side by side, one Variant=featured), `Price`,
  `Check Item` (5-8 per plan) and a `Toggle Group` for monthly or yearly with a success Badge for
  the saving (example "billing period" on the Toggle Group page). Logo Cloud uses `Logo Tile` in
  one muted color; testimonial blocks use `Testimonial Card`.
- Above a hero title, one `Announcement Pill` links to the newest launch. "How it works" sections
  use `Feature Item` Marker=number (3-4 steps). Certifications in footers, pricing and security
  sections use `Trust Badge`; product screenshots sit in a `Device Frame`, one frame style per page.
