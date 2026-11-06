// EGG UI Confirm Popover. Figma: Confirm Popover (Popover page, "Confirm Popover / Component",
// set 443:7079), Tone default | destructive. A small check next to the button that triggered it:
// 288 wide, popover surface (border, radius md, shadow md), 16 px padding, 12 px between the text
// and the actions; Title (ui/label, a question with the object) over Description (body/small,
// muted, one line on the consequence), 4 px apart; actions right aligned, 8 px apart: Cancel
// (Button ghost sm, as the Figma instance) and the confirm verb (Button sm, destructive for
// Tone=destructive). shadcn Popover with role="alertdialog": focus moves to Cancel on open,
// Escape or an outside click cancels, focus returns to the trigger.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from './popover';

export type ConfirmPopoverTone = 'default' | 'destructive';

export interface ConfirmPopoverProps {
  /** The trigger: one element (a Button), rendered with asChild. */
  children: React.ReactElement;
  /** Figma Title: a question with the action and the object ("Archive 3 invoices?"). */
  title: React.ReactNode;
  /** Figma Description: one line on what happens next or how to undo it. */
  description?: React.ReactNode;
  /** Figma Tone: destructive for remove and discard. */
  tone?: ConfirmPopoverTone;
  /** The confirm button repeats the verb ("Archive"); never "OK" or "Yes". */
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  className?: string;
}

function ConfirmPopover({
  children,
  title,
  description,
  tone = 'default',
  confirmLabel,
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  side = 'bottom',
  align = 'start',
  className,
}: ConfirmPopoverProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultOpen);
  const open = openProp ?? uncontrolled;
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const id = React.useId();
  const setOpen = (next: boolean) => {
    if (openProp === undefined) setUncontrolled(next);
    onOpenChange?.(next);
  };
  return (
    <Popover
      open={open}
      onOpenChange={next => {
        // Radix closes on Cancel, Escape and an outside click: all of them cancel. The confirm
        // button closes through setOpen and never reaches this handler.
        if (!next) onCancel?.();
        setOpen(next);
      }}
    >
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        role="alertdialog"
        data-slot="confirm-popover"
        data-tone={tone}
        side={side}
        align={align}
        aria-labelledby={`${id}-title`}
        aria-describedby={description != null ? `${id}-description` : undefined}
        className={cn('flex w-72 flex-col gap-3 p-4', className)}
        onOpenAutoFocus={event => {
          event.preventDefault();
          cancelRef.current?.focus();
        }}
      >
        <div className="flex min-w-0 flex-col gap-1 break-words">
          <h3 id={`${id}-title`} className="text-sm leading-5 font-medium text-popover-foreground">{title}</h3>
          {description != null ? (
            <p id={`${id}-description`} className="text-sm leading-5 text-muted-foreground">{description}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <PopoverClose asChild>
            <Button ref={cancelRef} variant="ghost" size="sm">{cancelLabel}</Button>
          </PopoverClose>
          <Button
            variant={tone === 'destructive' ? 'destructive' : 'default'}
            size="sm"
            onClick={() => {
              onConfirm?.();
              setOpen(false);
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { ConfirmPopover };
