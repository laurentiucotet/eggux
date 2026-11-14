import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { AcceptInvite, CheckEmail, ForgotPassword, ResetPassword, SignIn, SignInSplit, SignUp, SignUpSplit, TwoFactor } from './form-auth-blocks';

const meta = {
  title: 'Blocks/Forms/Auth',
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'The auth cards of the Forms page (384 wide) and the desktop split screens around them. One task per card, the button names it. Fields are checked when people leave them and on submit; the first wrong field takes focus. Wrong credentials are one alert at the top. Reset never tells whether an account exists. Figma: BLOCKS / Forms, Block / Sign In ... Block / Sign Up Split. Guides: eggux build-ui/patterns/auth.md, form-validation.md' } },
  },
} satisfies Meta;
export default meta;

const Stage = ({ children }: { children: ReactNode }) => <div className="flex min-h-[640px] items-start justify-center bg-background p-10 max-sm:p-0">{children}</div>;
const cat = (c: string) => ({ table: { category: c } });

type SignInArgs = { title: string; description: string; showError: boolean; error: string; providerLabel: string; showProvider: boolean };
export const SignInStory: StoryObj<SignInArgs> = {
  name: 'Sign In',
  args: { title: 'Sign in', description: 'Use your work account.', showError: false, error: 'Email or password is incorrect', providerLabel: 'Continue with Google', showProvider: true },
  argTypes: {
    title: { name: 'Title', control: 'text', description: 'Also the button label.', ...cat('Content') },
    description: { name: 'Description', control: 'text', ...cat('Content') },
    showError: { name: 'Show wrong credentials', control: 'boolean', description: 'The alert after a failed attempt.', ...cat('State') },
    error: { name: 'Error', control: 'text', ...cat('State') },
    showProvider: { name: 'Show provider', control: 'boolean', ...cat('Parts') },
    providerLabel: { name: 'Provider label', control: 'text', ...cat('Parts') },
  },
  render: a => <Stage><SignIn title={a.title} description={a.description} error={a.showError ? a.error : undefined} providerLabel={a.showProvider ? a.providerLabel : null} /></Stage>,
};

type CardArgs = { title: string; description: string };
const cardArgTypes = {
  title: { name: 'Title', control: 'text' as const, ...cat('Content') },
  description: { name: 'Description', control: 'text' as const, ...cat('Content') },
};

export const SignUpStory: StoryObj<CardArgs> = {
  name: 'Sign Up',
  args: { title: 'Create your account', description: 'Free for 14 days. No card needed.' },
  argTypes: cardArgTypes,
  render: a => <Stage><SignUp title={a.title} description={a.description} /></Stage>,
};

export const ForgotPasswordStory: StoryObj<CardArgs> = {
  name: 'Forgot Password',
  args: { title: 'Reset your password', description: 'Enter the email of your account and we will send you a reset link.' },
  argTypes: cardArgTypes,
  render: a => <Stage><ForgotPassword title={a.title} description={a.description} /></Stage>,
};

type CheckArgs = { email: string; expiresIn: string; resendAfter: number };
export const CheckEmailStory: StoryObj<CheckArgs> = {
  name: 'Check Email',
  args: { email: 'ana@example.com', expiresIn: '30 minutes', resendAfter: 45 },
  argTypes: {
    email: { name: 'Email', control: 'text', ...cat('Content') },
    expiresIn: { name: 'Link lifetime', control: 'text', ...cat('Content') },
    resendAfter: { name: 'Resend after (s)', control: { type: 'range', min: 0, max: 120 }, ...cat('Behavior') },
  },
  render: a => <Stage><CheckEmail key={a.resendAfter} email={a.email} expiresIn={a.expiresIn} resendAfter={a.resendAfter} /></Stage>,
};

export const ResetPasswordStory: StoryObj<CardArgs> = {
  name: 'Reset Password',
  args: { title: 'Set a new password', description: 'Use at least 8 characters. You will be signed in on this device.' },
  argTypes: cardArgTypes,
  render: a => <Stage><ResetPassword title={a.title} description={a.description} /></Stage>,
};

