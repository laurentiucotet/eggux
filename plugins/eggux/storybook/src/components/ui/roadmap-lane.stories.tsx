import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { RoadmapLane, type RoadmapLaneData } from './roadmap-lane';

type Args = { layout: 'Now, next, later' | 'Quarters'; showSummary: boolean; showMeta: boolean; selectable: boolean; width: number };

const nowNextLater: RoadmapLaneData[] = [
  {
    id: 'now',
    title: 'Now',
    description: 'In the next 6 weeks',
    items: [
      { id: 'invoices', title: 'Invoice reminders', summary: 'Send a reminder three days before the due date.', status: 'in-progress', owner: 'Ana Popescu', theme: 'Billing' },
      { id: 'sso', title: 'Single sign-on', summary: 'Let teams sign in with their identity provider.', status: 'at-risk', owner: 'Ion Marin', theme: 'Security' },
    ],
  },
  {
    id: 'next',
    title: 'Next',
    description: 'In the following quarter',
    items: [
      { id: 'export', title: 'Scheduled exports', summary: 'Email a CSV of any report every Monday.', status: 'planned', owner: 'Maria Ionescu', theme: 'Reports' },
      { id: 'roles', title: 'Custom roles', status: 'planned', theme: 'Security' },
    ],
  },
  {
    id: 'later',
    title: 'Later',
    description: 'Not scheduled',
    items: [{ id: 'api', title: 'Public API', summary: 'Read and write access for partners.', status: 'planned', theme: 'Platform' }],
  },
];

const quarters: RoadmapLaneData[] = [
  { id: 'q1', title: 'Q1 2026', description: 'Jan to Mar', items: [{ id: 'q1a', title: 'Dark mode', status: 'shipped', owner: 'Ana Popescu', theme: 'Design' }, { id: 'q1b', title: 'Team workspaces', status: 'shipped', theme: 'Platform' }] },
  { id: 'q2', title: 'Q2 2026', description: 'Apr to Jun', items: [{ id: 'q2a', title: 'Invoice reminders', summary: 'Send a reminder before the due date.', status: 'in-progress', theme: 'Billing' }] },
  { id: 'q3', title: 'Q3 2026', description: 'Jul to Sep', items: [] },
  { id: 'q4', title: 'Q4 2026', description: 'Oct to Dec', items: [{ id: 'q4a', title: 'Public API', status: 'planned', theme: 'Platform' }] },
];

const meta = {
  title: 'Components/Data Structures/Roadmap Lane',
  parameters: {
    docs: {
      description: {
        component:
          'A roadmap as lanes side by side (quarters, or Now / Next / Later). Each lane has a title, a count and item cards with a status badge, an optional summary, theme and owner. Lanes wrap into a stack in a narrow container. The current lane is marked in text. Code only (no Figma component yet).',
      },
    },
  },
  args: { layout: 'Now, next, later', showSummary: true, showMeta: true, selectable: false, width: 900 },
  argTypes: {
    layout: { name: 'Lanes', control: 'inline-radio', options: ['Now, next, later', 'Quarters'], description: 'Which set of lanes to show.', table: { category: 'Roadmap' } },
    showSummary: { name: 'Show summary', control: 'boolean', description: 'The summary line on each card.', table: { category: 'Cards' } },
    showMeta: { name: 'Show owner and theme', control: 'boolean', description: 'The owner and theme line on each card.', table: { category: 'Cards' } },
    selectable: { name: 'Selectable titles', control: 'boolean', description: 'Card titles become buttons.', table: { category: 'Cards' } },
    width: { name: 'Width', control: { type: 'range', min: 240, max: 1100, step: 4 }, description: 'Container width in px.', table: { category: 'Roadmap' } },
  },
  render: ({ layout, showSummary, showMeta, selectable, width }) => (
    <div style={{ width }} className="max-w-full">
      <RoadmapLane
        lanes={layout === 'Quarters' ? quarters : nowNextLater}
        current={layout === 'Quarters' ? 'q2' : 'now'}
        showSummary={showSummary}
        showMeta={showMeta}
        onItemSelect={selectable ? fn() : undefined}
      />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Four quarters, one of them empty. */
export const ByQuarter: Story = { args: { layout: 'Quarters' }, parameters: { controls: { disable: true } } };

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: function Render() {
    const [picked, setPicked] = React.useState('none');
    return (
      <>
        <RoadmapLane lanes={nowNextLater} current="now" onItemSelect={item => setPicked(item.id)} />
        <p data-testid="picked">{picked}</p>
      </>
    );
  },
  play: async ({ canvas }) => {
    const lanes = ['Now', 'Next', 'Later'].map(n => canvas.getByRole('region', { name: n }));
    await expect(lanes[0]).toHaveAttribute('aria-current', 'true');
    await expect(lanes[1]).not.toHaveAttribute('aria-current');
    await expect(within(lanes[0]).getByText('Current')).toBeVisible();
    await expect(within(lanes[0]).getAllByRole('listitem')).toHaveLength(2);
    await expect(within(lanes[0]).getByLabelText('2 items')).toBeVisible();
    // Status is text, not only colour.
    await expect(within(lanes[0]).getByText('At risk')).toBeVisible();
    await expect(within(lanes[2]).getByLabelText('1 item')).toBeVisible();
    // Keyboard: Tab reaches the first title, Enter picks it.
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Invoice reminders' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.getByTestId('picked')).toHaveTextContent('invoices'));
  },
};

export const EmptyLaneCheck: Story = {
  tags: ['!dev'],
  render: () => <RoadmapLane lanes={quarters} current="q2" />,
  play: async ({ canvas }) => {
    await expect(within(canvas.getByRole('region', { name: 'Q3 2026' })).getByText('Nothing planned yet.')).toBeVisible();
    // Without onItemSelect the titles are text, not buttons.
    await expect(canvas.queryByRole('button')).toBeNull();
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <RoadmapLane
      lanes={[
        {
          id: 'a',
          title: 'Second half of the financial year with a very long name',
          description: 'From the first of July to the thirty-first of December twenty twenty-six',
          items: [
            { id: 'x', title: 'Reconcile intercompany balances across subsidiaries automatically', summary: 'A long summary that has to wrap onto several lines without pushing the card wider than its lane.', status: 'in-progress', owner: 'Alexandra Constantinescu-Popescu', theme: 'Finance operations' },
          ],
        },
        { id: 'b', title: 'Later', items: [{ id: 'y', title: 'Unbreakable-title-without-any-spaces-at-all-to-test-wrapping', status: 'planned' }] },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector<HTMLElement>('[data-slot="roadmap-lane"]')!;
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + 1);
    const lanes = root.querySelectorAll<HTMLElement>('section');
    // Narrow: the lanes stack, one above the other.
    await expect(lanes[1].getBoundingClientRect().top).toBeGreaterThan(lanes[0].getBoundingClientRect().bottom - 1);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
