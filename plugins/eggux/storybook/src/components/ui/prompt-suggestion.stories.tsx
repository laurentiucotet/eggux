import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { ChartColumn, FileText, Mail, Receipt } from '@/components/icons';
import { PromptSuggestion } from './prompt-suggestion';

const meta = {
  title: 'Components/AI Chat/Prompt Suggestion',
  component: PromptSuggestion,
  parameters: {
    docs: { description: { component: 'A starter prompt or follow-up, named by its Label. chip: 2-4 follow-ups under the input or after an answer (sends at once); card: 4 empty-state tasks the assistant does well (fills the input). Figma: AI Chat / Prompt Suggestion. Guide: eggux build-ui/components/ai-chat.md' } },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof PromptSuggestion>;
export default meta;
type Story = StoryObj<typeof meta>;

// Figma Layout=chip: a button named by its label, 32 high.
export const Default: Story = {
  play: async ({ canvas, args }) => {
    const chip = canvas.getByRole('button', { name: 'Summarize open invoices' });
    await userEvent.click(chip);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    await expect(Math.round(chip.getBoundingClientRect().height)).toBe(32);
    await expect(getComputedStyle(chip).borderRadius).not.toBe('0px');
  },
};

// Figma Layout=card: icon, label, description; 240 wide.
export const Card: Story = {
  args: { layout: 'card' },
  play: async ({ canvas, args }) => {
    const card = canvas.getByRole('button', { name: /Summarize open invoices/ });
    await expect(Math.round(card.getBoundingClientRect().width)).toBe(240);
    await expect(card).toHaveTextContent('Totals, overdue days and who to remind first');
    await expect(getComputedStyle(card).paddingTop).toBe('16px');
    await userEvent.click(card);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

// Empty chat: 4 cards, each a different task.
export const EmptyStateCards: Story = {
  render: args => (
    <div className="grid w-[504px] grid-cols-2 gap-2">
      <PromptSuggestion {...args} layout="card" icon={<FileText />} label="Summarize open invoices" description="Totals, overdue days and who to remind first" />
      <PromptSuggestion {...args} layout="card" icon={<Mail />} label="Draft a payment reminder" description="A polite email for the oldest overdue invoice" />
      <PromptSuggestion {...args} layout="card" icon={<ChartColumn />} label="Compare revenue by month" description="This year against last year, in EUR" />
      <PromptSuggestion {...args} layout="card" icon={<Receipt />} label="Find duplicate invoices" description="Same customer, amount and date" />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('button')).toHaveLength(4);
  },
};

// Follow-ups after an answer: 2-4 chips; Tab walks them, Enter and Space activate.
export const FollowUps: Story = {
  render: args => (
    <div className="flex flex-wrap gap-2">
      <PromptSuggestion {...args} label="Draft a reminder for INV-1024" />
      <PromptSuggestion {...args} label="Show only overdue invoices" />
      <PromptSuggestion {...args} label="Export as CSV" />
    </div>
  ),
  play: async ({ canvas, args }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Draft a reminder for INV-1024' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Show only overdue invoices' })).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas, args }) => {
    const chip = canvas.getByRole('button', { name: 'Summarize open invoices' });
    await expect(chip).toBeDisabled();
    await userEvent.click(chip, { pointerEventsCheck: 0 });
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

// Stress test: a chip narrower than its label truncates to 1 line (Figma Narrow 50%).
export const NarrowChip: Story = { tags: ['!dev'],
  args: { label: 'Summarize open invoices with a much longer label than planned' },
  decorators: [Story => <div className="w-[120px]"><Story /></div>],
  play: async ({ canvas, canvasElement }) => {
    const chip = canvas.getByRole('button');
    await expect(chip.getBoundingClientRect().width).toBeLessThanOrEqual(120);
    await expect(Math.round(chip.getBoundingClientRect().height)).toBe(32);
    const label = canvasElement.querySelector('[data-slot="prompt-suggestion-label"]') as HTMLElement;
    await expect(label.scrollWidth).toBeGreaterThan(label.clientWidth);
  },
};

// Stress test: card label clamps to 2 lines; long text stays inside a 368 px column.
export const LongCard: Story = { tags: ['!dev'],
  args: {
    layout: 'card',
    label: 'Summarize open invoices with a much longer label than planned and then some more words',
    description: 'Totals, overdue days and who to remind first. Totals, overdue days and who to remind first',
  },
  decorators: [Story => <div className="w-[368px]"><Story /></div>],
  play: async ({ canvasElement }) => {
    const label = canvasElement.querySelector('[data-slot="prompt-suggestion-label"]') as HTMLElement;
    await expect(Math.round(label.getBoundingClientRect().height)).toBe(40);
    const card = canvasElement.querySelector('[data-slot="prompt-suggestion"]') as HTMLElement;
    await expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth);
  },
};

export const ShortLabel: Story = { tags: ['!dev'], args: { label: 'A' } };

export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const CardDark: Story = { ...Card, tags: ['!dev'], globals: { theme: 'Dark' } };
export const CardCorporate: Story = { ...Card, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
