import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { DateRangePicker } from './date-range-picker';

const TODAY = new Date(2026, 9, 19);
const LAST_14 = { from: new Date(2026, 9, 6), to: new Date(2026, 9, 19) };

const meta = {
  title: 'Components/Calendar/Date Range Picker',
  component: DateRangePicker,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Date range panel for filters and reports: presets, two months (previous and current), a summary with the number of days, Cancel and Apply. Future days are disabled for reports on past data. Needs 658 px; in a narrower place use one Calendar in a Popover with the presets as a Select. Normally opened from a Date Picker with type="range". Figma: Calendar page / Date Range Picker. Guide: eggux build-ui/components/date-picker.md' } },
  },
  args: { today: TODAY, defaultValue: LAST_14, onApply: fn(), onCancel: fn() },
} satisfies Meta<typeof DateRangePicker>;
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
const panel = (el: HTMLElement) => el.querySelector('[data-slot="date-range-picker"]') as HTMLElement;

// Figma: 662 x 355, "Last 14 days" checked, 6 Oct to 19 Oct, summary "6 Oct - 19 Oct 2026 · 14 days".
export const Default: Story = {
  play: async ({ canvas, canvasElement, args }) => {
    await expect(box(panel(canvasElement))).toEqual([662, 355]);
    const active = canvas.getByRole('button', { name: 'Last 14 days' });
    await expect(active).toHaveAttribute('aria-pressed', 'true');
    await waitFor(() => expect(getComputedStyle(active).backgroundColor).toBe(probe('bg-accent', 'backgroundColor')));
    await expect(box(active)[1]).toBe(32);
    await expect(canvas.getAllByRole('button', { pressed: true })).toHaveLength(1);
    await expect(canvas.getByRole('status')).toHaveTextContent('6 Oct - 19 Oct 2026 · 14 days');
    await expect(canvas.getByRole('grid', { name: 'September 2026' })).toBeVisible();
    await expect(canvas.getByRole('grid', { name: 'October 2026' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: /Tuesday 6 October 2026/ })).toHaveAttribute('data-state', 'range-start');
    await expect(canvas.getByRole('button', { name: /Monday 19 October 2026/ })).toHaveAttribute('data-state', 'range-end');
    // Future days are disabled.
    await expect(canvas.getByRole('button', { name: /Tuesday 20 October 2026/ })).toHaveAttribute('aria-disabled', 'true');
    const apply = canvas.getByRole('button', { name: 'Apply' });
    await expect(box(apply)[1]).toBe(32);
    await userEvent.click(apply);
    await expect(args.onApply).toHaveBeenCalledTimes(1);
    const applied = (args.onApply as ReturnType<typeof fn>).mock.calls[0][0];
    await expect([applied.from.getDate(), applied.to.getDate()]).toEqual([6, 19]);
    await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }));
    await expect(args.onCancel).toHaveBeenCalledTimes(1);
  },
};

// Presets set the draft and move the calendars: previous month and the month of the end date.
export const Presets: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Last 7 days' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('13 Oct - 19 Oct 2026 · 7 days');
    await expect(canvas.getByRole('button', { name: 'Last 7 days' })).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByRole('button', { name: 'Last 14 days' })).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(canvas.getByRole('button', { name: 'Today' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('19 Oct 2026 · 1 day');
    await userEvent.click(canvas.getByRole('button', { name: 'Last month' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('1 Sept - 30 Sept 2026 · 30 days');
    await expect(canvas.getByRole('grid', { name: 'August 2026' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'This year' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('1 Jan - 19 Oct 2026 · 292 days');
  },
};

// Picking days by hand marks Custom; Apply stays off until both ends are chosen.
export const CustomRange: Story = {
  args: { defaultValue: {} },
  play: async ({ canvas, args }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent('Pick the first and the last day');
    await expect(canvas.getByRole('button', { name: 'Apply' })).toBeDisabled();
    await expect(canvas.queryAllByRole('button', { pressed: true })).toHaveLength(0);
    await userEvent.click(canvas.getByRole('button', { name: /Monday 5 October 2026/ }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Pick the last day');
    await expect(canvas.getByRole('button', { name: 'Apply' })).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: /Wednesday 7 October 2026/ }));
    await expect(canvas.getByRole('status')).toHaveTextContent('5 Oct - 7 Oct 2026 · 3 days');
    await expect(canvas.getByRole('button', { name: 'Custom' })).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(canvas.getByRole('button', { name: 'Apply' }));
    await expect(args.onApply).toHaveBeenCalledTimes(1);
  },
};

// The presets come before the calendars in the tab order, and the calendars have one tab stop.
export const Keyboard: Story = {
  play: async ({ canvas }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Today' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('status')).toHaveTextContent('19 Oct 2026 · 1 day');
    for (let i = 0; i < 8; i += 1) await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Previous month' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Next month' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: /Monday 19 October 2026/ })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Cancel' })).toHaveFocus();
  },
};

// Show presets off: only the calendars and the footer.
export const WithoutPresets: Story = {
  args: { showPresets: false },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvasElement.querySelector('[data-slot="date-range-presets"]')).toBeNull();
    await expect(canvas.queryByRole('button', { name: 'Last 14 days' })).toBeNull();
    await expect(canvas.getByRole('status')).toHaveTextContent('14 days');
  },
};

// Past days disabled for bookings.
export const BookingRange: Story = {
  args: { disableFuture: false, disablePast: true, defaultValue: { from: new Date(2026, 9, 20), to: new Date(2026, 9, 24) } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: /Sunday 18 October 2026/ })).toHaveAttribute('aria-disabled', 'true');
    await expect(canvas.getByRole('button', { name: /Wednesday 21 October 2026/ })).toHaveAttribute('data-state', 'range-middle');
    await expect(canvas.getByRole('button', { name: /Friday 30 October 2026/ })).not.toHaveAttribute('aria-disabled');
  },
};

// Stress test (Figma "Stress test / Date Range Picker"): in a 368 px column the panel shrinks and the calendars scroll sideways; nothing overflows the page.
export const Column368: Story = { tags: ['!dev'],
  decorators: [Story => <div className="w-[368px]"><Story /></div>],
  play: async ({ canvasElement }) => {
    await expect(box(panel(canvasElement))[0]).toBe(368);
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(document.documentElement.clientWidth);
  },
};

// A long custom preset name is cut with an ellipsis.
export const LongPresetName: Story = { tags: ['!dev'],
  args: {
    presets: [
      { id: 'q', label: 'Previous fiscal quarter of the Acme group including adjustments', range: t => ({ from: new Date(t.getFullYear(), 6, 1), to: new Date(t.getFullYear(), 8, 30) }) },
      { id: 'custom', label: 'Custom' },
    ],
  },
  play: async ({ canvas }) => {
    const preset = canvas.getByRole('button', { name: /Previous fiscal quarter/ });
    await expect(box(preset)[1]).toBe(32);
    await expect(getComputedStyle(preset.firstElementChild!).textOverflow).toBe('ellipsis');
    await expect(box(preset)[0]).toBeLessThanOrEqual(152);
  },
};

export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
