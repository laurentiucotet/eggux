// EGG UI blocks, BLOCKS / Sections page (73:2), Gallery family: Block / Gallery Grid (206:2004) and
// Block / Gallery Mosaic (206:2049). Guide: build-ui/patterns/marketing-pages.md (Gallery: Grid for
// places and events, Mosaic for a property, product or venue detail page; gallery grids use Image
// Figure).
// Both are a <section> on background/default, 96 px vertical padding (64 below 768), content in a
// 1152 container (layout/container/6xl) with 24 / 32 px gutters below 1152. Layout follows the
// block's own width (container queries).
// Gallery Grid: centered Section Header, 48 above a masonry of Image Figures (4:3 and 3:4, caption
// under each), three columns of 368, 24 apart (two columns from 576, one below). Each photo opens
// the Lightbox at that photo (Esc closes, arrows move).
// Gallery Mosaic: a 4:3 photo (572) next to a 2 × 2 grid of 4:3 photos, 8 apart, radius 12; an
// outline Button sm "Show all N photos" over the last photo opens the Lightbox. Stacked below 768
// (side by side from 768).
// The Mosaic has no visible title: name the section with `label`.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Lightbox, type GalleryImage } from './carousel';
import { ImagePlaceholder, type ImageRatio } from './image-placeholder';
import { ImageFigure } from './imagery';
import { SectionHeader } from './section-header-block';

const shell = '@container w-full bg-background text-foreground';
const inner = 'mx-auto flex w-full max-w-6xl min-w-0 flex-col items-center px-6 py-16 @3xl:px-8 @3xl:py-24 @6xl:px-0';

/* Gallery Grid */

export interface GalleryPhoto {
  /** Where or what, one line. Also the photo's name in the Lightbox. */
  caption: string;
  /** Alt text; defaults to the caption. */
  alt?: string;
  src?: string;
  ratio?: Extract<ImageRatio, '4:3' | '3:4'>;
  credit?: string;
}

export interface GalleryGridProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  overline?: string;
  title?: string;
  description?: string;
  /** Nine photos read column by column: each column holds one tall (3:4) photo. */
  photos?: GalleryPhoto[];
  /** Open a photo full screen in the Lightbox. Default true. */
  lightbox?: boolean;
}

const gridPhotos: GalleryPhoto[] = [
  { caption: 'Bucharest, the kitchen', ratio: '4:3' },
  { caption: 'Berlin, team room', ratio: '3:4' },
  { caption: 'London, reception', ratio: '4:3' },
  { caption: 'Offsite 2026, Sinaia', ratio: '3:4' },
  { caption: 'Berlin, focus rooms', ratio: '4:3' },
  { caption: 'Bucharest, terrace', ratio: '4:3' },
  { caption: 'London, workshop', ratio: '4:3' },
  { caption: 'Bucharest, library', ratio: '4:3' },
  { caption: 'Offsite 2026, dinner', ratio: '3:4' },
];

const toLightbox = (p: GalleryPhoto): GalleryImage => ({ src: p.src, alt: p.alt ?? p.caption, title: p.caption });

/** Lightbox state that sends focus back to the control that opened it (Lightbox has no trigger). */
function useLightbox() {
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const opener = React.useRef<HTMLElement | null>(null);
  const show = (i: number, from: HTMLElement) => { opener.current = from; setIndex(i); setOpen(true); };
  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) window.setTimeout(() => opener.current?.focus(), 0);
  };
  return { open, index, setIndex, show, onOpenChange };
}

