import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { PullToRefresh } from './pull-to-refresh';

type Args = { threshold: number; rows: number };

const rows = (n: number) =>
  Array.from({ length: n }, (_, i) => (
    <li key={i} className="border-b border-border px-4 py-3 text-sm leading-5">
      Invoice INV-{2040 - i}
    </li>
  ));

const wait = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

const meta = {
  title: 'Components/Mobile/Pull To Refresh',
  decorators: [Story => <div className="w-[390px] max-w-full overflow-hidden rounded-lg border border-border"><Story /></div>],
  parameters: {
    docs: {
      description: {
        component:
          'Wraps a scrolling list on mobile: drag down at the top and release past the threshold to refresh; a spinner shows while it runs. Pulling is a shortcut: a "Refresh" button is the first tab stop and a polite status announces "Refreshing" and "Updated". No motion under prefers-reduced-motion. Drag the list in the story to try it. Code only (no Figma component yet).',
      },
    },
  },
  args: { threshold: 80, rows: 8 },
  argTypes: {
    threshold: { name: 'Threshold', control: { type: 'range', min: 40, max: 160, step: 10 }, description: 'How far to pull before release refreshes (px).', table: { category: 'Behavior' } },
    rows: { name: 'Rows', control: { type: 'range', min: 2, max: 20, step: 1 }, description: 'Rows in the list.', table: { category: 'Content' } },
  },
  render: ({ threshold, rows: n }) => (
    <PullToRefresh className="h-80" threshold={threshold} onRefresh={() => wait(1200)}>
      <ul className="m-0 list-none p-0">{rows(n)}</ul>
    </PullToRefresh>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: () => {
    const onRefresh = fn(() => wait(400));
    return (
      <PullToRefresh className="h-80" onRefresh={onRefresh}>
        <ul className="m-0 list-none p-0">{rows(8)}</ul>
      </PullToRefresh>
    );
  },
  play: async ({ canvas }) => {
    // Keyboard path: the button is the first tab stop, shown on focus.
    await userEvent.tab();
    const button = canvas.getByRole('button', { name: 'Refresh' });
    await expect(button).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Refreshing'));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Updated'));
  },
};

export const PullCheck: Story = {
  tags: ['!dev'],
  render: () => (
    <PullToRefresh className="h-80" onRefresh={() => wait(400)}>
      <ul className="m-0 list-none p-0">{rows(8)}</ul>
    </PullToRefresh>
  ),
  play: async ({ canvas }) => {
    const root = canvas.getByText('Invoice INV-2040').closest('[data-slot="pull-to-refresh"]')!;
    await userEvent.pointer([
      { keys: '[MouseLeft>]', target: root, coords: { clientX: 100, clientY: 100 } },
      { target: root, coords: { clientX: 100, clientY: 140 } },
      { target: root, coords: { clientX: 100, clientY: 260 } },
      { keys: '[/MouseLeft]', target: root, coords: { clientX: 100, clientY: 260 } },
    ]);
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Refreshing'));
    await waitFor(() => expect(root.getAttribute('data-status')).toMatch(/done|idle/));
  },
};

export const ShortPullCheck: Story = {
  tags: ['!dev'],
  render: () => {
    const onRefresh = fn();
    return (
      <PullToRefresh className="h-80" onRefresh={onRefresh}>
        <ul className="m-0 list-none p-0">{rows(8)}</ul>
      </PullToRefresh>
    );
  },
  play: async ({ canvas }) => {
    const root = canvas.getByText('Invoice INV-2040').closest('[data-slot="pull-to-refresh"]')!;
    await userEvent.pointer([
      { keys: '[MouseLeft>]', target: root, coords: { clientX: 100, clientY: 100 } },
      { target: root, coords: { clientX: 100, clientY: 130 } },
      { keys: '[/MouseLeft]', target: root, coords: { clientX: 100, clientY: 130 } },
    ]);
    // Below the threshold: it springs back, nothing refreshes.
    await waitFor(() => expect(root).toHaveAttribute('data-status', 'idle'));
  },
};

export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
