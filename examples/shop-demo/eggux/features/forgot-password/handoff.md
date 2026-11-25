---
feature: "Forgot password"
status: draft            # draft → ready for dev → built → verified
version: 2
figma: ""
storybook: "EGG UI Storybook (link set per project)"
updated: "2026-11-25"
---

# Handoff: Forgot password

What a developer needs to build this feature, in one file. Compiled from `feature.md`,
`scenarios.md`, `workflows.md` and `decisions.md` in this folder; those stay the source.

**Why it is still `draft`:** the client has not confirmed open questions Q-012 and Q-013 (backend), and
there are no Figma frames yet (this sample project has no Figma file). Front-end screens, copy,
emails and the admin button can be built now; the two backend rules use the proposed defaults
until the client answers.

## What to build
A shopper who forgot their password requests a reset link by email, sets a new password and
lands signed in where they were (often mid-checkout). Entry: "Forgot password?" on Sign in. A
support agent can send the same email from the admin customer page.

## Done when
- [ ] S-01 · Reset from checkout: after "Save password", signed in on the checkout step they left, toast "Password changed", other devices signed out, "Password changed" email sent.
- [ ] S-02 · Link opened on another device: signed in on that device, lands on account home.
- [ ] S-03 · Support sends reset: same email to the customer, toast with the masked email for the agent, audit entry (agent, customer, time).
- [ ] E-01 · Email with no account: same screen, copy and response time as an existing account; no email sent.
- [ ] E-02 · Expired, used or superseded link: "Link expired" screen with "Send a new link" (opens Forgot password, field empty) and "Back to sign in".
- [ ] E-03 · No email: resend after 60 s; over the limit, resend is replaced by the limit message, shown the same way for any email.
- [ ] E-04 · Invalid new password: one field error after submit, input kept, focus on the field.
- [ ] E-05 · Offline or 5xx: one Alert at the top, input kept, button enabled again.
- [ ] Accessibility: on each screen focus moves to its `h1`; errors are linked to their field (`aria-describedby`) and the Alert uses `role="alert"`; buttons use `size="touch"` (44 px) on mobile.

## Routes and state
| Screen | Route | Gets data from | On refresh |
|---|---|---|---|
| Forgot password | `/forgot-password` | email prefilled from Sign in through in-memory router state, never the URL | empty field |
| Check email | `/forgot-password/sent` | typed email in session state, masked on the client | text without the address: "If there's an account for that email, …" |
| Set new password | `/reset-password#token` (token in the fragment, so it never reaches server logs or the Referer) | token, validated on load | same, while the token is valid |
| Link expired | same route, when the token is invalid | nothing (the email is unknown) | same |
| Admin: customer account | existing admin page, roles `support` and `admin` | customer id | same |

The page that started the reset (the `return` path) is stored server-side with the token, not in the URL.

## Screens and states
Mobile first (390 wide), then desktop in the same auth card (`Page Shell / Auth`, 400 px card).

| Screen | States to build | Figma frame | Components |
|---|---|---|---|
| Forgot password | default, sending, field error, offline/5xx | S-01 / 1 (to design) | Field, Input, Button, Back Link, Alert |
| Check email | waiting (text countdown), resend available, resent (toast), limit reached | S-01 / 2 | Button, Back Link, Toast |
| Set new password | default, typing (rules and strength update), saving, field error, offline/5xx | S-01 / 3 | Field, Input Group with a Show button, Password Rules, Password Strength, Button |
| Link expired | default | E-02 / 1 | Empty State, Button |
| Reset email | one version | S-01 / 4 | Email Hero, Email Button, Email Callout |
| Password changed email | one version | S-01 / 5 | Email Hero, Email Callout, Email Button |
| Admin: customer account | button, confirm, sending, sent toast | S-03 / 1 | Button, Confirm Popover, Toast |

## Components
Props checked against the EGG UI source. Nothing new is needed in the library, with one gap noted below.

| Component | Props | Storybook |
|---|---|---|
| Input | `type="email" autoComplete="email"` | Components/Input/Input |
| Input Group | new password: `<Input type="password" autoComplete="new-password">` with `end` = Button `variant="ghost"` "Show" / "Hide", `aria-pressed` | Components/Input/Input Group |
| Field | `id`, `label`, error text | Components/Input/Field |
| Button | `size="touch"` on mobile, `className="w-full"` on the auth card, `loading` while sending | Components/Button/Button |
| Back Link | "Back to sign in" | Components/Navigation/Back Link |
| Alert | `variant="destructive"` (renders `role="alert"`) | Components/Alert/Alert |
| Password Rules | `value`, `rules={[passwordRules[0]]}` (length only; the default list also requires case, number and symbol, which we do not) | Components/Forms/Password Rules |
| Password Strength | `level={passwordStrength(value, 8)}`, `messageId` used by the input's `aria-describedby` | Components/Input/Password Strength |
| Empty State | Link expired | Components/Empty State |
| Toast | success | Components/Toast |
| Confirm Popover | admin send | Components/Popover/Confirm Popover |
| Email (Hero, Button, Callout) | reset, password changed | Components/Email/Email |

Not used: Countdown Timer (it shows day/hour/minute blocks for events; here the wait is plain text).
Library gap: there is no ready "password with Show toggle" field; build it from Input Group as above. Logged for EGG UI.

