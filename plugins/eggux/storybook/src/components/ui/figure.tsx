// EGG UI Figure. Figma: Figure (Description List page, "Figure / Component", 369:1027). Layout
// (stacked, inline), Size (default, lg), Tone (default, on-primary), Show source, Show divider.
// A number with what it counts. Stacked: value (heading/h3 24/32, lg heading/h2 30/36) over the
// label (body/small muted), optional source (ui/caption muted) and divider, 4 gap, all truncate.
// Inline: value (heading/h4 20/28, lg h3) and label on one baseline, 6 gap ("42 articles").
// Tone on-primary sets everything in primary-foreground for primary bands. A metric compared to a
// period goes in Stat Card.
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface FigureProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  value: React.ReactNode;
  label: string;
  layout?: 'stacked' | 'inline';
  size?: 'default' | 'lg';
  tone?: 'default' | 'on-primary';
  /** Figma Show source: where the number comes from, when it is a claim. */
  source?: string;
  /** Figma Show divider (stacked). */
  divider?: boolean;
}

function Figure({ value, label, layout = 'stacked', size = 'default', tone = 'default', source, divider = false, className, ...props }: FigureProps) {
  const onPrimary = tone === 'on-primary';
  const muted = onPrimary ? 'text-primary-foreground' : 'text-muted-foreground';
  if (layout === 'inline') {
    return (
      <div data-slot="figure" data-layout="inline" className={cn('flex min-w-0 items-baseline gap-1.5 whitespace-nowrap', onPrimary ? 'text-primary-foreground' : 'text-foreground', className)} {...props}>
        <span className={cn('shrink-0 font-semibold tracking-tight', size === 'lg' ? 'text-2xl leading-8' : 'text-xl leading-7')}>{value}</span>
        <span className={cn('min-w-0 truncate text-sm leading-5', muted)}>{label}</span>
      </div>
    );
  }
  return (
    <div data-slot="figure" data-layout="stacked" className={cn('flex min-w-0 flex-col gap-1', className)} {...props}>
      <span className={cn('truncate font-semibold tracking-tight', size === 'lg' ? 'text-3xl leading-9' : 'text-2xl leading-8', onPrimary ? 'text-primary-foreground' : 'text-foreground')}>{value}</span>
      <span title={label} className={cn('truncate text-sm leading-5', muted)}>{label}</span>
      {source ? <span title={source} className={cn('truncate text-xs leading-4', muted)}>{source}</span> : null}
      {divider ? <span aria-hidden="true" className="h-px w-full bg-border" /> : null}
    </div>
  );
}

export { Figure };
