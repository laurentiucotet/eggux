// EGG UI Diff Viewer. Code only (no Figma component yet); family Developer.
// A line diff of two texts, unified (one column, removed lines then added ones) or split (before on the
// left, after on the right), switched with a segmented Toggle Group. Every line has its number(s); an
// added line has a green fill and "+", a removed line a red fill and "-", and a screen reader hears
// "Added:" or "Removed:", so color is never the only signal. The header counts the changes ("2 added,
// 1 removed"). The diff is a real table with a caption; the scroll area has tabindex=0 so a keyboard
// can scroll long lines sideways. Unchanged texts say "No differences". Lines are compared as whole
// lines (longest common subsequence); there is no word-level highlight.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { ToggleGroup, ToggleGroupItem } from './toggle-group';

export type DiffMode = 'unified' | 'split';
type Kind = 'same' | 'add' | 'del';
interface Op { kind: Kind; text: string; oldNo?: number; newNo?: number }

/** Line diff by longest common subsequence. */
export function diffLines(before: string, after: string): Op[] {
  const a = before === '' ? [] : before.split('\n');
  const b = after === '' ? [] : after.split('\n');
  const n = a.length;
  const m = b.length;
  const t: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) t[i]![j] = a[i] === b[j] ? t[i + 1]![j + 1]! + 1 : Math.max(t[i + 1]![j]!, t[i]![j + 1]!);
  const ops: Op[] = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) { ops.push({ kind: 'same', text: a[i]!, oldNo: i + 1, newNo: j + 1 }); i++; j++; }
    else if (t[i + 1]![j]! >= t[i]![j + 1]!) { ops.push({ kind: 'del', text: a[i]!, oldNo: i + 1 }); i++; }
    else { ops.push({ kind: 'add', text: b[j]!, newNo: j + 1 }); j++; }
  }
  while (i < n) { ops.push({ kind: 'del', text: a[i]!, oldNo: i + 1 }); i++; }
  while (j < m) { ops.push({ kind: 'add', text: b[j]!, newNo: j + 1 }); j++; }
  return ops;
}

const fill: Record<Kind, string> = {
  same: '',
  add: 'bg-[var(--badge-soft-success-bg)]',
  del: 'bg-[var(--badge-soft-destructive-bg)]',
};
const ink: Record<Kind, string> = {
  same: 'text-muted-foreground',
  add: 'text-[var(--badge-soft-success-fg)]',
  del: 'text-[var(--badge-soft-destructive-fg)]',
};
const sign: Record<Kind, string> = { same: ' ', add: '+', del: '-' };
const spoken: Record<Kind, string> = { same: '', add: 'Added: ', del: 'Removed: ' };

function Cell({ kind, text }: { kind: Kind; text?: string }) {
  return (
    <>
      <td aria-hidden={text === undefined ? true : undefined} className={cn('w-5 px-1 text-center font-mono select-none', fill[kind], ink[kind])}>
        {text === undefined ? null : <><span aria-hidden="true">{sign[kind]}</span><span className="sr-only">{spoken[kind]}</span></>}
      </td>
      <td className={cn('px-2 font-mono whitespace-pre text-foreground', fill[kind])}>{text ?? ''}</td>
    </>
  );
}

function No({ n, kind }: { n?: number; kind: Kind }) {
  return <td className={cn('w-10 min-w-10 px-2 text-right font-mono select-none', fill[kind], ink[kind])}>{n ?? ''}</td>;
}

export interface DiffViewerProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** The old text. */
  before: string;
  /** The new text. */
  after: string;
  /** Name of the old text ("invoice.template.json before"). */
  beforeLabel?: string;
  afterLabel?: string;
  /** Controlled view. */
  mode?: DiffMode;
  defaultMode?: DiffMode;
  onModeChange?: (mode: DiffMode) => void;
  /** Accessible name of the diff table. */
  label?: string;
}

