import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { UptimeBars, UptimeDay, type UptimeState } from './uptime-bars';

const fmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const END = Date.UTC(2026, 9, 5);

/** 90 days ending 5 Oct 2026; `overrides` maps an index (0 = oldest) to a state and optional incident. */
function makeDays(count = 90, overrides: Record<number, { state: UptimeState; incident?: { title: string; href: string } }> = {}) {
  return Array.from({ length: count }, (_, i) => {
    const date = fmt.format(new Date(END - (count - 1 - i) * 86_400_000));
    return { date, ...(overrides[i] ?? { state: 'operational' as UptimeState }) };
  });
}

const days = makeDays(90, {
  0: { state: 'no-data' },
  1: { state: 'no-data' },
  40: { state: 'maintenance' },
  61: { state: 'degraded', incident: { title: 'Elevated API errors', href: '#incident-api-errors' } },
  80: { state: 'outage', incident: { title: 'Payments unavailable', href: '#incident-payments' } },
});

const meta = {
  title: 'Components/Alert/Uptime Bars',
  component: UptimeBars,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Uptime history of one service: 90 Uptime Day bars, oldest left, with a caption row. Every day has a text label (date and state); days with an incident are links with a tooltip. Figma: Alert page / Uptime Bars (555:4640). Guide: eggux build-ui/patterns/content-and-docs.md' } },
  },
  args: { days },
  decorators: [Story => <div className="w-[720px] max-w-full"><Story /></div>],
} satisfies Meta<typeof UptimeBars>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma: 90 bars, 28 px high, 2 px apart, bars fill the 720 px width, caption row 12 px below.
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const list = canvas.getByRole('list', { name: 'Uptime, last 90 days' });
    const items = within(list).getAllByRole('listitem');
    await expect(items).toHaveLength(90);
    const bars = items.map(li => li.querySelector('[aria-hidden="true"]')!);
    await expect(Math.round(box(bars[0]).height)).toBe(28);
    await expect(Math.round(box(items[1]).left - box(items[0]).right)).toBe(2);
    await expect(Math.round(box(list).width)).toBe(720);
    // Same width for every bar (to a pixel) and oldest on the left.
    await expect(Math.abs(box(items[0]).width - box(items[89]).width)).toBeLessThan(0.5);
    await expect(box(items[0]).left).toBeLessThan(box(items[89]).left);
    const caption = canvas.getByText('90 days ago').parentElement!;
    await expect(Math.round(box(caption).top - box(list).bottom)).toBe(12);
    await expect(canvas.getByText('Today')).toBeVisible();
    await expect(canvasElement.querySelectorAll('[data-slot="uptime-day"]')).toHaveLength(90);
  },
};

// Color is never the only signal: every day says its date and state in text.
export const AccessibleDays: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('5 Oct 2026: operational')).toBeInTheDocument();
    await expect(canvas.getByText('8 Jul 2026: no data')).toBeInTheDocument();
    const incident = canvas.getByRole('link', { name: /Elevated API errors/ });
    await expect(incident).toHaveAccessibleName(/degraded/);
    await expect(canvas.getByRole('link', { name: /Payments unavailable/ })).toHaveAccessibleName(/outage/);
  },
};

// Tooltip on days: hover shows date, state and incident title.
export const Tooltips: Story = {
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: /Elevated API errors/ });
    await userEvent.hover(link);
    const tip = await within(document.body).findByRole('tooltip');
    await expect(tip).toHaveTextContent('degraded');
    await expect(tip).toHaveTextContent('Elevated API errors');
    await userEvent.unhover(link);
    await waitFor(() => expect(within(document.body).queryByRole('tooltip')).toBeNull());
  },
};

// Keyboard: Tab reaches days with an incident, in order; focus opens the tooltip; Enter follows the link.
export const Keyboard: Story = {
  play: async ({ canvas }) => {
    const [first, second] = canvas.getAllByRole('link');
    await userEvent.tab();
    await expect(first).toHaveFocus();
    await expect(await within(document.body).findByRole('tooltip')).toHaveTextContent('Elevated API errors');
    await userEvent.tab();
    await expect(second).toHaveFocus();
    // Days without an incident are not tab stops.
    await expect(canvas.getAllByRole('link')).toHaveLength(2);
  },
};

// Figma Show labels off: bars only.
export const NoLabels: Story = {
  args: { showLabels: false },
  play: async ({ canvas }) => {
    await expect(canvas.queryByText('90 days ago')).toBeNull();
    await expect(canvas.queryByText('Today')).toBeNull();
  },
};

// Figma Uptime Day: one bar, 8 x 28 in the component set; here every state side by side.
const states: UptimeState[] = ['operational', 'degraded', 'outage', 'maintenance', 'no-data'];
export const DayStates: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ul className="m-0 flex list-none gap-0.5 p-0">
      {states.map(s => <UptimeDay key={s} state={s} date="3 Oct 2026" className="w-2 flex-none" />)}
    </ul>
  ),
  play: async ({ canvas, canvasElement }) => {
    for (const s of states) await expect(canvas.getByText(`3 Oct 2026: ${s === 'no-data' ? 'no data' : s}`)).toBeInTheDocument();
    const bars = Array.from(canvasElement.querySelectorAll('[data-slot="uptime-day"] > * > [aria-hidden="true"], [data-slot="uptime-day"] [aria-hidden="true"]'));
    await expect(Math.round(box(bars[0]).width)).toBe(8);
    await expect(Math.round(box(bars[0]).height)).toBe(28);
    await expect(new Set(bars.map(b => getComputedStyle(b).backgroundColor)).size).toBe(5);
  },
};

// Stress tests (Figma "Uptime Bars / Stress test"): narrow columns, fewer days, long caption labels.
export const Narrow276: Story = { tags: ['!dev'],
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  play: async ({ canvas }) => {
    const list = canvas.getByRole('list');
    await expect(Math.round(box(list).width)).toBe(276);
    await expect(list.scrollWidth).toBeLessThanOrEqual(list.clientWidth);
    const items = within(list).getAllByRole('listitem');
    await expect(box(items[89]).right).toBeLessThanOrEqual(box(list).right + 0.5);
  },
};

export const Narrow368: Story = { tags: ['!dev'],
  decorators: [Story => <div className="w-[368px]"><Story /></div>],
  play: async ({ canvas }) => {
    await expect(Math.round(box(canvas.getByRole('list')).width)).toBe(368);
  },
};

export const LongLabels: Story = { tags: ['!dev'],
  args: { startLabel: 'Since the Acme Payments API went live in the EUR region', endLabel: 'Today, updated every minute from all regions' },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  play: async ({ canvas }) => {
    const end = canvas.getByText(/^Today, updated/);
    await expect(Math.round(box(end).width)).toBeLessThanOrEqual(96);
    await expect(Math.round(box(end).height)).toBeLessThanOrEqual(16);
    const start = canvas.getByText(/^Since the Acme/);
    await expect(Math.round(box(start).height)).toBeLessThanOrEqual(16);
  },
};

export const FewDays: Story = { tags: ['!dev'],
  args: { days: makeDays(14, { 3: { state: 'outage' } }), startLabel: '14 days ago' },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('listitem')).toHaveLength(14);
  },
};

export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
