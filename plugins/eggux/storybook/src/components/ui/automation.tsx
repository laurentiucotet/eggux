// EGG UI Automation page: Automation Rule (451:826), Workflow Node (451:950), Mapping Row (451:993).
// Automation Rule: 640 card (radius lg, 16 / 20 padding, 12 gap): name ui/label and how often it
// ran, a Switch named by the rule, a More menu; then the sentence "When [trigger] and [condition]
// then [action]" with each part on a muted 24 high chip (14 px icon, caption) — read as one sentence.
// Workflow Node: 260 card with shadow sm: header (24 type tile on warning / info / success, type
// caption, menu) over a border; body title ui/label and one-line detail; ports (10 px) above (not
// on triggers) and below. selected = 2 px ring; error = 1.5 px destructive border, alert icon and
// the detail in destructive saying what is missing. The title is the select button.
// Mapping Row: source field with a sample value, arrow, target Select (filled when matched),
// status: mapped (check, success), skipped (no target, muted), error (destructive Select border,
// alert; the message is read with the Select).
import * as React from 'react';
import { ArrowRight, CircleAlert, CircleCheck, Ellipsis, FileText, GitBranch, ListFilter, Minus, UserCheck, Zap } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger } from './select';
import { Switch } from './switch';

function MoreMenu({ label, children, size = 'icon-sm', className }: { label: string; children: React.ReactNode; size?: 'icon-sm' | 'icon-xs'; className?: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={size} aria-label={label} className={cn('relative z-10 shrink-0', className)}><Ellipsis aria-hidden="true" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">{children}</DropdownMenuContent>
    </DropdownMenu>
  );
}

/* Automation Rule */

export interface RulePart { label: string; icon?: React.ReactNode }
export interface AutomationRuleProps extends Omit<React.ComponentProps<'article'>, 'children'> {
  name: string;
  /** "Ran 48 times this month · last run 2 h ago". */
  meta?: string;
  trigger: RulePart;
  condition?: RulePart;
  action: RulePart;
  enabled?: boolean;
  onEnabledChange?: (enabled: boolean) => void;
  /** Dropdown Menu items: edit, duplicate, run history, delete. */
  menu?: React.ReactNode;
}

function Chip({ part, icon }: { part: RulePart; icon: React.ReactNode }) {
  return (
    <span data-slot="rule-chip" className="inline-flex max-w-60 items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-xs leading-4 text-foreground [&_svg]:size-3.5 [&_svg]:shrink-0">
      <span aria-hidden="true" className="contents">{part.icon ?? icon}</span>
      <span className="truncate">{part.label}</span>
    </span>
  );
}

function AutomationRule({ name, meta, trigger, condition, action, enabled = true, onEnabledChange, menu, className, ...props }: AutomationRuleProps) {
  const id = React.useId();
  return (
    <article data-slot="automation-rule" data-enabled={enabled} aria-labelledby={id} className={cn('flex w-full min-w-0 flex-col gap-3 rounded-xl border border-border bg-card px-5 py-4 text-card-foreground', className)} {...props}>
      <div className="flex w-full items-center gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h3 id={id} className="m-0 truncate text-sm leading-5 font-medium">{name}</h3>
          {meta ? <p className="m-0 truncate text-xs leading-4 text-muted-foreground">{meta}</p> : null}
        </div>
        <Switch aria-label={name} checked={enabled} onCheckedChange={onEnabledChange} />
        {menu ? <MoreMenu label={`More actions for ${name}`}>{menu}</MoreMenu> : null}
      </div>
      <p data-slot="rule-sentence" className="m-0 flex w-full flex-wrap items-center gap-2 text-xs leading-4 text-muted-foreground">
        <span>When</span>
        <Chip part={trigger} icon={<FileText />} />
        {condition ? <><span>and</span><Chip part={condition} icon={<ListFilter />} /></> : null}
        <span>then</span>
        <Chip part={action} icon={<UserCheck />} />
      </p>
    </article>
  );
}

/* Workflow Node */

export type WorkflowNodeType = 'trigger' | 'condition' | 'action';

export interface WorkflowNodeProps extends Omit<React.ComponentProps<'div'>, 'children' | 'onSelect' | 'title'> {
  type: WorkflowNodeType;
  title: string;
  /** One line; on error, what is missing. */
  detail?: string;
  /** Type icon; defaults: zap, git-branch, user-check. */
  icon?: React.ReactNode;
  selected?: boolean;
  error?: boolean;
  /** Click selects and opens settings in the side panel. */
  onSelect?: () => void;
  menu?: React.ReactNode;
}

