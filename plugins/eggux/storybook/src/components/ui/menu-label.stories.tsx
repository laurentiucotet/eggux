import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor } from 'storybook/test';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';

// Menu Label is a part of the Menu (DropdownMenuLabel in dropdown-menu.tsx). These stories check it
// against the Figma Menu Label component.
const meta = {
  title: 'Components/Menu/Menu Label',
  component: DropdownMenuLabel,
  parameters: {
    docs: { description: { component: 'Group heading inside a Menu, not clickable or focusable; groups are divided by a Separator. Figma: Menu page / Menu Label. Guide: eggux build-ui/components/dropdown-menu.md' } },
  },
} satisfies Meta<typeof DropdownMenuLabel>;
export default meta;
type Story = StoryObj<typeof meta>;

const probe = (cls: string) => { const p = document.createElement('span'); p.className = cls; document.body.append(p); return { style: getComputedStyle(p), remove: () => p.remove() }; };
const rect = (el: Element) => el.getBoundingClientRect();

function GroupedMenu({ open = true }: { open?: boolean }) {
  return (
    <DropdownMenu defaultOpen={open} modal={false}>
      <DropdownMenuTrigger asChild><Button variant="outline">Invoice</Button></DropdownMenuTrigger>
      <DropdownMenuContent align="start" aria-label="Invoice">
        <DropdownMenuGroup aria-labelledby="label-details">
          <DropdownMenuLabel id="label-details">Details</DropdownMenuLabel>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup aria-labelledby="label-share">
          <DropdownMenuLabel id="label-share">Share</DropdownMenuLabel>
          <DropdownMenuItem>Copy link</DropdownMenuItem>
          <DropdownMenuItem>Send by email</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Figma Menu Label: 32 high, 8 px sides, 6 px top and bottom, ui/label (14/20 medium), popover text.
// Not focusable: the arrows skip it.
export const Default: Story = {
  parameters: { controls: { disable: true } },
  render: () => <GroupedMenu open={false} />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Invoice' }));
    await screen.findByRole('menu');
    const label = screen.getByText('Details');
    const s = getComputedStyle(label);
    await expect(Math.round(rect(label).height)).toBe(32);
    await expect([s.paddingLeft, s.paddingTop, s.paddingRight, s.paddingBottom]).toEqual(['8px', '6px', '8px', '6px']);
    await expect([s.fontSize, s.lineHeight, s.fontWeight]).toEqual(['14px', '20px', '500']);
    const fg = probe('text-popover-foreground');
    await expect(s.color).toBe(fg.style.color);
    fg.remove();
    await expect(label).not.toHaveAttribute('tabindex');
    await expect(label).not.toHaveAttribute('role', 'menuitem');
    // The groups are named by their labels.
    await expect(screen.getByRole('group', { name: 'Share' })).toBeInTheDocument();
    // Arrows go from the last item of Details to the first of Share, skipping the label.
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    await expect(screen.getByRole('menuitem', { name: 'Copy link' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
  },
};

// Stress: a long label wraps (Figma) and stays inside the 224 menu.
export const Stress: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => (
    <DropdownMenu defaultOpen modal={false}>
      <DropdownMenuTrigger asChild><Button variant="outline">Invoice</Button></DropdownMenuTrigger>
      <DropdownMenuContent align="start" aria-label="Invoice">
        <DropdownMenuLabel>Details of the billing contact at Acme Corporation Europe</DropdownMenuLabel>
        <DropdownMenuItem>Edit</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async () => {
    const menu = await screen.findByRole('menu');
    const label = screen.getByText(/Details of the billing contact/);
    await expect(Math.round(rect(menu).width)).toBe(224);
    await expect(rect(label).right).toBeLessThanOrEqual(rect(menu).right);
    await expect(label.scrollWidth).toBeLessThanOrEqual(label.clientWidth);
  },
};

export const OpenDark: Story = { parameters: { controls: { disable: true } }, render: () => <GroupedMenu />, tags: ['!dev'], globals: { theme: 'Dark' } };
export const OpenCorporate: Story = { parameters: { controls: { disable: true } }, render: () => <GroupedMenu />, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
