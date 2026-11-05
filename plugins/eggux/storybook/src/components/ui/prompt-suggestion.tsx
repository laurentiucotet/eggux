// EGG UI Prompt Suggestion. Figma: Prompt Suggestion (AI Chat / Prompt Suggestion / Component).
// Layout (chip, card), Label, Description and Icon match the Figma properties. A native button
// named by its Label: chip hugs the label and truncates to 1 line; card clamps the label to 2.
import * as React from 'react';
import { FileText } from '@/components/icons';
import { cn } from '@/lib/utils';

export type PromptSuggestionLayout = 'chip' | 'card';

export interface PromptSuggestionProps extends Omit<React.ComponentProps<'button'>, 'children'> {
  /** Figma Layout. chip: follow-ups under the input or an answer. card: empty-state starters. */
  layout?: PromptSuggestionLayout;
  /** Figma Label: the prompt, starting with a verb. */
  label?: string;
  /** Figma Description (card): what the result contains. */
  description?: string;
  /** Figma Icon (card, instance swap): an icon from `@/components/icons`. */
  icon?: React.ReactNode;
}

function PromptSuggestion({
  layout = 'chip',
  label = 'Summarize open invoices',
  description = 'Totals, overdue days and who to remind first',
  icon = <FileText />,
  type = 'button',
  className,
  ...props
}: PromptSuggestionProps) {
  const base =
    'border border-border bg-background text-left text-foreground outline-none transition-colors duration-[var(--duration-fast)] hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50';

  if (layout === 'card') {
    return (
      <button
        type={type}
        data-slot="prompt-suggestion"
        data-layout="card"
        className={cn(base, 'flex w-60 max-w-full flex-col items-start gap-2 rounded-xl p-4 [&_svg:not([class*=size-])]:size-4 [&_svg]:shrink-0', className)}
        {...props}
      >
        <span aria-hidden="true" className="flex text-muted-foreground">{icon}</span>
        <span data-slot="prompt-suggestion-label" className="line-clamp-2 w-full text-sm font-medium leading-5 [overflow-wrap:anywhere]">{label}</span>
        {description ? <span data-slot="prompt-suggestion-description" className="w-full text-sm leading-5 text-muted-foreground [overflow-wrap:anywhere]">{description}</span> : null}
      </button>
    );
  }

  return (
    <button
      type={type}
      data-slot="prompt-suggestion"
      data-layout="chip"
      className={cn(base, 'inline-flex h-8 max-w-full min-w-0 items-center rounded-full px-3 py-1.5', className)}
      {...props}
    >
      <span data-slot="prompt-suggestion-label" className="min-w-0 truncate text-sm font-medium leading-5">{label}</span>
    </button>
  );
}

export { PromptSuggestion };
