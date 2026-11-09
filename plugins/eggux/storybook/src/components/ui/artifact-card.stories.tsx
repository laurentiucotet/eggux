import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { ArtifactCard } from './artifact-card';

const meta = {
  title: 'Components/AI Chat/Artifact Card',
  component: ArtifactCard,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Something the assistant made (document, chart, table) as a card in the conversation; Open shows it in a side canvas or its page. Meta names type, size and version; each regeneration is a new version. Figma: AI Chat / Artifact Card. Guide: eggux build-ui/components/ai-chat.md' } },
  },
  args: { onOpen: fn() },
  decorators: [Story => <div className="w-[360px] max-w-full"><Story /></div>],
} satisfies Meta<typeof ArtifactCard>;
export default meta;
type Story = StoryObj<typeof meta>;

// Figma Type=document, State=default.
export const Default: Story = {
  play: async ({ canvas, canvasElement, args }) => {
    const root = canvasElement.querySelector('[data-slot="artifact-card"]') as HTMLElement;
    // Figma: 360 × 66, icon tile 40, Open is Button sm (32).
    await expect(Math.round(root.getBoundingClientRect().height)).toBe(66);
    const tile = canvasElement.querySelector('[data-slot="artifact-card-icon"]') as HTMLElement;
    await expect(Math.round(tile.getBoundingClientRect().width)).toBe(40);
    // Open is named with the title; the type is in the meta text.
    const open = canvas.getByRole('button', { name: 'Open Q3 overdue invoices report' });
    await expect(Math.round(open.getBoundingClientRect().height)).toBe(32);
    await expect(canvas.getByText('Document · 3 pages · v2')).toBeVisible();
    await userEvent.click(open);
    await expect(args.onOpen).toHaveBeenCalledTimes(1);
  },
};

// Figma Type: document, chart, table, each with its own default title and meta.
export const Types: Story = {
  render: args => (
    <div className="flex flex-col gap-6">
      <ArtifactCard {...args} type="document" />
      <ArtifactCard {...args} type="chart" />
      <ArtifactCard {...args} type="table" />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Open Overdue by customer' })).toBeVisible();
    await expect(canvas.getByText('Chart · bar · 9 customers')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Open Reminder list' })).toBeVisible();
    await expect(canvas.getByText('Table · 24 rows · 5 columns')).toBeVisible();
  },
};

// Figma State=hover: the card fills with accent on pointer hover (CSS :hover, which synthetic
// events cannot trigger, so the test checks the hover rule is on the card).
export const Hover: Story = {
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-slot="artifact-card"]') as HTMLElement;
    await expect(root.className).toContain('hover:bg-accent');
  },
};

// Keyboard: Tab reaches Open, Enter opens.
export const Keyboard: Story = {
  args: { type: 'table', title: 'Reminder list v3', meta: 'Table · 24 rows · 5 columns · v3' },
  play: async ({ canvas, args }) => {
    await userEvent.tab();
    const open = canvas.getByRole('button', { name: 'Open Reminder list v3' });
    await expect(open).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onOpen).toHaveBeenCalledTimes(1);
  },
};

// Stress test: long title truncates to one line; Open keeps its size in a 276 px column.
export const LongTitleNarrow: Story = { tags: ['!dev'],
  args: { title: 'Q3 overdue invoices report for Acme Industrial Supplies GmbH and all EU subsidiaries', meta: 'Document · 48 pages · v12' },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  play: async ({ canvas, canvasElement }) => {
    const root = canvasElement.querySelector('[data-slot="artifact-card"]') as HTMLElement;
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth);
    await expect(Math.round(root.getBoundingClientRect().height)).toBe(66);
    const title = canvasElement.querySelector('[data-slot="artifact-card-title"]') as HTMLElement;
    await expect(title.scrollWidth).toBeGreaterThan(title.clientWidth);
    await expect(Math.round(canvas.getByRole('button', { name: /^Open Q3/ }).getBoundingClientRect().height)).toBe(32);
  },
};

export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const TypesDark: Story = { ...Types, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
