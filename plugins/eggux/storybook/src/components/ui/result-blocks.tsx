// EGG UI blocks, BLOCKS / Results page (118:2): Block / Result (118:101), Type (not-found,
// server-error, no-access, maintenance, success), Show code, Actions slot.
// A full-page result or error state, centered in the Page slot of the shell the person was in
// (guide: build-ui/patterns/result-pages.md). Say what happened in plain words, reassure about data,
// always give a next step: a primary Button and an outline alternative.
// Layout from Figma: a 480 column, 48 px top and bottom, items centered and 16 apart; a 56 px
// background/muted circle with a 24 px icon (foreground; triangle-alert in destructive for 500,
// circle-check in success for success); the code ("404", "Maintenance") in ui/label muted; the title
// heading/h3 (24/32 semibold, -0.4); the description body/small muted, centered; the actions 8 apart
// with 8 more above them. A 500 can carry an error id people quote to support.
// A11y: a <section> named by its title (h1 by default: the result is the page). The icon is
// decorative; the code is read before the title.
import * as React from 'react';
import { CircleAlert, CircleCheck, Search, Settings, TriangleAlert } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';

export type ResultType = 'not-found' | 'server-error' | 'no-access' | 'maintenance' | 'success';

export interface ResultAction {
  label: string;
  /** A link when set, else a button. */
  href?: string;
  onClick?: () => void;
}

export interface ResultProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  /** Figma Type: sets the icon and the default texts and actions. */
  type?: ResultType;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** The code above the title ("404"); Figma Show code. */
  code?: React.ReactNode;
  showCode?: boolean;
  /** Replaces the icon of the type. */
  icon?: React.ReactNode;
  primaryAction?: ResultAction | null;
  secondaryAction?: ResultAction | null;
  /** Figma Actions slot: replaces both actions. */
  actions?: React.ReactNode;
  /** An error id people can quote to support (server errors). */
  errorId?: string;
  /** Heading level of the title. Default 1: the result is the page. */
  headingLevel?: 1 | 2 | 3;
}

interface Preset {
  icon: React.ReactNode;
  iconClass: string;
  code: string;
  title: string;
  description: string;
  primary: ResultAction;
  secondary?: ResultAction;
}

const presets: Record<ResultType, Preset> = {
  'not-found': {
    icon: <Search />,
    iconClass: 'text-foreground',
    code: '404',
    title: 'Page not found',
    description: 'The page you are looking for was moved, deleted or never existed. Check the address or go back.',
    primary: { label: 'Go to dashboard', href: '#dashboard' },
    secondary: { label: 'Go back', href: '#back' },
  },
  'server-error': {
    icon: <TriangleAlert />,
    iconClass: 'text-destructive',
    code: '500',
    title: 'Something went wrong on our side',
    description: 'We could not load this page. Your data is safe. Try again in a few minutes; if it keeps happening, contact support.',
    primary: { label: 'Try again' },
    secondary: { label: 'Contact support', href: '#support' },
  },
  'no-access': {
    icon: <CircleAlert />,
    iconClass: 'text-foreground',
    code: '403',
    title: "You don't have access to this page",
    description: 'Ask a workspace admin to give you access, or switch to an account that has it.',
    primary: { label: 'Request access' },
    secondary: { label: 'Switch account', href: '#switch-account' },
  },
  maintenance: {
    icon: <Settings />,
    iconClass: 'text-foreground',
    code: 'Maintenance',
    title: "We'll be back shortly",
    description: 'Scheduled maintenance until 14:00 (EEST). Nothing you saved is lost.',
    primary: { label: 'View status page', href: '#status' },
  },
  success: {
    icon: <CircleCheck />,
    iconClass: 'text-success',
    code: 'Done',
    title: 'Your order is confirmed',
    description: 'Order #10482 is on its way. We sent the receipt and tracking link to ana@example.com.',
    primary: { label: 'View order', href: '#order' },
    secondary: { label: 'Continue shopping', href: '#shop' },
  },
};

function ActionButton({ action, variant }: { action: ResultAction; variant?: 'outline' }) {
  if (action.href) {
    return <Button asChild variant={variant}><a href={action.href} onClick={action.onClick}>{action.label}</a></Button>;
  }
  return <Button variant={variant} onClick={action.onClick}>{action.label}</Button>;
}

function Result({
  type = 'not-found',
  title,
  description,
  code,
  showCode = true,
  icon,
  primaryAction,
  secondaryAction,
  actions,
  errorId,
  headingLevel = 1,
  className,
  ...props
}: ResultProps) {
  const p = presets[type];
  const id = React.useId();
  const Heading = `h${headingLevel}` as 'h1';
  const primary = primaryAction === undefined ? p.primary : primaryAction;
  const secondary = secondaryAction === undefined ? p.secondary : secondaryAction;
  const shownActions = actions ?? (primary || secondary ? (
    <>
      {primary ? <ActionButton action={primary} /> : null}
      {secondary ? <ActionButton action={secondary} variant="outline" /> : null}
    </>
  ) : null);
  return (
    <section
      data-slot="result"
      data-type={type}
      aria-labelledby={id}
      className={cn('mx-auto flex w-full max-w-[480px] min-w-0 flex-col items-center gap-4 py-12 text-center', className)}
      {...props}
    >
      <span data-slot="result-icon" aria-hidden="true" className={cn('flex size-14 shrink-0 items-center justify-center rounded-full bg-muted [&_svg]:size-6', p.iconClass)}>
        {icon ?? p.icon}
      </span>
      {showCode ? <p data-slot="result-code" className="m-0 text-sm leading-5 font-medium text-muted-foreground">{code ?? p.code}</p> : null}
      <Heading id={id} className="m-0 w-full text-2xl leading-8 font-semibold tracking-[-0.4px] text-balance text-foreground [overflow-wrap:anywhere]">{title ?? p.title}</Heading>
      <p data-slot="result-description" className="m-0 w-full text-sm leading-5 text-pretty text-muted-foreground [overflow-wrap:anywhere]">{description ?? p.description}</p>
      {shownActions ? <div data-slot="result-actions" className="flex flex-wrap items-center justify-center gap-2 pt-2">{shownActions}</div> : null}
      {errorId ? <p data-slot="result-error-id" className="m-0 text-xs leading-4 text-muted-foreground">Error id: <code className="font-mono">{errorId}</code></p> : null}
    </section>
  );
}

export { Result };
