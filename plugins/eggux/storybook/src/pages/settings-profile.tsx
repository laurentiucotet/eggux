import * as React from 'react';
import { Bell, Lock, Mail, Smartphone } from '@/components/icons';
import { Alert } from '@/components/ui/alert';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { FormSection } from '@/components/ui/form-layout';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { SaveBar, type SaveBarState } from '@/components/ui/save-bar';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleCard } from '@/components/ui/toggle-card';
import { AppShell } from './app-parts';

const languages = ['English', 'Romanian', 'German', 'French'];
const zones = ['Europe/Bucharest (UTC+2)', 'Europe/Berlin (UTC+1)', 'Europe/London (UTC+0)', 'America/New_York (UTC-5)'];
const demoPhoto =
  "data:image/svg+xml;utf8," +
  encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'><rect width='96' height='96' fill='#6d6aa8'/><circle cx='48' cy='38' r='16' fill='#e8e6f5'/><rect x='18' y='60' width='60' height='40' rx='24' fill='#e8e6f5'/></svg>");

interface Profile {
  name: string;
  email: string;
  job: string;
  language: string;
  zone: string;
  photo: boolean;
}
const saved: Profile = { name: 'Daniel Pop', email: 'daniel@acme.com', job: 'Finance lead', language: 'English', zone: zones[0]!, photo: false };

type Errors = { name?: string; email?: string };
const validate = (p: Profile): Errors => ({
  name: p.name.trim() ? undefined : 'Enter your name.',
  email: !p.email.trim() ? 'Enter your email address.' : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(p.email.trim()) ? undefined : 'Enter an email address like name@company.com.',
});
const initialsOf = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]!.toUpperCase()).join('') || '?';

type PasswordErrors = { current?: string; next?: string; confirm?: string };

export interface SettingsProfilePageProps {
  /** Tab shown first. */
  tab?: 'profile' | 'security' | 'notifications';
  /** Start with an edited form, so the Save Bar shows. */
  edited?: boolean;
  /** Start with the Save Bar in its error state and the messages on the fields. */
  showErrors?: boolean;
}

