// EGG UI Story Viewer. Code only (no Figma component yet). Mobile page. A full-screen story: a row
// of progress bars on top (done, current, next), the author and a Pause and a Close button, the
// story content, and visible Previous and Next buttons at the bottom. Tapping the left third goes
// back, the rest goes forward, and holding a finger on the story pauses it; none of that is the
// only way: Previous, Next, Pause and Close are 44 x 44 buttons, ArrowLeft, ArrowRight and Escape
// work on the viewer, and the progress is announced ("Story 2 of 5"). The timer advances each story
// after its duration, `defaultPaused` starts it paused (tests and docs), and a paused viewer shows
// a Play button. The viewer fills its container: put it in a fixed full-screen layer on the phone.
// Not for videos with their own controls (use a media player).
import * as React from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, X } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Avatar } from './avatar';
import { Button } from './button';

export interface StoryItem {
  id: string;
  /** What the story shows. Fill the area; text sits on the dark background. */
  content: React.ReactNode;
  /** Milliseconds this story stays. Default: the viewer's duration. */
  duration?: number;
  /** Accessible name of the story ("Spring sale"). */
  title?: string;
}

export interface StoryViewerProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  stories: StoryItem[];
  /** Who posted: name, two letters and a line such as "2 h ago". */
  author?: { name: string; initials?: string; meta?: string };
  /** Start on this story (0 based). */
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  /** Called after the last story ends or Next is pressed on it. */
  onComplete?: () => void;
  onClose?: () => void;
  /** Milliseconds per story when a story gives none. Default 5000. */
  duration?: number;
  /** Start paused: the timer waits for Play. */
  defaultPaused?: boolean;
  /** Accessible name of the viewer. */
  label?: string;
}

const TICK = 50;
const TAP_MAX = 250;

function StoryViewer({
  stories,
  author,
  defaultIndex = 0,
  onIndexChange,
  onComplete,
  onClose,
  duration = 5000,
  defaultPaused = false,
  label = 'Stories',
  className,
  onKeyDown,
  ...props
}: StoryViewerProps) {
  const [index, setIndex] = React.useState(Math.min(defaultIndex, stories.length - 1));
  const [elapsed, setElapsed] = React.useState(0);
  const [paused, setPaused] = React.useState(defaultPaused);
  const [holding, setHolding] = React.useState(false);
  const press = React.useRef<{ at: number; dir: 'prev' | 'next' } | null>(null);
  const story = stories[index];
  const total = story?.duration ?? duration;
  const running = !paused && !holding;

  const goTo = React.useCallback(
    (next: number) => {
      setElapsed(0);
      if (next < 0) return;
      if (next >= stories.length) {
        onComplete?.();
        return;
      }
      setIndex(next);
      onIndexChange?.(next);
    },
    [stories.length, onComplete, onIndexChange],
  );

  React.useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsed(e => e + TICK), TICK);
    return () => clearInterval(id);
  }, [running, index]);

  React.useEffect(() => {
    if (elapsed >= total) goTo(index + 1);
  }, [elapsed, total, index, goTo]);

  if (!story) return null;

  const prev = () => goTo(index - 1);
  const next = () => goTo(index + 1);

  const down = (dir: 'prev' | 'next') => () => {
    press.current = { at: Date.now(), dir };
    setHolding(true);
  };
  const up = (e: React.PointerEvent) => {
    const p = press.current;
    press.current = null;
    setHolding(false);
    // A short press is a tap; a long press was only a pause.
    if (p && e.type === 'pointerup' && Date.now() - p.at < TAP_MAX) (p.dir === 'prev' ? prev : next)();
  };
  const cancel = () => {
    press.current = null;
    setHolding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    else if (e.key === 'Escape' && onClose) { e.preventDefault(); onClose(); }
  };

  const overlay = 'text-background hover:bg-background/20 hover:text-background px-0';

  return (
    <div
      role="group"
      aria-roledescription="story viewer"
      aria-label={label}
      data-slot="story-viewer"
      data-state={running ? 'playing' : 'paused'}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={cn('relative flex h-full min-h-[320px] w-full min-w-0 flex-col overflow-hidden bg-foreground text-background outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-ring', className)}
      {...props}
    >
      {/* The story. */}
      <div className="absolute inset-0 min-w-0">
        <div role="group" aria-label={story.title ?? `Story ${index + 1}`} className="size-full min-w-0 overflow-hidden">
          {story.content}
        </div>
      </div>

      {/* Tap areas: left third back, the rest forward. A hold pauses. Buttons below do the same. */}
      <div aria-hidden="true" data-slot="story-tap-prev" onPointerDown={down('prev')} onPointerUp={up} onPointerCancel={cancel} onPointerLeave={cancel} className="absolute inset-y-0 left-0 w-1/3 touch-manipulation" />
      <div aria-hidden="true" data-slot="story-tap-next" onPointerDown={down('next')} onPointerUp={up} onPointerCancel={cancel} onPointerLeave={cancel} className="absolute inset-y-0 right-0 w-2/3 touch-manipulation" />

      {/* Top: progress and header. */}
      <div className="pointer-events-none relative z-10 flex min-w-0 flex-col gap-2 bg-gradient-to-b from-foreground/70 to-transparent px-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3">
        <div
          role="progressbar"
          aria-label="Story progress"
          aria-valuemin={1}
          aria-valuemax={stories.length}
          aria-valuenow={index + 1}
          aria-valuetext={`Story ${index + 1} of ${stories.length}`}
          className="flex gap-1"
        >
          {stories.map((s, i) => (
            <span key={s.id} aria-hidden="true" data-slot="story-progress" data-state={i < index ? 'done' : i === index ? 'current' : 'next'} className="h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-background/30">
              <span className="block h-full bg-background" style={{ width: `${i < index ? 100 : i === index ? Math.min(100, (elapsed / total) * 100) : 0}%` }} />
            </span>
          ))}
        </div>
        <div className="pointer-events-auto flex min-w-0 items-center gap-2">
          {author ? (
            <>
              <Avatar size="lg" initials={author.initials ?? author.name.slice(0, 2).toUpperCase()} aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm leading-5 font-semibold">{author.name}</span>
                {author.meta ? <span className="block truncate text-xs leading-4">{author.meta}</span> : null}
              </span>
            </>
          ) : (
            <span className="flex-1" />
          )}
          <Button type="button" variant="ghost" size="touch" aria-label={paused ? 'Play story' : 'Pause story'} className={cn(overlay, 'shrink-0')} onClick={() => setPaused(p => !p)}>
            {paused ? <Play /> : <Pause />}
          </Button>
          {onClose ? (
            <Button type="button" variant="ghost" size="touch" aria-label="Close stories" className={cn(overlay, 'shrink-0')} onClick={onClose}>
              <X />
            </Button>
          ) : null}
        </div>
      </div>

      <div className="flex-1" />

      {/* Bottom: visible previous and next. */}
      <div className="pointer-events-none relative z-10 flex min-w-0 items-center justify-between gap-2 bg-gradient-to-t from-foreground/70 to-transparent px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <Button type="button" variant="ghost" size="touch" aria-label="Previous story" className={cn(overlay, 'pointer-events-auto')} onClick={prev}>
          <ChevronLeft />
        </Button>
        <span className="min-w-0 truncate text-xs leading-4 font-medium" aria-hidden="true">{index + 1} / {stories.length}</span>
        <Button type="button" variant="ghost" size="touch" aria-label="Next story" className={cn(overlay, 'pointer-events-auto')} onClick={next}>
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}

export { StoryViewer };
