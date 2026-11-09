import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { ContactPage } from './contact';

const meta = {
  title: 'Pages/Marketing/Contact',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: { description: { component: 'Contact page: the reply time first, direct channels (sales, support, phone), a short form (name, email, topic, message, consent), the offices with written addresses and a short FAQ that ends with a way to book a demo. Fill the form or send it empty to see the messages. Guide: eggux build-ui/patterns/marketing-pages.md' } },
  },
  render: () => <ContactPage />,
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The form after a submit with nothing filled in. */
export const WithErrors: Story = { render: () => <ContactPage showErrors /> };

/** After sending: the form is replaced by one confirmation. */
export const Sent: Story = { render: () => <ContactPage sent /> };

/* Hidden checks */

export const FlowCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('heading', { level: 1, name: 'Talk to our team' })).toBeVisible();
    await expect(c.getByRole('navigation', { name: 'Main' })).toBeVisible();
    await userEvent.click(c.getByRole('button', { name: 'Send message' }));
    await expect(await c.findByText('Enter your name.')).toBeVisible();
    await expect(c.getByText('Choose a topic.')).toBeVisible();
    await userEvent.type(c.getByLabelText(/^Full name/), 'Ana Popescu');
    await userEvent.type(c.getByLabelText(/^Email/), 'ana@acme.com');
    await userEvent.click(c.getByRole('combobox', { name: /^Topic/ }));
    await userEvent.click(await within(document.body).findByRole('option', { name: 'Support' }));
    await userEvent.type(c.getByLabelText(/^Message/), 'My invoices do not sync with the bank feed.');
    await userEvent.click(c.getByRole('checkbox', { name: /I agree that Acme may contact me/ }));
    await userEvent.click(c.getByRole('button', { name: 'Send message' }));
    await waitFor(() => expect(c.getByText('Message sent')).toBeVisible());
  },
};
export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultBackOffice: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
export const WithErrorsDark: Story = { ...WithErrors, tags: ['!dev'], globals: { theme: 'Dark' } };
