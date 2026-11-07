import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { FileText, Mail, Plus, Upload, UserPlus, Users } from '@/components/icons';
import { Avatar } from './avatar';
import { AvatarGroup } from './avatar-group';
import { Button } from './button';
import { FileCard, PlanCard, ProfileCoverCard, QuickActionCard, TaskCard } from './cards-more';

const meta = {
  title: 'Components/Card/More card types',
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'More card types on the Card tokens: Profile Cover Card (cover, 64 avatar, stats, actions), Task Card (checkbox completes it, project and priority badges, due date with overdue, subtasks, assignees), Quick Action Card (icon tile, title, one line, whole card is a link), File Card (preview, name, meta, owner, menu) and Plan Card (plan, price, usage meters, Manage and Upgrade). Guide: eggux build-ui/components/card.md' } },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();
const onUpgrade = fn();

export const ProfileCover: Story = {
  render: () => (
    <ProfileCoverCard
      name="Ana Popescu"
      role="Finance lead · Bucharest"
      href="#ana"
      stats={[
        { label: 'Projects', value: '24' },
        { label: 'Invoices', value: '1,180' },
        { label: 'Team', value: '8' },
      ]}
      actions={
        <>
          <Button size="sm" leadingIcon={<UserPlus />} aria-label="Follow Ana Popescu">Follow</Button>
          <Button size="sm" variant="outline" leadingIcon={<Mail />} aria-label="Message Ana Popescu">Message</Button>
        </>
      }
    />
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const card = canvasElement.querySelector('[data-slot="profile-cover-card"]')!;
    await expect(box(card).width).toBe(320);
    await expect(c.getByRole('heading', { level: 3, name: 'Ana Popescu' })).toBeVisible();
    await expect(c.getAllByRole('term')).toHaveLength(3);
    // The actions sit above the stretched link.
    const follow = c.getByRole('button', { name: 'Follow Ana Popescu' });
    const r = box(follow);
    await expect(document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)?.closest('button')).toBe(follow);
  },
};

function Tasks() {
  const [done, setDone] = React.useState(false);
  const people = (
    <AvatarGroup size="sm">
      <Avatar initials="AP" name="Ana Popescu" />
      <Avatar initials="MI" name="Mihai Ionescu" />
    </AvatarGroup>
  );
  return (
    <div className="flex flex-wrap gap-4">
      <TaskCard title="Send the Q3 report to Northwind" href="#t1" done={done} onDoneChange={setDone} project="Finance" priority="high" due="12 Nov" overdue subtasks={{ done: 2, total: 5 }} assignees={people} />
      <TaskCard title="Review the new onboarding emails" href="#t2" project="Growth" priority="low" due="20 Nov" assignees={people} />
    </div>
  );
}

export const Tasks_: Story = {
  name: 'Tasks',
  render: () => <Tasks />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const box1 = c.getByRole('checkbox', { name: 'Send the Q3 report to Northwind' });
    await expect(c.getByText('Overdue · 12 Nov')).toHaveClass('text-destructive');
    await userEvent.click(box1);
    await expect(box1).toBeChecked();
    await expect(c.getByText('Due 12 Nov')).toBeVisible();
    await expect(c.getByText(/2\/5/)).toHaveTextContent('2/5 subtasks done');
    await expect(c.getByText('High priority')).toBeVisible();
  },
};

export const QuickActions: Story = {
  render: () => (
    <div className="grid w-[640px] grid-cols-2 gap-3">
      <QuickActionCard icon={<Plus />} title="New invoice" description="Bill a client in a minute" href="#invoice" />
      <QuickActionCard icon={<Users />} title="Add a client" description="Name, email and VAT number" href="#client" />
      <QuickActionCard icon={<Upload />} title="Import expenses" description="CSV or bank statement" href="#import" />
      <QuickActionCard icon={<FileText />} title="Export reports" description="PDF or Excel" href="#export" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getAllByRole('link')).toHaveLength(4);
    const card = canvasElement.querySelector('[data-slot="quick-action-card"]')!;
    await expect(Math.round(box(card).height)).toBe(74);
  },
};

export const Files: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <FileCard name="Q3-report.pdf" meta="2.4 MB · Edited 2 h ago" href="#q3" owner={{ name: 'Ana Popescu' }} />
      <FileCard name="budget-2027.xlsx" meta="88 KB · Edited yesterday" href="#budget" owner={{ name: 'Mihai Ionescu' }} />
      <FileCard name="launch-plan.docx" meta="140 KB" href="#plan" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const card = canvasElement.querySelector('[data-slot="file-card"]')!;
    await expect(box(card).width).toBe(240);
    await expect(c.getByRole('link', { name: 'Q3-report.pdf' })).toBeVisible();
    await expect(c.getByRole('button', { name: 'More actions for budget-2027.xlsx' })).toBeVisible();
  },
};

export const Plan: Story = {
  render: () => (
    <PlanCard
      plan="Pro"
      price="€29"
      note="Renews on 1 December 2026."
      usage={[
        { label: 'Projects', used: 8, limit: 10 },
        { label: 'Storage', used: 46, limit: 50, valueText: '46 of 50 GB' },
      ]}
      onManage={() => {}}
      onUpgrade={onUpgrade}
    />
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getAllByRole('progressbar')).toHaveLength(2);
    await expect(c.getByText('46 of 50 GB')).toBeVisible();
    await userEvent.click(c.getByRole('button', { name: 'Upgrade' }));
    await expect(onUpgrade).toHaveBeenCalled();
  },
};

export const EdgeCases: Story = {
  tags: ['!dev'],
  render: () => (
    <div className="flex flex-col gap-4">
      <ProfileCoverCard className="w-60" name="Bartholomew Alexandrescu-Vasilescu" role="Head of International Partnerships and Strategic Accounts" stats={[{ label: 'Projects', value: '1,234,567' }]} />
      <TaskCard className="w-60" title="A very long task title that has to wrap onto several lines without pushing the checkbox" due="1 Jan" subtasks={{ done: 0, total: 12 }} />
      <QuickActionCard className="w-60" icon={<Plus />} title="A long action name that truncates" description="And a long description that truncates too" href="#x" />
      <FileCard className="w-48" name="a-very-long-file-name-for-the-board-meeting-final.pdf" meta="Edited by someone with a long name" />
      <PlanCard className="w-72" plan="Enterprise unlimited plus" price="€1,299" usage={[{ label: 'Seats', used: 120, limit: 100 }]} onManage={() => {}} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const el of Array.from(canvasElement.querySelectorAll('[data-slot$="-card"]'))) await expect(el.scrollWidth).toBeLessThanOrEqual(el.clientWidth + 1);
  },
};

const All = () => (
  <div className="flex flex-wrap items-start gap-4 bg-background p-6">
    <ProfileCoverCard name="Ana Popescu" role="Finance lead" stats={[{ label: 'Projects', value: '24' }]} actions={<Button size="sm">Follow</Button>} />
    <TaskCard title="Send the Q3 report" project="Finance" priority="medium" due="12 Nov" overdue subtasks={{ done: 2, total: 5 }} />
    <div className="w-80"><QuickActionCard icon={<Plus />} title="New invoice" description="Bill a client" href="#i" /></div>
    <FileCard name="Q3-report.pdf" meta="2.4 MB" owner={{ name: 'Ana Popescu' }} />
    <PlanCard plan="Pro" price="€29" usage={[{ label: 'Projects', used: 9, limit: 10 }]} onManage={() => {}} onUpgrade={() => {}} />
  </div>
);
export const AllDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, render: () => <All /> };
export const AllCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: () => <All /> };
