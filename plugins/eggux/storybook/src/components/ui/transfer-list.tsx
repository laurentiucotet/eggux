// EGG UI Transfer List. Figma: Transfer List (Select page, "Transfer List / Component", 270:1065).
// Left title ("Available"), Right title ("Selected"); slots Available and Selected (Facet Option
// rows). Move items between two lists (permissions to a role, columns to a view, members to a group).
// 628 wide, min 512 (each list min 208, both fill equally), 16 px between the lists and the move
// buttons. Each list: card (background/card, border/default, radius lg); header 8 / 12 px with the
// title (ui/label, truncates to one line) and the count (ui/caption, muted); a Separator; an 8 px
// search Input (36, search icon); the items with 4 px padding: rows 32 high (6 / 8 px, 8 gap, radius
// sm) with a checkbox and the label. Between the lists two outline Button Icons (36): "Move to
// Selected" (chevron-right) and "Move to Available" (chevron-left); they act on the checked items
// only and are disabled while none is checked. Counts update after every move and the result is
// announced ("2 moved to Selected"). Space checks a row; Tab reaches the search, the rows and the
// buttons. For under ~10 items a list of checkboxes is simpler; under 512 use a searchable list.
// The rows are the Facet Option look (Filters page); TODO Facet Option: use it when it is in code.
import * as React from 'react';
import { ChevronLeft, ChevronRight, Search } from '@/components/icons';
import { cn } from '@/lib/utils';
import { ButtonIcon } from './button-icon';
import { Checkbox } from './checkbox';
import { Input } from './input';

export interface TransferListItem {
  value: string;
  label: string;
  /** Extra words that match the search. */
  keywords?: string[];
  disabled?: boolean;
}

export interface TransferListProps extends Omit<React.ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  /** Every item; the ones in `value` are on the right. */
  items: TransferListItem[];
  /** Values on the right (Selected) side (controlled). */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** Figma Left title. */
  leftTitle?: string;
  /** Figma Right title. */
  rightTitle?: string;
  countText?: (count: number) => string;
  searchPlaceholder?: string;
  /** Names of the move buttons. */
  moveRightLabel?: string;
  moveLeftLabel?: string;
  /** Announced after a move: "2 moved to Selected". */
  movedText?: (count: number, to: string) => string;
  emptyText?: (query: string) => string;
  disabled?: boolean;
}

function matches(item: TransferListItem, query: string) {
  const q = query.trim().toLocaleLowerCase();
  if (!q) return true;
  return [item.label, ...(item.keywords ?? [])].some(t => t.toLocaleLowerCase().includes(q));
}

interface SideProps {
  title: string;
  count: string;
  items: TransferListItem[];
  checked: string[];
  onCheckedChange: (next: string[]) => void;
  searchPlaceholder: string;
  emptyText: (query: string) => string;
  side: 'available' | 'selected';
}

function Side({ title, count, items, checked, onCheckedChange, searchPlaceholder, emptyText, side }: SideProps) {
  const id = React.useId();
  const [query, setQuery] = React.useState('');
  const shown = items.filter(i => matches(i, query));
  return (
    <section
      aria-labelledby={`${id}-title`}
      data-slot="transfer-list-side"
      data-side={side}
      className="flex min-w-52 flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground"
    >
      <header data-slot="transfer-list-header" className="flex min-w-0 items-center gap-2 border-b border-border px-3 py-2">
        <h3 id={`${id}-title`} title={title} className="m-0 min-w-0 flex-1 truncate text-sm leading-5 font-medium text-card-foreground">{title}</h3>
        <span data-slot="transfer-list-count" className="shrink-0 text-xs leading-4 text-muted-foreground">{count}</span>
      </header>
      <div className="relative p-2">
        <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          aria-label={`Search ${title}`}
          placeholder={searchPlaceholder}
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      <div role="group" aria-labelledby={`${id}-title`} data-slot="transfer-list-items" className="max-h-75 overflow-y-auto overscroll-contain p-1">
        {shown.map(item => {
          const cid = `${id}-${item.value}`;
          const isChecked = checked.includes(item.value);
          return (
            <div
              key={item.value}
              data-slot="transfer-list-item"
              data-disabled={item.disabled || undefined}
              className={cn('flex min-w-0 items-center gap-2 rounded-sm px-2 py-1.5 hover:bg-accent', item.disabled && 'opacity-50 hover:bg-transparent')}
            >
              <Checkbox
                id={cid}
                checked={isChecked}
                disabled={item.disabled}
                onCheckedChange={c => onCheckedChange(c === true ? [...checked, item.value] : checked.filter(v => v !== item.value))}
              />
              <label htmlFor={cid} title={item.label} className={cn('min-w-0 flex-1 truncate text-sm leading-5 text-foreground', item.disabled ? 'cursor-not-allowed' : 'cursor-pointer')}>
                {item.label}
              </label>
            </div>
          );
        })}
        {shown.length === 0 ? <p className="m-0 px-2 py-1.5 text-sm leading-5 text-muted-foreground">{emptyText(query.trim())}</p> : null}
      </div>
    </section>
  );
}

