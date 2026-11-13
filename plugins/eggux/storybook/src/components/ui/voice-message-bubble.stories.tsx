import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, userEvent, waitFor } from 'storybook/test';
import { VoiceMessageBubble } from './voice-message-bubble';

type Args = { direction: 'incoming' | 'outgoing'; duration: number; showSpeed: boolean };

const meta = {
  title: 'Components/Messaging/Voice Message Bubble',
  decorators: [Story => <div className="w-[320px] max-w-full"><Story /></div>],
  parameters: {
    docs: {
      description: {
        component:
          'A voice message in a chat: Play / Pause, a waveform that fills with progress, the time and a speed button. The waveform is a native range input, so it seeks by pointer and keyboard. Without a src the time is simulated. Incoming is a muted bubble, outgoing a primary one. Code only (no Figma component yet).',
      },
    },
  },
  args: { direction: 'incoming', duration: 42, showSpeed: true },
  argTypes: {
    direction: { name: 'Direction', control: 'inline-radio', options: ['incoming', 'outgoing'], description: 'Who sent it: incoming (muted) or outgoing (primary).', table: { category: 'Bubble' } },
    duration: { name: 'Length (s)', control: { type: 'range', min: 3, max: 600, step: 1 }, description: 'Length of the message in seconds.', table: { category: 'Bubble' } },
    showSpeed: { name: 'Show speed', control: 'boolean', description: 'Show the speed button.', table: { category: 'Bubble' } },
  },
  render: ({ direction, duration, showSpeed }) => (
    <VoiceMessageBubble key={duration} author="Ana" direction={direction} duration={duration} showSpeed={showSpeed} />
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('group', { name: 'Voice message from Ana' })).toBeVisible();
    await expect(canvas.getByText('0:42')).toBeVisible();
    const play = canvas.getByRole('button', { name: 'Play voice message' });
    await expect(Math.round(play.getBoundingClientRect().height)).toBe(32);
    await userEvent.click(play);
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Pause voice message' })).toBeVisible());
    // The simulated clock moves and the elapsed time replaces the total.
    await waitFor(() => expect(canvas.queryByText('0:42')).not.toBeInTheDocument(), { timeout: 3000 });
    await userEvent.click(canvas.getByRole('button', { name: 'Pause voice message' }));
    await expect(canvas.getByRole('button', { name: 'Play voice message' })).toBeVisible();
    // Seek (the native range handles arrows, Home and End; Page Up and Down add 5 s).
    const seek = canvas.getByRole('slider', { name: 'Seek Voice message from Ana' });
    seek.focus();
    fireEvent.change(seek, { target: { value: '42' } });
    await waitFor(() => expect(seek).toHaveAttribute('aria-valuetext', '0:42 of 0:42'));
    fireEvent.change(seek, { target: { value: '0' } });
    await waitFor(() => expect(seek).toHaveAttribute('aria-valuetext', '0:00 of 0:42'));
    fireEvent.keyDown(seek, { key: 'PageUp' });
    await waitFor(() => expect(seek).toHaveAttribute('aria-valuetext', '0:05 of 0:42'));
    // Speed cycles 1x, 1.5x, 2x, 1x.
    const speed = canvas.getByRole('button', { name: 'Playback speed 1x, change' });
    await userEvent.click(speed);
    await expect(canvas.getByRole('button', { name: 'Playback speed 1.5x, change' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Playback speed 1.5x, change' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Playback speed 2x, change' }));
    await expect(canvas.getByRole('button', { name: 'Playback speed 1x, change' })).toBeVisible();
  },
};

/** Both directions, one played halfway. */
export const Directions: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col items-start gap-3">
      <VoiceMessageBubble author="Ana" duration={42} defaultTime={14} />
      <div className="flex w-full justify-end">
        <VoiceMessageBubble direction="outgoing" duration={95} defaultTime={30} />
      </div>
    </div>
  ),
};

export const DirectionsCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: Directions.render,
  play: async ({ canvas }) => {
    const sliders = canvas.getAllByRole('slider');
    await expect(sliders[0]).toHaveAttribute('aria-valuetext', '0:14 of 0:42');
    await expect(sliders[1]).toHaveAttribute('aria-valuetext', '0:30 of 1:35');
    const played = canvas.getByRole('group', { name: 'Voice message from Ana' }).querySelectorAll('[data-played="true"]');
    await expect(played.length).toBeGreaterThan(8);
    await expect(played.length).toBeLessThan(18);
    await expect(canvas.getByRole('group', { name: 'Voice message' })).toHaveAttribute('data-direction', 'outgoing');
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => <VoiceMessageBubble author="Alexandra-Maria Constantinescu" duration={3725} defaultTime={3600} />,
  play: async ({ canvas }) => {
    const group = canvas.getByRole('group');
    await expect(group.scrollWidth).toBeLessThanOrEqual(group.clientWidth + 1);
    await expect(canvas.getByRole('button', { name: 'Playback speed 1x, change' })).toBeVisible();
    await expect(canvas.getByText('60:00')).toBeVisible();
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
