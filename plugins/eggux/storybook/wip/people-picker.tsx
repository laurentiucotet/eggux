// EGG UI People Picker. Figma: People Picker (Select page, "People Picker / Component", set
// 270:1063). State (closed, open); Placeholder ("Add people…"); slots Selected (Context Chips) and
// Results (Person Options). Choose one or more people (assignee, approvers, share with).
// Field: 360 wide, min 36 (density), input radius, 1 px border/input (border/ring when open),
// 4 / 8 px padding, 6 px between chips and rows; the chips are Context Chip Type=person with
// "Remove <name>"; over `maxVisible` (4) people the rest show as "+3". The placeholder is the
// trigger (role="combobox", named by the Field label) and truncates on one line; chips wrap.
// Open: the popover 4 px below at field width (radius md, shadow md) with a Command Input
// ("Search people or teams…", 36 high, border-b), the Results listbox (4 px padding, Person Option
// rows) and, after a Separator, a ghost sm "Invite by email" button. Search matches name, email,
// team and role; recent and suggested people come first (`group`). Multi-select keeps the list open
// while picking; `multiple={false}` (one owner, one assignee) closes after the pick. Arrows move,
// Enter or a click picks, Escape closes and returns focus to the field. Adds and removes are
// announced. Server search: shouldFilter={false} + onQueryChange (debounce it, 200 ms) + loading.
import * as React from 'react';
import { Mail, Search } from '@/components/icons';
import { cn } from '@/lib/utils';
import type { AvatarProps } from './avatar';
import { Button } from './button';
import { ContextChip } from './context-chip';
import { PersonOption } from './person-option';
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from './popover';
import { Listbox, ListboxGroup, ListboxSeparator, ListboxStatus, useListbox } from './select-option';

export interface Person {
  /** Stable id (the value). */
  id: string;
  name: string;
  email?: string;
  /** Role or title: "Finance manager". */
  role?: string;
  /** Team: searched, and shown when there is no role. */
  team?: string;
  /** Detail line; default "role · email". */
  description?: string;
  avatar?: Omit<AvatarProps, 'size'>;
  /** Group heading: "Recent", "Suggested". Groups keep their first-seen order. */
  group?: string;
  disabled?: boolean;
}

export interface PeoplePickerProps {
  people: Person[];
  /** Picked person ids (controlled). */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** Several people (default) or one (owner, assignee: the list closes after the pick). */
  multiple?: boolean;
  /** Figma Placeholder. */
  placeholder?: string;
  searchPlaceholder?: string;
  /** People shown as chips before "+N". */
  maxVisible?: number;
  /** Shows the "Invite by email" action; gets the typed text. */
  onInvite?: (query: string) => void;
  /** Label of the invite action; gets the typed text ("Invite anna@acme.com" when it is an email). */
  inviteLabel?: (query: string) => string;
  emptyText?: (query: string) => string;
  /** Filter here (default) or on the server (filter in onQueryChange). */
  shouldFilter?: boolean;
  filter?: (person: Person, query: string) => boolean;
  onQueryChange?: (query: string) => void;
  loading?: boolean;
  loadingText?: string;
  /** Figma State=error (Field sets aria-invalid). */
  invalid?: boolean;
  disabled?: boolean;
  /** Accessible name of the field when no Field label is tied to it. */
  label?: string;
  /** Accessible name of the list and of the open popover. */
  listLabel?: string;
  addedText?: (name: string) => string;
  removedText?: (name: string) => string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** From Field. */
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: React.AriaAttributes['aria-invalid'];
  className?: string;
  /** Field passes a ref through its Slot: it gets the trigger. */
  ref?: React.Ref<HTMLButtonElement>;
}

const detailOf = (p: Person) => p.description ?? [p.role ?? p.team, p.email].filter(Boolean).join(' · ');

const defaultFilter = (p: Person, q: string) => {
  const needle = q.trim().toLocaleLowerCase();
  if (!needle) return true;
  return [p.name, p.email ?? '', p.team ?? '', p.role ?? ''].some(t => t.toLocaleLowerCase().includes(needle));
};

