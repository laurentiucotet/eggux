import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { Button } from './button';
import { TerminalOutput, terminalText, type TerminalLine } from './terminal-output';

type Args = { lines: number; showErrors: boolean; autoScroll: boolean; prompt: string };

const base: TerminalLine[] = [
  { stream: 'command', text: 'acme deploy --env production' },
  { stream: 'stdout', text: 'Building project (14 files)' },
  { stream: 'stdout', text: 'Uploading assets to eu-west' },
  { stream: 'stderr', text: 'Warning: package "legacy-invoice" is deprecated' },
  { stream: 'stdout', text: 'Running 3 database migrations' },
  { stream: 'stderr', text: 'Error: migration 0003_add_currency failed: column "currency" already exists' },
  { stream: 'command', text: 'acme logs --tail 2' },
  { stream: 'stdout', text: '14:02:11 GET /v1/invoices 200 42ms' },
  { stream: 'stdout', text: '14:02:12 POST /v1/invoices 201 118ms' },
];
const extra: TerminalLine[] = Array.from({ length: 40 }, (_, i) => ({ stream: 'stdout', text: `14:03:${String(i).padStart(2, '0')} GET /v1/customers 200 ${30 + i}ms` }));

const meta = {
  title: 'Components/Developer/Terminal Output',
  parameters: {
    docs: {
      description: {
        component:
          'A console block for command output. A live log (role="log") with commands after a prompt, stdout and stderr: stderr has a "!" mark, the destructive color and is announced as "Error", so color is never the only signal. Auto-scroll follows new lines; turn it off to read older output. Copy takes the whole output. Long lines wrap. Code only (no Figma component yet).',
      },
    },
  },
  args: { lines: 9, showErrors: true, autoScroll: true, prompt: '$' },
  argTypes: {
    lines: { name: 'Lines', control: { type: 'range', min: 0, max: 49, step: 1 }, description: 'How many lines are shown.', table: { category: 'Console' } },
    showErrors: { name: 'Show errors', control: 'boolean', description: 'Include the stderr lines.', table: { category: 'Console' } },
    autoScroll: { name: 'Auto-scroll', control: 'boolean', description: 'Follow new lines.', table: { category: 'Console' } },
    prompt: { name: 'Prompt', control: 'text', description: 'Text before a command.', table: { category: 'Parts' } },
  },
  render: ({ lines, showErrors, autoScroll, prompt }) => {
    const all = [...base, ...extra].filter(l => showErrors || l.stream !== 'stderr').slice(0, lines);
    return (
      <div className="w-[640px] max-w-full">
        <TerminalOutput key={String(autoScroll)} title="Deploy log" lines={all} prompt={prompt} defaultAutoScroll={autoScroll} />
      </div>
    );
  },
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: () => <div className="w-[640px] max-w-full"><TerminalOutput title="Deploy log" lines={base} /></div>,
  play: async ({ canvas }) => {
    const log = canvas.getByRole('log', { name: 'Deploy log' });
    await expect(log).toHaveAttribute('aria-live', 'polite');
    await expect(canvas.getAllByText('Command:', { exact: false })).toHaveLength(2);
    // stderr: a mark and a spoken "Error", not only red.
    const errors = log.querySelectorAll('[data-stream="stderr"]');
    await expect(errors).toHaveLength(2);
    await expect(errors[0]).toHaveTextContent('Error: Warning: package');
    await expect(errors[0]!.firstElementChild).toHaveTextContent('!');
    await expect(log.querySelector('[data-stream="command"]')!.firstElementChild).toHaveTextContent('$');
    // Copy and Auto-scroll are reachable.
    const toggle = canvas.getByRole('switch', { name: 'Auto-scroll' });
    await expect(toggle).toBeChecked();
    await userEvent.click(toggle);
    await waitFor(() => expect(toggle).not.toBeChecked());
    await expect(canvas.getByRole('button', { name: 'Copy Deploy log' })).toBeVisible();
    // The log takes focus so a keyboard can scroll it.
    log.focus();
    await expect(log).toHaveFocus();
    await expect(terminalText(base).split('\n')[0]).toBe('$ acme deploy --env production');
  },
};

/** New lines arrive; with Auto-scroll on the body follows, off it stays where the reader is. */
export const Streaming: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const [lines, setLines] = React.useState<TerminalLine[]>(base);
    const [follow, setFollow] = React.useState(true);
    return (
      <div className="flex w-[640px] max-w-full flex-col gap-3">
        <TerminalOutput title="Live log" lines={lines} autoScroll={follow} onAutoScrollChange={setFollow} height="10rem" />
        <div>
          <Button variant="outline" size="sm" onClick={() => setLines(l => [...l, { stream: 'stdout', text: `14:04:${String(l.length).padStart(2, '0')} GET /v1/refunds 200 51ms` }, { stream: 'stdout', text: `14:04:${String(l.length + 1).padStart(2, '0')} GET /v1/payouts 200 49ms` }, { stream: 'stdout', text: `14:04:${String(l.length + 2).padStart(2, '0')} GET /v1/balance 200 22ms` }])}>
            Add 3 lines
          </Button>
        </div>
      </div>
    );
  },
};

/* Hidden checks */

export const StreamingCheck: Story = {
  ...Streaming,
  tags: ['!dev'],
  play: async ({ canvas }) => {
    const log = canvas.getByRole('log', { name: 'Live log' });
    const atBottom = () => Math.abs(log.scrollHeight - log.clientHeight - log.scrollTop) <= 2;
    await expect(log.scrollHeight).toBeGreaterThan(log.clientHeight);
    await waitFor(() => expect(atBottom()).toBe(true));
    await userEvent.click(canvas.getByRole('button', { name: 'Add 3 lines' }));
    await waitFor(() => expect(canvas.getByText(/GET \/v1\/balance/)).toBeVisible());
    await waitFor(() => expect(atBottom()).toBe(true));
    // Off: scroll up, add lines, the reader stays.
    await userEvent.click(canvas.getByRole('switch', { name: 'Auto-scroll' }));
    log.scrollTop = 0;
    await userEvent.click(canvas.getByRole('button', { name: 'Add 3 lines' }));
    await waitFor(() => expect(canvas.getAllByText(/GET \/v1\/balance/)).toHaveLength(2));
    await expect(log.scrollTop).toBe(0);
    // On again: it jumps to the end.
    await userEvent.click(canvas.getByRole('switch', { name: 'Auto-scroll' }));
    await waitFor(() => expect(atBottom()).toBe(true));
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <TerminalOutput
      title="Deploy log for the European production environment"
      height="8rem"
      lines={[
        { stream: 'command', text: 'acme deploy --env production --region eu-west-1 --project invoicing-and-billing' },
        { stream: 'stderr', text: 'Error: cannot read /var/lib/acme/projects/prj_2210/releases/rel_2026_03_12_140211/manifest.json' },
      ]}
    />
  ),
  play: async ({ canvas }) => {
    const log = canvas.getByRole('log');
    // Long lines wrap: nothing scrolls sideways.
    await expect(log.scrollWidth).toBeLessThanOrEqual(log.clientWidth + 1);
    const block = document.querySelector('[data-slot="terminal-output"]') as HTMLElement;
    await expect(block.scrollWidth).toBeLessThanOrEqual(block.clientWidth + 1);
  },
};

export const EmptyCheck: Story = {
  tags: ['!dev'],
  render: () => <TerminalOutput title="Deploy log" lines={[]} height="6rem" />,
  play: async ({ canvas }) => {
    await expect(canvas.getByText('No output yet.')).toBeVisible();
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
