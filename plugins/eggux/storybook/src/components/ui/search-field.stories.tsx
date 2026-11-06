import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { SearchField } from './search-field';

const meta = {
  title: 'Components/Input/Search Field',
  component: SearchField,
  parameters: {
    docs: { description: { component: 'Search box for a list, a table or the whole app: search icon, a placeholder that names what is searched, ⌘K hint (Show shortcut), clear once there is a query. Results update as people type (300 ms debounce); Esc clears. Size=lg only where search is the main action. Search with filters: Filter Bar; picking a value: Combobox. Figma: Input page / Search Field. Guide: eggux build-ui/patterns/search-and-filter.md' } },
  },
  args: { placeholder: 'Search invoices', onValueChange: fn(), onSearch: fn() },
  decorators: [Story => <div className="w-80 max-w-full"><Story /></div>],
} satisfies Meta<typeof SearchField>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => { const r = el.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; };
const field = (el: HTMLElement) => el.querySelector('[data-slot="search-field"]') as HTMLElement;

// Figma Size=default, State=default: 320 × 36, search icon 16, placeholder, ⌘K. Typing shows the
// query and clear (the shortcut hides); onSearch fires once after the debounce.
export const Default: Story = {
  play: async ({ canvas, canvasElement, args }) => {
    await expect(canvas.getByRole('search', { name: 'Search invoices' })).toBeInTheDocument();
    const input = canvas.getByRole('searchbox', { name: 'Search invoices' });
    await expect(box(field(canvasElement))).toEqual([320, 36]);
    await expect(canvas.getByText('⌘K')).toBeVisible();
    await userEvent.type(input, 'northwind');
    await expect(input).toHaveValue('northwind');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('northwind');
    await expect(canvas.queryByText('⌘K')).not.toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Clear search' })).toBeVisible();
    await waitFor(() => expect(args.onSearch).toHaveBeenCalledWith('northwind'));
    await expect(args.onSearch).toHaveBeenCalledTimes(1);
  },
};

// Clear: the button empties the query and keeps focus in the field; Escape clears too.
export const Clear: Story = {
  args: { defaultValue: 'northwind' },
  play: async ({ canvas, args }) => {
    const input = canvas.getByRole('searchbox', { name: 'Search invoices' });
    await userEvent.click(canvas.getByRole('button', { name: 'Clear search' }));
    await expect(input).toHaveValue('');
    await expect(input).toHaveFocus();
    await expect(args.onSearch).toHaveBeenLastCalledWith('');
    await userEvent.type(input, 'acme');
    await userEvent.keyboard('{Escape}');
    await expect(input).toHaveValue('');
    await expect(input).toHaveFocus();
  },
};

// Keyboard: Tab reaches the field; Cmd+K / Ctrl+K focuses it from anywhere; Enter searches at once.
export const Keyboard: Story = {
  render: args => (
    <div className="flex flex-col gap-3">
      <button type="button" className="self-start text-sm underline">Before</button>
      <SearchField {...args} />
    </div>
  ),
  play: async ({ canvas, args }) => {
    const input = canvas.getByRole('searchbox', { name: 'Search invoices' });
    await expect(input).toHaveAttribute('aria-keyshortcuts', 'Meta+K Control+K');
    canvas.getByRole('button', { name: 'Before' }).focus();
    await userEvent.keyboard('{Control>}k{/Control}');
    await expect(input).toHaveFocus();
    await userEvent.type(input, 'INV-1047{Enter}');
    await expect(args.onSearch).toHaveBeenCalledWith('INV-1047');
    await userEvent.tab({ shift: true });
    await expect(canvas.getByRole('button', { name: 'Before' })).toHaveFocus();
    await userEvent.tab();
    await expect(input).toHaveFocus();
  },
};

// Figma State=focus: border/ring and the ring around the whole field.
export const Focus: Story = {
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole('searchbox'));
    const p = document.createElement('span'); p.className = 'border border-ring'; document.body.append(p);
    await expect(getComputedStyle(field(canvasElement)).borderTopColor).toBe(getComputedStyle(p).borderTopColor);
    p.remove();
    await expect(getComputedStyle(field(canvasElement)).boxShadow).toContain('0px 0px 0px 4px');
  },
};

