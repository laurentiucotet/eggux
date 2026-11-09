// EGG UI Skeleton Preset. Figma: Skeleton Preset (Skeleton page, "Skeleton Preset / Component",
// node 1092:138499). Type: list-row (avatar, two lines, a trailing value), card (16:9-ish block,
// title and two lines, card surface), table-row (checkbox, avatar, name FILL, status, two values,
// bottom border), stat (label, value, footnote, card surface), chart (title, subtitle, 10 bars,
// axis labels, card surface). Built from Skeleton; card surfaces are Card. Every preset fills the
// width it is given, with the Figma min widths (list-row 240, card 220, table-row 480, stat 160,
// chart 320). With `label` the preset is the loading region itself (role="status", aria-busy);
// without it, it is decorative and the region around the repeated rows carries aria-busy.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card } from './card';
import { Skeleton } from './skeleton';

export type SkeletonPresetType = 'list-row' | 'card' | 'table-row' | 'stat' | 'chart';

export interface SkeletonPresetProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** Figma Type. */
  type?: SkeletonPresetType;
  /** Accessible text ("Loading invoices"). Use it on one preset only; repeated rows go in one aria-busy region. */
  label?: string;
}

// Chart bar heights from Figma (64, 96, 80, 128, 104, 144, 88, 120, 72, 112), written in full.
const barHeights = ['h-16', 'h-24', 'h-20', 'h-32', 'h-26', 'h-36', 'h-22', 'h-30', 'h-18', 'h-28'];

function presetContent(type: SkeletonPresetType) {
  switch (type) {
    case 'card':
      return (
        <>
          <Skeleton shape="block" className="h-40 w-full" />
          <Skeleton className="mt-4 h-5 w-full" />
          <Skeleton className="w-full" />
          <Skeleton className="w-40" />
        </>
      );
    case 'table-row':
      return (
        <>
          <Skeleton className="size-4 shrink-0" />
          <Skeleton shape="circle" className="size-8 shrink-0" />
          <Skeleton className="w-auto min-w-0 flex-1" />
          <Skeleton className="h-5 w-18 shrink-0" />
          <Skeleton className="w-24 shrink-0" />
          <Skeleton className="w-16 shrink-0" />
        </>
      );
    case 'stat':
      return (
        <>
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-8 w-35" />
          <Skeleton className="h-3.5 w-30" />
        </>
      );
    case 'chart':
      return (
        <>
          <div data-slot="skeleton-preset-header" className="flex w-full flex-col gap-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3.5 w-60" />
          </div>
          <div data-slot="skeleton-preset-bars" className="flex h-40 w-full items-end gap-3">
            {barHeights.map(h => (
              <Skeleton key={h} shape="block" className={cn('w-auto min-w-0 flex-1 rounded-sm', h)} />
            ))}
          </div>
          <div data-slot="skeleton-preset-axis" className="flex w-full items-start justify-between">
            {[0, 1, 2, 3].map(i => (
              <Skeleton key={i} className="h-3 w-8" />
            ))}
          </div>
        </>
      );
    default:
      return (
        <>
          <Skeleton shape="circle" className="shrink-0" />
          <div data-slot="skeleton-preset-lines" className="flex min-w-0 flex-1 flex-col gap-2">
            <Skeleton className="w-full" />
            <Skeleton className="h-3 w-30" />
          </div>
          <Skeleton className="w-12 shrink-0" />
        </>
      );
  }
}

// Written in full so Tailwind can read them.
const rootClasses: Record<SkeletonPresetType, string> = {
  'list-row': 'flex w-full min-w-[240px] items-center gap-4 px-4 py-3',
  card: 'w-full min-w-[220px] items-start gap-3 p-4',
  'table-row': 'flex w-full min-w-[480px] items-center gap-4 border-b border-border px-4 py-3',
  stat: 'w-full min-w-[160px] items-start gap-3 p-5',
  chart: 'w-full min-w-[320px] items-start gap-4 p-5',
};

function SkeletonPreset({ type = 'list-row', label, className, ...props }: SkeletonPresetProps) {
  const a11y = label
    ? { role: 'status' as const, 'aria-label': label, 'aria-busy': true as const }
    : { 'aria-hidden': true as const };
  const attrs = { 'data-slot': 'skeleton-preset', 'data-type': type, ...a11y };
  const content = presetContent(type);
  if (type === 'card' || type === 'stat' || type === 'chart') {
    return (
      <Card {...attrs} className={cn(rootClasses[type], className)} {...props}>
        {content}
      </Card>
    );
  }
  return (
    <div {...attrs} className={cn(rootClasses[type], className)} {...props}>
      {content}
    </div>
  );
}

export { SkeletonPreset };
