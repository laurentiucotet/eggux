import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Sparkles } from '@/components/icons';
import { StatCard } from './stat-card';

const meta = {
  title: 'Components/Card/Stat Card',
  component: StatCard,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Metric card. Layout vertical (default), compact (Icon Tile, no footer) or horizontal (Sparkline on the right); one Layout per row. Trend sets the icon, the sparkline and the change Badge tone; the Badge is exposed (changeLabel, changeVariant): when down is good keep Trend=down and use soft-success. Direction is shown by icon and sign, never color alone. Figma: Card page / Stat Card. Guide: eggux build-ui/components/card.md' } },
  },
  args: { icon: <Sparkles /> },
} satisfies Meta<typeof StatCard>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();
const card = (el: HTMLElement) => el.querySelector('[data-slot="stat-card"]') as HTMLElement;
const probeBg = (cls: string) => {
  const p = document.createElement('span');
  p.className = cls;
  document.body.append(p);
  const c = getComputedStyle(p).backgroundColor;
  p.remove();
  return c;
};

// Figma Trend=up, Layout=vertical: 288 x 172.
export const Default: Story = {
  play: async ({ canvasElement, canvas }) => {
    const el = card(canvasElement);
    await expect(Math.round(box(el).width)).toBe(288);
    await expect(Math.round(box(el).height)).toBe(172);
    await expect(canvas.getByText('€48,250')).toBeVisible();
    await expect(canvas.getByText('+12.5%')).toBeVisible();
    await expect(canvas.getByText('12.5% vs last month')).toBeVisible();
    await expect(canvasElement.querySelector('[data-slot="sparkline"]')).toBeNull();
    await expect(getComputedStyle(el).boxShadow).not.toBe('none');
  },
};

// The change Badge tone follows Trend: up soft-success, down soft-destructive, neutral soft-neutral.
export const Trends: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {(['up', 'down', 'neutral'] as const).map(t => <StatCard key={t} trend={t} />)}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const badges = [...canvasElement.querySelectorAll('[data-slot="stat-card-change"]')] as HTMLElement[];
    await expect(getComputedStyle(badges[0]).backgroundColor).toBe(probeBg('bg-[var(--badge-soft-success-bg)]'));
    await expect(getComputedStyle(badges[1]).backgroundColor).toBe(probeBg('bg-[var(--badge-soft-destructive-bg)]'));
    await expect(getComputedStyle(badges[2]).backgroundColor).toBe(probeBg('bg-[var(--badge-soft-neutral-bg)]'));
    // Direction is told by icon and sign, not only color.
    await expect(badges[0].textContent).toBe('+12.5%');
    await expect(badges[1].textContent).toBe('−4.2%');
    await expect(badges.map(b => Math.round(box(b).height))).toEqual([20, 20, 20]);
  },
};

// When down is good (churn), keep Trend=down for the icon and set the Badge variant to soft-success.
export const DownIsGood: Story = {
  args: { trend: 'down', label: 'Churn this month', value: '2.1%', changeLabel: '−0.4%', changeVariant: 'soft-success', trendText: '0.4 pts vs last month', footnote: 'Compared to October 2026' },
  play: async ({ canvasElement }) => {
    await expect(getComputedStyle(canvasElement.querySelector('[data-slot="stat-card-change"]')!).backgroundColor).toBe(probeBg('bg-[var(--badge-soft-success-bg)]'));
  },
};

// Show sparkline (vertical): 32 high under the value, decorative.
export const WithSparkline: Story = {
  args: { showSparkline: true },
  play: async ({ canvasElement }) => {
    const spark = canvasElement.querySelector('[data-slot="sparkline"]') as SVGElement;
    await expect(Math.round(box(spark).height)).toBe(32);
    await expect(spark).toHaveAttribute('aria-hidden', 'true');
  },
};

