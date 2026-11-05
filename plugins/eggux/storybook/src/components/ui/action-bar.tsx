// EGG UI Action Bar. Figma: Action Bar (Button page, "Action Bar / Component").
// Align (end, start, center) x Style (default, sticky-mobile), Show divider, Show leading,
// Show summary, Summary label, Summary value; slots Leading and Actions (Buttons).
// default: fills its parent; optional divider above (16 px gap), Leading on the left (Back, Delete),
// Actions after it, aligned end (Cancel, Save), start or center (primary first). One primary per bar.
// sticky-mobile: the bottom bar of phone screens; background, top border, 16 px sides, 12 px top,
// 32 px bottom (home indicator), optional summary line, Buttons (size xl) share the width.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Separator } from './separator';

export type ActionBarAlign = 'end' | 'start' | 'center';
export type ActionBarStyle = 'default' | 'sticky-mobile';

const justify: Record<ActionBarAlign, string> = { end: 'justify-end', start: 'justify-start', center: 'justify-center' };

export interface ActionBarProps extends React.ComponentProps<'div'> {
  /** Figma Align (default style only): end for forms and steps, start for heroes, center under centered heroes. */
  align?: ActionBarAlign;
  /** Figma Style: default, or sticky-mobile for the bottom bar of phone screens. */
  barStyle?: ActionBarStyle;
  /** Figma Show divider (default style): a line above the bar. */
  showDivider?: boolean;
  /** Figma Leading slot (Show leading): Back, Delete or Remove, away from the primary. */
  leading?: React.ReactNode;
  /** Figma Summary label (sticky-mobile, Show summary): "Total (2 items)". Truncates. */
  summaryLabel?: React.ReactNode;
  /** Figma Summary value (sticky-mobile, Show summary): "€48.00". Never wraps. */
  summaryValue?: React.ReactNode;
  /** Figma Actions slot: secondary and primary Buttons, same size. */
  children?: React.ReactNode;
}

function ActionBar({ align = 'end', barStyle = 'default', showDivider = false, leading, summaryLabel, summaryValue, className, children, ...props }: ActionBarProps) {
  const leadingSlot = leading ? <div data-slot="action-bar-leading" className="flex shrink-0 items-center gap-2">{leading}</div> : null;

  if (barStyle === 'sticky-mobile') {
    const showSummary = summaryLabel != null || summaryValue != null;
    return (
      <div
        data-slot="action-bar"
        data-style="sticky-mobile"
        className={cn('sticky bottom-0 z-40 flex w-full min-w-80 flex-col gap-3 border-t border-border bg-background px-4 pt-3 pb-8', className)}
        {...props}
      >
        {showSummary ? (
          <div data-slot="action-bar-summary" className="flex min-w-0 items-center gap-2">
            <span className="min-w-0 flex-1 truncate text-sm leading-5 text-muted-foreground">{summaryLabel}</span>
            <span className="shrink-0 whitespace-nowrap text-lg leading-7 font-semibold text-foreground">{summaryValue}</span>
          </div>
        ) : null}
        <div className="flex min-w-0 items-center gap-2">
          {leadingSlot}
          {/* The Buttons FILL and share the width equally (grid columns, so borders do not skew them). */}
          <div data-slot="action-bar-actions" className="grid min-w-0 flex-1 auto-cols-fr grid-flow-col items-center gap-2 [&>*]:min-w-0">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-slot="action-bar" data-style="default" data-align={align} className={cn('flex w-full min-w-0 flex-col gap-4', className)} {...props}>
      {showDivider ? <Separator /> : null}
      <div className="flex w-full min-w-0 flex-wrap items-center gap-2">
        {leadingSlot}
        <div data-slot="action-bar-actions" className={cn('flex min-w-0 flex-1 flex-wrap items-center gap-2', justify[align])}>
          {children}
        </div>
      </div>
    </div>
  );
}

export { ActionBar };
