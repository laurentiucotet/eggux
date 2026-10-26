# Authentication flows

Blocks on the Forms page: Sign In, Sign Up, Forgot Password, Check Email, Reset Password,
Two-Factor, Accept Invite. Shell: `Page Shell / Auth`.

## Rules
- One task per screen; the primary button names it ("Send reset link", "Verify").
- Never reveal whether an account exists: same message after "Send reset link" for any email.
- Links expire (say how long); offer resend after a countdown; always a way back to sign in.
- Passwords: new-password preset with strength meter, "Show" toggle, paste allowed, no
  composition rules beyond length; confirm field only on reset.
- Two-factor: Input OTP with `autocomplete="one-time-code"`, auto-submit on the last digit,
  recovery code alternative, "trust this device" opt-in.
- Invites: show who invited, to what and with which role; email fixed from the invite; expired
  invite → explain and offer "Ask for a new invite".
- After success: sign the user in, land where they were going, confirm with a toast.
- Errors inline under the field (`form-validation.md`); rate-limit messages say when to retry.
- Every auth email (verify, sign-in link, reset, password changed) starts from its template on the
  Emails page: one button, the code or link lifetime, a fallback URL and a "not you?" callout
  (email.md).
- Desktop sign in and sign up use `Block / Sign In Split` or `Block / Sign Up Split`; put the next
  step's card (code, check email) in the same Form slot so the page does not jump. Other steps use
  `Page Shell / Auth`.
- Wrong credentials: one destructive Alert at the top of the card ("Email or password is incorrect")
  with the lockout rule, input kept, never a per-field message that tells which one is wrong.
- On mobile the auth card loses its border and fills the width (24 px margins); entry screens show
  the logo in the Mobile Header, later steps a back button and the flow name.
- Complete flows to copy: SCREENS / Auth (Sign in in Light and Dark, Sign up, Magic link, Password
  reset, Two-factor, Accept invite, Onboarding), desktop and mobile.

## Related components
- Show password rules as a `Requirement List` of `Check Item`s under the new-password field: each
  item turns Mark=check as people type, nothing turns x before a submit. `Password Strength`
  sits under the same field.
- Identity providers use `Button` outline, full width, with the provider mark as the leading icon
  (example "sign-in providers" on the Button page): stacked, same order everywhere, the enforced
  provider first; "Continue with SSO" asks for the work email.
