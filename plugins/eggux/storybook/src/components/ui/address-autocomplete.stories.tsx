import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { Field } from './field';
import { AddressAutocomplete, type AddressSuggestion } from './address-autocomplete';

const addresses: AddressSuggestion[] = [
  { id: 'a1', line1: 'Strada Victoriei 12', line2: 'Sector 1, Bucharest, Romania', address: { street: 'Strada Victoriei 12', city: 'Bucharest', postalCode: '010061', country: 'Romania' } },
  { id: 'a2', line1: 'Strada Victoriei 120', line2: 'Sector 1, Bucharest, Romania' },
  { id: 'a3', line1: 'Strada Victor Babeș 5', line2: 'Cluj-Napoca, Romania' },
  { id: 'a4', line1: 'Calea Victoriei 48', line2: 'Sector 1, Bucharest, Romania' },
];
const searchAddresses = (q: string): AddressSuggestion[] | Promise<AddressSuggestion[]> => addresses.filter(a => a.line1.toLocaleLowerCase().includes(q.toLocaleLowerCase()));

const meta = {
  title: 'Components/Select/Address Autocomplete',
  component: AddressAutocomplete,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'An address field with suggestions as people type (after 3 characters, debounced, at most 5). Each suggestion shows street and number, then city and country; "Enter the address manually" is the last option. Picking fills the separate fields, which stay editable. Arrows move, Enter picks, Escape closes and keeps the text; the count is announced. The app passes `search` (a places service). Figma: Select page / Address Autocomplete. Guide: eggux build-ui/components/select.md' } },
  },
  args: { search: searchAddresses, debounceMs: 0 },
  decorators: [Story => <div className="w-[360px]"><Story /></div>],
} satisfies Meta<typeof AddressAutocomplete>;
export default meta;
type Story = StoryObj<typeof meta>;

const h = (el: Element) => Math.round(el.getBoundingClientRect().height);

// Figma Show suggestions: type 3+ characters, suggestions appear, arrows move, Enter picks and fills.
export const Default: Story = {
  args: { onSelect: fn(), onManualEntry: fn() },
  render: args => <Field label="Billing address"><AddressAutocomplete {...args} /></Field>,
  play: async ({ canvas, args }) => {
    const input = canvas.getByRole('combobox', { name: /^Billing address/ });
    await expect(h(input.closest('[data-slot="address-autocomplete"]')!)).toBe(36);
    await userEvent.type(input, 'Vi');
    await expect(input).toHaveAttribute('aria-expanded', 'false');
    await userEvent.type(input, 'c');
    const list = await screen.findByRole('listbox', { name: 'Address suggestions' });
    await waitFor(() => expect(within(list).getAllByRole('option')).toHaveLength(5));
    await expect(canvas.getByRole('status')).toHaveTextContent('4 addresses found');
    await expect(within(list).getAllByRole('option')[4]).toHaveTextContent('Enter the address manually');
    await userEvent.keyboard('{ArrowDown}');
    const second = within(list).getAllByRole('option')[1];
    await expect(input).toHaveAttribute('aria-activedescendant', second.id);
    await userEvent.keyboard('{ArrowUp}{Enter}');
    await expect(args.onSelect).toHaveBeenCalledWith(addresses[0]);
    await expect(input).toHaveValue('Strada Victoriei 12');
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'false'));
    await expect(input).toHaveFocus();
  },
};

