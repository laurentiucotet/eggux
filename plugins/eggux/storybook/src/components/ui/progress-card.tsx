// EGG UI Progress Card. Figma: Progress Card (Card page, "Progress Card / Component"). Status
// (on-track, at-risk, off-track) names the state in text on a soft Badge with a dot; Label, Value,
// Target, Footnote, and a Progress bar (exposed: `progress` 0 to 100). Say the rule behind the
// status in the footnote or a tooltip. Built on Card, Badge and Progress.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Badge, type BadgeProps } from './badge';
import { Card } from './card';
import { Progress } from './progress';

export type ProgressStatus = 'on-track' | 'at-risk' | 'off-track';

const statusBadge: Record<ProgressStatus, { variant: NonNullable<BadgeProps['variant']>; text: string }> = {
  'on-track': { variant: 'soft-success', text: 'On track' },
  'at-risk': { variant: 'soft-warning', text: 'At risk' },
  'off-track': { variant: 'soft-destructive', text: 'Off track' },
};

export interface ProgressCardProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  status?: ProgressStatus;
  /** Figma Label. */
  label?: string;
  /** Figma Value: the amount so far, locale format. */
  value?: string;
  /** Figma Target ("of €60,000"): fills the value row, 1 line, wraps under the value when there is no room. */
  target?: string;
  /** Figma Footnote: percent and time left; the bar matches the percent. */
  footnote?: string;
  /** The Progress bar value, 0 to 100. */
  progress?: number;
}

function ProgressCard({
  status = 'on-track',
  label = 'Q4 revenue target',
  value = '€48,250',
  target = 'of €60,000',
  footnote = '80% reached · 23 days left',
  progress = 80,
  className,
  ...props
}: ProgressCardProps) {
  const badge = statusBadge[status];
  return (
    <Card data-slot="progress-card" data-status={status} className={cn('w-80 max-w-full gap-[var(--card-gap-sm)] p-[var(--card-padding)]', className)} {...props}>
      <div className="flex min-w-0 items-center gap-2">
        <p className="min-w-0 flex-1 text-sm text-muted-foreground">{label}</p>
        <Badge variant={badge.variant} dot>{badge.text}</Badge>
      </div>
      <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <p className="text-2xl leading-8 font-semibold tracking-tight whitespace-nowrap">{value}</p>
        <p data-slot="progress-card-target" className="min-w-20 flex-1 truncate text-sm text-muted-foreground">{target}</p>
      </div>
      <Progress value={progress} aria-label={`${label}: ${progress}% reached`} />
      <p className="text-xs text-muted-foreground">{footnote}</p>
    </Card>
  );
}

export { ProgressCard };
