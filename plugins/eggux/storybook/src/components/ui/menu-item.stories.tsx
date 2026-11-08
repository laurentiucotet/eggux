import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test';
import { Copy, Pencil, Trash2 } from '@/components/icons';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './dropdown-menu';

// Menu Item is a part of the Menu (DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuSubTrigger
// in dropdown-menu.tsx). These stories check it against the Figma Menu Item component set.
const meta = {
  title: 'Components/Menu/Menu Item',
  component: DropdownMenuItem,
  parameters: {
    docs: { description: { component: 'Row inside a Menu (Dropdown, context menu). Variant default or destructive (last, after a separator); State default, highlighted (keyboard or pointer), disabled. Options: leading icon, shortcut, Checked (menuitemcheckbox), description (a muted second line), submenu (chevron, opens on arrow right). Figma: Menu page / Menu Item. Guide: eggux build-ui/components/dropdown-menu.md' } },
  },
} satisfies Meta<typeof DropdownMenuItem>;
export default meta;
type Story = StoryObj<typeof meta>;

const probe = (cls: string) => { const p = document.createElement('span'); p.className = cls; document.body.append(p); return { style: getComputedStyle(p), remove: () => p.remove() }; };
const rect = (el: Element) => el.getBoundingClientRect();
const px = (n: number) => `${n}px`;

function Menu({ label, children, open = true, className }: { label: string; children: React.ReactNode; open?: boolean; className?: string }) {
  return (
    <DropdownMenu defaultOpen={open} modal={false}>
      <DropdownMenuTrigger asChild><Button variant="outline">{label}</Button></DropdownMenuTrigger>
      <DropdownMenuContent align="start" aria-label={label} className={className}>{children}</DropdownMenuContent>
    </DropdownMenu>
  );
}

const onEdit = fn();

// Figma Menu Item default: 32 high, 8 px sides, 8 px gap, 16 px icon, body/small label,
// ui/caption muted shortcut, radius sm. Highlighted (arrow keys or pointer) fills accent; Enter runs it.
export const Default: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Menu label="Invoice actions" open={false}>
      <DropdownMenuItem icon={<Pencil aria-hidden="true" />} shortcut="⌘E" onSelect={onEdit}>Edit</DropdownMenuItem>
      <DropdownMenuItem icon={<Copy aria-hidden="true" />} shortcut="⌘D">Duplicate</DropdownMenuItem>
    </Menu>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Invoice actions' }));
    const edit = await screen.findByRole('menuitem', { name: /Edit/ });
    const style = getComputedStyle(edit);
    await expect(Math.round(rect(edit).height)).toBe(32);
    await expect([style.paddingLeft, style.paddingRight, style.columnGap]).toEqual([px(8), px(8), px(8)]);
    await expect([style.fontSize, style.lineHeight, style.fontWeight]).toEqual([px(14), px(20), '400']);
    const sm = probe('rounded-sm');
    await expect(style.borderTopLeftRadius).toBe(sm.style.borderTopLeftRadius);
    sm.remove();
    const icon = edit.querySelector('svg')!;
    await expect([Math.round(rect(icon).width), Math.round(rect(icon).height)]).toEqual([16, 16]);
    const shortcut = edit.querySelector('[data-slot="dropdown-menu-shortcut"]')!;
    await expect(shortcut).toHaveTextContent('⌘E');
    await expect([getComputedStyle(shortcut).fontSize, getComputedStyle(shortcut).lineHeight]).toEqual([px(12), px(16)]);
    // Shortcut sits at the end of the row, 8 px from the right edge.
    await expect(Math.round(rect(edit).right - rect(shortcut).right)).toBe(8);
    // Highlighted: accent fill and accent text, shortcut follows the item colour.
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(edit).toHaveFocus());
    const accent = probe('bg-accent text-accent-foreground');
    await waitFor(() => expect(getComputedStyle(edit).backgroundColor).toBe(accent.style.backgroundColor));
    await expect(getComputedStyle(edit).color).toBe(accent.style.color);
    await expect(getComputedStyle(shortcut).color).toBe(accent.style.color);
    accent.remove();
    await userEvent.keyboard('{Enter}');
    await expect(onEdit).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  },
};