// Nothing matches: the text stays, the list says so and offers manual entry.
export const NoResults: Story = {
  args: { onManualEntry: fn() },
  render: args => <Field label="Delivery address"><AddressAutocomplete {...args} /></Field>,
  play: async ({ canvas, args }) => {
    const input = canvas.getByRole('combobox', { name: /^Delivery address/ });
    await userEvent.type(input, 'Bulevardul Nowhere');
    const popover = await screen.findByRole('dialog', { name: 'Address suggestions' });
    await expect(within(popover).getByText('No addresses found for “Bulevardul Nowhere”')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await expect(input).toHaveValue('Bulevardul Nowhere');
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{Enter}');
    await expect(args.onManualEntry).toHaveBeenCalled();
  },
};

// Picking fills the separate fields of a form; they stay editable.
function AddressForm() {
  const [parts, setParts] = React.useState({ city: '', postalCode: '', country: '' });
  return (
    <div className="flex flex-col gap-4">
      <Field label="Street"><AddressAutocomplete search={searchAddresses} debounceMs={0} onSelect={s => setParts({ city: s.address?.city ?? '', postalCode: s.address?.postalCode ?? '', country: s.address?.country ?? '' })} /></Field>
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5 text-sm font-medium">City<input className="h-9 rounded-input border border-input px-3 font-normal" value={parts.city} onChange={e => setParts({ ...parts, city: e.target.value })} /></label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">Postal code<input className="h-9 rounded-input border border-input px-3 font-normal" value={parts.postalCode} onChange={e => setParts({ ...parts, postalCode: e.target.value })} /></label>
      </div>
    </div>
  );
}
export const InAForm: Story = {
  render: () => <AddressForm />,
  play: async ({ canvas }) => {
    await userEvent.type(canvas.getByRole('combobox', { name: /^Street/ }), 'Strada Victoriei 12');
    const list = await screen.findByRole('listbox', { name: 'Address suggestions' });
    await userEvent.click(within(list).getAllByRole('option')[0]);
    await expect(canvas.getByRole('textbox', { name: 'City' })).toHaveValue('Bucharest');
    await expect(canvas.getByRole('textbox', { name: 'Postal code' })).toHaveValue('010061');
  },
};

// States: invalid and disabled.
export const States: Story = {
  name: 'States (invalid, disabled)',
  render: () => (
    <div className="flex flex-col gap-6">
      <Field label="Billing address" error="Enter a street and number."><AddressAutocomplete search={searchAddresses} /></Field>
      <Field label="Office address"><AddressAutocomplete search={searchAddresses} defaultValue="Strada Victoriei 12" disabled /></Field>
    </div>
  ),
  play: async ({ canvas }) => {
    const invalid = canvas.getByRole('combobox', { name: /^Billing address/ });
    await expect(invalid).toHaveAttribute('aria-invalid', 'true');
    await expect(invalid).toHaveAccessibleDescription(/Enter a street and number/);
    await expect(canvas.getByRole('combobox', { name: /^Office address/ })).toBeDisabled();
  },
};

// Stress: a slow search shows "Searching…", long lines truncate at 276, results cap at 5. Tests only.
export const Stress: Story = {
  tags: ['!dev'],
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  args: {
    label: 'Address',
    search: q => new Promise(resolve => setTimeout(() => resolve(Array.from({ length: 9 }, (_, i) => ({ id: `s${i}`, line1: `Strada ${q} cu un nume foarte lung de tot ${i + 1}`, line2: 'Sector 1, Bucharest, Romania, a very long second line' }))), 150)),
  },
  play: async ({ canvas }) => {
    await userEvent.type(canvas.getByRole('combobox', { name: 'Address' }), 'Lungă');
    await expect(await screen.findByText('Searching…')).toBeInTheDocument();
    const list = await screen.findByRole('listbox', { name: 'Address suggestions' });
    await waitFor(() => expect(within(list).getAllByRole('option')).toHaveLength(5));
    const first = within(list).getAllByRole('option')[0];
    const line1 = first.querySelector<HTMLElement>('.font-medium')!;
    await expect(line1.scrollWidth).toBeGreaterThan(line1.clientWidth);
    await expect(h(line1)).toBe(20);
  },
};

export const OpenDark: Story = {
  tags: ['!dev'],
  globals: { theme: 'Dark' },
  args: { onManualEntry: fn() },
  render: args => <Field label="Billing address"><AddressAutocomplete {...args} /></Field>,
  play: async ({ canvas }) => {
    await userEvent.type(canvas.getByRole('combobox', { name: /^Billing address/ }), 'Vic{ArrowDown}');
    await screen.findByRole('listbox', { name: 'Address suggestions' });
  },
};
export const OpenCorporate: Story = {
  tags: ['!dev'],
  globals: { theme: 'Corporate Light' },
  args: { onManualEntry: fn() },
  render: args => <Field label="Billing address"><AddressAutocomplete {...args} /></Field>,
  play: async ({ canvas }) => {
    await userEvent.type(canvas.getByRole('combobox', { name: /^Billing address/ }), 'Vic{ArrowDown}');
    await screen.findByRole('listbox', { name: 'Address suggestions' });
  },
};
