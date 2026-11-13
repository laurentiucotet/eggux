import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { PinLockPage, demoPin } from './pin-lock';
import { phoneGlobals, phoneStory } from './mobile-parts';

const meta = {
  title: 'Pages/Mobile/PIN Lock',
  parameters: {
    ...phoneStory,
    docs: { description: { component: `App lock on the Pin Pad. Try it: ${demoPin} unlocks, any other code shows an error and clears the dots. After three wrong codes the pad locks and offers "Use password instead". Face ID sits in the free key left of 0. Opens at the 375 px viewport.` } },
  },
  globals: phoneGlobals,
  render: () => <PinLockPage />,
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** After one wrong code: the message under the dots, the dots cleared. */
export const WrongPin: Story = { render: () => <PinLockPage initialTries={1} initialError /> };

/** After three wrong codes: the pad is gone, the password is the way back in. */
export const Locked: Story = { render: () => <PinLockPage initialTries={3} /> };

/* Hidden checks */

const press = async (c: ReturnType<typeof within>, code: string) => {
  for (const d of code) await userEvent.click(c.getByRole('button', { name: d }));
};

export const FlowCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('heading', { level: 1, name: 'Acme is locked' })).toBeVisible();
    await expect(c.getByRole('button', { name: 'Use Face ID' })).toBeVisible();
    await press(c, '12');
    await waitFor(() => expect(c.getByRole('status', { name: '2 of 4 digits entered' })).toBeVisible());
    await press(c, '99');
    await waitFor(() => expect(c.getByRole('alert')).toHaveTextContent('Wrong PIN. 2 tries left.'));
    await expect(c.getByRole('status', { name: '0 of 4 digits entered' })).toBeVisible();
    await press(c, '0000');
    await waitFor(() => expect(c.getByRole('alert')).toHaveTextContent('1 try left'));
    await press(c, demoPin);
    await waitFor(() => expect(c.getByText('Welcome back, Ana')).toBeVisible());
  },
};
export const LockoutCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await press(c, '1111');
    await press(c, '2222');
    await press(c, '3333');
    await waitFor(() => expect(c.getByText('Too many wrong codes')).toBeVisible());
    await expect(c.queryByRole('group', { name: 'Enter your PIN' })).toBeNull();
    await userEvent.click(c.getByRole('button', { name: 'Use password instead' }));
    await waitFor(() => expect(c.getByText('Sign in with your password')).toBeVisible());
  },
};
export const BiometricsCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole('button', { name: 'Use Face ID' }));
    await waitFor(() => expect(c.getByText('Welcome back, Ana')).toBeVisible());
  },
};
export const DefaultDark: Story = { tags: ['!dev'], globals: { ...phoneGlobals, theme: 'Dark' } };
export const DefaultBackOffice: Story = { tags: ['!dev'], globals: { ...phoneGlobals, theme: 'Corporate Light' } };
export const WrongPinDark: Story = { ...WrongPin, tags: ['!dev'], globals: { ...phoneGlobals, theme: 'Dark' } };
export const LockedDark: Story = { ...Locked, tags: ['!dev'], globals: { ...phoneGlobals, theme: 'Dark' } };
