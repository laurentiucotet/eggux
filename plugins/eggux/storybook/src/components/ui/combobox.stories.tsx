import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { Users } from '@/components/icons';
import { Combobox, type ComboboxOption } from './combobox';
import { Field } from './field';

const meta = {
  title: 'Components/Select/Combobox',
  component: Combobox,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Searchable select for long lists (country, customer, product) or when people know what to type. The trigger opens the Command 4 px below: a search input and the matching options, Checked on the selected one. Typing filters, arrows move, Enter picks and closes, Escape closes and returns focus. "No results for …" is announced; with onCreate a Create option comes last. Size default 36, sm 32, lg 40; read-only shows the value without chevrons; Show clear empties it. Figma: Select page / Combobox. Guide: eggux build-ui/components/select.md' } },
  },
  decorators: [Story => <div className="w-[240px]"><Story /></div>],
  args: { options: [] },
} satisfies Meta<typeof Combobox>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => {
  const r = el.getBoundingClientRect();
  return [Math.round(r.width), Math.round(r.height)];
};
const css = (el: Element) => getComputedStyle(el);
const probe = (className: string, prop: 'color' | 'backgroundColor' | 'borderTopColor') => {
  const el = document.createElement('span');
  el.className = className;
  (document.querySelector('#storybook-root') ?? document.body).append(el);
  const value = getComputedStyle(el)[prop];
  el.remove();
  return value;
};

const countries: ComboboxOption[] = [
  ['AT', 'Austria'], ['BE', 'Belgium'], ['BG', 'Bulgaria'], ['HR', 'Croatia'], ['CY', 'Cyprus'], ['CZ', 'Czechia'],
  ['DK', 'Denmark'], ['EE', 'Estonia'], ['FI', 'Finland'], ['FR', 'France'], ['DE', 'Germany'], ['GR', 'Greece'],
  ['HU', 'Hungary'], ['IE', 'Ireland'], ['IT', 'Italy'], ['MD', 'Moldova'], ['NL', 'Netherlands'], ['PL', 'Poland'],
  ['PT', 'Portugal'], ['RO', 'Romania'], ['RS', 'Serbia'], ['SK', 'Slovakia'], ['ES', 'Spain'], ['SE', 'Sweden'],
].map(([value, label]) => ({ value, label, keywords: [value] }));

const customers: ComboboxOption[] = [
  { value: 'nordwind', label: 'Nordwind Logistics', description: 'Customer · Hamburg', avatar: { initials: 'NL' } },
  { value: 'nordic', label: 'Nordic Supply Co.', description: 'Customer · Oslo', avatar: { initials: 'NS' } },
  { value: 'acme', label: 'Acme Retail', description: 'Customer · Cluj-Napoca', avatar: { initials: 'AR' } },
];

const onValueChange = fn();

// Figma Size=default, placeholder "Select country…": 240 x 36, chevrons-up-down. Click opens the
// Command 4 px below with the search focused; typing filters; Enter picks, closes, focus returns.
export const Default: Story = {
  render: () => (
    <Field label="Country">
      <Combobox options={countries} listLabel="Countries" searchPlaceholder="Search countries…" onValueChange={onValueChange} />
    </Field>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('combobox', { name: 'Country Select country…' });
    await expect(box(trigger)).toEqual([240, 36]);
    await expect(css(trigger).color).toBe(probe('text-muted-foreground', 'color'));
    await expect(css(trigger).borderTopColor).toBe(probe('border border-input', 'borderTopColor'));
    await expect(box(trigger.querySelector('svg')!)).toEqual([16, 16]);
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const dialog = await screen.findByRole('dialog', { name: 'Countries' });
    const search = within(dialog).getByRole('combobox', { name: 'Search countries' });
    await waitFor(() => expect(search).toHaveFocus());
    await expect(dialog.getBoundingClientRect().top - trigger.getBoundingClientRect().bottom).toBeCloseTo(4, 0);
    await expect(box(dialog)[0]).toBe(240);
    const list = within(dialog).getByRole('listbox', { name: 'Countries' });
    await expect(search).toHaveAttribute('aria-controls', list.id);
    await expect(within(list).getAllByRole('option')).toHaveLength(24);
    await userEvent.type(search, 'ro');
    await expect(within(list).getAllByRole('option').map(o => o.textContent)).toEqual(['Croatia', 'Romania']);
    await expect(search).toHaveAttribute('aria-activedescendant', within(list).getByRole('option', { name: 'Croatia' }).id);
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(onValueChange).toHaveBeenCalledWith('RO');
    const filled = canvas.getByRole('combobox', { name: 'Country Romania' });
    await waitFor(() => expect(filled).toHaveFocus());
    await expect(css(filled).color).toBe(probe('text-foreground', 'color'));
    // Reopen: the pick is checked and highlighted; the search starts empty.
    await userEvent.click(filled);
    const romania = await screen.findByRole('option', { name: 'Romania' });
    await expect(romania).toHaveAttribute('aria-selected', 'true');
    await expect(screen.getByRole('combobox', { name: /^Search/ })).toHaveValue('');
    await expect(screen.getByRole('combobox', { name: /^Search/ })).toHaveAttribute('aria-activedescendant', romania.id);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(filled).toHaveFocus();
  },
};

