import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { Button } from './button';
import { UnsavedChangesPrompt } from './unsaved-changes-prompt';

type Args = { startOpen: boolean; saving: boolean; warnOnUnload: boolean };

type Handlers = { onStay?: () => void; onDiscard?: () => void; onSaveAndLeave?: () => void };

function Example({ startOpen, saving, warnOnUnload, onStay, onDiscard, onSaveAndLeave }: Partial<Args> & Handlers) {
  const [open, setOpen] = React.useState(Boolean(startOpen));
  return (
    <>
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>Leave this page</Button>
      <UnsavedChangesPrompt
        open={open}
        onOpenChange={setOpen}
        saving={saving}
        warnOnUnload={warnOnUnload}
        onStay={onStay}
        onDiscard={onDiscard}
        onSaveAndLeave={onSaveAndLeave}
      />
    </>
  );
}

const meta = {
  title: 'Components/Wizard/Unsaved Changes Prompt',
  parameters: {
    docs: {
      description: {
        component:
          'Alert Dialog "Leave without saving?" with Stay (focused, also Escape), Discard and Save and leave. Focus is trapped and returns to the button that opened it. `warnOnUnload` adds the browser prompt on tab close while the form is dirty. Code only (no Figma component yet). Guide: eggux build-ui/patterns/wizard.md',
      },
    },
  },
  args: { startOpen: false, saving: false, warnOnUnload: false },
  argTypes: {
    startOpen: { name: 'Open', control: 'boolean', description: 'Start with the dialog open.', table: { category: 'Prompt' } },
    saving: { name: 'Saving', control: 'boolean', description: 'The save is running: buttons disabled, primary reads "Saving...".', table: { category: 'Prompt' } },
    warnOnUnload: { name: 'Warn on tab close', control: 'boolean', description: 'Also show the browser prompt while open.', table: { category: 'Prompt' } },
  },
  render: ({ startOpen, saving, warnOnUnload }) => <Example key={String(startOpen)} startOpen={startOpen} saving={saving} warnOnUnload={warnOnUnload} />,
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => {
    const handlers = { onStay: fn(), onDiscard: fn(), onSaveAndLeave: fn() };
    (window as unknown as { __h?: typeof handlers }).__h = handlers;
    return <Example {...handlers} />;
  },
  play: async ({ canvas }) => {
    const h = (window as unknown as { __h: Record<'onStay' | 'onDiscard' | 'onSaveAndLeave', ReturnType<typeof fn>> }).__h;
    const trigger = canvas.getByRole('button', { name: 'Leave this page' });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('alertdialog', { name: 'Leave without saving?' });
    await expect(dialog).toHaveAccessibleDescription(/not saved/);
    const ui = within(dialog);
    // Focus starts on Stay (the safe choice).
    await waitFor(() => expect(ui.getByRole('button', { name: 'Stay' })).toHaveFocus());
    // Tab order: Stay, Discard, Save and leave, and it wraps inside the dialog.
    await userEvent.tab();
    await expect(ui.getByRole('button', { name: 'Discard' })).toHaveFocus();
    await userEvent.tab();
    await expect(ui.getByRole('button', { name: 'Save and leave' })).toHaveFocus();
    await userEvent.tab();
    await expect(ui.getByRole('button', { name: 'Stay' })).toHaveFocus();
    // Escape is Stay: closes and gives focus back.
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
    await expect(h.onStay).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(trigger).toHaveFocus());
    // Discard.
    await userEvent.click(trigger);
    await userEvent.click(within(await screen.findByRole('alertdialog')).getByRole('button', { name: 'Discard' }));
    await expect(h.onDiscard).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
    // Save and leave.
    await userEvent.click(trigger);
    await userEvent.click(within(await screen.findByRole('alertdialog')).getByRole('button', { name: 'Save and leave' }));
    await expect(h.onSaveAndLeave).toHaveBeenCalledTimes(1);
  },
};

/** The save is running: every button is disabled and the primary reads "Saving...". */
export const Saving: Story = {
  parameters: { controls: { disable: true } },
  render: () => <Example startOpen saving />,
};

export const SavingCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <Example startOpen saving />,
  play: async () => {
    const dialog = await screen.findByRole('alertdialog');
    await expect(within(dialog).getByRole('button', { name: 'Saving...' })).toBeDisabled();
    await expect(within(dialog).getByRole('button', { name: 'Discard' })).toBeDisabled();
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
