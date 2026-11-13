import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Newsletter, NewsletterCard, NewsletterSplit } from './section-newsletter';

const meta = {
  title: 'Blocks/Sections/Newsletter',
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Email sign-up built on the Inline Form. Newsletter: the strip in content pages. Newsletter Split: benefits and a photo. Newsletter Card: the closing primary band of a blog. Say how often, what is inside and how to leave; success says what happens next. Figma: BLOCKS / Sections (Newsletter). Guide: eggux build-ui/patterns/marketing-pages.md' } },
  },
} satisfies Meta;
export default meta;

const cat = (category: string) => ({ table: { category } });
const text = (name: string, description: string, category = 'Content') => ({ name, control: 'text' as const, description, ...cat(category) });
const bool = (name: string, description: string, category = 'Content') => ({ name, control: 'boolean' as const, description, ...cat(category) });

type StripArgs = { title: string; description: string; hint: string; buttonLabel: string };
export const Default: StoryObj<StripArgs> = {
  name: 'Newsletter',
  args: { title: 'Get one useful email a month', description: 'Product updates and guides from the team. No spam, unsubscribe in one click.', hint: 'We care about your data: read the privacy policy.', buttonLabel: 'Subscribe' },
  argTypes: {
    title: text('Title', 'Section title (h2): what people get.'),
    description: text('Description', 'How often, and how to leave.'),
    hint: text('Hint', 'Under the field.', 'Inline Form'),
    buttonLabel: text('Button label', 'The verb.', 'Inline Form'),
  },
  render: a => <Newsletter {...a} />,
};

type SplitArgs = StripArgs & { overline: string; showImage: boolean };
export const Split: StoryObj<SplitArgs> = {
  name: 'Newsletter Split',
  args: {
    overline: 'Newsletter',
    title: 'The month in finance ops, in five minutes',
    description: 'One email on the first Tuesday of the month: what changed in EU invoicing rules, one workflow worth copying and the numbers behind it.',
    hint: '12,400 readers. Unsubscribe in one click; we never share your email.',
    buttonLabel: 'Subscribe',
    showImage: true,
  },
  argTypes: {
    overline: text('Overline', 'Short label above the title.'),
    title: text('Title', 'Section title (h2).'),
    description: text('Description', 'What each issue holds.'),
    showImage: bool('Show image', 'The 4:3 photo next to the text.'),
    hint: text('Hint', 'Reader count or privacy.', 'Inline Form'),
    buttonLabel: text('Button label', 'The verb.', 'Inline Form'),
  },
  render: a => <NewsletterSplit {...a} />,
};

type CardArgs = StripArgs & { badge: string; showProof: boolean; proof: string };
export const CardStory: StoryObj<CardArgs> = {
  name: 'Newsletter Card',
  args: {
    badge: 'Monthly, 5-minute read',
    title: 'Get the finance ops brief',
    description: 'What changed in EU invoicing, one workflow worth copying and the benchmarks behind it. First Tuesday of every month.',
    hint: 'No spam. Unsubscribe in one click.',
    buttonLabel: 'Subscribe',
    showProof: true,
    proof: 'Join 12,400 finance leads who read it every month',
  },
  argTypes: {
    badge: text('Badge', 'How often and how long.'),
    title: text('Title', 'Section title (h2).'),
    description: text('Description', 'What each issue holds.'),
    showProof: bool('Show proof', 'Avatar Group and reader count.'),
    proof: text('Proof', 'A real reader count.'),
    hint: text('Hint', 'Under the field.', 'Inline Form'),
    buttonLabel: text('Button label', 'The verb.', 'Inline Form'),
  },
  render: ({ showProof, proof, ...a }) => <NewsletterCard {...a} proof={showProof ? proof : ''} />,
};

/* Hidden checks */

const box = (el: Element) => el.getBoundingClientRect();
const r = (n: number) => Math.round(n);
const slot = (root: Element, name: string) => root.querySelector(`[data-slot="${name}"]`)!;

const All = ({ width }: { width: number }) => (
  <div className="flex flex-col" style={{ width }}>
    <Newsletter />
    <NewsletterSplit />
    <NewsletterCard />
  </div>
);

const titles = ['Get one useful email a month', 'The month in finance ops, in five minutes', 'Get the finance ops brief'];

