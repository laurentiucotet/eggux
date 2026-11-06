// EGG UI Alert Dialog. Figma: Alert Dialog (Dialog page, "Alert Dialog / Component"). shadcn
// AlertDialog on Radix with the EGG presets of the Figma Type property:
//   confirm      a decision with consequences: Info icon, Cancel + primary action
//   destructive  irreversible loss: TriangleAlert icon in destructive, Cancel + destructive action
//   acknowledge  the user only needs to know: CircleCheck icon in success, one button
// Same surface as Dialog (512 wide, 24 px padding, 16 px gaps, radius lg, border, shadow lg) over
// a Scrim Tone=dialog. Header is Dialog Header with Close off and the status icon in its Media
// slot; the optional Content slot (AlertDialogBody, Figma Show content) holds a type-to-confirm
// field, a list of what is lost or an opt-in checkbox; Footer is Dialog Footer.
// Behavior (role="alertdialog"): no close X and no close on a scrim click; it closes only through
// its buttons or Escape (as Cancel). Focus starts on Cancel, or on the only button, stays inside,
// and returns to the trigger. Title and description are the aria-labelledby / aria-describedby.
import * as React from 'react';
import { AlertDialog as AlertDialogPrimitive } from 'radix-ui';
import { CircleCheck, Info, TriangleAlert } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button, type ButtonProps } from './button';
import { scrimVariants } from './scrim';
import {
  DialogDescription,
  DialogHeader,
  DialogHeaderIcon,
  DialogHeaderPrimitives,
  DialogTitle,
  type DialogHeaderPrimitiveSet,
  type DialogHeaderProps,
} from './dialog-header';
import { DialogFooter } from './dialog-footer';
import { DialogBody } from './dialog';

export type AlertDialogType = 'confirm' | 'destructive' | 'acknowledge';

const AlertDialogTypeContext = React.createContext<AlertDialogType>('confirm');

const alertDialogPrimitives: DialogHeaderPrimitiveSet = {
  Title: AlertDialogPrimitive.Title as DialogHeaderPrimitiveSet['Title'],
  Description: AlertDialogPrimitive.Description as DialogHeaderPrimitiveSet['Description'],
  Close: null,
};

function AlertDialog(props: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

function AlertDialogTrigger(props: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />;
}

function AlertDialogPortal(props: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />;
}

function AlertDialogOverlay({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(scrimVariants({ tone: 'dialog', position: 'fixed' }), className)}
      {...props}
    />
  );
}

export interface AlertDialogContentProps extends React.ComponentProps<typeof AlertDialogPrimitive.Content> {
  /** Figma Type: sets the header icon and the action button variant. */
  type?: AlertDialogType;
}

function AlertDialogContent({ className, type = 'confirm', onOpenAutoFocus, children, ref, ...props }: AlertDialogContentProps) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(ref, () => contentRef.current as HTMLDivElement);
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        data-type={type}
        className={cn(
          'fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-lg border bg-background p-6 text-foreground shadow-lg outline-none',
          className,
        )}
        onOpenAutoFocus={event => {
          onOpenAutoFocus?.(event);
          if (event.defaultPrevented) return;
          // Radix focuses Cancel. Type=acknowledge has no Cancel: focus the only button instead.
          if (!contentRef.current?.querySelector('[data-slot="alert-dialog-cancel"]')) {
            event.preventDefault();
            contentRef.current?.querySelector<HTMLElement>('[data-slot="dialog-footer"] button:not([disabled])')?.focus({ preventScroll: true });
          }
        }}
        {...props}
        ref={contentRef}
      >
        <AlertDialogTypeContext.Provider value={type}>
          <DialogHeaderPrimitives value={alertDialogPrimitives}>{children}</DialogHeaderPrimitives>
        </AlertDialogTypeContext.Provider>
      </AlertDialogPrimitive.Content>
    </AlertDialogPortal>
  );
}

const typeIcons: Record<AlertDialogType, React.ReactNode> = {
  confirm: <Info />,
  destructive: <TriangleAlert className="text-destructive" />,
  acknowledge: <CircleCheck className="text-success" />,
};

export interface AlertDialogHeaderProps extends Omit<DialogHeaderProps, 'showClose' | 'closeLabel'> {
  /** Figma Media slot: defaults to the icon of the Type; pass `null` to hide it. */
  media?: React.ReactNode;
}

/** Dialog Header with Close off and the Type icon in the Media slot. */
function AlertDialogHeader({ media, ...props }: AlertDialogHeaderProps) {
  const type = React.useContext(AlertDialogTypeContext);
  const resolvedMedia = media === undefined ? <DialogHeaderIcon>{typeIcons[type]}</DialogHeaderIcon> : media;
  return <DialogHeader media={resolvedMedia} showClose={false} {...props} />;
}

/** Figma Content slot (Show content): type-to-confirm field, what is lost, an opt-in checkbox. */
function AlertDialogBody(props: React.ComponentProps<typeof DialogBody>) {
  return <DialogBody data-slot="dialog-body" {...props} />;
}

const AlertDialogFooter = DialogFooter;
const AlertDialogTitle = DialogTitle;
const AlertDialogDescription = DialogDescription;

/** The action button; its variant follows the Type (destructive for Type=destructive). */
function AlertDialogAction({ variant, ...props }: ButtonProps) {
  const type = React.useContext(AlertDialogTypeContext);
  return (
    <AlertDialogPrimitive.Action asChild>
      <Button data-slot="alert-dialog-action" variant={variant ?? (type === 'destructive' ? 'destructive' : 'default')} {...props} />
    </AlertDialogPrimitive.Action>
  );
}

/** Cancel (outline). Escape does the same. */
function AlertDialogCancel({ variant = 'outline', children = 'Cancel', ...props }: ButtonProps) {
  return (
    <AlertDialogPrimitive.Cancel asChild>
      <Button data-slot="alert-dialog-cancel" variant={variant} {...props}>{children}</Button>
    </AlertDialogPrimitive.Cancel>
  );
}

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
};
