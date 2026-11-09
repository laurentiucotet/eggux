import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { Field } from './field';
import { RangeInput } from './range-input';

const meta = {
  title: 'Components/Input/Range Input',
  component: RangeInput,
  parameters: {
    docs: { description: { component: 'Two fields for a minimum and a maximum (price or amount filters, quantities). Either side may stay empty; when the minimum is above the maximum the pair turns red and says so once underneath. Values format on blur; filters apply on blur or Enter (onCommit). Figma: Input page / Range Input. Guides: eggux build-ui/components/input.md, patterns/search-and-filter.md' } },
  },
  args: { label: 'Price', defaultValue: { min: 100, max: 2500 }, onValueChange: fn(), onCommit: fn() },
} satisfies Meta<typeof RangeInput>;
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
const fieldOf = (input: HTMLElement) => input.parentElement as HTMLElement;

// Figma State=default: 320 x 36, two 148 px fields 8 px apart with a dash, "€ 100" and "€ 2,500".
export const Default: Story = {
  play: async ({ canvas, args }) => {
    const group = canvas.getByRole('group', { name: 'Price' });
    await expect(box(group.parentElement!)).toEqual([320, 36]);
    const min = canvas.getByRole('textbox', { name: 'Minimum price (€)' });
    const max = canvas.getByRole('textbox', { name: 'Maximum price (€)' });
    await expect(min).toHaveValue('100');
    await expect(max).toHaveValue('2,500');
    await expect(box(fieldOf(min))).toEqual(box(fieldOf(max)));
    await expect(box(fieldOf(min))[1]).toBe(36);
    await expect(fieldOf(max).getBoundingClientRect().left - fieldOf(min).getBoundingClientRect().right).toBeGreaterThanOrEqual(16);
    const unit = fieldOf(min).querySelector('[data-slot="range-input-unit"]')!;
    await expect(getComputedStyle(unit).color).toBe(probe('text-muted-foreground', 'color'));
    // Typing changes the value; blur formats it and applies it.
    await userEvent.clear(max);
    await userEvent.type(max, '12000');
    await expect(args.onValueChange).toHaveBeenLastCalledWith({ min: 100, max: 12000 });
    await userEvent.click(min);
    await expect(max).toHaveValue('12,000');
    await expect(args.onCommit).toHaveBeenLastCalledWith({ min: 100, max: 12000 });
    // Clicking the unit puts the caret in its input.
    await userEvent.click(fieldOf(max).querySelector('[data-slot="range-input-unit"]')!);
    await expect(max).toHaveFocus();
  },
};

// Keyboard: Tab moves min -> max, Enter applies the value without leaving the field.
export const Keyboard: Story = {
  args: { defaultValue: {} },
  play: async ({ canvas, args }) => {
    await userEvent.tab();
    const min = canvas.getByRole('textbox', { name: 'Minimum price (€)' });
    await expect(min).toHaveFocus();
    await userEvent.keyboard('250{Enter}');
    await expect(args.onCommit).toHaveBeenLastCalledWith({ min: 250 });
    await expect(min).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('textbox', { name: 'Maximum price (€)' })).toHaveFocus();
  },
};

// Either side may stay empty: "from 100" is a valid filter, the empty side shows its placeholder.
export const OpenEnded: Story = {
  args: { defaultValue: { min: 100 } },
  play: async ({ canvas }) => {
    const max = canvas.getByRole('textbox', { name: 'Maximum price (€)' });
    await expect(max).toHaveValue('');
    await expect(max).toHaveAttribute('placeholder', 'Max');
    await expect(max).not.toHaveAttribute('aria-invalid');
    await expect(canvas.queryByText('Minimum must be lower than the maximum')).toBeNull();
  },
};

