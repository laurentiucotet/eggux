# Pattern: monetization (paywalls, upgrades and subscriptions)

**Problem:** paywalls and upgrade prompts hide the price or the renewal, block people before they
see any value, stack several upsells on one screen and make cancelling harder than subscribing.
People feel tricked, churn, complain to the app stores and stop trusting the product.
**Heuristic:** visibility of system status, user control and freedom, error prevention, match
between system and the real world (prices and dates in plain words).

Components on the Pricing page (COMPONENTS): Lock Badge, Gate Overlay, Usage Limit Banner, Trial
Banner, Upsell Card, Plan Option Row, Meter Banner, Paywall Card, next to Plan Card, Price,
Comparison Table and Check Item. Blocks: Feature Gate, Usage Limit Reached, Manage Subscription,
Cancel Subscription and Upgrade Success (App page, family "Monetization"), Article Paywall
(Content page, family "Paywalls"), Mobile Paywall (Hero page, family "Mobile"). Existing blocks
they work with: the Pricing family, Upgrade Dialog, Plan Checkout, Plan and Usage, Plan Select
Step, Billing and Invoice Detail. Starting screens: SCREENS / Billing and SCREENS / Paywalls.

## Which wall
| Situation | Wall | Build with |
|---|---|---|
| News or blog with a number of free reads per month | Metered | `Meter Banner` remaining, then last, then `Block / Article Paywall` Type=metered |
| Free content in exchange for an account (newsletter, saved articles) | Registration | `Block / Article Paywall` Type=registration: email or Google only, no card |
| Content only for subscribers (premium analysis, courses, reports) | Hard | `Block / Article Paywall` Type=hard; headline, lead and preview stay public |
| A feature that is part of a higher plan | Feature gate | `Lock Badge` in navigation, `Block / Feature Gate` (Gate Overlay over the real content), then Upgrade Dialog and Plan Checkout |
| A quota (AI credits, projects, seats, storage) | Usage limit | `Usage Limit Banner` at 80% and 100%; `Block / Usage Limit Reached` when an action is blocked |
| Try the paid plan for a set time | Trial | `Trial Banner` (active, ending, ended) above the shell; Trial ending email |
| Suggest a higher plan without blocking anything | Upsell | `Upsell Card` in the sidebar footer or an empty state |
| Consumer mobile app (onboarding or a premium feature) | Mobile paywall | `Block / Mobile Paywall` Style=list or comparison |

Pick the softest wall that works: a metered or registration wall before a hard one, an upsell
before a gate. One wall per moment, and the rest of the screen keeps working.

## Honesty rules
- Price, billing period, renewal and what happens after a trial are stated next to the main
  action: "Free for 7 days, then €9.99 per month. Cancel anytime in Settings." No hidden fees;
  say whether VAT is included.
