import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { Button } from './button';
import { DraftSavedIndicator, type DraftSaveStatus } from './draft-saved-indicator';

// Fixed time so nothing depends on today: 14:32 UTC.
const NOW = '2026-03-12T14:32:10Z';

type Args = { status: DraftSaveStatus; showRetry: boolean; width: number };

const meta = {
  title: 'Components/Wizard/Draft Saved Indicator',
  parameters: {
    docs: {
      description: {
        component:
          'One polite line for the state of a draft: idle, "Saving...", "Saved at 14:32" or "Could not save" with Retry. The time is given (`savedAt` or `now`), never read from the clock. Lives in the footer or header of a long form or a Wizard Shell. Code only (no Figma component yet). Guide: eggux build-ui/patterns/wizard.md',
      },
    },
  },
  args: { status: 'saved', showRetry: true, width: 320 },
  argTypes: {
    status: { name: 'Status', control: 'select', options: ['idle', 'saving', 'saved', 'error'], description: 'What happens to the draft.', table: { category: 'Indicator' } },
    width: { name: 'Width', control: { type: 'range', min: 120, max: 480, step: 4 }, description: 'Container width in px.', table: { category: 'Indicator' } },
    showRetry: { name: 'Show Retry', control: 'boolean', description: 'The Retry button on an error.', table: { category: 'Parts' } },
  },
  render: ({ status, showRetry, width }) => (
    <div style={{ width }} className="max-w-full">
      <DraftSavedIndicator status={status} now={NOW} timeZone="UTC" onRetry={showRetry ? () => undefined : undefined} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

function Flow({ onSave }: { onSave?: () => void }) {
  const [status, setStatus] = React.useState<DraftSaveStatus>('idle');
  const [fail, setFail] = React.useState(true);
  const save = () => {
    onSave?.();
    setStatus('saving');
    window.setTimeout(() => {
      if (fail) {
        setFail(false);
        setStatus('error');
      } else setStatus('saved');
    }, 30);
  };
  return (
    <div className="flex items-center gap-4">
      <Button type="button" variant="outline" onClick={save}>Save draft</Button>
      <DraftSavedIndicator status={status} savedAt={NOW} now={NOW} timeZone="UTC" onRetry={save} />
    </div>
  );
}

/** Press Save draft: Saving..., then a first failure with Retry, then Saved. */
export const Flowing: Story = {
  parameters: { controls: { disable: true } },
  render: () => <Flow />,
};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <Flow onSave={fn()} />,
  play: async ({ canvas }) => {
    const status = canvas.getByRole('status');
    await expect(status).toHaveAttribute('aria-live', 'polite');
    await expect(status).toHaveTextContent('');
    await userEvent.click(canvas.getByRole('button', { name: 'Save draft' }));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Saving...'));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Could not save'));
    await userEvent.click(await canvas.findByRole('button', { name: 'Retry' }));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Saved at 14:32'));
    await expect(canvas.queryByRole('button', { name: 'Retry' })).toBeNull();
  },
};

/** All four states, for contrast and layout. */
export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="flex w-[276px] flex-col gap-3"><Story /></div>],
  render: () => (
    <>
      <DraftSavedIndicator status="idle" idleText="No changes yet" />
      <DraftSavedIndicator status="saving" />
      <DraftSavedIndicator status="saved" savedAt={NOW} timeZone="UTC" />
      <DraftSavedIndicator status="error" errorText="Could not save the draft because the connection was lost" onRetry={() => undefined} />
    </>
  ),
  play: async ({ canvas }) => {
    const all = canvas.getAllByRole('status');
    await expect(all).toHaveLength(4);
    for (const el of all) await expect(el.getBoundingClientRect().width).toBeLessThanOrEqual(276);
    await expect(canvas.getByText('Saved at 14:32')).toBeVisible();
  },
};

export const DefaultDark: Story = { ...Stress, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Stress, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
