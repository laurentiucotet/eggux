// EGG UI FAB. Figma: FAB (Mobile page, "FAB / Component"). Type (icon, extended); Icon (default
// plus), Label ("New invoice"). The floating action button for the one main action on a mobile
// screen: new invoice, compose, add. 56 high, fully round, shadow-lg, primary. Extended shows the
// label next to the icon and shrinks to the icon when the list scrolls (`fabType="icon"`). One per
// screen, never for destructive or secondary actions. Icon only has the label as its accessible name.
// `fixed` places it bottom right, 16 px from the edges, above the Bottom Nav (bottom-20). Hide it
// while the keyboard is open and give the list bottom padding so it never covers the last row.
import * as React from 'react';
import { Plus } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button, type ButtonProps } from './button';

export type FabType = 'icon' | 'extended';

export interface FabProps extends Omit<ButtonProps, 'type' | 'variant' | 'size' | 'children' | 'leadingIcon' | 'trailingIcon' | 'aria-label'> {
  /** Figma Type. Default icon. */
  fabType?: FabType;
  /** Figma Icon (instance swap). Default plus. */
  icon?: React.ReactNode;
  /** Figma Label: the action ("New invoice"). Visible when extended, the accessible name when icon only. */
  label?: string;
  /** Pin it bottom right above the Bottom Nav (position: fixed). Default false. */
  fixed?: boolean;
}

function Fab({ fabType = 'icon', icon = <Plus />, label = 'New invoice', fixed = false, className, ...props }: FabProps) {
  const extended = fabType === 'extended';
  return (
    <Button
      data-slot="fab"
      data-type={fabType}
      type="button"
      aria-label={extended ? undefined : label}
      className={cn(
        'h-14 min-w-14 rounded-full text-base shadow-lg [&_svg]:size-6',
        extended ? 'gap-2 px-5' : 'w-14 px-0',
        fixed && 'fixed right-4 bottom-20 z-30',
        className,
      )}
      {...props}
    >
      {icon}
      {extended ? <span className="truncate">{label}</span> : null}
    </Button>
  );
}

export { Fab };
