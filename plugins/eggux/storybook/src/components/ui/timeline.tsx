// EGG UI Timeline Item. Figma: Timeline Item (Timeline page, "Timeline Item / Component", 91:73).
// Tone (default, primary, success, warning, destructive), Layout (default, card, alternating-left,
// alternating-right, horizontal), Size (default, sm), Show connector, Show description, Show content.
// One event in an activity history, newest first. Rail: a 24 dot (12 icon, clock by default) and a
// 1 px connector, 4 apart. default: 12 gap, body 2 / 24 px top / bottom, title ui/label with the
// time (ui/caption muted, max 128) on its right, description body/small muted (70 high). sm: 16
// dot, 8 gap, title ui/label-small, caption description 2 lines, 16 bottom (50 high). card: the body
// in a bordered card (radius xl, 16 padding), the time wraps under the title when narrow. alternating:
// body and time on either side of the rail, 16 gap, for milestones (768 and up). horizontal: dot
// and connector run left to right, time above the title, 200 wide, 16 right padding; items sit in
// a row with no gap. Tone marks the outcome, not decoration.
// A11y: Timeline is an <ol>; each item an <li>; the time is a <time> with the full timestamp in a
// title. The connector hides on the last item.
import * as React from 'react';
import { Clock } from '@/components/icons';
import { cn } from '@/lib/utils';

export type TimelineTone = 'default' | 'primary' | 'success' | 'warning' | 'destructive';
export type TimelineLayout = 'default' | 'card' | 'alternating-left' | 'alternating-right' | 'horizontal';

export interface TimelineProps extends React.ComponentProps<'ol'> {
  /** Horizontal lays the items in a row. */
  orientation?: 'vertical' | 'horizontal';
}

function Timeline({ orientation = 'vertical', className, ...props }: TimelineProps) {
  return (
    <ol
      data-slot="timeline"
      data-orientation={orientation}
      className={cn(
        'm-0 flex min-w-0 list-none p-0 [&>li:last-child_[data-slot=timeline-connector]]:invisible',
        orientation === 'horizontal' ? 'flex-row' : 'flex-col',
        className,
      )}
      {...props}
    />
  );
}

export interface TimelineItemProps extends Omit<React.ComponentProps<'li'>, 'title'> {
  title: React.ReactNode;
  /** Shown time: "2 h ago", "22 Oct, 10:30". */
  time?: React.ReactNode;
  /** Machine time for <time datetime>. */
  dateTime?: string;
  /** Full timestamp shown on hover. */
  timeTitle?: string;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  tone?: TimelineTone;
  layout?: TimelineLayout;
  size?: 'default' | 'sm';
  /** Figma Show connector; Timeline also hides it on the last item. */
  connector?: boolean;
  /** Figma Content slot: notes, attachments. */
  children?: React.ReactNode;
}

const tones: Record<TimelineTone, string> = {
  default: 'bg-muted text-foreground',
  primary: 'bg-primary text-primary-foreground',
  success: 'bg-success text-success-foreground',
  warning: 'bg-warning text-warning-foreground',
  destructive: 'bg-destructive text-destructive-foreground',
};

function TimelineItem({ title, time, dateTime, timeTitle, description, icon, tone = 'default', layout = 'default', size = 'default', connector = true, children, className, ...props }: TimelineItemProps) {
  const sm = size === 'sm' && (layout === 'default');
  const horizontal = layout === 'horizontal';
  const dot = (
    <span data-slot="timeline-dot" aria-hidden="true" className={cn('flex shrink-0 items-center justify-center rounded-full', sm ? 'size-4 [&_svg]:size-2.5' : 'size-6 [&_svg]:size-3', tones[tone])}>
      {icon ?? <Clock />}
    </span>
  );
  const line = connector ? <span data-slot="timeline-connector" aria-hidden="true" className={cn('bg-border', horizontal ? 'h-px min-w-px flex-1' : 'min-h-px w-px flex-1')} /> : null;
  const rail = (
    <div data-slot="timeline-rail" className={cn('flex shrink-0 items-center gap-1', horizontal ? 'w-full' : 'flex-col self-stretch pb-1')}>
      {dot}
      {line}
    </div>
  );
  const timeEl = time ? (
    <time dateTime={dateTime} title={timeTitle} className={cn('block max-w-32 shrink-0 truncate text-xs leading-4 text-muted-foreground')}>{time}</time>
  ) : null;
  const titleEl = <p className={cn('m-0 min-w-24 flex-1 font-medium text-foreground [overflow-wrap:anywhere]', sm ? 'text-xs leading-4' : 'text-sm leading-5')}>{title}</p>;
  const descEl = description ? (
    <p className={cn('m-0 w-full text-muted-foreground [overflow-wrap:anywhere]', sm ? 'line-clamp-2 text-xs leading-4' : 'text-sm leading-5')}>{description}</p>
  ) : null;
  const content = children ? <div data-slot="timeline-content" className="w-full pt-2">{children}</div> : null;

  if (horizontal) {
    return (
      <li data-slot="timeline-item" data-layout={layout} className={cn('flex min-w-0 flex-col items-start gap-3', className)} {...props}>
        {rail}
        <div className="flex w-full min-w-0 flex-col items-start gap-1 pt-0.5 pr-4">
          {timeEl}
          {titleEl}
          {descEl}
          {content}
        </div>
      </li>
    );
  }

  if (layout === 'alternating-left' || layout === 'alternating-right') {
    const left = layout === 'alternating-left';
    const body = (
      <div className={cn('flex min-w-0 flex-1 flex-col gap-1 pt-0.5 pb-6', left ? 'items-end text-right' : 'items-start')}>
        {titleEl}
        {descEl}
        {content}
      </div>
    );
    const meta = <div className={cn('flex min-w-0 flex-1 flex-col pt-1', left ? 'items-start' : 'items-end text-right')}>{timeEl}</div>;
    return (
      <li data-slot="timeline-item" data-layout={layout} className={cn('flex min-w-0 items-start gap-4', className)} {...props}>
        {left ? body : meta}
        {rail}
        {left ? meta : body}
      </li>
    );
  }

  const header = (
    <div className={cn('flex w-full items-start', layout === 'card' ? 'flex-wrap gap-x-2 gap-y-1' : 'gap-2')}>
      {titleEl}
      {timeEl}
    </div>
  );
  return (
    <li data-slot="timeline-item" data-layout={layout} data-size={size} className={cn('flex min-w-0 items-start', sm ? 'gap-2' : 'gap-3', className)} {...props}>
      {rail}
      {layout === 'card' ? (
        <div className="flex min-w-0 flex-1 flex-col pb-4">
          <div className="flex w-full flex-col gap-1 rounded-xl border border-border bg-background p-4">
            {header}
            {descEl}
            {content}
          </div>
        </div>
      ) : (
        <div className={cn('flex min-w-0 flex-1 flex-col items-start', sm ? 'gap-0.5 pb-4' : 'gap-1 pt-0.5 pb-6')}>
          {header}
          {descEl}
          {content}
        </div>
      )}
    </li>
  );
}

export { Timeline, TimelineItem };
