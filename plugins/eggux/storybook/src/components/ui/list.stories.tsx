import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { ChevronRight } from '@/components/icons';
import { Avatar } from './avatar';
import { Badge } from './badge';
import { Button } from './button';
import { JobListing, ListGroupHeader, ListItem, SortableList, TaskItem } from './list';
import { Switch } from './switch';

const meta = {
  title: 'Components/List/List Item',
  component: ListItem,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Rows of content lists: List Item (people, files, appointments; a row is one link or button through its title), Sortable List Item (rows people reorder by keyboard and pointer), Task Item (a checklist entry that saves at once), Job Listing (one open role) and List Group Header (a sticky label over a group). Menu actions use Menu Item; navigation uses Sidebar Item. Figma: List page. Guide: eggux build-ui/components/list-and-tree.md' } },
  },
  args: { title: 'Ana Popescu' },
  render: () => (
    <div className="w-[384px]">
      <ListGroupHeader label="Today" variant="muted" count={3} action={<Button variant="link" size="sm" className="px-0">Mark all as read</Button>} />
      <ul className="m-0 flex flex-col p-0">
      <ListItem title="Ana Popescu" description="Last order: 12 Nov, 09:30" href="#ana" selected leading={<Avatar initials="AP" />} trailing={<><Badge variant="secondary" shape="pill">Confirmed</Badge><ChevronRight aria-hidden="true" /></>} divider />
      <ListItem title="Mihai Ionescu" description="Last order: 11 Nov, 14:10" href="#mihai" leading={<Avatar initials="MI" />} trailing={<ChevronRight aria-hidden="true" />} divider />
      <ListItem title="Dan Cristea" description="No orders yet" disabled leading={<Avatar initials="DC" />} />
      </ul>
    </div>
  ),
} satisfies Meta<typeof ListItem>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma List Item: 384 × 58, 32 avatar, selected on accent with aria-current; group header 34 with a count.
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const rows = canvasElement.querySelectorAll('[data-slot="list-item"]');
    await expect(Math.round(box(rows[0]!).height)).toBe(58);
    await expect(canvas.getByRole('link', { name: 'Ana Popescu' })).toHaveAttribute('aria-current', 'true');
    // 32 min; with the 20 px count and the 1 px borders it is 34 (6 + 20 + 6 + 2), as in Figma.
    await expect(Math.round(box(canvasElement.querySelector('[data-slot="list-group-header"]')!).height)).toBe(34);
    await expect(canvas.queryByRole('link', { name: 'Dan Cristea' })).toBeNull();
  },
};

// Sortable: Space picks up, ArrowDown moves, Space drops; the live region says the position.
export const Sortable: Story = {
  render: () => (
    <div className="w-[480px]">
      <SortableList
        aria-label="Columns"
        items={[
          { id: 'number', label: 'Invoice number', description: 'Shown in the table and in exports', trailing: <Switch aria-label="Show Invoice number" defaultChecked /> },
          { id: 'customer', label: 'Customer', description: 'Name and VAT number' },
          { id: 'amount', label: 'Amount', description: 'Total with VAT' },
        ]}
      />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const handle = canvas.getByRole('button', { name: 'Reorder Invoice number' });
    handle.focus();
    await userEvent.keyboard(' ');
    await expect(handle).toHaveAttribute('aria-pressed', 'true');
    await expect(Math.round(box(canvasElement.querySelector('[data-dragging] > div')!).height)).toBe(60);
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Invoice number moved to position 2 of 3.'));
    await userEvent.keyboard(' ');
    const labels = Array.from(canvasElement.querySelectorAll('[data-slot="sortable-list-item"] [title]')).map(e => e.textContent);
    await expect(labels).toEqual(['Customer', 'Invoice number', 'Amount']);
  },
};

// Task Item: tick saves at once (done struck through); overdue in destructive. Job Listing: 113 high, the title is the row link.
export const TasksAndJobs: Story = {
  render: () => {
    const [done, setDone] = React.useState(false);
    return (
      <div className="flex flex-col gap-8">
        <ul className="m-0 flex w-[480px] flex-col p-0">
          <TaskItem title="Send Q4 forecast to Northwind" due="Overdue · was due 10 Nov" overdue done={done} onDoneChange={setDone} assignee={{ name: 'Maria Ilie', initials: 'MI' }} />
          <TaskItem title="Approve vendor contract" due="Due 14 Nov" assignee={{ name: 'Dan Cristea', initials: 'DC' }} />
        </ul>
        <div className="w-[720px]">
          <JobListing title="Senior Accountant" href="#job" meta="Finance · Full-time · Hybrid" location="Bucharest, Romania" posted="Posted 3 days ago" salary="EUR 3,800-4,600 / month" isNew />
        </div>
      </div>
    );
  },
  play: async ({ canvas, canvasElement }) => {
    const task = canvasElement.querySelector('[data-slot="task-item"]')!;
    await expect(Math.round(box(task).height)).toBe(54);
    const box1 = within(task as HTMLElement).getByRole('checkbox', { name: 'Send Q4 forecast to Northwind' });
    await expect(box1).toHaveAccessibleDescription('Overdue · was due 10 Nov');
    await userEvent.click(box1);
    await expect(task).toHaveAttribute('data-done', 'true');
    const job = canvasElement.querySelector('[data-slot="job-listing"]')!;
    await expect(Math.round(box(job).height)).toBe(113);
    await expect(canvas.getByRole('link', { name: 'Senior Accountant' })).toHaveAttribute('href', '#job');
    await expect(canvas.getByRole('link', { name: 'Apply for Senior Accountant' })).toBeInTheDocument();
  },
};

// Stress: at 320 the job wraps (Apply under the body); long list titles truncate. Tests only.
export const Stress: Story = {
  tags: ['!dev'],
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="w-[320px]"><JobListing title="Senior Accountant, Group Consolidation and IFRS Reporting" href="#j" meta="Finance · Full-time · Hybrid" location="Bucharest, Romania" salary="EUR 3,800-4,600 / month" /></div>
      <ul className="m-0 w-[240px] p-0"><ListItem title="Alexandra-Maria Constantinescu-Ionescu" description="Last order: 12 November 2026, 09:30" leading={<Avatar initials="AC" />} /></ul>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const job = canvasElement.querySelector('[data-slot="job-listing"]')!;
    await expect(box(canvas.getByRole('link', { name: /Apply/ })).top).toBeGreaterThan(box(job.querySelector('h3')!).bottom);
    const title = canvas.getByTitle(/Alexandra-Maria/);
    await expect(title.scrollWidth).toBeGreaterThan(title.clientWidth);
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: TasksAndJobs.render };
