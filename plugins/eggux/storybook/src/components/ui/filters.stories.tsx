import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { ArrowUpDown, Columns3 } from '@/components/icons';
import { Button } from './button';
import { FacetedFilter, FilterBar, FilterCondition, FilterGroup, FilterSection, SavedViewItem, type FacetValue } from './filters';
import { TagInput } from './tag-input';

const meta = {
  title: 'Components/Filters/Filters',
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Filtering a list or table. Filter Bar: search, view controls, Filter Chips (empty "+ Owner" or active "Status Overdue, Pending" with edit and remove) and Clear all; changes are announced. Faceted Filter: the chip popover with search, checkbox values with counts (applied at once) and Clear filters. Filter Section: a side-panel group with the selected count, collapse and Show more. Filter Group with Filter Conditions for advanced filters. Saved View Item for saved filter sets. Figma: Filters page. Guide: eggux build-ui/patterns/search-and-filter.md' } },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();
const statuses: FacetValue[] = [
  { value: 'draft', label: 'Draft', count: 12 },
  { value: 'sent', label: 'Sent', count: 48 },
  { value: 'overdue', label: 'Overdue', count: 24 },
  { value: 'pending', label: 'Pending', count: 9 },
  { value: 'paid', label: 'Paid', count: 1191 },
];
const customers: FacetValue[] = [{ value: 'nw', label: 'Northwind Traders', count: 31 }, { value: 'kes', label: 'Kestrel', count: 18 }, { value: 'fs', label: 'Fieldstone', count: 7 }];
const owners: FacetValue[] = [{ value: 'ana', label: 'Ana Popescu', count: 40 }, { value: 'mihai', label: 'Mihai Ionescu', count: 22 }];

function Bar() {
  const [value, setValue] = React.useState<Record<string, string[]>>({ Status: ['overdue', 'pending'], Customer: ['nw'], Owner: [] });
  const n = Object.values(value).flat().length;
  return (
    <div className="w-[1040px]">
      <FilterBar
        searchPlaceholder="Search invoices…"
        fields={[{ field: 'Status', options: statuses }, { field: 'Customer', options: customers }, { field: 'Owner', options: owners }]}
        value={value}
        onValueChange={setValue}
        resultText={n ? `${n} filters on` : 'No filters'}
        end={<><Button variant="outline" size="sm" leadingIcon={<ArrowUpDown aria-hidden="true" />}>Sort</Button><Button variant="outline" size="sm" leadingIcon={<Columns3 aria-hidden="true" />}>Columns</Button></>}
      />
    </div>
  );
}

// Figma: 1040 × 76; active chips with values, empty "+ Owner", Clear all; the chip opens the Faceted Filter.
export const Bar1: Story = {
  name: 'Filter Bar',
  render: () => <Bar />,
  play: async ({ canvas, canvasElement }) => {
    const bar = canvas.getByRole('search', { name: 'Filters' });
    await expect(Math.abs(Math.round(box(bar).height) - 76)).toBeLessThanOrEqual(1);
    await expect(bar).toHaveTextContent('StatusOverdue, Pending');
    const owner = canvas.getByRole('button', { name: 'Owner' });
    await expect(owner).toHaveAttribute('data-type', 'empty');
    await expect(Math.round(box(owner).height)).toBe(32);
    // Edit Status in the Faceted Filter.
    await userEvent.click(canvas.getByRole('button', { name: /Status.*Overdue, Pending/ }));
    const pop = await within(document.body).findByRole('dialog');
    await userEvent.click(within(pop).getByRole('checkbox', { name: /Draft/ }));
    await expect(bar).toHaveTextContent('Status3 selected');
    await userEvent.type(within(pop).getByRole('searchbox'), 'pai');
    await expect(within(pop).getAllByRole('checkbox')).toHaveLength(1);
    await userEvent.keyboard('{Escape}');
    // Remove Customer, then Clear all.
    await userEvent.click(canvas.getByRole('button', { name: 'Remove Customer filter' }));
    await expect(canvas.getByRole('button', { name: 'Customer' })).toHaveAttribute('data-type', 'empty');
    await expect(canvasElement.querySelector('[aria-live="polite"]')).toHaveTextContent('3 filters on');
    await userEvent.click(canvas.getByRole('button', { name: 'Clear all' }));
    await expect(canvas.queryByRole('button', { name: 'Clear all' })).toBeNull();
    await expect(canvasElement.querySelector('[aria-live="polite"]')).toHaveTextContent('No filters');
  },
};

function Faceted() {
  const [v, setV] = React.useState(['overdue', 'pending']);
  return <div className="w-60 rounded-md border border-border bg-popover shadow-md"><FacetedFilter field="Status" options={statuses} value={v} onValueChange={setV} /></div>;
}

// Figma: 240 wide; search, 5 values with counts (32 high), Clear filters.
export const Facets: Story = {
  name: 'Faceted Filter',
  render: () => <Faceted />,
  play: async ({ canvas, canvasElement }) => {
    const opt = canvasElement.querySelector('[data-slot="facet-option"]')!;
    await expect(Math.round(box(opt).height)).toBe(32);
    await expect(canvas.getByRole('checkbox', { name: /Overdue/ })).toBeChecked();
    await expect(canvas.getByRole('group', { name: 'Status' })).toHaveTextContent('1,191');
    await userEvent.click(canvas.getByRole('button', { name: 'Clear filters' }));
    await expect(canvas.getByRole('checkbox', { name: /Overdue/ })).not.toBeChecked();
    await expect(canvas.getByRole('button', { name: 'Clear filters' })).toBeDisabled();
    await userEvent.type(canvas.getByRole('searchbox'), 'zzz');
    await expect(canvas.getByText('No status matches “zzz”.')).toBeInTheDocument();
  },
};

function Sections() {
  const [s, setS] = React.useState(['overdue', 'pending']);
  const [c, setC] = React.useState<string[]>([]);
  const many: FacetValue[] = [...statuses, { value: 'void', label: 'Void', count: 3 }, { value: 'disputed', label: 'Disputed', count: 2 }, { value: 'archived', label: 'Archived', count: 80 }];
  return (
    <aside aria-label="Filter invoices">
      <FilterSection title="Status" options={many} value={s} onValueChange={setS} visible={4} />
      <FilterSection title="Customer" options={customers} value={c} onValueChange={setC} defaultOpen={false} />
    </aside>
  );
}

// Figma: 256 wide; expanded with the selected count and "Show N more"; collapsed 53 high.
export const SectionStory: Story = {
  name: 'Filter Section',
  render: () => <Sections />,
  play: async ({ canvas, canvasElement }) => {
    const [status, customer] = canvasElement.querySelectorAll('[data-slot="filter-section"]');
    await expect(Math.round(box(status!).width)).toBe(256);
    await expect(Math.round(box(customer!).height)).toBe(53);
    const head = canvas.getByRole('button', { name: /Status/ });
    await expect(head).toHaveAttribute('aria-expanded', 'true');
    await expect(head).toHaveAccessibleName(/2 selected/);
    await expect(within(status as HTMLElement).getAllByRole('checkbox')).toHaveLength(4);
    await userEvent.click(canvas.getByRole('button', { name: 'Show 4 more' }));
    await expect(within(status as HTMLElement).getAllByRole('checkbox')).toHaveLength(8);
    await userEvent.click(canvas.getByRole('button', { name: /Customer/ }));
    await expect(canvas.getByRole('button', { name: /Customer/ })).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByRole('checkbox', { name: /Kestrel/ })).toBeInTheDocument();
  },
};

