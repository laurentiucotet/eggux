import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test';
import { Archive, Copy, Ellipsis, Pencil, Trash2 } from '@/components/icons';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './dropdown-menu';

const meta = {
  title: 'Components/Menu/Dropdown Menu',
  component: DropdownMenuContent,
  parameters: {
    docs: { description: { component: 'Actions on an object behind a trigger (a Button Icon labelled with the object). Items are verbs, most frequent first, destructive last after a Separator; shortcuts on the right. Arrows move, Enter selects, Escape closes and returns focus to the trigger. Figma: Menu page / Menu, Menu Item, Menu Label. Guide: eggux build-ui/components/dropdown-menu.md' } },
  },
} satisfies Meta<typeof DropdownMenuContent>;
export default meta;
type Story = StoryObj<typeof meta>;

const probe = (cls: string) => { const p = document.createElement('span'); p.className = cls; document.body.append(p); return { style: getComputedStyle(p), remove: () => p.remove() }; };
const box = (el: Element) => { const r = el.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; };

const handlers = { edit: fn(), duplicate: fn(), archive: fn(), remove: fn() };

// The Figma Menu default content: Details label, Edit (⌘E), Duplicate (⌘D), Archive, separator, Delete.
function InvoiceMenu({ open, onSelect = handlers }: { open?: boolean; onSelect?: typeof handlers }) {
  return (
    <DropdownMenu defaultOpen={open} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Actions for Invoice INV-1041"><Ellipsis aria-hidden="true" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" aria-label="Actions for Invoice INV-1041">
        <DropdownMenuLabel>Details</DropdownMenuLabel>
        <DropdownMenuItem icon={<Pencil aria-hidden="true" />} shortcut="⌘E" onSelect={onSelect.edit}>Edit</DropdownMenuItem>
        <DropdownMenuItem icon={<Copy aria-hidden="true" />} shortcut="⌘D" onSelect={onSelect.duplicate}>Duplicate</DropdownMenuItem>
        <DropdownMenuItem icon={<Archive aria-hidden="true" />} onSelect={onSelect.archive}>Archive</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" icon={<Trash2 aria-hidden="true" />} shortcut="⌘⌫" onSelect={onSelect.remove}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Click opens it; choosing an item runs it and closes the menu.
export const Default: Story = {
  render: () => <InvoiceMenu />,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Actions for Invoice INV-1041' });
    await userEvent.click(trigger);
    const menu = await screen.findByRole('menu');
    // Figma Menu: 224 wide; Menu Item 32 high (14/20 + 6 px menu-padding-y).
    await expect(box(menu)[0]).toBe(224);
    const items = screen.getAllByRole('menuitem');
    await expect(items.map(i => box(i)[1])).toEqual([32, 32, 32, 32]);
    const surface = probe('bg-popover border border-border rounded-md');
    await expect(getComputedStyle(menu).backgroundColor).toBe(surface.style.backgroundColor);
    await expect(getComputedStyle(menu).borderTopColor).toBe(surface.style.borderTopColor);
    await expect(getComputedStyle(menu).borderTopLeftRadius).toBe(surface.style.borderTopLeftRadius);
    surface.remove();
    // Destructive item: destructive text.
    const destructive = probe('text-destructive');
    await expect(getComputedStyle(items[3]).color).toBe(destructive.style.color);
    destructive.remove();
    await userEvent.click(screen.getByRole('menuitem', { name: /Duplicate/ }));
    await expect(handlers.duplicate).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  },
};

// Keyboard: Enter opens, arrows move (highlight = accent), Escape closes and focus returns.
export const Keyboard: Story = {
  render: () => <InvoiceMenu />,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Actions for Invoice INV-1041' });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    const menu = await screen.findByRole('menu');
    await waitFor(() => expect(screen.getAllByRole('menuitem')[0]).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}');
    const second = screen.getAllByRole('menuitem')[1];
    await expect(second).toHaveFocus();
    const accent = probe('bg-accent text-accent-foreground');
    await waitFor(() => expect(getComputedStyle(second).backgroundColor).toBe(accent.style.backgroundColor));
    accent.remove();
    // Highlighted destructive: a filled destructive row with its foreground.
    await userEvent.keyboard('{End}');
    const del = screen.getByRole('menuitem', { name: /Delete/ });
    await expect(del).toHaveFocus();
    const filled = probe('bg-destructive text-destructive-foreground');
    await waitFor(() => expect(getComputedStyle(del).backgroundColor).toBe(filled.style.backgroundColor));
    await expect(getComputedStyle(del).color).toBe(filled.style.color);
    filled.remove();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(menu).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
  },
};

// Figma Menu Item options: Checked (menuitemcheckbox), Show description, Show submenu, disabled.
export const ItemOptions: Story = {
  render: () => {
    const [paid, setPaid] = React.useState(true);
    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild><Button variant="outline">View</Button></DropdownMenuTrigger>
        <DropdownMenuContent align="start" aria-label="View options">
          <DropdownMenuCheckboxItem checked={paid} onCheckedChange={v => setPaid(v === true)}>Show paid invoices</DropdownMenuCheckboxItem>
          <DropdownMenuItem description="Visible to everyone in the workspace">Workspace</DropdownMenuItem>
          <DropdownMenuItem disabled>Export PDF</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Move to</DropdownMenuSubTrigger>
            <DropdownMenuSubContent aria-label="Move to">
              <DropdownMenuItem>Drafts</DropdownMenuItem>
              <DropdownMenuItem>Archive</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'View' }));
    const check = await screen.findByRole('menuitemcheckbox', { name: 'Show paid invoices' });
    await expect(check).toHaveAttribute('aria-checked', 'true');
    await expect(screen.getByRole('menuitem', { name: 'Export PDF' })).toHaveAttribute('aria-disabled', 'true');
    await expect(screen.getByText('Visible to everyone in the workspace')).toBeVisible();
    const sub = screen.getByRole('menuitem', { name: 'Move to' });
    await expect(sub).toHaveAttribute('aria-haspopup', 'menu');
    sub.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(await screen.findByRole('menuitem', { name: 'Drafts' })).toBeVisible();
    await userEvent.keyboard('{Escape}');
  },
};

// Stress: long labels truncate on one line inside the 224 menu; the shortcut keeps its place.
export const LongLabels: Story = { tags: ['!dev'],
  render: () => (
    <DropdownMenu defaultOpen modal={false}>
      <DropdownMenuTrigger asChild><Button variant="outline">Actions</Button></DropdownMenuTrigger>
      <DropdownMenuContent align="start" aria-label="Actions">
        <DropdownMenuItem shortcut="⌘E">Edit the billing contact of Acme Corporation Europe</DropdownMenuItem>
        <DropdownMenuItem>Send a payment reminder for every overdue invoice</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async () => {
    const items = await screen.findAllByRole('menuitem');
    await expect(items.map(i => box(i)[1])).toEqual([32, 32]);
    await expect(box(screen.getByRole('menu'))[0]).toBe(224);
  },
};

export const OpenDark: Story = { render: () => <InvoiceMenu open />, tags: ['!dev'], globals: { theme: 'Dark' } };
export const OpenCorporate: Story = { render: () => <InvoiceMenu open />, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
