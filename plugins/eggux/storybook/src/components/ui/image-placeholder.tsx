// EGG UI Image Placeholder. Figma: Image Placeholder (Imagery / Card pages). Ratio (16:9, 4:3, 1:1,
// 3:4, 21:9, 3:2, 2:3, 9:16), Show image (src), Show caption (the image icon), State (default,
// loading, error). Height follows width: the box keeps its Ratio. Without `src` it shows the muted
// dot pattern with a centered image icon. Images cover and crop, never stretch. Give meaningful
// images alt text; alt="" when decorative.
import * as React from 'react';
import { Image as ImageIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

export type ImageRatio = '16:9' | '4:3' | '1:1' | '3:4' | '21:9' | '3:2' | '2:3' | '9:16';
export type ImageState = 'default' | 'loading' | 'error';

const ratios: Record<ImageRatio, string> = {
  '16:9': 'aspect-[16/9]',
  '4:3': 'aspect-[4/3]',
  '1:1': 'aspect-square',
  '3:4': 'aspect-[3/4]',
  '21:9': 'aspect-[21/9]',
  '3:2': 'aspect-[3/2]',
  '2:3': 'aspect-[2/3]',
  '9:16': 'aspect-[9/16]',
};

export interface ImagePlaceholderProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** Figma Ratio. */
  ratio?: ImageRatio;
  /** Figma Show image + Image: the photo URL. It covers and crops to the Ratio. */
  src?: string;
  /** Alt text of the photo; "" when decorative. The placeholder itself is decorative. */
  alt?: string;
  /** Figma Show caption: the centered image icon (and the error text). */
  showCaption?: boolean;
  /** Figma State: loading shows a skeleton fill, error shows the icon and "Image unavailable". */
  state?: ImageState;
  /** Figma Fallback text of State=error. */
  fallback?: string;
}

function ImagePlaceholder({ ratio = '16:9', src, alt = '', showCaption = true, state = 'default', fallback = 'Image unavailable', className, ...props }: ImagePlaceholderProps) {
  const [failed, setFailed] = React.useState(false);
  const error = state === 'error' || failed;
  return (
    <div
      data-slot="image-placeholder"
      data-ratio={ratio}
      data-state={error ? 'error' : state}
      className={cn('relative flex w-full min-w-0 items-center justify-center overflow-clip bg-muted', ratios[ratio], className)}
      {...props}
    >
      {state === 'loading' ? (
        <span aria-hidden="true" className="absolute inset-0 animate-pulse bg-muted-foreground/10" />
      ) : (
        <>
          {!src || error ? (
            <span
              aria-hidden="true"
              data-slot="image-placeholder-pattern"
              className="absolute inset-0 text-muted-foreground/30 [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:12px_12px]"
            />
          ) : null}
          {showCaption && (!src || error) ? (
            <span className="relative flex min-w-0 flex-col items-center gap-1 px-2 text-muted-foreground">
              <ImageIcon className="size-6 shrink-0" aria-hidden="true" />
              {error ? <span className="max-w-full truncate text-xs">{fallback}</span> : null}
            </span>
          ) : null}
          {src && !error ? (
            <img src={src} alt={alt} onError={() => setFailed(true)} className="absolute inset-0 size-full object-cover" />
          ) : null}
        </>
      )}
    </div>
  );
}

export { ImagePlaceholder };
