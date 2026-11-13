// EGG UI Gantt Chart. Code only (no Figma component yet); family Data Structures.
// A schedule drawn as rows of task bars on a time scale. Each task has a start and an end day
// (inclusive, "2026-03-09"); the bar's left edge and width are computed from them. The header
// shows months over day numbers (`scale="day"`) or week starts (`scale="week"`). A vertical
// line marks today (the `now` prop; pass it in tests and previews). A task that waits on another
// carries a diamond marker at the start of its bar. Progress fills the bar from the left.
// The task names stay on the left while the timeline scrolls sideways inside its own region.
// A11y: the timeline is a focusable scroll region; every bar is a native button named with the
// task, its dates, progress, status and what it depends on. One tab stop (roving): Up and Down
// move to the bar of the previous or next row, Home and End jump to the first and last row,
// Enter or Space selects (onTaskSelect). The same data is in a table under the chart (the list
// equivalent, a native details element). The chart itself is decorative to the reader (the
// bars carry the text), and motion is not used.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from './badge';

export type GanttStatus = 'planned' | 'in-progress' | 'done' | 'at-risk';

export interface GanttTask {
  id: string;
  name: string;
  /** First day, "2026-03-09". */
  start: string;
  /** Last day, inclusive, "2026-03-20". */
  end: string;
  owner?: string;
  /** 0 to 100. */
  progress?: number;
  status?: GanttStatus;
  /** Ids of the tasks this one waits for. */
  dependsOn?: string[];
}

export interface GanttChartProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  tasks: GanttTask[];
  /** The day marked as today. Pass it in tests and previews; the real today when not given. */
  now?: Date | string;
  /** day: one column per day. week: one column per week start, narrower days. */
  scale?: 'day' | 'week';
  title?: string;
  titleAs?: 'h2' | 'h3' | 'h4';
  selectedId?: string;
  onTaskSelect?: (task: GanttTask) => void;
  /** Show the table under the chart. Default true. */
  showList?: boolean;
  /** Start with the list open. */
  defaultListOpen?: boolean;
  /** Show the legend. Default true. */
  showLegend?: boolean;
}

const MS_DAY = 86_400_000;
const parseDay = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return Date.UTC(y, (m || 1) - 1, d || 1) / MS_DAY;
};
const dayOfDate = (d: Date | string) => (typeof d === 'string' ? parseDay(d) : Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / MS_DAY);
const fromNum = (n: number) => new Date(n * MS_DAY);
const fmtFull = (n: number) => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(fromNum(n));
const fmtShort = (n: number) => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(fromNum(n));
const fmtMonth = (n: number) => new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(fromNum(n));
const weekday = (n: number) => fromNum(n).getUTCDay(); // 0 = Sunday
const monthKey = (n: number) => { const d = fromNum(n); return d.getUTCFullYear() * 12 + d.getUTCMonth(); };

const statusLabel: Record<GanttStatus, string> = { planned: 'Planned', 'in-progress': 'In progress', done: 'Done', 'at-risk': 'At risk' };
const statusBadge: Record<GanttStatus, 'soft-neutral' | 'soft-info' | 'soft-success' | 'soft-warning'> = {
  planned: 'soft-neutral',
  'in-progress': 'soft-info',
  done: 'soft-success',
  'at-risk': 'soft-warning',
};
// Every class name in full so Tailwind can generate it: track, border and fill per status.
const track: Record<GanttStatus, string> = {
  planned: 'border-input bg-muted',
  'in-progress': 'border-primary bg-primary/20',
  done: 'border-success bg-success/20',
  'at-risk': 'border-warning bg-warning/25',
};
const fill: Record<GanttStatus, string> = {
  planned: 'bg-input',
  'in-progress': 'bg-primary',
  done: 'bg-success',
  'at-risk': 'bg-warning',
};

const LABEL_W = '10rem';
const FOCUS = 'outline-none focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]';

