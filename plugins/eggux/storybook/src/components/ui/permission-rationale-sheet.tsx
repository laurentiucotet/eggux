// EGG UI Permission Rationale Sheet. Code only (no Figma component yet). Mobile page. The sheet that
// explains WHY the app needs a permission before the system asks: a round icon, a title that names
// the permission ("Allow camera access?"), one sentence, up to three short reasons and two buttons:
// Allow (the primary, it triggers the system prompt in `onAllow`) and Not now (it only closes, and
// calls `onDeny`, the system prompt is not used up). Built on the Drawer. Escape and a tap outside
// close it like Not now but call nothing. Not for a permission that was already refused (use the
// Permission Denied Notice, which sends people to Settings).
import * as React from 'react';
import { Check, Image } from '@/components/icons';
import { Button } from './button';
import { Drawer, DrawerBody, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from './drawer';

export interface PermissionRationaleSheetProps {
  /** The element that opens the sheet. Focus returns to it on close. */
  trigger?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** An icon from `@/components/icons` for the permission. */
  icon?: React.ReactNode;
  /** Names the permission: "Allow camera access?". */
  title: string;
  /** One sentence: what it is used for. */
  description: string;
  /** Up to three short reasons or promises ("Photos stay on your phone"). */
  reasons?: string[];
  allowLabel?: string;
  denyLabel?: string;
  /** Allow was pressed: ask the system now. */
  onAllow?: () => void;
  /** Not now was pressed. */
  onDeny?: () => void;
}

function PermissionRationaleSheet({
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  icon,
  title,
  description,
  reasons = [],
  allowLabel = 'Allow',
  denyLabel = 'Not now',
  onAllow,
  onDeny,
}: PermissionRationaleSheetProps) {
  return (
    <Drawer open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger ? <DrawerTrigger asChild>{trigger}</DrawerTrigger> : null}
      <DrawerContent data-slot="permission-rationale-sheet" className="gap-4">
        <DrawerHeader className="items-center gap-3 text-center">
          {/* TODO: a Camera icon is not in the icon set yet; Image stands in unless `icon` is given. */}
          <span aria-hidden="true" className="flex size-16 items-center justify-center rounded-full bg-muted text-foreground [&_svg]:size-7">{icon ?? <Image />}</span>
          <DrawerTitle className="line-clamp-3">{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        {reasons.length ? (
          <DrawerBody>
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {reasons.slice(0, 3).map(r => (
                <li key={r} className="flex min-w-0 items-start gap-3 text-sm leading-5 text-foreground">
                  <span aria-hidden="true" className="mt-0.5 flex shrink-0 text-foreground [&_svg]:size-4"><Check /></span>
                  <span className="min-w-0 break-words">{r}</span>
                </li>
              ))}
            </ul>
          </DrawerBody>
        ) : null}
        <DrawerFooter>
          <DrawerClose asChild>
            <Button type="button" size="touch" onClick={onAllow}>{allowLabel}</Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button type="button" variant="ghost" size="touch" onClick={onDeny}>{denyLabel}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export { PermissionRationaleSheet };
