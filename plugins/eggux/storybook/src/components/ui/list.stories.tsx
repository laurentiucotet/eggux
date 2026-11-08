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
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Rows of content lists: List Item (people, files, appointments; a row is one link or button through its title), Sortable List Item (rows people reorder by keyboard and pointer), Task Item (a checklist entry that saves at once), Job Listing (one open role) and List Group Header (a sticky label over a group). Menu actions use Menu Item; navigation uses Sidebar Item. Default has every List Item and List Group Header option in Controls; the item switches apply to all rows. Figma: List page. Guide: eggux build-ui/components/list-and-tree.md' } },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

type Playground = {
  showHeader: boolean;
  headerVariant: 'default' | 'muted';
  showCount: boolean;
  showHeaderAction: boolean;
  interaction: 'link' | 'button' | 'none';
  showDescription: boolean;
  showAvatar: boolean;
  showBadge: boolean;
  showChevron: boolean;
  dividers: boolean;
  selectFirst: boolean;
  disableLast: boolean;
  width: number;
};
const people = [
  { id: 'ana', name: 'Ana Popescu', initials: 'AP', description: 'Last order: 12 Nov, 09:30', status: 'Confirmed' },
  { id: 'mihai', name: 'Mihai Ionescu', initials: 'MI', description: 'Last order: 11 Nov, 14:10', status: 'Pending' },
  { id: 'dan', name: 'Dan Cristea', initials: 'DC', description: 'No orders yet', status: 'New' },
];

// Figma List Item: 384 × 58, 32 avatar, selected on accent with aria-current; group header 34 with a count.
export const DefaultCheck: StoryObj<Playground> = {
  tags: ['!dev'],
  argTypes: {
    showHeader: { name: 'Show group header', control: 'boolean', description: 'List Group Header over the rows', table: { category: 'List Group Header' } },
    headerVariant: { name: 'Header style', control: 'inline-radio', options: ['default', 'muted'], description: 'List Group Header `variant`', if: { arg: 'showHeader' }, table: { category: 'List Group Header' } },
    showCount: { name: 'Show count', control: 'boolean', description: 'List Group Header `count`', if: { arg: 'showHeader' }, table: { category: 'List Group Header' } },
    showHeaderAction: { name: 'Show action', control: 'boolean', description: 'List Group Header `action`', if: { arg: 'showHeader' }, table: { category: 'List Group Header' } },
    interaction: { name: 'Row is a', control: 'inline-radio', options: ['link', 'button', 'none'], description: 'List Item `href` (link), `onSelect` (button) or neither (static)', table: { category: 'List Item' } },
    showDescription: { name: 'Show description', control: 'boolean', description: 'List Item `description`', table: { category: 'List Item' } },
    showAvatar: { name: 'Show avatar', control: 'boolean', description: 'List Item `leading`', table: { category: 'List Item' } },
    showBadge: { name: 'Show badge', control: 'boolean', description: 'List Item `trailing`: a status Badge', table: { category: 'List Item' } },
    showChevron: { name: 'Show chevron', control: 'boolean', description: 'List Item `trailing`: a chevron (decorative)', table: { category: 'List Item' } },
    dividers: { name: 'Dividers', control: 'boolean', description: 'List Item `divider` between rows', table: { category: 'List Item' } },
    selectFirst: { name: 'Select first row', control: 'boolean', description: 'List Item `selected`', table: { category: 'List Item' } },
    disableLast: { name: 'Disable last row', control: 'boolean', description: 'List Item `disabled`', table: { category: 'List Item' } },
    width: { name: 'Width', control: { type: 'range', min: 240, max: 720, step: 4 }, description: 'Width of the list, in px', table: { category: 'List Item' } },
  },
  args: { showHeader: true, headerVariant: 'muted', showCount: true, showHeaderAction: true, interaction: 'link', showDescription: true, showAvatar: true, showBadge: true, showChevron: true, dividers: true, selectFirst: true, disableLast: true, width: 384 },
  render: a => (
    <div style={{ width: a.width, maxWidth: '100%' }}>
      {a.showHeader ? (
        <ListGroupHeader
          label="Today"
          variant={a.headerVariant}
          count={a.showCount ? people.length : undefined}
          action={a.showHeaderAction ? <Button variant="link" size="sm" className="px-0">Mark all as read</Button> : undefined}
        />
      ) : null}
      <ul className="m-0 flex flex-col p-0">
        {people.map((p, i) => {
          const last = i === people.length - 1;
          const disabled = a.disableLast && last;
          const trailing = a.showBadge || (a.showChevron && !disabled) ? (
            <>
              {a.showBadge ? <Badge variant="secondary" shape="pill">{p.status}</Badge> : null}
              {a.showChevron && !disabled ? <ChevronRight aria-hidden="true" /> : null}
            </>
          ) : undefined;
          return (
            <ListItem
              key={p.id}
              title={p.name}
              description={a.showDescription ? p.description : undefined}
              href={a.interaction === 'link' ? `#${p.id}` : undefined}
              onSelect={a.interaction === 'button' ? () => {} : undefined}
              selected={a.selectFirst && i === 0}
              disabled={disabled}
              leading={a.showAvatar ? <Avatar initials={p.initials} /> : undefined}
              trailing={trailing}
              divider={a.dividers && !last}
            />
          );
        })}
      </ul>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const rows = canvasElement.querySelectorAll('[data-slot="list-item"]');
    await expect(Math.round(box(rows[0]!).height)).toBe(58);
    await expect(canvas.getByRole('link', { name: 'Ana Popescu' })).toHaveAttribute('aria-current', 'true');
    // 32 min; with the 20 px count and the 1 px borders it is 34 (6 + 20 + 6 + 2), as in Figma.
    await expect(Math.round(box(canvasElement.querySelector('[data-slot="list-group-header"]')!).height)).toBe(34);
    await expect(canvas.queryByRole('link', { name: 'Dan Cristea' })).toBeNull();
  },
};
// Playground: no play function, so changing Controls never shows a failed test. The checks run in DefaultCheck.
export const Default: StoryObj<Playground> = { ...DefaultCheck, tags: [], play: undefined };

