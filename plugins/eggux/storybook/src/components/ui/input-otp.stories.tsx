import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { InputOTP } from './input-otp';

const meta = {
  title: 'Components/Input OTP/Input OTP',
  component: InputOTP,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'One-time code input for codes sent by SMS or email: 4 boxes, or 6 as 3 + 3. One real input with autocomplete one-time-code, so paste and SMS autofill fill every box; the last digit submits. A wrong code marks every box and says so under them. Say where the code was sent and offer "Resend code" after a countdown. Passwords use Field Preset password. Figma: Input OTP page / Input OTP, OTP Slot. Guide: eggux build-ui/patterns/auth.md' } },
  },
  args: { 'aria-label': 'Verification code', onComplete: fn() },
} satisfies Meta<typeof InputOTP>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma Length=6: 248 × 36 (3 + 3 with the separator); typing fills the slots, the 6th digit completes.
export const Default: Story = {
  play: async ({ canvas, canvasElement, args }) => {
    const input = canvas.getByRole('textbox', { name: 'Verification code' });
    await expect(input).toHaveAttribute('autocomplete', 'one-time-code');
    await expect(input).toHaveAttribute('inputmode', 'numeric');
    const root = canvasElement.querySelector('[data-slot="input-otp"]')!;
    await expect([Math.round(box(root).width), Math.round(box(root).height)]).toEqual([248, 36]);
    await userEvent.click(input);
    await expect(canvasElement.querySelector('[data-active]')).toBe(canvasElement.querySelector('[data-slot="otp-slot"]'));
    await userEvent.keyboard('12a3456');
    await expect(input).toHaveValue('123456');
    await expect(args.onComplete).toHaveBeenCalledWith('123456');
    await expect(canvasElement.querySelectorAll('[data-slot="otp-slot"]')[5]).toHaveTextContent('6');
  },
};

// Figma Length=4: 144 × 36; paste fills all boxes.
export const FourDigits: Story = {
  args: { length: 4 },
  play: async ({ canvas, canvasElement, args }) => {
    const root = canvasElement.querySelector('[data-slot="input-otp"]')!;
    await expect(Math.round(box(root).width)).toBe(144);
    const input = canvas.getByRole('textbox');
    await userEvent.click(input);
    await userEvent.paste('4821');
    await expect(args.onComplete).toHaveBeenCalledWith('4821');
  },
};

// Wrong code: every slot in destructive, the message linked to the input; digits kept for editing.
export const Invalid: Story = {
  render: args => {
    const id = React.useId();
    return (
      <div className="flex flex-col gap-2">
        <InputOTP {...args} defaultValue="123456" invalid aria-describedby={id} />
        <p id={id} className="m-0 text-sm text-destructive">That code is not right. Check the latest SMS and try again.</p>
      </div>
    );
  },
  play: async ({ canvas, canvasElement }) => {
    const input = canvas.getByRole('textbox', { name: 'Verification code' });
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription(/That code is not right/);
    const slots = canvasElement.querySelectorAll('[data-slot="otp-slot"]');
    await expect(getComputedStyle(slots[0]!).borderTopColor).toBe(getComputedStyle(slots[5]!).borderTopColor);
    await expect(slots[0]).toHaveTextContent('1');
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, args: { defaultValue: '123' } };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, args: { defaultValue: '123' } };
