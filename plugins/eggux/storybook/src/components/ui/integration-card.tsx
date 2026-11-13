// EGG UI Integration Card. Code only (no Figma component yet); family Marketing.
// A tile for an integrations directory: a drawn mark (initials on a category-colored tile, no
// image), the name, a category Badge, a description clamped to two lines, and a Connect button that
// becomes "Connected" (secondary, with a check). Pressing Connected disconnects. Cards in a grid
// keep one height: the button sits at the bottom.
// A11y: an article with the name as heading; the button text is "Connect" or "Connected" and the
// name of the integration is added for screen readers ("Connect Acme Sheets", "Connected to Acme
// Sheets, press to disconnect"), so the visible label stays inside the accessible name; a polite
// status announces the change. Works controlled (`connected`) or uncontrolled (`defaultConnected`).
import * as React from 'react';
import { Check } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Button } from './button';

export type IntegrationTone = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

// Written out in full so Tailwind generates the classes.
const toneClass: Record<IntegrationTone, string> = {
  1: 'bg-[var(--badge-category-1-bg)] text-[var(--badge-category-1-fg)]',
  2: 'bg-[var(--badge-category-2-bg)] text-[var(--badge-category-2-fg)]',
  3: 'bg-[var(--badge-category-3-bg)] text-[var(--badge-category-3-fg)]',
  4: 'bg-[var(--badge-category-4-bg)] text-[var(--badge-category-4-fg)]',
  5: 'bg-[var(--badge-category-5-bg)] text-[var(--badge-category-5-fg)]',
  6: 'bg-[var(--badge-category-6-bg)] text-[var(--badge-category-6-fg)]',
  7: 'bg-[var(--badge-category-7-bg)] text-[var(--badge-category-7-fg)]',
  8: 'bg-[var(--badge-category-8-bg)] text-[var(--badge-category-8-fg)]',
};

export interface IntegrationCardProps extends Omit<React.ComponentProps<'article'>, 'title' | 'onChange'> {
  name: string;
  description: string;
  /** Category badge: "Accounting", "Payments". */
  category?: string;
  /** Mark text, one or two letters. Default: first letters of the name. */
  initials?: string;
  /** Mark color, 1 to 8 (the Badge category colors). */
  tone?: IntegrationTone;
  connected?: boolean;
  defaultConnected?: boolean;
  onConnectedChange?: (connected: boolean) => void;
  headingLevel?: 2 | 3 | 4;
}

function IntegrationCard({
  name,
  description,
  category,
  initials,
  tone = 1,
  connected: connectedProp,
  defaultConnected = false,
  onConnectedChange,
  headingLevel = 3,
  className,
  ...props
}: IntegrationCardProps) {
  const [inner, setInner] = React.useState(defaultConnected);
  const connected = connectedProp ?? inner;
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4';
  const mark = (initials ?? name.split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0]).join('')).slice(0, 2).toUpperCase();
  const toggle = () => {
    const next = !connected;
    if (connectedProp === undefined) setInner(next);
    onConnectedChange?.(next);
  };
  return (
    <article
      data-slot="integration-card"
      data-connected={connected ? 'true' : 'false'}
      className={cn('flex h-full w-full min-w-0 flex-col gap-4 rounded-xl border border-border bg-card p-4 text-card-foreground', className)}
      {...props}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span aria-hidden="true" className={cn('flex size-10 shrink-0 items-center justify-center rounded-lg text-sm leading-5 font-semibold', toneClass[tone])}>{mark}</span>
        <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
          <Heading className="m-0 max-w-full text-base leading-6 font-semibold [overflow-wrap:anywhere]">{name}</Heading>
          {category ? <Badge variant="soft-neutral" className="max-w-full">{category}</Badge> : null}
        </div>
      </div>
      <p className="m-0 line-clamp-2 text-sm leading-5 text-muted-foreground [overflow-wrap:anywhere]">{description}</p>
      <div className="mt-auto flex">
        <Button
          type="button"
          size="sm"
          variant={connected ? 'secondary' : 'outline'}
          onClick={toggle}
          leadingIcon={connected ? <Check aria-hidden="true" /> : undefined}
          className="max-w-full"
        >
          {connected ? 'Connected' : 'Connect'}
          <span className="sr-only">{connected ? ` to ${name}, press to disconnect` : ` ${name}`}</span>
        </Button>
      </div>
      <p role="status" className="sr-only">{connected ? `${name} connected` : ''}</p>
    </article>
  );
}

export { IntegrationCard };
