// EGG UI Voice Message Bubble. Code only (no Figma component yet). A voice message in a chat: a
// round Play / Pause button, a waveform of bars that fill with progress, the time and a speed
// button (1x, 1.5x, 2x). The waveform is a native range input stretched over the bars, so it is
// seekable by pointer and by keyboard (arrows 1 s, Page Up and Down 5 s, Home, End) and its value
// text is "0:12 of 0:42". With `src` it drives a real audio element; without it (stories) it
// simulates the clock. Incoming = muted bubble, outgoing = primary bubble. The time shows the
// total at rest and the elapsed time while playing or paused midway. Nothing is announced by
// itself; the buttons carry their state in the name. Not for recording (Voice Recorder).
import * as React from 'react';
import { Pause, Play } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';

const SPEEDS = [1, 1.5, 2];

/** 40 bar heights, 0 to 1: a plausible voice. */
const LEVELS = [0.2, 0.35, 0.5, 0.3, 0.6, 0.8, 0.55, 0.4, 0.7, 0.9, 0.65, 0.45, 0.3, 0.5, 0.75, 0.95, 0.7, 0.5, 0.35, 0.25, 0.4, 0.6, 0.85, 0.6, 0.45, 0.3, 0.5, 0.7, 0.55, 0.35, 0.25, 0.4, 0.6, 0.45, 0.3, 0.2, 0.3, 0.25, 0.15, 0.1];

function formatTime(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export interface VoiceMessageBubbleProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** Who sent it: part of the accessible name ("Voice message from Ana"). */
  author?: string;
  direction?: 'incoming' | 'outgoing';
  /** Audio file URL. Without it the bubble simulates the time. */
  src?: string;
  /** Length in seconds (until the file reports its own). */
  duration?: number;
  /** Start at this second. */
  defaultTime?: number;
  /** Bar heights from 0 to 1. Default: a sample voice. */
  levels?: number[];
  /** Show the speed button. */
  showSpeed?: boolean;
  onPlayingChange?: (playing: boolean) => void;
}

function VoiceMessageBubble({
  author,
  direction = 'incoming',
  src,
  duration: durationProp = 42,
  defaultTime = 0,
  levels = LEVELS,
  showSpeed = true,
  onPlayingChange,
  className,
  ...props
}: VoiceMessageBubbleProps) {
  const audio = React.useRef<HTMLAudioElement>(null);
  const [playing, setPlayingState] = React.useState(false);
  const [time, setTime] = React.useState(defaultTime);
  const [duration, setDuration] = React.useState(durationProp);
  const [speed, setSpeed] = React.useState(1);
  const out = direction === 'outgoing';

  React.useEffect(() => {
    if (!src) setDuration(durationProp);
  }, [durationProp, src]);

  const setPlaying = (value: boolean) => {
    setPlayingState(value);
    onPlayingChange?.(value);
  };

  React.useEffect(() => {
    if (src || !playing) return;
    const id = window.setInterval(() => setTime(t => Math.min(duration, t + 0.1 * speed)), 100);
    return () => window.clearInterval(id);
  }, [src, playing, speed, duration]);

  React.useEffect(() => {
    if (!src && playing && time >= duration) {
      setPlayingState(false);
      onPlayingChange?.(false);
      setTime(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, duration, playing, src]);

  React.useEffect(() => {
    if (audio.current) audio.current.playbackRate = speed;
  }, [speed]);

  const seek = (to: number) => {
    const next = Math.min(duration, Math.max(0, to));
    setTime(next);
    if (audio.current) audio.current.currentTime = next;
  };

  const toggle = () => {
    if (audio.current) {
      if (playing) audio.current.pause();
      else void audio.current.play().catch(() => setPlaying(false));
    }
    setPlaying(!playing);
  };

  const progress = duration > 0 ? time / duration : 0;
  const shown = playing || time > 0 ? time : duration;
  const label = author ? `Voice message from ${author}` : 'Voice message';

  return (
    <div
      data-slot="voice-message-bubble"
      data-direction={direction}
      data-state={playing ? 'playing' : 'paused'}
      role="group"
      aria-label={label}
      className={cn(
        'flex w-full min-w-0 max-w-[320px] items-center gap-2 rounded-xl px-3 py-2',
        out ? 'rounded-br-sm bg-primary text-primary-foreground' : 'rounded-bl-sm bg-muted text-foreground',
        className,
      )}
      {...props}
    >
      {src ? (
        <audio
          ref={audio}
          src={src}
          preload="metadata"
          onLoadedMetadata={e => Number.isFinite(e.currentTarget.duration) && setDuration(e.currentTarget.duration)}
          onTimeUpdate={e => setTime(e.currentTarget.currentTime)}
          onEnded={() => { setPlaying(false); setTime(0); }}
        />
      ) : null}
      <Button
        type="button"
        variant={out ? 'secondary' : 'default'}
        size="icon-sm"
        className="rounded-full"
        aria-label={playing ? 'Pause voice message' : 'Play voice message'}
        onClick={toggle}
      >
        {playing ? <Pause /> : <Play />}
      </Button>
      <div className="relative flex h-8 min-w-0 flex-1 items-center rounded-md has-[:focus-visible]:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]">
        <div aria-hidden="true" className="flex h-full w-full items-center gap-px">
          {levels.map((level, i) => (
            <span
              key={i}
              data-played={(i + 0.5) / levels.length <= progress ? 'true' : 'false'}
              style={{ height: `${Math.round(15 + level * 85)}%` }}
              className={cn(
                'min-w-px flex-1 rounded-full transition-colors duration-[var(--duration-fast)]',
                (i + 0.5) / levels.length <= progress ? (out ? 'bg-primary-foreground' : 'bg-primary') : out ? 'bg-primary-foreground/40' : 'bg-muted-foreground/40',
              )}
            />
          ))}
        </div>
        <input
          type="range"
          aria-label={`Seek ${label}`}
          min={0}
          max={duration}
          step={1}
          value={Math.round(time)}
          aria-valuetext={`${formatTime(time)} of ${formatTime(duration)}`}
          onChange={e => seek(Number(e.target.value))}
          onKeyDown={e => {
            if (e.key === 'PageUp') { e.preventDefault(); seek(time + 5); }
            if (e.key === 'PageDown') { e.preventDefault(); seek(time - 5); }
          }}
          className="absolute inset-0 size-full cursor-pointer opacity-0"
        />
      </div>
      <span className="shrink-0 text-xs leading-4 tabular-nums">{formatTime(shown)}</span>
      {showSpeed ? (
        <button
          type="button"
          aria-label={`Playback speed ${speed}x, change`}
          onClick={() => setSpeed(s => SPEEDS[(SPEEDS.indexOf(s) + 1) % SPEEDS.length]!)}
          className="inline-flex h-6 min-w-9 shrink-0 items-center justify-center rounded-full border border-current px-1.5 text-xs leading-4 font-medium outline-none focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]"
        >
          {speed}x
        </button>
      ) : null}
    </div>
  );
}

export { VoiceMessageBubble };
