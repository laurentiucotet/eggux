// EGG UI Combobox. Figma: Combobox (Select page, "Combobox / Component"). Size (default 36, sm 32,
// lg 40) x State (default, focus, error, disabled, read-only) x Content (placeholder, filled); Value
// ("Select country…"), Show clear, Show leading icon + Leading icon (globe), Show avatar, Show
// status dot. A searchable select (shadcn Combobox = Popover + Command): the trigger looks like the
// Select trigger with chevrons-up-down (role="combobox" as in shadcn, named by the Field label plus
// the value); it opens the Command 4 px below: a Command Input (search icon, border-b) and the list.
// WAI-ARIA combobox: the search input is role="combobox" too, with
// aria-controls and aria-activedescendant on a listbox (Select Option or Menu Item rows, see
// select-option.tsx). Typing filters, arrows move, Enter picks and closes, Escape closes and returns
// focus to the trigger. No match: "No results for “x”" in a polite status. With onCreate a
// Select Option Type=create comes last ('Create "Nord"'); picking it creates and selects the value.
// Long lists load asynchronously: shouldFilter={false}, onQueryChange and loading.
import * as React from 'react';
import { ChevronsUpDown, Search, X } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Avatar, type AvatarProps } from './avatar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { selectTriggerVariants, type SelectSize } from './select';
import { Listbox, ListboxGroup, ListboxItem, ListboxStatus, SelectOption, useListbox, type SelectOptionType } from './select-option';
import { statusDotVariants } from './status-dot';

type StatusDotStatus = 'success' | 'warning' | 'error' | 'info' | 'neutral';

export interface ComboboxOption {
  value: string;
  label: string;
  /** Second line (Select Option description): type, place or email. Also searched. */
  description?: string;
  /** Leading icon (Select Option Type=icon; the trigger shows it at 16 px). */
  icon?: React.ReactNode;
  /** Leading avatar (Select Option Type=avatar; Avatar xs in the trigger). */
  avatar?: Omit<AvatarProps, 'size'>;
  /** Leading Status Dot. */
  status?: StatusDotStatus;
  disabled?: boolean;
  /** Extra words that match the search (country codes, synonyms). */
  keywords?: string[];
  /** Group heading (Menu Label): options with the same group are listed together, in first-seen order. */
  group?: string;
}

const CREATE = '\u0000create';

export interface ComboboxProps extends Omit<React.ComponentProps<'button'>, 'value' | 'defaultValue' | 'onChange' | 'type'> {
  options: ComboboxOption[];
  /** Selected value (controlled). */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Figma Value when empty. */
  placeholder?: string;
  /** Figma Size. */
  size?: SelectSize;
  /** Figma State=error (Field sets aria-invalid). */
  invalid?: boolean;
  /** Figma State=read-only: muted, no chevrons, never opens. */
  readOnly?: boolean;
  /** Figma Show clear: an x before the chevrons that empties the value. */
  showClear?: boolean;
  clearLabel?: string;
  /** Figma Show leading icon when the options have none (a fixed icon for the record type). */
  leading?: React.ReactNode;
  /**
   * How options render: 'item' = Menu Item rows (one line, check); 'icon' / 'avatar' / 'none' =
   * Select Option rows of that Type (two lines). Default: 'item', or Select Option when options
   * have descriptions.
   */
  optionType?: 'item' | Exclude<SelectOptionType, 'create'>;
  /** Accessible name of the trigger when no Field label is tied to it. */
  label?: string;
  /** Accessible name of the list and of the open popover ("Countries"). */
  listLabel?: string;
  /** Placeholder and name of the search input. */
  searchPlaceholder?: string;
  /** Filter in the component (default) or not (server search: filter in onQueryChange). */
  shouldFilter?: boolean;
  filter?: (option: ComboboxOption, query: string) => boolean;
  onQueryChange?: (query: string) => void;
  /** A loading row instead of an empty list while results load. */
  loading?: boolean;
  loadingText?: string;
  emptyText?: (query: string) => string;
  /** People may add a value: the create option comes last; return the new value to select it. */
  onCreate?: (query: string) => string | void;
  createLabel?: (query: string) => string;
  /** Announced after create. */
  createdText?: (query: string) => string;
  /** Open state (controlled), e.g. for docs. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Field passes a ref through its Slot: it gets the trigger. */
  ref?: React.Ref<HTMLButtonElement>;
}

const defaultFilter = (o: ComboboxOption, q: string) => {
  const needle = q.trim().toLocaleLowerCase();
  if (!needle) return true;
  return [o.label, o.description ?? '', ...(o.keywords ?? [])].some(t => t.toLocaleLowerCase().includes(needle));
};

