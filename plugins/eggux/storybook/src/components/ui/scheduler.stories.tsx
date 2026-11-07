import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Avatar } from './avatar';
import { AvatarGroup } from './avatar-group';
import { AgendaItem, AvailabilityRow, CalendarEvent, GanttBar, GanttMilestone, MeetingCard, type CalendarSeries, type TimeRange } from './scheduler';

const meta = {
  title: 'Components/Scheduler/Scheduler',
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Scheduling parts. Calendar Event: an event in day and week views with a bar in the calendar color (Series 1-4), sizes default and sm, states selected and dragging, statuses tentative and cancelled; it is a button that opens the details. Gantt Bar (planned, in progress with a progress line, done, blocked) and Gantt Milestone. Agenda Item: upcoming, now, past. Meeting Card: upcoming and live. Availability Row: working hours for one weekday with time ranges. Time Slot has its own page. Figma: Scheduler page. Guide: eggux build-ui/components/scheduler.md' } },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();
const onJoin = fn();

export const CalendarEvents: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex gap-4">
        {([1, 2, 3, 4] as CalendarSeries[]).map((s) => (
          <div key={s} className="w-[146px]">
            <CalendarEvent series={s} title="Design review" time="11:00 - 12:30" />
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        <div className="w-[146px]"><CalendarEvent state="selected" title="Design review" time="11:00 - 12:30" aria-expanded /></div>
        <div className="w-[146px]"><CalendarEvent state="dragging" title="Design review" time="13:00 - 14:30" /></div>
        <div className="w-[146px]"><CalendarEvent status="tentative" title="Design review" time="11:00 - 12:30" /></div>
        <div className="w-[146px]"><CalendarEvent status="cancelled" title="Design review" time="11:00 - 12:30" /></div>
      </div>
      <div className="w-[146px]"><CalendarEvent size="sm" title="Design review" time="11:00 - 12:30" /></div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const events = c.getAllByRole('button');
    await expect(events).toHaveLength(9);
    await expect(box(events[0]).width).toBe(146);
    await expect(box(events[0]).height).toBe(46);
    await expect(box(events[8]).height).toBe(22);
    await expect(getComputedStyle(events[0]).borderLeftWidth).toBe('4px');
    await expect(getComputedStyle(events[0]).borderLeftColor).not.toBe(getComputedStyle(events[1]).borderLeftColor);
    await expect(getComputedStyle(events[4]).outlineWidth).toBe('2px');
    await expect(getComputedStyle(events[6]).outlineStyle).toBe('dashed');
    await expect(c.getByRole('button', { name: /Design review.*11:00 - 12:30.*cancelled/ })).toBeVisible();
    await expect(getComputedStyle(events[7].querySelector('span')!).textDecorationLine).toBe('line-through');
  },
};

export const Gantt: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <GanttBar className="w-[200px]" status="planned" label="Visual design" />
      <GanttBar className="w-[200px]" status="in-progress" progress={60} label="Visual design" />
      <GanttBar className="w-[200px]" status="done" label="Visual design" />
      <GanttBar className="w-[200px]" status="blocked" label="Visual design" />
      <GanttMilestone label="Design review" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const bars = canvasElement.querySelectorAll('[data-slot="gantt-bar"]');
    await expect(box(bars[0]).height).toBe(28);
    await expect(getComputedStyle(bars[0]).borderStyle).toBe('dashed');
    const progress = bars[1].querySelector('[data-slot="gantt-bar-progress"]')!;
    await expect(Math.round(box(progress).width)).toBe(120);
    await expect(c.getByText(/, in progress, 60% done/)).toBeInTheDocument();
    await expect(c.getByText(/, blocked/)).toBeInTheDocument();
    await expect(box(canvasElement.querySelector('[data-slot="gantt-milestone"]')!).height).toBe(16);
  },
};

