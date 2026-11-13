import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { ShareAccessList, type ShareEntry } from './share-access-list';

type Args = { count: number; showLink: boolean; linkOn: boolean; readOnly: boolean; width: number };

const people: ShareEntry[] = [
  { id: 'maria', name: 'Maria Ilie', detail: 'maria@acme.example', owner: true, initials: 'MI' },
  { id: 'dan', name: 'Dan Popescu', detail: 'dan@acme.example', level: 'editor', initials: 'DP' },
  { id: 'finance', name: 'Finance team', detail: '12 members', type: 'group', level: 'commenter' },
  { id: 'ana', name: 'Ana Rusu', detail: 'ana@partner.example', level: 'viewer', initials: 'AR' },
  { id: 'paul', name: 'Paul Enache', detail: 'paul@acme.example', level: 'viewer', initials: 'PE' },
];

const meta = {
  title: 'Components/Access/Share Access List',
  parameters: {
    docs: {
      description: {
        component:
          'Who can open something: people and groups with an Access Level Select and a Remove button each, then an "Anyone with the link" row with a switch. The owner row is locked (text and a lock, no select, no remove) and always first. Removing is announced and moves focus to the next row. The owner level is not offered to anyone else. Code only (no Figma component yet).',
      },
    },
  },
  args: { count: 5, showLink: true, linkOn: false, readOnly: false, width: 480 },
  argTypes: {
    count: { name: 'People', control: { type: 'range', min: 1, max: 5, step: 1 }, description: 'Rows in the list, the owner included.', table: { category: 'Share Access List' } },
    readOnly: { name: 'Read-only', control: 'boolean', description: 'Nothing can change: no Remove, selects and switch locked.', table: { category: 'Share Access List' } },
    width: { name: 'Width', control: { type: 'range', min: 240, max: 640, step: 4 }, description: 'List width in px; rows wrap under about 400.', table: { category: 'Share Access List' } },
    showLink: { name: 'Show link row', control: 'boolean', description: 'The "Anyone with the link" row.', table: { category: 'Parts' } },
    linkOn: { name: 'Link on', control: 'boolean', description: 'Start with link access turned on.', table: { category: 'Parts' } },
  },
  render: ({ count, showLink, linkOn, readOnly, width }) => (
    <div style={{ width }}>
      <ShareAccessList
        key={`${count}-${showLink}-${linkOn}`}
        label="People with access to Q3 plan"
        people={people.slice(0, count)}
        link={showLink ? { enabled: linkOn, level: 'viewer' } : undefined}
        readOnly={readOnly}
      />
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
      <ShareAccessList
        label="People with access to Q3 plan"
        people={people}
        link={{ enabled: false, level: 'viewer' }}
        onRemove={fn()}
        onLevelChange={fn()}
      />
    </div>
  ),
  play: async ({ canvas }) => {
    const list = canvas.getByRole('list', { name: 'People with access to Q3 plan' });
    const rows = within(list).getAllByRole('listitem');
    await expect(rows).toHaveLength(6);
    // Owner first and locked: no select, no remove.
    await expect(rows[0]).toHaveTextContent('Maria Ilie');
    await expect(rows[0]).toHaveTextContent('Owner');
    await expect(within(rows[0]).queryByRole('combobox')).toBeNull();
    await expect(within(rows[0]).queryByRole('button')).toBeNull();
    // Change a level.
    const dan = canvas.getByRole('combobox', { name: 'Access for Dan Popescu' });
    await expect(dan).toHaveTextContent('Editor');
    await userEvent.click(dan);
    const options = await screen.findByRole('listbox');
    await expect(within(options).getByRole('option', { name: /Owner/ })).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(within(options).getByRole('option', { name: /Viewer/ }));
    await waitFor(() => expect(dan).toHaveTextContent('Viewer'));
    // The link: off shows no level, on shows it.
    await expect(canvas.queryByRole('combobox', { name: 'Access for anyone with the link' })).toBeNull();
    const toggle = canvas.getByRole('switch', { name: 'Anyone with the link' });
    await userEvent.click(toggle);
    await waitFor(() => expect(canvas.getByRole('combobox', { name: 'Access for anyone with the link' })).toBeVisible());
    await expect(toggle).toBeChecked();
    await expect(canvas.getByRole('status')).toHaveTextContent('Link access turned on');
  },
};

export const RemoveCheck: Story = {
  ...DefaultCheck,
  play: async ({ canvas }) => {
    const remove = canvas.getByRole('button', { name: 'Remove Dan Popescu' });
    remove.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.queryByText('Dan Popescu')).toBeNull());
    await expect(canvas.getByRole('status')).toHaveTextContent('Removed Dan Popescu');
    // Focus moves to the next row's select.
    await waitFor(() => expect(canvas.getByRole('combobox', { name: 'Access for Finance team' })).toHaveFocus());
  },
};

/** The link is on: anyone with it gets the level you choose. */
export const LinkOn: Story = { args: { linkOn: true, count: 3 } };

/** Nothing can change; the list is only for looking. */
export const ReadOnly: Story = { args: { readOnly: true, linkOn: true, count: 4 } };

export const ReadOnlyCheck: Story = {
  ...ReadOnly,
  tags: ['!dev'],
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button', { name: /Remove/ })).toBeNull();
    await expect(canvas.getByRole('switch', { name: 'Anyone with the link' })).toBeDisabled();
    const dan = canvas.getByRole('combobox', { name: 'Access for Dan Popescu' });
    await userEvent.click(dan);
    await expect(screen.queryByRole('listbox')).toBeNull();
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <ShareAccessList
      people={[
        { id: 'o', name: 'Alexandra-Maria Constantinescu-Vasilescu', detail: 'alexandra.constantinescu.vasilescu@acme-europe-group.example', owner: true },
        { id: 'g', name: 'Regional accounts payable approvers for the Acme Europe group', detail: '12,480 members', type: 'group', level: 'editor' },
      ]}
      link={{ enabled: true, level: 'viewer' }}
    />
  ),
  play: async ({ canvas }) => {
    const root = canvas.getByRole('list').closest('[data-slot="share-access-list"]') as HTMLElement;
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + 1);
    for (const row of canvas.getAllByRole('listitem')) {
      await expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth + 1);
    }
    await expect(canvas.getByRole('button', { name: /^Remove Regional/ })).toBeVisible();
    await expect(canvas.getByRole('combobox', { name: /^Access for Regional/ })).toBeVisible();
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
