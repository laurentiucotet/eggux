import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { Poll, type PollOption } from './poll';

const options: PollOption[] = [
  { id: 'remote', label: 'Remote first', votes: 48 },
  { id: 'hybrid', label: 'Hybrid, two days in the office', votes: 31 },
  { id: 'office', label: 'Office first', votes: 12 },
];

type Args = { question: string; optionCount: 2 | 3 | 4 | 5 | 6; closed: boolean; showMeta: boolean; startVoted: boolean; width: number };

const more: PollOption[] = [...options, { id: 'rotate', label: 'Rotating teams', votes: 7 }, { id: 'async', label: 'Fully asynchronous', votes: 5 }, { id: 'other', label: 'Something else', votes: 2 }];

const meta = {
  title: 'Components/Community/Poll',
  parameters: {
    docs: {
      description: {
        component:
          'A single choice poll. Pick an option and Vote; the card then shows each option with its share, a bar, the vote count, a check on the leading option and "Your vote" on yours. A closed poll opens on the final result with "Winner". Radios are native; results are read as one sentence per option. Code only (no Figma component yet).',
      },
    },
  },
  args: { question: 'How should the team work next year?', optionCount: 3, closed: false, showMeta: true, startVoted: false, width: 480 },
  argTypes: {
    question: { name: 'Question', control: 'text', description: 'The poll question.', table: { category: 'Poll' } },
    optionCount: { name: 'Options', control: { type: 'range', min: 2, max: 6, step: 1 }, description: 'How many options.', table: { category: 'Poll' } },
    closed: { name: 'Closed', control: 'boolean', description: 'Final result, no more votes.', table: { category: 'Poll' } },
    startVoted: { name: 'Already voted', control: 'boolean', description: 'Open on the results with your vote marked.', table: { category: 'Poll' } },
    showMeta: { name: 'Show meta', control: 'boolean', description: 'The "Ends in 2 days" line.', table: { category: 'Parts' } },
    width: { name: 'Width', control: { type: 'range', min: 276, max: 480, step: 4 }, description: 'Column width in px.', table: { category: 'Poll' } },
  },
  render: ({ question, optionCount, closed, showMeta, startVoted, width }) => (
    <div style={{ width }}>
      <Poll key={`${closed}-${startVoted}-${optionCount}`} question={question} options={more.slice(0, optionCount)} closed={closed} defaultVoted={startVoted ? 'hybrid' : undefined} meta={showMeta ? 'Ends in 2 days' : undefined} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: () => <Poll question="How should the team work next year?" options={options} onVote={fn()} />,
  play: async ({ canvas }) => {
    const vote = canvas.getByRole('button', { name: 'Vote' });
    await expect(vote).toBeDisabled();
    await expect(canvas.getAllByRole('radio')).toHaveLength(3);
    await userEvent.click(canvas.getByRole('radio', { name: 'Hybrid, two days in the office' }));
    await expect(vote).toBeEnabled();
    await userEvent.click(vote);
    // 31 + 1 of 92 votes = 35 percent; 48 of 92 = 52 percent leads.
    await waitFor(() => expect(canvas.getByText('Remote first, 52 percent, 48 votes, leading')).toBeInTheDocument());
    await expect(canvas.getByText('Hybrid, two days in the office, 35 percent, 32 votes, your vote')).toBeInTheDocument();
    await expect(canvas.getByRole('status')).toHaveTextContent('Vote recorded');
    await expect(canvas.queryByRole('radio')).toBeNull();
  },
};

export const KeyboardCheck: Story = {
  tags: ['!dev'],
  render: () => <Poll question="Pick one" options={options} />,
  play: async ({ canvas }) => {
    await userEvent.tab();
    await expect(canvas.getAllByRole('radio')[0]).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(canvas.getAllByRole('radio')[1]).toBeChecked());
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Vote' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.getByRole('heading', { name: 'Pick one' })).toHaveFocus());
  },
};

/** A closed poll opens on the final result with the winner marked. */
export const Closed: Story = { args: { closed: true, showMeta: false } };

export const ClosedCheck: Story = {
  tags: ['!dev'],
  args: { closed: true },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button', { name: 'Vote' })).toBeNull();
    await expect(canvas.getByText('Remote first, 53 percent, 48 votes, winner')).toBeInTheDocument();
    await expect(canvas.getAllByRole('listitem')).toHaveLength(3);
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <Poll
      question="Which of the following long running initiatives should we prioritise during the next planning cycle for all teams?"
      options={[
        { id: 'a', label: 'Replace the legacy invoicing workflow with the new automated reconciliation service', votes: 1204 },
        { id: 'b', label: 'Short', votes: 0 },
      ]}
      defaultVoted="b"
      meta="Ends tomorrow at 18:00 Central European Time"
    />
  ),
  play: async ({ canvas }) => {
    const section = canvas.getByRole('region');
    await expect(section.scrollWidth).toBeLessThanOrEqual(section.clientWidth + 1);
    await expect(canvas.getByText(/Short, 0 percent, 1 vote, your vote/)).toBeInTheDocument();
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
