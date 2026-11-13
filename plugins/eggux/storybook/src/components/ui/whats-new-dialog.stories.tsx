import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test';
import { Button } from './button';
import { WhatsNewDialog, type WhatsNewChange } from './whats-new-dialog';

const all: WhatsNewChange[] = [
  { id: '1', type: 'new', text: 'Recurring invoices: set a schedule once and Acme sends them for you.' },
  { id: '2', type: 'new', text: 'Pay by bank transfer link, available in 12 countries.' },
  { id: '3', type: 'improved', text: 'The invoice list loads three times faster on large accounts.' },
  { id: '4', type: 'improved', text: 'Search now finds customers by VAT number.' },
  { id: '5', type: 'fixed', text: 'Totals in EUR no longer round down on credit notes.' },
  { id: '6', type: 'fixed', text: 'The date picker keeps your selection when you switch months.' },
];

const onGotIt = fn();

type Args = { title: string; version: string; date: string; changes: number; open: boolean; showNew: boolean; showImproved: boolean; showFixed: boolean };

const meta = {
  title: 'Components/Onboarding/Whats New Dialog',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A release note in a Dialog: title, version and date, changes with a New, Improved or Fixed badge, and one Got it button that takes focus on open. Escape, the X and Got it close it and focus returns to the trigger. A long list scrolls inside the body. Code only (no Figma component yet). Guide: eggux build-ui/patterns/onboarding.md',
      },
    },
  },
  args: { title: "What's new", version: '4.2', date: '2026-03-12', changes: 5, open: false, showNew: true, showImproved: true, showFixed: true },
  argTypes: {
    title: { name: 'Title', control: 'text', description: 'Dialog title.', table: { category: 'Dialog' } },
    version: { name: 'Version', control: 'text', description: 'Release number.', table: { category: 'Dialog' } },
    date: { name: 'Date', control: 'text', description: 'ISO date, shown as 12 March 2026.', table: { category: 'Dialog' } },
    changes: { name: 'Changes', control: { type: 'range', min: 1, max: 6, step: 1 }, description: 'How many changes are listed.', table: { category: 'Dialog' } },
    open: { name: 'Open', control: 'boolean', description: 'Start open.', table: { category: 'Dialog' } },
    showNew: { name: 'Show New', control: 'boolean', description: 'Include New changes.', table: { category: 'Parts' } },
    showImproved: { name: 'Show Improved', control: 'boolean', description: 'Include Improved changes.', table: { category: 'Parts' } },
    showFixed: { name: 'Show Fixed', control: 'boolean', description: 'Include Fixed changes.', table: { category: 'Parts' } },
  },
  render: ({ title, version, date, changes, open, showNew, showImproved, showFixed }) => {
    const list = all.slice(0, changes).filter(c => (c.type === 'new' ? showNew : c.type === 'improved' ? showImproved : showFixed));
    return (
      <WhatsNewDialog
        key={String(open)}
        title={title}
        version={version}
        date={date}
        changes={list}
        defaultOpen={open}
        trigger={<Button variant="outline">See what is new</Button>}
      />
    );
  },
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <WhatsNewDialog version="4.2" date="2026-03-12" changes={all} onGotIt={onGotIt} trigger={<Button variant="outline">See what is new</Button>} />,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'See what is new' });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: "What's new" });
    await expect(dialog).toHaveAccessibleDescription('Version 4.2 12 March 2026');
    await expect(dialog.querySelector('time')).toHaveAttribute('datetime', '2026-03-12');
    const items = dialog.querySelectorAll('[data-slot="whats-new-changes"] > li');
    await expect(items).toHaveLength(6);
    await expect(items[0]).toHaveTextContent('NewRecurring invoices');
    await expect(items[2]).toHaveTextContent('ImprovedThe invoice list');
    await expect(items[4]).toHaveTextContent('FixedTotals in EUR');
    // Focus lands on Got it, not on the close X.
    const gotIt = screen.getByRole('button', { name: 'Got it' });
    await waitFor(() => expect(gotIt).toHaveFocus());
    // Escape closes and focus goes back to the trigger.
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(trigger).toHaveFocus());
    // Reopen with the keyboard, then Got it closes and returns focus too.
    await userEvent.keyboard('{Enter}');
    await screen.findByRole('dialog', { name: "What's new" });
    await waitFor(() => expect(screen.getByRole('button', { name: 'Got it' })).toHaveFocus());
    // Tab stays inside the dialog.
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();
    await expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(true);
    await userEvent.click(screen.getByRole('button', { name: 'Got it' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(trigger).toHaveFocus());
    await expect(onGotIt).toHaveBeenCalled();
  },
};

/** Open from the start, as it appears on the first visit after an update. */
export const Open: Story = {
  args: { open: true },
  parameters: { controls: { disable: true } },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <WhatsNewDialog
      defaultOpen
      version="12.0.0-beta.4"
      date="2026-11-30"
      changes={[
        ...all,
        { id: '7', type: 'new', text: 'Supercalifragilisticexpialidocious_integration_with_a_very_long_unbreakable_name_for_exports.' },
        { id: '8', type: 'improved', text: 'Everything is a little better, including a sentence long enough to wrap over many lines in a narrow dialog.' },
        { id: '9', type: 'fixed', text: 'Another fix.' },
      ]}
    />
  ),
  play: async () => {
    const dialog = await screen.findByRole('dialog', { name: "What's new" });
    const rect = dialog.getBoundingClientRect();
    await expect(rect.left).toBeGreaterThanOrEqual(-1);
    await expect(rect.right).toBeLessThanOrEqual(window.innerWidth + 1);
    const footer = dialog.querySelector('[data-slot="dialog-footer"]') as HTMLElement;
    await expect(footer.getBoundingClientRect().bottom).toBeLessThanOrEqual(window.innerHeight + 1);
    const body = dialog.querySelector('[data-slot="dialog-body"]') as HTMLElement;
    await expect(body.scrollWidth).toBeLessThanOrEqual(body.clientWidth + 1);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