/** Settings, Profile: a form with a Save Bar for unsaved changes, security (password, two-step) and notifications. */
export function SettingsProfilePage({ tab = 'profile', edited = false, showErrors = false }: SettingsProfilePageProps) {
  const [current, setCurrent] = React.useState(tab);
  const [base, setBase] = React.useState<Profile>(saved);
  const [form, setForm] = React.useState<Profile>(
    showErrors ? { ...saved, name: '', email: 'daniel@acme' } : edited ? { ...saved, job: 'Head of finance', language: 'Romanian' } : saved,
  );
  const [errors, setErrors] = React.useState<Errors>(showErrors ? validate({ ...saved, name: '', email: 'daniel@acme' }) : {});
  const [barState, setBarState] = React.useState<SaveBarState>(showErrors ? 'error' : 'default');
  const [justSaved, setJustSaved] = React.useState(false);

  const changes = (['name', 'email', 'job', 'language', 'zone', 'photo'] as const).filter(k => form[k] !== base[k]).length;
  const set = <K extends keyof Profile>(key: K, value: Profile[K]) => {
    setForm(f => ({ ...f, [key]: value }));
    setJustSaved(false);
    if (barState === 'error') setBarState('default');
    if (key === 'name' || key === 'email') setErrors(e => ({ ...e, [key]: undefined }));
  };

  const save = () => {
    const next = validate(form);
    setErrors(next);
    if (next.name || next.email) {
      setBarState('error');
      return;
    }
    setBarState('saving');
    window.setTimeout(() => {
      setBase(form);
      setBarState('default');
      setJustSaved(true);
    }, 300);
  };
  const discard = () => {
    setForm(base);
    setErrors({});
    setBarState('default');
  };

  /* Security */
  const [pw, setPw] = React.useState({ current: '', next: '', confirm: '' });
  const [pwErrors, setPwErrors] = React.useState<PasswordErrors>({});
  const [pwDone, setPwDone] = React.useState(false);
  const [twoStep, setTwoStep] = React.useState(false);
  const [signInAlerts, setSignInAlerts] = React.useState(true);
  const updatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const next: PasswordErrors = {
      current: pw.current ? undefined : 'Enter your current password.',
      next: pw.next.length >= 8 ? undefined : 'Use at least 8 characters.',
      confirm: pw.confirm === pw.next && pw.confirm ? undefined : 'The passwords do not match.',
    };
    setPwErrors(next);
    setPwDone(false);
    if (!next.current && !next.next && !next.confirm) {
      setPw({ current: '', next: '', confirm: '' });
      setPwDone(true);
    }
  };

  /* Notifications */
  const [notes, setNotes] = React.useState({ email: true, invoices: true, product: false, push: false });

  return (
    <AppShell active="settings" title="Profile" trail={[{ label: 'Settings', href: '#settings' }]}>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <PageHeader title="Profile" description="Your personal details, sign-in security and the messages we send you." />
        <Tabs variant="line" value={current} onValueChange={v => setCurrent(v as typeof current)}>
          <TabsList aria-label="Settings sections">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="flex flex-col gap-6 pt-6">
            {justSaved && changes === 0 ? <Alert variant="success" title="Profile saved" description="Your changes are live." onDismiss={() => setJustSaved(false)} /> : null}
            <form noValidate onSubmit={e => { e.preventDefault(); save(); }} aria-label="Profile details" className="flex flex-col gap-6">
              <FormSection title="Photo" description="Shown next to your name in comments and on invoices." layout="stacked" divider={false}>
                <div className="flex flex-wrap items-center gap-4">
                  <Avatar size="2xl" name={form.name} initials={initialsOf(form.name)} src={form.photo ? demoPhoto : undefined} />
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => set('photo', true)}>Upload photo</Button>
                    <Button type="button" variant="ghost" size="sm" disabled={!form.photo} onClick={() => set('photo', false)}>Remove photo</Button>
                  </div>
                </div>
              </FormSection>
              <FormSection title="Personal details" description="We use your email for sign in and receipts." layout="stacked" divider={false}>
                <Field label="Full name" error={errors.name} required>
                  <Input autoComplete="name" value={form.name} onChange={e => set('name', e.target.value)} />
                </Field>
                <Field label="Email" error={errors.email} required>
                  <Input type="email" autoComplete="email" value={form.email} onChange={e => set('email', e.target.value)} />
                </Field>
                <Field label="Job title" optional>
                  <Input autoComplete="organization-title" value={form.job} onChange={e => set('job', e.target.value)} />
                </Field>
              </FormSection>
              <FormSection title="Region" description="Dates, times and number formats follow these." layout="stacked" divider={false}>
                <Field label="Language">
                  <Select value={form.language} onValueChange={v => set('language', v)}>
                    <SelectTrigger />
                    <SelectContent>{languages.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
                <Field label="Time zone">
                  <Select value={form.zone} onValueChange={v => set('zone', v)}>
                    <SelectTrigger />
                    <SelectContent>{zones.map(z => <SelectItem key={z} value={z}>{z}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
              </FormSection>
            </form>
            {changes > 0 ? (
              <SaveBar
                className="sticky bottom-20 z-10 lg:bottom-4"
                state={barState}
                message={barState === 'error' ? 'Fix the highlighted fields to save.' : `${changes} unsaved ${changes === 1 ? 'change' : 'changes'}`}
                onSave={save}
                onDiscard={discard}
              />
            ) : null}
          </TabsContent>

          <TabsContent value="security" className="flex flex-col gap-8 pt-6">
            <FormSection title="Password" description="Use a password you do not use anywhere else." layout="stacked" divider>
              {pwDone ? <Alert variant="success" title="Password updated" description="Use the new password the next time you sign in." /> : null}
              <form noValidate onSubmit={updatePassword} aria-label="Change password" className="flex flex-col gap-4">
                <Field label="Current password" error={pwErrors.current} required>
                  <Input type="password" autoComplete="current-password" value={pw.current} onChange={e => setPw(p => ({ ...p, current: e.target.value }))} />
                </Field>
                <Field label="New password" hint="At least 8 characters." error={pwErrors.next} required>
                  <Input type="password" autoComplete="new-password" value={pw.next} onChange={e => setPw(p => ({ ...p, next: e.target.value }))} />
                </Field>
                <Field label="Confirm new password" error={pwErrors.confirm} required>
                  <Input type="password" autoComplete="new-password" value={pw.confirm} onChange={e => setPw(p => ({ ...p, confirm: e.target.value }))} />
                </Field>
                <div><Button type="submit">Update password</Button></div>
              </form>
            </FormSection>
            <FormSection title="Sign-in protection" description="These apply as soon as you switch them." layout="stacked" divider={false}>
              <ToggleCard icon={<Smartphone />} title="Two-step sign in" description="Ask for a code from your authenticator app after the password." checked={twoStep} onCheckedChange={setTwoStep} />
              <ToggleCard icon={<Lock />} title="Sign-in alerts" description="Email me when someone signs in from a new device." checked={signInAlerts} onCheckedChange={setSignInAlerts} />
            </FormSection>
          </TabsContent>

          <TabsContent value="notifications" className="flex flex-col gap-6 pt-6">
            <FormSection title="Email" description="Changes here are saved as you switch them." layout="stacked" divider={false}>
              <ToggleCard icon={<Mail />} title="Account email" description="Receipts, security notices and changes to your plan." checked={notes.email} onCheckedChange={v => setNotes(n => ({ ...n, email: v }))} />
              <ToggleCard icon={<Bell />} title="Invoice reminders" description="A reminder three days before an invoice is due." checked={notes.invoices} onCheckedChange={v => setNotes(n => ({ ...n, invoices: v }))} />
              <ToggleCard icon={<Mail />} title="Product news" description="A short note when we ship something new, at most once a month." checked={notes.product} onCheckedChange={v => setNotes(n => ({ ...n, product: v }))} />
            </FormSection>
            <FormSection title="On your phone" layout="stacked" divider={false}>
              <ToggleCard icon={<Smartphone />} title="Push notifications" description="Approvals and payment alerts on your phone." checked={notes.push} onCheckedChange={v => setNotes(n => ({ ...n, push: v }))} />
            </FormSection>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
