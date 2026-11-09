import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { DatePicker } from './date-picker';
import { Field } from './field';

const TODAY = new Date(2026, 9, 19);

const meta = {
  title: 'Components/Calendar/Date Picker',
  component: DatePicker,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Date field that opens a Calendar in a Popover, 4 px below. Value "22 Oct 2026". Type=range shows a period ("1 Oct to 31 Oct 2026") and opens the Date Range Picker; type="datetime" shows date and time and opens the Date Time Picker. Size default 36, sm 32 (filter bars), lg 40 (booking, mobile forms). Opening focuses the selected day or today; Escape closes and returns focus. For birth dates and far-away dates use a text Input with a mask. Figma: Calendar page / Date Picker. Guide: eggux build-ui/components/date-picker.md' } },
  },
  args: { today: TODAY, label: 'Due date', onValueChange: fn() },
  decorators: [Story => <div className="w-[240px]"><Story /></div>],
} satisfies Meta<typeof DatePicker>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => {
  const r = el.getBoundingClientRect();
  return [Math.round(r.width), Math.round(r.height)];
};
const probe = (className: string, prop: 'color' | 'backgroundColor' | 'borderTopColor') => {
  const el = document.createElement('span');
  el.className = className;
  (document.querySelector('#storybook-root') ?? document.body).append(el);
  const value = getComputedStyle(el)[prop];
  el.remove();
  return value;
};
const css = (el: Element) => getComputedStyle(el);

