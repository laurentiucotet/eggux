import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { Lock } from '@/components/icons';
import { PinPad } from './pin-pad';

type Args = { length: 4 | 6; title: string; showError: boolean; showExtraKey: boolean };

const meta = {
  title: 'Components/Mobile/Pin Pad',
  parameters: {
    docs: {
      description: {
        component:
          'The numeric keypad for a PIN or passcode: dots that fill as digits go in, a 3 x 4 keypad with 64 px round keys, a free slot for biometrics and a delete key. Digits also come from a hardware keyboard. The dots are one status ("2 of 4 digits entered"); digits are never shown. A wrong code is an alert. Code only (no Figma component yet).',
      },
    },
  },
  args: { length: 4, title: 'Enter your PIN', showError: false, showExtraKey: true },
  argTypes: {
    length: { name: 'Length', control: 'inline-radio', options: [4, 6], description: 'Digits in the code.', table: { category: 'Pad' } },
    title: { name: 'Title', control: 'text', description: 'What the code is for.', table: { category: 'Pad' } },
    showError: { name: 'Show error', control: 'boolean', description: 'The wrong-code message.', table: { category: 'Pad' } },
    showExtraKey: { name: 'Show extra key', control: 'boolean', description: 'A biometrics button left of 0.', table: { category: 'Parts' } },
  },
  render: ({ length, title, showError, showExtraKey }) => (
    <PinPad
      key={length}
      length={length}
      title={title}
      error={showError ? 'Wrong PIN. 2 tries left.' : undefined}
      extraKey={showExtraKey ? <button type="button" aria-label="Use biometrics" className="flex size-16 items-center justify-center rounded-full text-muted-foreground hover:bg-accent [&_svg]:size-6"><Lock /></button> : undefined}
    />
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: () => {
    const onComplete = fn();
    return <PinPad length={4} onComplete={onComplete} />;
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status', { name: '0 of 4 digits entered' })).toBeVisible();
    // Keys are 64 px round.
    await expect(Math.round(canvas.getByRole('button', { name: '5' }).getBoundingClientRect().width)).toBe(64);
    await userEvent.click(canvas.getByRole('button', { name: '1' }));
    await userEvent.click(canvas.getByRole('button', { name: '2' }));
    await expect(canvas.getByRole('status', { name: '2 of 4 digits entered' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Delete last digit' }));
    await expect(canvas.getByRole('status', { name: '1 of 4 digits entered' })).toBeVisible();
  },
};

export const CompleteCheck: Story = {
  tags: ['!dev'],
  render: function Render() {
    const [done, setDone] = React.useState('');
    return (
      <>
        <PinPad length={4} onComplete={setDone} />
        <p data-testid="done">{done}</p>
      </>
    );
  },
  play: async ({ canvas }) => {
    // From the hardware keyboard.
    canvas.getByRole('group', { name: 'Enter your PIN' }).focus();
    await userEvent.keyboard('1234');
    await waitFor(() => expect(canvas.getByTestId('done')).toHaveTextContent('1234'));
    await userEvent.keyboard('{Backspace}');
    await expect(canvas.getByRole('status', { name: '3 of 4 digits entered' })).toBeVisible();
  },
};

/** The wrong-code state with a six-digit code. */
export const WrongCode: Story = { args: { length: 6, showError: true } };

export const ErrorCheck: Story = {
  tags: ['!dev'],
  args: { showError: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent('Wrong PIN. 2 tries left.');
    await expect(canvas.getByRole('button', { name: 'Delete last digit' })).toBeDisabled();
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => <PinPad length={6} title="Enter the six digit passcode you chose when you set up this device" />,
  play: async ({ canvas }) => {
    const group = canvas.getByRole('group');
    await expect(group.scrollWidth).toBeLessThanOrEqual(group.clientWidth + 1);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