/** The Field label (label[for=id]) plus the value name the trigger: a label alone would hide the value. */
function useFieldLabelId(id: string | undefined) {
  const [labelId, setLabelId] = React.useState<string>();
  React.useLayoutEffect(() => {
    if (!id) return;
    const label = document.querySelector<HTMLLabelElement>(`label[for="${CSS.escape(id)}"]`);
    if (!label) return;
    if (!label.id) label.id = `${id}-label`;
    setLabelId(label.id);
  }, [id]);
  return labelId;
}

function Leading({ option, leading }: { option?: ComboboxOption; leading?: React.ReactNode }) {
  if (option?.avatar) return <Avatar {...option.avatar} size="xs" aria-hidden="true" className="shrink-0" />;
  if (option?.status) return <span aria-hidden="true" className={statusDotVariants({ status: option.status })} />;
  const icon = option?.icon ?? leading;
  return icon ? <span aria-hidden="true" className="flex shrink-0 text-muted-foreground">{icon}</span> : null;
}

function Combobox({
  options,
  value: valueProp,
  defaultValue,
  onValueChange,
  placeholder = 'Select country…',
  size = 'default',
  invalid,
  readOnly = false,
  showClear = false,
  clearLabel = 'Clear selection',
  leading,
  optionType,
  label,
  listLabel = 'Options',
  searchPlaceholder = 'Search…',
  shouldFilter = true,
  filter = defaultFilter,
  onQueryChange,
  loading = false,
  loadingText = 'Loading…',
  emptyText = q => (q ? `No results for “${q}”` : 'No options'),
  onCreate,
  createLabel = q => `Create “${q}”`,
  createdText = q => `“${q}” created`,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  id: idProp,
  disabled,
  className,
  ref,
  onKeyDown,
  ...props
}: ComboboxProps) {
  const autoId = React.useId();
  const id = idProp ?? `${autoId}-trigger`;
  const valueId = `${autoId}-value`;
  const fieldLabelId = useFieldLabelId(id);
  const [inner, setInner] = React.useState(defaultValue ?? '');
  const value = valueProp ?? inner;
  const [openInner, setOpenInner] = React.useState(defaultOpen);
  const open = openProp ?? openInner;
  const [query, setQueryState] = React.useState('');
  const [announce, setAnnounce] = React.useState('');
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  React.useImperativeHandle(ref, () => triggerRef.current as HTMLButtonElement, []);
  const isInvalid = invalid || props['aria-invalid'] === true || props['aria-invalid'] === 'true';

  const setQuery = (q: string) => {
    setQueryState(q);
    onQueryChange?.(q);
  };
  const setOpen = (o: boolean) => {
    if (readOnly && o) return;
    setOpenInner(o);
    onOpenChange?.(o);
    if (!o) setQuery('');
  };

  const selected = options.find(o => o.value === value);
  const shown = selected?.label ?? placeholder;
  const rich = optionType ? optionType !== 'item' : options.some(o => o.description);
  const rowType: Exclude<SelectOptionType, 'create'> = optionType && optionType !== 'item' ? optionType : options.some(o => o.avatar) ? 'avatar' : options.some(o => o.icon) ? 'icon' : 'none';

  const visible = shouldFilter ? options.filter(o => filter(o, query)) : options;
  const q = query.trim();
  const canCreate = !!onCreate && q.length > 0 && !options.some(o => o.label.toLocaleLowerCase() === q.toLocaleLowerCase());
  const items: { value: string; disabled?: boolean }[] = loading ? [] : [...visible.map(o => ({ value: o.value, disabled: o.disabled })), ...(canCreate ? [{ value: CREATE }] : [])];

  const pick = (v: string) => {
    if (v === CREATE) {
      const created = onCreate?.(q);
      setAnnounce(createdText(q));
      if (typeof created === 'string') {
        setInner(created);
        onValueChange?.(created);
      }
    } else {
      setInner(v);
      onValueChange?.(v);
    }
    setOpen(false);
  };
  const lb = useListbox({ items, onSelect: pick, initialActive: value || undefined });
  // Each time the list opens, the selected option (or the first) is highlighted.
  React.useEffect(() => {
    if (open) lb.setActiveValue(value && items.some(i => i.value === value) ? value : items.find(i => !i.disabled)?.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const clear = () => {
    setInner('');
    onValueChange?.('');
    triggerRef.current?.focus();
  };

  // Group options by heading, keeping their order.
  const groups: { label?: string; options: ComboboxOption[] }[] = [];
  for (const o of visible) {
    const g = groups.find(x => x.label === o.group);
    if (g) g.options.push(o);
    else groups.push({ label: o.group, options: [o] });
  }
  const renderOption = (o: ComboboxOption) =>
    rich ? (
      <SelectOption key={o.value} value={o.value} type={rowType} title={o.label} description={o.description} icon={o.icon} avatar={o.avatar} checked={o.value === value} disabled={o.disabled} />
    ) : (
      <ListboxItem key={o.value} value={o.value} icon={o.icon} avatar={o.avatar} status={o.status} checked={o.value === value} disabled={o.disabled}>{o.label}</ListboxItem>
    );

  const named = props['aria-label'] || props['aria-labelledby'];
  const nameProps = named
    ? {}
    : label
      ? { 'aria-label': `${label}, ${shown}` }
      : fieldLabelId
        ? { 'aria-labelledby': `${fieldLabelId} ${valueId}` }
        : {};

  const status = loading ? loadingText : visible.length === 0 && !canCreate ? emptyText(q) : '';

  if (readOnly) {
    // Read-only: a native read-only input keeps the value focusable, selectable and tied to the label.
    return (
      <div
        data-slot="combobox"
        data-read-only=""
        className={cn(selectTriggerVariants({ size, readOnly: true }), 'cursor-default', className)}
      >
        <Leading option={selected} leading={leading} />
        <input
          id={id}
          readOnly
          value={selected?.label ?? ''}
          placeholder={placeholder}
          aria-describedby={props['aria-describedby']}
          aria-label={label}
          className="min-w-0 flex-1 truncate bg-transparent text-foreground outline-none placeholder:text-[var(--input-filled-muted-foreground)]"
        />
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <span data-slot="combobox" className={cn('relative flex w-full min-w-0', className)}>
        <PopoverTrigger asChild>
          <button
            ref={triggerRef}
            type="button"
            role="combobox"
            id={id}
            disabled={disabled}
            aria-invalid={isInvalid || undefined}
            data-slot="combobox-trigger"
            data-placeholder={selected ? undefined : ''}
            data-size={size}
            className={selectTriggerVariants({ size })}
            onKeyDown={e => {
              onKeyDown?.(e);
              if (e.defaultPrevented || open) return;
              // ArrowDown or typing a letter opens the list (the letter starts the search).
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setOpen(true);
              } else if (e.key.length === 1 && e.key !== ' ' && !e.altKey && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                setQuery(e.key);
                setOpenInner(true);
                onOpenChange?.(true);
              }
            }}
            {...nameProps}
            {...props}
          >
            <Leading option={selected} leading={leading} />
            <span id={valueId} data-slot="combobox-value" className="min-w-0 flex-1 truncate">{shown}</span>
            {showClear && selected && !disabled ? <span aria-hidden="true" className="size-5 shrink-0" /> : null}
            <ChevronsUpDown aria-hidden="true" className="ml-auto text-muted-foreground" />
          </button>
        </PopoverTrigger>
        {showClear && selected && !disabled ? (
          <button
            type="button"
            data-slot="combobox-clear"
            aria-label={clearLabel}
            onClick={clear}
            className={cn(
              'absolute top-1/2 inline-flex size-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-sm text-muted-foreground outline-none hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-4',
              size === 'lg' ? 'right-10' : 'right-9',
            )}
          >
            <X aria-hidden="true" />
          </button>
        ) : null}
        <span role="status" className="sr-only">{announce}</span>
      </span>
      <PopoverContent
        aria-label={listLabel}
        className="w-[var(--radix-popover-trigger-width)] min-w-60 overflow-hidden p-0"
        onOpenAutoFocus={e => {
          e.preventDefault();
          (e.currentTarget as HTMLElement).querySelector<HTMLInputElement>('[role="combobox"]')?.focus({ preventScroll: true });
        }}
      >
        <div data-slot="combobox-input" className="flex h-[var(--control-height)] items-center gap-2 border-b border-border px-3">
          <Search aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
          <input
            role="combobox"
            aria-expanded="true"
            aria-controls={lb.listboxId}
            aria-activedescendant={lb.activeId}
            aria-autocomplete="list"
            aria-label={searchPlaceholder.replace(/…$/, '')}
            autoComplete="off"
            spellCheck={false}
            value={query}
            placeholder={searchPlaceholder}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => { lb.onKeyDown(e); }}
            className="h-full min-w-0 flex-1 bg-transparent text-sm text-popover-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
        <Listbox state={lb} aria-label={listLabel} className={cn(items.length === 0 && 'hidden')}>
          {loading ? null : groups.map((g, i) =>
            g.label ? <ListboxGroup key={g.label} label={g.label}>{g.options.map(renderOption)}</ListboxGroup> : <React.Fragment key={`_${i}`}>{g.options.map(renderOption)}</React.Fragment>,
          )}
          {canCreate && !loading ? <SelectOption value={CREATE} type="create" createLabel={createLabel(q)} /> : null}
        </Listbox>
        <ListboxStatus loading={loading}>{status}</ListboxStatus>
      </PopoverContent>
    </Popover>
  );
}

export { Combobox };
