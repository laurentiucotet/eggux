import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';
import { Changelog, StatusPage } from './content-updates';

interface Args {
  title: string;
  description?: string;
  showImage?: boolean;
  state?: 'operational' | 'degraded';
  showIncidents?: boolean;
}

const meta: Meta<Args> = {
  title: 'Blocks/Content/Updates',
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Product updates. Changelog: releases newest first, version and date in the meta line, one Release Note Line per change (New, Improved, Fixed). Status Page: the overall state in one sentence, one row per service with uptime as text and 90 daily bars, past incidents in plain language. Figma: BLOCKS / Content (Changelog, Status Page). Guide: eggux build-ui/patterns/content-and-docs.md' } },
  },
};
export default meta;
type Story = StoryObj<Args>;

export const ChangelogStory: Story = {
  name: 'Changelog',
  args: { title: 'What is new in Acme', description: 'New features, improvements and fixes. Subscribe by email or RSS.', showImage: true },
  argTypes: {
    title: { name: 'Title', control: 'text', table: { category: 'Section Header' } },
    description: { name: 'Description', control: 'text', table: { category: 'Section Header' } },
    showImage: { name: 'Show image on the latest release', control: 'boolean', table: { category: 'Releases' } },
  },
  render: a => (
    <Changelog
      title={a.title}
      description={a.description}
      releases={a.showImage ? undefined : [
        { type: 'new', meta: 'v2.4 · Oct 15, 2026', title: 'Approvals now support delegation', changes: [{ type: 'new', text: 'Delegate approvals to a deputy for a date range.' }, { type: 'improved', text: 'Approval emails show the full amount and cost center.' }, { type: 'fixed', text: 'Escalation timers no longer reset after an edit.' }] },
        { type: 'new', meta: 'v2.3 · Oct 1, 2026', title: 'Scheduled reports', changes: [{ type: 'new', text: 'Schedule any report as PDF or CSV, daily, weekly or monthly.' }, { type: 'improved', text: 'Exports of more than 50,000 rows run in the background.' }] },
      ]}
    />
  ),
};

export const Status: Story = {
  name: 'Status Page',
  args: { title: 'Acme status', state: 'operational', showIncidents: true },
  argTypes: {
    title: { name: 'Title', control: 'text', table: { category: 'Header' } },
    state: { name: 'Overall state', control: 'inline-radio', options: ['operational', 'degraded'], description: 'Degraded marks Payments and links the row to the incident.', table: { category: 'Services' } },
    showIncidents: { name: 'Show past incidents', control: 'boolean', table: { category: 'Incidents' } },
  },
  render: a => (
    <StatusPage
      title={a.title}
      incidents={a.showIncidents ? undefined : []}
      {...(a.state === 'degraded' ? degraded : {})}
    />
  ),
};

const degraded = {
  summary: { variant: 'warning' as const, title: 'Payments are slower than usual', description: 'Card confirmations take up to 5 minutes. No payments are lost. Next update at 14:30 UTC.' },
  services: [
    { name: 'Web app', uptime: '99.99% uptime' },
    { name: 'API', uptime: '99.97% uptime' },
    { name: 'Payments', status: 'degraded' as const, uptime: '99.90% uptime', incidents: [{ daysAgo: 0, state: 'degraded' as const, title: 'Slow card confirmations', href: '#incident-today' }], incident: { title: 'Slow card confirmations', href: '#incident-today' } },
    { name: 'Email delivery', uptime: '100% uptime' },
    { name: 'Reports and exports', uptime: '99.98% uptime' },
  ],
};

/* Hidden checks */

const box = (el: Element) => el.getBoundingClientRect();
const w = (el: Element) => Math.round(box(el).width);

const Both = ({ width }: { width: number }) => (
  <div style={{ width }} className="flex flex-col">
    <Changelog />
    <StatusPage />
  </div>
);