// Figma Type=single, Size=default, Content=placeholder: 240 x 36, calendar icon, "Pick a date".
export const Default: Story = {
  play: async ({ canvas, args }) => {
    const trigger = canvas.getByRole('button', { name: 'Due date, Pick a date' });
    await expect(box(trigger)).toEqual([240, 36]);
    await expect(box(trigger.querySelector('svg')!)).toEqual([16, 16]);
    await expect(css(trigger.querySelector('[data-slot="date-picker-value"]')!).color).toBe(probe('text-muted-foreground', 'color'));
    await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Choose a date' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    // The calendar opens 4 px below the trigger, with the md shadow, and focus is on today.
    await waitFor(() => expect(Math.round(dialog.getBoundingClientRect().top - trigger.getBoundingClientRect().bottom)).toBe(4));
    const calendar = dialog.querySelector('[data-slot="calendar"]') as HTMLElement;
    await expect(css(calendar).boxShadow).not.toBe('none');
    await expect(css(dialog).borderTopWidth).toBe('0px');
    await waitFor(() => expect(within(dialog).getByRole('button', { name: /Monday 19 October 2026/ })).toHaveFocus());
    await userEvent.click(within(dialog).getByRole('button', { name: /Thursday 22 October 2026/ }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(args.onValueChange).toHaveBeenCalledTimes(1);
    const filled = canvas.getByRole('button', { name: 'Due date, 22 Oct 2026' });
    await expect(filled).toHaveFocus();
    await expect(css(filled.querySelector('[data-slot="date-picker-value"]')!).color).toBe(probe('text-foreground', 'color'));
  },
};

// Keyboard only: Enter opens, focus is on the selected day, arrows move, Enter picks, Escape closes and returns focus.
export const Keyboard: Story = {
  args: { defaultValue: new Date(2026, 9, 22) },
  play: async ({ canvas, args }) => {
    await userEvent.tab();
    const trigger = canvas.getByRole('button', { name: 'Due date, 22 Oct 2026' });
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    const dialog = await screen.findByRole('dialog', { name: 'Choose a date' });
    await waitFor(() => expect(within(dialog).getByRole('button', { name: /Thursday 22 October 2026/ })).toHaveFocus());
    await userEvent.keyboard('{ArrowRight}{ArrowDown}');
    await expect(within(dialog).getByRole('button', { name: /Friday 30 October 2026/ })).toHaveFocus();
    await userEvent.keyboard('{PageDown}');
    await waitFor(() => expect(within(dialog).getByRole('grid', { name: 'November 2026' })).toBeVisible());
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(args.onValueChange).toHaveBeenCalledTimes(1);
    await expect(canvas.getByRole('button', { name: 'Due date, 30 Nov 2026' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await screen.findByRole('dialog');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(canvas.getByRole('button', { name: 'Due date, 30 Nov 2026' })).toHaveFocus();
  },
};

// Figma Size: default 36, sm 32, lg 40; text 14 px, lg 16 px.
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  decorators: [],
  render: () => (
    <div className="flex w-[240px] flex-col gap-3">
      <DatePicker size="sm" label="Small" today={TODAY} defaultValue={new Date(2026, 9, 22)} />
      <DatePicker size="default" label="Default" today={TODAY} defaultValue={new Date(2026, 9, 22)} />
      <DatePicker size="lg" label="Large" today={TODAY} defaultValue={new Date(2026, 9, 22)} />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(box(canvas.getByRole('button', { name: 'Small, 22 Oct 2026' }))).toEqual([240, 32]);
    await expect(box(canvas.getByRole('button', { name: 'Default, 22 Oct 2026' }))).toEqual([240, 36]);
    await expect(box(canvas.getByRole('button', { name: 'Large, 22 Oct 2026' }))).toEqual([240, 40]);
    await expect(css(canvas.getByRole('button', { name: 'Default, 22 Oct 2026' })).fontSize).toBe('14px');
    await expect(css(canvas.getByRole('button', { name: 'Large, 22 Oct 2026' })).fontSize).toBe('16px');
    await expect(css(canvas.getByRole('button', { name: 'Default, 22 Oct 2026' })).borderTopLeftRadius).toBe(css(canvas.getByRole('button', { name: 'Small, 22 Oct 2026' })).borderTopLeftRadius);
  },
};

// Figma State: error (destructive border, aria-invalid), disabled (faded, inert), read-only (muted fill, nothing opens).
export const States: Story = {
  parameters: { controls: { disable: true } },
  decorators: [],
  render: () => (
    <div className="flex w-[240px] flex-col gap-3">
      <DatePicker label="Error" today={TODAY} defaultValue={new Date(2026, 9, 22)} invalid />
      <DatePicker label="Disabled" today={TODAY} defaultValue={new Date(2026, 9, 22)} disabled />
      <DatePicker label="Read only" today={TODAY} defaultValue={new Date(2026, 9, 22)} readOnly />
    </div>
  ),
  play: async ({ canvas }) => {
    const error = canvas.getByRole('button', { name: 'Error, 22 Oct 2026' });
    await expect(error).toHaveAttribute('aria-invalid', 'true');
    await expect(css(error).borderTopColor).toBe(probe('border-destructive', 'borderTopColor'));
    const disabled = canvas.getByRole('button', { name: 'Disabled, 22 Oct 2026' });
    await expect(disabled).toBeDisabled();
    await expect(css(disabled).opacity).toBe('0.5');
    await userEvent.click(disabled);
    await expect(screen.queryByRole('dialog')).toBeNull();
    const readOnly = canvas.getByRole('textbox', { name: 'Read only, 22 Oct 2026' });
    await expect(readOnly).toHaveAttribute('aria-readonly', 'true');
    await expect(css(readOnly).backgroundColor).toBe(probe('bg-muted', 'backgroundColor'));
    await expect(box(readOnly)).toEqual([240, 36]);
    // The value stays at full contrast and nothing opens.
    await expect(css(readOnly.querySelector('[data-slot="date-picker-value"]')!).color).toBe(probe('text-foreground', 'color'));
    await userEvent.click(readOnly);
    await expect(screen.queryByRole('dialog')).toBeNull();
    // Clicking the read-only field focuses it (it stays in the tab order); the disabled one is skipped.
    await expect(readOnly).toHaveFocus();
    await userEvent.tab({ shift: true });
    await expect(error).toHaveFocus();
    await expect(css(error).boxShadow).not.toBe('none');
    await userEvent.tab();
    await expect(readOnly).toHaveFocus();
  },
};

// Unavailable days are disabled in the popover calendar (with the reason near the field).
export const UnavailableDays: Story = {
  args: { calendarProps: { disabled: d => d.getDay() === 0 || d < TODAY } },
  render: args => (
    <Field label="Delivery date" hint="Closed on Sundays">
      <DatePicker {...args} label={undefined} />
    </Field>
  ),
  play: async ({ canvas, args }) => {
    const trigger = canvas.getByRole('button', { name: 'Delivery date' });
    await expect(trigger).toHaveAccessibleDescription('Closed on Sundays');
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog');
    await expect(within(dialog).getByRole('button', { name: /Sunday 25 October 2026/ })).toHaveAttribute('aria-disabled', 'true');
    await expect(within(dialog).getByRole('button', { name: /Friday 16 October 2026/ })).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(within(dialog).getByRole('button', { name: /Sunday 25 October 2026/ }));
    await expect(args.onValueChange).not.toHaveBeenCalled();
    await expect(screen.getByRole('dialog')).toBeVisible();
    await userEvent.keyboard('{Escape}');
  },
};

// Figma Type=range: "1 Oct to 31 Oct 2026" (one year at the end), opens the Date Range Picker.
export const Range: Story = {
  args: { type: 'range', label: 'Period', defaultRange: { from: new Date(2026, 9, 1), to: new Date(2026, 9, 31) }, onRangeChange: fn() },
  play: async ({ canvas, args }) => {
    const trigger = canvas.getByRole('button', { name: 'Period, 1 Oct to 31 Oct 2026' });
    await expect(box(trigger)).toEqual([240, 36]);
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Choose a period' });
    await expect(box(dialog.querySelector('[data-slot="date-range-picker"]')!)[0]).toBe(662);
    await userEvent.click(within(dialog).getByRole('button', { name: 'Last 14 days' }));
    await userEvent.click(within(dialog).getByRole('button', { name: 'Apply' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(args.onRangeChange).toHaveBeenCalledTimes(1);
    await expect(canvas.getByRole('button', { name: /^Period, \d+ \w+ to \d+ \w+ \d{4}$/ })).toHaveFocus();
  },
};

export const RangePlaceholder: Story = {
  args: { type: 'range', label: 'Period', placeholder: 'Pick a period' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Period, Pick a period' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button'));
    const dialog = await screen.findByRole('dialog', { name: 'Choose a period' });
    await expect(within(dialog).getByRole('button', { name: 'Apply' })).toBeDisabled();
    await userEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(canvas.getByRole('button')).toHaveFocus();
  },
};

// Date and time: the trigger shows both values, the popover is the Date Time Picker.
export const DateAndTime: Story = {
  args: { type: 'datetime', label: 'Send at', defaultValue: new Date(2026, 9, 22, 14, 30) },
  play: async ({ canvas, args }) => {
    const trigger = canvas.getByRole('button', { name: 'Send at, 22 Oct 2026, 14:30' });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Choose date and time' });
    await expect(box(dialog.querySelector('[data-slot="date-time-picker"]')!)).toEqual([373, 351]);
    await userEvent.click(within(dialog).getByRole('button', { name: '16:00' }));
    await userEvent.click(within(dialog).getByRole('button', { name: 'Apply' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(args.onValueChange).toHaveBeenCalledTimes(1);
    await expect(canvas.getByRole('button', { name: 'Send at, 22 Oct 2026, 16:00' })).toHaveFocus();
  },
};

// Inside a Field the visible label names the trigger.
export const InField: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Field label="Invoice date" hint="Format follows your language">
      <DatePicker today={TODAY} />
    </Field>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Invoice date' });
    await expect(trigger).toHaveAccessibleDescription('Format follows your language');
    await userEvent.click(canvas.getByText('Invoice date'));
    await expect(await screen.findByRole('dialog')).toBeVisible();
    await userEvent.keyboard('{Escape}');
  },
};

// Stress test (Figma "Stress test / Date Picker"): a long range truncates to one line, the icon keeps its size.
export const LongRange: Story = { tags: ['!dev'],
  args: { type: 'range', label: 'Period', defaultRange: { from: new Date(2026, 8, 28), to: new Date(2027, 0, 31) } },
  decorators: [Story => <div className="w-[160px]"><Story /></div>],
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button');
    await expect(box(trigger)).toEqual([160, 36]);
    const value = trigger.querySelector('[data-slot="date-picker-value"]') as HTMLElement;
    await expect(value.scrollWidth).toBeGreaterThan(value.clientWidth);
    await expect(css(value).whiteSpace).toBe('nowrap');
    await expect(box(trigger.querySelector('svg')!)).toEqual([16, 16]);
    await expect(trigger.scrollWidth).toBeLessThanOrEqual(trigger.clientWidth);
  },
};

export const Column276: Story = { tags: ['!dev'],
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  args: { defaultValue: new Date(2026, 9, 22) },
  play: async ({ canvas }) => {
    await expect(box(canvas.getByRole('button'))).toEqual([276, 36]);
    await userEvent.click(canvas.getByRole('button'));
    const dialog = await screen.findByRole('dialog');
    // The calendar keeps 250 wide, so it fits the column.
    await expect(box(dialog.querySelector('[data-slot="calendar"]')!)[0]).toBe(250);
    await userEvent.keyboard('{Escape}');
  },
};

const Showcase = () => (
  <div className="flex w-[240px] flex-col gap-3">
    <DatePicker label="Empty" today={TODAY} />
    <DatePicker label="Filled" today={TODAY} defaultValue={new Date(2026, 9, 22)} />
    <DatePicker label="Error" today={TODAY} defaultValue={new Date(2026, 9, 22)} invalid />
    <DatePicker label="Disabled" today={TODAY} defaultValue={new Date(2026, 9, 22)} disabled />
    <DatePicker label="Read only" today={TODAY} defaultValue={new Date(2026, 9, 22)} readOnly />
    <DatePicker label="Range" type="range" today={TODAY} defaultRange={{ from: new Date(2026, 9, 1), to: new Date(2026, 9, 31) }} />
  </div>
);
export const AllStates: Story = { parameters: { controls: { disable: true } }, decorators: [], render: () => <Showcase />, name: 'All states' };
export const AllStatesDark: Story = { parameters: { controls: { disable: true } }, decorators: [], render: () => <Showcase />, tags: ['!dev'], globals: { theme: 'Dark' }, name: 'All states (Dark)' };
export const AllStatesCorporate: Story = { parameters: { controls: { disable: true } }, decorators: [], render: () => <Showcase />, tags: ['!dev'], globals: { theme: 'Corporate Light' }, name: 'All states (Corporate Light)' };
export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
