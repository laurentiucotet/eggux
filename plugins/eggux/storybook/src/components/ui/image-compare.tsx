// EGG UI Image Compare. Code only (no Figma component yet). Before and after in one frame with a
// divider: the "after" layer fills the frame, the "before" layer is clipped to the left of the
// divider. Dragging anywhere on the frame moves the divider, and the keyboard path is a native
// range input (0 to 100, an invisible layer over the frame): Left and Right arrows move 1 %,
// Page Up and Down 10 %, Home and End go to the ends. Its value text says how much of each side
// shows ("40 % before, 60 % after"). The divider handle shows the focus ring when the input has
// focus. Both sides are slots (any node: images, a tinted block); without them the sides are
// tinted blocks. Corner badges name the sides. Not for a slideshow (use Image Gallery).
import * as React from 'react';
import { GripVertical } from '@/components/icons';
import { cn } from '@/lib/utils';
import { type ImageRatio } from './image-placeholder';

const ratios: Record<ImageRatio, string> = {
  '16:9': 'aspect-[16/9]',
  '4:3': 'aspect-[4/3]',
  '1:1': 'aspect-square',
  '3:4': 'aspect-[3/4]',
  '21:9': 'aspect-[21/9]',
  '3:2': 'aspect-[3/2]',
  '2:3': 'aspect-[2/3]',
  '9:16': 'aspect-[9/16]',
};

export interface ImageCompareProps extends Omit<React.ComponentProps<'div'>, 'children' | 'defaultValue' | 'onChange'> {
  /** What the pair shows; the name of the slider ("Kitchen before and after"). */
  label: string;
  /** The "before" side, fills the frame. A node (usually an image with object-cover). */
  before?: React.ReactNode;
  /** The "after" side, fills the frame. */
  after?: React.ReactNode;
  /** Names of the sides (corner badges and the value text). */
  beforeLabel?: string;
  afterLabel?: string;
  /** Divider position, 0 to 100, when uncontrolled. */
  defaultPosition?: number;
  /** Divider position when controlled. */
  position?: number;
  onPositionChange?: (position: number) => void;
  /** Shape of the frame. */
  ratio?: ImageRatio;
  /** Show the corner badges. */
  showLabels?: boolean;
}

function ImageCompare({
  label,
  before,
  after,
  beforeLabel = 'Before',
  afterLabel = 'After',
  defaultPosition = 50,
  position,
  onPositionChange,
  ratio = '16:9',
  showLabels = true,
  className,
  ...props
}: ImageCompareProps) {
  const [inner, setInner] = React.useState(defaultPosition);
  const value = Math.min(100, Math.max(0, position ?? inner));

  const set = (next: number) => {
    setInner(next);
    onPositionChange?.(next);
  };

  return (
    <div
      data-slot="image-compare"
      data-position={value}
      className={cn('relative w-full min-w-0 touch-pan-y overflow-hidden rounded-lg border border-border select-none', ratios[ratio], className)}
      {...props}
    >
      <div data-slot="image-compare-after" className="absolute inset-0 bg-[color-mix(in_srgb,var(--chart-3)_28%,var(--background))] [&>img]:size-full [&>img]:object-cover">
        {after}
      </div>
      <div
        data-slot="image-compare-before"
        className="absolute inset-0 bg-[color-mix(in_srgb,var(--chart-2)_28%,var(--background))] [&>img]:size-full [&>img]:object-cover"
        style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}
      >
        {before}
      </div>

      {showLabels ? (
        <>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-2 left-2 max-w-[40%] truncate rounded-md bg-foreground/80 px-2 py-0.5 text-xs leading-4 font-medium text-background"
          >
            {beforeLabel}
          </span>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-2 right-2 max-w-[40%] truncate rounded-md bg-foreground/80 px-2 py-0.5 text-xs leading-4 font-medium text-background"
          >
            {afterLabel}
          </span>
        </>
      ) : null}

      {/* The keyboard and pointer path: a native range input over the whole frame. */}
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        aria-label={label}
        aria-valuetext={`${Math.round(value)}% ${beforeLabel}, ${Math.round(100 - value)}% ${afterLabel}`}
        onChange={e => set(Number(e.target.value))}
        onKeyDown={e => {
          // Same steps as the browser's own range input, written out so they work everywhere.
          const steps: Record<string, number> = { ArrowLeft: value - 1, ArrowDown: value - 1, ArrowRight: value + 1, ArrowUp: value + 1, PageDown: value - 10, PageUp: value + 10, Home: 0, End: 100 };
          if (!(e.key in steps)) return;
          e.preventDefault();
          set(Math.min(100, Math.max(0, steps[e.key])));
        }}
        className="peer absolute inset-0 z-10 m-0 size-full cursor-ew-resize appearance-none bg-transparent opacity-0 outline-none [&::-moz-range-thumb]:w-px [&::-webkit-slider-thumb]:w-px [&::-webkit-slider-thumb]:appearance-none"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 z-[5] w-0.5 -translate-x-1/2 bg-background shadow-sm" style={{ left: `${value}%` }}>
        <span
          className={cn(
            'absolute top-1/2 left-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-md',
            '[&_svg]:size-4',
          )}
        >
          <GripVertical />
        </span>
      </div>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[6] hidden rounded-lg peer-focus-visible:block peer-focus-visible:ring-[3px] peer-focus-visible:ring-inset peer-focus-visible:ring-ring"
      />
    </div>
  );
}

export { ImageCompare };
