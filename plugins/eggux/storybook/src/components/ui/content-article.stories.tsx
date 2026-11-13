import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Article, ArticlePaywall, ContentWithImage, DocumentWithComments, LegalPage, type ArticlePaywallType } from './content-article';

interface Args {
  title?: string;
  lead?: string;
  showImage?: boolean;
  showToc?: boolean;
  showQuote?: boolean;
  imageFirst?: boolean;
  showComments?: boolean;
  showSelectionToolbar?: boolean;
  type?: ArticlePaywallType;
  summary?: string;
}

const meta: Meta<Args> = {
  title: 'Blocks/Content/Article',
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Long reading. Article: meta, h1, lead, author, cover and the Prose body in a 672 column with the Table of Contents on the right. Content with Image: one idea with one captioned picture and at most one pull Quote. Legal Page: Header Simple, a short-version Alert first, numbered sections, the date and the contact always visible. Document with Comments: an editable document with highlights and the comments panel. Article Paywall: the free preview fading into the Paywall Card (metered, registration or hard). Figma: BLOCKS / Content. Guide: eggux build-ui/patterns/content-and-docs.md' } },
  },
};
export default meta;
type Story = StoryObj<Args>;

const cat = (category: string) => ({ table: { category } });

export const ArticleStory: Story = {
  name: 'Article',
  args: { title: 'How we cut onboarding time in half with checklists', lead: 'Three changes to the first-run experience, the data behind them, and what we would do differently next time.', showImage: true, showToc: true },
  argTypes: {
    title: { name: 'Title', control: 'text', ...cat('Article') },
    lead: { name: 'Lead', control: 'text', description: 'One or two sentences.', ...cat('Article') },
    showImage: { name: 'Show cover image', control: 'boolean', ...cat('Article') },
    showToc: { name: 'Show table of contents', control: 'boolean', description: 'On the right from 1200 wide.', ...cat('Article') },
  },
  render: a => <Article title={a.title} lead={a.lead} showImage={a.showImage} showToc={a.showToc} />,
};

export const WithImage: Story = {
  name: 'Content with Image',
  args: { title: 'Built in small teams, shipped every week', showQuote: true, imageFirst: false },
  argTypes: {
    title: { name: 'Title', control: 'text', ...cat('Text') },
    showQuote: { name: 'Show pull quote', control: 'boolean', description: 'One pull Quote at most.', ...cat('Text') },
    imageFirst: { name: 'Image first', control: 'boolean', description: 'Image on the left from 1024 wide.', ...cat('Image') },
  },
  render: a => <ContentWithImage title={a.title} showQuote={a.showQuote} imageFirst={a.imageFirst} />,
};

export const Legal: Story = {
  name: 'Legal Page',
  args: { title: 'Privacy policy', summary: 'We collect only what we need to run Acme, we never sell your data, and you can export or delete it any time in Settings, Privacy and data.' },
  argTypes: {
    title: { name: 'Title', control: 'text', ...cat('Header') },
    summary: { name: 'Short version', control: 'text', description: 'The Alert at the top; empty hides it.', ...cat('Content') },
  },
  render: a => <LegalPage title={a.title} summary={a.summary} />,
};

export const Document: Story = {
  name: 'Document with Comments',
  args: { title: 'Q4 launch brief', showComments: true, showSelectionToolbar: true },
  argTypes: {
    title: { name: 'Title', control: 'text', ...cat('Header') },
    showComments: { name: 'Show comments panel', control: 'boolean', ...cat('Comments') },
    showSelectionToolbar: { name: 'Show selection toolbar', control: 'boolean', ...cat('Document') },
  },
  render: a => <DocumentWithComments title={a.title} showComments={a.showComments} showSelectionToolbar={a.showSelectionToolbar} />,
};

export const Paywall: Story = {
  name: 'Article Paywall',
  args: { type: 'metered' },
  argTypes: { type: { name: 'Type', control: 'inline-radio', options: ['metered', 'registration', 'hard'], description: 'metered: free reads used up; registration: a free account; hard: subscribers only.', ...cat('Paywall') } },
  render: a => <ArticlePaywall key={a.type} type={a.type} />,
};

/* Hidden checks */

const GroupA = ({ width }: { width: number }) => (
  <div style={{ width }} className="flex flex-col">
    <div data-block="article"><Article /></div>
    <div data-block="content-with-image"><ContentWithImage /></div>
    <div data-block="document"><DocumentWithComments /></div>
    <div data-block="paywall"><ArticlePaywall /></div>
  </div>
);

