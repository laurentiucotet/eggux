import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test';
import { ScopeChipList, type Scope } from './scope-chip-list';

type Args = { count: number; readOnly: boolean; width: number; label: string };

const scopes: Scope[] = [
  { id: 'profile', name: 'profile.read', description: 'Read your name, photo and work email.', risk: 'low' },
  { id: 'contacts', name: 'contacts.read', description: 'Read the people in your address book.', risk: 'low' },
  { id: 'calendar', name: 'calendar.write', description: 'Create, move and delete events on your calendars.', risk: 'medium' },
  { id: 'files', name: 'files.write', description: 'Create and change any file you can open, including shared files.', risk: 'medium' },
  { id: 'mail', name: 'mail.send', description: 'Send email as you, to anyone, without asking each time.', risk: 'high' },
  { id: 'admin', name: 'admin.users', description: 'Add, suspend and delete people in the whole workspace.', risk: 'high' },
];

const meta = {
  title: 'Components/Access/Scope Chip List',
  parameters: {
    docs: {
      description: {
        component:
          'The permissions an app asks for (OAuth-style scopes) as removable chips. Risk is written in text (Low, Medium, High risk) and Medium and High add an icon, so it is never color alone. Hover or focus a chip to read what it allows. Removing keeps focus in the list and is announced. Read-only drops the remove buttons. Code only (no Figma component yet).',
      },
    },
  },
  args: { count: 6, readOnly: false, width: 480, label: 'Permissions requested by Acme Sync' },
  argTypes: {
    count: { name: 'Scopes', control: { type: 'range', min: 0, max: 6, step: 1 }, description: 'How many scopes the app asks for; 0 shows the empty text.', table: { category: 'Scope Chip List' } },
    readOnly: { name: 'Read-only', control: 'boolean', description: 'No remove buttons.', table: { category: 'Scope Chip List' } },
    width: { name: 'Width', control: { type: 'range', min: 240, max: 640, step: 4 }, description: 'Container width in px; chips wrap.', table: { category: 'Scope Chip List' } },
    label: { name: 'List label', control: 'text', description: 'Accessible name of the list.', table: { category: 'Scope Chip List' } },
  },
  render: ({ count, readOnly, width, label }) => (
    <div style={{ width }}>
      <ScopeChipList key={count} label={label} scopes={scopes.slice(0, count)} readOnly={readOnly} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-[480px]">
      <ScopeChipList label="Permissions requested by Acme Sync" scopes={scopes} onRemove={fn()} />
    </div>
  ),
  play: async ({ canvas }) => {
    const list = canvas.getByRole('list', { name: 'Permissions requested by Acme Sync' });
    await expect(list.querySelectorAll('li')).toHaveLength(6);
    // Risk is in text, and the name of the chip button includes it.
    const mail = canvas.getByRole('button', { name: 'mail.send, high risk' });
    await expect(mail).toHaveTextContent('High risk');
    await expect(mail.querySelector('svg')).not.toBeNull();
    await expect(canvas.getByRole('button', { name: 'profile.read, low risk' }).querySelector('svg')).toBeNull();
    // Focus shows the description.
    mail.focus();
    const tip = await screen.findByRole('tooltip');
    await expect(tip).toHaveTextContent('Send email as you');
    // Remove: the chip goes, focus lands on the next chip's remove, the change is announced.
    const remove = canvas.getByRole('button', { name: 'Remove contacts.read' });
    await userEvent.click(remove);
    await waitFor(() => expect(canvas.queryByRole('button', { name: 'contacts.read, low risk' })).toBeNull());
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Remove calendar.write' })).toHaveFocus());
    await expect(canvas.getByText('Removed contacts.read')).toBeInTheDocument();
  },
};

/** Read-only: the same chips with no remove buttons, for a consent screen. */
export const ReadOnly: Story = { args: { readOnly: true, count: 4, label: 'This app will be able to' } };

export const ReadOnlyCheck: Story = {
  ...ReadOnly,
  tags: ['!dev'],
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button', { name: /^Remove/ })).toBeNull();
    await expect(canvas.getAllByRole('button')).toHaveLength(4);
  },
};

export const EmptyCheck: Story = {
  ...Default,
  tags: ['!dev'],
  args: { count: 1 },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Remove profile.read' }));
    await waitFor(() => expect(canvas.getByText('No permissions requested.')).toBeVisible());
    await expect(canvas.queryByRole('list')).toBeNull();
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <ScopeChipList
      scopes={[
        { id: 'long', name: 'organization.regional-accounts-payable.invoices.approve-and-release-payment', description: 'Approve supplier invoices above the regional limit and release the payment.', risk: 'high' },
        ...scopes,
      ]}
    />
  ),
  play: async ({ canvas }) => {
    const root = canvas.getByRole('list').closest('[data-slot="scope-chip-list"]') as HTMLElement;
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + 1);
    for (const li of canvas.getAllByRole('listitem')) {
      await expect(li.getBoundingClientRect().width).toBeLessThanOrEqual(276);
      await expect(li.getBoundingClientRect().height).toBeLessThanOrEqual(32);
    }
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
