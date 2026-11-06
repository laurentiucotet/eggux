// EGG UI Command and Command Input. Figma: Command (symbol 85:11) and Command Input (symbol 85:7)
// on the Popover page ("Command / Component"). The shadcn Command pattern without cmdk: a search
// input over a filtered listbox. Base of Command Dialog, Combobox-style pickers and mention pickers.
// Command Input: control-height (density) high, 12 px sides, 16 px muted search icon 8 px from the
// text (body/small), borderless with a bottom divider (border/default).
// Items slot: 4 px padding; Menu Label group headings (ui/label, 8 / 6 px padding) and Menu Item
// rows (8 px sides, menu-padding-y, radius sm, body/small, 16 px icons; highlighted = accent;
// Checked = a check at the end; Shortcut in ui/caption muted). Empty: "No results found."
// (body/small muted, 24 px above and below), announced through a status region.
// The Command itself has no surface: Figma's 288 wide panel with border, radius md and shadow md
// comes from the container (PopoverContent className="w-72 p-0", or Command Dialog).
// Keyboard (WAI-ARIA combobox with listbox popup): focus stays in the input, which carries
// aria-activedescendant; Down / Up move the highlight, Home / End jump to the first / last option,
// Enter picks; typing filters and highlights the first match; disabled options are skipped.
import * as React from 'react';
import { Check, Search } from '@/components/icons';
import { cn } from '@/lib/utils';

type FilterFn = (value: string, search: string, keywords?: string[]) => boolean;

/** Lowercase, without diacritics: "Brașov" matches "bras". */
function normalize(text: string) {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

const defaultFilter: FilterFn = (value, search, keywords) => {
  const query = normalize(search.trim());
  if (!query) return true;
  return [value, ...(keywords ?? [])].some(text => normalize(text).includes(query));
};

/** Plain text of a React node, used as the item value when `value` is not given. */
function nodeText(node: React.ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join('');
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) return nodeText(node.props.children);
  return '';
}

interface CommandContextValue {
  search: string;
  setSearch: (search: string) => void;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  matches: (value: string, keywords?: string[]) => boolean;
  filtering: boolean;
  listId: string;
  label?: string;
  loading: boolean;
  visibleCount: number;
  handlers: React.RefObject<Map<string, () => void>>;
}

const CommandContext = React.createContext<CommandContextValue | null>(null);

function useCommand(component: string) {
  const ctx = React.useContext(CommandContext);
  if (!ctx) throw new Error(`<${component}> must be used inside <Command>`);
  return ctx;
}

export interface CommandProps extends Omit<React.ComponentProps<'div'>, 'onChange'> {
  /** Accessible name of the input and the list ("Countries", "Command palette"). */
  label?: string;
  /** Controlled search text. */
  search?: string;
  defaultSearch?: string;
  onSearchChange?: (search: string) => void;
  /** Off when the items are already filtered (server search): every item shows. Default true. */
  shouldFilter?: boolean;
  /** Custom match: value, search and keywords; return true to show the item. */
  filter?: FilterFn;
  /** Wrap from the last option to the first with the arrows. Default false. */
  loop?: boolean;
  /** Results are loading: the list is aria-busy and Empty stays hidden. */
  loading?: boolean;
}

