// EGG UI Filters page: Filter Bar (252:1187), Filter Chip (247:889: empty / active), Faceted Filter
// (247:919), Facet Option (247:918), Filter Section (247:1109: expanded / collapsed), Filter Group
// (179:1131), Filter Condition (179:1130: first / next), Saved View Item (451:2990).
// Filter Bar: search (256) and the End slot (sort, columns) on the first row; Filter Chips and
// Clear all on the second; filter changes are announced. Filter Chip: empty = dashed "+ Owner"
// that opens a Faceted Filter; active = field, up to two values (then "3 selected"), chevron to
// edit and a separate remove button. Faceted Filter: 240 popover with a search, Facet Options
// (checkbox, label, count) that apply on each click, and Clear filters. Filter Section: a side
// panel group with the selected count, collapse, the first 5 options and "Show N more".
// Filter Group: muted panel of Filter Conditions ("Where" / and / or, field, operator, value,
// remove) and Add condition. Saved View Item: a 32 high button with the view name, shared icon
// and count; the active view on secondary with aria-current.
import * as React from 'react';
import { ChevronDown, ChevronUp, ListFilter, Plus, Users, X } from '@/components/icons';
import { cn } from '@/lib/utils';
import { BadgeCount } from './badge-count';
import { Button } from './button';
import { ButtonIcon } from './button-icon';
import { Checkbox } from './checkbox';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { SearchField } from './search-field';
import { Select, SelectContent, SelectItem, SelectTrigger } from './select';
import { Separator } from './separator';

export interface FacetValue { value: string; label: string; count?: number }

/* Facet Option */

export interface FacetOptionProps extends Omit<React.ComponentProps<'div'>, 'onChange'> {
  label: string;
  count?: number;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  /** In a side panel there is no side padding. */
  inset?: boolean;
}

function FacetOption({ label, count, checked, onCheckedChange, inset = true, className, ...props }: FacetOptionProps) {
  const id = React.useId();
  return (
    <div data-slot="facet-option" className={cn('flex w-full items-center gap-2 rounded-sm py-1.5 hover:bg-accent', inset ? 'px-2' : 'px-0', className)} {...props}>
      <Checkbox id={id} checked={checked} onCheckedChange={c => onCheckedChange(c === true)} />
      <label htmlFor={id} className="flex min-w-0 flex-1 cursor-pointer items-center gap-2">
        <span className="min-w-0 flex-1 truncate text-sm leading-5 text-foreground">{label}</span>
        {count !== undefined ? <span className="shrink-0 text-xs leading-4 text-muted-foreground">{count.toLocaleString('en')}</span> : null}
      </label>
    </div>
  );
}

/* Faceted Filter */

export interface FacetedFilterProps extends Omit<React.ComponentProps<'div'>, 'onChange'> {
  /** Field name: "Status". */
  field: string;
  options: FacetValue[];
  value: string[];
  onValueChange: (value: string[]) => void;
}

function FacetedFilter({ field, options, value, onValueChange, className, ...props }: FacetedFilterProps) {
  const [query, setQuery] = React.useState('');
  const shown = options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()));
  return (
    <div data-slot="faceted-filter" className={cn('flex w-60 flex-col', className)} {...props}>
      <div className="border-b border-border">
        <SearchField placeholder={`Search ${field.toLowerCase()}…`} label={`Search ${field.toLowerCase()}`} value={query} onValueChange={setQuery} showShortcut={false} debounce={0} className="w-full rounded-none border-0 shadow-none focus-within:shadow-[inset_0_0_0_2px_var(--ring)]" />
      </div>
      <div role="group" aria-label={field} className="flex max-h-64 flex-col overflow-y-auto p-1">
        {shown.map(o => (
          <FacetOption
            key={o.value}
            label={o.label}
            count={o.count}
            checked={value.includes(o.value)}
            onCheckedChange={c => onValueChange(c ? [...value, o.value] : value.filter(v => v !== o.value))}
          />
        ))}
        {!shown.length ? <p className="m-0 px-2 py-1.5 text-sm leading-5 text-muted-foreground">No {field.toLowerCase()} matches “{query}”.</p> : null}
      </div>
      <Separator />
      <div className="p-1">
        <Button variant="ghost" size="sm" className="w-full" disabled={!value.length} onClick={() => onValueChange([])}>Clear filters</Button>
      </div>
    </div>
  );
}

/* Filter Chip */

export interface FilterChipProps {
  field: string;
  options: FacetValue[];
  value: string[];
  onValueChange: (value: string[]) => void;
  className?: string;
}

function summary(options: FacetValue[], value: string[]) {
  const names = value.map(v => options.find(o => o.value === v)?.label ?? v);
  return names.length > 2 ? `${names.length} selected` : names.join(', ');
}

const chip = 'inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-input bg-background text-sm leading-5 outline-none';

