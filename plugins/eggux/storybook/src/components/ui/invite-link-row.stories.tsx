import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { InviteLinkRow } from './invite-link-row';

type Args = { enabled: boolean; showReset: boolean; width: number; subject: string };

const firstUrl = 'https://acme.example/join/k3f9-q2xw-71ab';
const nextUrl = 'https://acme.example/join/z8m4-p6ty-02cd';

/** Holds the url so Reset link gives the row a new one. */
function Wrapped(props: Partial<React.ComponentProps<typeof InviteLinkRow>>) {
  const [url, setUrl] = React.useState(firstUrl);
  return <InviteLinkRow url={url} onReset={() => setUrl(nextUrl)} {...props} />;
}

const meta = {
  title: 'Components/Access/Invite Link Row',
  parameters: {
    docs: {
      description: {
        component:
          'The link people use to join: a read-only field with Copy, an expiry select, Reset link (asks first: the old link stops working) and a switch that turns the link on or off. Off dims and disables the field, Copy, expiry and Reset. Settings wrap under about 400 px. Code only (no Figma component yet).',
      },
    },
  },
  args: { enabled: true, showReset: true, width: 480, subject: 'the Acme workspace' },
  argTypes: {
    enabled: { name: 'Link enabled', control: 'boolean', description: 'The link works; off disables the row.', table: { category: 'Invite Link Row' } },
    subject: { name: 'Subject', control: 'text', description: 'What the link opens, used in the dialog text.', table: { category: 'Invite Link Row' } },
    width: { name: 'Width', control: { type: 'range', min: 240, max: 640, step: 4 }, description: 'Row width in px.', table: { category: 'Invite Link Row' } },
    showReset: { name: 'Show Reset link', control: 'boolean', description: 'The Reset link action.', table: { category: 'Parts' } },
  },
  render: ({ width, enabled, ...args }) => (
    <div style={{ width }}>
      <Wrapped key={String(enabled)} defaultEnabled={enabled} {...args} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <div className="w-[480px]"><Wrapped /></div>,
  play: async ({ canvas }) => {
    const field = canvas.getByRole('textbox', { name: 'Invite link' });
    await expect(field).toHaveValue(firstUrl);
    await expect(field).toHaveAttribute('readonly');
    await expect(canvas.getByRole('button', { name: 'Copy invite link' })).toBeEnabled();
    // Expiry.
    const expiry = canvas.getByRole('combobox', { name: 'Link expires' });
    await expect(expiry).toHaveTextContent('Never expires');
    await userEvent.click(expiry);
    await userEvent.click(await screen.findByRole('option', { name: 'Expires in 7 days' }));
    await waitFor(() => expect(expiry).toHaveTextContent('Expires in 7 days'));
    // Reset asks first; Cancel changes nothing.
    await userEvent.click(canvas.getByRole('button', { name: 'Reset link' }));
    const dialog = await screen.findByRole('alertdialog');
    await expect(within(dialog).getByText(/will no longer be able to use it/)).toBeVisible();
    await userEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
    await expect(field).toHaveValue(firstUrl);
    // Confirm: new link and a message.
    await userEvent.click(canvas.getByRole('button', { name: 'Reset link' }));
    const second = await screen.findByRole('alertdialog');
    await userEvent.click(within(second).getByRole('button', { name: 'Reset link' }));
    await waitFor(() => expect(field).toHaveValue(nextUrl));
    await waitFor(() => expect(canvas.getByText('Link reset. The old link no longer works.')).toBeInTheDocument());
  },
};

export const DisabledCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <div className="w-[480px]"><Wrapped /></div>,
  play: async ({ canvas }) => {
    const toggle = canvas.getByRole('switch', { name: 'Link enabled' });
    await expect(toggle).toBeChecked();
    await userEvent.click(toggle);
    await waitFor(() => expect(toggle).not.toBeChecked());
    await expect(canvas.getByRole('textbox', { name: 'Invite link' })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Copy invite link' })).toBeDisabled();
    await expect(canvas.getByRole('combobox', { name: 'Link expires' })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Reset link' })).toBeDisabled();
    await userEvent.click(toggle);
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Reset link' })).toBeEnabled());
  },
};

/** The link is off: kept, but nobody can use it. */
export const Off: Story = { args: { enabled: false } };

/** Narrow: the settings wrap under the field. */
export const Narrow: Story = { args: { width: 276 } };

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => <Wrapped url="https://acme-europe-group.example/join/workspace/regional-accounts-payable/k3f9-q2xw-71ab-9c3d-aa01-bb02-cc03" />,
  play: async ({ canvas }) => {
    const root = canvas.getByRole('textbox').closest('[data-slot="invite-link-row"]') as HTMLElement;
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + 1);
    const field = canvas.getByRole('textbox', { name: 'Invite link' });
    await expect(field.getBoundingClientRect().width).toBeLessThanOrEqual(276);
    await expect(canvas.getByRole('button', { name: 'Copy invite link' })).toBeVisible();
    await expect(canvas.getByRole('switch', { name: 'Link enabled' })).toBeVisible();
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
export const OffDark: Story = { ...Off, tags: ['!dev'], globals: { theme: 'Dark' } };
