import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Field } from './field';
import { formatNational, parseInternational, PHONE_COUNTRIES, PhoneInput } from './phone-input';

const meta = {
  title: 'Components/Input/Phone Input',
  component: PhoneInput,
  parameters: {
    docs: { description: { component: 'Phone number with a country code picker (searchable by country name, ISO code and dial code). Defaults to the account country, groups the number as people type and returns E.164 (+40712345678). A number pasted with + sets the country. Ask for a phone number only when it is used and say what for in the hint. Figma: Input page / Phone Input. Guide: eggux build-ui/components/input.md' } },
  },
  args: { defaultValue: '+40712345678', defaultCountry: 'RO', onValueChange: fn(), onCountryChange: fn() },
  render: args => (
    <Field label="Mobile number" hint="We send delivery updates to this number." className="w-70">
      <PhoneInput {...args} />
    </Field>
  ),
} satisfies Meta<typeof PhoneInput>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => { const r = el.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; };
const frameOf = (input: HTMLElement) => input.closest('[data-slot="input-group"]') as HTMLElement;
const probe = (className: string) => {
  const el = document.createElement('span');
  el.className = className;
  (document.querySelector('#storybook-root') ?? document.body).append(el);
  const value = getComputedStyle(el).borderTopColor;
  el.remove();
  return value;
};

// Figma State=default: 280 × 36, "RO +40" picker, "712 345 678" 12 px after the divider.
// Typing groups the number for the country and returns E.164; a trunk 0 is dropped.
export const Default: Story = {
  play: async ({ canvas, args }) => {
    const number = canvas.getByRole('textbox', { name: 'Mobile number' });
    await expect(box(frameOf(number))).toEqual([280, 36]);
    await expect(number).toHaveAttribute('type', 'tel');
    await expect(number).toHaveAttribute('autocomplete', 'tel');
    await expect(number).toHaveValue('712 345 678');
    await expect(number).toHaveAccessibleDescription('We send delivery updates to this number.');
    const trigger = canvas.getByRole('button', { name: 'Country code, Romania, RO +40' });
    await expect(trigger).toHaveTextContent('RO +40');
    await expect(box(trigger)[1]).toBe(34);
    await expect(getComputedStyle(number).paddingLeft).toBe('12px');
    await userEvent.clear(number);
    await userEvent.type(number, '0722111222');
    await expect(number).toHaveValue('722 111 222');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('+40722111222', 'RO');
    await expect(getComputedStyle(frameOf(number)).borderTopColor).toBe(probe('border-ring'));
  },
};

// Pasting or typing a number with + sets the country from its dial code.
export const PasteInternational: Story = {
  args: { defaultValue: '' },
  play: async ({ canvas, args }) => {
    const number = canvas.getByRole('textbox', { name: 'Mobile number' });
    await userEvent.click(number);
    await userEvent.paste('+49 151 2345 6789');
    await expect(args.onCountryChange).toHaveBeenCalledWith('DE');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('+4915123456789', 'DE');
    await expect(canvas.getByRole('button', { name: 'Country code, Germany, DE +49' })).toBeVisible();
    await userEvent.tab({ shift: true });
    await expect(number).toHaveValue('151 2345 6789');
    await expect(parseInternational('+1 415 555 0100', PHONE_COUNTRIES, PHONE_COUNTRIES.find(c => c.code === 'CA'))?.country.code).toBe('CA');
    await expect(formatNational('612345678', PHONE_COUNTRIES.find(c => c.code === 'FR')!)).toBe('6 12 34 56 78');
  },
};

