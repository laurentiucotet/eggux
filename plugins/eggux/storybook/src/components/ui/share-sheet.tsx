// EGG UI Share Sheet. Code only (no Figma component yet). Mobile page. A bottom sheet (the Drawer)
// that shares one thing: a link preview line on top (icon, title, address, both truncated) and a
// grid of targets, each a labeled button of at least 72 x 72 (icon in a 44 circle, label under it):
// Messages, Mail, Copy link, Save, More. A target closes the sheet after it runs; a target with
// `keepOpen` (Copy link) stays and says what happened in a live line ("Link copied"). The grid
// wraps to the width (3 columns at 276). Escape, Cancel and a tap outside close it and focus returns
// to the trigger. Not for a list of actions on an item (use the Action Sheet) and not for the
// browser's native share when it exists (call it from `onSelect` of More).
import * as React from 'react';
import { Bookmark, Copy, Ellipsis, Link, Mail, MessageSquare } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Drawer, DrawerBody, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from './drawer';

export interface ShareTarget {
  id: string;
  label: string;
  /** An icon from `@/components/icons`. */
  icon: React.ReactNode;
  /** Stay open and show `doneText` in the live line. */
  keepOpen?: boolean;
  /** What happened, for `keepOpen` targets ("Link copied"). */
  doneText?: string;
  onSelect?: () => void;
}

export const defaultShareTargets: ShareTarget[] = [
  { id: 'messages', label: 'Messages', icon: <MessageSquare /> },
  { id: 'mail', label: 'Mail', icon: <Mail /> },
  { id: 'copy', label: 'Copy link', icon: <Copy />, keepOpen: true, doneText: 'Link copied' },
  { id: 'save', label: 'Save', icon: <Bookmark /> },
  { id: 'more', label: 'More', icon: <Ellipsis /> },
];

export interface ShareSheetProps {
  /** The element that opens the sheet. Focus returns to it on close. */
  trigger?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  /** The link preview line: what is shared. */
  preview?: { title: string; url: string };
  /** 2 to 8 targets. Default: Messages, Mail, Copy link, Save, More. */
  targets?: ShareTarget[];
  /** Called with the target id after any target runs. */
  onTarget?: (id: string) => void;
  cancelLabel?: string;
}

function ShareSheet({
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  title = 'Share',
  preview,
  targets = defaultShareTargets,
  onTarget,
  cancelLabel = 'Cancel',
}: ShareSheetProps) {
  const [done, setDone] = React.useState('');
  const run = (t: ShareTarget) => {
    t.onSelect?.();
    onTarget?.(t.id);
    if (t.keepOpen) setDone(t.doneText ?? `${t.label} done`);
  };
  const tile = 'flex min-h-[72px] min-w-0 flex-col items-center justify-start gap-1.5 rounded-lg px-1 py-2 text-xs leading-4 font-medium text-foreground outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50';
  const disc = 'flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-foreground [&_svg]:size-5';
  return (
    <Drawer open={open} defaultOpen={defaultOpen} onOpenChange={o => { if (!o) setDone(''); onOpenChange?.(o); }}>
      {trigger ? <DrawerTrigger asChild>{trigger}</DrawerTrigger> : null}
      <DrawerContent data-slot="share-sheet" className="gap-3">
        <DrawerHeader className="items-center text-center">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription className="sr-only">Choose where to send this</DrawerDescription>
        </DrawerHeader>
        <DrawerBody className="gap-3">
          {preview ? (
            <div data-slot="share-preview" className="flex min-w-0 items-center gap-3 rounded-lg border border-border px-3 py-2">
              <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-foreground [&_svg]:size-4"><Link /></span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm leading-5 font-medium">{preview.title}</span>
                <span className="block truncate text-xs leading-4 text-foreground/80">{preview.url}</span>
              </span>
            </div>
          ) : null}
          <ul role="list" aria-label="Share with" className="m-0 grid list-none gap-1 p-0 [grid-template-columns:repeat(auto-fill,minmax(80px,1fr))]">
            {targets.map(t => (
              <li key={t.id} className="flex min-w-0">
                {t.keepOpen ? (
                  <button type="button" className={cn(tile, 'w-full')} onClick={() => run(t)}>
                    <span aria-hidden="true" className={disc}>{t.icon}</span>
                    <span className="max-w-full truncate">{t.label}</span>
                  </button>
                ) : (
                  <DrawerClose asChild>
                    <button type="button" className={cn(tile, 'w-full')} onClick={() => run(t)}>
                      <span aria-hidden="true" className={disc}>{t.icon}</span>
                      <span className="max-w-full truncate">{t.label}</span>
                    </button>
                  </DrawerClose>
                )}
              </li>
            ))}
          </ul>
          <p role="status" className="m-0 min-h-5 truncate text-center text-sm leading-5 font-medium text-foreground">{done}</p>
        </DrawerBody>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button type="button" variant="outline" size="touch">{cancelLabel}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export { ShareSheet };
