import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { Field } from './field';
import { PeoplePicker, type Person } from './people-picker';

const people: Person[] = [
  { id: 'ana', name: 'Ana Popescu', role: 'Finance manager', email: 'ana.popescu@acme.com', team: 'Finance', group: 'Recent' },
  { id: 'mihai', name: 'Mihai Ionescu', role: 'Account owner', email: 'mihai@acme.com', team: 'Sales', group: 'Recent' },
  { id: 'elena', name: 'Elena Marin', role: 'Designer', email: 'elena.marin@acme.com', team: 'Product', group: 'Suggested' },
  { id: 'dan', name: 'Dan Georgescu', role: 'Engineer', email: 'dan@acme.com', team: 'Product', group: 'Suggested' },
  { id: 'ioana', name: 'Ioana Stan', role: 'Support lead', email: 'ioana@acme.com', team: 'Support', group: 'Suggested' },
  { id: 'radu', name: 'Radu Pop', role: 'Left the company', email: 'radu@acme.com', disabled: true, group: 'Suggested' },
];

const meta = {
  title: 'Components/Select/People Picker',
  component: PeoplePicker,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Choose one or more people (assignee, approvers, share with). Picked people are person chips with Remove; over 4 the rest show as "+N". Open: a search (name, email, team, role), Recent and Suggested groups of Person Options, and an optional "Invite by email". Multi-select keeps the list open; multiple={false} closes after the pick. Arrows move, Enter picks, Escape closes and returns focus; adds and removes are announced. Figma: Select page / People Picker. Guide: eggux build-ui/components/select.md' } },
  },
  args: { people },
  decorators: [Story => <div className="w-[360px]"><Story /></div>],
} satisfies Meta<typeof PeoplePicker>;
export default meta;
type Story = StoryObj<typeof meta>;

const h = (el: Element) => Math.round(el.getBoundingClientRect().height);

// Figma State=closed then open: field 36, search, grouped list; picking adds a chip and keeps the
// list open; Escape closes and returns focus to the field.
export const Default: Story = {
  args: { onValueChange: fn() },
  render: args => <Field label="Approvers"><PeoplePicker {...args} /></Field>,
  play: async ({ canvas, args }) => {
    const trigger = canvas.getByRole('combobox', { name: /^Approvers/ });
    await expect(h(trigger.closest('[data-slot="people-picker"]')!)).toBe(36);
    await userEvent.click(trigger);
    const popover = await screen.findByRole('dialog', { name: 'People' });
    const search = within(popover).getByRole('combobox', { name: 'Search people or teams' });
    await waitFor(() => expect(search).toHaveFocus());
    const list = within(popover).getByRole('listbox', { name: 'People' });
    await expect(within(list).getByRole('group', { name: 'Recent' })).toBeInTheDocument();
    await userEvent.keyboard('{Enter}');
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['ana']);
    await expect(screen.getByRole('dialog', { name: 'People' })).toBeInTheDocument();
    await userEvent.type(search, 'design');
    await expect(within(list).getAllByRole('option')).toHaveLength(1);
    await userEvent.keyboard('{Enter}');
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['ana', 'elena']);
    await expect(search).toHaveValue('');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'People' })).toBeNull());
    await expect(trigger).toHaveFocus();
    await expect(canvas.getByRole('button', { name: 'Remove Ana Popescu' })).toBeInTheDocument();
    await expect(canvas.getByRole('status')).toHaveTextContent('Elena Marin added');
  },
};

// Picked people: chips wrap, over 4 the rest are "+N"; Remove and Backspace take people out.
export const Selected: Story = {
  args: { defaultValue: ['ana', 'mihai', 'elena', 'dan', 'ioana'] },
  render: args => <Field label="Share with"><PeoplePicker {...args} /></Field>,
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('button', { name: /^Remove / })).toHaveLength(4);
    await expect(canvas.getByText('+1')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Remove Ana Popescu' }));
    await expect(canvas.queryByText('+1')).toBeNull();
    await expect(canvas.getByRole('status')).toHaveTextContent('Ana Popescu removed');
    const trigger = canvas.getByRole('combobox', { name: /^Share with/ });
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{Backspace}');
    await expect(canvas.queryByRole('button', { name: 'Remove Ioana Stan' })).toBeNull();
  },
};

