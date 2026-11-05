import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { DateTimePicker } from './date-time-picker';

const TODAY = new Date(2026, 9, 19);
const VALUE = new Date(2026, 9, 22, 14, 30);

const meta = {
  title: 'Components/Calendar/Date Time Picker',
  component: DateTimePicker,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Pick a date and a time in one panel: a Calendar and a scrolling column of Time Slots, with the summary ("22 Oct 2026, 14:30") and Cancel and Apply in the footer. Apply commits both values; without the footer a pick commits at once. Unavailable times stay in the list, disabled. Needs about 400 px; on phones use a Drawer with the Calendar and a Time Picker below. Opened from a Date Picker with type="datetime". Figma: Calendar page / Date Time Picker. Guide: eggux build-ui/components/date-picker.md' } },
  },
  args: { today: TODAY, defaultValue: VALUE, onApply: fn(), onCancel: fn() },
} satisfies Meta<typeof DateTimePicker>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => {
  const r = el.getBoundingClientRect();
  return [Math.round(r.width), Math.round(r.height)];
};
const probe = (className: string, prop: 'color' | 'backgroundColor') => {
  const el = document.createElement('span');
  el.className = className;
  (document.querySelector('#storybook-root') ?? document.body).append(el);
  const value = getComputedStyle(el)[prop];
  el.remove();
  return value;
};
const panel = (el: HTMLElement) => el.querySelector('[data-slot="date-time-picker"]') as HTMLElement;

// Figma: 373 x 351, 22 Oct selected, 14:30 selected, summary "22 Oct 2026, 14:30", slots 96 x 32 with 8 px gaps.
export const Default: Story = {
  play: async ({ canvas, canvasElement, args }) => {
    await expect(box(panel(canvasElement))).toEqual([373, 351]);
    await expect(canvas.getByRole('status')).toHaveTextContent('22 Oct 2026, 14:30');
    const selected = canvas.getByRole('button', { name: '14:30', pressed: true });
    await waitFor(() => expect(getComputedStyle(selected).backgroundColor).toBe(probe('bg-primary', 'backgroundColor')));
    await expect(box(selected)).toEqual([96, 32]);
    const next = canvas.getByRole('button', { name: '15:00' });
    await expect(Math.round(next.getBoundingClientRect().top - selected.getBoundingClientRect().bottom)).toBe(8);
    await expect(canvas.getByText('Time')).toBeVisible();
    await expect(canvas.getByRole('button', { name: /Thursday 22 October 2026/ }).closest('[role="gridcell"]')).toHaveAttribute('aria-selected', 'true');
    // The selected time was scrolled into view.
    const viewport = canvasElement.querySelector('[data-slot="date-time-slots"]') as HTMLElement;
    await expect(viewport.scrollTop).toBeGreaterThan(0);
    const r = selected.getBoundingClientRect();
    await expect(r.top).toBeGreaterThanOrEqual(viewport.getBoundingClientRect().top - 1);
    await expect(r.bottom).toBeLessThanOrEqual(viewport.getBoundingClientRect().bottom + 1);
    // Keyboard: Tab goes from the calendar to one time slot; arrows move in the slots; Enter picks.
    canvas.getByRole('button', { name: /Thursday 22 October 2026/ }).focus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: '14:30' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    await expect(canvas.getByRole('button', { name: '15:30' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('status')).toHaveTextContent('22 Oct 2026, 15:30');
    await userEvent.keyboard('{Home}');
    await expect(canvas.getByRole('button', { name: '00:00' })).toHaveFocus();
    await userEvent.keyboard('{End}');
    await expect(canvas.getByRole('button', { name: '23:30' })).toHaveFocus();
    // Pick another day and time: the summary follows, Apply commits both.
    await userEvent.click(canvas.getByRole('button', { name: /Friday 23 October 2026/ }));
    await userEvent.click(canvas.getByRole('button', { name: '15:00' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('23 Oct 2026, 15:00');
    await expect(args.onApply).not.toHaveBeenCalled();
    await userEvent.click(canvas.getByRole('button', { name: 'Apply' }));
    await expect(args.onApply).toHaveBeenCalledTimes(1);
    const applied = (args.onApply as ReturnType<typeof fn>).mock.calls[0][0] as Date;
    await expect([applied.getDate(), applied.getHours(), applied.getMinutes()]).toEqual([23, 15, 0]);
    await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }));
    await expect(args.onCancel).toHaveBeenCalledTimes(1);
  },
};

// Unavailable times stay in the list, announced as unavailable, and cannot be picked.
export const UnavailableTimes: Story = {
  args: { isTimeUnavailable: t => t < '12:30' || t === '13:30' },
  play: async ({ canvas }) => {
    const slot = canvas.getByRole('button', { name: '13:30' });
    await expect(slot).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(slot);
    await expect(canvas.getByRole('status')).toHaveTextContent('22 Oct 2026, 14:30');
    await expect(canvas.getByRole('button', { name: '00:00' })).toHaveAttribute('aria-disabled', 'true');
    // Keyboard skips unavailable times.
    canvas.getByRole('button', { name: '14:00' }).focus();
    await userEvent.keyboard('{ArrowUp}');
    await expect(canvas.getByRole('button', { name: '13:00' })).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}');
    await expect(canvas.getByRole('button', { name: '12:30' })).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}');
    await expect(canvas.getByRole('button', { name: '12:30' })).toHaveFocus();
  },
};

// Show footer off: a pick commits at once, the panel is 57 px shorter.
export const WithoutFooter: Story = {
  args: { showFooter: false },
  play: async ({ canvas, canvasElement, args }) => {
    await expect(box(panel(canvasElement))).toEqual([373, 294]);
    await expect(canvas.queryByRole('button', { name: 'Apply' })).toBeNull();
    await userEvent.click(canvas.getByRole('button', { name: '16:00' }));
    await expect(args.onApply).toHaveBeenCalledTimes(1);
    await userEvent.click(canvas.getByRole('button', { name: /Saturday 24 October 2026/ }));
    await expect(args.onApply).toHaveBeenCalledTimes(2);
  },
};

