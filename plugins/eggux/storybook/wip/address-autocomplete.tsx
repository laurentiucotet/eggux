// EGG UI Address Autocomplete. Figma: Address Autocomplete (Select page, "Address Autocomplete /
// Component", 432:2398). Query ("Strada Vic"), Show suggestions. An address field with suggestions
// as people type: field 360 × 36 (density), input radius, 12 px sides, 8 gap, map-pin 16 muted,
// body/small text. Suggestions 4 px below in the popover surface (radius md, border/default, shadow
// md, 4 px padding, 2 px between rows): each row 6 / 8 px, 8 gap, radius sm, map-pin, street and
// number in ui/label, city and country in a muted ui/caption line; highlighted = background/accent.
// Last, after a border, "Enter the address manually" (ui/label, muted) opens the separate fields.
// No places API here: the app passes `search(query)` (Google Places, Mapbox or its own service,
// biased to the account's country) and gets at most `maxSuggestions` (5). Suggestions come after
// `minChars` (3) characters, debounced; nothing matching keeps what was typed and offers manual
// entry. Picking fills `onSelect` (the app fills street, city, postal code and country, which stay
// editable). WAI-ARIA combobox: role="combobox" with aria-expanded and aria-activedescendant on the
// input, arrows move, Enter picks, Escape closes and keeps the text; the number of suggestions is
// announced politely. The manual entry is the last option, so the arrows reach it too.
import * as React from 'react';
import { MapPin } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Popover, PopoverAnchor, PopoverContent } from './popover';
import { Listbox, ListboxContext, ListboxStatus, useListbox } from './select-option';

export interface AddressParts {
  street?: string;
  city?: string;
  postalCode?: string;
  region?: string;
  country?: string;
}

export interface AddressSuggestion {
  /** Stable id from the places service. */
  id: string;
  /** First line: street and number ("Strada Victoriei 12"). */
  line1: string;
  /** Second line: city and country ("Sector 1, Bucharest, Romania"). */
  line2?: string;
  /** The parts that fill the separate fields after a pick. */
  address?: AddressParts;
}

export interface AddressAutocompleteProps {
  /** Suggestions for the typed text (at least minChars). Sync or async; errors show as no results. */
  search: (query: string) => AddressSuggestion[] | Promise<AddressSuggestion[]>;
  /** A suggestion was picked: fill the address fields with it. */
  onSelect?: (suggestion: AddressSuggestion) => void;
  /** "Enter the address manually": open the separate fields. Hidden when not given. */
  onManualEntry?: () => void;
  /** Figma Query (controlled). */
  value?: string;
  defaultValue?: string;
  onValueChange?: (query: string) => void;
  placeholder?: string;
  /** Characters before the first search. */
  minChars?: number;
  /** Debounce of the search, in ms. */
  debounceMs?: number;
  maxSuggestions?: number;
  manualText?: string;
  loadingText?: string;
  emptyText?: (query: string) => string;
  /** Announced count: "3 addresses found". */
  countText?: (count: number) => string;
  /** Accessible name of the input when no Field label is tied to it. */
  label?: string;
  /** Accessible name of the list and of the popover. */
  listLabel?: string;
  invalid?: boolean;
  disabled?: boolean;
  /** From Field. */
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: React.AriaAttributes['aria-invalid'];
  required?: boolean;
  className?: string;
  /** Field passes a ref through its Slot: it gets the input. */
  ref?: React.Ref<HTMLInputElement>;
}

const MANUAL = '\u0000manual';

function SuggestionRow({ suggestion }: { suggestion: AddressSuggestion }) {
  const ctx = React.useContext(ListboxContext)!;
  const highlighted = ctx.activeValue === suggestion.id;
  return (
    <div
      id={ctx.optionId(suggestion.id)}
      role="option"
      aria-selected={highlighted}
      data-slot="address-suggestion"
      data-highlighted={highlighted || undefined}
      onMouseDown={e => e.preventDefault()}
      onMouseMove={() => { if (!highlighted) ctx.setActiveValue(suggestion.id); }}
      onClick={() => ctx.select(suggestion.id)}
      className="flex min-w-0 cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-popover-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
    >
      <MapPin aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
      <span className="flex min-w-0 flex-1 flex-col">
        <span title={suggestion.line1} className="truncate text-sm leading-5 font-medium">{suggestion.line1}</span>
        {suggestion.line2 ? <span title={suggestion.line2} className="truncate text-xs leading-4 text-muted-foreground">{suggestion.line2}</span> : null}
      </span>
    </div>
  );
}

function ManualRow({ text }: { text: string }) {
  const ctx = React.useContext(ListboxContext)!;
  const highlighted = ctx.activeValue === MANUAL;
  return (
    <div
      id={ctx.optionId(MANUAL)}
      role="option"
      aria-selected={highlighted}
      data-slot="address-manual"
      data-highlighted={highlighted || undefined}
      onMouseDown={e => e.preventDefault()}
      onMouseMove={() => { if (!highlighted) ctx.setActiveValue(MANUAL); }}
      onClick={() => ctx.select(MANUAL)}
      className="cursor-default select-none truncate rounded-sm px-2 py-1.5 text-sm leading-5 font-medium text-muted-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
    >
      {text}
    </div>
  );
}

