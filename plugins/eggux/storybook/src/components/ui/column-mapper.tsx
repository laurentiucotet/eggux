// EGG UI Column Mapper. Code only (no Figma component yet); family Data Transfer.
// The step of an import where each column of the file is matched to a field: one row per file
// column with its name and a few sample values, an arrow and a Select of the fields (plus "Do not
// import"). Required fields are marked "Required" in the list and in a summary line. Two columns
// on the same field are an error on both rows. "Match automatically" fills the empty rows by
// comparing names (case and punctuation ignored). The mapping is `{ columnId: fieldId | 'skip' | '' }`
// and is controlled with value / onValueChange or left to the component with defaultValue.
// A11y: a section with a heading; every Select is named "Field for column X"; a duplicate sets
// aria-invalid and a message linked by aria-describedby; the missing-required summary and the
// auto-match result are polite status text.
import * as React from 'react';
import { ArrowRight, CircleAlert, Sparkles } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Button } from './button';
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger } from './select';

export interface MapperColumn {
  id: string;
  /** The header as written in the file. */
  header: string;
  /** A few values from the first rows, shown in mono. */
  samples: string[];
}

export interface MapperField {
  id: string;
  label: string;
  required?: boolean;
}

export const SKIP = 'skip';
export type ColumnMapping = Record<string, string>;

export interface ColumnMapperProps extends Omit<React.ComponentProps<'section'>, 'onChange' | 'defaultValue' | 'title'> {
  columns: MapperColumn[];
  fields: MapperField[];
  value?: ColumnMapping;
  defaultValue?: ColumnMapping;
  onValueChange?: (mapping: ColumnMapping) => void;
  title?: string;
  titleAs?: 'h2' | 'h3' | 'h4';
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

function ColumnMapper({ columns, fields, value: valueProp, defaultValue, onValueChange, title = 'Match your columns', titleAs: Title = 'h3', className, ...props }: ColumnMapperProps) {
  const [inner, setInner] = React.useState<ColumnMapping>(defaultValue ?? {});
  const mapping = valueProp ?? inner;
  const [announce, setAnnounce] = React.useState('');
  const headingId = React.useId();
  const baseId = React.useId();

  const set = (next: ColumnMapping) => {
    if (valueProp === undefined) setInner(next);
    onValueChange?.(next);
  };

  // Which columns use each field (skip and empty do not count).
  const users = new Map<string, string[]>();
  for (const c of columns) {
    const f = mapping[c.id];
    if (f && f !== SKIP) users.set(f, [...(users.get(f) ?? []), c.id]);
  }
  const headerOf = (id: string) => columns.find(c => c.id === id)?.header ?? id;
  const missing = fields.filter(f => f.required && !users.has(f.id));
  const requiredCount = fields.filter(f => f.required).length;
  const duplicates = Array.from(users.values()).filter(ids => ids.length > 1).length;

  const autoMatch = () => {
    const next = { ...mapping };
    const taken = new Set(Object.values(next).filter(v => v && v !== SKIP));
    let matched = 0;
    for (const c of columns) {
      if (next[c.id]) continue;
      const hit = fields.find(f => !taken.has(f.id) && (norm(f.id) === norm(c.header) || norm(f.label) === norm(c.header)));
      if (hit) {
        next[c.id] = hit.id;
        taken.add(hit.id);
        matched += 1;
      }
    }
    set(next);
    setAnnounce(matched === 0 ? 'No more columns matched by name.' : `Matched ${matched} ${matched === 1 ? 'column' : 'columns'} by name.`);
  };

  return (
    <section
      data-slot="column-mapper"
      aria-labelledby={headingId}
      className={cn('flex w-full min-w-0 max-w-[720px] flex-col gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground', className)}
      {...props}
    >
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <Title id={headingId} className="m-0 min-w-0 text-base leading-6 font-semibold break-words">{title}</Title>
        <Button type="button" variant="outline" size="sm" leadingIcon={<Sparkles aria-hidden="true" />} onClick={autoMatch}>
          Match automatically
        </Button>
      </div>
      <p role="status" className="m-0 min-w-0 text-sm leading-5 text-muted-foreground">
        {announce || `${requiredCount - missing.length} of ${requiredCount} required fields matched.`}
        {missing.length > 0 ? <> Still needed: <span className="font-medium text-foreground">{missing.map(f => f.label).join(', ')}</span>.</> : null}
        {duplicates > 0 ? <span className="font-medium text-destructive"> {duplicates} {duplicates === 1 ? 'field is' : 'fields are'} used twice.</span> : null}
      </p>
      <ul className="m-0 flex list-none flex-col divide-y divide-border rounded-lg border border-border p-0">
        {columns.map(c => {
          const chosen = mapping[c.id] ?? '';
          const clash = chosen && chosen !== SKIP ? (users.get(chosen) ?? []).filter(id => id !== c.id) : [];
          const errorId = `${baseId}-${c.id}-error`;
          return (
            <li key={c.id} data-column={c.id} className="flex min-w-0 flex-wrap items-start gap-x-3 gap-y-2 px-3 py-3">
              <div className="flex min-w-0 flex-[1_1_9rem] flex-col gap-0.5">
                <span className="min-w-0 truncate text-sm leading-5 font-medium" title={c.header}>{c.header}</span>
                <span className="min-w-0 truncate font-mono text-xs leading-4 text-muted-foreground" title={c.samples.join(', ')}>
                  {c.samples.length ? c.samples.join(', ') : 'No sample values'}
                </span>
              </div>
              <ArrowRight aria-hidden="true" className="mt-2 hidden size-4 shrink-0 text-muted-foreground min-[560px]:block" />
              <div className="flex min-w-0 flex-[1_1_9rem] flex-col gap-1">
                <Select
                  size="default"
                  value={chosen}
                  onValueChange={v => set({ ...mapping, [c.id]: v })}
                  aria-invalid={clash.length > 0 ? true : undefined}
                  aria-describedby={clash.length > 0 ? errorId : undefined}
                >
                  <SelectTrigger aria-label={`Field for column ${c.header}`} placeholder="Choose a field" className="w-full" />
                  <SelectContent>
                    {fields.map(f => (
                      <SelectItem key={f.id} value={f.id} description={f.required ? 'Required' : undefined}>{f.label}</SelectItem>
                    ))}
                    <SelectSeparator />
                    <SelectItem value={SKIP}>Do not import</SelectItem>
                  </SelectContent>
                </Select>
                {clash.length > 0 ? (
                  <p id={errorId} className="m-0 flex items-start gap-1 text-xs leading-4 font-medium text-destructive">
                    <CircleAlert aria-hidden="true" className="mt-px size-3.5 shrink-0" />
                    <span className="min-w-0 break-words">Already used by {clash.map(headerOf).join(', ')}. Each field takes one column.</span>
                  </p>
                ) : chosen && chosen !== SKIP && fields.find(f => f.id === chosen)?.required ? (
                  <Badge size="sm" variant="soft-neutral" className="self-start">Required field</Badge>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export { ColumnMapper };
