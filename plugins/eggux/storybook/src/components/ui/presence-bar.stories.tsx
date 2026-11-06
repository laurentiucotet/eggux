import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test';
import { PresenceBar, type PresencePerson } from './presence-bar';

const people: PresencePerson[] = [
  { name: 'Elena Barbu', location: 'editing Section 2' },
  { name: 'Maria Ilie', location: 'viewing the summary' },
  { name: 'Dana Cristea', location: 'editing the budget table' },
  { name: 'Radu Stan', location: 'viewing Section 1' },
  { name: 'Ioana Marin', location: 'viewing Section 3' },
  { name: 'Mihai Ionescu', location: 'editing the title' },
];

const meta = {
  title: 'Components/Avatar/Presence Bar',
  component: PresenceBar,
  parameters: {
    docs: { description: { component: 'Who else has this document, record or board open right now: a live dot, their avatars and a short sentence. Top right of the editor, next to Share; only shows when someone else is present. Each avatar is a button named with the person and place; hover or focus shows it, click jumps there. Figma: Avatar page / Presence Bar. Guide: eggux build-ui/patterns/sharing-and-invites.md' } },
  },
  args: { people, label: 'Elena and 5 others are here', onSelect: fn(), onMoreClick: fn() },
} satisfies Meta<typeof PresenceBar>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma: 8 px live dot, 8 gap, Avatar Group sm (3 avatars + "+3" = 78), muted 12/16 label; 24 high.
export const Default: Story = {
  play: async ({ canvas, canvasElement, args }) => {
    const bar = canvas.getByRole('group', { name: 'People viewing' });
    await expect(Math.round(box(bar).height)).toBe(24);
    const dot = canvasElement.querySelector('[data-slot="status-dot"] > [aria-hidden="true"]')!;
    await expect(Math.round(box(dot).width)).toBe(8);
    const stack = canvasElement.querySelector('[data-slot="avatar-group-avatars"]')!;
    await expect(Math.round(box(stack).left - box(dot).right)).toBe(8);
    await expect(Math.round(box(stack).width)).toBe(78);
    await expect(getComputedStyle(canvas.getByText('Elena and 5 others are here')).fontSize).toBe('12px');
    // Each avatar is a button named with the person and place; click jumps there.
    const elena = canvas.getByRole('button', { name: 'Elena Barbu, editing Section 2' });
    await userEvent.hover(elena);
    await expect(await screen.findByRole('tooltip')).toHaveTextContent('Elena Barbu, editing Section 2');
    await userEvent.click(elena);
    await expect(args.onSelect).toHaveBeenCalledWith(people[0]);
    await userEvent.unhover(elena);
    await expect(canvas.getByRole('button', { name: 'Show 3 more people here' })).toBeVisible();
  },
};

// Keyboard: Tab moves through the people and +N; focus shows the tooltip; Enter jumps there.
export const Keyboard: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Elena Barbu, editing Section 2' })).toHaveFocus();
    await userEvent.tab();
    const maria = canvas.getByRole('button', { name: 'Maria Ilie, viewing the summary' });
    await expect(maria).toHaveFocus();
    await waitFor(() => expect(screen.getByRole('tooltip')).toHaveTextContent('Maria Ilie, viewing the summary'));
    await userEvent.keyboard('{Enter}');
    await expect(args.onSelect).toHaveBeenCalledWith(people[1]);
    await userEvent.tab();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Show 3 more people here' })).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(args.onMoreClick).toHaveBeenCalledTimes(1);
  },
};

// Up to 4 people show without +N; the default label sums them up.
export const FewPeople: Story = {
  args: { people: people.slice(0, 2), label: undefined },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText('Elena and 1 other is here')).toBeVisible();
    await expect(canvasElement.querySelectorAll('[data-slot="presence-bar-person"]')).toHaveLength(2);
    await expect(canvasElement.querySelector('[data-slot="avatar-group-more"]')).toBeNull();
  },
};

// Stress: alone it renders nothing; narrow (127) and long labels truncate, dot and avatars keep size.
export const Stress: Story = {
  tags: ['!dev'],
  render: args => (
    <div className="flex flex-col gap-4">
      <div data-testid="empty"><PresenceBar {...args} people={[]} /></div>
      <div className="flex w-[127px]"><PresenceBar {...args} data-testid="narrow" /></div>
      <div className="flex w-[254px]">
        <PresenceBar {...args} people={[...people.slice(0, 3), { ...people[3]!, idle: true }]} label="Elena, Maria, Dana and Radu are reviewing the Q3 board report" data-testid="long" />
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId('empty')).toBeEmptyDOMElement();
    for (const id of ['narrow', 'long']) {
      const bar = canvas.getByTestId(id);
      const label = bar.querySelector('[data-slot="avatar-group-label"]')!;
      await expect(Math.round(box(bar).height)).toBe(24);
      await expect(Math.round(box(bar.querySelector('[data-slot="status-dot"] > [aria-hidden="true"]')!).width)).toBe(8);
      await expect(label.scrollWidth).toBeGreaterThan(label.clientWidth);
      await expect(box(label).right).toBeLessThanOrEqual(box(bar.parentElement!).right + 0.5);
    }
    // 4 people: all 4 avatars, no +N; idle people fade.
    await expect(getComputedStyle(canvas.getByRole('button', { name: 'Radu Stan, viewing Section 1' })).opacity).toBe('0.7');
    await expect(canvas.getByTestId('long').querySelectorAll('[data-slot="presence-bar-person"]')).toHaveLength(4);
  },
};

export const DefaultDark: Story = { ...FewPeople, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...FewPeople, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
