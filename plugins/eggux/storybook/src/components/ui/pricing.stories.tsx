import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { Button } from './button';
import { ComparisonTable, GateOverlay, LockBadge, MeterBanner, PaywallCard, PlanCard, PlanFeature, PlanOptions, Price, TrialBanner, UpsellCard, UsageLimitBanner } from './pricing';

const features = ['Approvals with limits per entity', 'Audit log, kept 7 years', 'SSO with Okta and Entra ID', 'Priority support'];

const meta = {
  title: 'Components/Pricing/Plan Card',
  component: PlanCard,
  parameters: { controls: { disable: true },
    layout: 'padded',
    docs: { description: { component: 'Pricing and monetization. Price, Plan Card (default, featured, inverted, compact) and Comparison Table for pricing pages; Plan Option Row and Paywall Card for subscriptions; Meter Banner for metered content; Lock Badge, Gate Overlay and Upsell Card for paid features in the app; Usage Limit Banner and Trial Banner for limits and trials. One featured or inverted plan per section; prices, periods, renewal and how to cancel are always next to the action. Figma: Pricing page. Guide: eggux build-ui/patterns/marketing-pages.md, patterns/monetization.md' } },
  },
  args: { title: 'Business', price: null, action: null },
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-6">
        {(['default', 'featured', 'inverted'] as const).map(v => (
          <div key={v} className="w-[352px]">
            <PlanCard
              variant={v}
              title={v === 'default' ? 'Starter' : 'Business'}
              badge={v === 'default' ? undefined : 'Most popular'}
              description="For finance teams that approve and report every week."
              price={<Price amount="€29" period="per seat / month" inverted={v === 'inverted'} />}
              action={<Button variant={v === 'featured' ? 'default' : v === 'inverted' ? 'secondary' : 'outline'}>Start free trial</Button>}
              featuresTitle="Everything in Starter, plus:"
              features={features.map(f => <PlanFeature key={f} tone={v === 'inverted' ? 'inverted' : 'default'} stateText={{ check: 'Included: ' }}>{f}</PlanFeature>)}
            />
          </div>
        ))}
      </div>
      <div className="w-[720px]">
        <PlanCard variant="compact" title="Business" description="For finance teams that approve and report every week." price={<Price amount="€29" period="per seat / month" />} action={<Button variant="outline">Start free trial</Button>} />
      </div>
      <div className="flex items-baseline gap-8">
        <Price size="sm" amount="€29" period="per seat / month" />
        <Price size="lg" amount="€29" period="per seat / month" />
        <Price size="xl" amount="€24" oldPrice="€29" period="per seat / month" />
      </div>
    </div>
  ),
} satisfies Meta<typeof PlanCard>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma: plan cards 352 wide, price default 36 / sm 28 / lg 48 / xl 61, compact 108; articles named by plan.
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const cards = canvasElement.querySelectorAll('[data-slot="plan-card"]');
    await expect(Math.round(box(cards[0]!).width)).toBe(352);
    await expect(canvas.getAllByRole('article', { name: 'Business' })).toHaveLength(3);
    // Figma 108: the description wraps there; code gives the text more room (Price hugs instead of 174).
    await expect(Math.round(box(cards[3]!).height)).toBeLessThanOrEqual(108);
    const prices = canvasElement.querySelectorAll('[data-slot="price"]');
    await expect(Math.round(box(prices[0]!).height)).toBe(36);
    const [sm, lg, xl] = [...prices].slice(-3);
    await expect(Math.round(box(sm!).height)).toBe(28);
    await expect(Math.abs(Math.round(box(lg!).height) - 48)).toBeLessThanOrEqual(1);
    await expect(Math.round(box(xl!).height)).toBeGreaterThanOrEqual(60);
    await expect(xl).toHaveTextContent('was €29now €24');
    await expect(canvas.getAllByText('Included:', { exact: false }).length).toBeGreaterThan(0);
  },
};

