// EGG UI Confidence Indicator. Figma: Confidence Indicator (AI Chat / Confidence Indicator / Component).
// Level (high, medium, low) and Show info match the Figma properties. Three bars filled by level
// plus the level in words; the info button opens a Tooltip with why. Never raw percentages.
import * as React from 'react';
import { Tooltip } from 'radix-ui';
import { Info } from '@/components/icons';
import { cn } from '@/lib/utils';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface ConfidenceIndicatorProps extends React.ComponentProps<'span'> {
  /** Figma Level. */
  level?: ConfidenceLevel;
  /** Figma Show info: the info button with a Tooltip that says why. */
  showInfo?: boolean;
  /** The Tooltip text: why this level (source found, partial match, guess). */
  reason?: React.ReactNode;
  /** Override the words for the level. */
  label?: string;
}

const levels: Record<ConfidenceLevel, { value: number; label: string; name: string; reason: string; bar: string }> = {
  high: { value: 3, label: 'High confidence', name: 'high', reason: 'Found in the source document.', bar: 'bg-success' },
  medium: { value: 2, label: 'Medium confidence', name: 'medium', reason: 'Partial match: check the highlighted part.', bar: 'bg-warning' },
  low: { value: 1, label: 'Low confidence · check this', name: 'low', reason: 'A guess: no source matched this value.', bar: 'bg-destructive' },
};

// Bar heights from Figma: 6, 9, 12.
const barHeights = ['h-1.5', 'h-[9px]', 'h-3'];

function ConfidenceIndicator({ level = 'high', showInfo = true, reason, label, className, ...props }: ConfidenceIndicatorProps) {
  const config = levels[level];
  const text = label ?? config.label;

  return (
    <span data-slot="confidence-indicator" data-level={level} className={cn('inline-flex max-w-full items-center gap-2', className)} {...props}>
      {/* Meter semantics: the level is read as words ("High confidence"); the bars are decoration. */}
      <span
        role="meter"
        aria-label="Confidence"
        aria-valuemin={1}
        aria-valuemax={3}
        aria-valuenow={config.value}
        aria-valuetext={text}
        className="inline-flex min-w-0 items-center gap-2"
      >
        <span aria-hidden="true" className="flex shrink-0 items-end gap-0.5">
          {barHeights.map((h, i) => (
            <span key={h} data-slot="confidence-bar" className={cn('w-1 rounded-full', h, i < config.value ? config.bar : 'bg-border')} />
          ))}
        </span>
        <span className="min-w-0 truncate text-xs text-muted-foreground">{text}</span>
      </span>
      {showInfo ? (
        <Tooltip.Provider delayDuration={300}>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              {/* 24 px target, drawn as the 12 px icon (negative margin keeps the Figma width). */}
              <button
                type="button"
                aria-label={`Why ${config.name} confidence`}
                className="-m-1.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <Info className="size-3" aria-hidden="true" />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                data-slot="confidence-tooltip"
                side="top"
                sideOffset={4}
                className="z-50 max-w-64 rounded-md bg-foreground px-3 py-1.5 text-xs text-background"
              >
                {reason ?? config.reason}
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      ) : null}
    </span>
  );
}

export { ConfidenceIndicator };
