// EGG UI Log Line. Code only (no Figma component yet); family Developer.
// One structured log entry: a level Badge (debug, info, warn, error: the word is always shown), the
// time in mono, the message and, when there are fields, a chevron that expands a definition list of
// key and value pairs (request id, status, duration). The header is one native button with
// aria-expanded and aria-controls, so Enter and Space open it; with no fields it is plain text.
// The message truncates to one line closed and wraps when open. Values are mono and break anywhere,
// so a long id never makes the row scroll sideways. Put several in a list (`<ul>` of `<li>`).
import * as React from 'react';
import { ChevronRight } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Badge, type BadgeProps } from './badge';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const levelVariant: Record<LogLevel, NonNullable<BadgeProps['variant']>> = {
  debug: 'soft-neutral',
  info: 'soft-info',
  warn: 'soft-warning',
  error: 'soft-destructive',
};

export interface LogField {
  key: string;
  value: string | number | boolean | null;
}

export interface LogLineProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  level: LogLevel;
  /** ISO time for the machine; `timeLabel` is what people read. */
  time: string;
  /** What people read ("14:02:11.482"). Defaults to the ISO time. */
  timeLabel?: string;
  message: string;
  /** Structured fields shown when the line is expanded. */
  fields?: LogField[];
  /** Start expanded. */
  defaultExpanded?: boolean;
  /** Controlled expanded state. */
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}

function LogLine({ level, time, timeLabel, message, fields = [], defaultExpanded = false, expanded, onExpandedChange, className, id, ...props }: LogLineProps) {
  const [inner, setInner] = React.useState(defaultExpanded);
  const open = expanded ?? inner;
  const autoId = React.useId();
  const panelId = `${id ?? autoId}-fields`;
  const hasFields = fields.length > 0;
  const toggle = () => {
    if (expanded === undefined) setInner(!open);
    onExpandedChange?.(!open);
  };

  const summary = (
    <>
      <Badge variant={levelVariant[level]} size="sm" className="w-12 font-mono uppercase">{level}</Badge>
      <time dateTime={time} className="shrink-0 font-mono text-xs leading-5 text-muted-foreground">{timeLabel ?? time}</time>
      <span className={cn('min-w-0 flex-1 text-sm leading-5 text-foreground', open ? 'break-words whitespace-normal' : 'truncate')}>{message}</span>
    </>
  );

  return (
    <div data-slot="log-line" data-level={level} data-state={open ? 'open' : 'closed'} id={id} className={cn('min-w-0 rounded-md', className)} {...props}>
      {hasFields ? (
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={toggle}
          className="flex w-full min-w-0 items-start gap-2 rounded-md px-2 py-1 text-left outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <ChevronRight aria-hidden="true" className={cn('mt-0.5 size-4 shrink-0 text-muted-foreground motion-safe:transition-transform motion-safe:duration-[var(--duration-fast)]', open && 'rotate-90')} />
          {summary}
        </button>
      ) : (
        <div className="flex w-full min-w-0 items-start gap-2 px-2 py-1">
          <span aria-hidden="true" className="size-4 shrink-0" />
          {summary}
        </div>
      )}
      {hasFields ? (
        <dl id={panelId} hidden={!open} className="m-0 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1 py-1 pr-2 pl-[calc(0.5rem+1.5rem+3rem)] text-xs leading-5 max-sm:pl-8">
          {fields.map(f => (
            <React.Fragment key={f.key}>
              <dt className="font-mono text-muted-foreground">{f.key}</dt>
              <dd className="m-0 min-w-0 font-mono break-all text-foreground">{String(f.value)}</dd>
            </React.Fragment>
          ))}
        </dl>
      ) : null}
    </div>
  );
}

export { LogLine };
