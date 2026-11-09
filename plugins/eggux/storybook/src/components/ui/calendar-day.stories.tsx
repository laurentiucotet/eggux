import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { CalendarDay, type CalendarDayState } from './calendar-day';

const meta = {
  title: 'Components/Calendar/Calendar Day',
  component: CalendarDay,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'One day cell of the Calendar, 32 x 32 (36 with a note). today = accent, selected and range ends = primary, range-middle = accent without radius, outside = adjacent months (muted, pickable), disabled = faded, booked = muted with a strike line (not pickable). A dot or a note, not both. Figma: Calendar page / Calendar Day. Guide: eggux build-ui/components/date-picker.md' } },
  },
  args: { day: '19', state: 'default' },
} satisfies Meta<typeof CalendarDay>;
export default meta;
type Story = StoryObj<typeof meta>;

const size = (el: HTMLElement) => {
  const r = el.getBoundingClientRect();
  return [Math.round(r.width), Math.round(r.height)];
};
// Computed value of a property for a token class, read from a probe element.
const probe = (className: string, prop: 'color' | 'backgroundColor') => {
  const el = document.createElement('span');
  el.className = className;
  (document.querySelector('#storybook-root') ?? document.body).append(el);
  const value = getComputedStyle(el)[prop];
  el.remove();
  return value;
};
const css = (el: Element) => getComputedStyle(el);

const all: CalendarDayState[] = ['default', 'hover', 'focus', 'today', 'selected', 'outside', 'disabled', 'range-start', 'range-middle', 'range-end', 'booked'];

// Figma State=default: 32 x 32, number in foreground, regular weight.
export const Default: Story = {
  args: { onClick: fn() },
  play: async ({ canvas, args }) => {
    const day = canvas.getByRole('button', { name: '19' });
    await expect(size(day)).toEqual([32, 32]);
    await expect(css(day).borderTopLeftRadius).not.toBe('0px');
    await expect(css(day.querySelector('[data-slot="calendar-day-number"]')!).color).toBe(probe('text-foreground', 'color'));
    await userEvent.click(day);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    await expect(day).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalledTimes(2);
    await userEvent.keyboard(' ');
    await expect(args.onClick).toHaveBeenCalledTimes(3);
  },
};

// All 11 Figma states, each with its fill, number color and weight.
const expectations: Record<CalendarDayState, { bg: string; color: string; weight: string; radius?: [string, string] }> = {
  default: { bg: 'rgba(0, 0, 0, 0)', color: 'text-foreground', weight: '400' },
  hover: { bg: 'bg-accent', color: 'text-accent-foreground', weight: '400' },
  focus: { bg: 'bg-background', color: 'text-foreground', weight: '400' },
  today: { bg: 'bg-accent', color: 'text-accent-foreground', weight: '500' },
  selected: { bg: 'bg-primary', color: 'text-primary-foreground', weight: '500' },
  outside: { bg: 'rgba(0, 0, 0, 0)', color: 'text-muted-foreground', weight: '400' },
  disabled: { bg: 'rgba(0, 0, 0, 0)', color: 'text-muted-foreground', weight: '400' },
  'range-start': { bg: 'bg-primary', color: 'text-primary-foreground', weight: '500', radius: ['rounded-l-md', 'rounded-none'] },
  'range-middle': { bg: 'bg-accent', color: 'text-accent-foreground', weight: '400', radius: ['rounded-none', 'rounded-none'] },
  'range-end': { bg: 'bg-primary', color: 'text-primary-foreground', weight: '500', radius: ['rounded-none', 'rounded-r-md'] },
  booked: { bg: 'rgba(0, 0, 0, 0)', color: 'text-muted-foreground', weight: '400' },
};
export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      {all.map(state => <CalendarDay key={state} state={state} day="19" aria-label={`19 ${state}`} />)}
    </div>
  ),
  play: async ({ canvas }) => {
    for (const state of all) {
      const day = canvas.getByRole('button', { name: `19 ${state}` });
      const e = expectations[state];
      await expect(size(day)).toEqual([32, 32]);
      await expect(css(day).backgroundColor).toBe(e.bg.startsWith('bg-') ? probe(e.bg, 'backgroundColor') : e.bg);
      const number = day.querySelector('[data-slot="calendar-day-number"]')!;
      await expect(css(number).color).toBe(probe(e.color, 'color'));
      await expect(css(number).fontWeight).toBe(e.weight);
      if (state === 'disabled') await expect(css(day).opacity).toBe('0.5');
    }
    // Range ends round only the outer side; the middle has no radius.
    await expect(css(canvas.getByRole('button', { name: '19 range-start' })).borderTopRightRadius).toBe('0px');
    await expect(css(canvas.getByRole('button', { name: '19 range-start' })).borderTopLeftRadius).not.toBe('0px');
    await expect(css(canvas.getByRole('button', { name: '19 range-end' })).borderTopLeftRadius).toBe('0px');
    await expect(css(canvas.getByRole('button', { name: '19 range-end' })).borderTopRightRadius).not.toBe('0px');
    await expect(css(canvas.getByRole('button', { name: '19 range-middle' })).borderTopLeftRadius).toBe('0px');
    // Today is not color alone.
    await expect(canvas.getByRole('button', { name: '19 today' })).toHaveAttribute('aria-current', 'date');
    // Disabled and booked cannot be picked: announced as disabled.
    await expect(canvas.getByRole('button', { name: '19 disabled' })).toHaveAttribute('aria-disabled', 'true');
    await expect(canvas.getByRole('button', { name: '19 booked' })).toHaveAttribute('aria-disabled', 'true');
    await expect(canvas.getByRole('button', { name: '19 default' })).not.toHaveAttribute('aria-disabled');
  },
};

