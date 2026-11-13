import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { ShippingOption, ShippingOptionGroup } from './shipping-option';

type Args = { name: string; price: string; showEstimate: boolean; showBadge: boolean; showNote: boolean; disabled: boolean };

const meta = {
  title: 'Components/Checkout/Shipping Option',
  parameters: {
    docs: {
      description: {
        component:
          'A radio card for one delivery choice: carrier and service, delivery estimate and price ("Free" in success). The whole card is the target, selected is a 2 px primary edge, arrow keys move between cards in the group. A disabled card keeps its reason readable. Built on Radio with the card states of Option Card. Code only (no Figma component yet).',
      },
    },
  },
  args: { name: 'Acme Post · Standard', price: '€4.90', showEstimate: true, showBadge: false, showNote: false, disabled: false },
  argTypes: {
    name: { name: 'Name', control: 'text', description: 'Carrier and service.', table: { category: 'Option' } },
    price: { name: 'Price', control: 'text', description: 'Formatted price, or "Free".', table: { category: 'Option' } },
    disabled: { name: 'Disabled', control: 'boolean', description: 'Not available for this address.', table: { category: 'Option' } },
    showEstimate: { name: 'Show estimate', control: 'boolean', description: 'The delivery estimate line.', table: { category: 'Parts' } },
    showBadge: { name: 'Show badge', control: 'boolean', description: 'A short flag such as "Fastest".', table: { category: 'Parts' } },
    showNote: { name: 'Show note', control: 'boolean', description: 'An extra condition line.', table: { category: 'Parts' } },
  },
  render: ({ name, price, showEstimate, showBadge, showNote, disabled }) => (
    <ShippingOptionGroup aria-label="Delivery method" defaultValue="one">
      <ShippingOption
        value="one"
        name={name}
        price={price}
        estimate={showEstimate ? 'Arrives Tue 14 to Thu 16 Oct' : undefined}
        badge={showBadge ? 'Fastest' : undefined}
        note={showNote ? 'Signature required on delivery' : undefined}
        disabled={disabled}
      />
    </ShippingOptionGroup>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

function Choices({ value, onValueChange }: { value?: string; onValueChange?: (v: string) => void }) {
  const [v, setV] = React.useState(value ?? 'standard');
  return (
    <ShippingOptionGroup aria-label="Delivery method" value={v} onValueChange={n => { setV(n); onValueChange?.(n); }}>
      <ShippingOption value="pickup" name="Pick up in store" estimate="Ready Mon 13 Oct" price="Free" />
      <ShippingOption value="standard" name="Acme Post · Standard" estimate="Arrives Tue 14 to Thu 16 Oct" price="€4.90" />
      <ShippingOption value="express" name="Acme Express" estimate="Arrives Mon 13 Oct" price="€9.90" badge="Fastest" />
      <ShippingOption value="drone" name="Acme Air" estimate="Not available" note="We do not deliver by air to this address." price="€14.90" disabled />
    </ShippingOptionGroup>
  );
}

/** A full delivery step: four choices, one unavailable. */
export const Group: Story = {
  parameters: { controls: { disable: true } },
  render: () => <Choices />,
};

export const GroupCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <Choices />,
  play: async ({ canvas }) => {
    const group = canvas.getByRole('radiogroup', { name: 'Delivery method' });
    await expect(group).toBeInTheDocument();
    const standard = canvas.getByRole('radio', { name: /Acme Post · Standard/ });
    await expect(standard).toBeChecked();
    // The price is part of the name.
    await expect(standard).toHaveAccessibleName(/€4\.90/);
    await expect(standard).toHaveAccessibleDescription(/Arrives Tue 14/);
    // Clicking the card text picks it.
    await userEvent.click(canvas.getByText('Pick up in store'));
    await waitFor(() => expect(canvas.getByRole('radio', { name: /Pick up in store/ })).toBeChecked());
    // Keyboard: arrows move, the disabled one is skipped.
    canvas.getByRole('radio', { name: /Pick up in store/ }).focus();
    // Radix moves focus in a timeout and checks the radio while the arrow key is still down: hold the key.
    await userEvent.keyboard('{ArrowDown>}');
    await waitFor(() => expect(canvas.getByRole('radio', { name: /Acme Post · Standard/ })).toHaveFocus());
    await userEvent.keyboard('{/ArrowDown}');
    await expect(canvas.getByRole('radio', { name: /Acme Post · Standard/ })).toBeChecked();
    await userEvent.keyboard('{ArrowDown>}');
    await waitFor(() => expect(canvas.getByRole('radio', { name: /Acme Express/ })).toHaveFocus());
    await userEvent.keyboard('{/ArrowDown}');
    await expect(canvas.getByRole('radio', { name: /Acme Express/ })).toBeChecked();
    // The unavailable option is skipped: the next arrow wraps to the first.
    await userEvent.keyboard('{ArrowDown>}');
    await waitFor(() => expect(canvas.getByRole('radio', { name: /Pick up in store/ })).toHaveFocus());
    await userEvent.keyboard('{/ArrowDown}');
    await expect(canvas.getByRole('radio', { name: /Pick up in store/ })).toBeChecked();
    await expect(canvas.getByRole('radio', { name: /Acme Air/ })).toBeDisabled();
    await expect(canvas.getByText('We do not deliver by air to this address.')).toBeVisible();
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <ShippingOptionGroup aria-label="Long delivery" defaultValue="a">
      <ShippingOption value="a" name="International Courier Services Worldwide · Priority Express Plus with insurance" estimate="Arrives between Tuesday 14 October and Thursday 16 October, before 6 pm" price="€1,249.90" badge="Fastest option" />
      <ShippingOption value="b" name="Pick up" price="Free" />
    </ShippingOptionGroup>
  ),
  play: async ({ canvas }) => {
    const group = canvas.getByRole('radiogroup', { name: 'Long delivery' });
    await expect(group.scrollWidth).toBeLessThanOrEqual(group.clientWidth + 1);
    const price = canvas.getByText('€1,249.90');
    await expect(Math.round(price.getBoundingClientRect().height)).toBeLessThanOrEqual(20);
  },
};

export const DefaultDark: Story = { ...GroupCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...GroupCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
