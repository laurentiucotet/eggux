// EGG UI Blocks, Forms page (BLOCKS / Forms, Figma 67:2089), the onboarding group: Block / Welcome
// Role Select, Workspace Setup, Invite Team Step and Plan Select Step. The steps of product
// onboarding after sign-up, 672 wide for Page Shell / Wizard: "Step N of 4 · name" over a progress
// bar (Show progress), the heading (h1) and description, the step's fields, then Back or Skip and
// Continue (Show actions). Inside the Wizard shell turn progress and actions off: the shell has
// them. Every step is skippable except the workspace name (multi-step-form.md). Choices are Option
// Cards in a radiogroup; invites use Tag Input. Validation as in useBlockForm (form-auth-blocks).
import * as React from 'react';
import { Building, Code, CreditCard, LayoutGrid, Pencil, Users } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Button } from './button';
import { Byline } from './byline';
import { CopyField } from './copy-field';
import { Field } from './field';
import { CheckItem, Fieldset } from './form-layout';
import { requiredRule, useBlockForm } from './form-auth-blocks';
import { AvatarUpload } from './imagery';
import { Input } from './input';
import { InputGroup } from './input-group';
import { OptionCard, OptionCardGroup } from './option-card';
import { Progress } from './progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { TagInput } from './tag-input';
import { ToggleGroup, ToggleGroupItem } from './toggle-group';

/* The step frame */

export interface OnboardingStepProps extends Omit<React.ComponentProps<'form'>, 'title' | 'onSubmit'> {
  step: number;
  total?: number;
  stepName: string;
  title: string;
  description?: React.ReactNode;
  /** Figma Show progress: off inside Page Shell / Wizard. */
  showProgress?: boolean;
  /** Figma Show actions: off inside Page Shell / Wizard. */
  showActions?: boolean;
  /** Start of the footer: Back or Skip. */
  leading?: React.ReactNode;
  continueLabel?: string;
  onContinue?: (event: React.FormEvent) => void;
}

const sectionLabel = 'm-0 p-0 text-sm leading-5 font-medium text-foreground';

/** "Step N of 4 · name", the heading, the fields, the footer. A form: Enter continues. */
export function OnboardingStep({
  step,
  total = 4,
  stepName,
  title,
  description,
  showProgress = true,
  showActions = true,
  leading,
  continueLabel = 'Continue',
  onContinue,
  className,
  children,
  ...props
}: OnboardingStepProps) {
  return (
    <form
      noValidate
      aria-label={title}
      data-slot="onboarding-step"
      onSubmit={e => { e.preventDefault(); onContinue?.(e); }}
      className={cn('@container flex w-full max-w-[672px] flex-col gap-8 text-foreground', className)}
      {...props}
    >
      {showProgress ? (
        <div data-slot="onboarding-progress" className="flex flex-col gap-2">
          <p className="m-0 text-xs leading-4 text-muted-foreground">Step {step} of {total} · {stepName}</p>
          <Progress value={(step / total) * 100} size="sm" aria-label={`Step ${step} of ${total}`} />
        </div>
      ) : null}
      <div className="flex flex-col gap-2">
        <h1 className="m-0 text-3xl leading-9 font-semibold tracking-[-0.6px]">{title}</h1>
        {description ? <p className="m-0 text-lg leading-7 text-muted-foreground">{description}</p> : null}
      </div>
      {children}
      {showActions ? (
        <div data-slot="onboarding-actions" className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">{leading}</div>
          <Button type="submit">{continueLabel}</Button>
        </div>
      ) : null}
    </form>
  );
}

/** Focus the checked option of a radiogroup, or its first option. */
const focusGroup = (group: HTMLElement | null) =>
  (group?.querySelector<HTMLElement>('[role=radio][data-state=checked]') ?? group?.querySelector<HTMLElement>('[role=radio]'))?.focus();

/* Welcome Role Select */

