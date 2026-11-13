import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { ApiKeyField } from './api-key-field';

type Args = { name: string; neverUsed: boolean; revoked: boolean; disabled: boolean };

const fakeKey = 'sk_test_EXAMPLE_not_a_real_key_7f3a';

const meta = {
  title: 'Components/Developer/API Key Field',
  parameters: {
    docs: {
      description: {
        component:
          'One API key: a name, the key masked to its last 4 characters with Reveal and Copy, Created and Last used, and a Revoke button that asks first, in place, and says what happens. After Revoke the key is gone from the screen. Copy always copies the whole key. Sample keys here are fake. Code only (no Figma component yet).',
      },
    },
  },
  args: { name: 'Production server', neverUsed: false, revoked: false, disabled: false },
  argTypes: {
    name: { name: 'Name', control: 'text', description: 'What the key is called.', table: { category: 'Key' } },
    neverUsed: { name: 'Never used', control: 'boolean', description: 'Last used reads Never.', table: { category: 'Key' } },
    revoked: { name: 'Revoked', control: 'boolean', description: 'Start revoked.', table: { category: 'Key' } },
    disabled: { name: 'Disabled', control: 'boolean', description: 'Block every action.', table: { category: 'Key' } },
  },
  render: ({ name, neverUsed, revoked, disabled }) => (
    <div className="w-[520px] max-w-full">
      <ApiKeyField key={String(revoked)} name={name} keyValue={fakeKey} createdAt="12 Mar 2026" lastUsed={neverUsed ? null : '2 hours ago'} defaultRevoked={revoked} disabled={disabled} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: () => {
    const onRevoke = fn();
    return (
      <div className="w-[520px] max-w-full">
        <ApiKeyField name="Production server" keyValue={fakeKey} createdAt="12 Mar 2026" lastUsed="2 hours ago" onRevoke={onRevoke} />
      </div>
    );
  },
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'Production server key' });
    // Masked: only the last 4 characters show.
    await expect(input).toHaveValue('•'.repeat(16) + '7f3a');
    await expect(canvas.getByText('12 Mar 2026')).toBeVisible();
    await expect(canvas.getByText('2 hours ago')).toBeVisible();
    // Reveal is a toggle.
    const reveal = canvas.getByRole('button', { name: 'Show the full key' });
    await expect(reveal).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(reveal);
    await waitFor(() => expect(input).toHaveValue(fakeKey));
    await expect(reveal).toHaveAttribute('aria-pressed', 'true');
    // Revoke asks first: Cancel has focus, Escape goes back to Revoke.
    await userEvent.click(canvas.getByRole('button', { name: 'Revoke Production server' }));
    const cancel = await canvas.findByRole('button', { name: 'Cancel' });
    await waitFor(() => expect(cancel).toHaveFocus());
    await expect(canvas.getByRole('group', { name: 'Revoke "Production server"?' })).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Revoke Production server' })).toHaveFocus());
    await expect(canvas.queryByRole('button', { name: 'Cancel' })).toBeNull();
    // Confirm: the key is revoked and its field is gone.
    await userEvent.click(canvas.getByRole('button', { name: 'Revoke Production server' }));
    await userEvent.click(await canvas.findByRole('button', { name: 'Revoke key' }));
    await waitFor(() => expect(canvas.queryByRole('textbox')).toBeNull());
    await expect(canvas.getAllByText('Revoked').length).toBeGreaterThan(0);
    await expect(canvas.queryByRole('button', { name: /Revoke/ })).toBeNull();
  },
};

/** A key that was revoked, and one that has never been used. */
export const States: Story = {
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="flex w-[520px] max-w-full flex-col gap-4"><Story /></div>],
  render: () => (
    <>
      <ApiKeyField name="CI pipeline" keyValue={fakeKey} createdAt="3 Jan 2026" lastUsed={null} />
      <ApiKeyField name="Old staging key" keyValue={fakeKey} createdAt="9 Sep 2025" lastUsed="3 months ago" defaultRevoked />
    </>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Never')).toBeVisible();
    await expect(canvas.getByText('This key no longer works. Requests that use it are rejected.')).toBeVisible();
    await expect(canvas.getAllByRole('textbox')).toHaveLength(1);
  },
};

/* Hidden checks */

export const CopyCheck: Story = {
  tags: ['!dev'],
  render: () => <div className="w-[520px] max-w-full"><ApiKeyField name="Production server" keyValue={fakeKey} createdAt="12 Mar 2026" lastUsed="2 hours ago" /></div>,
  play: async ({ canvas }) => {
    // Copy keeps its own name and shows its state in place, even while the key is masked.
    const copy = canvas.getByRole('button', { name: 'Copy Production server key' });
    await userEvent.click(copy);
    await waitFor(() => expect(canvas.getByRole('textbox', { name: 'Production server key' })).toHaveValue('•'.repeat(16) + '7f3a'));
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <ApiKeyField name="Production server for the European billing and invoicing service" keyValue={fakeKey} createdAt="12 March 2026 at 14:02 CET" lastUsed="Never used since it was created" />
  ),
  play: async ({ canvas }) => {
    const card = canvas.getByRole('group', { name: /Production server for the European/ });
    await expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth + 1);
    await userEvent.click(canvas.getByRole('button', { name: /^Revoke/ }));
    const group = await canvas.findByRole('group', { name: /^Revoke "Production/ });
    await expect(group.scrollWidth).toBeLessThanOrEqual(group.clientWidth + 1);
    await expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth + 1);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
