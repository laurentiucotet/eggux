import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { StatusDot } from './status-dot';

const meta = {
  title: 'Components/Badge/Status Dot',
  component: StatusDot,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'State of a system, service or person in text flow and tables. Always with a label; the dot is decorative and never the only signal. Figma: Badge page / Status Dot. Guide: eggux build-ui/components/badge.md' } },
  },
  argTypes: { status: { control: 'select', options: ['success', 'warning', 'error', 'info', 'neutral'] } },
  args: { status: 'success', label: 'Online' },
} satisfies Meta<typeof StatusDot>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma default: 8 px dot, 8 px gap, 14/20 label.
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const label = canvas.getByText('Online');
    await expect(label).toBeVisible();
    const root = canvasElement.querySelector('[data-slot="status-dot"]')!;
    const dot = root.querySelector('[aria-hidden="true"]')!;
    await expect(Math.round(box(dot).width)).toBe(8);
    await expect(Math.round(box(dot).height)).toBe(8);
    await expect(Math.round(box(label).left - box(dot).right)).toBe(8);
    await expect(Math.round(box(root).height)).toBe(20);
    await expect(dot).toHaveAttribute('aria-hidden', 'true');
  },
};

const statuses = [
  ['success', 'Online'], ['warning', 'Degraded'], ['error', 'Down'], ['info', 'Syncing'], ['neutral', 'Offline'],
] as const;

export const Statuses: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {statuses.map(([status, label]) => <StatusDot key={status} status={status} label={label} />)}
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    for (const [status, label] of statuses) await expect(canvas.getByText(label)).toBeVisible();
    // Each status has its own dot color.
    const colors = Array.from(canvasElement.querySelectorAll('[data-slot="status-dot"] > span:first-child')).map(d => getComputedStyle(d).backgroundColor);
    await expect(new Set(colors).size).toBe(5);
  },
};

// Show label off: the dot is decorative and the label stays for screen readers.
export const DotOnly: Story = {
  args: { showLabel: false, label: 'Online' },
  render: args => (
    <div className="flex items-center gap-3">
      <span className="text-sm">Alex Morgan</span>
      <StatusDot {...args} />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const label = canvas.getByText('Online');
    await expect(label).toHaveClass('sr-only');
    const dot = canvasElement.querySelector('[data-slot="status-dot"] > [aria-hidden="true"]')!;
    await expect(Math.round(box(dot).width)).toBe(8);
  },
};

// Stress test: a long label truncates inside a narrow column and the dot keeps its size.
export const LongLabel: Story = { tags: ['!dev'],
  args: { label: 'Syncing the Acme warehouse catalogue with the Payments ledger for EUR accounts', status: 'info' },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-slot="status-dot"]') as HTMLElement;
    const dot = root.querySelector('[aria-hidden="true"]')!;
    await expect(Math.round(box(dot).width)).toBe(8);
    await expect(Math.round(box(root).height)).toBe(20);
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth);
    await expect(Math.round(box(root).width)).toBeLessThanOrEqual(276);
  },
};

export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const StatusesDark: Story = { ...Statuses, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
export const StatusesCorporate: Story = { ...Statuses, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
