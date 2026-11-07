import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { AccessRow, InviteRow, ShareLinkRow } from './sharing';

const meta = {
  title: 'Components/Sharing/Access Row',
  component: AccessRow,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'The parts of a share dialog: Invite Row (emails, role, Invite) at the top, Access Rows (owner, you, then A-Z; editable role, owner text, pending invites) and the Share Link Row (who can open the link, Copy link) at the bottom. Role changes save at once with a toast; public access asks for confirmation the first time. Figma: Sharing page / Access Row, Invite Row, Share Link Row. Guide: eggux build-ui/patterns/sharing-and-invites.md' } },
  },
  args: { name: 'Maria Ilie' },
  render: function Render() {
    const [invited, setInvited] = React.useState<string[]>([]);
    return (
      <div className="flex w-[480px] flex-col gap-4">
        <InviteRow onInvite={emails => setInvited(i => [...i, ...emails])} />
        <ul aria-label="People with access" className="m-0 flex flex-col p-0">
          <AccessRow name="Maria Ilie" detail="maria@acme.com" initials="MI" type="owner" />
          <AccessRow name="Dan Cristea" detail="dan@acme.com" initials="DC" role="edit" />
          <AccessRow name="laura.b@northwind.com" detail="Invited 2 days ago" initials="LB" type="pending" role="view" />
          {invited.map(e => <AccessRow key={e} name={e} detail="Invited just now" type="pending" role="view" initials={e.slice(0, 2).toUpperCase()} />)}
        </ul>
        <ShareLinkRow url="https://acme.app/d/42" />
      </div>
    );
  },
} satisfies Meta<typeof AccessRow>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma: rows 52 high, owner as text, roles named per person, pending with Invited; invite adds rows.
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const rows = canvasElement.querySelectorAll('[data-slot="access-row"]');
    await expect(Math.round(box(rows[0]!).height)).toBe(52);
    await expect(canvas.getByText('Owner')).toBeInTheDocument();
    await expect(canvas.getByRole('combobox', { name: 'Role for Dan Cristea' })).toHaveTextContent('Can edit');
    await expect(canvas.getByText('Invited')).toBeInTheDocument();
    const invite = canvas.getByRole('button', { name: 'Invite' });
    await expect(invite).toBeDisabled();
    await userEvent.type(canvas.getByRole('textbox', { name: 'People to invite' }), 'ana@acme.com, radu@acme.com');
    await userEvent.click(invite);
    await expect(canvas.getByText('ana@acme.com')).toBeInTheDocument();
    await expect(canvas.getByText('radu@acme.com')).toBeInTheDocument();
  },
};

// Share Link Row: restricted (lock) and anyone (globe on success); Copy link says Copied.
export const ShareLink: Story = {
  render: () => (
    <div className="flex w-[480px] flex-col">
      <ShareLinkRow url="https://acme.app/d/42" onCopy={fn()} />
      <ShareLinkRow url="https://acme.app/d/42" access="anyone" />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const row = canvasElement.querySelector('[data-slot="share-link-row"]')!;
    await expect(Math.round(box(row).height)).toBe(52);
    await expect(canvas.getByText('Anyone on the internet with the link can view')).toBeInTheDocument();
    const [copy] = canvas.getAllByRole('button', { name: 'Copy link' });
    await userEvent.click(copy!);
    await waitFor(() => expect(canvas.getAllByRole('status')[0]).toHaveTextContent('Link copied'));
    await expect(canvas.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
  },
};

// Stress: at 320 long names and emails truncate; the role keeps 132. Tests only.
export const Stress: Story = {
  tags: ['!dev'],
  render: () => (
    <ul className="m-0 w-[320px] p-0">
      <AccessRow name="Alexandra-Maria Constantinescu-Ionescu" detail="alexandra.constantinescu@acme-enterprise.com" initials="AC" />
    </ul>
  ),
  play: async ({ canvas }) => {
    const name = canvas.getByTitle(/Alexandra-Maria/);
    await expect(name.scrollWidth).toBeGreaterThan(name.clientWidth);
    await expect(Math.round(box(canvas.getByRole('combobox')).width)).toBe(132);
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
