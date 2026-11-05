// EGG UI Separator. Figma: Separator (Separator page, "Separator / Component").
// Orientation (horizontal, vertical) x Spacing (none, sm, md), Show label (Label slot, horizontal
// only), Show start line. shadcn Separator on the radix-ui primitive. Decorative by default (hidden
// from screen readers); `decorative={false}` gives role="separator". Spacing adds padding on both
// sides of the line: sm = 4, md = 8. Horizontal fills the parent width, vertical is 24 high.
import * as React from 'react';
import { Separator as SeparatorPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

export type SeparatorSpacing = 'none' | 'sm' | 'md';

export interface SeparatorProps extends Omit<React.ComponentProps<typeof SeparatorPrimitive.Root>, 'children'> {
  /** Figma Spacing: space on both sides of the line. none = 0, sm = 4 (menus), md = 8. */
  spacing?: SeparatorSpacing;
  /** Figma Label slot (Show label), horizontal only: short text or a ghost sm Button in the middle of the line. */
  label?: React.ReactNode;
  /** Figma Show start line: off puts the label at the start ("Earlier"). Only with a label. */
  showStartLine?: boolean;
}

const horizontalSpacing: Record<SeparatorSpacing, string> = { none: '', sm: 'py-1', md: 'py-2' };
const verticalSpacing: Record<SeparatorSpacing, string> = { none: '', sm: 'px-1', md: 'px-2' };

function Separator({
  orientation = 'horizontal',
  decorative = true,
  spacing = 'none',
  label,
  showStartLine = true,
  className,
  ...props
}: SeparatorProps) {
  const line = 'bg-border';

  if (orientation === 'horizontal' && label != null && label !== false) {
    return (
      <div
        data-slot="separator"
        data-orientation="horizontal"
        role={decorative ? 'none' : 'separator'}
        aria-orientation={decorative ? undefined : 'horizontal'}
        className={cn('w-full min-w-0', horizontalSpacing[spacing], className)}
        {...props}
      >
        <div className="flex min-w-0 items-center gap-3">
          {showStartLine ? <span aria-hidden="true" data-slot="separator-line" className={cn('h-px min-w-px flex-1', line)} /> : null}
          <div data-slot="separator-label" className={cn('flex min-w-0 items-center gap-2 text-xs leading-4 text-muted-foreground', typeof label === 'string' ? 'overflow-hidden text-ellipsis whitespace-nowrap' : 'shrink-0')}>{label}</div>
          <span aria-hidden="true" data-slot="separator-line" className={cn('h-px min-w-px flex-1', line)} />
        </div>
      </div>
    );
  }

  if (spacing === 'none') {
    return (
      <SeparatorPrimitive.Root
        data-slot="separator"
        decorative={decorative}
        orientation={orientation}
        className={cn(line, orientation === 'horizontal' ? 'h-px w-full' : 'h-6 w-px', 'shrink-0', className)}
        {...props}
      />
    );
  }

  // With spacing the padding lives on a wrapper, so the line itself stays 1 px.
  return (
    <div
      data-slot="separator-spacing"
      className={cn('flex shrink-0', orientation === 'horizontal' ? cn('w-full flex-col', horizontalSpacing[spacing]) : cn('h-6', verticalSpacing[spacing]))}
      aria-hidden={decorative ? 'true' : undefined}
    >
      <SeparatorPrimitive.Root
        data-slot="separator"
        decorative={decorative}
        orientation={orientation}
        className={cn(line, orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px', 'shrink-0', className)}
        {...props}
      />
    </div>
  );
}

export { Separator };
