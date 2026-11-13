// EGG UI Validation Error List. Code only (no Figma component yet); family Data Transfer.
// The errors found in a file before an import, grouped by row or by column (a segmented switch).
// Each error shows the message, the value that caused it in mono ("not-an-email", or "(empty)")
// and a Jump action that calls onJump with the row and column, so the screen can scroll to the
// cell. Nothing is validated here: errors come in as data.
// A11y: a section named by its heading; groups are headings with a count, errors are lists; the
// switch is a labelled toggle group (radio behavior); Jump buttons say which row and column.
import * as React from 'react';
import { CircleAlert, CircleCheck } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Button } from './button';
import { ToggleGroup, ToggleGroupItem } from './toggle-group';

export interface ValidationError {
  id: string;
  /** 1-based row number in the file. */
  row: number;
  /** Column name as in the file header. */
  column: string;
  message: string;
  /** The value that caused the error. Empty string shows "(empty)". */
  value?: string;
}

export type ValidationGroupBy = 'row' | 'column';

export interface ValidationErrorListProps extends Omit<React.ComponentProps<'section'>, 'title' | 'onChange'> {
  errors: ValidationError[];
  groupBy?: ValidationGroupBy;
  defaultGroupBy?: ValidationGroupBy;
  onGroupByChange?: (value: ValidationGroupBy) => void;
  /** Called by the Jump action. */
  onJump?: (row: number, column: string) => void;
  title?: string;
  /** Heading level of the title; group headings sit one level below. */
  titleAs?: 'h2' | 'h3';
}

function ValidationErrorList({ errors, groupBy: groupByProp, defaultGroupBy = 'row', onGroupByChange, onJump, title = 'Fix these before importing', titleAs: Title = 'h2', className, ...props }: ValidationErrorListProps) {
  const [inner, setInner] = React.useState<ValidationGroupBy>(defaultGroupBy);
  const groupBy = groupByProp ?? inner;
  const headingId = React.useId();
  const GroupTitle = Title === 'h2' ? 'h3' : 'h4';

  const groups = React.useMemo(() => {
    const map = new Map<string, ValidationError[]>();
    for (const e of errors) {
      const key = groupBy === 'row' ? String(e.row) : e.column;
      map.set(key, [...(map.get(key) ?? []), e]);
    }
    const entries = Array.from(map.entries());
    if (groupBy === 'row') entries.sort((a, b) => Number(a[0]) - Number(b[0]));
    return entries;
  }, [errors, groupBy]);

  return (
    <section
      data-slot="validation-error-list"
      aria-labelledby={headingId}
      className={cn('flex w-full min-w-0 max-w-[640px] flex-col gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground', className)}
      {...props}
    >
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <Title id={headingId} className="m-0 flex min-w-0 items-center gap-2 text-base leading-6 font-semibold">
          <span className="min-w-0 truncate">{title}</span>
          <Badge variant={errors.length ? 'soft-destructive' : 'soft-success'} className="shrink-0">
            {errors.length} {errors.length === 1 ? 'error' : 'errors'}
          </Badge>
        </Title>
        {errors.length > 0 ? (
          <ToggleGroup
            type="single"
            variant="segmented"
            size="sm"
            aria-label="Group errors by"
            value={groupBy}
            onValueChange={v => {
              setInner(v as ValidationGroupBy);
              onGroupByChange?.(v as ValidationGroupBy);
            }}
          >
            <ToggleGroupItem value="row" label="By row" />
            <ToggleGroupItem value="column" label="By column" />
          </ToggleGroup>
        ) : null}
      </div>
      {errors.length === 0 ? (
        <p className="m-0 flex items-center gap-2 text-sm leading-5 text-muted-foreground">
          <CircleCheck aria-hidden="true" className="size-4 shrink-0 text-success" />
          No errors found. The file is ready to import.
        </p>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-4 p-0">
          {groups.map(([key, items]) => (
            <li key={key} data-group={key} className="flex min-w-0 flex-col gap-1">
              <GroupTitle className="m-0 min-w-0 truncate text-sm leading-5 font-semibold" title={groupBy === 'row' ? `Row ${key}` : key}>
                {groupBy === 'row' ? `Row ${key}` : <>Column <span className="font-mono">{key}</span></>}
                <span className="font-normal text-muted-foreground"> · {items.length} {items.length === 1 ? 'error' : 'errors'}</span>
              </GroupTitle>
              <ul className="m-0 flex list-none flex-col divide-y divide-border rounded-lg border border-border p-0">
                {items.map(e => (
                  <li key={e.id} className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2">
                    <div className="flex min-w-0 flex-[1_1_12rem] flex-col gap-0.5">
                      <span className="flex min-w-0 items-start gap-1.5 text-sm leading-5 text-destructive">
                        <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                        <span className="min-w-0 break-words">{e.message}</span>
                      </span>
                      <span className="min-w-0 truncate pl-[22px] text-xs leading-4 text-muted-foreground">
                        {groupBy === 'row' ? <>Column <span className="font-mono">{e.column}</span></> : <>Row {e.row}</>}
                        {e.value !== undefined ? (
                          <>
                            {' · '}
                            <span className="font-mono text-foreground" title={e.value}>{e.value === '' ? '(empty)' : e.value}</span>
                          </>
                        ) : null}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      className="shrink-0"
                      aria-label={`Go to row ${e.row}, column ${e.column}`}
                      onClick={() => onJump?.(e.row, e.column)}
                    >
                      Go to row
                    </Button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export { ValidationErrorList };
