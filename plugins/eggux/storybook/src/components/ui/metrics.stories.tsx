import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Countdown, LeaderboardRow, MetricStrip, MetricStripItem, TrendIndicator, UsageMeter } from './metrics';

const meta = {
  title: 'Components/Metrics/Metric Strip',
  component: MetricStrip,
  parameters: { controls: { disable: true },
    layout: 'padded',
    docs: { description: { component: 'Key figures lighter than Stat Cards: Metric Strip (3-5 figures with dividers, one period said nearby), Trend Indicator (arrow, signed value, comparison; Tone says if the change is good), Usage Meter (a plan limit: near from 80%, over above 100%), Countdown (time left to a deadline; screen readers get the end time) and Leaderboard Row (rank, person, value; the viewer’s own row on muted). Figma: Metrics page. Guide: eggux build-ui/components/progress-and-slider.md, build-ui/patterns/marketing-pages.md' } },
  },
  render: () => (
    <div className="w-[1136px]">
      <MetricStrip aria-label="October">
        <MetricStripItem label="Revenue" value="€1.84M" trend={<TrendIndicator trend="up" value="+12.4%" />} />
        <MetricStripItem label="Overdue" value="€96.4K" trend={<TrendIndicator trend="down" tone="positive" value="−8.0%" />} />
        <MetricStripItem label="Days to collect" value="38" trend={<TrendIndicator trend="up" tone="negative" value="+3 days" />} />
        <MetricStripItem label="Open invoices" value="248" trend={<TrendIndicator trend="flat" value="0" />} />
      </MetricStrip>
    </div>
  ),
} satisfies Meta<typeof MetricStrip>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma: strip 121, items 88, dividers after the first, tone independent of direction.
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const strip = canvasElement.querySelector('[data-slot="metric-strip"]')!;
    await expect(Math.round(box(strip).height)).toBe(121);
    const items = canvasElement.querySelectorAll('[data-slot="metric-strip-item"]');
    await expect(Math.round(box(items[0]!).height)).toBe(88);
    await expect(getComputedStyle(items[0]!, '::before').content).toBe('none');
    await expect(getComputedStyle(items[1]!, '::before').width).toBe('1px');
    const trends = canvasElement.querySelectorAll('[data-slot="trend-indicator"]');
    await expect(trends[1]).toHaveAttribute('data-tone', 'positive');
    await expect(trends[2]).toHaveAttribute('data-tone', 'negative');
  },
};

// Trend Indicator text and badge; Usage Meter levels; Countdown styles; Leaderboard rows.
export const Parts: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-6">
        <TrendIndicator trend="up" value="+12.4%" />
        <TrendIndicator trend="down" value="−12.4%" variant="badge" />
        <TrendIndicator trend="flat" value="0.0%" variant="badge" comparison="" />
      </div>
      <div className="flex w-[320px] flex-col gap-6">
        <UsageMeter label="Storage" used={4} limit={10} usage="4 GB of 10 GB" hint="Files, attachments and exports." />
        <UsageMeter label="Seats" used={9} limit={10} usage="9 of 10" hint="1 seat left. Add seats before you invite more people." />
        <UsageMeter label="Seats" used={11} limit={10} usage="11 of 10" hint="1 person over the limit. Add a seat or remove someone by 1 Nov." />
      </div>
      <div className="flex flex-col items-start gap-6">
        <Countdown to="2026-11-14T18:00:00Z" now="2026-11-12T03:23:48Z" endLabel="Offer ends 14 Nov 2026, 18:00 UTC" showSeconds />
        <Countdown variant="boxed" to="2026-11-14T18:00:00Z" now="2026-11-12T03:23:48Z" endLabel="Webinar starts 14 Nov 2026, 18:00 UTC" showSeconds />
        <Countdown variant="inline" to="2026-11-14T18:00:00Z" now="2026-11-12T03:23:48Z" endLabel="Sale ends 14 Nov 2026, 18:00 UTC" showSeconds />
      </div>
      <ol aria-label="Top sellers, October" className="m-0 flex w-[400px] flex-col p-0">
        <LeaderboardRow rank={1} name="Maria Ilie" initials="MI" value="€52,900" />
        <LeaderboardRow rank={2} name="Dan Cristea" initials="DC" value="€48,250" />
        <LeaderboardRow rank={7} name="You" initials="EP" value="€31,400" current />
      </ol>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    // Usage levels from the share; the over level colors the usage text.
    const meters = canvasElement.querySelectorAll('[data-slot="usage-meter"]');
    await expect([...meters].map(m => m.getAttribute('data-level'))).toEqual(['normal', 'near', 'over']);
    const bars = canvas.getAllByRole('progressbar');
    await expect(bars[2]).toHaveAccessibleName('Seats');
    await expect(bars[2]).toHaveAttribute('aria-valuetext', '11 of 10');
    // Countdown: 2 d 14 h 36 min 12 s, tiles 64 / 76, the end time read instead of the digits.
    const [def, boxed, inline] = canvasElement.querySelectorAll('[data-slot="countdown"]');
    await expect(def!.querySelector('[data-unit="days"]')!.textContent).toBe('02days');
    await expect(def!.querySelector('[data-unit="seconds"]')!.textContent).toBe('12sec');
    await expect(Math.round(box(def!.querySelector('[data-unit="days"]')!).width)).toBe(64);
    await expect(Math.round(box(def!).height)).toBe(66);
    await expect(Math.round(box(boxed!.querySelector('[data-unit="days"]')!).width)).toBe(76);
    await expect(Math.round(box(boxed!).height)).toBe(82);
    await expect(Math.round(box(inline!).height)).toBe(50);
    await expect(canvas.getByText('Offer ends 14 Nov 2026, 18:00 UTC')).toHaveClass('sr-only');
    // Leaderboard: 40 rows, the current one marked.
    const rows = canvasElement.querySelectorAll('[data-slot="leaderboard-row"]');
    await expect(Math.round(box(rows[0]!).height)).toBe(40);
    await expect(rows[2]).toHaveAttribute('aria-current', 'true');
  },
};

