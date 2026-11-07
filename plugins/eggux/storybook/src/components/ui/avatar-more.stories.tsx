import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, within } from 'storybook/test';
import { X } from '@/components/icons';
import { Avatar } from './avatar';
import { AvatarGroup } from './avatar-group';
import { AvatarCount, AvatarGroupAdd, AvatarGroupPopover, AvatarLabel, AvatarRing, type AvatarPerson } from './avatar-more';
import { Button } from './button';
import { ButtonIcon } from './button-icon';

const meta = {
  title: 'Components/Avatar/More avatar types',
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'More ways to show people, on Avatar and Avatar Group: Avatar Label (avatar, name, second line, sm / default / lg, link and action), Avatar Group Popover (+N opens everyone), Avatar Group Add (dashed + to invite), groups with status and square company logos, Avatar Ring (brand, success, muted) and Avatar Count (a count on the corner). Guide: eggux build-ui/components/avatar.md' } },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();
const onAdd = fn();
const team: AvatarPerson[] = [
  { name: 'Ana Popescu', description: 'Finance lead' },
  { name: 'Mihai Ionescu', description: 'Designer' },
  { name: 'Dana Constantin', description: 'Engineer' },
  { name: 'Radu Marin', description: 'Engineer' },
  { name: 'Sofia Barbu', description: 'Support' },
  { name: 'Ioana Georgescu', description: 'Sales' },
  { name: 'Victor Stan', description: 'Product manager' },
];

export const Labels: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <AvatarLabel size="sm" name="Ana Popescu" description="ana@acme.com" />
      <AvatarLabel name="Ana Popescu" description="Finance lead" href="#ana" avatar={{ status: 'online' }} />
      <AvatarLabel size="lg" name="Ana Popescu" description="Finance lead · Bucharest" />
      <AvatarLabel name="Mihai Ionescu" description="mihai@acme.com" action={<ButtonIcon variant="ghost" size="xs" icon={<X />} label="Remove Mihai Ionescu" />} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const [sm, def, lg] = Array.from(canvasElement.querySelectorAll('[data-slot="avatar-label"]'));
    await expect(box(sm!).height).toBe(32);
    await expect(box(def!).height).toBe(36);
    await expect(box(lg!).height).toBe(44);
    await expect(c.getByRole('link', { name: 'Ana Popescu' })).toHaveAttribute('href', '#ana');
    await expect(c.getByRole('button', { name: 'Remove Mihai Ionescu' })).toBeVisible();
  },
};

export const GroupTypes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <AvatarGroupPopover people={team} title="Shared with" label="7 people" footer={<Button size="sm" variant="outline" className="w-full">Invite people</Button>} />
      <AvatarGroup label="Assignees">
        <Avatar initials="AP" name="Ana Popescu" />
        <Avatar initials="MI" name="Mihai Ionescu" />
        <AvatarGroupAdd label="Assign someone" onClick={onAdd} />
      </AvatarGroup>
      <AvatarGroup size="lg" names="Ana, Mihai and Dana are online">
        <Avatar initials="AP" name="Ana Popescu" status="online" />
        <Avatar initials="MI" name="Mihai Ionescu" status="online" />
        <Avatar initials="DC" name="Dana Constantin" status="away" />
      </AvatarGroup>
      <AvatarGroup size="sm" label="Used by 3 companies">
        <Avatar shape="square" initials="NW" name="Northwind" />
        <Avatar shape="square" initials="KS" name="Kestrel" />
        <Avatar shape="square" initials="FS" name="Fieldstone" />
      </AvatarGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole('button', { name: /show all 7 people/ }));
    const dialog = await screen.findByRole('dialog');
    await expect(within(dialog).getAllByRole('listitem')).toHaveLength(7);
    await expect(within(dialog).getByText('Victor Stan')).toBeVisible();
    await userEvent.keyboard('{Escape}');
    const add = c.getByRole('button', { name: 'Assign someone' });
    await expect(box(add).width).toBe(32);
    await userEvent.click(add);
    await expect(onAdd).toHaveBeenCalled();
  },
};

export const RingAndCount: Story = {
  render: () => (
    <div className="flex items-center gap-8 p-2">
      <AvatarRing ringLabel="new update"><Avatar size="lg" initials="AP" name="Ana Popescu" /></AvatarRing>
      <AvatarRing tone="success" ringLabel="in a call"><Avatar size="lg" initials="MI" name="Mihai Ionescu" /></AvatarRing>
      <AvatarRing tone="muted"><Avatar size="lg" initials="DC" name="Dana Constantin" /></AvatarRing>
      <AvatarCount count={3} countLabel="3 notifications"><Avatar size="lg" initials="RM" name="Radu Marin" /></AvatarCount>
      <AvatarCount count={120}><Avatar size="lg" shape="square" initials="NW" name="Northwind" /></AvatarCount>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByText(', new update')).toBeInTheDocument();
    await expect(c.getByText('99+')).toBeVisible();
    const ring = canvasElement.querySelector('[data-slot="avatar-ring"]')!;
    await expect(getComputedStyle(ring).boxShadow).toContain('4px');
  },
};

export const EdgeCases: Story = {
  tags: ['!dev'],
  render: () => (
    <div className="flex w-60 flex-col gap-4">
      <AvatarLabel size="lg" name="Bartholomew Alexandrescu-Vasilescu" description="bartholomew.alexandrescu-vasilescu@a-very-long-domain.example" />
      <AvatarGroupPopover people={team.slice(0, 2)} />
      <AvatarGroupPopover size="sm" max={5} people={[...team, ...team.map((p) => ({ ...p, name: `${p.name} 2` }))]} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const label = canvasElement.querySelector('[data-slot="avatar-label"]')!;
    await expect(label.scrollWidth).toBeLessThanOrEqual(label.clientWidth + 1);
    // Two people fit: no "+N".
    await expect(c.getAllByRole('button', { name: /show all/ })).toHaveLength(1);
    await expect(c.getByText('+9')).toBeVisible();
  },
};

const All = () => (
  <div className="flex flex-col gap-6 bg-background p-6">
    <AvatarLabel name="Ana Popescu" description="Finance lead" avatar={{ status: 'online' }} />
    <AvatarGroupPopover people={team} label="7 people" />
    <AvatarGroup>
      <Avatar initials="AP" name="Ana Popescu" />
      <AvatarGroupAdd />
    </AvatarGroup>
    <div className="flex gap-8 p-2">
      <AvatarRing><Avatar size="lg" initials="AP" name="Ana Popescu" /></AvatarRing>
      <AvatarCount count={3}><Avatar size="lg" initials="RM" name="Radu Marin" /></AvatarCount>
    </div>
  </div>
);
export const AllDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, render: () => <All /> };
export const AllCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: () => <All /> };