export const TwoFactorStory: StoryObj<CardArgs & { wrong: boolean }> = {
  name: 'Two-Factor',
  args: { title: 'Two-step verification', description: 'Enter the 6-digit code from your authenticator app.', wrong: false },
  argTypes: { ...cardArgTypes, wrong: { name: 'Wrong code', control: 'boolean', description: 'The message after a wrong code.', ...cat('State') } },
  render: a => <Stage><TwoFactor key={String(a.wrong)} title={a.title} description={a.description} defaultError={a.wrong} /></Stage>,
};

type InviteArgs = { workspace: string; inviter: string; role: string; email: string; expired: boolean };
export const AcceptInviteStory: StoryObj<InviteArgs> = {
  name: 'Accept Invite',
  args: { workspace: 'Northwind Studio', inviter: 'Maria Ilie', role: 'Editor', email: 'ana@example.com', expired: false },
  argTypes: {
    workspace: { name: 'Workspace', control: 'text', ...cat('Content') },
    inviter: { name: 'Invited by', control: 'text', ...cat('Content') },
    role: { name: 'Role', control: 'text', ...cat('Content') },
    email: { name: 'Email', control: 'text', ...cat('Content') },
    expired: { name: 'Expired', control: 'boolean', ...cat('State') },
  },
  render: a => <Stage><AcceptInvite workspace={a.workspace} inviter={a.inviter} role={a.role} email={a.email} expired={a.expired} /></Stage>,
};

export const SignInSplitStory: StoryObj<{ quote: string }> = {
  name: 'Sign In Split',
  args: { quote: '“We moved every client project into one workspace and cut our month-end invoicing from three days to one afternoon.”' },
  argTypes: { quote: { name: 'Quote', control: 'text', ...cat('Content') } },
  render: a => <SignInSplit quote={a.quote} />,
};

export const SignUpSplitStory: StoryObj<{ title: string; description: string }> = {
  name: 'Sign Up Split',
  args: { title: 'Everything your team needs to deliver client work', description: 'Plan projects, track hours and send invoices from one workspace. Set up takes about five minutes.' },
  argTypes: cardArgTypes,
  render: a => <SignUpSplit title={a.title} description={a.description} />,
};

/* Hidden checks */

const box = (el: Element) => el.getBoundingClientRect();
const described = (el: HTMLElement, text: string) => expect(el).toHaveAccessibleDescription(expect.stringContaining(text));

const onSignIn = fn();
export const SignInCheck: StoryObj = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <Stage><SignIn onSubmit={onSignIn} /></Stage>,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    const email = c.getByRole('textbox', { name: /^Email/ });
    const password = c.getByLabelText(/^Password/);
    // Submit empty: both messages, aria-invalid with the message as description, focus on the first.
    await userEvent.click(c.getByRole('button', { name: 'Sign in' }));
    await waitFor(() => expect(email).toHaveFocus());
    await expect(email).toHaveAttribute('aria-invalid', 'true');
    await described(email, 'Enter your email address.');
    await described(password, 'Enter your password.');
    await expect(onSignIn).not.toHaveBeenCalled();
    // The message changes as people fix it, and clears once valid.
    await userEvent.type(email, 'ana@');
    await described(email, 'Enter an email address like name@company.com.');
    await userEvent.type(email, 'example.com');
    await waitFor(() => expect(email).not.toHaveAttribute('aria-invalid'));
    // Show / hide password.
    await expect(password).toHaveAttribute('type', 'password');
    await userEvent.click(c.getByRole('button', { name: 'Show password' }));
    await expect(password).toHaveAttribute('type', 'text');
    await expect(c.getByRole('button', { name: 'Hide password' })).toHaveAttribute('aria-pressed', 'true');
    await userEvent.type(password, 'correct horse');
    await userEvent.click(c.getByRole('button', { name: 'Sign in' }));
    await expect(onSignIn).toHaveBeenCalledWith({ email: 'ana@example.com', password: 'correct horse' });
    await expect(c.getByRole('link', { name: 'Forgot password?' })).toHaveAttribute('href', '#forgot-password');
    await expect(c.getByRole('button', { name: 'Continue with Google' })).toBeVisible();
  },
};

