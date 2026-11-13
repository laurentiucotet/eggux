// EGG UI Template Download Card. Code only (no Figma component yet); family Data Transfer.
// A card that offers a sample file for an import: a title, one sentence, format badges (CSV, XLSX),
// the file name and size, a Download button and a "What columns are needed" disclosure that lists
// each column (required or optional, what goes in it, an example). No file is made here: Download
// calls onDownload(format) with the first format, or follows `href` when one is given.
// A11y: a section named by its heading; the disclosure is a Collapsible button with aria-expanded;
// columns are a list; "Required" is text, not only color.
import * as React from 'react';
import { Download } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Button } from './button';
import { Collapsible } from './collapsible';

export interface TemplateColumn {
  name: string;
  required?: boolean;
  /** What goes in the column. */
  description?: string;
  /** One example value. */
  example?: string;
}

export interface TemplateDownloadCardProps extends Omit<React.ComponentProps<'section'>, 'title' | 'onChange'> {
  title: string;
  description?: string;
  /** File formats on offer, for example ['CSV', 'XLSX']. */
  formats: string[];
  /** Name of the sample file, shown in mono under the description. */
  fileName?: string;
  /** Size of the file, already formatted ("4 KB"). */
  fileSize?: string;
  columns: TemplateColumn[];
  /** Link to the file. Without it the button calls onDownload. */
  href?: string;
  onDownload?: (format: string) => void;
  /** Open the column list on first render. */
  defaultColumnsOpen?: boolean;
  /** The heading level of the title. */
  titleAs?: 'h2' | 'h3' | 'h4';
}

function TemplateDownloadCard({ title, description, formats, fileName, fileSize, columns, href, onDownload, defaultColumnsOpen = false, titleAs: Title = 'h3', className, ...props }: TemplateDownloadCardProps) {
  const headingId = React.useId();
  const required = columns.filter(c => c.required).length;
  const label = `Download template`;
  return (
    <section
      data-slot="template-download-card"
      aria-labelledby={headingId}
      className={cn('flex w-full min-w-0 max-w-[480px] flex-col gap-4 rounded-xl border border-border bg-card p-4 text-card-foreground', className)}
      {...props}
    >
      <div className="flex min-w-0 flex-col gap-1">
        <Title id={headingId} className="m-0 text-base leading-6 font-semibold break-words">{title}</Title>
        {description ? <p className="m-0 text-sm leading-5 text-muted-foreground">{description}</p> : null}
      </div>
      <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
        <ul aria-label="File formats" className="m-0 flex list-none flex-wrap gap-1.5 p-0">
          {formats.map(f => (
            <li key={f}><Badge variant="soft-neutral">{f}</Badge></li>
          ))}
        </ul>
        {fileName ? (
          <p className="m-0 flex min-w-0 items-center gap-1.5 text-xs leading-4 text-muted-foreground">
            <span className="min-w-0 truncate font-mono" title={fileName}>{fileName}</span>
            {fileSize ? <span className="shrink-0">· {fileSize}</span> : null}
          </p>
        ) : null}
      </div>
      <div>
        {href ? (
          <Button asChild>
            <a href={href} download={fileName}><Download aria-hidden="true" />{label}</a>
          </Button>
        ) : (
          <Button type="button" leadingIcon={<Download aria-hidden="true" />} onClick={() => onDownload?.(formats[0] ?? '')}>
            {label}
          </Button>
        )}
      </div>
      <Collapsible label="What columns are needed" openLabel="Hide the columns" defaultOpen={defaultColumnsOpen} className="gap-2 border-t border-border pt-3">
        <p className="m-0 text-xs leading-4 text-muted-foreground">{columns.length} columns, {required} required.</p>
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {columns.map(c => (
            <li key={c.name} className="flex min-w-0 flex-col gap-0.5">
              <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                <span className="min-w-0 truncate font-mono text-sm leading-5 font-semibold" title={c.name}>{c.name}</span>
                <Badge size="sm" variant={c.required ? 'soft-destructive' : 'soft-neutral'}>{c.required ? 'Required' : 'Optional'}</Badge>
              </span>
              {c.description ? <span className="text-sm leading-5 text-muted-foreground">{c.description}</span> : null}
              {c.example ? (
                <span className="min-w-0 truncate text-xs leading-4 text-muted-foreground">
                  Example: <span className="font-mono">{c.example}</span>
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </Collapsible>
    </section>
  );
}

export { TemplateDownloadCard };
