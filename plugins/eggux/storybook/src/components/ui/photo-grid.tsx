// EGG UI Photo Grid. Code only (no Figma component yet). A grid of photos in two layouts: masonry
// (CSS columns, each photo keeps its own aspect ratio) and rows (justified rows, every row fills
// the width). A caption can sit over the bottom of each photo (always, or on hover and focus),
// and when there are more photos than `max` the last visible tile becomes a "+N more" button that
// shows the rest (and calls onMore). With onPhotoClick every photo is a button ("Open photo:
// ...", for a Lightbox); without it they are plain images. Photos use ImagePlaceholder (a tinted
// block with the image icon when there is no src). The grid fills its column and works at 276 px.
// Not for a page of unrelated cards (use a card grid) or one featured image (use Figure).
import * as React from 'react';
import { cn } from '@/lib/utils';
import { ImagePlaceholder } from './image-placeholder';

export interface Photo {
  /** Photo URL. Without it the photo is a tinted block with the image icon. */
  src?: string;
  /** What the photo shows (screen readers); required. */
  alt: string;
  /** Short caption over the bottom of the photo. */
  caption?: string;
  /** Width divided by height (1.5 = landscape, 0.75 = portrait). Default 1.5. */
  aspect?: number;
}

const tones = [
  'bg-[color-mix(in_srgb,var(--chart-1)_28%,var(--background))]',
  'bg-[color-mix(in_srgb,var(--chart-2)_28%,var(--background))]',
  'bg-[color-mix(in_srgb,var(--chart-3)_28%,var(--background))]',
  'bg-[color-mix(in_srgb,var(--chart-4)_28%,var(--background))]',
  'bg-[color-mix(in_srgb,var(--chart-5)_28%,var(--background))]',
  'bg-[color-mix(in_srgb,var(--chart-6)_28%,var(--background))]',
];

const captionBase =
  'pointer-events-none absolute inset-x-0 bottom-0 truncate bg-foreground/80 px-2 py-1.5 text-left text-xs leading-4 text-background';

export interface PhotoGridProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  photos: Photo[];
  /** Accessible name of the grid ("Team photos"). */
  label: string;
  /** Masonry columns keep each photo's ratio; rows are justified rows of one height. */
  layout?: 'masonry' | 'rows';
  /** Masonry: number of columns. */
  columns?: number;
  /** Rows: target height of a row in px. */
  rowHeight?: number;
  /** Captions over the photos: always, on hover and focus, or off. */
  captions?: 'always' | 'hover' | 'off';
  /** How many photos show before the "+N more" tile. 0 shows all. */
  max?: number;
  /** Makes every photo a button; called with the photo's index in `photos`. */
  onPhotoClick?: (index: number) => void;
  /** Called when "+N more" is pressed (the rest also shows). */
  onMore?: () => void;
}

function PhotoGrid({
  photos,
  label,
  layout = 'masonry',
  columns = 3,
  rowHeight = 120,
  captions = 'always',
  max = 0,
  onPhotoClick,
  onMore,
  className,
  style,
  ...props
}: PhotoGridProps) {
  const [expanded, setExpanded] = React.useState(false);
  const limited = max > 0 && photos.length > max && !expanded;
  const visible = limited ? photos.slice(0, max) : photos;
  const hidden = photos.length - visible.length;

  const tile = (photo: Photo, i: number, last: boolean) => {
    const aspect = photo.aspect ?? 1.5;
    const showMore = last && hidden > 0;
    const caption = captions !== 'off' && photo.caption && !showMore ? photo.caption : null;
    const body = (
      <>
        <ImagePlaceholder
          ratio="1:1"
          src={photo.src}
          alt={photo.alt}
          showCaption={!photo.src}
          className={cn(tones[i % tones.length])}
          style={{ aspectRatio: aspect }}
        />
        {caption ? (
          <span
            data-slot="photo-grid-caption"
            className={cn(captionBase, captions === 'hover' && 'motion-safe:transition-opacity opacity-0 group-focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100')}
          >
            {caption}
          </span>
        ) : null}
      </>
    );
    const frame = cn(
      'group relative block w-full min-w-0 overflow-hidden rounded-md border border-border',
      layout === 'masonry' && 'mb-2 break-inside-avoid',
    );
    const rowStyle = layout === 'rows' ? { flex: `${aspect} 1 ${aspect * rowHeight}px` } : undefined;

    if (showMore) {
      return (
        <div key={i} className={cn(frame, 'relative')} style={rowStyle}>
          {body}
          <button
            type="button"
            data-slot="photo-grid-more"
            aria-label={`+${hidden} more, show all photos`}
            onClick={() => {
              setExpanded(true);
              onMore?.();
            }}
            className="absolute inset-0 flex items-center justify-center bg-foreground/80 text-lg leading-7 font-semibold text-background outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-ring"
          >
            +{hidden} more
          </button>
        </div>
      );
    }
    if (onPhotoClick) {
      return (
        <button
          key={i}
          type="button"
          aria-label={`Open photo: ${photo.alt}${caption ? `. ${caption}` : ''}`}
          onClick={() => onPhotoClick(photos.indexOf(photo))}
          className={cn(frame, 'cursor-zoom-in outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50')}
          style={rowStyle}
        >
          {body}
        </button>
      );
    }
    return (
      <div key={i} role={photo.src ? undefined : 'img'} aria-label={photo.src ? undefined : photo.alt} className={frame} style={rowStyle}>
        {body}
      </div>
    );
  };

  return (
    <div
      data-slot="photo-grid"
      data-layout={layout}
      role="group"
      aria-label={label}
      className={cn('w-full min-w-0', layout === 'rows' ? 'flex flex-wrap gap-2' : 'gap-2', className)}
      style={layout === 'masonry' ? { columnCount: columns, ...style } : style}
      {...props}
    >
      {visible.map((photo, i) => tile(photo, i, i === visible.length - 1))}
      {layout === 'rows' ? <span aria-hidden="true" className="min-w-0" style={{ flex: '999 1 0' }} /> : null}
    </div>
  );
}

export { PhotoGrid };
