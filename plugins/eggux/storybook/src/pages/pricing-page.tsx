import * as React from 'react';
import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ComparisonTable, PlanCard, PlanFeature, Price } from '@/components/ui/pricing';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { SitePage } from './site-parts';

type Period = 'monthly' | 'yearly';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'For a small team that wants to stop chasing late invoices.',
    monthly: 19,
    features: ['Up to 5 users', 'Unlimited invoices', 'Automatic payment reminders', 'Email support'],
  },
  {
    id: 'business',
    name: 'Business',
    badge: 'Most popular',
    description: 'For finance teams that approve and report every week.',
    monthly: 39,
    features: ['Everything in Starter', 'Unlimited users', 'Approval workflows with deadlines', 'Reports and exports', 'Priority support'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For groups with several entities and strict security needs.',
    features: ['Everything in Business', 'Single sign-on and audit log', 'Dedicated success manager', 'Data processing agreement'],
  },
];

const comparison = [
  { label: 'Core', rows: [{ feature: 'Users', values: ['Up to 5', 'Unlimited', 'Unlimited'] }, { feature: 'Invoices', values: [true, true, true] }, { feature: 'Payment reminders', values: [true, true, true] }] },
  { label: 'Teamwork', rows: [{ feature: 'Approval workflows', values: [false, true, true] }, { feature: 'Reports and exports', values: [false, true, true] }, { feature: 'Several entities', values: [false, false, true] }] },
  { label: 'Security and support', rows: [{ feature: 'Single sign-on', values: [false, false, true] }, { feature: 'Audit log', values: [false, false, true] }, { feature: 'Support', values: ['Email', 'Priority', 'Dedicated manager'] }] },
];

const faq = [
  ['Can I change plan later?', 'Yes. Upgrade or downgrade at any time; we prorate the difference on your next invoice.'],
  ['Is there a free trial?', 'Every plan starts with 14 days free. No card needed until you choose a plan.'],
  ['What does a seat mean?', 'A seat is a person who can sign in. People you only send invoices to are free.'],
  ['Do you offer discounts for non-profits?', 'Yes, 30% off Business. Write to us with your registration number.'],
] as const;

const price = (monthly: number, period: Period) => (period === 'yearly' ? Math.round(monthly * 0.8) : monthly);

/** Pricing: a billing switch, three plans (the middle one featured), a comparison table, FAQ and a closing call to action. */
export function PricingPage({ defaultPeriod = 'monthly' }: { defaultPeriod?: Period }) {
  const [period, setPeriod] = React.useState<Period>(defaultPeriod);
  const priced = (p: (typeof plans)[number]) =>
    p.monthly ? <Price amount={`€${price(p.monthly, period)}`} period={period === 'yearly' ? 'per seat / month, billed yearly' : 'per seat / month'} /> : <p className="m-0 text-3xl leading-9 font-semibold">Let’s talk</p>;
  const action = (p: (typeof plans)[number]) => (
    <Button asChild variant={p.id === 'business' ? 'default' : 'outline'} className="w-full">
      <a href={p.monthly ? '#signup' : '#contact'}>{p.monthly ? 'Start free trial' : 'Contact sales'}</a>
    </Button>
  );

  return (
    <SitePage active="Pricing">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-16">
        <header className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <p className="m-0 text-sm leading-5 font-medium text-brand">Pricing</p>
          <h1 className="m-0 text-4xl leading-10 font-semibold tracking-[-0.4px] sm:text-5xl sm:leading-[3.25rem]">Simple pricing, for the whole team</h1>
          <p className="m-0 text-lg leading-7 text-muted-foreground">Start free for 14 days. Pay per seat, and change your plan whenever you need to.</p>
          <ToggleGroup type="single" value={period} onValueChange={v => v && setPeriod(v as Period)} aria-label="Billing period" variant="segmented">
            <ToggleGroupItem value="monthly" label="Monthly" />
            <ToggleGroupItem value="yearly" label="Yearly, save 20%" />
          </ToggleGroup>
        </header>

        <section aria-label="Plans">
          <ul className="m-0 grid list-none items-stretch gap-6 p-0 lg:grid-cols-3">
            {plans.map(p => (
              <li key={p.id} className="flex">
                <PlanCard
                  className="w-full"
                  variant={p.id === 'business' ? 'featured' : 'default'}
                  title={p.name}
                  badge={p.badge}
                  description={p.description}
                  price={priced(p)}
                  action={action(p)}
                  featuresTitle={p.id === 'starter' ? 'Includes:' : undefined}
                  features={p.features.map(f => <PlanFeature key={f} stateText={{ check: 'Included: ' }}>{f}</PlanFeature>)}
                  headingLevel={2}
                />
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="compare-title" className="flex flex-col gap-4">
          <h2 id="compare-title" className="m-0 text-2xl leading-8 font-semibold tracking-[-0.4px]">Compare plans</h2>
          <div className="overflow-x-auto">
            <ComparisonTable
              caption="Compare plans"
              plans={plans.map(p => ({ id: p.id, name: p.name, badge: p.badge, price: p.monthly ? `€${price(p.monthly, period)} per seat / month${period === 'yearly' ? ', billed yearly' : ''}` : 'Custom', action: action(p) }))}
              groups={comparison}
            />
          </div>
        </section>

        <section aria-labelledby="faq-title" className="mx-auto flex w-full max-w-3xl flex-col gap-4">
          <h2 id="faq-title" className="m-0 text-2xl leading-8 font-semibold tracking-[-0.4px]">Questions about pricing</h2>
          <Accordion type="single" collapsible defaultValue="change">
            {faq.map(([q, a], i) => (
              <AccordionItem key={q} value={i === 0 ? 'change' : `q${i}`} title={q}><p className="m-0">{a}</p></AccordionItem>
            ))}
          </Accordion>
        </section>

        <section aria-labelledby="cta-title" className="flex flex-col items-center gap-4 rounded-xl bg-primary px-6 py-12 text-center text-primary-foreground">
          <h2 id="cta-title" className="m-0 text-3xl leading-9 font-semibold tracking-[-0.4px]">Close your next month in days, not weeks</h2>
          <p className="m-0 max-w-xl text-base leading-6">Try Acme free for 14 days. No card needed, cancel any time.</p>
          <Button asChild variant="secondary" size="lg"><a href="#signup">Start free trial</a></Button>
        </section>
      </div>
    </SitePage>
  );
}