// Countdown hides seconds outside the last hour and stops at zero. Tests only.
export const CountdownEdges: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => (
    <div className="flex flex-col gap-4">
      <Countdown to="2026-11-14T18:00:00Z" now="2026-11-12T03:23:48Z" endLabel="Ends 14 Nov" />
      <Countdown to="2026-11-14T18:00:00Z" now="2026-11-14T17:30:00Z" endLabel="Ends soon" />
      <Countdown to="2026-11-14T18:00:00Z" now="2026-11-15T00:00:00Z" endLabel="Ended" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [far, near, done] = canvasElement.querySelectorAll('[data-slot="countdown"]');
    await expect(far!.querySelector('[data-unit="seconds"]')).toBeNull();
    await expect(near!.querySelector('[data-unit="seconds"]')).not.toBeNull();
    await expect(near!.querySelector('[data-unit="minutes"]')!.textContent).toBe('30min');
    await expect([...done!.querySelectorAll('[data-unit]')].every(u => u.textContent!.startsWith('00'))).toBe(true);
  },
};

// Usage Meter unit, unlimited and the state in words. Tests only.
export const UsageMeterStates: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => (
    <div className="flex w-[276px] flex-col gap-6">
      <UsageMeter label="Storage" used={4} limit={10} unit="GB" />
      <UsageMeter label="Seats" used={8} limit={10} unit="seats" />
      <UsageMeter label="Seats" used={11} limit={10} unit="seats" />
      <UsageMeter label="API calls" used={0} limit={0} unlimited hint="No cap on your plan." />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText('4 of 10 GB')).toBeInTheDocument();
    await expect(canvas.getByText('80 percent used, near the limit')).toBeInTheDocument();
    await expect(canvas.getByText('Over the limit')).toBeInTheDocument();
    await expect(canvas.getByText('Unlimited')).toBeInTheDocument();
    await expect(canvas.getAllByRole('progressbar')).toHaveLength(3);
    const meters = canvasElement.querySelectorAll('[data-slot="usage-meter"]');
    await expect(meters[3]).toHaveAttribute('data-unlimited', 'true');
    await expect(meters[3]!.querySelector('[role="progressbar"]')).toBeNull();
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};

// Stress: long names and values truncate at 280; a strip wraps at 480. Tests only.
export const Stress: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => (
    <div className="flex flex-col gap-4">
      <ol className="m-0 w-[280px] p-0">
        <LeaderboardRow rank={10} name="Alexandra-Maria Constantinescu-Ionescu" initials="AC" value="€1,248,250.00" />
      </ol>
      <div className="w-[480px]">
        <MetricStrip>
          <MetricStripItem label="Revenue" value="€1.84M" />
          <MetricStripItem label="Overdue" value="€96.4K" />
          <MetricStripItem label="Days to collect" value="38" />
          <MetricStripItem label="Open invoices" value="248" />
        </MetricStrip>
      </div>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const name = canvas.getByTitle(/Alexandra-Maria/);
    await expect(name.scrollWidth).toBeGreaterThan(name.clientWidth);
    await expect(Math.round(box(canvas.getByTitle('€1,248,250.00')).width)).toBeLessThanOrEqual(88);
    const items = canvasElement.querySelectorAll('[data-slot="metric-strip-item"]');
    await expect(box(items[3]!).top).toBeGreaterThan(box(items[0]!).top);
  },
};

export const DefaultDark: Story = { parameters: { controls: { disable: true } }, tags: ['!dev'], globals: { theme: 'Dark' }, render: Parts.render };
export const DefaultCorporate: Story = { parameters: { controls: { disable: true } }, tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: Parts.render };
