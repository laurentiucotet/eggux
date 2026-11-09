import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { LoginPage, demoLogin } from './login';

const meta = {
  title: 'Pages/Auth/Login',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: { description: { component: `Sign in, desktop split: the form on the left, a brand panel on the right from 1024 px; a phone gets the form alone at full width. One task: the button says "Sign in". Wrong credentials give one message that never says which part is wrong. Try it: ${demoLogin.email} with the password "${demoLogin.password}" signs in; anything else fails. Guide: eggux build-ui/patterns/auth.md` } },
  },
  render: () => <LoginPage />,
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The message after a failed attempt: one alert at the top, the email kept. */
export const WrongCredentials: Story = { render: () => <LoginPage initialError defaultEmail="ana@acme.com" /> };

/* Hidden checks */

export const FlowCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('heading', { level: 1, name: 'Sign in' })).toBeVisible();
    await expect(c.getAllByRole('main')).toHaveLength(1);
    // Empty form: both fields say what is missing.
    await userEvent.click(c.getByRole('button', { name: 'Sign in' }));
    await expect(await c.findByText('Enter your email address.')).toBeVisible();
    await expect(c.getByText('Enter your password.')).toBeVisible();
    // Show and hide the password.
    const password = c.getByLabelText(/^Password/);
    await expect(password).toHaveAttribute('type', 'password');
    await userEvent.click(c.getByRole('button', { name: 'Show password' }));
    await expect(password).toHaveAttribute('type', 'text');
    // Wrong credentials: one alert, no hint about which part.
    await userEvent.type(c.getByLabelText(/^Email/), 'ana@acme.com');
    await userEvent.type(password, 'nope');
    await userEvent.click(c.getByRole('button', { name: 'Sign in' }));
    await expect(await c.findByRole('alert')).toHaveTextContent('Email or password is incorrect');
    // The demo account signs in.
    await userEvent.clear(password);
    await userEvent.type(password, demoLogin.password);
    await userEvent.click(c.getByRole('button', { name: 'Sign in' }));
    await waitFor(() => expect(c.getByText('You are signed in')).toBeVisible());
  },
};
export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultBackOffice: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
export const WrongCredentialsDark: Story = { ...WrongCredentials, tags: ['!dev'], globals: { theme: 'Dark' } };
