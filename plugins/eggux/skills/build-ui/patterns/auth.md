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
