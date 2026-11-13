// EGG UI Org Chart. Code only (no Figma component yet); family Data Structures.
// A reporting tree drawn as nested person cards joined by lines: avatar, name, role, and for a
// manager the number of direct reports in a badge. A node with people under it has a chevron to
// expand or collapse it; "Expand all" and "Collapse all" buttons sit above the tree. The tree is
// vertical so it keeps working in a narrow container: each level is indented, names and roles
// truncate (the full text is in the title).
// A11y: WAI-ARIA tree. One tab stop (roving tabindex). Down and Up move through the visible nodes,
// Right expands a collapsed node or moves to its first report, Left collapses an open node or moves
// to its manager, Home and End jump to the first and last visible node, Enter toggles the node and
// calls onSelect. Each node is a treeitem with aria-level, aria-posinset, aria-setsize and
// aria-expanded, named by its name, role and report count. The chevron is a pointer shortcut; the
// keyboard and the Expand all / Collapse all buttons do the same.
import * as React from 'react';
import { ChevronRight } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Avatar } from './avatar';
import { Badge } from './badge';
import { Button } from './button';

export interface OrgNode {
  id: string;
  name: string;
  role: string;
  /** Photo URL. Initials show without it. */
  avatarSrc?: string;
  /** The people who report to this person. */
  reports?: OrgNode[];
}

export interface OrgChartProps extends Omit<React.ComponentProps<'div'>, 'onSelect' | 'defaultValue'> {
  /** The top of the tree: one or more people with no manager in this chart. */
  nodes: OrgNode[];
  /** Ids that start expanded, or "all". Default: all. */
  defaultExpanded?: string[] | 'all';
  onExpandedChange?: (expanded: string[]) => void;
  /** Id of the picked person. Sets aria-selected on the tree items. */
  selectedId?: string;
  onSelect?: (node: OrgNode) => void;
  /** Show the Expand all and Collapse all buttons. Default true. */
  showControls?: boolean;
  /** Accessible name of the tree. */
  label?: string;
}

const FOCUS = 'outline-none focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]';

function countAll(n: OrgNode): number {
  return (n.reports ?? []).reduce((s, c) => s + 1 + countAll(c), 0);
}