// On blur: a field people typed in and left is checked; an untouched one is not.
export const BlurCheck: StoryObj = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <Stage><SignUp /></Stage>,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const name = c.getByRole('textbox', { name: /^Full name/ });
    const email = c.getByRole('textbox', { name: /^Email/ });
    await userEvent.click(name);
    await userEvent.tab();
    await expect(name).not.toHaveAttribute('aria-invalid');
    await userEvent.type(email, 'ana');
    await userEvent.tab();
    await waitFor(() => expect(email).toHaveAttribute('aria-invalid', 'true'));
    await described(email, 'Enter an email address like name@company.com.');
  },
};

const onSignUp = fn();
export const SignUpCheck: StoryObj = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <Stage><SignUp onSubmit={onSignUp} /></Stage>,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole('button', { name: 'Create account' }));
    const name = c.getByRole('textbox', { name: /^Full name/ });
    await waitFor(() => expect(name).toHaveFocus());
    const terms = c.getByRole('checkbox', { name: /I agree to the/ });
    await expect(terms).toHaveAttribute('aria-invalid', 'true');
    await described(terms, 'Accept the terms to create an account.');
    const password = c.getByLabelText(/^New password/);
    await described(password, 'Enter a password.');
    // Password Strength asks only for length and describes the input.
    await userEvent.type(password, 'short');
    await described(password, 'Use at least 8 characters.');
    await described(password, 'Weak: make it longer.');
    await userEvent.type(password, ' but longer now');
    await waitFor(() => expect(password).not.toHaveAttribute('aria-invalid'));
    await described(password, 'Strong');
    await userEvent.type(name, 'Ana Popescu');
    await userEvent.type(c.getByRole('textbox', { name: /^Email/ }), 'ana@example.com');
    await userEvent.click(terms);
    await userEvent.click(c.getByRole('button', { name: 'Create account' }));
    await expect(onSignUp).toHaveBeenCalledWith({ name: 'Ana Popescu', email: 'ana@example.com', password: 'short but longer now', terms: true });
  },
};

export const ForgotCheck: StoryObj = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <Stage><ForgotPassword /></Stage>,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole('button', { name: 'Send reset link' }));
    const email = c.getByRole('textbox', { name: /^Email/ });
    await waitFor(() => expect(email).toHaveFocus());
    await described(email, 'Enter your email address.');
    await userEvent.type(email, 'nobody@example.com');
    await userEvent.click(c.getByRole('button', { name: 'Send reset link' }));
    // Same card turns into Check Email, with the same text for any address.
    await expect(await c.findByRole('heading', { level: 1, name: 'Check your email' })).toBeVisible();
    await expect(c.getByText(/We sent a reset link to/)).toHaveTextContent('nobody@example.com');
    await expect(c.getByRole('link', { name: 'Back to sign in' })).toBeVisible();
  },
};

const onResend = fn();
export const CheckEmailCheck: StoryObj = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <Stage><div className="flex flex-col gap-6"><CheckEmail resendAfter={45} titleAs="h2" /><CheckEmail email="dan@example.com" resendAfter={1} onResend={onResend} titleAs="h2" /></div></Stage>,
  play: async ({ canvasElement }) => {
    const [first, second] = canvasElement.querySelectorAll<HTMLElement>('[data-slot=auth-card]');
    await expect(first.querySelector('[data-slot=resend]')).toHaveTextContent("Didn't get it? Check spam or resend in 0:45.");
    await expect(first.querySelector('[data-slot=icon-tile]')).toHaveAttribute('aria-hidden', 'true');
    const resend = await within(second).findByRole('button', { name: 'resend the link' }, { timeout: 3000 });
    await userEvent.click(resend);
    await expect(onResend).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(second.querySelector('[data-slot=resend]')).toHaveTextContent('resend in 0:01'));
  },
};

const onReset = fn();
export const ResetCheck: StoryObj = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <Stage><ResetPassword onSubmit={onReset} /></Stage>,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const password = c.getByLabelText(/^New password/);
    const confirm = c.getByLabelText(/^Confirm password/);
    await userEvent.type(password, 'a long new password');
    await userEvent.type(confirm, 'a long new pass');
    await userEvent.click(c.getByRole('button', { name: 'Update password' }));
    await waitFor(() => expect(confirm).toHaveFocus());
    await described(confirm, 'The passwords do not match.');
    await userEvent.type(confirm, 'word');
    await waitFor(() => expect(confirm).not.toHaveAttribute('aria-invalid'));
    await userEvent.click(c.getByRole('button', { name: 'Update password' }));
    await expect(onReset).toHaveBeenCalledWith({ password: 'a long new password' });
  },
};

