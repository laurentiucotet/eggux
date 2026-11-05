import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { VoiceRecorder } from './voice-recorder';

const meta = {
  title: 'AI Chat/Voice Recorder',
  component: VoiceRecorder,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Replaces the Prompt Input while dictating: cancel, recording dot and time, live waveform, send; processing shows "Transcribing…" and the text lands in the input for review. Presentational: the app owns the microphone and passes time and levels. Figma: AI Chat / Voice Recorder. Guide: eggux build-ui/components/ai-chat.md' } },
  },
  args: { onCancel: fn(), onSend: fn() },
  decorators: [Story => <div className="w-[768px] max-w-full"><Story /></div>],
} satisfies Meta<typeof VoiceRecorder>;
export default meta;
type Story = StoryObj<typeof meta>;

// Figma State=recording.
export const Default: Story = {
  play: async ({ canvas, canvasElement, args }) => {
    const root = canvasElement.querySelector('[data-slot="voice-recorder"]') as HTMLElement;
    // Figma: 768 × 62; Cancel and Send are Button Icon default (36).
    await expect(Math.round(root.getBoundingClientRect().height)).toBe(62);
    const send = canvas.getByRole('button', { name: 'Send recording' });
    await expect(Math.round(send.getBoundingClientRect().height)).toBe(36);
    // Recording is announced in text, not by the red dot alone.
    await expect(canvas.getByRole('status')).toHaveTextContent('Recording');
    await expect(canvas.getByText('0:12')).toBeVisible();
    await userEvent.click(send);
    await expect(args.onSend).toHaveBeenCalledTimes(1);
    await userEvent.click(canvas.getByRole('button', { name: 'Cancel recording' }));
    await expect(args.onCancel).toHaveBeenCalledTimes(1);
  },
};

// Figma State=processing: spinner and "Transcribing…" in a status, Cancel stays.
export const Processing: Story = {
  args: { state: 'processing' },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent('Transcribing…');
    await expect(canvas.queryByRole('button', { name: 'Send recording' })).not.toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Cancel recording' })).toBeEnabled();
    const root = canvasElement.querySelector('[data-slot="voice-recorder"]') as HTMLElement;
    await expect(Math.round(root.getBoundingClientRect().height)).toBe(62);
  },
};

// Keyboard: Tab reaches Cancel then Send; Escape cancels.
export const Keyboard: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Cancel recording' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Send recording' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onSend).toHaveBeenCalledTimes(1);
    await userEvent.keyboard('{Escape}');
    await expect(args.onCancel).toHaveBeenCalledTimes(1);
  },
};

// Levels drive the bar heights (4 px silent to 28 px loud); missing samples are flat bars.
export const Levels: Story = {
  args: { levels: [0, 0.5, 1], barCount: 10, elapsed: 75 },
  play: async ({ canvas, canvasElement }) => {
    const bars = Array.from(canvasElement.querySelectorAll('[data-slot="voice-recorder-waveform"] > span')) as HTMLElement[];
    await expect(bars).toHaveLength(10);
    await expect(bars.slice(0, 3).map(b => Math.round(b.getBoundingClientRect().height))).toEqual([4, 16, 28]);
    await expect(Math.round(bars[9].getBoundingClientRect().height)).toBe(4);
    await expect(canvas.getByText('1:15')).toBeVisible();
  },
};

// A live recording driven by a timer, the way an app feeds it (no microphone in stories).
function LiveDemo() {
  const [samples, setSamples] = React.useState<number[]>([]);
  React.useEffect(() => {
    const id = window.setInterval(() => setSamples(s => [...s, Math.abs(Math.sin(s.length / 2)) * 0.9 + 0.05].slice(-200)), 120);
    return () => window.clearInterval(id);
  }, []);
  return <VoiceRecorder levels={samples} elapsed={Math.floor(samples.length * 0.12)} />;
}
export const Live: Story = { render: () => <LiveDemo /> };

// Stress test: 368 px panel; the waveform shrinks and drops the oldest bars, Send keeps its size.
export const NarrowPanel: Story = { tags: ['!dev'],
  args: { elapsed: 3723 },
  decorators: [Story => <div className="w-[368px]"><Story /></div>],
  play: async ({ canvas, canvasElement }) => {
    const root = canvasElement.querySelector('[data-slot="voice-recorder"]') as HTMLElement;
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth);
    await expect(Math.round(root.getBoundingClientRect().height)).toBe(62);
    await expect(Math.round(canvas.getByRole('button', { name: 'Send recording' }).getBoundingClientRect().width)).toBe(36);
    await expect(canvas.getByText('62:03')).toBeVisible();
  },
};

export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const ProcessingDark: Story = { ...Processing, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
