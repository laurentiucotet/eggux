import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { Citation, SourceItem, Sources } from './sources';

const items = (
  <>
    <SourceItem number="1" letter="B" title="Invoice INV-1024" domain="billing.acme.com" href="https://billing.acme.com/invoices/INV-1024" />
    <SourceItem number="2" letter="D" title="Payment terms" domain="docs.acme.com" href="https://docs.acme.com/payment-terms" />
    <SourceItem number="3" letter="C" title="Acme Corp" domain="crm.acme.com" href="https://crm.acme.com/accounts/acme" />
  </>
);

const meta = {
  title: 'AI Chat/Sources',
  component: Sources,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Sources behind an answer, under the text. The header (favicons + "3 sources") toggles the list of Source Items; each opens its source in a new tab. Every factual claim gets a Citation with the Source Item number. Figma: AI Chat / Sources, Source Item, Citation. Guide: eggux build-ui/components/ai-chat.md' } },
  },
  args: { children: items, onOpenChange: fn() },
  decorators: [Story => <div className="w-[720px] max-w-full"><Story /></div>],
} satisfies Meta<typeof Sources>;
export default meta;
type Story = StoryObj<typeof meta>;

// Figma Sources, Show list on: the toggle closes and opens the list.
export const Default: Story = {
  play: async ({ canvas, args }) => {
    const toggle = canvas.getByRole('button', { name: '3 sources' });
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getAllByRole('link')).toHaveLength(3);
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByRole('link')).not.toBeInTheDocument();
    await expect(args.onOpenChange).toHaveBeenCalledWith(false);
    await userEvent.click(toggle);
    await expect(canvas.getAllByRole('link')).toHaveLength(3);
  },
};

// Figma: Source Items fill 240-384 and wrap two per row at 720; each item is 48 high.
export const Layout: Story = {
  play: async ({ canvas }) => {
    const [first, second, third] = canvas.getAllByRole('link');
    const a = first.getBoundingClientRect();
    const b = second.getBoundingClientRect();
    const c = third.getBoundingClientRect();
    await expect(Math.round(a.height)).toBe(48);
    await expect(a.top).toBe(b.top);
    await expect(c.top).toBeGreaterThan(a.top);
    for (const r of [a, b, c]) {
      await expect(r.width).toBeGreaterThanOrEqual(240);
      await expect(r.width).toBeLessThanOrEqual(384);
    }
  },
};

// Figma Show list off: only the header row.
export const Collapsed: Story = {
  args: { showList: false },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: '3 sources' })).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByRole('link')).not.toBeInTheDocument();
  },
};

// Accessibility: links name the title and domain and say they open a new tab; letters are decorative.
export const SourceItemLink: Story = {
  name: 'Source Item',
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Invoice INV-1024 billing.acme.com (opens in a new tab)' });
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('href', 'https://billing.acme.com/invoices/INV-1024');
    await expect(link).toHaveAttribute('rel', 'noreferrer');
  },
};

// Keyboard: Tab reaches the toggle, Enter closes; then Tab walks the source links in order.
export const Keyboard: Story = {
  play: async ({ canvas }) => {
    const toggle = canvas.getByRole('button', { name: '3 sources' });
    await userEvent.tab();
    await expect(toggle).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('link', { name: /Invoice INV-1024/ })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('link', { name: /Payment terms/ })).toHaveFocus();
    await userEvent.tab({ shift: true });
    await userEvent.tab({ shift: true });
    await userEvent.keyboard('{Enter}');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  },
};

// Citation in the answer: numbered like the Source Item, named after the source.
export const WithCitations: Story = {
  render: args => (
    <div className="flex flex-col gap-4">
      <p className="text-base leading-7 text-foreground">
        Acme has 3 open invoices, €4,820 in total <Citation label="1" source="Invoice INV-1024" href="https://billing.acme.com/invoices/INV-1024" />. Payment is due 30 days after the invoice date <Citation label="2" source="Payment terms" href="https://docs.acme.com/payment-terms" />.
      </p>
      <Sources {...args} />
    </div>
  ),
  play: async ({ canvas }) => {
    const citation = canvas.getByRole('link', { name: 'Source 1: Invoice INV-1024 (opens in a new tab)' });
    await expect(citation).toHaveTextContent('1');
    await expect(citation).toHaveAttribute('target', '_blank');
    // Figma Citation: 20 × 20.
    const r = citation.getBoundingClientRect();
    await expect(Math.round(r.height)).toBe(20);
    await expect(Math.round(r.width)).toBe(20);
  },
};

export const CitationDomain: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <p className="text-base leading-7 text-foreground">
      The reminder policy sends a first notice after 7 days <Citation label="acme.com +2" source="Reminder policy" />.
    </p>
  ),
  play: async ({ canvas }) => {
    const citation = canvas.getByRole('link', { name: /Source acme.com \+2: Reminder policy/ });
    await expect(Math.round(citation.getBoundingClientRect().height)).toBe(20);
  },
};

const longItems = (
  <>
    <SourceItem number="1" letter="B" title="Invoice INV-1024 for Acme Industrial Supplies GmbH, October" domain="billing.acme-industrial-supplies.example.com" />
    <SourceItem number="2" letter="D" title="Payment terms" domain="docs.acme.com" />
    <SourceItem number="3" letter="C" title="Acme Corp" domain="crm.acme.com" />
  </>
);

// Stress test: long header label and titles truncate to 1 line in a 368 px column, one item per row.
export const NarrowPanel: Story = { tags: ['!dev'],
  args: { label: '3 sources with a much longer label than planned', children: longItems },
  decorators: [Story => <div className="w-[368px]"><Story /></div>],
  play: async ({ canvas, canvasElement }) => {
    const root = canvasElement.querySelector('[data-slot="sources"]') as HTMLElement;
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth);
    const label = canvasElement.querySelector('[data-slot="sources-label"]') as HTMLElement;
    await expect(label.scrollWidth).toBeGreaterThan(label.clientWidth);
    await expect(Math.round(label.getBoundingClientRect().height)).toBe(20);
    const title = canvasElement.querySelector('[data-slot="source-item-title"]') as HTMLElement;
    await expect(title.scrollWidth).toBeGreaterThan(title.clientWidth);
    const [a, b] = canvas.getAllByRole('link');
    await expect(b.getBoundingClientRect().top).toBeGreaterThan(a.getBoundingClientRect().top);
  },
};

// Stress test: long favicon text keeps its first letter and stays inside its 20 px tile.
export const LongFavicons: Story = { tags: ['!dev'],
  args: { favicon1: 'Acme', favicon2: 'Docs', favicon3: 'CRM' },
  play: async ({ canvasElement }) => {
    const tiles = [...canvasElement.querySelectorAll('[data-slot="sources-favicon"]')];
    await expect(tiles.map(t => t.textContent)).toEqual(['A', 'D', 'C']);
    for (const tile of tiles) {
      await expect(Math.round(tile.getBoundingClientRect().width)).toBe(20);
    }
  },
};

export const WithCitationsDark: Story = { ...WithCitations, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const WithCitationsCorporate: Story = { ...WithCitations, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
