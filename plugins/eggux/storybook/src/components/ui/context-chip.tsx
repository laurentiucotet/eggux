// EGG UI Context Chip. Figma: Context Chip (AI Chat / Context Chip / Component).
// Type (file, record, person) picks the icon and the text property (File, Record, Person);
// Show remove adds the x button "Remove <label>". Labels truncate at 180 px with the full text in
// a tooltip. Announcing adds and removes is the job of the list (an aria-live region).
import * as React from 'react';
import { FileText, Link, User, X } from '@/components/icons';
import { cn } from '@/lib/utils';

export type ContextChipType = 'file' | 'record' | 'person';

export interface ContextChipProps extends React.ComponentProps<'span'> {
  /** Figma Type. */
  type?: ContextChipType;
  /** Figma File (Type=file). */
  file?: string;
  /** Figma Record (Type=record). */
  record?: string;
  /** Figma Person (Type=person). */
  person?: string;
  /** Figma Show remove. */
  showRemove?: boolean;
  onRemove?: () => void;
}

const icons = { file: FileText, record: Link, person: User } as const;

function ContextChip({
  type = 'file',
  file = 'Q3 report.pdf',
  record = 'INV-1041',
  person = 'Ana Popescu',
  showRemove = true,
  onRemove,
  className,
  ...props
}: ContextChipProps) {
  const label = type === 'file' ? file : type === 'record' ? record : person;
  const Icon = icons[type];

  return (
    <span
      data-slot="context-chip"
      data-type={type}
      className={cn(
        'inline-flex h-6 max-w-full min-w-0 items-center gap-1 rounded-sm bg-muted pr-1.5 pl-2 text-xs font-medium text-foreground',
        className,
      )}
      {...props}
    >
      <Icon className="size-3.5 shrink-0" aria-hidden="true" />
      <span data-slot="context-chip-label" title={label} className="min-w-0 max-w-[180px] truncate">
        {label}
      </span>
      {showRemove ? (
        // 16 px target around the 12 px x (negative margin keeps the Figma 12 px footprint).
        <button
          type="button"
          aria-label={`Remove ${label}`}
          title={`Remove ${label}`}
          onClick={onRemove}
          className="-mx-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-sm text-foreground outline-none transition-colors duration-[var(--duration-fast)] hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          <X className="size-3" aria-hidden="true" />
        </button>
      ) : null}
    </span>
  );
}

export { ContextChip };
