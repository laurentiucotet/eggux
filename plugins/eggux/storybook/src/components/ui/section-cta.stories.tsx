import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { CTA, CTAAppDownload, CTACard, CTASplit, CTAWithForm, CTAWithScreenshot } from './section-cta';

const meta = {
  title: 'Blocks/Sections/CTA',
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Closing calls to action. CTA: a quiet muted band with two buttons. CTA Split: the message next to a product shot, mid-page. CTA Card: the primary card, once per page near the end. CTA with Screenshot: a primary card with a cropped product screen, when the product is the argument. CTA with Form: sign up with an email right there. CTA App Download: closes a mobile app page with store links and a QR code. Each has one primary action, a secondary one and a proof row. Figma: BLOCKS / Sections (CTA). Guide: eggux build-ui/patterns/marketing-pages.md' } },
  },
} satisfies Meta;
export default meta;

const cat = (category: string) => ({ table: { category } });
const text = (name: string, description: string, category = 'Content') => ({ name, control: 'text' as const, description, ...cat(category) });
const bool = (name: string, description: string, category = 'Content') => ({ name, control: 'boolean' as const, description, ...cat(category) });

const actionArgTypes = {
  primaryLabel: text('Primary action', 'Same label as the hero primary CTA.', 'Actions'),
  secondaryLabel: text('Secondary action', 'The lower-commitment option.', 'Actions'),
  showProof: bool('Show proof', 'Avatar Group and Rating row.', 'Proof'),
};

type BandArgs = { title: string; description: string; primaryLabel: string; secondaryLabel: string; showProof: boolean };
export const Default: StoryObj<BandArgs> = {
  name: 'CTA',
  args: { title: 'Run your first month on Acme, free', description: 'We import your clients and projects for you. Cancel anytime.', primaryLabel: 'Start free trial', secondaryLabel: 'Talk to sales', showProof: true },
  argTypes: { title: text('Title', 'One promise (h2).'), description: text('Description', 'One sentence.'), ...actionArgTypes },
  render: a => (
    <CTA title={a.title} description={a.description} primaryAction={{ label: a.primaryLabel, href: '#trial' }} secondaryAction={{ label: a.secondaryLabel, href: '#sales' }} proof={a.showProof ? undefined : null} />
  ),
};

type SplitArgs = BandArgs & { overline: string };
export const Split: StoryObj<SplitArgs> = {
  name: 'CTA Split',
  args: {
    overline: 'Get started',
    title: 'See your own data in Acme in 30 minutes',
    description: 'A product specialist sets up a workspace with your invoices and approval rules, then walks your team through it.',
    primaryLabel: 'Book a demo',
    secondaryLabel: 'Talk to sales',
    showProof: true,
  },
  argTypes: { overline: text('Overline', 'Short label above the title.'), title: text('Title', 'One promise (h2).'), description: text('Description', 'What happens next.'), ...actionArgTypes },
  render: a => (
    <CTASplit overline={a.overline} title={a.title} description={a.description} primaryAction={{ label: a.primaryLabel, href: '#demo' }} secondaryAction={{ label: a.secondaryLabel, href: '#sales' }} proof={a.showProof ? undefined : null} />
  ),
};

type CardArgs = BandArgs & { showDecoration: boolean; note: string };
export const Card: StoryObj<CardArgs> = {
  name: 'CTA Card',
  args: {
    title: 'Ready to move approvals out of email?',
    description: 'Start a 30-day trial with your team. Your data stays in the EU.',
    primaryLabel: 'Start free trial',
    secondaryLabel: 'Talk to sales',
    showProof: true,
    showDecoration: true,
    note: 'No credit card required',
  },
  argTypes: {
    title: text('Title', 'One promise (h2).'),
    description: text('Description', 'One sentence.'),
    note: text('Note', 'Reassurance under the actions; empty hides it.'),
    showDecoration: bool('Show decoration', 'The soft glow; off when the page has a Background.'),
    ...actionArgTypes,
  },
  render: a => (
    <CTACard title={a.title} description={a.description} note={a.note || undefined} showDecoration={a.showDecoration} primaryAction={{ label: a.primaryLabel, href: '#trial' }} secondaryAction={{ label: a.secondaryLabel, href: '#sales' }} proof={a.showProof ? undefined : null} />
  ),
};

