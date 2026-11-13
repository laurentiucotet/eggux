import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { TaxIdField } from './tax-id-field';

type Args = { country: string; value: string; required: boolean; disabled: boolean; width: number };

const meta = {
  title: 'Components/Billing/Tax ID Field',
  parameters: {
    docs: {
      description: {
        component:
          'A VAT number input for invoices: a country Select and an Input in Fields. The number is kept with its prefix, upper case, with spaces, dots and dashes removed as you type. The format is checked when the field loses focus (never while typing) and the error says what to type with an example. A right format only means the shape is right; the number is checked with the tax authority when saved. Code only (no Figma component yet).',
      },
    },
  },
  args: { country: 'DE', value: '', required: false, disabled: false, width: 520 },
  argTypes: {
    country: { name: 'Country', control: 'select', options: ['DE', 'FR', 'IE', 'IT', 'NL', 'RO'], description: 'Starting country.', table: { category: 'Field' } },
    value: { name: 'Value', control: 'text', description: 'Starting number.', table: { category: 'Field' } },
    required: { name: 'Required', control: 'boolean', description: 'An empty field is an error after blur.', table: { category: 'Field' } },
    disabled: { name: 'Disabled', control: 'boolean', description: 'Blocks both controls.', table: { category: 'Field' } },
    width: { name: 'Width', control: { type: 'range', min: 276, max: 560, step: 4 }, description: 'Container width in px.', table: { category: 'Layout' } },
  },
  render: ({ country, value, width, ...args }) => (
    <div style={{ width, maxWidth: '100%' }}>
      <TaxIdField key={`${country}-${value}`} defaultCountry={country} defaultValue={value} {...args} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A Dutch number with the right format. Focus then leave the field to see the confirmation. */
export const Netherlands: Story = { args: { country: 'NL', value: 'NL123456789B01' } };

export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <TaxIdField />,
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'VAT number' });
    await userEvent.type(input, 'de 123.456-78');
    await expect(input).toHaveValue('DE12345678');
    // No error while typing.
    await expect(input).not.toHaveAttribute('aria-invalid', 'true');
    await userEvent.tab();
    await waitFor(() => expect(input).toHaveAttribute('aria-invalid', 'true'));
    await expect(canvas.getByText('This is not a Germany VAT number. Use DE followed by 9 digits, for example DE123456789.')).toBeVisible();
    await userEvent.type(input, '9');
    await userEvent.tab();
    await waitFor(() => expect(input).not.toHaveAttribute('aria-invalid', 'true'));
    await expect(canvas.getByText(/The format is right for Germany/)).toBeVisible();
  },
};

export const CountryCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <TaxIdField defaultValue="DE123456789" />,
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'VAT number' });
    await userEvent.click(canvas.getByRole('combobox', { name: 'Country' }));
    const list = await screen.findByRole('listbox');
    await expect(within(list).getAllByRole('option')).toHaveLength(6);
    await userEvent.click(within(list).getByRole('option', { name: 'Netherlands' }));
    await waitFor(() => expect(input).toHaveValue('NL123456789'));
    await expect(input).toHaveAttribute('placeholder', 'NL123456789B01');
    await expect(canvas.getByText('NL, 9 digits, the letter B and 2 digits, for example NL123456789B01.')).toBeVisible();
  },
};

export const RequiredCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <TaxIdField required />,
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: /VAT number/ });
    await userEvent.click(input);
    await userEvent.tab();
    await waitFor(() => expect(canvas.getByText('Enter your VAT number.')).toBeVisible());
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => <TaxIdField defaultCountry="FR" defaultValue="FR12345678901234567890" />,
  play: async ({ canvas }) => {
    const root = canvas.getByRole('textbox', { name: 'VAT number' }).closest('[data-slot="tax-id-field"]') as HTMLElement;
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + 1);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
