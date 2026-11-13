import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { MessageSquare, Star, Zap } from '@/components/icons';
import { AchievementCard, type AchievementState } from './achievement-card';

type Args = { title: string; description: string; state: AchievementState; current: number; showRarity: boolean; width: number };

const meta = {
  title: 'Components/Community/Achievement Card',
  parameters: {
    docs: {
      description: {
        component:
          'A milestone a member can earn: icon tile, title, what it takes and the state. Earned shows a badge and the date, in progress a progress bar ("3 of 5"), locked mutes the card and swaps the icon for a lock. State is always text, never colour alone. Code only (no Figma component yet).',
      },
    },
  },
  args: { title: 'Helpful neighbour', description: 'Answer 5 questions from other members.', state: 'in-progress', current: 3, showRarity: true, width: 400 },
  argTypes: {
    title: { name: 'Title', control: 'text', description: 'The achievement name.', table: { category: 'Card' } },
    description: { name: 'Description', control: 'text', description: 'What it takes.', table: { category: 'Card' } },
    state: { name: 'State', control: 'inline-radio', options: ['earned', 'in-progress', 'locked'], description: 'Earned, in progress or locked.', table: { category: 'Card' } },
    current: { name: 'Progress', control: { type: 'range', min: 0, max: 5, step: 1 }, description: 'Answers so far, of 5 (in progress).', table: { category: 'Card' } },
    width: { name: 'Width', control: { type: 'range', min: 276, max: 400, step: 4 }, description: 'Column width in px.', table: { category: 'Card' } },
    showRarity: { name: 'Show rarity', control: 'boolean', description: 'The "held by" line.', table: { category: 'Parts' } },
  },
  render: ({ title, description, state, current, showRarity, width }) => (
    <div style={{ width }}>
      <AchievementCard
        title={title}
        description={description}
        icon={<MessageSquare />}
        state={state}
        progress={{ current, total: 5 }}
        earnedOn="Earned on 4 March 2026"
        rarity={showRarity ? 'Held by 18% of members' : undefined}
      />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: () => <AchievementCard title="Helpful neighbour" description="Answer 5 questions from other members." icon={<MessageSquare />} state="in-progress" progress={{ current: 3, total: 5 }} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Helpful neighbour' })).toBeVisible();
    const bar = canvas.getByRole('progressbar', { name: 'Progress' });
    await expect(bar).toHaveAttribute('aria-valuenow', '60');
    await expect(canvas.getByText('3 of 5')).toBeVisible();
  },
};

/** The three states together. */
export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[400px] flex-col gap-3">
      <AchievementCard title="First post" description="Publish your first post." icon={<Star />} state="earned" earnedOn="Earned on 4 March 2026" rarity="Held by 82% of members" />
      <AchievementCard title="Helpful neighbour" description="Answer 5 questions from other members." icon={<MessageSquare />} state="in-progress" progress={{ current: 3, total: 5 }} />
      <AchievementCard title="Power user" description="Be active 30 days in a row." icon={<Zap />} state="locked" rarity="Held by 2% of members" />
    </div>
  ),
};

export const StatesCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: States.render,
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Earned')).toBeVisible();
    await expect(canvas.getByText('Locked')).toBeVisible();
    await expect(canvas.getAllByRole('progressbar')).toHaveLength(1);
    await expect(canvas.getAllByRole('article')).toHaveLength(3);
    await expect(Math.round(canvas.getAllByRole('article')[0].getBoundingClientRect().width)).toBe(400);
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <AchievementCard
      title="Community champion of the year for the entire Central European region"
      description="Receive the highest number of helpful votes across every space you take part in during one calendar year."
      icon={<Star />}
      state="earned"
      earnedOn="Earned on 31 December 2026 at the annual community summit"
      rarity="Held by less than 1% of members worldwide"
    />
  ),
  play: async ({ canvas }) => {
    const card = canvas.getByRole('article');
    await expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth + 1);
  },
};

export const DefaultDark: Story = { ...StatesCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...StatesCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