function OrgChart({ nodes, defaultExpanded = 'all', onExpandedChange, selectedId, onSelect, showControls = true, label = 'Organization chart', className, ...props }: OrgChartProps) {
  // Every node with reports, with its parent, in document order.
  const index = React.useMemo(() => {
    const parent = new Map<string, string | null>();
    const withReports: string[] = [];
    const byId = new Map<string, OrgNode>();
    const walk = (list: OrgNode[], p: string | null) => {
      for (const n of list) {
        parent.set(n.id, p);
        byId.set(n.id, n);
        if (n.reports?.length) {
          withReports.push(n.id);
          walk(n.reports, n.id);
        }
      }
    };
    walk(nodes, null);
    return { parent, withReports, byId };
  }, [nodes]);

  const [expanded, setExpandedState] = React.useState<Set<string>>(() => new Set(defaultExpanded === 'all' ? index.withReports : defaultExpanded));
  const [active, setActive] = React.useState<string | undefined>(nodes[0]?.id);
  const items = React.useRef(new Map<string, HTMLDivElement>());
  const baseId = React.useId();

  const setExpanded = (next: Set<string>) => {
    setExpandedState(next);
    onExpandedChange?.(Array.from(next));
  };
  const toggle = (id: string, open?: boolean) => {
    const next = new Set(expanded);
    const want = open ?? !next.has(id);
    if (want) next.add(id);
    else next.delete(id);
    setExpanded(next);
  };

  // Ids in the order they are on screen.
  const visible: string[] = [];
  const collect = (list: OrgNode[]) => {
    for (const n of list) {
      visible.push(n.id);
      if (n.reports?.length && expanded.has(n.id)) collect(n.reports);
    }
  };
  collect(nodes);

  const focusId = (id: string | undefined) => {
    if (!id) return;
    setActive(id);
    items.current.get(id)?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, node: OrgNode) => {
    if (e.target !== e.currentTarget) return;
    const i = visible.indexOf(node.id);
    const has = !!node.reports?.length;
    switch (e.key) {
      case 'ArrowDown':
        focusId(visible[i + 1]);
        break;
      case 'ArrowUp':
        focusId(visible[i - 1]);
        break;
      case 'Home':
        focusId(visible[0]);
        break;
      case 'End':
        focusId(visible[visible.length - 1]);
        break;
      case 'ArrowRight':
        if (has && !expanded.has(node.id)) toggle(node.id, true);
        else if (has) focusId(node.reports![0].id);
        break;
      case 'ArrowLeft': {
        if (has && expanded.has(node.id)) toggle(node.id, false);
        else {
          const p = index.parent.get(node.id);
          if (p) focusId(p);
        }
        break;
      }
      case 'Enter':
      case ' ':
        if (has) toggle(node.id);
        onSelect?.(node);
        break;
      default:
        return;
    }
    e.preventDefault();
  };

  const renderList = (list: OrgNode[], level: number): React.ReactNode =>
    list.map((node, i) => {
      const has = !!node.reports?.length;
      const open = has && expanded.has(node.id);
      const direct = node.reports?.length ?? 0;
      const total = countAll(node);
      const nameId = `${baseId}-${node.id}-name`;
      const roleId = `${baseId}-${node.id}-role`;
      const countId = `${baseId}-${node.id}-count`;
      const groupId = `${baseId}-${node.id}-group`;
      return (
        <li key={node.id} role="none" className={cn('relative m-0 list-none p-0', level > 1 && 'before:absolute before:top-7 before:-left-3 before:h-px before:w-3 before:bg-border')}>
          <div
            ref={el => {
              if (el) items.current.set(node.id, el);
              else items.current.delete(node.id);
            }}
            role="treeitem"
            aria-level={level}
            aria-posinset={i + 1}
            aria-setsize={list.length}
            aria-expanded={has ? open : undefined}
            aria-owns={open ? groupId : undefined}
            aria-selected={onSelect || selectedId ? selectedId === node.id : undefined}
            aria-label={`${node.name}, ${node.role}${has ? `, ${direct} ${direct === 1 ? 'report' : 'reports'}` : ''}`}
            tabIndex={(active ?? visible[0]) === node.id ? 0 : -1}
            data-node={node.id}
            data-slot="org-card"
            onFocus={e => {
              if (e.target === e.currentTarget) setActive(node.id);
            }}
            onKeyDown={e => onKeyDown(e, node)}
            onClick={() => {
              focusId(node.id);
              onSelect?.(node);
            }}
            className={cn(
              'flex min-w-0 items-center gap-2.5 rounded-lg border bg-card p-2 text-card-foreground',
              selectedId === node.id ? 'border-primary' : 'border-border',
              onSelect && 'cursor-pointer',
              FOCUS,
            )}
          >
            <span aria-hidden="true" className="flex shrink-0"><Avatar size="default" type={node.avatarSrc ? 'image' : 'icon'} initials="" src={node.avatarSrc} /></span>
            <div className="flex min-w-0 flex-1 flex-col">
              <span id={nameId} className="min-w-0 truncate text-sm leading-5 font-medium" title={node.name}>{node.name}</span>{' '}
              <span id={roleId} className="min-w-0 truncate text-xs leading-4 text-muted-foreground" title={node.role}>{node.role}</span>
            </div>{' '}
            {has ? (
              <>
                <Badge id={countId} size="sm" variant="soft-neutral" title={`${total} ${total === 1 ? 'person' : 'people'} in this team`}>
                  {direct} {direct === 1 ? 'report' : 'reports'}
                </Badge>{' '}
                <span
                  aria-hidden="true"
                  data-slot="org-chevron"
                  onClick={e => {
                    e.stopPropagation();
                    focusId(node.id);
                    toggle(node.id);
                  }}
                  className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <ChevronRight className={cn('size-4 transition-transform duration-[var(--duration-fast)] motion-reduce:transition-none', open && 'rotate-90')} />
                </span>
              </>
            ) : null}
          </div>
          {open ? (
            <ul id={groupId} role="group" className="m-0 mt-2 flex list-none flex-col gap-2 border-l border-border p-0 pl-3 ml-4">
              {renderList(node.reports!, level + 1)}
            </ul>
          ) : null}
        </li>
      );
    });

  const people = nodes.reduce((s, n) => s + 1 + countAll(n), 0);
  const allOpen = index.withReports.every(id => expanded.has(id));
  const allClosed = index.withReports.every(id => !expanded.has(id));

  return (
    <div data-slot="org-chart" className={cn('flex w-full min-w-0 flex-col gap-3', className)} {...props}>
      {showControls ? (
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <p role="status" className="m-0 min-w-0 text-sm leading-5 text-muted-foreground">{people} {people === 1 ? 'person' : 'people'}</p>
          <div className="flex shrink-0 items-center gap-2">
            <Button type="button" variant="outline" size="sm" disabled={allOpen} onClick={() => setExpanded(new Set(index.withReports))}>Expand all</Button>
            <Button type="button" variant="outline" size="sm" disabled={allClosed} onClick={() => setExpanded(new Set())}>Collapse all</Button>
          </div>
        </div>
      ) : null}
      <ul role="tree" aria-label={label} className="m-0 flex min-w-0 list-none flex-col gap-2 p-0">
        {renderList(nodes, 1)}
      </ul>
    </div>
  );
}

export { OrgChart };
