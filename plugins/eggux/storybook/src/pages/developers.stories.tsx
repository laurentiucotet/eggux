import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { DevelopersPage } from './developers';

const meta = {
  title: 'Pages/App/Developers',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: { description: { component: 'Developers: API keys (masked, with Reveal, Copy and Revoke, which asks first) and a Create key dialog; webhook endpoints with a status, their events, the last delivery and Send test; and the default headers sent with every webhook in a Key Value Editor. All keys shown are fake.' } },
  },
  render: () => <DevelopersPage />,
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The Create key dialog, sent without a name. */
export const CreateKeyError: Story = { render: () => <DevelopersPage createError /> };

/** Two headers share a name: the editor says so and Save refuses. */
export const DuplicateHeaders: Story = { render: () => <DevelopersPage duplicateHeaders /> };

/* Hidden checks */

export const FlowCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const body = within(document.body);
    await expect(c.getByRole('heading', { level: 1, name: 'Developers' })).toBeVisible();
    await expect(c.getAllByRole('group', { name: /Production server|Staging|Accounting export/ })).toHaveLength(3);

    // Create a key: name required.
    await userEvent.click(c.getByRole('button', { name: 'Create key' }));
    const dialog = await body.findByRole('dialog', { name: 'Create API key' });
    await userEvent.click(within(dialog).getByRole('button', { name: 'Create key' }));
    await expect(await within(dialog).findByText(/Give the key a name/)).toBeVisible();
    await userEvent.type(within(dialog).getByLabelText(/^Key name/), 'Mobile app');
    await userEvent.click(within(dialog).getByRole('button', { name: 'Create key' }));
    await waitFor(() => expect(c.getByText('Key “Mobile app” created')).toBeVisible());
    await expect(c.getByRole('group', { name: 'Mobile app' })).toBeVisible();

    // Revoke asks first.
    const staging = c.getByRole('group', { name: 'Staging' });
    await userEvent.click(within(staging).getByRole('button', { name: /^Revoke/ }));
    await userEvent.click(await within(staging).findByRole('button', { name: 'Revoke key' }));
    await waitFor(() => expect(within(c.getByRole('group', { name: 'Staging' })).getByText('Revoked')).toBeVisible());

    // Send test on the working endpoint, and the failing one.
    const ok = c.getByRole('button', { name: /Send test event to https:\/\/hooks\.acme\.example/ });
    await userEvent.click(ok);
    await waitFor(() => expect(c.getByText('Test event sent')).toBeVisible());
    await userEvent.click(c.getByRole('button', { name: /Send test event to https:\/\/erp\.partner\.example/ }));
    await waitFor(() => expect(c.getByText('Test failed')).toBeVisible());

    // Headers: a duplicate name cannot be saved; fix and save.
    await userEvent.click(c.getByRole('button', { name: 'Add header' }));
    await userEvent.type(c.getByRole('textbox', { name: 'Header, row 3' }), 'X-Acme-Source');
    await userEvent.click(c.getByRole('button', { name: 'Save headers' }));
    await expect(await c.findAllByText(/appears more than once/)).not.toHaveLength(0);
    await userEvent.type(c.getByRole('textbox', { name: 'Header, row 3' }), '-2');
    await userEvent.click(c.getByRole('button', { name: 'Save headers' }));
    await waitFor(() => expect(c.getByText('3 default headers saved.')).toBeVisible());
  },
};
export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultBackOffice: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
export const CreateKeyErrorDark: Story = { ...CreateKeyError, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DuplicateHeadersBackOffice: Story = { ...DuplicateHeaders, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
export const PhoneWidth: Story = {
  tags: ['!dev'],
  globals: { viewport: { value: 'base', isRotated: false } },
  play: async ({ canvasElement }) => {
    await expect((await within(canvasElement).findAllByRole('heading', { level: 1, name: 'Developers' })).length).toBeGreaterThan(0);
    await waitFor(() => expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(document.documentElement.clientWidth));
  },
};