function TransferList({
  items,
  value: valueProp,
  defaultValue,
  onValueChange,
  leftTitle = 'Available',
  rightTitle = 'Selected',
  countText = n => `${n} ${n === 1 ? 'item' : 'items'}`,
  searchPlaceholder = 'Search…',
  moveRightLabel,
  moveLeftLabel,
  movedText = (n, to) => `${n} moved to ${to}`,
  emptyText = q => (q ? `No matches for “${q}”` : 'No items'),
  disabled = false,
  className,
  ...props
}: TransferListProps) {
  const [inner, setInner] = React.useState<string[]>(defaultValue ?? []);
  const value = valueProp ?? inner;
  const [checkedLeft, setCheckedLeft] = React.useState<string[]>([]);
  const [checkedRight, setCheckedRight] = React.useState<string[]>([]);
  const [announce, setAnnounce] = React.useState('');

  const left = items.filter(i => !value.includes(i.value));
  const right = items.filter(i => value.includes(i.value));
  // Only checked items that are still on that side count.
  const leftChecked = checkedLeft.filter(v => left.some(i => i.value === v));
  const rightChecked = checkedRight.filter(v => right.some(i => i.value === v));

  const commit = (next: string[]) => {
    setInner(next);
    onValueChange?.(next);
  };
  const moveRight = () => {
    // Keep the order of `items` on the right.
    const next = items.filter(i => value.includes(i.value) || leftChecked.includes(i.value)).map(i => i.value);
    commit(next);
    setAnnounce(movedText(leftChecked.length, rightTitle));
    setCheckedLeft([]);
  };
  const moveLeft = () => {
    commit(value.filter(v => !rightChecked.includes(v)));
    setAnnounce(movedText(rightChecked.length, leftTitle));
    setCheckedRight([]);
  };

  return (
    <div
      data-slot="transfer-list"
      className={cn('grid min-w-[512px] grid-cols-[minmax(13rem,1fr)_auto_minmax(13rem,1fr)] items-center gap-4', className)}
      {...props}
    >
      <fieldset disabled={disabled} className="contents">
        <Side
          side="available"
          title={leftTitle}
          count={countText(left.length)}
          items={left}
          checked={leftChecked}
          onCheckedChange={setCheckedLeft}
          searchPlaceholder={searchPlaceholder}
          emptyText={emptyText}
        />
        <div data-slot="transfer-list-move" className="flex flex-col gap-2">
          <ButtonIcon variant="outline" icon={<ChevronRight />} label={moveRightLabel ?? `Move to ${rightTitle}`} disabled={disabled || leftChecked.length === 0} onClick={moveRight} tooltipSide="right" />
          <ButtonIcon variant="outline" icon={<ChevronLeft />} label={moveLeftLabel ?? `Move to ${leftTitle}`} disabled={disabled || rightChecked.length === 0} onClick={moveLeft} tooltipSide="left" />
        </div>
        <Side
          side="selected"
          title={rightTitle}
          count={countText(right.length)}
          items={right}
          checked={rightChecked}
          onCheckedChange={setCheckedRight}
          searchPlaceholder={searchPlaceholder}
          emptyText={emptyText}
        />
      </fieldset>
      <span role="status" className="sr-only">{announce}</span>
    </div>
  );
}

export { TransferList };
