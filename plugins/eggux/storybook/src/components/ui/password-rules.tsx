// EGG UI Password Rules. Code only (no Figma component yet). A live checklist under a new-password
// field: every rule shows met or not met as an icon AND as text for screen readers ("met" / "not met"),
// never by color alone. The summary ("2 of 4 rules met") is a polite status that speaks only when the
// count changes, so people hear progress while they type without every key press being read out.
// Link it to the input with `id` and the input's aria-describedby. Rules are functions of the value;
// `passwordRules` holds the defaults (length 8, upper and lower case, a number, a symbol). Pair with
// Password Strength only when both say the same thing: this one lists what is missing, that one
// scores the whole password. Empty value: all rules neutral and nothing is announced.
import * as React from 'react';
import { Check, Minus } from '@/components/icons';
import { cn } from '@/lib/utils';

export interface PasswordRule {
  id: string;
  /** What the password needs, in the positive: "At least 8 characters". */
  label: string;
  /** True when the value meets the rule. */
  test: (value: string) => boolean;
}

export const passwordRules: PasswordRule[] = [
  { id: 'length', label: 'At least 8 characters', test: v => v.length >= 8 },
  { id: 'case', label: 'An uppercase and a lowercase letter', test: v => /[a-z]/.test(v) && /[A-Z]/.test(v) },
  { id: 'number', label: 'A number', test: v => /\d/.test(v) },
  { id: 'symbol', label: 'A symbol such as ! or #', test: v => /[^A-Za-z0-9\s]/.test(v) },
];

export interface PasswordRulesProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** The password being typed. */
  value: string;
  /** Rules to check; default `passwordRules`. */
  rules?: PasswordRule[];
  /** Heading above the list. */
  title?: string;
  /** Show the heading. */
  showTitle?: boolean;
  /** Lay the rules out in two columns when there is room. */
  columns?: 1 | 2;
  /** Text for a rule that is met / not met, read after the label by screen readers. */
  metText?: string;
  unmetText?: string;
}

function PasswordRules({
  value,
  rules = passwordRules,
  title = 'Your password needs',
  showTitle = true,
  columns = 1,
  metText = 'met',
  unmetText = 'not met',
  className,
  ...props
}: PasswordRulesProps) {
  const results = rules.map(rule => ({ rule, met: rule.test(value) }));
  const count = results.filter(r => r.met).length;
  const touched = value.length > 0;
  const summary = !touched ? '' : count === rules.length ? 'All rules met' : `${count} of ${rules.length} rules met`;

  return (
    <div data-slot="password-rules" data-complete={touched && count === rules.length ? '' : undefined} className={cn('flex min-w-0 flex-col gap-2', className)} {...props}>
      {showTitle ? <p className="m-0 text-xs leading-4 font-medium text-foreground">{title}</p> : null}
      <ul className={cn('m-0 grid list-none gap-x-4 gap-y-1.5 p-0', columns === 2 && 'sm:grid-cols-2')}>
        {results.map(({ rule, met }) => (
          <li key={rule.id} data-met={met ? '' : undefined} className="flex min-w-0 items-start gap-2 text-sm leading-5">
            <span
              aria-hidden="true"
              className={cn(
                'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-[var(--duration-fast)] motion-reduce:transition-none [&_svg]:size-3',
                met ? 'border-success bg-success text-success-foreground' : 'border-muted-foreground/60 text-muted-foreground',
              )}
            >
              {met ? <Check /> : <Minus />}
            </span>
            <span className={cn('min-w-0 break-words', met ? 'text-foreground' : 'text-muted-foreground')}>
              {rule.label}
              <span className="sr-only">{`: ${met ? metText : unmetText}`}</span>
            </span>
          </li>
        ))}
      </ul>
      <p role="status" aria-live="polite" data-slot="password-rules-status" className="sr-only">
        {summary}
      </p>
    </div>
  );
}

export { PasswordRules };
