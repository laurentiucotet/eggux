import * as React from 'react';
import { Bell, ShieldCheck, Sparkles } from '@/components/icons';
import { Alert } from '@/components/ui/alert';
import { BottomActionBar } from '@/components/ui/bottom-action-bar';
import { Button } from '@/components/ui/button';
import { IconTile } from '@/components/ui/icon-tile';
import { MobileHeader } from '@/components/ui/mobile-header';
import { PageDots } from '@/components/ui/page-dots';
import { PhoneScreen } from './mobile-parts';

export const onboardingSteps = [
  { icon: <Sparkles />, title: 'Everything in one place', description: 'Invoices, customers and reports live together, so you stop switching between tools.' },
  { icon: <Bell />, title: 'Know when it matters', description: 'Get a quiet nudge when an invoice is paid or a customer needs an answer. Nothing else.' },
  { icon: <ShieldCheck />, title: 'Yours and private', description: 'Your data stays encrypted, and you decide who sees what, down to a single report.' },
];

const SWIPE_DISTANCE = 48;

/** First-run intro: three steps, Page Dots, Skip, Next then Get started. Swipe, arrow keys or the dots move between steps. */
export function OnboardingPage({ initialStep = 0, initialDone = false }: { initialStep?: number; initialDone?: boolean }) {
  const [step, setStep] = React.useState(initialStep);
  const [done, setDone] = React.useState(initialDone);
  const startX = React.useRef<number | null>(null);
  const last = onboardingSteps.length - 1;
  const current = onboardingSteps[step];

  const go = (next: number) => setStep(Math.min(last, Math.max(0, next)));

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(step + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(step - 1);
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) >= SWIPE_DISTANCE) go(step + (dx < 0 ? 1 : -1));
  };

  if (done) {
    return (
      <PhoneScreen header={<MobileHeader type="brand" />} className="flex flex-col justify-center gap-6 px-4 py-8">
        <h1 className="m-0 text-2xl leading-8 font-semibold tracking-[-0.4px]">You are all set</h1>
        <Alert variant="success" title="Welcome to Acme" description="Taking you to your dashboard…" />
      </PhoneScreen>
    );
  }

  return (
    <PhoneScreen
      header={<MobileHeader type="brand" trailing={<Button type="button" variant="ghost" size="touch" onClick={() => setDone(true)}>Skip</Button>} />}
      className="flex flex-col px-6 py-6"
      footer={
        <BottomActionBar label="Onboarding actions">
          <Button type="button" size="touch" onClick={() => (step === last ? setDone(true) : go(step + 1))}>
            {step === last ? 'Get started' : 'Next'}
          </Button>
        </BottomActionBar>
      }
    >
      <div
        role="group"
        aria-roledescription="carousel"
        aria-label="Welcome steps"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={e => (startX.current = e.clientX)}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (startX.current = null)}
        className="flex flex-1 touch-pan-y flex-col items-center justify-center gap-8 rounded-xl text-center outline-none select-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <div aria-hidden="true" className="flex aspect-square w-full max-w-64 items-center justify-center rounded-3xl bg-muted">
          <IconTile tileStyle="brand" size="lg" icon={current.icon} className="size-24 rounded-3xl [&_svg]:size-12" />
        </div>
        <div aria-live="polite" className="flex flex-col gap-2">
          <p className="m-0 text-xs leading-4 font-medium text-muted-foreground">{`Step ${step + 1} of ${onboardingSteps.length}`}</p>
          <h1 className="m-0 text-2xl leading-8 font-semibold tracking-[-0.4px]">{current.title}</h1>
          <p className="m-0 text-base leading-6 text-muted-foreground">{current.description}</p>
        </div>
        <PageDots count={onboardingSteps.length} current={step} onSelect={go} label="Welcome steps progress" />
      </div>
    </PhoneScreen>
  );
}
