import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { ConnectionStatus, type ConnectionState } from './connection-status';

type Args = { status: ConnectionState; variant: 'indicator' | 'banner'; showRetry: boolean; retrying: boolean; width: number };

const meta = {
  title: 'Components/Data Display/Connection Status',
  parameters: {
    docs: {
      description: {
        component:
          'Online, offline or reconnecting, as a small indicator or a full-width banner. The status is always an icon plus words. The root is a persistent polite live region, so a change is announced without moving focus. The banner offers Retry when offline. Reconnecting spins only when motion is allowed. Code only (no Figma component yet).',
      },
    },
  },
  args: { status: 'offline', variant: 'banner', showRetry: true, retrying: false, width: 560 },
  argTypes: {
    status: { name: 'Status', control: 'inline-radio', options: ['online', 'offline', 'reconnecting'], description: 'Connection state.', table: { category: 'Status' } },
    variant: { name: 'Variant', control: 'inline-radio', options: ['indicator', 'banner'], description: 'Small pill or full-width banner.', table: { category: 'Status' } },
    width: { name: 'Width', control: { type: 'range', min: 276, max: 720, step: 4 }, description: 'Container width in px, to see the resize contract.', table: { category: 'Status' } },
    showRetry: { name: 'Show retry', control: 'boolean', description: 'Retry button in the banner when offline.', table: { category: 'Parts' } },
    retrying: { name: 'Retrying', control: 'boolean', description: 'The retry is running: the button is busy.', table: { category: 'Parts' } },
  },
  render: ({ status, variant, showRetry, retrying, width }) => (
    <div style={{ width }} className="max-w-full">
      <ConnectionStatus status={status} variant={variant} onRetry={showRetry ? fn() : undefined} retrying={retrying} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** All three states in both variants. */
export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[560px] max-w-full flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {(['online', 'offline', 'reconnecting'] as const).map(s => <ConnectionStatus key={s} status={s} />)}
      </div>
      {(['online', 'offline', 'reconnecting'] as const).map(s => <ConnectionStatus key={s} status={s} variant="banner" onRetry={() => undefined} />)}
    </div>
  ),
};

/** The connection drops, retry runs, then it returns. */
export const RetryFlow: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const [status, setStatus] = React.useState<ConnectionState>('offline');
    const [retrying, setRetrying] = React.useState(false);
    return (
      <div className="w-[560px] max-w-full">
        <ConnectionStatus
          variant="banner"
          status={status}
          retrying={retrying}
          onRetry={() => {
            setRetrying(true);
            window.setTimeout(() => { setRetrying(false); setStatus('online'); }, 600);
          }}
        />
      </div>
    );
  },
};

/* Hidden checks */

export const DefaultCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvas, args }) => {
    const region = canvas.getByRole('status');
    await expect(region).toHaveTextContent('Offline.');
    await expect(region).toHaveTextContent('Changes are kept on this device');
    const retry = canvas.getByRole('button', { name: 'Retry' });
    await userEvent.tab();
    await expect(retry).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(args.showRetry).toBe(true));
  },
};

export const RetryFlowCheck: Story = {
  ...RetryFlow,
  tags: ['!dev'],
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Retry' }));
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Retrying' })).toHaveAttribute('aria-busy', 'true'));
    // The live region stays the same element; its text changes.
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Online.'));
    await expect(canvas.queryByRole('button', { name: /Retry/ })).not.toBeInTheDocument();
  },
};

export const IndicatorCheck: Story = {
  tags: ['!dev'],
  args: { variant: 'indicator', status: 'reconnecting' },
  play: async ({ canvas }) => {
    const region = canvas.getByRole('status');
    await expect(region).toHaveTextContent('Reconnecting');
    await expect(region).toHaveAttribute('data-variant', 'indicator');
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
    await expect(region.getBoundingClientRect().height).toBe(24);
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <div className="flex flex-col gap-3">
      <ConnectionStatus status="offline" variant="banner" onRetry={() => undefined} detail="The connection to the Acme sync service was lost at 14:32 and the next automatic attempt is in 30 seconds." />
      <ConnectionStatus status="reconnecting" title="Reconnecting to the Acme sync service in the Frankfurt region" />
    </div>
  ),
  play: async ({ canvasElement, canvas }) => {
    const root = canvasElement.firstElementChild as HTMLElement;
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + 1);
    // Retry wraps under the text instead of squeezing it.
    await expect(canvas.getByRole('button', { name: 'Retry' })).toBeVisible();
    for (const r of canvas.getAllByRole('status')) {
      await expect(r.getBoundingClientRect().width).toBeLessThanOrEqual(276);
    }
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
