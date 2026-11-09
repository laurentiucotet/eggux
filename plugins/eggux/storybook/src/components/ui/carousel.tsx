// EGG UI Carousel page: Carousel (149:296, single / multiple), Carousel Arrow (267:912), Carousel
// Indicator (267:951, dots / bars / counter, default / overlay tone), Carousel Slide (267:982,
// caption / overlay), Carousel Thumbnail (267:961), Carousel Gallery (269:892), Carousel Hero
// (269:927), Lightbox (269:960).
// Carousel: a region with aria-roledescription "carousel"; the viewport clips; slides are groups
// named "2 of 5" (aria-roledescription "slide"); slides out of view are inert. Arrows (36,
// "Previous slide" / "Next slide") are disabled at the ends; Left / Right move while the carousel
// has focus; swipe moves on touch. Dots are buttons "Go to slide 3", the active one 20 wide.
// Gallery: 4:3 stage with overlay arrows, a "2 / 8" counter, an open-viewer button and 64 px
// thumbnails (active = 2 px ring). Hero: 560 high banner, scrim, content in a 1152 container,
// timed bars with Pause; auto-advance pauses on hover and focus and is off with reduced motion.
// Lightbox: a modal dialog on video/background: counter, title, download, close; arrows and
// thumbnails; Esc closes, Left / Right move.
import * as React from 'react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { ChevronLeft, ChevronRight, Download, Maximize, Pause, Play, X } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { ImagePlaceholder } from './image-placeholder';

/* Arrow */

export interface CarouselArrowProps extends Omit<React.ComponentProps<'button'>, 'children'> {
  direction: 'previous' | 'next';
  /** outline under the slides; overlay on images (shadow md). */
  variant?: 'outline' | 'overlay';
}

function CarouselArrow({ direction, variant = 'outline', className, ...props }: CarouselArrowProps) {
  return (
    <button
      type="button"
      data-slot="carousel-arrow"
      aria-label={direction === 'previous' ? 'Previous slide' : 'Next slide'}
      className={cn(
        'flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border bg-background text-foreground outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:size-4',
        variant === 'overlay' ? 'border-border shadow-md' : 'border-input',
        className,
      )}
      {...props}
    >
      {direction === 'previous' ? <ChevronLeft aria-hidden="true" /> : <ChevronRight aria-hidden="true" />}
    </button>
  );
}

/* Indicator */

export interface CarouselIndicatorProps extends Omit<React.ComponentProps<'div'>, 'onSelect'> {
  type?: 'dots' | 'bars' | 'counter';
  /** overlay: on images, over a scrim pill. */
  tone?: 'default' | 'overlay';
  count: number;
  index: number;
  onSelect?: (index: number) => void;
  /** bars: how far the active slide's timer is, 0..1. */
  progress?: number;
  /** bars: Pause / Play. */
  paused?: boolean;
  onPausedChange?: (paused: boolean) => void;
}

function CarouselIndicator({ type = 'dots', tone = 'default', count, index, onSelect, progress = 0, paused = false, onPausedChange, className, ...props }: CarouselIndicatorProps) {
  const overlay = tone === 'overlay';
  const pill = overlay ? 'rounded-full bg-[var(--video-scrim)] px-2 py-1' : '';
  if (type === 'counter') {
    return (
      <div data-slot="carousel-indicator" data-type="counter" className={cn('flex items-center', pill, className)} {...props}>
        <span className={cn('text-sm leading-5 font-medium', overlay ? 'text-[var(--video-foreground)]' : 'text-foreground')}>
          <span aria-hidden="true">{index + 1} / {count}</span>
          <span className="sr-only">Slide {index + 1} of {count}</span>
        </span>
      </div>
    );
  }
  if (type === 'bars') {
    return (
      <div data-slot="carousel-indicator" data-type="bars" className={cn('flex items-center gap-2', pill, className)} {...props}>
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index ? 'true' : undefined}
            onClick={() => onSelect?.(i)}
            className="flex h-4 cursor-pointer items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--video-foreground)]"
          >
            <span className="block h-1 w-10 overflow-hidden rounded-full bg-[var(--video-track)]">
              <span data-slot="carousel-bar-fill" className="block h-full rounded-full bg-[var(--video-foreground)]" style={{ width: `${i < index ? 100 : i === index ? Math.round(progress * 100) : 0}%` }} />
            </span>
          </button>
        ))}
        <button
          type="button"
          aria-label={paused ? 'Play slides' : 'Pause slides'}
          onClick={() => onPausedChange?.(!paused)}
          className="flex size-9 cursor-pointer items-center justify-center rounded-full text-[var(--video-foreground)] outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[var(--video-foreground)] [&_svg]:size-4"
        >
          {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
        </button>
      </div>
    );
  }
  return (
    <div data-slot="carousel-indicator" data-type="dots" className={cn('flex items-center gap-1.5', pill, className)} {...props}>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          data-slot="carousel-dot"
          aria-label={`Go to slide ${i + 1}`}
          aria-current={i === index ? 'true' : undefined}
          onClick={() => onSelect?.(i)}
          className={cn(
            'h-2 cursor-pointer rounded-full outline-none transition-[width] duration-[var(--duration-fast)] focus-visible:ring-[3px] focus-visible:ring-ring/50',
            i === index ? 'w-5' : 'w-2',
            overlay ? (i === index ? 'bg-[var(--video-foreground)]' : 'bg-[var(--video-track)]') : i === index ? 'bg-primary' : 'bg-input',
          )}
        />
      ))}
    </div>
  );
}

