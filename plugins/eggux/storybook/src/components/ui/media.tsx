// EGG UI Video page: Video Player (165:68: poster / playing / buffering, default / lg), Video
// Thumbnail (446:2656), Audio Player (1099:960: default / compact, paused / playing).
// Video Player: 16:9, radius xl, video/* tokens (dark in every mode). Poster: a centered play button
// (64, lg 96) on video/scrim named "Play: <title>, <duration in words>", and the duration chip.
// Playing: a bottom bar on a gradient: the seek slider (4 high track, played part, 12 px thumb),
// then play / pause, mute, time "1:24 / 4:05", captions (pressed state), settings, fullscreen.
// Subtitles on video/scrim above the bar. Buffering: a spinner in the middle. Keyboard on the
// player: Space or K play / pause, Left / Right seek 5 s, M mute, F fullscreen, C captions.
// With `src` it drives a native <video>; without it, the controls work on their own (previews).
// Video Thumbnail: a button "Play: <title>, 12:40" with the poster, a 52 px play disc (shadow md)
// and the duration badge.
// Audio Player: default 480 card (play 36 primary, title, time, seek bar, length, mute) or compact
// 280 pill (play 32, 28-bar waveform as the seek slider, length). Space toggles, arrows seek 5 s.
import * as React from 'react';
import { Captions, Maximize, Pause, Play, Settings, Volume2, VolumeX } from '@/components/icons';
import { cn } from '@/lib/utils';
import { ImagePlaceholder } from './image-placeholder';
import { Spinner } from './spinner';

