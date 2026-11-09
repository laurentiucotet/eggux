import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { FileText, Users } from '@/components/icons';
import { Listbox, ListboxGroup, ListboxItem, SelectOption, useListbox, type SelectOptionType } from './select-option';

const meta = {
  title: 'Components/Select/Select Option',
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'A rich option in a Select, Combobox or Menu list: icon tile or avatar, title, a muted second line (type, place, email) and a check when selected. Use it when the label alone is ambiguous. The same Type for every option in one list; Type=create is the only exception, always last ("Create "Urgent""). The listbox parts (useListbox, Listbox, ListboxGroup, ListboxItem, ListboxStatus) are the WAI-ARIA listbox with aria-activedescendant that Combobox, Tag Input and the pickers share. Figma: Select page / Select Option. Guide: eggux build-ui/components/select.md' } },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => {
  const r = el.getBoundingClientRect();
  return [Math.round(r.width), Math.round(r.height)];
};
const css = (el: Element) => getComputedStyle(el);
const probe = (className: string, prop: 'color' | 'backgroundColor') => {
  const el = document.createElement('span');
  el.className = className;
  (document.querySelector('#storybook-root') ?? document.body).append(el);
  const value = getComputedStyle(el)[prop];
  el.remove();
  return value;
};

interface Row { value: string; title: string; description?: string; disabled?: boolean }
const customers: Row[] = [
  { value: 'nw-berlin', title: 'Northwind Traders', description: 'Customer · Berlin' },
  { value: 'nw-lyon', title: 'Northwind Traders', description: 'Customer · Lyon' },
  { value: 'acme', title: 'Acme Logistics', description: 'Supplier · Cluj-Napoca' },
  { value: 'old', title: 'Contoso Retail', description: 'Archived customer', disabled: true },
];

const onPick = fn();

/** A minimal combobox: the input drives the listbox with aria-activedescendant. */
function CustomerList({ type = 'icon', rows = customers, width = 280, label = 'Customers' }: { type?: Exclude<SelectOptionType, 'create'>; rows?: Row[]; width?: number; label?: string }) {
  const [selected, setSelected] = React.useState<string>();
  const lb = useListbox({ items: rows, onSelect: v => { setSelected(v); onPick(v); } });
  return (
    <div style={{ width }} className="rounded-md border border-border bg-popover shadow-md">
      <input
        role="combobox"
        aria-expanded="true"
        aria-controls={lb.listboxId}
        aria-activedescendant={lb.activeId}
        aria-label={`Search ${label.toLowerCase()}`}
        onKeyDown={lb.onKeyDown}
        placeholder="Search…"
        className="h-9 w-full border-b border-border bg-transparent px-3 text-sm outline-none"
      />
      <Listbox state={lb} aria-label={label}>
        {rows.map(r => (
          <SelectOption
            key={r.value}
            value={r.value}
            type={type}
            title={r.title}
            description={r.description}
            disabled={r.disabled}
            checked={selected === r.value}
            avatar={{ initials: r.title.split(' ').map(w => w[0]).join('') }}
          />
        ))}
      </Listbox>
    </div>
  );
}

// Figma Type=icon, default: 280 x 48, 32 px icon tile, title ui/label, description ui/caption muted,
// 6 / 8 px padding, 8 gap. Arrows move the highlight (aria-activedescendant), Enter checks.
type Playground = { type: 'icon' | 'avatar' | 'none'; showDescriptions: boolean; disableLast: boolean; width: number };

/** Playground: every Select Option option in Controls, in a small searchable list (arrows move, Enter picks). */
export const Default: StoryObj<Playground> = {
  argTypes: {
    type: { name: 'Type', control: 'inline-radio', options: ['icon', 'avatar', 'none'], description: 'The same Type for every option in one list', table: { category: 'Select Option' } },
    showDescriptions: { name: 'Show descriptions', control: 'boolean', description: 'The muted second line', table: { category: 'Select Option' } },
    disableLast: { name: 'Disable last option', control: 'boolean', table: { category: 'Select Option' } },
    width: { name: 'Width', control: { type: 'range', min: 200, max: 480, step: 4 }, table: { category: 'Select Option' } },
  },
  args: { type: 'icon', showDescriptions: true, disableLast: true, width: 280 },
  render: a => (
    <CustomerList
      key={`${a.type}-${a.showDescriptions}-${a.disableLast}`}
      type={a.type}
      width={a.width}
      rows={customers.map((r, i) => ({ ...r, description: a.showDescriptions ? r.description : undefined, disabled: a.disableLast && i === customers.length - 1 }))}
    />
  ),
};