type ShotArgs = BandArgs & { showEyebrow: boolean; eyebrow: string; showNote: boolean; note: string };
export const WithScreenshot: StoryObj<ShotArgs> = {
  name: 'CTA with Screenshot',
  args: {
    showEyebrow: true,
    eyebrow: 'Start in one afternoon',
    title: 'Close the month in days, not weeks',
    description: 'Import your clients and open invoices, connect your bank and send the first reminder before the day ends. Your data stays in the EU.',
    primaryLabel: 'Start free trial',
    secondaryLabel: 'Book a demo',
    showProof: true,
    showNote: true,
    note: 'No credit card required. Cancel anytime.',
  },
  argTypes: {
    showEyebrow: bool('Show eyebrow', 'Short label above the title.'),
    eyebrow: text('Eyebrow', 'Short label above the title.'),
    title: text('Title', 'One promise (h2).'),
    description: text('Description', 'What people do in the first day.'),
    showNote: bool('Show note', 'Reassurance under the proof.'),
    note: text('Note', 'Reassurance under the proof.'),
    ...actionArgTypes,
  },
  render: a => (
    <CTAWithScreenshot
      eyebrow={a.showEyebrow ? a.eyebrow : undefined}
      title={a.title}
      description={a.description}
      note={a.showNote ? a.note : undefined}
      primaryAction={{ label: a.primaryLabel, href: '#trial' }}
      secondaryAction={{ label: a.secondaryLabel, href: '#demo' }}
      proof={a.showProof ? undefined : null}
    />
  ),
};

type FormArgs = { title: string; description: string; buttonLabel: string; hint: string; showBenefits: boolean; showNote: boolean };
export const WithForm: StoryObj<FormArgs> = {
  name: 'CTA with Form',
  args: {
    title: 'Send your first invoice before lunch',
    description: 'Create your workspace in two minutes, import customers from a spreadsheet and get paid in EUR from day one.',
    buttonLabel: 'Start free trial',
    hint: '30 days free on the Business plan. No credit card required.',
    showBenefits: true,
    showNote: true,
  },
  argTypes: {
    title: text('Title', 'One promise (h2).'),
    description: text('Description', 'One sentence.'),
    buttonLabel: text('Button label', 'Names the result, never "Submit".', 'Inline Form'),
    hint: text('Hint', 'The trial terms.', 'Inline Form'),
    showBenefits: bool('Show benefits', '2-3 Check Items, facts only.'),
    showNote: bool('Show note', 'Terms, Privacy Policy and what the email is for.'),
  },
  render: a => (
    <CTAWithForm title={a.title} description={a.description} buttonLabel={a.buttonLabel} hint={a.hint} benefits={a.showBenefits ? undefined : []} note={a.showNote ? undefined : null} />
  ),
};

type AppArgs = { showEyebrow: boolean; eyebrow: string; title: string; description: string; showQr: boolean; qrTitle: string; qrCaption: string };
export const AppDownload: StoryObj<AppArgs> = {
  name: 'CTA App Download',
  args: {
    showEyebrow: true,
    eyebrow: 'Acme for iPhone and Android',
    title: 'Your customers and invoices in your pocket',
    description: 'See every customer, upcoming visit and unpaid invoice on iPhone and Android, and approve spend on the go. Free with every plan.',
    showQr: true,
    qrTitle: 'Scan to get the app',
    qrCaption: 'Point your phone camera at the code. It opens the right store for your phone.',
  },
  argTypes: {
    showEyebrow: bool('Show eyebrow', 'Short label above the title.'),
    eyebrow: text('Eyebrow', 'Short label above the title.'),
    title: text('Title', 'One promise (h2).'),
    description: text('Description', 'What the app does and what it costs.'),
    showQr: bool('Show QR', 'QR tile for desktop visitors (hidden under 768).', 'QR'),
    qrTitle: text('QR title', 'What to do.', 'QR'),
    qrCaption: text('QR caption', 'How it works.', 'QR'),
  },
  render: a => (
    <CTAAppDownload eyebrow={a.showEyebrow ? a.eyebrow : undefined} title={a.title} description={a.description} showQr={a.showQr} qrTitle={a.qrTitle} qrCaption={a.qrCaption} />
  ),
};

/* Hidden checks */

