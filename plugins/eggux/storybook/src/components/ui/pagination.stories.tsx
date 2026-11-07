import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { LoadMore, PagerLink, Pagination, PaginationCompact, pageRange } from './pagination';

const meta = {
  title: 'Components/Pagination/Pagination',
  component: Pagination,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Page navigation. numbered (previous, first, last, current ± 1, ellipses, next) for tables and long lists people jump around in; simple (Previous, "Page 2 of 10", Next) for articles, search results and mobile. Previous is disabled on the first page and Next on the last. Narrow places use Pagination Compact; feeds use Load More; docs pages end with Pager Links; tables use Table Pagination. Figma: Pagination page / Pagination, Pagination Item. Guide: eggux build-ui/components/pagination.md' } },
  },
  args: { page: 2, pageCount: 25 },
  render: function Render(args) {
    const [page, setPage] = React.useState(args.page);
    return <Pagination {...args} page={page} onPageChange={setPage} />;
  },
} satisfies Meta<typeof Pagination>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma Style=numbered: 386 wide (±8 for the label widths), 36 items 4 apart, page 2 active (outline), Next moves on, first page disables Previous.
export const Default: Story = {
  play: async ({ canvas }) => {
    const nav = canvas.getByRole('navigation', { name: 'Pagination' });
    // Figma 386; the labels render a few px narrower here (380).
    await expect(Math.abs(Math.round(box(nav).width) - 386)).toBeLessThanOrEqual(8);
    const current = canvas.getByRole('button', { name: 'Page 2' });
    await expect(current).toHaveAttribute('aria-current', 'page');
    await expect(Math.round(box(current).height)).toBe(36);
    await userEvent.click(canvas.getByRole('button', { name: 'Previous' }));
    await expect(canvas.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page');
    await expect(canvas.getByRole('button', { name: 'Previous' })).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: 'Page 25' }));
    await expect(canvas.getByRole('button', { name: 'Next' })).toBeDisabled();
    await expect(pageRange(10, 25)).toEqual([1, null, 9, 10, 11, null, 25]);
    await expect(pageRange(3, 5)).toEqual([1, 2, 3, 4, 5]);
  },
};

// Figma Style=simple (278) and Pagination Compact (32 buttons around "Page 2 of 12").
export const SimpleAndCompact: Story = {
  render: () => {
    const [a, setA] = React.useState(2);
    const [b, setB] = React.useState(2);
    return (
      <div className="flex flex-col items-start gap-6">
        <Pagination paginationStyle="simple" page={a} pageCount={10} onPageChange={setA} labels={{ nav: 'Results pages' }} />
        <PaginationCompact page={b} pageCount={12} onPageChange={setB} labels={{ nav: 'Invoices pages' }} />
      </div>
    );
  },
  play: async ({ canvas }) => {
    const simple = canvas.getByRole('navigation', { name: 'Results pages' });
    await expect(Math.round(box(simple).width)).toBeGreaterThanOrEqual(278);
    await expect(simple).toHaveTextContent('Page 2 of 10');
    const compact = canvas.getByRole('navigation', { name: 'Invoices pages' });
    await expect(Math.round(box(compact).height)).toBe(32);
    await userEvent.click(canvas.getByRole('button', { name: 'Next page' }));
    await expect(compact).toHaveTextContent('Page 3 of 12');
  },
};

// Load More: the count over the outline button; loading disables it.
export const LoadMoreFeed: Story = {
  render: () => {
    const [shown, setShown] = React.useState(20);
    const [loading, setLoading] = React.useState(false);
    return (
      <div className="w-[560px]">
        <LoadMore
          status={`Showing ${shown} of 248 invoices`}
          label="Load 20 more"
          loading={loading}
          onLoadMore={() => {
            setLoading(true);
            setTimeout(() => { setShown(s => s + 20); setLoading(false); }, 50);
          }}
        />
      </div>
    );
  },
  play: async ({ canvas }) => {
    const btn = canvas.getByRole('button', { name: 'Load 20 more' });
    await userEvent.click(btn);
    await expect(btn).toHaveAttribute('aria-disabled', 'true');
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Showing 40 of 248 invoices'));
  },
};

// Pager Links at the end of a docs page: two equal columns, the whole card is the link.
export const PagerLinks: Story = {
  render: () => (
    <nav aria-label="Docs pages" className="grid w-[768px] grid-cols-2 gap-4">
      <PagerLink direction="previous" href="#approvals" title="Approval chains" />
      <PagerLink direction="next" href="#limits" title="Approval limits by amount" />
    </nav>
  ),
  play: async ({ canvas }) => {
    const next = canvas.getByRole('link', { name: /Approval limits by amount/ });
    await expect(Math.round(box(next).height)).toBe(74);
    await expect(getComputedStyle(next).textAlign).toBe('right');
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, args: { onPageChange: fn() } };
