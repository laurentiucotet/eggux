import type { Meta, StoryObj } from '@storybook/react-vite';
import type * as React from 'react';
import { expect, userEvent } from 'storybook/test';
import { ServiceStatusRow } from './service-status-row';
import type { UptimeState } from './uptime-bars';

const fmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const END = Date.UTC(2026, 9, 5);
const days = Array.from({ length: 90 }, (_, i) => ({
  date: fmt.format(new Date(END - (89 - i) * 86_400_000)),
  state: (i === 61 ? 'degraded' : 'operational') as UptimeState,
  incident: i === 61 ? { title: 'Elevated API errors', href: '#incident-api-errors' } : undefined,
}));

const List = ({ children }: { children: React.ReactNode }) => <ul className="m-0 list-none p-0">{children}</ul>;

const meta = {
  title: 'Components/Alert/Service Status Row',
  component: ServiceStatusRow,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'One service on a status page or admin health panel: name, uptime and the current status in words with a Status Dot; optional 90-day Uptime Bars. Put rows in a list. A status other than operational links to the incident. Figma: Alert page / Service Status Row (458:2473). Guide: eggux build-ui/patterns/content-and-docs.md' } },
  },
  args: { days },
  decorators: [Story => <div className="w-[720px] max-w-full"><Story /></div>],
  render: args => <List><ServiceStatusRow {...args} /></List>,
} satisfies Meta<typeof ServiceStatusRow>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();
const row = (root: HTMLElement) => root.querySelector('[data-slot="service-status-row"]') as HTMLElement;

// Figma Status=operational, 720 x 45: name, uptime, status word on one line.
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText('Payments API')).toBeVisible();
    await expect(canvas.getByText('99.98% uptime')).toBeVisible();
    await expect(canvas.getByText('Operational')).toBeVisible();
    await expect(Math.round(box(row(canvasElement)).width)).toBe(720);
    await expect(Math.round(box(row(canvasElement)).height)).toBe(45);
    await expect(canvas.getByRole('listitem')).toHaveTextContent('Payments API');
    await expect(canvas.queryByRole('list', { name: /Uptime/ })).toBeNull();
  },
};

// The four Figma statuses: the word is real text; non-operational ones link to the incident.
export const Statuses: Story = {
  render: args => (
    <List>
      <ServiceStatusRow {...args} name="Web app" />
      <ServiceStatusRow {...args} status="degraded" name="API" uptime="99.71% uptime" incident={{ title: 'Elevated API errors', href: '#api' }} />
      <ServiceStatusRow {...args} status="outage" name="Payments" uptime="98.90% uptime" incident={{ title: 'Payments unavailable', href: '#payments' }} />
      <ServiceStatusRow {...args} status="maintenance" name="Webhooks" uptime="99.95% uptime" incident={{ title: 'Scheduled maintenance until 06:00 UTC', href: '#webhooks' }} />
    </List>
  ),
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getAllByRole('listitem')).toHaveLength(4);
    for (const w of ['Operational', 'Degraded', 'Outage', 'Maintenance']) await expect(canvas.getByText(w)).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Degraded: Elevated API errors' })).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: 'Outage: Payments unavailable' })).toBeInTheDocument();
    await expect(canvas.getAllByRole('link')).toHaveLength(3);
    for (const r of canvasElement.querySelectorAll('[data-slot="service-status-row"]')) await expect(Math.round(box(r).height)).toBe(45);
  },
};

// Show bars: Uptime Bars under the name line, with labels "90 days ago" / "Today".
export const WithBars: Story = {
  args: { showBars: true, status: 'degraded', uptime: '99.71% uptime', incident: { title: 'Elevated API errors', href: '#api-status' } },
  play: async ({ canvas, canvasElement }) => {
    const list = canvas.getByRole('list', { name: 'Uptime, last 90 days' });
    await expect(canvas.getAllByRole('listitem')).toHaveLength(91);
    await expect(Math.round(box(list).width)).toBe(720);
    await expect(canvas.getByText('90 days ago')).toBeVisible();
    await expect(Math.round(box(row(canvasElement)).height)).toBe(113);
  },
};

export const KeyboardLinks: Story = {
  args: { showBars: true, status: 'degraded', incident: { title: 'Elevated API errors', href: '#api-status' } },
  play: async ({ canvas }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('link', { name: 'Degraded: Elevated API errors' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('link', { name: /Elevated API errors/, description: '' })).toBeTruthy();
  },
};

export const NoUptime: Story = {
  args: { showUptime: false },
  play: async ({ canvas }) => {
    await expect(canvas.queryByText('99.98% uptime')).toBeNull();
  },
};

// Stress test: a long name truncates to one line; in a narrow column uptime and status drop under it.
export const LongName: Story = { tags: ['!dev'],
  args: { name: 'Acme Payments API for EUR card settlements and refunds across every region', showBars: true },
  decorators: [Story => <div className="w-[368px]"><Story /></div>],
  play: async ({ canvas, canvasElement }) => {
    const name = canvas.getByText(/^Acme Payments API/);
    await expect(Math.round(box(name).height)).toBe(20);
    await expect(name.scrollWidth).toBeGreaterThan(name.clientWidth);
    const r = row(canvasElement);
    await expect(r.scrollWidth).toBeLessThanOrEqual(r.clientWidth);
  },
};

export const Narrow276: Story = { tags: ['!dev'],
  args: { showBars: true, status: 'outage', incident: { title: 'Payments unavailable', href: '#payments' } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  play: async ({ canvas, canvasElement }) => {
    const r = row(canvasElement);
    await expect(Math.round(box(r).width)).toBe(276);
    await expect(r.scrollWidth).toBeLessThanOrEqual(r.clientWidth);
    // 128 (name min) + 16 + uptime + 16 + status > 276: the status wraps under the name.
    await expect(box(canvas.getByText('Outage')).top).toBeGreaterThan(box(canvas.getByText('Payments API')).bottom - 1);
    await expect(canvas.getByRole('list', { name: 'Uptime, last 90 days' })).toBeVisible();
  },
};

export const WithBarsDark: Story = { ...WithBars, tags: ['!dev'], globals: { theme: 'Dark' } };
export const StatusesDark: Story = { ...Statuses, tags: ['!dev'], globals: { theme: 'Dark' } };
export const WithBarsCorporate: Story = { ...WithBars, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
export const StatusesCorporate: Story = { ...Statuses, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
