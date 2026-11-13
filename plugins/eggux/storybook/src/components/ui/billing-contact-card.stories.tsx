import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { BillingContactCard } from './billing-contact-card';

type Args = { company: string; name: string; email: string; phone: string; showAddress: boolean; width: number };

const address = ['12 Example Street', '1017 Amsterdam', 'Netherlands'];

const meta = {
  title: 'Components/Billing/Billing Contact Card',
  parameters: {
    docs: {
      description: {
        component:
          'Who invoices go to: company, contact, billing email (a mailto link), phone and address in a Card with an Edit button. An empty email is said in words with a "Missing" badge, because an invoice that goes nowhere costs money. Long emails wrap. Empty text controls hide their row. Code only (no Figma component yet).',
      },
    },
  },
  args: { company: 'Acme B.V.', name: 'Sam Jansen', email: 'billing@acme.example', phone: '+31 20 555 0100', showAddress: true, width: 400 },
  argTypes: {
    company: { name: 'Company', control: 'text', description: 'Empty hides the row.', table: { category: 'Contact' } },
    name: { name: 'Contact name', control: 'text', description: 'Empty hides the row.', table: { category: 'Contact' } },
    email: { name: 'Billing email', control: 'text', description: 'Empty shows the missing state.', table: { category: 'Contact' } },
    phone: { name: 'Phone', control: 'text', description: 'Empty hides the row.', table: { category: 'Contact' } },
    showAddress: { name: 'Show address', control: 'boolean', description: 'The billing address lines.', table: { category: 'Parts' } },
    width: { name: 'Width', control: { type: 'range', min: 276, max: 520, step: 4 }, description: 'Container width in px.', table: { category: 'Layout' } },
  },
  render: ({ showAddress, width, ...args }) => (
    <div style={{ width, maxWidth: '100%' }}>
      <BillingContactCard address={showAddress ? address : undefined} onEdit={fn()} {...args} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** No billing email: the card says invoices cannot be sent. */
export const MissingEmail: Story = { args: { email: '' } };

export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <BillingContactCard company="Acme B.V." name="Sam Jansen" email="billing@acme.example" phone="+31 20 555 0100" address={address} onEdit={fn()} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('region', { name: 'Billing contact' })).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'billing@acme.example' })).toHaveAttribute('href', 'mailto:billing@acme.example');
    await expect(canvas.getByText('Amsterdam', { exact: false })).toBeVisible();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Edit billing contact' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
  },
};

export const MissingCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <BillingContactCard company="Acme B.V." />,
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Missing')).toBeVisible();
    await expect(canvas.getByText('No billing email. Invoices cannot be sent.')).toBeVisible();
    await expect(canvas.queryByRole('link')).toBeNull();
    await expect(canvas.queryByText('Phone')).toBeNull();
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <BillingContactCard
      company="Acme International Holdings and Subsidiaries Limited Liability Partnership"
      name="Alexandra Konstantinopolous-Featherstonehaugh"
      email="accounts.payable.department.invoices@subsidiary.acme-international-holdings.example"
      phone="+31 20 555 0100"
      address={['Unit 14, Example Business Park, Industrieweg 123', '1017 Amsterdam', 'Netherlands']}
    />
  ),
  play: async ({ canvas }) => {
    const card = canvas.getByRole('region');
    await expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth + 1);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
