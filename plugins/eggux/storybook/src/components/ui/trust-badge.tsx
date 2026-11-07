// EGG UI Trust Badge. Figma: Trust Badge (Badge page, "Trust Badge / Component", 882:1220).
// Tone (default, on-primary, inverted). A certification or compliance claim (SOC 2, ISO 27001,
// GDPR): a shield icon (20), the name (ui/label) and what backs it (ui/caption, audit date or
// region). Border, radius md, 12 / 8 px padding, 8 gap; text wraps. Tone on-primary for primary
// bands (all in primary-foreground, border too); inverted for inverted cards (name in
// background, detail in muted). Only current claims; link to the trust page when there is one.
import * as React from 'react';
import { ShieldCheck } from '@/components/icons';
import { cn } from '@/lib/utils';

export type TrustBadgeTone = 'default' | 'on-primary' | 'inverted';

export interface TrustBadgeProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  name: string;
  /** What backs the claim: "Audited September 2026", "EU data residency". */
  description?: string;
  icon?: React.ReactNode;
  tone?: TrustBadgeTone;
  /** The trust page; makes the badge a link. */
  href?: string;
}

const tones: Record<TrustBadgeTone, { root: string; name: string; description: string }> = {
  default: { root: 'border-border text-foreground', name: 'text-foreground', description: 'text-muted-foreground' },
  'on-primary': { root: 'border-primary-foreground text-primary-foreground', name: 'text-primary-foreground', description: 'text-primary-foreground' },
  inverted: { root: 'border-border text-background', name: 'text-background', description: 'text-muted' },
};

function TrustBadge({ name, description, icon, tone = 'default', href, className, ...props }: TrustBadgeProps) {
  const t = tones[tone];
  const body = (
    <>
      <span aria-hidden="true" className="flex shrink-0 [&_svg]:size-5">{icon ?? <ShieldCheck />}</span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className={cn('text-sm leading-5 font-medium [overflow-wrap:anywhere]', t.name)}>{name}</span>
        {description ? <span className={cn('text-xs leading-4 [overflow-wrap:anywhere]', t.description)}>{description}</span> : null}
      </span>
    </>
  );
  const cls = cn('flex min-w-0 items-center gap-2 rounded-md border px-3 py-2', t.root, className);
  return (
    <div data-slot="trust-badge" data-tone={tone} className={href ? 'flex min-w-0' : cls} {...props}>
      {href ? (
        <a href={href} className={cn(cls, 'w-full no-underline outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 hover:underline')}>{body}</a>
      ) : body}
    </div>
  );
}

export { TrustBadge };
