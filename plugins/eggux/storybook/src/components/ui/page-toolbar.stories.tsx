import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Calendar, Columns3, List, Plus } from '@/components/icons';
import { Button } from './button';
import { PageToolbar } from './page-toolbar';

const views = [
  { value: 'list', label: 'List', icon: <List /> },
  { value: 'board', label: 'Board', icon: <Columns3 /> },
  { value: 'calendar', label: 'Calendar', icon: <Calendar /> },
];

const meta = {
  title: 'Components/Navigation/Page Toolbar',
  component: PageToolbar,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'The row between a list page title and the list: search and Filters (with the active count) on the left, the view switch and the one primary action on the right. The Filters button name carries the count ("Filters, 2 active"). It wraps: the end group moves to a second line in narrow columns. While rows are selected, Table Toolbar takes its place. Figma: Navigation page / Page Toolbar. Guide: eggux build-ui/patterns/search-and-filter.md' } },
  },
  args: {
    search: { placeholder: 'Search invoices', label: 'Search invoices' },
    onFilters: fn(),
    filterCount: 2,
    views,
    onViewChange: fn(),
    primary: <Button leadingIcon={<Plus aria-hidden="true" />}>New invoice</Button>,
  },
  decorators: [Story => <div className="w-[1136px] max-w-full"><Story /></div>],
} satisfies Meta<typeof PageToolbar>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma default: 1136 × 36; search 320 at most, Filters with "2", List / Board / Calendar, primary last.
export const Default: Story = {
  play: async ({ canvas, canvasElement, args }) => {
    const bar = canvasElement.querySelector('[data-slot="page-toolbar"]')!;
    await expect(Math.round(box(bar).height)).toBe(36);
    const search = canvas.getByRole('searchbox', { name: 'Search invoices' });
    await expect(Math.round(box(search.closest('[data-slot="search-field"]') ?? search.parentElement!).width)).toBeLessThanOrEqual(320);
    const filters = canvas.getByRole('button', { name: /^Filters\s*,\s*2 active$/ });
    await userEvent.click(filters);
    await expect(args.onFilters).toHaveBeenCalled();
    const group = canvas.getByRole('radiogroup', { name: 'View' });
    await expect(within(group).getByRole('radio', { name: 'List' })).toBeChecked();
    await userEvent.click(within(group).getByRole('radio', { name: 'Board' }));
    await expect(args.onViewChange).toHaveBeenCalledWith('board');
    // Tab order: search, filters, view, primary.
    const primary = canvas.getByRole('button', { name: 'New invoice' });
    await expect(box(primary).left).toBeGreaterThan(box(group).right);
    await expect(Math.round(box(primary).right)).toBe(Math.round(box(bar).right));
  },
};

// No active filters: no count, plain "Filters". Show view off.
export const Simple: Story = {
  args: { filterCount: 0, views: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Filters' })).toBeInTheDocument();
    await expect(canvas.queryByRole('radiogroup')).toBeNull();
  },
};

// Stress: at 368 the end group wraps under the start group; at 276 nothing overflows. Tests only.
export const Stress: Story = {
  tags: ['!dev'],
  render: args => (
    <div className="flex flex-col gap-8">
      <div className="w-[368px]"><PageToolbar {...args} /></div>
      <div className="w-[276px]"><PageToolbar {...args} search={{ placeholder: 'Search customers', label: 'Search customers' }} filterCount={128} /></div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [narrow, narrower] = canvasElement.querySelectorAll<HTMLElement>('[data-slot="page-toolbar"]');
    const start = narrow.querySelector('[data-slot="page-toolbar-start"]')!;
    const end = narrow.querySelector('[data-slot="page-toolbar-end"]')!;
    await expect(box(end).top).toBeGreaterThanOrEqual(box(start).bottom);
    await expect(narrow.scrollWidth).toBeLessThanOrEqual(368);
    await expect(narrower.scrollWidth).toBeLessThanOrEqual(276 + 1);
    await expect(within(narrower).getByText('99+')).toBeInTheDocument();
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
