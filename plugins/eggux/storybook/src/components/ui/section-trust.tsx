// EGG UI blocks, BLOCKS / Sections page (73:2), Trust family: Block / Security and Compliance
// (693:115950) and Block / Trust Strip (693:116044). Guide: build-ui/patterns/marketing-pages.md
// (Security and Compliance on enterprise and finance pages before Pricing; Trust Strip as a
// one-line reassurance row under a store hero or above the footer; Trust Badges name the
// certificate and what backs it).
// Both sit on background/default with content in a 1152 container (layout/container/6xl), 24 / 32 px
// gutters below 1152; layout follows the block's own width (container queries).
// Security and Compliance: 96 padding. Intro (544: left Section Header, 32 above an outline Button
// and a link Button with the arrow, 12 apart) 64 left of the controls: six stacked Feature Items
// (neutral Icon Tiles) in two columns of 256, 32 apart. Under them, 48 below, a top border and 48
// padding, four Trust Badges (270, 24 apart). Below 1024 the intro stacks over the controls;
// controls one column below 576; badges 2 per row below 1024, 1 below 576.
// Trust Strip: 64 padding, four Trust Badges, 24 apart (2 per row below 1024, 1 below 576). No
// visible title: name it with `label`.
import * as React from 'react';
import { ArrowRight, Globe, KeyRound, Lock, Package, RefreshCw, ShieldCheck, UserCheck, Wrench } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { FeatureItem } from './feature-item';
import { SectionHeader } from './section-header-block';
import { TrustBadge } from './trust-badge';

const shell = '@container w-full bg-background text-foreground';
const inner = 'mx-auto flex w-full max-w-6xl min-w-0 flex-col px-6 @3xl:px-8 @6xl:px-0';

export interface TrustLink { label: string; href: string }
export interface TrustClaim { name: string; description?: string; icon?: React.ReactNode; href?: string }
export interface TrustControl { title: string; description: string; icon: React.ReactNode }

function BadgeRow({ badges, label }: { badges: TrustClaim[]; label: string }) {
  return (
    <ul aria-label={label} data-slot="trust-badges" className="m-0 grid w-full list-none grid-cols-1 gap-6 p-0 @xl:grid-cols-2 @5xl:grid-cols-4">
      {badges.map(b => (
        <li key={b.name} className="flex min-w-0">
          <TrustBadge name={b.name} description={b.description} icon={b.icon} href={b.href} className="w-full" />
        </li>
      ))}
    </ul>
  );
}

/* Security and Compliance */

export interface SecurityComplianceProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  overline?: string;
  title?: string;
  description?: string;
  /** Figma outline Button; null hides it. */
  primaryAction?: TrustLink | null;
  /** Figma link Button with the arrow; null hides it. */
  secondaryAction?: TrustLink | null;
  /** Six controls in two columns. */
  controls?: TrustControl[];
  /** Figma "certifications": certificates you hold, with what backs them. */
  certifications?: TrustClaim[];
}

const securityControls: TrustControl[] = [
  { icon: <Lock />, title: 'Encryption everywhere', description: 'AES-256 at rest and TLS 1.3 in transit, with keys rotated every 90 days.' },
  { icon: <Globe />, title: 'Data residency', description: 'Host each workspace in the EU or the US; data stays in the region you choose.' },
  { icon: <KeyRound />, title: 'Single sign-on', description: 'SAML 2.0 sign-in and SCIM provisioning, so leavers lose access in minutes.' },
  { icon: <UserCheck />, title: 'Segregation of duties', description: 'No one can request, approve and pay the same invoice. Conflicts are blocked.' },
  { icon: <ShieldCheck />, title: 'Independent audits', description: 'SOC 2 Type II report every year, plus a yearly penetration test by a third party.' },
  { icon: <RefreshCw />, title: '99.95% uptime SLA', description: 'A public status page with incident history and response times you can hold us to.' },
];

const securityBadges: TrustClaim[] = [
  { name: 'SOC 2 Type II', description: 'Audited September 2026', icon: <ShieldCheck /> },
  { name: 'ISO 27001', description: 'Certified, renewed yearly', icon: <ShieldCheck /> },
  { name: 'GDPR', description: 'EU data residency and DPA', icon: <Globe /> },
  { name: 'SAML SSO and SCIM', description: 'Sign-in from your identity provider', icon: <KeyRound /> },
];

function SecurityCompliance({
  overline = 'Security and compliance',
  title = 'Built to pass your audit and your security review',
  description = 'We hold the controls your auditors test and the certifications your security team asks for, with the reports ready to share under NDA.',
  primaryAction = { label: 'Request the security pack', href: '#security-pack' },
  secondaryAction = { label: 'Visit the trust center', href: '#trust-center' },
  controls = securityControls,
  certifications = securityBadges,
  className,
  ...props
}: SecurityComplianceProps) {
  const titleId = React.useId();
  return (
    <section data-slot="security-compliance" aria-labelledby={titleId} className={cn(shell, className)} {...props}>
      <div className={cn(inner, 'gap-10 py-16 @3xl:gap-12 @3xl:py-24')}>
        <div data-slot="security-compliance-row" className="grid w-full grid-cols-1 gap-12 @5xl:grid-cols-2 @5xl:gap-16">
          <div data-slot="security-compliance-intro" className="flex min-w-0 flex-col items-start gap-8">
            <SectionHeader align="left" titleId={titleId} overline={overline} title={title} description={description} />
            {primaryAction || secondaryAction ? (
              <div className="flex flex-wrap items-center gap-3">
                {primaryAction ? <Button asChild variant="outline"><a href={primaryAction.href}>{primaryAction.label}</a></Button> : null}
                {secondaryAction ? (
                  <Button asChild variant="link"><a href={secondaryAction.href}>{secondaryAction.label}<ArrowRight aria-hidden="true" /></a></Button>
                ) : null}
              </div>
            ) : null}
          </div>
          <ul data-slot="security-compliance-controls" aria-label="Security controls" className="m-0 grid min-w-0 list-none grid-cols-1 gap-8 p-0 @xl:grid-cols-2">
            {controls.map(c => (
              <li key={c.title} className="min-w-0">
                <FeatureItem icon={c.icon} title={c.title} description={c.description} />
              </li>
            ))}
          </ul>
        </div>
        {certifications.length ? (
          <div data-slot="security-compliance-certifications" className="w-full border-t border-border pt-12">
            <BadgeRow badges={certifications} label="Certifications" />
          </div>
        ) : null}
      </div>
    </section>
  );
}

/* Trust Strip */

export interface TrustStripProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  /** Name of the section (no visible title). */
  label?: string;
  /** Three or four promises, each with what backs it. */
  badges?: TrustClaim[];
}

const stripBadges: TrustClaim[] = [
  { name: 'Free delivery over €60', description: '2 to 4 working days across the EU', icon: <Package /> },
  { name: '30-day free returns', description: 'Drop-off points or courier pickup', icon: <RefreshCw /> },
  { name: 'Secure checkout', description: 'Cards, bank transfer and wallets', icon: <Lock /> },
  { name: 'Repairs for life', description: 'Free fixes on seams, zips and cuffs', icon: <Wrench /> },
];

function TrustStrip({ label = 'Why shop with Acme', badges = stripBadges, className, ...props }: TrustStripProps) {
  return (
    <section data-slot="trust-strip" aria-label={label} className={cn(shell, className)} {...props}>
      <div className={cn(inner, 'py-16')}>
        <BadgeRow badges={badges} label={label} />
      </div>
    </section>
  );
}

export { SecurityCompliance, TrustStrip };
