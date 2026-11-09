// EGG UI Badge List. Figma: Badge List (Badge page, "Badge List / Component", 406:2576).
// A few tags on one line with "+N" for the rest. Tags: outline Badges (or a status variant when it
// means something), 6 px apart, wrapping when the row is narrow; the "+N" is a secondary Badge that
// opens the full list in a Popover. Show 2-4, labels of one or two words.
// A11y: the tags are a list; "+N" is a button named "+N more" that opens the remaining tags.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Badge, badgeVariants, type BadgeProps } from './badge';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

export interface BadgeListItem {
  label: string;
  variant?: BadgeProps['variant'];
}

export interface BadgeListProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  items: (string | BadgeListItem)[];
  /** How many tags show before "+N". */
  max?: number;
  /** The list's name, e.g. "Tags". */
  label?: string;
  /** Read after "+N" by screen readers: "+2 more". */
  moreLabel?: string;
}

const toItem = (i: string | BadgeListItem): BadgeListItem => (typeof i === 'string' ? { label: i } : i);

function BadgeList({ items, max = 3, label = 'Tags', moreLabel = 'more', className, ...props }: BadgeListProps) {
  const all = items.map(toItem);
  const shown = all.slice(0, max);
  const rest = all.slice(max);
  return (
    <div data-slot="badge-list" className={cn('flex min-w-0 items-center gap-1.5', className)} {...props}>
      <ul aria-label={label} className="m-0 flex min-w-0 flex-1 list-none flex-wrap items-center gap-1.5 p-0">
        {shown.map((item, i) => (
          <li key={i} className="flex min-w-0">
            <Badge variant={item.variant ?? 'outline'} title={item.label}>{item.label}</Badge>
          </li>
        ))}
      </ul>
      {rest.length ? (
        <Popover>
          <PopoverTrigger asChild>
            <button type="button" className={cn(badgeVariants({ variant: 'secondary' }), 'cursor-pointer outline-none hover:bg-secondary/80 focus-visible:ring-[3px] focus-visible:ring-ring/50')}>
              +{rest.length}
              <span className="sr-only"> {moreLabel}</span>
            </button>
          </PopoverTrigger>
          <PopoverContent aria-label={label} className="w-auto max-w-72 p-2">
            <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
              {rest.map((item, i) => (
                <li key={i} className="flex min-w-0">
                  <Badge variant={item.variant ?? 'outline'} title={item.label}>{item.label}</Badge>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
      ) : null}
    </div>
  );
}

export { BadgeList };