async function common(root: HTMLElement, width: number) {
  const c = within(root);
  await expect(root.querySelectorAll('h1')).toHaveLength(0);
  const regions = c.getAllByRole('region');
  await expect(regions).toHaveLength(3);
  for (const s of regions) {
    await expect(s).toHaveAccessibleName();
    await expect(s.scrollWidth).toBeLessThanOrEqual(width);
  }
  for (const t of titles) await expect(c.getByRole('heading', { level: 2, name: t })).toBeVisible();
  await expect(c.getAllByRole('textbox', { name: 'Email address' })).toHaveLength(3);
  for (const el of [...c.queryAllByRole('link'), ...c.queryAllByRole('button')]) await expect(el).toHaveAccessibleName();
  for (const img of root.querySelectorAll('img')) await expect(img).toHaveAttribute('alt');
  await expect((root.firstElementChild as HTMLElement).scrollWidth).toBeLessThanOrEqual(width);
}

export const Check1440: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={1440} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 1440);
    const c = within(canvasElement);
    // Newsletter: 320 high, 64 padding, muted card 1152 with 48 padding, form 420 at the end.
    const strip = c.getByRole('region', { name: titles[0] });
    await expect(r(box(strip).height)).toBe(320);
    const card = slot(strip, 'newsletter-card');
    await expect(r(box(card).width)).toBe(1152);
    await expect(r(box(card).top - box(strip).top)).toBe(64);
    const form = slot(strip, 'inline-form');
    await expect(r(box(form).width)).toBe(420);
    await expect(r(box(card).right - box(form).right)).toBe(48);
    await expect(r(box(strip.querySelector('h2')!).left - box(card).left)).toBe(48);
    // Split: text and image 544 each, 64 apart; image 4:3 (408 high); form 480.
    const split = c.getByRole('region', { name: titles[1] });
    const row = slot(split, 'newsletter-split-row');
    await expect(r(box(row.children[0]!).width)).toBe(544);
    await expect(r(box(row.children[1]!).left - box(row.children[0]!).right)).toBe(64);
    await expect(r(box(slot(split, 'image-placeholder')).height)).toBe(408);
    await expect(r(box(slot(split, 'inline-form')).width)).toBe(480);
    await expect(split.querySelectorAll('[data-slot="check-item"]')).toHaveLength(3);
    // Card: primary panel 1152 with 64 padding, centered form 480.
    const band = c.getByRole('region', { name: titles[2] });
    const panel = slot(band, 'newsletter-card-panel');
    await expect(r(box(panel).width)).toBe(1152);
    await expect(r(box(slot(panel, 'badge')).top - box(panel).top)).toBe(64);
    const bandForm = slot(band, 'inline-form');
    await expect(r(box(bandForm).width)).toBe(480);
    await expect(r(box(bandForm).left - box(panel).left)).toBe(r((1152 - 480) / 2));
    await expect(within(band).getByRole('button', { name: 'Subscribe' })).toBeVisible();
  },
};

export const Check768: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={768} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 768);
    const c = within(canvasElement);
    // Strip and split stack; 32 gutters.
    const strip = c.getByRole('region', { name: titles[0] });
    await expect(box(slot(strip, 'inline-form')).top).toBeGreaterThan(box(strip.querySelector('h2')!).bottom);
    await expect(r(box(slot(strip, 'newsletter-card')).left - box(strip).left)).toBe(32);
    const row = slot(c.getByRole('region', { name: titles[1] }), 'newsletter-split-row');
    await expect(box(row.children[1]!).top).toBeGreaterThan(box(row.children[0]!).bottom);
  },
};

export const Check390: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={390} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 390);
    const c = within(canvasElement);
    // 24 gutters; forms fill the column.
    const band = c.getByRole('region', { name: titles[2] });
    const panel = slot(band, 'newsletter-card-panel');
    await expect(r(box(panel).left - box(band).left)).toBe(24);
    await expect(r(box(slot(band, 'inline-form')).width)).toBe(r(box(panel).width) - 48);
  },
};

/** A wrong address keeps the value and says how to fix it; a right one says what happens next. */
export const SubscribeCheck: StoryObj = {
  tags: ['!dev'],
  render: () => <Newsletter />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const input = c.getByRole('textbox', { name: 'Email address' });
    await userEvent.type(input, 'ana@');
    await userEvent.click(c.getByRole('button', { name: 'Subscribe' }));
    await waitFor(() => expect(c.getByText('Enter an email address like name@company.com.')).toBeVisible());
    await expect(input).toHaveValue('ana@');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await userEvent.type(input, 'northwind.example');
    await userEvent.click(c.getByRole('button', { name: 'Subscribe' }));
    await waitFor(() => expect(c.getByText('You are subscribed. Check your inbox to confirm.')).toBeVisible());
  },
};

export const AllDark: StoryObj = { tags: ['!dev'], globals: { theme: 'Dark' }, render: () => <All width={1440} /> };
export const AllBackOffice: StoryObj = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: () => <All width={1440} /> };