// Layout=compact: Icon Tile, label, change and value in one row, no footer. 288 wide; 108 up/down, 88 neutral.
export const Compact: Story = {
  args: { layout: 'compact' },
  render: args => (
    <div className="flex flex-col gap-4">
      <StatCard {...args} trend="up" />
      <StatCard {...args} trend="neutral" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [up, neutral] = [...canvasElement.querySelectorAll('[data-slot="stat-card"]')] as HTMLElement[];
    await expect(Math.round(box(up).width)).toBe(288);
    // Figma wraps the badge under the label here (108); with this font it may fit on one line (88).
    await expect([88, 108]).toContain(Math.round(box(up).height));
    await expect(Math.round(box(neutral).height)).toBe(88);
    await expect(Math.round(box(up.querySelector('[data-slot="icon-tile"]')!).width)).toBe(40);
    await expect(up.querySelector('[data-slot="stat-card-footer"]')).toBeNull();
  },
};

// Layout=horizontal: the Sparkline (120 x 48) sits right of the value; 384 wide; 192 up, 172 neutral.
export const Horizontal: Story = {
  args: { layout: 'horizontal' },
  render: args => (
    <div className="flex flex-col gap-4">
      <StatCard {...args} trend="up" />
      <StatCard {...args} trend="neutral" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [up, neutral] = [...canvasElement.querySelectorAll('[data-slot="stat-card"]')] as HTMLElement[];
    await expect(Math.round(box(up).width)).toBe(384);
    // Figma wraps the badge under the label here (192); with this font it may fit on one line (172).
    await expect([172, 192]).toContain(Math.round(box(up).height));
    await expect(Math.round(box(neutral).height)).toBe(172);
    const spark = up.querySelector('[data-slot="sparkline"]') as SVGElement;
    await expect(Math.round(box(spark).width)).toBe(120);
    await expect(Math.round(box(spark).height)).toBe(48);
  },
};

export const NoChangeNoTrend: Story = {
  args: { showChange: false, showTrend: false },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('[data-slot="stat-card-change"]')).toBeNull();
    await expect(canvasElement.querySelector('[data-slot="stat-card-trend"]')).toBeNull();
    await expect(Math.round(box(card(canvasElement)).height)).toBe(146);
  },
};

// Stress test: a long value stays on one line with an ellipsis; a long trend text caps at 200.
export const LongValues: Story = { tags: ['!dev'],
  args: { value: '€48,250,000,000,000,000', trendText: 'Up 12.5% compared with the same period last month, driven by new customers' },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  play: async ({ canvasElement }) => {
    const el = card(canvasElement);
    await expect(Math.round(box(el).width)).toBe(276);
    const value = canvasElement.querySelector('[data-slot="stat-card-value"]') as HTMLElement;
    await expect(Math.round(box(value).height)).toBe(36);
    await expect(value.scrollWidth).toBeGreaterThan(value.clientWidth);
    const trend = canvasElement.querySelector('[data-slot="stat-card-trend"]') as HTMLElement;
    await expect(Math.round(box(trend).width)).toBeLessThanOrEqual(200);
    await expect(Math.round(box(trend).height)).toBe(20);
    await expect(el.scrollWidth).toBeLessThanOrEqual(el.clientWidth);
  },
};

export const Narrow368Compact: Story = { tags: ['!dev'],
  args: { layout: 'compact', label: 'Revenue from recurring subscriptions this month' },
  decorators: [Story => <div className="w-[368px]"><Story /></div>],
  play: async ({ canvasElement }) => {
    const el = card(canvasElement);
    await expect(el.scrollWidth).toBeLessThanOrEqual(el.clientWidth);
  },
};

const Row = () => (
  <div className="flex flex-wrap gap-4">
    {(['up', 'down', 'neutral'] as const).map(t => <StatCard key={t} trend={t} showSparkline />)}
    <StatCard trend="up" layout="compact" />
    <StatCard trend="down" layout="horizontal" />
  </div>
);
export const AllLight: Story = { render: () => <Row />, name: 'All layouts' };
export const AllDark: Story = { render: () => <Row />, tags: ['!dev'], globals: { theme: 'Dark' }, name: 'All layouts (Dark)' };
export const AllCorporate: Story = { render: () => <Row />, tags: ['!dev'], globals: { theme: 'Corporate Light' }, name: 'All layouts (Corporate Light)' };
