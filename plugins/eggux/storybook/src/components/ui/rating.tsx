// EGG UI Rating, Rating Input, Review Item and Rating Summary. Figma: Rating page: Rating (149:159),
// Review Item (443:1154), Rating Summary (443:1203).
// Rating Style=default: five stars, filled in warning, empty as an input-colored outline; Size sm
// (14 stars, 2 apart, ui/caption score), default (20, 4 apart, ui/label score), lg (32, 6 apart,
// body/large score, body/small count). Show value adds the score, Show count "(128)" in muted.
// Partial stars only for averages. Style=badge: one star and the score in a soft amber badge
// (display only). Rating Input: a radio group of five stars; arrows change the value, hover
// previews it. Review Item: avatar, name, Verified Badge, date, Rating sm, title, text (4 lines with
// Show more) and Helpful Yes / No. Rating Summary: the average (display, 48) with Rating sm and the
// count; five rows (stars, bar, count) that filter the list.
// A11y: display ratings are one element named "Rated 4.7 out of 5"; the input is a radiogroup with
// "4 of 5 stars"; Helpful buttons use aria-pressed with the count in the name; summary rows are
// buttons "5 stars, 92 reviews" with aria-pressed; bars are hidden.
import * as React from 'react';
import { ThumbsDown, ThumbsUp } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Avatar } from './avatar';
import { Badge } from './badge';
import { Button } from './button';

const STAR = 'M12 2.5l2.94 5.96 6.56.95-4.75 4.63 1.12 6.54L12 17.5l-5.87 3.08 1.12-6.54L2.5 9.41l6.56-.95L12 2.5z';

/** One star; `fill` 0 to 1 draws a partial star from the left. */
function Star({ fill, className }: { fill: number; className?: string }) {
  const id = React.useId();
  const f = Math.max(0, Math.min(1, fill));
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn('shrink-0', className)}>
      <defs>
        <clipPath id={id}><rect x="0" y="0" width={24 * f} height="24" /></clipPath>
      </defs>
      <path d={STAR} fill="none" strokeWidth="1.5" strokeLinejoin="round" className="stroke-[var(--input)]" />
      {f > 0 ? <path d={STAR} clipPath={`url(#${id})`} strokeWidth="1.5" strokeLinejoin="round" className="fill-warning stroke-warning" /> : null}
    </svg>
  );
}

export type RatingSize = 'sm' | 'default' | 'lg';
const starSize: Record<RatingSize, string> = { sm: 'size-3.5', default: 'size-5', lg: 'size-8' };
const starGap: Record<RatingSize, string> = { sm: 'gap-0.5', default: 'gap-1', lg: 'gap-1.5' };

export interface RatingProps extends Omit<React.ComponentProps<'span'>, 'children'> {
  /** 0 to 5; decimals draw partial stars. */
  value: number;
  size?: RatingSize;
  ratingStyle?: 'default' | 'badge';
  /** Figma Show value: the score with one decimal. */
  showValue?: boolean;
  /** Figma Show count: "(128)". */
  count?: number;
  countLabel?: (n: number) => string;
}

const one = (v: number) => (Math.round(v * 10) / 10).toFixed(1);

