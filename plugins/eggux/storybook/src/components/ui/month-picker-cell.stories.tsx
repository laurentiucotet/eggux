import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { MonthPickerCell, type MonthPickerCellState } from './month-picker-cell';

const meta = {
  title: 'Components/Calendar/Month Picker Cell',
  component: MonthPickerCell,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'One month, quarter or year in Month Picker, 72 x 40; it fills its column in the grid. current = accent, selected = primary, disabled = periods outside the data. Same tokens as Calendar Day. Figma: Calendar page / Month Picker Cell. Guide: eggux build-ui/components/date-picker.md' } },
  },
  args: { label: 'Oct', state: 'default' },
  decorators: [Story => <div className="w-[72px]"><Story /></div>],
} satisfies Meta<typeof MonthPickerCell>;
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
const css = (el: Element) => getComputedStyle(el);
const states: MonthPickerCellState[] = ['default', 'hover', 'focus', 'current', 'selected', 'disabled'];

// Figma State=default: 72 x 40, label in foreground.
export const Default: Story = {
  args: { onClick: fn() },
  play: async ({ canvas, args }) => {
    const cell = canvas.getByRole('button', { name: 'Oct' });
    await expect(box(cell)).toEqual([72, 40]);
    await expect(css(cell.firstElementChild!).color).toBe(probe('text-foreground', 'color'));
    await userEvent.click(cell);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await expect(args.onClick).toHaveBeenCalledTimes(3);
  },
};

const fills: Record<MonthPickerCellState, [string, string, string]> = {
  default: ['rgba(0, 0, 0, 0)', 'text-foreground', '400'],
  hover: ['bg-accent', 'text-accent-foreground', '400'],
  focus: ['rgba(0, 0, 0, 0)', 'text-foreground', '400'],
  current: ['bg-accent', 'text-accent-foreground', '500'],
  selected: ['bg-primary', 'text-primary-foreground', '500'],
  disabled: ['rgba(0, 0, 0, 0)', 'text-muted-foreground', '400'],
};
export const States: Story = {
  parameters: { controls: { disable: true } },
  decorators: [],
  render: () => (
    <div className="flex flex-wrap gap-4">
      {states.map(s => <div key={s} className="w-[72px]"><MonthPickerCell state={s} label="Oct" aria-label={`Oct ${s}`} /></div>)}
    </div>
  ),
  play: async ({ canvas }) => {
    for (const s of states) {
      const cell = canvas.getByRole('button', { name: `Oct ${s}` });
      const [bg, color, weight] = fills[s];
      await expect(box(cell)).toEqual([72, 40]);
      await expect(css(cell).backgroundColor).toBe(bg.startsWith('bg-') ? probe(bg, 'backgroundColor') : bg);
      await expect(css(cell.firstElementChild!).color).toBe(probe(color, 'color'));
      await expect(css(cell).fontWeight).toBe(weight);
    }
    await expect(css(canvas.getByRole('button', { name: 'Oct disabled' })).opacity).toBe('0.5');
    await expect(canvas.getByRole('button', { name: 'Oct disabled' })).toHaveAttribute('aria-disabled', 'true');
    await expect(canvas.getByRole('button', { name: 'Oct current' })).toHaveAttribute('aria-current', 'date');
    await expect(css(canvas.getByRole('button', { name: 'Oct focus' })).boxShadow).not.toBe('none');
  },
};

// Stress test: a long label is cut with an ellipsis and does not grow the cell.
export const LongLabel: Story = { tags: ['!dev'],
  args: { label: 'September 2026 and later', 'aria-label': 'September 2026 and later' },
  play: async ({ canvas }) => {
    const cell = canvas.getByRole('button');
    await expect(box(cell)).toEqual([72, 40]);
    await expect(css(cell.firstElementChild!).textOverflow).toBe('ellipsis');
  },
};

export const StatesDark: Story = { ...States, tags: ['!dev'], globals: { theme: 'Dark' } };
export const StatesCorporate: Story = { ...States, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
