// EGG UI Select Option and the listbox parts. Figma: Select Option (Select page, "Select Option /
// Component"): Type (icon, avatar, none, create) x State (default, highlighted); Title, Description
// (Show description), Checked, Icon (swap, default building), Create label. A rich option for
// Select, Combobox and Menu lists: 32 px icon tile or avatar, title in ui/label, a muted ui/caption
// second line, a check when selected; 6/8 px padding, 8 gap, radius sm, highlighted = accent.
// Type=create is the last option when the query matches nothing ("Create "Urgent"").
//
// The listbox parts are the shared base of Combobox, Tag Input and the pickers built on them
// (People Picker, Person Option, Transfer List, Address Autocomplete): WAI-ARIA listbox with
// aria-activedescendant. Focus stays in the input (or the listbox itself); `useListbox` moves the
// highlighted option with the arrows and picks it with Enter; options are role="option" with
// aria-selected = Checked. Pointer: hover highlights, click picks, mousedown never steals focus.
//   const lb = useListbox({ items, onSelect });
//   <input role="combobox" aria-controls={lb.listboxId} aria-activedescendant={lb.activeId} onKeyDown={lb.onKeyDown} />
//   <Listbox state={lb} aria-label="Customers"><SelectOption value="nw" title="Northwind" /></Listbox>
import * as React from 'react';
import { Building, Check, Plus } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Avatar, type AvatarProps } from './avatar';
import { IconTile } from './icon-tile';
import { Spinner } from './spinner';
import { statusDotVariants } from './status-dot';

/* ------------------------------------------------------------------------------------------------
 * useListbox: the highlighted option, keyboard and ids. Headless, so any input can drive it.
 * ----------------------------------------------------------------------------------------------*/

export interface ListboxItemRef {
  value: string;
  disabled?: boolean;
}

export interface UseListboxOptions {
  /** The options in display order (after filtering). */
  items: ListboxItemRef[];
  /** Enter on the highlighted option, or a click. */
  onSelect: (value: string) => void;
  /** Option highlighted first (the selected value). Default: the first enabled option. */
  initialActive?: string;
  /** Highlight the first option when the list changes (typing filters). Default true. */
  autoHighlight?: boolean;
  /** Home and End move in the list. Off inside a text input, where they move the caret. */
  homeEnd?: boolean;
  /** Id of the listbox; generated when not given. */
  id?: string;
}

export interface ListboxState {
  listboxId: string;
  activeValue: string | undefined;
  setActiveValue: (value: string | undefined) => void;
  /** Id of the highlighted option, for aria-activedescendant. */
  activeId: string | undefined;
  optionId: (value: string) => string;
  /** Arrows, Enter (and Home/End when enabled). Returns true when it handled the key. */
  onKeyDown: (event: React.KeyboardEvent) => boolean;
  select: (value: string) => void;
}

