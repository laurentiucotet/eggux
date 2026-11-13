// EGG UI Distance Badge. Code only (no Figma component yet). A compact pill that says how far a
// place is: "1.2 km", "0.7 mi" or a travel time ("8 min walk", "3 min drive"). The visible text is
// short; screen readers get the long form ("1.2 kilometres away", "8 minutes on foot"). Metric or
// imperial through `unit` (or the badge itself is a button that switches the unit when `switchable`).
// Travel times come from the distance with fixed speeds (walk 5 km/h, bike 15 km/h, drive 30 km/h);
// a real route service should pass its own time through `Route Steps` instead. Built on Badge.
import * as React from 'react';
import { Clock, MapPin } from '@/components/icons';
import { cn } from '@/lib/utils';
import { badgeVariants } from './badge';

export type DistanceUnit = 'metric' | 'imperial';
export type DistanceMode = 'distance' | 'walk' | 'bike' | 'drive';

// Metres per minute: 5 km/h, 15 km/h, 30 km/h.
const speed = { walk: 83, bike: 250, drive: 500 } as const;
const words = {
  walk: { short: 'walk', long: 'on foot' },
  bike: { short: 'bike', long: 'by bike' },
  drive: { short: 'drive', long: 'by car' },
} as const;

function plural(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`;
}
function trim(n: number) {
  return n >= 10 ? String(Math.round(n)) : String(Math.round(n * 10) / 10);
}

/** The short and the long text of a distance. */
function formatDistance(meters: number, unit: DistanceUnit = 'metric'): { short: string; long: string } {
  const m = Math.max(0, meters);
  if (unit === 'imperial') {
    const miles = m / 1609.344;
    if (miles < 0.1) {
      const feet = Math.max(10, Math.round((m * 3.28084) / 10) * 10);
      return { short: `${feet} ft`, long: `${feet} feet away` };
    }
    const value = trim(miles);
    return { short: `${value} mi`, long: `${value} ${value === '1' ? 'mile' : 'miles'} away` };
  }
  if (m < 1000) {
    const metres = m < 100 ? Math.round(m) : Math.round(m / 10) * 10;
    return { short: `${metres} m`, long: `${plural(metres, 'metre', 'metres')} away` };
  }
  const value = trim(m / 1000);
  return { short: `${value} km`, long: `${value} ${value === '1' ? 'kilometre' : 'kilometres'} away` };
}

/** The short and the long text of a travel time over a distance. */
function formatTravelTime(meters: number, mode: 'walk' | 'bike' | 'drive'): { short: string; long: string } {
  const minutes = Math.max(1, Math.round(meters / speed[mode]));
  const w = words[mode];
  if (minutes < 60) return { short: `${minutes} min ${w.short}`, long: `${plural(minutes, 'minute', 'minutes')} ${w.long}` };
  const h = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return {
    short: `${h} h${rest ? ` ${rest} min` : ''} ${w.short}`,
    long: `${plural(h, 'hour', 'hours')}${rest ? ` ${plural(rest, 'minute', 'minutes')}` : ''} ${w.long}`,
  };
}

export interface DistanceBadgeProps extends Omit<React.ComponentProps<'span'>, 'children'> {
  /** Distance in metres. */
  meters: number;
  /** distance (default), or a travel time: walk, bike, drive. */
  mode?: DistanceMode;
  /** Controlled unit for distances. */
  unit?: DistanceUnit;
  defaultUnit?: DistanceUnit;
  onUnitChange?: (unit: DistanceUnit) => void;
  /** The badge becomes a button that switches between km and mi. Only for mode distance. */
  switchable?: boolean;
  /** Badge size. Default default (20 high). */
  size?: 'sm' | 'default' | 'lg';
  /** The pin or clock before the text. Default true. */
  showIcon?: boolean;
}

function DistanceBadge({ meters, mode = 'distance', unit: unitProp, defaultUnit = 'metric', onUnitChange, switchable = false, size = 'default', showIcon = true, className, ...props }: DistanceBadgeProps) {
  const [inner, setInner] = React.useState<DistanceUnit>(defaultUnit);
  const unit = unitProp ?? inner;
  const { short, long } = mode === 'distance' ? formatDistance(meters, unit) : formatTravelTime(meters, mode);
  const Icon = mode === 'distance' ? MapPin : Clock;
  const icon = showIcon ? <Icon aria-hidden="true" /> : null;
  const text = <span className="min-w-0 truncate tabular-nums">{short}</span>;

  const pill = badgeVariants({ variant: 'soft-neutral', shape: 'pill', size });
  if (switchable && mode === 'distance') {
    const other: DistanceUnit = unit === 'metric' ? 'imperial' : 'metric';
    return (
      <button
        type="button"
        data-slot="distance-badge"
        aria-label={`${short}, ${long}. Switch to ${other === 'metric' ? 'kilometres' : 'miles'}`}
        onClick={() => {
          if (unitProp === undefined) setInner(other);
          onUnitChange?.(other);
        }}
        {...(props as React.ComponentProps<'button'>)}
        className={cn(pill, 'cursor-pointer outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50', className)}
      >
        {icon}
        {text}
      </button>
    );
  }
  return (
    <span data-slot="distance-badge" {...props} className={cn(pill, className)}>
      {icon}
      <span aria-hidden="true" className="min-w-0 truncate tabular-nums">{short}</span>
      <span className="sr-only">{long}</span>
    </span>
  );
}

export { DistanceBadge, formatDistance, formatTravelTime };
