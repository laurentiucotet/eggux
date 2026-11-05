// EGG UI Copy Button. Figma: Copy Button (Button page, "Copy Button / Component").
// Variant (ghost, outline) x Size (default 36, sm 32, xs 28) x State (default, copied). A Button
// Icon that copies one value and confirms in place: State=copied swaps the copy icon for a check in
// the success color for 2 s, the tooltip "Copy" reads "Copied", and a polite live region announces
// it; no toast. When the clipboard fails, it says "Press Ctrl+C to copy".
import * as React from 'react';
import { Check, Copy } from '@/components/icons';
import { ButtonIcon, type ButtonIconProps } from './button-icon';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

export type CopyButtonVariant = 'ghost' | 'outline';
export type CopyButtonSize = 'default' | 'sm' | 'xs';
type CopyState = 'default' | 'copied' | 'failed';

export interface CopyButtonProps extends Omit<ButtonIconProps, 'icon' | 'label' | 'variant' | 'size' | 'onCopy' | 'loading' | 'loadingLabel' | 'showTooltip'> {
  /** The full value to copy, even when the visible text is truncated or masked. */
  value: string;
  /** Accessible name that names the value ("Copy invoice number"). */
  label?: string;
  /** Figma Variant: ghost in content (code blocks, table cells), outline next to fields. */
  variant?: CopyButtonVariant;
  /** Figma Size: default 36, sm 32 (code blocks, cards), xs 28 (table rows, fields). */
  size?: CopyButtonSize;
  /** Called after the value is on the clipboard. */
  onCopy?: (value: string) => void;
  /** How long State=copied lasts, in ms. Figma: 2 s. */
  copiedDuration?: number;
}

const message: Record<CopyState, string> = { default: 'Copy', copied: 'Copied', failed: 'Press Ctrl+C to copy' };

function CopyButton({ value, label = 'Copy', variant = 'ghost', size = 'default', onCopy, copiedDuration = 2000, onClick, ...props }: CopyButtonProps) {
  const [state, setState] = React.useState<CopyState>('default');
  const timer = React.useRef<number | undefined>(undefined);
  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    window.clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(value);
      setState('copied');
      onCopy?.(value);
    } catch {
      setState('failed');
    }
    timer.current = window.setTimeout(() => setState('default'), copiedDuration);
  };

  return (
    <span data-slot="copy-button" data-state={state} className="inline-flex shrink-0">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <ButtonIcon
              variant={variant}
              size={size}
              label={label}
              showTooltip={false}
              icon={state === 'copied' ? <Check className="text-success" aria-hidden="true" /> : <Copy aria-hidden="true" />}
              onClick={copy}
              {...props}
            />
          </TooltipTrigger>
          <TooltipContent>{message[state]}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <span role="status" aria-live="polite" className="sr-only">{state === 'default' ? '' : message[state]}</span>
    </span>
  );
}

export { CopyButton };
