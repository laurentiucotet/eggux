import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  ComparisonTableSection,
  Pricing,
  PricingCalculator,
  PricingEnterpriseBanner,
  PricingSingle,
  PricingUsageBased,
  PricingWithComparison,
} from './section-pricing';

const meta = {
  title: 'Blocks/Sections/Pricing',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Pricing sections for marketing pages, built from the Pricing page parts (Plan Card, Price, Comparison Table, Check Item). Pricing: 2-3 plans with a billing switch. Comparison Table: the full feature table (one plan at a time on phones). Pricing Single: one plan. Pricing Calculator: seats with the exact math. Pricing with Comparison: the pricing page itself (cards, then the collapsible table, same plan order). Pricing Usage-based: tiers and an estimate that adds up. Pricing Enterprise Banner: under the plan cards instead of a fourth Enterprise card. Figma: BLOCKS / Sections (Pricing). Guide: eggux build-ui/patterns/marketing-pages.md',
      },
    },
  },
} satisfies Meta;
export default meta;

const cat = (category: string) => ({ table: { category } });
const text = (name: string, description: string, category = 'Content') => ({ name, control: 'text' as const, description, ...cat(category) });
const bool = (name: string, description: string, category = 'Content') => ({ name, control: 'boolean' as const, description, ...cat(category) });
const period = { name: 'Billing period', control: 'inline-radio' as const, options: ['monthly', 'yearly'], description: 'Starting billing period.', ...cat('Content') };

type HeaderArgs = { overline: string; title: string; description: string };
const headerArgTypes = {
  overline: text('Overline', 'Section Header overline.', 'Section Header'),
  title: text('Title', 'Section Header title: says the answer, not the topic.', 'Section Header'),
  description: text('Description', 'Section Header description.', 'Section Header'),
};

type PricingArgs = HeaderArgs & { showBilling: boolean; defaultPeriod: 'monthly' | 'yearly' };
export const Default: StoryObj<PricingArgs> = {
  name: 'Pricing',
  args: {
    overline: 'Pricing',
    title: 'Simple pricing per location',
    description: 'Every plan includes unlimited staff accounts, reminders and support in 6 languages.',
    showBilling: true,
    defaultPeriod: 'monthly',
  },
  argTypes: { ...headerArgTypes, showBilling: bool('Show billing switch', 'Monthly or yearly, with the saving.'), defaultPeriod: period },
  render: a => <Pricing key={a.defaultPeriod} header={{ overline: a.overline, title: a.title, description: a.description }} showBilling={a.showBilling} defaultPeriod={a.defaultPeriod} />,
};

export const Comparison: StoryObj<HeaderArgs> = {
  name: 'Comparison Table',
  args: { overline: 'Compare plans', title: 'Everything in each plan', description: 'All plans include unlimited projects and free updates.' },
  argTypes: headerArgTypes,
  render: a => <ComparisonTableSection header={{ overline: a.overline, title: a.title, description: a.description }} />,
};

type SingleArgs = { overline: string; title: string; description: string; amount: string; period: string; billingNote: string; showSecondary: boolean; note: string };
export const Single: StoryObj<SingleArgs> = {
  name: 'Pricing Single',
  args: {
    overline: 'Pricing',
    title: 'One plan with everything included',
    description: 'No feature gates, no add-ons. Pay per seat and cancel any time.',
    amount: '€29',
    period: 'per seat / month',
    billingNote: 'Billed yearly. €35 when billed monthly.',
    showSecondary: true,
    note: 'No credit card required. Data hosted in the EU.',
  },
  argTypes: {
    overline: text('Overline', 'Short label above the title.'),
    title: text('Title', 'Section title (h2).'),
    description: text('Description', 'One sentence on what is included.'),
    amount: text('Amount', 'Price (Price lg).', 'Price card'),
    period: text('Period', 'What the price is per.', 'Price card'),
    billingNote: text('Billing note', 'How it is billed, with the other period.', 'Price card'),
    showSecondary: bool('Show secondary action', 'Talk to sales.', 'Price card'),
    note: text('Note', 'Fine print under the buttons.', 'Price card'),
  },
  render: a => (
    <PricingSingle overline={a.overline} title={a.title} description={a.description} amount={a.amount} period={a.period} billingNote={a.billingNote} secondaryAction={a.showSecondary ? 'Talk to sales' : undefined} note={a.note} />
  ),
};

