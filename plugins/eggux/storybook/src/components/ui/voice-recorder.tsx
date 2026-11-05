// EGG UI Voice Recorder. Figma: Voice Recorder (AI Chat / Voice Recorder / Component).
// Replaces the Prompt Input while dictating. State=recording: cancel, red dot and time, live
// waveform, send. State=processing: cancel, spinner and "Transcribing…". Presentational: the
// caller owns the microphone (MediaRecorder) and passes the elapsed time and level samples.
import * as React from 'react';
import { ArrowUp, LoaderCircle, X } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';

/** The Figma waveform: 36 recorded bars (heights 4–28 px mapped to 0–1). */
const FIGMA_LEVELS = [6, 10, 16, 22, 14, 8, 12, 20, 26, 18, 10, 6, 8, 14, 22, 28, 20, 12, 8, 10, 16, 24, 18, 12, 6, 8, 12, 18, 22, 14, 10, 6, 8, 10, 14, 8].map(h => (h - 4) / 24);

export interface VoiceRecorderProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** Figma State. */
  state?: 'recording' | 'processing';
  /** Seconds recorded so far (Figma shows 0:12). */
  elapsed?: number;
  /** Input level samples 0–1, oldest first; the newest bars sit at the right end of the recorded part. */
  levels?: number[];
  /** Bars in the waveform (Figma: 50); bars without a sample are drawn flat and light. */
  barCount?: number;
  /** Cancel: drops the recording and returns to the Prompt Input. Escape does the same. */
  onCancel?: () => void;
  /** Send: stops recording and starts the transcription; the text then lands in the Prompt Input for review. */
  onSend?: () => void;
}

function formatTime(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function VoiceRecorder({
  state = 'recording',
  elapsed = 12,
  levels = FIGMA_LEVELS,
  barCount = 50,
  onCancel,
  onSend,
  className,
  onKeyDown,
  ...props
}: VoiceRecorderProps) {
  const recording = state === 'recording';
  const recorded = levels.slice(-barCount);
  const empty = Math.max(0, barCount - recorded.length);

  return (
    <div
      data-slot="voice-recorder"
      data-state={state}
      role="group"
      aria-label="Voice input"
      className={cn('flex w-full min-w-0 items-center gap-3 rounded-xl border border-input bg-background p-3 text-foreground', className)}
      onKeyDown={e => {
        onKeyDown?.(e);
        if (e.key === 'Escape' && !e.defaultPrevented) onCancel?.();
      }}
      {...props}
    >
      <Button variant="ghost" size="icon" aria-label="Cancel recording" title="Cancel recording" onClick={onCancel}>
        <X aria-hidden="true" />
      </Button>

      {recording ? (
        <>
          {/* Announced once when recording starts; the time is read on demand, not every second. */}
          <span role="status" className="flex shrink-0 items-center gap-3">
            <span aria-hidden="true" className="size-2 rounded-full bg-destructive motion-safe:animate-pulse" />
            <span className="sr-only">Recording</span>
          </span>
          <span data-slot="voice-recorder-time" className="shrink-0 text-sm font-medium tabular-nums">
            <span className="sr-only">Recorded time </span>
            {formatTime(elapsed)}
          </span>
          <div data-slot="voice-recorder-waveform" aria-hidden="true" className="flex h-7 min-w-0 flex-1 items-center gap-0.5 overflow-hidden">
            {recorded.map((level, i) => (
              <span
                key={i}
                className="w-[3px] shrink-0 rounded-sm bg-foreground transition-[height] duration-[var(--duration-fast)] motion-reduce:transition-none"
                style={{ height: `${4 + Math.round(Math.min(1, Math.max(0, level)) * 24)}px` }}
              />
            ))}
            {Array.from({ length: empty }, (_, i) => (
              <span key={`empty-${i}`} className="h-1 w-[3px] shrink-0 rounded-sm bg-border" />
            ))}
          </div>
          <Button size="icon" aria-label="Send recording" title="Send recording" onClick={onSend}>
            <ArrowUp aria-hidden="true" />
          </Button>
        </>
      ) : (
        <div role="status" className="flex min-w-0 flex-1 items-center gap-3">
          <LoaderCircle aria-hidden="true" className="size-4 shrink-0 text-muted-foreground motion-safe:animate-spin motion-reduce:animate-pulse" />
          <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">Transcribing…</span>
        </div>
      )}
    </div>
  );
}

export { VoiceRecorder };
