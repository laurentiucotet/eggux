import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { ChevronsUpDown } from '@/components/icons';
import { Button } from './button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
  CommandSeparator,
} from './command';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

const meta = {
  title: 'Components/Popover/Command',
  component: Command,
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Searchable list: a search input over grouped options. Before typing, show recent or suggested items; the first match is highlighted; arrows move, Home / End jump, Enter picks; "No results found." is announced. Base of Command Dialog and pickers. The surface (288 wide, border, radius md, shadow md) comes from the container: PopoverContent className="w-72 p-0". Figma: Popover page / Command. Guide: eggux build-ui/components/popover.md' } },
  },
} satisfies Meta<typeof Command>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => { const r = el.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; };
const surface = 'w-72 overflow-hidden rounded-md border border-border bg-popover shadow-md';
const countries = ['Romania', 'Moldova', 'Hungary', 'Bulgaria'];
const more = ['Austria', 'Belgium', 'Croatia', 'Czechia', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Poland', 'Portugal', 'Slovakia', 'Slovenia', 'Spain', 'Sweden'];

function CountryList({ onSelect, selected }: { onSelect?: (value: string) => void; selected?: string }) {
  return (
    <Command label="Country">
      <CommandInput placeholder="Search country…" />
      <CommandList>
        <CommandEmpty />
        <CommandGroup heading="Suggestions">
          {countries.map(c => (
            <CommandItem key={c} onSelect={onSelect} checked={selected === undefined ? undefined : selected === c}>{c}</CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="All countries">
          {more.map(c => <CommandItem key={c} onSelect={onSelect} checked={selected === undefined ? undefined : selected === c}>{c}</CommandItem>)}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

const onPick = fn();

// Typing filters and highlights the first match; Enter picks it.
export const Default: Story = {
  parameters: { controls: { disable: true } },
  render: () => <div className={surface}><CountryList onSelect={onPick} /></div>,
  play: async ({ canvas }) => {
    onPick.mockClear();
    const input = canvas.getByRole('combobox', { name: 'Country' });
    const listbox = canvas.getByRole('listbox', { name: 'Country' });
    await expect(input).toHaveAttribute('aria-controls', listbox.id);
    // Figma: input 36 (density control-height), heading and rows 32.
    await expect(box(input.parentElement!)[1]).toBe(36);
    await expect(box(canvas.getByRole('option', { name: 'Romania' }))).toEqual([278, 32]);
    await expect(box(canvas.getByText('Suggestions'))[1]).toBe(32);
    // The first option is highlighted before typing.
    await expect(input).toHaveAttribute('aria-activedescendant', canvas.getByRole('option', { name: 'Romania' }).id);
    await userEvent.click(input);
    await userEvent.type(input, 'ia');
    const options = canvas.getAllByRole('option');
    await expect(options.map(o => o.textContent)).toEqual(['Romania', 'Bulgaria', 'Austria', 'Croatia', 'Czechia', 'Estonia', 'Latvia', 'Lithuania', 'Slovakia', 'Slovenia']);
    await expect(input).toHaveAttribute('aria-activedescendant', options[0].id);
    await expect(options[0]).toHaveAttribute('aria-selected', 'true');
    // The separator hides while filtering.
    await expect(canvas.queryByRole('separator')).toBeNull();
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(onPick).toHaveBeenCalledWith('Bulgaria');
    await expect(input).toHaveFocus();
  },
};

// Arrows move, Home / End jump; the list stops at both ends; the highlight is accent.
export const Keyboard: Story = {
  parameters: { controls: { disable: true } },
  render: () => <div className={surface}><CountryList onSelect={onPick} /></div>,
  play: async ({ canvas }) => {
    onPick.mockClear();
    const input = canvas.getByRole('combobox');
    await userEvent.tab();
    await expect(input).toHaveFocus();
    const active = () => document.getElementById(input.getAttribute('aria-activedescendant')!)!;
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    await expect(active()).toHaveTextContent('Hungary');
    const accent = document.createElement('span');
    accent.className = 'bg-accent';
    document.body.append(accent);
    await expect(getComputedStyle(active()).backgroundColor).toBe(getComputedStyle(accent).backgroundColor);
    accent.remove();
    await userEvent.keyboard('{End}');
    await expect(active()).toHaveTextContent('Sweden');
    // The highlighted option scrolls into view.
    const list = input.closest('[data-slot="command"]')!.querySelector<HTMLElement>('[data-slot="command-list"]')!;
    await waitFor(() => expect(active().getBoundingClientRect().bottom).toBeLessThanOrEqual(list.getBoundingClientRect().bottom + 1));
    await userEvent.keyboard('{ArrowDown}');
    await expect(active()).toHaveTextContent('Sweden');
    await userEvent.keyboard('{Home}{ArrowUp}');
    await expect(active()).toHaveTextContent('Romania');
    await userEvent.keyboard('{Enter}');
    await expect(onPick).toHaveBeenCalledWith('Romania');
  },
};

// Pointer: hovering highlights, a click picks and keeps focus in the input.
export const Pointer: Story = {
  parameters: { controls: { disable: true } },
  render: () => <div className={surface}><CountryList onSelect={onPick} /></div>,
  play: async ({ canvas }) => {
    onPick.mockClear();
    const input = canvas.getByRole('combobox');
    await userEvent.click(input);
    const moldova = canvas.getByRole('option', { name: 'Moldova' });
    await userEvent.hover(moldova);
    await expect(input).toHaveAttribute('aria-activedescendant', moldova.id);
    await userEvent.click(moldova);
    await expect(onPick).toHaveBeenCalledWith('Moldova');
    await expect(input).toHaveFocus();
  },
};

// Figma Show empty on, Show items off: "No results found." in a status region.
export const Empty: Story = {
  parameters: { controls: { disable: true } },
  render: () => <div className={surface}><CountryList /></div>,
  play: async ({ canvas }) => {
    const input = canvas.getByRole('combobox');
    await userEvent.type(input, 'Atlantis');
    const status = canvas.getByRole('status');
    await expect(status).toHaveTextContent('No results found.');
    await expect(canvas.queryAllByRole('option')).toHaveLength(0);
    await expect(input).not.toHaveAttribute('aria-activedescendant');
    // Figma empty row: 68 high (24 px above and below body/small).
    await expect(box(status)[1]).toBe(68);
    await userEvent.keyboard('{Enter}');
    await userEvent.clear(input);
    await expect(status).toHaveTextContent('');
    await expect(canvas.getAllByRole('option').length).toBe(24);
  },
};

// In a Combobox-style picker the selected value shows Checked (aria-checked + a check).
function CountryPicker() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('Romania');
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-72 justify-between" aria-label={`Country: ${value}`}>
          {value}<ChevronsUpDown aria-hidden="true" className="text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" aria-label="Country">
        <CountryList selected={value} onSelect={v => { setValue(v); setOpen(false); }} />
      </PopoverContent>
    </Popover>
  );
}

export const InPopover: Story = {
  parameters: { controls: { disable: true } },
  render: () => <CountryPicker />,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Country: Romania' });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Country' });
    const input = within(dialog).getByRole('combobox');
    await waitFor(() => expect(input).toHaveFocus());
    await expect(within(dialog).getByRole('option', { name: 'Romania' })).toHaveAttribute('aria-checked', 'true');
    await expect(within(dialog).getByRole('option', { name: 'Moldova' })).toHaveAttribute('aria-checked', 'false');
    await userEvent.type(input, 'hun');
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(canvas.getByRole('button', { name: 'Country: Hungary' })).toHaveFocus();
  },
};

// Keywords and diacritics: "bras" finds Brașov, "capital" finds Bucharest; disabled items are skipped.
export const KeywordsAndDisabled: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => (
    <div className={surface}>
      <Command label="City">
        <CommandInput placeholder="Search city…" />
        <CommandList>
          <CommandEmpty />
          <CommandItem keywords={['capital']}>Bucharest</CommandItem>
          <CommandItem disabled>Cluj-Napoca</CommandItem>
          <CommandItem>Brașov</CommandItem>
        </CommandList>
      </Command>
    </div>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByRole('combobox');
    const active = () => document.getElementById(input.getAttribute('aria-activedescendant')!)!;
    await userEvent.click(input);
    await userEvent.keyboard('{ArrowDown}');
    await expect(active()).toHaveTextContent('Brașov');
    await expect(canvas.getByRole('option', { name: 'Cluj-Napoca' })).toHaveAttribute('aria-disabled', 'true');
    await userEvent.type(input, 'bras');
    await expect(canvas.getAllByRole('option').map(o => o.textContent)).toEqual(['Brașov']);
    await userEvent.clear(input);
    await userEvent.type(input, 'capital');
    await expect(canvas.getAllByRole('option').map(o => o.textContent)).toEqual(['Bucharest']);
  },
};

