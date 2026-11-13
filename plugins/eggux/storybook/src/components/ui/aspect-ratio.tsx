// EGG UI Aspect Ratio. Code only (no Figma component yet; the Card Media slot and Image Placeholder
// use 16:9 the same way). A wrapper that keeps its box at 1:1, 4:3, 16:9 or 21:9 at any width, so
// media does not make the page jump while it loads. `fit` decides what a direct img, video, picture
// or canvas does inside: cover fills the box and crops, contain shows all of it with space around.
// The box is a block that fills its parent (min-w-0); set a width on the parent or `className`.
// Give images alt text; a decorative image gets alt="".
import * as React from 'react';
import { cn } from '@/lib/utils';

export type AspectRatioValue = '1:1' | '4:3' | '16:9' | '21:9';
export type AspectRatioFit = 'cover' | 'contain';

// Every class name in full so Tailwind can generate it.
const ratioClass: Record<AspectRatioValue, string> = {
  '1:1': 'aspect-square',
  '4:3': 'aspect-[4/3]',
  '16:9': 'aspect-video',
  '21:9': 'aspect-[21/9]',
};

const fitClass: Record<AspectRatioFit, string> = {
  cover: '[&>img]:object-cover [&>video]:object-cover [&>picture>img]:object-cover',
  contain: '[&>img]:object-contain [&>video]:object-contain [&>picture>img]:object-contain',
};

export interface AspectRatioProps extends React.ComponentProps<'div'> {
  /** 1:1, 4:3, 16:9 or 21:9. Default 16:9. */
  ratio?: AspectRatioValue;
  /** cover (fill and crop) or contain (show all). Default cover. */
  fit?: AspectRatioFit;
  /** Rounded corners, clipping the media. */
  rounded?: boolean;
}

function AspectRatio({ ratio = '16:9', fit = 'cover', rounded = true, className, children, ...props }: AspectRatioProps) {
  return (
    <div
      data-slot="aspect-ratio"
      data-ratio={ratio}
      data-fit={fit}
      className={cn(
        'relative w-full min-w-0 overflow-hidden bg-muted',
        ratioClass[ratio],
        fitClass[fit],
        '[&>img]:size-full [&>picture]:contents [&>picture>img]:size-full [&>video]:size-full [&>canvas]:size-full [&>svg]:size-full',
        rounded && 'rounded-lg',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { AspectRatio };
