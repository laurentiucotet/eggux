// EGG UI Export Dialog. Code only (no Figma component yet); family Data Transfer.
// A Dialog for exporting rows: a format (CSV, XLSX, JSON), a range (all rows, the filtered rows,
// the selected rows; a range with no rows is disabled and says why), a column checklist with a
// "Select all" box and a Start export button with a busy state. Built from Dialog, RadioGroup,
// Checkbox and Button. No file is made here: Start export calls onExport({ format, range, columns })
// and the parent runs the job and sets `busy`.
// A11y: Dialog focus rules (focus moves to the first field, Escape closes, focus returns to the
// trigger); each group is a fieldset-like labelled group; Select all is mixed (indeterminate) when
// some columns are on; Start export is disabled with a reason when no column is on; busy sets
// aria-busy, locks the options and speaks "Preparing your export" in a polite status.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Checkbox } from './checkbox';
import { Dialog, DialogBody, DialogClose, DialogContent, DialogFooter, DialogTrigger } from './dialog';
import { DialogHeader } from './dialog-header';
import { RadioGroup, RadioGroupItem } from './radio';

export type ExportFormat = 'csv' | 'xlsx' | 'json';
export type ExportRange = 'all' | 'filtered' | 'selected';

export interface ExportColumn {
  id: string;
  label: string;
}

export interface ExportOptions {
  format: ExportFormat;
  range: ExportRange;
  /** Column ids in the order of the list. */
  columns: string[];
}

export interface ExportDialogProps {
  columns: ExportColumn[];
  /** Row counts per range. A count of 0 disables that range. */
  counts: Record<ExportRange, number>;
  /** The element that opens the dialog (a Button). Leave out to control with `open`. */
  trigger?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultFormat?: ExportFormat;
  defaultRange?: ExportRange;
  /** Column ids on at first. Defaults to all. */
  defaultColumns?: string[];
  /** The export is running. */
  busy?: boolean;
  onExport?: (options: ExportOptions) => void;
  title?: string;
  description?: string;
  contentClassName?: string;
}

const formats: { id: ExportFormat; label: string; description: string }[] = [
  { id: 'csv', label: 'CSV', description: 'Plain text, opens in any spreadsheet.' },
  { id: 'xlsx', label: 'XLSX', description: 'An Excel workbook.' },
  { id: 'json', label: 'JSON', description: 'For other systems and scripts.' },
];

const fmt = (n: number) => n.toLocaleString('en');

function ExportDialog({ columns, counts, trigger, open, defaultOpen, onOpenChange, defaultFormat = 'csv', defaultRange = 'all', defaultColumns, busy = false, onExport, title = 'Export customers', description = 'Choose what goes into the file.', contentClassName }: ExportDialogProps) {
  const [format, setFormat] = React.useState<ExportFormat>(defaultFormat);
  const [range, setRange] = React.useState<ExportRange>(counts[defaultRange] > 0 ? defaultRange : 'all');
  const [on, setOn] = React.useState<string[]>(defaultColumns ?? columns.map(c => c.id));
  const formatId = React.useId();
  const rangeId = React.useId();
  const columnsId = React.useId();
  const reasonId = React.useId();

  const allOn = on.length === columns.length;
  const noneOn = on.length === 0;
  const toggle = (id: string, next: boolean) => setOn(list => (next ? columns.map(c => c.id).filter(x => x === id || list.includes(x)) : list.filter(x => x !== id)));
  const rowsInRange = counts[range];
  const rangeLabel = { all: 'all rows', filtered: 'filtered rows', selected: 'selected rows' }[range];
  const rangeItems: { id: ExportRange; label: string }[] = [
    { id: 'all', label: 'All rows' },
    { id: 'filtered', label: 'Filtered rows' },
    { id: 'selected', label: 'Selected rows' },
  ];

  return (
    <Dialog open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent size="default" className={contentClassName} aria-busy={busy || undefined}>
        <DialogHeader title={title} description={description} />
        <DialogBody>
          <fieldset disabled={busy} className="m-0 flex min-w-0 flex-col gap-5 border-0 p-0">
            <div className="flex min-w-0 flex-col gap-2">
              <span id={formatId} className="text-sm leading-5 font-medium">File format</span>
              <RadioGroup aria-labelledby={formatId} value={format} onValueChange={v => setFormat(v as ExportFormat)} className="gap-2">
                {formats.map(f => (
                  <RadioGroupItem key={f.id} value={f.id} label={f.label} description={f.description} />
                ))}
              </RadioGroup>
            </div>
            <div className="flex min-w-0 flex-col gap-2">
              <span id={rangeId} className="text-sm leading-5 font-medium">Rows to export</span>
              <RadioGroup aria-labelledby={rangeId} value={range} onValueChange={v => setRange(v as ExportRange)} className="gap-2">
                {rangeItems.map(r => (
                  <RadioGroupItem
                    key={r.id}
                    value={r.id}
                    label={r.label}
                    disabled={counts[r.id] === 0}
                    description={counts[r.id] === 0 ? (r.id === 'selected' ? 'No rows are selected.' : 'No rows match.') : `${fmt(counts[r.id])} ${counts[r.id] === 1 ? 'row' : 'rows'}`}
                  />
                ))}
              </RadioGroup>
            </div>
            <div role="group" aria-labelledby={columnsId} className="flex min-w-0 flex-col gap-2">
              <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <span id={columnsId} className="text-sm leading-5 font-medium">Columns</span>
                <Checkbox
                  label="Select all"
                  checked={allOn ? true : noneOn ? false : 'indeterminate'}
                  onCheckedChange={v => setOn(v === true ? columns.map(c => c.id) : [])}
                />
              </div>
              <div className="flex min-w-0 flex-col gap-2 rounded-lg border border-border p-3">
                {columns.map(c => (
                  <Checkbox key={c.id} label={c.label} checked={on.includes(c.id)} onCheckedChange={v => toggle(c.id, v === true)} />
                ))}
              </div>
            </div>
          </fieldset>
          <p className="m-0 min-w-0 text-sm leading-5 text-muted-foreground">
            {fmt(rowsInRange)} {rowsInRange === 1 ? 'row' : 'rows'} ({rangeLabel}), {on.length} {on.length === 1 ? 'column' : 'columns'}, {format.toUpperCase()}.
          </p>
          <p role="status" className="m-0 min-w-0 text-sm leading-5 font-medium text-foreground">
            {busy ? 'Preparing your export. This can take a moment.' : null}
          </p>
        </DialogBody>
        <DialogFooter>
          {noneOn ? <p id={reasonId} className="m-0 mr-auto min-w-0 text-xs leading-4 text-muted-foreground">Choose at least one column.</p> : null}
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            type="button"
            loading={busy}
            disabled={noneOn}
            aria-describedby={noneOn ? reasonId : undefined}
            onClick={() => onExport?.({ format, range, columns: on })}
            className={cn(busy && 'cursor-progress')}
          >
            Start export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { ExportDialog };