export const ROLES = [
  { value: 'project-manager', title: 'Project manager', description: 'Plan projects and deadlines', icon: <LayoutGrid /> },
  { value: 'designer', title: 'Designer', description: 'Share work and get feedback', icon: <Pencil /> },
  { value: 'developer', title: 'Developer', description: 'Log hours against tasks', icon: <Code /> },
  { value: 'account-manager', title: 'Account manager', description: 'Keep clients in the loop', icon: <Users /> },
  { value: 'finance', title: 'Finance and billing', description: 'Send invoices, get paid', icon: <CreditCard /> },
  { value: 'founder', title: 'Founder or owner', description: 'See margins across projects', icon: <Building /> },
];
export const TEAM_SIZES = ['Just me', '2-10', '11-50', '51-200', '201+'];

export interface WelcomeRoleSelectProps extends Omit<OnboardingStepProps, 'step' | 'stepName' | 'title' | 'onSubmit'> {
  name?: string;
  title?: string;
  defaultRole?: string;
  defaultTeamSize?: string;
  onSubmit?: (values: { role: string; teamSize: string }) => void;
  onSkip?: () => void;
}

export function WelcomeRoleSelect({ name = 'Ana', title, description, defaultRole = '', defaultTeamSize = '', onSubmit, onSkip, ...props }: WelcomeRoleSelectProps) {
  const f = useBlockForm({ role: defaultRole, teamSize: defaultTeamSize }, { role: v => (v ? undefined : 'Choose the role closest to yours, or skip this step.') }, { focusFirstError: false });
  const roleRef = React.useRef<HTMLDivElement>(null);
  return (
    <OnboardingStep
      step={1}
      stepName="About you"
      title={title ?? `Welcome to Acme${name ? `, ${name}` : ''}`}
      description={description ?? 'Tell us about you and your team. We use it to pick the templates and the dashboard you start with. You can change it later in Settings.'}
      leading={<Button type="button" variant="ghost" onClick={onSkip}>Skip for now</Button>}
      onContinue={() => (f.validate().role ? focusGroup(roleRef.current) : onSubmit?.(f.values))}
      {...props}
    >
      <Fieldset legend="What best describes your role?" error={f.errors.role}>
        <OptionCardGroup ref={roleRef} aria-label="What best describes your role?" value={f.values.role} onValueChange={v => f.set('role', v)} className="grid w-full grid-cols-1 @min-[560px]:grid-cols-2">
          {ROLES.map(r => <OptionCard key={r.value} value={r.value} title={r.title} description={r.description} icon={r.icon} className="w-full" />)}
        </OptionCardGroup>
      </Fieldset>
      <Fieldset legend="How many people are on your team?">
        <OptionCardGroup aria-label="How many people are on your team?" value={f.values.teamSize} onValueChange={v => f.set('teamSize', v)} className="grid w-full grid-cols-2 @min-[560px]:grid-cols-5">
          {TEAM_SIZES.map(s => <OptionCard key={s} value={s} title={s} layout="compact" className="w-full" />)}
        </OptionCardGroup>
      </Fieldset>
    </OnboardingStep>
  );
}

/* Workspace Setup */

const slugify = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
const CURRENCIES = [['EUR', 'EUR · Euro'], ['USD', 'USD · US dollar'], ['GBP', 'GBP · British pound'], ['RON', 'RON · Romanian leu'], ['PLN', 'PLN · Polish złoty']] as const;
const TIME_ZONES = [['Europe/Bucharest', 'Europe/Bucharest (UTC+2)'], ['Europe/London', 'Europe/London (UTC+0)'], ['Europe/Berlin', 'Europe/Berlin (UTC+1)'], ['Europe/Warsaw', 'Europe/Warsaw (UTC+1)'], ['America/New_York', 'America/New York (UTC−5)']] as const;

