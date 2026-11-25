---
feature: "Forgot password"
slug: "forgot-password"
status: in design        # draft → ready → in design → in review → ready for dev → built → verified
figma: ""
created: "2026-11-25"
updated: "2026-11-25"
group: "Account"
---

# Forgot password

The spec. Scenarios and edge cases are in `scenarios.md`, flows in `workflows.md`, decisions and
new input in `decisions.md`, the developer handoff in `handoff.md`. Change any of them with
`/eggux:update-feature`.

## Summary
A shopper who forgot their password gets a reset link by email, sets a new password on their
phone and lands signed in where they were, often in the middle of checkout. Support agents can
send the same email from the customer's account. Now, because loyal customers rarely sign in on
a new device and abandon checkout at the password step.

## Goal
- Actor goal: get back into the account in under 2 minutes, from a phone, without calling support.
- Business goal: fewer abandoned checkouts at sign in; fewer "I can't sign in" support tickets.
- Success metric: share of started resets that end signed in (target: open question 3); support tickets tagged "password" per week.

## Actors and access
| Actor | Can see | Can do | Notes |
|---|---|---|---|
| Shopper, Loyal customer | Forgot password, Check email, Set new password | Request a link, set a new password | Not signed in |
| Support agent | Customer account page (admin) | Send reset email | Never sees or sets a password; action is logged with their name |

## Data
| Object | Attributes shown | Attributes entered | Rules |
|---|---|---|---|
| Customer account | email (masked on Check email: a••••@gmail.com) | email, new password | Password: at least 8 characters, no other composition rules (pattern default) |
| Reset link | expiry ("valid for 30 minutes") | none | Single use, 30 minutes (FD-02); requesting a new link invalidates older ones (FD-05) |
| Session | none | none | All sessions except the new one end after a reset (FD-04) |

## States
| State | What the user sees | Figma frame |
|---|---|---|
| Empty / first use | Forgot password with the email from Sign in already filled | States / Empty |
| Loading | Button spinner "Sending…", "Saving…"; fields stay editable until submit | States / Loading |
| Error | Inline field errors; one Alert for server or network errors | States / Error |
| No access | n/a (public screens) | |
| Offline | Alert "You're offline. Check your connection and try again.", input kept | States / Offline |
| Large data | n/a | |

## Feedback, notifications, audit
| Action | Feedback | Notified | Logged |
|---|---|---|---|
| Request link | Check email screen | Reset email (only if an account exists) | request (user id if any, IP) |
| Resend | Toast "Email sent again", countdown restarts | Reset email | request |
| Set new password | Lands signed in, toast "Password changed" | "Password changed" email (always) | password changed, sessions ended |
| Agent sends reset | Toast "Reset email sent to a••••@gmail.com" | Reset email | agent, customer, time |

## Screens
| Screen | Used in | Shell | Blocks and components | Figma frames | Status |
|---|---|---|---|---|---|
| Forgot password | S-01, S-03, E-01, E-03, E-05 | Page Shell / Auth | Block / Forgot Password; Field, Input (email), Button, Back Link, Alert | S-01 / 1 Forgot password | draft |
| Check email | S-01, E-01, E-03 | Page Shell / Auth | Block / Check Email; Button (resend), text countdown, Back Link, Toast | S-01 / 2 Check email | draft |
| Set new password | S-01, S-02, E-04 | Page Shell / Auth | Block / Reset Password; Field, Input Group (new-password with a Show button), Password Strength, Password Rules (length only), Button | S-01 / 3 Set new password | draft |
| Link expired | E-02 | Page Shell / Auth | Empty State, Button | E-02 / 1 Link expired | draft |
| Reset email | S-01, S-03 | Email | Email Hero, Email Button, Email Callout | S-01 / 4 Reset email | draft |
| Password changed email | S-01 | Email | Email Hero, Email Callout (warning), Email Button | S-01 / 5 Password changed email | draft |
| Admin: customer account | S-03 | Admin shell | Button (outline), Confirm Popover, Toast | S-03 / 1 Customer account | draft |

## Acceptance criteria
Every scenario and edge case in `scenarios.md` is an acceptance criterion. Criteria that are not a scenario:
- Given any email, when "Send reset link" is pressed, then the response time and message are the same whether or not an account exists.
- Given a screen reader, when the Check email screen opens, then focus moves to its heading.
- Given iOS or Android, when the new password field is focused, then the OS can suggest a strong password (`autocomplete="new-password"`).

## Impact on the product
| File or place | Change | Since |
|---|---|---|
| `eggux/workflows.md` | Sign in failure paths point to this feature | 2026-11-25 |
| `eggux/objects.md` | Customer account CTA "send reset email" for Support agent | 2026-11-25 |

## Out of scope
- Reset by SMS or a code instead of a link.
- Changing the password while signed in (Account settings, later feature).
- Passkeys.

## Open questions
| # | Question | Blocks | Asked | Answer |
|---|---|---|---|---|
| 1 | Do we email an address that has no account ("someone asked to reset, but there is no account")? Default: send nothing. | Build (backend) | 2026-11-25 | |
| 2 | Does a successful reset unlock an account locked after failed sign-ins? Default: yes. | Build (backend) | 2026-11-25 | |
| 3 | Target for the success metric (share of resets that end signed in). | Nothing | 2026-11-25 | |

## Changelog
- 2026-11-25 · handoff v2 after a developer read-through: routes and state, security, rate limit per IP, no email in URLs. FD-05 updated.
- 2026-11-25 · created with /eggux:new-feature; answers from the owner: 30-minute link, signed in after reset, other sessions signed out, support can send the email.
