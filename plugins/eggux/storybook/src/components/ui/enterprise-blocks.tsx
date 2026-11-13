// EGG UI blocks, BLOCKS / Enterprise page (179:1207), first half: Block / Filter Builder (179:1208),
// Import Mapping (189:5652), Approval Request (181:501), Approval Inbox (849:6271), Workflow
// Builder (849:5879), Audit Log (181:923). The second half is enterprise-blocks-more.tsx.
// App blocks: they sit inside an app page (Back office look), so each one is a <section> named by
// its h2 (Section Heading or Page Header as h2); cards inside use h3. Guides: eggux build-ui/
// patterns/enterprise-apps.md, approvals.md, audit-log.md, search-and-filter.md.
// Shared layout (1200 frame): 32 padding, 24 between parts (Audit Log 16); 16 / 24 on narrow
// containers. Two-column bodies use container queries, so a block follows the column it is put in:
// Approval Request 712 + 400 (24 apart) from 1024 of container, Approval Inbox list 384 + detail,
// Workflow Builder editor + Side Panel 320. Tables keep their Figma column widths and scroll
// sideways inside their own container below that width.
import * as React from 'react';
import { ArrowRight, Calendar, ChevronDown, ChevronUp, Columns3, Download, Minus, Plus, Search, UserCheck, Users } from '@/components/icons';
import { cn } from '@/lib/utils';
import { ActionBar } from './action-bar';
import { Alert } from './alert';
import { ApprovalChain, ApprovalStep, type ApprovalStatus } from './approval-step';
import { ChangeItem } from './audit';
import { AutomationRule, WorkflowNode, type WorkflowNodeType } from './automation';
import { Avatar } from './avatar';
import { Badge, type BadgeProps } from './badge';
import { Button } from './button';
import { ButtonIcon } from './button-icon';
import { Card, CardContent, CardHeader } from './card';
import { Checkbox } from './checkbox';
import { ColumnSettings } from './column-settings';
import { DataGridFiltersButton, DataGridToolbar } from './data-grid-toolbar';
import { DescriptionList, DescriptionListItem } from './description-list';
import { Field } from './field';
import { FileItem } from './file-upload';
import { FilterCondition, FilterGroup } from './filters';
import { Input } from './input';
import { ListItem } from './list';
import { PageHeader } from './page-header';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { SearchField } from './search-field';
import { SectionHeading } from './section-heading';
import { Select, SelectContent, SelectItem, SelectTrigger } from './select';
import { SidePanel } from './side-panel';
import { Stepper } from './stepper';
import { Switch } from './switch';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from './table';
import { TableCellStack, TableCellText } from './table-cells';
import { TableCellUser } from './table-cells-rich';
import { TagInput } from './tag-input';
import { Textarea } from './textarea';
import { ToggleGroup, ToggleGroupItem } from './toggle-group';
import { Toolbar } from './toolbar';

/* Shared parts */

type SectionProps = Omit<React.ComponentProps<'section'>, 'title' | 'children'>;

export interface EnterpriseBlockProps extends SectionProps {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  /** section = Section Heading (Import, Audit, Roles, Report, Record); page = Page Header. */
  heading?: 'section' | 'page';
  /** Status Badge of a Page Header. */
  badge?: React.ReactNode;
  /** 24 between parts (16 in Audit Log). */
  gap?: 'default' | 'tight';
  children: React.ReactNode;
}

/** The frame of every enterprise block: a region named by its h2, 32 padding at full width. */
function EnterpriseBlock({ title, description, actions, heading = 'section', badge, gap = 'default', className, children, ...props }: EnterpriseBlockProps) {
  const id = React.useId();
  const titleNode = <span id={id}>{title}</span>;
  return (
    <section aria-labelledby={id} className={cn('@container w-full min-w-0 bg-background text-foreground', className)} {...props}>
      <div data-slot="enterprise-block" className={cn('flex w-full min-w-0 flex-col px-4 py-6 @3xl:p-8', gap === 'tight' ? 'gap-4' : 'gap-6')}>
        {heading === 'page' ? (
          <PageHeader as="h2" title={titleNode} description={description} actions={actions} badge={badge} />
        ) : (
          <SectionHeading level={2} title={titleNode} description={description} actions={actions} />
        )}
        {children}
      </div>
    </section>
  );
}

const live = 'sr-only';

/* Filter Builder */

export type FilterFieldType = 'set' | 'person' | 'number' | 'text' | 'date';
export interface FilterFieldDef { value: string; label: string; type: FilterFieldType; options?: { value: string; label: string }[] }
export interface FilterRule { id: string; field: string; operator: string; values: string[]; text: string; join: 'and' | 'or' }

const people = [
  { value: 'ana', label: 'Ana Popescu' },
  { value: 'mihai', label: 'Mihai Ionescu' },
  { value: 'elena', label: 'Elena Dumitru' },
  { value: 'radu', label: 'Radu Georgescu' },
];

const invoiceFields: FilterFieldDef[] = [
  { value: 'status', label: 'Status', type: 'set', options: [{ value: 'draft', label: 'Draft' }, { value: 'pending', label: 'Pending' }, { value: 'overdue', label: 'Overdue' }, { value: 'paid', label: 'Paid' }, { value: 'void', label: 'Void' }] },
  { value: 'amount', label: 'Amount', type: 'number' },
  { value: 'owner', label: 'Owner', type: 'person', options: people },
  { value: 'customer', label: 'Customer', type: 'text' },
  { value: 'due', label: 'Due date', type: 'date' },
];

const operators: Record<FilterFieldType, { value: string; label: string }[]> = {
  set: [{ value: 'any', label: 'is any of' }, { value: 'none', label: 'is none of' }],
  person: [{ value: 'is', label: 'is' }, { value: 'not', label: 'is not' }],
  number: [{ value: 'gt', label: 'is greater than' }, { value: 'lt', label: 'is less than' }, { value: 'eq', label: 'equals' }],
  text: [{ value: 'contains', label: 'contains' }, { value: 'is', label: 'is' }, { value: 'empty', label: 'is empty' }],
  date: [{ value: 'before', label: 'is before' }, { value: 'after', label: 'is after' }],
};

const ruleIsSet = (r: FilterRule) => r.operator === 'empty' || r.values.length > 0 || r.text.trim() !== '';

export interface FilterBuilderProps extends Omit<React.ComponentProps<'div'>, 'onChange'> {
  /** Plural object: "invoices". */
  noun?: string;
  fields?: FilterFieldDef[];
  defaultRules?: FilterRule[];
  /** The nested group (at most one). */
  defaultGroup?: FilterRule[];
  /** Matching rows for the number of complete conditions; the live count. */
  countFor?: (complete: number) => number;
  onApply?: (rules: FilterRule[], group: FilterRule[]) => void;
  onSaveView?: (rules: FilterRule[], group: FilterRule[]) => void;
}

const sampleRules: FilterRule[] = [
  { id: 'r1', field: 'status', operator: 'any', values: ['overdue', 'pending'], text: '', join: 'and' },
  { id: 'r2', field: 'amount', operator: 'gt', values: [], text: '€1,000', join: 'and' },
];
const sampleGroup: FilterRule[] = [
  { id: 'g1', field: 'owner', operator: 'is', values: ['ana'], text: '', join: 'and' },
  { id: 'g2', field: 'owner', operator: 'is', values: ['mihai'], text: '', join: 'or' },
];
const defaultCounts = [1284, 612, 391, 248, 160, 97, 54];