// One person (owner, assignee): no checkboxes, the list closes after the pick.
export const SinglePerson: Story = {
  args: { multiple: false, placeholder: 'Assign to…', onValueChange: fn() },
  render: args => <Field label="Assignee"><PeoplePicker {...args} /></Field>,
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('combobox', { name: /^Assignee/ }));
    const popover = await screen.findByRole('dialog', { name: 'People' });
    await expect(popover.querySelector('[data-slot="person-option-checkbox"]')).toBeNull();
    await userEvent.click(within(popover).getByRole('option', { name: /Mihai Ionescu/ }));
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['mihai']);
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'People' })).toBeNull());
  },
};

// No match: the empty text, and "Invite <email>" when the text is an email.
export const Invite: Story = {
  args: { onInvite: fn() },
  render: args => <Field label="Approvers"><PeoplePicker {...args} /></Field>,
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('combobox', { name: /^Approvers/ }));
    const popover = await screen.findByRole('dialog', { name: 'People' });
    await expect(within(popover).getByRole('button', { name: 'Invite by email' })).toBeInTheDocument();
    await userEvent.type(within(popover).getByRole('combobox', { name: 'Search people or teams' }), 'anna@contoso.com');
    await expect(within(popover).getByText('Nobody matches “anna@contoso.com”')).toBeInTheDocument();
    await userEvent.click(within(popover).getByRole('button', { name: 'Invite anna@contoso.com' }));
    await expect(args.onInvite).toHaveBeenCalledWith('anna@contoso.com');
  },
};

// States: invalid (red border, aria-invalid) and disabled (chips cannot be removed).
export const States: Story = {
  parameters: { controls: { disable: true } },
  name: 'States (invalid, disabled)',
  render: () => (
    <div className="flex flex-col gap-6">
      <Field label="Approvers" error="Add at least one approver."><PeoplePicker people={people} /></Field>
      <Field label="Owner"><PeoplePicker people={people} defaultValue={['ana']} disabled /></Field>
    </div>
  ),
  play: async ({ canvas }) => {
    const invalid = canvas.getByRole('combobox', { name: /^Approvers/ });
    await expect(invalid).toHaveAttribute('aria-invalid', 'true');
    await expect(invalid).toHaveAccessibleDescription(/Add at least one approver/);
    await expect(canvas.getByRole('combobox', { name: /^Owner/ })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Remove Ana Popescu' })).toBeDisabled();
  },
};

// Stress: long names in chips at 276, many people, server loading. Tests only.
export const Stress: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => {
    const many: Person[] = Array.from({ length: 30 }, (_, i) => ({ id: `p${i}`, name: `Person ${i + 1}`, email: `person${i + 1}@acme.com` }));
    return (
      <div className="flex flex-col gap-6">
        <div className="w-[276px]">
          <PeoplePicker label="Long names" people={[{ id: 'x', name: 'Alexandra-Maria Constantinescu-Dumitrescu' }, ...people]} defaultValue={['x', 'ana']} />
        </div>
        <PeoplePicker label="Many people" people={many} />
        <PeoplePicker label="Loading" people={[]} loading defaultOpen={false} />
      </div>
    );
  },
  play: async ({ canvas }) => {
    const field = canvas.getByRole('combobox', { name: 'Long names' }).closest('[data-slot="people-picker"]')!;
    await expect(Math.round(field.getBoundingClientRect().width)).toBe(276);
    await expect(field.scrollWidth).toBeLessThanOrEqual(field.clientWidth + 2);
    await userEvent.click(canvas.getByRole('combobox', { name: 'Many people' }));
    const popover = await screen.findByRole('dialog', { name: 'People' });
    await expect(within(popover).getAllByRole('option')).toHaveLength(30);
    await userEvent.keyboard('{Escape}');
    await userEvent.click(canvas.getByRole('combobox', { name: 'Loading' }));
    await expect(await screen.findByText('Loading…')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
  },
};

export const SelectedDark: Story = {
  tags: ['!dev'],
  globals: { theme: 'Dark' },
  args: { defaultValue: ['ana', 'mihai'] },
  render: args => <Field label="Share with"><PeoplePicker {...args} /></Field>,
};
export const SelectedCorporate: Story = {
  tags: ['!dev'],
  globals: { theme: 'Corporate Light' },
  args: { defaultValue: ['ana', 'mihai'] },
  render: args => <Field label="Share with"><PeoplePicker {...args} /></Field>,
};
