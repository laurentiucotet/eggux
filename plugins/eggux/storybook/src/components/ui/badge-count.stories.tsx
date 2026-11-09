import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { BadgeCount, type BadgeCountVariant } from './badge-count';
import { Button } from './button';

const meta = {
  title: 'Components/Badge/Badge Count',
  component: BadgeCount,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Numeric counter for unread or pending items: icon button corner, sidebar item end. Numbers above 99 show "99+". Type=dot is an 8 px unread dot; give it a label. The accessible name carries the meaning. Figma: Badge page / Badge Count. Guide: eggux build-ui/components/badge.md' } },
  },
  argTypes: { variant: { control: 'select', options: ['default', 'secondary', 'destructive', 'outline'] } },
  args: { count: 3 },
} satisfies Meta<typeof BadgeCount>;
export default meta;
type Story = StoryObj<typeof meta>;

const size = (el: Element) => { const r = el.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; };
const probe = (cls: string) => { const p = document.createElement('span'); p.className = cls; document.body.append(p); return { style: getComputedStyle(p), remove: () => p.remove() }; };
const variants: BadgeCountVariant[] = ['default', 'secondary', 'destructive', 'outline'];
const tokens: Record<BadgeCountVariant, string> = {
  default: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  destructive: 'bg-destructive text-destructive-foreground',
  outline: 'bg-background text-foreground border border-border',
};

// Figma Variant=default, Type=count: 20 x 20 circle, 12/16 medium.
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-slot="badge-count"]') as HTMLElement;
    await expect(el).toHaveTextContent('3');
    await expect(size(el)).toEqual([20, 20]);
    await expect(getComputedStyle(el).borderTopLeftRadius).not.toBe('0px');
    await expect(getComputedStyle(el).fontSize).toBe('12px');
  },
};

const Row = ({ type }: { type: 'count' | 'dot' }) => (
  <div className="flex items-center gap-4">
    {variants.map(v => <BadgeCount key={v} variant={v} type={type} count={3} label={`${v} badge`} />)}
  </div>
);

export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => <Row type="count" />,
  play: async ({ canvasElement }) => {
    const els = Array.from(canvasElement.querySelectorAll<HTMLElement>('[data-slot="badge-count"]'));
    await expect(els).toHaveLength(4);
    for (const [i, v] of variants.entries()) {
      const ref = probe(tokens[v]);
      await expect(getComputedStyle(els[i]).backgroundColor).toBe(ref.style.backgroundColor);
      await expect(getComputedStyle(els[i]).color).toBe(ref.style.color);
      await expect(getComputedStyle(els[i]).borderTopWidth).toBe(v === 'outline' ? '1px' : '0px');
      ref.remove();
    }
    // Figma: three 20 px circles; outline is 22 wide with its 1 px border.
    await expect(els.slice(0, 3).map(size)).toEqual([[20, 20], [20, 20], [20, 20]]);
    await expect(size(els[3])[0]).toBeGreaterThanOrEqual(20);
  },
};

// Type=dot: 8 px, no number, sr-only text.
export const Dot: Story = {
  parameters: { controls: { disable: true } },
  render: () => <Row type="dot" />,
  play: async ({ canvas, canvasElement }) => {
    const els = Array.from(canvasElement.querySelectorAll<HTMLElement>('[data-slot="badge-count"]'));
    for (const el of els) await expect(size(el)).toEqual([8, 8]);
    await expect(canvas.getByText('destructive badge')).toHaveClass('sr-only');
    const ref = probe('bg-destructive');
    await expect(getComputedStyle(els[2]).backgroundColor).toBe(ref.style.backgroundColor);
    ref.remove();
  },
};

export const DotDefaultLabel: Story = {
  args: { type: 'dot' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('unread')).toHaveClass('sr-only');
  },
};

// Counts cap at 99+, never 100 or 1k.
export const Capped: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-4">
      <BadgeCount count={99} />
      <BadgeCount count={100} />
      <BadgeCount count={1500} variant="destructive" />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('99')).toBeVisible();
    await expect(canvas.getAllByText('99+')).toHaveLength(2);
    await expect(canvas.queryByText('100')).toBeNull();
    await expect(canvas.queryByText('1500')).toBeNull();
  },
};

// The count is part of the accessible name; the visible digits are hidden from assistive technology.
export const WithAccessibleLabel: Story = {
  args: { count: 2, label: '2 active filters', variant: 'secondary' },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText('2')).toHaveAttribute('aria-hidden', 'true');
    await expect(canvas.getByText('2 active filters')).toHaveClass('sr-only');
    await expect(canvasElement.querySelector('[data-slot="badge-count"]')).toHaveTextContent('22 active filters');
  },
};

// In context: bell button with a dot and a count; the button name carries the meaning.
export const OnButton: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-4">
      <Button variant="outline">
        Notifications <BadgeCount count={12} label="12 unread" variant="destructive" />
      </Button>
      <Button variant="outline">
        Inbox <BadgeCount type="dot" label="new messages" />
      </Button>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: /Notifications/ })).toHaveAccessibleName('Notifications 12 unread');
    await expect(canvas.getByRole('button', { name: /Inbox/ })).toHaveAccessibleName('Inbox new messages');
  },
};

// Stress test: long text grows the pill and never wraps; short text stays 20 high.
export const LongText: Story = { tags: ['!dev'],
  args: { count: '€1,234,567.89' },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-slot="badge-count"]') as HTMLElement;
    await expect(size(el)[1]).toBe(20);
    await expect(size(el)[0]).toBeGreaterThan(60);
    await expect(el.scrollWidth).toBeLessThanOrEqual(el.clientWidth);
  },
};

export const ShortText: Story = { tags: ['!dev'],
  args: { count: 7 },
  play: async ({ canvasElement }) => {
    await expect(size(canvasElement.querySelector('[data-slot="badge-count"]')!)).toEqual([20, 20]);
  },
};

export const Narrow368: Story = { tags: ['!dev'],
  ...LongText,
  decorators: [Story => <div className="w-[368px]"><Story /></div>],
};

// Theme copies: axe checks contrast of every Variant in each mode (hidden from the sidebar).
const AllVariants = () => (
  <div className="flex flex-col gap-4">
    <Row type="count" />
    <Row type="dot" />
  </div>
);
export const AllVariantsDark: Story = { parameters: { controls: { disable: true } }, render: () => <AllVariants />, tags: ['!dev'], globals: { theme: 'Dark' }, name: 'All variants (Dark)' };
export const AllVariantsCorporate: Story = { parameters: { controls: { disable: true } }, render: () => <AllVariants />, tags: ['!dev'], globals: { theme: 'Corporate Light' }, name: 'All variants (Corporate Light)' };