function useListbox({ items, onSelect, initialActive, autoHighlight = true, homeEnd = false, id }: UseListboxOptions): ListboxState {
  const autoId = React.useId();
  const listboxId = id ?? `${autoId}-listbox`;
  const enabled = items.filter(i => !i.disabled);
  const firstEnabled = enabled[0]?.value;
  const [active, setActive] = React.useState<string | undefined>(
    initialActive && enabled.some(i => i.value === initialActive) ? initialActive : autoHighlight ? firstEnabled : undefined,
  );
  // Keep the highlight on an option that still exists: typing filters the list.
  const key = items.map(i => `${i.value}${i.disabled ? '!' : ''}`).join('\u0000');
  React.useEffect(() => {
    if (active !== undefined && enabled.some(i => i.value === active)) return;
    setActive(autoHighlight ? firstEnabled : undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Ids must be valid for querySelector and unique per listbox.
  const optionId = React.useCallback((value: string) => `${listboxId}-o-${encodeURIComponent(value).replace(/[^a-zA-Z0-9_-]/g, '_')}`, [listboxId]);
  const select = React.useCallback((value: string) => {
    const item = items.find(i => i.value === value);
    if (!item || item.disabled) return;
    setActive(value);
    onSelect(value);
  }, [items, onSelect]);

  const onKeyDown = (e: React.KeyboardEvent): boolean => {
    if (e.altKey || e.ctrlKey || e.metaKey || !enabled.length) return false;
    const i = enabled.findIndex(o => o.value === active);
    let next: string | undefined;
    if (e.key === 'ArrowDown') next = enabled[i < 0 ? 0 : Math.min(enabled.length - 1, i + 1)].value;
    else if (e.key === 'ArrowUp') next = enabled[i < 0 ? enabled.length - 1 : Math.max(0, i - 1)].value;
    else if (homeEnd && e.key === 'Home') next = enabled[0].value;
    else if (homeEnd && e.key === 'End') next = enabled[enabled.length - 1].value;
    else if (e.key === 'Enter' && active !== undefined) {
      e.preventDefault();
      select(active);
      return true;
    } else return false;
    e.preventDefault();
    setActive(next);
    return true;
  };

  return { listboxId, activeValue: active, setActiveValue: setActive, activeId: active !== undefined ? optionId(active) : undefined, optionId, onKeyDown, select };
}

const ListboxContext = React.createContext<ListboxState | null>(null);

/** Option state inside a Listbox: id, highlighted and the pointer handlers. */
function useListboxOption(value: string | undefined, disabled?: boolean) {
  const ctx = React.useContext(ListboxContext);
  if (!ctx || value === undefined) return { id: undefined, highlighted: undefined, handlers: {} };
  return {
    id: ctx.optionId(value),
    highlighted: ctx.activeValue === value,
    handlers: {
      // Keep focus in the input that drives the list.
      onMouseDown: (e: React.MouseEvent) => e.preventDefault(),
      onMouseMove: () => { if (!disabled && ctx.activeValue !== value) ctx.setActiveValue(value); },
      onClick: () => { if (!disabled) ctx.select(value); },
    },
  };
}

/* ------------------------------------------------------------------------------------------------
 * Listbox, groups, empty and loading rows
 * ----------------------------------------------------------------------------------------------*/

export interface ListboxProps extends React.ComponentProps<'div'> {
  /** The state from useListbox. */
  state: ListboxState;
  /** Several values can be checked (Tag Input, People Picker); the list stays open while picking. */
  multiple?: boolean;
}

/** role="listbox" with the options. Scrolls the highlighted option into view (inside the list only). */
function Listbox({ state, multiple, className, children, ...props }: ListboxProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const list = ref.current;
    const el = state.activeId ? list?.querySelector<HTMLElement>(`[id="${state.activeId}"]`) : null;
    if (!list || !el) return;
    const top = el.getBoundingClientRect().top - list.getBoundingClientRect().top + list.scrollTop;
    if (top < list.scrollTop) list.scrollTop = top;
    else if (top + el.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = top + el.offsetHeight - list.clientHeight;
  }, [state.activeId]);
  return (
    <ListboxContext.Provider value={state}>
      <div
        ref={ref}
        id={state.listboxId}
        role="listbox"
        aria-multiselectable={multiple || undefined}
        data-slot="listbox"
        className={cn('max-h-75 overflow-y-auto overscroll-contain p-1 outline-none', className)}
        {...props}
      >
        {children}
      </div>
    </ListboxContext.Provider>
  );
}

export interface ListboxGroupProps extends React.ComponentProps<'div'> {
  /** Figma Menu Label: the group heading ("Countries", "Recent"). */
  label: React.ReactNode;
}

/** A group of options under a Menu Label heading. */
function ListboxGroup({ label, className, children, ...props }: ListboxGroupProps) {
  const id = React.useId();
  return (
    <div role="group" aria-labelledby={id} data-slot="listbox-group" className={className} {...props}>
      <div id={id} data-slot="listbox-label" className="px-2 py-1.5 text-sm leading-5 font-medium text-popover-foreground">{label}</div>
      {children}
    </div>
  );
}

/** Figma Separator between groups (decorative: a listbox only holds options and groups). */
function ListboxSeparator({ className, ...props }: React.ComponentProps<'div'>) {
  return <div aria-hidden="true" data-slot="listbox-separator" className={cn('-mx-1 my-1 h-px bg-border', className)} {...props} />;
}

/** "No results for …" / "Loading…": a polite status next to the listbox, so it is announced. */
function ListboxStatus({ loading, className, children, ...props }: React.ComponentProps<'div'> & { loading?: boolean }) {
  return (
    <div role="status" data-slot="listbox-status" className={cn('flex items-center justify-center gap-2 px-2 py-6 text-center text-sm text-muted-foreground empty:hidden', className)} {...props}>
      {loading ? <Spinner size="sm" aria-hidden="true" /> : null}
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Options
 * ----------------------------------------------------------------------------------------------*/

const optionBase =
  "relative flex w-full min-w-0 cursor-default select-none items-center gap-2 rounded-sm px-2 text-left text-popover-foreground outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";

type StatusDotStatus = 'success' | 'warning' | 'error' | 'info' | 'neutral';

export interface ListboxItemProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  /** The option value; picks it when clicked or Enter is pressed while highlighted. */
  value: string;
  /** Figma Checked: the check at the end, aria-selected. */
  checked?: boolean;
  disabled?: boolean;
  /** Static highlight (docs) when the option is not inside a Listbox. */
  highlighted?: boolean;
  /** Leading icon (16, muted), as Menu Item Show leading icon. */
  icon?: React.ReactNode;
  /** Leading Avatar xs for people. */
  avatar?: Omit<AvatarProps, 'size'>;
  /** Leading Status Dot (8 px) for status and priority. */
  status?: StatusDotStatus;
  /** Muted second line. */
  description?: React.ReactNode;
}

/** Figma Menu Item in a Combobox or multi-select list: one line, optional leading, check at the end. */
function ListboxItem({ value, checked = false, disabled, highlighted, icon, avatar, status, description, className, children, ...props }: ListboxItemProps) {
  const opt = useListboxOption(value, disabled);
  const isHighlighted = highlighted ?? opt.highlighted;
  return (
    <div
      id={opt.id}
      role="option"
      aria-selected={checked}
      aria-disabled={disabled || undefined}
      data-slot="listbox-item"
      data-value={value}
      data-highlighted={isHighlighted || undefined}
      className={cn('group/item py-[var(--menu-padding-y)] text-sm leading-5', optionBase, className)}
      {...opt.handlers}
      {...props}
    >
      {icon ? <span aria-hidden="true" className="flex text-muted-foreground group-data-[highlighted]/item:text-current">{icon}</span> : null}
      {avatar ? <Avatar {...avatar} size="xs" aria-hidden="true" className={cn('shrink-0', avatar.className)} /> : null}
      {status ? <span aria-hidden="true" className={statusDotVariants({ status })} /> : null}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate">{children}</span>
        {description ? <span className="truncate text-xs leading-4 text-muted-foreground group-data-[highlighted]/item:text-current">{description}</span> : null}
      </span>
      {checked ? <Check aria-hidden="true" className="ml-auto" /> : null}
    </div>
  );
}

export type SelectOptionType = 'icon' | 'avatar' | 'none' | 'create';

export interface SelectOptionProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  /** The option value. Type=create: any value the list treats as "create" (picks call create). */
  value: string;
  /** Figma Type: the same for every option in one list; create is the only exception, always last. */
  type?: SelectOptionType;
  /** Figma Title. */
  title?: string;
  /** Figma Description (Show description): one short muted line, "Customer · Berlin". */
  description?: string;
  /** Figma Checked: the selected option, aria-selected. */
  checked?: boolean;
  disabled?: boolean;
  /** Figma State=highlighted, for a static option outside a Listbox. Inside one the list decides. */
  highlighted?: boolean;
  /** Figma Icon (Type=icon), in a 32 px muted tile. Default Building. */
  icon?: React.ReactNode;
  /** Type=avatar: the Avatar (default size, 32). */
  avatar?: Omit<AvatarProps, 'size'>;
  /** Figma Create label (Type=create): 'Create "Urgent"', "Invite anna@acme.com". */
  createLabel?: string;
}

/** Figma Select Option: a rich, two-line option. Title and description are read together as its name. */
function SelectOption({
  value,
  type = 'icon',
  title = 'Northwind Traders',
  description,
  checked = false,
  disabled,
  highlighted,
  icon,
  avatar,
  createLabel = 'Create "Urgent"',
  className,
  ...props
}: SelectOptionProps) {
  const opt = useListboxOption(value, disabled);
  const isHighlighted = highlighted ?? opt.highlighted;
  const isCreate = type === 'create';
  const lead =
    type === 'icon' ? <IconTile size="sm" icon={icon ?? <Building />} />
      : isCreate ? <IconTile size="sm" icon={<Plus />} />
        : type === 'avatar' ? <Avatar initials="NT" {...avatar} size="default" aria-hidden="true" className={cn('shrink-0', avatar?.className)} />
          : null;
  const titleText = isCreate ? createLabel : title;
  return (
    <div
      id={opt.id}
      role="option"
      aria-selected={checked}
      aria-disabled={disabled || undefined}
      data-slot="select-option"
      data-type={type}
      data-value={value}
      data-highlighted={isHighlighted || undefined}
      className={cn('group/item py-1.5', optionBase, className)}
      {...opt.handlers}
      {...props}
    >
      {lead}
      <span className="flex min-w-0 flex-1 flex-col">
        <span data-slot="select-option-title" title={titleText} className="truncate text-sm leading-5 font-medium">
          {titleText}
        </span>
        {description && !isCreate ? (
          <>
            <span data-slot="select-option-description" title={description} className="truncate text-xs leading-4 text-muted-foreground group-data-[highlighted]/item:text-current">{description}</span>
          </>
        ) : null}
      </span>
      {checked && !isCreate ? <Check aria-hidden="true" className="ml-auto" /> : null}
    </div>
  );
}

export { useListbox, Listbox, ListboxGroup, ListboxSeparator, ListboxStatus, ListboxItem, SelectOption, ListboxContext };
