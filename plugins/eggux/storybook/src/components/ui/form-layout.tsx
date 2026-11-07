// EGG UI Form Layout page: Form Section (433:1338), Fieldset (433:1370), Error Summary (433:1371),
// Requirement List (433:1393) and Check Item (433:1392).
// Form Section: one group of a long form. side: the heading (heading/h4 title, body/small muted
// description) in a 280 column, the fields 48 to the right, 16 apart; stacked: heading above,
// 24 to the fields. auto (default) is side from a 640 container, stacked below. A divider 32
// under the section (off on the last one).
// Fieldset: a <fieldset> with a <legend> (ui/label), an optional rule (body/small muted), the
// options 12 below and 8 apart, and one error for the group (body/small destructive) 12 below.
// Error Summary: after a failed submit; card with a destructive border, circle-alert, the count
// (ui/label) and one link per field (body/small destructive, underlined). Focus moves to it; each
// link moves focus to its field. Requirement List: title (ui/label) and Check Items 6 apart;
// Check Item: 16 mark (circle-check success, dash muted, x destructive) and the label; Tone
// on-primary and inverted for primary and inverted cards. The state is in text for screen readers.
import * as React from 'react';
import { CircleAlert, CircleCheck, Minus, X } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Separator } from './separator';

/* Form Section */

export interface FormSectionProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  title: string;
  description?: React.ReactNode;
  /** side (heading left, 280), stacked, or auto: side from a 640 container. */
  layout?: 'auto' | 'side' | 'stacked';
  /** Divider under the section; off on the last one. */
  divider?: boolean;
  headingLevel?: 2 | 3;
}

function FormSection({ title, description, layout = 'auto', divider = true, headingLevel = 2, className, children, ...props }: FormSectionProps) {
  const id = React.useId();
  const Heading = `h${headingLevel}` as 'h2';
  const side = layout === 'side';
  const auto = layout === 'auto';
  return (
    <section data-slot="form-section" data-layout={layout} aria-labelledby={id} className={cn('@container flex w-full flex-col gap-8', className)} {...props}>
      <div className={cn('flex flex-col gap-6', side && 'flex-row gap-12', auto && '@min-[640px]:flex-row @min-[640px]:gap-12')}>
        <div className={cn('flex flex-col gap-1', side && 'w-[280px] shrink-0', auto && '@min-[640px]:w-[280px] @min-[640px]:shrink-0')}>
          <Heading id={id} className="m-0 text-xl leading-7 font-semibold tracking-[-0.4px] text-foreground">{title}</Heading>
          {description ? <p className="m-0 text-sm leading-5 text-muted-foreground">{description}</p> : null}
        </div>
        <div data-slot="form-section-fields" className="flex min-w-0 flex-1 flex-col gap-4">{children}</div>
      </div>
      {divider ? <Separator /> : null}
    </section>
  );
}

/* Fieldset */

export interface FieldsetProps extends React.ComponentProps<'fieldset'> {
  legend: React.ReactNode;
  description?: React.ReactNode;
  /** The error of the group, not of one control. */
  error?: React.ReactNode;
}

function Fieldset({ legend, description, error, className, children, ...props }: FieldsetProps) {
  const id = React.useId();
  const describedBy = [description ? `${id}-desc` : null, error ? `${id}-error` : null].filter(Boolean).join(' ') || undefined;
  return (
    <fieldset
      data-slot="fieldset"
      data-state={error ? 'error' : 'default'}
      aria-describedby={describedBy}
      aria-invalid={error ? true : undefined}
      className={cn('m-0 w-full min-w-0 border-0 p-0', className)}
      {...props}
    >
      <legend className="p-0 text-sm leading-5 font-medium text-foreground">{legend}</legend>
      <div className={cn('flex flex-col gap-3', description ? 'mt-0.5' : 'mt-3')}>
        {description ? <p id={`${id}-desc`} className="m-0 text-sm leading-5 text-muted-foreground">{description}</p> : null}
        <div data-slot="fieldset-options" className="flex flex-col items-start gap-2">{children}</div>
        {error ? <p id={`${id}-error`} className="m-0 text-sm leading-5 text-destructive">{error}</p> : null}
      </div>
    </fieldset>
  );
}

