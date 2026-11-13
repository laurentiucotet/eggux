import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { VoteControl } from './vote-control';

type Args = { subject: string; score: number; orientation: 'vertical' | 'horizontal'; showDown: boolean; disabled: boolean };

const meta = {
  title: 'Components/Community/Vote Control',
  parameters: {
    docs: {
      description: {
        component:
          'Up and down vote with the score between. Each arrow is a toggle (aria-pressed): the other arrow moves the vote, the same arrow removes it, and the score follows. Vertical (a column) or horizontal (a pill). Show down off leaves a like-style single arrow. Code only (no Figma component yet).',
      },
    },
  },
  args: { subject: 'this answer', score: 42, orientation: 'vertical', showDown: true, disabled: false },
  argTypes: {
    subject: { name: 'Subject', control: 'text', description: 'What is voted on, read in the group name.', table: { category: 'Control' } },
    score: { name: 'Score', control: { type: 'range', min: -20, max: 20000, step: 1 }, description: 'Score without your vote.', table: { category: 'Control' } },
    orientation: { name: 'Orientation', control: 'inline-radio', options: ['vertical', 'horizontal'], description: 'Column or pill.', table: { category: 'Control' } },
    disabled: { name: 'Disabled', control: 'boolean', description: 'Blocks voting.', table: { category: 'Control' } },
    showDown: { name: 'Show downvote', control: 'boolean', description: 'The down arrow.', table: { category: 'Parts' } },
  },
  render: args => <VoteControl {...args} />,
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: () => <VoteControl subject="this answer" score={42} />,
  play: async ({ canvas }) => {
    const group = canvas.getByRole('group', { name: 'Vote on this answer' });
    const up = canvas.getByRole('button', { name: 'Upvote' });
    const down = canvas.getByRole('button', { name: 'Downvote' });
    await expect(Math.round(up.getBoundingClientRect().width)).toBe(32);
    await expect(group).toHaveTextContent('Score 42');
    await userEvent.click(up);
    await waitFor(() => expect(up).toHaveAttribute('aria-pressed', 'true'));
    await expect(group).toHaveTextContent('Score 43');
    await userEvent.click(down);
    await waitFor(() => expect(down).toHaveAttribute('aria-pressed', 'true'));
    await expect(up).toHaveAttribute('aria-pressed', 'false');
    await expect(group).toHaveTextContent('Score 41');
    await userEvent.click(down);
    await waitFor(() => expect(group).toHaveTextContent('Score 42'));
  },
};

export const KeyboardCheck: Story = {
  tags: ['!dev'],
  render: () => <VoteControl score={9} />,
  play: async ({ canvas }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Upvote' })).toHaveFocus();
    await userEvent.keyboard(' ');
    await waitFor(() => expect(canvas.getByRole('group')).toHaveTextContent('Score 10'));
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Downvote' })).toHaveFocus();
  },
};

/** Both orientations, the single arrow and a long score. */
export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-start gap-8">
      <VoteControl subject="answer one" score={42} />
      <VoteControl subject="answer two" score={-3} orientation="horizontal" defaultValue="down" />
      <VoteControl subject="idea" score={12399} orientation="horizontal" showDown defaultValue="up" />
      <VoteControl subject="comment" score={7} showDown={false} />
    </div>
  ),
};

export const VariantsCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: Variants.render,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('group', { name: 'Vote on answer two' })).toHaveTextContent('Score -4');
    await expect(canvas.getByRole('group', { name: 'Vote on idea' })).toHaveTextContent('12.4K');
    await expect(canvas.getAllByRole('button', { name: 'Downvote' })).toHaveLength(3);
  },
};

export const ControlledCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: function Render() {
    const [v, setV] = React.useState<'up' | 'down' | null>('up');
    return <VoteControl score={1} value={v} onValueChange={setV} disabled={false} />;
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Upvote' })).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(canvas.getByRole('button', { name: 'Upvote' }));
    await waitFor(() => expect(canvas.getByRole('group')).toHaveTextContent('Score 1'));
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => <VoteControl subject="a post with a very long title that does not matter here" score={-12345} orientation="horizontal" disabled />,
  play: async ({ canvas }) => {
    const group = canvas.getByRole('group');
    await expect(group.scrollWidth).toBeLessThanOrEqual(276);
    await expect(canvas.getByRole('button', { name: 'Upvote' })).toBeDisabled();
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
