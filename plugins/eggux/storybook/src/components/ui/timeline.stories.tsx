import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Check, Package, Send } from '@/components/icons';
import { Timeline, TimelineItem } from './timeline';

const meta = {
  title: 'Components/Timeline/Timeline Item',
  component: TimelineItem,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'One event in an activity history (record history, audit log, order tracking), newest first. Tone marks the outcome. Layout default for record pages, card for events with notes, alternating for milestones on marketing pages, horizontal for roadmaps and order steps on wide screens; Size sm for side panels. Relative time under 24 h, absolute after, full timestamp on hover. Figma: Timeline page / Timeline Item. Guide: eggux build-ui/components/description-list.md' } },
  },
  args: { title: 'Order placed', time: '2 h ago', description: 'Maria Ilie · Order #1042 · 22 Oct, 10:30' },
  render: () => (
    <Timeline className="w-[480px]">
      <TimelineItem tone="success" icon={<Check />} title="Delivered" time="10 min ago" dateTime="2026-11-07T10:20" timeTitle="7 Nov 2026, 10:20" description="Left at the reception, signed by A. Pop" />
      <TimelineItem tone="primary" icon={<Send />} title="Out for delivery" time="3 h ago" description="Courier: FAN Courier · AWB 2318 4410" />
      <TimelineItem icon={<Package />} title="Order placed" time="22 Oct, 10:30" description="Maria Ilie · Order #1042" />
    </Timeline>
  ),
} satisfies Meta<typeof TimelineItem>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma Layout=default: 480 × 70, 24 dot, connector hidden on the last item, a list of three.
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const items = canvasElement.querySelectorAll<HTMLElement>('[data-slot="timeline-item"]');
    await expect(canvas.getAllByRole('listitem')).toHaveLength(3);
    await expect(Math.round(box(items[2]!).height)).toBe(70);
    await expect(Math.round(box(items[0]!.querySelector('[data-slot="timeline-dot"]')!).width)).toBe(24);
    await expect(getComputedStyle(items[2]!.querySelector('[data-slot="timeline-connector"]')!).visibility).toBe('hidden');
    await expect(canvasElement.querySelector('time')).toHaveAttribute('title', '7 Nov 2026, 10:20');
  },
};

// Layout=card (94) with notes, and Size=sm (50) for side panels.
export const CardAndSmall: Story = {
  render: () => (
    <div className="flex gap-10">
      <Timeline className="w-[480px]">
        <TimelineItem layout="card" tone="primary" title="Note added" time="1 h ago" description="Customer asked to deliver after 14:00." />
        <TimelineItem layout="card" title="Order placed" time="22 Oct, 10:30" description="Maria Ilie · Order #1042" />
      </Timeline>
      <Timeline className="w-[320px]">
        <TimelineItem size="sm" title="Status changed to Paid" time="5 min ago" description="By Daniel Pop" />
        <TimelineItem size="sm" title="Invoice sent" time="Yesterday" description="To billing@northwind.com" />
      </Timeline>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const items = canvasElement.querySelectorAll('[data-slot="timeline-item"]');
    await expect(Math.round(box(items[0]!).height)).toBe(94);
    await expect(Math.round(box(items[2]!).height)).toBe(50);
    await expect(Math.round(box(items[2]!.querySelector('[data-slot="timeline-dot"]')!).width)).toBe(16);
  },
};

// Alternating for milestones (640) and horizontal steps (200 each, no gap).
export const Milestones: Story = {
  render: () => (
    <div className="flex flex-col gap-10">
      <Timeline className="w-[640px]">
        <TimelineItem layout="alternating-left" tone="primary" title="Acme founded" time="2019" description="Three people in Cluj-Napoca." />
        <TimelineItem layout="alternating-right" title="10,000 teams" time="2024" description="Customers in 40 countries." />
      </Timeline>
      <Timeline orientation="horizontal">
        <TimelineItem layout="horizontal" tone="success" icon={<Check />} className="w-[200px]" title="Ordered" time="22 Oct" description="Order #1042" />
        <TimelineItem layout="horizontal" tone="primary" icon={<Send />} className="w-[200px]" title="Shipped" time="23 Oct" description="AWB 2318 4410" />
        <TimelineItem layout="horizontal" icon={<Package />} className="w-[200px]" title="Delivered" time="Expected 25 Oct" description="Cluj-Napoca" />
      </Timeline>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const items = canvasElement.querySelectorAll('[data-slot="timeline-item"]');
    await expect(Math.round(box(items[0]!).height)).toBe(70);
    const rail = items[0]!.querySelector('[data-slot="timeline-dot"]')!;
    await expect(Math.round(box(rail).left + 12)).toBe(Math.round(box(items[0]!).left + 320));
    // 122 in Figma with a 2-line description; one line here.
    await expect(Math.round(box(items[2]!).height)).toBe(102);
    await expect(Math.round(box(items[3]!).left)).toBe(Math.round(box(items[2]!).right));
  },
};

// Stress: long title and time truncate the time at 128; card at 200 wraps the time under the title. Tests only.
export const Stress: Story = {
  tags: ['!dev'],
  render: () => (
    <div className="flex gap-6">
      <Timeline className="w-[360px]">
        <TimelineItem title="Payment reminder sent automatically to the billing contact" time="Yesterday at 23:59 (Europe/Bucharest)" description="Second reminder for INV-0412" />
      </Timeline>
      <Timeline className="w-[200px]">
        <TimelineItem layout="card" title="Refund issued" time="22 Oct, 10:30" />
      </Timeline>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [long, card] = canvasElement.querySelectorAll('[data-slot="timeline-item"]');
    const time = long!.querySelector('time')!;
    await expect(Math.round(box(time).width)).toBeLessThanOrEqual(128);
    const cardTitle = card!.querySelector('p')!;
    await expect(box(card!.querySelector('time')!).top).toBeGreaterThanOrEqual(box(cardTitle).bottom);
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