const isEmail = (q: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(q);

function PeoplePicker({
  people,
  value: valueProp,
  defaultValue,
  onValueChange,
  multiple = true,
  placeholder = 'Add people…',
  searchPlaceholder = 'Search people or teams…',
  maxVisible = 4,
  onInvite,
  inviteLabel = q => (isEmail(q.trim()) ? `Invite ${q.trim()}` : 'Invite by email'),
  emptyText = q => (q ? `Nobody matches “${q}”` : 'No people'),
  shouldFilter = true,
  filter = defaultFilter,
  onQueryChange,
  loading = false,
  loadingText = 'Loading…',
  invalid,
  disabled = false,
  label,
  listLabel = 'People',
  addedText = n => `${n} added`,
  removedText = n => `${n} removed`,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  id: idProp,
  'aria-describedby': describedBy,
  'aria-invalid': ariaInvalid,
  className,
  ref,
}: PeoplePickerProps) {
  const autoId = React.useId();
  const id = idProp ?? `${autoId}-trigger`;
  const isInvalid = invalid || ariaInvalid === true || ariaInvalid === 'true';
  const [inner, setInner] = React.useState<string[]>(defaultValue ?? []);
  const value = valueProp ?? inner;
  const [openInner, setOpenInner] = React.useState(defaultOpen);
  const open = (openProp ?? openInner) && !disabled;
  const [query, setQueryState] = React.useState('');
  const [announce, setAnnounce] = React.useState('');
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  React.useImperativeHandle(ref, () => triggerRef.current as HTMLButtonElement, []);

  const setQuery = (q: string) => {
    setQueryState(q);
    onQueryChange?.(q);
  };
  const setOpen = (o: boolean) => {
    setOpenInner(o);
    onOpenChange?.(o);
    if (!o) setQuery('');
  };
  const commit = (next: string[]) => {
    setInner(next);
    onValueChange?.(next);
  };
  const nameOf = (pid: string) => people.find(p => p.id === pid)?.name ?? pid;

  const remove = (pid: string) => {
    commit(value.filter(v => v !== pid));
    setAnnounce(removedText(nameOf(pid)));
    triggerRef.current?.focus();
  };
  const pick = (pid: string) => {
    if (!multiple) {
      commit([pid]);
      setAnnounce(addedText(nameOf(pid)));
      setOpen(false);
      return;
    }
    if (value.includes(pid)) {
      commit(value.filter(v => v !== pid));
      setAnnounce(removedText(nameOf(pid)));
    } else {
      commit([...value, pid]);
      setAnnounce(addedText(nameOf(pid)));
    }
    setQuery('');
  };

  const visible = loading ? [] : shouldFilter ? people.filter(p => filter(p, query)) : people;
  const lb = useListbox({ items: visible.map(p => ({ value: p.id, disabled: p.disabled })), onSelect: pick });
  React.useEffect(() => {
    if (open) lb.setActiveValue(visible.find(p => !p.disabled)?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const groups: { label?: string; people: Person[] }[] = [];
  for (const p of visible) {
    const g = groups.find(x => x.label === p.group);
    if (g) g.people.push(p);
    else groups.push({ label: p.group, people: [p] });
  }
  const renderPerson = (p: Person) => (
    <PersonOption
      key={p.id}
      value={p.id}
      name={p.name}
      description={detailOf(p) || undefined}
      avatar={p.avatar}
      selected={value.includes(p.id)}
      showCheckbox={multiple}
      disabled={p.disabled}
    />
  );

  const q = query.trim();
  const status = loading ? loadingText : visible.length === 0 ? emptyText(q) : '';
  const shown = value.slice(0, maxVisible);
  const hidden = value.length - shown.length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div
          data-slot="people-picker"
          data-state={open ? 'open' : 'closed'}
          data-disabled={disabled || undefined}
          onMouseDown={e => {
            // A click on the field background opens it, as the trigger does.
            if (disabled || (e.target as HTMLElement).closest('button')) return;
            e.preventDefault();
            triggerRef.current?.focus();
            setOpen(!open);
          }}
          className={cn(
            'flex min-h-[var(--control-height)] w-full min-w-0 cursor-pointer flex-wrap items-center gap-1.5 rounded-input border border-input bg-background px-2 py-1 text-foreground shadow-xs transition-[box-shadow,border-color] duration-[var(--duration-fast)]',
            'has-[[data-slot=people-picker-trigger]:focus-visible]:border-ring has-[[data-slot=people-picker-trigger]:focus-visible]:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)] data-[state=open]:border-ring',
            isInvalid && 'border-destructive data-[state=open]:border-destructive',
            disabled && 'cursor-not-allowed opacity-50',
            className,
          )}
        >
          {value.length ? (
            <fieldset disabled={disabled} data-slot="people-picker-selected" className="m-0 flex min-w-0 max-w-full flex-wrap items-center gap-1.5 border-0 p-0">
              {shown.map(pid => (
                <ContextChip key={pid} type="person" person={nameOf(pid)} onRemove={() => remove(pid)} className="max-w-full" />
              ))}
              {hidden > 0 ? (
                <span data-slot="people-picker-more" className="shrink-0 px-1 text-sm leading-5 text-muted-foreground">
                  +{hidden}<span className="sr-only"> more</span>
                </span>
              ) : null}
            </fieldset>
          ) : null}
          <PopoverTrigger asChild>
            <button
              ref={triggerRef}
              type="button"
              role="combobox"
              id={id}
              disabled={disabled}
              aria-label={label}
              aria-describedby={describedBy}
              aria-invalid={isInvalid || undefined}
              data-slot="people-picker-trigger"
              onKeyDown={e => {
                if (!open && e.key === 'ArrowDown') {
                  e.preventDefault();
                  setOpen(true);
                } else if (!open && e.key === 'Backspace' && value.length) {
                  e.preventDefault();
                  remove(value[value.length - 1]);
                }
              }}
              className="h-6 min-w-16 flex-1 cursor-pointer truncate bg-transparent px-0 text-left text-sm leading-5 text-muted-foreground outline-none disabled:cursor-not-allowed"
            >
              {placeholder}
            </button>
          </PopoverTrigger>
          <span role="status" className="sr-only">{announce}</span>
        </div>
      </PopoverAnchor>
      <PopoverContent
        aria-label={listLabel}
        className="w-[var(--radix-popover-trigger-width)] min-w-60 overflow-hidden p-0"
        onOpenAutoFocus={e => {
          e.preventDefault();
          (e.currentTarget as HTMLElement).querySelector<HTMLInputElement>('[role="combobox"]')?.focus({ preventScroll: true });
        }}
      >
        <div data-slot="people-picker-search" className="flex h-[var(--control-height)] items-center gap-2 border-b border-border px-3">
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
            onKeyDown={e => {
              if (lb.onKeyDown(e)) return;
              if (e.key === 'Enter' && onInvite && visible.length === 0 && q) {
                e.preventDefault();
                onInvite(q);
                setOpen(false);
              }
            }}
            className="h-full min-w-0 flex-1 bg-transparent text-sm text-popover-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
        <Listbox state={lb} multiple={multiple} aria-label={listLabel} className={cn(visible.length === 0 && 'hidden')}>
          {groups.map((g, i) =>
            g.label ? (
              <ListboxGroup key={g.label} label={g.label}>{g.people.map(renderPerson)}</ListboxGroup>
            ) : (
              <React.Fragment key={`_${i}`}>{g.people.map(renderPerson)}</React.Fragment>
            ),
          )}
        </Listbox>
        <ListboxStatus loading={loading}>{status}</ListboxStatus>
        {onInvite ? (
          <>
            <ListboxSeparator className="mx-0 my-0" />
            <div data-slot="people-picker-footer" className="p-1">
              <Button
                variant="ghost"
                size="sm"
                leadingIcon={<Mail aria-hidden="true" />}
                className="w-full"
                onClick={() => {
                  onInvite(q);
                  setOpen(false);
                }}
              >
                {inviteLabel(q)}
              </Button>
            </div>
          </>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}

export { PeoplePicker };
