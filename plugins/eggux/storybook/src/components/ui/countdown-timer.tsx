// EGG UI Countdown Timer. Code only (no Figma component yet). Time left until a target as blocks:
// days, hours, minutes and seconds (the day block hides when `showDays` is off). The blocks are
// visual only (aria-hidden): screen readers get one polite sentence ("2 days 3 hours 4 minutes
// left") that changes only when the minute changes, so a ticking second never talks. Pass `now` to
// freeze the clock (tests, previews); without it the timer reads the real time every second. When
// the target is reached the blocks are replaced by the finished message and `onComplete` runs once.
// Numbers are tabular so the blocks never jitter; there is no flip animation, so reduced motion
// needs nothing extra.
import * as React from 'react';
import { CircleCheck } from '@/components/icons';
import { cn } from '@/lib/utils';

export type CountdownSize = 'sm' | 'default' | 'lg';

export interface CountdownTimerProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** The moment the countdown ends. */
  target: Date | string | number;
  /** The current time. When given the clock is frozen at this moment; otherwise the real time. */
  now?: Date | string | number;
  /** What is counted down to, for the accessible name: "Time left until the Acme spring sale". */
  label: string;
  /** Figma-style size: sm 40 px blocks, default 56, lg 72. */
  size?: CountdownSize;
  /** Show the days block. Off: hours keep counting past 24. Default true. */
  showDays?: boolean;
  /** Show the seconds block. Default true. */
  showSeconds?: boolean;
  /** Text shown when the target is reached. */
  finishedMessage?: React.ReactNode;
  /** Called once when the target is reached. */
  onComplete?: () => void;
  /** Texts translated by the app. */
  labels?: { days?: string; hours?: string; minutes?: string; seconds?: string };
}

const toMs = (v: Date | string | number) => (v instanceof Date ? v.getTime() : new Date(v).getTime());

const blockSize: Record<CountdownSize, { box: string; digits: string; unit: string }> = {
  sm: { box: 'min-w-10 px-2 py-1', digits: 'text-base leading-6', unit: 'text-xs leading-4' },
  default: { box: 'min-w-14 px-2.5 py-2', digits: 'text-2xl leading-8', unit: 'text-xs leading-4' },
  lg: { box: 'min-w-18 px-3 py-3', digits: 'text-4xl leading-10', unit: 'text-sm leading-5' },
};

function plural(n: number, one: string) {
  return `${n} ${n === 1 ? one : `${one}s`}`;
}

function CountdownTimer({
  target,
  now,
  label,
  size = 'default',
  showDays = true,
  showSeconds = true,
  finishedMessage = 'The countdown has ended',
  onComplete,
  labels,
  className,
  ...props
}: CountdownTimerProps) {
  const t = { days: 'Days', hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds', ...labels };
  const frozen = now !== undefined;
  const [tick, setTick] = React.useState(() => (frozen ? toMs(now) : Date.now()));
  const current = frozen ? toMs(now) : tick;
  const end = toMs(target);

  React.useEffect(() => {
    if (frozen) return;
    setTick(Date.now());
    const id = window.setInterval(() => setTick(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [frozen]);

  const remaining = Math.max(0, Math.ceil((end - current) / 1000));
  const finished = Number.isFinite(end) && remaining === 0;

  const completed = React.useRef(false);
  React.useEffect(() => {
    if (finished && !completed.current) {
      completed.current = true;
      onComplete?.();
    }
    if (!finished) completed.current = false;
  }, [finished, onComplete]);

  const days = Math.floor(remaining / 86400);
  const hours = showDays ? Math.floor((remaining % 86400) / 3600) : Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;

  // The spoken sentence has no seconds: it changes once a minute.
  const spoken = [showDays && days ? plural(days, 'day') : '', hours || (showDays && days) ? plural(hours, 'hour') : '', plural(minutes, 'minute')].filter(Boolean).join(' ');
  const sizes = blockSize[size];

  const units = [
    ...(showDays ? [{ key: 'days', value: days, unit: t.days }] : []),
    { key: 'hours', value: hours, unit: t.hours },
    { key: 'minutes', value: minutes, unit: t.minutes },
    ...(showSeconds ? [{ key: 'seconds', value: seconds, unit: t.seconds }] : []),
  ];

  return (
    <div data-slot="countdown-timer" data-state={finished ? 'finished' : 'running'} role="group" aria-label={label} className={cn('min-w-0', className)} {...props}>
      {finished ? (
        <p role="status" className="m-0 flex min-w-0 items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2 text-sm leading-5 font-medium text-foreground">
          <CircleCheck aria-hidden="true" className="size-4 shrink-0" />
          <span className="min-w-0 truncate">{finishedMessage}</span>
        </p>
      ) : (
        <>
          <p role="status" aria-live="polite" className="sr-only">{`${spoken} left`}</p>
          <div aria-hidden="true" className="flex min-w-0 flex-wrap items-stretch gap-2">
            {units.map(u => (
              <div key={u.key} data-unit={u.key} className={cn('flex min-w-0 flex-1 flex-col items-center rounded-lg border border-border bg-card text-card-foreground', sizes.box)}>
                <span className={cn('font-semibold tabular-nums', sizes.digits)}>{String(u.value).padStart(2, '0')}</span>
                <span className={cn('max-w-full truncate text-muted-foreground', sizes.unit)}>{u.unit}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export { CountdownTimer };
