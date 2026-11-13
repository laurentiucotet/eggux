// EGG UI Lightbox. Code only (no Figma component yet). A full-screen image viewer inside the
// library Dialog (fullscreen size): the title row has the gallery name, the "2 / 6" counter and a
// Close button; the stage shows the image at 4:3 with previous and next buttons over it; the
// caption sits under it and is the dialog's description. Left and Right arrows (Home, End) change
// the image from wherever focus is, Escape or the close button closes and focus returns to the
// control that opened it (Radix Dialog). Images are ImagePlaceholder (tinted block without src).
// Use for looking closer at a photo from a Gallery or Photo Grid; not for a form or a decision
// (use Dialog) and not for video.
import * as React from 'react';
import { ChevronLeft, ChevronRight, X } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { ButtonIcon } from './button-icon';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from './dialog';
import { ImagePlaceholder } from './image-placeholder';

export interface LightboxImage {
  /** Photo URL. Without it the item is a tinted block with the image icon. */
  src?: string;
  /** What the image shows (screen readers); required. */
  alt: string;
  /** Text under the image; the dialog description. */
  caption?: string;
}

const tones = [
  'bg-[color-mix(in_srgb,var(--chart-1)_28%,var(--background))]',
  'bg-[color-mix(in_srgb,var(--chart-2)_28%,var(--background))]',
  'bg-[color-mix(in_srgb,var(--chart-3)_28%,var(--background))]',
  'bg-[color-mix(in_srgb,var(--chart-4)_28%,var(--background))]',
  'bg-[color-mix(in_srgb,var(--chart-5)_28%,var(--background))]',
  'bg-[color-mix(in_srgb,var(--chart-6)_28%,var(--background))]',
];

export interface LightboxProps {
  images: LightboxImage[];
  /** Title of the viewer ("Product photos"); the dialog's accessible name. */
  label: string;
  /** Control that opens it (a Button or a thumbnail). It gets focus back on close. */
  trigger?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Shown image when uncontrolled. */
  defaultIndex?: number;
  /** Shown image when controlled. */
  index?: number;
  onIndexChange?: (index: number) => void;
  /** Show the caption under the image. */
  showCaption?: boolean;
  /** Show the "2 / 6" counter. */
  showCounter?: boolean;
  /** Next on the last image goes to the first. */
  loop?: boolean;
  className?: string;
}

function Lightbox({
  images,
  label,
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  defaultIndex = 0,
  index,
  onIndexChange,
  showCaption = true,
  showCounter = true,
  loop = false,
  className,
}: LightboxProps) {
  const [inner, setInner] = React.useState(defaultIndex);
  const count = images.length;
  const current = Math.min(Math.max(index ?? inner, 0), Math.max(count - 1, 0));
  const item = images[current];
  const content = React.useRef<HTMLDivElement>(null);
  const first = React.useRef(true);

  // A button that becomes disabled (Next on the last image) drops focus: keep it in the viewer
  // so the arrow keys keep working.
  React.useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const active = document.activeElement as HTMLButtonElement | null;
    if (!active || active === document.body || active.disabled) content.current?.focus();
  }, [current]);

  const go = (next: number) => {
    if (count === 0) return;
    const value = loop ? (next + count) % count : Math.min(Math.max(next, 0), count - 1);
    if (value === current) return;
    setInner(value);
    onIndexChange?.(value);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const keys: Record<string, number> = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: count - 1 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    go(keys[e.key]);
  };

  return (
    <Dialog open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent
        ref={content}
        size="fullscreen"
        data-slot="lightbox"
        onKeyDown={onKeyDown}
        className={cn('gap-3 sm:gap-4', className)}
      >
        <div className="flex min-w-0 shrink-0 items-center gap-3">
          <DialogTitle className="min-w-0 flex-1 truncate">{label}</DialogTitle>
          {showCounter && count > 0 ? (
            <span data-slot="lightbox-counter" className="shrink-0 text-sm leading-5 text-muted-foreground tabular-nums">
              {current + 1} / {count}
            </span>
          ) : null}
          <DialogClose asChild>
            <Button variant="ghost" size="icon" aria-label="Close" className="shrink-0">
              <X aria-hidden="true" />
            </Button>
          </DialogClose>
        </div>

        <div className="relative flex min-h-0 min-w-0 flex-1 items-center justify-center [container-type:size]">
          {item ? (
            <div
              data-slot="lightbox-stage"
              role={item.src ? undefined : 'img'}
              aria-label={item.src ? undefined : item.alt}
              className="aspect-[4/3] w-[min(100cqw,calc(100cqh*1.3333))] overflow-hidden rounded-lg border border-border"
            >
              <ImagePlaceholder ratio="4:3" src={item.src} alt={item.alt} className={cn('h-full', tones[current % tones.length])} />
            </div>
          ) : null}
          {count > 1 ? (
            <>
              <ButtonIcon
                variant="secondary"
                label="Previous image"
                icon={<ChevronLeft />}
                disabled={!loop && current === 0}
                showTooltip={false}
                onClick={() => go(current - 1)}
                className="absolute top-1/2 left-0 -translate-y-1/2"
              />
              <ButtonIcon
                variant="secondary"
                label="Next image"
                icon={<ChevronRight />}
                disabled={!loop && current === count - 1}
                showTooltip={false}
                onClick={() => go(current + 1)}
                className="absolute top-1/2 right-0 -translate-y-1/2"
              />
            </>
          ) : null}
        </div>

        <DialogDescription className={cn('min-w-0 shrink-0 text-center text-sm leading-5', !(showCaption && item?.caption) && 'sr-only')}>
          {item ? (showCaption && item.caption ? item.caption : item.alt) : 'No images'}
        </DialogDescription>
        <p role="status" className="sr-only">
          {item ? `Image ${current + 1} of ${count}` : ''}
        </p>
      </DialogContent>
    </Dialog>
  );
}

export { Lightbox };
