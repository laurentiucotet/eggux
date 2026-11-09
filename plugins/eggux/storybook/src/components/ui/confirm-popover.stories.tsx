import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { Archive, Trash2 } from '@/components/icons';
import { Button } from './button';
import { ConfirmPopover } from './confirm-popover';

const meta = {
  title: 'Components/Popover/Confirm Popover',
  component: ConfirmPopover,
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'A small check next to the button that triggered it, for actions with some cost: archive, remove a person, discard a draft. Title as a question with the object, one line on the consequence, Cancel and the action verb. Irreversible loss of data uses Alert Dialog; reversible actions with Undo need no confirmation. Figma: Popover page / Confirm Popover. Guide: eggux build-ui/components/popover.md' } },
  },
  args: {
    title: 'Archive 3 invoices?',
    description: 'You can restore them from Archived.',
    confirmLabel: 'Archive',
    children: <Button variant="outline"><Archive aria-hidden="true" />Archive</Button>,
  },
} satisfies Meta<typeof ConfirmPopover>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => { const r = el.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; };
const probe = (cls: string) => { const p = document.createElement('span'); p.className = cls; document.body.append(p); return { style: getComputedStyle(p), remove: () => p.remove() }; };

// Opens next to the trigger with focus on Cancel; the confirm verb runs the action and closes.
export const Default: Story = {
  args: { onConfirm: fn(), onCancel: fn() },
  play: async ({ canvas, args }) => {
    const trigger = canvas.getByRole('button', { name: 'Archive' });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('alertdialog', { name: 'Archive 3 invoices?' });
    await expect(dialog).toHaveAccessibleDescription('You can restore them from Archived.');
    // Figma: 288 x 122 (16 padding, 44 text, 12 gap, 32 actions, 1 px border).
    await expect(box(dialog)).toEqual([288, 122]);
    await expect(within(dialog).getByRole('button', { name: 'Cancel' })).toHaveFocus();
    await userEvent.click(within(dialog).getByRole('button', { name: 'Archive' }));
    await expect(args.onConfirm).toHaveBeenCalledTimes(1);
    await expect(args.onCancel).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
    await expect(trigger).toHaveFocus();
  },
};

// Tone=destructive: the confirm button is destructive.
export const Destructive: Story = {
  args: {
    tone: 'destructive',
    title: 'Remove Ana Popescu from Acme Website?',
    description: 'She loses access to its tasks and files.',
    confirmLabel: 'Remove',
    children: <Button variant="outline"><Trash2 aria-hidden="true" />Remove member</Button>,
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Remove member' }));
    const dialog = await screen.findByRole('alertdialog', { name: 'Remove Ana Popescu from Acme Website?' });
    const destructive = probe('bg-destructive');
    await expect(getComputedStyle(within(dialog).getByRole('button', { name: 'Remove' })).backgroundColor).toBe(destructive.style.backgroundColor);
    destructive.remove();
  },
};

// Escape and Cancel both cancel and return focus to the trigger; Enter on the confirm runs it.
export const Keyboard: Story = {
  args: { onConfirm: fn(), onCancel: fn() },
  play: async ({ canvas, args }) => {
    const trigger = canvas.getByRole('button', { name: 'Archive' });
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await screen.findByRole('alertdialog');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
    await expect(args.onCancel).toHaveBeenCalledTimes(1);
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    const dialog = await screen.findByRole('alertdialog');
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
    await expect(args.onCancel).toHaveBeenCalledTimes(2);
    await expect(dialog.isConnected).toBe(false);
    await userEvent.keyboard('{Enter}');
    await screen.findByRole('alertdialog');
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');
    await expect(args.onConfirm).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
  },
};

// Long title and description wrap inside 288; the actions stay on one row.
export const Stress: Story = {
  tags: ['!dev'],
  args: {
    defaultOpen: true,
    title: 'Archive 128 invoices of Acme Holdings International issued in the 2025 fiscal year?',
    description: 'You can restore them from Archived for 90 days; after that they move to the long-term archive of the finance team.',
    confirmLabel: 'Archive invoices',
  },
  play: async () => {
    const dialog = await screen.findByRole('alertdialog');
    await expect(box(dialog)[0]).toBe(288);
    await expect(dialog.scrollWidth).toBeLessThanOrEqual(dialog.clientWidth);
    const buttons = within(dialog).getAllByRole('button');
    await expect(Math.round(buttons[0].getBoundingClientRect().top)).toBe(Math.round(buttons[1].getBoundingClientRect().top));
  },
};

export const DefaultDark: Story = { ...Destructive, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Destructive, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
