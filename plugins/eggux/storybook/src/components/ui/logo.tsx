// EGG UI Logo and Logo Mark. Figma: Logo, Logo Mark (Brand page). Logo Type (mark, wordmark, full),
// Name ("Acme"). Logo Mark: the brand symbol, 32 square (spacing/8), radius lg, background/primary
// with a glyph in foreground/primary (body/large: 18/28 semibold). Replace the glyph with the
// client's symbol once (an inline SVG in currentColor) and every Logo follows. Logo: mark = the
// symbol alone (collapsed sidebar, favicon), wordmark = the name alone, full = both, 8 px apart,
// the name in body/large semibold foreground/default.
// Accessibility: the name is the accessible text; with Type=mark it is visually hidden. Wrap the
// Logo in a link home where it navigates ("Acme, home" comes from the name).
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface LogoMarkProps extends React.ComponentProps<'span'> {
  /** The symbol: an inline SVG in currentColor. Default the "E" glyph of the library. */
  children?: React.ReactNode;
}

/** Figma Logo Mark: the brand symbol, decorative (the Logo carries the name). */
function LogoMark({ className, children, ...props }: LogoMarkProps) {
  return (
    <span
      aria-hidden="true"
      data-slot="logo-mark"
      className={cn('flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-lg leading-7 font-semibold text-primary-foreground [&_svg]:size-5', className)}
      {...props}
    >
      {children ?? 'E'}
    </span>
  );
}

export type LogoType = 'mark' | 'wordmark' | 'full';

export interface LogoProps extends React.ComponentProps<'span'> {
  /** Figma Type. */
  type?: LogoType;
  /** Figma Name: the product or client name. */
  name?: string;
  /** The symbol for the Logo Mark (inline SVG). */
  mark?: React.ReactNode;
}

function Logo({ type = 'full', name = 'Acme', mark, className, ...props }: LogoProps) {
  return (
    <span data-slot="logo" data-type={type} className={cn('inline-flex shrink-0 items-center gap-2', className)} {...props}>
      {type !== 'wordmark' ? <LogoMark>{mark}</LogoMark> : null}
      <span data-slot="logo-name" className={cn('text-lg leading-7 font-semibold whitespace-nowrap text-foreground', type === 'mark' && 'sr-only')}>{name}</span>
    </span>
  );
}

export { Logo, LogoMark };
