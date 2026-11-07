// EGG UI Description List Item. Figma: Description List Item (Description List page,
// "Description List Item / Component", 91:11). Orientation (horizontal, vertical), Style (default,
// bordered), Show action, Show divider.
// Label-value pairs for record details, as dl / dt / dd. Horizontal: label 160 wide (ui/label
// muted), value body/small, 16 gap, 12 px vertical, 1 px divider under the row (off on the last
// row). Vertical: label over value, 4 gap, for narrow columns and grids. Bordered (horizontal): a
// table-like row, the label on a card/muted cell (96-192, 2 : 3 with the value) with a right border,
// the whole row bordered; stacked rows overlap their borders. Action: a Copy Button xs (or a pencil
// Button Icon) after the value. An empty value shows "Not set" in muted, never blank.
import * as React from 'react';
import { cn } from '@/lib/utils';

export type DescriptionListOrientation = 'horizontal' | 'vertical';
export type DescriptionListStyle = 'default' | 'bordered';

export interface DescriptionListProps extends React.ComponentProps<'dl'> {
  /** Figma Style=bordered: rows overlap their borders and the outer corners round. */
  listStyle?: DescriptionListStyle;
}

function DescriptionList({ listStyle = 'default', className, ...props }: DescriptionListProps) {
  return (
    <dl
      data-slot="description-list"
      data-style={listStyle}
      className={cn(
        'm-0 flex min-w-0 flex-col',
        listStyle === 'default' && '[&>[data-slot=description-list-item]:last-child]:border-b-0',
        listStyle === 'bordered' && '[&>*+*]:-mt-px [&>*:first-child]:rounded-t-md [&>*:last-child]:rounded-b-md [&>*:first-child>dt]:rounded-tl-md [&>*:last-child>dt]:rounded-bl-md',
        className,
      )}
      {...props}
    />
  );
}

export interface DescriptionListItemProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  label: React.ReactNode;
  /** The value; empty shows `emptyLabel`. */
  children?: React.ReactNode;
  orientation?: DescriptionListOrientation;
  /** Figma Style. Bordered is horizontal only. */
  itemStyle?: DescriptionListStyle;
  /** Figma Show action: a CopyButton size xs or a ButtonIcon. */
  action?: React.ReactNode;
  /** Figma Show divider (default style); DescriptionList hides it on the last row. */
  divider?: boolean;
  emptyLabel?: string;
}

function DescriptionListItem({ label, children, orientation = 'horizontal', itemStyle = 'default', action, divider = true, emptyLabel = 'Not set', className, ...props }: DescriptionListItemProps) {
  const empty = children === undefined || children === null || children === '';
  const value = empty ? <span className="text-muted-foreground">{emptyLabel}</span> : children;
  if (itemStyle === 'bordered') {
    return (
      <div data-slot="description-list-item" data-style="bordered" className={cn('flex min-w-0 items-stretch border border-border bg-card', className)} {...props}>
        <dt className="flex max-w-48 min-w-24 flex-[2_1_0] border-r border-border bg-[var(--card-muted)] px-4 py-3 text-sm leading-5 font-medium text-muted-foreground [overflow-wrap:anywhere]">{label}</dt>
        <dd className="m-0 flex min-w-30 flex-[3_1_0] items-center gap-2 px-4 py-3 text-sm leading-5 text-foreground [overflow-wrap:anywhere]">
          <span className="min-w-0 flex-1">{value}</span>
          {action ? <span className="-my-1.5 -mr-2 flex shrink-0 self-start">{action}</span> : null}
        </dd>
      </div>
    );
  }
  const vertical = orientation === 'vertical';
  return (
    <div
      data-slot="description-list-item"
      data-orientation={orientation}
      className={cn('flex min-w-0 py-3', vertical ? 'flex-col gap-1' : 'items-center gap-4', divider && 'border-b border-border', className)}
      {...props}
    >
      <dt className={cn('text-sm leading-5 font-medium text-muted-foreground [overflow-wrap:anywhere]', vertical ? 'w-full' : 'w-40 shrink-0')}>{label}</dt>
      <dd className="m-0 flex min-w-0 flex-1 items-center gap-2 text-sm leading-5 text-foreground [overflow-wrap:anywhere]">
        <span className="min-w-0 flex-1">{value}</span>
        {action ? <span className="-my-1 flex shrink-0">{action}</span> : null}
      </dd>
    </div>
  );
}

export { DescriptionList, DescriptionListItem };
