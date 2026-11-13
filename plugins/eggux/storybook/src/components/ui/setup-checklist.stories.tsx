import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { SetupChecklist, type SetupChecklistStep } from './setup-checklist';

const base: Omit<SetupChecklistStep, 'done'>[] = [
  { id: 'profile', title: 'Add your company details', hint: 'Name, address and VAT number appear on every invoice.', actionLabel: 'Add details' },
  { id: 'bank', title: 'Connect a bank account', hint: 'Payments are matched to invoices automatically.', actionLabel: 'Connect bank' },
  { id: 'invoice', title: 'Send your first invoice', hint: 'Use a template or start from scratch.', actionLabel: 'New invoice' },
  { id: 'team', title: 'Invite a teammate', hint: 'Give an accountant read-only access.', actionLabel: 'Invite' },
  { id: 'brand', title: 'Add your logo', hint: 'Shown on invoices and the payment page.', actionLabel: 'Upload logo' },
];

type Args = { title: string; steps: number; doneCount: number; startCollapsed: boolean; showDescription: boolean; showHints: boolean; width: number };

/** Keeps the done steps in state so pressing an action completes the step. */
function Live({ doneCount, count, showHints, ...rest }: { doneCount: number; count: number; showHints: boolean } & Partial<Omit<React.ComponentProps<typeof SetupChecklist>, 'steps'>>) {
  const [done, setDone] = React.useState(doneCount);
  const list = base.slice(0, count).map((s, i) => ({ ...s, hint: showHints ? s.hint : undefined, done: i < done }));
  return <SetupChecklist steps={list} onStepAction={() => setDone(d => Math.min(d + 1, count))} {...rest} />;
}

const meta = {
  title: 'Components/Onboarding/Setup Checklist',
  parameters: {
    docs: {
      description: {
        component:
          'Getting-started card: a progress bar, "N of M done" and ordered steps that are done, current or locked (the first undone step is current, later ones unlock one at a time). Each step has a title, a hint and an action. The header button collapses it to the bar. State is always in text. Code only (no Figma component yet). Guide: eggux build-ui/patterns/onboarding.md',
      },
    },
  },
  args: { title: 'Set up your workspace', steps: 5, doneCount: 2, startCollapsed: false, showDescription: true, showHints: true, width: 440 },
  argTypes: {
    title: { name: 'Title', control: 'text', description: 'Heading of the card.', table: { category: 'Checklist' } },
    steps: { name: 'Steps', control: { type: 'range', min: 2, max: 5, step: 1 }, description: 'How many steps.', table: { category: 'Checklist' } },
    doneCount: { name: 'Steps done', control: { type: 'range', min: 0, max: 5, step: 1 }, description: 'Steps already done; the next one is current.', table: { category: 'Checklist' } },
    startCollapsed: { name: 'Collapsed', control: 'boolean', description: 'Start with the list folded.', table: { category: 'Checklist' } },
    width: { name: 'Width', control: { type: 'range', min: 240, max: 520, step: 4 }, description: 'Container width in px.', table: { category: 'Checklist' } },
    showDescription: { name: 'Show description', control: 'boolean', description: 'The sentence under the title.', table: { category: 'Parts' } },
    showHints: { name: 'Show hints', control: 'boolean', description: 'A hint under every step title.', table: { category: 'Parts' } },
  },
  render: ({ title, steps, doneCount, startCollapsed, showDescription, showHints, width }) => (
    <div style={{ width }} className="max-w-full">
      <Live key={`${doneCount}-${steps}-${startCollapsed}`} title={title} count={steps} doneCount={Math.min(doneCount, steps)} showHints={showHints} defaultCollapsed={startCollapsed} description={showDescription ? undefined : ''} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <Live doneCount={1} count={4} showHints />,
  play: async ({ canvas }) => {
    const region = canvas.getByRole('region', { name: 'Set up your workspace' });
    await expect(region).toBeVisible();
    await expect(canvas.getByRole('progressbar', { name: 'Setup progress' })).toHaveAttribute('aria-valuenow', '25');
    await expect(canvas.getByText('1 of 4 done')).toBeVisible();
    const items = canvas.getAllByRole('listitem');
    await expect(items).toHaveLength(4);
    await expect(items[0]).toHaveAttribute('data-state', 'done');
    await expect(items[1]).toHaveAttribute('data-state', 'current');
    await expect(items[1]).toHaveAttribute('aria-current', 'step');
    await expect(items[2]).toHaveAttribute('data-state', 'locked');
    // Locked actions are disabled; the current one works.
    await expect(canvas.getByRole('button', { name: 'New invoice for Send your first invoice' })).toBeDisabled();
    // Pressing the current action completes it and unlocks the next.
    await userEvent.click(canvas.getByRole('button', { name: 'Connect bank for Connect a bank account' }));
    await waitFor(() => expect(canvas.getByText('2 of 4 done')).toBeVisible());
    await waitFor(() => expect(canvas.getAllByRole('listitem')[2]).toHaveAttribute('data-state', 'current'));
    await expect(canvas.getByRole('button', { name: 'New invoice for Send your first invoice' })).toBeEnabled();
    // Collapse with the keyboard.
    const toggle = canvas.getByRole('button', { name: 'Collapse Set up your workspace' });
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    toggle.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Expand Set up your workspace' })).toHaveAttribute('aria-expanded', 'false'));
    await expect(canvas.queryAllByRole('listitem')).toHaveLength(0);
    await expect(canvas.getByText('2 of 4 done')).toBeVisible();
    await userEvent.keyboard(' ');
    await waitFor(() => expect(canvas.getAllByRole('listitem')).toHaveLength(4));
  },
};

/** Not started, half way and finished side by side. */
export const Progress: Story = {
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="flex flex-col gap-6"><Story /></div>],
  render: () => (
    <>
      <Live doneCount={0} count={3} showHints title="Not started" />
      <Live doneCount={2} count={4} showHints title="Half way" />
      <Live doneCount={3} count={3} showHints title="Finished" />
    </>
  ),
};

/** Folded to the header and the bar, for a dashboard that needs the space. */
export const Collapsed: Story = {
  parameters: { controls: { disable: true } },
  render: () => <Live doneCount={2} count={5} showHints defaultCollapsed />,
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <SetupChecklist
      title="Set up your very long named workspace before the first invoice goes out"
      steps={[
        { id: 'a', title: 'Add the registered company address and the VAT number for every entity', hint: 'A hint that is long enough to wrap over several lines in a narrow column.', actionLabel: 'Add company details now', done: true },
        { id: 'b', title: 'Connect a bank account', hint: 'Short hint.', actionLabel: 'Connect a bank account with a long label' },
        { id: 'c', title: 'Send your first invoice', actionLabel: 'New invoice' },
      ]}
    />
  ),
  play: async ({ canvas }) => {
    const region = canvas.getByRole('region');
    await expect(region.scrollWidth).toBeLessThanOrEqual(region.clientWidth + 1);
    await expect(region.getBoundingClientRect().width).toBeLessThanOrEqual(276);
    for (const button of canvas.getAllByRole('button')) {
      await expect(button.getBoundingClientRect().right).toBeLessThanOrEqual(region.getBoundingClientRect().right + 1);
    }
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
