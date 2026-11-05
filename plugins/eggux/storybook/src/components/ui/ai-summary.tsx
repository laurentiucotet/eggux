// EGG UI AI Summary and AI Notice. Figma: AI Summary and AI Notice (AI Chat / AI Summary / Component).
// AI Summary: State (ready, generating, error), Title, Meta, Show feedback and Show disclaimer match
// the Figma properties; the Content slot is children. AI Notice: Type (label, disclaimer) with the
// Label and Disclaimer texts.
import * as React from 'react';
import { Copy, Info, LoaderCircle, RefreshCw, Sparkles, ThumbsDown, ThumbsUp } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';

/* ---------------------------------------------------------------- AI Notice */

export type AiNoticeType = 'label' | 'disclaimer';

export interface AiNoticeProps extends React.ComponentProps<'span'> {
  /** Figma Type. label: pill that marks AI content. disclaimer: one muted line under AI answers. */
  type?: AiNoticeType;
  /** Figma Label (Type=label). */
  label?: string;
  /** Figma Disclaimer (Type=disclaimer). Keep the same words everywhere. */
  disclaimer?: string;
}

function AiNotice({
  type = 'label',
  label = 'AI generated',
  disclaimer = 'AI can make mistakes. Check important details.',
  className,
  ...props
}: AiNoticeProps) {
  if (type === 'disclaimer') {
    return (
      <span data-slot="ai-notice" data-type="disclaimer" className={cn('flex w-full items-start gap-1.5 text-xs text-muted-foreground', className)} {...props}>
        <span className="flex h-4 shrink-0 items-center"><Info className="size-3.5" aria-hidden="true" /></span>
        {/* Wraps, never truncates. */}
        <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">{disclaimer}</span>
      </span>
    );
  }
  return (
    <span
      data-slot="ai-notice"
      data-type="label"
      className={cn('inline-flex max-w-full shrink-0 items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-foreground', className)}
      {...props}
    >
      <Sparkles className="size-3 shrink-0" aria-hidden="true" />
      <span className="min-w-0 truncate">{label}</span>
    </span>
  );
}

/* --------------------------------------------------------------- AI Summary */

export type AiSummaryState = 'ready' | 'generating' | 'error';

export interface AiSummaryProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  /** Figma State. generating: what it reads plus skeleton lines. error: what failed and Try again. */
  state?: AiSummaryState;
  /** Figma Title. */
  title?: string;
  /** Figma Meta: sources and age. With onOpenSources it becomes a button that shows the sources. */
  meta?: string;
  /** Figma Show feedback: good and bad under the summary. */
  showFeedback?: boolean;
  /** Figma Show disclaimer: AI Notice Type=disclaimer at the bottom. */
  showDisclaimer?: boolean;
  /** Which feedback button is pressed. */
  feedback?: 'good' | 'bad';
  /** State=generating: what it reads. */
  generatingText?: string;
  /** State=error: what failed. */
  errorText?: string;
  /** Disclaimer words (AI Notice Disclaimer). */
  disclaimer?: string;
  onRegenerate?: () => void;
  onCopy?: () => void;
  onFeedback?: (value: 'good' | 'bad') => void;
  onRetry?: () => void;
  onOpenSources?: () => void;
}

function AiSummary({
  state = 'ready',
  title = 'Summary',
  meta = '4 sources · generated 2 min ago',
  showFeedback = true,
  showDisclaimer = true,
  feedback,
  generatingText = 'Reading 4 sources…',
  errorText = 'Could not write the summary: the activity log did not load.',
  disclaimer,
  onRegenerate,
  onCopy,
  onFeedback,
  onRetry,
  onOpenSources,
  className,
  children,
  ...props
}: AiSummaryProps) {
  const titleId = React.useId();
  const ready = state === 'ready';

  return (
    <section
      data-slot="ai-summary"
      data-state={state}
      aria-labelledby={titleId}
      className={cn('flex w-full min-w-0 flex-col gap-3 rounded-lg border border-border bg-card p-4 text-card-foreground', className)}
      {...props}
    >
      <div className="flex w-full items-center gap-2">
        <Sparkles className="size-4 shrink-0" aria-hidden="true" />
        <h3 id={titleId} className="min-w-0 flex-1 text-sm font-medium [overflow-wrap:anywhere]">{title}</h3>
        {ready ? (
          <div className="flex shrink-0 items-center">
            <Button variant="ghost" size="icon" aria-label="Regenerate summary" title="Regenerate summary" onClick={onRegenerate}>
              <RefreshCw aria-hidden="true" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Copy summary" title="Copy summary" onClick={onCopy}>
              <Copy aria-hidden="true" />
            </Button>
          </div>
        ) : null}
      </div>

      {/* Generating, ready and error are announced politely. */}
      <div data-slot="ai-summary-body" aria-live="polite" aria-busy={state === 'generating' || undefined} className="flex w-full flex-col gap-3">
        {ready ? (
          <>
            <div data-slot="ai-summary-content" className="line-clamp-6 w-full text-sm [&>*+*]:mt-2 text-card-foreground [overflow-wrap:anywhere]">
              {typeof children === 'string' ? <p>{children}</p> : children}
            </div>
            <div className="flex w-full items-center gap-2">
              <div className="min-w-0 flex-1 text-xs text-muted-foreground">
                {onOpenSources ? (
                  <button
                    type="button"
                    onClick={onOpenSources}
                    className="rounded-sm text-left underline-offset-4 outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    {meta}
                  </button>
                ) : (
                  <p>{meta}</p>
                )}
              </div>
              {showFeedback ? (
                <div className="flex shrink-0 items-center">
                  <Button variant="ghost" size="icon" aria-label="Good summary" title="Good summary" aria-pressed={feedback === 'good'} onClick={() => onFeedback?.('good')}>
                    <ThumbsUp aria-hidden="true" />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="Bad summary" title="Bad summary" aria-pressed={feedback === 'bad'} onClick={() => onFeedback?.('bad')}>
                    <ThumbsDown aria-hidden="true" />
                  </Button>
                </div>
              ) : null}
            </div>
          </>
        ) : null}

        {state === 'generating' ? (
          <>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <LoaderCircle className="size-4 shrink-0 animate-spin motion-reduce:animate-none" aria-hidden="true" />
              {generatingText}
            </p>
            <div aria-hidden="true" className="flex w-full flex-col gap-3">
              <div className="h-4 w-11/12 animate-pulse rounded-md bg-accent motion-reduce:animate-none" />
              <div className="h-4 w-full animate-pulse rounded-md bg-accent motion-reduce:animate-none" />
              <div className="h-4 w-2/3 animate-pulse rounded-md bg-accent motion-reduce:animate-none" />
            </div>
          </>
        ) : null}

        {state === 'error' ? (
          <div className="flex w-full flex-col items-start gap-3">
            <p className="w-full text-sm text-card-foreground [overflow-wrap:anywhere]">{errorText}</p>
            <Button variant="outline" size="sm" leadingIcon={<RefreshCw aria-hidden="true" />} onClick={onRetry}>Try again</Button>
          </div>
        ) : null}
      </div>

      {ready && showDisclaimer ? <AiNotice type="disclaimer" disclaimer={disclaimer} /> : null}
    </section>
  );
}

export { AiSummary, AiNotice };