function describe(t: GanttTask, byId: Map<string, GanttTask>) {
  const s = parseDay(t.start);
  const e = parseDay(t.end);
  const days = e - s + 1;
  const parts = [`${t.name}`, `${fmtFull(s)} to ${fmtFull(e)}`, `${days} ${days === 1 ? 'day' : 'days'}`];
  if (t.progress !== undefined) parts.push(`${Math.round(t.progress)} percent done`);
  if (t.status) parts.push(statusLabel[t.status]);
  if (t.owner) parts.push(`owner ${t.owner}`);
  const deps = (t.dependsOn ?? []).map(id => byId.get(id)?.name).filter(Boolean);
  if (deps.length) parts.push(`depends on ${deps.join(' and ')}`);
  return parts.join(', ');
}

function GanttChart({
  tasks,
  now,
  scale = 'day',
  title = 'Project schedule',
  titleAs: Title = 'h3',
  selectedId,
  onTaskSelect,
  showList = true,
  defaultListOpen = false,
  showLegend = true,
  className,
  ...props
}: GanttChartProps) {
  const headingId = React.useId();
  const [active, setActive] = React.useState(0);
  const bars = React.useRef<Array<HTMLButtonElement | null>>([]);
  const byId = React.useMemo(() => new Map(tasks.map(t => [t.id, t])), [tasks]);
  const dayW = scale === 'day' ? 28 : 12;

  const geometry = React.useMemo(() => {
    if (tasks.length === 0) return null;
    const starts = tasks.map(t => parseDay(t.start));
    const ends = tasks.map(t => parseDay(t.end));
    let from = Math.min(...starts);
    let to = Math.max(...ends);
    from -= (weekday(from) + 6) % 7; // back to Monday
    to += (7 - weekday(to)) % 7; // forward to Sunday
    return { from, to, total: to - from + 1 };
  }, [tasks]);

  if (!geometry) {
    return (
      <section data-slot="gantt-chart" aria-labelledby={headingId} className={cn('flex w-full min-w-0 flex-col gap-2 rounded-xl border border-border bg-card p-4 text-card-foreground', className)} {...props}>
        <Title id={headingId} className="m-0 text-base leading-6 font-semibold">{title}</Title>
        <p className="m-0 text-sm text-muted-foreground">No tasks yet. Add a task with a start and an end date to see it here.</p>
      </section>
    );
  }

  const { from, to, total } = geometry;
  const timelineW = total * dayW;
  const today = now === undefined ? dayOfDate(new Date()) : dayOfDate(now);
  const todayVisible = today >= from && today <= to;

  // Month segments for the first header row.
  const months: Array<{ key: number; label: string; days: number }> = [];
  for (let n = from; n <= to; n++) {
    const k = monthKey(n);
    const last = months[months.length - 1];
    if (last && last.key === k) last.days += 1;
    else months.push({ key: k, label: fmtMonth(n), days: 1 });
  }
  // Ticks for the second header row.
  const ticks: Array<{ at: number; label: string; span: number }> = [];
  if (scale === 'day') for (let n = from; n <= to; n++) ticks.push({ at: n, label: String(fromNum(n).getUTCDate()), span: 1 });
  else for (let n = from; n <= to; n += 7) ticks.push({ at: n, label: fmtShort(n), span: 7 });

  const grid = {
    backgroundImage: 'linear-gradient(to right, var(--border) 1px, transparent 1px)',
    backgroundSize: `${dayW * (scale === 'day' ? 1 : 7)}px 100%`,
  } as React.CSSProperties;

  const focusRow = (i: number) => {
    const next = Math.max(0, Math.min(tasks.length - 1, i));
    setActive(next);
    bars.current[next]?.focus();
  };
  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key === 'ArrowDown') focusRow(i + 1);
    else if (e.key === 'ArrowUp') focusRow(i - 1);
    else if (e.key === 'Home') focusRow(0);
    else if (e.key === 'End') focusRow(tasks.length - 1);
    else return;
    e.preventDefault();
  };

  const withDeps = tasks.some(t => t.dependsOn?.length);
  const summary = `${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'} from ${fmtFull(Math.min(...tasks.map(t => parseDay(t.start))))} to ${fmtFull(Math.max(...tasks.map(t => parseDay(t.end))))}.${
    todayVisible ? ` Today is ${fmtFull(today)}.` : ` Today (${fmtFull(today)}) is outside this range.`
  }`;

  return (
    <section data-slot="gantt-chart" aria-labelledby={headingId} className={cn('flex w-full min-w-0 flex-col gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground', className)} {...props}>
      <div className="flex min-w-0 flex-col gap-1">
        <Title id={headingId} className="m-0 min-w-0 text-base leading-6 font-semibold break-words">{title}</Title>
        <p className="m-0 min-w-0 text-sm leading-5 text-muted-foreground">{summary}</p>
      </div>

      {showLegend ? (
        <ul aria-label="Legend" className="m-0 flex list-none flex-wrap items-center gap-x-4 gap-y-1 p-0 text-xs leading-4 text-foreground">
          {(Object.keys(statusLabel) as GanttStatus[]).map(s => (
            <li key={s} className="flex items-center gap-1.5">
              <span aria-hidden="true" className={cn('size-3 shrink-0 rounded-sm border', track[s])} />
              {statusLabel[s]}
            </li>
          ))}
          {withDeps ? (
            <li className="flex items-center gap-1.5">
              <span aria-hidden="true" className="size-2.5 shrink-0 rotate-45 border-2 border-foreground bg-card" />
              Waits for another task
            </li>
          ) : null}
          <li className="flex items-center gap-1.5">
            <span aria-hidden="true" className="h-3 w-0.5 shrink-0 bg-destructive" />
            Today
          </li>
        </ul>
      ) : null}

      <div
        role="region"
        aria-label={`${title}, timeline. Scroll sideways to see more days.`}
        tabIndex={0}
        className="min-w-0 max-w-full overflow-x-auto rounded-lg border border-border outline-none focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]"
      >
        <div style={{ width: `calc(${LABEL_W} + ${timelineW}px)` }} data-slot="gantt-grid">
          {/* Month row */}
          <div className="flex border-b border-border">
            <div style={{ width: LABEL_W }} className="sticky left-0 z-20 shrink-0 border-r border-border bg-card px-3 py-1.5 text-xs leading-4 font-medium text-foreground">Task</div>
            <div className="flex" style={{ width: timelineW }}>
              {months.map(m => (
                <div key={m.key} style={{ width: m.days * dayW }} className="min-w-0 truncate border-r border-border px-2 py-1.5 text-xs leading-4 font-medium text-foreground last:border-r-0">{m.label}</div>
              ))}
            </div>
          </div>
          {/* Tick row */}
          <div className="flex border-b border-border">
            <div style={{ width: LABEL_W }} className="sticky left-0 z-20 shrink-0 border-r border-border bg-card" />
            <div className="relative flex" style={{ width: timelineW }}>
              {ticks.map(t => (
                <div key={t.at} style={{ width: t.span * dayW }} className="min-w-0 truncate border-r border-border px-1 py-1 text-center text-xs leading-4 text-muted-foreground last:border-r-0">{t.label}</div>
              ))}
              {todayVisible ? <span aria-hidden="true" data-slot="gantt-today-head" className="absolute top-0 bottom-0 w-0.5 bg-destructive" style={{ left: (today - from + 0.5) * dayW - 1 }} /> : null}
            </div>
          </div>
          {/* Task rows */}
          {tasks.map((t, i) => {
            const s = parseDay(t.start);
            const e = parseDay(t.end);
            const status = t.status ?? 'in-progress';
            const left = (s - from) * dayW;
            const width = Math.max((e - s + 1) * dayW, 8);
            const selected = selectedId === t.id;
            const hasDeps = !!t.dependsOn?.length;
            return (
              <div key={t.id} data-task={t.id} className="flex border-b border-border last:border-b-0">
                <div
                  style={{ width: LABEL_W }}
                  className={cn('sticky left-0 z-10 flex shrink-0 flex-col justify-center border-r border-border bg-card px-3 py-1', selected && 'bg-muted')}
                >
                  <span className="min-w-0 truncate text-sm leading-5 font-medium" title={t.name}>{t.name}</span>
                  {t.owner ? <span className="min-w-0 truncate text-xs leading-4 text-muted-foreground" title={t.owner}>{t.owner}</span> : null}
                </div>
                <div className="relative h-12 shrink-0" style={{ width: timelineW, ...grid }}>
                  {todayVisible ? <span aria-hidden="true" data-slot="gantt-today" className="absolute top-0 bottom-0 z-0 w-0.5 bg-destructive" style={{ left: (today - from + 0.5) * dayW - 1 }} /> : null}
                  <button
                    ref={el => {
                      bars.current[i] = el;
                    }}
                    type="button"
                    data-slot="gantt-bar"
                    aria-label={describe(t, byId)}
                    aria-current={selected ? 'true' : undefined}
                    tabIndex={active === i ? 0 : -1}
                    onFocus={() => setActive(i)}
                    onKeyDown={ev => onKeyDown(ev, i)}
                    onClick={() => onTaskSelect?.(t)}
                    style={{ left, width }}
                    className={cn('absolute top-2.5 z-[1] h-7 overflow-hidden rounded-md border-2 p-0', track[status], selected && 'ring-2 ring-foreground', FOCUS, onTaskSelect ? 'cursor-pointer' : 'cursor-default')}
                  >
                    <span aria-hidden="true" className={cn('block h-full', fill[status])} style={{ width: `${Math.max(0, Math.min(100, t.progress ?? (status === 'done' ? 100 : 0)))}%` }} />
                  </button>
                  {hasDeps ? (
                    <span
                      aria-hidden="true"
                      data-slot="gantt-dependency"
                      title={`Waits for ${(t.dependsOn ?? []).map(id => byId.get(id)?.name).filter(Boolean).join(', ')}`}
                      className="absolute top-[1.1rem] z-[2] size-2.5 rotate-45 border-2 border-foreground bg-card"
                      style={{ left: left - 7 }}
                    />
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showList ? (
        <details data-slot="gantt-list" open={defaultListOpen || undefined} className="min-w-0 rounded-lg border border-border">
          <summary className={cn('cursor-pointer rounded-lg px-3 py-2 text-sm leading-5 font-medium', FOCUS)}>Show the schedule as a list</summary>
          <div tabIndex={0} role="region" aria-label="Schedule list. Scroll sideways to see more columns." className="min-w-0 overflow-x-auto outline-none focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]">
            <table className="w-full min-w-[34rem] border-separate border-spacing-0 text-sm">
              <thead>
                <tr>
                  {['Task', 'Start', 'End', 'Status', 'Progress', 'Waits for'].map(h => (
                    <th key={h} scope="col" className="border-y border-border px-3 py-2 text-left text-xs font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tasks.map(t => (
                  <tr key={t.id}>
                    <th scope="row" className="max-w-[12rem] truncate border-b border-border px-3 py-2 text-left font-medium">{t.name}</th>
                    <td className="border-b border-border px-3 py-2 whitespace-nowrap">{fmtFull(parseDay(t.start))}</td>
                    <td className="border-b border-border px-3 py-2 whitespace-nowrap">{fmtFull(parseDay(t.end))}</td>
                    <td className="border-b border-border px-3 py-2">{t.status ? <Badge size="sm" variant={statusBadge[t.status]}>{statusLabel[t.status]}</Badge> : 'None'}</td>
                    <td className="border-b border-border px-3 py-2 tabular-nums">{t.progress !== undefined ? `${Math.round(t.progress)}%` : 'None'}</td>
                    <td className="border-b border-border px-3 py-2">{(t.dependsOn ?? []).map(id => byId.get(id)?.name).filter(Boolean).join(', ') || 'None'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      ) : null}
    </section>
  );
}

export { GanttChart };
