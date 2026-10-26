# Email

Generated from the EGG UI master library on 2026-10-26 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Email / Header](#email-header) | 1 | - |
| [Email / Hero](#email-hero) | 1 | - |
| [Email / Button](#email-button) | 2 | - |
| [Email / Content](#email-content) | 1 | - |
| [Email / Code](#email-code) | 1 | - |
| [Email / Details](#email-details) | 1 | Rows |
| [Email / Details Row](#email-details-row) | 1 | - |
| [Email / Line Items](#email-line-items) | 1 | Items, Totals |
| [Email / Line Item](#email-line-item) | 1 | - |
| [Email / Total Row](#email-total-row) | 2 | - |
| [Email / Callout](#email-callout) | 5 | - |
| [Email / Divider](#email-divider) | 1 | - |
| [Email / Stats](#email-stats) | 1 | Items |
| [Email / Stat](#email-stat) | 1 | - |
| [Email / Article](#email-article) | 1 | - |
| [Email / Footer](#email-footer) | 1 | - |

On the Figma page: "Stress test / Email / Article", "Stress test / Email / Button", "Stress test / Email / Callout", "Stress test / Email / Code", "Stress test / Email / Content", "Stress test / Email / Details", "Stress test / Email / Divider", "Stress test / Email / Footer", "Stress test / Email / Header", "Stress test / Email / Hero", "Stress test / Email / Line Items", "Stress test / Email / Stats"

## Email / Header

Component · 1 variant · default size 600 × 88

Top of an email, outside the card: the sender's logo and an optional "View in browser" link. Use it once, first, in every email.


Logo swaps to any Logo or Logo / * (use the client's logo, 32 px high).
Show preheader link adds the browser link on the right (newsletters and long emails); transactional emails leave it off.
Transparent: it sits on section/muted-background above the background/card body.


Usage: eggux build-ui/patterns/email.md

**Use for**

- First part of every email template
- Newsletters and long emails with the browser link on

**Not for**

- Navigation menus or several links: an email header holds the logo only
- Inside the card: it sits on the muted canvas above it

**Anatomy**

1. Logo (swap): any Logo or Logo / *, 32 px high
2. Preheader link (Show preheader link): ui/caption, foreground/muted, underlined, right
3. Container: 600 wide, padding 32 top, 24 bottom, 40 sides, transparent

**Content and behavior**

- Use the brand logo of the sender (Logo / Orbitly for Orbitly, Logo / Tidewater for the store)
- Transactional emails leave the browser link off
- Logo links to the product home page

**Accessibility**

- Logo image has alt text with the company name ("Orbitly")
- Browser link text says where it goes
- foreground/muted on section/muted-background is 4.5:1 or more

| Property | Type | Default |
|---|---|---|
| Logo | instance swap | Type=full |
| Show preheader link | boolean | false |
| Preheader link | text | View in browser |

Built from: `Logo`

Tokens and styles:
- Colors: `foreground/muted`
- Spacing and size: `spacing/10`, `spacing/6`, `spacing/8`
- Text styles: `ui/caption`

Code: `Section` + `Row` with `Column` `Img` (logo, `alt` = company name, height 32) and `Column` `Link` "View in browser" (Logo as a hosted PNG at 2x; SVG is not supported in Gmail and Outlook)

## Email / Hero

Component · 1 variant · default size 600 × 108

Opening of the email body: what happened, in one heading and one or two sentences. First part inside the card.


Title says the news or the task ("Reset your password", "Payment received"), sentence case, no exclamation marks.
Text gives the one fact the reader needs next (amount, date, who).
Show eyebrow adds a short brand-colored label (product area or date range). Show image adds a 16:9 Image Placeholder (exposed: pick an Image / *); use it for announcements and newsletters, not for security emails.


Usage: eggux build-ui/patterns/email.md

**Use for**

- First part inside the card of every email
- Announcements and newsletters with Show image on

**Not for**

- Images in security emails (password, sign-in, verification)
- Long paragraphs: put them in Email / Content

**Anatomy**

1. Image (Show image): Image Placeholder 16:9, 520 wide, exposed, any Image / *
2. Eyebrow (Show eyebrow): ui/overline, foreground/brand
3. Title: heading/h2, foreground/default
4. Text (Show text): body/default, foreground/muted
5. Container: 600 wide, 40 px side padding, gap 16

**Content and behavior**

- Title says the news or the task in sentence case, no exclamation marks
- Text gives the one fact needed next: amount, date, who, how long a link works
- The subject line and the Title say the same thing

**Accessibility**

- Title is the email's only h1
- Image has alt text, or empty alt when decorative
- Never put text inside the image

| Property | Type | Default |
|---|---|---|
| Show image | boolean | false |
| Show eyebrow | boolean | false |
| Eyebrow | text | Billing |
| Title | text | Your invoice from Acme is ready |
| Show text | boolean | true |
| Text | text | Invoice INV-2041 for €1,240.00 is due on 15 November 2026. You can view it and pay online in a few clicks. |

Built from: `Image Placeholder`

Tokens and styles:
- Colors: `foreground/brand`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/10`, `spacing/4`
- Text styles: `body/default`, `heading/h2`, `ui/overline`

Code: `Section` with optional `Img` (width 520, rounded), `Text` eyebrow, `Heading as="h1"`, `Text` (One h1 per email; same words as the subject)

## Email / Button

Component set · 2 variants · default size 600 × 44

The one call to action of an email: a solid primary pill, 44 px tall, label in foreground/primary on background/primary, radius from button/radius. Built as a bulletproof button in code (a padded link, not an image), so it shows with images off.


One Email / Button per email; secondary actions are text links in Email / Content.
Label is verb + object ("Verify email", "Pay invoice"), the same words as the page it opens.
Align left (default, follows the text) or center (short welcome or announcement emails).
Put the plain URL under it for long-lived links ("Or paste this link into your browser").


Usage: eggux build-ui/patterns/email.md

**Use for**

- The main action of every transactional email: verify, sign in, reset, pay, accept
- Once per email

**Not for**

- Two buttons side by side: put the second action as a text link in Email / Content
- Images of buttons: they disappear when images are off

**Anatomy**

1. Align (variant): left, center
2. Button: background/primary, radius button/radius, height 44, padding 24 sides
3. Label: ui/label, foreground/primary

**Content and behavior**

- Label is verb + object and matches the page it opens ("Reset password")
- Under links that expire, add the plain URL in Email / Content for people whose client blocks buttons
- Align left in text emails; center in short welcome or announcement emails

**Accessibility**

- It is a link (a element), not a button
- Label 5:1 or more on background/primary in every theme
- 44 px tall tap target

| Variant property | Values |
|---|---|
| Align | left, center |

| Property | Type | Default |
|---|---|---|
| Label | text | Pay invoice |

Tokens and styles:
- Colors: `background/primary`, `foreground/primary`
- Spacing and size: `spacing/10`, `spacing/11`, `spacing/6`
- Radius: `button/radius`
- Text styles: `ui/label`

Code: `Button` (`href`, padding 12px 24px, borderRadius 9999, background primary, color primary-foreground, fontWeight 600) (Renders a bulletproof padded link (works with images off, MSO padding hack included); Align=center: wrap in `Section` with `textAlign: "center"`)

## Email / Content

Component · 1 variant · default size 600 × 92

A block of body text with an optional heading: explanations, next steps, fallback links, sign-offs. Stack several for longer emails.


Text in body/default 16, foreground/default; short paragraphs (2 to 3 sentences).
Show heading adds a heading/h4 for a titled section ("What happens next").
Links inside the text are underlined and say where they go.


Usage: eggux build-ui/patterns/email.md

**Use for**

- Paragraphs after the Hero
- The plain URL under a button
- Sign-off ("The Orbitly team") and help line

**Not for**

- Key facts like amount or due date: use Email / Details
- Warnings: use Email / Callout

**Anatomy**

1. Heading (Show heading): heading/h4, foreground/default
2. Text: body/default 16, foreground/default
3. Container: 600 wide, 40 px side padding, gap 8

**Content and behavior**

- Two or three sentences per block; stack blocks rather than writing walls of text
- Links are underlined and say where they go
- No "click here", no exclamation marks

**Accessibility**

- Heading is h2 in code
- 16 px text, line height 28
- Contrast foreground/default on background/card 15:1 or more

| Property | Type | Default |
|---|---|---|
| Show heading | boolean | true |
| Heading | text | How to pay |
| Text | text | Pay by card or bank transfer from the invoice page. Paid invoices show up in your Acme account within a minute. |

Tokens and styles:
- Colors: `foreground/default`
- Spacing and size: `spacing/10`, `spacing/2`
- Text styles: `body/default`, `heading/h4`

Code: `Section` with optional `Heading as="h2"` and `Text` (16/28); links with `Link` (Fallback URL under a button goes here as plain text + `Link`)

## Email / Code

Component · 1 variant · default size 600 × 152

A one-time code in large monospace digits (Roboto Mono SemiBold 36, font/mono) on a background/muted box, with how long it is valid.


Six digits, no spaces or dashes inside the code, so copy and paste works; letter spacing keeps it readable.
Hint says when it expires and what to do if the reader did not ask for it.
Put the code in the email subject too ("482916 is your Acme code") so it shows in notifications.


Usage: eggux build-ui/patterns/email.md

**Use for**

- Email verification, sign-in codes and two-step confirmation

**Not for**

- Passwords or secrets that stay valid: never email them
- Codes longer than 8 characters: send a link instead

**Anatomy**

1. Box: background/muted, radius/lg, padding 24
2. Label: ui/label, foreground/default
3. Code: Roboto Mono SemiBold 36 (font/mono), letter spacing 10, foreground/default
4. Hint (Show hint): body/small, foreground/muted, under the box

**Content and behavior**

- Six digits, no spaces inside, so copy and paste works
- Hint says when the code expires and what to do if the reader did not ask for it
- Put the code in the subject line too ("482916 is your Orbitly code")

**Accessibility**

- Code is real text, never an image
- In code, wrap it in a container that screen readers read as one string
- Contrast foreground/default on background/muted 15:1 or more

| Property | Type | Default |
|---|---|---|
| Label | text | Your verification code |
| Code | text | 482916 |
| Show hint | boolean | true |
| Hint | text | The code expires in 10 minutes. If you did not ask for it, you can ignore this email. |

Tokens and styles:
- Colors: `background/muted`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/10`, `spacing/2`, `spacing/3`, `spacing/6`
- Radius: `radius/lg`
- Text styles: `body/small`, `ui/label`

Code: `Section` (background muted, borderRadius 12, padding 24, textAlign center) with `Text` label and `Text` (fontFamily monospace, fontSize 36, letterSpacing 10) (Code also in the subject line; never an image)

## Email / Details

Component · 1 variant · default size 600 × 174

Key facts as label and value rows in a light bordered box: invoice number, amount, due date, sign-in device and location, delivery address.


Rows (slot): Email / Details Row instances, 2 to 6 rows, the most important first.
Values are exact: currency with symbol, full dates for anything legal ("15 November 2026"), times with time zone.
Show title adds a heading/h4 above the box.


Usage: eggux build-ui/patterns/email.md

**Use for**

- Invoices, receipts and payment failures
- Security notices (device, location, time)
- Invitations (workspace, role, invited by) and orders (number, delivery)

**Not for**

- Purchased items with amounts: use Email / Line Items
- More than six rows: link to the page instead

**Anatomy**

1. Title (Show title): heading/h4
2. Rows (slot): Email / Details Row (Label body/small foreground/muted, Value ui/label right)
3. Box: card/muted-background, border/default 1 px, radius/md, padding 12 and 20

**Content and behavior**

- Most important row first (amount or what changed)
- Exact values: currency symbol, full dates for legal facts, times with time zone
- Same labels as in the product ("Invoice number", not "Ref")

**Accessibility**

- In code a two-column table with role="presentation" or a definition list
- Label and value read in order, left to right

| Property | Type | Default |
|---|---|---|
| Show title | boolean | true |
| Title | text | Invoice details |

Slots (fill them in the instance, never detach): `Rows`

Built from: `Email / Details Row`

Tokens and styles:
- Colors: `border/default`, `card/muted-background`, `foreground/default`
- Spacing and size: `spacing/10`, `spacing/3`, `spacing/5`
- Radius: `radius/md`
- Text styles: `heading/h4`

Code: `Section` (border, borderRadius 8, padding "12px 20px") with one `Row` per line: `Column` `Text` label + `Column align="right"` `Text` value (Tables carry `role="presentation"` (React Email adds it))

## Email / Details Row

Component · 1 variant · default size 520 × 36

One key and value line inside Email / Details: label left in body/small foreground/muted, value right in ui/label. Part of Email / Details.


Usage: eggux build-ui/patterns/email.md

| Property | Type | Default |
|---|---|---|
| Label | text | Invoice number |
| Value | text | INV-2041 |

Tokens and styles:
- Colors: `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/2`, `spacing/4`
- Text styles: `body/small`, `ui/label`

Code: `Section` (border, borderRadius 8, padding "12px 20px") with one `Row` per line: `Column` `Text` label + `Column align="right"` `Text` value (Tables carry `role="presentation"` (React Email adds it))

## Email / Line Items

Component · 1 variant · default size 600 × 355

What was bought or billed, with the sums: invoices, receipts, order confirmations.


Items (slot): Email / Line Item rows (turn Show image on for products).
Totals (slot): Email / Total Row, subtotal, discounts, shipping, VAT, then one Type=total row.
Amounts right-aligned, same decimals, currency symbol on every amount.


Usage: eggux build-ui/patterns/email.md

**Use for**

- Invoice and receipt lines with subtotal, VAT and total
- Order confirmations with product photos (Line Item Show image)

**Not for**

- Facts without amounts: use Email / Details
- More than 10 lines: summarize and link to the full invoice

**Anatomy**

1. Title (Show title): heading/h4
2. Items (slot): Email / Line Item (Image 64 px when Show image, Name ui/label, Meta body/small muted, Amount right), bottom rule border/default
3. Totals (slot): Email / Total Row, Type default (body/small) and Type total (body/large, top rule)

**Content and behavior**

- Amounts right-aligned with the same decimals and the currency symbol
- Meta says quantity, size or period ("2 × €18.00", "Size M")
- One Type=total row, last

**Accessibility**

- In code a table with role="presentation"; the total is also stated in words in the Hero text
- Product photos have alt text with the product name

| Property | Type | Default |
|---|---|---|
| Show title | boolean | true |
| Title | text | Summary |

Slots (fill them in the instance, never detach): `Items`, `Totals`

Built from: `Email / Line Item`, `Email / Total Row`

Tokens and styles:
- Colors: `border/default`, `foreground/default`
- Spacing and size: `spacing/10`, `spacing/3`
- Text styles: `heading/h4`

Code: `Section` with `Row` per item: `Column` `Img` (64 x 64), `Column` `Text` name + meta, `Column align="right"` `Text` amount; `Hr`; `Row` per total (Total row bold 18; amounts formatted with `Intl.NumberFormat` and the currency)

## Email / Line Item

Component · 1 variant · default size 520 × 67

One purchased item or invoice line: optional 64 px product photo (Show image, exposed Image Placeholder 1:1), Name, Meta (quantity, size, period), Amount right-aligned. Part of Email / Line Items.


Usage: eggux build-ui/patterns/email.md

| Property | Type | Default |
|---|---|---|
| Show image | boolean | false |
| Name | text | Consulting hours |
| Meta | text | 12 h × €85.00 |
| Amount | text | €1,020.00 |

Built from: `Image Placeholder`

Tokens and styles:
- Colors: `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/3`, `spacing/4`
- Text styles: `body/small`, `ui/label`

Code: `Section` with `Row` per item: `Column` `Img` (64 x 64), `Column` `Text` name + meta, `Column align="right"` `Text` amount; `Hr`; `Row` per total (Total row bold 18; amounts formatted with `Intl.NumberFormat` and the currency)

## Email / Total Row

Component set · 2 variants · default size 520 × 28

A sum line under Email / Line Items. Type default for subtotal, discount, shipping and VAT (body/small); Type total for the amount paid or due (body/large, top rule). Part of Email / Line Items.


Usage: eggux build-ui/patterns/email.md

| Variant property | Values |
|---|---|
| Type | default, total |

| Property | Type | Default |
|---|---|---|
| Label | text | Subtotal |
| Amount | text | €1,499.00 |

Tokens and styles:
- Colors: `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/3`, `spacing/4`
- Text styles: `body/large`, `body/small`

Code: `Section` with `Row` per item: `Column` `Img` (64 x 64), `Column` `Text` name + meta, `Column align="right"` `Text` amount; `Hr`; `Row` per total (Total row bold 18; amounts formatted with `Intl.NumberFormat` and the currency)

## Email / Callout

Component set · 5 variants · default size 600 × 96

A tinted notice box inside the body: something the reader must know but that is not the main action ("If this was not you", "Your card expires soon").


Tone: default (neutral), info, success, warning, destructive; soft badge/soft-* backgrounds, icon in the matching color, text always foreground/default.
One callout per email at most; the message must still make sense without the color.
Title short, Text one or two sentences with the fix.


Usage: eggux build-ui/patterns/email.md

**Use for**

- "If this was not you" in security emails
- Retry dates after a failed payment
- Read-only or deadline warnings

**Not for**

- The main message of the email: that is the Hero
- More than one callout per email

**Anatomy**

1. Tone (variant): default, info, success, warning, destructive
2. Box: badge/soft-* background (background/muted for default), radius/md, padding 16, gap 12
3. Icon (Show icon): 20 px, matching badge/soft-*-fg
4. Title (Show title): ui/label; Text: body/small, both foreground/default

**Content and behavior**

- Title short, Text one or two sentences with the fix
- The message must make sense without the color
- warning for deadlines and "was this not you" notices; destructive only for a blocked account or data loss

**Accessibility**

- Icon is decorative (empty alt); the Title carries the meaning
- Text stays foreground/default on the tint: 12:1 or more

| Variant property | Values |
|---|---|
| Tone | default, info, success, warning, destructive |

| Property | Type | Default |
|---|---|---|
| Show title | boolean | true |
| Title | text | Payment due in 3 days |
| Text | text | Invoice INV-2041 for €1,240.00 is due on 15 November 2026. Pay now to keep your account in good standing. |
| Show icon | boolean | true |

Icons: circle-alert, circle-check, info, triangle-alert

Tokens and styles:
- Colors: `background/muted`, `badge/soft-destructive-bg`, `badge/soft-info-bg`, `badge/soft-success-bg`, `badge/soft-warning-bg`, `foreground/default`
- Spacing and size: `spacing/1`, `spacing/10`, `spacing/3`, `spacing/4`
- Radius: `radius/md`
- Text styles: `body/small`, `ui/label`

Code: `Section` (backgroundColor tone tint as solid hex, borderRadius 8, padding 16) with `Row`: `Column` `Img` icon 20 + `Column` `Text` title and `Text` body (Use solid hex tints (rgba is unreliable in Outlook); icon PNG, `alt=""`)

## Email / Divider

Component · 1 variant · default size 600 × 1

A 1 px border/default rule across the body column (Separator inside 40 px side padding). Use it between groups of content (summary, then details), not between every block.


Usage: eggux build-ui/patterns/email.md

**Use for**

- Between the summary and the details
- Between articles in a newsletter

**Not for**

- Between every block: spacing already separates them

**Anatomy**

1. Separator (horizontal, Spacing none) inside 40 px side padding

**Content and behavior**

- At most two or three per email

**Accessibility**

- Decorative

Built from: `Separator`

Tokens and styles:
- Spacing and size: `spacing/10`

Code: `Hr` (borderColor border, margin "0 40px")

## Email / Stats

Component · 1 variant · default size 600 × 110

Two or three key numbers side by side for digests and reports (weekly summary, usage). Items (slot) holds Email / Stat; on narrow screens the cells stack in code.


Three figures at most, each with its period; link to the full report with the Email / Button.


Usage: eggux build-ui/patterns/email.md

**Use for**

- Weekly summaries, usage reports, trial recaps

**Not for**

- More than three figures
- Charts: they render as images and break in dark mode

**Anatomy**

1. Items (slot): Email / Stat, Value heading/h3, Label body/small muted, Change (Show change) ui/label-small in badge/soft-success-fg
2. Cell: card/muted-background, border/default, radius/md, padding 16

**Content and behavior**

- Every figure says its period
- Link to the full report from the email's one button

**Accessibility**

- Cells stack on narrow screens in code
- Change is also written in words ("+12% on last week"), never color alone

Slots (fill them in the instance, never detach): `Items`

Built from: `Email / Stat`

Tokens and styles:
- Spacing and size: `spacing/10`, `spacing/3`

Code: `Row` with up to three `Column` cells (background muted, border, borderRadius 8, padding 16): `Text` value, `Text` label, `Text` change (Cells stack under 480 px with a media query in `Head`)

## Email / Stat

Component · 1 variant · default size 160 × 110

One figure in Email / Stats: Value (heading/h3), Label, optional Change (green for good news; say the period). Part of Email / Stats.


Usage: eggux build-ui/patterns/email.md

| Property | Type | Default |
|---|---|---|
| Value | text | 42 |
| Label | text | Active projects |
| Show change | boolean | true |
| Change | text | +3 this week |

Tokens and styles:
- Colors: `badge/soft-success-fg`, `border/default`, `card/muted-background`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/4`
- Radius: `radius/md`
- Text styles: `body/small`, `heading/h3`, `ui/label-small`

Code: `Row` with up to three `Column` cells (background muted, border, borderRadius 8, padding 16): `Text` value, `Text` label, `Text` change (Cells stack under 480 px with a media query in `Head`)

## Email / Article

Component · 1 variant · default size 600 × 120

A teaser for an article, guide or release note in newsletters: 4:3 thumbnail (Show image, exposed Image Placeholder), Title, one-sentence Text and a Link that names the destination. Stack 2 to 4 with Email / Divider between.


Usage: eggux build-ui/patterns/email.md

**Use for**

- Newsletters and digests, 2 to 4 in a row with Email / Divider between

**Not for**

- Transactional emails

**Anatomy**

1. Image (Show image): Image Placeholder 4:3, 160 x 120, exposed
2. Title: body/large, foreground/default
3. Text: body/small, foreground/muted
4. Link: ui/label, foreground/brand, underlined

**Content and behavior**

- Link names the destination ("Read the guide"), never "click here"
- One sentence of text

**Accessibility**

- Thumbnail alt text or empty when the title says it all
- Whole title also links to the article

| Property | Type | Default |
|---|---|---|
| Show image | boolean | true |
| Title | text | Five ways to get invoices paid on time |
| Text | text | Clear due dates, card payments and two friendly reminders cut late payments by a third. |
| Link | text | Read the article |

Built from: `Image Placeholder`

Tokens and styles:
- Colors: `foreground/brand`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/10`, `spacing/5`
- Text styles: `body/large`, `body/small`, `ui/label`

Code: `Row`: `Column` `Img` (160 x 120) + `Column` `Heading as="h3"`, `Text`, `Link` (Whole title links to the article too)

## Email / Footer

Component · 1 variant · default size 600 × 200

Bottom of every email, outside the card on section/muted-background: social links, the company's postal address, why the reader got this email, and the preferences and unsubscribe links.


Address and Reason are required by anti-spam law in most countries; keep them on every email.
Show unsubscribe: on for marketing and digests, off for security and receipts (those cannot be turned off), where Show preferences stays.
Show social: LinkedIn, X, YouTube, GitHub marks in foreground/muted; drop it for security emails.


Usage: eggux build-ui/patterns/email.md

**Use for**

- Last part of every email

**Not for**

- Marketing content or extra calls to action

**Anatomy**

1. Social (Show social): LinkedIn, X, YouTube, GitHub marks, 20 px, foreground/muted
2. Address: body/small, foreground/muted, centered
3. Reason: body/small, foreground/muted, centered
4. Links: Preferences (Show preferences), Unsubscribe (Show unsubscribe), underlined

**Content and behavior**

- Address and Reason on every email (anti-spam law)
- Unsubscribe on marketing and digests; off for security, receipts and invoices, which keep Email preferences
- Social links off on security emails

**Accessibility**

- Social links have accessible names ("Orbitly on LinkedIn")
- foreground/muted on section/muted-background 4.5:1 or more

| Property | Type | Default |
|---|---|---|
| Show social | boolean | true |
| Address | text | Acme SRL, Strada Exemplu 12, 010101 Bucharest, Romania |
| Reason | text | You are receiving this email because you have an Acme account. |
| Show preferences | boolean | true |
| Show unsubscribe | boolean | true |

Icons: brand/github, brand/linkedin, brand/x, brand/youtube

Tokens and styles:
- Colors: `foreground/muted`
- Spacing and size: `spacing/10`, `spacing/4`, `spacing/8`
- Text styles: `body/small`

Code: `Section` (textAlign center) with `Row` of `Link` + `Img` social icons (20 px), `Text` address, `Text` reason, `Link` preferences, `Link` unsubscribe (Also send the `List-Unsubscribe` and `List-Unsubscribe-Post` headers for marketing mail)
