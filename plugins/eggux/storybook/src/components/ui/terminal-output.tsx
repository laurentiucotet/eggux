// EGG UI Terminal Output. Code only (no Figma component yet); family Developer.
// A console block: a title bar with an Auto-scroll Switch and a Copy Button, and a scrolling body that is
// a live log (role="log", polite, labelled, tabindex=0 so a keyboard can scroll it). Lines are
// commands (the prompt, "$", then the command), stdout (plain) and stderr (a "!" mark and the
// destructive color; a screen reader hears "Error:"), so the stream is never told by color alone.
// Long lines wrap (break-all for paths and ids), nothing scrolls sideways. With Auto-scroll on, the body
// follows new lines; turn it off to read older output. Copy puts the whole output on the clipboard as
// plain text, commands with their prompt.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { CopyButton } from './copy-button';
import { Switch } from './switch';

export type TerminalStream = 'command' | 'stdout' | 'stderr';

export interface TerminalLine {
  stream: TerminalStream;
  text: string;
}

export interface TerminalOutputProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  lines: TerminalLine[];
  /** Name of the console ("Deploy log"). Also the accessible name of the log. */
  title: string;
  /** What comes before a command. Default "$". */
  prompt?: string;
  /** Controlled Auto-scroll. */
  autoScroll?: boolean;
  defaultAutoScroll?: boolean;
  onAutoScrollChange?: (on: boolean) => void;
  /** Height of the body, a CSS length. Default 16rem. */
  height?: string;
}

export function terminalText(lines: TerminalLine[], prompt = '$') {
  return lines.map(l => (l.stream === 'command' ? `${prompt} ${l.text}` : l.text)).join('\n');
}

function TerminalOutput({ lines, title, prompt = '$', autoScroll, defaultAutoScroll = true, onAutoScrollChange, height = '16rem', className, ...props }: TerminalOutputProps) {
  const [inner, setInner] = React.useState(defaultAutoScroll);
  const follow = autoScroll ?? inner;
  const body = React.useRef<HTMLDivElement>(null);

  // Follow new lines (and the moment Auto-scroll is switched on).
  React.useLayoutEffect(() => {
    const el = body.current;
    if (follow && el) el.scrollTop = el.scrollHeight;
  }, [follow, lines.length]);

  return (
    <div data-slot="terminal-output" className={cn('flex w-full min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground', className)} {...props}>
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-border px-3 py-1.5">
        <span className="min-w-0 truncate text-xs leading-5 font-medium" title={title}>{title}</span>
        <div className="flex shrink-0 items-center gap-2">
          <Switch
            size="sm"
            label="Auto-scroll"
            checked={follow}
            onCheckedChange={on => {
              if (autoScroll === undefined) setInner(on);
              onAutoScrollChange?.(on);
            }}
          />
          <CopyButton value={terminalText(lines, prompt)} label={`Copy ${title}`} size="xs" />
        </div>
      </div>
      <div
        ref={body}
        role="log"
        aria-label={title}
        aria-live="polite"
        tabIndex={0}
        style={{ height }}
        className="overflow-y-auto px-3 py-2 font-mono text-xs leading-5 outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-ring/50"
      >
        {lines.length === 0 ? <p className="m-0 text-muted-foreground">No output yet.</p> : null}
        {lines.map((l, i) => (
          <div key={i} data-stream={l.stream} className="flex min-w-0 gap-2">
            <span aria-hidden="true" className={cn('w-3 shrink-0 select-none', l.stream === 'stderr' ? 'font-semibold text-destructive' : 'text-muted-foreground')}>
              {l.stream === 'command' ? prompt : l.stream === 'stderr' ? '!' : ''}
            </span>
            <span className={cn('min-w-0 flex-1 break-all whitespace-pre-wrap', l.stream === 'stderr' && 'text-destructive', l.stream === 'command' && 'font-medium')}>
              {l.stream === 'command' ? <span className="sr-only">Command: </span> : null}
              {l.stream === 'stderr' ? <span className="sr-only">Error: </span> : null}
              {l.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export { TerminalOutput };