export const Agenda: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <AgendaItem state="past" start="08:30" end="09:00" title="Standup" meta="Google Meet · 6 people" href="#standup" />
      <AgendaItem state="now" start="09:30" end="10:15" title="Weekly cash review" meta="Room 2 · 4 people" href="#cash" />
      <AgendaItem state="upcoming" series={2} start="11:00" end="12:00" title="Supplier call" meta="Phone · 2 people" href="#supplier" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const items = c.getAllByRole('link');
    await expect(items).toHaveLength(3);
    await expect(box(items[1]).width).toBe(400);
    await expect(Math.round(box(items[1]).height)).toBe(54);
    await expect(items[1]).toHaveAttribute('aria-current', 'time');
    await expect(within(items[1]).getByText('Now')).toBeVisible();
    await expect(items[0]).toHaveAccessibleName(/08:30 to 09:00 Standup/);
  },
};

function People() {
  return (
    <AvatarGroup size="sm" more={3} moreLabel="Show 3 more people" label="5 people">
      <Avatar initials="AP" name="Ana Popescu" />
      <Avatar initials="MI" name="Mihai Ionescu" />
      <Avatar initials="DC" name="Dana Constantin" />
    </AvatarGroup>
  );
}

export const MeetingCards: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      <MeetingCard title="Q4 planning with Northwind" time="Today, 15:00–16:00 CET" place="Google Meet" people={<People />} />
      <MeetingCard state="live" title="Q4 planning with Northwind" time="Today, 15:00–16:00 CET" place="Google Meet" people={<People />} onJoin={onJoin} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const [upcoming, live] = Array.from(canvasElement.querySelectorAll('[data-slot="meeting-card"]'));
    await expect(box(upcoming).width).toBe(360);
    await expect(Math.round(box(upcoming).height)).toBe(212);
    await expect(within(upcoming as HTMLElement).queryByText('Live')).toBeNull();
    await userEvent.click(c.getByRole('button', { name: 'Join now: Q4 planning with Northwind' }));
    await expect(onJoin).toHaveBeenCalled();
    await expect(within(live as HTMLElement).getByText('Live')).toBeVisible();
  },
};

function Week() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [state, setState] = React.useState<Record<string, { on: boolean; ranges: TimeRange[] }>>(
    Object.fromEntries(days.map((d, i) => [d, { on: i < 5, ranges: [{ start: '09:00', end: '17:00' }] }])),
  );
  return (
    <div className="flex flex-col">
      <p className="m-0 mb-2 text-sm leading-5 text-muted-foreground">Times in Europe/Bucharest (EET)</p>
      {days.map((d) => (
        <AvailabilityRow
          key={d}
          day={d}
          available={state[d].on}
          onAvailableChange={(on) => setState((s) => ({ ...s, [d]: { ...s[d], on } }))}
          ranges={state[d].ranges}
          onRangesChange={(ranges) => setState((s) => ({ ...s, [d]: { ...s[d], ranges } }))}
        />
      ))}
    </div>
  );
}

export const Availability: Story = {
  render: () => <Week />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const rows = canvasElement.querySelectorAll('[data-slot="availability-row"]');
    await expect(box(rows[0]).width).toBe(560);
    await expect(Math.round(box(rows[0]).height)).toBe(53);
    await expect(Math.round(box(rows[5]).height)).toBe(37);
    await expect(within(rows[5] as HTMLElement).getByText('Unavailable')).toBeVisible();
    await userEvent.click(c.getByRole('button', { name: 'Add a time range for Monday' }));
    await expect(c.getByRole('combobox', { name: 'Monday, range 2: from' })).toBeVisible();
    await userEvent.click(c.getByRole('button', { name: 'Remove Monday range 17:00 to 17:00' }));
    await expect(c.queryByRole('combobox', { name: 'Monday, range 2: from' })).toBeNull();
    await userEvent.click(c.getByRole('switch', { name: 'Saturday: available' }));
    await expect(c.getByRole('combobox', { name: 'Saturday, range 1: from' })).toBeVisible();
  },
};

