// EGG UI Shortcut Row. Figma: Shortcut Row (Kbd page, "Shortcut Row / Component", 438:1373).
// One keyboard shortcut in the shortcuts dialog or a help page: the action (body/small) left, the
// keys (Kbd, 4 apart) right, 16 gap, 8 px vertical, a border under the row (37 high).
// A11y: rows are dt (action) / dd (keys) pairs inside ShortcutList (a <dl>); keys are <kbd> with
// spoken names for symbols. A sequence ("G then I") puts "then" between the keys.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Kbd } from './kbd';

export interface ShortcutRowProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** What it does, a verb phrase: "Open command menu". */
  action: React.ReactNode;
  /** The keys in order: ['⌘', 'K']. */
  keys: string[];
  /** Keys pressed one after another, not together. */
  sequence?: boolean;
  thenLabel?: string;
}

function ShortcutList({ className, ...props }: React.ComponentProps<'dl'>) {
  return <dl data-slot="shortcut-list" className={cn('m-0 flex min-w-0 flex-col', className)} {...props} />;
}

function ShortcutRow({ action, keys, sequence = false, thenLabel = 'then', className, ...props }: ShortcutRowProps) {
  return (
    <div data-slot="shortcut-row" className={cn('flex min-w-0 items-center gap-4 border-b border-border py-2', className)} {...props}>
      <dt className="min-w-0 flex-1 text-sm leading-5 text-foreground [overflow-wrap:anywhere]">{action}</dt>
      <dd className="m-0 flex shrink-0 items-center gap-1">
        {keys.map((k, i) => (
          <React.Fragment key={i}>
            {sequence && i > 0 ? <span className="text-xs leading-4 text-muted-foreground">{thenLabel}</span> : null}
            <Kbd>{k}</Kbd>
          </React.Fragment>
        ))}
      </dd>
    </div>
  );
}

export { ShortcutList, ShortcutRow };
