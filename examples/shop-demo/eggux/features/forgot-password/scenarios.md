---
feature: "Forgot password"
updated: "2026-11-25"
---

# Scenarios and edge cases: Forgot password

Statuses: draft → in design → in review → ready for dev → built → verified; removed.

## Scenarios

### S-01 · Shopper resets the password from checkout
- Actor: Loyal customer
- Flow: F-01, steps 1-7
- Given: a loyal customer at checkout who does not remember the password
- When: they tap "Forgot password?", send the link, open the email on the same phone and set a new password
- Then: they land signed in on the checkout step they left, with a toast "Password changed"; every other device is signed out; a "Password changed" email arrives
- Screens: S-01 / 1 Forgot password, S-01 / 2 Check email, S-01 / 3 Set new password, S-01 / 4 Reset email, S-01 / 5 Password changed email
- Status: draft

### S-02 · Link opened on another device
- Actor: Shopper
- Flow: F-01, steps 5-7
- Given: the reset was requested on a laptop and the email is opened on a phone
- When: they set a new password on the phone
- Then: the phone is signed in and goes to the account home (there is no "where they were" on this device); the laptop session, if any, is signed out
- Screens: S-01 / 3 Set new password
- Status: draft

### S-03 · Support agent sends a reset email
- Actor: Support agent
- Flow: F-02
- Given: an agent on a customer's account page, after the customer asked for help
- When: they press "Send password reset email" and confirm
- Then: the customer gets the same reset email; the agent sees a toast with the masked email; the audit log records agent, customer and time
- Screens: S-03 / 1 Customer account
- Status: draft

## Edge cases

### E-01 · Email with no account
- Condition: the email typed has no account (or has a typo)
- Given: an email with no account
- When: "Send reset link" is pressed
- Then: the same Check email screen and copy as for an existing account; no email is sent (open question 1)
- Screens: S-01 / 2 Check email
- Status: draft

### E-02 · Expired or already used link
- Condition: more than 30 minutes passed, the link was used, or a newer link was requested
- Given: a reset link that is no longer valid
- When: it is opened
- Then: "This link has expired" with "Send a new link" (opens Forgot password with an empty field: the email is unknown) and "Back to sign in"
- Screens: E-02 / 1 Link expired
- Status: draft

### E-03 · Email does not arrive
- Condition: the shopper waits and nothing comes
- Given: the Check email screen
- When: 60 seconds pass
- Then: "Resend email" becomes available (countdown before that); over the limit (5 per hour per address, 20 per hour per IP), the button is replaced, the same way for any email, by "Too many attempts. Try again in an hour or contact support."
- Screens: S-01 / 2 Check email
- Status: draft

### E-04 · New password not accepted
- Condition: shorter than 8 characters, or the same as the current one
- Given: the Set new password screen
- When: "Save password" is pressed with an invalid password
- Then: one field error ("Use at least 8 characters" or "Choose a password you haven't used here before"), input kept, focus on the field
- Screens: S-01 / 3 Set new password
- Status: draft

### E-05 · Offline or server error
- Condition: no connection or a 5xx on send or save
- Given: any of the three screens
- When: the request fails
- Then: one Alert at the top ("You're offline…" or "Something went wrong on our side. Try again."), input kept, button enabled again
- Screens: S-01 / 1 Forgot password, S-01 / 3 Set new password
- Status: draft
