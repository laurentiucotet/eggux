// EGG UI Bottom Action Bar. Code only (no Figma component yet). The bar stuck to the bottom of a mobile
// screen that holds the one decision of the screen: Continue, Pay, Save. An optional summary on the
// left (a label and a value: "Total", "€248.00") and the buttons on the right, or full width and
// stacked when there is no room. Border on top, safe-area padding inside, so it sits above the home
// indicator. The primary button comes first in the DOM order of the actions and is the only filled
// one. It replaces the Bottom Nav on flows (checkout, forms); never show both. Give the scrolling
// content bottom padding so the last row stays visible.
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BottomActionBarProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  /** Small line above the value ("Total"). */
  summaryLabel?: string;
  /** The value that matters ("€248.00"). Shown with the label on the left. */
  summaryValue?: string;
  /** Stack the buttons full width, one per row (a long label, or two buttons on a narrow phone). */
  stacked?: boolean;
  /** Accessible name of the region. */
  label?: string;
}

function BottomActionBar({ summaryLabel, summaryValue, stacked = false, label = 'Actions', className, children, ...props }: BottomActionBarProps) {
  const hasSummary = Boolean(summaryLabel || summaryValue);
  return (
    <div
      data-slot="bottom-action-bar"
      role="region"
      aria-label={label}
      className={cn('flex w-full flex-col gap-3 border-t border-border bg-background px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] text-foreground', className)}
      {...props}
    >
      <div className={cn('flex gap-3', stacked ? 'flex-col' : 'items-center justify-between')}>
        {hasSummary ? (
          <p className={cn('m-0 flex min-w-0 flex-col', stacked && 'flex-row items-baseline justify-between')}>
            {summaryLabel ? <span className="truncate text-xs leading-4 text-muted-foreground">{summaryLabel}</span> : null}
            {summaryValue ? <span className="truncate text-lg leading-7 font-semibold">{summaryValue}</span> : null}
          </p>
        ) : null}
        <div className={cn('flex gap-2', stacked ? 'flex-col [&>*]:w-full' : hasSummary ? 'shrink-0' : 'w-full [&>*]:flex-1')}>{children}</div>
      </div>
    </div>
  );
}

export { BottomActionBar };
