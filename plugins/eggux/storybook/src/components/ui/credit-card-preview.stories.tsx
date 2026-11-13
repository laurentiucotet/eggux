import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { CreditCardPreview } from './credit-card-preview';

type Args = { number: string; name: string; expiry: string; brand: string; masked: boolean; inactive: boolean };

const meta = {
  title: 'Components/Checkout/Credit Card Preview',
  parameters: {
    docs: {
      description: {
        component:
          'A card face that follows the payment form: brand mark, number, holder name and expiry, updating from props. The number is masked by default (last four only); empty parts show placeholders. It is one image for assistive technology, so the form fields stay the real controls. Use test numbers only. Code only (no Figma component yet).',
      },
    },
  },
  args: { number: '4242424242424242', name: 'Ada Lovelace', expiry: '08/28', brand: 'VISA', masked: true, inactive: false },
  argTypes: {
    number: { name: 'Number', control: 'text', description: 'Digits typed so far. Use a test number.', table: { category: 'Card' } },
    name: { name: 'Holder name', control: 'text', description: 'Name as typed.', table: { category: 'Card' } },
    expiry: { name: 'Expiry', control: 'text', description: 'MM/YY as typed.', table: { category: 'Card' } },
    brand: { name: 'Brand mark', control: 'text', description: 'Text mark; empty shows none.', table: { category: 'Card' } },
    masked: { name: 'Masked number', control: 'boolean', description: 'Only the last four digits show.', table: { category: 'Card' } },
    inactive: { name: 'Inactive', control: 'boolean', description: 'Muted look for a card that cannot be used.', table: { category: 'Card' } },
  },
  render: args => <CreditCardPreview {...args} />,
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvas }) => {
    const card = canvas.getByRole('img');
    await expect(card).toHaveAccessibleName('Visa card, ending 4242, Ada Lovelace, expires 08/28');
    await expect(card.textContent).toContain('•••• •••• •••• 4242');
    // Credit card ratio.
    const r = card.getBoundingClientRect();
    await expect(Math.abs(r.width / r.height - 1.586)).toBeLessThan(0.02);
    // The full number never reaches the page when masked.
    await expect(card.textContent).not.toContain('4242 4242');
  },
};

/** Empty, half typed and complete, as the form is filled. */
export const Filling: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap gap-6">
      <CreditCardPreview />
      <CreditCardPreview number="5555 55" name="Grace" masked={false} brand="MC" />
      <CreditCardPreview number="5555555555554444" name="Grace Hopper" expiry="01/29" brand="MC" />
    </div>
  ),
};

export const EmptyCheck: Story = {
  tags: ['!dev'],
  args: { number: '', name: '', expiry: '', brand: '' },
  play: async ({ canvas }) => {
    const card = canvas.getByRole('img');
    await expect(card).toHaveAccessibleName('card, number not entered');
    await expect(card.textContent).toContain('•••• •••• •••• ••••');
    await expect(card.textContent).toContain('Full name');
    await expect(card.textContent).toContain('MM/YY');
  },
};

export const UnmaskedCheck: Story = {
  tags: ['!dev'],
  args: { number: '5555 55', masked: false, brand: 'MC' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('img').textContent).toContain('5555 55•• •••• ••••');
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => <CreditCardPreview number="4242424242424242" name="Maximilian Alexander von Hohenzollern-Sigmaringen" expiry="12/31" brand="AMERICAN EXPRESS" />,
  play: async ({ canvas }) => {
    const card = canvas.getByRole('img');
    await expect(card.getBoundingClientRect().width).toBeLessThanOrEqual(276);
    // Text stays inside the card: the decorative circle is allowed to bleed, the words are not.
    const right = card.getBoundingClientRect().right;
    for (const el of Array.from(card.querySelectorAll('span'))) {
      await expect(el.getBoundingClientRect().right).toBeLessThanOrEqual(right + 1);
    }
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
