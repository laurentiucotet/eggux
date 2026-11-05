// EGG UI Table Cell Tree. Figma: Table page / Table Cell Tree (304:3298, 12 variants, node 1097:102961).
// First-column content of a tree row: indent 24 per level (Level 0 to 3), an expander (collapsed
// chevron right, expanded chevron down, none keeps the 20 px space), an optional icon and a label
// that ends with an ellipsis. Level 0 is medium weight. The row owns role="treegrid" semantics
// (aria-level, aria-expanded); this cell gives the expander button its state and name, and
// ArrowRight / ArrowLeft on it expand and collapse.
import * as React from 'react';
import { ChevronDown, ChevronRight, Folder } from '@/components/icons';
import { cn } from '@/lib/utils';

export type TableCellTreeLevel = 0 | 1 | 2 | 3;
export type TableCellTreeExpander = 'collapsed' | 'expanded' | 'none';

export interface TableCellTreeProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  label: string;
  /** Figma Level: 0 to 3, 24 px of indent each. */
  level?: TableCellTreeLevel;
  /** Figma Expander: none = leaf row. */
  expander?: TableCellTreeExpander;
  /** Called with the new state when the expander is clicked or ArrowRight / ArrowLeft is pressed. */
  onExpandedChange?: (expand: boolean) => void;
  /** Figma "Show icon". */
  showIcon?: boolean;
  /** Figma "Icon" swap (default Folder). */
  icon?: React.ReactNode;
}

function TableCellTree({ label, level = 0, expander = 'none', onExpandedChange, showIcon = true, icon, className, style, ...props }: TableCellTreeProps) {
  const expanded = expander === 'expanded';
  return (
    <div
      data-slot="table-cell-tree"
      data-level={level}
      className={cn('flex w-full items-center gap-1.5', className)}
      style={{ paddingLeft: level * 24, minWidth: 120 + level * 24, ...style }}
      {...props}
    >
      {expander === 'none' ? (
        <span aria-hidden="true" className="size-5 shrink-0" />
      ) : (
        <button
          type="button"
          data-slot="table-cell-tree-expander"
          aria-expanded={expanded}
          aria-label={`${expanded ? 'Collapse' : 'Expand'} ${label}`}
          onClick={() => onExpandedChange?.(!expanded)}
          onKeyDown={e => {
            if (e.key === 'ArrowRight' && !expanded) { e.preventDefault(); onExpandedChange?.(true); }
            if (e.key === 'ArrowLeft' && expanded) { e.preventDefault(); onExpandedChange?.(false); }
          }}
          className="flex size-5 shrink-0 items-center justify-center rounded-sm outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          {expanded ? <ChevronDown className="size-4" aria-hidden="true" /> : <ChevronRight className="size-4" aria-hidden="true" />}
        </button>
      )}
      {showIcon && <span aria-hidden="true" className="flex size-4 shrink-0 items-center justify-center [&_svg]:size-4">{icon ?? <Folder />}</span>}
      <span data-slot="table-cell-tree-label" className={cn('min-w-12 flex-1 truncate text-sm text-foreground', level === 0 && 'font-medium')}>{label}</span>
    </div>
  );
}

export { TableCellTree };
