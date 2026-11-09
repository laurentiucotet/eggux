// EGG UI Tree and Tree Item. Figma: Tree Item (Tree page, "Tree Item / Component", 61:491). Type
// (collapsed, expanded, leaf), State (default, hover, selected), Level 0-3, Show checkbox, Show
// icon, Show count. A row of a hierarchy (folders, nested navigation, permissions): 32 high, radius
// md, 8 px sides plus 16 per level, 4 gap; a 16 chevron (right collapsed, down expanded, an empty
// slot for leaves), an optional checkbox, a 16 icon (file-text by default), the label (body/small,
// truncates) and a Badge Count. Hover background/muted; selected background/accent, ui/label,
// accent-foreground. Deeper than 4 levels: use drill-down pages instead.
// WAI-ARIA tree: role tree / treeitem / group, aria-level, aria-expanded, aria-selected, and
// aria-checked (with "mixed") when checkable. One Tab stop (roving tabindex); Up / Down move, Right
// expands or enters, Left collapses or goes to the parent, Home / End, Enter selects, Space checks
// (or selects). A parent is checked when all its leaves are, mixed when some are.
import * as React from 'react';
import { Check, ChevronDown, ChevronRight, FileText, Minus } from '@/components/icons';
import { cn } from '@/lib/utils';

export interface TreeNode {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
  children?: TreeNode[];
}

export interface TreeProps extends Omit<React.ComponentProps<'ul'>, 'onSelect' | 'defaultChecked'> {
  nodes: TreeNode[];
  'aria-label': string;
  expanded?: string[];
  defaultExpanded?: string[];
  onExpandedChange?: (ids: string[]) => void;
  selected?: string | null;
  defaultSelected?: string | null;
  onSelect?: (id: string) => void;
  /** Figma Show checkbox: multi-select by leaves. */
  checkable?: boolean;
  /** Checked leaf ids. */
  checked?: string[];
  defaultChecked?: string[];
  onCheckedChange?: (ids: string[]) => void;
  /** Figma Show icon. */
  showIcons?: boolean;
  countLabel?: (n: number) => string;
}

interface Flat { node: TreeNode; level: number; parent: string | null }

const leavesOf = (n: TreeNode): string[] => (n.children?.length ? n.children.flatMap(leavesOf) : [n.id]);

function useControlled<T>(value: T | undefined, initial: T, onChange?: (v: T) => void): [T, (v: T) => void] {
  const [inner, setInner] = React.useState(initial);
  return [value ?? inner, (v: T) => { setInner(v); onChange?.(v); }];
}