function OptionsSelect({ options, ...props }: { options: readonly (readonly [string, string])[]; value: string; onValueChange: (v: string) => void; id?: string; 'aria-describedby'?: string }) {
  return (
    <Select {...props}>
      <SelectTrigger><SelectValue /></SelectTrigger>
      <SelectContent>{options.map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent>
    </Select>
  );
}

export type WorkspaceValues = { name: string; slug: string; currency: string; timeZone: string };

export interface WorkspaceSetupProps extends Omit<OnboardingStepProps, 'step' | 'stepName' | 'title' | 'onSubmit'> {
  title?: string;
  defaultValues?: Partial<WorkspaceValues>;
  /** Taken workspace URLs (the app checks the server). */
  takenSlugs?: string[];
  onSubmit?: (values: WorkspaceValues) => void;
  onBack?: () => void;
}

export function WorkspaceSetup({ title = 'Set up your workspace', description = 'This is where your projects, clients and invoices live. You can change all of it later in Settings.', defaultValues, takenSlugs = ['acme'], onSubmit, onBack, ...props }: WorkspaceSetupProps) {
  const f = useBlockForm<WorkspaceValues>(
    { name: 'Acme Studio', slug: 'acme-studio', currency: 'EUR', timeZone: 'Europe/Bucharest', ...defaultValues },
    {
      name: requiredRule('Enter a workspace name. You can change it later.'),
      slug: v => (!v ? 'Enter the address of your workspace.' : !/^[a-z0-9-]{3,40}$/.test(v) ? 'Use 3 to 40 lowercase letters, numbers and hyphens.' : takenSlugs.includes(v) ? `app.acme.com/${v} is taken. Try another address.` : undefined),
    },
  );
  const slugEdited = React.useRef(Boolean(defaultValues?.slug));
  return (
    <OnboardingStep
      step={2}
      stepName="Workspace"
      title={title}
      description={description}
      leading={<Button type="button" variant="ghost" onClick={onBack}>Back</Button>}
      onContinue={f.submit(v => onSubmit?.(v))}
      {...props}
    >
      <div className="flex flex-col gap-6">
        <AvatarUpload shape="square" label="Workspace logo" hint="PNG or SVG, at least 256 × 256 px. Shown in the sidebar and on invoices." initials="AC" state="empty" />
        <Field label="Workspace name" required hint="Your company or team name, as clients will see it." {...f.field('name')}>
          <Input
            autoComplete="organization"
            value={f.values.name}
            onChange={e => {
              f.set('name', e.target.value);
              if (!slugEdited.current) f.set('slug', slugify(e.target.value));
            }}
            onBlur={() => f.blur('name')}
          />
        </Field>
        <Field label="Workspace URL" required hint="Letters, numbers and hyphens. Your team and clients use this address." {...f.field('slug')}>
          <InputGroup start="app.acme.com/" value={f.values.slug} onChange={e => { slugEdited.current = true; f.set('slug', e.target.value.toLowerCase()); }} onBlur={() => f.blur('slug')} />
        </Field>
        <div className="grid grid-cols-1 gap-4 @min-[560px]:grid-cols-2">
          <Field label="Default currency" hint="Used for new invoices." {...f.field('currency')}>
            <OptionsSelect options={CURRENCIES} value={f.values.currency} onValueChange={v => f.set('currency', v)} />
          </Field>
          <Field label="Time zone" hint="Used for due dates and reminders." {...f.field('timeZone')}>
            <OptionsSelect options={TIME_ZONES} value={f.values.timeZone} onValueChange={v => f.set('timeZone', v)} />
          </Field>
        </div>
      </div>
    </OnboardingStep>
  );
}

/* Invite Team Step */

export interface Invitee { name: string; email: string; initials: string; role: 'owner' | 'admin' | 'member' | 'guest'; you?: boolean }
const ROLE_OPTIONS = [['admin', 'Admin'], ['member', 'Member'], ['guest', 'Guest']] as const;
const isEmail = (s: string) => /^\S+@\S+\.\S+$/.test(s);

export interface InviteTeamStepProps extends Omit<OnboardingStepProps, 'step' | 'stepName' | 'title' | 'onSubmit'> {
  title?: string;
  defaultInvitees?: Invitee[];
  inviteLink?: string;
  onInvite?: (emails: string[], role: string) => void;
  onSubmit?: (invitees: Invitee[]) => void;
  onSkip?: () => void;
}

export function InviteTeamStep({
  title = 'Invite your team',
  description = 'Teammates see the projects you add them to, log hours and comment. Invites expire in 7 days.',
  defaultInvitees = [
    { name: 'Ana Popescu', email: 'ana@acme.com', initials: 'AP', role: 'owner', you: true },
    { name: 'Maria Ilie', email: 'maria@acme.com', initials: 'MI', role: 'member' },
    { name: 'Dan Radu', email: 'dan@acme.com', initials: 'DR', role: 'member' },
  ],
  inviteLink = 'app.acme.com/join/7Kq2xF',
  onInvite,
  onSubmit,
  onSkip,
  ...props
}: InviteTeamStepProps) {
  const [emails, setEmails] = React.useState<string[]>([]);
  const [role, setRole] = React.useState('member');
  const [error, setError] = React.useState<string>();
  const [invitees, setInvitees] = React.useState(defaultInvitees);
  const id = React.useId();
  const check = (list: string[]) => {
    const bad = list.filter(e => !isEmail(e));
    const dup = list.filter(e => invitees.some(i => i.email === e));
    return !list.length
      ? 'Enter at least one email address.'
      : bad.length ? `${bad.join(', ')} ${bad.length === 1 ? 'is not an email address' : 'are not email addresses'}. Fix or remove ${bad.length === 1 ? 'it' : 'them'}.`
      : dup.length ? `${dup.join(', ')} ${dup.length === 1 ? 'is' : 'are'} already invited.` : undefined;
  };
  const invite = () => {
    const problem = check(emails);
    setError(problem);
    if (problem) {
      document.getElementById(id)?.focus();
      return;
    }
    onInvite?.(emails, role);
    setInvitees(list => [...list, ...emails.map(e => ({ name: e.split('@')[0], email: e, initials: e.slice(0, 2).toUpperCase(), role: role as Invitee['role'] }))]);
    setEmails([]);
  };
  return (
    <OnboardingStep
      step={3}
      stepName="Team"
      title={title}
      description={description}
      leading={<Button type="button" variant="ghost" onClick={onSkip}>Skip for now</Button>}
      onContinue={() => onSubmit?.(invitees)}
      {...props}
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 @min-[560px]:flex-row">
          <Field id={id} label="Email addresses" showLabel={false} error={error} className="min-w-0 flex-1">
            <TagInput
              label="Email addresses"
              placeholder="name@acme.com, or several separated by commas"
              value={emails}
              onValueChange={v => { setEmails(v); if (error) setError(v.length ? check(v) : undefined); }}
              className="w-full"
            />
          </Field>
          <div className="flex gap-2">
            <div className="w-32 shrink-0">
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger aria-label="Role for the invite"><SelectValue /></SelectTrigger>
                <SelectContent>{ROLE_OPTIONS.map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <Button type="button" onClick={invite}>Invite</Button>
          </div>
        </div>
      </div>
      <section aria-labelledby={`${id}-list`} className="flex flex-col gap-3">
        <h2 id={`${id}-list`} className={sectionLabel}>Invited ({invitees.length})</h2>
        <ul className="m-0 flex flex-col gap-3 p-0">
          {invitees.map(p => (
            <li key={p.email} data-slot="invitee" className="flex min-h-10 list-none items-center gap-3">
              <Byline className="min-w-0 flex-1" name={p.you ? `${p.name} (you)` : p.name} description={p.email} avatar={{ initials: p.initials }} />
              {p.role === 'owner' ? (
                <span className="text-sm leading-5 text-muted-foreground">Owner</span>
              ) : (
                <>
                  <Badge variant="soft-neutral">Invited</Badge>
                  <div className="w-32 shrink-0">
                    <Select value={p.role} onValueChange={r => setInvitees(list => list.map(i => (i.email === p.email ? { ...i, role: r as Invitee['role'] } : i)))}>
                      <SelectTrigger aria-label={`Role of ${p.name}`}><SelectValue /></SelectTrigger>
                      <SelectContent>{ROLE_OPTIONS.map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
      <div className="flex flex-col gap-2 border-t border-border pt-6">
        <h2 className={sectionLabel}>Or share an invite link</h2>
        <CopyField value={inviteLink} aria-label="Invite link" />
        <p className="m-0 text-xs leading-4 text-muted-foreground">Anyone with the link joins as a Member. Turn it off any time in Settings.</p>
      </div>
    </OnboardingStep>
  );
}

/* Plan Select Step */

export interface PlanOption { id: string; name: string; description: string; monthly: number; yearly: number }
export const PLANS: PlanOption[] = [
  { id: 'starter', name: 'Starter', description: 'For freelancers and teams of up to 5 people', monthly: 12, yearly: 9 },
  { id: 'pro', name: 'Pro', description: 'For agencies that bill by the hour, with budgets and retainers', monthly: 24, yearly: 19 },
  { id: 'business', name: 'Business', description: 'For finance teams that need approvals, SSO and an audit log', monthly: 35, yearly: 29 },
];

export interface PlanSelectStepProps extends Omit<OnboardingStepProps, 'step' | 'stepName' | 'title' | 'onSubmit'> {
  title?: string;
  plans?: PlanOption[];
  defaultPlan?: string;
  defaultBilling?: 'monthly' | 'yearly';
  trialEnd?: string;
  onSubmit?: (values: { plan: string; billing: 'monthly' | 'yearly' }) => void;
  onBack?: () => void;
  onSkip?: () => void;
}

export function PlanSelectStep({
  title = 'Start your 14-day free trial',
  description = 'Pick a plan to try. No card needed, and you can switch plans any time during the trial.',
  plans = PLANS,
  defaultPlan = 'pro',
  defaultBilling = 'yearly',
  trialEnd = '9 November 2026',
  onSubmit,
  onBack,
  onSkip,
  ...props
}: PlanSelectStepProps) {
  const [billing, setBilling] = React.useState<'monthly' | 'yearly'>(defaultBilling);
  const [plan, setPlan] = React.useState(defaultPlan);
  const chosen = plans.find(p => p.id === plan);
  return (
    <OnboardingStep
      step={4}
      stepName="Plan"
      title={title}
      description={description}
      leading={<Button type="button" variant="ghost" onClick={onBack}>Back</Button>}
      continueLabel={chosen ? `Start ${chosen.name} trial` : 'Start trial'}
      onContinue={() => onSubmit?.({ plan, billing })}
      {...props}
    >
      <div className="flex flex-wrap items-center gap-3">
        <ToggleGroup type="single" variant="segmented" aria-label="Billing period" value={billing} onValueChange={v => v && setBilling(v as 'monthly' | 'yearly')}>
          <ToggleGroupItem value="monthly" label="Monthly" />
          <ToggleGroupItem value="yearly" label="Yearly" />
        </ToggleGroup>
        <Badge variant="soft-success" shape="pill">Save 20% with yearly</Badge>
      </div>
      <OptionCardGroup aria-label="Plan" value={plan} onValueChange={setPlan} className="w-full">
        {plans.map(p => (
          <OptionCard
            key={p.id}
            value={p.id}
            className="w-full"
            title={<span className="text-xl leading-7 font-medium">{p.name}</span>}
            description={
              <span className="flex flex-col gap-2 @min-[560px]:flex-row @min-[560px]:items-end @min-[560px]:justify-between @min-[560px]:gap-6">
                <span className="max-w-64">{p.description}</span>
                <span data-slot="plan-price" className="flex shrink-0 items-baseline gap-2 text-foreground">
                  {billing === 'yearly' ? <s className="text-sm text-muted-foreground"><span className="sr-only">Was </span>€{p.monthly}</s> : null}
                  <span className="text-3xl leading-9 font-semibold">€{billing === 'yearly' ? p.yearly : p.monthly}</span>
                  <span className="text-sm text-muted-foreground">per user / month</span>
                </span>
              </span>
            }
          />
        ))}
      </OptionCardGroup>
      <div className="flex flex-col gap-3">
        <ul aria-label="Every trial" className="m-0 flex flex-wrap gap-x-6 gap-y-2 p-0">
          {['No card needed', 'Switch or cancel any time', 'Export your data'].map(t => <CheckItem key={t} stateText={{ check: '' }}>{t}</CheckItem>)}
        </ul>
        <p className="m-0 text-sm leading-5 text-muted-foreground">Your trial ends on {trialEnd}. We remind you 3 days before, and nothing is charged unless you add a card.</p>
      </div>
      <div className="-mt-4 flex justify-end">
        <Button type="button" variant="link" onClick={onSkip}>Skip, stay on Free</Button>
      </div>
    </OnboardingStep>
  );
}
