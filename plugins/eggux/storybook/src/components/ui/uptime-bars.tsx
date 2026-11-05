// EGG UI Uptime Bars + Uptime Day. Figma: Uptime Bars / Component (COMPONENTS / Alert page, 555:4640).
// 90 Uptime Day bars (State: operational, degraded, outage, maintenance, no-data), oldest left, with
// an optional caption row (Show labels). Each day is a list item with a text label ("3 Oct 2026:
// degraded"); days with an incident are links, reachable by keyboard, and show a tooltip on hover/focus.
import * as React from 'react';
import { Tooltip } from 'radix-ui';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export type UptimeState = 'operational' | 'degraded' | 'outage' | 'maintenance' | 'no-data';

const stateText: Record<UptimeState, string> = {
  operational: 'operational',
  degraded: 'degraded',
  outage: 'outage',
  maintenance: 'maintenance',
  'no-data': 'no data',
};

const dayVariants = cva('block h-7 w-full min-w-px rounded-sm', {
  variants: {
    state: {
      operational: 'bg-success',
      degraded: 'bg-warning',
      outage: 'bg-destructive',
      maintenance: 'bg-info',
      'no-data': 'bg-input',
    },
  },
  defaultVariants: { state: 'operational' },
});

export interface UptimeDayProps extends Omit<React.ComponentProps<'li'>, 'children'> {
  /** Figma State. */
  state?: UptimeState;
  /** Date shown in the tooltip and read by screen readers, e.g. "3 Oct 2026". */
  date: string;
  /** Day with an incident: link target and title ("Elevated API errors"). */
  incident?: { title: string; href: string };
}

function UptimeDay({ className, state = 'operational', date, incident, ...props }: UptimeDayProps) {
  const label = `${date}: ${stateText[state]}`;
  const tip = incident ? `${label}. ${incident.title}` : label;
  const bar = <span aria-hidden="true" className={dayVariants({ state })} />;
  return (
    <li data-slot="uptime-day" data-state={state} className={cn('flex min-w-px flex-1', className)} {...props}>
      <Tooltip.Provider delayDuration={100}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          {incident ? (
            <a
              href={incident.href}
              className="flex w-full rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              {bar}
              <span className="sr-only">{tip}</span>
            </a>
          ) : (
            <span className="flex w-full">
              {bar}
              <span className="sr-only">{label}</span>
            </span>
          )}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            sideOffset={6}
            className="z-50 max-w-64 rounded-md bg-foreground px-2 py-1 text-xs text-background"
          >
            {tip}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
      </Tooltip.Provider>
    </li>
  );
}

export interface UptimeBarsProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** The days, oldest first. Figma uses 90 on every row of a page. */
  days: Array<{ date: string; state?: UptimeState; incident?: { title: string; href: string } }>;
  /** Figma Show labels. */
  showLabels?: boolean;
  /** Figma Start label. */
  startLabel?: string;
  /** Figma End label. */
  endLabel?: string;
  /** Accessible name of the list. */
  label?: string;
}

function UptimeBars({ className, days, showLabels = true, startLabel = '90 days ago', endLabel = 'Today', label = 'Uptime, last 90 days', ...props }: UptimeBarsProps) {
  return (
    <div data-slot="uptime-bars" className={cn('flex w-full min-w-0 flex-col gap-3', className)} {...props}>
      {/* Each day has its own TooltipProvider so Uptime Day also works alone. */}
        <ul aria-label={label} className="m-0 flex list-none gap-0.5 overflow-hidden p-0">
          {days.map(d => (
            <UptimeDay key={d.date} date={d.date} state={d.state} incident={d.incident} />
          ))}
        </ul>
      {showLabels && (
        <div aria-hidden="true" className="flex gap-2 overflow-hidden whitespace-nowrap text-xs text-muted-foreground">
          <span className="min-w-0 flex-1 truncate">{startLabel}</span>
          <span className="max-w-24 shrink-0 truncate text-right">{endLabel}</span>
        </div>
      )}
    </div>
  );
}

export { UptimeBars, UptimeDay, dayVariants as uptimeDayVariants };
