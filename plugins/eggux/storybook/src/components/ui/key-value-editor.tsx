// EGG UI Key Value Editor. Code only (no Figma component yet); family Developer.
// Rows of a key Input and a value Input with Add row and Remove row, for HTTP headers and
// environment variables. Column headings are visible once; every input also has its own accessible
// name ("Key, row 2"), so a screen reader knows where it is. A key used twice marks both keys
// aria-invalid and says so under the list ("Key "API_URL" is used more than once"), tied to the
// inputs with aria-describedby; an empty row is ignored by the duplicate check. Add row moves focus
// to the new key, Remove row moves it to the next row (or the Add button). `maskValues` hides the
// values (type=password) for secrets. At 276 px a row wraps: key, value and Remove stack.
import * as React from 'react';
import { Plus, Trash2 } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { ButtonIcon } from './button-icon';
import { Input } from './input';

export interface KeyValueRow {
  key: string;
  value: string;
}

export interface KeyValueEditorProps extends Omit<React.ComponentProps<'div'>, 'onChange' | 'defaultValue'> {
  /** Controlled rows. */
  value?: KeyValueRow[];
  defaultValue?: KeyValueRow[];
  onChange?: (rows: KeyValueRow[]) => void;
  /** Column heading and name of the key input. */
  keyLabel?: string;
  /** Column heading and name of the value input. */
  valueLabel?: string;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  /** Text of the add button. */
  addLabel?: string;
  /** Hide the values like a password (secrets). */
  maskValues?: boolean;
  disabled?: boolean;
  /** Accessible name of the whole editor ("HTTP headers"). */
  'aria-label'?: string;
}

type Row = KeyValueRow & { id: number };

export function findDuplicateKeys(rows: KeyValueRow[]): string[] {
  const seen = new Set<string>();
  const dup = new Set<string>();
  for (const r of rows) {
    const k = r.key.trim();
    if (!k) continue;
    if (seen.has(k)) dup.add(k);
    seen.add(k);
  }
  return [...dup];
}

function KeyValueEditor({
  value,
  defaultValue = [],
  onChange,
  keyLabel = 'Key',
  valueLabel = 'Value',
  keyPlaceholder = 'X-Request-Id',
  valuePlaceholder = 'abc-123',
  addLabel = 'Add row',
  maskValues = false,
  disabled = false,
  className,
  'aria-label': ariaLabel = 'Key value pairs',
  ...props
}: KeyValueEditorProps) {
  const nextId = React.useRef(0);
  const withIds = (rows: KeyValueRow[]): Row[] => rows.map(r => ({ ...r, id: nextId.current++ }));
  const [rows, setRows] = React.useState<Row[]>(() => withIds(value ?? defaultValue));
  const root = React.useRef<HTMLDivElement>(null);
  const addButton = React.useRef<HTMLButtonElement>(null);
  const focusTarget = React.useRef<{ kind: 'key'; index: number } | { kind: 'add' } | null>(null);
  const describeId = React.useId();

  // Controlled: follow the parent when its rows change from outside.
  React.useEffect(() => {
    if (value === undefined) return;
    setRows(prev => (value.length === prev.length && value.every((v, i) => v.key === prev[i]!.key && v.value === prev[i]!.value) ? prev : value.map((v, i) => ({ ...v, id: prev[i]?.id ?? nextId.current++ }))));
  }, [value]);

  const commit = (next: Row[]) => {
    setRows(next);
    onChange?.(next.map(({ key, value: v }) => ({ key, value: v })));
  };

  // Focus after the render that holds the target.
  React.useEffect(() => {
    const t = focusTarget.current;
    if (!t) return;
    focusTarget.current = null;
    if (t.kind === 'add') addButton.current?.focus();
    else root.current?.querySelectorAll<HTMLInputElement>('[data-slot="key-value-key"]')[t.index]?.focus();
  }, [rows]);

  const duplicates = findDuplicateKeys(rows);
  const isDup = (r: Row) => r.key.trim() !== '' && duplicates.includes(r.key.trim());
  const message = duplicates.length
    ? duplicates.map(k => `Key "${k}" is used more than once.`).join(' ') + ' Keys must be unique.'
    : '';

  return (
    <div ref={root} data-slot="key-value-editor" role="group" aria-label={ariaLabel} className={cn('flex w-full min-w-0 flex-col gap-2', className)} {...props}>
      {rows.length > 0 ? (
        <div aria-hidden="true" className="flex gap-2 text-xs leading-4 font-medium text-muted-foreground max-sm:hidden">
          <span className="min-w-0 flex-1 basis-40">{keyLabel}</span>
          <span className="min-w-0 flex-[1.5] basis-40">{valueLabel}</span>
          <span className="w-9 shrink-0" />
        </div>
      ) : null}
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {rows.map((r, i) => {
          const invalid = isDup(r);
          return (
            <li key={r.id} data-slot="key-value-row" className="flex min-w-0 flex-wrap items-center gap-2 max-sm:rounded-md max-sm:border max-sm:border-border max-sm:p-2">
              <Input
                data-slot="key-value-key"
                aria-label={`${keyLabel}, row ${i + 1}`}
                aria-invalid={invalid || undefined}
                aria-describedby={invalid ? describeId : undefined}
                value={r.key}
                placeholder={keyPlaceholder}
                disabled={disabled}
                spellCheck={false}
                autoComplete="off"
                className="min-w-0 flex-1 basis-40 font-mono"
                onChange={e => commit(rows.map(x => (x.id === r.id ? { ...x, key: e.target.value } : x)))}
              />
              <Input
                data-slot="key-value-value"
                type={maskValues ? 'password' : 'text'}
                aria-label={`${valueLabel}, row ${i + 1}`}
                value={r.value}
                placeholder={valuePlaceholder}
                disabled={disabled}
                spellCheck={false}
                autoComplete="off"
                className="min-w-0 flex-[1.5] basis-40 font-mono"
                onChange={e => commit(rows.map(x => (x.id === r.id ? { ...x, value: e.target.value } : x)))}
              />
              <ButtonIcon
                variant="ghost"
                icon={<Trash2 aria-hidden="true" />}
                label={`Remove row ${i + 1}${r.key.trim() ? `, ${r.key.trim()}` : ''}`}
                disabled={disabled}
                onClick={() => {
                  const next = rows.filter(x => x.id !== r.id);
                  focusTarget.current = next.length === 0 ? { kind: 'add' } : { kind: 'key', index: Math.min(i, next.length - 1) };
                  commit(next);
                }}
              />
            </li>
          );
        })}
      </ul>
      {rows.length === 0 ? <p className="m-0 text-sm text-muted-foreground">Nothing added yet.</p> : null}
      <p id={describeId} role="alert" className={cn('m-0 text-sm text-destructive', !message && 'sr-only')}>{message}</p>
      <div>
        <Button
          ref={addButton as React.Ref<HTMLButtonElement>}
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          leadingIcon={<Plus aria-hidden="true" />}
          onClick={() => {
            focusTarget.current = { kind: 'key', index: rows.length };
            commit([...rows, { id: nextId.current++, key: '', value: '' }]);
          }}
        >
          {addLabel}
        </Button>
      </div>
    </div>
  );
}

export { KeyValueEditor };