const nodeType: Record<WorkflowNodeType, { label: string; tile: string; icon: React.ReactNode }> = {
  trigger: { label: 'Trigger', tile: 'bg-warning text-warning-foreground', icon: <Zap /> },
  condition: { label: 'Condition', tile: 'bg-info text-info-foreground', icon: <GitBranch /> },
  action: { label: 'Action', tile: 'bg-success text-success-foreground', icon: <UserCheck /> },
};
const port = 'absolute left-1/2 size-2.5 -translate-x-1/2 rounded-full border-[1.5px] border-border bg-card';

function WorkflowNode({ type, title, detail, icon, selected = false, error = false, onSelect, menu, className, ...props }: WorkflowNodeProps) {
  const t = nodeType[type];
  return (
    <div
      data-slot="workflow-node"
      data-type={type}
      data-state={error ? 'error' : selected ? 'selected' : 'default'}
      className={cn(
        'relative flex w-[260px] flex-col rounded-xl bg-card text-card-foreground shadow-sm',
        error ? 'border-[1.5px] border-destructive' : selected ? 'border-2 border-ring' : 'border border-border',
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <span aria-hidden="true" className={cn('flex size-6 shrink-0 items-center justify-center rounded-sm [&_svg]:size-3.5', t.tile)}>{icon ?? t.icon}</span>
        <span className="text-xs leading-4 text-muted-foreground">{t.label}</span>
        <span className="flex-1" />
        {error ? <CircleAlert aria-hidden="true" className="size-3.5 text-destructive" /> : null}
        {menu ? <MoreMenu label={`More actions for ${title}`} size="icon-xs" className="-my-0.5 size-6">{menu}</MoreMenu> : null}
      </div>
      <div className="flex flex-col gap-1 p-3">
        {onSelect ? (
          <button type="button" aria-pressed={selected} onClick={onSelect} className="cursor-pointer border-0 bg-transparent p-0 text-left text-sm leading-5 font-medium text-card-foreground outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:after:ring-[3px] focus-visible:after:ring-ring/50">
            <span className="sr-only">{t.label}: </span>{title}
          </button>
        ) : (
          <p className="m-0 text-sm leading-5 font-medium">{title}</p>
        )}
        {detail ? <p className={cn('m-0 text-xs leading-4', error ? 'text-destructive' : 'text-muted-foreground')}>{error ? <span className="sr-only">Error: </span> : null}{detail}</p> : null}
      </div>
      {type !== 'trigger' ? <span aria-hidden="true" data-slot="port-in" className={cn(port, '-top-1.5')} /> : null}
      <span aria-hidden="true" data-slot="port-out" className={cn(port, '-bottom-1.5')} />
    </div>
  );
}

/* Mapping Row */

export interface MappingRowProps extends Omit<React.ComponentProps<'div'>, 'children' | 'onChange'> {
  /** Source column or field name. */
  source: string;
  /** "e.g. 1,240.00". */
  sample?: string;
  targets: { value: string; label: string }[];
  /** Target field; empty = skipped. */
  value: string;
  onValueChange?: (value: string) => void;
  /** Type clash: "Text can't go into a number field". */
  error?: string;
}

function MappingRow({ source, sample, targets, value, onValueChange, error, className, ...props }: MappingRowProps) {
  const statusId = React.useId();
  const status = error ? 'error' : value ? 'mapped' : 'unmapped';
  return (
    <div data-slot="mapping-row" data-status={status} className={cn('flex w-full items-center gap-3 border-b border-border px-4 py-2', className)} {...props}>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="m-0 truncate text-sm leading-5 font-medium text-foreground">{source}</p>
        {sample ? <p className="m-0 truncate text-xs leading-4 text-muted-foreground">{sample}</p> : null}
      </div>
      <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <Select value={value} onValueChange={onValueChange} aria-invalid={error ? true : undefined} aria-describedby={statusId}>
          <SelectTrigger aria-label={`Target field for ${source}`} placeholder="Don't import" className="w-full" />
          <SelectContent>
            {targets.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <span className="flex size-6 shrink-0 items-center justify-center [&_svg]:size-4" title={error}>
        {status === 'mapped' ? <CircleCheck aria-hidden="true" className="text-success" /> : status === 'error' ? <CircleAlert aria-hidden="true" className="text-destructive" /> : <Minus aria-hidden="true" className="text-muted-foreground" />}
        <span id={statusId} className="sr-only">{status === 'mapped' ? 'Mapped' : status === 'error' ? `Error: ${error}` : 'Skipped'}</span>
      </span>
    </div>
  );
}

export { AutomationRule, MappingRow, WorkflowNode };
