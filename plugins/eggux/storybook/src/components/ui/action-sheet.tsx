// EGG UI Action Sheet. Figma: Action Sheet (Mobile page, "Action Sheet / Component"). Show header
// (Title, Description); Action 1..3 with icons; Destructive action; Cancel. A short list of actions for
// one item on mobile, rising from the bottom: share, duplicate, download, delete. 2 to 6 actions, one
// line each, destructive last and red; Cancel sits apart. Tap outside, Escape or Cancel close it and
// focus returns to the trigger. Built on the Drawer (a Radix Dialog fixed to the bottom). Rows are at
// least 48 high; the destructive action is named by its label, not by color alone. Content or forms
// go in a Drawer, desktop uses a Menu.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Drawer, DrawerBody, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from './drawer';

export interface ActionSheetAction {
  label: string;
  /** Figma Action icon (instance swap): an icon from `@/components/icons`. */
  icon?: React.ReactNode;
  /** Red, and placed last. It still asks for confirmation when it cannot be undone. */
  destructive?: boolean;
  onSelect?: () => void;
}

export interface ActionSheetProps {
  /** The element that opens the sheet (a button). Focus returns to it on close. */
  trigger?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Figma Title: names the object ("INV-2041"). Always set: it is the dialog name (hidden when Show header is off). */
  title: string;
  /** Figma Description: what you can do here. */
  description?: string;
  /** Figma Show header. Default true. */
  showHeader?: boolean;
  /** 2 to 6 actions, one line each. A destructive action goes last. */
  actions: ActionSheetAction[];
  /** Figma Cancel. */
  cancelLabel?: string;
}

function ActionSheet({ trigger, open, defaultOpen, onOpenChange, title, description, showHeader = true, actions, cancelLabel = 'Cancel' }: ActionSheetProps) {
  // Destructive last, whatever the order given.
  const ordered = [...actions.filter(a => !a.destructive), ...actions.filter(a => a.destructive)];
  return (
    <Drawer open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger ? <DrawerTrigger asChild>{trigger}</DrawerTrigger> : null}
      <DrawerContent data-slot="action-sheet" className="gap-3 px-3">
        <DrawerHeader className={cn('w-full items-center gap-1 px-2 text-center', !showHeader && 'sr-only')}>
          <DrawerTitle className="line-clamp-2">{title}</DrawerTitle>
          {description ? <DrawerDescription className="line-clamp-3">{description}</DrawerDescription> : <DrawerDescription className="sr-only">Choose an action</DrawerDescription>}
        </DrawerHeader>
        <DrawerBody className="w-full gap-0 p-0">
          <ul className="m-0 flex list-none flex-col p-0">
            {ordered.map(a => (
              <li key={a.label}>
                <DrawerClose asChild>
                  <button
                    type="button"
                    onClick={a.onSelect}
                    className={cn(
                      'flex min-h-12 w-full items-center gap-3 rounded-lg px-3 text-left text-base leading-6 font-medium outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 [&_svg]:size-5 [&_svg]:shrink-0',
                      a.destructive ? 'text-destructive' : 'text-foreground',
                    )}
                  >
                    {a.icon}
                    <span className="min-w-0 flex-1 truncate">{a.label}</span>
                  </button>
                </DrawerClose>
              </li>
            ))}
          </ul>
        </DrawerBody>
        <div className="w-full border-t border-border pt-2">
          <DrawerClose asChild>
            <button type="button" className="flex min-h-12 w-full items-center justify-center rounded-lg px-3 text-base leading-6 font-semibold outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50">
              <span className="truncate">{cancelLabel}</span>
            </button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export { ActionSheet };
