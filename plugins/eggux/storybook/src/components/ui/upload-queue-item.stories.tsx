import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { UploadQueueItem, type UploadQueueState } from './upload-queue-item';

type Args = { name: string; size: number; state: UploadQueueState; progress: number; error: string; width: number };

const meta = {
  title: 'Components/Data Transfer/Upload Queue Item',
  parameters: {
    docs: {
      description: {
        component:
          'One file in an upload queue: name, size, state text, a progress bar while uploading and the actions of the state (Cancel, Retry, Remove). The parent runs the upload; nothing is read or sent here. With focus in the row, Escape cancels a waiting or running upload and Delete removes a finished or failed one. Code only (no Figma component yet).',
      },
    },
  },
  args: { name: 'customers-2025.csv', size: 2_450_000, state: 'uploading', progress: 42, error: 'The file is larger than 25 MB.', width: 420 },
  argTypes: {
    name: { name: 'File name', control: 'text', description: 'Name with extension; truncates on one line.', table: { category: 'Item' } },
    size: { name: 'Size (bytes)', control: { type: 'range', min: 0, max: 50_000_000, step: 1000 }, description: 'File size.', table: { category: 'Item' } },
    state: { name: 'State', control: 'select', options: ['queued', 'uploading', 'done', 'failed'], description: 'Where the file is in the queue.', table: { category: 'Item' } },
    progress: { name: 'Progress', control: { type: 'range', min: 0, max: 100, step: 1 }, description: 'Percent uploaded (uploading only).', table: { category: 'Item' } },
    error: { name: 'Error', control: 'text', description: 'Reason shown when the state is failed.', table: { category: 'Parts' } },
    width: { name: 'Width', control: { type: 'range', min: 240, max: 640, step: 4 }, description: 'Container width in px.', table: { category: 'Item' } },
  },
  render: ({ width, ...args }) => (
    <div style={{ width }} className="max-w-full">
      <UploadQueueItem {...args} onCancel={fn()} onRetry={fn()} onRemove={fn()} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: () => <UploadQueueItem name="customers-2025.csv" size={2_450_000} state="uploading" progress={42} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('group', { name: 'customers-2025.csv' })).toBeVisible();
    await expect(canvas.getByRole('progressbar', { name: 'Uploading customers-2025.csv' })).toHaveAttribute('aria-valuenow', '42');
    await expect(canvas.getByText('2.5 MB')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Cancel upload of customers-2025.csv' })).toBeVisible();
  },
};

const files: { name: string; size: number; state: UploadQueueState; progress?: number; error?: string }[] = [
  { name: 'queued.csv', size: 12_400, state: 'queued' },
  { name: 'running.csv', size: 3_100_000, state: 'uploading', progress: 64 },
  { name: 'finished.xlsx', size: 880_000, state: 'done' },
  { name: 'broken.json', size: 31_000_000, state: 'failed', error: 'The file is larger than 25 MB.' },
];

/** The four states side by side, with the actions each one offers. */
export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ul className="m-0 flex w-[420px] max-w-full list-none flex-col gap-2 p-0">
      {files.map(f => (
        <li key={f.name}><UploadQueueItem {...f} /></li>
      ))}
    </ul>
  ),
};

function Queue() {
  const [items, setItems] = React.useState(files);
  const patch = (name: string, next: Partial<(typeof files)[number]> | null) =>
    setItems(list => (next ? list.map(f => (f.name === name ? { ...f, ...next } : f)) : list.filter(f => f.name !== name)));
  return (
    <div className="flex w-[420px] max-w-full flex-col gap-2">
      <ul aria-label="Upload queue" className="m-0 flex list-none flex-col gap-2 p-0">
        {items.map(f => (
          <li key={f.name}>
            <UploadQueueItem
              {...f}
              onCancel={() => patch(f.name, null)}
              onRemove={() => patch(f.name, null)}
              onRetry={() => patch(f.name, { state: 'uploading', progress: 5, error: undefined })}
            />
          </li>
        ))}
      </ul>
      <p aria-live="polite" className="m-0 text-xs text-muted-foreground">{items.length} {items.length === 1 ? 'file' : 'files'} in the queue</p>
    </div>
  );
}

/** A working queue: cancel and remove take a file out, retry sends a failed one again. */
export const InQueue: Story = {
  parameters: { controls: { disable: true } },
  render: () => <Queue />,
};

export const InQueueCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <Queue />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Retry upload of broken.json' }));
    await waitFor(() => expect(canvas.getByRole('progressbar', { name: 'Uploading broken.json' })).toBeVisible());
    await userEvent.click(canvas.getByRole('button', { name: 'Cancel upload of queued.csv' }));
    await waitFor(() => expect(canvas.queryByRole('group', { name: 'queued.csv' })).toBeNull());
    await expect(canvas.getByText('3 files in the queue')).toBeVisible();
    // Keyboard: focus the Remove button of the finished file, Delete removes the row.
    const remove = canvas.getByRole('button', { name: 'Remove finished.xlsx from the list' });
    remove.focus();
    await userEvent.keyboard('{Delete}');
    await waitFor(() => expect(canvas.queryByRole('group', { name: 'finished.xlsx' })).toBeNull());
    // Escape cancels a running upload.
    canvas.getByRole('button', { name: 'Cancel upload of running.csv' }).focus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(canvas.queryByRole('group', { name: 'running.csv' })).toBeNull());
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <ul className="m-0 flex list-none flex-col gap-2 p-0">
      <li><UploadQueueItem name="quarterly-customer-export-final-version-2025-with-all-columns.xlsx" size={1_234_567_890} state="failed" error="The file is larger than 25 MB and cannot be uploaded in one piece." /></li>
      <li><UploadQueueItem name="quarterly-customer-export-final-version-2025-with-all-columns.xlsx" size={1_234_567} state="uploading" progress={100} /></li>
    </ul>
  ),
  play: async ({ canvas }) => {
    const rows = canvas.getAllByRole('group');
    for (const row of rows) {
      await expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth + 1);
    }
    const names = canvas.getAllByText(/quarterly-customer/);
    for (const n of names) await expect(n.scrollWidth).toBeGreaterThan(n.clientWidth);
    await expect(canvas.getAllByRole('button')).toHaveLength(3);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