- Put the price, the period, renewal and where to cancel in the fine print right under the main
  action ("Yearly €49.99 per year or monthly €6.49 per month. Renews automatically until you
  cancel. Cancel anytime in Account settings.").
- The billed price is bigger than any per-week or per-month equivalent; the equivalent is a
  caption.
- Show what is locked and why before people pay: the feature name with the plan, a preview of
  the content, a blurred result. Never a dead button or a blank page.
- Keep a way out: close, "Not now", "Maybe later" or "Continue with the free plan". Only a true
  hard paywall has no other way in, and it still has Sign in.
- Declines are plain words. Guilt-trip declines ("No thanks, I don't like saving money", "No
  thanks, I don't like reading") are forbidden.
- Cancel is as easy as subscribe: at most one retention step (one offer of a pause or a
  discount), then a clear Cancel subscription button.
- Countdowns and offer end dates are real and never reset (`marketing-pages.md`).
- One upsell surface per screen (Upsell Card, Gate Overlay or a banner), never stacked. Hide
  upsells from people without billing rights and show "Ask your admin" with who that is
  (`permissions-and-access.md`).
- Pricing page, paywalls, checkout and emails show the same prices, periods and trial terms.
- Contrast and focus as everywhere: 4.5:1 text, the primary action visible without scrolling,
  Esc and close on every overlay, focus moves into the wall card and back.

## Content walls
- Metered: `Meter Banner` pinned to the bottom while free reads are left (remaining, then last,
  dismissible), then `Block / Article Paywall` Type=metered. Registration: email or Google only,
  no card. Hard: subscriber-only content only.
- Show the headline, lead, author and two paragraphs before any wall; fade the text into the
  surface, never blur the headline.
- Keep Sign in on every wall; keep Dismiss on the meter bar; only a hard paywall has no other way
  in.
- Plan choice: `Plan Option Row`s, the better deal first and selected with its saving.
- After subscribing, return to the same article, scrolled to where the wall was, with a success
  toast. A registration wall confirms where the sign-in link went.

## In-app gates and limits
- Show what is locked before people click: `Lock Badge` (plan name) after the item name in menus,
  tabs and settings; the item stays clickable and opens the upgrade path.
- On a locked feature, show the real content under `Gate Overlay` (blur for charts and results,
  fade for long lists and documents) with the benefit, Upgrade, See plans and the price note; the
  rest of the screen keeps working.
- Metered limits: `Usage Limit Banner` approaching at 80% (dismissible, numbers and reset date),
  reached at 100%; when an action is blocked, `Block / Usage Limit Reached` offers upgrade, a
  one-time add-on and waiting until the reset date.
- Upgrade goes through `Block / Upgrade Dialog` (limit in numbers, current and recommended Plan
  Card, Maybe later) and `Block / Plan Checkout` (the Total and the pay button show the same
  amount).
- After paying, `Block / Upgrade Success` returns people to the feature that triggered the
  upgrade; no upsell on that screen.

## Trials
- `Trial Banner` above the shell: active (days left), ending at 3 days (what happens on the end
  date and the price), ended. Only the ended state has no close.
- The trial ending email goes out 3 days before the end with the same date and price
  (`Screen / Email / Trial ending`, `email.md`).
- A trial that needs a card says so before the card form and reminds before the first charge.
- After the trial the workspace is read-only, export works and nothing is deleted.

## Manage and cancel
- `Block / Manage Subscription` shows the plan and status, renewal date and amount, payment
  method, invoices and a visible Cancel subscription, next to Change plan and Pause subscription.
- Cancel is as easy as subscribe: `Block / Cancel Subscription` reason (optional), one offer
  (pause 1 to 3 months or 50% off for 3 months), confirm with what is lost and the end date, done
  with Reactivate. Never a guilt-trip or hidden decline.
- Continue to cancel sits next to the offer button at the same size; on the confirm step Keep
  subscription is the secondary action and Cancel subscription the destructive one.
- After cancelling, the plan stays active until the end of the paid period; say the date and
  that no further charges follow.
- Downgrades say what will be lost before confirming (`common-flows.md` § Change plan and pay).

## Mobile app paywalls
- `Block / Mobile Paywall`: close top left, "Start 7-day free trial" plus "Free for 7 days, then
  €59.99 per year" under it, Restore purchases, Terms and Privacy always on screen, prices and
  renewal text from the store.
- After purchase confirm what started and when it renews (Purchase success screen); restoring
  shows what was found in a Drawer, or that nothing was found with a link to support.
- Prices come from the store in the user's currency; never hard-code them. Follow the store's
  rules for renewal text and the subscription management link.
- On a phone the plan list is `Plan Option Row`s (Style=list) or a Free vs Pro table
  (Style=comparison); the primary button stays above the home indicator.

## States and edge cases
| State | UI |
|---|---|
| Trial ended | Trial Banner State=ended, an info Alert "Your workspace is read-only" with Choose a plan and Export data; create actions disabled with the reason; nothing deleted |
| Payment failed | Destructive Alert banner on every screen with the amount, the date of the next retry and Update payment method; features keep working until the grace period ends, and that date is stated; `Screen / Email / Payment failed` |
| Subscription cancelled, period not over | Manage Subscription shows "Cancels on 14 Mar 2027" and Reactivate subscription |
| Reactivate | One click, no new checkout when the payment method is valid; Toast success "Subscription reactivated" with the next charge date |
| Add-on bought | Toast success with the amount charged and a receipt link; the blocked action continues where it stopped |
| Usage reset | Every banner, meter and limit dialog states the reset date ("Resets on 1 Dec 2026"); waiting until then is an option with no charge |
| Already subscribed | No walls or upsells for that plan; a subscriber who is signed out sees Sign in on the wall |
| No billing rights | No upgrade buttons; the gate says which plan unlocks it and offers "Ask your admin" |

## Figma
- `Lock Badge` Size=default or sm, Tone=neutral in navigation and lists, brand on upgrade
  surfaces. In a Sidebar Item, wrap the item in a frame and place the badge on the right, as on
  SCREENS / Billing.
- `Gate Overlay` Style=blur or fade: put the real content in the Preview slot and resize the
  instance over it (min 320 x 320).
- `Usage Limit Banner` (plan limits in the app) and `Meter Banner` (free reads on a content site)
  are different things: use the first for quotas people pay for, the second for metered articles.
- `Upsell Card` is a small sidebar or empty-state nudge with one benefit and the price; tips and
  announcements stay on `Callout Card`.
- `Paywall Card` Type matches the `Block / Article Paywall` Type; `Plan Option Row` for plans in
  mobile and in-app paywalls, `Plan Card` on pricing pages.
- Starting screens: SCREENS / Billing (Feature gate to upgrade, Usage limit, Trial, Manage and
  cancel) and SCREENS / Paywalls (Metered article, Registration wall, Hard paywall, Mobile app
  paywall).

## Related
settings-and-admin.md (Billing, Plan and Usage), permissions-and-access.md (plan gates and no
billing rights), marketing-pages.md (pricing pages), content-and-docs.md (paid articles),
mobile.md (app paywalls), email.md (trial ending, payment failed), commerce.md (checkout and
prices), common-flows.md (change plan and pay), writing.md.
