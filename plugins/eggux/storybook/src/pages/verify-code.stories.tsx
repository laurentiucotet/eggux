import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { VerifyCodePage, demoCode } from './verify-code';

const meta = {
  title: 'Pages/Auth/Verify code',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: { description: { component: `Two-factor: six digits, submitted on the last one, with a recovery code and "trust this device" as the alternatives. Try it: ${demoCode} works, any other code fails. Guide: eggux build-ui/patterns/auth.md` } },
  },
  render: () => <VerifyCodePage />,
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** After a code that is not right: the alert, the digits marked invalid. */
export const WrongCode: Story = { render: () => <VerifyCodePage initialCode="482913" initialError /> };

/* Hidden checks */

export const FlowCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('heading', { level: 1, name: 'Enter your code' })).toBeVisible();
    const code = c.getByRole('textbox', { name: '6-digit code' });
    await expect(code).toHaveAttribute('autocomplete', 'one-time-code');
    await expect(c.getByRole('button', { name: 'Verify' })).toBeDisabled();
    await userEvent.type(code, '000000');
    await expect(await c.findByRole('alert')).toHaveTextContent('That code is not right');
    await userEvent.clear(code);
    await userEvent.type(code, demoCode);
    await waitFor(() => expect(c.getByText('Code accepted')).toBeVisible());
  },
};
export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultBackOffice: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
export const WrongCodeDark: Story = { ...WrongCode, tags: ['!dev'], globals: { theme: 'Dark' } };
