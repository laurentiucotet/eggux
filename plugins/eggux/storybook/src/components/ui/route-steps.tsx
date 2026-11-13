// EGG UI Route Steps. Code only (no Figma component yet). A turn-by-turn list: an icon for each
// manoeuvre, the instruction, the distance to the next turn, and the current step highlighted
// (`aria-current="step"`, filled icon). The header says "6 steps, 2.4 km, 12 min" and holds the
// Show / Hide steps button (aria-expanded); collapsed, only the current step is left, like the bar
// on a phone while driving. Previous and Next buttons move the current step, so following a route
// never needs a gesture. Done steps are read as "Done". The icon set has no turn arrows yet, so
// turns use the arrows (a slight turn is the arrow turned 45 degrees). Built on Button and Button Icon.
import * as React from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, ChevronDown, ChevronLeft, ChevronRight, MapPin, Play, RefreshCw } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { ButtonIcon } from './button-icon';
import { formatDistance, type DistanceUnit } from './distance-badge';

export type RouteManeuver = 'depart' | 'straight' | 'left' | 'right' | 'slight-left' | 'slight-right' | 'uturn' | 'arrive';

export interface RouteStep {
  id: string;
  /** "Turn left onto Cedar Street". */
  instruction: string;
  /** Metres to the next turn. Leave out for the last step. */
  meters?: number;
  maneuver?: RouteManeuver;
}

export interface RouteStepsProps extends Omit<React.ComponentProps<'div'>, 'children' | 'title'> {
  steps: RouteStep[];
  /** Index of the current step (controlled). */
  current?: number;
  defaultCurrent?: number;
  onCurrentChange?: (index: number) => void;
  /** Whether every step shows (controlled). */
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  unit?: DistanceUnit;
  /** "Walking", "Driving". */
  title?: string;
  /** Total time for the summary: "12 min". */
  duration?: string;
}

function ManeuverIcon({ maneuver }: { maneuver: RouteManeuver }) {
  switch (maneuver) {
    case 'left':
      return <ArrowLeft aria-hidden="true" />;
    case 'right':
      return <ArrowRight aria-hidden="true" />;
    case 'slight-left':
      return <ArrowUp aria-hidden="true" className="-rotate-45" />;
    case 'slight-right':
      return <ArrowUp aria-hidden="true" className="rotate-45" />;
    case 'uturn':
      return <RefreshCw aria-hidden="true" />;
    case 'arrive':
      return <MapPin aria-hidden="true" />;
    case 'depart':
      return <Play aria-hidden="true" />;
    default:
      return <ArrowUp aria-hidden="true" />;
  }
}

function RouteSteps({
  steps,
  current: currentProp,
  defaultCurrent = 0,
  onCurrentChange,
  expanded: expandedProp,
  defaultExpanded = true,
  onExpandedChange,
  unit = 'metric',
  title = 'Walking route',
  duration,
  className,
  ...props
}: RouteStepsProps) {
  const [innerCurrent, setInnerCurrent] = React.useState(defaultCurrent);
  const [innerExpanded, setInnerExpanded] = React.useState(defaultExpanded);
  const listId = React.useId();
  const last = Math.max(0, steps.length - 1);
  const current = Math.min(currentProp ?? innerCurrent, last);
  const expanded = expandedProp ?? innerExpanded;

  const go = (next: number) => {
    const clamped = Math.min(last, Math.max(0, next));
    if (currentProp === undefined) setInnerCurrent(clamped);
    onCurrentChange?.(clamped);
  };
  const toggle = () => {
    if (expandedProp === undefined) setInnerExpanded(!expanded);
    onExpandedChange?.(!expanded);
  };

  const total = steps.reduce((sum, s) => sum + (s.meters ?? 0), 0);
  const summary = [`${steps.length} ${steps.length === 1 ? 'step' : 'steps'}`, formatDistance(total, unit).short, duration].filter(Boolean).join(', ');
  const step = steps[current];

  return (
    <div data-slot="route-steps" className={cn('flex w-full max-w-md min-w-0 flex-col gap-3 rounded-lg border border-border bg-card p-3 text-card-foreground', className)} {...props}>
      <div className="flex min-w-0 items-center gap-2">
        <div className="flex min-w-0 flex-1 flex-col">
          <h3 className="m-0 min-w-0 truncate text-sm leading-5 font-semibold">{title}</h3>
          <p className="m-0 min-w-0 truncate text-xs leading-4 text-muted-foreground">{summary}</p>
        </div>
        <Button type="button" variant="ghost" size="sm" aria-expanded={expanded} aria-controls={listId} onClick={toggle} trailingIcon={<ChevronDown aria-hidden="true" className={cn('transition-transform duration-[var(--duration-fast)] motion-reduce:transition-none', expanded && 'rotate-180')} />}>
          {expanded ? 'Hide steps' : 'Show steps'}
        </Button>
      </div>
      <ol id={listId} className="m-0 flex list-none flex-col gap-1 p-0">
        {steps.map((s, i) => {
          if (!expanded && i !== current) return null;
          const isCurrent = i === current;
          const done = i < current;
          return (
            <li
              key={s.id}
              aria-current={isCurrent ? 'step' : undefined}
              data-state={isCurrent ? 'current' : done ? 'done' : 'next'}
              className={cn('flex min-w-0 items-center gap-3 rounded-md p-2', isCurrent && 'bg-accent')}
            >
              <span aria-hidden="true" className={cn('flex size-8 shrink-0 items-center justify-center rounded-full [&_svg]:size-4', isCurrent ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
                <ManeuverIcon maneuver={s.maneuver ?? (i === 0 ? 'depart' : i === last ? 'arrive' : 'straight')} />
              </span>
              <span className={cn('min-w-0 flex-1 text-sm leading-5', isCurrent ? 'font-medium text-foreground' : done ? 'text-muted-foreground line-through' : 'text-foreground')}>
                {isCurrent ? <span className="sr-only">Current step: </span> : null}
                {done ? <span className="sr-only">Done: </span> : null}
                {s.instruction}
              </span>
              {s.meters !== undefined ? <span className={cn('shrink-0 text-xs tabular-nums', isCurrent ? 'text-foreground' : 'text-muted-foreground')}>{formatDistance(s.meters, unit).short}</span> : null}
            </li>
          );
        })}
      </ol>
      <div className="flex min-w-0 items-center justify-between gap-2">
        <ButtonIcon variant="outline" size="sm" icon={<ChevronLeft />} label="Previous step" disabled={current === 0} onClick={() => go(current - 1)} />
        <p role="status" className="m-0 min-w-0 truncate text-xs text-muted-foreground">
          Step {current + 1} of {steps.length}
          <span className="sr-only">: {step?.instruction}</span>
        </p>
        <ButtonIcon variant="outline" size="sm" icon={<ChevronRight />} label="Next step" disabled={current >= last} onClick={() => go(current + 1)} />
      </div>
    </div>
  );
}

export { RouteSteps };