// Keyboard: a letter on the trigger opens the list with that letter searched; ArrowDown opens too.
export const Keyboard: Story = {
  render: () => <Field label="Country"><Combobox options={countries} listLabel="Countries" /></Field>,
  play: async ({ canvas }) => {
    await userEvent.tab();
    const trigger = canvas.getByRole('combobox', { name: /^Country/ });
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('p');
    const search = await screen.findByRole('combobox', { name: /^Search/ });
    await waitFor(() => expect(search).toHaveFocus());
    await expect(search).toHaveValue('p');
    await userEvent.keyboard('ol');
    await expect(screen.getAllByRole('option').map(o => o.textContent)).toEqual(['Poland']);
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(trigger).toHaveFocus());
    await expect(trigger).toHaveAccessibleName('Country Poland');
    await userEvent.keyboard('{ArrowDown}');
    await screen.findByRole('listbox');
    await userEvent.keyboard('{ArrowUp}{Enter}');
    await waitFor(() => expect(trigger).toHaveAccessibleName('Country Netherlands'));
  },
};

// "No results for <query>" in a polite status, never an empty dropdown.
export const NoResults: Story = {
  render: () => <Field label="Country"><Combobox options={countries} listLabel="Countries" /></Field>,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('combobox', { name: /^Country/ }));
    const search = await screen.findByRole('combobox', { name: /^Search/ });
    await userEvent.type(search, 'Atlantis');
    const empty = await screen.findByText('No results for “Atlantis”');
    await expect(empty).toHaveAttribute('role', 'status');
    await expect(search).not.toHaveAttribute('aria-activedescendant');
    await userEvent.keyboard('{Enter}');
    await expect(screen.getByRole('dialog')).toBeInTheDocument();
  },
};

// Figma "Example / Combobox create option": Select Option rows with avatars and a Create option last.
const onCreate = fn((q: string) => q.toLowerCase());
function CreateDemo() {
  const [options, setOptions] = React.useState(customers);
  return (
    <div className="w-[320px]">
      <Field label="Customer">
        <Combobox
          options={options}
          listLabel="Customers"
          placeholder="Select customer…"
          leading={<Users />}
          onCreate={q => {
            onCreate(q);
            const value = q.toLowerCase();
            setOptions(o => [...o, { value, label: q, description: 'New customer', avatar: { initials: q.slice(0, 2) } }]);
            return value;
          }}
          createLabel={q => `Create customer “${q}”`}
          createdText={q => `Customer ${q} created`}
        />
      </Field>
    </div>
  );
}