const fieldList = [{ value: 'status', label: 'Status' }, { value: 'skills', label: 'Skills' }, { value: 'amount', label: 'Amount' }];
const ops = [{ value: 'any', label: 'is any of' }, { value: 'none', label: 'is none of' }];
const skills = [{ value: 'design', label: 'Design' }, { value: 'research', label: 'Research' }, { value: 'writing', label: 'Writing' }];

function Group() {
  const [rows, setRows] = React.useState([{ id: 'a', field: 'skills', operator: 'any', join: 'and' as const, value: ['design', 'research'] }]);
  const set = (i: number, patch: Partial<(typeof rows)[number]>) => setRows(r => r.map((x, k) => (k === i ? { ...x, ...patch } : x)));
  return (
    <div className="w-[800px]">
      <FilterGroup onAdd={() => setRows(r => [...r, { id: String(r.length + 1), field: 'status', operator: 'any', join: 'and', value: [] }])}>
        {rows.map((r, i) => (
          <FilterCondition
            key={r.id}
            label={`Condition ${i + 1}`}
            position={i === 0 ? 'first' : 'next'}
            join={r.join}
            onJoinChange={j => set(i, { join: j as 'and' })}
            fields={fieldList}
            field={r.field}
            onFieldChange={f => set(i, { field: f })}
            operators={ops}
            operator={r.operator}
            onOperatorChange={o => set(i, { operator: o })}
            onRemove={rows.length > 1 ? () => setRows(x => x.filter((_, k) => k !== i)) : undefined}
          >
            <TagInput label={`Condition ${i + 1}: value`} options={skills} value={r.value} onValueChange={v => set(i, { value: v })} placeholder="Add skill…" showChevron />
          </FilterCondition>
        ))}
      </FilterGroup>
    </div>
  );
}

