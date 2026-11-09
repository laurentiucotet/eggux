// EGG UI Password Strength. Figma: Password Strength (Input page, "Password Strength / Component",
// set 66:74). Level (empty, weak, fair, good, strong). Four 4 px bars (radius/full, 4 px gap) over a
// ui/caption message in foreground/muted, 6 px apart; 288 wide in Figma (here it fills the Field).
// Bars: empty 0, weak 1 background/destructive, fair 2 foreground/muted, good 3 background/info,
// strong 4 background/success; the rest background/muted. The level is in the text and the bar
// count, never only the color. Length is the only rule (patterns/auth.md): the messages ask for a
// longer password, never for numbers or symbols. The message is a polite live region with an id the
// password input points to with aria-describedby.
import * as React from 'react';
import { cn } from '@/lib/utils';

export type PasswordStrengthLevel = 'empty' | 'weak' | 'fair' | 'good' | 'strong';

/** Level from length alone: under 8 weak, 8-11 fair, 12-15 good, 16 or more strong. */
export function passwordStrength(password: string, minLength = 8): PasswordStrengthLevel {
  const n = password.length;
  if (n === 0) return 'empty';
  if (n < minLength) return 'weak';
  if (n < minLength + 4) return 'fair';
  if (n < minLength + 8) return 'good';
  return 'strong';
}

export const passwordStrengthMessages: Record<PasswordStrengthLevel, string> = {
  empty: 'Use at least 8 characters. A longer phrase is stronger.',
  weak: 'Weak: make it longer.',
  fair: 'Fair: a few more characters make it stronger.',
  good: 'Good',
  strong: 'Strong',
};

const filled: Record<PasswordStrengthLevel, number> = { empty: 0, weak: 1, fair: 2, good: 3, strong: 4 };
// Written in full so Tailwind can read them.
const barColor: Record<PasswordStrengthLevel, string> = {
  empty: 'bg-muted',
  weak: 'bg-destructive',
  fair: 'bg-muted-foreground',
  good: 'bg-info',
  strong: 'bg-success',
};

export interface PasswordStrengthProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** Figma Level. Compute it with passwordStrength(password). */
  level: PasswordStrengthLevel;
  /** Message per level (translated copy); defaults to the Figma copy. */
  messages?: Partial<Record<PasswordStrengthLevel, string>>;
  /** Id of the message, for the password input's aria-describedby. */
  messageId?: string;
}

function PasswordStrength({ level, messages, messageId, className, ...props }: PasswordStrengthProps) {
  const message = messages?.[level] ?? passwordStrengthMessages[level];
  return (
    <div data-slot="password-strength" data-level={level} className={cn('flex w-full min-w-0 flex-col gap-1.5', className)} {...props}>
      <div data-slot="password-strength-bars" aria-hidden="true" className="flex gap-1">
        {[0, 1, 2, 3].map(i => (
          <span
            key={i}
            data-filled={i < filled[level] ? '' : undefined}
            className={cn('h-1 min-w-0 flex-1 rounded-full', i < filled[level] ? barColor[level] : 'bg-muted')}
          />
        ))}
      </div>
      <p id={messageId} role="status" aria-live="polite" data-slot="password-strength-message" className="text-xs text-muted-foreground">
        {message}
      </p>
    </div>
  );
}

export { PasswordStrength };