// The checks that used to run on Default (hidden; the playground has no play function).
export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <CustomerList />,
  play: async ({ canvas }) => {
    const input = canvas.getByRole('combobox', { name: 'Search customers' });
    const list = canvas.getByRole('listbox', { name: 'Customers' });
    const first = within(list).getByRole('option', { name: /^Northwind Traders\s*Customer · Berlin$/ });
    await expect(box(first)).toEqual([270, 48]);
    await expect(css(first).paddingLeft).toBe('8px');
    await expect(css(first).paddingTop).toBe('6px');
    await expect(box(first.querySelector('[data-slot="icon-tile"]')!)).toEqual([32, 32]);
    const title = first.querySelector('[data-slot="select-option-title"]')!;
    await expect([css(title).fontSize, css(title).lineHeight, css(title).fontWeight]).toEqual(['14px', '20px', '500']);
    const description = within(list).getByRole('option', { name: /Lyon/ }).querySelector('[data-slot="select-option-description"]')!;
    await expect([css(description).fontSize, css(description).lineHeight]).toEqual(['12px', '16px']);
    await expect(css(description).color).toBe(probe('text-muted-foreground', 'color'));
    // The first option is highlighted; arrows move; the disabled option is skipped.
    await userEvent.click(input);
    await expect(input).toHaveAttribute('aria-activedescendant', first.id);
    await expect(css(first).backgroundColor).toBe(probe('bg-accent', 'backgroundColor'));
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}');
    const acme = within(list).getByRole('option', { name: /Acme Logistics/ });
    await expect(input).toHaveAttribute('aria-activedescendant', acme.id);
    await userEvent.keyboard('{Enter}');
    await expect(onPick).toHaveBeenCalledWith('acme');
    await expect(acme).toHaveAttribute('aria-selected', 'true');
    await expect(acme.querySelector('svg.ml-auto')).not.toBeNull();
    await expect(input).toHaveFocus();
    // A click picks too, and keeps focus in the input.
    const lyon = within(list).getByRole('option', { name: /Lyon/ });
    await userEvent.click(lyon);
    await expect(lyon).toHaveAttribute('aria-selected', 'true');
    await expect(acme).toHaveAttribute('aria-selected', 'false');
    await expect(input).toHaveFocus();
    await expect(within(list).getByRole('option', { name: /Contoso/ })).toHaveAttribute('aria-disabled', 'true');
  },
};

// Figma Type: icon, avatar, none, and create (plus tile, Create label, 44 high), each with State=highlighted.
function TypesShowcase() {
  const lb = useListbox({ items: [], onSelect: () => {} });
  return (
    <Listbox state={lb} aria-label="Option types" className="grid w-[600px] max-h-none grid-cols-2 gap-2">
      <SelectOption value="icon" type="icon" description="Customer · Berlin" />
      <SelectOption value="icon-h" type="icon" description="Customer · Berlin" highlighted checked />
      <SelectOption value="avatar" type="avatar" title="Anna Berg" description="anna.berg@acme.com" avatar={{ initials: 'AB' }} />
      <SelectOption value="avatar-h" type="avatar" title="Mihai Ionescu" description="mihai.ionescu@acme.com" avatar={{ initials: 'MI' }} highlighted />
      <SelectOption value="none" type="none" title="Q3 revenue report" description="Report · Finance" />
      <SelectOption value="none-h" type="none" title="Q4 revenue report" description="Report · Finance" highlighted />
      <SelectOption value="create" type="create" createLabel='Create "Urgent"' />
      <SelectOption value="create-h" type="create" createLabel="Invite anna@acme.com" highlighted />
    </Listbox>
  );
}

export const Types: Story = {
  parameters: { controls: { disable: true } },
  render: () => <TypesShowcase />,
  play: async ({ canvas }) => {
    const avatar = canvas.getByRole('option', { name: /^Anna Berg\s*anna.berg@acme.com$/ });
    await expect(box(avatar.querySelector('[data-slot="avatar"]')!)).toEqual([32, 32]);
    const none = canvas.getByRole('option', { name: /^Q3 revenue report/ });
    await expect(none.querySelector('[data-slot="icon-tile"], [data-slot="avatar"]')).toBeNull();
    const create = canvas.getByRole('option', { name: 'Create "Urgent"' });
    await expect(box(create)[1]).toBe(44);
    await expect(create.querySelector('[data-slot="icon-tile"]')).not.toBeNull();
    const highlighted = canvas.getByRole('option', { name: /^Mihai/ });
    await expect(css(highlighted).backgroundColor).toBe(probe('bg-accent', 'backgroundColor'));
    await expect(css(avatar).backgroundColor).toBe('rgba(0, 0, 0, 0)');
  },
};

