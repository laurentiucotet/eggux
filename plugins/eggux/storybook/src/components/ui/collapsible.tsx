// EGG UI Collapsible. Figma: Collapsible (Accordion page). State (collapsed, expanded). A Button
// link sm trigger with a chevron opens the Content slot in place. The content stays mounted while
// collapsed (hidden), so values typed in its fields survive. shadcn Collapsible per code-mapping.
import * as React from 'react';
import { Collapsible as CollapsiblePrimitive } from 'radix-ui';
import { ChevronDown } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';

export interface CollapsibleProps extends Omit<React.ComponentProps<typeof CollapsiblePrimitive.Root>, 'children'> {
  /** Trigger label while collapsed: says what opens ("Show advanced settings"). */
  label: string;
  /** Trigger label while expanded ("Hide advanced settings"). Defaults to `label`. */
  openLabel?: string;
  /** Figma Content slot: the fields or rows it opens. */
  children: React.ReactNode;
}

function Collapsible({ label, openLabel, open: openProp, defaultOpen = false, onOpenChange, className, children, ...props }: CollapsibleProps) {
  const [inner, setInner] = React.useState(defaultOpen);
  const open = openProp ?? inner;
  const setOpen = (next: boolean) => {
    if (openProp === undefined) setInner(next);
    onOpenChange?.(next);
  };
  return (
    <CollapsiblePrimitive.Root
      data-slot="collapsible"
      open={open}
      onOpenChange={setOpen}
      className={cn('flex w-full flex-col items-start gap-3', className)}
      {...props}
    >
      <CollapsiblePrimitive.Trigger asChild>
        <Button
          variant="link"
          size="sm"
          className="h-8"
          trailingIcon={<ChevronDown aria-hidden="true" className={cn('transition-transform duration-[var(--duration-fast)] motion-reduce:transition-none', open && 'rotate-180')} />}
        >
          {open ? openLabel ?? label : label}
        </Button>
      </CollapsiblePrimitive.Trigger>
      <CollapsiblePrimitive.Content forceMount data-slot="collapsible-content" className="flex w-full flex-col gap-4 data-[state=closed]:hidden">
        {children}
      </CollapsiblePrimitive.Content>
    </CollapsiblePrimitive.Root>
  );
}

export { Collapsible };
