// EGG UI Column Settings and Column Settings Item. Figma: Table page, "Column Settings / Component"
// (1097:95575, item 1097:95574). A popover body that opens from "Columns" in the Data Grid Toolbar:
// Popover Header (put it in a PopoverContent) "Columns", a Search Field (more than 8 columns), the items (2 apart) and a Popover
// Footer (Reset, Cancel, Apply; off when changes apply at once). 288 wide, min 240, 12 / 8 padding,
// 8 gap. Item: 32 high, radius sm, 4 / 8 sides, 8 gap: a 16 grip, a checkbox, the label (body/small,
// truncates); hover accent; dragging lifts with shadow md; locked (the identifying column): checkbox
// on and disabled, muted label, a 14 lock and no grip. At least one column stays visible.
// A11y: the list is a listbox-free group of checkboxes; Space toggles; Alt + Up / Down moves the
// focused column. The grip drags with the pointer (hidden from screen readers; off while searching);
// a 2 px primary line shows where the column lands.
import * as React from 'react';
import { GripVertical, Lock } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Checkbox } from './checkbox';
import { usePointerReorder } from './use-pointer-reorder';
import { PopoverClose } from './popover';
import { PopoverFooter } from './popover-footer';
import { PopoverHeader } from './popover-header';
import { SearchField } from './search-field';

export interface ColumnDef {
  id: string;
  label: string;
  /** The identifying column: always shown, cannot move. */
  locked?: boolean;
}

export interface ColumnSettingsItemProps extends Omit<React.ComponentProps<'div'>, 'onChange'> {
  label: string;
  checked: boolean;
  locked?: boolean;
  dragging?: boolean;
  /** Drop indicator line before or after the row. */
  dropTarget?: false | 'before' | 'after';
  /** Pointer handlers for the grip (usePointerReorder). */
  gripProps?: React.HTMLAttributes<HTMLElement>;
  onCheckedChange?: (checked: boolean) => void;
  /** Alt + Up / Down. */
  onMove?: (delta: -1 | 1) => void;
  disabled?: boolean;
}

