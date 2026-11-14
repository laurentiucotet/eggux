// EGG UI Testimonial Carousel. Code only (no Figma component yet); family Marketing.
// One customer quote at a time: the quote, then the author (avatar with initials, name, role and
// company). Below: Previous and Next arrows, dots (Carousel Indicator) and a Play / Pause button.
// There is no auto-advance by default; Play starts it (every `interval` ms), and it never runs under
// prefers-reduced-motion, while the pointer is over the carousel, or while focus is inside it.
// Previous and Next wrap around. Carousel is the general slide container; this one is made for
// quotes (one slide, text only) and keeps the author with the quote.
// A11y: a region with aria-roledescription "carousel"; the slide is a labelled group "2 of 4" in a
// polite live region (while it plays automatically the region is off, so it does not interrupt);
// Left / Right arrows move while focus is in the carousel; dots say "Go to slide 3" and mark the
// current one; the quote is a blockquote inside a figure with a figcaption.
import * as React from 'react';
import { Pause, Play } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Avatar } from './avatar';
import { CarouselArrow, CarouselIndicator } from './carousel';

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  initials?: string;
}

export interface TestimonialCarouselProps extends Omit<React.ComponentProps<'section'>, 'title' | 'onChange'> {
  /** Region name. */
  label?: string;
  testimonials: Testimonial[];
  /** Starting slide (0-based). */
  defaultIndex?: number;
  /** Start playing on mount. Off by default. */
  autoPlay?: boolean;
  /** Time per slide in ms while playing. */
  interval?: number;
  onIndexChange?: (index: number) => void;
}

function initialsOf(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase();
}

function TestimonialCarousel({ label = 'Customer stories', testimonials, defaultIndex = 0, autoPlay = false, interval = 6000, onIndexChange, className, ...props }: TestimonialCarouselProps) {
  const count = testimonials.length;
  const [index, setIndex] = React.useState(Math.min(Math.max(defaultIndex, 0), Math.max(count - 1, 0)));
  const [playing, setPlaying] = React.useState(autoPlay);
  const [hold, setHold] = React.useState(false);
  const go = React.useCallback(
    (next: number) => {
      const i = ((next % count) + count) % count;
      setIndex(i);
      onIndexChange?.(i);
    },
    [count, onIndexChange],
  );
  React.useEffect(() => {
    const reduced = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!playing || hold || reduced || count < 2) return;
    const id = window.setTimeout(() => go(index + 1), interval);
    return () => window.clearTimeout(id);
  }, [playing, hold, count, index, interval, go]);

  if (count === 0) return null;
  const t = testimonials[index];
  return (
    <section
      data-slot="testimonial-carousel"
      aria-roledescription="carousel"
      aria-label={label}
      className={cn('flex w-full min-w-0 flex-col gap-6 rounded-xl border border-border bg-card p-6 text-card-foreground', className)}
      onKeyDown={e => {
        if (e.target instanceof HTMLInputElement) return;
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
      }}
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHold(false); }}
      {...props}
    >
      <div aria-live={playing ? 'off' : 'polite'} aria-atomic="true" className="min-w-0">
        <div key={index} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${count}`} data-slot="testimonial-slide">
        <figure className="m-0 flex min-w-0 flex-col gap-5">
          <blockquote className="m-0 text-xl leading-8 font-semibold text-foreground [overflow-wrap:anywhere]">“{t.quote}”</blockquote>
          <figcaption className="flex min-w-0 items-center gap-3">
            <Avatar size="lg" initials={t.initials ?? initialsOf(t.name)} />
            <span className="flex min-w-0 flex-col text-sm leading-5">
              <span className="truncate font-semibold text-foreground">{t.name}</span>
              <span className="truncate text-foreground">{t.role}, {t.company}</span>
            </span>
          </figcaption>
        </figure>
        </div>
      </div>
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CarouselArrow direction="previous" onClick={() => go(index - 1)} disabled={count < 2} />
          <CarouselArrow direction="next" onClick={() => go(index + 1)} disabled={count < 2} />
          <button
            type="button"
            data-slot="testimonial-play"
            aria-label={playing ? 'Pause slides' : 'Play slides'}
            onClick={() => setPlaying(p => !p)}
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-input bg-background text-foreground outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 [&_svg]:size-4"
          >
            {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
          </button>
        </div>
        <CarouselIndicator count={count} index={index} onSelect={go} />
      </div>
    </section>
  );
}

export { TestimonialCarousel };