// Async results: a loading row, never an empty list; Empty waits until loading ends.
export const Loading: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className={surface}>
      <Command label="Customer" shouldFilter={false} loading>
        <CommandInput placeholder="Search customer…" />
        <CommandList>
          <CommandLoading>Searching customers…</CommandLoading>
          <CommandEmpty />
        </CommandList>
      </Command>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Searching customers…')).toBeVisible();
    await expect(canvas.queryByText('No results found.')).toBeNull();
    await expect(canvas.getByRole('listbox', { hidden: true })).toHaveAttribute('aria-busy', 'true');
  },
};

// Long names truncate to one line in the 276 / 368 columns; many items scroll inside 300 px.
export const Stress: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => (
    <div className="flex gap-6">
      {[276, 368].map(width => (
        <div key={width} data-testid={`col-${width}`} className="overflow-hidden rounded-md border border-border bg-popover shadow-md" style={{ width }}>
          <Command label={`Customer ${width}`}>
            <CommandInput placeholder="Search customer…" />
            <CommandList>
              <CommandGroup heading="Recent customers of the finance team in the Bucharest office">
                {Array.from({ length: 30 }, (_, i) => (
                  <CommandItem key={i} shortcut={i === 0 ? '⌘1' : undefined}>{`Acme Holdings International Logistics and Distribution ${i + 1}`}</CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const width of [276, 368]) {
      const col = within(canvasElement).getByTestId(`col-${width}`);
      const list = col.querySelector<HTMLElement>('[data-slot="command-list"]')!;
      await expect(box(list)[1]).toBe(300);
      await expect(list.scrollWidth).toBeLessThanOrEqual(list.clientWidth);
      const first = within(col).getAllByRole('option')[0];
      await expect(box(first)[1]).toBe(32);
      await expect(box(col.querySelector('[data-slot="command-group-heading"]')!)[1]).toBe(32);
    }
  },
};

export const DefaultDark: Story = { ...Keyboard, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Keyboard, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
