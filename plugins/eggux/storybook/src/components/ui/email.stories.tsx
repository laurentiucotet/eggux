import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import {
  EmailArticle,
  EmailButton,
  EmailCallout,
  EmailCode,
  EmailContent,
  EmailDetails,
  EmailDetailsRow,
  EmailDivider,
  EmailFooter,
  EmailHeader,
  EmailHero,
  EmailLayout,
  EmailLineItem,
  EmailLineItems,
  EmailStat,
  EmailStats,
  EmailTotalRow,
  type EmailCalloutTone,
} from './email';

const meta = {
  title: 'Components/Email/Email',
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'The parts of a 600 wide email: Header and Footer outside the card, then Hero, Button, Content, Code, Details, Line Items, Callout, Divider, Stats and Article inside it. Drawn as web components for review; for sending, rebuild them with an email toolkit and keep the sizes, tokens and copy rules. Figma: Email page. Guide: eggux build-ui/patterns/email.md' } },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();
const footer = (
  <EmailFooter
    address="Acme SRL, Strada Exemplu 12, 010101 Bucharest, Romania"
    reason="You are receiving this email because you have an Acme account."
    social={[
      { network: 'LinkedIn', href: '#linkedin' },
      { network: 'X', href: '#x' },
      { network: 'YouTube', href: '#youtube' },
      { network: 'GitHub', href: '#github' },
    ]}
    preferencesHref="#preferences"
    unsubscribeHref="#unsubscribe"
  />
);

function Invoice() {
  return (
    <EmailLayout header={<EmailHeader />} footer={footer}>
      <EmailHero title="Your invoice from Acme is ready" text="Invoice INV-2041 for €1,240.00 is due on 15 November 2026. You can view it and pay online in a few clicks." />
      <EmailButton label="Pay invoice" href="#pay" />
      <EmailDetails title="Invoice details">
        <EmailDetailsRow label="Invoice number" value="INV-2041" />
        <EmailDetailsRow label="Amount" value="€1,240.00" />
        <EmailDetailsRow label="Due date" value="15 November 2026" />
      </EmailDetails>
      <EmailLineItems
        title="Summary"
        items={
          <>
            <EmailLineItem name="Consulting hours" meta="12 h × €85.00" amount="€1,020.00" />
            <EmailLineItem name="Design review" meta="Fixed fee" amount="€450.00" />
            <EmailLineItem name="Hosting, October" meta="1 month" amount="€29.00" />
          </>
        }
        totals={
          <>
            <EmailTotalRow label="Subtotal" amount="€1,499.00" />
            <EmailTotalRow label="VAT (19%)" amount="€284.81" />
            <EmailTotalRow type="total" label="Total" amount="€1,783.81" />
          </>
        }
      />
      <EmailCallout tone="warning" title="Payment due in 3 days">
        Invoice INV-2041 for €1,240.00 is due on 15 November 2026. Pay now to keep your account in good standing.
      </EmailCallout>
      <EmailDivider />
      <EmailContent heading="How to pay">
        Pay by card or bank transfer from the <a href="#invoice">invoice page</a>. Paid invoices show up in your Acme account within a minute.
      </EmailContent>
    </EmailLayout>
  );
}

export const InvoiceEmail: Story = {
  render: () => <Invoice />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const part = (slot: string) => canvasElement.querySelector(`[data-slot="${slot}"]`)!;
    await expect(box(part('email-card')).width).toBe(600);
    await expect(box(part('email-header')).height).toBe(88);
    await expect(box(part('email-hero')).height).toBe(108);
    await expect(box(part('email-button')).height).toBe(44);
    await expect(box(part('email-content')).height).toBe(92);
    await expect(box(part('email-details')).height).toBe(174);
    await expect(Math.round(box(part('email-line-items')).height)).toBe(355);
    await expect(box(part('email-callout')).height).toBe(96);
    await expect(box(part('email-footer')).height).toBe(200);
    await expect(c.getByRole('heading', { level: 1, name: 'Your invoice from Acme is ready' })).toBeVisible();
    await expect(c.getByRole('link', { name: 'Pay invoice' })).toHaveAttribute('href', '#pay');
    await expect(c.getAllByRole('term')).toHaveLength(6);
    await expect(c.getAllByRole('listitem').length).toBeGreaterThanOrEqual(3);
    await expect(within(c.getByRole('list', { name: 'Follow us' })).getAllByRole('link')).toHaveLength(4);
    await expect(c.getByRole('link', { name: 'Unsubscribe' })).toBeVisible();
  },
};

export const SignInCode: Story = {
  render: () => (
    <EmailLayout header={<EmailHeader />} footer={<EmailFooter address="Acme SRL, Strada Exemplu 12, 010101 Bucharest, Romania" reason="You are receiving this email because someone asked to sign in to your Acme account." preferencesHref="#preferences" />}>
      <EmailHero title="Sign in to Acme" text="Use this code to finish signing in on Chrome, Windows." />
      <EmailCode code="482916" hint="The code expires in 10 minutes. If you did not ask for it, you can ignore this email." />
      <EmailCallout tone="info" title="Was this not you?">
        Change your password and turn on two-step verification in your security settings.
      </EmailCallout>
    </EmailLayout>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    // Figma 152 with a one-line hint; the code box itself is 120.
    await expect(box(canvasElement.querySelector('[data-slot="email-code"] > div')!).height).toBe(120);
    await expect(c.getByText('482916')).toHaveClass('font-mono');
    await expect(c.queryByRole('link', { name: 'Unsubscribe' })).toBeNull();
  },
};