/** Figma 880 wide panel (popover from the Filters button): conditions with and / or, one nested group, live count. */
function FilterBuilder({
  noun = 'invoices',
  fields = invoiceFields,
  defaultRules = sampleRules,
  defaultGroup = sampleGroup,
  countFor = n => defaultCounts[Math.min(n, defaultCounts.length - 1)]!,
  onApply,
  onSaveView,
  className,
  ...props
}: FilterBuilderProps) {
  const [rules, setRules] = React.useState(defaultRules);
  const [group, setGroup] = React.useState<FilterRule[] | null>(defaultGroup.length ? defaultGroup : null);
  const [groupJoin, setGroupJoin] = React.useState<'and' | 'or'>('and');
  const [focusId, setFocusId] = React.useState<string | null>(null);
  const seq = React.useRef(0);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();
  const fieldOf = (v: string) => fields.find(f => f.value === v) ?? fields[0]!;
  const newRule = (join: 'and' | 'or' = 'and'): FilterRule => {
    seq.current += 1;
    const f = fields[0]!;
    return { id: `new-${seq.current}`, field: f.value, operator: operators[f.type][0]!.value, values: [], text: '', join };
  };

  // Focus the field Select of a new condition, or the Add condition button after a removal.
  React.useEffect(() => {
    if (!focusId) return;
    const root = rootRef.current;
    const target = focusId === 'add'
      ? root?.querySelector<HTMLElement>('[data-slot="filter-builder-add"]')
      : root?.querySelector<HTMLElement>(`[data-rule="${focusId}"] [role="combobox"][aria-label$=": field"]`);
    target?.focus();
    setFocusId(null);
  }, [focusId]);

  const complete = rules.filter(ruleIsSet).length + (group ? (group.some(ruleIsSet) ? 1 : 0) : 0);
  const count = countFor(complete);

  const update = (list: FilterRule[], id: string, patch: Partial<FilterRule>) => list.map(r => (r.id === id ? { ...r, ...patch } : r));
  const changeField = (r: FilterRule, field: string): Partial<FilterRule> => ({ field, operator: operators[fieldOf(field).type][0]!.value, values: [], text: '' });

  const renderRule = (r: FilterRule, i: number, list: FilterRule[], set: (next: FilterRule[]) => void, inGroup: boolean) => {
    const f = fieldOf(r.field);
    const label = inGroup ? `Group condition ${i + 1}` : `Condition ${i + 1}`;
    let control: React.ReactNode = null;
    if (f.type === 'set' || f.type === 'person') {
      control = (
        <TagInput
          options={f.options}
          value={r.values}
          onValueChange={values => set(update(list, r.id, { values }))}
          placeholder={`Choose ${f.label.toLowerCase()}`}
          label={`${label}: value`}
          listLabel={f.label}
          maxVisible={2}
          tagSize="sm"
        />
      );
    } else if (r.operator !== 'empty') {
      control = (
        <Input
          aria-label={`${label}: value`}
          type={f.type === 'date' ? 'date' : 'text'}
          inputMode={f.type === 'number' ? 'decimal' : undefined}
          placeholder={f.type === 'number' ? '€0.00' : f.type === 'text' ? `Type a ${f.label.toLowerCase()}` : undefined}
          value={r.text}
          onChange={e => set(update(list, r.id, { text: e.target.value }))}
        />
      );
    }
    const remove = () => {
      const next = list.filter(x => x.id !== r.id);
      if (inGroup && next.length === 0) setGroup(null);
      else set(next.map((x, j) => (j === 0 ? { ...x, join: 'and' } : x)));
      setFocusId('add');
    };
    return (
      <FilterCondition
        key={r.id}
        data-rule={r.id}
        label={label}
        position={i === 0 ? 'first' : 'next'}
        join={r.join}
        onJoinChange={join => set(update(list, r.id, { join }))}
        fields={fields}
        field={r.field}
        onFieldChange={v => set(update(list, r.id, changeField(r, v)))}
        operators={operators[f.type]}
        operator={r.operator}
        onOperatorChange={v => set(update(list, r.id, { operator: v }))}
        onRemove={remove}
      >
        {control}
      </FilterCondition>
    );
  };

  const setGroupRules = (next: FilterRule[]) => setGroup(next);
  return (
    <div
      ref={rootRef}
      data-slot="filter-builder"
      role="group"
      aria-labelledby={titleId}
      className={cn('flex w-full max-w-[880px] min-w-0 flex-col gap-4 rounded-lg border border-border bg-popover p-4 text-popover-foreground shadow-md', className)}
      {...props}
    >
      <div className="flex items-center gap-2">
        <h2 id={titleId} className="m-0 min-w-0 flex-1 text-sm leading-5 font-medium">Filters</h2>
        <p aria-live="polite" className="m-0 shrink-0 text-sm leading-5 text-muted-foreground">{count.toLocaleString('en')} {noun} match</p>
      </div>
      <div data-slot="filter-builder-conditions" className="flex flex-col gap-2">
        {rules.map((r, i) => renderRule(r, i, rules, setRules, false))}
        {group ? (
          <div data-slot="filter-builder-group-row" className="flex w-full items-start gap-2">
            <div className="flex h-9 w-[88px] shrink-0 items-center">
              {rules.length ? (
                <Select value={groupJoin} onValueChange={v => setGroupJoin(v as 'and' | 'or')}>
                  <SelectTrigger aria-label="Group: and or or" className="w-full" />
                  <SelectContent><SelectItem value="and">and</SelectItem><SelectItem value="or">or</SelectItem></SelectContent>
                </Select>
              ) : <span className="text-sm leading-5 text-[var(--input-filled-muted-foreground)]">Where</span>}
            </div>
            <FilterGroup
              aria-label="Condition group"
              role="group"
              addLabel="Add condition to group"
              className="min-w-0 flex-1"
              onAdd={() => { const r = newRule('or'); setGroup([...(group ?? []), r]); setFocusId(r.id); }}
            >
              {group.map((r, i) => renderRule(r, i, group, setGroupRules, true))}
            </FilterGroup>
          </div>
        ) : null}
        {!rules.length && !group ? <p className="m-0 py-2 text-sm leading-5 text-muted-foreground">No conditions. Every {noun.replace(/s$/, '')} is shown.</p> : null}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Button data-slot="filter-builder-add" variant="ghost" size="sm" leadingIcon={<Plus aria-hidden="true" />} onClick={() => { const r = newRule(); setRules([...rules, r]); setFocusId(r.id); }}>Add condition</Button>
          {!group ? (
            <Button variant="ghost" size="sm" leadingIcon={<Plus aria-hidden="true" />} onClick={() => { const r = newRule(); setGroup([r]); setFocusId(r.id); }}>Add group</Button>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" disabled={!rules.length && !group} onClick={() => { setRules([]); setGroup(null); setFocusId('add'); }}>Clear all</Button>
          <Button variant="outline" size="sm" onClick={() => onSaveView?.(rules, group ?? [])}>Save as view</Button>
          <Button size="sm" onClick={() => onApply?.(rules, group ?? [])}>Apply</Button>
        </div>
      </div>
    </div>
  );
}

/* Import Mapping */

export interface ImportColumn {
  source: string;
  sample: string;
  /** Target field value; '' = needs a field; 'skip' = skipped. */
  target: string;
  /** Rows with a value the field refuses. */
  invalid?: number;
}

const importTargets = [
  { value: 'company', label: 'Company name' },
  { value: 'legal', label: 'Legal name' },
  { value: 'email', label: 'Billing email' },
  { value: 'vat', label: 'VAT ID' },
  { value: 'country', label: 'Country' },
  { value: 'terms', label: 'Payment terms' },
  { value: 'owner', label: 'Account owner' },
  { value: 'segment', label: 'Customer segment' },
  { value: 'description', label: 'Description' },
  { value: 'phone', label: 'Phone' },
  { value: 'skip', label: 'Skip this column' },
];

const sampleColumns: ImportColumn[] = [
  { source: 'Company', sample: 'Northwind Traders, Kestrel', target: 'company' },
  { source: 'Contact email', sample: 'ap@northwind.com', target: 'email' },
  { source: 'VAT', sample: 'RO12345678, RO-98…', target: 'vat', invalid: 12 },
  { source: 'Country', sample: 'Romania, Germany', target: 'country' },
  { source: 'Terms', sample: '30, 45, 60', target: 'terms' },
  { source: 'Owner', sample: 'ana@acme.com', target: 'owner' },
  { source: 'Segment', sample: 'Enterprise, SMB', target: '' },
  { source: 'Notes', sample: 'Prefers email…', target: 'description' },
  { source: 'Internal ID', sample: '10023, 10024', target: 'skip' },
];

export interface ImportMappingProps extends Omit<SectionProps, 'onChange'> {
  title?: string;
  fileName?: string;
  rows?: number;
  columns?: ImportColumn[];
  /** Name of the product's fields column: "Field in Acme". */
  product?: string;
  onBack?: () => void;
  /** Called only when every column has a field or Skip. */
  onContinue?: (mapping: Record<string, string>, saveTemplate: boolean) => void;
}

function statusOf(c: ImportColumn): { label: string; variant: NonNullable<BadgeProps['variant']> } {
  if (!c.target) return { label: 'Needs a field', variant: 'soft-warning' };
  if (c.target === 'skip') return { label: 'Skipped', variant: 'soft-neutral' };
  if (c.invalid) return { label: `${c.invalid} invalid`, variant: 'soft-warning' };
  return { label: 'Matched', variant: 'soft-success' };
}

/** Map columns step of an import: one row per file column, sample values, the target Select and a status. */
function ImportMapping({
  title = 'Import customers',
  fileName = 'customers-oct-2026.csv',
  rows = 1284,
  columns: initial = sampleColumns,
  product = 'Acme',
  onBack,
  onContinue,
  ...props
}: ImportMappingProps) {
  const [columns, setColumns] = React.useState(initial);
  const [template, setTemplate] = React.useState(true);
  const [message, setMessage] = React.useState('');
  const tableRef = React.useRef<HTMLDivElement>(null);
  const auto = initial.filter(c => c.target && c.target !== 'skip').length;
  const invalid = columns.filter(c => c.target && c.target !== 'skip' && c.invalid);
  const missing = columns.filter(c => !c.target);
  const label = (v: string) => importTargets.find(t => t.value === v)?.label ?? v;

  const setTarget = (source: string, target: string) => {
    setColumns(cs => cs.map(c => (c.source === source ? { ...c, target, invalid: target === initial.find(i => i.source === source)?.target ? initial.find(i => i.source === source)?.invalid : undefined } : c)));
    setMessage('');
  };
  const proceed = () => {
    if (missing.length) {
      setMessage(`Choose a field or Skip this column for ${missing.map(m => m.source).join(', ')}.`);
      tableRef.current?.querySelector<HTMLElement>(`[aria-label="${product} field for ${missing[0]!.source}"]`)?.focus();
      return;
    }
    onContinue?.(Object.fromEntries(columns.map(c => [c.source, c.target])), template);
  };

  return (
    <EnterpriseBlock
      title={title}
      description={`${fileName} · ${rows.toLocaleString('en')} rows · ${columns.length} columns. We matched ${auto} columns automatically.`}
      {...props}
    >
      <Stepper
        aria-label="Import steps"
        current={1}
        steps={[{ id: 'upload', title: 'Upload' }, { id: 'map', title: 'Map columns' }, { id: 'review', title: 'Review' }, { id: 'import', title: 'Import' }]}
        onStepClick={i => (i === 0 ? onBack?.() : undefined)}
      />
      <div ref={tableRef} className="min-w-0 overflow-hidden rounded-lg border border-border">
        <Table className="min-w-[880px]">
          <caption className="sr-only">Columns in {fileName} and the {product} field each one goes into</caption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[265px]">Column in file</TableHead>
              <TableHead className="w-[378px]">Sample values</TableHead>
              <TableHead className="w-12"><span className="sr-only">Goes into</span></TableHead>
              <TableHead className="w-[303px]">Field in {product}</TableHead>
              <TableHead className="w-[140px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {columns.map(c => {
              const s = statusOf(c);
              const attention = !c.target || (c.target !== 'skip' && !!c.invalid);
              return (
                <TableRow key={c.source} data-source={c.source} selected={attention}>
                  <TableCell><TableCellText>{c.source}</TableCellText></TableCell>
                  <TableCell><TableCellText textStyle="muted">{c.sample}</TableCellText></TableCell>
                  <TableCell><ArrowRight aria-hidden="true" className="size-4 text-muted-foreground" /></TableCell>
                  <TableCell>
                    <Select value={c.target} onValueChange={v => setTarget(c.source, v)} aria-invalid={!c.target ? true : undefined}>
                      <SelectTrigger aria-label={`${product} field for ${c.source}`} placeholder="Choose a field" className="w-full" />
                      <SelectContent>{importTargets.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell><Badge variant={s.variant} data-slot="mapping-status">{s.label}</Badge></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      {invalid.length ? (
        <Alert
          variant="warning"
          title={invalid.map(c => `${c.invalid} rows have an invalid ${label(c.target)}`).join('. ')}
          description={`Import them and fix later from the list (they get a "Needs review" tag), or skip them. Download the ${invalid[0]!.invalid} rows as CSV to fix them in the source.`}
        />
      ) : null}
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
        <Checkbox label="Save this mapping as a template for next imports" checked={template} onCheckedChange={c => setTemplate(c === true)} />
        <ActionBar align="end" className="w-auto">
          <Button variant="outline" onClick={onBack}>Back</Button>
          <Button onClick={proceed}>Continue to review</Button>
        </ActionBar>
      </div>
      <p role="alert" className={cn('m-0 text-sm leading-5 text-destructive', !message && 'sr-only')}>{message}</p>
    </EnterpriseBlock>
  );
}

/* Approval chain, shared by Approval Request and Approval Inbox */

export interface ApprovalStepData {
  name: string;
  role?: string;
  status: ApprovalStatus;
  time?: string;
  comment?: string;
  statusLabel?: string;
  /** The person looking at the screen. */
  you?: boolean;
}

export type Decision = 'approve' | 'reject';

function decide(steps: ApprovalStepData[], decision: Decision, comment: string): ApprovalStepData[] {
  const i = steps.findIndex(s => s.you && s.status === 'current');
  if (i < 0) return steps;
  return steps.map((s, j) => {
    if (j === i) return { ...s, status: decision === 'approve' ? 'approved' : 'rejected', time: 'Just now', comment: comment || undefined, statusLabel: undefined };
    if (decision === 'approve' && j === i + 1) return { ...s, status: 'current', statusLabel: `Waiting for ${s.name}`, time: 'Assigned just now · due in 2 days' };
    if (decision === 'reject' && j > i) return { ...s, statusLabel: 'Not needed' };
    return s;
  });
}

function Chain({ steps }: { steps: ApprovalStepData[] }) {
  return (
    <ApprovalChain aria-label="Approval chain">
      {steps.map(s => <ApprovalStep key={s.name} name={s.name} role={s.role} status={s.status} time={s.time} comment={s.comment} statusLabel={s.statusLabel} />)}
    </ApprovalChain>
  );
}

/* Approval Request */

export interface LineItem { item: string; qty: number; total: string }
export interface Attachment { name: string; size: string }

export interface ApprovalRequestProps extends SectionProps {
  title?: string;
  submitted?: string;
  details?: [string, React.ReactNode][];
  lineItems?: LineItem[];
  total?: string;
  attachments?: Attachment[];
  /** The rule that built the chain: "Over €15,000 needs a director". */
  chainRule?: string;
  steps?: ApprovalStepData[];
  /** Reject always has a comment; Approve may have one. */
  onDecision?: (decision: Decision, comment: string) => void;
  onDelegate?: () => void;
}

const prDetails: [string, React.ReactNode][] = [
  ['Vendor', 'Cloudline Hosting'],
  ['Amount', '€18,400.00 per year'],
  ['Cost center', 'ENG-204 · Platform'],
  ['Budget left', '€42,000 of €120,000'],
  ['Needed by', '15 Nov 2026'],
  ['Justification', 'Annual renewal of production hosting. Price is 6% lower than last year after negotiation.'],
];
const prSteps: ApprovalStepData[] = [
  { name: 'Mihai Ionescu', role: 'Engineering manager', status: 'approved', time: '20 Oct 2026, 16:05', comment: 'Needed for the platform roadmap.' },
  { name: 'Elena Dumitru (you)', role: 'Finance manager · approves over €10,000', status: 'current', time: 'Assigned 2 h ago · due tomorrow', you: true },
  { name: 'Ana Popescu', role: 'Director · approves over €15,000', status: 'upcoming', time: 'After Finance' },
];

function DecisionResult({ decision, steps, requester }: { decision: Decision; steps: ApprovalStepData[]; requester: string }) {
  const next = steps.find(s => s.status === 'current');
  return (
    <p role="status" className="m-0 text-sm leading-5 text-foreground">
      {decision === 'approve'
        ? `You approved this request.${next ? ` ${next.name} is next.` : ' It is fully approved.'}`
        : `You rejected this request. ${requester} was notified with your comment.`}
    </p>
  );
}

/** One request with its details, line items, attachments, the approval chain and the decision box. */
function ApprovalRequest({
  title = 'Purchase request PR-2041',
  submitted = 'Submitted by Radu Georgescu on 20 Oct 2026 · Engineering',
  details = prDetails,
  lineItems = [
    { item: 'Production cluster, 12 months', qty: 1, total: '€14,200.00' },
    { item: 'Managed backups', qty: 1, total: '€2,600.00' },
    { item: 'Premium support', qty: 1, total: '€1,600.00' },
  ],
  total = '€18,400.00',
  attachments: initialFiles = [{ name: 'quote-cloudline-2026.pdf', size: '2.4 MB' }, { name: 'security-review.pdf', size: '2.4 MB' }],
  chainRule = 'Over €15,000 needs a director',
  steps: initialSteps = prSteps,
  onDecision,
  onDelegate,
  ...props
}: ApprovalRequestProps) {
  const [steps, setSteps] = React.useState(initialSteps);
  const [decision, setDecision] = React.useState<Decision | null>(null);
  const [comment, setComment] = React.useState('');
  const [error, setError] = React.useState('');
  const [files, setFiles] = React.useState(initialFiles);
  const commentRef = React.useRef<HTMLTextAreaElement>(null);
  const requester = /by (.+?) on/.exec(submitted)?.[1] ?? 'The requester';

  const act = (d: Decision) => {
    if (d === 'reject' && !comment.trim()) {
      setError('Add a comment to reject: say what to change.');
      commentRef.current?.focus();
      return;
    }
    setSteps(s => decide(s, d, comment.trim()));
    setDecision(d);
    setError('');
    onDecision?.(d, comment.trim());
  };
  const status = decision === 'reject' ? <Badge variant="destructive">Rejected</Badge> : <Badge variant="warning">Pending approval</Badge>;

  return (
    <EnterpriseBlock
      heading="page"
      title={title}
      badge={status}
      description={submitted}
      actions={decision ? undefined : (
        <>
          <Button variant="ghost" leadingIcon={<UserCheck aria-hidden="true" />} onClick={onDelegate}>Delegate</Button>
          <Button variant="outline" onClick={() => act('reject')}>Reject</Button>
          <Button onClick={() => act('approve')}>Approve</Button>
        </>
      )}
      {...props}
    >
      <div data-slot="approval-body" className="grid grid-cols-1 items-start gap-6 @4xl:grid-cols-[minmax(0,1fr)_400px]">
        <div data-slot="approval-main" className="flex min-w-0 flex-col gap-6">
          <Card>
            <CardHeader title="Details" />
            <CardContent>
              <DescriptionList>
                {details.map(([k, v]) => <DescriptionListItem key={k} label={k}>{v}</DescriptionListItem>)}
              </DescriptionList>
            </CardContent>
          </Card>
          <Card>
            <CardHeader title="Line items" />
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="w-16 text-right">Qty</TableHead>
                    <TableHead className="w-32 text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lineItems.map(l => (
                    <TableRow key={l.item}>
                      <TableCell>{l.item}</TableCell>
                      <TableCell className="text-right tabular-nums">{l.qty}</TableCell>
                      <TableCell className="text-right tabular-nums">{l.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell type="footer" colSpan={2} className="font-medium">Total</TableCell>
                    <TableCell type="footer" className="text-right font-medium tabular-nums">{total}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader title="Attachments" />
            <CardContent>
              {files.length ? (
                <ul aria-label="Attachments" className="m-0 flex flex-col gap-3 p-0">
                  {files.map(f => <FileItem key={f.name} name={f.name} size={`${f.size} · Uploaded`} onRemove={() => setFiles(fs => fs.filter(x => x.name !== f.name))} />)}
                </ul>
              ) : <p className="m-0 text-sm leading-5 text-muted-foreground">No attachments.</p>}
            </CardContent>
          </Card>
        </div>
        <div data-slot="approval-aside" className="flex min-w-0 flex-col gap-6">
          <Card>
            <CardHeader title="Approval chain" description={chainRule} />
            <CardContent><Chain steps={steps} /></CardContent>
          </Card>
          <Card>
            <CardHeader title="Your decision" />
            <CardContent>
              {decision ? (
                <DecisionResult decision={decision} steps={steps} requester={requester} />
              ) : (
                <>
                  <Field label="Comment" hint={error ? undefined : 'Required to reject, optional to approve.'} error={error || undefined}>
                    <Textarea ref={commentRef} rows={2} placeholder="Add a comment (required to reject)" value={comment} onChange={e => { setComment(e.target.value); if (error) setError(''); }} />
                  </Field>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => act('reject')}>Reject</Button>
                    <Button onClick={() => act('approve')}>Approve</Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </EnterpriseBlock>
  );
}

/* Approval Inbox */

export interface InboxRequest {
  id: string;
  title: string;
  requester: string;
  /** "€18,400.00 per year", "Procurement". */
  meta: string;
  age: string;
  flag?: 'due' | 'overdue';
  status: 'waiting' | 'approved' | 'rejected';
  submitted: string;
  details: [string, string][];
  chainRule?: string;
  steps: ApprovalStepData[];
}

const you = (role: string, time = 'Assigned today · due in 2 days'): ApprovalStepData => ({ name: 'Elena Dumitru (you)', role, status: 'current', time, you: true });
const managerOk = (name: string, time: string): ApprovalStepData => ({ name, role: 'Team manager', status: 'approved', time });
function simple(id: string, title: string, requester: string, meta: string, age: string, type: string, extra: [string, string][], flag?: InboxRequest['flag'], status: InboxRequest['status'] = 'waiting'): InboxRequest {
  return {
    id, title, requester, meta, age, flag, status,
    submitted: `Submitted by ${requester} ${age === 'Yesterday' ? 'yesterday' : `${age} ago`}`,
    details: [['Type', type], ['Requested by', requester], ...extra],
    steps: [managerOk('Mihai Ionescu', '2 days ago'), you('Finance manager')],
  };
}

const inboxRequests: InboxRequest[] = [
  {
    id: 'PR-2041', title: 'Purchase request PR-2041', requester: 'Radu Georgescu', meta: '€18,400.00 per year', age: '2 h', flag: 'due', status: 'waiting',
    submitted: 'Submitted by Radu Georgescu on 20 Oct 2026 · Engineering',
    details: prDetails.map(([k, v]) => [k, String(v)]), chainRule: 'Over €15,000 needs a director', steps: prSteps,
  },
  simple('TE-3307', 'Travel expense TE-3307', 'Ioana Marin', '€842.50', '5 h', 'Travel expense', [['Amount', '€842.50'], ['Trip', 'Customer visit, Berlin, 14 to 16 Oct']]),
  simple('SO-118', 'Supplier onboarding: Northwind Ltd', 'Daniel Weber', 'Procurement', 'Yesterday', 'Supplier onboarding', [['Supplier', 'Northwind Ltd'], ['Checks', 'VAT validated · bank details verified']]),
  simple('PR-2038', 'Software renewal PR-2038', 'Mark Peters', '€3,600.00 per year', '2 days', 'Purchase request', [['Amount', '€3,600.00 per year'], ['Vendor', 'Acme Analytics']]),
  simple('CC-12', 'Contract change MSA v12', 'Ana Popescu', 'Legal', '3 days', 'Contract change', [['Contract', 'Master services agreement, Northwind Ltd'], ['Change', 'Payment in 30 days instead of 45']]),
  simple('BI-4', 'Budget increase Q4 Marketing', 'Elena Varga', '€20,000.00', '4 days', 'Budget change', [['Amount', '€20,000.00'], ['Cost center', 'MKT-110 · Campaigns']], 'overdue'),
  simple('AR-77', 'Access request: Finance reports', 'Tom Becker', 'Read only', '5 days', 'Access request', [['Access', 'Finance reports, read only'], ['Until', '31 Dec 2026']]),
  simple('PR-2033', 'Purchase request PR-2033', 'Sofia Rossi', '€1,250.00', '6 days', 'Purchase request', [['Amount', '€1,250.00'], ['Vendor', 'Office Supplies SRL']]),
  simple('TO-55', 'Time off: 3 to 7 Nov', 'Andrei Ionescu', '5 days', '1 week', 'Time off', [['Dates', '3 to 7 Nov 2026'], ['Balance after', '9 days']]),
  simple('TE-3291', 'Travel expense TE-3291', 'Lena Fischer', '€316.20', '1 week', 'Travel expense', [['Amount', '€316.20'], ['Trip', 'Training, Vienna, 2 Oct']]),
  simple('PR-2029', 'Purchase request PR-2029', 'Mark Peters', '€640.00', '2 weeks', 'Purchase request', [['Amount', '€640.00'], ['Vendor', 'Cloudline Hosting']]),
  simple('TE-3280', 'Travel expense TE-3280', 'Ioana Marin', '€129.90', '2 weeks', 'Travel expense', [['Amount', '€129.90'], ['Trip', 'Workshop, Cluj, 28 Sep']]),
  simple('PR-2020', 'Purchase request PR-2020', 'Radu Georgescu', '€2,100.00', '3 weeks', 'Purchase request', [['Amount', '€2,100.00'], ['Vendor', 'Kestrel Devices']], undefined, 'approved'),
  simple('TE-3250', 'Travel expense TE-3250', 'Tom Becker', '€1,980.00', '1 month', 'Travel expense', [['Amount', '€1,980.00'], ['Trip', 'Conference, Lisbon']], undefined, 'rejected'),
];

const initialsOf = (name: string) => name.replace(/\(.*\)/, '').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]!.toUpperCase()).join('');

export interface ApprovalInboxProps extends SectionProps {
  title?: string;
  description?: string;
  requests?: InboxRequest[];
  /** Rows before "Show N more". */
  pageSize?: number;
  onDecision?: (id: string, decision: Decision, comment: string) => void;
  onDelegateAway?: () => void;
  onExport?: () => void;
}

/** Approver queue: requests oldest first on the left (384), the open request on the right. */
function ApprovalInbox({
  title = 'Approvals',
  description = 'Requests waiting for your decision, oldest first. Approvals over €10,000 need a comment.',
  requests: initial = inboxRequests,
  pageSize = 10,
  onDecision,
  onDelegateAway,
  onExport,
  ...props
}: ApprovalInboxProps) {
  const [requests, setRequests] = React.useState(initial);
  const [tab, setTab] = React.useState<InboxRequest['status']>('waiting');
  const [query, setQuery] = React.useState('');
  const [all, setAll] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState(initial.find(r => r.status === 'waiting')?.id ?? initial[0]?.id);
  const [rejecting, setRejecting] = React.useState(false);
  const [comment, setComment] = React.useState('');
  const [error, setError] = React.useState('');
  const [announce, setAnnounce] = React.useState('');
  const q = query.trim().toLowerCase();
  const inTab = requests.filter(r => r.status === tab);
  const shown = inTab.filter(r => !q || `${r.title} ${r.requester} ${r.meta}`.toLowerCase().includes(q));
  const visible = all || q ? shown : shown.slice(0, pageSize);
  const selected = requests.find(r => r.id === selectedId);
  const waiting = requests.filter(r => r.status === 'waiting').length;

  const act = (d: Decision) => {
    if (!selected) return;
    if (d === 'reject' && !comment.trim()) { setError('Add a reason: the requester sees it.'); return; }
    const nextWaiting = requests.filter(r => r.status === 'waiting' && r.id !== selected.id);
    setRequests(rs => rs.map(r => (r.id === selected.id ? { ...r, status: d === 'approve' ? 'approved' : 'rejected', steps: decide(r.steps, d, comment.trim()) } : r)));
    onDecision?.(selected.id, d, comment.trim());
    setAnnounce(`${d === 'approve' ? 'Approved' : 'Rejected'} ${selected.title}. ${nextWaiting.length} requests waiting.`);
    setRejecting(false);
    setComment('');
    setError('');
    if (tab === 'waiting') setSelectedId(nextWaiting[0]?.id);
  };

  return (
    <EnterpriseBlock
      heading="page"
      title={title}
      description={description}
      actions={(
        <>
          <Button variant="outline" leadingIcon={<Users aria-hidden="true" />} onClick={onDelegateAway}>Delegate while away</Button>
          <Button variant="outline" leadingIcon={<Download aria-hidden="true" />} onClick={onExport}>Export</Button>
        </>
      )}
      {...props}
    >
      <div data-slot="inbox-split" className="grid min-w-0 grid-cols-1 overflow-hidden rounded-lg border border-border @4xl:grid-cols-[384px_minmax(0,1fr)]">
        <div data-slot="inbox-list" className="flex min-w-0 flex-col border-b border-border @4xl:border-r @4xl:border-b-0">
          <div className="flex flex-col gap-3 p-4">
            <SearchField placeholder="Search requests" value={query} onValueChange={setQuery} showShortcut={false} debounce={0} className="w-full" />
            <ToggleGroup type="single" variant="segmented" aria-label="Requests by status" value={tab} onValueChange={v => { if (v) { setTab(v as InboxRequest['status']); setAll(false); } }} className="self-start">
              <ToggleGroupItem value="waiting" label={`Waiting (${waiting})`} />
              <ToggleGroupItem value="approved" label="Approved" />
              <ToggleGroupItem value="rejected" label="Rejected" />
            </ToggleGroup>
          </div>
          <ul aria-label="Requests" className="m-0 flex flex-col p-0">
            {visible.map(r => (
              <ListItem
                key={r.id}
                data-request={r.id}
                divider
                title={r.title}
                description={`${r.requester} · ${r.meta}`}
                leading={<Avatar initials={initialsOf(r.requester)} />}
                selected={r.id === selectedId}
                onSelect={() => { setSelectedId(r.id); setRejecting(false); setError(''); }}
                trailing={(
                  <span className="flex flex-col items-end gap-1">
                    <span className={cn('text-xs leading-4 whitespace-nowrap', r.id === selectedId ? 'text-[var(--input-filled-muted-foreground)]' : 'text-muted-foreground')}>{r.age}</span>
                    {r.flag && r.status === 'waiting' ? <Badge variant={r.flag === 'due' ? 'soft-warning' : 'soft-destructive'}>{r.flag === 'due' ? 'Due tomorrow' : 'Overdue'}</Badge> : null}
                  </span>
                )}
              />
            ))}
          </ul>
          {!shown.length ? <p className="m-0 p-4 text-sm leading-5 text-muted-foreground">{q ? `No requests match “${query}”.` : 'Nothing here.'}</p> : null}
          {!all && !q && shown.length > pageSize ? (
            <div className="flex justify-center p-3">
              <Button variant="ghost" size="sm" onClick={() => setAll(true)}>Show {shown.length - pageSize} more</Button>
            </div>
          ) : null}
          <p aria-live="polite" className={live}>{announce || (q ? `${shown.length} requests found` : '')}</p>
        </div>
        <div data-slot="inbox-detail" className="flex min-w-0 flex-col gap-6 p-4 @3xl:p-6">
          {selected ? (
            <>
              <PageHeader
                as="h3"
                title={selected.title}
                badge={selected.status === 'waiting' ? <Badge variant="warning">Pending approval</Badge> : selected.status === 'approved' ? <Badge variant="soft-success">Approved</Badge> : <Badge variant="soft-destructive">Rejected</Badge>}
                description={selected.submitted}
                actions={selected.status === 'waiting' ? (
                  <>
                    <Button variant="outline" aria-expanded={rejecting} onClick={() => setRejecting(true)}>Reject</Button>
                    <Button onClick={() => act('approve')}>Approve</Button>
                  </>
                ) : undefined}
              />
              {rejecting && selected.status === 'waiting' ? (
                <div data-slot="inbox-reject" className="flex flex-col gap-3 rounded-lg border border-border p-4">
                  <Field label="Reason for rejecting" error={error || undefined}>
                    <Textarea autoFocus rows={2} value={comment} onChange={e => { setComment(e.target.value); setError(''); }} placeholder="Say what to change so it can be approved" />
                  </Field>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => { setRejecting(false); setError(''); }}>Cancel</Button>
                    <Button variant="destructive" onClick={() => act('reject')}>Reject request</Button>
                  </div>
                </div>
              ) : null}
              <Card>
                <CardHeader titleAs="h4" title="Details" />
                <CardContent>
                  <DescriptionList>{selected.details.map(([k, v]) => <DescriptionListItem key={k} label={k}>{v}</DescriptionListItem>)}</DescriptionList>
                </CardContent>
              </Card>
              <Card>
                <CardHeader titleAs="h4" title="Approval chain" description={selected.chainRule} />
                <CardContent><Chain steps={selected.steps} /></CardContent>
              </Card>
            </>
          ) : (
            <p className="m-0 text-sm leading-5 text-muted-foreground">Select a request to see it here. Nothing is waiting for you.</p>
          )}
        </div>
      </div>
    </EnterpriseBlock>
  );
}

/* Workflow Builder */

export interface FlowStep {
  id: string;
  type: WorkflowNodeType;
  title: string;
  detail: string;
  error?: boolean;
  /** Approval steps have approver settings. */
  approval?: { approver: string; due: string; escalate: string; requireComment: boolean };
}

const flowSteps: FlowStep[] = [
  { id: 'trigger', type: 'trigger', title: 'Invoice received', detail: 'From the supplier inbox or an upload' },
  { id: 'check', type: 'condition', title: 'Amount over €5,000?', detail: 'Invoice total including VAT' },
  { id: 'ask', type: 'action', title: 'Ask for approval', detail: 'Finance lead, due in 2 business days', approval: { approver: 'mark', due: '2', escalate: 'cfo', requireComment: true } },
  { id: 'auto', type: 'action', title: 'Approve automatically', detail: 'Mark as approved and log it' },
  { id: 'post', type: 'action', title: 'Post to #finance', detail: 'Slack channel not found. Reconnect Slack.', error: true },
];

const approvers = [{ value: 'mark', label: 'Finance lead (Mark Peters)' }, { value: 'ioana', label: 'Controller (Ioana Marin)' }, { value: 'sarah', label: 'CFO (Sarah Lindqvist)' }];
const dueOptions = [{ value: '1', label: '1 business day' }, { value: '2', label: '2 business days' }, { value: '5', label: '5 business days' }];
const escalations = [{ value: 'cfo', label: 'Escalate to the CFO', hint: 'Sarah Lindqvist gets the request after the due date.' }, { value: 'remind', label: 'Remind every day', hint: 'The approver gets a reminder each morning at 09:00.' }, { value: 'auto', label: 'Approve automatically', hint: 'The step is approved and the decision is logged as automatic.' }];

function SelectField({ label, value, onValueChange, options, hint }: { label: string; value: string; onValueChange: (v: string) => void; options: { value: string; label: string }[]; hint?: string }) {
  return (
    <Field label={label} hint={hint}>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full" />
        <SelectContent>{options.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
      </Select>
    </Field>
  );
}

export interface WorkflowBuilderProps extends SectionProps {
  title?: string;
  description?: string;
  steps?: FlowStep[];
  defaultSelected?: string;
  onSave?: (step: FlowStep) => void;
  onDeleteStep?: (id: string) => void;
  onTestRun?: () => void;
  onPublish?: () => void;
  onAddStep?: () => void;
}

const vLine = 'mx-auto h-6 w-px bg-border';

/** Approval flow editor: the flow on a canvas, rules under it, the selected step's settings in a Side Panel (320). */
function WorkflowBuilder({
  title = 'Invoice approval',
  description = 'Runs on every supplier invoice. Last published by Ana Popescu on 22 Oct 2026.',
  steps: initial = flowSteps,
  defaultSelected = 'ask',
  onSave,
  onDeleteStep,
  onTestRun,
  onPublish,
  onAddStep,
  ...props
}: WorkflowBuilderProps) {
  const [steps, setSteps] = React.useState(initial);
  const [selectedId, setSelectedId] = React.useState(defaultSelected);
  const [draft, setDraft] = React.useState<FlowStep | undefined>(initial.find(s => s.id === defaultSelected));
  const [zoom, setZoom] = React.useState(100);
  const [saved, setSaved] = React.useState('Draft saved 2 minutes ago.');
  const [rules, setRules] = React.useState({ remind: true, duplicates: false });
  const byId = (id: string) => steps.find(s => s.id === id)!;
  const select = (id: string) => { setSelectedId(id); setDraft(steps.find(s => s.id === id)); };
  const node = (id: string) => {
    const s = byId(id);
    return <WorkflowNode type={s.type} title={s.title} detail={s.detail} error={s.error} selected={s.id === selectedId} onSelect={() => select(s.id)} />;
  };
  const save = () => {
    if (!draft) return;
    const detail = draft.approval
      ? `${approvers.find(a => a.value === draft.approval!.approver)?.label.replace(/ \(.*\)/, '')}, due in ${dueOptions.find(d => d.value === draft.approval!.due)?.label}`
      : draft.detail;
    const next = { ...draft, detail };
    setSteps(ss => ss.map(s => (s.id === next.id ? next : s)));
    setDraft(next);
    setSaved('Draft saved just now.');
    onSave?.(next);
  };
  const a = draft?.approval;
  const setA = (patch: Partial<NonNullable<FlowStep['approval']>>) => setDraft(d => (d && d.approval ? { ...d, approval: { ...d.approval, ...patch } } : d));
  const yes = steps.find(s => s.id === 'ask');
  const no = steps.find(s => s.id === 'auto');

  return (
    <EnterpriseBlock
      heading="page"
      title={title}
      description={description}
      actions={(
        <>
          <Badge variant="soft-success">Active</Badge>
          <Button variant="outline" onClick={onTestRun}>Test run</Button>
          <Button onClick={onPublish}>Publish</Button>
        </>
      )}
      {...props}
    >
      <div data-slot="workflow-body" className="grid grid-cols-1 items-start gap-6 @5xl:grid-cols-[minmax(0,1fr)_320px]">
        <div data-slot="workflow-editor" className="flex min-w-0 flex-col gap-6">
          <div data-slot="workflow-canvas" className="flex min-w-0 flex-col gap-4 rounded-lg border border-border bg-muted p-4 @3xl:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p aria-live="polite" className="m-0 text-sm leading-5 text-foreground">{saved} Select a step to edit it.</p>
              <Toolbar aria-label="Zoom" toolbarStyle="floating">
                <ButtonIcon variant="ghost" size="sm" icon={<Minus />} label="Zoom out" disabled={zoom <= 50} onClick={() => setZoom(z => Math.max(50, z - 10))} />
                <output aria-label="Zoom level" className="w-12 text-center text-sm leading-5 tabular-nums">{zoom}%</output>
                <ButtonIcon variant="ghost" size="sm" icon={<Plus />} label="Zoom in" disabled={zoom >= 150} onClick={() => setZoom(z => Math.min(150, z + 10))} />
              </Toolbar>
            </div>
            <div className="min-w-0 overflow-auto">
              <ol aria-label="Workflow steps" data-slot="workflow-flow" className="m-0 flex w-max min-w-full origin-top list-none flex-col items-center p-0 pt-4" style={{ zoom: zoom / 100 }}>
                <li>{node('trigger')}</li>
                <li aria-hidden="true" className={vLine} />
                <li>{node('check')}</li>
                <li aria-hidden="true" className={vLine} />
                <li className="flex flex-col items-center">
                  <div aria-hidden="true" className="relative h-7 w-[288px] rounded-t-md border-x border-t border-border">
                    <Badge variant="soft-info" className="absolute top-2 left-0 -translate-x-1/2">Yes</Badge>
                    <Badge variant="soft-neutral" className="absolute top-2 right-0 translate-x-1/2">No</Badge>
                  </div>
                  <ul aria-label="Branches of Amount over €5,000?" className="m-0 flex list-none gap-7 p-0">
                    {yes ? <li aria-label={`Yes: ${yes.title}`}>{node('ask')}</li> : null}
                    {no ? <li aria-label={`No: ${no.title}`}>{node('auto')}</li> : null}
                  </ul>
                  <div aria-hidden="true" className="h-6 w-[288px] rounded-b-md border-x border-b border-border" />
                </li>
                <li aria-hidden="true" className={vLine} />
                <li>{node('post')}</li>
                <li aria-hidden="true" className={vLine} />
                <li><ButtonIcon variant="outline" icon={<Plus />} label="Add a step" className="rounded-full" onClick={onAddStep} /></li>
              </ol>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="m-0 text-sm leading-5 font-medium">Rules in this workflow</h3>
            <AutomationRule
              name="Remind approvers"
              meta="Runs daily at 09:00 · 4 reminders sent today"
              trigger={{ label: 'Approval waits 2 days' }}
              condition={{ label: 'Amount > EUR 5,000' }}
              action={{ label: 'Email the approver' }}
              enabled={rules.remind}
              onEnabledChange={v => setRules(r => ({ ...r, remind: v }))}
            />
            <AutomationRule
              name="Flag duplicate invoices"
              meta={rules.duplicates ? 'Turned on just now' : 'Paused by Mark Peters on 18 Oct 2026'}
              trigger={{ label: 'Invoice is received' }}
              condition={{ label: 'Same supplier and amount' }}
              action={{ label: 'Add the Duplicate label' }}
              enabled={rules.duplicates}
              onEnabledChange={v => setRules(r => ({ ...r, duplicates: v }))}
            />
          </div>
        </div>
        <SidePanel role="region" title={draft?.title ?? 'Step'} titleAs="h3" collapsible={false} className="w-full min-w-0 @5xl:w-80">
          {draft ? (
            <div data-slot="step-settings" className="flex flex-col gap-4 p-4">
              <Field label="Step name">
                <Input value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} />
              </Field>
              {a ? (
                <>
                  <SelectField label="Approver" value={a.approver} onValueChange={v => setA({ approver: v })} options={approvers} />
                  <SelectField label="Due within" value={a.due} onValueChange={v => setA({ due: v })} options={dueOptions} />
                  <SelectField label="If nobody responds" value={a.escalate} onValueChange={v => setA({ escalate: v })} options={escalations} hint={escalations.find(e => e.value === a.escalate)?.hint} />
                  <Switch label="Require a comment to reject" checked={a.requireComment} onCheckedChange={v => setA({ requireComment: v })} />
                </>
              ) : (
                <p className="m-0 text-sm leading-5 text-muted-foreground">{draft.error ? draft.detail : `${draft.type === 'trigger' ? 'Starts the workflow' : draft.type === 'condition' ? 'Splits the flow in Yes and No' : 'Runs after the step above'}: ${draft.detail}.`}</p>
              )}
            </div>
          ) : null}
          {draft ? (
            <div className="flex items-center gap-2 border-t border-border p-4">
              <Button variant="ghost" disabled={draft.type === 'trigger'} onClick={() => onDeleteStep?.(draft.id)}>Delete step</Button>
              <Button onClick={save}>Save</Button>
            </div>
          ) : null}
        </SidePanel>
      </div>
    </EnterpriseBlock>
  );
}

/* Audit Log */

export interface AuditEntry {
  id: string;
  time: string;
  actor: string;
  email: string;
  action: string;
  object: string;
  objectType: string;
  source: string;
  changes?: { field: string; from?: string; to?: string; sensitive?: boolean }[];
  meta?: string;
}

const auditEntries: AuditEntry[] = [
  { id: 'e1', time: '22 Oct 2026, 10:32:14', actor: 'Elena Dumitru', email: 'elena@acme.com', action: 'request.approved', object: 'PR-2041', objectType: 'Purchase request', source: 'Web · Bucharest, RO', changes: [{ field: 'Status', from: 'Pending approval', to: 'Approved by Finance' }], meta: 'Request ID 9b1e44d0 · Firefox on macOS · IP 86.120.4.18' },
  { id: 'e2', time: '22 Oct 2026, 09:58:40', actor: 'Mihai Ionescu', email: 'mihai@acme.com', action: 'invoice.updated', object: 'INV-1024', objectType: 'Invoice', source: 'Web · Cluj, RO', changes: [{ field: 'Due date', from: '7 Oct 2026', to: '21 Oct 2026' }, { field: 'Amount', from: '€2,400.00', to: '€2,160.00' }, { field: 'Note', from: '', to: '10% discount agreed with Northwind' }], meta: 'Request ID 7f3a9c21 · Chrome on Windows · IP 81.196.12.4' },
  { id: 'e3', time: '21 Oct 2026, 17:12:03', actor: 'Ana Popescu', email: 'ana@acme.com', action: 'role.changed', object: 'Radu Georgescu', objectType: 'User', source: 'Web · Bucharest, RO', changes: [{ field: 'Role', from: 'Member', to: 'Manager' }], meta: 'Request ID 1c77e0a2 · Chrome on macOS · IP 86.120.4.11' },
  { id: 'e4', time: '21 Oct 2026, 15:45:22', actor: 'System', email: 'automation', action: 'invoice.reminder_sent', object: 'INV-1029', objectType: 'Invoice', source: 'Scheduled job', meta: 'Job reminders-daily · run 4,812' },
  { id: 'e5', time: '21 Oct 2026, 11:03:57', actor: 'Radu Georgescu', email: 'radu@acme.com', action: 'export.created', object: 'Invoices, Q3', objectType: 'Export (CSV, 1,284 rows)', source: 'Web · Iași, RO', meta: 'Request ID 44d2be10 · Edge on Windows · IP 79.112.3.90' },
  { id: 'e6', time: '20 Oct 2026, 18:20:11', actor: 'Clara Weber', email: 'clara@acme.com', action: 'sso.settings_updated', object: 'SSO provider', objectType: 'Security setting', source: 'Web · Bucharest, RO', changes: [{ field: 'Client secret', sensitive: true }], meta: 'Request ID 0ae93f71 · Chrome on macOS · IP 86.120.4.30' },
  { id: 'e7', time: '20 Oct 2026, 09:14:36', actor: 'Jonas Berg', email: 'jonas@acme.com', action: 'user.signed_in', object: 'Jonas Berg', objectType: 'Session', source: 'Chrome · macOS · Bucharest, RO', meta: 'Okta SSO · IP 86.120.7.2' },
];

const eventTypes = [
  { value: 'all', label: 'All events' },
  { value: 'user', label: 'Sign-ins' },
  { value: 'role', label: 'Permission changes' },
  { value: 'request', label: 'Approvals' },
  { value: 'export', label: 'Exports' },
  { value: 'invoice', label: 'Invoices' },
  { value: 'sso', label: 'Security settings' },
];
const auditColumns = [
  { id: 'time', label: 'Time', locked: true },
  { id: 'actor', label: 'Actor' },
  { id: 'action', label: 'Action' },
  { id: 'object', label: 'Object' },
  { id: 'source', label: 'Source' },
];

export interface AuditLogProps extends SectionProps {
  title?: string;
  description?: string;
  entries?: AuditEntry[];
  /** Entry open at first. */
  defaultExpanded?: string[];
  /** Export the current view (columns, filters). */
  onExport?: (entries: AuditEntry[], columns: string[]) => void;
}

/** Read-only log: Data Grid Toolbar (type, search, filters, columns, period, export) and rows that expand to their field changes. */
function AuditLog({
  title = 'Audit log',
  description = 'Every change in the workspace, kept for 400 days. Read only.',
  entries = auditEntries,
  defaultExpanded = ['e2'],
  onExport,
  ...props
}: AuditLogProps) {
  const [type, setType] = React.useState('all');
  const [query, setQuery] = React.useState('');
  const [period, setPeriod] = React.useState('30');
  const [expanded, setExpanded] = React.useState<string[]>(defaultExpanded);
  const [cols, setCols] = React.useState(auditColumns.map(c => c.id));
  const [colsOpen, setColsOpen] = React.useState(false);
  const q = query.trim().toLowerCase();
  const rows = entries.filter(e => (type === 'all' || e.action.startsWith(`${type}.`)) && (!q || `${e.actor} ${e.email} ${e.action} ${e.object} ${e.objectType}`.toLowerCase().includes(q)));
  const has = (c: string) => cols.includes(c);
  const span = cols.length + 1;
  const toggle = (id: string) => setExpanded(x => (x.includes(id) ? x.filter(i => i !== id) : [...x, id]));
  const filters = (type !== 'all' ? 1 : 0) + (q ? 1 : 0) + 1;

  return (
    <EnterpriseBlock title={title} description={description} gap="tight" {...props}>
      <div className="min-w-0 overflow-x-auto">
        <DataGridToolbar
          aria-label="Audit log tools"
          start={(
            <>
              <Select value={type} onValueChange={setType} size="sm">
                <SelectTrigger aria-label="Event type" className="w-auto" />
                <SelectContent>{eventTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
              </Select>
              <SearchField placeholder="Search by user, action or object" value={query} onValueChange={setQuery} showShortcut={false} debounce={0} className="w-56" />
              <DataGridFiltersButton count={filters} />
            </>
          )}
          end={(
            <>
              <Popover open={colsOpen} onOpenChange={setColsOpen}>
                <PopoverTrigger asChild><Button variant="ghost" size="sm" leadingIcon={<Columns3 aria-hidden="true" />}>Columns</Button></PopoverTrigger>
                <PopoverContent align="end" className="w-auto p-0">
                  <ColumnSettings columns={auditColumns} defaultVisible={cols} onApply={s => { setCols(s.order.filter(id => s.visible.includes(id))); setColsOpen(false); }} onCancel={() => setColsOpen(false)} />
                </PopoverContent>
              </Popover>
              <Select value={period} onValueChange={setPeriod} size="sm" selectStyle="ghost">
                <SelectTrigger aria-label="Period" leading={<Calendar aria-hidden="true" />} className="w-auto" />
                <SelectContent>
                  <SelectItem value="1">Last 24 hours</SelectItem>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" leadingIcon={<Download aria-hidden="true" />} onClick={() => onExport?.(rows, cols)}>Export</Button>
            </>
          )}
        />
      </div>
      <p aria-live="polite" className={live}>{rows.length} events</p>
      <div className="min-w-0 overflow-hidden rounded-lg border border-border">
        <Table className="min-w-[900px]">
          <caption className="sr-only">Audit log, newest first</caption>
          <TableHeader>
            <TableRow>
              {has('time') ? <TableHead className="w-[176px]">Time</TableHead> : null}
              {has('actor') ? <TableHead className="w-[270px]">Actor</TableHead> : null}
              {has('action') ? <TableHead className="w-[202px]">Action</TableHead> : null}
              {has('object') ? <TableHead className="w-[236px]">Object</TableHead> : null}
              {has('source') ? <TableHead className="w-[202px]">Source</TableHead> : null}
              <TableHead className="w-12"><span className="sr-only">Details</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(e => {
              const open = expanded.includes(e.id);
              const detailId = `audit-${e.id}`;
              return (
                <React.Fragment key={e.id}>
                  <TableRow data-entry={e.id} selected={open}>
                    {has('time') ? <TableCell><TableCellText textStyle="muted" className="whitespace-nowrap">{e.time}</TableCellText></TableCell> : null}
                    {has('actor') ? <TableCell>{e.actor === 'System' ? <TableCellUser name="System" email={e.email} initials="SY" /> : <TableCellUser name={e.actor} email={e.email} initials={initialsOf(e.actor)} />}</TableCell> : null}
                    {has('action') ? <TableCell><Badge variant="outline" className="font-mono">{e.action}</Badge></TableCell> : null}
                    {has('object') ? <TableCell><TableCellStack title={e.object} description={e.objectType} /></TableCell> : null}
                    {has('source') ? <TableCell><TableCellText textStyle="muted">{e.source}</TableCellText></TableCell> : null}
                    <TableCell>
                      <ButtonIcon variant="ghost" size="sm" icon={open ? <ChevronUp /> : <ChevronDown />} label={`${open ? 'Hide' : 'Show'} details of ${e.action} on ${e.object}`} aria-expanded={open} aria-controls={open ? detailId : undefined} onClick={() => toggle(e.id)} />
                    </TableCell>
                  </TableRow>
                  {open ? (
                    <TableRow>
                      <TableCell type="expanded" colSpan={span} id={detailId}>
                        <div className="flex flex-col gap-3 px-12">
                          {e.changes?.map(c => <ChangeItem key={c.field} field={c.field} from={c.from} to={c.to} sensitive={c.sensitive} />)}
                          {e.meta ? <p className="m-0 text-xs leading-4 text-muted-foreground">{e.meta}</p> : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : null}
                </React.Fragment>
              );
            })}
            {!rows.length ? (
              <TableRow>
                <TableCell colSpan={span} className="py-8 text-center">
                  <span className="text-sm leading-5 text-muted-foreground">No events match{q ? ` “${query}”` : ' this type'}. </span>
                  <Button variant="link" size="sm" leadingIcon={<Search aria-hidden="true" />} onClick={() => { setQuery(''); setType('all'); }}>Clear filters</Button>
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </EnterpriseBlock>
  );
}

export { ApprovalInbox, ApprovalRequest, AuditLog, EnterpriseBlock, FilterBuilder, ImportMapping, WorkflowBuilder };
