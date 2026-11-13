import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { KeyValueEditor, type KeyValueRow } from './key-value-editor';

type Args = { kind: 'headers' | 'env'; rows: number; maskValues: boolean; showDuplicate: boolean; disabled: boolean };

const headers: KeyValueRow[] = [
  { key: 'Content-Type', value: 'application/json' },
  { key: 'X-Request-Id', value: 'req_8f3a21c9' },
  { key: 'Accept-Language', value: 'en' },
  { key: 'X-Acme-Region', value: 'eu-west' },
];
const env: KeyValueRow[] = [
  { key: 'API_URL', value: 'https://api.acme.example' },
  { key: 'LOG_LEVEL', value: 'info' },
  { key: 'CURRENCY', value: 'EUR' },
  { key: 'SECRET_TOKEN', value: 'sk_test_not_a_real_secret' },
];

const meta = {
  title: 'Components/Developer/Key Value Editor',
  parameters: {
    docs: {
      description: {
        component:
          'Rows of a key and a value with Add row and Remove row: HTTP headers, environment variables, query parameters. A key used twice is marked on both rows and explained under the list. Add row moves focus to the new key; Remove row moves it to the next row. Values can be masked for secrets. Code only (no Figma component yet).',
      },
    },
  },
  args: { kind: 'headers', rows: 2, maskValues: false, showDuplicate: false, disabled: false },
  argTypes: {
    kind: { name: 'Content', control: 'inline-radio', options: ['headers', 'env'], description: 'HTTP headers or environment variables.', table: { category: 'Editor' } },
    rows: { name: 'Rows', control: { type: 'range', min: 0, max: 4, step: 1 }, description: 'How many rows start filled.', table: { category: 'Editor' } },
    maskValues: { name: 'Mask values', control: 'boolean', description: 'Hide values like a password.', table: { category: 'Editor' } },
    showDuplicate: { name: 'Show duplicate key', control: 'boolean', description: 'Repeat the first key on the second row.', table: { category: 'Parts' } },
    disabled: { name: 'Disabled', control: 'boolean', description: 'Block all edits.', table: { category: 'Editor' } },
  },
  render: ({ kind, rows, maskValues, showDuplicate, disabled }) => {
    const base = (kind === 'headers' ? headers : env).slice(0, rows).map(r => ({ ...r }));
    if (showDuplicate && base.length > 1) base[1] = { ...base[1]!, key: base[0]!.key };
    return (
      <div className="w-[640px] max-w-full">
        <KeyValueEditor
          key={`${kind}-${rows}-${showDuplicate}`}
          aria-label={kind === 'headers' ? 'HTTP headers' : 'Environment variables'}
          keyLabel={kind === 'headers' ? 'Header' : 'Name'}
          keyPlaceholder={kind === 'headers' ? 'X-Request-Id' : 'API_URL'}
          addLabel={kind === 'headers' ? 'Add header' : 'Add variable'}
          maskValues={maskValues}
          disabled={disabled}
          defaultValue={base}
        />
      </div>
    );
  },
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: () => {
    const onChange = fn();
    return (
      <div className="w-[640px] max-w-full">
        <KeyValueEditor aria-label="HTTP headers" keyLabel="Header" addLabel="Add header" onChange={onChange} defaultValue={[{ key: 'Content-Type', value: 'application/json' }]} />
      </div>
    );
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('group', { name: 'HTTP headers' })).toBeVisible();
    await expect(canvas.getByRole('textbox', { name: 'Header, row 1' })).toHaveValue('Content-Type');
    // Add moves focus to the new key.
    await userEvent.click(canvas.getByRole('button', { name: 'Add header' }));
    const key2 = await canvas.findByRole('textbox', { name: 'Header, row 2' });
    await waitFor(() => expect(key2).toHaveFocus());
    await userEvent.type(key2, 'X-Request-Id');
    await userEvent.type(canvas.getByRole('textbox', { name: 'Value, row 2' }), 'req_1');
    await expect(canvas.queryByRole('alert')?.textContent).toBe('');
    // A repeated key marks both rows and says why.
    await userEvent.click(canvas.getByRole('button', { name: 'Add header' }));
    const key3 = await canvas.findByRole('textbox', { name: 'Header, row 3' });
    await userEvent.type(key3, 'Content-Type');
    await waitFor(() => expect(key3).toHaveAttribute('aria-invalid', 'true'));
    await expect(canvas.getByRole('textbox', { name: 'Header, row 1' })).toHaveAttribute('aria-invalid', 'true');
    await expect(canvas.getByRole('textbox', { name: 'Header, row 2' })).not.toHaveAttribute('aria-invalid');
    await expect(canvas.getByRole('alert')).toHaveTextContent('Key "Content-Type" is used more than once.');
    await expect(key3).toHaveAccessibleDescription(/used more than once/);
    // Removing the repeat clears the error and moves focus to a row.
    await userEvent.click(canvas.getByRole('button', { name: 'Remove row 3, Content-Type' }));
    await waitFor(() => expect(canvas.queryByRole('textbox', { name: 'Header, row 3' })).toBeNull());
    await expect(canvas.getByRole('alert').textContent).toBe('');
    await expect(canvas.getByRole('textbox', { name: 'Header, row 1' })).not.toHaveAttribute('aria-invalid');
  },
};