export const CreateOption: Story = {
  decorators: [],
  render: () => <CreateDemo />,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('combobox', { name: /^Customer/ });
    await expect(box(trigger.querySelector('svg')!)).toEqual([16, 16]);
    await userEvent.click(trigger);
    const search = await screen.findByRole('combobox', { name: /^Search/ });
    await userEvent.type(search, 'Nord');
    const options = screen.getAllByRole('option');
    await expect(options).toHaveLength(3);
    await expect(box(options[0])[1]).toBe(48);
    await expect(box(options[0].querySelector('[data-slot="avatar"]')!)).toEqual([32, 32]);
    const create = options[2];
    await expect(create).toHaveAccessibleName('Create customer “Nord”');
    await expect(create).toHaveAttribute('data-type', 'create');
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    await expect(onCreate).toHaveBeenCalledWith('Nord');
    await waitFor(() => expect(canvas.getByRole('combobox', { name: 'Customer Nord' })).toHaveFocus());
    await expect(canvas.getByText('Customer Nord created')).toHaveAttribute('role', 'status');
    // An exact match offers no Create option.
    await userEvent.click(canvas.getByRole('combobox', { name: 'Customer Nord' }));
    await userEvent.type(await screen.findByRole('combobox', { name: /^Search/ }), 'acme retail');
    await expect(screen.getAllByRole('option')).toHaveLength(1);
    await userEvent.keyboard('{Escape}');
  },
};

// Groups (Menu Label) and the leading on the trigger matching the options.
export const Groups: Story = {
  render: () => (
    <Field label="Assignee">
      <Combobox
        listLabel="People"
        optionType="item"
        defaultValue="ab"
        options={[
          { value: 'ab', label: 'Anna Berg', avatar: { initials: 'AB' }, group: 'Recent' },
          { value: 'mi', label: 'Mihai Ionescu', avatar: { initials: 'MI' }, group: 'Recent' },
          { value: 'er', label: 'Elena Radu', avatar: { initials: 'ER' }, group: 'Finance team' },
          { value: 'ap', label: 'Ana Popescu', avatar: { initials: 'AP' }, group: 'Finance team', disabled: true },
        ]}
      />
    </Field>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('combobox', { name: 'Assignee Anna Berg' });
    await expect(box(trigger.querySelector('[data-slot="avatar"]')!)).toEqual([20, 20]);
    await userEvent.click(trigger);
    const recent = await screen.findByRole('group', { name: 'Recent' });
    await expect(within(recent).getAllByRole('option')).toHaveLength(2);
    await expect(box(within(recent).getAllByRole('option')[0])[1]).toBe(32);
    await expect(screen.getByRole('option', { name: 'Ana Popescu' })).toHaveAttribute('aria-disabled', 'true');
    // The disabled option is skipped.
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{Enter}');
    await waitFor(() => expect(canvas.getByRole('combobox', { name: 'Assignee Elena Radu' })).toBeInTheDocument());
  },
};

// Server search: no filtering in the component, a loading row instead of an empty list.
export const Loading: Story = {
  render: () => <Field label="Product"><Combobox options={[]} shouldFilter={false} loading defaultOpen listLabel="Products" placeholder="Select product…" /></Field>,
  play: async () => {
    const status = await screen.findByText('Loading…');
    await expect(status.closest('[role="status"]')).not.toBeNull();
    await expect(screen.getByRole('listbox', { hidden: true })).not.toBeVisible();
  },
};

// Figma Size: sm 32, default 36, lg 40 (16 px sides, body/default).
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Combobox size="sm" label="Small" options={countries} />
      <Combobox label="Default" options={countries} />
      <Combobox size="lg" label="Large" options={countries} />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(box(canvas.getByRole('combobox', { name: /^Small/ }))).toEqual([240, 32]);
    await expect(box(canvas.getByRole('combobox', { name: /^Default/ }))).toEqual([240, 36]);
    const lg = canvas.getByRole('combobox', { name: /^Large/ });
    await expect(box(lg)).toEqual([240, 40]);
    await expect([css(lg).paddingLeft, css(lg).fontSize]).toEqual(['16px', '16px']);
  },
};

