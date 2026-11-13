import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { AudioPlayer } from './audio-player';

type Args = { title: string; showArtist: boolean; duration: number; showSkip: boolean; showSpeed: boolean; width: number };

const meta = {
  title: 'Components/Media/Audio Player',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A compact audio player: Play and Pause, back and forward 10 s, a seek slider (arrows 1 s, Page Up and Down 10 s), elapsed and total time and a speed button. With src it drives a real audio element; without it the time is simulated, so no sound file is needed. Code only (no Figma component yet).',
      },
    },
  },
  args: { title: 'Weekly update, 12 October', showArtist: true, duration: 200, showSkip: true, showSpeed: true, width: 420 },
  argTypes: {
    title: { name: 'Title', control: 'text', description: 'Title of the recording; also the accessible name.', table: { category: 'Player' } },
    duration: { name: 'Duration (s)', control: { type: 'range', min: 10, max: 3700, step: 10 }, description: 'Length in seconds (simulated player).', table: { category: 'Player' } },
    width: { name: 'Width', control: { type: 'range', min: 276, max: 640, step: 4 }, description: 'Width of the column in px.', table: { category: 'Player' } },
    showArtist: { name: 'Show artist', control: 'boolean', description: 'The line under the title.', table: { category: 'Parts' } },
    showSkip: { name: 'Show skip buttons', control: 'boolean', description: 'Back and forward 10 seconds.', table: { category: 'Parts' } },
    showSpeed: { name: 'Show speed', control: 'boolean', description: 'The playback speed button.', table: { category: 'Parts' } },
  },
  render: ({ title, showArtist, duration, showSkip, showSpeed, width }) => (
    <div style={{ width }} className="max-w-full">
      <AudioPlayer
        key={duration}
        title={title}
        artist={showArtist ? 'Acme Product Team' : undefined}
        duration={duration}
        showSkip={showSkip}
        showSpeed={showSpeed}
      />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: () => (
    <div className="w-[420px] max-w-full">
      <AudioPlayer title="Weekly update, 12 October" artist="Acme Product Team" duration={200} />
    </div>
  ),
  play: async ({ canvas }) => {
    const player = canvas.getByRole('group', { name: 'Weekly update, 12 October' });
    await expect(player).toHaveAttribute('data-state', 'paused');
    const seek = canvas.getByRole('slider', { name: 'Seek' });
    await expect(seek).toHaveAttribute('aria-valuetext', '0:00 of 3:20');
    // Keyboard seek.
    seek.focus();
    await userEvent.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}');
    await waitFor(() => expect(seek).toHaveAttribute('aria-valuetext', '0:03 of 3:20'));
    await userEvent.keyboard('{PageUp}');
    await waitFor(() => expect(seek).toHaveAttribute('aria-valuetext', '0:13 of 3:20'));
    // Skip buttons.
    await userEvent.click(canvas.getByRole('button', { name: 'Forward 10 s' }));
    await waitFor(() => expect(seek).toHaveAttribute('aria-valuetext', '0:23 of 3:20'));
    await userEvent.click(canvas.getByRole('button', { name: 'Back 10 s' }));
    await waitFor(() => expect(seek).toHaveAttribute('aria-valuetext', '0:13 of 3:20'));
    // Speed cycles 1x to 1.25x.
    await userEvent.click(canvas.getByRole('button', { name: 'Playback speed 1x, change' }));
    await expect(canvas.getByRole('button', { name: 'Playback speed 1.25x, change' })).toBeVisible();
    // Play moves the clock, Pause stops it.
    await userEvent.click(canvas.getByRole('button', { name: 'Play' }));
    await expect(player).toHaveAttribute('data-state', 'playing');
    await waitFor(() => expect(canvas.getByText('0:14')).toBeVisible(), { timeout: 3000 });
    await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
    await expect(player).toHaveAttribute('data-state', 'paused');
  },
};

export const EndCheck: Story = {
  tags: ['!dev'],
  render: () => (
    <div className="w-[420px] max-w-full">
      <AudioPlayer title="Short clip" duration={12} defaultTime={10} />
    </div>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Play' }));
    // It stops by itself at the end.
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Play' })).toBeVisible(), { timeout: 4000 });
    await expect(canvas.getByRole('slider', { name: 'Seek' })).toHaveAttribute('aria-valuetext', '0:12 of 0:12');
    // Pressing Play at the end starts again from the start.
    await userEvent.click(canvas.getByRole('button', { name: 'Play' }));
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Pause' })).toBeVisible());
    await expect(canvas.getByRole('slider', { name: 'Seek' }).getAttribute('aria-valuetext')).not.toBe('0:12 of 0:12');
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <AudioPlayer
      title="A recording title that is far too long to fit in a narrow column of the page"
      artist="A very long artist or team name that also has to truncate"
      duration={3725}
    />
  ),
  play: async ({ canvas }) => {
    const player = canvas.getByRole('group');
    await expect(player.scrollWidth).toBeLessThanOrEqual(player.clientWidth + 1);
    await expect(canvas.getByText('1:02:05')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Play' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: /^Playback speed/ })).toBeVisible();
  },
};

export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
