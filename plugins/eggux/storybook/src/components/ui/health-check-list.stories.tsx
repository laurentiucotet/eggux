import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { HealthCheckList, type HealthCheck } from './health-check-list';

type Args = { checks: number; failures: number; showSummary: boolean; showDetail: boolean; showLastRun: boolean; showActions: boolean };

const base: HealthCheck[] = [
  { id: 'api', label: 'Payments API', status: 'ok', detail: 'Responded in 180 ms', lastRun: '2 min ago', lastRunAt: '2026-11-13T09:58:00Z' },
  { id: 'db', label: 'Database replication', status: 'ok', detail: 'Replica lag 0.4 s', lastRun: '2 min ago', lastRunAt: '2026-11-13T09:58:00Z' },
  { id: 'cert', label: 'TLS certificate', status: 'warning', detail: 'Expires in 9 days', lastRun: '1 hour ago', lastRunAt: '2026-11-13T09:00:00Z' },
  { id: 'mail', label: 'Email delivery', status: 'failed', detail: 'Provider returned 503 for the last 3 attempts', lastRun: '5 min ago', lastRunAt: '2026-11-13T09:55:00Z' },
  { id: 'backup', label: 'Nightly backup', status: 'ok', detail: 'Completed in 14 min', lastRun: '7 hours ago', lastRunAt: '2026-11-13T03:00:00Z' },
  { id: 'queue', label: 'Job queue', status: 'ok', detail: '12 jobs waiting', lastRun: '1 min ago', lastRunAt: '2026-11-13T09:59:00Z' },
];

const meta = {
  title: 'Components/Data Display/Health Check List',
  parameters: {
    docs: {
      description: {
        component:
          'A list of automated checks, each with a status (passing, warning, failed) shown as a dot plus a word, a label, a detail and the last run time, under a summary that is a live region. Optional Run again buttons per row. Built from Status Dot, Badge and Button Icon. Code only (no Figma component yet).',
      },
    },
  },
  args: { checks: 6, failures: 1, showSummary: true, showDetail: true, showLastRun: true, showActions: true },
  argTypes: {
    checks: { name: 'Checks', control: { type: 'range', min: 0, max: 6, step: 1 }, description: 'How many checks. 0 shows the empty state.', table: { category: 'List' } },
    failures: { name: 'Failed checks', control: { type: 'range', min: 0, max: 3, step: 1 }, description: 'How many of the rows (from the end of the list) fail.', table: { category: 'List' } },
    showSummary: { name: 'Show summary', control: 'boolean', description: 'The summary with counts in the header.', table: { category: 'Parts' } },
    showDetail: { name: 'Show detail', control: 'boolean', description: 'The detail line under each label.', table: { category: 'Parts' } },
    showLastRun: { name: 'Show last run', control: 'boolean', description: 'When each check last ran.', table: { category: 'Parts' } },
    showActions: { name: 'Show Run again', control: 'boolean', description: 'A Run again button on every row.', table: { category: 'Parts' } },
  },
  render: function Render({ checks, failures, showSummary, showDetail, showLastRun, showActions }) {
    const [rerun, setRerun] = React.useState<Record<string, boolean>>({});
    const rows = base.slice(0, checks).map((c, i, arr) => ({
      ...c,
      status: failures > 0 && i >= arr.length - failures ? ('failed' as const) : c.status === 'failed' ? ('warning' as const) : c.status,
      running: rerun[c.id],
    }));
    return (
      <div className="w-[560px] max-w-full">
        <HealthCheckList
          checks={rows}
          showSummary={showSummary}
          showDetail={showDetail}
          showLastRun={showLastRun}
          onRun={showActions ? id => {
            setRerun(r => ({ ...r, [id]: true }));
            window.setTimeout(() => setRerun(r => ({ ...r, [id]: false })), 800);
          } : undefined}
        />
      </div>
    );
  },
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Everything passes. */
export const Healthy: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-[560px] max-w-full">
      <HealthCheckList checks={base.map(c => ({ ...c, status: 'ok' as const }))} />
    </div>
  ),
};

/* Hidden checks */

export const DefaultCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvas }) => {
    const list = canvas.getByRole('region', { name: 'System health' });
    await expect(list).toBeInTheDocument();
    // 6 checks: 3 ok, 2 warnings (cert, mail softened), 1 failed (the last row).
    const summary = canvas.getByRole('status');
    await expect(summary).toHaveTextContent('3 of 6 checks passing');
    await expect(summary).toHaveTextContent('2 warnings');
    await expect(summary).toHaveTextContent('1 failed');
    await expect(summary).toHaveTextContent('Action needed');
    await expect(canvas.getAllByRole('listitem')).toHaveLength(6);
    // Status is a word, not only a dot.
    await expect(canvas.getByText('Failed')).toBeVisible();
    await expect(canvas.getAllByText('Passing')).toHaveLength(3);
    // Last run has a machine readable time.
    await expect(canvas.getAllByText('2 min ago')[0]!.tagName).toBe('TIME');
  },
};

export const RunAgainCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvas }) => {
    const btn = canvas.getByRole('button', { name: 'Run Payments API again' });
    btn.focus();
    await expect(btn).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Running Payments API' })).toHaveAttribute('aria-busy', 'true'));
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Run Payments API again' })).toBeEnabled());
  },
};

export const EmptyCheck: Story = {
  tags: ['!dev'],
  args: { checks: 0 },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent('No checks yet');
    await expect(canvas.queryByRole('list')).not.toBeInTheDocument();
    await expect(canvas.getByText('Checks appear here after the first run.')).toBeVisible();
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <HealthCheckList
      title="Production environment, Frankfurt region, primary cluster"
      onRun={() => undefined}
      checks={[
        { id: 'a', label: 'Replication of the customer database to the secondary region', status: 'warning', detail: 'Replica lag has been above the 5 second threshold for the last 20 minutes', lastRun: 'Yesterday at 23:45', lastRunAt: '2026-11-12T23:45:00Z' },
        { id: 'b', label: 'Queue', status: 'failed' },
      ]}
    />
  ),
  play: async ({ canvasElement, canvas }) => {
    const root = canvasElement.firstElementChild as HTMLElement;
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + 1);
    await expect(canvas.getByRole('button', { name: /Run Queue again/ })).toBeVisible();
    // Long label and detail are cut to one line each.
    const label = canvas.getByText(/Replication of the customer database/);
    await expect(label.scrollWidth).toBeGreaterThan(label.clientWidth);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
