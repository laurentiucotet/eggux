// EGG UI Metrics page: Trend Indicator (436:813), Metric Strip and Metric Strip Item (436:831,
// 504:76821), Usage Meter (436:898), Countdown (751:2218), Leaderboard Row (436:928).
// Trend Indicator: arrow, signed value, comparison caption. Trend (up, down, flat) sets the arrow;
// Tone (positive, negative, neutral) says if it is good, so rising costs are up and negative.
// Style text: 16 icon and the value (ui/label) in success, destructive or muted, then the caption;
// Style badge: a soft pill Badge (soft-success, soft-destructive, soft-neutral) with a 12 icon.
// Metric Strip: 3-5 figures in a row, 16 padding, a bottom border; items flex 1, min 128, 24 / 4
// padding, label (body/small muted), value (heading/h3), trend; a 1 px divider before each item
// after the first. A <dl>: each item is a div with dt (label) and dd (value, trend).
// Usage Meter: label (ui/label) and usage ("6 of 10", max 160) above the Progress, a hint below.
// Level normal (muted), near from 80% (warning bar), over above 100% (error bar, usage and hint in
// destructive). Countdown: days, hours, min (sec in the last hour); default (64 muted tiles),
// boxed (76 card tiles, border, shadow xs, 30 px digits), inline (no tiles, muted colons).
// Screen readers get the end time, not the ticking digits. Leaderboard Row: rank (20, right),
// 24 avatar, name, value (max 88); State current on muted for the viewer's own row.
import * as React from 'react';
import { Minus, TrendingDown, TrendingUp } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Avatar } from './avatar';
import { badgeVariants, type BadgeProps } from './badge';
import { Progress } from './progress';

/* Trend Indicator */

export type TrendDirection = 'up' | 'down' | 'flat';
export type TrendTone = 'positive' | 'negative' | 'neutral';

const trendIcon = { up: TrendingUp, down: TrendingDown, flat: Minus } as const;
const defaultTone: Record<TrendDirection, TrendTone> = { up: 'positive', down: 'negative', flat: 'neutral' };
const toneText: Record<TrendTone, string> = { positive: 'text-success', negative: 'text-destructive', neutral: 'text-muted-foreground' };
const toneBadge: Record<TrendTone, NonNullable<BadgeProps['variant']>> = { positive: 'soft-success', negative: 'soft-destructive', neutral: 'soft-neutral' };

export interface TrendIndicatorProps extends React.ComponentProps<'span'> {
  trend?: TrendDirection;
  /** Good, bad or neither. Defaults follow Trend (up positive, down negative, flat neutral). */
  tone?: TrendTone;
  /** Signed value: "+12.4%", "−8.0%", "+3 days", "0". */
  value: string;
  /** What it is compared to ("vs last month"); empty hides it. */
  comparison?: string;
  variant?: 'text' | 'badge';
}

function TrendIndicator({ trend = 'up', tone, value, comparison = 'vs last month', variant = 'text', className, ...props }: TrendIndicatorProps) {
  const t = tone ?? defaultTone[trend];
  const Icon = trendIcon[trend];
  return (
    <span data-slot="trend-indicator" data-trend={trend} data-tone={t} className={cn('inline-flex flex-wrap items-center gap-x-1 gap-y-0.5', className)} {...props}>
      {variant === 'badge' ? (
        <span className={cn(badgeVariants({ variant: toneBadge[t], shape: 'pill' }), 'max-w-64 gap-1')}>
          <Icon aria-hidden="true" />
          <span className="min-w-0 truncate">{value}</span>
        </span>
      ) : (
        <span className={cn('inline-flex items-center gap-1 text-sm leading-5 font-medium whitespace-nowrap', toneText[t])}>
          <Icon aria-hidden="true" className="size-4 shrink-0" />
          {value}
        </span>
      )}
      {comparison ? <span className="text-xs leading-4 whitespace-nowrap text-muted-foreground">{comparison}</span> : null}
    </span>
  );
}

/* Metric Strip */

function MetricStrip({ className, ...props }: React.ComponentProps<'dl'>) {
  return <dl data-slot="metric-strip" className={cn('m-0 flex w-full flex-wrap items-stretch border-b border-border py-4', className)} {...props} />;
}