const onVerify = fn((code: string) => code === '123456');
export const TwoFactorCheck: StoryObj = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <Stage><TwoFactor onVerify={onVerify} /></Stage>,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const code = c.getByRole('textbox', { name: '6-digit code' });
    await expect(code).toHaveAttribute('autocomplete', 'one-time-code');
    await userEvent.click(c.getByRole('button', { name: 'Verify' }));
    await waitFor(() => expect(code).toHaveFocus());
    await expect(code).toHaveAttribute('aria-invalid', 'true');
    await described(code, 'Enter the 6-digit code.');
    // The last digit submits: a wrong code says so, typing again clears it.
    await userEvent.type(code, '111111');
    await expect(onVerify).toHaveBeenLastCalledWith('111111', false);
    await waitFor(() => described(code, 'That code is not right.'));
    await userEvent.clear(code);
    await waitFor(() => expect(code).not.toHaveAttribute('aria-invalid'));
    await userEvent.click(c.getByRole('checkbox', { name: 'Trust this device for 30 days' }));
    await userEvent.type(code, '123456');
    await expect(onVerify).toHaveBeenLastCalledWith('123456', true);
    await expect(code).not.toHaveAttribute('aria-invalid');
    await expect(c.getByRole('link', { name: 'Use a recovery code instead' })).toBeVisible();
  },
};

const onAccept = fn();
export const AcceptInviteCheck: StoryObj = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <Stage><div className="flex flex-col gap-6"><AcceptInvite onSubmit={onAccept} /><AcceptInvite expired titleAs="h2" /></div></Stage>,
  play: async ({ canvasElement }) => {
    const [live, expired] = canvasElement.querySelectorAll<HTMLElement>('[data-slot=auth-card]');
    const c = within(live);
    await expect(c.getByRole('heading', { level: 1, name: 'Join Northwind Studio' })).toBeVisible();
    await expect(c.getByText('Maria Ilie invited you to the workspace as Editor.')).toBeVisible();
    const email = c.getByRole('textbox', { name: /^Email/ });
    await expect(email).toHaveAttribute('readonly');
    await expect(email).toHaveValue('ana@example.com');
    await userEvent.click(c.getByRole('button', { name: 'Accept invitation' }));
    await waitFor(() => expect(c.getByRole('textbox', { name: /^Full name/ })).toHaveFocus());
    await userEvent.type(c.getByRole('textbox', { name: /^Full name/ }), 'Ana Popescu');
    await userEvent.type(c.getByLabelText(/^Create a password/), 'eight chars');
    await userEvent.click(c.getByRole('button', { name: 'Accept invitation' }));
    await expect(onAccept).toHaveBeenCalledWith({ name: 'Ana Popescu', password: 'eight chars' });
    const e = within(expired);
    await expect(e.getByText('This invitation has expired')).toBeVisible();
    await expect(e.getByRole('button', { name: 'Ask for a new invite' })).toBeVisible();
    await expect(e.queryByRole('button', { name: 'Accept invitation' })).toBeNull();
  },
};