type CalcArgs = HeaderArgs & { defaultSeats: number };
export const Calculator: StoryObj<CalcArgs> = {
  name: 'Pricing Calculator',
  args: { overline: 'Pricing', title: 'Pay for the seats you use', description: 'Volume discounts apply automatically from 50 seats.', defaultSeats: 120 },
  argTypes: { ...headerArgTypes, defaultSeats: { name: 'Seats', control: { type: 'range', min: 1, max: 500 }, description: 'Starting number of seats.', ...cat('Content') } },
  render: a => <PricingCalculator key={a.defaultSeats} header={{ overline: a.overline, title: a.title, description: a.description }} defaultSeats={a.defaultSeats} />,
};

type WithComparisonArgs = HeaderArgs & { defaultPeriod: 'monthly' | 'yearly'; defaultOpen: boolean; note: string };
export const WithComparison: StoryObj<WithComparisonArgs> = {
  name: 'Pricing with Comparison',
  args: {
    overline: 'Pricing',
    title: 'Plans that grow with your invoice volume',
    description: 'Every plan includes unlimited clients, EU data residency and email support. Prices in EUR, excluding VAT.',
    defaultPeriod: 'monthly',
    defaultOpen: true,
    note: 'Prices in EUR per month, excluding VAT. Yearly billing saves 20%. Seats count only people who send or approve invoices.',
  },
  argTypes: {
    ...headerArgTypes,
    defaultPeriod: period,
    defaultOpen: bool('Comparison open', 'The full comparison starts open.'),
    note: text('Note', 'Currency, tax and what a seat is.'),
  },
  render: a => (
    <PricingWithComparison key={`${a.defaultPeriod}-${a.defaultOpen}`} header={{ overline: a.overline, title: a.title, description: a.description }} defaultPeriod={a.defaultPeriod} defaultOpen={a.defaultOpen} note={a.note} />
  ),
};

type UsageArgs = HeaderArgs & { defaultVolume: number };
export const UsageBased: StoryObj<UsageArgs> = {
  name: 'Pricing Usage-based',
  args: {
    overline: 'Pricing',
    title: 'Pay only for the invoices you send',
    description: 'Unlimited seats on every plan. The first 100 invoices each month are free, and the rate drops as you grow.',
    defaultVolume: 2500,
  },
  argTypes: { ...headerArgTypes, defaultVolume: { name: 'Invoices per month', control: { type: 'range', min: 0, max: 5000, step: 100 }, description: 'Starting estimate.', ...cat('Content') } },
  render: a => <PricingUsageBased key={a.defaultVolume} header={{ overline: a.overline, title: a.title, description: a.description }} defaultVolume={a.defaultVolume} />,
};

type EnterpriseArgs = { showBadge: boolean; title: string; description: string; priceTitle: string; priceNote: string; showSecondary: boolean; showTrust: boolean };
export const EnterpriseBanner: StoryObj<EnterpriseArgs> = {
  name: 'Pricing Enterprise Banner',
  args: {
    showBadge: true,
    title: 'Acme Enterprise for finance teams of 200 and more',
    description: 'One contract for every entity, your own approval policies and a team that knows your setup. Rolled out with you in 30 days.',
    priceTitle: 'Custom pricing',
    priceNote: 'Annual contract, volume pricing from 200 seats, invoiced in EUR.',
    showSecondary: true,
    showTrust: true,
  },
  argTypes: {
    showBadge: bool('Show badge', 'The Enterprise badge.'),
    title: text('Title', 'Section title (h2).'),
    description: text('Description', 'What the contract covers.'),
    priceTitle: text('Price title', 'Custom pricing.', 'Contact'),
    priceNote: text('Price note', 'Contract terms.', 'Contact'),
    showSecondary: bool('Show secondary action', 'Book a demo.', 'Contact'),
    showTrust: bool('Show trust', 'Certifications you hold, with what backs them.'),
  },
  render: a => (
    <PricingEnterpriseBanner
      badge={a.showBadge ? 'Enterprise' : ''}
      title={a.title}
      description={a.description}
      priceTitle={a.priceTitle}
      priceNote={a.priceNote}
      secondaryAction={a.showSecondary ? 'Book a demo' : undefined}
      certifications={a.showTrust ? undefined : []}
    />
  ),
};

/* Hidden checks */

const box = (el: Element) => el.getBoundingClientRect();
const r = (n: number) => Math.round(n);
const tops = (els: Element[]) => new Set(els.map(e => r(box(e).top))).size;
const slot = (root: Element, name: string) => root.querySelector(`[data-slot="${name}"]`)!;
const items = (root: Element, name: string) => [...root.querySelectorAll(`[data-slot="${name}"]`)];
const visible = (el: Element) => (el as HTMLElement).offsetParent !== null;