// State=booked: a 1 px strike line across the number, muted.
export const Booked: Story = {
  args: { state: 'booked', day: '24', 'aria-label': '24 October, booked' },
  play: async ({ canvas }) => {
    const day = canvas.getByRole('button', { name: '24 October, booked' });
    const strike = day.querySelector('[data-slot="calendar-day-strike"]') as HTMLElement;
    await expect(Math.round(strike.getBoundingClientRect().height)).toBe(1);
    await expect(css(strike).backgroundColor).toBe(probe('bg-muted-foreground', 'backgroundColor'));
    // The strike is wider than the number by 1 px on each side.
    const number = day.querySelector('[data-slot="calendar-day-number"]') as HTMLElement;
    await expect(Math.round(strike.getBoundingClientRect().width - number.getBoundingClientRect().width)).toBe(2);
  },
};

// Show note: a line under the number, the cell grows to 36; a note is 12 px text.
export const WithNote: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-start gap-4">
      <CalendarDay day="21" showNote note="€89" aria-label="21 €89" />
      <CalendarDay state="selected" day="22" showNote note="€89" aria-label="22 €89 selected" />
      <CalendarDay state="booked" day="24" showNote note="Full" aria-label="24 Full booked" />
      <CalendarDay state="today" day="19" showNote note="3 left" aria-label="19 3 left today" />
    </div>
  ),
  play: async ({ canvas }) => {
    const day = canvas.getByRole('button', { name: '21 €89' });
    await expect(size(day)).toEqual([32, 36]);
    const note = day.querySelector('[data-slot="calendar-day-note"]') as HTMLElement;
    await expect(note).toHaveTextContent('€89');
    await expect(css(note).fontSize).toBe('12px');
    await expect(css(note).color).toBe(probe('text-muted-foreground', 'color'));
    await expect(css(canvas.getByRole('button', { name: '22 €89 selected' }).querySelector('[data-slot="calendar-day-note"]')!).color).toBe(probe('text-primary-foreground', 'color'));
    await expect(size(canvas.getByRole('button', { name: '24 Full booked' }))[1]).toBe(36);
  },
};

// Show dot: 4 px circle 3 px from the bottom; white on a selected day. The note wins when both are set.
export const WithDot: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-start gap-4">
      <CalendarDay day="21" showDot aria-label="21 default" />
      <CalendarDay state="selected" day="22" showDot aria-label="22 selected" />
      <CalendarDay day="23" showDot showNote note="€9" aria-label="23 €9 both" />
    </div>
  ),
  play: async ({ canvas }) => {
    const day = canvas.getByRole('button', { name: '21 default' });
    const dot = day.querySelector('[data-slot="calendar-day-dot"]') as HTMLElement;
    await expect(size(dot)).toEqual([4, 4]);
    await expect(Math.round(day.getBoundingClientRect().bottom - dot.getBoundingClientRect().bottom)).toBe(3);
    await expect(css(dot).backgroundColor).toBe(probe('bg-primary', 'backgroundColor'));
    await expect(size(day)).toEqual([32, 32]);
    const selectedDot = canvas.getByRole('button', { name: '22 selected' }).querySelector('[data-slot="calendar-day-dot"]')!;
    await expect(css(selectedDot).backgroundColor).toBe(probe('bg-primary-foreground', 'backgroundColor'));
    // Dot or note, not both.
    const both = canvas.getByRole('button', { name: '23 €9 both' });
    await expect(both.querySelector('[data-slot="calendar-day-dot"]')).toBeNull();
    await expect(both.querySelector('[data-slot="calendar-day-note"]')).not.toBeNull();
  },
};

// Keyboard focus shows the ring (Figma State=focus).
export const FocusRing: Story = {
  args: { day: '12', 'aria-label': '12 October' },
  play: async ({ canvas }) => {
    await userEvent.tab();
    const day = canvas.getByRole('button', { name: '12 October' });
    await expect(day).toHaveFocus();
    await expect(css(day).boxShadow).not.toBe('none');
  },
};

// Stress test (Figma "Stress test / Calendar"): a three digit number and a 6 character note do not grow the 32 px column.
export const LongContent: Story = { tags: ['!dev'],
  args: { day: '31', showNote: true, note: '3 left', 'aria-label': '31 3 left' },
  play: async ({ canvas }) => {
    const day = canvas.getByRole('button', { name: '31 3 left' });
    await expect(size(day)[0]).toBeGreaterThanOrEqual(32);
    await expect(size(day)[1]).toBe(36);
  },
};

export const StatesDark: Story = { ...States, tags: ['!dev'], globals: { theme: 'Dark' } };
export const StatesCorporate: Story = { ...States, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
