// EGG UI Image Gallery. Code only (no Figma component yet). One main image with a thumbnail strip
// under it, previous and next arrows over the image and a counter ("2 / 6"). It is a group with
// the role description "carousel": Left and Right arrows (also Home and End) change the image
// from anywhere inside it, a thumbnail is a button with aria-current, and a polite status line
// tells screen readers which image is shown. Images use ImagePlaceholder (a tinted block with the
// image icon when an item has no src), so no network is needed. The strip scrolls sideways and
// keeps the current thumbnail in view; the whole thing fills its column (min-w-0, works at 276 px).
// With onImageClick the main image becomes a button (open a Lightbox). Not for a list of
// unrelated cards (use Carousel).
import * as React from 'react';
import { ChevronLeft, ChevronRight } from '@/components/icons';
import { cn } from '@/lib/utils';
import { ButtonIcon } from './button-icon';
import { ImagePlaceholder, type ImageRatio } from './image-placeholder';

export interface GalleryImage {
  /** Photo URL. Without it the item is a tinted block with the image icon. */
  src?: string;
  /** What the image shows (screen readers); required. */
  alt: string;
  /** Short text under the main image. */
  caption?: string;
}

// Tints from the chart tokens, mixed into the page background. Written out in full for Tailwind.
const tones = [
  'bg-[color-mix(in_srgb,var(--chart-1)_28%,var(--background))]',
  'bg-[color-mix(in_srgb,var(--chart-2)_28%,var(--background))]',
  'bg-[color-mix(in_srgb,var(--chart-3)_28%,var(--background))]',
  'bg-[color-mix(in_srgb,var(--chart-4)_28%,var(--background))]',
  'bg-[color-mix(in_srgb,var(--chart-5)_28%,var(--background))]',
  'bg-[color-mix(in_srgb,var(--chart-6)_28%,var(--background))]',
];

export interface ImageGalleryProps extends Omit<React.ComponentProps<'div'>, 'children' | 'onChange'> {
  images: GalleryImage[];
  /** Accessible name of the gallery ("Product photos"). */
  label: string;
  /** Shown image when uncontrolled. */
  defaultIndex?: number;
  /** Shown image when controlled. */
  index?: number;
  onIndexChange?: (index: number) => void;
  /** Shape of the main image. */
  ratio?: ImageRatio;
  /** Show the thumbnail strip. */
  showThumbnails?: boolean;
  /** Show the "2 / 6" counter. */
  showCounter?: boolean;
  /** Show the caption under the main image. */
  showCaption?: boolean;
  /** Next on the last image goes to the first. */
  loop?: boolean;
  /** Makes the main image a button; called with the shown index. */
  onImageClick?: (index: number) => void;
  /** Accessible name of the main image button. */
  openLabel?: string;
}

