// EGG UI Feature Spotlight. Code only (no Figma component yet); family Onboarding.
// An inline highlight card for one new feature: a "New" badge, a title, a short description, a primary
// "Try it" button and a "Dismiss" button. Dismissing removes the card and moves focus on (to the
// next focusable element, or `returnFocusRef`); a polite status says it is gone.
// A11y: a region named by its title; the badge is read just before the title; both actions are
// real buttons with text names; the tile is decorative; no motion.
import * as React from 'react';
import { Sparkles } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Button } from './button';
import { Card } from './card';
import { IconTile } from './icon-tile';
import { moveFocusAwayFrom } from './tip-card';

export interface FeatureSpotlightProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  title?: string;
  description?: string;
  badgeLabel?: string;
  tryLabel?: string;
  dismissLabel?: string;
  onTry?: () => void;
  onDismiss?: () => void;
  returnFocusRef?: React.RefObject<HTMLElement | null>;
  /** An icon from `@/components/icons` for the tile. */
  icon?: React.ReactNode;
  headingLevel?: 2 | 3 | 4;
}

function FeatureSpotlight({
  title = 'Recurring invoices',
  description = 'Set a schedule once and Acme sends the invoice for you every month, week or quarter.',
  badgeLabel = 'New',
  tryLabel = 'Try it',
  dismissLabel = 'Dismiss',
  onTry,
  onDismiss,
  returnFocusRef,
  icon = <Sparkles />,
  headingLevel = 3,
  className,
  ...props
}: FeatureSpotlightProps) {
  const [gone, setGone] = React.useState(false);
  const ref = React.useRef<HTMLElement>(null);
  const titleId = React.useId();
  const Heading = `h${headingLevel}` as 'h3';
  if (gone) {
    return (
      <p data-slot="feature-spotlight-status" role="status" className="sr-only">
        {title} dismissed.
      </p>
    );
  }
  return (
    <section ref={ref} data-slot="feature-spotlight" aria-labelledby={titleId} className={cn('w-full min-w-0 max-w-[560px]', className)} {...props}>
      <Card size="sm" variant="outline" className="flex-row items-start gap-4 px-4">
        <IconTile icon={icon} tileStyle="gradient" />
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex min-w-0 flex-col items-start gap-1">
            {badgeLabel ? <Badge variant="soft-success" shape="pill">{badgeLabel}</Badge> : null}
            <Heading id={titleId} className="min-w-0 [overflow-wrap:anywhere] text-base font-semibold leading-6 text-foreground">
              {title}
            </Heading>
            <p className="[overflow-wrap:anywhere] text-sm leading-5 text-muted-foreground">{description}</p>
          </div>
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <Button type="button" size="sm" onClick={onTry} className="max-w-full">
              <span className="min-w-0 truncate">{tryLabel}</span>
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="max-w-full"
              onClick={() => {
                moveFocusAwayFrom(ref.current, returnFocusRef?.current);
                setGone(true);
                onDismiss?.();
              }}
            >
              <span className="min-w-0 truncate">{dismissLabel}</span>
              <span className="sr-only"> {title}</span>
            </Button>
          </div>
        </div>
      </Card>
    </section>
  );
}

export { FeatureSpotlight };
