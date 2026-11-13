// EGG UI Import Summary. Code only (no Figma component yet); family Data Transfer.
// The result after an import: a heading with an outcome badge, one sentence ("48 rows from
// customers.csv"), four stat tiles (Created, Updated, Skipped, Failed) and, when rows failed, a
// download for the error report. Counts come in as props; the report is a link (`errorReportHref`)
// or a button that calls onDownloadReport. No file is written here.
// A11y: a section named by its heading; the tiles are a description list ("Created 40"), icon plus
// text so color is never the only signal; Failed above zero turns destructive and says so in the
// badge text.
import * as React from 'react';
import { CircleAlert, CircleCheck, Download, Minus, RefreshCw } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Button } from './button';

export interface ImportSummaryProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  created: number;
  updated: number;
  skipped: number;
  failed: number;
  title?: string;
  /** Name of the imported file, used in the sentence under the title. */
  fileName?: string;
  /** Link to the error report file. */
  errorReportHref?: string;
  /** Used when there is no link. */
  onDownloadReport?: () => void;
  /** Heading level of the title. */
  titleAs?: 'h2' | 'h3' | 'h4';
}

const fmt = (n: number) => n.toLocaleString('en');

function ImportSummary({ created, updated, skipped, failed, title = 'Import finished', fileName, errorReportHref, onDownloadReport, titleAs: Title = 'h3', className, ...props }: ImportSummaryProps) {
  const headingId = React.useId();
  const total = created + updated + skipped + failed;
  const tiles = [
    { key: 'created', label: 'Created', value: created, icon: CircleCheck, tone: 'text-success' },
    { key: 'updated', label: 'Updated', value: updated, icon: RefreshCw, tone: 'text-info' },
    { key: 'skipped', label: 'Skipped', value: skipped, icon: Minus, tone: 'text-muted-foreground' },
    { key: 'failed', label: 'Failed', value: failed, icon: CircleAlert, tone: failed > 0 ? 'text-destructive' : 'text-muted-foreground' },
  ];
  const reportLabel = `Download error report (${fmt(failed)} ${failed === 1 ? 'row' : 'rows'})`;
  return (
    <section
      data-slot="import-summary"
      aria-labelledby={headingId}
      className={cn('flex w-full min-w-0 max-w-[560px] flex-col gap-4 rounded-xl border border-border bg-card p-4 text-card-foreground', className)}
      {...props}
    >
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <Title id={headingId} className="m-0 min-w-0 text-base leading-6 font-semibold break-words">{title}</Title>
          <Badge variant={failed > 0 ? 'soft-warning' : 'soft-success'}>{failed > 0 ? 'Finished with errors' : 'All rows imported'}</Badge>
        </div>
        <p className="m-0 min-w-0 break-words text-sm leading-5 text-muted-foreground">
          {fmt(total)} {total === 1 ? 'row' : 'rows'} processed{fileName ? <> from <span className="font-mono">{fileName}</span></> : null}.
        </p>
      </div>
      <dl className="m-0 grid grid-cols-[repeat(auto-fit,minmax(110px,1fr))] gap-2">
        {tiles.map(({ key, label, value, icon: Icon, tone }) => (
          <div key={key} data-tile={key} className={cn('flex min-w-0 flex-col gap-1 rounded-lg border bg-background p-3', key === 'failed' && failed > 0 ? 'border-destructive' : 'border-border')}>
            <dt className={cn('flex min-w-0 items-center gap-1.5 text-xs leading-4 font-medium', tone)}>
              <Icon aria-hidden="true" className="size-4 shrink-0" />
              <span className="min-w-0 truncate">{label}</span>
            </dt>
            <dd className="m-0 min-w-0 truncate text-2xl leading-8 font-semibold tabular-nums text-foreground">{fmt(value)}</dd>
          </div>
        ))}
      </dl>
      {failed > 0 ? (
        <div className="flex min-w-0 flex-col items-start gap-1">
          {errorReportHref ? (
            <Button asChild variant="outline" className="h-auto min-h-9 max-w-full py-2 text-left whitespace-normal">
              <a href={errorReportHref} download><Download aria-hidden="true" />{reportLabel}</a>
            </Button>
          ) : (
            <Button type="button" variant="outline" className="h-auto min-h-9 max-w-full py-2 text-left whitespace-normal" leadingIcon={<Download aria-hidden="true" />} onClick={onDownloadReport}>
              {reportLabel}
            </Button>
          )}
          <p className="m-0 text-xs leading-4 text-muted-foreground">The report lists each failed row with the reason.</p>
        </div>
      ) : null}
    </section>
  );
}

export { ImportSummary };
