// EGG UI Audio Player. Code only (no Figma component yet). A compact player: title and artist, a
// Play / Pause button, back 10 s and forward 10 s, a seek slider (Slider; arrows 1 s, Page Up and
// Down 10 s, Home and End to the ends; its value text is "1:05 of 3:20"), the elapsed and total
// time, and a speed button that cycles 0.75x, 1x, 1.25x, 1.5x, 2x. With `src` it drives a real
// audio element; without it (stories, mockups) it simulates the time, so no sound file is needed.
// The play button name says what a press does ("Play", "Pause"). Everything is a native button;
// the layout wraps and truncates down to 276 px. Not for a voice recorder or a playlist.
import * as React from 'react';
import { Pause, Play } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { ButtonIcon } from './button-icon';
import { Slider } from './slider';

const SPEEDS = [0.75, 1, 1.25, 1.5, 2];

function formatTime(seconds: number) {
  const total = Math.max(0, Math.floor(seconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = String(total % 60).padStart(2, '0');
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`;
}

function speedLabel(speed: number) {
  return `${speed}x`;
}

export interface AudioPlayerProps extends Omit<React.ComponentProps<'div'>, 'children' | 'title'> {
  /** Title of the recording; also the accessible name of the player. */
  title: string;
  /** Who made it, under the title. */
  artist?: string;
  /** Audio file URL. Without it the player simulates the time. */
  src?: string;
  /** Length in seconds (used when there is no src, and until the file reports its own). */
  duration?: number;
  /** Start at this second. */
  defaultTime?: number;
  /** Show the speed button. */
  showSpeed?: boolean;
  /** Show the back and forward 10 s buttons. */
  showSkip?: boolean;
  onPlayingChange?: (playing: boolean) => void;
}

function AudioPlayer({
  title,
  artist,
  src,
  duration: durationProp = 200,
  defaultTime = 0,
  showSpeed = true,
  showSkip = true,
  onPlayingChange,
  className,
  ...props
}: AudioPlayerProps) {
  const audio = React.useRef<HTMLAudioElement>(null);
  const [playing, setPlayingState] = React.useState(false);
  const [time, setTime] = React.useState(defaultTime);
  const [duration, setDuration] = React.useState(durationProp);
  const [speed, setSpeed] = React.useState(1);

  React.useEffect(() => {
    if (!src) setDuration(durationProp);
  }, [durationProp, src]);

  const setPlaying = (value: boolean) => {
    setPlayingState(value);
    onPlayingChange?.(value);
  };

  // Simulated clock when there is no file.
  React.useEffect(() => {
    if (src || !playing) return;
    const id = window.setInterval(() => {
      setTime(t => Math.min(duration, t + 0.1 * speed));
    }, 100);
    return () => window.clearInterval(id);
  }, [src, playing, speed, duration]);

  // The simulated clock stops at the end.
  React.useEffect(() => {
    if (!src && playing && time >= duration) setPlaying(false);
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
    if (!playing && time >= duration) seek(0);
    if (audio.current) {
      if (playing) audio.current.pause();
      else void audio.current.play().catch(() => setPlaying(false));
    }
    setPlaying(!playing);
  };

  const spoken = (t: number) => `${formatTime(t)} of ${formatTime(duration)}`;

  return (
    <div
      data-slot="audio-player"
      data-state={playing ? 'playing' : 'paused'}
      role="group"
      aria-label={title}
      className={cn('flex w-full min-w-0 flex-col gap-3 rounded-lg border border-border bg-card p-4 text-card-foreground', className)}
      {...props}
    >
      {src ? (
        <audio
          ref={audio}
          src={src}
          preload="metadata"
          onLoadedMetadata={e => Number.isFinite(e.currentTarget.duration) && setDuration(e.currentTarget.duration)}
          onTimeUpdate={e => setTime(e.currentTarget.currentTime)}
          onEnded={() => setPlaying(false)}
        />
      ) : null}

      <div className="min-w-0">
        <p className="truncate text-sm leading-5 font-medium">{title}</p>
        {artist ? <p className="truncate text-xs leading-4 text-muted-foreground">{artist}</p> : null}
      </div>

      <div className="flex min-w-0 flex-wrap items-center gap-2">
        {showSkip ? (
          <Button variant="ghost" size="xs" aria-label="Back 10 s" onClick={() => seek(time - 10)}>
            Back 10 s
          </Button>
        ) : null}
        <ButtonIcon
          size="lg"
          label={playing ? 'Pause' : 'Play'}
          icon={playing ? <Pause /> : <Play />}
          showTooltip={false}
          onClick={toggle}
          className="rounded-full"
        />
        {showSkip ? (
          <Button variant="ghost" size="xs" aria-label="Forward 10 s" onClick={() => seek(time + 10)}>
            Forward 10 s
          </Button>
        ) : null}
        {showSpeed ? (
          <Button
            variant="outline"
            size="xs"
            aria-label={`Playback speed ${speedLabel(speed)}, change`}
            onClick={() => setSpeed(SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length])}
            className="ml-auto tabular-nums"
          >
            {speedLabel(speed)}
          </Button>
        ) : null}
      </div>

      <div className="min-w-0">
        <Slider
          value={[Math.floor(time)]}
          min={0}
          max={Math.max(1, Math.floor(duration))}
          step={1}
          thumbLabels={['Seek']}
          formatValue={spoken}
          onValueChange={([v]) => seek(v)}
        />
        <div className="mt-2 flex items-center justify-between gap-2 text-xs leading-4 text-muted-foreground tabular-nums">
          <span data-slot="audio-player-elapsed" aria-hidden="true">{formatTime(time)}</span>
          <span data-slot="audio-player-duration" aria-hidden="true">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}

export { AudioPlayer };
