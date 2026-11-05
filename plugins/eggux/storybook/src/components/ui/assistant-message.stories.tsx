import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { AssistantMessage } from './assistant-message';

const answer = (
  <>
    <p>Acme has 3 open invoices, €4,820 in total. The oldest one, INV-1024, is 12 days overdue.</p>
    <ul className="flex flex-col gap-1 pl-2">
      {['INV-1024: €2,400, due Oct 7', 'INV-1031: €1,620, due Oct 15', 'INV-1038: €800, due Oct 28'].map(item => (
        <li key={item} className="flex gap-2"><span aria-hidden="true" className="text-muted-foreground">•</span><span>{item}</span></li>
      ))}
    </ul>
    <p>Want me to draft a reminder for INV-1024?</p>
  </>
);

const meta = {
  title: 'AI Chat/Assistant Message',
  component: AssistantMessage,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'A reply from the assistant: no bubble, avatar with sparkles, actions under a finished answer. Streaming shows a caret and no actions; error keeps the partial answer with Retry. Figma: AI Chat / Assistant Message. Guide: eggux build-ui/components/ai-chat.md' } },
  },
  args: { children: answer, onCopy: fn(), onRegenerate: fn(), onFeedback: fn(), onRetry: fn() },
  decorators: [Story => <div className="w-[768px] max-w-full"><Story /></div>],
} satisfies Meta<typeof AssistantMessage>;
export default meta;
type Story = StoryObj<typeof meta>;

// Figma State=default with Show actions.
export const Default: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Copy' }));
    await expect(args.onCopy).toHaveBeenCalledTimes(1);
    await userEvent.click(canvas.getByRole('button', { name: 'Regenerate' }));
    await expect(args.onRegenerate).toHaveBeenCalledTimes(1);
    await userEvent.click(canvas.getByRole('button', { name: 'Bad response' }));
    await expect(args.onFeedback).toHaveBeenCalledWith('bad');
    // Action buttons are Button Icon default: 36 × 36.
    await expect(Math.round(canvas.getByRole('button', { name: 'Good response' }).getBoundingClientRect().height)).toBe(36);
  },
};

export const FeedbackGiven: Story = {
  args: { feedback: 'good' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Good response' })).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByRole('button', { name: 'Bad response' })).toHaveAttribute('aria-pressed', 'false');
  },
};

// Figma State=streaming: caret, no actions, content marked busy for screen readers.
export const Streaming: Story = {
  args: { state: 'streaming', children: <p>Acme has 3 open invoices, €4,820 in total. The oldest one</p> },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
    const content = canvasElement.querySelector('[data-slot="assistant-message-content"]') as HTMLElement;
    await expect(content).toHaveAttribute('aria-busy', 'true');
    await expect(content).toHaveAttribute('aria-live', 'polite');
  },
};

// Figma State=error: partial answer kept, alert with the reason, Retry.
export const ErrorState: Story = {
  name: 'Error',
  args: { state: 'error', children: <p>Acme has 3 open invoices, €4,820 in total. The oldest one</p> },
  play: async ({ canvas, args }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent('The response stopped');
    await expect(canvas.queryByRole('button', { name: 'Copy' })).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Retry' }));
    await expect(args.onRetry).toHaveBeenCalledTimes(1);
  },
};

// Figma State=stopped: muted line, then copy and regenerate only.
export const Stopped: Story = {
  args: { state: 'stopped', children: <p>Acme has 3 open invoices, €4,820 in total. The oldest one, INV-1024,</p> },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('You stopped this answer')).toBeVisible();
    await expect(canvas.getAllByRole('button').map(b => b.getAttribute('aria-label'))).toEqual(['Copy', 'Regenerate']);
  },
};

// Figma Show branch: "2 of 3" between previous and next (Button Icon sm, 32).
export const Branch: Story = {
  args: { branch: { current: 2, total: 3, onPrevious: fn(), onNext: fn() } },
  play: async ({ canvas, args }) => {
    await expect(canvas.getByLabelText('Answer 2 of 3')).toBeVisible();
    const previous = canvas.getByRole('button', { name: 'Previous answer' });
    await expect(Math.round(previous.getBoundingClientRect().height)).toBe(32);
    await userEvent.click(previous);
    await expect(args.branch!.onPrevious).toHaveBeenCalledTimes(1);
  },
};

export const BranchLast: Story = {
  args: { branch: { current: 3, total: 3 } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Next answer' })).toBeDisabled();
  },
};

// Stress test: long words and a narrow panel (368 px) wrap inside the column.
export const NarrowPanel: Story = { tags: ['!dev'],
  args: { children: <p>The reference ACME-INDUSTRIAL-SUPPLIES-GMBH-INVOICE-2026-000001024 is overdue by 12 days and the customer has not opened the last two reminders.</p> },
  decorators: [Story => <div className="w-[368px]"><Story /></div>],
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-slot="assistant-message"]') as HTMLElement;
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth);
  },
};

export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const ErrorDark: Story = { ...ErrorState, name: 'Error Dark', tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
