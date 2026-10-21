# Cookie Consent

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Cookie Consent](#cookie-consent) | 3 | - |

On the Figma page: "Example / banner on marketing site", "Example / card in app", "Example / card on mobile", "Example / preferences over app", "Stress test / Cookie Consent"

## Cookie Consent

Component set · 3 variants · default size 1440 × 101

Consent for non-essential cookies (GDPR, ePrivacy). Banner: full width at the bottom of a marketing site; card: bottom-left corner of an app. Accept all and Reject all have equal weight and sit side by side; Customize opens the preferences dialog. Necessary cookies are always on and say so. Nothing non-essential loads before consent. Remember the choice; link "Cookie settings" in the footer to reopen. Never block the page or pre-tick optional categories.

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
