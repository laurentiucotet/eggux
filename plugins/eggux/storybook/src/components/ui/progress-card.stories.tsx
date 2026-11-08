import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { ProgressCard } from './progress-card';

const meta = {
  title: 'Components/Card/Progress Card',
  component: ProgressCard,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'A goal against its target: label, status Badge, value and target, bar, footnote. Status names the state in text (on track, at risk, off track); say the rule behind it in the footnote or a tooltip. The bar value matches the percent in the footnote. Figma: Card page / Progress Card. Guide: eggux build-ui/components/card.md' } },
  },
} satisfies Meta<typeof ProgressCard>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();
const probeBg = (cls: string) => {
  const p = document.createElement('span');
  p.className = cls;
  document.body.append(p);
  const c = getComputedStyle(p).backgroundColor;
  p.remove();
  return c;
};

// Figma Status=on-track (default): 320 x 174; bar 8 high at 80%.
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const el = canvasElement.querySelector('[data-slot="progress-card"]') as HTMLElement;
    await expect(Math.round(box(el).width)).toBe(320);
    await expect(Math.round(box(el).height)).toBe(174);
    const bar = canvas.getByRole('progressbar', { name: /Q4 revenue target/ });
    await expect(bar).toHaveAttribute('aria-valuenow', '80');
    await expect(Math.round(box(bar).height)).toBe(8);
    await expect(canvas.getByText('On track')).toBeVisible();
    await expect(canvas.getByText('80% reached · 23 days left')).toBeVisible();
  },
};

// Status in text, tone per status: on-track soft-success, at-risk soft-warning, off-track soft-destructive.
export const Statuses: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap gap-4">
      <ProgressCard status="on-track" progress={80} />
      <ProgressCard status="at-risk" progress={55} footnote="55% reached · at risk under 80% of the expected pace" />
      <ProgressCard status="off-track" progress={20} footnote="20% reached · 6 days left" />
    </div>
  ),
  play: async ({ canvas }) => {
    const text = ['On track', 'At risk', 'Off track'];
    const tones = ['bg-[var(--badge-soft-success-bg)]', 'bg-[var(--badge-soft-warning-bg)]', 'bg-[var(--badge-soft-destructive-bg)]'];
    for (const [i, t] of text.entries()) {
      const badge = canvas.getByText(t).closest('[data-slot="badge"]') as HTMLElement;
      await expect(getComputedStyle(badge).backgroundColor).toBe(probeBg(tones[i]));
    }
    await expect(canvas.getAllByRole('progressbar').map(b => b.getAttribute('aria-valuenow'))).toEqual(['80', '55', '20']);
  },
};

// Stress test: long label and target; the target truncates to 1 line (at least 80 wide) or wraps under the value.
export const LongText: Story = { tags: ['!dev'],
  args: { label: 'Annual recurring revenue target for the enterprise segment', target: 'of €60,000,000 planned for the full financial year', value: '€48,250,000' },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-slot="progress-card"]') as HTMLElement;
    await expect(Math.round(box(el).width)).toBe(276);
    await expect(el.scrollWidth).toBeLessThanOrEqual(el.clientWidth);
    const target = canvasElement.querySelector('[data-slot="progress-card-target"]') as HTMLElement;
    await expect(Math.round(box(target).height)).toBe(20);
    await expect(box(target).width).toBeGreaterThanOrEqual(80);
  },
};

export const Narrow368: Story = { tags: ['!dev'],
  decorators: [Story => <div className="w-[368px]"><Story /></div>],
  args: { status: 'at-risk', progress: 55 },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('At risk')).toBeVisible();
  },
};

const All = () => (
  <div className="flex flex-wrap gap-4">
    <ProgressCard status="on-track" progress={80} />
    <ProgressCard status="at-risk" progress={55} />
    <ProgressCard status="off-track" progress={20} />
  </div>
);
export const AllLight: Story = { parameters: { controls: { disable: true } }, render: () => <All />, name: 'All statuses' };
export const AllDark: Story = { parameters: { controls: { disable: true } }, render: () => <All />, tags: ['!dev'], globals: { theme: 'Dark' }, name: 'All statuses (Dark)' };
export const AllCorporate: Story = { parameters: { controls: { disable: true } }, render: () => <All />, tags: ['!dev'], globals: { theme: 'Corporate Light' }, name: 'All statuses (Corporate Light)' };