function AddressAutocomplete({
  search,
  onSelect,
  onManualEntry,
  value: valueProp,
  defaultValue,
  onValueChange,
  placeholder = 'Start typing an address…',
  minChars = 3,
  debounceMs = 200,
  maxSuggestions = 5,
  manualText = 'Enter the address manually',
  loadingText = 'Searching…',
  emptyText = q => `No addresses found for “${q}”`,
  countText = n => (n === 1 ? '1 address found' : `${n} addresses found`),
  label,
  listLabel = 'Address suggestions',
  invalid,
  disabled = false,
  id,
  'aria-describedby': describedBy,
  'aria-invalid': ariaInvalid,
  required,
  className,
  ref,
}: AddressAutocompleteProps) {
  const isInvalid = invalid || ariaInvalid === true || ariaInvalid === 'true';
  const [inner, setInner] = React.useState(defaultValue ?? '');
  const query = valueProp ?? inner;
  const [open, setOpen] = React.useState(false);
  const [results, setResults] = React.useState<AddressSuggestion[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [searched, setSearched] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);
  const fieldRef = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement, []);
  const searchRef = React.useRef(search);
  searchRef.current = search;
  // A pick sets the text without searching again.
  const skipNext = React.useRef(false);

  const q = query.trim();
  React.useEffect(() => {
    if (skipNext.current) {
      skipNext.current = false;
      return;
    }
    if (q.length < minChars) {
      setResults([]);
      setLoading(false);
      setSearched('');
      return;
    }
    let live = true;
    setLoading(true);
    const timer = setTimeout(async () => {
      let found: AddressSuggestion[] = [];
      try {
        found = await searchRef.current(q);
      } catch {
        found = [];
      }
      if (!live) return;
      setResults(found.slice(0, maxSuggestions));
      setLoading(false);
      setSearched(q);
    }, debounceMs);
    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, [q, minChars, debounceMs, maxSuggestions]);

  const setQuery = (next: string) => {
    setInner(next);
    onValueChange?.(next);
  };

  const pick = (v: string) => {
    if (v === MANUAL) {
      setOpen(false);
      onManualEntry?.();
      return;
    }
    const s = results.find(r => r.id === v);
    if (!s) return;
    skipNext.current = true;
    setQuery(s.line1);
    setResults([]);
    setSearched('');
    setOpen(false);
    onSelect?.(s);
  };
  const items = [...(loading ? [] : results.map(r => ({ value: r.id }))), ...(onManualEntry && !loading ? [{ value: MANUAL }] : [])];
  const lb = useListbox({ items, onSelect: pick });

  const ready = q.length >= minChars && (loading || searched === q);
  const shown = open && ready && !disabled;
  const status = loading ? loadingText : results.length === 0 ? emptyText(q) : '';
  const announce = shown && !loading ? (results.length ? countText(results.length) : '') : '';

  return (
    <Popover open={shown} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div
          ref={fieldRef}
          data-slot="address-autocomplete"
          className={cn(
            'flex h-[var(--control-height)] w-full min-w-0 items-center gap-2 rounded-input border border-input bg-background px-3 text-foreground shadow-xs transition-[box-shadow,border-color] duration-[var(--duration-fast)]',
            'has-[input:focus-visible]:border-ring has-[input:focus-visible]:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]',
            isInvalid && 'border-destructive',
            disabled && 'cursor-not-allowed opacity-50',
            className,
          )}
        >
          <MapPin aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            id={id}
            type="text"
            role="combobox"
            aria-expanded={shown}
            aria-controls={lb.listboxId}
            aria-activedescendant={shown ? lb.activeId : undefined}
            aria-autocomplete="list"
            aria-label={label}
            aria-describedby={describedBy}
            aria-invalid={isInvalid || undefined}
            required={required}
            disabled={disabled}
            autoComplete="off"
            spellCheck={false}
            value={query}
            placeholder={placeholder}
            onChange={e => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={e => {
              if (fieldRef.current?.contains(e.relatedTarget as Node)) return;
              setOpen(false);
            }}
            onKeyDown={e => {
              if (e.key === 'Escape' && shown) {
                // Close and keep the text.
                e.preventDefault();
                setOpen(false);
                return;
              }
              if (!shown && (e.key === 'ArrowDown' || e.key === 'ArrowUp') && ready) {
                e.preventDefault();
                setOpen(true);
                return;
              }
              if (shown) lb.onKeyDown(e);
            }}
            className="h-full min-w-0 flex-1 truncate bg-transparent text-sm leading-5 outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
          />
          <span role="status" aria-live="polite" className="sr-only">{announce}</span>
        </div>
      </PopoverAnchor>
      <PopoverContent
        aria-label={listLabel}
        className="w-[var(--radix-popover-trigger-width)] min-w-60 overflow-hidden p-0"
        onOpenAutoFocus={e => e.preventDefault()}
        onCloseAutoFocus={e => e.preventDefault()}
        onInteractOutside={e => {
          if (fieldRef.current?.contains(e.target as Node)) e.preventDefault();
        }}
      >
        <ListboxStatus loading={loading} className={cn(!loading && results.length === 0 && 'py-3')}>{status}</ListboxStatus>
        <Listbox state={lb} aria-label={listLabel} className={cn('flex flex-col gap-0.5', items.length === 0 && 'hidden')}>
          {loading ? null : results.map(s => <SuggestionRow key={s.id} suggestion={s} />)}
          {onManualEntry && !loading ? (
            <>
              <div aria-hidden="true" className={cn('-mx-1 h-px bg-border', results.length === 0 && 'hidden')} />
              <ManualRow text={manualText} />
            </>
          ) : null}
        </Listbox>
      </PopoverContent>
    </Popover>
  );
}

export { AddressAutocomplete };
