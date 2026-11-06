import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { CurrencyInput, formatAmount, parseAmount } from './currency-input';
import { Field } from './field';

const meta = {
  title: 'Components/Input/Currency Input',
  component: CurrencyInput,
  parameters: {
    docs: { description: { component: 'An amount with its currency (invoice lines, budgets, prices, limits). Currency picker on the left, amount right-aligned and formatted on blur in the locale with the currency decimals; stored in minor units with the ISO code. Changing the currency keeps the amount. One currency for the whole form: pass one code and it shows as a fixed prefix. Figma: Input page / Currency Input. Guides: eggux build-ui/components/input.md, patterns/commerce.md' } },
  },
  args: { defaultValue: 125000, defaultCurrency: 'EUR', onValueChange: fn(), onCurrencyChange: fn() },
  render: args => (
    <Field label="Budget" hint="Approval is needed above EUR 5,000.00." className="w-60">
      <CurrencyInput {...args} />
    </Field>
  ),
} satisfies Meta<typeof CurrencyInput>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => { const r = el.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; };
const frameOf = (input: HTMLElement) => input.closest('[data-slot="input-group"]') as HTMLElement;
const probe = (className: string, prop: 'color' | 'borderTopColor') => {
  const el = document.createElement('span');
  el.className = className;
  (document.querySelector('#storybook-root') ?? document.body).append(el);
  const value = getComputedStyle(el)[prop];
  el.remove();
  return value;
};

// Figma State=default: 240 × 36, "EUR" picker (12 px sides, divider) and "1,250.00" right-aligned.
// Typing accepts the locale separators; blur formats with two decimals; the value is in minor units.
export const Default: Story = {
  play: async ({ canvas, args }) => {
    const amount = canvas.getByRole('textbox', { name: 'Budget' });
    await expect(box(frameOf(amount))).toEqual([240, 36]);
    await expect(amount).toHaveValue('1,250.00');
    await expect(amount).toHaveAttribute('inputmode', 'decimal');
    await expect(getComputedStyle(amount).textAlign).toBe('right');
    await expect(amount).toHaveAccessibleDescription('Approval is needed above EUR 5,000.00.');
    const trigger = canvas.getByRole('button', { name: 'Currency, EUR' });
    await expect(box(trigger)[1]).toBe(34);
    await expect(getComputedStyle(trigger).borderRightColor).toBe(probe('border-input', 'borderTopColor'));
    await userEvent.clear(amount);
    await userEvent.type(amount, '2500.5');
    await expect(args.onValueChange).toHaveBeenLastCalledWith(250050);
    await userEvent.tab();
    await expect(amount).toHaveValue('2,500.50');
    // Focus ring wraps the whole field.
    await userEvent.click(amount);
    await expect(getComputedStyle(frameOf(amount)).borderTopColor).toBe(probe('border-ring', 'borderTopColor'));
  },
};

// Picking a currency: the list opens from the trigger, arrows move, Enter picks; the amount stays.
export const ChangeCurrency: Story = {
  play: async ({ canvas, args }) => {
    const amount = canvas.getByRole('textbox', { name: 'Budget' });
    const trigger = canvas.getByRole('button', { name: 'Currency, EUR' });
    await userEvent.click(trigger);
    const body = within(document.body);
    const menu = await body.findByRole('menu');
    await expect(within(menu).getByRole('menuitemradio', { name: /EUR/ })).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(within(menu).getByRole('menuitemradio', { name: /USD/ }));
    await expect(args.onCurrencyChange).toHaveBeenCalledWith('USD');
    await expect(canvas.getByRole('button', { name: 'Currency, USD' })).toHaveFocus();
    await expect(amount).toHaveValue('1,250.00');
    // Keyboard: Enter opens, arrows move, Enter picks, Escape closes and returns focus.
    await userEvent.keyboard('{Enter}');
    await body.findByRole('menu');
    await userEvent.keyboard('{Escape}');
    await expect(body.queryByRole('menu')).toBeNull();
    await expect(canvas.getByRole('button', { name: 'Currency, USD' })).toHaveFocus();
    // JPY has no decimals: the same amount shows without them.
    await userEvent.click(canvas.getByRole('button', { name: 'Currency, USD' }));
    await userEvent.click(await body.findByRole('menuitemradio', { name: /JPY/ }));
    await expect(amount).toHaveValue('125,000');
  },
};

