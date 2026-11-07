// EGG UI Thumbnail. Figma: Thumbnail (Image page, 1097:88232). Size (xs 24, sm 32, default 48, lg
// 64, xl 80), Ratio (1:1, 4:3), Show image. A small framed image of a product, file or listing:
// 1 px border, rounded corners, the image cropped to the frame; without an image (or when it fails)
// a fallback icon (image, file-text, package, folder) on a muted tile. Fixed size: pick another
// Size, never stretch it. People use Avatar; logos use Logo Tile.
// A11y: alt text for meaningful images, "" (the default) when the name is right next to it.
import * as React from 'react';
import { Image as ImageIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

export type ThumbnailSize = 'xs' | 'sm' | 'default' | 'lg' | 'xl';

const sizes: Record<ThumbnailSize, { w: string; r: string; icon: string }> = {
  xs: { w: 'w-6', r: 'rounded-sm', icon: '[&_svg]:size-3' },
  sm: { w: 'w-8', r: 'rounded-sm', icon: '[&_svg]:size-4' },
  default: { w: 'w-12', r: 'rounded-md', icon: '[&_svg]:size-5' },
  lg: { w: 'w-16', r: 'rounded-md', icon: '[&_svg]:size-6' },
  xl: { w: 'w-20', r: 'rounded-lg', icon: '[&_svg]:size-6' },
};

export interface ThumbnailProps extends Omit<React.ComponentProps<'span'>, 'children'> {
  src?: string;
  alt?: string;
  size?: ThumbnailSize;
  ratio?: '1:1' | '4:3';
  /** Fallback icon when there is no image. */
  icon?: React.ReactNode;
}

function Thumbnail({ src, alt = '', size = 'default', ratio = '1:1', icon, className, ...props }: ThumbnailProps) {
  const [failed, setFailed] = React.useState(false);
  const s = sizes[size];
  const showImage = src && !failed;
  return (
    <span
      data-slot="thumbnail"
      data-size={size}
      className={cn(
        'relative flex shrink-0 items-center justify-center overflow-hidden border border-border bg-muted text-muted-foreground',
        s.w, s.r, s.icon,
        ratio === '4:3' ? 'aspect-[4/3]' : 'aspect-square',
        className,
      )}
      {...props}
    >
      {showImage ? (
        <img src={src} alt={alt} onError={() => setFailed(true)} className="absolute inset-0 size-full object-cover" />
      ) : (
        <span aria-hidden="true" className="flex">{icon ?? <ImageIcon />}</span>
      )}
    </span>
  );
}

export { Thumbnail };