export interface MetricStripItemProps extends React.ComponentProps<'div'> {
  label: React.ReactNode;
  value: React.ReactNode;
  /** A Trend Indicator. */
  trend?: React.ReactNode;
}

function MetricStripItem({ label, value, trend, className, ...props }: MetricStripItemProps) {
  return (
    <div
      data-slot="metric-strip-item"
      className={cn(
        'relative flex min-w-32 flex-1 flex-col gap-1 px-6 py-1',
        'not-first:before:absolute not-first:before:inset-y-0 not-first:before:left-0 not-first:before:w-px not-first:before:bg-border',
        className,
      )}
      {...props}
    >
      <dt className="text-sm leading-5 text-muted-foreground">{label}</dt>
      <dd className="m-0 text-2xl leading-8 font-semibold tracking-[-0.4px] text-foreground">{value}</dd>
      {trend ? <dd className="m-0 flex">{trend}</dd> : null}
    </div>
  );
}

/* Usage Meter */

export type UsageLevel = 'normal' | 'near' | 'over';

export interface UsageMeterProps extends React.ComponentProps<'div'> {
  label: string;
  used: number;
  limit: number;
  /** Usage text; defaults to "6 of 10" (with the unit: "6 of 10 GB"). */
  usage?: string;
  /** Unit after the default usage text: "GB", "seats". */
  unit?: string;
  hint?: React.ReactNode;
  /** Defaults from the share: near from 80%, over above 100%. */
  level?: UsageLevel;
  /** No limit: no bar, the text "Unlimited" . */
  unlimited?: boolean;
  /** Say the state in words next to the value ("80 percent used, near the limit"). Default on. */
  showState?: boolean;
}

function UsageMeter({ label, used, limit, usage, unit, hint, level, unlimited = false, showState = true, className, ...props }: UsageMeterProps) {
  const id = React.useId();
  const ratio = limit > 0 ? used / limit : 0;
  const lvl: UsageLevel = unlimited ? 'normal' : (level ?? (ratio > 1 ? 'over' : ratio >= 0.8 ? 'near' : 'normal'));
  const suffix = unit ? ` ${unit}` : '';
  const text = unlimited ? (usage ?? 'Unlimited') : (usage ?? `${used} of ${limit}${suffix}`);
  const over = lvl === 'over';
  const state = unlimited || !showState ? '' : over ? 'Over the limit' : lvl === 'near' ? `${Math.min(100, Math.round(ratio * 100))} percent used, near the limit` : '';
  return (
    <div data-slot="usage-meter" data-level={lvl} data-unlimited={unlimited || undefined} className={cn('flex w-full min-w-0 flex-col gap-2', className)} {...props}>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm leading-5">
        <span id={id} className="min-w-[120px] flex-1 truncate font-medium text-foreground">{label}</span>
        <span className="flex min-w-0 shrink-0 flex-wrap items-center justify-end gap-x-2">
          <span className={cn('max-w-40 shrink-0 truncate', over ? 'text-destructive' : 'text-muted-foreground')}>{text}</span>
          {state ? <span data-slot="usage-meter-state" className={cn('text-xs leading-4 font-medium', over ? 'text-destructive' : 'text-foreground')}>{state}</span> : null}
        </span>
      </div>
      {unlimited ? null : (
        <Progress
          value={Math.min(100, Math.round(ratio * 100))}
          tone={over ? 'error' : lvl === 'near' ? 'warning' : 'default'}
          aria-labelledby={id}
          getValueLabel={() => text}
        />
      )}
      {hint ? <p className={cn('m-0 text-xs leading-4', over ? 'text-destructive' : 'text-muted-foreground')}>{hint}</p> : null}
    </div>
  );
}

/* Countdown */

export type CountdownVariant = 'default' | 'boxed' | 'inline';

export interface CountdownProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** The deadline. */
  to: Date | string | number;
  /** The end time in words for screen readers and as a tooltip: "Ends 14 Nov 2026, 18:00 CET". */
  endLabel: string;
  variant?: CountdownVariant;
  /** Defaults to the last hour only. */
  showSeconds?: boolean;
  /** Freeze the clock (stories, tests, server render). */
  now?: Date | string | number;
  onEnd?: () => void;
}

