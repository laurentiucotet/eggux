// EGG UI Table Cell Actions. Figma: Table page / Table Cell Actions (304:3298, node 245:2340).
// Last column, right-aligned: one frequent action as an icon button (Show edit) and the rest in a
// menu (ellipsis). Both buttons are named by the row ("Edit INV-1024", "Actions for INV-1024").
import * as React from 'react';
import { DropdownMenu } from 'radix-ui';
import { Ellipsis, Pencil } from '@/components/icons';
import { Button } from './button';
import { cn } from '@/lib/utils';

export interface TableCellActionItem {
  label: string;
  onSelect?: () => void;
  icon?: React.ReactNode;
  destructive?: boolean;
  disabled?: boolean;
}

export interface TableCellActionsProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** The row name used in the accessible names: "INV-1024". */
  rowName: string;
  /** Figma "Show edit" (default false). */
  showEdit?: boolean;
  onEdit?: () => void;
  /** Figma "Show menu" (default true). */
  showMenu?: boolean;
  /** Menu items; put a destructive item last. */
  items?: TableCellActionItem[];
}

const menuContent = 'z-50 min-w-40 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md';
const menuItem = 'flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0';

function TableCellActions({ rowName, showEdit = false, onEdit, showMenu = true, items = [], className, ...props }: TableCellActionsProps) {
  return (
    <div data-slot="table-cell-actions" className={cn('flex items-center justify-end gap-1', className)} {...props}>
      {showEdit && (
        <Button variant="ghost" size="icon" aria-label={`Edit ${rowName}`} title={`Edit ${rowName}`} onClick={onEdit}>
          <Pencil aria-hidden="true" />
        </Button>
      )}
      {showMenu && (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button variant="ghost" size="icon" aria-label={`Actions for ${rowName}`} title={`Actions for ${rowName}`}>
              <Ellipsis aria-hidden="true" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content align="end" sideOffset={4} className={menuContent} aria-label={`Actions for ${rowName}`}>
              {items.map(item => (
                <DropdownMenu.Item
                  key={item.label}
                  disabled={item.disabled}
                  onSelect={item.onSelect}
                  className={cn(menuItem, item.destructive && 'text-destructive data-[highlighted]:text-destructive')}
                >
                  {item.icon}
                  {item.label}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      )}
    </div>
  );
}

export { TableCellActions };
