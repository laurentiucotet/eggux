import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Badge } from './badge';

const meta = {
  title: 'Components/Badge/Badge',
  component: Badge,
  parameters: {
    docs: { description: { component: 'Status or category of an object. Soft variants for statuses repeated down a table; category-1 to 8 for categories without a status meaning. Figma: COMPONENTS / Badge. Guide: eggux build-ui/components/badge.md' } },
  },
  args: { children: 'Paid', variant: 'soft-success' },
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Solid: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(['default', 'secondary', 'destructive', 'outline', 'success', 'warning', 'info'] as const).map(v => <Badge key={v} variant={v}>{v}</Badge>)}
    </div>
  ),
};

export const Soft: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="soft-success" dot>Paid</Badge>
      <Badge variant="soft-warning" dot>Pending</Badge>
      <Badge variant="soft-destructive" dot>Overdue</Badge>
      <Badge variant="soft-info" dot>Sent</Badge>
      <Badge variant="soft-neutral" dot>Draft</Badge>
    </div>
  ),
};

export const Categories: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <Badge key={n} variant={`category-${n}` as 'category-1'} shape="pill">Team {n}</Badge>)}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge size="sm" variant="soft-info">Small</Badge>
      <Badge variant="soft-info">Default</Badge>
      <Badge size="lg" variant="soft-info">Large</Badge>
    </div>
  ),
  play: async ({ canvas }) => {
    // Heights from Figma: sm 16, default 20, lg 24.
    const h = ['Small', 'Default', 'Large'].map(t => Math.round(canvas.getByText(t).parentElement!.getBoundingClientRect().height));
    await expect(h).toEqual([16, 20, 24]);
  },
};

// Stress test: a long label truncates at max-w-64 (256) and never wraps.
export const LongLabel: Story = { tags: ['!dev'],
  args: { children: 'Waiting for the second approver in the finance department', variant: 'soft-warning' },
  play: async ({ canvas, args }) => {
    const label = canvas.getByText(String(args.children));
    const badge = label.parentElement!;
    await expect(badge.getBoundingClientRect().width).toBeLessThanOrEqual(256);
    await expect(Math.round(badge.getBoundingClientRect().height)).toBe(20);
    await expect(label.scrollWidth).toBeGreaterThan(label.clientWidth);
  },
};

// Contrast of the soft and category tints in Dark.
export const SoftDark: Story = { ...Soft, tags: ['!dev'], globals: { theme: 'Dark' } };
export const CategoriesDark: Story = { ...Categories, tags: ['!dev'], globals: { theme: 'Dark' } };
