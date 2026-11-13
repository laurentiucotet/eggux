// EGG UI Rating Breakdown. Code only (no Figma component yet); Data Display family.
// The summary above a list of reviews: the average, the number of reviews and one row per star level
// (5 to 1) with a bar, the count and its share. Rows are plain text rows, or buttons that filter the
// reviews by that level (aria-pressed) when onSelect is given. Bars are drawn in the chart/1 token on
// a muted track; every number is also text, so the bars never carry meaning alone.
import * as React from 'react';
import { Star } from '@/components/icons';
import { cn } from '@/lib/utils';

export interface RatingBreakdownProps extends Omit<React.ComponentProps<'section'>, 'title' | 'onSelect'> {
  /** Reviews per level, from 5 stars down to 1: [62, 20, 8, 4, 6]. */
  counts: [number, number, number, number, number];
  /** Shown average; computed from the counts when left out. */
  average?: number;
  /** Currently selected level (1 to 5) when rows filter. */
  selected?: number | null;
  /** Rows become buttons that filter by level; pressing the selected level again clears it (null). */
  onSelect?: (level: number | null) => void;
  /** Heading name for the section. */
  title?: string;
}

function RatingBreakdown({ counts, average, selected = null, onSelect, title = 'Customer reviews', className, ...props }: RatingBreakdownProps) {
  const id = React.useId();
  const total = counts.reduce((a, b) => a + b, 0);
  const avg = average ?? (total > 0 ? counts.reduce((sum, n, i) => sum + n * (5 - i), 0) / total : 0);
  const share = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);
  const max = Math.max(1, ...counts);
  return (
    <section data-slot="rating-breakdown" aria-labelledby={`${id}-title`} className={cn('flex w-full min-w-0 flex-col gap-3', className)} {...props}>
      <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-0.5">
        <h3 id={`${id}-title`} className="sr-only">{title}</h3>
        <p className="m-0 flex items-center gap-1 text-3xl leading-9 font-semibold tracking-[-0.4px] text-foreground">
          {avg.toFixed(1)}
          <Star aria-hidden="true" className="size-5 shrink-0 fill-current" />
        </p>
        <p className="m-0 min-w-0 text-sm leading-5 text-muted-foreground">
          <span className="sr-only">Average rating </span>out of 5 from {total.toLocaleString('en')} {total === 1 ? 'review' : 'reviews'}
        </p>
      </div>
      <ul className="m-0 flex list-none flex-col gap-1 p-0">
        {counts.map((n, i) => {
          const level = 5 - i;
          const text = `${level} ${level === 1 ? 'star' : 'stars'}`;
          const row = (
            <>
              <span className="w-12 shrink-0 text-left whitespace-nowrap text-foreground">{text}</span>
              <span aria-hidden="true" className="relative h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
                <span className="absolute inset-y-0 left-0 rounded-full motion-safe:transition-[width]" style={{ width: `${(n / max) * 100}%`, background: 'var(--chart-1)' }} />
              </span>
              <span className={cn("min-w-20 shrink-0 text-right whitespace-nowrap", selected === level ? "text-foreground" : "text-muted-foreground")}>
                <span className="font-medium text-foreground">{n.toLocaleString('en')}</span>
                <span className="sr-only"> {n === 1 ? 'review' : 'reviews'}</span> ({share(n)}%)
              </span>
            </>
          );
          return (
            <li key={level} data-slot="rating-row" data-level={level}>
              {onSelect ? (
                <button
                  type="button"
                  aria-pressed={selected === level}
                  onClick={() => onSelect(selected === level ? null : level)}
                  className={cn(
                    'flex min-h-8 w-full min-w-0 items-center gap-2 rounded-md px-2 text-xs leading-4 outline-none hover:bg-accent focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]',
                    selected === level && 'bg-accent font-medium',
                  )}
                >
                  {row}
                </button>
              ) : (
                <div className="flex min-h-6 w-full min-w-0 items-center gap-2 px-2 text-xs leading-4">{row}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export { RatingBreakdown };
