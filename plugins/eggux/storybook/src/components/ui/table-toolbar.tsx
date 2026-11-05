// EGG UI Table Toolbar. Figma: Table page / Table Toolbar (304:3502, node 55:178).
// Bulk action bar above a table while rows are selected: "N selected" and an Actions slot. The
// selection text fills (min 128, one line); the row wraps, so in narrow tables the Actions drop
// under it. The count is announced when it changes. Guide: eggux build-ui/components/table.md
import * as React from 'react';
import { X } from '@/components/icons';
import { Button } from './button';
import { cn } from '@/lib/utils';

export interface TableToolbarProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** Figma "Selection": "2 selected". */
  selection?: string;
  /** Figma "Actions" slot: Buttons (size sm) for the bulk actions. */
  children?: React.ReactNode;
  /** Shows a "Clear selection" icon button after the actions. */
  onClear?: () => void;
}

function TableToolbar({ selection = '2 selected', children, onClear, className, 'aria-label': ariaLabel = 'Bulk actions', ...props }: TableToolbarProps) {
  return (
    <div
      data-slot="table-toolbar"
      role="toolbar"
      aria-label={ariaLabel}
      className={cn('flex w-full flex-wrap items-center gap-2 bg-muted px-3 py-2', className)}
      {...props}
    >
      <p data-slot="table-toolbar-selection" role="status" className="min-w-32 flex-1 truncate text-sm font-medium text-foreground">{selection}</p>
      <div data-slot="table-toolbar-actions" className="flex shrink-0 items-center gap-2">
        {children}
        {onClear && (
          <Button variant="ghost" size="icon-sm" aria-label="Clear selection" title="Clear selection" onClick={onClear}>
            <X aria-hidden="true" />
          </Button>
        )}
      </div>
    </div>
  );
}

export { TableToolbar };
