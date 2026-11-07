import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent } from 'storybook/test';
import { Bold, Image, Italic, LayoutGrid, Link, List, Maximize, Minus, Plus, TextQuote, Underline } from '@/components/icons';
import { ButtonIcon } from './button-icon';
import { DropdownMenuItem } from './dropdown-menu';
import { Toggle } from './toggle';
import { Toolbar, ToolbarSeparator } from './toolbar';

const formatting = (
  <>
    <Toggle size="sm" label="Bold" icon={<Bold />} defaultPressed />
    <Toggle size="sm" label="Italic" icon={<Italic />} />
    <Toggle size="sm" label="Underline" icon={<Underline />} />
    <ToolbarSeparator />
    <Toggle size="sm" label="Bulleted list" icon={<List />} />
    <Toggle size="sm" label="Quote" icon={<TextQuote />} />
    <ToolbarSeparator />
    <ButtonIcon variant="ghost" size="sm" label="Insert link" icon={<Link />} />
    <ButtonIcon variant="ghost" size="sm" label="Insert image" icon={<Image />} />
  </>
);

const meta = {
  title: 'Components/Toolbar/Toolbar',
  component: Toolbar,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'A row or column of related sm controls in groups (Toggles for formats that stay on, Button Icons for one-off actions) with a Separator between groups and an overflow "More" menu. Style default sits in an editor or panel header; floating is a popover surface over a canvas. One Tab stop, arrows move between items. Selected rows use Table Toolbar or Bulk Action Bar; list filters use Page Toolbar. Figma: Toolbar page / Toolbar. Guide: eggux build-ui/components/rich-text-editor.md' } },
  },
  args: {
    'aria-label': 'Formatting',
    children: formatting,
    overflow: <><DropdownMenuItem>Code block</DropdownMenuItem><DropdownMenuItem>Table</DropdownMenuItem></>,
  },
} satisfies Meta<typeof Toolbar>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma Style=default: 298 × 40, 32 items 2 apart, separators 9 wide; one Tab stop, arrows move, More opens the menu.
export const Default: Story = {
  render: args => <div className="w-max"><Toolbar {...args} /></div>,
  play: async ({ canvas }) => {
    const toolbar = canvas.getByRole('toolbar', { name: 'Formatting' });
    await expect([Math.round(box(toolbar).width), Math.round(box(toolbar).height)]).toEqual([298, 40]);
    await userEvent.tab();
    const bold = canvas.getByRole('button', { name: 'Bold' });
    await expect(bold).toHaveFocus();
    await expect(bold).toHaveAttribute('aria-pressed', 'true');
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('button', { name: 'Italic' })).toHaveFocus();
    await userEvent.keyboard('{End}');
    const more = canvas.getByRole('button', { name: 'More' });
    await expect(more).toHaveFocus();
    await expect(canvas.getByRole('button', { name: 'Bold' })).toHaveAttribute('tabindex', '-1');
    await userEvent.keyboard('{Enter}');
    await expect(await screen.findByRole('menuitem', { name: 'Table' })).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
  },
};

// Figma Style=floating, horizontal (zoom bar) and vertical (tool column) over a canvas.
export const Floating: Story = {
  render: () => (
    <div className="relative h-[280px] w-[560px] rounded-lg bg-muted">
      <Toolbar aria-label="Canvas tools" orientation="vertical" toolbarStyle="floating" className="absolute top-4 left-4" overflow={<DropdownMenuItem>Rulers</DropdownMenuItem>}>
        <ButtonIcon variant="ghost" size="sm" label="Zoom in" icon={<Plus />} />
        <ButtonIcon variant="ghost" size="sm" label="Zoom out" icon={<Minus />} />
        <ToolbarSeparator orientation="horizontal" />
        <ButtonIcon variant="ghost" size="sm" label="Fit to screen" icon={<Maximize />} />
        <Toggle size="sm" label="Show grid" icon={<LayoutGrid />} />
      </Toolbar>
    </div>
  ),
  play: async ({ canvas }) => {
    const toolbar = canvas.getByRole('toolbar', { name: 'Canvas tools' });
    await expect(toolbar).toHaveAttribute('aria-orientation', 'vertical');
    await expect(Math.round(box(toolbar).width)).toBe(42);
    await userEvent.tab();
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('button', { name: 'Zoom out' })).toHaveFocus();
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, render: Floating.render };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: Floating.render };