const pad = (n: number) => String(n).padStart(2, '0');

function Countdown({ to, endLabel, variant = 'default', showSeconds, now, onEnd, className, ...props }: CountdownProps) {
  const end = new Date(to).getTime();
  const [tick, setTick] = React.useState(() => (now != null ? new Date(now).getTime() : Date.now()));
  const frozen = now != null;
  const onEndRef = React.useRef(onEnd);
  onEndRef.current = onEnd;
  React.useEffect(() => {
    if (frozen) { setTick(new Date(now).getTime()); return; }
    const t = setInterval(() => setTick(Date.now()), 1000);
    return () => clearInterval(t);
  }, [frozen, now]);
  const left = Math.max(0, Math.floor((end - tick) / 1000));
  React.useEffect(() => {
    if (left === 0) onEndRef.current?.();
  }, [left]);
  const units = [
    { key: 'days', value: Math.floor(left / 86400), label: 'days' },
    { key: 'hours', value: Math.floor((left % 86400) / 3600), label: 'hours' },
    { key: 'minutes', value: Math.floor((left % 3600) / 60), label: 'min' },
    { key: 'seconds', value: left % 60, label: 'sec' },
  ];
  const withSeconds = showSeconds ?? left < 3600;
  const shown = withSeconds ? units : units.slice(0, 3);
  const tile = {
    default: 'w-16 gap-0.5 rounded-md bg-[var(--card-muted)] px-3 py-2',
    boxed: 'w-[76px] gap-1 rounded-lg border border-border bg-card p-3 shadow-xs',
    inline: 'gap-0.5',
  }[variant];
  const digits = variant === 'boxed' ? 'text-3xl leading-9' : 'text-2xl leading-8';
  return (
    <div data-slot="countdown" data-variant={variant} title={endLabel} className={cn('flex items-start text-center whitespace-nowrap', variant === 'default' ? 'gap-2' : 'gap-3', className)} {...props}>
      <span className="sr-only">{endLabel}</span>
      {shown.map((u, i) => (
        <React.Fragment key={u.key}>
          {variant === 'inline' && i > 0 ? <span aria-hidden="true" className="text-2xl leading-8 font-semibold tracking-[-0.4px] text-muted-foreground">:</span> : null}
          <span aria-hidden="true" data-unit={u.key} className={cn('flex shrink-0 flex-col items-center', tile)}>
            <span className={cn('w-full truncate font-semibold tracking-[-0.4px] text-foreground tabular-nums', digits)}>{pad(u.value)}</span>
            <span className="w-full truncate text-xs leading-4 text-muted-foreground">{u.label}</span>
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}

/* Leaderboard Row */

export interface LeaderboardRowProps extends React.ComponentProps<'li'> {
  rank: number | string;
  name: string;
  value: string;
  initials?: string;
  avatar?: string;
  /** The viewer's own row. */
  current?: boolean;
}

function LeaderboardRow({ rank, name, value, initials, avatar, current = false, className, ...props }: LeaderboardRowProps) {
  return (
    <li
      data-slot="leaderboard-row"
      data-current={current || undefined}
      aria-current={current ? 'true' : undefined}
      className={cn('flex min-w-0 list-none items-center gap-3 rounded-md px-3 py-2 text-sm leading-5 font-medium', current && 'bg-muted', className)}
      {...props}
    >
      {/* Muted on the muted current row falls under 4.5:1: foreground there (decision D-001). */}
      <span className={cn('w-5 shrink-0 truncate text-right tabular-nums', current ? 'text-foreground' : 'text-muted-foreground')}>
        <span className="sr-only">Rank </span>{rank}
      </span>
      <Avatar size="sm" initials={initials} src={avatar} />
      <span title={name} className="min-w-20 flex-1 truncate text-foreground">{name}</span>
      <span title={value} className="max-w-22 shrink-0 truncate text-foreground tabular-nums">{value}</span>
    </li>
  );
}

export { Countdown, LeaderboardRow, MetricStrip, MetricStripItem, TrendIndicator, UsageMeter };
