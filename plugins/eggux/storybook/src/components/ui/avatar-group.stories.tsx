import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent } from 'storybook/test';
import { Avatar } from './avatar';
import { AvatarGroup, type AvatarGroupSize } from './avatar-group';

const people = [
  ['AP', 'Ana Popescu'],
  ['MI', 'Mihai Ionescu'],
  ['DC', 'Dana Cristea'],
] as const;
const avatars = people.map(([i, n]) => <Avatar key={i} initials={i} name={n} />);

const meta = {
  title: 'Components/Avatar/Avatar Group',
  component: AvatarGroup,
  parameters: {
    docs: { description: { component: 'Stacked avatars for assignees, participants and "shared with": 3 to 5 avatars, then "+N" that opens the full list. Show names says who ("Ana, Mihai and 3 others"), Show label says what ("Maintained by 3 analysts"); both truncate on one line. The group is named with the count. Figma: Avatar page / Avatar Group. Guide: eggux build-ui/components/avatar.md' } },
  },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'default', 'lg'] } },
  args: {
    'aria-label': '6 assignees',
    more: 3,
    moreLabel: 'Show 3 more assignees',
    moreTooltip: 'Elena Barbu, Radu Stan, Ioana Marin',
    onMoreClick: fn(),
    children: avatars,
  },
} satisfies Meta<typeof AvatarGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();
const q = (root: Element, slot: string) => root.querySelector(`[data-slot="${slot}"]`)!;

// Figma Size=default: 4 avatars of 32 overlapping 8 = 104 wide, 2 px background ring, +3 opens the list.
export const Default: Story = {
  play: async ({ canvas, canvasElement, args }) => {
    const group = canvas.getByRole('group', { name: '6 assignees' });
    const stack = q(group, 'avatar-group-avatars');
    await expect(Math.round(box(stack).width)).toBe(104);
    await expect(Math.round(box(stack).height)).toBe(32);
    const surfaces = canvasElement.querySelectorAll('[data-slot="avatar-surface"]');
    await expect(getComputedStyle(surfaces[0]).boxShadow).toContain('0px 0px 0px 2px');
    // +N is focusable, shows the full list on focus and runs its action.
    const more = canvas.getByRole('button', { name: 'Show 3 more assignees' });
    await userEvent.tab();
    await expect(more).toHaveFocus();
    await expect(await screen.findByRole('tooltip')).toHaveTextContent('Elena Barbu, Radu Stan, Ioana Marin');
    await userEvent.keyboard('{Enter}');
    await expect(args.onMoreClick).toHaveBeenCalledTimes(1);
    await userEvent.keyboard('{Escape}');
  },
};

const sizes: [AvatarGroupSize, number, number][] = [['sm', 78, 24], ['default', 104, 32], ['lg', 136, 40]];

export const Sizes: Story = {
  render: args => (
    <div className="flex flex-col gap-4">
      {sizes.map(([s]) => <AvatarGroup key={s} {...args} size={s} aria-label={`6 assignees (${s})`} />)}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const groups = canvasElement.querySelectorAll('[data-slot="avatar-group"]');
    for (const [i, [, w, h]] of sizes.entries()) {
      const stack = q(groups[i], 'avatar-group-avatars');
      await expect(Math.round(box(stack).width)).toBe(w);
      await expect(Math.round(box(stack).height)).toBe(h);
      // Every avatar takes the group's size, even one that asks for another.
      for (const a of groups[i].querySelectorAll('[data-slot="avatar"]')) await expect(Math.round(box(a).width)).toBe(h);
    }
  },
};

// Show names (who, foreground medium) and Show label (what, muted), 12 px after the avatars (8 on sm).
export const NamesAndLabel: Story = {
  render: args => (
    <div className="flex flex-col gap-4">
      <AvatarGroup {...args} names="Ana, Mihai and 3 others" aria-label="6 owners" />
      <AvatarGroup {...args} label="Maintained by 6 analysts" aria-label="6 analysts" />
      <AvatarGroup {...args} size="sm" names="Ana, Mihai and 3 others" aria-label="6 reviewers" />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const names = canvas.getAllByText('Ana, Mihai and 3 others');
    const groups = canvasElement.querySelectorAll('[data-slot="avatar-group"]');
    await expect(Math.round(box(names[0]).left - box(q(groups[0], 'avatar-group-avatars')).right)).toBe(12);
    await expect(Math.round(box(names[1]).left - box(q(groups[2], 'avatar-group-avatars')).right)).toBe(8);
    await expect(getComputedStyle(names[0]).fontSize).toBe('14px');
    await expect(getComputedStyle(names[0]).fontWeight).toBe('500');
    await expect(getComputedStyle(names[1]).fontSize).toBe('12px');
    const label = canvas.getByText('Maintained by 6 analysts');
    await expect(getComputedStyle(label).fontWeight).toBe('400');
    await expect(getComputedStyle(label).color).not.toBe(getComputedStyle(names[0]).color);
  },
};

// Stress: long names truncate at 240 (200 on sm) and inside a 240 card; avatars never shrink; no +N.
export const Stress: Story = {
  tags: ['!dev'],
  render: args => (
    <div className="flex flex-col gap-4">
      <AvatarGroup {...args} names="Ana Popescu, Mihai Ionescu, Dana Cristea and 6 others from the Acme finance team" aria-label="9 owners" data-testid="long" />
      <AvatarGroup {...args} size="sm" label="Shared with the finance team and the external auditors of Acme" aria-label="9 people" data-testid="sm" />
      <div className="w-[240px] rounded-lg border p-4">
        <AvatarGroup {...args} size="sm" names="Ana Popescu, Mihai Ionescu and 6 others" aria-label="8 reviewers" data-testid="card" />
      </div>
      <AvatarGroup aria-label="2 assignees" data-testid="few">{avatars.slice(0, 2)}</AvatarGroup>
    </div>
  ),
  play: async ({ canvas }) => {
    const long = canvas.getByTestId('long').querySelector('[data-slot="avatar-group-names"]')!;
    await expect(Math.round(box(long).width)).toBe(240);
    await expect(long.scrollWidth).toBeGreaterThan(long.clientWidth);
    await expect(Math.round(box(long).height)).toBe(20);
    const sm = canvas.getByTestId('sm').querySelector('[data-slot="avatar-group-label"]')!;
    await expect(Math.round(box(sm).width)).toBe(200);
    const card = canvas.getByTestId('card');
    await expect(Math.round(box(card).width)).toBeLessThanOrEqual(206);
    await expect(Math.round(box(card.querySelector('[data-slot="avatar-group-avatars"]')!).width)).toBe(78);
    await expect(canvas.getByTestId('few').querySelector('[data-slot="avatar-group-more"]')).toBeNull();
  },
};

export const NamesAndLabelDark: Story = { ...NamesAndLabel, tags: ['!dev'], globals: { theme: 'Dark' } };
export const NamesAndLabelCorporate: Story = { ...NamesAndLabel, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