const All = ({ width }: { width: number }) => (
  <div className="flex flex-col" style={{ width }}>
    <Pricing />
    <ComparisonTableSection />
    <PricingSingle />
    <PricingCalculator />
    <PricingWithComparison />
    <PricingUsageBased />
    <PricingEnterpriseBanner />
  </div>
);

const names = {
  pricing: 'Simple pricing per location',
  comparison: 'Everything in each plan',
  single: 'One plan with everything included',
  calc: 'Pay for the seats you use',
  withComparison: 'Plans that grow with your invoice volume',
  usage: 'Pay only for the invoices you send',
  enterprise: 'Acme Enterprise for finance teams of 200 and more',
};

async function common(root: HTMLElement, width: number) {
  const c = within(root);
  await expect(root.querySelectorAll('h1')).toHaveLength(0);
  const regions = c.getAllByRole('region');
  await expect(regions).toHaveLength(7);
  for (const s of regions) {
    await expect(s).toHaveAccessibleName();
    await expect(s.scrollWidth).toBeLessThanOrEqual(width);
  }
  await expect(c.getAllByRole('heading', { level: 2 })).toHaveLength(7);
  for (const el of [...c.queryAllByRole('link'), ...c.queryAllByRole('button'), ...c.queryAllByRole('radio'), ...c.queryAllByRole('slider')]) await expect(el).toHaveAccessibleName();
  await expect((root.firstElementChild as HTMLElement).scrollWidth).toBeLessThanOrEqual(width);
}

export const Check1440: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={1440} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 1440);
    const c = within(canvasElement);
    // Pricing: 96 padding, header 48 above the billing switch, 3 plans of 368 in 1152, 24 apart.
    const pricing = c.getByRole('region', { name: names.pricing });
    await expect(r(box(slot(pricing, 'section-header')).top - box(pricing).top)).toBe(96);
    await expect(r(box(slot(pricing, 'pricing-billing')).top - box(slot(pricing, 'section-header')).bottom)).toBe(48);
    const cards = items(pricing, 'plan-card');
    await expect(cards).toHaveLength(3);
    await expect(tops(cards)).toBe(1);
    await expect(r(box(cards[0]!).width)).toBe(368);
    await expect(r(box(cards[1]!).left - box(cards[0]!).right)).toBe(24);
    await expect(r(box(slot(pricing, 'pricing-plans')).width)).toBe(1152);
    await expect(cards[1]).toHaveAttribute('data-variant', 'featured');
    // Billing switch changes the prices (yearly saves 20%).
    await expect(within(cards[0] as HTMLElement).getByText('€149')).toBeVisible();
    await userEvent.click(within(pricing).getByRole('radio', { name: 'Yearly' }));
    await waitFor(() => expect(within(cards[0] as HTMLElement).getByText('€119')).toBeVisible());
    // Comparison Table: the full table, 3 plan columns, 1152 wide.
    const comparison = c.getByRole('region', { name: names.comparison });
    const tables = within(comparison).getAllByRole('table').filter(visible);
    await expect(tables).toHaveLength(1);
    await expect(r(box(tables[0]!).width)).toBe(1152);
    await expect(tables[0]!.querySelectorAll('thead th')).toHaveLength(3);
    await expect(within(comparison).getByRole('link', { name: 'Contact sales, Enterprise' })).toBeVisible();
    // Pricing Single: text and a 400 card, 64 apart.
    const single = c.getByRole('region', { name: names.single });
    const card = slot(single, 'pricing-single-card');
    await expect(r(box(card).width)).toBe(400);
    await expect(r(box(card).left - box(slot(single, 'pricing-single-row').children[0]!).right)).toBe(64);
    // Calculator: 960 row, 360 summary, exact math, slider moves the price.
    const calc = c.getByRole('region', { name: names.calc });
    const row = slot(calc, 'pricing-calculator-row');
    await expect(r(box(row).width)).toBe(960);
    await expect(r(box(slot(calc, 'pricing-calculator-summary')).width)).toBe(360);
    await expect(within(calc).getByText('€3,000')).toBeVisible();
    await expect(within(calc).getByText(/120 seats × €25, billed yearly \(€36,000\)/)).toBeVisible();
    const seats = within(calc).getByRole('slider', { name: 'Number of seats' });
    seats.focus();
    await userEvent.keyboard('{End}');
    await waitFor(() => expect(within(calc).getByText('Custom quote')).toBeVisible());
    await userEvent.keyboard('{Home}');
    await waitFor(() => expect(within(calc).getByText('€29')).toBeVisible());
    // Pricing with Comparison: 4 plans in a row, the comparison collapses.
    const withComp = c.getByRole('region', { name: names.withComparison });
    await expect(tops(items(withComp, 'plan-card'))).toBe(1);
    await expect(r(box(items(withComp, 'plan-card')[0]!).width)).toBe(270);
    const toggle = within(withComp).getByRole('button', { name: 'Hide full comparison' });
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(within(withComp).getAllByRole('table').filter(visible)).toHaveLength(1);
    await userEvent.click(toggle);
    await waitFor(() => expect(within(withComp).getByRole('button', { name: 'Show full comparison' })).toHaveAttribute('aria-expanded', 'false'));
    await expect(within(withComp).queryAllByRole('table')).toHaveLength(0);
    await userEvent.click(within(withComp).getByRole('button', { name: 'Show full comparison' }));
    // Usage-based: 720 tiers card, 400 estimate, graduated total 735, current tier marked.
    const usage = c.getByRole('region', { name: names.usage });
    await expect(r(box(slot(usage, 'pricing-usage-tiers')).width)).toBe(720);
    await expect(r(box(slot(usage, 'pricing-usage-estimate')).width)).toBe(400);
    await expect(within(usage).getByText('€735')).toBeVisible();
    await expect(within(usage).getByText('€375.00')).toBeVisible();
    const current = items(usage, 'usage-tier').filter(t => t.hasAttribute('data-current'));
    await expect(current).toHaveLength(1);
    await expect(within(current[0] as HTMLElement).getByText('Your estimate')).toBeVisible();
    // Enterprise: inverted card, 48 padding, 320 contact column, 4 trust badges in a row.
    const ent = c.getByRole('region', { name: names.enterprise });
    const entCard = slot(ent, 'pricing-enterprise-card');
    await expect(r(box(entCard).width)).toBe(1152);
    await expect(r(box(ent.querySelector('h2')!).top - box(entCard).top)).toBeGreaterThanOrEqual(48);
    await expect(r(box(slot(ent, 'pricing-enterprise-top').children[1]!).width)).toBe(320);
    const badges = items(ent, 'trust-badge');
    await expect(badges).toHaveLength(4);
    await expect(tops(badges)).toBe(1);
  },
};

