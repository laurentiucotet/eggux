// EGG UI Avatar Cropper. Code only (no Figma component yet). Choose which part of a picture becomes
// the round avatar: a square stage with a circular crop window (the picture outside it is dimmed),
// a Zoom slider (100 to 300 %), and the buttons Reset and Apply. Drag the picture with the
// pointer; the keyboard path is the stage itself (focusable): arrow keys nudge 2 % of the stage,
// Shift + arrow 10 %, + and - zoom. The picture can never leave the crop window, so the avatar is
// always full. Apply calls onApply with { zoom, x, y } (x and y are fractions of the stage width,
// the same numbers a canvas crop needs); Reset goes back to 100 % centered. Without `src` the stage
// shows a tinted block with a dot pattern so movement is visible. Not for free-form crops
// (a rectangle with handles).
import * as React from 'react';
import { User } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Slider } from './slider';

/** The crop window is this fraction of the stage. */
const WINDOW = 0.8;
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

export interface AvatarCrop {
  /** 1 to 3. */
  zoom: number;
  /** Offset of the picture from the center, as a fraction of the stage width. */
  x: number;
  y: number;
}

export interface AvatarCropperProps extends Omit<React.ComponentProps<'div'>, 'children' | 'onChange'> {
  /** Picture URL. Without it the stage is a tinted block with a person icon. */
  src?: string;
  /** What the picture shows (screen readers). */
  alt?: string;
  /** Accessible name of the cropper. */
  label?: string;
  /** Start values. */
  defaultCrop?: Partial<AvatarCrop>;
  onCropChange?: (crop: AvatarCrop) => void;
  onApply?: (crop: AvatarCrop) => void;
  onReset?: () => void;
  /** Text of the buttons. */
  applyLabel?: string;
  resetLabel?: string;
}

const limit = (zoom: number) => zoom / 2 - WINDOW / 2;
const clamp = (v: number, max: number) => Math.min(max, Math.max(-max, v));

function AvatarCropper({
  src,
  alt = '',
  label = 'Crop your avatar',
  defaultCrop,
  onCropChange,
  onApply,
  onReset,
  applyLabel = 'Apply',
  resetLabel = 'Reset',
  className,
  ...props
}: AvatarCropperProps) {
  const [crop, setCropState] = React.useState<AvatarCrop>({
    zoom: defaultCrop?.zoom ?? 1,
    x: defaultCrop?.x ?? 0,
    y: defaultCrop?.y ?? 0,
  });
  const stage = React.useRef<HTMLDivElement>(null);
  const drag = React.useRef<{ px: number; py: number; x: number; y: number } | null>(null);
  const [dragging, setDragging] = React.useState(false);
  const hintId = React.useId();

  const setCrop = (next: AvatarCrop) => {
    const zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, next.zoom));
    const max = limit(zoom);
    const value = { zoom, x: clamp(next.x, max), y: clamp(next.y, max) };
    setCropState(value);
    onCropChange?.(value);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    drag.current = { px: e.clientX, py: e.clientY, x: crop.x, y: crop.y };
    setDragging(true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // A synthetic pointer has nothing to capture; dragging still works while it stays over the stage.
    }
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const start = drag.current;
    const size = stage.current?.getBoundingClientRect().width;
    if (!start || !size) return;
    setCrop({ zoom: crop.zoom, x: start.x + (e.clientX - start.px) / size, y: start.y + (e.clientY - start.py) / size });
  };
  const endDrag = () => {
    drag.current = null;
    setDragging(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const step = e.shiftKey ? 0.1 : 0.02;
    const moves: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (e.key in moves) {
      e.preventDefault();
      // Arrow keys move the picture the way they point.
      setCrop({ zoom: crop.zoom, x: crop.x + moves[e.key][0], y: crop.y + moves[e.key][1] });
    } else if (e.key === '+' || e.key === '=') {
      e.preventDefault();
      setCrop({ ...crop, zoom: crop.zoom + 0.1 });
    } else if (e.key === '-') {
      e.preventDefault();
      setCrop({ ...crop, zoom: crop.zoom - 0.1 });
    }
  };

  const percent = Math.round(crop.zoom * 100);
  return (
    <div data-slot="avatar-cropper" className={cn('flex w-full min-w-0 flex-col gap-4', className)} {...props}>
      <div
        ref={stage}
        data-slot="avatar-cropper-stage"
        data-zoom={crop.zoom.toFixed(2)}
        data-x={crop.x.toFixed(3)}
        data-y={crop.y.toFixed(3)}
        role="group"
        aria-label={label}
        aria-roledescription="image cropper"
        aria-describedby={hintId}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className={cn(
          'relative mx-auto aspect-square w-full max-w-80 touch-none overflow-hidden rounded-lg border border-border bg-muted outline-none select-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
          dragging ? 'cursor-grabbing' : 'cursor-grab',
        )}
      >
        <div
          data-slot="avatar-cropper-picture"
          className="absolute inset-0 bg-[color-mix(in_srgb,var(--chart-1)_28%,var(--background))] origin-center"
          style={{ transform: `translate(${crop.x * 100}%, ${crop.y * 100}%) scale(${crop.zoom})` }}
        >
          {src ? (
            <img src={src} alt={alt} draggable={false} className="size-full object-cover" />
          ) : (
            <>
              <span
                aria-hidden="true"
                className="absolute inset-0 text-foreground/25 [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:16px_16px]"
              />
              <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center text-foreground/50 [&_svg]:size-1/3">
                <User />
              </span>
            </>
          )}
        </div>
        {/* The crop window: a circle whose outside is dimmed. */}
        <span
          aria-hidden="true"
          data-slot="avatar-cropper-window"
          className="pointer-events-none absolute top-1/2 left-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background shadow-[0_0_0_999px_color-mix(in_srgb,var(--foreground)_55%,transparent)]"
          style={{ width: `${WINDOW * 100}%` }}
        />
      </div>

      <p id={hintId} className="text-center text-xs leading-4 text-muted-foreground">
        Drag to move. Arrow keys nudge, + and - zoom.
      </p>
      <p role="status" className="sr-only">
        Zoom {percent} percent, offset {Math.round(crop.x * 100)} and {Math.round(crop.y * 100)} percent
      </p>

      <div className="flex min-w-0 flex-col gap-2">
        <div className="flex items-center justify-between text-sm leading-5 font-medium">
          <span aria-hidden="true">Zoom</span>
          <span aria-hidden="true" className="text-muted-foreground tabular-nums">{percent}%</span>
        </div>
        <Slider
          value={[percent]}
          min={MIN_ZOOM * 100}
          max={MAX_ZOOM * 100}
          step={5}
          thumbLabels={['Zoom']}
          formatValue={v => `${v}%`}
          onValueChange={([v]) => setCrop({ ...crop, zoom: v / 100 })}
        />
      </div>

      <div className="flex min-w-0 flex-wrap justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => {
            setCrop({ zoom: 1, x: 0, y: 0 });
            onReset?.();
          }}
        >
          {resetLabel}
        </Button>
        <Button onClick={() => onApply?.(crop)}>{applyLabel}</Button>
      </div>
    </div>
  );
}

export { AvatarCropper };
