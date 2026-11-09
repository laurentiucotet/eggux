import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { RegisterPage } from './register';

const meta = {
  title: 'Pages/Auth/Register',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: { description: { component: 'Sign up: the least a new account needs (name, work email, password with a strength meter that only asks for length, the terms), then providers. Same split layout as Sign in. Errors sit under each field and the first message tells what to do. Guide: eggux build-ui/patterns/auth.md' } },
  },
  render: () => <RegisterPage />,
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Every field with its message, as after a submit with nothing filled in. */
export const WithErrors: Story = { render: () => <RegisterPage showErrors /> };

/* Hidden checks */

export const FlowCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('heading', { level: 1, name: 'Create your account' })).toBeVisible();
    await userEvent.click(c.getByRole('button', { name: 'Create account' }));
    await expect(await c.findByText('Enter your name.')).toBeVisible();
    await expect(c.getByText('Accept the terms to create an account.')).toBeVisible();
    await userEvent.type(c.getByLabelText(/^Full name/), 'Ana Popescu');
    await userEvent.type(c.getByLabelText(/^Work email/), 'ana@acme.com');
    await userEvent.type(c.getByLabelText(/^Password/), 'correct horse battery');
    await userEvent.click(c.getByRole('checkbox', { name: /I agree to the/ }));
    await userEvent.click(c.getByRole('button', { name: 'Create account' }));
    await waitFor(() => expect(c.getByText('Check your email')).toBeVisible());
  },
};
export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultBackOffice: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
export const WithErrorsDark: Story = { ...WithErrors, tags: ['!dev'], globals: { theme: 'Dark' } };