// Locale: de-DE formats 1.250,00 and accepts its own separators.
export const Locale: Story = {
  args: { locale: 'de-DE' },
  play: async ({ canvas, args }) => {
    const amount = canvas.getByRole('textbox', { name: 'Budget' });
    await expect(amount).toHaveValue('1.250,00');
    await userEvent.clear(amount);
    await userEvent.type(amount, '3.400,75');
    await expect(args.onValueChange).toHaveBeenLastCalledWith(340075);
    await userEvent.tab();
    await expect(amount).toHaveValue('3.400,75');
    await expect(formatAmount(99, 'EUR', 'en-GB')).toBe('0.99');
    await expect(parseAmount('', 'EUR')).toBeUndefined();
  },
};

// One currency for the whole form: no picker, the code is a fixed prefix (Input Addon).
export const FixedCurrency: Story = {
  args: { currencies: ['EUR'] },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button')).toBeNull();
    const amount = canvas.getByRole('textbox', { name: 'Budget' });
    await expect(amount).toHaveAccessibleDescription(/EUR/);
    await expect(canvas.getByText('EUR')).toHaveAttribute('data-slot', 'input-addon');
  },
};

// Figma State=error: destructive border, the error names the limit.
export const Invalid: Story = {
  args: { defaultValue: 1250000 },
  render: args => (
    <Field label="Budget" error="Enter an amount up to EUR 10,000.00" className="w-60">
      <CurrencyInput {...args} />
    </Field>
  ),
  play: async ({ canvas }) => {
    const amount = canvas.getByRole('textbox', { name: 'Budget' });
    await expect(amount).toHaveAttribute('aria-invalid', 'true');
    await expect(amount).toHaveAccessibleDescription('Enter an amount up to EUR 10,000.00');
    await expect(getComputedStyle(frameOf(amount)).borderTopColor).toBe(probe('border-destructive', 'borderTopColor'));
  },
};

// Figma State=disabled: faded, the amount and the currency trigger are both disabled.
export const Disabled: Story = {
  render: args => (
    <Field label="Budget" disabled className="w-60">
      <CurrencyInput {...args} />
    </Field>
  ),
  play: async ({ canvas }) => {
    const amount = canvas.getByRole('textbox', { name: 'Budget' });
    await expect(amount).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Currency, EUR' })).toBeDisabled();
    await expect(getComputedStyle(frameOf(amount)).opacity).toBe('0.5');
  },
};

// Stress test (Figma "Stress test / Currency Input"): a long code caps at 96 and truncates, a long
// amount truncates, the 160 minimum, a short value.
export const Stress: Story = {
  tags: ['!dev'],
  render: () => (
    <div className="flex flex-col gap-4">
      <div data-case="long" className="w-60"><CurrencyInput aria-label="Long" defaultCurrency="EXTRALONGCODE" currencies={['EXTRALONGCODE', 'EUR']} defaultValue={123456789012345} /></div>
      <div data-case="min" className="w-30"><CurrencyInput aria-label="Min width" defaultValue={123456789} /></div>
      <div data-case="short" className="w-60"><CurrencyInput aria-label="Short" defaultValue={0} /></div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const long = canvasElement.querySelector('[data-case="long"]')!;
    const trigger = long.querySelector('button')!;
    await expect(trigger.getBoundingClientRect().width).toBeLessThanOrEqual(96);
    const code = trigger.querySelector('span')!;
    await expect(code.scrollWidth).toBeGreaterThan(code.clientWidth);
    const amount = long.querySelector('input')!;
    await expect(box(frameOf(amount))[1]).toBe(36);
    await expect(amount.scrollWidth).toBeGreaterThan(amount.clientWidth);
    // Min width 160, even in a narrower column.
    const min = canvasElement.querySelector('[data-case="min"] [data-slot="input-group"]')!;
    await expect(box(min)[0]).toBe(160);
    await expect(canvasElement.querySelector<HTMLInputElement>('[data-case="short"] input')!.value).toBe('0.00');
  },
};

export const Dark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const CorporateLight: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
