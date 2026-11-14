import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { ForgotPasswordPage } from './forgot-password';

const meta = {
  title: 'Pages/Auth/Forgot password',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: { description: { component: 'Reset by email in two steps inside the same card, so the page does not jump. The second step says the same thing for any address: it never reveals whether an account exists, says how long the link lasts and always offers a way back to sign in. Guide: eggux build-ui/patterns/auth.md' } },
  },
  render: () => <ForgotPasswordPage />,
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The step after "Send reset link". */
export const CheckEmail: Story = { render: () => <ForgotPasswordPage initialStep="sent" defaultEmail="ana@acme.com" /> };

/* Hidden checks */

export const FlowCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('heading', { level: 1, name: 'Forgot your password?' })).toBeVisible();
    await userEvent.click(c.getByRole('button', { name: 'Send reset link' }));
    await expect(await c.findByText('Enter your email address.')).toBeVisible();
    await userEvent.type(c.getByLabelText(/^Email/), 'nobody@acme.com');
    await userEvent.click(c.getByRole('button', { name: 'Send reset link' }));
    // Same message whether or not the account exists.
    await expect(await c.findByRole('heading', { level: 1, name: 'Check your email' })).toBeVisible();
    await expect(c.getByText(/If there is an account for/)).toBeVisible();
    // The resend button counts down before it opens.
    await expect(c.getByRole('button', { name: /^Resend link in 0:\d\d$/ })).toBeDisabled();
    await userEvent.click(c.getByRole('button', { name: 'Use a different email' }));
    await expect(await c.findByRole('button', { name: 'Send reset link' })).toBeVisible();
  },
};
export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultBackOffice: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
export const CheckEmailDark: Story = { ...CheckEmail, tags: ['!dev'], globals: { theme: 'Dark' } };
