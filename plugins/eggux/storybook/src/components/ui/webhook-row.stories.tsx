import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { WebhookRow, type WebhookStatus } from './webhook-row';

type Args = { url: string; status: WebhookStatus; events: number; noDeliveries: boolean; lastFailed: boolean };

const allEvents = ['invoice.created', 'invoice.paid', 'customer.updated', 'refund.created', 'payout.sent'];

const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

const meta = {
  title: 'Components/Developer/Webhook Row',
  parameters: {
    docs: {
      description: {
        component:
          'One webhook endpoint: the URL in mono, a status badge (Active, Failing or Disabled, always a word), the events it listens to, the last delivery with its HTTP code, and a Send test button that is busy while the test runs and announces the result. Extra events open from "+N". Code only (no Figma component yet).',
      },
    },
  },
  args: { url: 'https://hooks.acme.example/billing/events', status: 'active', events: 3, noDeliveries: false, lastFailed: false },
  argTypes: {
    url: { name: 'URL', control: 'text', description: 'Where events are sent.', table: { category: 'Webhook' } },
    status: { name: 'Status', control: 'inline-radio', options: ['active', 'failing', 'disabled'], description: 'State of the endpoint.', table: { category: 'Webhook' } },
    events: { name: 'Events', control: { type: 'range', min: 1, max: 5, step: 1 }, description: 'How many event types it listens to.', table: { category: 'Webhook' } },
    noDeliveries: { name: 'No deliveries yet', control: 'boolean', description: 'A new endpoint.', table: { category: 'Parts' } },
    lastFailed: { name: 'Last delivery failed', control: 'boolean', description: 'Show an error code.', table: { category: 'Parts' } },
  },
  render: ({ url, status, events, noDeliveries, lastFailed }) => (
    <div className="w-[560px] max-w-full">
      <WebhookRow
        url={url}
        status={status}
        events={allEvents.slice(0, events)}
        lastDelivery={noDeliveries ? null : lastFailed ? { code: 503, at: '5 min ago', ok: false } : { code: 200, at: '5 min ago', ok: true }}
        onTest={() => wait(400)}
      />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvas }) => {
    await expect(canvas.getByText('https://hooks.acme.example/billing/events')).toBeVisible();
    await expect(canvas.getByText('Active')).toBeVisible();
    await expect(canvas.getByRole('list', { name: 'Events' }).querySelectorAll('li')).toHaveLength(3);
    await expect(canvas.getByText(/Last delivery/)).toHaveTextContent('Last delivery 200 (delivered) · 5 min ago');
    // Send test: busy while it runs, then the result is announced.
    const button = canvas.getByRole('button', { name: /Send test/ });
    await userEvent.click(button);
    await waitFor(() => expect(button).toHaveAttribute('aria-busy', 'true'));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Test event sent'));
    await expect(button).not.toHaveAttribute('aria-busy');
  },
};

/** Active, failing and disabled endpoints, and a new one with no deliveries. */
export const States: Story = {
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="flex w-[560px] max-w-full flex-col gap-3"><Story /></div>],
  render: () => (
    <>
      <WebhookRow url="https://hooks.acme.example/billing/events" status="active" events={allEvents.slice(0, 2)} lastDelivery={{ code: 200, at: '5 min ago', ok: true }} onTest={() => wait(300)} />
      <WebhookRow url="https://erp.acme.example/inbound/webhooks" status="failing" events={allEvents} lastDelivery={{ code: 503, at: '12 min ago', ok: false }} onTest={() => Promise.reject(new Error('No answer'))} />
      <WebhookRow url="https://staging.acme.example/hooks" status="disabled" events={['refund.created']} lastDelivery={{ code: 200, at: '3 days ago', ok: true }} />
      <WebhookRow url="https://new.acme.example/hooks" status="active" events={['invoice.created']} lastDelivery={null} />
    </>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Failing')).toBeVisible();
    await expect(canvas.getByText('Disabled')).toBeVisible();
    await expect(canvas.getByText(/503/)).toHaveTextContent('503 (failed)');
    await expect(canvas.getByText('No deliveries yet')).toBeVisible();
    // A disabled endpoint cannot be tested.
    await expect(canvas.getByRole('button', { name: /Send test event to https:\/\/staging/ })).toBeDisabled();
    // "+2" shows the rest of the events.
    await expect(canvas.getByRole('button', { name: /\+2/ })).toBeVisible();
  },
};

/* Hidden checks */

export const FailedTestCheck: Story = {
  tags: ['!dev'],
  render: () => <WebhookRow url="https://erp.acme.example/inbound/webhooks" status="failing" events={['invoice.paid']} lastDelivery={{ code: 503, at: '12 min ago', ok: false }} onTest={() => Promise.reject(new Error('No answer'))} />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Send test/ }));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Test failed'));
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <WebhookRow
      url="https://integrations.very-long-company-name.example/webhooks/billing/v2/events/receiver?token=abc"
      status="failing"
      events={['invoice.payment_action_required', 'customer.subscription.trial_will_end', 'checkout.session.completed', 'refund.created']}
      lastDelivery={{ code: 503, at: '12 minutes ago', ok: false }}
    />
  ),
  play: async ({ canvas }) => {
    const row = canvas.getByTitle(/integrations\.very-long/).closest('[data-slot="webhook-row"]') as HTMLElement;
    await expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth + 1);
    const url = canvas.getByTitle(/integrations\.very-long/);
    await expect(url.scrollWidth).toBeGreaterThan(url.clientWidth);
    await expect(url).toHaveAttribute('title', expect.stringContaining('token=abc'));
    await expect(canvas.getByRole('button', { name: /\+1/ })).toBeVisible();
  },
};

export const DefaultDark: Story = { ...States, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...States, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
