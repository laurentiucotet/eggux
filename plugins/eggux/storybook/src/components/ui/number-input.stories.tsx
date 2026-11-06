import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, fn, userEvent, waitFor } from 'storybook/test';
import { Field } from './field';
import { NumberInput } from './number-input';

const meta = {
  title: 'Components/Input/Number Input',
  component: NumberInput,
  parameters: {
    docs: { description: { component: 'A small integer with − / + steppers (seats, guests, items). Typing stays possible; Arrow Up / Down step; min and max disable the matching button; long press repeats. Size=sm for cart lines and dense rows. Money, decimals and large numbers: Input Group with a unit. Figma: Input page / Number Input. Guide: eggux build-ui/components/input.md, patterns/commerce.md' } },
  },
  args: { defaultValue: 2, min: 1, max: 10, decrementLabel: 'Decrease seats', incrementLabel: 'Increase seats', onValueChange: fn() },
  render: args => (
    <Field label="Seats" hint="Up to 10 seats on the Team plan." className="w-60">
      <NumberInput {...args} />
    </Field>
  ),
} satisfies Meta<typeof NumberInput>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => { const r = el.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; };

// Figma Size=default: 140 × 36, 36 px step cells, value centred. + and − change the value by one;
// focus stays where it was (the buttons are not in the Tab order).
export const Default: Story = {
  play: async ({ canvas, canvasElement, args }) => {
    const input = canvas.getByRole('spinbutton', { name: 'Seats' });
    await expect(box(canvasElement.querySelector('[data-slot="number-input"]')!)).toEqual([140, 36]);
    await expect(box(canvas.getByRole('button', { name: 'Decrease seats' }))).toEqual([36, 34]);
    await expect(input).toHaveValue('2');
    await expect(input).toHaveAttribute('aria-valuenow', '2');
    await expect(input).toHaveAttribute('aria-valuemin', '1');
    await expect(input).toHaveAttribute('aria-valuemax', '10');
    await userEvent.click(canvas.getByRole('button', { name: 'Increase seats' }));
    await expect(input).toHaveValue('3');
    await expect(args.onValueChange).toHaveBeenLastCalledWith(3);
    await userEvent.click(canvas.getByRole('button', { name: 'Decrease seats' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Decrease seats' }));
    await expect(input).toHaveAttribute('aria-valuenow', '1');
    await expect(document.activeElement).not.toBe(canvas.getByRole('button', { name: 'Decrease seats' }));
  },
};

// Keyboard: Tab reaches the input; Arrow Up / Down step; Home / End jump to min / max; typing is
// committed with Enter or on blur, clamped to the range; a non-number reverts.
export const Keyboard: Story = {
  play: async ({ canvas, args }) => {
    const input = canvas.getByRole('spinbutton', { name: 'Seats' });
    await userEvent.tab();
    await expect(input).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}{ArrowUp}');
    await expect(input).toHaveValue('4');
    await userEvent.keyboard('{ArrowDown}');
    await expect(input).toHaveValue('3');
    await userEvent.keyboard('{End}');
    await expect(input).toHaveValue('10');
    await userEvent.keyboard('{Home}');
    await expect(input).toHaveValue('1');
    await userEvent.clear(input);
    await userEvent.type(input, '7{Enter}');
    await expect(input).toHaveAttribute('aria-valuenow', '7');
    await expect(args.onValueChange).toHaveBeenLastCalledWith(7);
    await userEvent.clear(input);
    await userEvent.type(input, '25');
    await userEvent.tab();
    await expect(input).toHaveValue('10');
    await userEvent.clear(input);
    await userEvent.tab({ shift: true });
    await userEvent.tab();
    await expect(input).toHaveValue('10');
  },
};

// Figma: at the minimum or maximum the matching icon is foreground/muted and the click is blocked.
export const Limits: Story = {
  render: args => (
    <div className="flex flex-col gap-4">
      <Field label="Guests"><NumberInput {...args} defaultValue={1} min={1} max={4} decrementLabel="Decrease guests" incrementLabel="Increase guests" /></Field>
      <Field label="Items" hint="Only 3 left."><NumberInput {...args} defaultValue={3} min={0} max={3} decrementLabel="Decrease items" incrementLabel="Increase items" /></Field>
    </div>
  ),
  play: async ({ canvas }) => {
    const minus = canvas.getByRole('button', { name: 'Decrease guests' });
    await expect(minus).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Increase guests' })).toBeEnabled();
    await expect(canvas.getByRole('button', { name: 'Increase items' })).toBeDisabled();
    const probe = document.createElement('span'); probe.className = 'text-muted-foreground'; document.body.append(probe);
    await expect(getComputedStyle(minus).color).toBe(getComputedStyle(probe).color);
    probe.remove();
    await expect(canvas.getByRole('spinbutton', { name: 'Guests' })).toHaveValue('1');
  },
};

// Long press repeats the step until release (and stops at the maximum).
export const LongPress: Story = {
  tags: ['!dev'],
  play: async ({ canvas }) => {
    const input = canvas.getByRole('spinbutton', { name: 'Seats' });
    const plus = canvas.getByRole('button', { name: 'Increase seats' });
    fireEvent.pointerDown(plus, { button: 0 });
    await waitFor(() => expect(Number((input as HTMLInputElement).value)).toBeGreaterThanOrEqual(5), { timeout: 2000 });
    fireEvent.pointerUp(plus);
    fireEvent.click(plus);
    const after = (input as HTMLInputElement).value;
    await new Promise(r => setTimeout(r, 300));
    await expect(input).toHaveValue(after);
  },
};

// Figma Size: default 140 × 36 and sm 116 × 32 (32 px step cells).
export const Sizes: Story = {
  render: args => (
    <div className="flex flex-col gap-4">
      <Field label="Default"><NumberInput {...args} /></Field>
      <Field label="Small"><NumberInput {...args} size="sm" /></Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const boxes = Array.from(canvasElement.querySelectorAll('[data-slot="number-input"]')).map(box);
    await expect(boxes).toEqual([[140, 36], [116, 32]]);
    const sm = canvasElement.querySelectorAll('[data-slot="number-input-decrement"]')[1];
    await expect(box(sm)).toEqual([32, 30]);
  },
};

// Figma State=error and State=disabled.
export const States: Story = {
  render: args => (
    <div className="flex flex-col gap-4">
      <Field label="Seats" error="Your plan has 10 seats. Upgrade to add more."><NumberInput {...args} defaultValue={10} /></Field>
      <Field label="Retries" disabled><NumberInput {...args} decrementLabel="Decrease retries" incrementLabel="Increase retries" /></Field>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const seats = canvas.getByRole('spinbutton', { name: 'Seats' });
    await expect(seats).toHaveAttribute('aria-invalid', 'true');
    await expect(seats).toHaveAccessibleDescription('Your plan has 10 seats. Upgrade to add more.');
    const red = document.createElement('span'); red.className = 'border border-destructive'; document.body.append(red);
    await expect(getComputedStyle(canvasElement.querySelector('[data-slot="number-input"]')!).borderTopColor).toBe(getComputedStyle(red).borderTopColor);
    red.remove();
    await expect(canvas.getByRole('spinbutton', { name: 'Retries' })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Increase retries' })).toBeDisabled();
  },
};

// Controlled: the cart owns the quantity.
function CartLine() {
  const [qty, setQty] = React.useState(2);
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="min-w-0 flex-1 truncate">Acme desk lamp</span>
      <NumberInput size="sm" aria-label="Quantity" value={qty} onValueChange={setQty} min={1} max={5} decrementLabel="Decrease quantity" incrementLabel="Increase quantity" />
      <span className="w-20 text-right tabular-nums">EUR {(qty * 49).toFixed(2)}</span>
    </div>
  );
}
export const Controlled: Story = {
  render: () => <div className="w-96"><CartLine /></div>,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Increase quantity' }));
    await expect(canvas.getByText('EUR 147.00')).toBeInTheDocument();
  },
};

// Stress test: large values in the narrow default width stay on one line, centred, and keep the
// step cells; the 276 column does not stretch it.
export const Stress: Story = {
  tags: ['!dev'],
  render: args => (
    <div className="flex w-[276px] flex-col gap-3">
      <Field label="Big"><NumberInput {...args} min={0} max={999999} defaultValue={999999} /></Field>
      <Field label="Negative"><NumberInput {...args} min={-50} max={50} defaultValue={-50} size="sm" /></Field>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const big = canvas.getByRole('spinbutton', { name: 'Big' });
    await expect(big).toHaveValue('999999');
    await expect(Math.round(big.getBoundingClientRect().height)).toBe(34);
    await expect(box(canvasElement.querySelector('[data-slot="number-input"]')!)).toEqual([140, 36]);
    await expect(canvas.getByRole('spinbutton', { name: 'Negative' })).toHaveValue('-50');
  },
};

export const Dark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const CorporateLight: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