function Rating({ value, size = 'default', ratingStyle = 'default', showValue = false, count, countLabel = n => `${n} reviews`, className, ...props }: RatingProps) {
  const name = `Rated ${one(value)} out of 5${count != null ? `, ${countLabel(count)}` : ''}`;
  if (ratingStyle === 'badge') {
    const sm = size === 'sm';
    return (
      <span
        data-slot="rating"
        data-style="badge"
        role="img"
        aria-label={name}
        className={cn('inline-flex shrink-0 items-center gap-1 rounded-md bg-[var(--badge-soft-warning-bg)] text-[var(--badge-soft-warning-fg)]', sm ? 'px-1.5 py-0.5' : 'px-2 py-1', className)}
        {...props}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className={cn('shrink-0 fill-current', sm ? 'size-3' : 'size-3.5')}><path d={STAR} /></svg>
        <span className={cn('font-medium', sm ? 'text-xs leading-4' : 'text-sm leading-5')}>{one(value)}</span>
        {count != null ? <span className="text-xs leading-4">({count})</span> : null}
      </span>
    );
  }
  return (
    <span data-slot="rating" data-size={size} role="img" aria-label={name} className={cn('inline-flex shrink-0 items-center', starGap[size], className)} {...props}>
      {[0, 1, 2, 3, 4].map(i => <Star key={i} fill={value - i} className={starSize[size]} />)}
      {showValue ? (
        <span className={cn('ml-0.5 text-foreground', size === 'sm' ? 'text-xs leading-4' : size === 'lg' ? 'text-lg leading-7 font-semibold' : 'text-sm leading-5 font-medium')}>{one(value)}</span>
      ) : null}
      {count != null ? <span className={cn('text-muted-foreground', size === 'lg' ? 'text-sm leading-5' : 'text-xs leading-4')}>({count})</span> : null}
    </span>
  );
}

export interface RatingInputProps extends Omit<React.ComponentProps<'div'>, 'onChange' | 'defaultValue'> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  size?: RatingSize;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  optionLabel?: (n: number) => string;
}

function RatingInput({ value: valueProp, defaultValue = 0, onValueChange, size = 'lg', optionLabel = n => `${n} of 5 stars`, className, ...props }: RatingInputProps) {
  const [inner, setInner] = React.useState(defaultValue);
  const value = valueProp ?? inner;
  const [hover, setHover] = React.useState<number | null>(null);
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const set = (v: number) => {
    const n = Math.max(1, Math.min(5, v));
    setInner(n);
    onValueChange?.(n);
    refs.current[n - 1]?.focus();
  };
  const shown = hover ?? value;
  return (
    <div data-slot="rating-input" role="radiogroup" className={cn('inline-flex items-center', starGap[size], className)} onMouseLeave={() => setHover(null)} {...props}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          ref={el => { refs.current[n - 1] = el; }}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={optionLabel(n)}
          tabIndex={value === n || (value === 0 && n === 1) ? 0 : -1}
          onClick={() => set(n)}
          onMouseEnter={() => setHover(n)}
          onKeyDown={e => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); set((value || 0) + 1); }
            if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); set((value || 2) - 1); }
          }}
          className="flex cursor-pointer rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <Star fill={shown >= n ? 1 : 0} className={starSize[size]} />
        </button>
      ))}
    </div>
  );
}

export interface ReviewItemProps extends Omit<React.ComponentProps<'article'>, 'title'> {
  name: string;
  initials?: string;
  avatar?: string;
  verified?: boolean;
  /** "3 Oct 2026". */
  date: string;
  rating: number;
  title: string;
  text: string;
  helpful?: { yes: number; no: number; vote?: 'yes' | 'no' | null; onVote?: (v: 'yes' | 'no' | null) => void };
  headingLevel?: 3 | 4;
}

