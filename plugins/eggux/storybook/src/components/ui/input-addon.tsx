// EGG UI Input Addon. Figma: Input Addon (Input page, "Input Group / Component", set 112:21).
// Position (start, end), Text (default "https://"). Text or an icon attached to an Input Group:
// protocol, domain, unit, currency, @. Fills the group height, 12 px sides, 8 px gap, body/small,
// background/muted with a 1 px border/input divider toward the field (right at start, left at end).
// Not editable and not part of the value: Input Group links its text to the input as a description.
// Text color: Figma has foreground/muted, which is 4.35:1 on background/muted in Light; the code uses
// input/filled-muted-foreground (the token made for text on the muted fill) so it passes 4.5:1.
import * as React from 'react';
import { cn } from '@/lib/utils';

export type InputAddonPosition = 'start' | 'end';

export interface InputAddonProps extends React.ComponentProps<'span'> {
  /** Figma Position: start (divider on the right) or end (divider on the left). */
  position?: InputAddonPosition;
}

function InputAddon({ position = 'start', className, ...props }: InputAddonProps) {
  return (
    <span
      data-slot="input-addon"
      data-position={position}
      className={cn(
        'flex h-full shrink-0 items-center gap-2 whitespace-nowrap border-input bg-muted px-3 text-sm leading-5 text-[var(--input-filled-muted-foreground)] select-none',
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        position === 'start' ? 'border-r' : 'border-l',
        className,
      )}
      {...props}
    />
  );
}

export { InputAddon };