const box = (el: Element) => el.getBoundingClientRect();
const r = (n: number) => Math.round(n);
const slot = (root: Element, name: string) => root.querySelector(`[data-slot="${name}"]`)!;

const T = {
  cta: 'Run your first month on Acme, free',
  split: 'See your own data in Acme in 30 minutes',
  card: 'Ready to move approvals out of email?',
  shot: 'Close the month in days, not weeks',
  form: 'Send your first invoice before lunch',
  app: 'Your customers and invoices in your pocket',
};

const All = ({ width }: { width: number }) => (
  <div className="flex flex-col" style={{ width }}>
    <CTA />
    <CTASplit />
    <CTACard />
    <CTAWithScreenshot />
    <CTAWithForm />
    <CTAAppDownload />
  </div>
);

/** Shared checks at every width: landmarks, h2 per block, names, product screens as named images, no sideways scroll. */
async function common(root: HTMLElement, width: number) {
  const c = within(root);
  await expect(root.querySelectorAll('h1')).toHaveLength(0);
  await expect(c.getAllByRole('region')).toHaveLength(6);
  for (const name of Object.values(T)) {
    const s = c.getByRole('region', { name });
    await expect(within(s).getByRole('heading', { level: 2, name })).toBeInTheDocument();
    await expect(s.scrollWidth).toBeLessThanOrEqual(width);
  }
  for (const el of [...c.getAllByRole('link'), ...c.getAllByRole('button')]) await expect(el).toHaveAccessibleName();
  for (const img of c.getAllByRole('img')) await expect(img).toHaveAccessibleName();
  // Product screens are pictures: their inside is out of the tab order and the accessibility tree.
  for (const screen of root.querySelectorAll('[data-slot="device-frame"]')) {
    await expect(screen).toHaveAttribute('role', 'img');
    await expect(screen.querySelector('[inert]')).not.toBeNull();
  }
  await expect((root.firstElementChild as HTMLElement).scrollWidth).toBeLessThanOrEqual(width);
}

export const Check1440: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={1440} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 1440);
    const c = within(canvasElement);
    // CTA: 412 high, band 1152 with 48 padding, actions right of the text.
    const cta = c.getByRole('region', { name: T.cta });
    await expect(r(box(cta).height)).toBe(412);
    const band = slot(cta, 'cta-band');
    await expect(r(box(band).width)).toBe(1152);
    await expect(r(box(cta.querySelector('h2')!).left - box(band).left)).toBe(48);
    const trial = within(cta).getByRole('link', { name: 'Start free trial' });
    await expect(r(box(trial).height)).toBe(40);
    await expect(box(trial).left).toBeGreaterThan(box(cta.querySelector('h2')!).right);
    await expect(within(cta).getByRole('img', { name: 'Rated 4.8 out of 5' })).toBeInTheDocument();
    // CTA Split: bordered card, media 396 high on the right of the text.
    const split = c.getByRole('region', { name: T.split });
    const media = slot(split, 'cta-split-media');
    await expect(r(box(media).height)).toBe(396);
    await expect(box(media).left).toBeGreaterThan(box(split.querySelector('h2')!).right);
    await expect(within(split).getByRole('img', { name: /invoices screen/ })).toBeInTheDocument();
    // CTA Card: 64 padding, centered, primary secondary-style button and the glow.
    const card = c.getByRole('region', { name: T.card });
    const panel = slot(card, 'cta-card-panel');
    await expect(r(box(panel).width)).toBe(1152);
    await expect(r(box(card.querySelector('h2')!).top - box(panel).top)).toBe(64);
    await expect(slot(card, 'cta-card-glow')).not.toBeNull();
    const cardTitle = box(card.querySelector('h2')!);
    await expect(Math.abs(cardTitle.left + cardTitle.width / 2 - (box(panel).left + box(panel).width / 2))).toBeLessThan(2);
    // CTA with Screenshot: text column 560, screen on the right; panel 512 high.
    const shot = c.getByRole('region', { name: T.shot });
    const shotPanel = slot(shot, 'cta-with-screenshot-panel');
    await expect(r(box(shotPanel.children[0]!).width)).toBe(560);
    await expect(r(box(shotPanel).height)).toBe(512);
    // CTA with Form: 672 text column, 480 form, 3 benefits in one row.
    const form = c.getByRole('region', { name: T.form });
    await expect(r(box(slot(form, 'inline-form')).width)).toBe(480);
    await expect(r(box(form.querySelector('h2')!).width)).toBe(672);
    const benefits = [...form.querySelectorAll('[data-slot="check-item"]')];
    await expect(new Set(benefits.map(b => r(box(b).top))).size).toBe(1);
    await expect(within(form).getByRole('link', { name: 'Privacy Policy' })).toBeInTheDocument();
    // CTA App Download: store links, QR tile, 456 wide phone column.
    const app = c.getByRole('region', { name: T.app });
    await expect(within(app).getByRole('link', { name: 'Download on the App Store' })).toBeInTheDocument();
    await expect(within(app).getByRole('link', { name: 'Get it on Google Play' })).toBeInTheDocument();
    await expect(slot(app, 'cta-app-download-qr')).toBeVisible();
    await expect(r(box(slot(app, 'cta-app-download-visual')).width)).toBe(456);
  },
};

