import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { DiffViewer, diffLines, type DiffMode } from './diff-viewer';

type Args = { mode: DiffMode; identical: boolean };

const before = `{
  "name": "Invoice",
  "currency": "USD",
  "dueDays": 14,
  "reminders": true
}`;
const after = `{
  "name": "Invoice",
  "currency": "EUR",
  "dueDays": 30,
  "reminders": true,
  "locale": "en-IE"
}`;

const meta = {
  title: 'Components/Developer/Diff Viewer',
  parameters: {
    docs: {
      description: {
        component:
          'A line diff of two texts, unified or split. Added lines have a green fill and "+", removed lines a red fill and "-", and are announced as "Added" or "Removed", so color is never the only signal. Line numbers on every line; the header counts the changes; the scroll area is reachable by keyboard. Compares whole lines. Code only (no Figma component yet).',
      },
    },
  },
  args: { mode: 'unified', identical: false },
  argTypes: {
    mode: { name: 'View', control: 'inline-radio', options: ['unified', 'split'], description: 'One column or two side by side.', table: { category: 'Diff' } },
    identical: { name: 'Identical texts', control: 'boolean', description: 'Show the "No differences" message.', table: { category: 'Diff' } },
  },
  render: ({ mode, identical }) => (
    <div className="w-[720px] max-w-full">
      <DiffViewer key={mode} defaultMode={mode} before={before} after={identical ? before : after} beforeLabel="template.json before" afterLabel="template.json after" label="Invoice template changes" />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: () => <div className="w-[720px] max-w-full"><DiffViewer before={before} after={after} beforeLabel="template.json before" afterLabel="template.json after" label="Invoice template changes" /></div>,
  play: async ({ canvas }) => {
    // 3 added (EUR, 30, locale + the comma line counts as changed: 4 added, 3 removed).
    const ops = diffLines(before, after);
    const added = ops.filter(o => o.kind === 'add').length;
    const removed = ops.filter(o => o.kind === 'del').length;
    await expect(canvas.getByText(`${added} added, ${removed} removed`)).toBeInTheDocument();
    const table = canvas.getByRole('table', { name: /Invoice template changes/ });
    // Marked by text, not only color.
    await expect(canvas.getAllByText('Added:', { exact: false }).length).toBe(added);
    await expect(canvas.getAllByText('Removed:', { exact: false }).length).toBe(removed);
    await expect(table.querySelectorAll('tr[data-kind="add"]')).toHaveLength(added);
    // Line numbers: the first row holds 1 and 1.
    const first = table.querySelector('tbody tr')!;
    await expect(first.children[0]).toHaveTextContent('1');
    await expect(first.children[1]).toHaveTextContent('1');
    // Keyboard: the scroll area takes focus, the view toggle switches to split.
    await userEvent.tab();
    await expect(canvas.getByRole('radio', { name: 'Unified' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(canvas.getByRole('radio', { name: 'Split' })).toHaveFocus());
    await userEvent.keyboard(' ');
    await waitFor(() => expect(canvas.getByRole('radio', { name: 'Split' })).toBeChecked());
    await waitFor(() => expect(document.querySelector('[data-slot="diff-viewer"]')).toHaveAttribute('data-mode', 'split'));
    // Split: both texts on one row, six columns.
    await expect(canvas.getByRole('table').querySelector('tbody tr')!.children).toHaveLength(6);
    await expect(canvas.getByRole('columnheader', { name: 'template.json before text' })).toBeInTheDocument();
    await userEvent.tab();
    await expect(canvas.getByRole('region', { name: /scrollable/ })).toHaveFocus();
  },
};

/** The same change in both views, and a diff of two equal texts. */
export const Views: Story = {
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="flex w-[720px] max-w-full flex-col gap-6"><Story /></div>],
  render: () => (
    <>
      <DiffViewer defaultMode="unified" before={before} after={after} label="Unified view" />
      <DiffViewer defaultMode="split" before={before} after={after} label="Split view" />
      <DiffViewer before={before} after={before} label="Equal texts" />
    </>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('table')).toHaveLength(2);
    await expect(canvas.getByText('No differences')).toBeVisible();
  },
};

/* Hidden checks */

export const AlgorithmCheck: Story = {
  tags: ['!dev'],
  render: () => <DiffViewer before={'a\nb\nc'} after={'a\nx\nc\nd'} label="Small change" />,
  play: async ({ canvas }) => {
    const ops = diffLines('a\nb\nc', 'a\nx\nc\nd');
    await expect(ops.map(o => `${o.kind}:${o.text}`)).toEqual(['same:a', 'del:b', 'add:x', 'same:c', 'add:d']);
    await expect(diffLines('', 'a')).toEqual([{ kind: 'add', text: 'a', newNo: 1 }]);
    await expect(canvas.getByText('2 added, 1 removed')).toBeInTheDocument();
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <DiffViewer
      defaultMode="split"
      label="Narrow diff"
      before={'const url = "https://api.acme.example/v1/organizations/org_1042/projects/prj_2210/environments/env_9"'}
      after={'const url = "https://api.acme.example/v2/organizations/org_1042/projects/prj_2210/environments/env_9"'}
    />
  ),
  play: async ({ canvas }) => {
    const viewer = document.querySelector('[data-slot="diff-viewer"]') as HTMLElement;
    // The page does not grow sideways: the table scrolls in its own focusable region.
    await expect(viewer.scrollWidth).toBeLessThanOrEqual(viewer.clientWidth + 1);
    const region = canvas.getByRole('region', { name: /scrollable/ });
    await expect(region.scrollWidth).toBeGreaterThan(region.clientWidth);
    await expect(region).toHaveAttribute('tabindex', '0');
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