function DiffViewer({ before, after, beforeLabel = 'Before', afterLabel = 'After', mode, defaultMode = 'unified', onModeChange, label = 'Changes', className, ...props }: DiffViewerProps) {
  const [inner, setInner] = React.useState<DiffMode>(defaultMode);
  const view = mode ?? inner;
  const ops = React.useMemo(() => diffLines(before, after), [before, after]);
  const added = ops.filter(o => o.kind === 'add').length;
  const removed = ops.filter(o => o.kind === 'del').length;

  // Split rows: a block of removed lines sits beside the added lines that follow it.
  const rows = React.useMemo(() => {
    const out: { left?: Op; right?: Op }[] = [];
    let k = 0;
    while (k < ops.length) {
      const o = ops[k]!;
      if (o.kind === 'same') { out.push({ left: o, right: o }); k++; continue; }
      const dels: Op[] = [];
      const adds: Op[] = [];
      while (k < ops.length && ops[k]!.kind !== 'same') { (ops[k]!.kind === 'del' ? dels : adds).push(ops[k]!); k++; }
      for (let r = 0; r < Math.max(dels.length, adds.length); r++) out.push({ left: dels[r], right: adds[r] });
    }
    return out;
  }, [ops]);

  const setMode = (next: string) => {
    if (mode === undefined) setInner(next as DiffMode);
    onModeChange?.(next as DiffMode);
  };

  return (
    <div data-slot="diff-viewer" data-mode={view} className={cn('flex w-full min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground', className)} {...props}>
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-2">
        <p className="m-0 min-w-0 text-sm leading-5 font-medium">
          <span className="text-[var(--badge-soft-success-fg)]" aria-hidden="true">+{added}</span>{' '}
          <span className="text-[var(--badge-soft-destructive-fg)]" aria-hidden="true">-{removed}</span>
          <span className="sr-only">{added} added, {removed} removed</span>
        </p>
        <ToggleGroup type="single" variant="segmented" size="sm" aria-label="View" value={view} onValueChange={setMode}>
          <ToggleGroupItem value="unified" label="Unified" />
          <ToggleGroupItem value="split" label="Split" />
        </ToggleGroup>
      </div>
      {ops.length === 0 || (added === 0 && removed === 0) ? (
        <p className="m-0 px-3 py-6 text-center text-sm text-muted-foreground">No differences</p>
      ) : (
        <div role="region" aria-label={`${label}, scrollable`} tabIndex={0} className="overflow-x-auto outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-ring/50">
          <table className={cn('w-full border-collapse text-xs leading-5', view === 'split' && 'min-w-[40rem]')}>
            <caption className="sr-only">{label}: {beforeLabel} compared with {afterLabel}</caption>
            <thead className="sr-only">
              {view === 'unified' ? (
                <tr><th>Line before</th><th>Line after</th><th>Change</th><th>Text</th></tr>
              ) : (
                <tr><th>{beforeLabel} line</th><th>{beforeLabel} change</th><th>{beforeLabel} text</th><th>{afterLabel} line</th><th>{afterLabel} change</th><th>{afterLabel} text</th></tr>
              )}
            </thead>
            <tbody>
              {view === 'unified'
                ? ops.map((o, i) => (
                    <tr key={i} data-kind={o.kind}>
                      <No n={o.oldNo} kind={o.kind} />
                      <No n={o.newNo} kind={o.kind} />
                      <Cell kind={o.kind} text={o.text} />
                    </tr>
                  ))
                : rows.map((r, i) => (
                    <tr key={i}>
                      <No n={r.left?.oldNo} kind={r.left?.kind ?? 'same'} />
                      <Cell kind={r.left?.kind ?? 'same'} text={r.left?.text} />
                      <No n={r.right?.newNo} kind={r.right?.kind ?? 'same'} />
                      <Cell kind={r.right?.kind ?? 'same'} text={r.right?.text} />
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export { DiffViewer };