const box = (el: Element) => el.getBoundingClientRect();
const w = (el: Element | null) => Math.round(box(el!).width);
const q = (root: ParentNode, sel: string) => root.querySelector(sel)!;
const block = (root: HTMLElement, name: string) => q(root, `[data-block="${name}"]`) as HTMLElement;

async function common(canvasElement: HTMLElement, width: number) {
  const c = within(canvasElement);
  for (const b of canvasElement.querySelectorAll<HTMLElement>('[data-block]')) {
    // One h1 per page block; Content with Image is a section inside a page (h2).
    await expect(within(b).queryAllByRole('heading', { level: 1 })).toHaveLength(b.dataset.block === 'content-with-image' ? 0 : 1);
    await expect(b.scrollWidth).toBeLessThanOrEqual(width);
    await expect(w(b)).toBe(width);
  }
  for (const el of [...c.getAllByRole('link'), ...c.getAllByRole('button')]) await expect(el).toHaveAccessibleName();
  for (const img of canvasElement.querySelectorAll('img')) await expect(img.hasAttribute('alt')).toBe(true);
}

// Figma at 1440: article 672 between 224 columns, TOC visible; Content with Image 544 + 544, 64
// apart; editor 800 and the 360 comments panel; paywall column 672 and card 560.
export const DesktopA: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <GroupA width={1440} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 1440);
    const article = block(canvasElement, 'article');
    await expect(w(q(article, 'article'))).toBe(672);
    await expect(Math.round(box(q(article, 'article')).left - box(article).left)).toBe(144 + 224 + 16); // Figma: space-between leaves 16 on each side of the 672 column.
    const toc = within(article).getByRole('complementary', { name: 'Table of contents' });
    await expect(toc).toBeVisible();
    await expect(w(toc)).toBe(224);
    await expect(within(toc).getAllByRole('link')).toHaveLength(3);
    // Content with Image.
    const cwi = block(canvasElement, 'content-with-image');
    await expect(getComputedStyle(q(cwi, '[data-slot="section-container"]')).paddingTop).toBe('96px');
    await expect(w(q(cwi, '[data-slot="content-with-image-text"]'))).toBe(544);
    await expect(w(q(cwi, '[data-slot="image-figure"]'))).toBe(544);
    await expect(Math.round(box(q(cwi, '[data-slot="image-figure"]')).left - box(q(cwi, '[data-slot="content-with-image-text"]')).right)).toBe(64);
    await expect(within(cwi).getByRole('heading', { level: 2 })).toHaveTextContent('Built in small teams, shipped every week');
    await expect(cwi.querySelectorAll('[data-slot="quote"]')).toHaveLength(1);
    // Document with Comments.
    const doc = block(canvasElement, 'document');
    await expect(within(doc).getByRole('region', { name: 'Q4 launch brief' })).toBeInTheDocument();
    await expect(w(q(doc, '[data-slot="comments-panel"]'))).toBe(360);
    await expect(w(q(doc, '[data-slot="rich-text-editor"]'))).toBe(800);
    await expect(within(doc).getByRole('textbox', { name: 'Q4 launch brief' })).toHaveTextContent('Launch the new invoicing flow');
    await expect(doc.querySelectorAll('[data-slot="comment-highlight"]')).toHaveLength(4);
    await expect(within(doc).getAllByRole('article', { name: /^Thread on/ })).toHaveLength(3);
    await expect(within(doc).getByRole('toolbar', { name: 'Selected text' })).toBeVisible();
    // Paywall.
    const pay = block(canvasElement, 'paywall');
    await expect(w(q(pay, '[data-slot="article-paywall-preview"]'))).toBe(672);
    await expect(w(q(pay, '[data-slot="paywall-card"]'))).toBe(560);
    await expect(within(pay).getByRole('region', { name: 'You have read your 3 free articles this month' })).toBeInTheDocument();
  },
};

// 768: the TOC hides, Content with Image stacks, the comments panel moves under the document.
export const TabletA: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <GroupA width={768} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 768);
    const article = block(canvasElement, 'article');
    await expect(within(article).queryByRole('complementary', { name: 'Table of contents' })).toBeNull();
    await expect(w(q(article, 'article'))).toBe(672);
    const cwi = block(canvasElement, 'content-with-image');
    await expect(box(q(cwi, '[data-slot="image-figure"]')).top).toBeGreaterThan(box(q(cwi, '[data-slot="content-with-image-text"]')).bottom);
    const doc = block(canvasElement, 'document');
    await expect(box(q(doc, '[data-slot="comments-panel"]')).top).toBeGreaterThanOrEqual(box(q(doc, '[data-slot="document-area"]')).bottom);
    await expect(w(q(doc, '[data-slot="comments-panel"]'))).toBe(768);
  },
};

