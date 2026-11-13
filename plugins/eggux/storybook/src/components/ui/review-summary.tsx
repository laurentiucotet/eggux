// EGG UI Review Summary. Code only (no Figma component yet); family Wizard.
// The last step before Finish: every section of the flow with its title, an Edit link and the answers as
// key-value rows. An answer that is empty reads "Not provided" with a warning icon and warning text, and a
// banner on top counts how many are missing, so nothing is submitted blind.
// A11y: each section is a region named by its heading; answers are a description list (dt label, dd value);
// "Not provided" is text with an icon, never colour alone; each Edit button says what it edits
// ("Edit Company details"); the missing-answers banner is a polite status. Long values wrap.
import * as React from 'react';
import { Pencil, TriangleAlert } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Alert } from './alert';
import { Button } from './button';

export interface ReviewSummaryRow {
  label: string;
  /** The answer. Empty (undefined, null or blank text) is shown as "Not provided". */
  value?: React.ReactNode;
}

export interface ReviewSummarySection {
  id: string;
  title: string;
  rows: ReviewSummaryRow[];
}

export interface ReviewSummaryProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  sections: ReviewSummarySection[];
  /** Called with the section id when its Edit button is pressed. */
  onEdit?: (id: string) => void;
  headingLevel?: 2 | 3 | 4;
  /** Show the banner that counts the missing answers. */
  showMissingBanner?: boolean;
  emptyText?: string;
  editLabel?: string;
}

const isEmpty = (v: React.ReactNode) => v === undefined || v === null || v === false || (typeof v === 'string' && v.trim() === '');

function ReviewSummary({
  sections,
  onEdit,
  headingLevel = 3,
  showMissingBanner = true,
  emptyText = 'Not provided',
  editLabel = 'Edit',
  className,
  ...props
}: ReviewSummaryProps) {
  const baseId = React.useId();
  const Heading = `h${headingLevel}` as 'h3';
  const missing = sections.reduce((n, s) => n + s.rows.filter(r => isEmpty(r.value)).length, 0);
  return (
    <div data-slot="review-summary" className={cn('@container flex w-full min-w-0 max-w-[640px] flex-col gap-4', className)} {...props}>
      {showMissingBanner && missing > 0 ? (
        <Alert variant="warning" title={missing === 1 ? '1 answer is not provided' : `${missing} answers are not provided`} description="You can still finish, or go back and fill them in." />
      ) : null}
      {sections.map(section => {
        const titleId = `${baseId}-${section.id}`;
        return (
          <section key={section.id} data-slot="review-summary-section" aria-labelledby={titleId} className="min-w-0 rounded-lg border bg-card text-card-foreground">
            <div className="flex min-w-0 items-center justify-between gap-3 border-b px-4 py-3">
              <Heading id={titleId} className="m-0 min-w-0 text-base font-semibold leading-6 [overflow-wrap:anywhere]">{section.title}</Heading>
              <Button type="button" variant="outline" size="sm" onClick={() => onEdit?.(section.id)} className="shrink-0" aria-label={`${editLabel} ${section.title}`}>
                <Pencil aria-hidden="true" />
                {editLabel}
              </Button>
            </div>
            <dl className="m-0 grid min-w-0 grid-cols-1 gap-x-4 gap-y-3 px-4 py-3 @min-[28rem]:grid-cols-[minmax(0,10rem)_minmax(0,1fr)]">
              {section.rows.map(row => {
                const empty = isEmpty(row.value);
                return (
                  <React.Fragment key={row.label}>
                    <dt className="min-w-0 text-sm leading-5 text-muted-foreground [overflow-wrap:anywhere]">{row.label}</dt>
                    <dd data-empty={empty || undefined} className="m-0 min-w-0 text-sm leading-5 text-foreground [overflow-wrap:anywhere]">
                      {empty ? (
                        <span className="inline-flex items-center gap-1.5 text-[var(--badge-soft-warning-fg)]">
                          <TriangleAlert aria-hidden="true" className="size-4 shrink-0" />
                          {emptyText}
                        </span>
                      ) : (
                        row.value
                      )}
                    </dd>
                  </React.Fragment>
                );
              })}
            </dl>
          </section>
        );
      })}
    </div>
  );
}

export { ReviewSummary };
