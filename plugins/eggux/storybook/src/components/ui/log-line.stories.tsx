import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { LogLine, type LogLevel, type LogField } from './log-line';

type Args = { level: LogLevel; message: string; time: string; showFields: boolean; expanded: boolean };

const fields: LogField[] = [
  { key: 'request_id', value: 'req_8f3a21c9' },
  { key: 'status', value: 502 },
  { key: 'duration_ms', value: 1840 },
  { key: 'retry', value: false },
];

const meta = {
  title: 'Components/Developer/Log Line',
  parameters: {
    docs: {
      description: {
        component:
          'One structured log entry: level badge (the level is a word, not only a color), time, message and, with fields, a button that opens a list of key and value pairs. The message is cut to one line when closed and wraps when open; long values break instead of scrolling. Code only (no Figma component yet).',
      },
    },
  },
  args: { level: 'error', message: 'Upstream payment gateway returned 502', time: '2026-03-12T14:02:11.482Z', showFields: true, expanded: false },
  argTypes: {
    level: { name: 'Level', control: 'select', options: ['debug', 'info', 'warn', 'error'], description: 'Severity of the entry.', table: { category: 'Line' } },
    message: { name: 'Message', control: 'text', description: 'What happened, in one sentence.', table: { category: 'Line' } },
    time: { name: 'Time', control: 'text', description: 'ISO time of the entry.', table: { category: 'Line' } },
    showFields: { name: 'Show fields', control: 'boolean', description: 'Structured fields that open under the line.', table: { category: 'Parts' } },
    expanded: { name: 'Expanded', control: 'boolean', description: 'Start with the fields open.', table: { category: 'Parts' } },
  },
  render: ({ level, message, time, showFields, expanded }) => (
    <div className="w-[560px] max-w-full">
      <LogLine key={String(expanded)} level={level} message={message} time={time} timeLabel={time.slice(11, 23)} fields={showFields ? fields : []} defaultExpanded={expanded} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: () => {
    const onExpandedChange = fn();
    return <div className="w-[560px] max-w-full"><LogLine level="error" message="Upstream payment gateway returned 502" time="2026-03-12T14:02:11.482Z" timeLabel="14:02:11.482" fields={fields} onExpandedChange={onExpandedChange} /></div>;
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: /Upstream payment gateway/ });
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.getByText('error')).toBeVisible();
    await expect(canvas.getByText('14:02:11.482')).toHaveAttribute('datetime', '2026-03-12T14:02:11.482Z');
    await expect(canvas.queryByText('req_8f3a21c9')).not.toBeVisible();
    // Keyboard: Tab, Enter opens, Space closes.
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(button).toHaveAttribute('aria-expanded', 'true'));
    await expect(canvas.getByText('req_8f3a21c9')).toBeVisible();
    await userEvent.keyboard(' ');
    await waitFor(() => expect(button).toHaveAttribute('aria-expanded', 'false'));
  },
};

const levels: { level: LogLevel; message: string; withFields: boolean }[] = [
  { level: 'debug', message: 'Cache miss for customer cus_1042', withFields: false },
  { level: 'info', message: 'Invoice INV-1041 sent to ana@acme.example', withFields: true },
  { level: 'warn', message: 'Retrying webhook delivery (attempt 2 of 5)', withFields: true },
  { level: 'error', message: 'Upstream payment gateway returned 502', withFields: true },
];

/** The four levels in a log, one of them open. */
export const Levels: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ul aria-label="Application log" className="m-0 flex w-[560px] max-w-full list-none flex-col p-0">
      {levels.map((l, i) => (
        <li key={l.level}>
          <LogLine level={l.level} message={l.message} time={`2026-03-12T14:02:1${i}.100Z`} timeLabel={`14:02:1${i}.100`} fields={l.withFields ? fields : []} defaultExpanded={l.level === 'warn'} />
        </li>
      ))}
    </ul>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('listitem')).toHaveLength(4);
    // Every level is a word.
    for (const word of ['debug', 'info', 'warn', 'error']) await expect(canvas.getByText(word)).toBeVisible();
    // The warn line starts open, the others closed; the debug line has no toggle.
    await expect(canvas.getAllByRole('button')).toHaveLength(3);
    await expect(canvas.getByRole('button', { name: /Retrying webhook/ })).toHaveAttribute('aria-expanded', 'true');
  },
};

/* Hidden checks */

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <ul aria-label="Long entries" className="m-0 flex list-none flex-col gap-2 p-0">
      <li>
        <LogLine
          level="error"
          message="Failed to write the export file because the destination bucket rejected the request with a very long error message"
          time="2026-03-12T14:02:11.482Z"
          timeLabel="14:02:11.482"
          fields={[{ key: 'trace_id', value: 'a3b1c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0' }]}
        />
      </li>
      <li>
        <LogLine
          defaultExpanded
          level="warn"
          message="Slow query on invoices table taking much longer than expected today"
          time="2026-03-12T14:02:12.000Z"
          timeLabel="14:02:12.000"
          fields={[{ key: 'trace_id', value: 'a3b1c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0' }]}
        />
      </li>
    </ul>
  ),
  play: async ({ canvas }) => {
    const list = canvas.getByRole('list', { name: 'Long entries' });
    await expect(list.scrollWidth).toBeLessThanOrEqual(list.clientWidth + 1);
    const closed = canvas.getByText(/Failed to write the export file/);
    // Closed: one line, cut.
    await expect(closed.scrollWidth).toBeGreaterThan(closed.clientWidth);
    // Open: the long value breaks, the line wraps.
    const open = canvas.getByText(/Slow query on invoices/);
    await expect(open.getBoundingClientRect().height).toBeGreaterThan(24);
  },
};

export const DefaultDark: Story = { ...Levels, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Levels, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
