import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { FaqSearch, type FaqItem } from './faq-search';

type Args = { heading: string; query: string; width: number };

const items: FaqItem[] = [
  { id: 'trial', question: 'Is there a free trial?', answer: 'Yes. Every plan starts with a 14-day trial. You do not need a card to begin.' },
  { id: 'cancel', question: 'Can I cancel at any time?', answer: 'You can cancel from Billing settings. Access continues until the end of the period you paid for.' },
  { id: 'invoice', question: 'How do I download an invoice?', answer: 'Open Billing, choose a month and select Download. Invoices are PDF files in EUR.' },
  { id: 'seats', question: 'How do I add a teammate?', answer: 'Go to Team settings and select Invite. Each new seat is added to your next invoice.' },
  { id: 'data', question: 'Where is my data stored?', answer: 'In data centers in the European Union. You can export everything as CSV at any time.' },
  { id: 'support', question: 'How fast does support reply?', answer: 'Within one working day, and within two hours on the Business plan.' },
];

const meta = {
  title: 'Components/Marketing/FAQ Search',
  parameters: {
    docs: {
      description: {
        component:
          'A help-center FAQ: a search field above an accordion. Typing filters the questions (question or answer contains the text), marks the match, and a polite status gives the count; with no match an empty state offers "Show all questions". Code only (no Figma component yet).',
      },
    },
  },
  args: { heading: 'Frequently asked questions', query: '', width: 640 },
  argTypes: {
    heading: { name: 'Heading', control: 'text', description: 'Heading above the field. Empty hides it.', table: { category: 'FAQ Search' } },
    query: { name: 'Starting query', control: 'text', description: 'The text typed in the field when it mounts.', table: { category: 'FAQ Search' } },
    width: { name: 'Width', control: { type: 'range', min: 276, max: 800, step: 4 }, description: 'Container width in px.', table: { category: 'FAQ Search' } },
  },
  render: ({ heading, query, width }) => (
    <div style={{ width, maxWidth: '100%' }}>
      <FaqSearch key={query} items={items} heading={heading} defaultQuery={query} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A query that matches nothing: the empty state. */
export const NoResults: Story = { args: { query: 'refund policy' } };

export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <FaqSearch items={items} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('region', { name: 'Frequently asked questions' })).toBeVisible();
    await expect(canvas.getByRole('status')).toHaveTextContent('6 questions');
    const field = canvas.getByRole('searchbox', { name: 'Search questions' });
    await userEvent.type(field, 'invoice');
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('2 of 6 questions match'));
    await expect(canvas.getAllByRole('button', { name: /\?$/ })).toHaveLength(2);
    await waitFor(() => expect(document.querySelectorAll('mark').length).toBeGreaterThan(0));
    // Open one: the answer shows and the button says so.
    const trigger = canvas.getByRole('button', { name: 'How do I download an invoice?' });
    await userEvent.click(trigger);
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'));
    // No match: empty state, then Show all questions restores the list.
    await userEvent.clear(field);
    await userEvent.type(field, 'zzz');
    await waitFor(() => expect(canvas.getByText('No questions match “zzz”')).toBeVisible());
    await expect(canvas.getByRole('status')).toHaveTextContent('0 of 6 questions match');
    await userEvent.click(canvas.getByRole('button', { name: 'Show all questions' }));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('6 questions'));
    await expect(canvas.getAllByRole('button', { name: /\?$/ })).toHaveLength(6);
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <FaqSearch
      heading="Frequently asked questions about billing, invoicing and account ownership"
      defaultQuery="reallylongunbrokenquerytextthatcannotwrapanywhereatall"
      items={items}
    />
  ),
  play: async ({ canvas }) => {
    const region = canvas.getByRole('region');
    await expect(region.scrollWidth).toBeLessThanOrEqual(region.clientWidth + 1);
    await expect(canvas.getByText(/No questions match/)).toBeVisible();
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