// Figma: 800 wide muted group; "Where", field, operator, tag value, remove; Add condition adds an "and" row.
export const GroupStory: Story = {
  name: 'Filter Group and Condition',
  render: () => <Group />,
  play: async ({ canvas }) => {
    const first = canvas.getByRole('group', { name: 'Condition 1' });
    await expect(first).toHaveTextContent('Where');
    await expect(canvas.getByRole('combobox', { name: 'Condition 1: field' })).toHaveTextContent('Skills');
    await expect(canvas.getByRole('combobox', { name: 'Condition 1: operator' })).toHaveTextContent('is any of');
    await userEvent.click(canvas.getByRole('button', { name: 'Add condition' }));
    const second = canvas.getByRole('group', { name: 'Condition 2' });
    await expect(within(second).getByRole('combobox', { name: 'Condition 2: and or or' })).toHaveTextContent('and');
    await userEvent.click(canvas.getByRole('button', { name: 'Remove condition 2' }));
    await waitFor(() => expect(canvas.queryByRole('group', { name: 'Condition 2' })).toBeNull());
  },
};

// Figma: 240 × 32; default, active (secondary, aria-current), shared and count.
export const Views: Story = {
  name: 'Saved View Item',
  render: () => {
    const [active, setActive] = React.useState('overdue');
    return (
      <nav aria-label="Saved views" className="flex flex-col gap-1">
        {[{ id: 'all', name: 'All invoices', count: 1284 }, { id: 'overdue', name: 'Overdue over EUR 5k', count: 12, shared: true }, { id: 'mine', name: 'Mine this month', count: 7 }].map(v => (
          <SavedViewItem key={v.id} name={v.name} count={v.count} shared={v.shared} active={active === v.id} onClick={() => setActive(v.id)} />
        ))}
      </nav>
    );
  },
  play: async ({ canvas }) => {
    const overdue = canvas.getByRole('button', { name: /Overdue over EUR 5k/ });
    await expect(Math.round(box(overdue).width)).toBe(240);
    await expect(Math.round(box(overdue).height)).toBe(32);
    await expect(overdue).toHaveAttribute('aria-current', 'true');
    await expect(overdue).toHaveAccessibleName(/shared/);
    await expect(canvas.getByRole('button', { name: /All invoices/ })).toHaveTextContent('99+');
    await userEvent.click(canvas.getByRole('button', { name: /Mine this month/ }));
    await expect(canvas.getByRole('button', { name: /Mine this month/ })).toHaveAttribute('aria-current', 'true');
  },
};

// Narrow bar: chips wrap. Tests only.
export const Narrow: Story = {
  tags: ['!dev'],
  render: () => <div className="w-[480px]"><Bar /></div>,
  play: async ({ canvasElement }) => {
    const bar = canvasElement.querySelector('[data-slot="filter-bar"]')!;
    await expect(bar.scrollWidth).toBeLessThanOrEqual(1040);
  },
};

const All = () => (
  <div className="flex flex-col gap-8">
    <Bar />
    <div className="flex gap-8"><Faceted /><Sections /><SavedViewItem name="Overdue over EUR 5k" count={12} shared active /></div>
    <Group />
  </div>
);
export const AllDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, render: () => <All /> };
export const AllCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: () => <All /> };
