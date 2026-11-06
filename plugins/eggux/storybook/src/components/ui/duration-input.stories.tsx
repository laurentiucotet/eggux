import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { DurationInput } from './duration-input';
import { Field } from './field';

const meta = {
  title: 'Components/Input/Duration Input',
  component: DurationInput,
  parameters: {
    docs: { description: { component: 'A length of time in hours and minutes (time entries, SLAs, reminders), stored as minutes. Accepts "1:30", "1.5h" and "90" (minutes) and normalizes when focus leaves the field; minutes above 59 roll into hours; arrows step by 1. Errors name the limit ("Up to 24 h per entry"). Figma: Input page / Duration Input. Guide: eggux build-ui/components/input.md' } },
  },
  args: { label: 'Time spent', defaultValue: 90, onValueChange: fn() },
} satisfies Meta<typeof DurationInput>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => {
  const r = el.getBoundingClientRect();
  return [Math.round(r.width), Math.round(r.height)];
};
const probe = (className: string, prop: 'color' | 'borderTopColor') => {
  const el = document.createElement('span');
  el.className = className;
  (document.querySelector('#storybook-root') ?? document.body).append(el);
  const value = getComputedStyle(el)[prop];
  el.remove();
  return value;
};

// Figma State=default: 200 x 36, "1 h  30 min", values in foreground and units muted.
export const Default: Story = {
  play: async ({ canvas, args }) => {
    const group = canvas.getByRole('group', { name: 'Time spent' });
    await expect(box(group)).toEqual([200, 36]);
    const hours = canvas.getByRole('textbox', { name: 'Hours' });
    const minutes = canvas.getByRole('textbox', { name: 'Minutes' });
    await expect(hours).toHaveValue('1');
    await expect(minutes).toHaveValue('30');
    await expect(hours).toHaveAttribute('inputmode', 'numeric');
    const unit = group.querySelector('[data-slot="duration-input-unit"]')!;
    await expect(getComputedStyle(unit).color).toBe(probe('text-muted-foreground', 'color'));
    await expect(getComputedStyle(hours).color).toBe(probe('text-foreground', 'color'));
    // Minutes above 59 roll into hours when focus leaves the field, and the value is read back.
    await userEvent.clear(minutes);
    await userEvent.type(minutes, '75');
    await userEvent.tab();
    await expect(hours).toHaveValue('2');
    await expect(minutes).toHaveValue('15');
    await expect(args.onValueChange).toHaveBeenLastCalledWith(135);
    await expect(canvas.getByRole('status')).toHaveTextContent('2 hours 15 minutes');
  },
};

// The accepted formats: "1:30" and "1.5h" in the hours, "90" in the minutes, all 90 minutes.
export const Formats: Story = {
  args: { defaultValue: null },
  play: async ({ canvas, args }) => {
    const hours = canvas.getByRole('textbox', { name: 'Hours' });
    const minutes = canvas.getByRole('textbox', { name: 'Minutes' });
    for (const [h, m] of [['1:30', ''], ['1.5h', ''], ['', '90']]) {
      await userEvent.clear(hours);
      await userEvent.clear(minutes);
      if (h) await userEvent.type(hours, h);
      if (m) await userEvent.type(minutes, m);
      await userEvent.click(document.body);
      await expect(args.onValueChange).toHaveBeenLastCalledWith(90);
      await expect(hours).toHaveValue('1');
      await expect(minutes).toHaveValue('30');
    }
    // Text that is not a duration keeps the field open with a message.
    await userEvent.clear(minutes);
    await userEvent.clear(hours);
    await userEvent.type(hours, 'soon');
    await userEvent.click(document.body);
    await expect(hours).toHaveAttribute('aria-invalid', 'true');
    await expect(hours).toHaveAccessibleDescription('Enter a duration like 1:30, 90 or 1.5h');
  },
};

