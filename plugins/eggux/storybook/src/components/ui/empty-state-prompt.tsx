// EGG UI Empty State Prompt. Code only (no Figma component yet); family Onboarding.
// An action card for the first item of a list or a section ("Create your first invoice"). It differs
// from Empty State (a whole-page or panel "nothing here" with a message): this one sits among other
// content, has a dashed outline and invites one action, with an optional second link-style action
// ("Import from CSV"). Layout stacked (centered, for a section) or inline (row, for the top of a list).
// A11y: a region named by its title; the actions are real buttons; loading sets aria-busy and ignores
// repeat clicks; the icon is decorative; text wraps, buttons truncate, nothing overflows at 276 px.
import * as React from 'react';
import { Plus } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { IconTile } from './icon-tile';

export interface EmptyStatePromptProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  title?: string;
  description?: string;
  actionLabel?: string;
  /** Empty string hides the second action. */
  secondaryLabel?: string;
  onAction?: () => void;
  onSecondary?: () => void;
  layout?: 'stacked' | 'inline';
  /** An icon from `@/components/icons` for the tile. */
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  headingLevel?: 2 | 3 | 4;
}

function EmptyStatePrompt({
  title = 'Create your first invoice',
  description = 'Invoices you create show up here, with their status and payments.',
  actionLabel = 'New invoice',
  secondaryLabel = 'Import from CSV',
  onAction,
  onSecondary,
  layout = 'stacked',
  icon = <Plus />,
  loading = false,
  disabled = false,
  headingLevel = 3,
  className,
  ...props
}: EmptyStatePromptProps) {
  const titleId = React.useId();
  const Heading = `h${headingLevel}` as 'h3';
  const inline = layout === 'inline';
  return (
    <section
      data-slot="empty-state-prompt"
      data-layout={layout}
      aria-labelledby={titleId}
      className={cn(
        'flex w-full min-w-0 max-w-[560px] gap-4 rounded-xl border border-dashed border-border bg-background p-6',
        inline ? 'flex-row flex-wrap items-center' : 'flex-col items-center text-center',
        className,
      )}
      {...props}
    >
      <IconTile icon={icon} tileStyle="brand" />
      <div className={cn('flex min-w-0 flex-col gap-1', inline && 'flex-[1_1_12rem]')}>
        <Heading id={titleId} className="min-w-0 [overflow-wrap:anywhere] text-base font-semibold leading-6 text-foreground">{title}</Heading>
        {description ? <p className="[overflow-wrap:anywhere] text-sm leading-5 text-muted-foreground">{description}</p> : null}
      </div>
      <div className={cn('flex min-w-0 max-w-full flex-wrap items-center gap-2', !inline && 'justify-center')}>
        <Button
          type="button"
          disabled={disabled}
          aria-busy={loading || undefined}
          loading={loading}
          onClick={() => {
            if (!loading) onAction?.();
          }}
          className="max-w-full"
        >
          <span className="min-w-0 truncate">{actionLabel}</span>
        </Button>
        {secondaryLabel ? (
          <Button type="button" variant="ghost" disabled={disabled} onClick={onSecondary} className="max-w-full">
            <span className="min-w-0 truncate">{secondaryLabel}</span>
          </Button>
        ) : null}
      </div>
    </section>
  );
}

export { EmptyStatePrompt };
