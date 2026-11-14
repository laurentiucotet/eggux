import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { Button } from './button';
import { DatePickerSheet } from './date-picker-sheet';

type Args = { open: boolean; showQuick: boolean; blockPast: boolean; hasValue: boolean; title: string };

// A fixed "now": Wednesday 14 October 2026. Tests never depend on today's date.
const NOW = new Date(2026, 9, 14, 10, 30);
const VALUE = new Date(2026, 9, 20);

const meta = {
  title: 'Components/Mobile/Date Picker Sheet',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A date chosen in a bottom sheet: a quick row (Today, Tomorrow, Next week, counted from the `now` prop), the Calendar, and Cancel and Done. Picking only changes a draft; Done returns it and closes, Cancel, Escape and a tap outside drop it. Buttons are 44 high. Built on the Drawer. Code only (no Figma component yet).',
      },
    },
  },
  args: { open: false, showQuick: true, blockPast: false, hasValue: false, title: 'Choose a date' },
  argTypes: {
    open: { name: 'Open', control: 'boolean', description: 'Start with the sheet open.', table: { category: 'Sheet' } },
    title: { name: 'Title', control: 'text', description: 'What the date is for.', table: { category: 'Sheet' } },
    hasValue: { name: 'Has a date', control: 'boolean', description: 'Start from 20 Oct 2026.', table: { category: 'Sheet' } },
    blockPast: { name: 'Block past days', control: 'boolean', description: 'Days before now cannot be picked.', table: { category: 'Sheet' } },
    showQuick: { name: 'Show quick dates', control: 'boolean', description: 'Today, Tomorrow and Next week.', table: { category: 'Parts' } },
  },
  render: ({ open, showQuick, blockPast, hasValue, title }) => (
    <DatePickerSheet
      key={`${open}-${hasValue}`}
      defaultOpen={open}
      now={NOW}
      title={title}
      value={hasValue ? VALUE : undefined}
      minDate={blockPast ? NOW : undefined}
      showQuickDates={showQuick}
      trigger={<Button variant="outline">Pick a date</Button>}
    />
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Open from the start, as people see it on a phone. */
export const Open: Story = { args: { open: true } };

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: () => {
    const onDone = fn();
    return <DatePickerSheet now={NOW} onDone={onDone} trigger={<Button variant="outline">Pick a date</Button>} />;
  },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Pick a date' });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Choose a date' });
    // Done is off until a day is chosen.
    const done = screen.getByRole('button', { name: 'Done' });
    await expect(done).toBeDisabled();
    for (const name of ['Cancel', 'Done', 'Today, Wednesday 14 October 2026']) {
      await expect(Math.round(screen.getByRole('button', { name }).getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
    }
    // The quick dates count from `now`.
    await userEvent.click(screen.getByRole('button', { name: 'Tomorrow, Thursday 15 October 2026' }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Tomorrow, Thursday 15 October 2026' })).toHaveAttribute('aria-pressed', 'true'));
    await expect(screen.getByRole('status')).toHaveTextContent('Thursday 15 October 2026');
    await userEvent.click(screen.getByRole('button', { name: 'Next week, Wednesday 21 October 2026' }));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Wednesday 21 October 2026'));
    // A day in the calendar changes the draft, and the quick date lets go.
    await userEvent.click(within(dialog).getByRole('button', { name: 'Friday 23 October 2026' }));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Friday 23 October 2026'));
    await expect(screen.getByRole('button', { name: 'Next week, Wednesday 21 October 2026' })).toHaveAttribute('aria-pressed', 'false');
    await expect(done).toBeEnabled();
    await userEvent.click(done);
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const CancelCheck: Story = {
  tags: ['!dev'],
  render: () => <DatePickerSheet now={NOW} value={VALUE} trigger={<Button variant="outline">Pick a date</Button>} />,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Pick a date' });
    await userEvent.click(trigger);
    await screen.findByRole('dialog');
    await expect(screen.getByRole('status')).toHaveTextContent('Tuesday 20 October 2026');
    await userEvent.click(screen.getByRole('button', { name: 'Today, Wednesday 14 October 2026' }));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Wednesday 14 October 2026'));
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    // The draft is gone: the sheet starts from the value again, and Escape closes it too.
    await userEvent.click(trigger);
    await screen.findByRole('dialog');
    await expect(screen.getByRole('status')).toHaveTextContent('Tuesday 20 October 2026');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  },
};

export const DoneCheck: Story = {
  tags: ['!dev'],
  render: () => {
    const onDone = fn();
    return (
      <>
        <DatePickerSheet now={NOW} defaultOpen onDone={d => { onDone(d); document.body.dataset.picked = d.toDateString(); }} />
      </>
    );
  },
  play: async () => {
    await screen.findByRole('dialog');
    await userEvent.click(screen.getByRole('button', { name: 'Next week, Wednesday 21 October 2026' }));
    await userEvent.click(screen.getByRole('button', { name: 'Done' }));
    await waitFor(() => expect(document.body.dataset.picked).toBe(new Date(2026, 9, 21).toDateString()));
    delete document.body.dataset.picked;
  },
};

export const MinDateCheck: Story = {
  tags: ['!dev'],
  render: () => <DatePickerSheet now={NOW} defaultOpen minDate={new Date(2026, 9, 16)} />,
  play: async () => {
    await screen.findByRole('dialog');
    // Today and Tomorrow are before the minimum date; Next week is allowed.
    await expect(screen.getByRole('button', { name: 'Today, Wednesday 14 October 2026' })).toBeDisabled();
    await expect(screen.getByRole('button', { name: 'Tomorrow, Thursday 15 October 2026' })).toBeDisabled();
    await expect(screen.getByRole('button', { name: 'Next week, Wednesday 21 October 2026' })).toBeEnabled();
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <DatePickerSheet
      defaultOpen
      now={NOW}
      title="Choose the delivery date for the very long order number AC-2026-000451"
      description="A long description that has to wrap over several lines in the narrow sheet without any overflow."
    />
  ),
  play: async () => {
    const dialog = await screen.findByRole('dialog');
    await expect(dialog.getBoundingClientRect().width).toBeLessThanOrEqual(window.innerWidth);
    await expect(dialog.scrollWidth).toBeLessThanOrEqual(dialog.clientWidth + 1);
    await expect(screen.getByRole('button', { name: 'Done' })).toBeVisible();
  },
};

export const DefaultDark: Story = { ...Open, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Open, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
