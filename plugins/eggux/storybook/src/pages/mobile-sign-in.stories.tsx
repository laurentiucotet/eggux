import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { MobileSignInPage, demoMobileLogin } from './mobile-sign-in';
import { phoneGlobals, phoneStory } from './mobile-parts';

const meta = {
  title: 'Pages/Mobile/Mobile Sign In',
  parameters: {
    ...phoneStory,
    docs: { description: { component: `Sign in on a phone: the Mobile Header (brand), email and password with a Show toggle, Face ID as the secondary way in, then the providers. Try it: ${demoMobileLogin.email} with "${demoMobileLogin.password}" works, anything else fails with one message. Opens at the 375 px viewport.` } },
  },
  globals: phoneGlobals,
  render: () => <MobileSignInPage />,
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** After a wrong email or password: one message, nothing says which. */
export const WrongPassword: Story = { render: () => <MobileSignInPage initialError defaultEmail="ana@acme.com" /> };

/* Hidden checks */

export const FlowCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('heading', { level: 1, name: 'Sign in' })).toBeVisible();
    await userEvent.click(c.getByRole('button', { name: 'Sign in' }));
    await expect(await c.findByText('Enter your email address.')).toBeVisible();
    await expect(await c.findByText('Enter your password.')).toBeVisible();
    await userEvent.type(c.getByRole('textbox', { name: /Email/ }), demoMobileLogin.email);
    const password = c.getByLabelText(/Password/);
    await expect(password).toHaveAttribute('type', 'password');
    await userEvent.type(password, 'wrong');
    await userEvent.click(c.getByRole('button', { name: 'Show password' }));
    await waitFor(() => expect(password).toHaveAttribute('type', 'text'));
    await userEvent.click(c.getByRole('button', { name: 'Sign in' }));
    await expect(await c.findByText('Email or password is incorrect')).toBeVisible();
    await userEvent.clear(password);
    await userEvent.type(password, demoMobileLogin.password);
    await userEvent.click(c.getByRole('button', { name: 'Sign in' }));
    await waitFor(() => expect(c.getByText('You are signed in')).toBeVisible());
  },
};
export const FaceIdCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('link', { name: 'Forgot password?' })).toBeVisible();
    await expect(c.getByRole('button', { name: 'Continue with GitHub' })).toBeVisible();
    await userEvent.click(c.getByRole('button', { name: 'Sign in with Face ID' }));
    await waitFor(() => expect(c.getByText('You are signed in')).toBeVisible());
  },
};
export const DefaultDark: Story = { tags: ['!dev'], globals: { ...phoneGlobals, theme: 'Dark' } };
export const DefaultBackOffice: Story = { tags: ['!dev'], globals: { ...phoneGlobals, theme: 'Corporate Light' } };
export const WrongPasswordDark: Story = { ...WrongPassword, tags: ['!dev'], globals: { ...phoneGlobals, theme: 'Dark' } };
