// EGG UI Call Banner. Code only (no Figma component yet). The strip at the top of a chat while you
// are on a call: a phone glyph with a soft pulse, "Acme Design sync" over "On a call · 12:34", a
// Mute toggle (aria-pressed) and a Leave button. The text part is a button that takes you back to
// the call (`onReturn`). The timer is a <time> that counts up (pass `elapsed` to control it, or
// `defaultElapsed` for a start); it is not a live region, so nothing talks every second. Muting
// and unmuting is announced once, politely ("Microphone muted"). The pulse stops under reduced
// motion. Success surface: the call is healthy. Not for an incoming call (that is a dialog).
import * as React from 'react';
import { Mic, Phone, VolumeX } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';

function formatClock(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, '0');
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`;
}

export interface CallBannerProps extends Omit<React.ComponentProps<'section'>, 'children'> {
  /** The call: a person or a room ("Acme Design sync"). */
  title: string;
  /** Controlled elapsed seconds; the timer then does not tick by itself. */
  elapsed?: number;
  /** Start of the timer when uncontrolled. */
  defaultElapsed?: number;
  /** Let the uncontrolled timer tick. Off for stories that need a still frame. */
  running?: boolean;
  muted?: boolean;
  defaultMuted?: boolean;
  onMutedChange?: (muted: boolean) => void;
  /** The text part was activated: go back to the call screen. */
  onReturn?: () => void;
  /** Leave was pressed. Without it no Leave button is shown. */
  onLeave?: () => void;
}

function CallBanner({
  title,
  elapsed,
  defaultElapsed = 0,
  running = true,
  muted,
  defaultMuted = false,
  onMutedChange,
  onReturn,
  onLeave,
  className,
  ...props
}: CallBannerProps) {
  const [tick, setTick] = React.useState(defaultElapsed);
  const [mutedInner, setMutedInner] = React.useState(defaultMuted);
  const [announcement, setAnnouncement] = React.useState('');
  const seconds = elapsed ?? tick;
  const isMuted = muted ?? mutedInner;

  React.useEffect(() => {
    if (elapsed !== undefined || !running) return;
    const id = window.setInterval(() => setTick(t => t + 1), 1000);
    return () => window.clearInterval(id);
  }, [elapsed, running]);

  const toggleMute = () => {
    const next = !isMuted;
    setMutedInner(next);
    onMutedChange?.(next);
    setAnnouncement(next ? 'Microphone muted' : 'Microphone on');
  };

  const text = (
    <>
      {onReturn ? <span className="sr-only">Return to call: </span> : null}
      <span className="block truncate text-sm leading-5 font-medium">{title}</span>
      <span className="block truncate text-xs leading-4">
        On a call · <time dateTime={`PT${Math.floor(seconds)}S`} className="tabular-nums">{formatClock(seconds)}</time>
      </span>
    </>
  );
  const part = 'flex min-w-0 flex-1 flex-col rounded-md text-left outline-none focus-visible:shadow-[0_0_0_2px_var(--success),0_0_0_4px_var(--success-foreground)]';

  return (
    <section
      data-slot="call-banner"
      aria-label={`Call in progress: ${title}`}
      className={cn('flex w-full min-w-0 items-center gap-3 rounded-lg bg-success px-3 py-2 text-success-foreground', className)}
      {...props}
    >
      <span aria-hidden="true" className="relative flex size-8 shrink-0 items-center justify-center rounded-full bg-success-foreground text-success">
        <span className="absolute inset-0 rounded-full bg-success-foreground/40 motion-safe:animate-ping" />
        <Phone className="relative size-4" />
      </span>
      {onReturn ? (
        <button type="button" onClick={onReturn} className={part}>{text}</button>
      ) : (
        <div className={part}>{text}</div>
      )}
      <Button
        type="button"
        variant="secondary"
        size="icon-sm"
        aria-pressed={isMuted}
        aria-label="Mute microphone"
        onClick={toggleMute}
      >
        {isMuted ? <VolumeX /> : <Mic />}
      </Button>
      {onLeave ? (
        <Button type="button" variant="destructive" size="sm" onClick={onLeave}>
          Leave
        </Button>
      ) : null}
      <span role="status" className="sr-only">{announcement}</span>
    </section>
  );
}

export { CallBanner };