function Command({
  label,
  search: searchProp,
  defaultSearch = '',
  onSearchChange,
  shouldFilter = true,
  filter = defaultFilter,
  loop = false,
  loading = false,
  className,
  onKeyDown,
  children,
  ...props
}: CommandProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultSearch);
  const search = searchProp ?? uncontrolled;
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [ids, setIds] = React.useState<string[]>([]);
  const [visibleCount, setVisibleCount] = React.useState(0);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const handlers = React.useRef(new Map<string, () => void>());
  const lastSearch = React.useRef<string | null>(null);
  const listId = `${React.useId()}-list`;

  const setSearch = React.useCallback(
    (next: string) => {
      if (searchProp === undefined) setUncontrolled(next);
      onSearchChange?.(next);
    },
    [searchProp, onSearchChange],
  );

  // Read the rendered options in DOM order after every render: the order the keyboard follows,
  // the count Empty needs, and a highlight that always points at an enabled, visible option.
  React.useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const options = Array.from(root.querySelectorAll<HTMLElement>('[data-slot="command-item"]')).filter(
      el => el.closest('[data-slot="command"]') === root,
    );
    const enabled = options.filter(el => el.getAttribute('aria-disabled') !== 'true').map(el => el.id);
    if (options.length !== visibleCount) setVisibleCount(options.length);
    if (enabled.join('|') !== ids.join('|')) setIds(enabled);
    const searchChanged = lastSearch.current !== search;
    lastSearch.current = search;
    if (searchChanged || activeId === null || !enabled.includes(activeId)) {
      const next = enabled[0] ?? null;
      if (next !== activeId) setActiveId(next);
    }
  });

  React.useEffect(() => {
    if (!activeId) return;
    document.getElementById(activeId)?.scrollIntoView?.({ block: 'nearest' });
  }, [activeId]);

  const ctx = React.useMemo<CommandContextValue>(
    () => ({
      search,
      setSearch,
      activeId,
      setActiveId,
      matches: (value, keywords) => !shouldFilter || filter(value, search, keywords),
      filtering: shouldFilter && search.trim() !== '',
      listId,
      label,
      loading,
      visibleCount,
      handlers,
    }),
    [search, setSearch, activeId, shouldFilter, filter, listId, label, loading, visibleCount],
  );

  const move = (to: 'next' | 'prev' | 'first' | 'last') => {
    if (ids.length === 0) return;
    const index = activeId ? ids.indexOf(activeId) : -1;
    let next = index;
    if (to === 'first') next = 0;
    else if (to === 'last') next = ids.length - 1;
    else if (to === 'next') next = index + 1 >= ids.length ? (loop ? 0 : ids.length - 1) : index + 1;
    else next = index - 1 < 0 ? (loop ? ids.length - 1 : 0) : index - 1;
    setActiveId(ids[next]);
  };

  return (
    <CommandContext.Provider value={ctx}>
      <div
        ref={rootRef}
        data-slot="command"
        className={cn('flex w-full min-w-0 flex-col overflow-hidden bg-popover text-popover-foreground', className)}
        onKeyDown={event => {
          onKeyDown?.(event);
          if (event.defaultPrevented || event.nativeEvent.isComposing) return;
          const keys: Record<string, 'next' | 'prev' | 'first' | 'last'> = { ArrowDown: 'next', ArrowUp: 'prev', Home: 'first', End: 'last' };
          if (keys[event.key]) {
            event.preventDefault();
            move(keys[event.key]);
          } else if (event.key === 'Enter' && activeId) {
            event.preventDefault();
            handlers.current.get(activeId)?.();
          }
        }}
        {...props}
      >
        {children}
      </div>
    </CommandContext.Provider>
  );
}

export interface CommandInputProps extends Omit<React.ComponentProps<'input'>, 'value' | 'onChange' | 'type'> {
  /** Class of the row around the input (height, padding, divider). */
  wrapperClassName?: string;
}