// Figma State=error, disabled, read-only and Show clear.
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Field label="Billing country" error="Choose the country on the invoice."><Combobox options={countries} /></Field>
      <Field label="Shipping country" disabled><Combobox options={countries} defaultValue="DE" /></Field>
      <Field label="Tax residence"><Combobox options={countries} readOnly defaultValue="RO" /></Field>
      <Field label="Country filter"><Combobox options={countries} showClear defaultValue="FR" /></Field>
    </div>
  ),
  play: async ({ canvas }) => {
    const error = canvas.getByRole('combobox', { name: /^Billing country/ });
    await expect(error).toHaveAttribute('aria-invalid', 'true');
    await expect(error).toHaveAccessibleDescription('Choose the country on the invoice.');
    await expect(css(error).borderTopColor).toBe(probe('border border-destructive', 'borderTopColor'));
    const disabled = canvas.getByRole('combobox', { name: /^Shipping country/ });
    await expect(disabled).toBeDisabled();
    await expect(css(disabled).opacity).toBe('0.5');
    // Read-only: a read-only text field with the value, muted fill, no chevrons.
    const readOnly = canvas.getByRole('textbox', { name: 'Tax residence' });
    await expect(readOnly).toHaveAttribute('readonly');
    await expect(readOnly).toHaveValue('Romania');
    const box2 = readOnly.closest('[data-slot="combobox"]')!;
    await expect(css(box2).backgroundColor).toBe(probe('bg-muted', 'backgroundColor'));
    await expect(box2.querySelector('svg')).toBeNull();
    await expect(box(box2)[1]).toBe(36);
    // Show clear: the x empties the value and focus goes back to the trigger.
    await userEvent.click(canvas.getByRole('button', { name: 'Clear selection' }));
    const filter = canvas.getByRole('combobox', { name: 'Country filter Select country…' });
    await expect(filter).toHaveFocus();
    await expect(canvas.queryByRole('button', { name: 'Clear selection' })).toBeNull();
  },
};

// The open list with rich options (Figma "Example / Combobox create option"), for the theme checks.
export const Open: Story = {
  decorators: [Story => <div className="h-[260px] w-[320px]"><Story /></div>],
  render: () => <Field label="Customer"><Combobox options={customers} defaultValue="nordic" defaultOpen listLabel="Customers" placeholder="Select customer…" /></Field>,
  play: async () => {
    const picked = await screen.findByRole('option', { name: /^Nordic Supply/ });
    await expect(picked).toHaveAttribute('aria-selected', 'true');
    await expect(css(picked).backgroundColor).toBe(probe('bg-accent', 'backgroundColor'));
  },
};

// Stress test (Figma "Stress test / Combobox"): a long value truncates to one line at 276 and 368,
// the chevrons keep their size; a long list scrolls inside the popover.
const longOptions: ComboboxOption[] = [
  { value: 'long', label: 'Northwind Traders International Logistics and Shipping Group' },
  ...countries,
];
export const Stress: Story = {
  tags: ['!dev'],
  decorators: [],
  render: () => (
    <div className="flex flex-col gap-4">
      {[276, 368].map(w => (
        <div key={w} style={{ width: w }}>
          <Combobox label={`Column ${w}`} options={longOptions} defaultValue="long" />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    for (const w of [276, 368]) {
      const trigger = canvas.getByRole('combobox', { name: new RegExp(`^Column ${w}`) });
      await expect(box(trigger)).toEqual([w, 36]);
      const value = trigger.querySelector('[data-slot="combobox-value"]') as HTMLElement;
      await expect(value.scrollWidth).toBeGreaterThan(value.clientWidth);
      await expect(box(trigger.querySelector('svg')!)).toEqual([16, 16]);
    }
    await userEvent.click(canvas.getByRole('combobox', { name: /^Column 276/ }));
    const list = await screen.findByRole('listbox');
    await expect(box(list)[1]).toBeLessThanOrEqual(300);
    await expect(list.scrollHeight).toBeGreaterThan(list.clientHeight);
    await userEvent.keyboard('{Escape}');
  },
};

export const OpenDark: Story = { ...Open, tags: ['!dev'], globals: { theme: 'Dark' } };
export const OpenCorporate: Story = { ...Open, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
