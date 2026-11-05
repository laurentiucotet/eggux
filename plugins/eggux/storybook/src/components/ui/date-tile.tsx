// EGG UI Date Tile. Figma: Date Tile (Card page, "Date Tile / Component"). Size default 56 x 66
// (month 12/16 overline over a 24/32 day) and sm 44 x 58 (day 20/28). A <time> that reads as a full
// date for screen readers ("12 November 2026"); month and day are aria-hidden. Part of Event Card.
import * as React from 'react';
import { cn } from '@/lib/utils';

export type DateTileSize = 'default' | 'sm';

export interface DateTileProps extends Omit<React.ComponentProps<'time'>, 'children'> {
  /** Figma Month: three letters, shown uppercase. */
  month: string;
  /** Figma Day. */
  day: string;
  /** Figma Size. */
  size?: DateTileSize;
  /** `datetime` of the <time> element (an ISO date). */
  dateTime: string;
  /** The full date read by screen readers ("12 November 2026"). */
  label: string;
}

function DateTile({ month, day, size = 'default', dateTime, label, className, ...props }: DateTileProps) {
  const sm = size === 'sm';
  return (
    <time
      data-slot="date-tile"
      data-size={size}
      dateTime={dateTime}
      className={cn(
        'flex shrink-0 flex-col items-center rounded-lg border border-border bg-card px-1 text-center font-semibold whitespace-nowrap',
        sm ? 'w-11 py-1.5' : 'w-14 py-2',
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className="text-xs leading-4 tracking-widest text-muted-foreground uppercase">{month}</span>
      <span aria-hidden="true" className={cn('tracking-tight text-foreground', sm ? 'text-xl leading-7' : 'text-2xl leading-8')}>{day}</span>
      <span className="sr-only">{label}</span>
    </time>
  );
}

export { DateTile };