function FilterChip({ field, options, value, onValueChange, className }: FilterChipProps) {
  const active = value.length > 0;
  return (
    <Popover>
      {active ? (
        <span data-slot="filter-chip" data-type="active" className={cn(chip, 'pr-1 pl-3', className)}>
          <PopoverTrigger asChild>
            <button type="button" className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-transparent outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
              <span className="text-muted-foreground">{field}</span>
              <span className="max-w-[200px] truncate font-medium text-foreground">{summary(options, value)}</span>
              <ChevronDown aria-hidden="true" className="size-3.5 text-foreground" />
            </button>
          </PopoverTrigger>
          <button type="button" aria-label={`Remove ${field} filter`} onClick={() => onValueChange([])} className="flex size-6 cursor-pointer items-center justify-center rounded-full text-foreground outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 [&_svg]:size-3.5">
            <X aria-hidden="true" />
          </button>
        </span>
      ) : (
        <PopoverTrigger asChild>
          <button type="button" data-slot="filter-chip" data-type="empty" className={cn(chip, 'cursor-pointer border-dashed px-3 font-medium text-foreground hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50', className)}>
            <Plus aria-hidden="true" className="size-3.5" />
            {field}
          </button>
        </PopoverTrigger>
      )}
      <PopoverContent className="w-auto overflow-hidden p-0">
        <FacetedFilter field={field} options={options} value={value} onValueChange={onValueChange} />
      </PopoverContent>
    </Popover>
  );
}

/* Filter Bar */

export interface FilterField { field: string; options: FacetValue[] }

export interface FilterBarProps extends Omit<React.ComponentProps<'div'>, 'onChange'> {
  /** Search placeholder: "Search invoices…". */
  searchPlaceholder: string;
  query?: string;
  onQueryChange?: (q: string) => void;
  fields: FilterField[];
  /** field → chosen values. */
  value: Record<string, string[]>;
  onValueChange: (value: Record<string, string[]>) => void;
  /** End slot: sort, columns, export. */
  end?: React.ReactNode;
  /** Read after each change: "24 invoices". */
  resultText?: string;
}

function FilterBar({ searchPlaceholder, query, onQueryChange, fields, value, onValueChange, end, resultText, className, ...props }: FilterBarProps) {
  const any = Object.values(value).some(v => v.length);
  return (
    <div data-slot="filter-bar" role="search" aria-label="Filters" className={cn('flex w-full flex-col gap-2', className)} {...props}>
      <div className="flex items-center gap-2">
        <SearchField placeholder={searchPlaceholder} value={query} onValueChange={onQueryChange} className="w-64" />
        <span className="flex-1" />
        {end ? <div className="flex shrink-0 items-center gap-2">{end}</div> : null}
      </div>
      <div className="flex items-start gap-2">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          {fields.map(f => (
            <FilterChip key={f.field} field={f.field} options={f.options} value={value[f.field] ?? []} onValueChange={v => onValueChange({ ...value, [f.field]: v })} />
          ))}
        </div>
        {any ? <Button variant="ghost" size="sm" onClick={() => onValueChange(Object.fromEntries(Object.keys(value).map(k => [k, []])))}>Clear all</Button> : null}
      </div>
      <p aria-live="polite" className="sr-only">{resultText}</p>
    </div>
  );
}

/* Filter Section */

export interface FilterSectionProps extends Omit<React.ComponentProps<'div'>, 'onChange'> {
  title: string;
  options: FacetValue[];
  value: string[];
  onValueChange: (value: string[]) => void;
  defaultOpen?: boolean;
  /** Options shown before "Show N more". Default 5. */
  visible?: number;
  /** Another control instead of options (Slider, Date Range Picker). */
  children?: React.ReactNode;
}

function FilterSection({ title, options, value, onValueChange, defaultOpen = true, visible = 5, children, className, ...props }: FilterSectionProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  const [all, setAll] = React.useState(false);
  const id = React.useId();
  const shown = all ? options : options.slice(0, visible);
  const hidden = options.length - shown.length;
  return (
    <div data-slot="filter-section" data-state={open ? 'expanded' : 'collapsed'} className={cn('flex w-64 flex-col gap-2 border-b border-border py-4', className)} {...props}>
      <h3 className="m-0">
        <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(o => !o)} className="flex w-full cursor-pointer items-center gap-2 rounded-sm bg-transparent p-0 text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
          <span className="min-w-0 flex-1 text-sm leading-5 font-medium text-foreground">{title}</span>
          {value.length ? <BadgeCount variant="secondary" count={value.length} label={`${value.length} selected`} /> : null}
          {open ? <ChevronUp aria-hidden="true" className="size-4" /> : <ChevronDown aria-hidden="true" className="size-4" />}
        </button>
      </h3>
      <div id={id} hidden={!open} className="flex flex-col items-start">
        {children ?? (
          <div role="group" aria-label={title} className="flex w-full flex-col">
            {shown.map(o => <FacetOption key={o.value} inset={false} label={o.label} count={o.count} checked={value.includes(o.value)} onCheckedChange={c => onValueChange(c ? [...value, o.value] : value.filter(v => v !== o.value))} />)}
          </div>
        )}
        {!children && hidden > 0 ? <Button variant="link" size="sm" className="mt-2 h-8" onClick={() => setAll(true)}>Show {hidden} more</Button> : null}
      </div>
    </div>
  );
}

