// EGG UI Roadmap Lane. Code only (no Figma component yet); family Data Structures.
// A roadmap as lanes side by side: quarters (Q1, Q2...) or Now, Next and Later. Each lane is a
// section with a title, an optional date line, an item count and a list of item cards. A card has
// a title, a short summary, a status badge (Planned, In progress, Shipped, At risk) and an
// optional owner and theme. The lanes sit in a grid that wraps: three across when there is room,
// stacked in a narrow container (down to 276 px). Reordering is not part of the component.
// A11y: each lane is a labelled section holding a list; the status is always text in a badge; the
// lane marked `current` says so in text ("Current") and with aria-current; when `onItemSelect` is
// given the title is a native button (Enter or Space), otherwise it is plain text.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from './badge';

export type RoadmapStatus = 'planned' | 'in-progress' | 'shipped' | 'at-risk';

export interface RoadmapItem {
  id: string;
  title: string;
  summary?: string;
  status: RoadmapStatus;
  owner?: string;
  /** A short theme such as "Billing" or "Mobile". */
  theme?: string;
}

export interface RoadmapLaneData {
  id: string;
  title: string;
  /** Shown under the title: "Jan to Mar 2026", "This month". */
  description?: string;
  items: RoadmapItem[];
}

export interface RoadmapLaneProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  lanes: RoadmapLaneData[];
  /** Id of the lane that is happening now. */
  current?: string;
  onItemSelect?: (item: RoadmapItem, lane: RoadmapLaneData) => void;
  /** Show the summary line of each card. Default true. */
  showSummary?: boolean;
  /** Show the owner and theme line. Default true. */
  showMeta?: boolean;
  /** Heading level of the lane titles. Default h3. */
  titleAs?: 'h2' | 'h3' | 'h4';
}

const statusLabel: Record<RoadmapStatus, string> = { planned: 'Planned', 'in-progress': 'In progress', shipped: 'Shipped', 'at-risk': 'At risk' };
const statusVariant: Record<RoadmapStatus, 'soft-neutral' | 'soft-info' | 'soft-success' | 'soft-warning'> = {
  planned: 'soft-neutral',
  'in-progress': 'soft-info',
  shipped: 'soft-success',
  'at-risk': 'soft-warning',
};

const FOCUS = 'outline-none focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]';

function RoadmapLane({ lanes, current, onItemSelect, showSummary = true, showMeta = true, titleAs: Title = 'h3', className, ...props }: RoadmapLaneProps) {
  const baseId = React.useId();
  return (
    <div
      data-slot="roadmap-lane"
      className={cn('grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-3', className)}
      {...props}
    >
      {lanes.map(lane => {
        const headId = `${baseId}-${lane.id}`;
        const isCurrent = current === lane.id;
        return (
          <section
            key={lane.id}
            data-lane={lane.id}
            aria-labelledby={headId}
            aria-current={isCurrent ? 'true' : undefined}
            className={cn('flex min-w-0 flex-col gap-3 rounded-xl border bg-card p-3 text-card-foreground', isCurrent ? 'border-primary' : 'border-border')}
          >
            <header className="flex min-w-0 flex-col gap-1">
              <div className="flex min-w-0 items-center gap-2">
                <Title id={headId} className="m-0 min-w-0 flex-1 truncate text-base leading-6 font-semibold" title={lane.title}>{lane.title}</Title>
                {isCurrent ? <Badge size="sm" variant="default">Current</Badge> : null}
                <Badge size="sm" variant="soft-neutral" aria-label={`${lane.items.length} ${lane.items.length === 1 ? 'item' : 'items'}`}>{lane.items.length}</Badge>
              </div>
              {lane.description ? <p className="m-0 min-w-0 truncate text-xs leading-4 text-muted-foreground" title={lane.description}>{lane.description}</p> : null}
            </header>
            {lane.items.length === 0 ? (
              <p className="m-0 rounded-lg border border-dashed border-border px-3 py-4 text-center text-sm leading-5 text-muted-foreground">Nothing planned yet.</p>
            ) : (
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {lane.items.map(item => (
                  <li key={item.id} data-item={item.id} className="flex min-w-0 flex-col gap-2 rounded-lg border border-border bg-background p-3">
                    <div className="flex min-w-0 items-start justify-between gap-2">
                      {onItemSelect ? (
                        <button
                          type="button"
                          onClick={() => onItemSelect(item, lane)}
                          className={cn('min-w-0 flex-1 rounded-sm bg-transparent p-0 text-left text-sm leading-5 font-medium break-words text-foreground hover:underline', FOCUS)}
                        >
                          {item.title}
                        </button>
                      ) : (
                        <span className="min-w-0 flex-1 text-sm leading-5 font-medium break-words">{item.title}</span>
                      )}
                      <Badge size="sm" variant={statusVariant[item.status]} dot>{statusLabel[item.status]}</Badge>
                    </div>
                    {showSummary && item.summary ? <p className="m-0 min-w-0 text-sm leading-5 break-words text-muted-foreground">{item.summary}</p> : null}
                    {showMeta && (item.owner || item.theme) ? (
                      <p className="m-0 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs leading-4 text-muted-foreground">
                        {item.theme ? <Badge size="sm" variant="outline">{item.theme}</Badge> : null}
                        {item.owner ? <span className="min-w-0 truncate" title={item.owner}>Owner: {item.owner}</span> : null}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}

export { RoadmapLane };