// Sortable: Space picks up, ArrowDown moves, Space drops; the live region says the position.

const fire = (el: Element, type: string, y: number) =>
  el.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, clientX: el.getBoundingClientRect().left + 4, clientY: y, button: 0, pointerId: 1, isPrimary: true, pointerType: 'mouse' }));
const frame = () => new Promise(r => requestAnimationFrame(() => r(null)));
/** Pointer drag of a grip to a y position; checks the drop line while over the target. */
async function dragTo(grip: Element, toY: number, root: Element) {
  const r = grip.getBoundingClientRect();
  const y0 = r.top + r.height / 2;
  fire(grip, 'pointerdown', y0);
  fire(grip, 'pointermove', y0 + (toY > y0 ? 8 : -8));
  await frame();
  fire(grip, 'pointermove', toY);
  await frame();
  await expect(root.querySelector('[data-slot="drop-indicator"]')).not.toBeNull();
  fire(grip, 'pointerup', toY);
  await frame();
}

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
    // Pointer: drag Amount above Customer.
    const list = canvasElement.querySelector('[data-slot="sortable-list"]')!;
    const first = list.querySelector('[data-slot="sortable-list-item"]')!.getBoundingClientRect();
    await dragTo(canvas.getByRole('button', { name: 'Reorder Amount' }), first.top + 4, list);
    const after = Array.from(canvasElement.querySelectorAll('[data-slot="sortable-list-item"] [title]')).map(e => e.textContent);
    await expect(after).toEqual(['Amount', 'Customer', 'Invoice number']);
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Amount moved to position 1 of 3.'));
    await expect(list.querySelector('[data-slot="drop-indicator"]')).toBeNull();
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

export const DefaultDark: StoryObj<Playground> = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
// Rows as buttons, default header, no avatar (axe on the other branch).
export const ButtonRows: StoryObj<Playground> = {
  ...Default,
  tags: ['!dev'],
  args: { ...Default.args, headerVariant: 'default', interaction: 'button', showAvatar: false, dividers: false },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Ana Popescu' })).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByRole('button', { name: 'Dan Cristea' })).toBeDisabled();
  },
};
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: TasksAndJobs.render };
