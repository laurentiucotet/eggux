import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { formatFullDate } from './calendar-date';
import { DateInput } from './date-input';
import { Field } from './field';

const TODAY = new Date(2026, 9, 19);

const meta = {
  title: 'Components/Input/Date Input',
  component: DateInput,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'A date people type (birth date, invoice date, contract start): day, month and year segments in the locale order with a calendar button that opens the Calendar. Digits fill a segment and move on, arrows change it, pasting a full date fills all three; the date is checked when focus leaves the field and the error names the rule. For dates near today use Date Picker. Figma: Input page / Date Input. Guide: eggux build-ui/components/date-picker.md' } },
  },
  args: { label: 'Invoice date', today: TODAY, defaultValue: new Date(2026, 10, 12), onValueChange: fn() },
} satisfies Meta<typeof DateInput>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => {
  const r = el.getBoundingClientRect();
  return [Math.round(r.width), Math.round(r.height)];
};
const probe = (className: string, prop: 'color' | 'borderTopColor' | 'backgroundColor') => {
  const el = document.createElement('span');
  el.className = className;
  (document.querySelector('#storybook-root') ?? document.body).append(el);
  const value = getComputedStyle(el)[prop];
  el.remove();
  return value;
};
const day = (d: Date) => new RegExp(formatFullDate(d));

// Figma State=default: 200 x 36, "12 / 11 / 2026" in en-GB order, calendar button 28 with a 16 px icon.
export const Default: Story = {
  play: async ({ canvas, args }) => {
    const group = canvas.getByRole('group', { name: 'Invoice date' });
    await expect(box(group)).toEqual([200, 36]);
    const segments = within(group).getAllByRole('spinbutton');
    await expect(segments.map(s => s.getAttribute('aria-label'))).toEqual(['Day', 'Month', 'Year']);
    await expect(segments.map(s => s.textContent)).toEqual(['12', '11', '2026']);
    await expect(segments[1]).toHaveAttribute('aria-valuetext', '11, November');
    // Day and month 20 to 28 wide, the year 36 to 48.
    for (const s of segments.slice(0, 2)) {
      await expect(s.getBoundingClientRect().width).toBeGreaterThanOrEqual(20);
      await expect(s.getBoundingClientRect().width).toBeLessThanOrEqual(28);
    }
    await expect(segments[2].getBoundingClientRect().width).toBeGreaterThanOrEqual(36);
    await expect(segments[2].getBoundingClientRect().width).toBeLessThanOrEqual(48);
    const button = canvas.getByRole('button', { name: 'Choose date' });
    await expect(box(button)).toEqual([28, 28]);
    await expect(box(button.querySelector('svg')!)).toEqual([16, 16]);
    // Figma State=focus: the focused segment takes the accent fill, the field the ring.
    await userEvent.click(segments[0]);
    await expect(segments[0]).toHaveFocus();
    await expect(getComputedStyle(segments[0]).backgroundColor).toBe(probe('bg-accent', 'backgroundColor'));
    await expect(getComputedStyle(group).borderTopColor).toBe(probe('border-ring', 'borderTopColor'));
    // Typing a full day moves on to the month.
    await userEvent.keyboard('05');
    await expect(segments[0]).toHaveTextContent('05');
    await expect(segments[1]).toHaveFocus();
    await expect(args.onValueChange).toHaveBeenLastCalledWith(new Date(2026, 10, 5));
  },
};

// Empty: DD, MM, YYYY in muted; typing 12112026 fills every segment in order.
export const Empty: Story = {
  args: { defaultValue: null },
  play: async ({ canvas, args }) => {
    const segments = canvas.getAllByRole('spinbutton');
    await expect(segments.map(s => s.textContent)).toEqual(['DD', 'MM', 'YYYY']);
    await expect(segments[0]).toHaveAttribute('aria-valuetext', 'Empty');
    await expect(getComputedStyle(segments[0]).color).toBe(probe('text-muted-foreground', 'color'));
    await userEvent.tab();
    await expect(segments[0]).toHaveFocus();
    // A 4 is the only day that can start with it, so it moves on at once.
    await userEvent.keyboard('4');
    await expect(segments[0]).toHaveTextContent('04');
    await expect(segments[1]).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}12112026');
    await expect(segments.map(s => s.textContent)).toEqual(['12', '11', '2026']);
    await expect(args.onValueChange).toHaveBeenLastCalledWith(new Date(2026, 10, 12));
  },
};

