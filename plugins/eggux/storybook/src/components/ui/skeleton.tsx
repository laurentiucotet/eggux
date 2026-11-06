// EGG UI Skeleton. Figma: Skeleton (Skeleton page, "Skeleton / Component", node 32:114).
// Shape: text (240 × 16, radius md), circle (40, radius full), block (320 × 120, radius xl), all on
// background/accent. shadcn Skeleton with a `shape` prop; resize it with className (h-*, w-*,
// flex-1) to mirror the real layout. Decorative: hidden from screen readers, the loading region
// around it carries aria-busy. Pulses, and stays still with prefers-reduced-motion.
import * as React from 'react';
import { cn } from '@/lib/utils';

export type SkeletonShape = 'text' | 'circle' | 'block';

// Written in full so Tailwind can read them. Default sizes are the Figma component sizes.
const shapeClasses: Record<SkeletonShape, string> = {
  text: 'h-4 w-60 rounded-md',
  circle: 'size-10 rounded-full',
  block: 'h-30 w-80 rounded-xl',
};

export interface SkeletonProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** Figma Shape: text (one line), circle (an avatar), block (an image, card or chart). */
  shape?: SkeletonShape;
}

function Skeleton({ shape = 'text', className, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      data-shape={shape}
      aria-hidden="true"
      className={cn('max-w-full bg-accent motion-safe:animate-pulse motion-reduce:animate-none', shapeClasses[shape], className)}
      {...props}
    />
  );
}

export { Skeleton };
