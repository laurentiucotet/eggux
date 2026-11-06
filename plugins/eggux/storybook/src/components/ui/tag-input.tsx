// EGG UI Tag Input. Figma: Tag Input (Select page, "Tag Input / Component"). Size (default min 36,
// sm min 32, lg min 40) x State (default, focus, error, disabled); Show chevron; Tags slot (Tag
// instances, then the typing text). Several values in one field: a multi-select from a list (Show
// chevron on: the list opens under the field with a check on each picked option and stays open
// while picking) or free tags (Show chevron off: Enter or comma adds the typed text). Field: radius
// md, 1 px border/input, 6 px left / 12 px right, 4 px top and bottom (sm 2, lg 6), 8 gap; tags 24
// high, 4 px apart, wrap to new lines and the field grows in height. At most ~5 tags show, then
// "+3 more". Backspace in the empty input removes the last tag; each Tag x is "Remove <label>" and
// also takes Backspace or Delete. Adding and removing are announced. The input is the WAI-ARIA
// combobox of the list (aria-activedescendant, see select-option.tsx). Built from Tag.
import * as React from 'react';
import { ChevronsUpDown } from '@/components/icons';
import { cn } from '@/lib/utils';
import type { AvatarProps } from './avatar';
import { Popover, PopoverAnchor, PopoverContent } from './popover';
import { Listbox, ListboxItem, ListboxStatus, SelectOption, useListbox } from './select-option';
import { Tag, type TagSize, type TagTone } from './tag';

export interface TagInputOption {
  value: string;
  label: string;
  /** Tag Tone for this value (labels with a fixed color). */
  tone?: TagTone;
  /** Tag Show avatar (people). */
  avatar?: Omit<AvatarProps, 'size'>;
  /** Tag Show leading icon and the option's leading icon. */
  icon?: React.ReactNode;
  description?: string;
  disabled?: boolean;
}

export type TagInputSize = 'sm' | 'default' | 'lg';

export interface TagInputProps {
  /** Options of the multi-select. Without options the field takes free tags. */
  options?: TagInputOption[];
  /** Picked values (controlled). Free tags are their own value. */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  /** Figma Size: default, sm (dense forms, filter bars), lg. Tags stay 24 high. */
  size?: TagInputSize;
  /** Tag Size inside the field (sm in dense fields). */
  tagSize?: TagSize;
  /** Figma State=error (Field sets aria-invalid). */
  invalid?: boolean;
  /** Figma State=disabled: every Tag is disabled too. */
  disabled?: boolean;
  /** Figma Show chevron: on for a multi-select list (default when options are given). */
  showChevron?: boolean;
  /** Typed text can become a tag (default when there are no options). */
  allowCreate?: boolean;
  /** Tags shown before "+N more". */
  maxVisible?: number;
  moreText?: (count: number) => string;
  /** Accessible name of the input when no Field label is tied to it. */
  label?: string;
  /** Accessible name of the list. */
  listLabel?: string;
  emptyText?: (query: string) => string;
  createLabel?: (query: string) => string;
  addedText?: (label: string) => string;
  removedText?: (label: string) => string;
  /** From Field. */
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: React.AriaAttributes['aria-invalid'];
  required?: boolean;
  className?: string;
  /** Field passes a ref through its Slot: it gets the input. */
  ref?: React.Ref<HTMLInputElement>;
}

const CREATE = '\u0000create';

const sizeClass: Record<TagInputSize, string> = {
  sm: 'min-h-8 py-0.5',
  default: 'min-h-[var(--control-height)] py-1',
  lg: 'min-h-10 py-1.5',
};
const inputSize: Record<TagInputSize, string> = { sm: 'h-6 text-sm', default: 'h-6 text-sm', lg: 'h-7 text-base' };

