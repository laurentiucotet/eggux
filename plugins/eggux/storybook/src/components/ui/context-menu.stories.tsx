import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Archive, Copy, Eye, FileText, Link, Mail, Pencil, Share2, Trash2 } from '@/components/icons';
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from './context-menu';

type Args = {
  title: string;
  width: number;
  showIcons: boolean;
  showShortcuts: boolean;
  showSubMenu: boolean;
  showCheckbox: boolean;
  showDestructive: boolean;
};

const body = within(document.body);

function Demo({ title, width, showIcons, showShortcuts, showSubMenu, showCheckbox, showDestructive }: Args) {
  const [hidden, setHidden] = React.useState(false);
  const [sort, setSort] = React.useState('date');
  const icon = (node: React.ReactNode) => (showIcons ? node : undefined);
  const key = (text: string) => (showShortcuts ? text : undefined);
  return (
    <ContextMenu>
      <ContextMenuTrigger
        label={title}
        style={{ width }}
        className="flex h-40 max-w-full flex-col items-start justify-center gap-1 rounded-lg border border-dashed border-border bg-muted/40 p-4 text-sm"
      >
        <span className="max-w-full truncate font-medium text-foreground">{title}</span>
        <span className="max-w-full text-muted-foreground">Right click, long press or press Shift+F10.</span>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>Invoice actions</ContextMenuLabel>
        <ContextMenuItem icon={icon(<Eye />)} shortcut={key('Enter')}>Open</ContextMenuItem>
        <ContextMenuItem icon={icon(<Pencil />)} shortcut={key('F2')}>Rename</ContextMenuItem>
        <ContextMenuItem icon={icon(<Copy />)} shortcut={key('Ctrl+D')}>Duplicate</ContextMenuItem>
        {showSubMenu ? (
          <ContextMenuSub>
            <ContextMenuSubTrigger icon={icon(<Share2 />)}>Share</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem icon={icon(<Link />)}>Copy link</ContextMenuItem>
              <ContextMenuItem icon={icon(<Mail />)}>Send by email</ContextMenuItem>
              <ContextMenuItem icon={icon(<FileText />)}>Export as PDF</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        ) : null}
        {showCheckbox ? (
          <>
            <ContextMenuSeparator />
            <ContextMenuCheckboxItem checked={hidden} onCheckedChange={setHidden}>Show archived</ContextMenuCheckboxItem>
            <ContextMenuRadioGroup value={sort} onValueChange={setSort}>
              <ContextMenuRadioItem value="date">Sort by date</ContextMenuRadioItem>
              <ContextMenuRadioItem value="amount">Sort by amount</ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </>
        ) : null}
        {showDestructive ? (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem variant="destructive" icon={icon(<Trash2 />)}>Delete</ContextMenuItem>
          </>
        ) : null}
        <ContextMenuItem disabled icon={icon(<Archive />)}>Archive (needs approval)</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

const meta = {
  title: 'Components/Layout/Context Menu',
  parameters: {
    docs: {
      description: {
        component:
          'A menu at the pointer: right click, long press on touch, or Shift+F10 / the Menu key on the focused area. Items, a sub menu, checkbox and radio items, a destructive item last. Arrows move, Right opens a sub menu, Escape closes and returns focus to the area. Never the only way to do something: put every action in the interface too. Code only (no Figma component yet). Surface copies Dropdown Menu.',
      },
    },
  },
  args: { title: 'Invoice INV-2041, Acme Ltd, 1,240.00 EUR', width: 360, showIcons: true, showShortcuts: true, showSubMenu: true, showCheckbox: true, showDestructive: true },
  argTypes: {
    title: { name: 'Area label', control: 'text', description: 'Accessible name of the area and its heading.', table: { category: 'Area' } },
    width: { name: 'Width', control: { type: 'range', min: 240, max: 480, step: 8 }, description: 'Width of the area in px.', table: { category: 'Area' } },
    showIcons: { name: 'Show icons', control: 'boolean', description: 'A 16 px icon before each label.', table: { category: 'Parts' } },
    showShortcuts: { name: 'Show shortcuts', control: 'boolean', description: 'Shortcut text at the end of items.', table: { category: 'Parts' } },
    showSubMenu: { name: 'Show sub menu', control: 'boolean', description: 'A Share item with a sub menu.', table: { category: 'Parts' } },
    showCheckbox: { name: 'Show checkbox and radio items', control: 'boolean', description: 'A checked item and a sort choice.', table: { category: 'Parts' } },
    showDestructive: { name: 'Show destructive item', control: 'boolean', description: 'Delete, in red, last.', table: { category: 'Parts' } },
  },
  render: args => <Demo {...args} />,
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvas }) => {
    const area = canvas.getByRole('group', { name: /Invoice INV-2041/ });
    await expect(area).toHaveAccessibleDescription(/Shift plus F10/);
    // Right click opens the menu at the pointer.
    await userEvent.pointer({ keys: '[MouseRight]', target: area, coords: { clientX: 120, clientY: 100 } });
    const menu = await body.findByRole('menu');
    await waitFor(() => expect(Math.abs(menu.getBoundingClientRect().left - 120)).toBeLessThan(8));
    await expect(body.getByRole('menuitem', { name: /^Open/ })).toBeVisible();
    await expect(body.getByRole('menuitemcheckbox', { name: 'Show archived' })).toHaveAttribute('aria-checked', 'false');
    await expect(body.getByRole('menuitem', { name: /^Archive/ })).toHaveAttribute('aria-disabled', 'true');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('menu')).toBeNull());

    // Keyboard path: Shift+F10 on the focused area, arrows, sub menu, Escape returns focus.
    area.focus();
    await userEvent.keyboard('{Shift>}{F10}{/Shift}');
    await body.findByRole('menu');
    const share = body.getByRole('menuitem', { name: 'Share' });
    share.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(await body.findByRole('menuitem', { name: 'Copy link' })).toBeVisible();
    await userEvent.keyboard('{ArrowLeft}');
    await waitFor(() => expect(body.queryByRole('menuitem', { name: 'Copy link' })).toBeNull());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('menu')).toBeNull());
    await waitFor(() => expect(area).toHaveFocus());

    // The Menu key opens it too; a checkbox item toggles and closes the menu.
    await userEvent.keyboard('{ContextMenu}');
    const check = await body.findByRole('menuitemcheckbox', { name: 'Show archived' });
    await userEvent.click(check);
    await waitFor(() => expect(body.queryByRole('menu')).toBeNull());
    await userEvent.pointer({ keys: '[MouseRight]', target: area });
    await expect(await body.findByRole('menuitemcheckbox', { name: 'Show archived' })).toHaveAttribute('aria-checked', 'true');
    await userEvent.keyboard('{Escape}');
  },
};

/** The same menu with its parts switched off: items only. */
export const ItemsOnly: Story = {
  args: { showIcons: false, showShortcuts: false, showSubMenu: false, showCheckbox: false, showDestructive: false },
};

/* Hidden checks */

export const Stress: Story = {
  tags: ['!dev'],
  args: { width: 240, title: 'Quarterly statement for Acme International Holdings and Subsidiaries, March 2026' },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  play: async ({ canvas }) => {
    const area = canvas.getByRole('group', { name: /Quarterly statement/ });
    await expect(area.scrollWidth).toBeLessThanOrEqual(area.clientWidth + 1);
    area.focus();
    await userEvent.keyboard('{Shift>}{F10}{/Shift}');
    const menu = await body.findByRole('menu');
    const rect = menu.getBoundingClientRect();
    await expect(rect.left).toBeGreaterThanOrEqual(0);
    await expect(rect.right).toBeLessThanOrEqual(window.innerWidth + 1);
    await userEvent.keyboard('{Escape}');
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
