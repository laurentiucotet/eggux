// EGG UI Info Tip and Info Tip Trigger. Figma: Info Tip (Side: bottom, top) and Info Tip Trigger
// (State: default, hover, focus, open) on the Tooltip page. A 20 px info button that opens, on
// click or tap, a 280 px popover with a definition and at most one link. shadcn Popover per
// references/code-mapping.md; Radix gives Escape, outside click and focus return.
import * as React from 'react';
import { Popover } from 'radix-ui';
import { Info } from '@/components/icons';
import { cn } from '@/lib/utils';

export interface InfoTipTriggerProps extends React.ComponentProps<'button'> {
  /** What the tip explains: the accessible name is "More about <label>". */
  label: string;
}

/** Figma Info Tip Trigger: 20 px, 24 px hit area in code. Open state comes from Radix (data-state). */
function InfoTipTrigger({ label, className, ...props }: InfoTipTriggerProps) {
  return (
    <button
      type="button"
      data-slot="info-tip-trigger"
      aria-label={`More about ${label}`}
      className={cn(
        "relative inline-flex size-5 shrink-0 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors duration-[var(--duration-fast)] after:absolute after:-inset-0.5 after:content-[''] hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:bg-muted data-[state=open]:text-brand disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <Info className="size-4" aria-hidden="true" />
    </button>
  );
}

export interface InfoTipProps {
  /** Name of what is explained, for the trigger's label ("More about Tax ID"). */
  label: string;
  /** Figma Title (Show title). */
  title?: React.ReactNode;
  /** Figma Text: one or two sentences. */
  children: React.ReactNode;
  /** Figma Link (Show link): at most one. */
  link?: { href: string; label: string };
  /** Figma Side. */
  side?: 'bottom' | 'top';
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  className?: string;
}

function InfoTip({ label, title, children, link, side = 'bottom', open: openProp, defaultOpen = false, onOpenChange, disabled, className }: InfoTipProps) {
  const [inner, setInner] = React.useState(defaultOpen);
  const open = openProp ?? inner;
  const contentId = React.useId();
  const setOpen = (next: boolean) => {
    if (openProp === undefined) setInner(next);
    onOpenChange?.(next);
  };
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <InfoTipTrigger label={label} disabled={disabled} className={className} aria-describedby={open ? contentId : undefined} />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          id={contentId}
          data-slot="info-tip"
          aria-label={typeof title === 'string' ? title : `About ${label}`}
          side={side}
          sideOffset={4}
          collisionPadding={8}
          // Focus stays on the trigger; the content is read through aria-describedby.
          onOpenAutoFocus={e => e.preventDefault()}
          className="z-50 flex w-70 max-w-[calc(100vw-16px)] flex-col gap-1 rounded-md border border-border bg-popover p-3 text-sm text-popover-foreground shadow-md outline-none"
        >
          {title ? <p className="font-medium">{title}</p> : null}
          <p className="text-muted-foreground">{children}</p>
          {link ? (
            <a href={link.href} className="w-fit rounded-sm font-medium text-brand underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring">
              {link.label}
            </a>
          ) : null}
          <Popover.Arrow width={10} height={5} className="fill-[var(--popover)] stroke-[var(--border)]" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export { InfoTip, InfoTipTrigger };
