import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent } from 'storybook/test';
import { Check, Plus } from '@/components/icons';
import { Avatar } from './avatar';
import { AvatarGroup } from './avatar-group';
import { Badge } from './badge';
import { ButtonIcon } from './button-icon';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';
import { EntityCard, EntityCardMenuButton } from './entity-card';

const details = [
  { label: 'Open invoices', value: '€12,450.00' },
  { label: 'Owner', value: 'Ana Popescu' },
  { label: 'Last order', value: 'Oct 14, 2026' },
];

const people = (
  <AvatarGroup size="sm" more={3} moreLabel="Show 3 more people">
    <Avatar initials="AP" name="Ana Popescu" />
    <Avatar initials="MI" name="Maria Ilie" />
    <Avatar initials="DC" name="Dan Cristea" />
  </AvatarGroup>
);

const meta = {
  title: 'Components/Card/Entity Card',
  component: EntityCard,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Summary of one object (customer, project, vendor, asset) in a grid or board: leading avatar or icon, title and subtitle, one direct action, a menu, status and tags, 2-4 key details and a footer with people and last update. The whole card is clickable only with one destination; then the menu and action stay separate controls. A toggled action shows its state with State=selected. Figma: Card page / Entity Card. Guide: eggux build-ui/components/card.md' } },
  },
  args: {
    title: 'Northwind Traders',
    description: 'Customer · Berlin',
    href: '#customer',
    leading: <Avatar size="lg" initials="NT" />,
    tags: <><Badge variant="success" dot>Active</Badge><Badge variant="outline">Enterprise</Badge></>,
    details,
    people,
    footer: 'Updated 2 h ago',
  },
  render: args => (
    <div className="w-[320px]">
      <EntityCard
        {...args}
        menu={
          <DropdownMenu>
            <DropdownMenuTrigger asChild><EntityCardMenuButton title={args.title} /></DropdownMenuTrigger>
            <DropdownMenuContent align="end"><DropdownMenuItem>Edit</DropdownMenuItem><DropdownMenuItem>Archive</DropdownMenuItem></DropdownMenuContent>
          </DropdownMenu>
        }
      />
    </div>
  ),
} satisfies Meta<typeof EntityCard>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma State=default: 320 wide, 16 padding, the title is the card link, the menu is its own control.
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const card = canvasElement.querySelector('[data-slot="entity-card"]')!;
    await expect(Math.round(box(card).width)).toBe(320);
    await expect(getComputedStyle(card).paddingTop).toBe('16px');
    await expect(canvas.getByRole('link', { name: 'Northwind Traders' })).toHaveAttribute('href', '#customer');
    await expect(canvas.getAllByRole('term')[0]).toHaveTextContent('Open invoices');
    await userEvent.click(canvas.getByRole('button', { name: 'More actions for Northwind Traders' }));
    await expect(await screen.findByRole('menuitem', { name: 'Archive' })).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
  },
};

// Show actions + State=selected: plus to add, check once added, the border in ring.
export const Selected: Story = {
  render: function Render(args) {
    const [added, setAdded] = React.useState(false);
    const onToggle = fn(() => setAdded(a => !a));
    return (
      <div className="w-[320px]">
        <EntityCard
          {...args}
          href={undefined}
          selected={added}
          actions={<ButtonIcon variant="outline" icon={added ? <Check /> : <Plus />} label={added ? 'Remove Northwind Traders from the list' : 'Add Northwind Traders to the list'} aria-pressed={added} onClick={onToggle} />}
        />
      </div>
    );
  },
  play: async ({ canvas, canvasElement }) => {
    const add = canvas.getByRole('button', { name: /Add Northwind/ });
    await userEvent.click(add);
    await expect(canvas.getByRole('button', { name: /Remove Northwind/ })).toHaveAttribute('aria-pressed', 'true');
    await expect(canvasElement.querySelector('[data-slot="entity-card"]')).toHaveAttribute('data-selected', 'true');
  },
};

// Stress: long title and subtitle truncate at 240; a long value stays on one line. Tests only.
export const Stress: Story = {
  tags: ['!dev'],
  args: {
    title: 'Northwind Traders International Holdings GmbH & Co. KG',
    description: 'Customer · Berlin, Hamburg, Munich and Frankfurt am Main',
    details: [{ label: 'Open invoices across all subsidiaries', value: '€1,212,450.00' }],
  },
  render: args => <div className="w-[240px]"><EntityCard {...args} /></div>,
  play: async ({ canvas }) => {
    const heading = canvas.getByRole('heading');
    await expect(heading.scrollWidth).toBeGreaterThan(heading.clientWidth);
    await expect(Math.round(box(canvas.getByText('€1,212,450.00')).height)).toBe(20);
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
