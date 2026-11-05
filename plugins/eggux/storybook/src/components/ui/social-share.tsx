// EGG UI Social Share. Figma: Social Share (Button page, "Social Share / Component").
// Label (Show label), Show networks. Share buttons for a public page: a muted "Share" label that
// truncates first, then outline sm Button Icons (copy link, email, the system share sheet, which shows
// only where the browser supports it) and up to three network marks: 32 px tiles with a 1 px border,
// radius md and a letter ("in", "X", "f"); product replaces the letters with the networks' official
// logos. Network links open a new tab and say so. Copy link confirms with a Toast in product
// (TODO Toast: no Toast in code yet; a polite live region says "Link copied").
import * as React from 'react';
import { Link, Mail, Share2 } from '@/components/icons';
import { cn } from '@/lib/utils';
import { ButtonIcon } from './button-icon';

export interface SocialShareNetwork {
  /** Network name, read as "Share on <name>". */
  name: string;
  /** Share URL of the network for this page. */
  href: string;
  /** The mark: a letter in Figma, the network's official logo in product. */
  mark: React.ReactNode;
}

/** The three networks of the Figma default: LinkedIn, X, Facebook. */
function defaultNetworks(url: string, title?: string): SocialShareNetwork[] {
  const u = encodeURIComponent(url);
  const t = title ? `&text=${encodeURIComponent(title)}` : '';
  return [
    { name: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, mark: 'in' },
    { name: 'X', href: `https://x.com/intent/post?url=${u}${t}`, mark: 'X' },
    { name: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, mark: 'f' },
  ];
}

export interface SocialShareProps extends React.ComponentProps<'div'> {
  /** The public page to share. */
  url: string;
  /** Page title for the email subject, the share sheet and the networks that take one. */
  title?: string;
  /** Figma Label. Default "Share". */
  label?: string;
  /** Figma Show label. Default true. */
  showLabel?: boolean;
  /** Figma Show networks. Default true. */
  showNetworks?: boolean;
  /** Up to three networks the audience uses. Default LinkedIn, X, Facebook. */
  networks?: SocialShareNetwork[];
  /** Show the system share sheet button. Default: only where the browser supports it. */
  systemShare?: boolean;
  /** Called after the link is copied (show the "Link copied" Toast here). */
  onCopyLink?: (url: string) => void;
}

function SocialShare({ url, title, label = 'Share', showLabel = true, showNetworks = true, networks, systemShare, onCopyLink, className, ...props }: SocialShareProps) {
  const [status, setStatus] = React.useState('');
  const canShare = systemShare ?? (typeof navigator !== 'undefined' && typeof navigator.share === 'function');
  const list = (networks ?? defaultNetworks(url, title)).slice(0, 3);
  const mailto = `mailto:?subject=${encodeURIComponent(title ?? url)}&body=${encodeURIComponent(url)}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setStatus('Link copied');
      onCopyLink?.(url);
    } catch {
      setStatus('Press Ctrl+C to copy the link');
    }
  };
  const share = () => {
    navigator.share?.({ title, url }).catch(() => undefined);
  };

  return (
    <div data-slot="social-share" className={cn('flex min-w-0 items-center gap-2', className)} {...props}>
      {showLabel ? <span data-slot="social-share-label" className="min-w-0 flex-1 truncate text-sm font-medium leading-5 text-muted-foreground">{label}</span> : null}
      <ButtonIcon variant="outline" size="sm" label="Copy link" icon={<Link aria-hidden="true" />} onClick={copyLink} />
      <ButtonIcon variant="outline" size="sm" label="Share by email" asChild icon={<a href={mailto}><Mail aria-hidden="true" /></a>} />
      {canShare ? <ButtonIcon variant="outline" size="sm" label="Share" icon={<Share2 aria-hidden="true" />} onClick={share} /> : null}
      {showNetworks
        ? list.map(n => (
            <a
              key={n.name}
              href={n.href}
              target="_blank"
              rel="noopener noreferrer"
              data-slot="social-share-network"
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-border text-sm font-medium leading-5 text-foreground outline-none transition-[background-color,box-shadow] duration-[var(--duration-fast)] hover:bg-accent hover:text-accent-foreground focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]"
            >
              {/* The mark is decoration; the name comes from the hidden text (no aria-label, so the visible letter never conflicts with it). */}
              <span aria-hidden="true">{n.mark}</span>
              <span className="sr-only">Share on {n.name} (opens in a new tab)</span>
            </a>
          ))
        : null}
      <span role="status" aria-live="polite" className="sr-only">{status}</span>
    </div>
  );
}

export { SocialShare, defaultNetworks };
