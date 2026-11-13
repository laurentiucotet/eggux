// EGG UI Scan Frame. Code only (no Figma component yet). The viewfinder over a camera feed for scanning
// a QR code, a barcode or a document: four corner brackets, a hint under the frame and a state.
// scanning (white brackets, a line sweeps down unless the person prefers reduced motion), success
// (green) and error (red). The camera element goes in `children` and fills the frame. The brackets use
// white on purpose: they sit over live video, so they must not follow the theme. The hint is a live
// region ("Point the camera at the QR code") and a text fallback ("Enter the code instead") is always
// offered next to it, because not everyone can scan.
import * as React from 'react';
import { cn } from '@/lib/utils';

export type ScanState = 'scanning' | 'success' | 'error';

export interface ScanFrameProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** The camera feed (a video element or a placeholder). Fills the frame. */
  children?: React.ReactNode;
  /** Default scanning. */
  state?: ScanState;
  /** What to do or what happened. Announced politely when it changes. */
  hint?: string;
  /** Frame side in px. Default 256. */
  size?: number;
}

const corner = 'absolute size-8 border-[3px]';
const colors: Record<ScanState, string> = {
  scanning: 'border-white',
  success: 'border-success',
  error: 'border-destructive',
};

function ScanFrame({ children, state = 'scanning', hint = 'Point the camera at the QR code', size = 256, className, ...props }: ScanFrameProps) {
  return (
    <div data-slot="scan-frame" data-state={state} className={cn('flex flex-col items-center gap-4', className)} {...props}>
      <div className="relative overflow-hidden rounded-xl bg-foreground/90 text-background" style={{ width: size, height: size }}>
        <div className="absolute inset-0">{children}</div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-4">
          <span className={cn(corner, 'top-0 left-0 rounded-tl-lg border-r-0 border-b-0', colors[state])} />
          <span className={cn(corner, 'top-0 right-0 rounded-tr-lg border-b-0 border-l-0', colors[state])} />
          <span className={cn(corner, 'bottom-0 left-0 rounded-bl-lg border-t-0 border-r-0', colors[state])} />
          <span className={cn(corner, 'right-0 bottom-0 rounded-br-lg border-t-0 border-l-0', colors[state])} />
          {state === 'scanning' ? <span className="absolute inset-x-2 top-0 h-0.5 rounded-full bg-white/80 motion-safe:animate-scan-sweep" /> : null}
        </div>
      </div>
      <p role="status" className={cn('m-0 max-w-xs text-center text-sm leading-5', state === 'error' ? 'text-destructive' : state === 'success' ? 'text-success' : 'text-muted-foreground')}>
        {hint}
      </p>
    </div>
  );
}

export { ScanFrame };
