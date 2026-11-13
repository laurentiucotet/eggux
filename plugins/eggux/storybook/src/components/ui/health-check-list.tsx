// EGG UI Health Check List. Code only (no Figma component yet); Data Display family.
// A list of automated checks, each with a status (ok, warning, failed), a label, an optional detail
// line and the time it last ran, under a summary ("4 of 6 checks passing"). The status is a Status Dot
// with its word (Passing, Warning, Failed), never color alone. The summary is a polite live region, so
// a re-run that changes the result is announced. An optional "Run again" icon button per row calls
// onRun(id). Built from Status Dot, Badge and Button Icon.
import * as React from 'react';
import { RefreshCw } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { ButtonIcon } from './button-icon';
import { StatusDot } from './status-dot';

export type HealthStatus = 'ok' | 'warning' | 'failed';

export interface HealthCheck {
  id: string;
  label: string;
  status: HealthStatus;
  /** What was found ("Responded in 180 ms", "Certificate expires in 9 days"). */
  detail?: string;
  /** When it last ran, as text ("2 min ago"). */
  lastRun?: string;
  /** Machine value for the <time> element (ISO 8601). */
  lastRunAt?: string;
  /** This check is running now. */
  running?: boolean;
}

const map = {
  ok: { dot: 'success', word: 'Passing' },
  warning: { dot: 'warning', word: 'Warning' },
  failed: { dot: 'error', word: 'Failed' },
} as const;

export interface HealthCheckListProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  title?: string;
  checks: HealthCheck[];
  showSummary?: boolean;
  showDetail?: boolean;
  showLastRun?: boolean;
  /** Called when a row's Run again button is pressed; without it there are no buttons. */
  onRun?: (id: string) => void;
}

function HealthCheckList({ title = 'System health', checks, showSummary = true, showDetail = true, showLastRun = true, onRun, className, ...props }: HealthCheckListProps) {
  const id = React.useId();
  const count = (s: HealthStatus) => checks.filter(c => c.status === s).length;
  const ok = count('ok'), warn = count('warning'), bad = count('failed');
  const overall: HealthStatus = bad > 0 ? 'failed' : warn > 0 ? 'warning' : 'ok';
  const summary = checks.length === 0
    ? 'No checks yet'
    : `${ok} of ${checks.length} checks passing`;
  const extra = [warn ? `${warn} ${warn === 1 ? 'warning' : 'warnings'}` : '', bad ? `${bad} failed` : ''].filter(Boolean).join(', ');
  return (
    <section data-slot="health-check-list" data-status={overall} aria-labelledby={`${id}-title`} className={cn('flex w-full min-w-0 flex-col rounded-lg border border-border bg-card text-card-foreground', className)} {...props}>
      <header className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 border-b border-border px-4 py-3">
        <h3 id={`${id}-title`} className="m-0 min-w-0 flex-1 basis-32 truncate text-sm leading-5 font-semibold">{title}</h3>
        {showSummary ? (
          <p data-slot="health-summary" role="status" className="m-0 flex min-w-0 max-w-full items-center gap-2 text-xs leading-4 text-muted-foreground">
            <Badge variant={overall === 'ok' ? 'soft-success' : overall === 'warning' ? 'soft-warning' : 'soft-destructive'} shape="pill" className="shrink-0">
              {overall === 'ok' ? 'Healthy' : overall === 'warning' ? 'Needs attention' : 'Action needed'}
            </Badge>
            <span className="min-w-0 truncate">{summary}{extra ? `, ${extra}` : ''}</span>
          </p>
        ) : null}
      </header>
      {checks.length === 0 ? (
        <p className="m-0 px-4 py-6 text-center text-sm text-muted-foreground">Checks appear here after the first run.</p>
      ) : (
        <ul className="m-0 flex list-none flex-col p-0">
          {checks.map(c => {
            const m = map[c.status];
            return (
              <li key={c.id} data-slot="health-check" data-status={c.status} className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 border-b border-border px-4 py-3 last:border-b-0">
                <div className="flex min-w-0 flex-1 basis-40 flex-col gap-0.5">
                  <p className="m-0 min-w-0 truncate text-sm leading-5 font-medium text-foreground">{c.label}</p>
                  {showDetail && c.detail ? <p className="m-0 min-w-0 truncate text-xs leading-4 text-muted-foreground">{c.detail}</p> : null}
                </div>
                <StatusDot status={m.dot} label={c.running ? `${m.word}, running again` : m.word} className="shrink-0 text-xs" />
                {showLastRun && c.lastRun ? (
                  <p className="m-0 max-w-32 shrink-0 truncate text-xs leading-4 text-muted-foreground">
                    <span className="sr-only">Last run </span>
                    <time dateTime={c.lastRunAt}>{c.lastRun}</time>
                  </p>
                ) : null}
                {onRun ? (
                  <ButtonIcon
                    variant="ghost"
                    size="sm"
                    icon={<RefreshCw />}
                    label={`Run ${c.label} again`}
                    loading={c.running}
                    loadingLabel={`Running ${c.label}`}
                    onClick={() => onRun(c.id)}
                  />
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export { HealthCheckList };
