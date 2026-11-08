import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { AgentPlan, PlanStep } from './agent-plan';

const figmaSteps = (
  <>
    <PlanStep status="done" title="Find overdue invoices in Q3" description="Found 24 invoices from 9 customers" time="4 s" />
    <PlanStep status="done" title="Check payment history" description="9 customers, average delay 11 days" time="6 s" />
    <PlanStep status="running" title="Write the report" description="Summary, table by customer, chart" time="12 s" />
    <PlanStep status="pending" title="Draft reminder emails" showDescription={false} showTime={false} />
    <PlanStep status="pending" title="Ask you to review before sending" showDescription={false} showTime={false} />
  </>
);

const meta = {
  title: 'AI Chat/Agent Plan',
  component: AgentPlan,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'A multi-step task the assistant runs: title, step N of M and time left, Stop, progress, Plan Steps (pending, running, done, error) and what needs approval. Steps say what they do in the user\'s words; a failed step says what happens next. Figma: AI Chat / Agent Plan, Plan Step. Guide: eggux build-ui/components/ai-chat.md' } },
  },
  args: { children: figmaSteps, onStop: fn() },
  decorators: [Story => <div className="w-[640px] max-w-full"><Story /></div>],
} satisfies Meta<typeof AgentPlan>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, canvasElement, args }) => {
    await expect(canvas.getByRole('region', { name: 'Preparing the Q3 overdue report' })).toBeVisible();
    const bar = canvas.getByRole('progressbar', { name: 'Preparing the Q3 overdue report' });
    await expect(bar).toHaveAttribute('aria-valuenow', '50');
    // Progress default size: 8 px track.
    await expect(Math.round(bar.getBoundingClientRect().height)).toBe(8);
    const stop = canvas.getByRole('button', { name: 'Stop' });
    // Stop is Button outline sm: 32 high.
    await expect(Math.round(stop.getBoundingClientRect().height)).toBe(32);
    await userEvent.click(stop);
    await expect(args.onStop).toHaveBeenCalledTimes(1);
    // Steps are an ordered list; status is in text, not color alone.
    const items = canvas.getAllByRole('listitem');
    await expect(items).toHaveLength(5);
    await expect(items[0]).toHaveTextContent('Done: Find overdue invoices in Q3');
    await expect(items[2]).toHaveTextContent('In progress: Write the report');
    await expect(items[3]).toHaveTextContent('Pending: Draft reminder emails');
    // Status line is a polite live region.
    const status = canvasElement.querySelector('[data-slot="agent-plan-status"]') as HTMLElement;
    await expect(status).toHaveAttribute('aria-live', 'polite');
  },
};

// Plan Step Status: pending, running, done, error. Figma: 560 × 38 with a description.
export const StepStatuses: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ol className="flex w-[560px] flex-col gap-6">
      <PlanStep status="pending" />
      <PlanStep status="running" />
      <PlanStep status="done" />
      <PlanStep status="error" />
    </ol>
  ),
  play: async ({ canvas }) => {
    const items = canvas.getAllByRole('listitem');
    for (const item of items) await expect(Math.round(item.getBoundingClientRect().height)).toBe(38);
    await expect(items.map(i => i.getAttribute('data-status'))).toEqual(['pending', 'running', 'done', 'error']);
    await expect(items[3]).toHaveTextContent('Failed: Find overdue invoices in Q3');
    await expect(items[3]).toHaveTextContent('The invoices service did not respond. Retrying in 10 s.');
    await expect(items[3]).not.toHaveTextContent('Found 24 invoices');
  },
};

// A failed step says what failed and what happens next; the plan keeps going.
export const WithError: Story = {
  args: {
    status: 'Step 2 of 5 · retrying',
    progress: 20,
    children: (
      <>
        <PlanStep status="done" title="Find overdue invoices in Q3" description="Found 24 invoices from 9 customers" time="4 s" />
        <PlanStep status="error" title="Check payment history" error="The payments service did not respond. Retrying in 10 s." time="30 s" />
        <PlanStep status="pending" title="Write the report" showDescription={false} showTime={false} />
      </>
    ),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '20');
    await expect(canvas.getByText('The payments service did not respond. Retrying in 10 s.')).toBeVisible();
  },
};

// Show stop off and Show footer off.
export const WithoutStopAndFooter: Story = {
  args: { showStop: false, showFooter: false },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
    await expect(canvas.queryByText(/Nothing is sent without your approval/)).not.toBeInTheDocument();
  },
};

// Finished: every step done, progress full, no Stop.
export const Finished: Story = {
  args: {
    status: 'Done in 48 s',
    progress: 100,
    showStop: false,
    children: (
      <>
        <PlanStep status="done" title="Find overdue invoices in Q3" description="Found 24 invoices from 9 customers" time="4 s" />
        <PlanStep status="done" title="Write the report" description="Q3 overdue invoices report, 3 pages" time="18 s" />
      </>
    ),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  },
};

// Keyboard: Stop is reachable with Tab and activates with Enter.
export const Keyboard: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Stop' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onStop).toHaveBeenCalledTimes(1);
  },
};

// Stress test: 368 px column, long title wraps, status truncates to one line, Stop keeps its size.
export const NarrowLongText: Story = { tags: ['!dev'],
  args: {
    title: 'Preparing the overdue report for Acme Industrial Supplies GmbH and its 14 subsidiaries in the EU',
    status: 'Step 3 of 12 · about 4 min left · waiting for the payments service to answer',
    children: (
      <>
        <PlanStep status="done" title="Find overdue invoices for ACME-INDUSTRIAL-SUPPLIES-GMBH-2026" description="Found 1,204 invoices from 312 customers, EUR 2,480,120 in total" time="1 min 12 s" />
        <PlanStep status="running" title="Check payment history" description="312 customers" time="40 s" />
      </>
    ),
  },
  decorators: [Story => <div className="w-[368px]"><Story /></div>],
  play: async ({ canvas, canvasElement }) => {
    const root = canvasElement.querySelector('[data-slot="agent-plan"]') as HTMLElement;
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth);
    const status = canvasElement.querySelector('[data-slot="agent-plan-status"]') as HTMLElement;
    await expect(Math.round(status.getBoundingClientRect().height)).toBe(16);
    await expect(status.scrollWidth).toBeGreaterThan(status.clientWidth);
    const title = canvas.getByRole('heading');
    await expect(title.getBoundingClientRect().height).toBeGreaterThan(20);
    await expect(Math.round(canvas.getByRole('button', { name: 'Stop' }).getBoundingClientRect().height)).toBe(32);
  },
};

// Stress test: many steps.
export const ManySteps: Story = { tags: ['!dev'],
  args: {
    status: 'Step 7 of 12 · about 3 min left',
    progress: 60,
    children: (
      <>
        {Array.from({ length: 12 }, (_, i) => (
          <PlanStep
            key={i}
            status={i < 6 ? 'done' : i === 6 ? 'running' : 'pending'}
            title={`Send reminder ${i + 1} to Acme customer ${i + 1}`}
            description={i < 7 ? `Invoice INV-${1024 + i}, EUR ${(i + 1) * 240}` : undefined}
            showDescription={i < 7}
            time={i < 7 ? `${i + 2} s` : undefined}
            showTime={i < 7}
          />
        ))}
      </>
    ),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('listitem')).toHaveLength(12);
  },
};

export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const StepStatusesDark: Story = { ...StepStatuses, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
