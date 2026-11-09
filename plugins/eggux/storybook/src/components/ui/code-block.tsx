// EGG UI Code Block page: Code Block (136:3) with Code Highlight (1098:7990), Command Snippet
// (438:953), Endpoint Row (438:1010), Log Row (438:1027), Diff Viewer and Diff Line (438:1044,
// 438:1043), JSON Viewer (438:1072), Inline Code (1098:8424). Text style `code`: font-mono,
// semibold, 14 / 20.
// Code Block: muted surface, border, radius lg. Header (16 / 4 padding, a bottom border): optional
// line Tabs sm (npm, pnpm, yarn), the language (ui/caption) and Copy. Body: 16 padding, optional
// line-number gutter, no wrapping (scrolls; the scroll area is focusable), optional highlight band
// (code/line-highlight) behind one line. Muted text on the muted surface uses the
// filled-muted-foreground token (4.5:1 there).
// Command Snippet: one command on muted, "$" prompt (never copied), Copy (sm), 36 high.
// Endpoint Row: method Badge (GET info, POST success, PUT / PATCH warning, DELETE destructive),
// the path in mono, the summary (max 200); a link to the endpoint; selected on accent.
// Log Row: time, LEVEL (48), message in mono; messages wrap; warn and error carry a left rule.
// Diff Viewer: header on muted (file icon, file name, +N / −N), then Diff Lines: number (32),
// a 3 px marker, the sign and the text; removed has strikethrough; screen readers hear
// "Added" / "Removed". JSON Viewer: collapsible objects with chevrons; strings, numbers and
// booleans in the category text colors. Inline Code: mono chip on muted, max 320, truncates.
import * as React from 'react';
import { ChevronDown, ChevronRight, FileText } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Badge, type BadgeProps } from './badge';
import { CopyButton } from './copy-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

const mono = 'font-mono text-sm leading-5 font-semibold';
const onMuted = 'text-[var(--input-filled-muted-foreground)]';

/* Code Block */

export interface CodeSample { value: string; label: string; code: string; language?: string }

export interface CodeBlockProps extends React.ComponentProps<'div'> {
  code?: string;
  language?: string;
  /** Tabs of alternatives (npm, pnpm, yarn); replaces code and language. */
  samples?: CodeSample[];
  lineNumbers?: boolean;
  /** 1-based line to highlight. */
  highlightLine?: number;
  /** Header with the language and Copy. */
  header?: boolean;
  /** Accessible name of the code region: "Install commands". */
  label?: string;
}

