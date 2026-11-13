// EGG UI Page Dots. Code only (no Figma component yet). The dots under a pager or a carousel: which
// page of how many. 8 px dots with a 24 x 24 hit area (WCAG 2.2 target size), the current one is a
// wider pill in primary. Each dot is a button named "Page 2 of 5" with aria-current on the current
// one; without `onSelect` the dots are a read-only status (not buttons). Use for 2 to 7 pages; more
// pages need a counter ("3 / 12") instead.
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface PageDotsProps extends Omit<React.ComponentProps<'nav'>, 'onSelect'> {
  /** How many pages. */
  count: number;
  /** The current page, 0-based. */
  current: number;
  /** Makes the dots buttons: called with the page index. */
  onSelect?: (index: number) => void;
  /** Accessible name of the group. Default "Pages". */
  label?: string;
}

function PageDots({ count, current, onSelect, label = 'Pages', className, ...props }: PageDotsProps) {
  const dots = Array.from({ length: count }, (_, i) => i);
  const dot = (i: number) => (
    <span
      aria-hidden="true"
      className={cn('block h-2 rounded-full transition-[width,background-color] duration-[var(--duration-fast)]', i === current ? 'w-6 bg-primary' : 'w-2 bg-muted-foreground/40')}
    />
  );
  return (
    <nav data-slot="page-dots" aria-label={label} className={cn('inline-flex items-center', className)} {...props}>
      <ol className="m-0 flex list-none items-center p-0">
        {dots.map(i => (
          <li key={i} className="flex">
            {onSelect ? (
              <button
                type="button"
                aria-label={`Page ${i + 1} of ${count}`}
                aria-current={i === current ? 'page' : undefined}
                onClick={() => onSelect(i)}
                className="flex h-6 min-w-6 items-center justify-center rounded-full px-0.5 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                {dot(i)}
              </button>
            ) : (
              <span aria-current={i === current ? 'page' : undefined} className="flex h-6 min-w-6 items-center justify-center px-0.5">
                <span className="sr-only">{`Page ${i + 1} of ${count}`}</span>
                {dot(i)}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export { PageDots };