/** Figma Command Input: the search field at the top of the list. Value = the placeholder. */
function CommandInput({ className, wrapperClassName, placeholder = 'Search…', ...props }: CommandInputProps) {
  const ctx = useCommand('CommandInput');
  return (
    <div
      data-slot="command-input-wrapper"
      className={cn('flex h-[var(--control-height)] shrink-0 items-center gap-2 border-b border-border px-3', wrapperClassName)}
    >
      <Search aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
      <input
        data-slot="command-input"
        type="text"
        role="combobox"
        aria-expanded="true"
        aria-controls={ctx.listId}
        aria-autocomplete="list"
        aria-activedescendant={ctx.activeId ?? undefined}
        aria-label={props['aria-labelledby'] ? undefined : (ctx.label ?? placeholder)}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        placeholder={placeholder}
        value={ctx.search}
        onChange={event => ctx.setSearch(event.target.value)}
        className={cn(
          'h-full min-w-0 flex-1 bg-transparent text-sm leading-5 text-popover-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
    </div>
  );
}

function isSlot(child: React.ReactNode, component: React.ElementType) {
  return React.isValidElement(child) && child.type === component;
}

/**
 * Figma Items slot: the scroll area with the listbox. Empty and Loading rows render next to the
 * listbox (a listbox may only hold options and groups), wherever they are placed in the children.
 */
function CommandList({ className, children, ...props }: React.ComponentProps<'div'>) {
  const ctx = useCommand('CommandList');
  const all = React.Children.toArray(children);
  const outside = all.filter(child => isSlot(child, CommandEmpty) || isSlot(child, CommandLoading));
  const inside = all.filter(child => !outside.includes(child));
  return (
    <div data-slot="command-list" className={cn('max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto', className)} {...props}>
      <div
        role="listbox"
        id={ctx.listId}
        aria-label={ctx.label}
        aria-busy={ctx.loading || undefined}
        className={cn('p-1', ctx.visibleCount === 0 && 'hidden')}
      >
        {inside}
      </div>
      {outside}
    </div>
  );
}

/** Figma Show empty: "No results found.", announced to screen readers when it appears. */
function CommandEmpty({ className, children = 'No results found.', ...props }: React.ComponentProps<'div'>) {
  const ctx = useCommand('CommandEmpty');
  const empty = ctx.visibleCount === 0 && !ctx.loading;
  return (
    <div role="status" data-slot="command-empty" {...props}>
      {empty ? <div className={cn('px-2 py-6 text-center text-sm leading-5 text-muted-foreground', className)}>{children}</div> : null}
    </div>
  );
}

/** Loading row for results that arrive asynchronously; never an empty list while loading. */
function CommandLoading({ className, children = 'Loading…', ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      role="status"
      data-slot="command-loading"
      className={cn('flex items-center gap-2 px-3 py-2 text-sm leading-5 text-muted-foreground', className)}
      {...props}
    >
      <span aria-hidden="true" className="size-4 shrink-0 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent motion-reduce:animate-none" />
      {children}
    </div>
  );
}

export interface CommandGroupProps extends Omit<React.ComponentProps<'div'>, 'heading'> {
  /** Figma Menu Label: the group heading ("Suggestions", "Pages"). */
  heading?: React.ReactNode;
}

/** A group of options under a Menu Label heading; hidden while none of its options match. */
function CommandGroup({ heading, className, children, ...props }: CommandGroupProps) {
  const headingId = `${React.useId()}-heading`;
  return (
    <div
      role="group"
      data-slot="command-group"
      aria-labelledby={heading != null ? headingId : undefined}
      className={cn('[&:not(:has([data-slot=command-item]))]:hidden', className)}
      {...props}
    >
      {heading != null ? (
        <div id={headingId} data-slot="command-group-heading" className="truncate px-2 py-1.5 text-sm leading-5 font-medium text-popover-foreground">
          {heading}
        </div>
      ) : null}
      {children}
    </div>
  );
}

/** Figma Separator Spacing=sm between groups; hidden while filtering. */
function CommandSeparator({ className, ...props }: React.ComponentProps<'div'>) {
  const ctx = useCommand('CommandSeparator');
  if (ctx.filtering) return null;
  return <div aria-hidden="true" data-slot="command-separator" className={cn('-mx-1 my-1 h-px bg-border', className)} {...props} />;
}

export interface CommandItemProps extends Omit<React.ComponentProps<'div'>, 'onSelect' | 'value'> {
  /** Text the search matches and onSelect receives. Default: the item's text. */
  value?: string;
  /** More words that match this item ("check", "party"). */
  keywords?: string[];
  onSelect?: (value: string) => void;
  disabled?: boolean;
  /** Figma Show leading icon: an icon from `@/components/icons`. */
  icon?: React.ReactNode;
  /** Figma Shortcut text, ui/caption muted on the right ("⌘P"). Only shortcuts that work. */
  shortcut?: React.ReactNode;
  /** Figma Checked: the selected value in a picker shows a check at the end (aria-checked). */
  checked?: boolean;
  /** Keep the item visible whatever the search ("Search everywhere for …"). */
  forceMount?: boolean;
}

/** Figma Menu Item in a Command: one option. */
function CommandItem({ value, keywords, onSelect, disabled = false, icon, shortcut, checked, forceMount, className, children, ...props }: CommandItemProps) {
  const ctx = useCommand('CommandItem');
  const id = React.useId();
  const text = value ?? nodeText(children);
  const visible = forceMount || ctx.matches(text, keywords);
  const select = React.useRef<() => void>(() => {});
  select.current = () => {
    if (!disabled) onSelect?.(text);
  };
  React.useLayoutEffect(() => {
    if (!visible) return;
    const map = ctx.handlers.current;
    map.set(id, () => select.current());
    return () => {
      map.delete(id);
    };
  }, [ctx.handlers, id, visible]);
  if (!visible) return null;
  const active = ctx.activeId === id;
  return (
    <div
      id={id}
      role="option"
      data-slot="command-item"
      data-value={text}
      data-highlighted={active ? '' : undefined}
      data-checked={checked ? '' : undefined}
      aria-selected={active}
      aria-checked={checked === undefined ? undefined : checked}
      aria-disabled={disabled || undefined}
      // Not in the tab order (the input owns focus through aria-activedescendant), but focusable,
      // so the scrolling list counts as keyboard reachable.
      tabIndex={-1}
      onPointerMove={() => {
        if (!disabled && !active) ctx.setActiveId(id);
      }}
      // Keep focus in the input.
      onMouseDown={event => event.preventDefault()}
      onClick={() => select.current()}
      className={cn(
        "relative flex w-full min-w-0 cursor-default select-none items-center gap-2 rounded-sm px-2 py-[var(--menu-padding-y)] text-left text-sm leading-5 text-popover-foreground outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {icon}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {shortcut != null ? <CommandShortcut>{shortcut}</CommandShortcut> : null}
      {checked ? <Check aria-hidden="true" className="ml-auto" /> : null}
    </div>
  );
}

/** Figma Shortcut text: ui/caption, muted; follows the item color when highlighted. */
function CommandShortcut({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn('ml-auto shrink-0 pl-2 text-xs leading-4 text-muted-foreground [[data-highlighted]_&]:text-current', className)}
      {...props}
    />
  );
}

export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandLoading,
  CommandGroup,
  CommandSeparator,
  CommandItem,
  CommandShortcut,
  defaultFilter as commandFilter,
};
