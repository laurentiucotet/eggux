import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { Archive, Pin, Trash2 } from '@/components/icons';
import { SwipeRow } from './swipe-row';

type Args = { actions: number; open: boolean };

const content = (
  <div className="flex items-center justify-between gap-3 px-4 py-3">
    <span className="min-w-0 flex-1">
      <span className="block truncate text-sm leading-5 font-medium">INV-2041 · Website redesign</span>
      <span className="block truncate text-xs leading-4 text-muted-foreground">Orbitly · due 12 Oct 2026</span>
    </span>
    <span className="text-sm leading-5 font-medium">€2,400</span>
  </div>
);

const allActions = [
  { label: 'Pin', icon: <Pin /> },
  { label: 'Archive', icon: <Archive /> },
  { label: 'Delete', icon: <Trash2 />, destructive: true },
];

const meta = {
  title: 'Components/Mobile/Swipe Row',
  decorators: [Story => <div className="w-[390px] max-w-full rounded-lg border border-border"><Story /></div>],
  parameters: {
    docs: {
      description: {
        component:
          'A list row with actions behind it: swipe left to reveal them, right to close. Swiping is a shortcut: the row is focusable, Left arrow reveals the actions and focuses the first, Right arrow or Escape closes, and hidden actions are not in the tab order. The destructive action is red and last. Code only (no Figma component yet).',
      },
    },
  },
  args: { actions: 3, open: false },
  argTypes: {
    actions: { name: 'Actions', control: { type: 'range', min: 1, max: 3, step: 1 }, description: 'How many actions sit behind the row.', table: { category: 'Row' } },
    open: { name: 'Open', control: 'boolean', description: 'Start with the actions revealed.', table: { category: 'Row' } },
  },
  render: ({ actions, open }) => (
    <SwipeRow key={`${actions}-${open}`} label="Invoice INV-2041" defaultOpen={open} actions={allActions.slice(3 - actions)}>
      {content}
    </SwipeRow>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: () => {
    const onSelect = fn();
    return (
      <SwipeRow label="Invoice INV-2041" actions={[{ label: 'Archive', icon: <Archive />, onSelect }, { label: 'Delete', icon: <Trash2 />, destructive: true }]}>
        {content}
      </SwipeRow>
    );
  },
  play: async ({ canvas }) => {
    const row = canvas.getByRole('group', { name: 'Invoice INV-2041' });
    await expect(row).toHaveAttribute('data-state', 'closed');
    // Hidden actions are out of the tab order.
    await expect(canvas.queryByRole('button', { name: 'Archive' })).toBeNull();
    row.focus();
    await userEvent.keyboard('{ArrowLeft}');
    await waitFor(() => expect(row).toHaveAttribute('data-state', 'open'));
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Archive' })).toHaveFocus());
    await userEvent.keyboard('{Escape}');
    // Escape on a focused action closes only from the row; click an action closes after selecting.
    await userEvent.click(canvas.getByRole('button', { name: 'Archive' }));
    await waitFor(() => expect(row).toHaveAttribute('data-state', 'closed'));
  },
};

export const SwipeCheck: Story = {
  tags: ['!dev'],
  render: () => (
    <SwipeRow label="Invoice INV-2041" actions={allActions.slice(1)}>
      {content}
    </SwipeRow>
  ),
  play: async ({ canvas }) => {
    const row = canvas.getByRole('group', { name: 'Invoice INV-2041' });
    await userEvent.pointer([
      { keys: '[MouseLeft>]', target: row, coords: { clientX: 300, clientY: 20 } },
      { target: row, coords: { clientX: 200, clientY: 20 } },
      { target: row, coords: { clientX: 120, clientY: 20 } },
      { keys: '[/MouseLeft]', target: row, coords: { clientX: 120, clientY: 20 } },
    ]);
    await waitFor(() => expect(row).toHaveAttribute('data-state', 'open'));
    await expect(canvas.getByRole('button', { name: 'Delete' })).toBeVisible();
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <SwipeRow label="Long row" defaultOpen actions={allActions}>
      <div className="px-4 py-3 text-sm leading-5">An invoice title that is far too long to fit in the row next to three actions</div>
    </SwipeRow>
  ),
  play: async ({ canvas }) => {
    const row = canvas.getByRole('group', { name: 'Long row' });
    await expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth + 1);
    await expect(canvas.getByRole('button', { name: 'Delete' })).toBeVisible();
  },
};

export const Open: Story = { args: { open: true } };

export const DefaultDark: Story = { ...Open, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Open, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
