import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Listbox, useListbox } from './select-option';
import { PersonOption } from './person-option';

const meta = {
  title: 'Components/Select/Person Option',
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'One person in a People Picker list: checkbox (multi-select), avatar 32, name and a muted detail (role and email, so two people with the same name differ). role="option" with aria-selected; the checkbox only pictures the state. Single pick (owner, assignee): no checkbox, a check at the end. Figma: Select page / Person Option. Guide: eggux build-ui/components/select.md' } },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => {
  const r = el.getBoundingClientRect();
  return [Math.round(r.width), Math.round(r.height)];
};

interface Person { value: string; name: string; description: string; disabled?: boolean }
const people: Person[] = [
  { value: 'ana', name: 'Ana Popescu', description: 'Finance manager · ana.popescu@acme.com' },
  { value: 'ana-2', name: 'Ana Popescu', description: 'Designer · ana.p@acme.com' },
  { value: 'mihai', name: 'Mihai Ionescu', description: 'Account owner · mihai@acme.com' },
  { value: 'old', name: 'Radu Stan', description: 'Left the company', disabled: true },
];

const onPick = fn();

function PeopleList({ multiple = true, width = 288 }: { multiple?: boolean; width?: number }) {
  const [selected, setSelected] = React.useState<string[]>(['ana']);
  const lb = useListbox({
    items: people,
    onSelect: v => {
      onPick(v);
      setSelected(s => (multiple ? (s.includes(v) ? s.filter(x => x !== v) : [...s, v]) : [v]));
    },
  });
  return (
    <div style={{ width }} className="rounded-md border border-border bg-popover p-1 shadow-md">
      <input
        role="combobox"
        aria-expanded="true"
        aria-controls={lb.listboxId}
        aria-activedescendant={lb.activeId}
        aria-label="Search people"
        onKeyDown={lb.onKeyDown}
        placeholder="Search people…"
        className="mb-1 h-9 w-full border-b border-border bg-transparent px-2 text-sm outline-none"
      />
      <Listbox state={lb} multiple={multiple} aria-label="People">
        {people.map(p => (
          <PersonOption key={p.value} value={p.value} name={p.name} description={p.description} disabled={p.disabled} selected={selected.includes(p.value)} showCheckbox={multiple} />
        ))}
      </Listbox>
    </div>
  );
}

// Figma default: 288 × 54 in the list, 32 px avatar, name and detail on two lines; arrows move the
// highlight, Enter or a click toggles the person, the disabled one is skipped.
type Playground = { multiple: boolean; width: number };

/** Playground: Person Option in a People Picker list. Multiple shows checkboxes; single pick shows a check. */
export const Default: StoryObj<Playground> = {
  argTypes: {
    multiple: { name: 'Multiple', control: 'boolean', description: 'Checkboxes (several people) or a check at the end (one person)', table: { category: 'Person Option' } },
    width: { name: 'Width', control: { type: 'range', min: 220, max: 480, step: 4 }, table: { category: 'Person Option' } },
  },
  args: { multiple: true, width: 288 },
  render: a => <PeopleList key={String(a.multiple)} multiple={a.multiple} width={a.width} />,
};

// The checks that used to run on Default (hidden; the playground has no play function).
export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <PeopleList />,
  play: async ({ canvas }) => {
    const input = canvas.getByRole('combobox', { name: 'Search people' });
    const list = canvas.getByRole('listbox', { name: 'People' });
    const [ana, ana2, mihai] = within(list).getAllByRole('option');
    await expect(box(ana)[1]).toBe(54);
    await expect(box(ana.querySelector('[data-slot="avatar"]') ?? ana.querySelector('[aria-hidden="true"]:not([data-slot])')!)).toEqual([32, 32]);
    await expect(ana).toHaveAttribute('aria-selected', 'true');
    await expect(ana.querySelector('[data-slot="person-option-checkbox"]')).toHaveAttribute('data-state', 'checked');
    // Two people with the same name differ by the detail.
    await expect(ana).toHaveAccessibleName(/Finance manager/);
    await expect(ana2).toHaveAccessibleName(/Designer/);
    await userEvent.click(input);
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    await expect(input).toHaveAttribute('aria-activedescendant', mihai.id);
    await userEvent.keyboard('{ArrowDown}');
    await expect(input).toHaveAttribute('aria-activedescendant', mihai.id);
    await userEvent.keyboard('{Enter}');
    await expect(mihai).toHaveAttribute('aria-selected', 'true');
    await expect(ana).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(ana2);
    await expect(onPick).toHaveBeenLastCalledWith('ana-2');
    await expect(ana2).toHaveAttribute('aria-selected', 'true');
    await expect(input).toHaveFocus();
  },
};

// Single pick (owner, assignee): no checkbox, the selected person gets a check at the end.
export const SinglePick: Story = {
  parameters: { controls: { disable: true } },
  render: () => <PeopleList multiple={false} />,
  play: async ({ canvas }) => {
    const [ana, , mihai] = canvas.getAllByRole('option');
    await expect(ana.querySelector('[data-slot="person-option-checkbox"]')).toBeNull();
    await expect(ana.querySelector('svg')).not.toBeNull();
    await userEvent.click(mihai);
    await expect(mihai).toHaveAttribute('aria-selected', 'true');
    await expect(ana).toHaveAttribute('aria-selected', 'false');
  },
};

// Figma Selected × State: static options outside a list.
export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div role="listbox" aria-label="States" aria-multiselectable="true" className="flex w-72 flex-col gap-1">
      <PersonOption value="a" description="Finance manager · ana.popescu@acme.com" />
      <PersonOption value="b" description="Finance manager · ana.popescu@acme.com" highlighted />
      <PersonOption value="c" description="Finance manager · ana.popescu@acme.com" selected />
      <PersonOption value="d" name="Radu Stan" description="Left the company" disabled />
    </div>
  ),
  play: async ({ canvas }) => {
    const [, hover, selected, disabled] = canvas.getAllByRole('option');
    await expect(hover).toHaveAttribute('data-highlighted');
    await expect(selected).toHaveAttribute('aria-selected', 'true');
    await expect(disabled).toHaveAttribute('aria-disabled', 'true');
  },
};

// Stress: long name and detail truncate on one line each at 240; no description is one line. Tests only.
export const Stress: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => (
    <div role="listbox" aria-label="Stress" aria-multiselectable="true" className="flex w-60 flex-col gap-1">
      <PersonOption value="long" name="Alexandra-Maria Constantinescu-Dumitrescu" description="Head of international partnerships · alexandra.constantinescu@acme-enterprise.com" />
      <PersonOption value="short" name="Li" />
    </div>
  ),
  play: async ({ canvas }) => {
    const [long, short] = canvas.getAllByRole('option');
    await expect(box(long)[0]).toBe(240);
    for (const slot of ['person-option-name', 'person-option-description']) {
      const el = long.querySelector<HTMLElement>(`[data-slot="${slot}"]`)!;
      await expect(el.scrollWidth).toBeGreaterThan(el.clientWidth);
      await expect(box(el)[1]).toBe(20);
    }
    await expect(box(short)[1]).toBe(44);
  },
};

export const DefaultDark: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  globals: { theme: 'Dark' },
  render: () => <PeopleList />,
};
export const DefaultCorporate: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  globals: { theme: 'Corporate Light' },
  render: () => <PeopleList />,
};
