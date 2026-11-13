// EGG UI Import Preview Table. Code only (no Figma component yet); family Data Transfer.
// The first rows of a file as the import will read them: a row number column, one column per file
// column, error cells marked by an icon plus the message (never color alone), a summary line
// ("48 rows ready, 3 with errors") and an "Errors only" filter. The table scrolls inside its own
// container, which is focusable. Rows come in as data; nothing is parsed or validated here.
// A11y: a native table with a caption; row numbers are row headers ("Row 3"); a scroll region
// named after the table with tabindex 0; the summary is a polite status; the filter is a checkbox.
import * as React from 'react';
import { CircleAlert } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Checkbox } from './checkbox';

export interface ImportPreviewColumn {
  id: string;
  label: string;
}

export interface ImportPreviewRow {
  /** 1-based row number in the file. */
  number: number;
  cells: Record<string, string>;
  /** Column id to message. A column in here is an error cell. */
  errors?: Record<string, string>;
}

export interface ImportPreviewTableProps extends Omit<React.ComponentProps<'div'>, 'children' | 'onChange'> {
  columns: ImportPreviewColumn[];
  rows: ImportPreviewRow[];
  /** Rows in the whole file, when the preview is only the first rows. Defaults to rows.length. */
  totalRows?: number;
  /** Rows with errors in the whole file. Defaults to the count in the preview. */
  errorRows?: number;
  errorsOnly?: boolean;
  defaultErrorsOnly?: boolean;
  onErrorsOnlyChange?: (value: boolean) => void;
  /** Accessible name of the table. */
  label?: string;
}

function ImportPreviewTable({ columns, rows, totalRows, errorRows, errorsOnly: errorsOnlyProp, defaultErrorsOnly = false, onErrorsOnlyChange, label = 'Import preview', className, ...props }: ImportPreviewTableProps) {
  const [inner, setInner] = React.useState(defaultErrorsOnly);
  const errorsOnly = errorsOnlyProp ?? inner;
  const total = totalRows ?? rows.length;
  const failing = errorRows ?? rows.filter(r => r.errors && Object.keys(r.errors).length > 0).length;
  const ready = Math.max(0, total - failing);
  const shown = errorsOnly ? rows.filter(r => r.errors && Object.keys(r.errors).length > 0) : rows;
  const fmt = (n: number) => n.toLocaleString('en');
  const filterId = React.useId();

  return (
    <div data-slot="import-preview-table" className={cn('flex w-full min-w-0 flex-col gap-3', className)} {...props}>
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p role="status" className="m-0 min-w-0 text-sm leading-5 font-medium text-foreground">
          {fmt(ready)} {ready === 1 ? 'row' : 'rows'} ready, {fmt(failing)} with {failing === 1 ? 'error' : 'errors'}
        </p>
        <Checkbox
          id={filterId}
          label="Errors only"
          checked={errorsOnly}
          onCheckedChange={v => {
            setInner(v === true);
            onErrorsOnlyChange?.(v === true);
          }}
        />
      </div>
      <div role="region" aria-label={`${label}, scrollable`} tabIndex={0} className="min-w-0 max-w-full overflow-auto rounded-lg border border-border outline-none focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]">
        <table aria-label={label} className="w-full min-w-max border-collapse text-left text-sm leading-5">
          <thead>
            <tr className="bg-muted text-xs leading-4 text-foreground">
              <th scope="col" className="sticky left-0 z-10 w-16 bg-muted px-3 py-2 font-medium">Row</th>
              {columns.map(c => (
                <th key={c.id} scope="col" className="max-w-56 px-3 py-2 font-medium">
                  <span className="block truncate" title={c.label}>{c.label}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-3 py-6 text-center text-muted-foreground">No rows with errors in this preview.</td>
              </tr>
            ) : (
              shown.map(r => {
                const rowHasError = r.errors && Object.keys(r.errors).length > 0;
                return (
                  <tr key={r.number} data-row={r.number} data-error={rowHasError || undefined} className="border-t border-border">
                    <th scope="row" className="sticky left-0 z-10 bg-card px-3 py-2 text-xs font-medium tabular-nums text-muted-foreground">
                      <span className="sr-only">Row </span>{r.number}
                    </th>
                    {columns.map(c => {
                      const message = r.errors?.[c.id];
                      const value = r.cells[c.id] ?? '';
                      return (
                        <td key={c.id} data-error={message ? '' : undefined} className={cn('max-w-56 px-3 py-2 align-top', message && 'bg-[var(--badge-soft-destructive-bg)]')}>
                          <span className={cn('block truncate', message ? 'text-[var(--badge-soft-destructive-fg)]' : 'text-foreground', value === '' && !message && 'text-muted-foreground')} title={value}>
                            {value === '' ? '(empty)' : value}
                          </span>
                          {message ? (
                            <span className="mt-0.5 flex items-start gap-1 text-xs leading-4 font-medium text-[var(--badge-soft-destructive-fg)]">
                              <CircleAlert aria-hidden="true" className="mt-px size-3.5 shrink-0" />
                              <span className="min-w-0">{message}</span>
                            </span>
                          ) : null}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {total > rows.length ? <p className="m-0 text-xs leading-4 text-muted-foreground">Showing the first {fmt(rows.length)} of {fmt(total)} rows.</p> : null}
    </div>
  );
}

export { ImportPreviewTable };
