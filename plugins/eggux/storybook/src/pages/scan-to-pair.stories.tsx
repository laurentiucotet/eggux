import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { ScanToPairPage, demoPairCode } from './scan-to-pair';
import { phoneGlobals, phoneStory } from './mobile-parts';

const meta = {
  title: 'Pages/Mobile/Scan to Pair',
  parameters: {
    ...phoneStory,
    docs: { description: { component: `Pair a device: the Scan Frame over the camera, a hint that says what to do, and "Enter the code instead" for people who cannot scan. Try it: ${demoPairCode} pairs, any other code fails. Cancel sits in the Mobile Header. Opens at the 375 px viewport.` } },
  },
  globals: phoneGlobals,
  render: () => <ScanToPairPage />,
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The code was read: green brackets and a confirmation. */
export const Success: Story = { render: () => <ScanToPairPage initialState="success" /> };

/** The code was not valid: red brackets, what happened, Try again. */
export const Failed: Story = { render: () => <ScanToPairPage initialState="error" /> };

/** The text fallback open. */
export const EnterCode: Story = { render: () => <ScanToPairPage initialManual /> };

/* Hidden checks */

export const FlowCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('heading', { level: 1, name: 'Scan to pair' })).toBeVisible();
    await expect(c.getByRole('status')).toHaveTextContent('Point the camera');
    await expect(c.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await userEvent.click(c.getByRole('button', { name: 'Enter the code instead' }));
    const field = await c.findByRole('textbox', { name: /6 character code/ });
    await userEvent.type(field, 'zz9');
    await userEvent.click(c.getByRole('button', { name: 'Pair device' }));
    await expect(await c.findByText('The code has 6 characters.')).toBeVisible();
    await userEvent.type(field, 'ZZZ');
    await userEvent.click(c.getByRole('button', { name: 'Pair device' }));
    await waitFor(() => expect(c.getByText('Pairing failed')).toBeVisible());
    await userEvent.click(c.getByRole('button', { name: 'Try again' }));
    const again = await c.findByRole('textbox', { name: /6 character code/ });
    await userEvent.type(again, demoPairCode.toLowerCase());
    await userEvent.click(c.getByRole('button', { name: 'Pair device' }));
    await waitFor(() => expect(c.getByText('Device paired')).toBeVisible());
  },
};
export const CancelCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(c.getByText('Pairing cancelled')).toBeVisible());
  },
};
export const DefaultDark: Story = { tags: ['!dev'], globals: { ...phoneGlobals, theme: 'Dark' } };
export const DefaultBackOffice: Story = { tags: ['!dev'], globals: { ...phoneGlobals, theme: 'Corporate Light' } };
export const FailedDark: Story = { ...Failed, tags: ['!dev'], globals: { ...phoneGlobals, theme: 'Dark' } };
export const EnterCodeDark: Story = { ...EnterCode, tags: ['!dev'], globals: { ...phoneGlobals, theme: 'Dark' } };