function ReviewItem({ name, initials, avatar, verified = false, date, rating, title, text, helpful, headingLevel = 3, className, ...props }: ReviewItemProps) {
  const Heading = `h${headingLevel}` as 'h3';
  const [expanded, setExpanded] = React.useState(false);
  const [clamped, setClamped] = React.useState(false);
  const textRef = React.useRef<HTMLParagraphElement>(null);
  React.useLayoutEffect(() => {
    const el = textRef.current;
    if (el && !expanded) setClamped(el.scrollHeight > el.clientHeight + 1);
  }, [text, expanded]);
  const vote = helpful?.vote ?? null;
  return (
    <article data-slot="review-item" className={cn('flex w-full min-w-0 flex-col items-start gap-2 border-b border-border py-4', className)} {...props}>
      <div className="flex w-full min-w-0 items-center gap-2">
        <Avatar size="sm" initials={initials} src={avatar} />
        <span title={name} className="min-w-0 flex-1 truncate text-sm leading-5 font-medium text-foreground">{name}</span>
        {verified ? <Badge variant="soft-success" className="max-w-32">Verified buyer</Badge> : null}
        <span className="max-w-32 shrink-0 truncate text-xs leading-4 text-muted-foreground">{date}</span>
      </div>
      <Rating value={rating} size="sm" />
      <Heading className="m-0 line-clamp-2 w-full text-sm leading-5 font-medium text-foreground">{title}</Heading>
      <p ref={textRef} className={cn('m-0 w-full text-sm leading-5 text-foreground [overflow-wrap:anywhere]', !expanded && 'line-clamp-4')}>{text}</p>
      {clamped || expanded ? (
        <Button variant="link" size="sm" className="h-auto px-0" aria-expanded={expanded} onClick={() => setExpanded(e => !e)}>{expanded ? 'Show less' : 'Show more'}</Button>
      ) : null}
      {helpful ? (
        <div className="flex items-center gap-2">
          <span className="text-xs leading-4 text-muted-foreground">Helpful?</span>
          <Button variant="ghost" size="sm" aria-pressed={vote === 'yes'} aria-label={`Yes, helpful, ${helpful.yes + (vote === 'yes' ? 1 : 0)} votes`} onClick={() => helpful.onVote?.(vote === 'yes' ? null : 'yes')}>
            <ThumbsUp aria-hidden="true" />{helpful.yes + (vote === 'yes' ? 1 : 0)}
          </Button>
          <Button variant="ghost" size="sm" aria-pressed={vote === 'no'} aria-label={`Not helpful, ${helpful.no + (vote === 'no' ? 1 : 0)} votes`} onClick={() => helpful.onVote?.(vote === 'no' ? null : 'no')}>
            <ThumbsDown aria-hidden="true" />{helpful.no + (vote === 'no' ? 1 : 0)}
          </Button>
        </div>
      ) : null}
    </article>
  );
}

export interface RatingSummaryProps extends Omit<React.ComponentProps<'div'>, 'onChange'> {
  /** Counts for 5, 4, 3, 2, 1 stars. */
  counts: [number, number, number, number, number];
  /** Pressed row (stars), or null. */
  filter?: number | null;
  onFilterChange?: (stars: number | null) => void;
  noun?: string;
}

function RatingSummary({ counts, filter = null, onFilterChange, noun = 'reviews', className, ...props }: RatingSummaryProps) {
  const total = counts.reduce((a, b) => a + b, 0);
  const average = total ? counts.reduce((sum, c, i) => sum + c * (5 - i), 0) / total : 0;
  return (
    <div data-slot="rating-summary" className={cn('flex w-full min-w-0 flex-wrap items-start gap-x-8 gap-y-4', className)} {...props}>
      <div className="flex max-w-40 shrink-0 flex-col items-start gap-1">
        {total >= 5 ? (
          <>
            <span aria-hidden="true" className="text-5xl leading-12 font-extrabold tracking-tight text-foreground">{one(average)}</span>
            <Rating value={average} size="sm" count={undefined} aria-label={`${one(average)} out of 5, ${total} ${noun}`} />
          </>
        ) : null}
        <span className="max-w-40 truncate text-xs leading-4 text-muted-foreground">{total} {noun}</span>
      </div>
      {total >= 5 ? (
        <div className="flex min-w-48 flex-1 flex-col gap-1.5">
          {counts.map((c, i) => {
            const stars = 5 - i;
            const pressed = filter === stars;
            return (
              <button
                key={stars}
                type="button"
                aria-pressed={pressed}
                onClick={() => onFilterChange?.(pressed ? null : stars)}
                className={cn('flex w-full cursor-pointer items-center gap-2 rounded-sm text-xs leading-4 text-muted-foreground outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50', pressed && 'font-medium text-foreground')}
              >
                <span>{stars}<span className="sr-only"> stars,</span></span>
                <span aria-hidden="true" className="relative h-2 min-w-px flex-1 overflow-hidden rounded-full bg-muted">
                  <span className="absolute inset-y-0 left-0 rounded-full bg-warning" style={{ width: `${(c / total) * 100}%` }} />
                </span>
                <span className="w-6 text-right tabular-nums">{c}<span className="sr-only"> {noun}</span></span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export { Rating, RatingInput, RatingSummary, ReviewItem };