const onBlocked = fn();

// The six Figma variants: Variant default / destructive x State default / highlighted / disabled.
// Highlighted is shown with data-highlighted; in use it follows focus.
function StatesMenu() {
  return (
    <Menu label="Menu Item states">
      <DropdownMenuItem>Edit</DropdownMenuItem>
      <DropdownMenuItem data-highlighted="">Edit highlighted</DropdownMenuItem>
      <DropdownMenuItem disabled onSelect={onBlocked}>Edit disabled</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive" icon={<Trash2 aria-hidden="true" />} shortcut="⌘⌫">Delete</DropdownMenuItem>
      <DropdownMenuItem variant="destructive" icon={<Trash2 aria-hidden="true" />} shortcut="⌘⌫" data-highlighted="">Delete highlighted</DropdownMenuItem>
      <DropdownMenuItem variant="destructive" disabled onSelect={onBlocked}>Delete disabled</DropdownMenuItem>
    </Menu>
  );
}

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => <StatesMenu />,
  play: async () => {
    const [edit, editHi, editOff, del, delHi, delOff] = await screen.findAllByRole('menuitem');
    const def = probe('text-popover-foreground');
    await expect(getComputedStyle(edit).color).toBe(def.style.color);
    await expect(getComputedStyle(edit).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    def.remove();
    const accent = probe('bg-accent text-accent-foreground');
    await expect(getComputedStyle(editHi).backgroundColor).toBe(accent.style.backgroundColor);
    accent.remove();
    // Destructive: destructive text and icon; highlighted fills the row with the destructive colour.
    const red = probe('text-destructive');
    await expect(getComputedStyle(del).color).toBe(red.style.color);
    await expect(getComputedStyle(del.querySelector('svg')!).color).toBe(red.style.color);
    // Destructive shortcut stays muted in the default state (Figma).
    const muted = probe('text-muted-foreground');
    await expect(getComputedStyle(del.querySelector('[data-slot="dropdown-menu-shortcut"]')!).color).toBe(muted.style.color);
    muted.remove();
    red.remove();
    const filled = probe('bg-destructive text-destructive-foreground');
    await expect(getComputedStyle(delHi).backgroundColor).toBe(filled.style.backgroundColor);
    await expect(getComputedStyle(delHi).color).toBe(filled.style.color);
    await expect(getComputedStyle(delHi.querySelector('[data-slot="dropdown-menu-shortcut"]')!).color).toBe(filled.style.color);
    filled.remove();
    // Disabled: opacity 50, aria-disabled, skipped by the arrows and cannot be chosen.
    for (const off of [editOff, delOff]) {
      await expect(off).toHaveAttribute('aria-disabled', 'true');
      await expect(getComputedStyle(off).opacity).toBe('0.5');
      await expect(getComputedStyle(off).pointerEvents).toBe('none');
    }
    for (const i of [edit, editHi, editOff, del, delHi, delOff]) await expect(Math.round(rect(i).height)).toBe(32);
    edit.focus();
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    await expect(del).toHaveFocus();
    await expect(onBlocked).not.toHaveBeenCalled();
  },
};