function GalleryGrid({
  overline = 'Gallery',
  title = 'Inside our offices',
  description = 'Bucharest, Berlin and London.',
  photos = gridPhotos,
  lightbox = true,
  className,
  ...props
}: GalleryGridProps) {
  const titleId = React.useId();
  const lb = useLightbox();
  return (
    <section data-slot="gallery-grid" aria-labelledby={titleId} className={cn(shell, className)} {...props}>
      <div className={cn(inner, 'gap-10 @3xl:gap-12')}>
        <SectionHeader titleId={titleId} overline={overline} title={title} description={description} />
        <ul data-slot="gallery-grid-photos" className="m-0 w-full list-none columns-1 gap-6 p-0 @xl:columns-2 @4xl:columns-3">
          {photos.map((p, i) => (
            <li key={`${p.caption}-${i}`} className="relative mb-6 break-inside-avoid last:mb-0">
              <ImageFigure ratio={p.ratio ?? '4:3'} src={p.src} alt={p.alt ?? p.caption} caption={p.caption} credit={p.credit} />
              {lightbox ? (
                <button
                  type="button"
                  aria-label={`Open photo: ${p.caption}`}
                  aria-haspopup="dialog"
                  onClick={e => lb.show(i, e.currentTarget)}
                  className="absolute inset-0 cursor-zoom-in rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                />
              ) : null}
            </li>
          ))}
        </ul>
      </div>
      {lightbox ? <Lightbox open={lb.open} onOpenChange={lb.onOpenChange} images={photos.map(toLightbox)} index={lb.index} onIndexChange={lb.setIndex} /> : null}
    </section>
  );
}

/* Gallery Mosaic */

export interface GalleryMosaicProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  /** Name of the section (the Mosaic has no visible title): what the photos show. */
  label?: string;
  /** All photos. The first five show in the mosaic; the button opens all of them. */
  photos?: GalleryImage[];
  /** Figma Button "Show all N photos": opens the Lightbox. Default true. */
  showAll?: boolean;
}

const mosaicPhotos: GalleryImage[] = [
  { alt: 'Team meeting in the main room of the Acme Bucharest office', title: 'Bucharest, main room' },
  { alt: 'Planning board in the Berlin project room', title: 'Berlin, project room' },
  { alt: 'Empty meeting room with a long table and city views', title: 'London, boardroom' },
  { alt: 'The river and bridge next to the Acme office at dusk', title: 'The neighbourhood at dusk' },
  { alt: 'Team dinner under pendant lights at the 2026 offsite', title: 'Offsite 2026, dinner' },
  { alt: 'Quiet focus booths with desks and lamps', title: 'Berlin, focus booths' },
  { alt: 'Roof terrace with tables and plants', title: 'Bucharest, terrace' },
  { alt: 'Reception desk and waiting area', title: 'London, reception' },
];

function GalleryMosaic({ label = 'Photos of the Acme offices', photos = mosaicPhotos, showAll = true, className, ...props }: GalleryMosaicProps) {
  const lb = useLightbox();
  const [main, ...rest] = photos;
  const small = rest.slice(0, 4);
  const tile = (p: GalleryImage) => <ImagePlaceholder ratio="4:3" src={p.src} alt={p.alt} showCaption={false} className="rounded-xl" />;
  return (
    <section data-slot="gallery-mosaic" aria-label={label} className={cn(shell, className)} {...props}>
      <div className={inner}>
        <div data-slot="gallery-mosaic-row" className="relative grid w-full grid-cols-1 gap-2 @3xl:grid-cols-2">
          {main ? tile(main) : null}
          <div data-slot="gallery-mosaic-grid" className="grid grid-cols-2 gap-2">
            {small.map((p, i) => <React.Fragment key={i}>{tile(p)}</React.Fragment>)}
          </div>
          {showAll && photos.length ? (
            <Button
              variant="outline"
              size="sm"
              aria-haspopup="dialog"
              onClick={e => lb.show(0, e.currentTarget)}
              className="absolute right-4 bottom-4"
            >
              Show all {photos.length} photos
            </Button>
          ) : null}
        </div>
      </div>
      {showAll ? <Lightbox open={lb.open} onOpenChange={lb.onOpenChange} images={photos} index={lb.index} onIndexChange={lb.setIndex} /> : null}
    </section>
  );
}

export { GalleryGrid, GalleryMosaic };
