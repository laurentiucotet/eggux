// Shared parts of the page templates: the marketing shell (navbar, footer) and the auth shells.
// A page is a template made of components; nothing here is new design: it only arranges what the
// library already has, so the pages follow every Look and Scheme.
import * as React from 'react';
import { Eye, EyeOff, KeyRound } from '@/components/icons';
import github from '@/assets/brands/github.svg';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { InputGroup } from '@/components/ui/input-group';
import { Logo } from '@/components/ui/logo';
import { Separator } from '@/components/ui/separator';
import { SiteFooter, SiteNavbar, type FooterColumn, type SiteLink } from '@/components/ui/site-navigation';

/* Marketing shell */

export const siteLinks = (active?: string): SiteLink[] =>
  ['Features', 'Pricing', 'Customers', 'Blog', 'Contact'].map(label => ({ label, href: `#${label.toLowerCase()}`, active: label === active }));

export const footerColumns: FooterColumn[] = [
  { title: 'Product', links: ['Features', 'Pricing', 'Integrations', 'Security', 'Changelog'].map(l => ({ label: l, href: `#${l.toLowerCase()}` })) },
  { title: 'Resources', links: ['Blog', 'Help center', 'Guides', 'API reference', 'Status'].map(l => ({ label: l, href: `#${l.toLowerCase().replace(' ', '-')}` })) },
  { title: 'Company', links: ['About', 'Customers', 'Careers', 'Press', 'Contact'].map(l => ({ label: l, href: `#${l.toLowerCase()}` })) },
  { title: 'Legal', links: ['Privacy', 'Terms', 'Cookies', 'GDPR'].map(l => ({ label: l, href: `#${l.toLowerCase()}` })) },
];

/** Navbar, the page, footer. `active` marks the current navbar link. */
export function SitePage({ active, children }: { active?: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteNavbar links={siteLinks(active)} signIn={{ href: '#login' }} cta={{ label: 'Book a demo', href: '#demo' }} />
      <main className="flex-1">{children}</main>
      <SiteFooter tagline="Projects, clients and billing for growing teams." columns={footerColumns} copyright="© 2026 Acme Inc. All rights reserved." end="Made in Europe" />
    </div>
  );
}

/* Auth shells */

const mark = (src: string) => ({ maskImage: `url("${src}")`, WebkitMaskImage: `url("${src}")`, maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat' }) as React.CSSProperties;

/** Identity providers: outline, full width, stacked, the provider mark as the leading icon. */
export function ProviderButtons({ verb = 'Continue' }: { verb?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <Button variant="outline" type="button" className="w-full" leadingIcon={<span aria-hidden="true" className="block size-4 bg-current" style={mark(github)} />}>
        {verb} with GitHub
      </Button>
      <Button variant="outline" type="button" className="w-full" leadingIcon={<KeyRound />}>
        {verb} with SSO
      </Button>
    </div>
  );
}

export const OrDivider = () => <Separator label="or" spacing="md" />;

export function AuthHeading({ title, description }: { title: string; description?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="m-0 text-2xl leading-8 font-semibold tracking-[-0.4px]">{title}</h1>
      {description ? <p className="m-0 text-sm leading-5 text-muted-foreground">{description}</p> : null}
    </div>
  );
}

const legal = (
  <p className="m-0 text-xs leading-4 text-muted-foreground">
    <a href="#terms" className="underline underline-offset-4">Terms</a>
    {' · '}
    <a href="#privacy" className="underline underline-offset-4">Privacy</a>
    {' · '}
    <a href="#help" className="underline underline-offset-4">Help</a>
  </p>
);

/**
 * Desktop sign in and sign up: the form on the left, a brand panel on the right from 1024 px. Below
 * that the panel goes away and the form fills the width with 24 px margins.
 */
export function AuthSplit({ aside, children }: { aside: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen bg-background text-foreground lg:grid-cols-2">
      <div className="flex flex-col gap-8 px-6 py-8 sm:px-12">
        <header>
          <a href="#home" className="inline-flex rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"><Logo type="full" name="Acme" /></a>
        </header>
        <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 pb-10">{children}</main>
        <footer>{legal}</footer>
      </div>
      <aside aria-label="About Acme" className="hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-end">{aside}</aside>
    </div>
  );
}

/** Other auth steps (reset, check email, code): a centered card; on a phone it loses its border and fills the width. */
export function AuthCardPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="px-6 py-6 sm:px-12">
        <a href="#home" className="inline-flex rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"><Logo type="full" name="Acme" /></a>
      </header>
      <main className="flex flex-1 items-start justify-center px-6 pb-16 sm:items-center">
        <div className="flex w-full max-w-md flex-col gap-6 sm:rounded-xl sm:border sm:border-border sm:bg-card sm:p-8 sm:text-card-foreground sm:shadow-xs">{children}</div>
      </main>
      <footer className="px-6 py-6 sm:px-12">{legal}</footer>
    </div>
  );
}

/** A password field with a Show toggle; paste stays allowed. */
export function PasswordField({
  label = 'Password',
  value,
  onChange,
  error,
  hint,
  autoComplete = 'current-password',
}: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: React.ReactNode;
  autoComplete?: 'current-password' | 'new-password';
}) {
  const [shown, setShown] = React.useState(false);
  return (
    <Field label={label} error={error} hint={hint} required>
        <InputGroup
          type={shown ? 'text' : 'password'}
          autoComplete={autoComplete}
          value={value}
          onChange={e => onChange(e.target.value)}
          end={
            <Button type="button" variant="ghost" size="icon-xs" aria-label={shown ? 'Hide password' : 'Show password'} aria-pressed={shown} onClick={() => setShown(s => !s)}>
              {shown ? <EyeOff /> : <Eye />}
            </Button>
          }
        />
    </Field>
  );
}

export const emailError = (email: string): string | undefined =>
  !email.trim() ? 'Enter your email address.' : !/^\S+@\S+\.\S+$/.test(email) ? 'Enter an email address like name@company.com.' : undefined;
