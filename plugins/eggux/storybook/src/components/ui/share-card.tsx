// EGG UI Share Card. Code only (no Figma component yet); family Community.
// A card that offers one public link: a heading, one line of help, the link in a read-only field with
// a Copy Button, and up to three network links (Button outline sm with the network mark and name).
// Social Share is the compact row for a page footer; the Share Card is the panel for a "Share"
// dialog, a sidebar or a thank-you page. Network links open a new tab and say so.
// A11y: a labelled region; the field is a read-only text input named "Link"; focusing it selects the
// whole link; Copy confirms in place through the Copy Button (status "Copied"); network links name
// the network and "opens in a new tab". The field and names truncate or wrap, never overflow.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { CopyButton } from './copy-button';
import { Input } from './input';
import { defaultNetworks, type SocialShareNetwork } from './social-share';

export interface ShareCardProps extends Omit<React.ComponentProps<'section'>, 'title' | 'onCopy'> {
  /** The public link. */
  url: string;
  /** Heading. */
  title?: string;
  /** One line under the heading. */
  description?: string;
  /** Page title passed to the networks that take one. */
  pageTitle?: string;
  showNetworks?: boolean;
  /** Up to three networks. Default LinkedIn, X, Facebook. */
  networks?: SocialShareNetwork[];
  headingLevel?: 2 | 3 | 4;
  onCopy?: (url: string) => void;
}

function ShareCard({
  url,
  title = 'Share this page',
  description = 'Anyone with the link can view it.',
  pageTitle,
  showNetworks = true,
  networks,
  headingLevel = 3,
  onCopy,
  className,
  ...props
}: ShareCardProps) {
  const headingId = React.useId();
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4';
  const list = (networks ?? defaultNetworks(url, pageTitle)).slice(0, 3);
  return (
    <section
      data-slot="share-card"
      aria-labelledby={headingId}
      className={cn('flex w-full min-w-0 max-w-[400px] flex-col gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground', className)}
      {...props}
    >
      <div className="flex min-w-0 flex-col gap-1">
        <Heading id={headingId} className="m-0 text-base leading-6 font-semibold break-words">{title}</Heading>
        {description ? <p className="m-0 text-sm leading-5 text-muted-foreground">{description}</p> : null}
      </div>
      <div className="flex min-w-0 items-center gap-2">
        <Input
          readOnly
          value={url}
          aria-label="Link"
          onFocus={e => e.currentTarget.select()}
          className="min-w-0 flex-1 truncate"
        />
        <CopyButton value={url} label="Copy link" variant="outline" onCopy={onCopy} />
      </div>
      {showNetworks ? (
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {list.map(n => (
            <li key={n.name} className="min-w-0">
              <Button asChild variant="outline" size="sm">
                <a href={n.href} target="_blank" rel="noopener noreferrer">
                  <span aria-hidden="true" className="font-semibold">{n.mark}</span>
                  <span className="truncate">{n.name}</span>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export { ShareCard };
