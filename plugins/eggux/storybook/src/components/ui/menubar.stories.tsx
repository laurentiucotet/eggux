import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test';
import { Archive, Copy, Pencil, Trash2 } from '@/components/icons';
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from './menubar';

const meta = {
  title: 'Components/Menu/Menubar',
  component: Menubar,
  parameters: {
    docs: { description: { component: 'Desktop app menus in a row (File, Edit, View, Help) for editors and tools with many commands; each Menubar Trigger opens a Menu with items, shortcuts and submenus. Left and right arrows move between menus, Escape closes. Not for site navigation: use Navigation or Sidebar. Figma: Menu page / Menubar, Menubar Trigger. Guide: eggux build-ui/components/dropdown-menu.md' } },
  },
} satisfies Meta<typeof Menubar>;
export default meta;
type Story = StoryObj<typeof meta>;

const probe = (cls: string) => { const p = document.createElement('span'); p.className = cls; document.body.append(p); return { style: getComputedStyle(p), remove: () => p.remove() }; };
const rect = (el: Element) => el.getBoundingClientRect();

const onEdit = fn();
const onNew = fn();

// The Figma example: File, Edit, View, Help; Edit opens the Menu default content.
function EditorMenubar({ defaultValue }: { defaultValue?: string }) {
  const [grid, setGrid] = React.useState(true);
  return (
    <Menubar defaultValue={defaultValue} aria-label="Invoice editor">
      <MenubarMenu value="file">
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent aria-label="File">
          <MenubarItem shortcut="⌘N" onSelect={onNew}>New invoice</MenubarItem>
          <MenubarItem shortcut="⌘O">Open...</MenubarItem>
          <MenubarSub>
            <MenubarSubTrigger>Export as</MenubarSubTrigger>
            <MenubarSubContent aria-label="Export as">
              <MenubarItem>PDF</MenubarItem>
              <MenubarItem>CSV</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem shortcut="⌘P">Print...</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu value="edit">
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent aria-label="Edit">
          <MenubarLabel>Details</MenubarLabel>
          <MenubarItem icon={<Pencil aria-hidden="true" />} shortcut="⌘E" onSelect={onEdit}>Edit</MenubarItem>
          <MenubarItem icon={<Copy aria-hidden="true" />} shortcut="⌘D">Duplicate</MenubarItem>
          <MenubarItem icon={<Archive aria-hidden="true" />}>Archive</MenubarItem>
          <MenubarSeparator />
          <MenubarItem variant="destructive" icon={<Trash2 aria-hidden="true" />} shortcut="⌘⌫">Delete</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu value="view">
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent aria-label="View">
          <MenubarCheckboxItem checked={grid} onCheckedChange={v => setGrid(v === true)}>Show grid</MenubarCheckboxItem>
          <MenubarItem shortcut="⌘+">Zoom in</MenubarItem>
          <MenubarItem shortcut="⌘-">Zoom out</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu value="help">
        <MenubarTrigger>Help</MenubarTrigger>
        <MenubarContent aria-label="Help">
          <MenubarItem shortcut="?">Keyboard shortcuts</MenubarItem>
          <MenubarItem>Contact support</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

// Figma Menubar: 36 high (control-height), hugs its triggers with 4 px sides and gaps, border,
// radius md. Menubar Trigger: 28 high, 12 px sides, ui/label. Click opens; open = accent fill.
export const Default: Story = {
  render: () => <EditorMenubar />,
  play: async ({ canvas }) => {
    const bar = canvas.getByRole('menubar', { name: 'Invoice editor' });
    const triggers = canvas.getAllByRole('menuitem');
    await expect(triggers.map(t => t.textContent)).toEqual(['File', 'Edit', 'View', 'Help']);
    const bs = getComputedStyle(bar);
    await expect(Math.round(rect(bar).height)).toBe(36);
    await expect([bs.paddingLeft, bs.paddingRight, bs.columnGap, bs.borderTopWidth]).toEqual(['4px', '4px', '4px', '1px']);
    const md = probe('rounded-md border-border bg-background');
    await expect(bs.borderTopLeftRadius).toBe(md.style.borderTopLeftRadius);
    await expect(bs.borderTopColor).toBe(md.style.borderTopColor);
    await expect(bs.backgroundColor).toBe(md.style.backgroundColor);
    md.remove();
    const ts = getComputedStyle(triggers[0]);
    await expect(Math.round(rect(triggers[0]).height)).toBe(28);
    await expect([ts.paddingLeft, ts.paddingRight, ts.paddingTop, ts.fontSize, ts.lineHeight, ts.fontWeight]).toEqual(['12px', '12px', '4px', '14px', '20px', '500']);
    const sm = probe('rounded-sm text-foreground');
    await expect(ts.borderTopLeftRadius).toBe(sm.style.borderTopLeftRadius);
    await expect(ts.color).toBe(sm.style.color);
    sm.remove();
    // Figma width: 234 for File, Edit, View, Help.
    await expect(Math.abs(Math.round(rect(bar).width) - 234)).toBeLessThanOrEqual(4);
    // Open: the trigger fills accent, its Menu opens under it, left-aligned, 224 wide.
    await userEvent.click(triggers[1]);
    const menu = await screen.findByRole('menu', { name: 'Edit' });
    await expect(triggers[1]).toHaveAttribute('aria-expanded', 'true');
    const accent = probe('bg-accent');
    await expect(getComputedStyle(triggers[1]).backgroundColor).toBe(accent.style.backgroundColor);
    accent.remove();
    await expect(Math.round(rect(menu).width)).toBe(224);
    await expect(Math.round(rect(menu).left)).toBe(Math.round(rect(triggers[1]).left));
    await expect(rect(menu).top).toBeGreaterThan(rect(bar).bottom);
    await expect(screen.getAllByRole('menuitem').filter(i => menu.contains(i)).map(i => Math.round(rect(i).height))).toEqual([32, 32, 32, 32]);
    // While one menu is open, hovering another trigger opens that one.
    await userEvent.hover(triggers[2]);
    await screen.findByRole('menu', { name: 'View' });
    await waitFor(() => expect(screen.queryByRole('menu', { name: 'Edit' })).toBeNull());
    // Moving back to Edit while View is open opens Edit (a click here would toggle it closed).
    await userEvent.hover(triggers[1]);
    await userEvent.click(await screen.findByRole('menuitem', { name: /⌘E/ }));
    await expect(onEdit).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  },
};

// Keyboard: Tab reaches the first trigger, arrows move between triggers and between open menus,
// Enter opens, Escape closes and focus returns to the trigger.
export const Keyboard: Story = {
  render: () => <EditorMenubar />,
  play: async ({ canvas }) => {
    const [file, edit, view] = canvas.getAllByRole('menuitem');
    await userEvent.tab();
    await expect(file).toHaveFocus();
    await expect(file).toHaveAttribute('aria-haspopup', 'menu');
    await userEvent.keyboard('{ArrowRight}');
    await expect(edit).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await screen.findByRole('menu', { name: 'Edit' });
    await waitFor(() => expect(screen.getByRole('menuitem', { name: /⌘E/ })).toHaveFocus());
    await userEvent.keyboard('{ArrowRight}');
    await screen.findByRole('menu', { name: 'View' });
    await expect(view).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{ArrowLeft}');
    await screen.findByRole('menu', { name: 'Edit' });
    await userEvent.keyboard('{ArrowLeft}');
    await screen.findByRole('menu', { name: 'File' });
    // Submenu: arrow right on "Export as" opens it, one level deep.
    const exportAs = screen.getByRole('menuitem', { name: 'Export as' });
    for (let i = 0; i < 4 && document.activeElement !== exportAs; i++) await userEvent.keyboard('{ArrowDown}');
    await expect(exportAs).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'PDF' })).toHaveFocus());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    await expect(file).toHaveFocus();
    await expect(onNew).not.toHaveBeenCalled();
  },
};

// Stress: long trigger labels stay on one line; the bar hugs them.
export const Stress: Story = {
  tags: ['!dev'],
  render: () => (
    <Menubar aria-label="Report builder">
      {['File', 'Edit and format', 'View', 'Insert'].map(l => (
        <MenubarMenu key={l}>
          <MenubarTrigger>{l}</MenubarTrigger>
          <MenubarContent aria-label={l}><MenubarItem>Undo</MenubarItem></MenubarContent>
        </MenubarMenu>
      ))}
    </Menubar>
  ),
  play: async ({ canvas }) => {
    const bar = canvas.getByRole('menubar');
    const long = canvas.getByRole('menuitem', { name: 'Edit and format' });
    await expect(Math.round(rect(long).height)).toBe(28);
    await expect(Math.round(rect(bar).height)).toBe(36);
    const triggers = canvas.getAllByRole('menuitem');
    await expect(Math.round(rect(triggers[3]).right)).toBeLessThanOrEqual(Math.round(rect(bar).right));
  },
};

export const OpenDark: Story = { render: () => <EditorMenubar defaultValue="edit" />, tags: ['!dev'], globals: { theme: 'Dark' } };
export const OpenCorporate: Story = { render: () => <EditorMenubar defaultValue="edit" />, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