/* Filter Condition and Group */

export interface FilterConditionData { id: string; field: string; operator: string; join?: 'and' | 'or' }

export interface FilterConditionProps extends Omit<React.ComponentProps<'div'>, 'onChange'> {
  /** First condition starts with "Where"; the next ones with and / or. */
  position: 'first' | 'next';
  join?: 'and' | 'or';
  onJoinChange?: (join: 'and' | 'or') => void;
  fields: { value: string; label: string }[];
  field: string;
  onFieldChange: (field: string) => void;
  operators: { value: string; label: string }[];
  operator: string;
  onOperatorChange: (operator: string) => void;
  /** The value control: Tag Input, Date Range Picker, Number Input. */
  children: React.ReactNode;
  onRemove?: () => void;
  /** For names: "Condition 2". */
  label: string;
}

function FilterCondition({ position, join = 'and', onJoinChange, fields, field, onFieldChange, operators, operator, onOperatorChange, children, onRemove, label, className, ...props }: FilterConditionProps) {
  return (
    <div data-slot="filter-condition" data-position={position} role="group" aria-label={label} className={cn('flex w-full flex-wrap items-start gap-2', className)} {...props}>
      <div className="flex h-9 w-[88px] shrink-0 items-center">
        {position === 'first' ? (
          <span className="text-sm leading-5 text-[var(--input-filled-muted-foreground)]">Where</span>
        ) : (
          <Select value={join} onValueChange={v => onJoinChange?.(v as 'and' | 'or')}>
            <SelectTrigger aria-label={`${label}: and or or`} className="w-full" />
            <SelectContent><SelectItem value="and">and</SelectItem><SelectItem value="or">or</SelectItem></SelectContent>
          </Select>
        )}
      </div>
      <Select value={field} onValueChange={onFieldChange}>
        <SelectTrigger aria-label={`${label}: field`} className="w-[180px]" />
        <SelectContent>{fields.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}</SelectContent>
      </Select>
      <Select value={operator} onValueChange={onOperatorChange}>
        <SelectTrigger aria-label={`${label}: operator`} className="w-[168px]" />
        <SelectContent>{operators.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
      </Select>
      <div className="min-w-36 flex-1">{children}</div>
      {onRemove ? <ButtonIcon variant="ghost" icon={<X aria-hidden="true" />} label={`Remove ${label.toLowerCase()}`} onClick={onRemove} /> : null}
    </div>
  );
}

export interface FilterGroupProps extends React.ComponentProps<'div'> {
  onAdd?: () => void;
  addLabel?: string;
}

function FilterGroup({ onAdd, addLabel = 'Add condition', className, children, ...props }: FilterGroupProps) {
  return (
    <div data-slot="filter-group" className={cn('flex w-full flex-col items-start gap-2 rounded-xl bg-muted p-3', className)} {...props}>
      <div className="flex w-full flex-col gap-2">{children}</div>
      {onAdd ? <Button variant="ghost" size="sm" leadingIcon={<Plus aria-hidden="true" />} onClick={onAdd}>{addLabel}</Button> : null}
    </div>
  );
}

/* Saved View Item */

export interface SavedViewItemProps extends Omit<React.ComponentProps<'button'>, 'children'> {
  name: string;
  count?: number;
  shared?: boolean;
  active?: boolean;
}

function SavedViewItem({ name, count, shared = false, active = false, className, ...props }: SavedViewItemProps) {
  return (
    <button
      type="button"
      data-slot="saved-view-item"
      data-state={active ? 'active' : 'default'}
      aria-current={active ? 'true' : undefined}
      className={cn('flex h-8 w-60 max-w-full cursor-pointer items-center gap-2 rounded-md px-2 text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50', active ? 'bg-secondary' : 'bg-transparent hover:bg-accent', className)}
      {...props}
    >
      <ListFilter aria-hidden="true" className="size-3.5 shrink-0 text-foreground" />
      <span className="min-w-0 flex-1 truncate text-sm leading-5 font-medium text-foreground">{name}</span>
      {shared ? <><Users aria-hidden="true" className="size-3 shrink-0 text-muted-foreground" /><span className="sr-only">, shared</span></> : null}
      {count !== undefined ? <BadgeCount variant="secondary" count={count} label={`${count} items`} /> : null}
    </button>
  );
}

export { FacetOption, FacetedFilter, FilterBar, FilterChip, FilterCondition, FilterGroup, FilterSection, SavedViewItem };