// Comparison table: plans as column headers, groups, check / dash / text values.
export const Comparison: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-[1152px]">
      <ComparisonTable
        plans={[
          { id: 'starter', name: 'Starter', price: <Price size="sm" amount="€12" period="/ seat" />, action: <Button size="sm" variant="outline">Choose Starter</Button> },
          { id: 'team', name: 'Team', badge: 'Popular', price: <Price size="sm" amount="€29" period="/ seat" />, action: <Button size="sm">Choose Team</Button> },
          { id: 'ent', name: 'Enterprise', price: <p className="m-0 text-xl leading-7 font-semibold">Custom</p>, action: <Button size="sm" variant="outline">Contact sales</Button> },
        ]}
        groups={[
          { label: 'Core', rows: [{ feature: 'Projects', values: ['Unlimited', 'Unlimited', 'Unlimited'] }, { feature: 'Storage', values: ['5 GB', '100 GB', '1 TB'] }, { feature: 'Client portal', values: [false, true, true] }] },
          { label: 'Security', rows: [{ feature: 'SSO (SAML)', values: [false, false, true] }, { feature: 'Uptime SLA', values: [false, false, '99.9%'] }] },
        ]}
      />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const table = canvas.getByRole('table', { name: 'Compare plans' });
    await expect(canvas.getByRole('columnheader', { name: /Team/ })).toBeInTheDocument();
    await expect(Math.round(box(table.querySelector('thead tr')!).height)).toBe(129);
    const row = canvasElement.querySelector('[data-slot="comparison-row"]')!;
    await expect(Math.round(box(row).height)).toBe(53);
    await expect(canvas.getByRole('rowheader', { name: 'SSO (SAML)' }).parentElement).toHaveTextContent('SSO (SAML)Not includedNot includedIncluded');
    await expect(Math.round(box(canvasElement.querySelector('[data-slot="comparison-group"]')!).height)).toBe(64);
  },
};

// Paywall: plan options radiogroup, meter banner, lock badges.
export const Paywall: Story = {
  render: function Render() {
    const [plan, setPlan] = React.useState('yearly');
    return (
      <div className="flex flex-col gap-6">
        <div className="w-[560px]">
          <PaywallCard
            logo={<span className="font-serif text-2xl">Northbeam Daily</span>}
            title="You have read your 3 free articles this month"
            description="Subscribe for unlimited reading, or come back on 1 December for 3 more free articles."
            benefits={['Unlimited articles on web and app', 'The morning briefing and all newsletters', 'The full archive since 1998'].map(b => <PlanFeature key={b} stateText={{ check: 'Included: ' }}>{b}</PlanFeature>)}
            plans={<PlanOptions label="Billing" value={plan} onValueChange={setPlan} options={[{ value: 'yearly', name: 'Yearly', price: '€49.99 per year', equivalent: '€4.17 per month', saving: 'Save 36%' }, { value: 'monthly', name: 'Monthly', price: '€6.49 per month' }]} />}
            action={<Button size="lg">Subscribe</Button>}
            onSignIn={fn()}
            finePrint="Yearly €49.99 per year or monthly €6.49 per month, VAT included. Renews automatically until you cancel. Cancel anytime in Account settings."
          />
        </div>
        <MeterBanner title="You have 2 free articles left this month" description="Subscribe for unlimited reading from €6.49 per month. Cancel anytime." onSignIn={fn()} onSubscribe={fn()} onDismiss={fn()} />
        <div className="flex items-center gap-4">
          <LockBadge label="Pro" /><LockBadge label="Pro" tone="brand" /><LockBadge label="Pro" size="sm" /><LockBadge label="Pro" size="sm" tone="brand" />
        </div>
      </div>
    );
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('region', { name: 'You have read your 3 free articles this month' })).toBeInTheDocument();
    const yearly = canvas.getByRole('radio', { name: /Yearly/ });
    await expect(yearly).toHaveAttribute('aria-checked', 'true');
    // 72 without a trial line (Figma 88 includes the 7-day trial line).
    await expect(Math.round(box(yearly).height)).toBe(72);
    yearly.focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('radio', { name: /Monthly/ })).toHaveAttribute('aria-checked', 'true');
    await expect(canvas.getByRole('radio', { name: /Monthly/ })).toHaveFocus();
    const banner = canvas.getByRole('region', { name: 'Free articles' });
    await expect(Math.round(box(banner).height)).toBe(75);
    const badges = canvasElement.querySelectorAll('[data-slot="lock-badge"]');
    await expect(Math.round(box(badges[0]!).height)).toBe(20);
    await expect(Math.round(box(badges[2]!).height)).toBe(16);
    await expect(badges[0]).toHaveTextContent('Requires Pro');
  },
};