/* Error Summary */

export interface FormError {
  /** The id of the field's control. */
  fieldId: string;
  message: string;
}

export interface ErrorSummaryProps extends React.ComponentProps<'div'> {
  errors: FormError[];
  title?: string;
  /** Move focus here when it appears (after a failed submit). */
  autoFocus?: boolean;
}

function ErrorSummary({ errors, title, autoFocus = true, className, ...props }: ErrorSummaryProps) {
  const id = React.useId();
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (autoFocus && errors.length) ref.current?.focus();
    // Focus only when the summary appears, not on every change of the list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFocus, errors.length > 0]);
  if (!errors.length) return null;
  const heading = title ?? `Fix ${errors.length} ${errors.length === 1 ? 'field' : 'fields'} to continue`;
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="group"
      aria-labelledby={id}
      data-slot="error-summary"
      className={cn('flex w-full items-start gap-3 rounded-lg border border-destructive bg-card p-4 outline-none focus-visible:ring-[3px] focus-visible:ring-destructive/30', className)}
      {...props}
    >
      <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-destructive" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <h2 id={id} className="m-0 text-sm leading-5 font-medium text-foreground">{heading}</h2>
        <ul className="m-0 flex list-none flex-col gap-1 p-0">
          {errors.map(e => (
            <li key={e.fieldId}>
              <a
                href={`#${e.fieldId}`}
                onClick={ev => {
                  const el = document.getElementById(e.fieldId);
                  if (!el) return;
                  ev.preventDefault();
                  el.focus();
                  el.scrollIntoView?.({ block: 'center' });
                }}
                className="block truncate rounded-xs text-sm leading-5 text-destructive underline outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                {e.message}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* Requirement List and Check Item */

export type CheckMark = 'check' | 'dash' | 'x';
export type CheckTone = 'default' | 'on-primary' | 'inverted';

const markIcon = { check: CircleCheck, dash: Minus, x: X } as const;
const markText: Record<CheckMark, string> = { check: 'Met: ', dash: 'Not met yet: ', x: 'Not met: ' };

export interface CheckItemProps extends React.ComponentProps<'li'> {
  mark?: CheckMark;
  tone?: CheckTone;
  /** Screen reader prefix per mark; for plan features use { check: 'Included: ', dash: 'Not included: ' }. */
  stateText?: Partial<Record<CheckMark, string>>;
}

function CheckItem({ mark = 'check', tone = 'default', stateText, className, children, ...props }: CheckItemProps) {
  const Icon = markIcon[mark];
  const label =
    tone === 'on-primary' ? 'text-primary-foreground'
    : tone === 'inverted' ? 'text-background'
    : mark === 'dash' ? 'text-muted-foreground' : 'text-foreground';
  const icon =
    tone === 'on-primary' ? 'text-primary-foreground'
    : tone === 'inverted' ? (mark === 'dash' ? 'text-muted' : 'text-background')
    : mark === 'check' ? 'text-success' : mark === 'x' ? 'text-destructive' : 'text-muted-foreground';
  return (
    <li data-slot="check-item" data-mark={mark} className={cn('flex min-w-0 list-none items-center gap-2 text-sm leading-5', label, className)} {...props}>
      <Icon aria-hidden="true" className={cn('size-4 shrink-0', icon)} />
      <span className="min-w-0 truncate">
        <span className="sr-only">{stateText?.[mark] ?? markText[mark]}</span>
        {children}
      </span>
    </li>
  );
}

export interface RequirementListProps extends React.ComponentProps<'div'> {
  title?: string;
}

function RequirementList({ title, className, children, ...props }: RequirementListProps) {
  const id = React.useId();
  return (
    <div data-slot="requirement-list" className={cn('flex w-full min-w-0 flex-col gap-2', className)} {...props}>
      {title ? <p id={id} className="m-0 truncate text-sm leading-5 font-medium text-foreground">{title}</p> : null}
      <ul aria-labelledby={title ? id : undefined} className="m-0 flex flex-col gap-1.5 p-0">{children}</ul>
    </div>
  );
}

export { CheckItem, ErrorSummary, Fieldset, FormSection, RequirementList };
