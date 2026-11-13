import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test';
import { Copy, Download, Share2, Trash2 } from '@/components/icons';
import { ActionSheet } from './action-sheet';
import { Button } from './button';

type Args = { open: boolean; showHeader: boolean; title: string; description: string; showDestructive: boolean; actions: number };

const all = [
  { label: 'Share', icon: <Share2 /> },
  { label: 'Duplicate', icon: <Copy /> },
  { label: 'Download PDF', icon: <Download /> },
];

const meta = {
  title: 'Components/Mobile/Action Sheet',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A short list of actions for one item on mobile, rising from the bottom: share, duplicate, download, delete. 2 to 6 actions, one line each, the destructive one last and red; Cancel sits apart. Tap outside, Escape or Cancel close it and focus returns to the trigger. Content or forms go in a Drawer; desktop uses a Menu. Figma: Mobile page / Action Sheet. Guide: eggux build-ui/patterns/mobile.md',
      },
    },
  },
  args: { open: false, showHeader: true, title: 'INV-2041', description: 'Choose what to do with this invoice', showDestructive: true, actions: 3 },
  argTypes: {
    open: { name: 'Open', control: 'boolean', description: 'Start with the sheet open.', table: { category: 'Sheet' } },
    showHeader: { name: 'Show header', control: 'boolean', description: 'Title and description above the actions.', table: { category: 'Sheet' } },
    title: { name: 'Title', control: 'text', description: 'Names the object.', table: { category: 'Sheet' } },
    description: { name: 'Description', control: 'text', description: 'What the person can do.', table: { category: 'Sheet' } },
    actions: { name: 'Actions', control: { type: 'range', min: 1, max: 3, step: 1 }, description: 'Plain actions before the destructive one.', table: { category: 'Parts' } },
    showDestructive: { name: 'Show destructive action', control: 'boolean', description: 'Delete, last and red.', table: { category: 'Parts' } },
  },
  render: ({ open, showHeader, title, description, showDestructive, actions }) => (
    <ActionSheet
      key={String(open)}
      defaultOpen={open}
      trigger={<Button variant="outline">More actions</Button>}
      title={title}
      description={description}
      showHeader={showHeader}
      actions={[...all.slice(0, actions), ...(showDestructive ? [{ label: 'Delete', icon: <Trash2 />, destructive: true }] : [])]}
    />
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Open from the start, as people see it on a phone. */
export const Open: Story = { args: { open: true } };

export const DefaultCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'More actions' });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'INV-2041' });
    await expect(dialog).toBeVisible();
    // Focus moves to the first action; the destructive one is last.
    await waitFor(() => expect(screen.getByRole('button', { name: 'Share' })).toHaveFocus());
    const names = Array.from(dialog.querySelectorAll('ul button')).map(b => b.textContent);
    await expect(names).toEqual(['Share', 'Duplicate', 'Download PDF', 'Delete']);
    await expect(Math.round(screen.getByRole('button', { name: 'Share' }).getBoundingClientRect().height)).toBeGreaterThanOrEqual(48);
    await expect(screen.getByRole('button', { name: 'Cancel' })).toBeVisible();
    // Escape closes it and focus returns to the trigger.
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const SelectCheck: Story = {
  tags: ['!dev'],
  render: () => <ActionSheet defaultOpen title="INV-2041" actions={[{ label: 'Share', icon: <Share2 />, onSelect: fn() }]} />,
  play: async () => {
    await userEvent.click(await screen.findByRole('button', { name: 'Share' }));
    // Choosing an action closes the sheet.
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  render: () => (
    <ActionSheet
      defaultOpen
      title="A very long invoice number and customer name that needs two lines to fit in the sheet header"
      description="A description that is a lot longer than planned, so it has to wrap over several lines and then be cut after the third line of text in the sheet"
      actions={[{ label: 'Share this invoice with someone outside the company by email or link', icon: <Share2 /> }, { label: 'Delete', icon: <Trash2 />, destructive: true }]}
    />
  ),
  play: async () => {
    const dialog = await screen.findByRole('dialog');
    const rows = Array.from(dialog.querySelectorAll('ul button'));
    // Action labels stay on one line.
    for (const r of rows) await expect(r.getBoundingClientRect().height).toBeLessThanOrEqual(56);
    await expect(dialog.getBoundingClientRect().width).toBeLessThanOrEqual(window.innerWidth);
  },
};

export const DefaultDark: Story = { ...Open, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Open, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
