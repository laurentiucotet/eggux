// EGG UI Scrim. Figma: Scrim (Dialog page, "Scrim / Component"). The dimmed layer behind overlays
// and over media. Tone=dialog is the overlay of Dialog, Alert Dialog, Sheet and Drawer
// (--dialog-overlay); Tone=media darkens a photo or video under text (--media-scrim); Tone=light
// is a soft veil of background at 80% over busy or locked content.
// Reuse: overlays built on Radix Dialog (Dialog, Alert Dialog, Sheet) put `scrimVariants({ tone:
// 'dialog', position: 'fixed' })` on their Overlay primitive; inline uses render <Scrim> as the
// first child of a `relative` box. It is decorative (aria-hidden) and covers the box, so clicks do
// not reach what is behind it; content behind a modal is made inert by the modal itself.
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const scrimVariants = cva('inset-0', {
  variants: {
    tone: {
      dialog: 'bg-[var(--dialog-overlay)]',
      media: 'bg-[var(--media-scrim)]',
      light: 'bg-background/80',
    },
    position: {
      // Inside the box it covers (Figma: first layer, constraints on all sides).
      absolute: 'absolute',
      // Over the whole viewport, behind a modal overlay.
      fixed: 'fixed z-50',
    },
  },
  defaultVariants: { tone: 'dialog', position: 'absolute' },
});

export type ScrimTone = NonNullable<VariantProps<typeof scrimVariants>['tone']>;

export interface ScrimProps extends React.ComponentProps<'div'>, VariantProps<typeof scrimVariants> {}

function Scrim({ className, tone = 'dialog', position = 'absolute', ...props }: ScrimProps) {
  return (
    <div
      data-slot="scrim"
      data-tone={tone}
      aria-hidden="true"
      className={cn(scrimVariants({ tone, position }), className)}
      {...props}
    />
  );
}

export { Scrim, scrimVariants };
