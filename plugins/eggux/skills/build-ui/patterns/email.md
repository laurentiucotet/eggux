# Transactional and lifecycle email

**Problem:** emails are designed like web pages, break in mail clients, bury the action, or teach people to click
links they did not expect.
**Heuristic:** match between system and the real world, recognition rather than recall, error prevention.

Components on the Email page (`Email / *`); templates to copy on the Emails page (`Screen / Email / *`, SCREENS group).
Code: React Email (`@react-email/components`), see references/code-mapping.md, section Email.

## Anatomy
- 600 px column, single column, on a muted canvas (`section/muted-background`); the body is a `background/card`
  panel with radius/lg, 40 px side padding, 40 px top and bottom, 24 px between parts.
- Order: Email / Header (logo, optional View in browser), Body (Hero, then content parts, the Button), Email / Footer
  (address, reason, preferences, unsubscribe).
- Text: body/default 16 for running text, heading/h2 for the one title, h4 for section headings; no text in images.

## Which email uses what
| Email | Parts | Notes |
|---|---|---|
| Welcome | Hero (image), Content (3 steps), Button, Content (help) | Name the workspace; one next step |
| Verify email | Hero, Code, Button, Content (fallback URL) | Code in the subject; says how long it is valid |
| Sign-in link (magic link) | Hero, Button, Content (URL), Details (time, browser, location), Callout | Works once, expires in 15 minutes |
| Password reset | Hero, Button, Content (URL), Callout "Did not ask for a reset?" | Same email whether or not the account exists |
| Password changed, new sign-in | Hero, Details (time, device, location, IP), Callout warning, Button "Secure your account" | Always sent, cannot be turned off |
| Invitation | Hero (who invited you to what), Details (workspace, role, invited by), Button, Content (expiry) | Email address fixed from the invite |
| Invoice | Hero (amount, due date), Details, Line Items + totals, Button "Pay invoice", Content (PDF, billing settings) | Amount and due date also in the subject |
| Payment receipt | Hero, Details (amount, date, method, receipt number), Line Items, Button "Download receipt" | No action required: say so |
| Payment failed | Hero, Details (amount, card, reason), Callout warning (retry dates, consequence), Button "Update payment method" | Calm, no blame; data is safe |
| Trial ending | Hero (days left, date), Stats (what they did), Content (what happens next), Button "Choose a plan" | Say what happens without a plan |
| Weekly summary, newsletter | Header with View in browser, Hero with eyebrow (period), Stats, Button, Divider, feature (Hero with image), Articles, Footer with unsubscribe | Opt-in; unsubscribe in one click |
| Order confirmation | Hero (order number, ship time), Details (order, delivery), Line Items with photos, Button "View your order", Content (changes, returns) | Store logo and address |

## Rules
- One primary action per email: one Email / Button, verb + object, the same words as the page it opens. Other
  actions are text links.
- The subject, the preview text (preheader, 40 to 90 characters) and the Hero title say the same thing.
- Links that sign in, verify or reset expire: say when ("expires in 60 minutes"), work once, and put the plain URL
  under the button.
- Security: never send passwords; say what happened, when, from which device and approximate location; add a "not
  you?" callout with the fix; never reveal whether an address has an account.
- Facts as Email / Details rows (amount, dates, numbers), money as Email / Line Items with right-aligned amounts and
  the currency symbol; dates in full for legal facts, times with the time zone.
- Footer on every email: company postal address and why the reader gets it. Unsubscribe on marketing and digests
  (plus the List-Unsubscribe header); security, receipts and invoices keep Email preferences but no unsubscribe.
- Plain sender name ("Orbitly"), a reply-to that a person reads; no "noreply" in the visible text.
- Images: hosted PNG or JPG at 2x with alt text, never the only carrier of meaning; the email must read with images
  off. Logos as PNG (SVG fails in Gmail and Outlook).
- Writing: plain and calm (writing.md), sentence case, no exclamation marks, no "click here".

## Mail client constraints
- Tables and inline styles (React Email does this); no CSS variables, flex, grid or position, and no web font you
  rely on (fallback stack: Plus Jakarta Sans, Helvetica, Arial, sans-serif).
- Buttons are padded links (bulletproof), not images or form buttons.
- Width 600, images at most 520 inside the body; under 480 px, stats and article rows stack.
- Dark mode: use a logo that works on both or send light and dark versions; some clients invert colors, so avoid
  images with transparent edges on pure white. Test in Gmail (web, iOS, Android), Apple Mail and Outlook.

## Accessibility
- `lang` on the html element, a meaningful `<title>`, one h1 (the Hero title), headings in order.
- Body text 16 px, contrast 4.5:1 or more (foreground/muted is the lightest allowed, small print only).
- Layout tables carry `role="presentation"`; links are underlined and say where they go; the button is at least
  44 px tall.
- The code in Email / Code is text, read as one string.

## Related
auth.md (flows behind the auth emails), notifications.md (which events send email), settings-and-admin.md (Billing,
Notification Preferences), commerce.md (order flow), sharing-and-invites.md, writing.md.