export const WeeklyDigest: Story = {
  render: () => (
    <EmailLayout header={<EmailHeader browserHref="#browser" />} footer={footer}>
      <EmailHero eyebrow="Weekly summary · 3–9 Nov" title="Your week at Acme" showImage />
      <EmailStats>
        <EmailStat value="42" label="Active projects" change="+3 this week" />
        <EmailStat value="€18,200" label="Invoiced" change="+12% on last week" />
        <EmailStat value="96%" label="Paid on time" change="+4 points" />
      </EmailStats>
      <EmailButton align="center" label="Open the full report" href="#report" />
      <EmailDivider />
      <EmailArticle title="Five ways to get invoices paid on time" text="Clear due dates, card payments and two friendly reminders cut late payments by a third." href="#article" />
      <EmailDivider />
      <EmailArticle title="New: recurring invoices" text="Set a schedule once and Acme sends the invoice every month." href="#recurring" linkLabel="See how it works" showImage={false} />
    </EmailLayout>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const stats = canvasElement.querySelector('[data-slot="email-stats"]')!;
    await expect(box(stats).height).toBe(110);
    const cells = stats.querySelectorAll('[data-slot="email-stat"]');
    await expect(box(cells[0]).top).toBe(box(cells[2]).top);
    await expect(box(canvasElement.querySelector('[data-slot="email-article"]')!).height).toBe(120);
    await expect(c.getByRole('link', { name: /Read the article.*Five ways to get invoices paid on time/ })).toBeVisible();
    await expect(c.getByRole('link', { name: 'View in browser' })).toBeVisible();
    const btn = canvasElement.querySelector('[data-slot="email-button"] a')!;
    const row = canvasElement.querySelector('[data-slot="email-button"]')!;
    await expect(Math.abs(box(btn).left + box(btn).width / 2 - (box(row).left + box(row).width / 2))).toBeLessThan(1);
  },
};

const tones: EmailCalloutTone[] = ['default', 'info', 'success', 'warning', 'destructive'];

export const Callouts: Story = {
  render: () => (
    <div className="flex flex-col gap-4 bg-card py-6">
      {tones.map((t) => (
        <EmailCallout key={t} tone={t} title="Payment due in 3 days">
          Invoice INV-2041 for €1,240.00 is due on 15 November 2026. Pay now to keep your account in good standing.
        </EmailCallout>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const all = canvasElement.querySelectorAll('[data-slot="email-callout"]');
    await expect(all).toHaveLength(5);
    for (const el of Array.from(all)) await expect(box(el).height).toBe(96);
  },
};

function Narrow() {
  const long = 'An unusually long invoice title that keeps going to see how the hero wraps in the narrowest client';
  return (
    <div className="flex w-80 flex-col gap-6 bg-card py-6">
      <EmailHeader browserHref="#b" />
      <EmailHero eyebrow="A very long eyebrow label that should end with an ellipsis" title={long} text="Short text." />
      <EmailButton label="Pay invoice INV-2041 for the consulting work in October" href="#pay" />
      <EmailDetails>
        <EmailDetailsRow label="Delivery address" value="Strada Exemplu 12, Sector 1, 010101 Bucharest, Romania" />
      </EmailDetails>
      <EmailLineItems items={<EmailLineItem showImage name="Supercalifragilistic extra long product name, size XL, colour sand" meta="2 × €1,234.56" amount="€2,469.12" />} totals={<EmailTotalRow type="total" label="Total" amount="€2,469.12" />} />
      <EmailCode code="482916" />
      <EmailStats>
        <EmailStat value="42" label="Active projects" />
        <EmailStat value="€18,200" label="Invoiced" trend="bad" change="−8% on last week" />
        <EmailStat value="96%" label="Paid on time" trend="neutral" change="No change" />
      </EmailStats>
      <EmailArticle title="Five ways to get invoices paid on time" href="#a" />
      <EmailFooter address="Acme SRL, Strada Exemplu 12, 010101 Bucharest, Romania" reason="You are receiving this email because you have an Acme account." unsubscribeHref="#u" preferencesHref="#p" />
    </div>
  );
}

export const EdgeCases: Story = {
  tags: ['!dev'],
  parameters: { a11y: { config: { rules: [{ id: 'page-has-heading-one', enabled: false }, { id: 'heading-order', enabled: false }] } } },
  render: () => <Narrow />,
  play: async ({ canvasElement }) => {
    for (const el of Array.from(canvasElement.querySelectorAll('[data-slot^="email-"]'))) {
      await expect(el.scrollWidth).toBeLessThanOrEqual(el.clientWidth + 1);
    }
    const btn = canvasElement.querySelector('[data-slot="email-button"] a')!;
    await expect(box(btn).width).toBeLessThanOrEqual(240);
    // Article text drops under the image when narrow.
    const art = canvasElement.querySelector('[data-slot="email-article"]')!;
    const [img, text] = Array.from(art.children);
    await expect(box(text!).top).toBeGreaterThan(box(img!).top);
  },
};

export const AllDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, render: () => <Invoice /> };
export const AllCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: () => <Invoice /> };
