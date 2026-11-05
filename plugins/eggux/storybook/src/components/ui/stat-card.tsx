// EGG UI Stat Card. Figma: Stat Card (Card page, "Stat Card / Component"). Trend (up, down, neutral)
// x Layout (vertical, compact, horizontal), Label, Value, Footnote, Trend text, Show change, Show
// trend, Show footer, Show sparkline. Built on Card, Badge, Icon Tile and Sparkline. The change Badge
// is exposed: `changeLabel` and `changeVariant` are independent of Trend (when down is good, keep
// Trend=down and set changeVariant="soft-success"). Direction is shown by icon and sign, never
// color alone; the sparkline is decorative.
import * as React from 'react';
import { Minus, TrendingDown, TrendingUp } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Badge, type BadgeProps } from './badge';
import { Card } from './card';
import { IconTile, type IconTileProps } from './icon-tile';
import { Sparkline } from './sparkline';

export type StatTrend = 'up' | 'down' | 'neutral';
export type StatLayout = 'vertical' | 'compact' | 'horizontal';

const trendIcons = { up: TrendingUp, down: TrendingDown, neutral: Minus } as const;
const trendTone: Record<StatTrend, NonNullable<BadgeProps['variant']>> = {
  up: 'soft-success',
  down: 'soft-destructive',
  neutral: 'soft-neutral',
};

export interface StatCardProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  trend?: StatTrend;
  layout?: StatLayout;
  /** Figma Label: what is measured. */
  label?: string;
  /** Figma Value: one line, in the locale format of the page. */
  value?: string;
  /** Figma Footnote (Show footer): says what the change is compared to. */
  footnote?: string;
  /** Figma Trend text (Show trend). */
  trendText?: string;
  /** The change Badge label ("+12.5%"), Show change. Defaults follow Trend. */
  changeLabel?: string;
  /** The change Badge variant. Defaults to the tone of Trend. */
  changeVariant?: BadgeProps['variant'];
  showChange?: boolean;
  showTrend?: boolean;
  showFooter?: boolean;
  /** Figma Show sparkline (vertical only; horizontal always shows it). */
  showSparkline?: boolean;
  /** Figma Icon Tile (compact): set its Icon and Style on the instance, the same across a row. */
  icon?: React.ReactNode;
  iconStyle?: IconTileProps['tileStyle'];
}

const defaultChange: Record<StatTrend, string> = { up: '+12.5%', down: '−4.2%', neutral: '0.0%' };

function StatCard({
  trend = 'up',
  layout = 'vertical',
  label = 'Revenue this month',
  value = '€48,250',
  footnote = 'Compared to October 2026',
  trendText = '12.5% vs last month',
  changeLabel,
  changeVariant,
  showChange = true,
  showTrend = true,
  showFooter = true,
  showSparkline = false,
  icon,
  iconStyle = 'brand',
  className,
  ...props
}: StatCardProps) {
  const compact = layout === 'compact';
  const horizontal = layout === 'horizontal';
  const TrendIcon = trendIcons[trend];
  const change = changeLabel ?? defaultChange[trend];

  const header = (
    <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0">
      <p data-slot="stat-card-label" className="min-w-0 flex-[1_1_auto] text-sm text-muted-foreground">{label}</p>
      {showChange ? (
        <Badge data-slot="stat-card-change" variant={changeVariant ?? trendTone[trend]} shape="pill">
          <TrendIcon aria-hidden="true" />
          {change}
        </Badge>
      ) : null}
    </div>
  );
  const valueEl = (
    <p data-slot="stat-card-value" className={cn('truncate font-semibold tracking-tight', compact ? 'text-2xl leading-8' : 'text-3xl leading-9')}>{value}</p>
  );
  const footer =
    !compact && showFooter ? (
      <div data-slot="stat-card-footer" className="flex min-w-0 flex-col gap-1.5">
        {showTrend ? (
          <div className="flex min-w-0 items-center gap-1.5">
            <p data-slot="stat-card-trend" className="min-w-0 max-w-[200px] truncate text-sm font-medium">{trendText}</p>
            <TrendIcon aria-hidden="true" className="size-4 shrink-0" />
          </div>
        ) : null}
        <p data-slot="stat-card-footnote" className="text-xs text-muted-foreground">{footnote}</p>
      </div>
    ) : null;

  return (
    <Card
      data-slot="stat-card"
      data-layout={layout}
      data-trend={trend}
      className={cn(
        'w-72 max-w-full gap-4 shadow-sm',
        compact ? 'p-[var(--card-padding-sm)]' : 'p-[var(--card-padding)]',
        horizontal && 'w-96',
        className,
      )}
      {...props}
    >
      {compact ? (
        <div className="flex min-w-0 items-center gap-3">
          {icon ? <IconTile icon={icon} tileStyle={iconStyle} /> : null}
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            {header}
            {valueEl}
          </div>
        </div>
      ) : horizontal ? (
        <>
          <div className="flex min-w-0 items-end gap-4">
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              {header}
              {valueEl}
            </div>
            <Sparkline trend={trend} className="h-12 w-[120px]" />
          </div>
          {footer}
        </>
      ) : (
        <>
          <div className="flex min-w-0 flex-col gap-2">
            {header}
            {valueEl}
            {showSparkline ? <Sparkline trend={trend} className="h-8 w-full" /> : null}
          </div>
          {footer}
        </>
      )}
    </Card>
  );
}

export { StatCard };