// Figma State=focus: the field takes the ring. Keyboard: Tab reaches hours then minutes, arrows step by 1.
export const Keyboard: Story = {
  play: async ({ canvas, args }) => {
    const group = canvas.getByRole('group', { name: 'Time spent' });
    await userEvent.tab();
    const hours = canvas.getByRole('textbox', { name: 'Hours' });
    await expect(hours).toHaveFocus();
    await expect(getComputedStyle(group).borderTopColor).toBe(probe('border-ring', 'borderTopColor'));
    await expect(getComputedStyle(group).boxShadow).not.toBe('none');
    await userEvent.keyboard('{ArrowUp}');
    await expect(hours).toHaveValue('2');
    await expect(args.onValueChange).toHaveBeenLastCalledWith(150);
    await userEvent.tab();
    const minutes = canvas.getByRole('textbox', { name: 'Minutes' });
    await expect(minutes).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(minutes).toHaveValue('29');
    // Stepping below 0 minutes borrows from the hours.
    await userEvent.clear(minutes);
    await userEvent.type(minutes, '0');
    await userEvent.keyboard('{ArrowDown}');
    await expect(hours).toHaveValue('1');
    await expect(minutes).toHaveValue('59');
  },
};

// Figma State=error: above the limit the border turns red and the limit is named under the field.
export const OverLimit: Story = {
  args: { defaultValue: 25 * 60, max: 24 * 60 },
  play: async ({ canvas }) => {
    const group = canvas.getByRole('group', { name: 'Time spent' });
    await expect(getComputedStyle(group).borderTopColor).toBe(probe('border-destructive', 'borderTopColor'));
    const hours = canvas.getByRole('textbox', { name: 'Hours' });
    await expect(hours).toHaveAttribute('aria-invalid', 'true');
    await expect(hours).toHaveAccessibleDescription('Up to 24 h per entry');
    await userEvent.clear(hours);
    await userEvent.type(hours, '8');
    await userEvent.tab();
    await userEvent.tab();
    await waitFor(() => expect(canvas.queryByText('Up to 24 h per entry')).toBeNull());
  },
};

// Inside a Field: the label names the group and focuses the hours; the hint describes both inputs.
export const InField: Story = {
  args: { label: undefined },
  render: args => (
    <div className="w-80">
      <Field label="Time spent" hint="Round to the nearest 15 minutes">
        <DurationInput {...args} />
      </Field>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('group', { name: 'Time spent' })).toBeVisible();
    const hours = canvas.getByRole('textbox', { name: 'Hours' });
    await expect(hours).toHaveAccessibleDescription('Round to the nearest 15 minutes');
    await expect(canvas.getByRole('textbox', { name: 'Minutes' })).toHaveAccessibleDescription('Round to the nearest 15 minutes');
    await userEvent.click(canvas.getByText('Time spent'));
    await expect(hours).toHaveFocus();
  },
};

// Stress test (Figma "Stress test / Duration Input"): min width 160, long values and units
// truncate, short values, the 276 column.
export const Stress: Story = {
  tags: ['!dev'],
  render: () => (
    <div className="flex flex-col gap-6">
      <div data-case="min"><DurationInput label="Min width" className="w-24" defaultValue={90} /></div>
      <div data-case="long"><DurationInput label="Long" defaultValue={123456789} labels={{ hourUnit: 'hours', minuteUnit: 'minutes' }} /></div>
      <div data-case="short"><DurationInput label="Short" defaultValue={0} /></div>
      <div data-case="column" className="w-[276px]"><DurationInput label="Column" className="w-full" defaultValue={45} /></div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const get = (c: string) => canvasElement.querySelector(`[data-case="${c}"] [role="group"]`) as HTMLElement;
    await expect(box(get('min'))).toEqual([160, 36]);
    await expect(box(get('column'))).toEqual([276, 36]);
    for (const c of ['min', 'long', 'short', 'column']) await expect(get(c).scrollWidth).toBeLessThanOrEqual(get(c).clientWidth);
    // Values hug up to 24 and units up to 28, both end with an ellipsis.
    const [hours] = get('long').querySelectorAll('input');
    await expect(hours.getBoundingClientRect().width).toBeLessThanOrEqual(24);
    await expect(getComputedStyle(hours).textOverflow).toBe('ellipsis');
    for (const unit of get('long').querySelectorAll('[data-slot="duration-input-unit"]')) {
      await expect(unit.getBoundingClientRect().width).toBeLessThanOrEqual(28);
      await expect(unit.scrollWidth).toBeGreaterThan(unit.clientWidth);
    }
    await expect(get('short').querySelectorAll('input')[1]).toHaveValue('0');
  },
};

export const OverLimitDark: Story = { ...OverLimit, tags: ['!dev'], globals: { theme: 'Dark' }, play: undefined };
export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
