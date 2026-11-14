import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { GanttChart, type GanttTask } from './gantt-chart';

type Args = { scale: 'day' | 'week'; taskCount: number; showList: boolean; showLegend: boolean; width: number };

const NOW = new Date(2026, 2, 18);

const tasks: GanttTask[] = [
  { id: 'discovery', name: 'Discovery', owner: 'Ana Popescu', start: '2026-03-02', end: '2026-03-13', progress: 100, status: 'done' },
  { id: 'design', name: 'Design', owner: 'Ion Marin', start: '2026-03-09', end: '2026-03-27', progress: 60, status: 'in-progress', dependsOn: ['discovery'] },
  { id: 'build', name: 'Build', owner: 'Maria Ionescu', start: '2026-03-23', end: '2026-04-24', progress: 25, status: 'in-progress', dependsOn: ['design'] },
  { id: 'security', name: 'Security review', owner: 'Dan Vasile', start: '2026-04-13', end: '2026-04-24', progress: 0, status: 'at-risk', dependsOn: ['build'] },
  { id: 'launch', name: 'Launch', owner: 'Ana Popescu', start: '2026-04-27', end: '2026-05-01', progress: 0, status: 'planned', dependsOn: ['build', 'security'] },
];

const meta = {
  title: 'Components/Data Structures/Gantt Chart',
  parameters: {
    docs: {
      description: {
        component:
          'A schedule as rows of task bars on a time scale: bar position and width come from start and end dates, a line marks today (the now prop), a diamond marks a task that waits for another, progress fills the bar. Bars are buttons with a text description; Up and Down move between rows. A table under the chart lists the same data. Code only (no Figma component yet).',
      },
    },
  },
  args: { scale: 'day', taskCount: 5, showList: true, showLegend: true, width: 720 },
  argTypes: {
    scale: { name: 'Scale', control: 'inline-radio', options: ['day', 'week'], description: 'One column per day, or one per week.', table: { category: 'Chart' } },
    taskCount: { name: 'Tasks', control: { type: 'range', min: 0, max: 5, step: 1 }, description: 'How many tasks are drawn.', table: { category: 'Chart' } },
    showList: { name: 'Show list', control: 'boolean', description: 'The table under the chart.', table: { category: 'Chart' } },
    showLegend: { name: 'Show legend', control: 'boolean', description: 'Status, dependency and today key.', table: { category: 'Chart' } },
    width: { name: 'Width', control: { type: 'range', min: 240, max: 960, step: 4 }, description: 'Container width in px.', table: { category: 'Chart' } },
  },
  render: ({ scale, taskCount, showList, showLegend, width }) => (
    <div style={{ width }} className="max-w-full">
      <GanttChart tasks={tasks.slice(0, taskCount)} now={NOW} scale={scale} showList={showList} showLegend={showLegend} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Weeks instead of days: a long plan fits in less width. */
export const WeekScale: Story = { args: { scale: 'week' }, parameters: { controls: { disable: true } } };

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: function Render() {
    const [picked, setPicked] = React.useState('none');
    const onSelect = fn((t: GanttTask) => setPicked(t.id));
    return (
      <>
        <GanttChart tasks={tasks} now={NOW} onTaskSelect={onSelect} />
        <p data-testid="picked">{picked}</p>
      </>
    );
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('region', { name: /Project schedule, timeline/ })).toHaveAttribute('tabindex', '0');
    await expect(canvas.getByText(/5 tasks from 2 Mar 2026 to 1 May 2026\. Today is 18 Mar 2026\./)).toBeVisible();
    // Bars sit by date: Design starts a week after Discovery, 7 days x 28 px.
    const bars = canvasElement.querySelectorAll<HTMLButtonElement>('[data-slot="gantt-bar"]');
    await expect(bars).toHaveLength(5);
    await expect(parseFloat(bars[1].style.left) - parseFloat(bars[0].style.left)).toBe(7 * 28);
    await expect(parseFloat(bars[0].style.width)).toBe(12 * 28);
    // Today line and four dependency markers.
    await expect(canvasElement.querySelectorAll('[data-slot="gantt-today"]')).toHaveLength(5);
    await expect(canvasElement.querySelectorAll('[data-slot="gantt-dependency"]')).toHaveLength(4);
    const design = canvas.getByRole('button', { name: /^Design, 9 Mar 2026 to 27 Mar 2026, 19 days, 60 percent done, In progress, owner Ion Marin, depends on Discovery$/ });
    // Roving tab stop: only the first bar is in the tab order.
    await expect(bars[0]).toHaveAttribute('tabindex', '0');
    await expect(design).toHaveAttribute('tabindex', '-1');
    bars[0].focus();
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(design).toHaveFocus());
    await expect(design).toHaveAttribute('tabindex', '0');
    await userEvent.keyboard('{End}');
    await waitFor(() => expect(canvas.getByRole('button', { name: /^Launch,/ })).toHaveFocus());
    await userEvent.keyboard('{ArrowUp}');
    await waitFor(() => expect(canvas.getByRole('button', { name: /^Security review,/ })).toHaveFocus());
    await userEvent.keyboard('{Home}');
    await waitFor(() => expect(bars[0]).toHaveFocus());
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.getByTestId('picked')).toHaveTextContent('discovery'));
    // The list equivalent.
    await userEvent.click(canvas.getByText('Show the schedule as a list'));
    const list = await canvas.findByRole('table');
    await expect(list.querySelectorAll('tbody tr')).toHaveLength(5);
    await expect(canvas.getByRole('rowheader', { name: 'Launch' }).closest('tr')).toHaveTextContent('Build, Security review');
  },
};

export const WeekCheck: Story = {
  tags: ['!dev'],
  render: () => <GanttChart tasks={tasks} now={NOW} scale="week" />,
  play: async ({ canvasElement, canvas }) => {
    const bars = canvasElement.querySelectorAll<HTMLButtonElement>('[data-slot="gantt-bar"]');
    await expect(parseFloat(bars[0].style.width)).toBe(12 * 12);
    await expect(canvas.getByText('2 Mar')).toBeVisible();
  },
};

export const OutsideAndEmpty: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4">
      <GanttChart title="Later plan" tasks={tasks} now={new Date(2027, 0, 5)} />
      <GanttChart title="Empty plan" tasks={[]} />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText(/is outside this range/)).toBeVisible();
    await expect(canvasElement.querySelectorAll('[data-slot="gantt-today"]')).toHaveLength(0);
    await expect(canvas.getByText(/No tasks yet/)).toBeVisible();
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <GanttChart
      title="Quarterly release plan for the customer portal rebuild"
      now={NOW}
      tasks={[
        { id: 'a', name: 'Migrate every customer subscription record to the new billing platform', owner: 'Alexandra Constantinescu-Popescu', start: '2026-03-02', end: '2026-03-03', progress: 50, status: 'at-risk' },
        { id: 'b', name: 'Launch', start: '2026-04-27', end: '2026-04-27', dependsOn: ['a'] },
      ]}
    />
  ),
  play: async ({ canvasElement, canvas }) => {
    const card = canvasElement.querySelector<HTMLElement>('[data-slot="gantt-chart"]')!;
    await expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth + 1);
    const region = canvas.getByRole('region', { name: /timeline/ });
    await expect(region.scrollWidth).toBeGreaterThan(region.clientWidth);
    // A one-day task still has a visible, clickable bar.
    await expect(canvas.getByRole('button', { name: /^Launch,/ }).getBoundingClientRect().width).toBeGreaterThanOrEqual(8);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
