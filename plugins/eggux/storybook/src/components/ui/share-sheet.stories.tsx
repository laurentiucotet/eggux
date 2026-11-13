import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test';
import { Button } from './button';
import { defaultShareTargets, ShareSheet } from './share-sheet';

type Args = { open: boolean; title: string; showPreview: boolean; targets: number };

const preview = { title: 'Acme invoice INV-2041', url: 'https://app.acme.example/invoices/INV-2041' };

const meta = {
  title: 'Components/Mobile/Share Sheet',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A bottom sheet that shares one thing: a link preview line and a grid of labeled targets (Messages, Mail, Copy link, Save, More), each at least 72 x 72 with a 44 icon. A target closes the sheet; Copy link stays and says "Link copied". Cancel, Escape and a tap outside close it. Built on the Drawer. For actions on an item use the Action Sheet. Code only (no Figma component yet).',
      },
    },
  },
  args: { open: false, title: 'Share', showPreview: true, targets: 5 },
  argTypes: {
    open: { name: 'Open', control: 'boolean', description: 'Start with the sheet open.', table: { category: 'Sheet' } },
    title: { name: 'Title', control: 'text', description: 'The sheet title.', table: { category: 'Sheet' } },
    targets: { name: 'Targets', control: { type: 'range', min: 2, max: 5, step: 1 }, description: 'How many targets show.', table: { category: 'Sheet' } },
    showPreview: { name: 'Show link preview', control: 'boolean', description: 'The title and address of what is shared.', table: { category: 'Parts' } },
  },
  render: ({ open, title, showPreview, targets }) => (
    <ShareSheet
      key={String(open)}
      defaultOpen={open}
      title={title}
      preview={showPreview ? preview : undefined}
      targets={defaultShareTargets.slice(0, targets)}
      trigger={<Button variant="outline">Share invoice</Button>}
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
  render: () => {
    const onTarget = fn();
    return <ShareSheet preview={preview} onTarget={onTarget} trigger={<Button variant="outline">Share invoice</Button>} />;
  },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Share invoice' });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Share' });
    await expect(screen.getByText('https://app.acme.example/invoices/INV-2041')).toBeVisible();
    // Five labeled targets, each a 72 px tile at least.
    const list = screen.getByRole('list', { name: 'Share with' });
    const names = Array.from(list.querySelectorAll('button')).map(b => b.textContent);
    await expect(names).toEqual(['Messages', 'Mail', 'Copy link', 'Save', 'More']);
    for (const b of Array.from(list.querySelectorAll('button'))) {
      const r = b.getBoundingClientRect();
      await expect(Math.round(r.height)).toBeGreaterThanOrEqual(72);
      await expect(Math.round(r.width)).toBeGreaterThanOrEqual(44);
    }
    // Copy link stays open and says what happened.
    await userEvent.click(screen.getByRole('button', { name: 'Copy link' }));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Link copied'));
    await expect(dialog).toBeVisible();
    // Messages closes the sheet and focus returns to the trigger.
    await userEvent.click(screen.getByRole('button', { name: 'Messages' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const KeyboardCheck: Story = {
  tags: ['!dev'],
  render: () => <ShareSheet defaultOpen preview={preview} trigger={<Button variant="outline">Share invoice</Button>} />,
  play: async () => {
    await screen.findByRole('dialog');
    // Focus lands inside the sheet, Tab reaches every target, Escape closes.
    await waitFor(() => expect(screen.getByRole('button', { name: 'Messages' })).toHaveFocus());
    await userEvent.tab();
    await expect(screen.getByRole('button', { name: 'Mail' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <ShareSheet
      defaultOpen
      title="Share this very long invoice with the whole accounting team"
      preview={{ title: 'Acme invoice INV-2041 for the spring campaign of the north region and its many sub-campaigns', url: 'https://app.acme.example/invoices/INV-2041?utm_source=share&utm_medium=sheet&utm_campaign=very-long-campaign-name' }}
    />
  ),
  play: async () => {
    const dialog = await screen.findByRole('dialog');
    await expect(dialog.getBoundingClientRect().width).toBeLessThanOrEqual(window.innerWidth);
    await expect(dialog.scrollWidth).toBeLessThanOrEqual(dialog.clientWidth + 1);
    const preview = dialog.querySelector('[data-slot="share-preview"]') as HTMLElement;
    await expect(preview.scrollWidth).toBeLessThanOrEqual(preview.clientWidth + 1);
    for (const b of Array.from(dialog.querySelectorAll('ul button'))) await expect(b.getBoundingClientRect().width).toBeGreaterThanOrEqual(44);
  },
};

export const DefaultDark: Story = { ...Open, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Open, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
