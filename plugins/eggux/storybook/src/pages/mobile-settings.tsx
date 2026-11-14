import * as React from 'react';
import { Bell, ChevronRight, Mail, Receipt } from '@/components/icons';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog';
import { Avatar } from '@/components/ui/avatar';
import { BottomNav, BottomNavItem } from '@/components/ui/bottom-nav';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerBody, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { EmptyState } from '@/components/ui/empty-state';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { ListItem } from '@/components/ui/list';
import { MobileHeader } from '@/components/ui/mobile-header';
import { SettingRow } from '@/components/ui/setting-row';
import { ToggleCard } from '@/components/ui/toggle-card';
import { WheelColumn, WheelPicker } from '@/components/ui/wheel-picker';
import { destinations } from './app-parts';
import { PhoneScreen } from './mobile-parts';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch', englishName: 'German' },
  { code: 'fr', name: 'Français', englishName: 'French' },
  { code: 'ro', name: 'Română', englishName: 'Romanian' },
];

const pad = (n: number) => String(n).padStart(2, '0');
const hours = Array.from({ length: 24 }, (_, i) => ({ value: pad(i), label: pad(i) }));
const minutes = Array.from({ length: 12 }, (_, i) => ({ value: pad(i * 5), label: pad(i * 5) }));

export interface MobileSettingsPageProps {
  /** "08:30". */
  initialTime?: string;
  /** Open the time sheet at the start. */
  initialTimeOpen?: boolean;
  /** Open the sign out confirmation at the start. */
  initialConfirmOpen?: boolean;
  initialSignedOut?: boolean;
}

/** Settings on a phone: profile, notification toggles, language, a daily reminder time on a wheel in a sheet, and Sign out. */
export function MobileSettingsPage({ initialTime = '08:30', initialTimeOpen = false, initialConfirmOpen = false, initialSignedOut = false }: MobileSettingsPageProps) {
  const [push, setPush] = React.useState(true);
  const [digest, setDigest] = React.useState(false);
  const [reminders, setReminders] = React.useState(true);
  const [language, setLanguage] = React.useState('en');
  const [time, setTime] = React.useState(initialTime);
  const [draft, setDraft] = React.useState(initialTime);
  const [timeOpen, setTimeOpen] = React.useState(initialTimeOpen);
  const [confirmOpen, setConfirmOpen] = React.useState(initialConfirmOpen);
  const [signedOut, setSignedOut] = React.useState(initialSignedOut);
  const [message, setMessage] = React.useState('');

  const [draftHour = '08', draftMinute = '30'] = draft.split(':');

  const header = <MobileHeader type="app" size="large" title="Settings" />;

  if (signedOut) {
    return (
      <PhoneScreen header={header}>
        <EmptyState size="sm" title="You are signed out" description="Your settings stay on this account. Sign in again to change them." headingLevel={2} actions={<Button asChild size="touch"><a href="#login">Sign in</a></Button>} />
      </PhoneScreen>
    );
  }

  return (
    <PhoneScreen
      header={header}
      className="px-4 pt-2 pb-6"
      footer={
        <BottomNav>
          {destinations.map(d => (
            <BottomNavItem key={d.id} href={`#${d.id}`} icon={d.icon} label={d.label} active={d.id === 'settings'} badge={d.badge} />
          ))}
        </BottomNav>
      }
    >
      <div className="flex flex-col gap-6">
        <ul aria-label="Profile" className="m-0 list-none rounded-lg border border-border p-1">
          <ListItem
            href="#profile"
            title="Daniel Pop"
            description="daniel@acme.com"
            leading={<Avatar initials="DP" size="xl" />}
            trailing={<ChevronRight aria-hidden="true" />}
            className="min-h-16"
          />
        </ul>

        <p role="status" className="sr-only">{message}</p>

        <div className="flex flex-col gap-3">
          <h2 className="m-0 text-base leading-6 font-semibold">Notifications</h2>
          <ToggleCard icon={<Bell />} title="Push notifications" description="When an invoice is paid or goes overdue." checked={push} onCheckedChange={setPush} />
          <ToggleCard icon={<Mail />} title="Weekly email digest" description="Monday summary of what is open." checked={digest} onCheckedChange={setDigest} />
          <ToggleCard icon={<Receipt />} title="Payment reminders" description="Ask customers before an invoice is due." checked={reminders} onCheckedChange={setReminders} />
        </div>

        <div className="flex flex-col">
          <h2 className="m-0 text-base leading-6 font-semibold">Preferences</h2>
          <SettingRow title="Language" description="Used in the app and in emails you send.">
            <LanguageSwitcher
              languages={languages}
              value={language}
              onValueChange={code => {
                setLanguage(code);
                setMessage(`Language changed to ${languages.find(l => l.code === code)?.name}.`);
              }}
              aria-label={`Language: ${languages.find(l => l.code === language)?.name}`}
              className="min-h-11 w-36"
            />
          </SettingRow>
          <SettingRow title="Daily reminder time" description="When we remind you about open invoices." showDivider={false}>
            <Drawer
              open={timeOpen}
              onOpenChange={open => {
                setTimeOpen(open);
                if (open) setDraft(time);
              }}
            >
              <DrawerTrigger asChild>
                <Button type="button" variant="outline" size="touch" className="min-w-20 tabular-nums">{time}</Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader className="items-center text-center">
                  <DrawerTitle>Daily reminder time</DrawerTitle>
                  <DrawerDescription>Scroll hours and minutes, then save.</DrawerDescription>
                </DrawerHeader>
                <DrawerBody className="items-center">
                  <WheelPicker aria-label="Reminder time" className="max-w-xs">
                    <WheelColumn label="Hours" options={hours} value={draftHour} onValueChange={h => setDraft(`${h}:${draftMinute}`)} />
                    <WheelColumn label="Minutes" options={minutes} value={draftMinute} onValueChange={m => setDraft(`${draftHour}:${m}`)} />
                  </WheelPicker>
                </DrawerBody>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button
                      type="button"
                      size="touch"
                      onClick={() => {
                        setTime(draft);
                        setMessage(`Daily reminder set to ${draft}.`);
                      }}
                    >
                      Save time
                    </Button>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Button type="button" variant="outline" size="touch">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </SettingRow>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="m-0 text-base leading-6 font-semibold">Account</h2>
          <Button type="button" variant="outline" size="touch" className="w-full text-destructive" onClick={() => setConfirmOpen(true)}>Sign out</Button>
        </div>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent type="confirm">
          <AlertDialogHeader title="Sign out of Acme?" description="You will need your email and password to get back in. Unsent drafts stay on this device." />
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setSignedOut(true)}>Sign out</AlertDialogAction>
            <AlertDialogCancel>Stay signed in</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PhoneScreen>
  );
}