// Figma Menu Item options: Checked, Show description, Show submenu.
export const Options: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [paid, setPaid] = React.useState(true);
    return (
      <Menu label="Menu Item options">
        <DropdownMenuCheckboxItem checked={paid} onCheckedChange={v => setPaid(v === true)} shortcut="⌘P">Show paid invoices</DropdownMenuCheckboxItem>
        <DropdownMenuItem description="Visible to everyone in the workspace">Workspace</DropdownMenuItem>
        <DropdownMenuItem description="Only you and the people you invite">Private</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Move to</DropdownMenuSubTrigger>
          <DropdownMenuSubContent aria-label="Move to">
            <DropdownMenuItem>Drafts</DropdownMenuItem>
            <DropdownMenuItem>Archive</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </Menu>
    );
  },
  play: async () => {
    // Checked: menuitemcheckbox with aria-checked; the check is 16 px at the end, after the shortcut.
    const check = await screen.findByRole('menuitemcheckbox', { name: /Show paid invoices/ });
    await expect(check).toHaveAttribute('aria-checked', 'true');
    const tick = check.querySelector('svg')!;
    const shortcut = check.querySelector('[data-slot="dropdown-menu-shortcut"]')!;
    await expect(Math.round(rect(tick).width)).toBe(16);
    await expect(rect(tick).left).toBeGreaterThanOrEqual(rect(shortcut).right);
    await expect(Math.round(rect(check).right - rect(tick).right)).toBe(8);
    check.focus();
    await userEvent.keyboard('{Enter}');
    // Radix closes the menu on select; reopen and check the new state.
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    await userEvent.click(screen.getByRole('button', { name: 'Menu Item options' }));
    await expect(await screen.findByRole('menuitemcheckbox', { name: /Show paid invoices/ })).toHaveAttribute('aria-checked', 'false');
    // Description: ui/caption muted, 2 px under the label.
    const item = screen.getByRole('menuitem', { name: /Workspace/ });
    const desc = item.querySelector('[data-slot="dropdown-menu-description"]')!;
    const label = desc.previousElementSibling!;
    const muted = probe('text-muted-foreground');
    await expect(getComputedStyle(desc).color).toBe(muted.style.color);
    muted.remove();
    await expect([getComputedStyle(desc).fontSize, getComputedStyle(desc).lineHeight]).toEqual([px(12), px(16)]);
    await expect(Math.round(rect(desc).top - rect(label).bottom)).toBe(2);
    await expect(Math.round(rect(item).height)).toBeGreaterThanOrEqual(50);
    // Submenu: a chevron at the end, aria-haspopup, arrow right opens, arrow left closes.
    const sub = screen.getByRole('menuitem', { name: 'Move to' });
    await expect(sub).toHaveAttribute('aria-haspopup', 'menu');
    await expect(Math.round(rect(sub.querySelector('svg')!).width)).toBe(16);
    sub.focus();
    await userEvent.keyboard('{ArrowRight}');
    const drafts = await screen.findByRole('menuitem', { name: 'Drafts' });
    await waitFor(() => expect(drafts).toHaveFocus());
    await userEvent.keyboard('{ArrowLeft}');
    await waitFor(() => expect(screen.queryByRole('menuitem', { name: 'Drafts' })).toBeNull());
    await expect(sub).toHaveFocus();
    await userEvent.keyboard('{Escape}');
  },
};

// Stress: long labels truncate on one line inside the 224 menu, the shortcut keeps its place;
// long descriptions wrap under a one-line label.
export const Stress: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => (
    <Menu label="Long labels">
        <DropdownMenuItem icon={<Pencil aria-hidden="true" />} shortcut="⌘E">Edit the billing contact of Acme Corporation Europe</DropdownMenuItem>
        <DropdownMenuItem description="Visible to everyone in the workspace, including guests invited to a single project">Workspace and every guest</DropdownMenuItem>
        <DropdownMenuItem variant="destructive" shortcut="⌘⌫">Delete every draft invoice from this quarter</DropdownMenuItem>
    </Menu>
  ),
  play: async () => {
    const [long, described, del] = await screen.findAllByRole('menuitem');
    await expect(Math.round(rect(screen.getByRole('menu')).width)).toBe(224);
    for (const i of [long, del]) {
      await expect(Math.round(rect(i).height)).toBe(32);
      const text = i.querySelector('.truncate')!;
      await expect(text.scrollWidth).toBeGreaterThan(text.clientWidth);
      const shortcut = i.querySelector('[data-slot="dropdown-menu-shortcut"]')!;
      await expect(Math.round(rect(i).right - rect(shortcut).right)).toBe(8);
    }
    // The description wraps under a one-line label.
    const desc = described.querySelector('[data-slot="dropdown-menu-description"]')!;
    await expect(Math.round(rect(desc).height)).toBeGreaterThan(16);
    await expect(Math.round(rect(desc.previousElementSibling!).height)).toBe(20);
  },
};

export const StatesDark: Story = { parameters: { controls: { disable: true } }, render: () => <StatesMenu />, tags: ['!dev'], globals: { theme: 'Dark' } };
export const StatesCorporate: Story = { parameters: { controls: { disable: true } }, render: () => <StatesMenu />, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
