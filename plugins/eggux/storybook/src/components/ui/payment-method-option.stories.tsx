import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { PaymentMethodOption, PaymentMethodOptionGroup } from './payment-method-option';

type Args = { brand: string; label: string; expired: boolean; isDefault: boolean; disabled: boolean };

const meta = {
  title: 'Components/Checkout/Payment Method Option',
  parameters: {
    docs: {
      description: {
        component:
          'The selectable Payment Method Card: a radio card with a text brand mark, "Visa ending in 4242", the expiry and a Default badge. An expired card is shown but cannot be chosen. Arrow keys move between cards in the group. Only the brand, last four digits and expiry from the server: never a full number. Code only (no Figma component yet); the non-selectable card is Payment Method Card on the Commerce page.',
      },
    },
  },
  args: { brand: 'VISA', label: 'Visa ending in 4242', expired: false, isDefault: true, disabled: false },
  argTypes: {
    brand: { name: 'Brand mark', control: 'text', description: 'Text mark, never a logo.', table: { category: 'Option' } },
    label: { name: 'Label', control: 'text', description: 'Brand and last four digits.', table: { category: 'Option' } },
    expired: { name: 'Expired', control: 'boolean', description: 'Expiry in destructive, cannot be chosen.', table: { category: 'Option' } },
    disabled: { name: 'Disabled', control: 'boolean', description: 'Blocks the option.', table: { category: 'Option' } },
    isDefault: { name: 'Show default badge', control: 'boolean', description: 'Marks the default card.', table: { category: 'Parts' } },
  },
  render: ({ brand, label, expired, isDefault, disabled }) => (
    <PaymentMethodOptionGroup aria-label="Payment method" defaultValue="a">
      <PaymentMethodOption value="a" brand={brand} label={label} expiry={expired ? 'Expired 08/25' : 'Expires 08/28'} expired={expired} isDefault={isDefault} disabled={disabled} />
    </PaymentMethodOptionGroup>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

function Cards() {
  const [v, setV] = React.useState('visa');
  return (
    <PaymentMethodOptionGroup aria-label="Payment method" value={v} onValueChange={setV}>
      <PaymentMethodOption value="visa" brand="VISA" label="Visa ending in 4242" expiry="Expires 08/28" isDefault />
      <PaymentMethodOption value="mc" brand="MC" label="Mastercard ending in 4444" expiry="Expires 01/29" />
      <PaymentMethodOption value="old" brand="VISA" label="Visa ending in 1881" expiry="Expired 08/25" expired />
    </PaymentMethodOptionGroup>
  );
}

/** Three saved cards at checkout, one expired. */
export const Group: Story = {
  parameters: { controls: { disable: true } },
  render: () => <Cards />,
};

export const GroupCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <Cards />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('radiogroup', { name: 'Payment method' })).toBeInTheDocument();
    const visa = canvas.getByRole('radio', { name: 'Visa ending in 4242' });
    await expect(visa).toBeChecked();
    await expect(visa).toHaveAccessibleDescription('Expires 08/28');
    await userEvent.click(canvas.getByText('Mastercard ending in 4444'));
    await waitFor(() => expect(canvas.getByRole('radio', { name: 'Mastercard ending in 4444' })).toBeChecked());
    const old = canvas.getByRole('radio', { name: 'Visa ending in 1881' });
    await expect(old).toBeDisabled();
    await expect(old).toHaveAccessibleDescription('Expired 08/25');
    canvas.getByRole('radio', { name: 'Mastercard ending in 4444' }).focus();
    // Radix moves focus in a timeout and checks the radio while the arrow key is still down: hold the key.
    await userEvent.keyboard('{ArrowDown>}');
    await waitFor(() => expect(canvas.getByRole('radio', { name: 'Visa ending in 4242' })).toHaveFocus());
    await userEvent.keyboard('{/ArrowDown}');
    await expect(canvas.getByRole('radio', { name: 'Visa ending in 4242' })).toBeChecked();
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <PaymentMethodOptionGroup aria-label="Long cards" defaultValue="a">
      <PaymentMethodOption value="a" brand="AMEX" label="American Express Corporate Platinum ending in 1005" expiry="Expires 12/2031 · billing address on file" isDefault />
    </PaymentMethodOptionGroup>
  ),
  play: async ({ canvas }) => {
    const group = canvas.getByRole('radiogroup', { name: 'Long cards' });
    await expect(group.scrollWidth).toBeLessThanOrEqual(group.clientWidth + 1);
    const radio = canvas.getByRole('radio');
    await expect(radio.getBoundingClientRect().width).toBeGreaterThanOrEqual(15);
  },
};

export const DefaultDark: Story = { ...GroupCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...GroupCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
