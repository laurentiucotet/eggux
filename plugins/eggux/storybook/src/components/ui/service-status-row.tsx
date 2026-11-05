// EGG UI Service Status Row. Figma: Service Status Row / Component (COMPONENTS / Alert page, 458:2473).
// Status (operational, degraded, outage, maintenance), Name, Uptime, Show uptime, Show bars. Built from
// Status Dot and Uptime Bars. Renders a list item: put rows in a <ul>. A status other than
// operational links to the incident.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { StatusDot } from './status-dot';
import { UptimeBars, type UptimeBarsProps } from './uptime-bars';

export type ServiceStatus = 'operational' | 'degraded' | 'outage' | 'maintenance';

const statusMap: Record<ServiceStatus, { dot: 'success' | 'warning' | 'error' | 'info'; word: string }> = {
  operational: { dot: 'success', word: 'Operational' },
  degraded: { dot: 'warning', word: 'Degraded' },
  outage: { dot: 'error', word: 'Outage' },
  maintenance: { dot: 'info', word: 'Maintenance' },
};

export interface ServiceStatusRowProps extends Omit<React.ComponentProps<'li'>, 'children'> {
  /** Figma Status. */
  status?: ServiceStatus;
  /** Figma Name. */
  name?: string;
  /** Figma Uptime. */
  uptime?: string;
  /** Figma Show uptime. */
  showUptime?: boolean;
  /** Figma Show bars: needs `days`. */
  showBars?: boolean;
  days?: UptimeBarsProps['days'];
  barsProps?: Omit<UptimeBarsProps, 'days'>;
  /** Link for a status other than operational; names the incident. */
  incident?: { title: string; href: string };
}

function ServiceStatusRow({
  className, status = 'operational', name = 'Payments API', uptime = '99.98% uptime', showUptime = true,
  showBars = false, days, barsProps, incident, ...props
}: ServiceStatusRowProps) {
  const { dot, word } = statusMap[status];
  const dotEl = <StatusDot status={dot} label={word} className="shrink-0" />;
  return (
    <li data-slot="service-status-row" data-status={status} className={cn('flex min-w-0 flex-col gap-3 border-b py-3', className)} {...props}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <p className="m-0 min-w-32 flex-1 truncate text-sm font-medium text-foreground">{name}</p>
        {showUptime && <p className="m-0 max-w-40 shrink-0 truncate text-xs text-muted-foreground">{uptime}</p>}
        {incident && status !== 'operational' ? (
          <a
            href={incident.href}
            aria-label={`${word}: ${incident.title}`}
            className="inline-flex shrink-0 rounded-sm underline-offset-4 outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            {dotEl}
          </a>
        ) : dotEl}
      </div>
      {showBars && days && <UptimeBars days={days} {...barsProps} />}
    </li>
  );
}

export { ServiceStatusRow };
