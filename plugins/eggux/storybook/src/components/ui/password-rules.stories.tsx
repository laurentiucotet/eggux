import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { Field } from './field';
import { Input } from './input';
import { PasswordRules, type PasswordRule } from './password-rules';

type Args = { password: string; showTitle: boolean; columns: 1 | 2 };

const meta = {
  title: 'Components/Forms/Password Rules',
  parameters: {
    docs: {
      description: {
        component:
          'A live checklist under a new-password field. Each rule is met or not met in an icon and in text for screen readers, never by color alone; the summary ("2 of 4 rules met") is a polite status that speaks only when the count changes. Link it to the input with the input\'s aria-describedby. Code only (no Figma component yet).',
      },
    },
  },
  args: { password: '', showTitle: true, columns: 1 },
  argTypes: {
    password: { name: 'Password typed', control: 'text', description: 'Starting value; type in the field to change it.', table: { category: 'Rules' } },
    columns: { name: 'Columns', control: 'inline-radio', options: [1, 2], description: 'Two columns when there is room.', table: { category: 'Rules' } },
    showTitle: { name: 'Show title', control: 'boolean', description: 'The heading above the list.', table: { category: 'Parts' } },
  },
  decorators: [Story => <div className="w-80 max-w-full"><Story /></div>],
  render: function Render({ password, showTitle, columns }) {
    const [value, setValue] = React.useState(password);
    React.useEffect(() => setValue(password), [password]);
    return (
      <div className="flex flex-col gap-3">
        <Field label="New password">
          <Input type="text" autoComplete="off" value={value} onChange={e => setValue(e.target.value)} aria-describedby="rules-default" />
        </Field>
        <PasswordRules id="rules-default" value={value} showTitle={showTitle} columns={columns} />
      </div>
    );
  },
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const passphraseRules: PasswordRule[] = [
  { id: 'words', label: 'Four words or more, with spaces between', test: v => v.trim().split(/\s+/).filter(Boolean).length >= 4 },
  { id: 'length', label: 'At least 20 characters', test: v => v.length >= 20 },
  { id: 'name', label: 'Does not contain "acme"', test: v => v.length > 0 && !/acme/i.test(v) },
];

/** Your own rules: any function of the value. Here a passphrase policy, shown in two columns. */
export const CustomRules: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const [value, setValue] = React.useState('correct horse battery staple');
    return (
      <div className="flex flex-col gap-3">
        <Field label="Passphrase">
          <Input type="text" autoComplete="off" value={value} onChange={e => setValue(e.target.value)} aria-describedby="rules-custom" />
        </Field>
        <PasswordRules id="rules-custom" title="Your passphrase needs" rules={passphraseRules} value={value} />
      </div>
    );
  },
};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'New password' });
    await expect(input).toHaveAccessibleDescription(/At least 8 characters/);
    await expect(canvas.getAllByRole('listitem')).toHaveLength(4);
    // Empty: nothing is announced and every rule reads as not met.
    await expect(canvas.getByRole('status')).toHaveTextContent('');
    await expect(canvas.getAllByText(/not met/)).toHaveLength(4);
    await userEvent.type(input, 'abc');
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('0 of 4 rules met'));
    await userEvent.clear(input);
    await userEvent.type(input, 'Abcdefg1');
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('3 of 4 rules met'));
    await expect(canvas.getByText('A number').closest('li')).toHaveAttribute('data-met');
    await expect(canvas.getByText(/A symbol/).closest('li')).not.toHaveAttribute('data-met');
    await userEvent.type(input, '!');
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('All rules met'));
    // The status is a polite live region.
    await expect(canvas.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <PasswordRules
      value="Abcdefg1"
      columns={2}
      rules={[
        { id: 'a', label: 'At least twelve characters, counting spaces and every symbol you type in this field', test: v => v.length >= 12 },
        { id: 'b', label: 'A_very_long_unbroken_rule_label_without_any_spaces_to_wrap_at_all', test: () => true },
      ]}
    />
  ),
  play: async ({ canvas }) => {
    const root = canvas.getAllByRole('list')[0]!.parentElement!;
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + 1);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