export const Check768: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={768} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 768);
    const c = within(canvasElement);
    // Plans stack (3) or go 2 per row (4); split rows stack; the comparison shows one plan.
    await expect(tops(items(c.getByRole('region', { name: names.pricing }), 'plan-card'))).toBe(3);
    await expect(tops(items(c.getByRole('region', { name: names.withComparison }), 'plan-card'))).toBe(2);
    const compTables = within(c.getByRole('region', { name: names.comparison })).getAllByRole('table').filter(visible);
    await expect(compTables).toHaveLength(1);
    await expect(compTables[0]!.querySelectorAll('thead th')).toHaveLength(1);
    const row = slot(c.getByRole('region', { name: names.single }), 'pricing-single-row');
    await expect(box(row.children[1]!).top).toBeGreaterThan(box(row.children[0]!).bottom);
    const calcRow = slot(c.getByRole('region', { name: names.calc }), 'pricing-calculator-row');
    await expect(box(calcRow.children[1]!).top).toBeGreaterThan(box(calcRow.children[0]!).bottom);
    await expect(tops(items(c.getByRole('region', { name: names.enterprise }), 'trust-badge'))).toBe(2);
  },
};

export const Check390: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={390} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 390);
    const c = within(canvasElement);
    // 24 px gutters; the comparison shows one plan at a time with a plan picker.
    const pricing = c.getByRole('region', { name: names.pricing });
    await expect(r(box(slot(pricing, 'pricing-plans')).left - box(pricing).left)).toBe(24);
    const comparison = c.getByRole('region', { name: names.comparison });
    const shown = within(comparison).getAllByRole('table').filter(visible);
    await expect(shown).toHaveLength(1);
    const planHead = () => within(comparison).getAllByRole('table').filter(visible)[0]!.querySelectorAll('thead th');
    await expect(planHead()).toHaveLength(1);
    await expect(planHead()[0]).toHaveTextContent('Team');
    await userEvent.click(within(comparison).getByRole('radio', { name: 'Enterprise' }));
    await waitFor(() => expect(planHead()[0]).toHaveTextContent('Enterprise'));
    await expect(tops(items(c.getByRole('region', { name: names.withComparison }), 'plan-card'))).toBe(4);
    await expect(tops(items(c.getByRole('region', { name: names.enterprise }), 'trust-badge'))).toBe(4);
  },
};

export const AllDark: StoryObj = { tags: ['!dev'], globals: { theme: 'Dark' }, render: () => <All width={1440} /> };
export const AllBackOffice: StoryObj = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: () => <All width={1440} /> };
