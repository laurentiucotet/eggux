// EGG UI Changelog Entry. Code only (no Figma component yet); family Marketing.
// One release in a product changelog: the date, the version (outline Badge), tags New / Improved /
// Fixed (soft Badges), a title with a permalink button, an optional summary and a list of changes.
// Stack entries newest first; each keeps its own anchor (id) so a release can be linked.
// A11y: an article named by its title; the date is a <time> with a machine value; the permalink is a
// link named "Permalink to <title>" (icon only, visible focus ring); changes are a real list; tags
// are text, never color alone.
import * as React from 'react';
import { Link as LinkIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Badge } from './badge';

export type ChangelogTag = 'New' | 'Improved' | 'Fixed';

const tagVariant = { New: 'soft-success', Improved: 'soft-info', Fixed: 'soft-warning' } as const;

export interface ChangelogEntryProps extends Omit<React.ComponentProps<'article'>, 'title'> {
  /** ISO date, "2026-03-12". */
  date: string;
  /** "2.4.0" or "v2.4". */
  version: string;
  tags?: ChangelogTag[];
  title: string;
  /** One line under the title. */
  summary?: string;
  changes: string[];
  /** Anchor id of the entry; the permalink points to it. Default: the version. */
  id?: string;
  /** Permalink target. Default "#<id>". */
  permalink?: string;
  headingLevel?: 2 | 3 | 4;
}

function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(d);
}

function ChangelogEntry({ date, version, tags, title, summary, changes, id, permalink, headingLevel = 3, className, ...props }: ChangelogEntryProps) {
  const anchor = id ?? `release-${version.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase()}`;
  const titleId = React.useId();
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4';
  return (
    <article
      id={anchor}
      data-slot="changelog-entry"
      aria-labelledby={titleId}
      className={cn('flex w-full min-w-0 scroll-mt-6 flex-col gap-4 border-b border-border pb-8 text-foreground', className)}
      {...props}
    >
      <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
        <time dateTime={date} className="text-sm leading-5 text-muted-foreground">{formatDate(date)}</time>
        <Badge variant="outline">{version}</Badge>
        {tags?.length ? (
          <ul aria-label="Release type" className="m-0 flex list-none flex-wrap gap-1.5 p-0">
            {tags.map(t => <li key={t} className="flex"><Badge variant={tagVariant[t]}>{t}</Badge></li>)}
          </ul>
        ) : null}
      </div>
      <div className="flex min-w-0 items-start gap-2">
        <Heading id={titleId} className="m-0 min-w-0 flex-1 text-2xl leading-8 font-semibold tracking-tight [overflow-wrap:anywhere]">{title}</Heading>
        <a
          href={permalink ?? `#${anchor}`}
          aria-label={`Permalink to ${title}`}
          className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground no-underline outline-none transition-colors duration-[var(--duration-fast)] hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <LinkIcon aria-hidden="true" className="size-4" />
        </a>
      </div>
      {summary ? <p className="m-0 text-base leading-6 text-muted-foreground [overflow-wrap:anywhere]">{summary}</p> : null}
      <ul className="m-0 flex list-disc flex-col gap-2 pl-5 text-sm leading-5 marker:text-muted-foreground">
        {changes.map(c => <li key={c} className="[overflow-wrap:anywhere]">{c}</li>)}
      </ul>
    </article>
  );
}

export { ChangelogEntry };
