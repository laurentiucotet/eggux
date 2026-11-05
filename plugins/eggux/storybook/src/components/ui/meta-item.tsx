// EGG UI Meta Item. Figma: Meta Item (Card page dependency of Event Card and Location Card). One
// fact with an icon: 16 px icon, body/small muted text, 6 gap. The text truncates past 280 px. The
// icon is decorative; the text says the kind of fact. Put the Meta Item in a link and the label keeps
// its color.
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface MetaItemProps extends React.ComponentProps<'div'> {
  /** Figma Icon: an icon element from `@/components/icons` (clock, map-pin, phone...). */
  icon: React.ReactNode;
}

function MetaItem({ icon, className, children, ...props }: MetaItemProps) {
  return (
    <div data-slot="meta-item" className={cn('flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground', className)} {...props}>
      <span aria-hidden="true" className="flex size-4 shrink-0 items-center justify-center [&_svg]:size-4">{icon}</span>
      <span className="min-w-0 max-w-[280px] truncate">{children}</span>
    </div>
  );
}

export { MetaItem };
