import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { SaveBar } from './save-bar';

const meta = {
  title: 'Components/Save Bar/Save Bar',
  component: SaveBar,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Sticky bar at the bottom of a long form or settings page while there are unsaved changes. The message says what is unsaved; saving shows "Saving…" with Save disabled; an error says what to fix. Discard asks first when changes are large; Save validates and scrolls to the first error. Leaving the page triggers the unsaved-changes pattern. Figma: Save Bar page / Save Bar. Guide: eggux build-ui/patterns/unsaved-changes.md' } },
  },
  args: { message: '3 unsaved changes', onSave: fn(), onDiscard: fn() },
  render: args => <div className="w-[720px]"><SaveBar {...args} /></div>,
} satisfies Meta<typeof SaveBar>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma State=default: 720 × 54, region "Unsaved changes", Discard and Save changes (32).
export const Default: Story = {
  play: async ({ canvas, args }) => {
    const bar = canvas.getByRole('region', { name: 'Unsaved changes' });
    await expect(Math.round(box(bar).height)).toBe(54);
    await expect(bar).toHaveTextContent('3 unsaved changes');
    const save = canvas.getByRole('button', { name: 'Save changes' });
    await expect(Math.round(box(save).height)).toBe(32);
    await userEvent.click(save);
    await expect(args.onSave).toHaveBeenCalled();
    await userEvent.click(canvas.getByRole('button', { name: 'Discard' }));
    await expect(args.onDiscard).toHaveBeenCalled();
  },
};

// Figma State=saving and error: Save disabled while saving; the error in destructive.
export const States: Story = {
  render: args => (
    <div className="flex w-[720px] flex-col gap-4">
      <SaveBar {...args} state="saving" labels={{ region: 'Saving profile' }} />
      <SaveBar {...args} state="error" message="Couldn't save. Check the highlighted fields." labels={{ region: 'Profile not saved' }} />
    </div>
  ),
  play: async ({ canvas }) => {
    const saving = canvas.getByRole('region', { name: 'Saving profile' });
    await expect(saving).toHaveTextContent('Saving…');
    await expect(within(saving).getByRole('button', { name: 'Save changes' })).toBeDisabled();
    const error = canvas.getByRole('region', { name: 'Profile not saved' });
    const msg = within(error).getByText(/Couldn't save/);
    await expect(getComputedStyle(msg).color).not.toBe(getComputedStyle(within(saving).getByText('Saving…')).color);
  },
};

// Stress: at 320 the actions drop under the message. Tests only.
export const Stress: Story = {
  tags: ['!dev'],
  args: { message: '12 unsaved changes in billing, notifications and team settings' },
  render: args => <div className="w-[320px]"><SaveBar {...args} /></div>,
  play: async ({ canvas }) => {
    const bar = canvas.getByRole('region');
    const msg = canvas.getByText(/12 unsaved/);
    await expect(box(canvas.getByRole('button', { name: 'Discard' })).top).toBeGreaterThan(box(msg).bottom);
    await expect(bar.scrollWidth).toBeLessThanOrEqual(bar.clientWidth + 2);
  },
};

export const DefaultDark: Story = { parameters: { controls: { disable: true } }, tags: ['!dev'], globals: { theme: 'Dark' }, render: States.render };
export const DefaultCorporate: Story = { parameters: { controls: { disable: true } }, tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: States.render };
