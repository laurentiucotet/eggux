import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { Calendar, FileText, Plus, Search, Settings, User } from '@/components/icons';
import { Button } from './button';
import { CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from './command';
import { CommandDialog, modifierKey } from './command-dialog';
import { Kbd } from './kbd';

const meta = {
  title: 'Components/Popover/Command Dialog',
  component: CommandDialog,
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Command palette opened with ⌘K / Ctrl K from anywhere and from a visible search button: search pages, records and actions; recent items before typing; groups; shortcuts on the right; footer with keys. Centered ~20% from the top over the dialog overlay. Modal: focus goes to the input, Escape closes, focus returns. Figma: Popover page / Command Dialog. Guide: eggux build-ui/components/popover.md' } },
  },
} satisfies Meta<typeof CommandDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => { const r = el.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; };
const run = fn();

function Items({ onRun }: { onRun: (value: string) => void }) {
  return (
    <>
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem icon={<Plus aria-hidden="true" />} onSelect={onRun}>Create invoice</CommandItem>
          <CommandItem icon={<Search aria-hidden="true" />} onSelect={onRun}>Search contacts</CommandItem>
          <CommandItem icon={<Calendar aria-hidden="true" />} onSelect={onRun}>Open calendar</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem icon={<User aria-hidden="true" />} shortcut="⌘P" onSelect={onRun}>Profile</CommandItem>
          <CommandItem icon={<FileText aria-hidden="true" />} shortcut="⌘B" onSelect={onRun}>Billing</CommandItem>
          <CommandItem icon={<Settings aria-hidden="true" />} shortcut="⌘," onSelect={onRun}>Settings</CommandItem>
        </CommandGroup>
      </CommandList>
    </>
  );
}

function Palette({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <>
      <Button variant="outline" className="w-60 justify-start text-muted-foreground" onClick={() => setOpen(true)}>
        <Search aria-hidden="true" />Search…<Kbd className="ml-auto">{`${modifierKey()}K`}</Kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Items onRun={value => { run(value); setOpen(false); }} />
      </CommandDialog>
    </>
  );
}

// The search button opens it with focus in the input; Enter runs the highlighted item and closes.
export const Default: Story = {
  render: () => <Palette />,
  play: async ({ canvas }) => {
    run.mockClear();
    const trigger = canvas.getByRole('button', { name: /Search/ });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Command palette' });
    const input = within(dialog).getByRole('combobox', { name: 'Command palette' });
    await waitFor(() => expect(input).toHaveFocus());
    // Figma: 560 x 360, ~20% from the top; input 48; footer 37.
    await expect(box(dialog)).toEqual([560, 360]);
    await expect(Math.round(dialog.getBoundingClientRect().top)).toBe(Math.round(window.innerHeight * 0.2));
    await expect(box(input.parentElement!)[1]).toBe(48);
    await expect(box(dialog.querySelector('[data-slot="command-dialog-footer"]')!)[1]).toBe(37);
    await expect(within(dialog).getByText('Profile').closest('[role=option]')!.querySelector('[data-slot="command-shortcut"]')).toHaveTextContent('⌘P');
    await userEvent.type(input, 'bill');
    await expect(within(dialog).getAllByRole('option').map(o => o.textContent)).toEqual(['Billing⌘B']);
    await userEvent.keyboard('{Enter}');
    await expect(run).toHaveBeenCalledWith('Billing');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(trigger).toHaveFocus();
  },
};

// ⌘K / Ctrl K opens it from anywhere; Escape closes; arrows move through the groups.
export const Shortcut: Story = {
  render: () => <Palette />,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: /Search/ });
    trigger.focus();
    await userEvent.keyboard('{Control>}k{/Control}');
    const dialog = await screen.findByRole('dialog', { name: 'Command palette' });
    const input = within(dialog).getByRole('combobox');
    await waitFor(() => expect(input).toHaveFocus());
    const active = () => document.getElementById(input.getAttribute('aria-activedescendant')!)!;
    await expect(active()).toHaveTextContent('Create invoice');
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}');
    await expect(active()).toHaveTextContent('Profile');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{Meta>}k{/Meta}');
    await screen.findByRole('dialog', { name: 'Command palette' });
    await userEvent.keyboard('{Meta>}k{/Meta}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  },
};

// No match: say so; the footer keys stay.
export const NoResults: Story = {
  render: () => <Palette defaultOpen />,
  play: async () => {
    const dialog = await screen.findByRole('dialog');
    await userEvent.type(within(dialog).getByRole('combobox'), 'payroll export');
    await expect(within(dialog).getByRole('status')).toHaveTextContent('No results found.');
    await expect(within(dialog).getByText('Navigate')).toBeVisible();
  },
};

// Many results scroll inside the list; header and footer stay; long labels truncate.
export const Stress: Story = {
  tags: ['!dev'],
  render: () => (
    <CommandDialog defaultOpen>
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandGroup heading="Records">
          {Array.from({ length: 40 }, (_, i) => (
            <CommandItem key={i} icon={<FileText aria-hidden="true" />} shortcut={i < 3 ? `⌘${i + 1}` : undefined}>
              {`Invoice INV-${1040 + i} for Acme Holdings International Logistics and Distribution, Bucharest office`}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  ),
  play: async () => {
    const dialog = await screen.findByRole('dialog');
    const list = dialog.querySelector<HTMLElement>('[data-slot="command-list"]')!;
    await expect(list.scrollHeight).toBeGreaterThan(list.clientHeight);
    await expect(list.scrollWidth).toBeLessThanOrEqual(list.clientWidth);
    await expect(box(within(dialog).getAllByRole('option')[0])[1]).toBe(32);
    await expect(dialog.querySelector('[data-slot="command-dialog-footer"]')).toBeVisible();
    await expect(dialog.getBoundingClientRect().bottom).toBeLessThanOrEqual(window.innerHeight);
  },
};

export const OpenDark: Story = { ...NoResults, tags: ['!dev'], globals: { theme: 'Dark' } };
export const OpenCorporate: Story = { ...NoResults, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