// The country list: searchable by name, code or dial code; arrows move, Enter picks and focus goes
// to the number; Escape closes and returns focus to the trigger.
export const PickCountry: Story = {
  play: async ({ canvas, args }) => {
    const number = canvas.getByRole('textbox', { name: 'Mobile number' });
    const trigger = canvas.getByRole('button', { name: 'Country code, Romania, RO +40' });
    await userEvent.click(trigger);
    const body = within(document.body);
    const dialog = await body.findByRole('dialog', { name: 'Country code' });
    const search = within(dialog).getByRole('combobox', { name: 'Search country' });
    await expect(search).toHaveFocus();
    await expect(within(dialog).getByRole('option', { selected: true })).toHaveTextContent('Romania');
    await userEvent.type(search, 'germ');
    await expect(within(dialog).getAllByRole('option')).toHaveLength(1);
    await userEvent.keyboard('{Enter}');
    await expect(body.queryByRole('dialog')).toBeNull();
    await expect(args.onCountryChange).toHaveBeenCalledWith('DE');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('+49712345678', 'DE');
    await expect(number).toHaveFocus();
    // Keyboard from the trigger; search by dial code; arrows; Escape returns focus.
    const deTrigger = canvas.getByRole('button', { name: 'Country code, Germany, DE +49' });
    deTrigger.focus();
    await userEvent.keyboard('{Enter}');
    const search2 = await body.findByRole('combobox', { name: 'Search country' });
    await userEvent.type(search2, '+3');
    const first = within(document.body).getAllByRole('option')[0];
    await expect(search2).toHaveAttribute('aria-activedescendant', first.id);
    await userEvent.keyboard('{ArrowDown}');
    await expect(search2.getAttribute('aria-activedescendant')).not.toBe(first.id);
    await userEvent.keyboard('{Escape}');
    await expect(body.queryByRole('dialog')).toBeNull();
    await expect(deTrigger).toHaveFocus();
  },
};

// Figma State=error.
export const Invalid: Story = {
  args: { defaultValue: '+40712' },
  render: args => (
    <Field label="Mobile number" error="Enter a mobile number like 712 345 678" className="w-70">
      <PhoneInput {...args} />
    </Field>
  ),
  play: async ({ canvas }) => {
    const number = canvas.getByRole('textbox', { name: 'Mobile number' });
    await expect(number).toHaveAttribute('aria-invalid', 'true');
    await expect(number).toHaveAccessibleDescription('Enter a mobile number like 712 345 678');
    await expect(getComputedStyle(frameOf(number)).borderTopColor).toBe(probe('border-destructive'));
  },
};

// Figma State=disabled: the number and the country trigger are disabled, the box is faded.
export const Disabled: Story = {
  render: args => (
    <Field label="Mobile number" disabled className="w-70">
      <PhoneInput {...args} />
    </Field>
  ),
  play: async ({ canvas }) => {
    const number = canvas.getByRole('textbox', { name: 'Mobile number' });
    await expect(number).toBeDisabled();
    await expect(canvas.getByRole('button', { name: /Country code/ })).toBeDisabled();
    await expect(getComputedStyle(frameOf(number)).opacity).toBe('0.5');
  },
};

// Stress test (Figma "Stress test / Phone Input"): a long country code caps at 112 and truncates,
// a long number stays on one line with an ellipsis, the 276 column.
export const Stress: Story = {
  tags: ['!dev'],
  render: () => {
    const long = [{ code: 'RO', dial: '40123456', groups: [3, 3, 3] }, ...PHONE_COUNTRIES.filter(c => c.code !== 'RO')];
    return (
      <div className="flex flex-col gap-4">
        <div data-case="long" className="w-70"><PhoneInput aria-label="Long" countries={long} defaultCountry="RO" defaultValue="+40123456712345678901234567" /></div>
        <div data-case="column" className="w-[276px]"><PhoneInput aria-label="Column" /></div>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const long = canvasElement.querySelector('[data-case="long"]')!;
    const trigger = long.querySelector('button')!;
    await expect(trigger.getBoundingClientRect().width).toBeLessThanOrEqual(112);
    const code = trigger.querySelector('span')!;
    await expect(code.scrollWidth).toBeGreaterThan(code.clientWidth);
    const number = long.querySelector('input')!;
    await expect(box(frameOf(number))[1]).toBe(36);
    await expect(number.scrollWidth).toBeGreaterThan(number.clientWidth);
    await expect(box(canvasElement.querySelector('[data-case="column"] [data-slot="input-group"]')!)).toEqual([276, 36]);
  },
};

export const Dark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const CorporateLight: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
