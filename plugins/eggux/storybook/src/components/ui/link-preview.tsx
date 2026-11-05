// EGG UI Link Preview. Figma: Link Preview (Card page, "Link Preview / Component"). Layout
// (horizontal 480 x 122, vertical 320), Domain, Title (2 lines), Description (2 lines, muted), Show
// image (Image Placeholder). The whole card is one link that opens in a new tab; its name is the
// title plus "opens in a new tab". The image is decorative. `onRemove` shows the Remove button
// (aria-label "Remove preview") as a sibling of the link, so the author can keep the plain link.
import * as React from 'react';
import { Globe, X } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';

export type LinkPreviewLayout = 'horizontal' | 'vertical';

export interface LinkPreviewProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  layout?: LinkPreviewLayout;
  /** Where the link goes. */
  href: string;
  /** Figma Domain (the site row). Truncates to 1 line. */
  domain: string;
  /** Figma Title: 2 lines. */
  title: string;
  /** Figma Description: 2 lines. */
  description?: string;
  /** Figma Show image + Image: an Image Placeholder. Decorative (alt=""). */
  image?: React.ReactNode;
  /** Shows the Remove button. */
  onRemove?: () => void;
  removeLabel?: string;
}

function LinkPreview({ layout = 'horizontal', href, domain, title, description, image, onRemove, removeLabel = 'Remove preview', className, ...props }: LinkPreviewProps) {
  const vertical = layout === 'vertical';
  return (
    <div data-slot="link-preview" data-layout={layout} className={cn('relative min-w-0', vertical ? 'w-80' : 'w-120', 'max-w-full', className)} {...props}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'flex min-w-0 overflow-clip rounded-lg border border-border bg-card text-card-foreground outline-none transition-[box-shadow,border-color] duration-[var(--duration-fast)] hover:border-foreground/20 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring',
          vertical ? 'flex-col-reverse' : 'items-stretch',
        )}
      >
        <span data-slot="link-preview-text" className="flex min-w-0 flex-1 flex-col gap-1 px-4 py-3">
          <span className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
            <Globe aria-hidden="true" className="size-3.5 shrink-0" />
            <span className="min-w-0 flex-1 truncate">{domain}</span>
          </span>
          <span data-slot="link-preview-title" className="line-clamp-2 text-sm font-medium">
            {title}
            <span className="sr-only"> (opens in a new tab)</span>
          </span>
          {description ? <span data-slot="link-preview-description" className="line-clamp-2 text-xs text-muted-foreground">{description}</span> : null}
        </span>
        {image ? (
          <span data-slot="link-preview-image" aria-hidden="true" className={cn('block shrink-0 overflow-clip rounded-lg', vertical ? 'w-full' : 'w-[120px]')}>
            {image}
          </span>
        ) : null}
      </a>
      {onRemove ? (
        <Button
          type="button"
          variant="secondary"
          size="icon-xs"
          aria-label={removeLabel}
          onClick={onRemove}
          className="absolute top-2 right-2 size-6"
        >
          <X aria-hidden="true" />
        </Button>
      ) : null}
    </div>
  );
}

export { LinkPreview };