export const Check768: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={768} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 768);
    const c = within(canvasElement);
    // CTA keeps the actions beside the text; Split and Screenshot stack the media under the text.
    const cta = c.getByRole('region', { name: T.cta });
    await expect(box(within(cta).getByRole('link', { name: 'Start free trial' })).left).toBeGreaterThan(box(cta.querySelector('h2')!).right);
    const split = c.getByRole('region', { name: T.split });
    await expect(box(slot(split, 'cta-split-media')).top).toBeGreaterThan(box(split.querySelector('h2')!).bottom);
    const shot = c.getByRole('region', { name: T.shot });
    await expect(box(slot(shot, 'cta-with-screenshot-media')).top).toBeGreaterThan(box(shot.querySelector('h2')!).bottom);
    await expect(slot(c.getByRole('region', { name: T.app }), 'cta-app-download-qr')).toBeVisible();
  },
};

export const Check390: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={390} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 390);
    const c = within(canvasElement);
    // Everything stacks; 24 px gutters; the QR is hidden on phones, the store links stay.
    const cta = c.getByRole('region', { name: T.cta });
    await expect(r(box(slot(cta, 'cta-band')).left - box(cta).left)).toBe(24);
    await expect(box(within(cta).getByRole('link', { name: 'Start free trial' })).top).toBeGreaterThan(box(cta.querySelector('h2')!).bottom);
    // The product shots stay under the text, cropped: 288 and 320 high.
    await expect(r(box(slot(c.getByRole('region', { name: T.split }), 'cta-split-media')).height)).toBe(288);
    await expect(r(box(slot(c.getByRole('region', { name: T.shot }), 'cta-with-screenshot-media')).height)).toBe(320);
    const app = c.getByRole('region', { name: T.app });
    await expect(slot(app, 'cta-app-download-qr')).not.toBeVisible();
    await expect(r(box(slot(app, 'device-frame')).width)).toBe(300);
    await expect(box(slot(app, 'cta-app-download-visual')).top).toBeGreaterThan(box(app.querySelector('h2')!).bottom);
    await expect(within(app).getByRole('link', { name: 'Get it on Google Play' })).toBeVisible();
  },
};

const onSignUp = fn();

// The email form: an invalid address shows the error and keeps the value; a valid one shows what happens next.
export const FormCheck: StoryObj = {
  tags: ['!dev'],
  render: () => <div className="w-[1440px]"><CTAWithForm onSubmit={onSignUp} /></div>,
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'Work email' });
    await userEvent.type(input, 'ana@acme');
    await userEvent.click(canvas.getByRole('button', { name: 'Start free trial' }));
    await waitFor(() => expect(input).toHaveAttribute('aria-invalid', 'true'));
    await expect(input).toHaveAccessibleDescription('Enter an email address like name@company.com.');
    await expect(input).toHaveValue('ana@acme');
    await expect(onSignUp).not.toHaveBeenCalled();
    await userEvent.type(input, '.com{Enter}');
    await waitFor(() => expect(canvas.getByText('Check your inbox: we sent you a link to open your workspace.')).toBeVisible());
    await expect(onSignUp).toHaveBeenCalledWith('ana@acme.com');
  },
};

export const AllDark: StoryObj = { tags: ['!dev'], globals: { theme: 'Dark' }, render: () => <All width={1440} /> };
export const AllBackOffice: StoryObj = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: () => <All width={1440} /> };