function ImageGallery({
  images,
  label,
  defaultIndex = 0,
  index,
  onIndexChange,
  ratio = '4:3',
  showThumbnails = true,
  showCounter = true,
  showCaption = true,
  loop = false,
  onImageClick,
  openLabel = 'Open image full screen',
  className,
  onKeyDown,
  ...props
}: ImageGalleryProps) {
  const [inner, setInner] = React.useState(defaultIndex);
  const count = images.length;
  const current = Math.min(Math.max(index ?? inner, 0), Math.max(count - 1, 0));
  const strip = React.useRef<HTMLDivElement>(null);
  const root = React.useRef<HTMLDivElement>(null);
  const first = React.useRef(true);

  const go = (next: number) => {
    if (count === 0) return;
    const value = loop ? (next + count) % count : Math.min(Math.max(next, 0), count - 1);
    if (value === current) return;
    setInner(value);
    onIndexChange?.(value);
  };

  // Keep the current thumbnail visible inside the strip, without scrolling the page.
  React.useEffect(() => {
    const strip_ = strip.current;
    const thumb = strip_?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!strip_ || !thumb) return;
    const left = thumb.offsetLeft - strip_.offsetLeft;
    if (left < strip_.scrollLeft) strip_.scrollLeft = left;
    else if (left + thumb.offsetWidth > strip_.scrollLeft + strip_.clientWidth) strip_.scrollLeft = left + thumb.offsetWidth - strip_.clientWidth;
  }, [current]);

  // A button that becomes disabled (Next on the last image) drops focus: hand it to the current
  // thumbnail (or the group) so the arrow keys keep working.
  React.useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const active = document.activeElement as HTMLButtonElement | null;
    if (!active || active === document.body || active.disabled) {
      (strip.current?.querySelector<HTMLElement>('[aria-current="true"]') ?? root.current)?.focus({ preventScroll: true });
    }
  }, [current]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    const keys: Record<string, number> = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: count - 1 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    go(keys[e.key]);
  };

  const item = images[current];
  const atStart = !loop && current === 0;
  const atEnd = !loop && current === count - 1;

  const main = item ? (
    <div role={item.src ? undefined : 'img'} aria-label={item.src ? undefined : item.alt}>
      <ImagePlaceholder ratio={ratio} src={item.src} alt={item.alt} className={cn(tones[current % tones.length])} />
    </div>
  ) : null;

  return (
    <div
      ref={root}
      tabIndex={-1}
      data-slot="image-gallery"
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className={cn('flex w-full min-w-0 flex-col gap-3 outline-none', className)}
      {...props}
    >
      <div className="relative min-w-0 overflow-hidden rounded-lg border border-border">
        {onImageClick && main ? (
          <button
            type="button"
            aria-label={`${openLabel}: ${item.alt}`}
            onClick={() => onImageClick(current)}
            className="block w-full cursor-zoom-in outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-ring/50"
          >
            {main}
          </button>
        ) : (
          main
        )}
        {count > 1 ? (
          <>
            <ButtonIcon
              variant="secondary"
              size="sm"
              label="Previous image"
              icon={<ChevronLeft />}
              disabled={atStart}
              showTooltip={false}
              onClick={() => go(current - 1)}
              className="absolute top-1/2 left-2 -translate-y-1/2"
            />
            <ButtonIcon
              variant="secondary"
              size="sm"
              label="Next image"
              icon={<ChevronRight />}
              disabled={atEnd}
              showTooltip={false}
              onClick={() => go(current + 1)}
              className="absolute top-1/2 right-2 -translate-y-1/2"
            />
          </>
        ) : null}
        {showCounter && count > 0 ? (
          <span
            data-slot="image-gallery-counter"
            className="pointer-events-none absolute right-2 bottom-2 rounded-md bg-foreground/80 px-2 py-0.5 text-xs leading-4 font-medium text-background"
          >
            {current + 1} / {count}
          </span>
        ) : null}
      </div>

      {showCaption && item?.caption ? <p className="min-w-0 truncate text-sm leading-5 text-muted-foreground">{item.caption}</p> : null}
      <p role="status" className="sr-only">
        {item ? `Image ${current + 1} of ${count}: ${item.alt}` : 'No images'}
      </p>

      {showThumbnails && count > 1 ? (
        <div ref={strip} data-slot="image-gallery-thumbnails" className="relative flex min-w-0 gap-2 overflow-x-auto p-1 [scrollbar-width:thin]">
          {images.map((image, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show image ${i + 1}: ${image.alt}`}
              aria-current={i === current ? 'true' : undefined}
              onClick={() => go(i)}
              className={cn(
                'relative block w-16 shrink-0 overflow-hidden rounded-md border border-border outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
                i === current ? 'ring-2 ring-primary' : 'opacity-80 hover:opacity-100',
              )}
            >
              <ImagePlaceholder ratio="1:1" src={image.src} alt="" showCaption={false} className={cn(tones[i % tones.length])} />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export { ImageGallery };
