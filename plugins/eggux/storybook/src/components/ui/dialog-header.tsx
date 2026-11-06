// EGG UI Dialog Header. Figma: Dialog Header (Dialog page, "Dialog / Component"). shadcn
// DialogHeader with the EGG layout: optional Media (40 px circle on background/muted with a 20 px
// icon), title (body/large: 18/28 semibold) over the description (body/small: 14/20 muted), 8 px
// apart, and a 24 px Close X on the right; 16 px between the three. Used by Dialog and Alert Dialog
// (Show close off) and meant for Sheet and Drawer too.
// The title and description render through the overlay's own Title / Description primitives, so
// they become the overlay's aria-labelledby / aria-describedby. Radix Dialog is the default; an
// overlay with other primitives (Alert Dialog, a vaul Drawer) wraps its content in
// <DialogHeaderPrimitives value={{ Title, Description, Close }}>.
import * as React from 'react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { X } from '@/components/icons';
import { cn } from '@/lib/utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PrimitiveComponent = React.ComponentType<any>;

export interface DialogHeaderPrimitiveSet {
  Title: PrimitiveComponent;
  Description: PrimitiveComponent;
  /** Close button primitive; null when the overlay has no close X (Alert Dialog). */
  Close: PrimitiveComponent | null;
}

const radixDialogPrimitives: DialogHeaderPrimitiveSet = {
  Title: DialogPrimitive.Title as PrimitiveComponent,
  Description: DialogPrimitive.Description as PrimitiveComponent,
  Close: DialogPrimitive.Close as PrimitiveComponent,
};

const DialogHeaderPrimitivesContext = React.createContext<DialogHeaderPrimitiveSet>(radixDialogPrimitives);

/** Lets an overlay that is not a Radix Dialog (Alert Dialog, Drawer) supply its own primitives. */
function DialogHeaderPrimitives({ value, children }: { value: DialogHeaderPrimitiveSet; children: React.ReactNode }) {
  return <DialogHeaderPrimitivesContext.Provider value={value}>{children}</DialogHeaderPrimitivesContext.Provider>;
}

function useDialogHeaderPrimitives() {
  return React.useContext(DialogHeaderPrimitivesContext);
}

const titleClass = 'text-lg leading-7 font-semibold text-foreground';
const descriptionClass = 'text-sm leading-5 text-muted-foreground';

function DialogTitle({ className, ...props }: React.ComponentProps<'h2'>) {
  const { Title } = useDialogHeaderPrimitives();
  return <Title data-slot="dialog-title" className={cn(titleClass, className)} {...props} />;
}

function DialogDescription({ className, ...props }: React.ComponentProps<'p'>) {
  const { Description } = useDialogHeaderPrimitives();
  return <Description data-slot="dialog-description" className={cn(descriptionClass, className)} {...props} />;
}

/** Figma Media slot default: an icon in a 40 px circle on background/muted. */
function DialogHeaderIcon({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="dialog-header-icon"
      aria-hidden="true"
      className={cn('flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-foreground [&_svg]:size-5', className)}
      {...props}
    />
  );
}

export interface DialogHeaderProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  /** Figma Title: says the task ("Invite member") or the question ("Delete project?"). */
  title?: React.ReactNode;
  /** Figma Description (Show description): one or two sentences; the accessible description. */
  description?: React.ReactNode;
  /** Figma Media slot (Show media): usually a DialogHeaderIcon, an Avatar or an illustration. */
  media?: React.ReactNode;
  /** Figma Show close: the 24 px X that closes the overlay. Off in Alert Dialog. */
  showClose?: boolean;
  /** Accessible name of the close X. */
  closeLabel?: string;
}

function DialogHeader({ className, title, description, media, showClose = true, closeLabel = 'Close', children, ...props }: DialogHeaderProps) {
  const { Close } = useDialogHeaderPrimitives();
  return (
    <div data-slot="dialog-header" className={cn('flex w-full min-w-0 shrink-0 items-start gap-4', className)} {...props}>
      {media ? <div data-slot="dialog-header-media" className="flex shrink-0">{media}</div> : null}
      <div data-slot="dialog-header-text" className="flex min-w-0 flex-1 flex-col gap-2 break-words">
        {title != null ? <DialogTitle>{title}</DialogTitle> : null}
        {description != null ? <DialogDescription>{description}</DialogDescription> : null}
        {children}
      </div>
      {showClose && Close ? (
        <Close
          data-slot="dialog-close"
          aria-label={closeLabel}
          className="flex size-6 shrink-0 items-center justify-center rounded-sm text-muted-foreground outline-none hover:bg-accent hover:text-accent-foreground focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)] [&_svg]:size-4"
        >
          <X aria-hidden="true" />
        </Close>
      ) : null}
    </div>
  );
}

export { DialogHeader, DialogHeaderIcon, DialogHeaderPrimitives, DialogTitle, DialogDescription, useDialogHeaderPrimitives };
