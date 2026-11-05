// EGG UI Kbd and Kbd Group. Figma: Kbd (symbol 110:32) and Kbd Group (symbol 110:34) on the Kbd
// page. One key: 20 high, hugs its label (min 20), 4 px side padding, ui/label-small,
// bg-muted with text-foreground (muted text on the muted key is 4.35:1 in Light). Kbd Group: 4 px
// gap. shadcn Kbd / KbdGroup. Symbols get a readable name for screen readers (⌘ -> "Command").
import * as React from 'react';
import { cn } from '@/lib/utils';

const symbolNames: Record<string, string> = {
  '⌘': 'Command',
  '⌥': 'Option',
  '⇧': 'Shift',
  '⌃': 'Control',
  '↵': 'Enter',
  '⏎': 'Enter',
  '⎋': 'Escape',
  '⌫': 'Backspace',
  '⌦': 'Delete',
  '⇥': 'Tab',
  '␣': 'Space',
  '↑': 'Up arrow',
  '↓': 'Down arrow',
  '←': 'Left arrow',
  '→': 'Right arrow',
};

export interface KbdProps extends React.ComponentProps<'kbd'> {
  /** Spoken name when the key is a symbol the table does not know. Known symbols name themselves. */
  srLabel?: string;
}

function Kbd({ className, children, srLabel, ...props }: KbdProps) {
  const text = typeof children === 'string' ? children : undefined;
  const name = srLabel ?? (text ? symbolNames[text] : undefined);
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        'relative inline-flex h-5 min-w-5 select-none items-center justify-center whitespace-nowrap rounded-sm bg-muted px-1 font-sans text-xs font-medium leading-4 text-foreground',
        className,
      )}
      {...props}
    >
      {name ? (
        <>
          <span aria-hidden="true">{children}</span>
          <span className="sr-only">{name}</span>
        </>
      ) : (
        children
      )}
    </kbd>
  );
}

function KbdGroup({ className, ...props }: React.ComponentProps<'span'>) {
  return <span data-slot="kbd-group" className={cn('inline-flex items-center gap-1', className)} {...props} />;
}

export { Kbd, KbdGroup };
