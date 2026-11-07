import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { AudioPlayer, VideoPlayer, VideoThumbnail, formatTime, timeInWords } from './media';

const meta = {
  title: 'Components/Video/Video and Audio',
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Video Player: poster with a play button and duration; playing shows the seek slider, play / pause, mute, time, captions, settings and full screen; buffering shows a spinner. Keyboard: Space or K, Left / Right 5 s, M, F, C. Dark in every mode (video/* tokens); never autoplay with sound; captions for every video with speech. Video Thumbnail: a button "Play: <title>, 12:40" that opens the player. Audio Player: default card or compact pill with a waveform for voice messages. Figma: Video page. Guide: eggux build-ui/components/video-player.md' } },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma: 720 × 405; poster with a 64 play button and the 4:05 chip; play shows the controls.
export const Player: Story = {
  name: 'Video Player',
  render: () => <div className="w-[720px]"><VideoPlayer title="Getting started with invoices" duration={245} /></div>,
  play: async ({ canvas, canvasElement }) => {
    const player = canvas.getByRole('region', { name: 'Video: Getting started with invoices' });
    await expect(Math.round(box(player).width)).toBe(720);
    await expect(Math.round(box(player).height)).toBe(405);
    const play = canvas.getByRole('button', { name: 'Play: Getting started with invoices, 4 minutes 5 seconds' });
    await expect(Math.round(box(play).width)).toBe(64);
    await expect(player).toHaveTextContent('4:05');
    await userEvent.click(play);
    await expect(player).toHaveAttribute('data-state', 'playing');
    const seek = canvas.getByRole('slider', { name: 'Seek' });
    seek.focus();
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    await expect(seek).toHaveAttribute('aria-valuetext', '10 seconds of 4 minutes 5 seconds');
    await expect(canvasElement.querySelector('[data-slot="video-controls"]')).toHaveTextContent('0:10 / 4:05');
    await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
    await expect(player).toHaveAttribute('data-state', 'paused');
    await userEvent.click(canvas.getByRole('button', { name: 'Mute' }));
    await expect(canvas.getByRole('button', { name: 'Unmute' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Captions' })).toHaveAttribute('aria-pressed', 'false');
    await userEvent.keyboard('c');
    await expect(canvas.getByRole('button', { name: 'Captions' })).toHaveAttribute('aria-pressed', 'true');
  },
};

// Figma: playing with subtitles; buffering with the spinner; Size=lg 1152 × 648 with a 96 play button.
export const PlayerStates: Story = {
  name: 'Video Player states',
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="w-[720px]"><VideoPlayer title="Roadmap update" duration={245} defaultState="playing" defaultTime={84} subtitle="We ship the new onboarding in two phases." /></div>
      <div className="w-[720px]"><VideoPlayer title="Loading video" duration={245} defaultState="playing" defaultTime={84} buffering /></div>
      <div className="w-[1152px]"><VideoPlayer title="Product tour" duration={612} size="lg" /></div>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    await expect(canvasElement.querySelector('[data-slot="video-subtitles"]')).toHaveTextContent('We ship the new onboarding in two phases.');
    await expect(canvas.getAllByRole('slider', { name: 'Seek' })[0]).toHaveAttribute('aria-valuetext', '1 minute 24 seconds of 4 minutes 5 seconds');
    await expect(canvas.getByRole('status', { name: 'Loading video' })).toBeInTheDocument();
    const lg = canvas.getByRole('region', { name: 'Video: Product tour' });
    await expect(Math.round(box(lg).height)).toBe(648);
    await expect(Math.round(box(canvas.getByRole('button', { name: /Play: Product tour/ })).width)).toBe(96);
  },
};

const onOpen = fn();

// Figma: 360 × 203, 52 play disc, 12:40 badge; one button named by the video and its length.
export const Thumbnail: Story = {
  name: 'Video Thumbnail',
  render: () => (
    <div className="flex gap-6">
      <VideoThumbnail title="Closing the books faster" duration={760} onClick={onOpen} />
      <VideoThumbnail title="Approvals in two minutes" duration={95} showDuration={false} />
    </div>
  ),
  play: async ({ canvas }) => {
    const thumb = canvas.getByRole('button', { name: 'Play: Closing the books faster, 12:40' });
    await expect(Math.round(box(thumb).width)).toBe(360);
    await expect(Math.abs(Math.round(box(thumb).height) - 203)).toBeLessThanOrEqual(1);
    await expect(thumb).toHaveTextContent('12:40');
    await userEvent.click(thumb);
    await expect(onOpen).toHaveBeenCalled();
    await expect(canvas.getByRole('button', { name: /Approvals in two minutes/ })).not.toHaveTextContent('1:35');
  },
};

// Figma: default 480 × 68, compact 280 × 50 with a 28-bar waveform as the seek slider.
export const Audio: Story = {
  name: 'Audio Player',
  render: () => (
    <div className="flex flex-col gap-4">
      <AudioPlayer title="Episode 12: Closing the books faster" duration={870} defaultTime={252} defaultPlaying />
      <AudioPlayer title="Episode 13: Approvals that scale" duration={1325} />
      <AudioPlayer variant="compact" title="Voice message from Ana" duration={42} defaultTime={25} defaultPlaying />
      <AudioPlayer variant="compact" title="Voice message from Mihai" duration={18} />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const players = canvasElement.querySelectorAll('[data-slot="audio-player"]');
    await expect(Math.round(box(players[0]!).width)).toBe(480);
    await expect(Math.round(box(players[0]!).height)).toBe(68);
    await expect(Math.round(box(players[2]!).width)).toBe(280);
    await expect(Math.round(box(players[2]!).height)).toBe(50);
    await expect(players[2]!.querySelectorAll('[data-slot="wave-bar"]')).toHaveLength(28);
    const seek = canvas.getByRole('slider', { name: 'Seek Episode 12: Closing the books faster' });
    await expect(seek).toHaveAttribute('aria-valuetext', '4 minutes 12 seconds of 14 minutes 30 seconds');
    await userEvent.click(canvas.getByRole('button', { name: 'Pause Episode 12: Closing the books faster' }));
    await expect(players[0]).toHaveAttribute('data-state', 'paused');
    const play = canvas.getByRole('button', { name: 'Play Voice message from Mihai' });
    await userEvent.click(play);
    await expect(canvas.getByRole('button', { name: 'Pause Voice message from Mihai' })).toBeInTheDocument();
    seek.focus();
    await userEvent.keyboard('{ArrowLeft}');
    await expect(seek).toHaveAttribute('aria-valuenow', '247');
  },
};

// Time formats and narrow widths. Tests only.
export const EdgeCases: Story = {
  tags: ['!dev'],
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="w-[276px]"><VideoPlayer title="Narrow" duration={3725} defaultState="playing" /></div>
      <div className="w-[276px]"><AudioPlayer title="A very long episode title that has to be cut on one line" duration={3725} /></div>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(formatTime(84)).toBe('1:24');
    await expect(formatTime(3725)).toBe('1:02:05');
    await expect(timeInWords(61)).toBe('1 minute 1 second');
    await expect(timeInWords(0)).toBe('0 seconds');
    await expect(canvas.getByRole('region', { name: 'Video: Narrow' })).toHaveTextContent('0:00 / 1:02:05');
  },
};

const All = () => (
  <div className="flex flex-col gap-6">
    <div className="w-[720px]"><VideoPlayer title="Roadmap update" duration={245} defaultState="playing" defaultTime={84} subtitle="We ship the new onboarding in two phases." /></div>
    <VideoThumbnail title="Closing the books faster" duration={760} />
    <AudioPlayer title="Episode 12" duration={870} defaultTime={252} />
    <AudioPlayer variant="compact" title="Voice message" duration={42} defaultTime={25} />
  </div>
);
export const AllDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, render: () => <All /> };
export const AllCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: () => <All /> };
