import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { Reasoning } from './reasoning';

const meta = {
  title: 'AI Chat/Reasoning',
  component: Reasoning,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'The model\'s thinking, collapsed by default. running: spinner + "Thinking…" in a status region; done: "Thought for 12 s" opens a muted summary with a left rule. Never the answer itself. Figma: AI Chat / Reasoning. Guide: eggux build-ui/components/ai-chat.md' } },
  },
  args: { state: 'collapsed', onOpenChange: fn() },
  decorators: [Story => <div className="w-[720px] max-w-full"><Story /></div>],
} satisfies Meta<typeof Reasoning>;
export default meta;
type Story = StoryObj<typeof meta>;

// Figma State=collapsed: the person opens the summary.
export const Default: Story = {
  play: async ({ canvas, args }) => {
    const trigger = canvas.getByRole('button', { name: 'Thought for 12 s' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByText(/The user wants the open invoices/)).not.toBeInTheDocument();
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText(/The user wants the open invoices/)).toBeVisible();
    await expect(args.onOpenChange).toHaveBeenCalledWith(true);
    // Figma: the header row is 20 high (ui/label 14/20).
    await expect(Math.round(trigger.getBoundingClientRect().height)).toBe(20);
  },
};

// Figma State=running: spinner and status, announced once, nothing to open.
export const Running: Story = {
  args: { state: 'running' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent('Thinking…');
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
  },
};

// Figma State=expanded: summary with a 2 px left rule, 16 px from the text.
export const Expanded: Story = {
  args: { state: 'expanded' },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('button', { name: 'Thought for 12 s' })).toHaveAttribute('aria-expanded', 'true');
    const details = canvasElement.querySelector('[data-slot="reasoning-details"]') as HTMLElement;
    const style = getComputedStyle(details);
    await expect(style.borderLeftWidth).toBe('2px');
    await expect(style.paddingLeft).toBe('16px');
  },
};

// Keyboard: Tab reaches the label row, Enter and Space toggle it.
export const Keyboard: Story = {
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Thought for 12 s' });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard(' ');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  },
};

// Stress test: the header hugs up to 240 and the label truncates to 1 line; the chevron stays.
export const LongLabel: Story = { tags: ['!dev'],
  args: { label: 'Thought for 12 s with a much longer label than planned' },
  play: async ({ canvas, canvasElement }) => {
    const trigger = canvas.getByRole('button');
    await expect(trigger.getBoundingClientRect().width).toBeLessThanOrEqual(240);
    const text = trigger.querySelector('span') as HTMLElement;
    await expect(text.scrollWidth).toBeGreaterThan(text.clientWidth);
    await expect(canvasElement.querySelector('[data-icon="chevron-right"]')).toBeVisible();
  },
};

export const LongStatus: Story = { tags: ['!dev'],
  args: { state: 'running', status: 'Thinking… with a much longer label than planned' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status').getBoundingClientRect().width).toBeLessThanOrEqual(240);
    await expect(Math.round(canvas.getByRole('status').getBoundingClientRect().height)).toBe(20);
  },
};

// Stress test: long details in a 368 px column wrap inside the column.
export const NarrowPanel: Story = { tags: ['!dev'],
  args: {
    state: 'expanded',
    details: 'The user wants the open invoices for Acme. Search invoices by customer and status, then sum the amounts and sort by due date. Reference ACME-INDUSTRIAL-SUPPLIES-GMBH-INVOICE-2026-000001024 is the oldest.',
  },
  decorators: [Story => <div className="w-[368px]"><Story /></div>],
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-slot="reasoning"]') as HTMLElement;
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth);
  },
};

export const ExpandedDark: Story = { ...Expanded, tags: ['!dev'], globals: { theme: 'Dark' } };
export const RunningDark: Story = { ...Running, tags: ['!dev'], globals: { theme: 'Dark' } };
export const ExpandedCorporate: Story = { ...Expanded, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
