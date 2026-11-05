// EGG UI Bulk Action Bar. Figma: Table page / Bulk Action Bar (1167:7122, node 1092:87723).
// Floating bar while items are selected in a card grid, board, gallery or inbox: the count
// ("3 selected", announced politely), an optional "Select all 48" link, a vertical Separator, the
// Actions slot (outline sm Buttons with icons) and Clear. Popover surface, radius lg, shadow lg.
// Tables use Table Toolbar above the table instead. Guides: build-ui/components/table.md,
// patterns/bulk-actions.md
import * as React from 'react';
import { X } from '@/components/icons';
import { Button } from './button';
import { Separator } from './separator';
import { cn } from '@/lib/utils';

export interface BulkActionBarProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** Figma Selection: "3 selected". */
  selection?: string;
  /** Figma Actions slot: outline sm Buttons with a leading icon (3 at most). */
  children?: React.ReactNode;
  /** Figma Show select all: shows the link; `selectAllLabel` is its text. */
  showSelectAll?: boolean;
  selectAllLabel?: string;
  onSelectAll?: () => void;
  /** Figma Show clear: Clear selection button. Escape inside the bar also calls `onClear`. */
  showClear?: boolean;
  onClear?: () => void;
  /** Pins the bar bottom center, 24 px above the bottom edge. Off keeps it in the flow. */
  floating?: boolean;
}

function BulkActionBar({
  selection = '3 selected',
  children,
  showSelectAll = false,
  selectAllLabel = 'Select all 48',
  onSelectAll,
  showClear = true,
  onClear,
  floating = false,
  className,
  'aria-label': ariaLabel = 'Bulk actions',
  onKeyDown,
  ...props
}: BulkActionBarProps) {
  return (
    <div
      data-slot="bulk-action-bar"
      role="toolbar"
      aria-label={ariaLabel}
      onKeyDown={e => {
        onKeyDown?.(e);
        if (e.key === 'Escape' && onClear) onClear();
      }}
      className={cn(
        'flex w-fit max-w-full items-center gap-3 rounded-lg border border-border bg-popover py-2 pl-4 pr-2 text-popover-foreground shadow-lg',
        floating && 'fixed bottom-6 left-1/2 z-50 -translate-x-1/2',
        className,
      )}
      {...props}
    >
      <div data-slot="bulk-action-bar-selection" className="flex shrink-0 items-center gap-2">
        <p role="status" aria-live="polite" className="whitespace-nowrap text-sm font-medium leading-5 text-foreground">{selection}</p>
        {showSelectAll && <Button variant="link" size="sm" className="h-8 px-0" onClick={onSelectAll}>{selectAllLabel}</Button>}
      </div>
      <Separator orientation="vertical" spacing="sm" />
      <div data-slot="bulk-action-bar-actions" className="flex shrink-0 items-center gap-2">{children}</div>
      {showClear && (
        <Button variant="ghost" size="icon-sm" aria-label="Clear selection" title="Clear selection" onClick={onClear}>
          <X aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}

export { BulkActionBar };