// Every card at 1440, 768 and 390: 384 wide (the width at 390), 24 padding, 16 between fields, no overflow, one h1, every control named.
export const CardsLayoutCheck: StoryObj = {
  tags: ['!dev'],
  parameters: { controls: { disable: true }, a11y: { config: { rules: [{ id: 'page-has-heading-one', enabled: false }, { id: 'landmark-unique', enabled: false }] } } },
  render: () => (
    <div className="flex flex-col gap-8 bg-background">
      {[1440, 768, 390].map(w => (
        <div key={w} data-width={w} style={{ width: w }} className="flex flex-wrap items-start justify-center gap-6">
          <SignIn titleAs="h2" /><SignUp titleAs="h2" /><ResetPassword titleAs="h2" /><TwoFactor titleAs="h2" />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const w of [1440, 768, 390]) {
      const frame = canvasElement.querySelector<HTMLElement>(`[data-width="${w}"]`)!;
      await expect(frame.scrollWidth).toBeLessThanOrEqual(w);
      for (const card of frame.querySelectorAll<HTMLElement>('[data-slot=auth-card]')) {
        await expect(Math.round(box(card).width)).toBe(384);
        await expect(card.scrollWidth).toBeLessThanOrEqual(Math.ceil(box(card).width));
        for (const el of card.querySelectorAll('a, button')) await expect(el).toHaveAccessibleName();
      }
    }
    const card = canvasElement.querySelector<HTMLElement>('[data-width="1440"] [data-slot=auth-card]')!;
    const title = card.querySelector('[data-slot=card-title]')!;
    await expect(Math.round(box(title).top - box(card).top)).toBe(25);
    await expect(Math.round(box(title).height)).toBe(28);
    const fields = card.querySelectorAll('[data-slot=field]');
    await expect(Math.round(box(fields[1]).top - box(fields[0]).bottom)).toBe(16);
    await expect(Math.round(box(fields[0]).left - box(card).left)).toBe(25);
    await expect(Math.round(box(card.querySelector('button[type=submit]')!).height)).toBe(36);
  },
};

// Split screens: 752 / 688 (sign in) and 696 / 744 (sign up) at 1440, the brand panel gone at 768 and 390, one h1, no overflow.
export const SplitLayoutCheck: StoryObj = {
  tags: ['!dev'],
  parameters: { controls: { disable: true }, a11y: { config: { rules: [{ id: 'landmark-unique', enabled: false }, { id: 'landmark-no-duplicate-main', enabled: false }, { id: 'landmark-no-duplicate-banner', enabled: false }, { id: 'landmark-no-duplicate-contentinfo', enabled: false }, { id: 'landmark-banner-is-top-level', enabled: false }, { id: 'landmark-main-is-top-level', enabled: false }, { id: 'landmark-contentinfo-is-top-level', enabled: false }, { id: 'landmark-complementary-is-top-level', enabled: false }] } } },
  render: () => (
    <div className="flex flex-col gap-8">
      {[1440, 768, 390].map(w => (
        <div key={w} data-width={w} style={{ width: w }}>
          <SignInSplit />
          <SignUpSplit />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const wide = canvasElement.querySelector<HTMLElement>('[data-width="1440"]')!;
    const signIn = wide.querySelector<HTMLElement>('[data-slot=sign-in-split]')!;
    const signUp = wide.querySelector<HTMLElement>('[data-slot=sign-up-split]')!;
    const panel = (el: HTMLElement) => el.querySelector<HTMLElement>('[data-slot=split-form-panel]')!;
    {
      await expect(Math.round(box(panel(signIn)).width)).toBe(752);
      await expect(Math.round(box(panel(signUp)).width)).toBe(696);
      await expect(Math.round(box(signIn).height)).toBeGreaterThanOrEqual(900);
      const card = signIn.querySelector('[data-slot=auth-card]')!;
      await expect(Math.round(box(card).left - box(signIn).left)).toBe(184);
      await expect(within(signIn).getByRole('complementary')).toBeVisible();
      await expect(signUp.querySelectorAll('[data-slot=logo-tile]')).toHaveLength(6);
      await expect(within(signUp).getAllByRole('heading', { level: 2 })[0]).toHaveTextContent('Everything your team needs');
    }
    for (const w of [1440, 768, 390]) {
      const frame = canvasElement.querySelector<HTMLElement>(`[data-width="${w}"]`)!;
      await expect(frame.scrollWidth).toBeLessThanOrEqual(w);
      for (const split of frame.querySelectorAll<HTMLElement>('[data-slot=sign-in-split], [data-slot=sign-up-split]')) {
        await expect(within(split).getAllByRole('heading', { level: 1 })).toHaveLength(1);
        await expect(within(split).getByRole('main')).toBeVisible();
        for (const el of split.querySelectorAll('a, button')) await expect(el).toHaveAccessibleName();
      }
    }
  },
};

export const SignInDark: StoryObj<SignInArgs> = { ...SignInStory, name: 'Sign In Dark', tags: ['!dev'], globals: { theme: 'Dark' } };
export const SignInBackOffice: StoryObj<SignInArgs> = { ...SignInStory, name: 'Sign In Back office', tags: ['!dev'], globals: { theme: 'Corporate Light' } };
export const SignUpSplitDark: StoryObj<{ title: string; description: string }> = { ...SignUpSplitStory, name: 'Sign Up Split Dark', tags: ['!dev'], globals: { theme: 'Dark' } };
