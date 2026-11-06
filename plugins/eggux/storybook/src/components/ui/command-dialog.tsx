// EGG UI Command Dialog. Figma: Command Dialog (Popover page, "Command Dialog / Component",
// symbol 122:368). The command palette: a Command in the EGG Dialog (DialogContent with its
// dialog/overlay scrim), 560 wide, ~20% from the top, popover surface, radius lg, shadow lg.
// Command Input 48 high (spacing/12); Items slot with Menu Label groups, Menu Items with icons and
// shortcuts, Separators; a footer row (8 / 12 px padding, top divider, 16 px between hints) with
// Kbd keys and ui/caption muted labels: ↑ ↓ Navigate, ↵ Open, esc Close.
// Opens with ⌘K on Mac and Ctrl K elsewhere (`shortcut`), and from a visible search button.
// Modal: focus goes to the input, Escape closes, focus returns to where it was. The dialog title
// is visually hidden and names both the dialog and the list.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Command, type CommandProps } from './command';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './dialog';
import { Kbd, KbdGroup } from './kbd';

/** "⌘" on Apple platforms, "Ctrl" elsewhere. */
function modifierKey() {
  if (typeof navigator === 'undefined') return 'Ctrl';
  return /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent) ? '⌘' : 'Ctrl';
}

export interface CommandDialogProps extends Omit<CommandProps, 'title'> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Accessible name of the dialog and the list. Visually hidden. */
  title?: string;
  /** Accessible description. Visually hidden. */
  description?: string;
  /** Toggle the dialog with ⌘K / Ctrl K from anywhere on the page. Default true. */
  shortcut?: boolean;
  /** The footer with the keys. Default true; pass false to hide it, or a node to replace it. */
  footer?: React.ReactNode | boolean;
  contentClassName?: string;
}

function CommandDialog({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  title = 'Command palette',
  description = 'Search pages, records and actions.',
  shortcut = true,
  footer = true,
  contentClassName,
  className,
  children,
  ...props
}: CommandDialogProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultOpen);
  const open = openProp ?? uncontrolled;
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setUncontrolled(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  // Radix returns focus only to a Dialog.Trigger; the palette opens from a shortcut or any
  // button, so it remembers what had focus when it opened (read during the render that opens it,
  // before the dialog moves focus) and returns focus there on close.
  const wasOpen = React.useRef(false);
  const returnFocus = React.useRef<HTMLElement | null>(null);
  if (open && !wasOpen.current && typeof document !== 'undefined') {
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  }
  wasOpen.current = open;

  React.useEffect(() => {
    if (!shortcut) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey) && !event.altKey && !event.shiftKey) {
        event.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [shortcut, open, setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        data-slot="command-dialog"
        className={cn(
          'top-[20%] max-w-[560px] translate-y-0 gap-0 overflow-hidden bg-popover p-0 text-popover-foreground',
          contentClassName,
        )}
        onCloseAutoFocus={event => {
          const target = returnFocus.current;
          if (target?.isConnected) {
            event.preventDefault();
            target.focus();
          }
        }}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">{description}</DialogDescription>
        <Command
          label={title}
          className={cn(
            '[&_[data-slot=command-input-wrapper]]:h-12 [&_[data-slot=command-list]]:max-h-[min(300px,calc(80dvh-6rem))]',
            className,
          )}
          {...props}
        >
          {children}
        </Command>
        {footer === true ? <CommandDialogFooter /> : footer || null}
      </DialogContent>
    </Dialog>
  );
}

/** Figma footer: the keys that work in the palette, after a divider. */
function CommandDialogFooter({ className, children, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="command-dialog-footer"
      className={cn('flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1 border-t border-border px-3 py-2 text-xs leading-4 text-muted-foreground', className)}
      {...props}
    >
      {children ?? (
        <>
          <span className="flex items-center gap-1">
            <KbdGroup><Kbd>↑</Kbd><Kbd>↓</Kbd></KbdGroup> Navigate
          </span>
          <span className="flex items-center gap-1">
            <Kbd>↵</Kbd> Open
          </span>
          <span className="flex items-center gap-1">
            <Kbd srLabel="Escape">esc</Kbd> Close
          </span>
        </>
      )}
    </div>
  );
}

export { CommandDialog, CommandDialogFooter, modifierKey };