// The listbox parts: a Menu Label group and Menu Item rows (one line, leading icon, check).
function GroupsShowcase() {
  const items = [{ value: 'inv' }, { value: 'quote' }, { value: 'team' }];
  const [selected, setSelected] = React.useState('quote');
  const lb = useListbox({ items, onSelect: setSelected, homeEnd: true });
  return (
    <div className="w-[240px] rounded-md border border-border bg-popover shadow-md">
      <Listbox state={lb} aria-label="Record types" tabIndex={0} aria-activedescendant={lb.activeId} onKeyDown={lb.onKeyDown}>
        <ListboxGroup label="Documents">
          <ListboxItem value="inv" icon={<FileText />} checked={selected === 'inv'}>Invoice</ListboxItem>
          <ListboxItem value="quote" icon={<FileText />} checked={selected === 'quote'}>Quote</ListboxItem>
        </ListboxGroup>
        <ListboxGroup label="People">
          <ListboxItem value="team" icon={<Users />} checked={selected === 'team'}>Team</ListboxItem>
        </ListboxGroup>
      </Listbox>
    </div>
  );
}

export const ListboxParts: Story = {
  parameters: { controls: { disable: true } },
  render: () => <GroupsShowcase />,
  play: async ({ canvas }) => {
    const list = canvas.getByRole('listbox', { name: 'Record types' });
    await expect(canvas.getByRole('group', { name: 'Documents' })).toBeInTheDocument();
    const quote = canvas.getByRole('option', { name: 'Quote' });
    await expect(box(quote)[1]).toBe(32);
    await expect(quote).toHaveAttribute('aria-selected', 'true');
    await userEvent.tab();
    await expect(list).toHaveFocus();
    await userEvent.keyboard('{End}');
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('option', { name: 'Team' })).toHaveAttribute('aria-selected', 'true');
    await expect(quote).toHaveAttribute('aria-selected', 'false');
  },
};

// Stress test (Figma "Stress test / Select Option"): long title and description truncate on one line
// each at 276 and 368; the tile keeps its size; a long list scrolls inside the listbox only.
export const Stress: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => (
    <div className="flex items-start gap-4">
      {[276, 368].map(w => (
        <CustomerList
          key={w}
          width={w}
          label={`Customers ${w}`}
          rows={Array.from({ length: 12 }, (_, i) => ({
            value: `c${i}`,
            title: `Northwind Traders International Logistics Group ${i + 1}`,
            description: 'Customer · Berlin, Brandenburg, Germany, European Union',
          }))}
        />
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    for (const w of [276, 368]) {
      const list = canvas.getByRole('listbox', { name: `Customers ${w}` });
      await expect(box(list)[1]).toBeLessThanOrEqual(300);
      await expect(list.scrollHeight).toBeGreaterThan(list.clientHeight);
      const option = within(list).getAllByRole('option')[0];
      await expect(box(option)[1]).toBe(48);
      const title = option.querySelector('[data-slot="select-option-title"]') as HTMLElement;
      await expect(title.scrollWidth).toBeGreaterThan(title.clientWidth);
      await expect(title).toHaveAttribute('title', 'Northwind Traders International Logistics Group 1');
      await expect(box(option.querySelector('[data-slot="icon-tile"]')!)).toEqual([32, 32]);
      // Arrow to the last option: it scrolls into view inside the list.
      const input = canvas.getByRole('combobox', { name: `Search customers ${w}` });
      await userEvent.click(input);
      for (let i = 0; i < 11; i++) await userEvent.keyboard('{ArrowDown}');
      const last = within(list).getAllByRole('option')[11];
      await expect(input).toHaveAttribute('aria-activedescendant', last.id);
      await expect(last.getBoundingClientRect().bottom).toBeLessThanOrEqual(list.getBoundingClientRect().bottom + 1);
    }
  },
};

export const TypesDark: Story = { ...Types, tags: ['!dev'], globals: { theme: 'Dark' } };
export const TypesCorporate: Story = { ...Types, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