// Figma State=error: min above max turns both fields red and says it once under the pair.
export const OrderError: Story = {
  args: { defaultValue: { min: 3000, max: 2500 } },
  play: async ({ canvas }) => {
    const min = canvas.getByRole('textbox', { name: 'Minimum price (€)' });
    const max = canvas.getByRole('textbox', { name: 'Maximum price (€)' });
    for (const input of [min, max]) {
      await expect(input).toHaveAttribute('aria-invalid', 'true');
      await expect(input).toHaveAccessibleDescription('Minimum must be lower than the maximum');
      await expect(getComputedStyle(fieldOf(input)).borderTopColor).toBe(probe('border-destructive', 'borderTopColor'));
    }
    await expect(canvas.getAllByText('Minimum must be lower than the maximum')).toHaveLength(1);
    // Fixing the order removes the error.
    await userEvent.clear(min);
    await userEvent.type(min, '2000');
    await expect(canvas.queryByText('Minimum must be lower than the maximum')).toBeNull();
    await expect(max).not.toHaveAttribute('aria-invalid');
  },
};

// Inside a Field: the label names the pair and focuses the minimum, the hint describes both.
export const InField: Story = {
  args: { label: undefined, minLabel: 'Minimum price', maxLabel: 'Maximum price' },
  render: args => (
    <div className="w-80">
      <Field label="Price" hint="Prices include VAT">
        <RangeInput {...args} />
      </Field>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('group', { name: 'Price' })).toBeVisible();
    const min = canvas.getByRole('textbox', { name: 'Minimum price (€)' });
    const max = canvas.getByRole('textbox', { name: 'Maximum price (€)' });
    await expect(min).toHaveAccessibleDescription('Prices include VAT');
    await expect(max).toHaveAccessibleDescription('Prices include VAT');
    await userEvent.click(canvas.getByText('Price'));
    await expect(min).toHaveFocus();
  },
};

// Disabled through the Field: both inputs are disabled and faded.
export const Disabled: Story = {
  render: args => (
    <div className="w-80">
      <Field label="Price" disabled>
        <RangeInput {...args} label={undefined} />
      </Field>
    </div>
  ),
  play: async ({ canvas }) => {
    const inputs = canvas.getAllByRole('textbox');
    for (const input of inputs) {
      await expect(input).toBeDisabled();
      await expect(getComputedStyle(fieldOf(input)).opacity).toBe('0.5');
    }
  },
};

// Stress test (Figma "Stress test / Range Input"): long units and values truncate, short values,
// the 276 column, a long error.
export const Stress: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => (
    <div className="flex flex-col gap-6">
      <div data-case="long" className="w-80"><RangeInput label="Long" unit="€1,234,567" defaultValue={{ min: 1234567890123, max: 9876543210987 }} /></div>
      <div data-case="short" className="w-80"><RangeInput label="Short" unit="0" defaultValue={{ min: 0, max: 0 }} /></div>
      <div data-case="column" className="w-[276px]"><RangeInput label="Column" className="w-full" defaultValue={{ min: 1234567, max: 1234567 }} /></div>
      <div data-case="error" className="w-[276px]"><RangeInput label="Error" className="w-full" defaultValue={{ min: 9876543210, max: 1 }} /></div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const get = (c: string) => canvasElement.querySelector(`[data-case="${c}"]`) as HTMLElement;
    for (const c of ['long', 'short', 'column', 'error']) {
      const root = get(c);
      // Nothing spills out of the column and each field stays 36 high.
      await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth);
      for (const input of root.querySelectorAll('input')) await expect(box(fieldOf(input))[1]).toBe(36);
    }
    // The unit hugs up to 32 and truncates; the value stays on one line with an ellipsis.
    const unit = get('long').querySelector('[data-slot="range-input-unit"]') as HTMLElement;
    await expect(unit.getBoundingClientRect().width).toBeLessThanOrEqual(32);
    await expect(unit.scrollWidth).toBeGreaterThan(unit.clientWidth);
    const value = get('long').querySelector('input') as HTMLInputElement;
    await expect(getComputedStyle(value).textOverflow).toBe('ellipsis');
    await expect(value.scrollWidth).toBeGreaterThan(value.clientWidth);
    // The two fields share the width in the narrow column.
    const [a, b] = get('column').querySelectorAll('input');
    await expect(box(fieldOf(a))).toEqual(box(fieldOf(b)));
    await expect(get('error').querySelector('[data-slot="range-input-error"]')).toBeVisible();
  },
};

export const OrderErrorDark: Story = { ...OrderError, tags: ['!dev'], globals: { theme: 'Dark' }, play: undefined };
export const OrderErrorCorporate: Story = { ...OrderError, tags: ['!dev'], globals: { theme: 'Corporate Light' }, play: undefined };
export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
