// EGG UI Cookie Consent. Figma: Cookie Consent (Cookie Consent page, "Cookie Consent / Component",
// 277:971). Type (banner, card, preferences). Consent for non-essential cookies (GDPR, ePrivacy).
// banner: full width at the bottom of a marketing site, card bg, top border, shadow md, 40 / 16 px
// padding, text (title ui/label, body body/small muted, "Cookie policy" link) and Customize (ghost),
// Reject all and Accept all (outline, same weight) on the right; it wraps on narrow screens.
// card: 400 wide in the bottom-left corner of an app, border, radius lg, 24 padding, 16 gap, Reject
// and Accept side by side, Customize under them. preferences: a 560 Dialog with categories (title,
// description, Switch), Necessary always on (disabled, says so), Reject all, Accept all and Save
// choices. Optional categories start off. Never block the page; remember the choice.
// A11y: banner and card are a region labelled by the title (not modal); preferences is a modal
// Dialog; each Switch is labelled by its category and described by its description.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Dialog, DialogContent } from './dialog';
import { DialogHeader } from './dialog-header';
import { Switch } from './switch';

export interface CookieConsentProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  type?: 'banner' | 'card';
  title?: string;
  body?: React.ReactNode;
  policyHref?: string;
  onAcceptAll?: () => void;
  onRejectAll?: () => void;
  onCustomize?: () => void;
  labels?: Partial<{ policy: string; accept: string; reject: string; customize: string }>;
}

function CookieConsent({
  type = 'banner',
  title = 'We use cookies',
  body = 'We use cookies to keep you signed in and remember your settings. With your consent, we also measure how Acme is used and show relevant ads.',
  policyHref = '#cookie-policy',
  onAcceptAll,
  onRejectAll,
  onCustomize,
  labels,
  className,
  ...props
}: CookieConsentProps) {
  const L = { policy: 'Cookie policy', accept: 'Accept all', reject: 'Reject all', customize: 'Customize', ...labels };
  const titleId = React.useId();
  const card = type === 'card';
  const text = (
    <div className={cn('flex min-w-0 flex-col gap-1', card ? 'w-full' : 'min-w-[min(100%,28rem)] flex-1')}>
      <h2 id={titleId} className="m-0 text-sm leading-5 font-medium text-card-foreground">{title}</h2>
      <p className="m-0 text-sm leading-5 text-muted-foreground">{body}</p>
      <a href={policyHref} className="self-start text-sm leading-5 text-foreground underline underline-offset-2 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">{L.policy}</a>
    </div>
  );
  return (
    <div
      data-slot="cookie-consent"
      data-type={type}
      role="region"
      aria-labelledby={titleId}
      className={cn(
        'bg-card text-card-foreground shadow-md',
        card ? 'flex w-full max-w-[400px] flex-col gap-4 rounded-lg border border-border p-6' : 'flex w-full flex-wrap items-center gap-x-6 gap-y-3 border-t border-border px-10 py-4',
        className,
      )}
      {...props}
    >
      {text}
      {card ? (
        <>
          <div className="flex w-full gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={onRejectAll}>{L.reject}</Button>
            <Button variant="outline" size="sm" className="flex-1" onClick={onAcceptAll}>{L.accept}</Button>
          </div>
          <Button variant="ghost" size="sm" className="w-full" onClick={onCustomize}>{L.customize}</Button>
        </>
      ) : (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onCustomize}>{L.customize}</Button>
          <Button variant="outline" size="sm" onClick={onRejectAll}>{L.reject}</Button>
          <Button variant="outline" size="sm" onClick={onAcceptAll}>{L.accept}</Button>
        </div>
      )}
    </div>
  );
}

export interface CookieCategory {
  id: string;
  label: string;
  description: string;
  /** Necessary: always on, disabled. */
  required?: boolean;
}

export interface CookiePreferencesProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  categories: CookieCategory[];
  /** Ids of the optional categories that are on; they start off. */
  defaultValue?: string[];
  onSave?: (ids: string[]) => void;
  title?: string;
  description?: string;
  labels?: Partial<{ accept: string; reject: string; save: string; alwaysOn: string }>;
}

function CookiePreferences({
  open,
  onOpenChange,
  categories,
  defaultValue = [],
  onSave,
  title = 'Cookie preferences',
  description = 'Choose which cookies Acme may use. You can change this later in Settings.',
  labels,
}: CookiePreferencesProps) {
  const L = { accept: 'Accept all', reject: 'Reject all', save: 'Save choices', alwaysOn: 'Always on', ...labels };
  const [on, setOn] = React.useState<string[]>(defaultValue);
  const optional = categories.filter(c => !c.required).map(c => c.id);
  // Opened from Customize or a footer link, not a DialogTrigger: return focus to whatever opened it.
  const opener = React.useRef<HTMLElement | null>(null);
  React.useLayoutEffect(() => {
    if (open) opener.current = document.activeElement as HTMLElement | null;
  }, [open]);
  const finish = (ids: string[]) => {
    onSave?.(ids);
    onOpenChange?.(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-slot="cookie-preferences"
        className="max-w-[560px] gap-0 p-0"
        onCloseAutoFocus={e => {
          if (!opener.current?.isConnected) return;
          e.preventDefault();
          opener.current.focus();
        }}
      >
        <DialogHeader title={title} description={description} className="px-6 pt-4 pb-4" />
        <div data-slot="dialog-body" className="flex min-h-0 flex-col overflow-y-auto px-6">
          {categories.map((c, i) => (
            <div key={c.id} className={cn('flex items-center gap-4 py-3', i < categories.length - 1 && 'border-b border-border')}>
              <div className="flex min-w-0 flex-1 flex-col gap-1 text-sm leading-5">
                <span id={`cookie-${c.id}-label`} className="font-medium text-card-foreground">{c.label}</span>
                <span id={`cookie-${c.id}-desc`} className="text-muted-foreground">
                  {c.description}
                  {c.required ? <span className="sr-only"> {L.alwaysOn}</span> : null}
                </span>
              </div>
              <Switch
                aria-labelledby={`cookie-${c.id}-label`}
                aria-describedby={`cookie-${c.id}-desc`}
                checked={c.required ? true : on.includes(c.id)}
                disabled={c.required}
                onCheckedChange={v => setOn(v ? [...on, c.id] : on.filter(x => x !== c.id))}
              />
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2 border-t border-border px-6 py-4">
          <Button variant="outline" size="sm" onClick={() => finish([])}>{L.reject}</Button>
          <Button variant="outline" size="sm" onClick={() => finish(optional)}>{L.accept}</Button>
          <span className="flex-1" />
          <Button size="sm" onClick={() => finish(on)}>{L.save}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { CookieConsent, CookiePreferences };
