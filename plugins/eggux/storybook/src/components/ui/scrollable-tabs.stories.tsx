import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { TabsContent, TabsTrigger } from './tabs';
import { ScrollableTabs, ScrollableTabsList } from './scrollable-tabs';

type Args = { variant: 'line' | 'pills'; count: number; active: number; showCounts: boolean; bordered: boolean; width: number };

const names = [
  'All products', 'Hardware', 'Software', 'Services', 'Subscriptions', 'Accessories', 'Training', 'Support plans',
  'Licences', 'Consulting', 'Spare parts', 'Gift cards', 'Bundles', 'Refurbished', 'Education', 'Partners',
  'Archived', 'Drafts', 'Seasonal', 'Clearance', 'Wholesale', 'Imports', 'Exports', 'Samples',
];

const slug = (n: string) => n.toLowerCase().replace(/ /g, '-');

function Demo({ variant, count, active, showCounts, bordered, width }: Args) {
  const list = names.slice(0, count);
  const current = list[Math.min(active, count - 1)];
  return (
    <div style={{ width }} className="max-w-full">
      <ScrollableTabs key={`${variant}-${count}-${active}`} variant={variant} defaultValue={slug(current)}>
        <ScrollableTabsList aria-label="Product categories" bordered={bordered && variant === 'line'}>
          {list.map((n, i) => (
            <TabsTrigger key={n} value={slug(n)} count={showCounts ? (i + 1) * 7 : undefined} countLabel={showCounts ? `${(i + 1) * 7} items` : undefined}>
              {n}
            </TabsTrigger>
          ))}
        </ScrollableTabsList>
        {list.map(n => (
          <TabsContent key={n} value={slug(n)} className="pt-4 text-muted-foreground">
            Showing {n.toLowerCase()} for Acme Ltd, prices in EUR.
          </TabsContent>
        ))}
      </ScrollableTabs>
    </div>
  );
}

const meta = {
  title: 'Components/Layout/Scrollable Tabs',
  parameters: {
    docs: {
      description: {
        component:
          'A tab list that stays on one line and scrolls sideways when there are too many tabs for the width (a category strip), instead of the More menu. Fade edges and Previous and Next buttons show which side has more; the active tab is scrolled into view when it changes; arrows, Home and End move between tabs like Tabs. Smooth scroll, instant under prefers-reduced-motion. Built on Tabs and Tab (Tabs page). Code only (no Figma component yet).',
      },
    },
  },
  args: { variant: 'line', count: 14, active: 0, showCounts: false, bordered: true, width: 420 },
  argTypes: {
    variant: { name: 'Variant', control: 'inline-radio', options: ['line', 'pills'], description: 'How the tabs look (the Tabs variants that suit a strip).', table: { category: 'Tabs' } },
    count: { name: 'Tabs', control: { type: 'range', min: 3, max: 24, step: 1 }, description: 'Number of tabs.', table: { category: 'Tabs' } },
    active: { name: 'Active tab', control: { type: 'range', min: 0, max: 23, step: 1 }, description: 'Index of the tab selected at the start; it is scrolled into view.', table: { category: 'Tabs' } },
    bordered: { name: 'Baseline', control: 'boolean', description: 'A line under the tabs (variant line).', table: { category: 'Tabs' } },
    showCounts: { name: 'Show counts', control: 'boolean', description: 'A count badge after each label.', table: { category: 'Parts' } },
    width: { name: 'Width', control: { type: 'range', min: 240, max: 720, step: 8 }, description: 'Width of the strip in px.', table: { category: 'Tabs' } },
  },
  render: args => <Demo {...args} />,
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvas, canvasElement }) => {
    const scroller = canvasElement.querySelector<HTMLElement>('[data-slot="scrollable-tabs-scroller"]')!;
    const tablist = canvas.getByRole('tablist', { name: 'Product categories' });
    // Overflowing: only Next is offered at the start.
    await expect(scroller.scrollWidth).toBeGreaterThan(scroller.clientWidth);
    await expect(canvas.queryByRole('button', { name: 'Scroll tabs left' })).toBeNull();
    await userEvent.click(canvas.getByRole('button', { name: 'Scroll tabs right' }));
    await waitFor(() => expect(scroller.scrollLeft).toBeGreaterThan(100), { timeout: 3000 });
    await expect(await canvas.findByRole('button', { name: 'Scroll tabs left' })).toBeVisible();

    // Keyboard: End goes to the last tab and scrolls it into view.
    canvas.getByRole('tab', { name: 'All products' }).focus();
    await userEvent.keyboard('{End}');
    const last = canvas.getByRole('tab', { name: 'Refurbished' });
    await waitFor(() => expect(last).toHaveAttribute('aria-selected', 'true'));
    await waitFor(() => expect(last.getBoundingClientRect().right).toBeLessThanOrEqual(scroller.getBoundingClientRect().right + 1), { timeout: 3000 });
    await waitFor(() => expect(canvas.queryByRole('button', { name: 'Scroll tabs right' })).toBeNull(), { timeout: 3000 });
    await expect(tablist.getBoundingClientRect().width).toBeGreaterThan(scroller.clientWidth);

    // Home goes back; ArrowRight moves one tab.
    await userEvent.keyboard('{Home}');
    const first = canvas.getByRole('tab', { name: 'All products' });
    await waitFor(() => expect(first).toHaveAttribute('aria-selected', 'true'));
    await waitFor(() => expect(first.getBoundingClientRect().left).toBeGreaterThanOrEqual(scroller.getBoundingClientRect().left - 1), { timeout: 3000 });
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(canvas.getByRole('tab', { name: 'Hardware' })).toHaveAttribute('aria-selected', 'true'));
    await expect(canvas.getByText(/Showing hardware/)).toBeVisible();
  },
};

/** The pills variant with counts. */
export const Pills: Story = {
  args: { variant: 'pills', showCounts: true, count: 12 },
};

/* Hidden checks */

export const ActiveInView: Story = {
  tags: ['!dev'],
  args: { active: 16, count: 20 },
  play: async ({ canvas, canvasElement }) => {
    const scroller = canvasElement.querySelector<HTMLElement>('[data-slot="scrollable-tabs-scroller"]')!;
    const tab = canvas.getByRole('tab', { name: 'Archived' });
    await expect(tab).toHaveAttribute('aria-selected', 'true');
    await waitFor(() => expect(tab.getBoundingClientRect().right).toBeLessThanOrEqual(scroller.getBoundingClientRect().right + 1));
    await expect(tab.getBoundingClientRect().left).toBeGreaterThanOrEqual(scroller.getBoundingClientRect().left - 1);
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  args: { width: 600, count: 24, showCounts: true },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  play: async ({ canvas, canvasElement }) => {
    const root = canvasElement.querySelector<HTMLElement>('[data-slot="scrollable-tabs"]')!;
    // 276 px column: the strip is clipped to it, never wider.
    await expect(root.getBoundingClientRect().width).toBeLessThanOrEqual(276);
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(document.documentElement.clientWidth + 1);
    await expect(canvas.getByRole('button', { name: 'Scroll tabs right' })).toBeVisible();
  },
};

export const FewTabs: Story = {
  tags: ['!dev'],
  args: { count: 3, width: 480 },
  play: async ({ canvas }) => {
    // Everything fits: no buttons, no fade.
    await expect(canvas.queryByRole('button', { name: /Scroll tabs/ })).toBeNull();
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