async function common(canvasElement: HTMLElement, width: number) {
  const c = within(canvasElement);
  const changelog = c.getByRole('region', { name: 'What is new in Acme' });
  const status = c.getByRole('region', { name: 'Acme status' });
  await expect(within(changelog).getByRole('heading', { level: 2, name: 'What is new in Acme' })).toBeInTheDocument();
  await expect(within(status).getByRole('heading', { level: 2, name: 'Acme status' })).toBeInTheDocument();
  await expect(c.queryAllByRole('heading', { level: 1 })).toHaveLength(0);
  // Releases: one h3 per release, newest first; each line says New / Improved / Fixed in text.
  const releases = within(changelog).getAllByRole('article');
  await expect(releases).toHaveLength(3);
  await expect(releases[0]).toHaveTextContent('v2.4');
  await expect(within(releases[0]!).getAllByRole('listitem').map(li => li.textContent?.slice(0, 5))).toEqual(['NewDe', 'Impro', 'Fixed']);
  // Status: 5 services, each with 90 days and uptime and status in words.
  const services = within(status).getByRole('list', { name: 'Services' });
  const rows = services.querySelectorAll(':scope > li');
  await expect(rows).toHaveLength(5);
  for (const r of rows) {
    await expect(r.querySelectorAll('[data-slot="uptime-day"]')).toHaveLength(90);
    await expect(r).toHaveTextContent(/uptime/);
    await expect(r).toHaveTextContent('Operational');
  }
  await expect(within(status).getByRole('heading', { level: 2, name: 'Past incidents' })).toBeInTheDocument();
  await expect(within(status).getAllByText('Resolved')).toHaveLength(2);
  for (const el of [...c.getAllByRole('link'), ...c.getAllByRole('button')]) await expect(el).toHaveAccessibleName();
  for (const r of [changelog, status]) {
    await expect(w(r)).toBe(width);
    await expect(r.scrollWidth).toBeLessThanOrEqual(width);
  }
  return { changelog, status };
}

// Figma at 1440: Changelog 1152, the first release image 1152 × 648; Status 896, 96 padding.
export const Desktop: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <Both width={1440} />,
  play: async ({ canvasElement }) => {
    const { changelog, status } = await common(canvasElement, 1440);
    await expect(w(changelog.querySelector('[data-slot="changelog-releases"]')!)).toBe(1152);
    const img = changelog.querySelector('[data-slot="release-note-item"] [data-slot="image-placeholder"]')!;
    await expect(w(img)).toBe(1152);
    await expect(Math.round(box(img).height)).toBe(648);
    const inner = status.querySelector('[data-slot="section-container"]')!;
    await expect(getComputedStyle(inner).paddingTop).toBe('96px');
    await expect(w(inner) - 48).toBe(896);
    await expect(within(status).getByRole('button', { name: 'Subscribe to updates' })).toBeVisible();
  },
};

export const Tablet: Story = { tags: ['!dev'], parameters: { controls: { disable: true } }, render: () => <Both width={768} />, play: async ({ canvasElement }) => { await common(canvasElement, 768); } };

// 390: 64 padding, the Subscribe button wraps under the title, bars stay inside the row.
export const Phone: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <Both width={390} />,
  play: async ({ canvasElement }) => {
    const { status } = await common(canvasElement, 390);
    await expect(getComputedStyle(status.querySelector('[data-slot="section-container"]')!).paddingTop).toBe('64px');
    const heading = within(status).getByRole('heading', { level: 2, name: 'Acme status' });
    await expect(box(within(status).getByRole('button', { name: 'Subscribe to updates' })).top).toBeGreaterThan(box(heading).bottom);
    const bars = status.querySelector('[data-slot="uptime-bars"] ul')!;
    await expect(bars.scrollWidth).toBeLessThanOrEqual(Math.ceil(box(bars).width));
  },
};

// Degraded: Payments row says Degraded in words and links to the incident; today's bar is a link.
export const DegradedCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <div style={{ width: 1440 }}><StatusPage {...degraded} /></div>,
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Payments are slower than usual')).toBeVisible();
    await waitFor(() => expect(canvas.getByRole('link', { name: 'Degraded: Slow card confirmations' })).toHaveAttribute('href', '#incident-today'));
    await expect(canvas.getByRole('link', { name: 'Degraded: Slow card confirmations' }).closest('[data-slot="service-status-row"]')).toHaveAttribute('data-status', 'degraded');
    await expect(canvas.getByRole('link', { name: /degraded\. Slow card confirmations/ })).toHaveAttribute('href', '#incident-today');
  },
};

export const BothDark: Story = { tags: ['!dev'], parameters: { controls: { disable: true } }, globals: { theme: 'Dark' }, render: () => <Both width={1440} /> };
export const BothCorporate: Story = { tags: ['!dev'], parameters: { controls: { disable: true } }, globals: { theme: 'Corporate Light' }, render: () => <Both width={1440} /> };