// In-app: gate overlay over a blurred preview, usage limit banners, trial banners, upsell card.
export const InApp: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="h-[420px] w-[720px]">
        <GateOverlay
          className="h-full"
          plan="Business"
          title="Unlock revenue reports"
          description="See revenue by client, month and project, and export it to your accountant. Included in Business."
          onUpgrade={fn()}
          onSeePlans={fn()}
          note="€24 per user per month, billed yearly. Cancel anytime in Settings."
          preview={<div className="flex h-full flex-col gap-4 rounded-xl border border-border bg-card p-6"><p className="m-0 text-xl font-semibold">Revenue vs costs</p><a href="#r">Open report</a><div className="flex flex-1 items-end gap-4">{[40, 60, 75, 65, 80, 90].map((h, i) => <div key={i} className="flex-1 rounded-t-sm bg-[var(--chart-1)]" style={{ height: `${h}%` }} />)}</div></div>}
        />
      </div>
      <UsageLimitBanner title="You have used 80% of your AI credits" description="8,000 of 10,000 credits used. They reset on 1 Dec 2026, or add 5,000 credits now for €15." used={8000} limit={10000} onUpgrade={fn()} onBuyMore={fn()} onDismiss={fn()} />
      <div className="w-[400px]">
        <UsageLimitBanner layout="inline" status="reached" title="You have used all your AI credits" meterLabel="AI credits" used={10000} limit={10000} usage="10,000 of 10,000" resetText="Resets on 1 Dec 2026" description="AI drafts and summaries are paused until your credits reset on 1 Dec 2026. Upgrade, or buy 5,000 credits for €15." onUpgrade={fn()} onBuyMore={fn()} />
      </div>
      <TrialBanner aria-label="Trial, active" state="active" message="12 days left in your Pro trial" detail="Then €12 per user per month." onChoosePlan={fn()} onDismiss={fn()} />
      <TrialBanner aria-label="Trial, ending" state="ending" message="3 days left in your Pro trial" detail="On 1 Nov 2026 your workspace moves to Free. No charge unless you choose a plan." onChoosePlan={fn()} onDismiss={fn()} />
      <TrialBanner aria-label="Trial, ended" state="ended" message="Your Pro trial has ended" detail="Your workspace is read-only. Nothing was deleted; you can still export." onChoosePlan={fn()} onDismiss={fn()} />
      <div className="w-[240px]">
        <UpsellCard title="See your best clients" description="See which clients bring in the most revenue each month." actionLabel="Upgrade to Business" note="€24 per user per month. Cancel anytime." onDismiss={fn()} />
      </div>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    // Locked preview is out of the tab order and hidden from assistive tech.
    await expect(canvas.queryByRole('link', { name: 'Open report' })).toBeNull();
    await expect(canvas.getByRole('region', { name: 'Unlock revenue reports' })).toBeInTheDocument();
    await expect(canvas.getAllByRole('button', { name: 'Upgrade to Business' })).toHaveLength(2);
    const [banner, inline] = canvasElement.querySelectorAll('[data-slot="usage-limit-banner"]');
    await expect(Math.round(box(banner!).height)).toBe(92);
    await expect(canvas.getByRole('progressbar', { name: '80% used' })).toBeInTheDocument();
    await expect(inline).toHaveAttribute('data-status', 'reached');
    await expect(inline!.querySelector('button[aria-label="Dismiss"]')).toBeNull();
    const trials = canvas.getAllByRole('region', { name: /^Trial/ });
    await expect(Math.round(box(trials[0]!).height)).toBe(48);
    await expect(trials[2]!.querySelector('[aria-label="Dismiss for today"]')).toBeNull();
    const upsell = canvasElement.querySelector('[data-slot="upsell-card"]')!;
    await expect(Math.round(box(upsell).height)).toBe(238);
    await expect(canvas.getByRole('button', { name: 'Dismiss See your best clients' })).toBeInTheDocument();
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
export const InAppDark: Story = { parameters: { controls: { disable: true } }, tags: ['!dev'], globals: { theme: 'Dark' }, render: InApp.render };
export const PaywallDark: Story = { parameters: { controls: { disable: true } }, tags: ['!dev'], globals: { theme: 'Dark' }, render: Paywall.render };