function CodeBody({ code, lineNumbers, highlightLine, label }: { code: string; lineNumbers?: boolean; highlightLine?: number; label: string }) {
  const lines = code.replace(/\n$/, '').split('\n');
  return (
    <div role="region" aria-label={label} tabIndex={0} className="overflow-x-auto p-4 outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-ring/50">
      <pre className={cn('m-0 w-max min-w-full', mono)}>
        <code className="block">
          {lines.map((l, i) => (
            <span
              key={i}
              data-line={i + 1}
              data-highlighted={highlightLine === i + 1 || undefined}
              className={cn('-mx-4 flex gap-4 px-4', highlightLine === i + 1 && 'bg-[var(--code-line-highlight)]')}
            >
              {lineNumbers ? <span aria-hidden="true" className={cn('w-[2ch] shrink-0 text-right select-none', onMuted)}>{i + 1}</span> : null}
              <span className="text-foreground">{l || ' '}</span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

function CodeBlock({ code = '', language, samples, lineNumbers = false, highlightLine, header = true, label = 'Code', className, ...props }: CodeBlockProps) {
  const [tab, setTab] = React.useState(samples?.[0]?.value ?? '');
  const current = samples?.find(s => s.value === tab);
  const value = current ? current.code : code;
  const lang = current?.language ?? language;
  const copy = <CopyButton value={value} label={`Copy ${lang ? `${lang} ` : ''}code`} />;
  return (
    <div data-slot="code-block" className={cn('flex w-full min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-muted', className)} {...props}>
      {samples?.length ? (
        <Tabs variant="line" size="sm" value={tab} onValueChange={setTab}>
          <div className="flex items-center border-b border-border py-1 pr-1 pl-4">
            <TabsList className="w-auto border-b-0">
              {samples.map(s => (
                <TabsTrigger key={s.value} value={s.value} className="data-[state=inactive]:text-[var(--input-filled-muted-foreground)]">{s.label}</TabsTrigger>
              ))}
            </TabsList>
            <span className={cn('min-w-0 flex-1 truncate px-3 text-xs leading-4', onMuted)}>{lang}</span>
            {copy}
          </div>
          {samples.map(s => (
            <TabsContent key={s.value} value={s.value} className="mt-0">
              <CodeBody code={s.code} lineNumbers={lineNumbers} highlightLine={highlightLine} label={`${label}, ${s.label}`} />
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <>
          {header ? (
            <div className="flex items-center border-b border-border py-1 pr-1 pl-4">
              <span className={cn('min-w-0 flex-1 truncate text-xs leading-4', onMuted)}>{lang}</span>
              {copy}
            </div>
          ) : null}
          <CodeBody code={code} lineNumbers={lineNumbers} highlightLine={highlightLine} label={label} />
        </>
      )}
    </div>
  );
}

/* Command Snippet */

export interface CommandSnippetProps extends React.ComponentProps<'div'> {
  command: string;
  prompt?: boolean;
}

function CommandSnippet({ command, prompt = true, className, ...props }: CommandSnippetProps) {
  return (
    <div data-slot="command-snippet" className={cn('flex w-full min-w-0 items-center gap-2 rounded-md bg-muted px-3 py-0.5', className)} {...props}>
      {prompt ? <span aria-hidden="true" className={cn(mono, onMuted, 'shrink-0 select-none')}>$</span> : null}
      <code title={command} className={cn(mono, 'min-w-0 flex-1 truncate text-foreground')}>{command}</code>
      <CopyButton value={command} size="sm" label="Copy command" />
    </div>
  );
}

/* Endpoint Row */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
const methodVariant: Record<HttpMethod, NonNullable<BadgeProps['variant']>> = { GET: 'info', POST: 'success', PUT: 'warning', PATCH: 'warning', DELETE: 'destructive' };

export interface EndpointRowProps extends React.ComponentProps<'li'> {
  method: HttpMethod;
  path: string;
  summary?: string;
  href: string;
  selected?: boolean;
}

function EndpointRow({ method, path, summary, href, selected = false, className, ...props }: EndpointRowProps) {
  return (
    <li
      data-slot="endpoint-row"
      data-state={selected ? 'selected' : 'default'}
      className={cn(
        'relative flex min-w-0 list-none flex-wrap items-center gap-x-3 gap-y-1 border-b border-border p-2 has-[a:focus-visible]:ring-[3px] has-[a:focus-visible]:ring-ring/50',
        selected ? 'bg-accent' : 'hover:bg-muted',
        className,
      )}
      {...props}
    >
      <Badge variant={methodVariant[method]} className="shrink-0">{method}</Badge>
      <a href={href} aria-current={selected ? 'page' : undefined} title={path} className={cn(mono, 'min-w-[120px] flex-1 truncate text-foreground outline-none after:absolute after:inset-0 after:content-[""]')}>
        {path}
      </a>
      {/* Muted on the accent fill is under 4.5:1: the filled-muted token when selected. */}
      {summary ? <span className={cn('max-w-[200px] shrink-0 truncate text-sm leading-5', selected ? onMuted : 'text-muted-foreground')}>{summary}</span> : null}
    </li>
  );
}

/* Log Row */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
const levelClass: Record<LogLevel, { text: string; rule: string }> = {
  debug: { text: 'text-muted-foreground', rule: 'border-transparent' },
  info: { text: 'text-info', rule: 'border-transparent' },
  warn: { text: 'text-[var(--badge-soft-warning-fg)]', rule: 'border-warning' },
  error: { text: 'text-destructive', rule: 'border-destructive' },
};

export interface LogRowProps extends React.ComponentProps<'li'> {
  time: string;
  level: LogLevel;
  message: React.ReactNode;
}

function LogRow({ time, level, message, className, ...props }: LogRowProps) {
  const c = levelClass[level];
  return (
    <li data-slot="log-row" data-level={level} className={cn('flex min-w-0 list-none items-start gap-3 border-l px-2 py-1', mono, c.rule, className)} {...props}>
      <time className="shrink-0 whitespace-nowrap text-muted-foreground">{time}</time>
      <span className={cn('w-12 shrink-0', c.text)}>{level.toUpperCase()}</span>
      <span className="min-w-0 flex-1 break-words text-foreground">{message}</span>
    </li>
  );
}

/* Diff Viewer */

export type DiffType = 'context' | 'added' | 'removed';

export interface DiffLineProps extends React.ComponentProps<'li'> {
  type?: DiffType;
  line?: number;
}

function DiffLine({ type = 'context', line, className, children, ...props }: DiffLineProps) {
  return (
    <li data-slot="diff-line" data-type={type} className={cn('flex min-w-0 list-none items-start gap-2 px-0 py-0.5', mono, className)} {...props}>
      <span aria-hidden="true" className="w-8 shrink-0 text-right text-muted-foreground select-none">{line}</span>
      <span aria-hidden="true" className={cn('w-[3px] shrink-0 self-stretch', type === 'added' && 'bg-success', type === 'removed' && 'bg-destructive')} />
      <span aria-hidden="true" className={cn('w-[1ch] shrink-0 select-none', type === 'added' ? 'text-success' : type === 'removed' ? 'text-destructive' : 'text-muted-foreground')}>
        {type === 'added' ? '+' : type === 'removed' ? '−' : ' '}
      </span>
      {type === 'added' ? (
        <ins className="min-w-0 flex-1 text-foreground no-underline"><span className="sr-only">Added: </span>{children}</ins>
      ) : type === 'removed' ? (
        <del className="min-w-0 flex-1 text-foreground"><span className="sr-only">Removed: </span>{children}</del>
      ) : (
        <span className="min-w-0 flex-1 text-foreground">{children}</span>
      )}
    </li>
  );
}

export interface DiffViewerProps extends React.ComponentProps<'section'> {
  file: string;
  added?: number;
  removed?: number;
}

function DiffViewer({ file, added = 0, removed = 0, className, children, ...props }: DiffViewerProps) {
  const id = React.useId();
  return (
    <section data-slot="diff-viewer" aria-labelledby={id} className={cn('flex w-full min-w-0 flex-col overflow-hidden rounded-md border border-border', className)} {...props}>
      <div className="flex items-center gap-2 border-b border-border bg-muted px-3 py-2">
        <FileText aria-hidden="true" className="size-4 shrink-0" />
        <h3 id={id} className={cn('m-0 min-w-[120px] flex-1 truncate text-foreground', mono)}>{file}</h3>
        <span className="max-w-16 shrink-0 truncate text-sm leading-5 font-medium text-[var(--badge-soft-success-fg)]"><span className="sr-only">Lines added: </span>+{added}</span>
        <span className="max-w-16 shrink-0 truncate text-sm leading-5 font-medium text-[var(--badge-soft-destructive-fg)]"><span className="sr-only">Lines removed: </span>−{removed}</span>
      </div>
      <ul className="m-0 flex flex-col overflow-x-auto p-0 py-2">{children}</ul>
    </section>
  );
}

/* JSON Viewer */

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

export interface JsonViewerProps extends React.ComponentProps<'div'> {
  data: Json;
  /** Levels open at first; deeper objects start collapsed. */
  openDepth?: number;
  label?: string;
}

function JsonValue({ value }: { value: Json }) {
  if (typeof value === 'string') return <span className="text-[var(--badge-category-3-fg)]">"{value}"</span>;
  if (typeof value === 'number') return <span className="text-[var(--badge-category-1-fg)]">{String(value)}</span>;
  if (typeof value === 'boolean' || value === null) return <span className="text-[var(--badge-category-5-fg)]">{String(value)}</span>;
  return null;
}

function JsonNode({ k, value, depth, openDepth, last }: { k?: string; value: Json; depth: number; openDepth: number; last: boolean }) {
  const [open, setOpen] = React.useState(depth < openDepth);
  const isObj = value !== null && typeof value === 'object';
  const pad = { paddingLeft: depth * 16 };
  const key = k !== undefined ? <>"{k}": </> : null;
  const comma = last ? '' : ',';
  if (!isObj) {
    // tabIndex -1 from the first render: rows can take focus at once; the effect below gives the first row 0.
    return <div role="treeitem" tabIndex={-1} aria-selected={false} style={pad} className="truncate pb-0.5">{key}<JsonValue value={value} />{comma}</div>;
  }
  const arr = Array.isArray(value);
  const entries = arr ? (value as Json[]).map((v, i) => [String(i), v] as const) : Object.entries(value as Record<string, Json>);
  const [o, c] = arr ? ['[', ']'] : ['{', '}'];
  return (
    <div role="treeitem" tabIndex={-1} aria-expanded={open} aria-selected={false}>
      <div style={{ paddingLeft: Math.max(0, depth * 16 - 16) }} className="flex items-center gap-1 pb-0.5">
        <span aria-hidden="true" data-toggle onClick={() => setOpen(x => !x)} className="flex size-3 shrink-0 cursor-pointer items-center justify-center text-muted-foreground [&_svg]:size-3">
          {open ? <ChevronDown /> : <ChevronRight />}
        </span>
        <span className="truncate">{key}{o}{open ? '' : ` … ${c}${comma}`}</span>
      </div>
      {open ? (
        <>
          <div role="group">
            {entries.map(([ek, ev], i) => (
              <JsonNode key={ek} k={arr ? undefined : ek} value={ev} depth={depth + 1} openDepth={openDepth} last={i === entries.length - 1} />
            ))}
          </div>
          <div style={pad} className={depth > 0 ? 'pb-0.5' : undefined}>{c}{comma}</div>
        </>
      ) : null}
    </div>
  );
}

function JsonViewer({ data, openDepth = 2, label = 'JSON', className, ...props }: JsonViewerProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  // Tree keyboard: Up / Down move between rows, Right opens, Left closes (click the chevron).
  const onKeyDown = (e: React.KeyboardEvent) => {
    const items = [...(ref.current?.querySelectorAll<HTMLElement>('[role="treeitem"]') ?? [])];
    const i = items.indexOf(document.activeElement as HTMLElement);
    const cur = items[i];
    if (!cur) return;
    const move = (to: number) => { e.preventDefault(); items.forEach(x => x.tabIndex = -1); const t = items[Math.max(0, Math.min(items.length - 1, to))]!; t.tabIndex = 0; t.focus(); };
    if (e.key === 'ArrowDown') move(i + 1);
    else if (e.key === 'ArrowUp') move(i - 1);
    else if ((e.key === 'ArrowRight' && cur.getAttribute('aria-expanded') === 'false') || (e.key === 'ArrowLeft' && cur.getAttribute('aria-expanded') === 'true')) {
      e.preventDefault();
      cur.querySelector<HTMLElement>(':scope > div > [data-toggle]')?.click();
    }
  };
  React.useEffect(() => {
    const first = ref.current?.querySelector<HTMLElement>('[role="treeitem"]');
    if (first) first.tabIndex = 0;
    ref.current?.querySelectorAll<HTMLElement>('[role="treeitem"]').forEach((x, i) => { if (i > 0 && x.tabIndex !== 0) x.tabIndex = -1; });
  });
  return (
    <div ref={ref} role="tree" aria-label={label} onKeyDown={onKeyDown} data-slot="json-viewer" className={cn('flex w-full min-w-0 flex-col overflow-x-auto rounded-md bg-muted p-3 text-foreground [&_[role=treeitem]]:outline-none [&_[role=treeitem]:focus-visible]:ring-[3px] [&_[role=treeitem]:focus-visible]:ring-ring/50', mono, className)} {...props}>
      <JsonNode value={data} depth={0} openDepth={openDepth} last />
    </div>
  );
}

/* Inline Code */

function InlineCode({ className, children, ...props }: React.ComponentProps<'code'>) {
  return (
    <code
      data-slot="inline-code"
      title={typeof children === 'string' ? children : undefined}
      className={cn('inline-block max-w-80 truncate rounded-sm bg-muted px-1 py-0.5 align-middle text-foreground', mono, className)}
      {...props}
    >
      {children}
    </code>
  );
}

export { CodeBlock, CommandSnippet, DiffLine, DiffViewer, EndpointRow, InlineCode, JsonViewer, LogRow };
