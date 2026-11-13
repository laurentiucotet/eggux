import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { MobileCheckoutPage, demoCoupon } from './mobile-checkout';
import { phoneGlobals, phoneStory } from './mobile-parts';

const meta = {
  title: 'Pages/Mobile/Mobile Checkout',
  parameters: {
    ...phoneStory,
    docs: { description: { component: `Checkout on a phone, opened at 375 px. A detail Mobile Header, a collapsible Order Summary, delivery and payment as radio cards, a discount code, and a Bottom Action Bar that keeps the total in sight next to "Pay". Choosing a delivery method changes the shipping and the total. Try it: the code ${demoCoupon} takes 10 percent off the items; any other code is refused. The expired card is shown but cannot be chosen. Guide: eggux build-ui/patterns/checkout.md` } },
  },
  globals: phoneGlobals,
  render: () => <MobileCheckoutPage />,
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Order summary open, code applied, express delivery. */
export const SummaryOpenWithCode: Story = { render: () => <MobileCheckoutPage initialSummaryOpen initialCoupon initialShipping="express" /> };

/** After the payment. */
export const Paid: Story = { render: () => <MobileCheckoutPage initialPaid /> };

/* Hidden checks */

export const FlowCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('heading', { level: 1, name: 'Checkout' })).toBeVisible();
    await expect(c.getAllByRole('banner')).toHaveLength(1);
    await expect(c.getAllByRole('main')).toHaveLength(1);
    await expect(c.getByRole('button', { name: 'Pay €248.00' })).toBeVisible();

    // The summary opens and shows the rows.
    const toggle = c.getByRole('button', { name: /Show order summary/ });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(toggle);
    await expect(c.getByRole('button', { name: /Hide order summary/ })).toHaveAttribute('aria-expanded', 'true');
    await expect(c.getByText('Merino sweater')).toBeVisible();

    // Shipping changes the total.
    await userEvent.click(c.getByRole('radio', { name: /Express/ }));
    await waitFor(() => expect(c.getByRole('button', { name: 'Pay €258.00' })).toBeVisible());
    await userEvent.click(c.getByRole('radio', { name: /Pick up in store/ }));
    await waitFor(() => expect(c.getByRole('button', { name: 'Pay €239.00' })).toBeVisible());
    await userEvent.click(c.getByRole('radio', { name: /Standard/ }));
    await waitFor(() => expect(c.getByRole('button', { name: 'Pay €248.00' })).toBeVisible());

    // The expired card cannot be chosen; another card can.
    await expect(c.getByRole('radio', { name: /ending in 0019/ })).toBeDisabled();
    await userEvent.click(c.getByRole('radio', { name: /Mastercard/ }));
    await waitFor(() => expect(c.getByRole('radio', { name: /Mastercard/ })).toBeChecked());

    // A wrong code is refused; SAVE10 takes 10 percent off the items.
    const code = c.getByLabelText('Discount code');
    await userEvent.type(code, 'NOPE');
    await userEvent.click(c.getByRole('button', { name: 'Apply' }));
    await expect(await c.findByRole('alert')).toHaveTextContent('not valid');
    await userEvent.clear(code);
    await userEvent.type(code, demoCoupon);
    await userEvent.click(c.getByRole('button', { name: 'Apply' }));
    await waitFor(() => expect(c.getByRole('button', { name: 'Pay €224.10' })).toBeVisible());
    await expect(c.getByText('-€23.90')).toBeVisible();
    await userEvent.click(c.getByRole('button', { name: 'Remove code SAVE10' }));
    await waitFor(() => expect(c.getByRole('button', { name: 'Pay €248.00' })).toBeVisible());

    // Pay.
    await userEvent.click(c.getByRole('button', { name: 'Pay €248.00' }));
    await waitFor(() => expect(c.getByText('Payment received')).toBeVisible());
  },
};
export const DefaultDark: Story = { tags: ['!dev'], globals: { ...phoneGlobals, theme: 'Dark' } };
export const DefaultBackOffice: Story = { tags: ['!dev'], globals: { ...phoneGlobals, theme: 'Corporate Light' } };
export const SummaryOpenWithCodeDark: Story = { ...SummaryOpenWithCode, tags: ['!dev'], globals: { ...phoneGlobals, theme: 'Dark' } };