// Keyboard: arrows change a segment (and wrap), Left/Right move, Backspace clears then goes back,
// the calendar opens with Enter on the selected day and Escape returns focus to its button.
export const Keyboard: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.tab();
    const [d, m, y] = canvas.getAllByRole('spinbutton');
    await expect(d).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}');
    await expect(d).toHaveTextContent('13');
    await userEvent.keyboard('{ArrowRight}{ArrowUp}');
    await expect(m).toHaveFocus();
    await expect(m).toHaveTextContent('12');
    await userEvent.keyboard('{ArrowUp}');
    await expect(m).toHaveTextContent('01');
    await expect(args.onValueChange).toHaveBeenLastCalledWith(new Date(2026, 0, 13));
    await userEvent.keyboard('{Backspace}');
    await expect(m).toHaveTextContent('MM');
    await expect(args.onValueChange).toHaveBeenLastCalledWith(null);
    await userEvent.keyboard('{Backspace}');
    await expect(d).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}3');
    await expect(y).toHaveFocus();
    await expect(args.onValueChange).toHaveBeenLastCalledWith(new Date(2026, 2, 13));
    await userEvent.tab();
    const button = canvas.getByRole('button', { name: 'Choose date' });
    await expect(button).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    const dialog = await screen.findByRole('dialog', { name: 'Choose date' });
    await waitFor(() => expect(within(dialog).getByRole('button', { name: day(new Date(2026, 2, 13)) })).toHaveFocus());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(button).toHaveFocus();
  },
};

// The calendar button opens the Calendar 4 px under the field; a picked day fills the segments.
export const PickFromCalendar: Story = {
  play: async ({ canvas, args }) => {
    const group = canvas.getByRole('group', { name: 'Invoice date' });
    await userEvent.click(canvas.getByRole('button', { name: 'Choose date' }));
    const dialog = await screen.findByRole('dialog', { name: 'Choose date' });
    await waitFor(() => expect(Math.round(dialog.getBoundingClientRect().top - group.getBoundingClientRect().bottom)).toBe(4));
    await waitFor(() => expect(within(dialog).getByRole('button', { name: day(new Date(2026, 10, 12)) })).toHaveFocus());
    await userEvent.click(within(dialog).getByRole('button', { name: day(new Date(2026, 10, 20)) }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(canvas.getAllByRole('spinbutton').map(s => s.textContent)).toEqual(['20', '11', '2026']);
    await expect(args.onValueChange).toHaveBeenLastCalledWith(new Date(2026, 10, 20));
  },
};

// Segment order and separators follow the locale.
export const Locales: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-3">
      <DateInput label="en-GB" locale="en-GB" today={TODAY} defaultValue={new Date(2026, 10, 12)} />
      <DateInput label="en-US" locale="en-US" today={TODAY} defaultValue={new Date(2026, 10, 12)} />
      <DateInput label="ro-RO" locale="ro-RO" today={TODAY} defaultValue={new Date(2026, 10, 12)} />
    </div>
  ),
  play: async ({ canvas }) => {
    const read = (name: string) => canvas.getByRole('group', { name }).textContent;
    await expect(read('en-GB')).toBe('12/11/2026');
    await expect(read('en-US')).toBe('11/12/2026');
    await expect(read('ro-RO')).toBe('12.11.2026');
    const us = within(canvas.getByRole('group', { name: 'en-US' })).getAllByRole('spinbutton');
    await expect(us.map(s => s.getAttribute('aria-label'))).toEqual(['Month', 'Day', 'Year']);
  },
};

// Figma State=error: checked when focus leaves; the message names the rule and describes every segment.
export const Validation: Story = {
  args: { defaultValue: new Date(2025, 10, 12), minDate: new Date(2026, 0, 1) },
  play: async ({ canvas, canvasElement }) => {
    const group = canvas.getByRole('group', { name: 'Invoice date' });
    const [d, , y] = canvas.getAllByRole('spinbutton');
    await userEvent.click(d);
    await userEvent.click(document.body);
    await expect(await canvas.findByText('Date must be on or after 1 Jan 2026')).toBeVisible();
    await expect(d).toHaveAttribute('aria-invalid', 'true');
    await expect(d).toHaveAccessibleDescription('Date must be on or after 1 Jan 2026');
    await expect(getComputedStyle(group).borderTopColor).toBe(probe('border-destructive', 'borderTopColor'));
    // A partial date says what is missing.
    await userEvent.click(y);
    await userEvent.keyboard('{Backspace}');
    await userEvent.click(document.body);
    await expect(await canvas.findByText('Enter the day, month and year')).toBeVisible();
    // A valid date clears the error.
    await userEvent.click(y);
    await userEvent.keyboard('2026');
    await expect(canvasElement.querySelector('[data-slot="date-input-error"]')).toBeNull();
    await expect(d).not.toHaveAttribute('aria-invalid');
  },
};

