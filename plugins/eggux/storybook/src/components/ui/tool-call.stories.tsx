import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { ToolCall } from './tool-call';

const result = (
  <div className="flex flex-col gap-1">
    <p><span className="text-muted-foreground">Input:</span> customer: Acme, status: open</p>
    <p><span className="text-muted-foreground">Result:</span> 3 invoices, €4,820 in total (INV-1024, INV-1031, INV-1038)</p>
  </div>
);

const meta = {
  title: 'Components/AI Chat/Tool Call',
  component: ToolCall,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'An action the assistant takes: what runs and with which input. done collapses (the input and result behind the chevron); error explains and offers Retry; approval waits for Approve or Deny on actions that change data, send or spend. Status is in text, announced politely. Figma: AI Chat / Tool Call. Guide: eggux build-ui/components/ai-chat.md' } },
  },
  args: { status: 'done', children: result, onRetry: fn(), onApprove: fn(), onDeny: fn(), onOpenChange: fn() },
  decorators: [Story => <div className="w-[720px] max-w-full"><Story /></div>],
} satisfies Meta<typeof ToolCall>;
export default meta;
type Story = StoryObj<typeof meta>;

// Figma Status=done: collapsed; the chevron opens the input and the result.
export const Default: Story = {
  play: async ({ canvas, args, canvasElement }) => {
    const trigger = canvas.getByRole('button', { name: /Search invoices/ });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.getByText('Done')).toBeVisible();
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText(/3 invoices, €4,820/)).toBeVisible();
    await expect(args.onOpenChange).toHaveBeenCalledWith(true);
    // Figma: 720 × 62 collapsed.
    const root = canvasElement.querySelector('[data-slot="tool-call"]') as HTMLElement;
    await userEvent.click(trigger);
    await expect(Math.round(root.getBoundingClientRect().height)).toBe(62);
  },
};

// Figma Status=running: spinner and "Running" in text, polite live region.
export const Running: Story = {
  args: { status: 'running', children: undefined },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText('Running')).toBeVisible();
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
    const status = canvasElement.querySelector('[data-slot="tool-call-status"]') as HTMLElement;
    await expect(status).toHaveAttribute('aria-live', 'polite');
    const root = canvasElement.querySelector('[data-slot="tool-call"]') as HTMLElement;
    await expect(Math.round(root.getBoundingClientRect().height)).toBe(62);
  },
};

// Figma Status=error: what failed, then Retry.
export const ErrorState: Story = {
  name: 'Error',
  args: { status: 'error', children: undefined },
  play: async ({ canvas, args }) => {
    await expect(canvas.getByText('Failed')).toBeVisible();
    await expect(canvas.getByText('The invoices service did not respond in 30 s.')).toBeVisible();
    const retry = canvas.getByRole('button', { name: 'Retry' });
    await expect(Math.round(retry.getBoundingClientRect().height)).toBe(32);
    await userEvent.click(retry);
    await expect(args.onRetry).toHaveBeenCalledTimes(1);
  },
};

// Figma Status=approval: what will happen and to whom, then Deny and Approve in reading order.
export const Approval: Story = {
  args: { status: 'approval', title: 'Send reminder', description: 'invoice: INV-1024, to: billing@acme.com', children: undefined },
  play: async ({ canvas, args }) => {
    await expect(canvas.getByText('Needs approval')).toBeVisible();
    await expect(canvas.getByText(/billing@acme.com. Review the draft/)).toBeVisible();
    await expect(canvas.getAllByRole('button').map(b => b.textContent)).toEqual(['Deny', 'Approve']);
    await userEvent.click(canvas.getByRole('button', { name: 'Approve' }));
    await expect(args.onApprove).toHaveBeenCalledTimes(1);
    await userEvent.click(canvas.getByRole('button', { name: 'Deny' }));
    await expect(args.onDeny).toHaveBeenCalledTimes(1);
  },
};

// Keyboard: Tab reaches Deny then Approve; Enter activates.
export const ApprovalKeyboard: Story = {
  args: { ...Approval.args },
  play: async ({ canvas, args }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Deny' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Approve' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onApprove).toHaveBeenCalledTimes(1);
  },
};

export const DoneKeyboard: Story = {
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: /Search invoices/ });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  },
};

// Done with nothing to show: a static row, no chevron.
export const DoneWithoutDetails: Story = {
  args: { children: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
    await expect(canvas.getByText('Done')).toBeVisible();
  },
};

const longArgs = {
  title: 'Search invoices with a much longer label than planned',
  description: 'customer: Acme, status: open customer: Acme, status: open',
};

// Stress test: long title and input wrap in a 368 px column; the status stays on the right.
export const NarrowPanel: Story = { tags: ['!dev'],
  args: { ...longArgs, status: 'running', children: undefined },
  decorators: [Story => <div className="w-[368px]"><Story /></div>],
  play: async ({ canvas, canvasElement }) => {
    const root = canvasElement.querySelector('[data-slot="tool-call"]') as HTMLElement;
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth);
    const title = canvasElement.querySelector('[data-slot="tool-call-title"]') as HTMLElement;
    await expect(title.getBoundingClientRect().height).toBeGreaterThan(20);
    await expect(canvas.getByText('Running').getBoundingClientRect().right).toBeLessThanOrEqual(root.getBoundingClientRect().right);
  },
};

export const LongApproval: Story = { tags: ['!dev'],
  args: {
    ...longArgs,
    status: 'approval',
    children: undefined,
    approvalMessage: 'The assistant wants to send the reminder for INV-1024 to billing@acme.com. Review the draft before approving. The assistant wants to send the reminder for INV-1024 to billing@acme.com. Review the draft before approving.',
  },
  decorators: [Story => <div className="w-[368px]"><Story /></div>],
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-slot="tool-call"]') as HTMLElement;
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth);
  },
};

export const ApprovalDark: Story = { ...Approval, tags: ['!dev'], globals: { theme: 'Dark' } };
export const ErrorDark: Story = { ...ErrorState, name: 'Error Dark', tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const ApprovalCorporate: Story = { ...Approval, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
