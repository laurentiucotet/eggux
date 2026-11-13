// EGG UI Welcome Card. Code only (no Figma component yet); family Onboarding.
// A first-visit hero card: an optional small badge, a title, one sentence, a primary and a secondary
// action, and a decorative gradient tile with an icon. The tile hides from assistive tech and wraps
// above the text when the card is narrow.
// A11y: a region named by its title (heading level is a prop so the page keeps its outline); the actions
// are real buttons, or links when an href is given; nothing is communicated by the tile alone; no motion.
import * as React from 'react';
import { Sparkles } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Button } from './button';
import { Card } from './card';
import { IconTile } from './icon-tile';

export interface WelcomeCardProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  title?: string;
  description?: string;
  /** Small label above the title ("Welcome"). Empty string hides it. */
  eyebrow?: string;
  primaryLabel?: string;
  /** Empty string hides the secondary action. */
  secondaryLabel?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
  /** An icon from `@/components/icons` for the tile. */
  icon?: React.ReactNode;
  /** Hide the decorative tile. */
  showTile?: boolean;
  headingLevel?: 1 | 2 | 3;
}

function WelcomeCard({
  title = 'Welcome to Acme Invoicing',
  description = 'Create your first invoice in under two minutes, or take a short tour to see how everything fits together.',
  eyebrow = 'First visit',
  primaryLabel = 'Create an invoice',
  secondaryLabel = 'Take the tour',
  onPrimary,
  onSecondary,
  icon = <Sparkles />,
  showTile = true,
  headingLevel = 2,
  className,
  ...props
}: WelcomeCardProps) {
  const titleId = React.useId();
  const Heading = `h${headingLevel}` as 'h2';
  return (
    <section data-slot="welcome-card" aria-labelledby={titleId} className={cn('w-full min-w-0 max-w-[640px]', className)} {...props}>
      <Card variant="muted" className="flex-row flex-wrap items-center gap-6 px-6">
        {showTile ? (
          <IconTile icon={icon} tileStyle="gradient" size="lg" className="size-20 rounded-xl [&_svg:not([class*='size-'])]:size-10" />
        ) : null}
        <div className="flex min-w-0 flex-[1_1_12rem] flex-col gap-4">
          <div className="flex min-w-0 flex-col items-start gap-2">
            {eyebrow ? <Badge variant="soft-info" shape="pill">{eyebrow}</Badge> : null}
            <Heading id={titleId} className="min-w-0 [overflow-wrap:anywhere] text-2xl font-semibold leading-8 text-foreground">{title}</Heading>
            <p className="[overflow-wrap:anywhere] text-sm leading-5 text-muted-foreground">{description}</p>
          </div>
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <Button type="button" onClick={onPrimary} className="max-w-full">
              <span className="min-w-0 truncate">{primaryLabel}</span>
            </Button>
            {secondaryLabel ? (
              <Button type="button" variant="outline" onClick={onSecondary} className="max-w-full">
                <span className="min-w-0 truncate">{secondaryLabel}</span>
              </Button>
            ) : null}
          </div>
        </div>
      </Card>
    </section>
  );
}

export { WelcomeCard };
