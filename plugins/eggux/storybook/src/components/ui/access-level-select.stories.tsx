import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { AccessLevelSelect, defaultAccessLevels, type AccessLevel } from './access-level-select';

type Args = {
  size: 'sm' | 'default' | 'lg';
  selectStyle: 'default' | 'filled' | 'ghost';
  showDescription: boolean;
  disableOwner: boolean;
  disabled: boolean;
  readOnly: boolean;
  width: number;
};

const withReason = (on: boolean): AccessLevel[] =>
  defaultAccessLevels.map(l => (on && l.value === 'owner' ? { ...l, disabled: true, disabledReason: 'Only the current owner can transfer ownership' } : l));

const meta = {
  title: 'Components/Access/Access Level Select',
  parameters: {
    docs: {
      description: {
        component:
          'A Select for how much someone can do with a shared thing: Viewer, Commenter, Editor, Owner. Each level shows a one-line description in the open list. A disabled level stays in the list with the reason in place of its description. Built on Select, so the keyboard is the same: arrows move, Enter picks, Escape closes, a letter jumps. Code only (no Figma component yet).',
      },
    },
  },
  args: { size: 'default', selectStyle: 'default', showDescription: true, disableOwner: true, disabled: false, readOnly: false, width: 240 },
  argTypes: {
    size: { name: 'Size', control: 'inline-radio', options: ['sm', 'default', 'lg'], description: 'sm 32, default 36, lg 40.', table: { category: 'Access Level Select' } },
    selectStyle: { name: 'Style', control: 'inline-radio', options: ['default', 'filled', 'ghost'], description: 'Same styles as Select.', table: { category: 'Access Level Select' } },
    disabled: { name: 'Disabled', control: 'boolean', description: 'The whole control is off.', table: { category: 'Access Level Select' } },
    readOnly: { name: 'Read-only', control: 'boolean', description: 'Shows the level, never opens.', table: { category: 'Access Level Select' } },
    width: { name: 'Width', control: { type: 'range', min: 140, max: 400, step: 4 }, description: 'Width of the control in px.', table: { category: 'Access Level Select' } },
    showDescription: { name: 'Show description', control: 'boolean', description: 'The chosen level’s description under the control.', table: { category: 'Parts' } },
    disableOwner: { name: 'Disable Owner with a reason', control: 'boolean', description: 'Owner stays in the list, dimmed, with the reason.', table: { category: 'Parts' } },
  },
  render: ({ disableOwner, width, ...args }) => (
    <AccessLevelSelect label="Access for Maria Ilie" defaultValue="editor" levels={withReason(disableOwner)} width={width} {...args} />
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => {
    const onValueChange = fn();
    return (
      <div className="w-[240px]">
        <AccessLevelSelect label="Access for Maria Ilie" defaultValue="viewer" levels={withReason(true)} showDescription onValueChange={onValueChange} />
      </div>
    );
  },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('combobox', { name: 'Access for Maria Ilie' });
    await expect(trigger).toHaveTextContent('Viewer');
    await expect(trigger).toHaveAccessibleDescription('Can open and read, nothing else');
    await userEvent.click(trigger);
    const list = await screen.findByRole('listbox');
    await expect(within(list).getAllByRole('option')).toHaveLength(4);
    await expect(within(list).getByRole('option', { name: /Commenter/ })).toHaveTextContent('Can read and leave comments');
    const owner = within(list).getByRole('option', { name: /Owner/ });
    await expect(owner).toHaveAttribute('aria-disabled', 'true');
    await expect(owner).toHaveTextContent('Only the current owner can transfer ownership');
    await userEvent.click(within(list).getByRole('option', { name: /Editor/ }));
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    await expect(trigger).toHaveTextContent('Editor');
    await waitFor(() => expect(trigger).toHaveAccessibleDescription('Can change content and share it'));
  },
};

export const KeyboardCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <div className="w-[240px]"><AccessLevelSelect label="Access" defaultValue="viewer" levels={withReason(true)} /></div>,
  play: async ({ canvas }) => {
    await userEvent.tab();
    const trigger = canvas.getByRole('combobox', { name: 'Access' });
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await screen.findByRole('listbox');
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(screen.getByRole('option', { name: /Commenter/ })).toHaveFocus());
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    await expect(trigger).toHaveTextContent('Commenter');
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

/** Disabled and read-only side by side with the normal one. */
export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[240px] flex-col gap-3">
      <AccessLevelSelect label="Normal" defaultValue="editor" />
      <AccessLevelSelect label="Disabled" defaultValue="editor" disabled />
      <AccessLevelSelect label="Read-only" defaultValue="editor" readOnly />
    </div>
  ),
};

export const StatesCheck: Story = {
  ...States,
  tags: ['!dev'],
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('combobox', { name: 'Disabled' })).toBeDisabled();
    const ro = canvas.getByRole('combobox', { name: 'Read-only' });
    await userEvent.click(ro);
    await expect(screen.queryByRole('listbox')).toBeNull();
    await expect(ro).toHaveTextContent('Editor');
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <AccessLevelSelect
      label="Access for Alexandra-Maria Constantinescu-Vasilescu"
      defaultValue="long"
      showDescription
      levels={[
        { value: 'long', label: 'Reviewer with approval rights across every Acme Europe workspace', description: 'Can read, comment and approve changes in all of the workspaces the group owns today' },
        ...defaultAccessLevels,
      ]}
    />
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('combobox');
    await expect(trigger.getBoundingClientRect().width).toBeLessThanOrEqual(276);
    await expect(trigger.scrollWidth).toBeLessThanOrEqual(trigger.clientWidth + 1);
    const root = canvas.getByRole('combobox').closest('[data-slot="access-level-select"]') as HTMLElement;
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + 1);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
