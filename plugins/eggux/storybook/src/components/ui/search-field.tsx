// EGG UI Search Field. Figma: Search Field (Input page, "Search Field / Component", set 430:2242).
// Size (default 36: body/small, 16 px icons, 12 px sides, 8 px gap; lg 48: body/default, 20 px
// icons, 16 px sides, 12 px gap) x State (default, focus, filled), Placeholder ("Search
// invoices"), Query, Show shortcut (Kbd "⌘K"). Search icon, the query, then clear (x) once there is a
// query or the shortcut while it is empty. shadcn InputGroup with type="search" (code-mapping):
// the Input Group box, focus ring around the whole field.
// Behavior: onValueChange on every key, onSearch debounced (300 ms); Escape clears (and does not
// close a surrounding dialog while there is a query); clear keeps focus in the field; with the
// shortcut shown, Cmd+K / Ctrl+K focuses the field (a global search opens Command Dialog from its
// own onFocus or click instead). role="search" with an aria-label that names what is searched.
import * as React from 'react';
import { Search, X } from '@/components/icons';
import { cn } from '@/lib/utils';
import { inputGroupFrame } from './input-group';
import { Kbd } from './kbd';

export type SearchFieldSize = 'default' | 'lg';

export interface SearchFieldProps
  extends Omit<React.ComponentProps<'input'>, 'size' | 'type' | 'value' | 'defaultValue' | 'placeholder'> {
  /** Figma Placeholder: names what is searched ("Search invoices"), never just "Search". */
  placeholder: string;
  /** Accessible name of the search region and the field. Default: the placeholder. */
  label?: string;
  /** Figma Query (controlled). */
  value?: string;
  /** Figma Query (uncontrolled). */
  defaultValue?: string;
  /** Every change, including clear. */
  onValueChange?: (query: string) => void;
  /** The query after people stop typing for `debounce` ms (and at once on clear and Enter). */
  onSearch?: (query: string) => void;
  /** Debounce of onSearch in ms. Figma: about 300. */
  debounce?: number;
  /** Figma Size: default 36 (toolbars, Filter Bar, Top Bar), lg 48 (heroes, help centers). */
  size?: SearchFieldSize;
  /** Figma Show shortcut: the Kbd hint while the field is empty; Cmd/Ctrl+K focuses the field. */
  showShortcut?: boolean;
  /** The shortcut letter used with Cmd / Ctrl. Default "K". */
  shortcutKey?: string;
  /** Accessible name of the clear button. */
  clearLabel?: string;
  /** Class of the input (className goes to the search box). */
  inputClassName?: string;
}

function SearchField({
  placeholder,
  label,
  value: valueProp,
  defaultValue = '',
  onValueChange,
  onSearch,
  debounce = 300,
  size = 'default',
  showShortcut = true,
  shortcutKey = 'K',
  clearLabel = 'Clear search',
  className,
  inputClassName,
  disabled,
  onKeyDown,
  ref,
  ...props
}: SearchFieldProps) {
  const [inner, setInner] = React.useState(defaultValue);
  const query = valueProp ?? inner;
  const inputRef = React.useRef<HTMLInputElement>(null);
  // A ref from the caller (or a Field Slot) still reaches the input.
  React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement, []);
  const timer = React.useRef<number | undefined>(undefined);
  React.useEffect(() => () => window.clearTimeout(timer.current), []);
  const name = label ?? placeholder;
  const lg = size === 'lg';

  const update = (next: string, now = false) => {
    if (valueProp === undefined) setInner(next);
    onValueChange?.(next);
    window.clearTimeout(timer.current);
    if (now) onSearch?.(next);
    else timer.current = window.setTimeout(() => onSearch?.(next), debounce);
  };

  // Cmd+K / Ctrl+K focuses the field while the shortcut is shown.
  React.useEffect(() => {
    if (!showShortcut || disabled) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === shortcutKey.toLowerCase()) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showShortcut, shortcutKey, disabled]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    if (e.key === 'Escape' && query) {
      e.preventDefault();
      e.stopPropagation();
      update('', true);
    } else if (e.key === 'Enter') {
      window.clearTimeout(timer.current);
      onSearch?.(query);
    }
  };

  const iconSize = lg ? 'size-5' : 'size-4';

  return (
    <div
      role="search"
      aria-label={name}
      data-slot="search-field"
      data-size={size}
      data-state={query ? 'filled' : 'default'}
      className={cn(
        inputGroupFrame,
        'cursor-text items-center',
        lg ? 'h-12 gap-3 px-4' : 'gap-2 px-3',
        className,
      )}
      onClick={e => { if (e.target === e.currentTarget) inputRef.current?.focus(); }}
    >
      <Search className={cn('shrink-0 text-muted-foreground', iconSize)} aria-hidden="true" />
      <input
        type="search"
        data-slot="search-field-input"
        aria-label={props['aria-labelledby'] || props.id ? undefined : name}
        aria-keyshortcuts={showShortcut ? `Meta+${shortcutKey} Control+${shortcutKey}` : undefined}
        autoComplete="off"
        placeholder={placeholder}
        disabled={disabled}
        value={query}
        onChange={e => update(e.target.value)}
        onKeyDown={handleKeyDown}
        className={cn(
          'h-full min-w-0 flex-1 truncate border-0 bg-transparent p-0 text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed',
          '[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none',
          lg ? 'text-base' : 'text-base md:text-sm',
          inputClassName,
        )}
        {...props}
        ref={inputRef}
      />
      {query ? (
        <button
          type="button"
          data-slot="search-field-clear"
          aria-label={clearLabel}
          disabled={disabled}
          onClick={() => { update('', true); inputRef.current?.focus(); }}
          // 24 / 28 px target around the 16 / 20 px icon; the negative margin keeps the Figma spacing.
          className={cn(
            '-mx-1 flex shrink-0 items-center justify-center rounded-sm text-muted-foreground outline-none transition-colors duration-[var(--duration-fast)] hover:bg-muted hover:text-foreground focus-visible:shadow-[0_0_0_2px_var(--ring)]',
            lg ? 'size-7' : 'size-6',
          )}
        >
          <X className={iconSize} aria-hidden="true" />
        </button>
      ) : showShortcut ? (
        <Kbd data-slot="search-field-shortcut" className="shrink-0" aria-hidden="true">⌘{shortcutKey}</Kbd>
      ) : null}
    </div>
  );
}

export { SearchField };
