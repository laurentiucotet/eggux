// EGG UI Artifact Card. Figma: Artifact Card (AI Chat / Artifact Card / Component).
// Something the assistant made, shown in the conversation: icon tile by Type (file-text,
// chart-column, columns-3), title (1 line, ellipsis), meta (type, size, version), Open.
// State=hover is the CSS hover (bg-accent). Figma keeps one title/meta property per Type; in code
// that is `title` and `meta`, defaulting to the Figma text of the chosen Type.
import * as React from 'react';
import { ChartColumn, Columns3, FileText } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';

export type ArtifactType = 'document' | 'chart' | 'table';

const typeDefaults: Record<ArtifactType, { title: string; meta: string; Icon: typeof FileText }> = {
  document: { title: 'Q3 overdue invoices report', meta: 'Document · 3 pages · v2', Icon: FileText },
  chart: { title: 'Overdue by customer', meta: 'Chart · bar · 9 customers', Icon: ChartColumn },
  table: { title: 'Reminder list', meta: 'Table · 24 rows · 5 columns', Icon: Columns3 },
};

export interface ArtifactCardProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  /** Figma Type. */
  type?: ArtifactType;
  /** Figma Document / Chart / Table title. Plain text: it also names the Open button. */
  title?: string;
  /** Figma Document / Chart / Table meta: type, size and version ("Document · 3 pages · v2"). */
  meta?: React.ReactNode;
  /** Open: shows the artifact in a side canvas or its page. */
  onOpen?: () => void;
  /** Label of the Open button (its accessible name adds the title). */
  openLabel?: string;
}

function ArtifactCard({ type = 'document', title, meta, onOpen, openLabel = 'Open', className, ...props }: ArtifactCardProps) {
  const defaults = typeDefaults[type];
  const name = title ?? defaults.title;
  const Icon = defaults.Icon;
  return (
    <div
      data-slot="artifact-card"
      data-type={type}
      className={cn(
        'group/artifact flex w-full min-w-0 items-center gap-3 rounded-lg border border-border bg-card p-3 text-card-foreground transition-colors duration-[var(--duration-fast)] hover:bg-accent',
        className,
      )}
      {...props}
    >
      <span data-slot="artifact-card-icon" aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
        <Icon className="size-5" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p data-slot="artifact-card-title" className="truncate text-sm font-medium" title={name}>{name}</p>
        <p className="truncate text-xs text-muted-foreground">{meta ?? defaults.meta}</p>
      </div>
      <Button variant="outline" size="sm" aria-label={`${openLabel} ${name}`} onClick={onOpen}>
        {openLabel}
      </Button>
    </div>
  );
}

export { ArtifactCard };