function Edge() {
  const long = 'Quarterly business review with Northwind Traders and the finance team';
  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-4">
        <div className="w-20"><CalendarEvent title={long} time="11:00 - 12:30" /></div>
        <div className="w-20"><CalendarEvent size="sm" title={long} time="11:00 - 11:30" /></div>
        <div className="w-[146px]"><CalendarEvent title={long} time="11:00 - 15:00" className="h-[184px]" /></div>
      </div>
      <GanttBar className="w-12" label={long} status="blocked" />
      <GanttBar className="w-[200px]" label="Zero progress" progress={0} />
      <AgendaItem className="w-72" state="now" start="09:30" end="10:15" title={long} meta="Room 2, building B, third floor · 12 people" />
      <MeetingCard className="w-60" state="live" title={long} time="Every Monday, 15:00–16:00 CET (recurring)" place="Microsoft Teams meeting with dial-in" people={<People />} />
      <AvailabilityRow className="w-80" day="Wednesday" ranges={[{ start: '09:00', end: '12:00' }, { start: '13:00', end: '17:00' }]} />
    </div>
  );
}

export const EdgeCases: Story = {
  tags: ['!dev'],
  render: () => <Edge />,
  play: async ({ canvasElement }) => {
    const events = canvasElement.querySelectorAll('[data-slot="calendar-event"]');
    for (const e of Array.from(events)) await expect(e.scrollWidth).toBeLessThanOrEqual(e.clientWidth + 4);
    await expect(box(events[2]).height).toBe(184);
    const card = canvasElement.querySelector('[data-slot="meeting-card"]')!;
    await expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth + 2);
    const row = canvasElement.querySelector('[data-slot="availability-row"]')!;
    await expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth + 1);
  },
};

const All = () => (
  <div className="flex flex-col gap-6 bg-background p-6">
    <div className="flex flex-wrap gap-4">
      {([1, 2, 3, 4] as CalendarSeries[]).map((s) => (
        <div key={s} className="w-[146px]"><CalendarEvent series={s} title="Design review" time="11:00 - 12:30" /></div>
      ))}
      <div className="w-[146px]"><CalendarEvent state="selected" title="Design review" time="11:00 - 12:30" /></div>
      <div className="w-[146px]"><CalendarEvent status="tentative" title="Design review" time="11:00 - 12:30" /></div>
      <div className="w-[146px]"><CalendarEvent status="cancelled" title="Design review" time="11:00 - 12:30" /></div>
      <div className="w-[146px]"><CalendarEvent size="sm" title="Design review" time="11:00 - 12:30" /></div>
    </div>
    <div className="flex flex-col gap-3">
      <GanttBar className="w-[200px]" status="planned" label="Visual design" />
      <GanttBar className="w-[200px]" label="Visual design" />
      <GanttBar className="w-[200px]" status="done" label="Visual design" />
      <GanttBar className="w-[200px]" status="blocked" label="Visual design" />
      <GanttMilestone label="Design review" />
    </div>
    <div className="flex flex-col gap-2">
      <AgendaItem state="past" start="08:30" end="09:00" title="Standup" meta="Google Meet · 6 people" />
      <AgendaItem state="now" start="09:30" end="10:15" title="Weekly cash review" meta="Room 2 · 4 people" />
      <AgendaItem start="11:00" end="12:00" title="Supplier call" meta="Phone · 2 people" />
    </div>
    <div className="flex flex-wrap gap-6">
      <MeetingCard title="Q4 planning" time="Today, 15:00–16:00 CET" place="Google Meet" people={<People />} />
      <MeetingCard state="live" title="Q4 planning" time="Today, 15:00–16:00 CET" place="Google Meet" people={<People />} />
    </div>
    <div>
      <AvailabilityRow day="Monday" />
      <AvailabilityRow day="Saturday" available={false} />
    </div>
  </div>
);
export const AllDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, render: () => <All /> };
export const AllCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: () => <All /> };
