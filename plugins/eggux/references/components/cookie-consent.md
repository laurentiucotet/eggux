# Cookie Consent

Generated from the EGG UI master library on 2026-10-22 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Cookie Consent](#cookie-consent) | 3 | - |

On the Figma page: "Example / banner on marketing site", "Example / card in app", "Example / card on mobile", "Example / preferences over app", "Stress test / Cookie Consent"

## Cookie Consent

Component set · 3 variants · default size 1440 × 101

Consent for non-essential cookies (GDPR, ePrivacy). Banner: full width at the bottom of a marketing site; card: bottom-left corner of an app. Accept all and Reject all have equal weight and sit side by side; Customize opens the preferences dialog. Necessary cookies are always on and say so. Nothing non-essential loads before consent. Remember the choice; link "Cookie settings" in the footer to reopen. Never block the page or pre-tick optional categories.

**Use for**

- Any site or app that sets analytics, advertising or tracking cookies
- Banner at the bottom of a marketing site
- Card in the bottom-left corner of an app
- Preferences dialog from Customize or the footer link "Cookie settings"

**Not for**

- Only necessary cookies: no banner, list them in the cookie policy
- Terms or privacy policy acceptance: use a Checkbox in the sign-up form
- Product announcements: use Alert or Announcement Banner

**Anatomy**

1. Title
2. Body: what the cookies do, in one or two sentences
3. Cookie policy link
4. Reject all and Accept all, same weight, side by side
5. Customize (opens preferences)
6. Preferences: categories with a description and a Switch; Necessary always on
7. Save choices

**Content and behavior**

- Nothing non-essential loads before consent
- Reject is as easy as Accept: same button style, same step
- Optional categories start off; never pre-tick
- Never block the page or hide content behind the banner
- Remember the choice; reopen from "Cookie settings" in the footer
- Body under ~200 characters; long text belongs in the cookie policy
- Legal review per country; record the decision in decisions.md

**Accessibility**

- Banner and card are a region labelled by the title, not a modal: the page stays usable
- Preferences is a modal Dialog: focus moves in, Esc closes, focus returns to the trigger
- Each Switch has a visible label (category name) and its description as aria-describedby
- Necessary switch is disabled and says "Always on" in text
- Tab order: body link, Reject all, Accept all, Customize

| Variant property | Values |
|---|---|
| Type | banner, card, preferences |

| Property | Type | Default |
|---|---|---|
| Title | text | We use cookies |
| Body | text | We use cookies to keep you signed in and remember your settings. With your consent, we also measure how Acme is used and show relevant ads. |

Built from: `Button`, `Button Icon`, `Switch`

Tokens and styles:
- Colors: `background/card`, `border/default`, `foreground/card`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/10`, `spacing/2`, `spacing/3`, `spacing/4`, `spacing/6`
- Radius: `radius/lg`
- Text styles: `body/small`, `heading/h4`, `ui/label`
- Effects: `shadow/md`

Guides: [marketing-pages](../../skills/build-ui/patterns/marketing-pages.md)

Code: custom banner / card + shadcn `Dialog` with `Switch`es; or a CMP (Cookiebot, Osano) styled to match (Load scripts only after consent)
