import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { EmptyStatePrompt } from './empty-state-prompt';

type Args = { title: string; description: string; actionLabel: string; layout: 'stacked' | 'inline'; showSecondary: boolean; loading: boolean; disabled: boolean; width: number };

const onAction = fn();
const onSecondary = fn();

const meta = {
  title: 'Components/Onboarding/Empty State Prompt',
  parameters: {
    docs: {
      description: {
        component:
          'An action card for the first item of a list or section: dashed outline, tile, title, one sentence, one primary action and an optional second one. Stacked (centered) for a section, inline (a row) at the top of a list. Use Empty State for a whole panel with nothing to show; use this when the next step is to add the first item. Code only (no Figma component yet). Guide: eggux build-ui/patterns/onboarding.md',
      },
    },
  },
  args: { title: 'Create your first invoice', description: 'Invoices you create show up here, with their status and payments.', actionLabel: 'New invoice', layout: 'stacked', showSecondary: true, loading: false, disabled: false, width: 480 },
  argTypes: {
    title: { name: 'Title', control: 'text', description: 'Heading of the prompt.', table: { category: 'Card' } },
    description: { name: 'Description', control: 'text', description: 'One short sentence.', table: { category: 'Card' } },
    actionLabel: { name: 'Action label', control: 'text', description: 'Label of the primary action.', table: { category: 'Card' } },
    layout: { name: 'Layout', control: 'inline-radio', options: ['stacked', 'inline'], description: 'Centered column or a row.', table: { category: 'Card' } },
    loading: { name: 'Loading', control: 'boolean', description: 'The action is running.', table: { category: 'Card' } },
    disabled: { name: 'Disabled', control: 'boolean', description: 'Blocks both actions.', table: { category: 'Card' } },
    width: { name: 'Width', control: { type: 'range', min: 240, max: 640, step: 4 }, description: 'Container width in px.', table: { category: 'Card' } },
    showSecondary: { name: 'Show second action', control: 'boolean', description: 'The ghost button.', table: { category: 'Parts' } },
  },
  render: ({ title, description, actionLabel, layout, showSecondary, loading, disabled, width }) => (
    <div style={{ width }} className="max-w-full">
      <EmptyStatePrompt title={title} description={description} actionLabel={actionLabel} layout={layout} secondaryLabel={showSecondary ? 'Import from CSV' : ''} loading={loading} disabled={disabled} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <EmptyStatePrompt onAction={onAction} onSecondary={onSecondary} />,
  play: async ({ canvas }) => {
    const region = canvas.getByRole('region', { name: 'Create your first invoice' });
    await expect(region).toHaveAttribute('data-layout', 'stacked');
    await expect(getComputedStyle(region).borderStyle).toBe('dashed');
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'New invoice' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(onAction).toHaveBeenCalled();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Import from CSV' })).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(onSecondary).toHaveBeenCalled();
  },
};

/** Stacked for a section and inline for the top of a list. */
export const Layouts: Story = {
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="flex flex-col gap-6"><Story /></div>],
  render: () => (
    <>
      <div className="w-[480px] max-w-full"><EmptyStatePrompt /></div>
      <div className="w-[560px] max-w-full"><EmptyStatePrompt layout="inline" title="Add your first customer" description="Customers can be reused on every invoice." actionLabel="New customer" secondaryLabel="" /></div>
    </>
  ),
};

export const StatesCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[480px] max-w-full flex-col gap-4">
      <EmptyStatePrompt title="Busy" loading onAction={onAction} />
      <EmptyStatePrompt title="Off" disabled />
    </div>
  ),
  play: async ({ canvas }) => {
    const busy = canvas.getByRole('region', { name: 'Busy' });
    await expect(busy.querySelector('button')).toHaveAttribute('aria-busy', 'true');
    const off = canvas.getByRole('region', { name: 'Off' });
    for (const b of Array.from(off.querySelectorAll('button'))) await expect(b).toBeDisabled();
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <EmptyStatePrompt
      title="Create your very first Supercalifragilisticexpialidocious_invoice"
      description="A long sentence with an unbreakable_token_that_keeps_going_and_going_and_going_without_spaces that must wrap."
      actionLabel="Create the first invoice for your biggest customer"
      secondaryLabel="Import everything from a spreadsheet file"
    />
  ),
  play: async ({ canvas }) => {
    const region = canvas.getByRole('region');
    await expect(region.scrollWidth).toBeLessThanOrEqual(region.clientWidth + 1);
    for (const b of canvas.getAllByRole('button')) {
      await expect(b.getBoundingClientRect().right).toBeLessThanOrEqual(region.getBoundingClientRect().right + 1);
    }
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
