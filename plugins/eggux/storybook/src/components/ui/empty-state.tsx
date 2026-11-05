// EGG UI Empty State. Figma: Empty State (Empty State page, "Empty State / Component"). Size
// (default, sm) x Media (icon, image, illustration) x Tone (default, error), Title, Description
// (Show description), Icon (swap), Error title / Error description, Actions slot (Show actions).
// shadcn Empty plus the EGG changes from references/code-mapping.md. Built from Button (the Try
// again action), Image Placeholder and Spot Illustration. The last two are not in code: the
// illustration and the image come in through the `illustration` and `image` ReactNode props.
import * as React from 'react';
import { Inbox, RefreshCw, TriangleAlert } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';

export type EmptyStateSize = 'default' | 'sm';
export type EmptyStateMedia = 'icon' | 'image' | 'illustration';
export type EmptyStateTone = 'default' | 'error';

export interface EmptyStateProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  /** Figma Size: default for pages and large cards, sm inside tables, cards and panels. */
  size?: EmptyStateSize;
  /** Figma Media: icon (default tile), image (16:9 above the title) or illustration (120, 80 in sm). */
  media?: EmptyStateMedia;
  /** Figma Tone: error is a soft destructive tile with the Error title and description (Media=icon only). */
  tone?: EmptyStateTone;
  /** Figma Title. */
  title?: React.ReactNode;
  /** Figma Description (Show description): one sentence. Pass `null` to hide it. */
  description?: React.ReactNode;
  /** Figma Icon swap (Media=icon, Tone=default): an icon from `@/components/icons`, decorative. */
  icon?: React.ReactNode;
  /** Media=illustration: a Spot Illustration (decorative); sized to 120, or 80 in Size=sm. */
  illustration?: React.ReactNode;
  /** Media=image: a photo or product screenshot; covers a 16:9 area. Decorative: give it an empty alt. */
  image?: React.ReactNode;
  /** Figma Error title (Tone=error). */
  errorTitle?: React.ReactNode;
  /** Figma Error description (Tone=error). Pass `null` to hide it. */
  errorDescription?: React.ReactNode;
  /** Figma Actions slot (Show actions). Tone=error without actions shows a "Try again" button. */
  actions?: React.ReactNode;
  /** Tone=error: called by the default "Try again" button. */
  onRetry?: () => void;
  /** Heading level of the title (the right level for the page). */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

function EmptyState({
  size = 'default',
  media = 'icon',
  tone = 'default',
  title = 'No invoices yet',
  description = 'Create your first invoice or import them from your accounting system.',
  icon,
  illustration,
  image,
  errorTitle = 'Could not load invoices',
  errorDescription = 'Check your connection and try again. If it keeps failing, contact support.',
  actions,
  onRetry,
  headingLevel = 3,
  className,
  ...props
}: EmptyStateProps) {
  const sm = size === 'sm';
  const error = tone === 'error';
  // Tone=error only exists with Media=icon.
  const kind: EmptyStateMedia = error ? 'icon' : media;
  const Heading = `h${headingLevel}` as 'h3';
  const shownTitle = error ? errorTitle : title;
  const shownDescription = error ? errorDescription : description;
  const shownActions =
    actions ?? (error ? (
      <Button variant="outline" size={sm ? 'sm' : 'default'} leadingIcon={<RefreshCw aria-hidden="true" />} onClick={onRetry}>Try again</Button>
    ) : null);

  return (
    <div
      data-slot="empty-state"
      data-size={size}
      data-media={kind}
      data-tone={tone}
      role={error ? 'alert' : undefined}
      className={cn('flex w-full min-w-0 flex-col items-center text-center', sm ? 'gap-3 p-6' : 'gap-4 p-10', className)}
      {...props}
    >
      {kind === 'icon' && (
        <div
          data-slot="empty-state-media"
          aria-hidden="true"
          className={cn(
            'flex shrink-0 items-center justify-center rounded-lg',
            sm ? 'size-10 [&_svg]:size-5' : 'size-12 [&_svg]:size-6',
            error ? 'bg-[var(--badge-soft-destructive-bg)] text-[var(--badge-soft-destructive-fg)]' : 'bg-muted text-foreground',
          )}
        >
          {error ? <TriangleAlert aria-hidden="true" /> : (icon ?? <Inbox aria-hidden="true" />)}
        </div>
      )}
      {kind === 'illustration' && (
        <div data-slot="empty-state-media" aria-hidden="true" className={cn('flex shrink-0 items-center justify-center overflow-hidden [&>*]:size-full', sm ? 'size-20' : 'size-[120px]')}>
          {illustration}
        </div>
      )}
      {kind === 'image' && (
        <div data-slot="empty-state-media" className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg bg-muted [&_img]:size-full [&_img]:object-cover [&>*]:size-full">
          {image}
        </div>
      )}
      <div data-slot="empty-state-text" className="flex w-full min-w-0 flex-col items-center gap-1.5 [overflow-wrap:anywhere]">
        <Heading data-slot="empty-state-title" className={cn('w-full text-foreground', sm ? 'text-sm font-medium leading-5' : 'text-xl font-semibold leading-7 tracking-tight')}>
          {shownTitle}
        </Heading>
        {shownDescription != null && shownDescription !== false && (
          <p data-slot="empty-state-description" className={cn('w-full text-muted-foreground', sm ? 'text-sm leading-5' : 'text-base leading-7')}>
            {shownDescription}
          </p>
        )}
      </div>
      {shownActions && (
        <div data-slot="empty-state-actions" className="flex flex-wrap items-center justify-center gap-2">
          {shownActions}
        </div>
      )}
    </div>
  );
}

export { EmptyState };