/* Carousel */

export interface CarouselProps extends Omit<React.ComponentProps<'section'>, 'onChange'> {
  /** Region name: "Featured products". */
  label: string;
  /** single: one slide fills the viewport; multiple: fixed-width slides, as many as fit. */
  type?: 'single' | 'multiple';
  /** multiple: slide width. Default 264. */
  slideWidth?: number;
  /** Gap between slides. Default 24. */
  gap?: number;
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
}

function useControlled(value: number | undefined, initial: number, onChange?: (v: number) => void) {
  const [inner, setInner] = React.useState(initial);
  const current = value ?? inner;
  const set = React.useCallback((v: number) => { setInner(v); onChange?.(v); }, [onChange]);
  return [current, set] as const;
}

function useSwipe(onPrev: () => void, onNext: () => void) {
  const start = React.useRef<number | null>(null);
  return {
    onPointerDown: (e: React.PointerEvent) => { if (e.pointerType !== 'mouse') start.current = e.clientX; },
    onPointerUp: (e: React.PointerEvent) => {
      if (start.current === null) return;
      const dx = e.clientX - start.current;
      start.current = null;
      if (dx > 40) onPrev(); else if (dx < -40) onNext();
    },
  };
}

function Carousel({ label, type = 'single', slideWidth = 264, gap = 24, index, defaultIndex = 0, onIndexChange, className, children, ...props }: CarouselProps) {
  const slides = React.Children.toArray(children).filter(React.isValidElement);
  const n = slides.length;
  const viewport = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(0);
  React.useLayoutEffect(() => {
    const el = viewport.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);
  const w = type === 'single' ? width : slideWidth;
  const perView = type === 'single' ? 1 : Math.max(1, Math.floor((width + gap) / (slideWidth + gap)));
  const last = Math.max(0, n - perView);
  const [current, setCurrent] = useControlled(index, defaultIndex, onIndexChange);
  const at = Math.min(current, last);
  const go = (i: number) => setCurrent(Math.max(0, Math.min(last, i)));
  const swipe = useSwipe(() => go(at - 1), () => go(at + 1));
  return (
    <section
      data-slot="carousel"
      data-type={type}
      aria-roledescription="carousel"
      aria-label={label}
      className={cn('flex w-full min-w-0 flex-col items-center gap-4', className)}
      onKeyDown={e => {
        if (e.target !== e.currentTarget && (e.target as HTMLElement).closest('input, textarea, [role="slider"]')) return;
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(at - 1); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); go(at + 1); }
      }}
      {...props}
    >
      <div ref={viewport} data-slot="carousel-viewport" className="w-full overflow-hidden" {...swipe}>
        <div
          data-slot="carousel-track"
          className="flex transition-transform duration-[var(--duration-slow,300ms)] ease-out motion-reduce:transition-none"
          style={{ gap, transform: `translateX(-${at * (w + gap)}px)` }}
        >
          {slides.map((s, i) => {
            const visible = i >= at && i < at + perView;
            return (
              <div
                key={i}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${n}`}
                data-slot="carousel-item"
                inert={!visible}
                className="shrink-0"
                style={{ width: w || undefined, flexBasis: type === 'single' ? '100%' : undefined }}
              >
                {s}
              </div>
            );
          })}
        </div>
      </div>
      {last > 0 ? (
        <div data-slot="carousel-controls" className="flex w-full items-center justify-between">
          <CarouselArrow direction="previous" disabled={at === 0} onClick={() => go(at - 1)} />
          <CarouselIndicator count={last + 1} index={at} onSelect={go} />
          <CarouselArrow direction="next" disabled={at === last} onClick={() => go(at + 1)} />
        </div>
      ) : null}
      <p aria-live="polite" className="sr-only">Slide {at + 1} of {last + 1}</p>
    </section>
  );
}

/* Slide */

export interface CarouselSlideProps extends Omit<React.ComponentProps<'figure'>, 'title'> {
  type?: 'caption' | 'overlay';
  src?: string;
  alt?: string;
  title: string;
  description?: string;
  /** overlay: one action, a secondary Button. */
  action?: { label: string; href: string };
}

function CarouselSlide({ type = 'caption', src, alt = '', title, description, action, className, ...props }: CarouselSlideProps) {
  if (type === 'overlay') {
    return (
      <figure data-slot="carousel-slide" data-type="overlay" className={cn('relative m-0 flex aspect-video w-full flex-col justify-end overflow-hidden rounded-xl', className)} {...props}>
        <ImagePlaceholder ratio="16:9" src={src} alt={alt} showCaption={false} className="absolute inset-0 size-full rounded-xl" />
        <figcaption className="relative flex w-full flex-col items-start gap-3 bg-[var(--video-scrim)] p-8 text-[var(--video-foreground)]">
          <span className="text-2xl leading-8 font-semibold tracking-[-0.4px]">{title}</span>
          {description ? <span className="text-base leading-7">{description}</span> : null}
          {action ? <Button asChild variant="secondary"><a href={action.href}>{action.label}</a></Button> : null}
        </figcaption>
      </figure>
    );
  }
  return (
    <figure data-slot="carousel-slide" data-type="caption" className={cn('m-0 flex w-full flex-col gap-3', className)} {...props}>
      <ImagePlaceholder ratio="16:9" src={src} alt={alt} showCaption={false} className="w-full" />
      <figcaption className="flex flex-col gap-1 text-sm leading-5">
        <span className="font-medium text-foreground">{title}</span>
        {description ? <span className="text-muted-foreground">{description}</span> : null}
      </figcaption>
    </figure>
  );
}

/* Thumbnail */

export interface CarouselThumbnailProps extends Omit<React.ComponentProps<'button'>, 'children'> {
  src?: string;
  /** The image alt: the button's name. */
  alt: string;
  active?: boolean;
}

function CarouselThumbnail({ src, alt, active = false, className, ...props }: CarouselThumbnailProps) {
  return (
    <button
      type="button"
      data-slot="carousel-thumbnail"
      aria-label={alt}
      aria-current={active ? 'true' : undefined}
      className={cn('size-16 shrink-0 cursor-pointer overflow-hidden rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50', active ? 'border-2 border-ring' : 'border border-border', className)}
      {...props}
    >
      <ImagePlaceholder ratio="1:1" src={src} alt="" showCaption={false} className="size-full rounded-none" />
    </button>
  );
}

/* Lightbox */

export interface GalleryImage { src?: string; alt: string; title?: string }

export interface LightboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: GalleryImage[];
  index: number;
  onIndexChange: (index: number) => void;
  onDownload?: (image: GalleryImage) => void;
  showThumbnails?: boolean;
}

function Lightbox({ open, onOpenChange, images, index, onIndexChange, onDownload, showThumbnails = true }: LightboxProps) {
  const n = images.length;
  const img = images[index];
  const go = (i: number) => onIndexChange(Math.max(0, Math.min(n - 1, i)));
  const iconBtn = 'flex size-9 cursor-pointer items-center justify-center rounded-full text-[var(--video-foreground)] outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[var(--video-foreground)] [&_svg]:size-4';
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content
          data-slot="lightbox"
          aria-describedby={undefined}
          onKeyDown={e => {
            if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
            else if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
          }}
          className="fixed inset-0 z-50 bg-[var(--video-background)] text-[var(--video-foreground)] outline-none"
        >
          <div className="absolute inset-x-0 top-0 z-10 flex items-center gap-3 px-6 py-4">
            <span className="text-sm leading-5 font-medium" aria-hidden="true">{index + 1} / {n}</span>
            <DialogPrimitive.Title className="m-0 min-w-0 flex-1 truncate text-sm leading-5 font-normal">
              <span className="sr-only">Image {index + 1} of {n}: </span>{img?.title ?? img?.alt}
            </DialogPrimitive.Title>
            {onDownload && img ? <button type="button" aria-label="Download image" className={iconBtn} onClick={() => onDownload(img)}><Download aria-hidden="true" /></button> : null}
            <DialogPrimitive.Close aria-label="Close viewer" className={iconBtn}><X aria-hidden="true" /></DialogPrimitive.Close>
          </div>
          <div className="absolute inset-x-24 top-16 bottom-28 flex items-center justify-center">
            {img ? <ImagePlaceholder ratio="16:9" src={img.src} alt={img.alt} showCaption={false} className="max-h-full w-full max-w-[960px]" /> : null}
          </div>
          <CarouselArrow direction="previous" variant="overlay" disabled={index === 0} onClick={() => go(index - 1)} className="absolute top-1/2 left-12 -translate-y-1/2" />
          <CarouselArrow direction="next" variant="overlay" disabled={index === n - 1} onClick={() => go(index + 1)} className="absolute top-1/2 right-12 -translate-y-1/2" />
          {showThumbnails ? (
            <div className="absolute bottom-6 left-1/2 flex max-w-[calc(100%-48px)] -translate-x-1/2 gap-2 overflow-x-auto p-1">
              {images.map((im, i) => <CarouselThumbnail key={i} src={im.src} alt={im.alt} active={i === index} onClick={() => go(i)} />)}
            </div>
          ) : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/* Gallery */

export interface CarouselGalleryProps extends Omit<React.ComponentProps<'section'>, 'onChange'> {
  label: string;
  images: GalleryImage[];
  showThumbnails?: boolean;
  /** Open in a Lightbox from the stage. Default true. */
  lightbox?: boolean;
  onDownload?: (image: GalleryImage) => void;
  defaultIndex?: number;
}

function CarouselGallery({ label, images, showThumbnails = true, lightbox = true, onDownload, defaultIndex = 0, className, ...props }: CarouselGalleryProps) {
  const [index, setIndex] = React.useState(defaultIndex);
  const [open, setOpen] = React.useState(false);
  const n = images.length;
  const go = (i: number) => setIndex(Math.max(0, Math.min(n - 1, i)));
  const swipe = useSwipe(() => go(index - 1), () => go(index + 1));
  const img = images[index];
  return (
    <section
      data-slot="carousel-gallery"
      aria-roledescription="carousel"
      aria-label={label}
      className={cn('flex w-[560px] max-w-full flex-col gap-3', className)}
      onKeyDown={e => {
        if (open) return;
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
      }}
      {...props}
    >
      <div data-slot="gallery-stage" className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted" {...swipe}>
        {img ? <ImagePlaceholder ratio="4:3" src={img.src} alt={img.alt} showCaption={false} className="absolute inset-0 size-full rounded-none" /> : null}
        <CarouselArrow direction="previous" variant="overlay" disabled={index === 0} onClick={() => go(index - 1)} className="absolute top-1/2 left-4 -translate-y-1/2" />
        <CarouselArrow direction="next" variant="overlay" disabled={index === n - 1} onClick={() => go(index + 1)} className="absolute top-1/2 right-4 -translate-y-1/2" />
        <CarouselIndicator type="counter" tone="overlay" count={n} index={index} className="absolute right-4 bottom-4" aria-live="polite" />
        {lightbox ? (
          <button type="button" aria-label="Open full screen" onClick={() => setOpen(true)} className="absolute top-4 right-4 flex size-9 cursor-pointer items-center justify-center rounded-full bg-[var(--video-scrim)] text-[var(--video-foreground)] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 [&_svg]:size-4">
            <Maximize aria-hidden="true" />
          </button>
        ) : null}
      </div>
      {showThumbnails ? (
        <div data-slot="gallery-thumbnails" className="flex max-w-full gap-2 overflow-x-auto p-0.5">
          {images.map((im, i) => <CarouselThumbnail key={i} src={im.src} alt={im.alt} active={i === index} onClick={() => go(i)} />)}
        </div>
      ) : null}
      {lightbox ? <Lightbox open={open} onOpenChange={setOpen} images={images} index={index} onIndexChange={setIndex} onDownload={onDownload} /> : null}
    </section>
  );
}

/* Hero */

export interface HeroSlide { overline?: string; title: string; text?: string; action?: { label: string; href: string }; src?: string; alt?: string }

export interface CarouselHeroProps extends Omit<React.ComponentProps<'section'>, 'onChange'> {
  label: string;
  slides: HeroSlide[];
  /** Auto-advance time in ms (6000-8000). 0 turns it off. Off with reduced motion. */
  interval?: number;
  defaultIndex?: number;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(() => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  React.useEffect(() => {
    const m = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!m) return;
    const on = () => setReduced(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return reduced;
}

function CarouselHero({ label, slides, interval = 7000, defaultIndex = 0, className, ...props }: CarouselHeroProps) {
  const n = slides.length;
  const [index, setIndex] = React.useState(defaultIndex);
  const [paused, setPaused] = React.useState(false);
  const [held, setHeld] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(0);
  const reduced = usePrefersReducedMotion();
  const running = interval > 0 && !paused && !held && !reduced && n > 1;
  const go = (i: number) => { setIndex(((i % n) + n) % n); setElapsed(0); };
  React.useEffect(() => {
    if (!running) return;
    const step = 100;
    const t = window.setInterval(() => setElapsed(e => e + step), step);
    return () => window.clearInterval(t);
  }, [running]);
  React.useEffect(() => {
    if (running && elapsed >= interval) { setIndex(i => (i + 1) % n); setElapsed(0); }
  }, [elapsed, interval, n, running]);
  const s = slides[index]!;
  return (
    <section
      data-slot="carousel-hero"
      aria-roledescription="carousel"
      aria-label={label}
      className={cn('relative flex h-[560px] w-full min-w-[768px] flex-col overflow-hidden', className)}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setHeld(false); }}
      {...props}
    >
      {slides.map((sl, i) => (
        <div key={i} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${n}`} inert={i !== index} hidden={i !== index} className="absolute inset-0">
          <ImagePlaceholder ratio="21:9" src={sl.src} alt={sl.alt ?? ''} showCaption={false} className="absolute inset-0 size-full rounded-none" />
          <div aria-hidden="true" className="absolute inset-0 bg-[var(--video-scrim)]" />
          <div className="absolute inset-0 flex flex-col items-center px-6 pt-16 pb-32">
            <div className="w-full max-w-[1152px]">
              <div className="flex max-w-[640px] flex-col items-start gap-6 text-[var(--video-foreground)]">
                {sl.overline ? <p className="m-0 truncate text-xs leading-4 font-semibold tracking-[1.6px] uppercase">{sl.overline}</p> : null}
                <h2 className="m-0 line-clamp-3 text-6xl leading-[60px] font-extrabold tracking-[-0.4px]">{sl.title}</h2>
                {sl.text ? <p className="m-0 line-clamp-3 text-xl leading-7">{sl.text}</p> : null}
                {sl.action ? <Button asChild size="lg" variant="secondary" className="px-6"><a href={sl.action.href}>{sl.action.label}</a></Button> : null}
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="absolute inset-x-0 bottom-12 flex justify-center px-6">
        <div className="flex w-full max-w-[1152px] items-end justify-between">
          <CarouselIndicator type="bars" tone="overlay" count={n} index={index} progress={interval > 0 ? elapsed / interval : 0} paused={paused} onPausedChange={setPaused} onSelect={go} />
          <div className="flex gap-3">
            <CarouselArrow direction="previous" variant="overlay" onClick={() => go(index - 1)} />
            <CarouselArrow direction="next" variant="overlay" onClick={() => go(index + 1)} />
          </div>
        </div>
      </div>
      <p aria-live={running ? 'off' : 'polite'} className="sr-only">Slide {index + 1} of {n}: {s.title}</p>
    </section>
  );
}

export { Carousel, CarouselArrow, CarouselGallery, CarouselHero, CarouselIndicator, CarouselSlide, CarouselThumbnail, Lightbox };