// Figma Size: default 36 (16 px icons, body/small) and lg 48 (20 px icons, body/default, 480 wide).
export const Sizes: Story = {
  decorators: [Story => <div className="w-[480px]"><Story /></div>],
  render: args => (
    <div className="flex flex-col gap-4">
      <SearchField {...args} className="w-80" />
      <SearchField {...args} size="lg" className="w-[480px]" placeholder="Search the help center" defaultValue="refund" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [d, lg] = Array.from(canvasElement.querySelectorAll('[data-slot="search-field"]'));
    await expect(box(d)).toEqual([320, 36]);
    await expect(box(lg)).toEqual([480, 48]);
    await expect(box(d.querySelector('svg')!)).toEqual([16, 16]);
    await expect(box(lg.querySelector('svg')!)).toEqual([20, 20]);
    await expect(getComputedStyle(lg.querySelector('input')!).fontSize).toBe('16px');
    await expect(getComputedStyle(d.querySelector('input')!).fontSize).toBe('14px');
    await expect(box(lg.querySelector('[data-slot="search-field-clear"] svg')!)).toEqual([20, 20]);
  },
};

// Show shortcut off: nothing after the placeholder until there is a query; no global shortcut.
export const WithoutShortcut: Story = {
  args: { showShortcut: false, placeholder: 'Search customers' },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvasElement.querySelector('[data-slot="search-field-shortcut"]')).toBeNull();
    await expect(canvas.getByRole('searchbox', { name: 'Search customers' })).not.toHaveAttribute('aria-keyshortcuts');
  },
};

// Filtering a list inline, with the result count in a live region and an empty state that names the query.
const customers = ['Acme GmbH', 'Northwind Traders', 'Globex Corporation', 'Initech', 'Northbridge Logistics'];
function FilterDemo() {
  const [q, setQ] = React.useState('');
  const shown = customers.filter(c => c.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="flex w-80 flex-col gap-3">
      <SearchField placeholder="Search customers" onSearch={setQ} debounce={50} />
      <p role="status" className="text-sm text-muted-foreground">{shown.length} customers</p>
      {shown.length ? <ul className="text-sm">{shown.map(c => <li key={c}>{c}</li>)}</ul> : <p className="text-sm">No customers match “{q}”.</p>}
    </div>
  );
}
export const FilterList: Story = {
  render: () => <FilterDemo />,
  play: async ({ canvas }) => {
    await userEvent.type(canvas.getByRole('searchbox'), 'north');
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('2 customers'));
    await userEvent.type(canvas.getByRole('searchbox'), 'zz');
    await waitFor(() => expect(canvas.getByText('No customers match “northzz”.')).toBeInTheDocument());
  },
};

// Stress test: a long query in the 276 and 368 columns stays on one line; icon and clear keep their size.
export const Stress: Story = {
  tags: ['!dev'],
  decorators: [Story => <div><Story /></div>],
  render: args => (
    <div className="flex flex-col gap-3">
      <div className="w-[276px]"><SearchField {...args} label="Search 276" defaultValue="Acme Holdings International quarterly vendor review northwind" /></div>
      <div className="w-[368px]"><SearchField {...args} label="Search 368" placeholder="Search invoices, customers, contracts and vendor payments" /></div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const f of Array.from(canvasElement.querySelectorAll('[data-slot="search-field"]'))) {
      await expect(box(f)[1]).toBe(36);
      await expect(box(f.querySelector('svg')!)).toEqual([16, 16]);
    }
    await expect(box(canvasElement.querySelector('[data-slot="search-field-clear"]')!)).toEqual([24, 24]);
    await expect(box(canvasElement.querySelector('[data-slot="search-field"]')!)[0]).toBe(276);
  },
};

export const Dark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, args: { defaultValue: 'northwind' } };
export const CorporateLight: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
