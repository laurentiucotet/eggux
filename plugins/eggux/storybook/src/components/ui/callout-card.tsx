// EGG UI Callout Card. Figma: Callout Card (Card page, "Callout Card / Component"). Layout
// (horizontal 560, min 320: media left; stacked 280, min 220: media on top, the X in the corner),
// Media slot (Icon Tile by default), Title (2 lines), Description (3 lines, then an ellipsis),
// Actions slot (wraps), Show close. A region named by its title. The close X is named "Dismiss";
// remembering the dismissal is the app's job. One primary action at most. Built on Card, Icon Tile
// and Button.
import * as React from 'react';
import { X } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Card } from './card';

export type CalloutLayout = 'horizontal' | 'stacked';

export interface CalloutCardProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  layout?: CalloutLayout;
  /** Figma Title: the benefit ("Send invoices automatically"), not the feature name. */
  title: string;
  /** Figma Description: one sentence. */
  description?: string;
  /** Figma Media slot (Show media): an Icon Tile or a Spot Illustration. Decorative unless it carries information. */
  media?: React.ReactNode;
  /** Figma Actions slot (Show actions): Button default sm and Button ghost sm. */
  actions?: React.ReactNode;
  /** Figma Show close: renders the X; the app removes the card and remembers the choice. */
  onDismiss?: () => void;
  dismissLabel?: string;
}

function CalloutCard({ layout = 'horizontal', title, description, media, actions, onDismiss, dismissLabel = 'Dismiss', className, ...props }: CalloutCardProps) {
  const id = React.useId();
  const stacked = layout === 'stacked';
  return (
    <Card
      role="region"
        aria-labelledby={`${id}-title`}
        data-slot="callout-card"
        data-layout={layout}
        className={cn(
          'gap-4 p-5',
          stacked ? 'w-70 min-w-55 max-w-full flex-col' : 'w-140 min-w-80 max-w-full flex-row',
          className,
        )}
        {...props}
      >
        {media ? <div data-slot="callout-card-media" aria-hidden="true" className="flex shrink-0 items-start">{media}</div> : null}
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className={cn('flex min-w-0 flex-col gap-1', onDismiss && 'pr-6')}>
            <h3 id={`${id}-title`} className="line-clamp-2 text-lg leading-7 font-semibold">{title}</h3>
            {description ? <p data-slot="callout-card-description" className="line-clamp-3 text-sm text-muted-foreground">{description}</p> : null}
          </div>
          {actions ? <div data-slot="callout-card-actions" className="flex flex-wrap items-center gap-2">{actions}</div> : null}
        </div>
        {onDismiss ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label={dismissLabel}
            onClick={onDismiss}
            className="absolute top-[11px] right-[11px] size-6 rounded-sm!"
          >
            <X aria-hidden="true" />
          </Button>
        ) : null}
    </Card>
  );
}

export { CalloutCard };