// 390: one column, nothing scrolls sideways; the selection toolbar and presence bar hide.
export const PhoneA: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <GroupA width={390} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 390);
    const doc = block(canvasElement, 'document');
    await expect(within(doc).queryByRole('toolbar', { name: 'Selected text' })).toBeNull();
    const cwi = block(canvasElement, 'content-with-image');
    await expect(getComputedStyle(q(cwi, '[data-slot="section-container"]')).paddingTop).toBe('64px');
    await expect(w(q(block(canvasElement, 'paywall'), '[data-slot="paywall-card"]'))).toBeLessThanOrEqual(358);
  },
};

const legalLayout = (width: number) => async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  await common(canvasElement, width);
  const c = within(canvasElement);
  await expect(c.getByRole('region', { name: 'Privacy policy' })).toBeInTheDocument();
  await expect(c.getByText(/Last updated/)).toBeVisible();
  const headings = c.getAllByRole('heading', { level: 2 });
  await expect(headings).toHaveLength(7);
  await expect(headings[0]).toHaveTextContent('1. Who we are');
  await expect(c.getByRole('navigation', { name: 'On this page' })).toBeInTheDocument();
  await expect(c.getByRole('navigation', { name: 'Other policies' })).toBeInTheDocument();
  await expect(c.getByText(/Questions about this policy/)).toBeVisible();
};

// Legal at 1440: Header Simple, then 192 / 720 / 192 columns, the Alert first.
export const LegalDesktop: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <div data-block="legal" style={{ width: 1440 }}><LegalPage /></div>,
  play: async (ctx) => {
    await legalLayout(1440)(ctx);
    const root = ctx.canvasElement;
    await expect(w(q(root, '[data-slot="legal-toc"]'))).toBe(192);
    await expect(w(q(root, '[data-slot="legal-content"]'))).toBe(720);
    await expect(w(q(root, '[data-slot="legal-related"]'))).toBe(192);
    await expect(q(root, '[data-slot="legal-content"]').textContent).toMatch(/^The short version/);
  },
};

// Legal at 768 and 390: one column, the date and the contact note stay visible.
export const LegalTablet: Story = { tags: ['!dev'], parameters: { controls: { disable: true } }, render: () => <div data-block="legal" style={{ width: 768 }}><LegalPage /></div>, play: legalLayout(768) };
export const LegalPhone: Story = { tags: ['!dev'], parameters: { controls: { disable: true } }, render: () => <div data-block="legal" style={{ width: 390 }}><LegalPage /></div>, play: legalLayout(390) };

// Comments panel closes and reopens from the header; the filter shows resolved threads; plan
// options move with arrows; each paywall Type renders its card.
export const Interactions: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ width: 1440 }}>
      <DocumentWithComments />
      <ArticlePaywall type="registration" />
      <ArticlePaywall type="hard" />
    </div>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('radio', { name: /Resolved 1/ }));
    await waitFor(() => expect(canvas.getByRole('article', { name: /New PDF template/ })).toBeInTheDocument());
    await userEvent.click(canvas.getByRole('button', { name: 'Close comments' }));
    await waitFor(() => expect(canvas.queryByRole('complementary', { name: /Comments/ })).toBeNull());
    const toggle = canvas.getByRole('button', { name: '3 open comments' });
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(toggle);
    await waitFor(() => expect(canvas.getByRole('complementary', { name: /Comments/ })).toBeInTheDocument());
    // Registration: email form, no plans; hard: lock badge and plans.
    const reg = canvas.getByRole('region', { name: 'Create a free account to keep reading' });
    await expect(within(reg).getByRole('textbox', { name: 'Email address' })).toBeInTheDocument();
    await expect(within(reg).queryByRole('radiogroup')).toBeNull();
    const hard = canvas.getByRole('region', { name: 'This article is for subscribers' });
    await expect(hard).toHaveTextContent('Subscribers');
    const yearly = within(hard).getByRole('radio', { name: /Yearly/ });
    yearly.focus();
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(within(hard).getByRole('radio', { name: /Monthly/ })).toHaveAttribute('aria-checked', 'true'));
  },
};

export const AllDark: Story = { tags: ['!dev'], parameters: { controls: { disable: true } }, globals: { theme: 'Dark' }, render: () => <GroupA width={1440} /> };
export const AllCorporate: Story = { tags: ['!dev'], parameters: { controls: { disable: true } }, globals: { theme: 'Corporate Light' }, render: () => <GroupA width={1440} /> };
export const LegalDark: Story = { tags: ['!dev'], parameters: { controls: { disable: true } }, globals: { theme: 'Dark' }, render: () => <div style={{ width: 1440 }}><LegalPage /></div> };