/** Environment variables with secret values hidden. */
export const SecretValues: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-[640px] max-w-full">
      <KeyValueEditor aria-label="Environment variables" keyLabel="Name" valueLabel="Value" keyPlaceholder="API_URL" addLabel="Add variable" maskValues defaultValue={env} />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Value, row 4')).toHaveAttribute('type', 'password');
    await expect(canvas.getAllByRole('listitem')).toHaveLength(4);
  },
};

/** Nothing yet: the empty message and the add button. */
export const Empty: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-[640px] max-w-full">
      <KeyValueEditor aria-label="HTTP headers" keyLabel="Header" addLabel="Add header" />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Nothing added yet.')).toBeVisible();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Add header' })).toHaveFocus();
  },
};

/* Hidden checks */

export const RemoveCheck: Story = {
  tags: ['!dev'],
  render: () => <KeyValueEditor aria-label="HTTP headers" defaultValue={[{ key: 'A', value: '1' }, { key: 'B', value: '2' }]} />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Remove row 1, A' }));
    await waitFor(() => expect(canvas.getByRole('textbox', { name: 'Key, row 1' })).toHaveValue('B'));
    await waitFor(() => expect(canvas.getByRole('textbox', { name: 'Key, row 1' })).toHaveFocus());
    await userEvent.click(canvas.getByRole('button', { name: 'Remove row 1, B' }));
    await waitFor(() => expect(canvas.getByText('Nothing added yet.')).toBeVisible());
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Add row' })).toHaveFocus());
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <KeyValueEditor
      aria-label="HTTP headers"
      defaultValue={[
        { key: 'X-Acme-Organization-Identifier-For-Billing', value: 'https://api.acme.example/v1/organizations/org_1042/projects/prj_2210/environments' },
        { key: 'X-Acme-Organization-Identifier-For-Billing', value: 'b' },
      ]}
    />
  ),
  play: async ({ canvas }) => {
    const group = canvas.getByRole('group', { name: 'HTTP headers' });
    await expect(group.scrollWidth).toBeLessThanOrEqual(group.clientWidth + 1);
    // At 276 px the key, value and Remove stack, and everything stays inside the row.
    for (const row of canvas.getAllByRole('listitem')) {
      for (const el of row.querySelectorAll('input, button')) await expect(el.getBoundingClientRect().right).toBeLessThanOrEqual(row.getBoundingClientRect().right + 1);
    }
    await expect(canvas.getByRole('alert')).toHaveTextContent('used more than once');
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
