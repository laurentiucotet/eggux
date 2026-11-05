import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { AiReviewBar } from './ai-review-bar';

const meta = {
  title: 'AI Chat/AI Review Bar',
  component: AiReviewBar,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Floating toolbar to review AI edits one by one: position, previous and next, Reject and Accept, Reject all and Accept all. Arrows move between buttons, Backspace rejects. Wraps below about 700 px; the count truncates. Figma: AI Chat / AI Review Bar. Guide: eggux build-ui/patterns/ai-chat.md' } },
  },
  args: { onPrevious: fn(), onNext: fn(), onAccept: fn(), onReject: fn(), onAcceptAll: fn(), onRejectAll: fn() },
  decorators: [Story => <div className="w-[698px] max-w-full"><Story /></div>],
} satisfies Meta<typeof AiReviewBar>;
export default meta;
type Story = StoryObj<typeof meta>;

const bar = (el: HTMLElement) => el.querySelector('[data-slot="ai-review-bar"]') as HTMLElement;
const count = (el: HTMLElement) => el.querySelector('[data-slot="ai-review-bar-count"]') as HTMLElement;

// Figma default: 698 × 50 in one row. Accept, Reject, navigation and bulk actions call back.
export const Default: Story = {
  play: async ({ canvas, args, canvasElement }) => {
    await expect(canvas.getByRole('toolbar', { name: 'Review suggestions' })).toBeVisible();
    await expect(Math.round(bar(canvasElement).getBoundingClientRect().height)).toBe(50);
    await expect(count(canvasElement)).toHaveAttribute('aria-live', 'polite');
    await userEvent.click(canvas.getByRole('button', { name: 'Accept' }));
    await expect(args.onAccept).toHaveBeenCalledTimes(1);
    await userEvent.click(canvas.getByRole('button', { name: 'Reject' }));
    await expect(args.onReject).toHaveBeenCalledTimes(1);
    await userEvent.click(canvas.getByRole('button', { name: 'Next suggestion' }));
    await expect(args.onNext).toHaveBeenCalledTimes(1);
    await userEvent.click(canvas.getByRole('button', { name: 'Accept all' }));
    await expect(args.onAcceptAll).toHaveBeenCalledTimes(1);
    // Buttons are Button sm / Button Icon sm: 32 tall.
    await expect(Math.round(canvas.getByRole('button', { name: 'Previous suggestion' }).getBoundingClientRect().height)).toBe(32);
    await expect(Math.round(canvas.getByRole('button', { name: 'Accept all' }).getBoundingClientRect().height)).toBe(32);
  },
};

// Keyboard (WAI-ARIA toolbar): one Tab stop, arrows and Home/End move, Enter activates, Backspace rejects.
export const Keyboard: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.tab();
    const previous = canvas.getByRole('button', { name: 'Previous suggestion' });
    await expect(previous).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('button', { name: 'Next suggestion' })).toHaveFocus();
    await userEvent.keyboard('{End}');
    await expect(canvas.getByRole('button', { name: 'Accept all' })).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    await expect(canvas.getByRole('button', { name: 'Reject all' })).toHaveFocus();
    await userEvent.keyboard('{Home}');
    await expect(previous).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    await expect(canvas.getByRole('button', { name: 'Accept all' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onAcceptAll).toHaveBeenCalledTimes(1);
    await userEvent.keyboard('{Backspace}');
    await expect(args.onReject).toHaveBeenCalledTimes(1);
    // Only one button is in the Tab order.
    await expect(canvas.getAllByRole('button').filter(b => b.tabIndex === 0)).toHaveLength(1);
  },
};

// Figma Show bulk actions off.
export const WithoutBulkActions: Story = {
  args: { showBulkActions: false },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button', { name: 'Accept all' })).not.toBeInTheDocument();
    await expect(canvas.queryByRole('button', { name: 'Reject all' })).not.toBeInTheDocument();
  },
};

// At the ends previous or next is disabled.
export const FirstSuggestion: Story = {
  args: { count: '1 of 7 suggestions', hasPrevious: false },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Previous suggestion' })).toBeDisabled();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Next suggestion' })).toHaveFocus();
  },
};

// Stress: long count truncates to one line; short count keeps the bar layout.
export const LongText: Story = { tags: ['!dev'],
  args: { count: '3 of 7 suggestions with a much longer label than planned for the invoice review' },
  play: async ({ canvasElement }) => {
    const el = count(canvasElement);
    await expect(Math.round(el.getBoundingClientRect().height)).toBe(20);
    await expect(el.scrollWidth).toBeGreaterThan(el.clientWidth);
  },
};

export const ShortText: Story = { tags: ['!dev'], args: { count: 'A' } };

// Stress: 276 / 368 px columns. Actions wrap to more rows (row gap 8); count stays at least 128 and one line.
export const Column276: Story = { tags: ['!dev'],
  args: { count: '3 of 7 suggestions with a much longer label than planned' },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  play: async ({ canvasElement }) => {
    const root = bar(canvasElement);
    await expect(root.getBoundingClientRect().height).toBeGreaterThan(50);
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth);
    const el = count(canvasElement);
    await expect(Math.round(el.getBoundingClientRect().width)).toBeGreaterThanOrEqual(128);
    await expect(Math.round(el.getBoundingClientRect().height)).toBe(20);
  },
};
export const Column368: Story = { tags: ['!dev'], ...Column276, decorators: [Story => <div className="w-[368px]"><Story /></div>] };

export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
