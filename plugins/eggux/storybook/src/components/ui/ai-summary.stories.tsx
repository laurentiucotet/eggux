import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { AiNotice, AiSummary } from './ai-summary';

const summary = 'Acme Industrial has 3 open invoices, €12,450 in total. INV-1041 is 12 days overdue; this customer usually pays 9 days late. Their finance team promised payment by Oct 31 in a call on Oct 14.';

const meta = {
  title: 'Components/AI Chat/AI Summary',
  component: AiSummary,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'What matters now on a record or report page, in 2-4 sentences with numbers and dates from named sources. Generating shows what it reads; error says what failed with Try again; the disclaimer uses the same words everywhere. Figma: AI Chat / AI Summary (and AI Notice). Guide: eggux build-ui/components/ai-chat.md' } },
  },
  args: { children: summary, onRegenerate: fn(), onCopy: fn(), onFeedback: fn(), onRetry: fn() },
  decorators: [Story => <div className="w-[640px] max-w-full"><Story /></div>],
} satisfies Meta<typeof AiSummary>;
export default meta;
type Story = StoryObj<typeof meta>;

const root = (el: HTMLElement) => el.querySelector('[data-slot="ai-summary"]') as HTMLElement;

// Figma State=ready with Show feedback and Show disclaimer.
export const Default: Story = {
  play: async ({ canvas, args }) => {
    await expect(canvas.getByRole('region', { name: 'Summary' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Regenerate summary' }));
    await expect(args.onRegenerate).toHaveBeenCalledTimes(1);
    await userEvent.click(canvas.getByRole('button', { name: 'Copy summary' }));
    await expect(args.onCopy).toHaveBeenCalledTimes(1);
    await userEvent.click(canvas.getByRole('button', { name: 'Good summary' }));
    await expect(args.onFeedback).toHaveBeenCalledWith('good');
    await expect(canvas.getByText('AI can make mistakes. Check important details.')).toBeVisible();
    // Header and feedback actions are Button Icon default: 36 × 36.
    await expect(Math.round(canvas.getByRole('button', { name: 'Bad summary' }).getBoundingClientRect().height)).toBe(36);
  },
};

// Keyboard: Tab reaches regenerate, copy, good, bad in order; Enter activates.
export const Keyboard: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Regenerate summary' })).toHaveFocus();
    await userEvent.tab();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Good summary' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onFeedback).toHaveBeenCalledWith('good');
  },
};

export const FeedbackGiven: Story = {
  args: { feedback: 'bad' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Bad summary' })).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByRole('button', { name: 'Good summary' })).toHaveAttribute('aria-pressed', 'false');
  },
};

// Meta opens the sources when the page can show them.
export const WithSources: Story = {
  args: { onOpenSources: fn() },
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: '4 sources · generated 2 min ago' }));
    await expect(args.onOpenSources).toHaveBeenCalledTimes(1);
  },
};

// Figma Show feedback and Show disclaimer off.
export const OptionsOff: Story = {
  args: { showFeedback: false, showDisclaimer: false },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button', { name: 'Good summary' })).not.toBeInTheDocument();
    await expect(canvas.queryByText('AI can make mistakes. Check important details.')).not.toBeInTheDocument();
  },
};

// Figma State=generating: 640 × 170, what it reads, busy for screen readers, no actions.
export const Generating: Story = {
  args: { state: 'generating' },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText('Reading 4 sources…')).toBeVisible();
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
    const body = canvasElement.querySelector('[data-slot="ai-summary-body"]') as HTMLElement;
    await expect(body).toHaveAttribute('aria-busy', 'true');
    await expect(body).toHaveAttribute('aria-live', 'polite');
    await expect(Math.round(root(canvasElement).getBoundingClientRect().height)).toBe(170);
  },
};

// Figma State=error: 640 × 130, what failed and Try again.
export const ErrorState: Story = {
  name: 'Error',
  args: { state: 'error' },
  play: async ({ canvas, args, canvasElement }) => {
    await expect(canvas.getByText('Could not write the summary: the activity log did not load.')).toBeVisible();
    const retry = canvas.getByRole('button', { name: 'Try again' });
    await expect(Math.round(retry.getBoundingClientRect().height)).toBe(32);
    await userEvent.click(retry);
    await expect(args.onRetry).toHaveBeenCalledTimes(1);
    await expect(Math.round(root(canvasElement).getBoundingClientRect().height)).toBe(130);
  },
};

// Stress: long text clamps at 6 lines; long title and meta wrap; disclaimer wraps, never truncates.
const longText = Array.from({ length: 4 }, () => summary).join(' ');
export const LongText: Story = { tags: ['!dev'],
  args: { title: 'Summary of the Acme Industrial account for the last quarter with a much longer label', meta: '4 sources · generated 2 min ago · 4 sources · generated 2 min ago', children: longText },
  play: async ({ canvasElement }) => {
    const content = canvasElement.querySelector('[data-slot="ai-summary-content"]') as HTMLElement;
    await expect(Math.round(content.getBoundingClientRect().height)).toBeLessThanOrEqual(6 * 20);
    await expect(content.scrollHeight).toBeGreaterThan(content.clientHeight);
  },
};

export const ShortText: Story = { tags: ['!dev'], args: { title: 'A', meta: 'A', children: 'Paid.' } };

// Stress: 276 and 368 px columns; nothing overflows, the disclaimer wraps.
export const Column276: Story = { tags: ['!dev'],
  args: { title: 'Summary with a much longer label than planned', children: longText },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  play: async ({ canvasElement }) => {
    const el = root(canvasElement);
    await expect(el.scrollWidth).toBeLessThanOrEqual(el.clientWidth);
    const disclaimer = canvasElement.querySelector('[data-slot="ai-notice"]') as HTMLElement;
    await expect(disclaimer.getBoundingClientRect().height).toBeGreaterThan(16);
  },
};

export const Column368: Story = { tags: ['!dev'],
  args: Column276.args,
  decorators: [Story => <div className="w-[368px]"><Story /></div>],
  play: async ({ canvasElement }) => {
    const el = root(canvasElement);
    await expect(el.scrollWidth).toBeLessThanOrEqual(el.clientWidth);
    await expect(Math.round(el.getBoundingClientRect().width)).toBe(368);
  },
};

// Figma AI Notice Type=label (106 × 20) and Type=disclaimer.
export const Notice: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <AiNotice />
      <AiNotice type="disclaimer" />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText('AI generated')).toBeVisible();
    const label = canvasElement.querySelector('[data-type="label"]') as HTMLElement;
    await expect(Math.round(label.getBoundingClientRect().height)).toBe(20);
    await expect(canvas.getByText('AI can make mistakes. Check important details.')).toBeVisible();
  },
};

export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const GeneratingDark: Story = { ...Generating, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
