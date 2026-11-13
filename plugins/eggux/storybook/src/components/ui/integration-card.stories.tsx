import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { IntegrationCard, type IntegrationTone } from './integration-card';

type Args = { name: string; description: string; category: string; showCategory: boolean; tone: IntegrationTone; connected: boolean; width: number };

const meta = {
  title: 'Components/Marketing/Integration Card',
  parameters: {
    docs: {
      description: {
        component:
          'A tile for an integrations directory: a drawn mark, the name, a category badge, a description clamped to two lines and a Connect button that becomes Connected. Pressing Connected disconnects. In a grid the button sits at the bottom so cards keep one height. Code only (no Figma component yet).',
      },
    },
  },
  args: {
    name: 'Acme Sheets',
    description: 'Send every approved invoice to a spreadsheet row, and keep totals in sync as payments land.',
    category: 'Accounting',
    showCategory: true,
    tone: 1,
    connected: false,
    width: 320,
  },
  argTypes: {
    name: { name: 'Name', control: 'text', description: 'The integration name; also the heading.', table: { category: 'Card' } },
    description: { name: 'Description', control: 'text', description: 'One line of what it does. Clamped to two lines.', table: { category: 'Card' } },
    category: { name: 'Category', control: 'text', description: 'Text of the category badge.', table: { category: 'Card' } },
    tone: { name: 'Mark color', control: { type: 'range', min: 1, max: 8, step: 1 }, description: 'Badge category color 1 to 8.', table: { category: 'Card' } },
    connected: { name: 'Connected', control: 'boolean', description: 'Starting state of the button.', table: { category: 'Card' } },
    width: { name: 'Width', control: { type: 'range', min: 276, max: 480, step: 4 }, description: 'Card width in px.', table: { category: 'Card' } },
    showCategory: { name: 'Show category', control: 'boolean', description: 'The category badge.', table: { category: 'Parts' } },
  },
  render: ({ name, description, category, showCategory, tone, connected, width }) => (
    <div style={{ width, maxWidth: '100%' }}>
      <IntegrationCard key={String(connected)} name={name} description={description} category={showCategory ? category : undefined} tone={tone} defaultConnected={connected} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A directory: cards in one row keep one height. */
export const Directory: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ul className="m-0 grid w-[900px] max-w-full list-none grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))] gap-4 p-0">
      {[
        { name: 'Acme Sheets', description: 'Send every approved invoice to a spreadsheet row.', category: 'Accounting', tone: 1 as const, defaultConnected: true },
        { name: 'Northwind Pay', description: 'Take card and bank payments on an invoice and reconcile them for you, including refunds, partial payments and payouts in several currencies.', category: 'Payments', tone: 3 as const },
        { name: 'Harbor Chat', description: 'Post approvals to a channel.', category: 'Messaging', tone: 5 as const },
      ].map(c => <li key={c.name} className="flex min-w-0"><IntegrationCard {...c} /></li>)}
    </ul>
  ),
};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <IntegrationCard name="Acme Sheets" description="Send every approved invoice to a spreadsheet row." category="Accounting" onConnectedChange={fn()} />
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Acme Sheets' })).toBeVisible();
    await expect(canvas.getByText('Accounting')).toBeVisible();
    const connect = canvas.getByRole('button', { name: 'Connect Acme Sheets' });
    await expect(connect).toHaveTextContent('Connect');
    await userEvent.click(connect);
    const connected = await canvas.findByRole('button', { name: 'Connected to Acme Sheets, press to disconnect' });
    await expect(connected).toHaveTextContent('Connected');
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Acme Sheets connected'));
    // Keyboard: Space on the focused button disconnects.
    connected.focus();
    await userEvent.keyboard(' ');
    await canvas.findByRole('button', { name: 'Connect Acme Sheets' });
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <IntegrationCard
      name="The Acme Group Consolidated Accounting and Reporting Connector"
      category="Accounting and financial reporting"
      description="Send every approved invoice, credit note and payment to a spreadsheet row, and keep every total in sync as payments land, with a full audit trail for each change."
      defaultConnected
    />
  ),
  play: async ({ canvas }) => {
    const card = canvas.getByRole('article');
    await expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth + 1);
    const p = card.querySelector('p.line-clamp-2') as HTMLElement;
    await expect(p.scrollHeight).toBeGreaterThanOrEqual(p.clientHeight);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