// Pasting a full date (locale order or ISO) fills all segments.
export const Paste: Story = {
  args: { defaultValue: null },
  play: async ({ canvas, args }) => {
    const [d] = canvas.getAllByRole('spinbutton');
    await userEvent.click(d);
    await userEvent.paste('2026-03-15');
    await expect(canvas.getAllByRole('spinbutton').map(s => s.textContent)).toEqual(['15', '03', '2026']);
    await userEvent.paste('01.02.2027');
    await expect(args.onValueChange).toHaveBeenLastCalledWith(new Date(2027, 1, 1));
  },
};

// Figma State=disabled: faded, out of the tab order, nothing opens or changes.
export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas, args }) => {
    const group = canvas.getByRole('group', { name: 'Invoice date' });
    await expect(getComputedStyle(group).opacity).toBe('0.5');
    const [d] = canvas.getAllByRole('spinbutton');
    await expect(d).toHaveAttribute('aria-disabled', 'true');
    await expect(canvas.getByRole('button', { name: 'Choose date' })).toBeDisabled();
    await userEvent.tab();
    await expect(document.activeElement).not.toBe(d);
    await userEvent.click(d);
    await userEvent.keyboard('{ArrowUp}');
    await expect(d).toHaveTextContent('12');
    await expect(args.onValueChange).not.toHaveBeenCalled();
  },
};

// Inside a Field: the label names the group and focuses the first segment; the hint describes it.
export const InField: Story = {
  args: { label: undefined, defaultValue: null },
  render: args => (
    <div className="w-80">
      <Field label="Date of birth" hint="As on your ID card">
        <DateInput {...args} />
      </Field>
    </div>
  ),
  play: async ({ canvas }) => {
    const group = canvas.getByRole('group', { name: 'Date of birth' });
    const [d] = within(group).getAllByRole('spinbutton');
    await expect(d).toHaveAccessibleDescription('As on your ID card');
    await userEvent.click(canvas.getByText('Date of birth'));
    await expect(d).toHaveFocus();
  },
};

// Stress test (Figma "Stress test / Date Input"): min width 160, the 276 column, an error message.
export const Stress: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => (
    <div className="flex flex-col gap-6">
      <div data-case="min"><DateInput label="Min width" className="w-24" today={TODAY} defaultValue={new Date(2026, 10, 12)} /></div>
      <div data-case="column" className="w-[276px]"><DateInput label="Column" className="w-full" today={TODAY} defaultValue={new Date(2026, 10, 12)} /></div>
      <div data-case="empty"><DateInput label="Empty" today={TODAY} /></div>
      <div data-case="far" className="w-40"><DateInput label="Far" className="w-full" today={TODAY} defaultValue={new Date(9999, 11, 31)} /></div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const get = (c: string) => canvasElement.querySelector(`[data-case="${c}"] [role="group"]`) as HTMLElement;
    await expect(box(get('min'))).toEqual([160, 36]);
    await expect(box(get('column'))).toEqual([276, 36]);
    for (const c of ['min', 'column', 'empty', 'far']) {
      await expect(get(c).scrollWidth).toBeLessThanOrEqual(get(c).clientWidth);
      // 2-digit values never truncate and the calendar button stays inside the field.
      for (const s of get(c).querySelectorAll('[role="spinbutton"]')) await expect(s.scrollWidth).toBeLessThanOrEqual(s.clientWidth);
      const button = get(c).querySelector('button')!;
      await expect(button.getBoundingClientRect().right).toBeLessThanOrEqual(get(c).getBoundingClientRect().right);
    }
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
export const ValidationDark: Story = { ...Validation, tags: ['!dev'], globals: { theme: 'Dark' } };