function ColumnSettingsItem({ label, checked, locked = false, dragging = false, dropTarget = false, gripProps, onCheckedChange, onMove, disabled, className, ...props }: ColumnSettingsItemProps) {
  return (
    <div
      data-slot="column-settings-item"
      data-locked={locked || undefined}
      data-dragging={dragging || undefined}
      onKeyDown={e => {
        if (!e.altKey || locked || !onMove) return;
        if (e.key === 'ArrowUp') { e.preventDefault(); onMove(-1); }
        if (e.key === 'ArrowDown') { e.preventDefault(); onMove(1); }
      }}
      className={cn(
        'relative flex h-8 w-full min-w-0 items-center gap-2 rounded-sm pr-2 pl-1 hover:bg-accent',
        dragging && 'bg-popover shadow-md',
        className,
      )}
      {...props}
    >
      {dropTarget ? <span aria-hidden="true" data-slot="drop-indicator" className={cn('absolute inset-x-0 h-0.5 rounded-full bg-primary', dropTarget === 'after' ? '-bottom-px' : '-top-px')} /> : null}
      <span aria-hidden="true" data-slot="column-grip" {...(locked ? {} : gripProps)} className={cn('flex size-4 shrink-0 text-muted-foreground [&_svg]:size-4', locked ? 'invisible' : 'cursor-grab active:cursor-grabbing')}><GripVertical /></span>
      <Checkbox
        checked={locked ? true : checked}
        disabled={locked || disabled}
        onCheckedChange={v => onCheckedChange?.(v === true)}
        label={<span className={cn('block truncate font-normal', locked ? 'text-muted-foreground' : 'text-foreground')}>{label}</span>}
        wrapperClassName="min-w-0 flex-1 [&_label]:min-w-0 [&_label]:flex-1"
      />
      {locked ? <><Lock aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground" /><span className="sr-only">Always shown</span></> : null}
    </div>
  );
}

export interface ColumnSettingsProps extends Omit<React.ComponentProps<'div'>, 'onChange'> {
  columns: ColumnDef[];
  /** Visible column ids, in order (all columns in `order`). */
  defaultVisible: string[];
  /** Apply with the new order and visible ids. */
  onApply?: (state: { order: string[]; visible: string[] }) => void;
  onCancel?: () => void;
  /** Figma Show search: on from 9 columns. */
  searchFrom?: number;
  /** Figma Show footer. Off applies every change at once through onApply. */
  showFooter?: boolean;
}

function ColumnSettings({ columns, defaultVisible, onApply, onCancel, searchFrom = 9, showFooter = true, className, ...props }: ColumnSettingsProps) {
  const initialOrder = columns.map(c => c.id);
  const [order, setOrder] = React.useState(initialOrder);
  const [visible, setVisible] = React.useState(defaultVisible);
  const [query, setQuery] = React.useState('');
  const byId = new Map(columns.map(c => [c.id, c]));
  const commit = (o: string[], v: string[]) => {
    setOrder(o);
    setVisible(v);
    if (!showFooter) onApply?.({ order: o, visible: v });
  };
  const move = (id: string, delta: -1 | 1) => {
    const i = order.indexOf(id);
    const j = i + delta;
    if (j < 0 || j >= order.length || byId.get(order[j]!)?.locked) return;
    const next = [...order];
    [next[i], next[j]] = [next[j]!, next[i]!];
    commit(next, visible);
    requestAnimationFrame(() => document.querySelector<HTMLElement>(`[data-column-id="${id}"] [role="checkbox"]`)?.focus());
  };
  const q = query.trim().toLowerCase();
  const pointer = usePointerReorder({ order, onReorder: next => commit(next, visible), isLocked: id => Boolean(byId.get(id)?.locked), disabled: Boolean(q) });
  const shown = order.filter(id => !q || byId.get(id)!.label.toLowerCase().includes(q));
  const visibleCount = visible.length;
  return (
    <div data-slot="column-settings" className={cn('flex w-72 min-w-60 flex-col gap-2 px-2 py-3', className)} {...props}>
      <PopoverHeader title="Columns" description="Show, hide and reorder columns." className="px-1" />
      {columns.length >= searchFrom ? <SearchField placeholder="Search columns" value={query} onValueChange={setQuery} /> : null}
      <div ref={pointer.containerRef as React.Ref<HTMLDivElement>} role="group" aria-label="Columns" className="flex flex-col gap-0.5">
        {shown.map((id, index) => {
          const c = byId.get(id)!;
          const on = visible.includes(id);
          return (
            <ColumnSettingsItem
              key={id}
              data-column-id={id}
              data-reorder-id={id}
              dragging={pointer.dragId === id}
              dropTarget={pointer.dragId && pointer.overIndex === index ? 'before' : pointer.dragId && pointer.overIndex === shown.length && index === shown.length - 1 ? 'after' : false}
              gripProps={pointer.gripProps(id)}
              label={c.label}
              locked={c.locked}
              checked={on}
              // Keep at least one column visible.
              disabled={on && visibleCount === 1}
              onCheckedChange={v => commit(order, v ? order.filter(x => x === id || visible.includes(x)) : visible.filter(x => x !== id))}
              onMove={d => move(id, d)}
            />
          );
        })}
      </div>
      {showFooter ? (
        <PopoverFooter
          className="px-1"
          start={<Button variant="ghost" size="sm" onClick={() => { setOrder(initialOrder); setVisible(defaultVisible); }}>Reset</Button>}
        >
          <PopoverClose asChild><Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button></PopoverClose>
          <PopoverClose asChild><Button size="sm" onClick={() => onApply?.({ order, visible: order.filter(id => visible.includes(id)) })}>Apply</Button></PopoverClose>
        </PopoverFooter>
      ) : null}
    </div>
  );
}

export { ColumnSettings, ColumnSettingsItem };