function Tree({
  nodes,
  expanded: expandedProp,
  defaultExpanded = [],
  onExpandedChange,
  selected: selectedProp,
  defaultSelected = null,
  onSelect,
  checkable = false,
  checked: checkedProp,
  defaultChecked = [],
  onCheckedChange,
  showIcons = true,
  countLabel = n => `${n} items`,
  className,
  ...props
}: TreeProps) {
  const [expanded, setExpanded] = useControlled(expandedProp, defaultExpanded, onExpandedChange);
  const [selected, setSelected] = useControlled<string | null>(selectedProp, defaultSelected, v => v && onSelect?.(v));
  const [checked, setChecked] = useControlled(checkedProp, defaultChecked, onCheckedChange);
  const [active, setActive] = React.useState<string | null>(null);
  const refs = React.useRef(new Map<string, HTMLLIElement>());

  const visible: Flat[] = [];
  const walk = (list: TreeNode[], level: number, parent: string | null) => {
    for (const node of list) {
      visible.push({ node, level, parent });
      if (node.children?.length && expanded.includes(node.id)) walk(node.children, level + 1, node.id);
    }
  };
  walk(nodes, 0, null);
  const focusId = active && visible.some(v => v.node.id === active) ? active : (selected && visible.some(v => v.node.id === selected) ? selected : visible[0]?.node.id);

  const move = (id: string | undefined) => {
    if (!id) return;
    setActive(id);
    refs.current.get(id)?.focus();
  };
  const toggleExpand = (id: string, open: boolean) => setExpanded(open ? [...expanded, id] : expanded.filter(x => x !== id));
  const checkState = (n: TreeNode): boolean | 'mixed' => {
    const leaves = leavesOf(n);
    const on = leaves.filter(l => checked.includes(l)).length;
    return on === 0 ? false : on === leaves.length ? true : 'mixed';
  };
  const toggleCheck = (n: TreeNode) => {
    const leaves = leavesOf(n);
    const state = checkState(n);
    setChecked(state === true ? checked.filter(c => !leaves.includes(c)) : Array.from(new Set([...checked, ...leaves])));
  };

  const onKeyDown = (e: React.KeyboardEvent, f: Flat) => {
    const i = visible.findIndex(v => v.node.id === f.node.id);
    const hasKids = !!f.node.children?.length;
    const isOpen = expanded.includes(f.node.id);
    const keys: Record<string, () => void> = {
      ArrowDown: () => move(visible[i + 1]?.node.id),
      ArrowUp: () => move(visible[i - 1]?.node.id),
      Home: () => move(visible[0]?.node.id),
      End: () => move(visible[visible.length - 1]?.node.id),
      ArrowRight: () => { if (hasKids && !isOpen) toggleExpand(f.node.id, true); else if (hasKids) move(visible[i + 1]?.node.id); },
      ArrowLeft: () => { if (hasKids && isOpen) toggleExpand(f.node.id, false); else move(f.parent ?? undefined); },
      Enter: () => setSelected(f.node.id),
      ' ': () => (checkable ? toggleCheck(f.node) : setSelected(f.node.id)),
    };
    const fn = keys[e.key];
    if (!fn) return;
    e.preventDefault();
    e.stopPropagation();
    fn();
  };

  const renderList = (list: TreeNode[], level: number, parent: string | null): React.ReactNode =>
    list.map(node => {
      const f: Flat = { node, level, parent };
      const hasKids = !!node.children?.length;
      const isOpen = hasKids && expanded.includes(node.id);
      const isSelected = selected === node.id;
      const cs = checkable ? checkState(node) : undefined;
      return (
        <li
          key={node.id}
          ref={el => { if (el) refs.current.set(node.id, el); else refs.current.delete(node.id); }}
          role="treeitem"
          aria-level={level + 1}
          aria-expanded={hasKids ? isOpen : undefined}
          aria-selected={isSelected}
          aria-checked={cs}
          tabIndex={focusId === node.id ? 0 : -1}
          onKeyDown={e => onKeyDown(e, f)}
          onFocus={e => { if (e.target === e.currentTarget) setActive(node.id); }}
          onClick={e => { e.stopPropagation(); setActive(node.id); setSelected(node.id); }}
          className="outline-none [&:focus-visible>[data-slot=tree-row]]:ring-[3px] [&:focus-visible>[data-slot=tree-row]]:ring-ring/50"
        >
          <div
            data-slot="tree-row"
            data-selected={isSelected || undefined}
            className={cn(
              'flex h-8 min-w-0 cursor-default items-center gap-1 rounded-md pr-2 text-sm leading-5 select-none hover:bg-muted',
              isSelected ? 'bg-accent font-medium text-accent-foreground hover:bg-accent' : 'text-foreground',
            )}
            style={{ paddingLeft: 8 + level * 16 }}
          >
            <span
              aria-hidden="true"
              data-slot="tree-chevron"
              onClick={e => { if (hasKids) { e.stopPropagation(); setActive(node.id); toggleExpand(node.id, !isOpen); } }}
              className="flex size-4 shrink-0 items-center justify-center [&_svg]:size-4"
            >
              {hasKids ? (isOpen ? <ChevronDown /> : <ChevronRight />) : null}
            </span>
            {checkable ? (
              <span
                aria-hidden="true"
                data-slot="tree-checkbox"
                onClick={e => { e.stopPropagation(); setActive(node.id); toggleCheck(node); }}
                className={cn(
                  'flex size-4 shrink-0 items-center justify-center rounded-sm border shadow-xs [&_svg]:size-3',
                  cs ? 'border-primary bg-primary text-primary-foreground' : 'border-input bg-background',
                )}
              >
                {cs === true ? <Check /> : cs === 'mixed' ? <Minus /> : null}
              </span>
            ) : null}
            {showIcons ? <span aria-hidden="true" className="flex shrink-0 [&_svg]:size-4">{node.icon ?? <FileText />}</span> : null}
            <span title={node.label} className="min-w-0 flex-1 truncate">{node.label}</span>
            {node.count != null ? (
              <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-secondary px-1.5 text-xs leading-4 font-medium text-secondary-foreground">
                <span aria-hidden="true">{node.count > 99 ? '99+' : node.count}</span>
                <span className="sr-only">, {countLabel(node.count)}</span>
              </span>
            ) : null}
          </div>
          {isOpen ? <ul role="group" className="m-0 flex list-none flex-col p-0">{renderList(node.children!, level + 1, node.id)}</ul> : null}
        </li>
      );
    });

  return (
    <ul data-slot="tree" role="tree" aria-multiselectable={checkable || undefined} className={cn('m-0 flex min-w-0 list-none flex-col p-0', className)} {...props}>
      {renderList(nodes, 0, null)}
    </ul>
  );
}

export { Tree };