function TagInput({
  options,
  value: valueProp,
  defaultValue,
  onValueChange,
  placeholder = 'Add skill…',
  size = 'default',
  tagSize = 'default',
  invalid,
  disabled = false,
  showChevron,
  allowCreate,
  maxVisible = 5,
  moreText = n => `+${n} more`,
  label,
  listLabel = 'Options',
  emptyText = q => (q ? `No results for “${q}”` : 'No options'),
  createLabel = q => `Create “${q}”`,
  addedText = l => `${l} added`,
  removedText = l => `${l} removed`,
  id: idProp,
  'aria-describedby': describedBy,
  'aria-invalid': ariaInvalid,
  required,
  className,
  ref,
}: TagInputProps) {
  const autoId = React.useId();
  const id = idProp ?? `${autoId}-input`;
  const hasList = !!options;
  const chevron = showChevron ?? hasList;
  const creatable = allowCreate ?? !hasList;
  const isInvalid = invalid || ariaInvalid === true || ariaInvalid === 'true';

  const [inner, setInner] = React.useState<string[]>(defaultValue ?? []);
  const value = valueProp ?? inner;
  const [query, setQuery] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [announce, setAnnounce] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);
  const fieldRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement, []);

  const labelOf = (v: string) => options?.find(o => o.value === v)?.label ?? v;
  const commit = (next: string[]) => {
    setInner(next);
    onValueChange?.(next);
  };
  const add = (v: string) => {
    if (value.includes(v)) return;
    commit([...value, v]);
    setAnnounce(addedText(labelOf(v)));
  };
  const remove = (v: string) => {
    commit(value.filter(x => x !== v));
    setAnnounce(removedText(labelOf(v)));
    inputRef.current?.focus();
  };

  const q = query.trim();
  const visible = (options ?? []).filter(o => !q || o.label.toLocaleLowerCase().includes(q.toLocaleLowerCase()));
  const exact = (options ?? []).some(o => o.label.toLocaleLowerCase() === q.toLocaleLowerCase()) || value.some(v => labelOf(v).toLocaleLowerCase() === q.toLocaleLowerCase());
  const canCreate = creatable && q.length > 0 && !exact;
  const items = [...visible.map(o => ({ value: o.value, disabled: o.disabled })), ...(canCreate ? [{ value: CREATE }] : [])];

  const pick = (v: string) => {
    if (v === CREATE) add(q);
    else if (value.includes(v)) remove(v);
    else add(v);
    setQuery('');
  };
  const lb = useListbox({ items, onSelect: pick });

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (hasList && open && lb.onKeyDown(e)) return;
    if (hasList && !open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if ((e.key === 'Enter' || (!hasList && e.key === ',')) && canCreate) {
      e.preventDefault();
      add(q);
      setQuery('');
    } else if (e.key === 'Backspace' && query === '' && value.length) {
      e.preventDefault();
      remove(value[value.length - 1]);
    }
  };

  const shownTags = value.slice(0, maxVisible);
  const hidden = value.length - shownTags.length;
  const status = visible.length === 0 && !canCreate ? emptyText(q) : '';

  const field = (
    <div
      ref={fieldRef}
      data-slot="tag-input"
      data-size={size}
      data-state={disabled ? 'disabled' : isInvalid ? 'error' : 'default'}
      onMouseDown={e => {
        if (disabled || (e.target as HTMLElement).closest('button, input')) return;
        e.preventDefault();
        inputRef.current?.focus();
        if (hasList) setOpen(!open);
      }}
      onBlur={e => {
        const to = e.relatedTarget as Node | null;
        if (to && (fieldRef.current?.contains(to) || contentRef.current?.contains(to))) return;
        setOpen(false);
        setQuery('');
      }}
      className={cn(
        'flex w-full min-w-0 cursor-text items-center gap-2 rounded-md border border-input bg-background pr-3 pl-1.5 text-foreground shadow-xs transition-[box-shadow,border-color] duration-[var(--duration-fast)]',
        'has-[input:focus-visible]:border-ring has-[input:focus-visible]:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]',
        sizeClass[size],
        isInvalid && 'border-destructive',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      <div data-slot="tag-input-tags" className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
        {shownTags.map(v => {
          const o = options?.find(x => x.value === v);
          return (
            <Tag
              key={v}
              label={labelOf(v)}
              tone={o?.tone}
              size={tagSize}
              avatar={o?.avatar}
              showLeadingIcon={!!o?.icon}
              icon={o?.icon}
              disabled={disabled}
              onRemove={() => remove(v)}
              className={disabled ? 'opacity-100' : undefined}
            />
          );
        })}
        {hidden > 0 ? <span data-slot="tag-input-more" className="shrink-0 px-1 text-sm text-muted-foreground">{moreText(hidden)}</span> : null}
        <input
          ref={inputRef}
          id={id}
          disabled={disabled}
          required={required && value.length === 0}
          aria-describedby={describedBy}
          aria-invalid={isInvalid || undefined}
          aria-label={label}
          {...(hasList
            ? { role: 'combobox', 'aria-expanded': open, 'aria-controls': lb.listboxId, 'aria-activedescendant': open ? lb.activeId : undefined, 'aria-autocomplete': 'list' as const }
            : {})}
          autoComplete="off"
          spellCheck={false}
          value={query}
          placeholder={placeholder}
          onChange={e => {
            setQuery(e.target.value);
            if (hasList) setOpen(true);
          }}
          onKeyDown={onKeyDown}
          onClick={() => { if (hasList) setOpen(true); }}
          className={cn('min-w-16 flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed', inputSize[size])}
        />
      </div>
      {chevron ? <ChevronsUpDown aria-hidden="true" className="size-4 shrink-0 self-center text-muted-foreground" /> : null}
      <span role="status" className="sr-only">{announce}</span>
    </div>
  );

  if (!hasList) return field;

  return (
    <Popover open={open && !disabled} onOpenChange={setOpen}>
      <PopoverAnchor asChild>{field}</PopoverAnchor>
      <PopoverContent
        ref={contentRef}
        aria-label={listLabel}
        className="w-[var(--radix-popover-trigger-width)] min-w-60 overflow-hidden p-0"
        onOpenAutoFocus={e => e.preventDefault()}
        onCloseAutoFocus={e => e.preventDefault()}
        onInteractOutside={e => {
          if (fieldRef.current?.contains(e.target as Node)) e.preventDefault();
        }}
      >
        <Listbox state={lb} multiple aria-label={listLabel} className={cn(items.length === 0 && 'hidden')}>
          {visible.map(o => (
            <ListboxItem key={o.value} value={o.value} icon={o.icon} avatar={o.avatar} description={o.description} checked={value.includes(o.value)} disabled={o.disabled}>{o.label}</ListboxItem>
          ))}
          {canCreate ? <SelectOption value={CREATE} type="create" createLabel={createLabel(q)} /> : null}
        </Listbox>
        <ListboxStatus>{status}</ListboxStatus>
      </PopoverContent>
    </Popover>
  );
}

export { TagInput };