## Rules
- Same response (status, body, timing) for any email. The email is sent from a queue, so the request returns at once whether or not an account exists. Auth pattern.
- Reset token: random, stored hashed, single use, valid 30 minutes; a new request invalidates older tokens. FD-02, FD-05.
- Resend after 60 s. Limits: 5 reset emails per hour per address and 20 per hour per IP; the limit message appears the same way whether or not the account exists. FD-05.
- New password: at least 8 characters, no other composition rules; paste allowed; must differ from the current one (compare against the stored hash). Auth pattern.
- Errors show after submit, not while typing; Password Rules only turns its check on as the rule is met.
- After a successful reset: sign the user in, end all other sessions, send "Password changed" (cannot be turned off). FD-03, FD-04.
- Return path: only relative paths that start with `/` and not `//`; otherwise account home. On another device: account home. FD-03.
- Support agents can trigger the email only; they never see or set passwords; every send is logged. FD-06.
- "Sign in", never "Log in". D-001.

## Security
- Reset page sends `Referrer-Policy: no-referrer` and loads no third-party scripts.
- Logs: user id when the account exists; nothing that identifies the typed email when it does not.
- Accounts with two-factor sign-in (none in this shop today) must pass the second factor after the reset, before being signed in.

## Copy
Final unless marked (draft). Voice: informal "you", short, no blame.

| Where | Text |
|---|---|
| Sign in link | Forgot password? |
| Forgot password · title | Reset your password |
| Forgot password · text | Enter the email you use for your account. We'll send you a link to set a new password. |
| Forgot password · button | Send reset link |
| Back link (all screens) | Back to sign in |
| Email field error | Enter an email address like name@example.com |
| Check email · title | Check your email |
| Check email · text | If there's an account for a••••@gmail.com, you'll get a link to reset your password. It works for 30 minutes. |
| Check email · text (after refresh) | If there's an account for that email, you'll get a link to reset your password. It works for 30 minutes. |
| Check email · waiting | You can resend in 42 s |
| Check email · resend button | Resend email |
| Check email · resent toast | Email sent again |
| Check email · limit | Too many attempts. Try again in an hour or contact support. |
| Set new password · title | Set a new password |
| Set new password · label | New password |
| Set new password · show / hide | Show · Hide |
| Set new password · rule | At least 8 characters |
| Set new password · button | Save password |
| Error · too short | Use at least 8 characters |
| Error · same as current | Choose a password you haven't used here before |
| After save · toast | Password changed |
| Link expired · title | This link has expired |
| Link expired · text | Reset links work once and for 30 minutes. Send a new one to continue. |
| Link expired · buttons | Send a new link · Back to sign in |
| Offline alert | You're offline. Check your connection and try again. |
| Server error alert | Something went wrong on our side. Try again. |
| Reset email · subject | Reset your password (draft) |
| Reset email · body | Someone asked to reset the password for your account. Tap the button to choose a new one. The link works once and for 30 minutes. (draft) |
| Reset email · button | Set a new password |
| Reset email · callout | Didn't ask for this? Ignore this email; your password stays the same. |
| Password changed email · subject | Your password was changed (draft) |
| Password changed email · body | Your password was changed on {date} at {time} from {device}, near {city}. We signed you out on your other devices. (draft) |
| Password changed email · callout and button | Wasn't you? Secure your account |
| Admin · button | Send password reset email |
| Admin · confirm | Send a reset link to a••••@gmail.com? |
| Admin · toast | Reset email sent to a••••@gmail.com |

## Feedback, notifications and logging
| Action | User sees | Sent | Logged |
|---|---|---|---|
| Request link | Check email | Reset email (account exists only) | reset requested: user id (if any), IP, time |
| Resend | Toast "Email sent again" | Reset email | reset requested |
| Save password | Signed in, toast "Password changed" | Password changed email | password changed, sessions ended |
| Agent sends reset | Toast with the masked email | Reset email | agent id, customer id, time |

## Analytics
| Event | When | Properties |
|---|---|---|
| `password_reset_requested` | Send reset link or Resend | `source`: `sign_in`, `checkout`, `admin` |
| `password_reset_link_opened` | Valid link opened | `same_device`: true or false |
| `password_reset_link_invalid` | Invalid link opened | `reason`: `expired`, `used`, `superseded` |
| `password_reset_completed` | Password saved | `return_to`: `checkout`, `account`, `other` (any other page) |

## Open questions
| ID | Question | Blocks build | Build meanwhile with |
|---|---|---|---|
| Q-012 | Email an address with no account? | backend only | Send nothing; same message as for a known address |
| Q-013 | Does a successful reset unlock an account locked after failed sign-ins? | backend only | Yes, a successful reset unlocks it |
| Q-014 | Target for "resets that end signed in". | no | |

## Not in this version
Reset by SMS or code; changing the password while signed in; passkeys.

## Changes since the last handoff
- v2 · 2026-11-25 · after a developer read-through: routes and state, Security section, rate limit per IP, Show toggle built from Input Group, plain-text countdown instead of Countdown Timer, token in the URL fragment, analytics values, focus and touch sizes. Removed the flow diagram and the decisions table (they repeated `workflows.md` and Rules).
- v1 · 2026-11-25 · first handoff.