/** 84 → "1:24"; 3725 → "1:02:05". */
function formatTime(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}` : `${m}:${String(r).padStart(2, '0')}`;
}
/** 252 → "4 minutes 12 seconds". */
function timeInWords(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
  const part = (v: number, u: string) => (v ? `${v} ${u}${v === 1 ? '' : 's'}` : '');
  return [part(h, 'hour'), part(m, 'minute'), part(r, 'second')].filter(Boolean).join(' ') || '0 seconds';
}

interface SeekProps { label: string; current: number; duration: number; onSeek: (t: number) => void; className?: string; children?: React.ReactNode }

/** Seek slider: role slider, Left / Right 5 s, Home / End, pointer. */
function Seek({ label, current, duration, onSeek, className, children }: SeekProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const at = (x: number) => {
    const r = ref.current!.getBoundingClientRect();
    onSeek(Math.max(0, Math.min(duration, ((x - r.left) / r.width) * duration)));
  };
  return (
    <div
      ref={ref}
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={Math.round(duration)}
      aria-valuenow={Math.round(current)}
      aria-valuetext={`${timeInWords(current)} of ${timeInWords(duration)}`}
      onPointerDown={e => {
        at(e.clientX);
        const move = (ev: PointerEvent) => at(ev.clientX);
        const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
      }}
      onKeyDown={e => {
        const k: Record<string, number> = { ArrowRight: current + 5, ArrowUp: current + 5, ArrowLeft: current - 5, ArrowDown: current - 5, Home: 0, End: duration };
        if (k[e.key] !== undefined) { e.preventDefault(); e.stopPropagation(); onSeek(Math.max(0, Math.min(duration, k[e.key]!))); }
      }}
      className={cn('relative cursor-pointer touch-none outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50', className)}
    >
      {children}
    </div>
  );
}

/* Video Player */

export interface VideoPlayerProps extends Omit<React.ComponentProps<'div'>, 'children' | 'title'> {
  /** What the video is: names the player and the play button. */
  title: string;
  /** Length in seconds. */
  duration: number;
  src?: string;
  poster?: string;
  /** Caption track URL (WebVTT). */
  captionsSrc?: string;
  size?: 'default' | 'lg';
  /** Start state for previews: playing shows the controls. */
  defaultState?: 'poster' | 'playing';
  defaultTime?: number;
  /** Network wait: spinner over the frame. */
  buffering?: boolean;
  /** Preview line for Show subtitles (with a captions track it comes from the track). */
  subtitle?: string;
}

const ctrl = 'flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-[var(--video-foreground)] outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[var(--video-foreground)] [&_svg]:size-5';

function VideoPlayer({ title, duration, src, poster, captionsSrc, size = 'default', defaultState = 'poster', defaultTime = 0, buffering = false, subtitle, className, ...props }: VideoPlayerProps) {
  const root = React.useRef<HTMLDivElement>(null);
  const video = React.useRef<HTMLVideoElement>(null);
  const [started, setStarted] = React.useState(defaultState === 'playing');
  const [playing, setPlaying] = React.useState(defaultState === 'playing');
  const [time, setTime] = React.useState(defaultTime);
  const [muted, setMuted] = React.useState(false);
  const [captions, setCaptions] = React.useState(Boolean(subtitle));
  const [len, setLen] = React.useState(duration);
  const lg = size === 'lg';

  const toggle = () => {
    setStarted(true);
    const v = video.current;
    if (v) { if (v.paused) void v.play().catch(() => {}); else v.pause(); }
    setPlaying(p => !p);
  };
  const seek = (t: number) => { setTime(t); if (video.current) video.current.currentTime = t; };
  const mute = () => { setMuted(m => { if (video.current) video.current.muted = !m; return !m; }); };
  const fullscreen = () => { const el = root.current; if (!el) return; if (document.fullscreenElement) void document.exitFullscreen(); else void el.requestFullscreen?.().catch(() => {}); };

  return (
    <div
      ref={root}
      data-slot="video-player"
      data-state={!started ? 'poster' : buffering ? 'buffering' : playing ? 'playing' : 'paused'}
      data-size={size}
      role="region"
      aria-label={`Video: ${title}`}
      tabIndex={-1}
      onKeyDown={e => {
        if ((e.target as HTMLElement).getAttribute('role') === 'slider' && e.key.startsWith('Arrow')) return;
        const key = e.key.toLowerCase();
        if ((key === ' ' && (e.target as HTMLElement).tagName !== 'BUTTON') || key === 'k') { e.preventDefault(); toggle(); }
        else if (key === 'arrowright' && started) { e.preventDefault(); seek(Math.min(len, time + 5)); }
        else if (key === 'arrowleft' && started) { e.preventDefault(); seek(Math.max(0, time - 5)); }
        else if (key === 'm') mute();
        else if (key === 'f') fullscreen();
        else if (key === 'c') setCaptions(c => !c);
      }}
      className={cn('group/video relative aspect-video w-full overflow-hidden rounded-xl bg-[var(--video-background)] outline-none', lg ? 'max-w-[1152px]' : 'max-w-[800px]', className)}
      {...props}
    >
      {src ? (
        <video
          ref={video}
          src={src}
          poster={poster}
          muted={muted}
          playsInline
          className="absolute inset-0 size-full object-cover"
          onTimeUpdate={e => setTime(e.currentTarget.currentTime)}
          onLoadedMetadata={e => { if (Number.isFinite(e.currentTarget.duration)) setLen(e.currentTarget.duration); }}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          {captionsSrc ? <track kind="captions" src={captionsSrc} default={captions} /> : null}
        </video>
      ) : (
        <ImagePlaceholder ratio="16:9" src={poster} alt="" showCaption={false} className="absolute inset-0 size-full rounded-none" />
      )}

      {!started ? (
        <>
          <button
            type="button"
            aria-label={`Play: ${title}, ${timeInWords(len)}`}
            onClick={toggle}
            className={cn('absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[var(--video-scrim)] text-[var(--video-foreground)] outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--video-foreground)]', lg ? 'size-24 [&_svg]:size-10' : 'size-16 [&_svg]:size-7')}
          >
            <Play aria-hidden="true" />
          </button>
          <span aria-hidden="true" className="absolute right-3 bottom-3 rounded-sm bg-[var(--video-scrim)] px-1.5 py-0.5 text-xs leading-4 text-[var(--video-foreground)]">{formatTime(len)}</span>
        </>
      ) : (
        <>
          {buffering ? <Spinner label="Loading video" size="lg" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[var(--video-foreground)] [&_svg]:size-16" /> : null}
          {captions && subtitle ? (
            <p data-slot="video-subtitles" className="absolute bottom-[104px] left-1/2 m-0 max-w-[90%] -translate-x-1/2 rounded-sm bg-[var(--video-scrim)] px-2 py-1 text-center text-base leading-7 text-[var(--video-foreground)]">{subtitle}</p>
          ) : null}
          <div data-slot="video-controls" className="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-linear-to-b from-transparent to-black/70 p-3">
            <Seek label="Seek" current={time} duration={len} onSeek={seek} className="flex h-3 items-center">
              <span className="relative block h-1 w-full rounded-full bg-[var(--video-track)]">
                <span className="absolute inset-y-0 left-0 rounded-full bg-[var(--video-foreground)]" style={{ width: `${(time / len) * 100}%` }} />
                <span className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--video-foreground)]" style={{ left: `${(time / len) * 100}%` }} />
              </span>
            </Seek>
            <div className="flex items-center gap-1">
              <button type="button" aria-label={playing ? 'Pause' : 'Play'} onClick={toggle} className={ctrl}>{playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}</button>
              <button type="button" aria-label={muted ? 'Unmute' : 'Mute'} onClick={mute} className={ctrl}>{muted ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}</button>
              <span className="px-1 text-xs leading-4 whitespace-nowrap text-[var(--video-foreground)]">
                <span aria-hidden="true">{formatTime(time)} / {formatTime(len)}</span>
              </span>
              <span className="flex-1" />
              <button type="button" aria-label="Captions" aria-pressed={captions} onClick={() => setCaptions(c => !c)} className={cn(ctrl, captions && 'bg-white/15')}><Captions aria-hidden="true" /></button>
              <button type="button" aria-label="Settings" className={ctrl}><Settings aria-hidden="true" /></button>
              <button type="button" aria-label="Full screen" onClick={fullscreen} className={ctrl}><Maximize aria-hidden="true" /></button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* Video Thumbnail */

export interface VideoThumbnailProps extends Omit<React.ComponentProps<'button'>, 'children' | 'title'> {
  title: string;
  /** Length in seconds. */
  duration: number;
  poster?: string;
  showDuration?: boolean;
}

function VideoThumbnail({ title, duration, poster, showDuration = true, className, ...props }: VideoThumbnailProps) {
  return (
    <button
      type="button"
      data-slot="video-thumbnail"
      // The visible length is part of the name (axe label-content-name-mismatch).
      aria-label={showDuration ? `Play: ${title}, ${formatTime(duration)}` : `Play: ${title}, ${timeInWords(duration)}`}
      className={cn('group/thumb relative block aspect-video w-[360px] max-w-full cursor-pointer overflow-hidden rounded-xl bg-muted p-0 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50', className)}
      {...props}
    >
      <ImagePlaceholder ratio="16:9" src={poster} alt="" showCaption={false} className="absolute inset-0 size-full rounded-none" />
      <span aria-hidden="true" className="absolute top-1/2 left-1/2 flex size-[52px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-background text-foreground shadow-md transition-transform duration-[var(--duration-fast)] group-hover/thumb:scale-105 [&_svg]:size-5">
        <Play />
      </span>
      {showDuration ? <span aria-hidden="true" className="absolute right-3 bottom-3 rounded-md bg-secondary px-2 py-0.5 text-xs leading-4 font-medium text-secondary-foreground">{formatTime(duration)}</span> : null}
    </button>
  );
}

/* Audio Player */

export interface AudioPlayerProps extends Omit<React.ComponentProps<'div'>, 'children' | 'title'> {
  title: string;
  /** Length in seconds. */
  duration: number;
  src?: string;
  variant?: 'default' | 'compact';
  defaultPlaying?: boolean;
  defaultTime?: number;
  /** compact: 28 bar heights (4-28); a stable sample by default. */
  waveform?: number[];
}

const sampleWave = [8, 14, 20, 12, 24, 16, 10, 22, 28, 18, 12, 20, 26, 14, 8, 16, 24, 20, 12, 18, 10, 22, 16, 12, 8, 14, 10, 6];

function AudioPlayer({ title, duration, src, variant = 'default', defaultPlaying = false, defaultTime = 0, waveform = sampleWave, className, ...props }: AudioPlayerProps) {
  const audio = React.useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = React.useState(defaultPlaying);
  const [time, setTime] = React.useState(defaultTime);
  const [muted, setMuted] = React.useState(false);
  const [len, setLen] = React.useState(duration);
  const compact = variant === 'compact';
  const toggle = () => {
    const a = audio.current;
    if (a) { if (a.paused) void a.play().catch(() => {}); else a.pause(); }
    setPlaying(p => !p);
  };
  const seek = (t: number) => { setTime(t); if (audio.current) audio.current.currentTime = t; };
  const played = len ? time / len : 0;
  const playBtn = (
    <button
      type="button"
      aria-label={playing ? `Pause ${title}` : `Play ${title}`}
      onClick={toggle}
      className={cn('flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xs outline-none hover:bg-primary/90 focus-visible:ring-[3px] focus-visible:ring-ring/50 [&_svg]:size-4', compact ? 'size-8' : 'size-9')}
    >
      {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
    </button>
  );
  return (
    <div
      data-slot="audio-player"
      data-variant={variant}
      data-state={playing ? 'playing' : 'paused'}
      role="group"
      aria-label={`Audio: ${title}`}
      onKeyDown={e => {
        if (e.key === ' ' && (e.target as HTMLElement).getAttribute('role') === 'slider') { e.preventDefault(); toggle(); }
      }}
      className={cn(
        'flex items-center gap-3 border border-border bg-card text-card-foreground',
        compact ? 'w-[280px] min-w-[200px] rounded-full py-2 pr-4 pl-2' : 'w-[480px] max-w-full rounded-xl p-3',
        className,
      )}
      {...props}
    >
      {src ? (
        <audio
          ref={audio}
          src={src}
          muted={muted}
          onTimeUpdate={e => setTime(e.currentTarget.currentTime)}
          onLoadedMetadata={e => { if (Number.isFinite(e.currentTarget.duration)) setLen(e.currentTarget.duration); }}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
        />
      ) : null}
      {playBtn}
      {compact ? (
        <>
          <Seek label={`Seek ${title}`} current={time} duration={len} onSeek={seek} className="flex h-7 min-w-0 flex-1 items-center justify-between">
            {waveform.slice(0, 28).map((h, i) => (
              <span key={i} aria-hidden="true" data-slot="wave-bar" className={cn('w-0.5 shrink-0 rounded-full', (i + 0.5) / 28 <= played ? 'bg-primary' : 'bg-muted-foreground')} style={{ height: h }} />
            ))}
          </Seek>
          <span className="shrink-0 text-xs leading-4 whitespace-nowrap text-muted-foreground" aria-hidden="true">{formatTime(playing || time > 0 ? len - time : len)}</span>
        </>
      ) : (
        <>
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <p className="m-0 truncate text-sm leading-5 font-medium">{title}</p>
            <div className="flex items-center gap-2 text-xs leading-4 whitespace-nowrap text-muted-foreground">
              <span aria-hidden="true">{formatTime(time)}</span>
              <Seek label={`Seek ${title}`} current={time} duration={len} onSeek={seek} className="flex h-3 min-w-0 flex-1 items-center">
                <span className="relative block h-1 w-full overflow-hidden rounded-full bg-muted">
                  <span className="absolute inset-y-0 left-0 rounded-full bg-primary" style={{ width: `${played * 100}%` }} />
                </span>
              </Seek>
              <span aria-hidden="true">{formatTime(len)}</span>
            </div>
          </div>
          <button type="button" aria-label={muted ? 'Unmute' : 'Mute'} onClick={() => setMuted(m => { if (audio.current) audio.current.muted = !m; return !m; })} className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-foreground outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 [&_svg]:size-4">
            {muted ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
          </button>
        </>
      )}
    </div>
  );
}

export { AudioPlayer, VideoPlayer, VideoThumbnail, formatTime, timeInWords };
