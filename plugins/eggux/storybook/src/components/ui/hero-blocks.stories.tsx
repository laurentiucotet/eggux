import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import {
  HeroCentered,
  HeroFullBleedImage,
  HeroImageCollage,
  HeroPrompt,
  HeroSplit,
  HeroWithForm,
  HeroWithLogoCloud,
  HeroWithPhone,
  HeroWithScreenshot,
  HeroWithStats,
  HeroWithVideo,
  MobilePaywall,
} from './hero-blocks';

const meta = {
  title: 'Blocks/Hero/Hero',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The first block of a landing page: one promise (h1 with one accent phrase), one primary and one secondary action, and the proof that sells the product. Pick by what sells it: the product screen (Centered, with Screenshot, with Logo Cloud), one email field (with Form), a mobile app (with Phone), a brand photo (Full-bleed Image), a product tour (with Video), scale (with Stats), people (Image Collage), a photo or screen next to the text (Split). Hero Prompt is the signed-in home of a portal where people start by asking. Mobile Paywall: the in-app upgrade screen (list or comparison). Breakpoints are container queries: the hero follows the width it gets. Figma: BLOCKS / Hero. Guide: eggux build-ui/patterns/marketing-pages.md',
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const text = (name: string, category = 'Content') => ({ name, control: 'text' as const, table: { category } });
const heroArgTypes = {
  title: text('Title'),
  accent: text('Accent phrase'),
  lead: text('Lead'),
};

/* Visible stories: one per block, no play */

export const Centered: StoryObj<React.ComponentProps<typeof HeroCentered> & { showScreen: boolean }> = {
  args: { title: 'Work that runs', accent: 'on time', lead: 'Projects, clients and billing in one place, so your team spends the day on work, not admin.', note: '14-day trial. No card needed.', showScreen: true },
  argTypes: { ...heroArgTypes, note: text('Note'), showScreen: { name: 'Show screen', control: 'boolean', table: { category: 'Parts' } } },
  render: ({ showScreen, ...args }) => <HeroCentered {...args} screen={showScreen ? undefined : null} />,
};

export const WithScreenshot: StoryObj<React.ComponentProps<typeof HeroWithScreenshot>> = {
  name: 'With Screenshot',
  args: { title: 'Close the books faster, with', accent: 'every approval on record', lead: 'Invoices, approvals, reports and access in one workspace for finance and operations teams.' },
  argTypes: heroArgTypes,
  render: args => <HeroWithScreenshot {...args} />,
};

export const Prompt: StoryObj<React.ComponentProps<typeof HeroPrompt> & { showScreen: boolean; showPanel: boolean }> = {
  args: { accent: 'Welcome back', title: 'Ask about your invoices', placeholder: 'e.g. Which invoices are overdue this month?', showScreen: true, showPanel: true, onSubmit: fn() },
  argTypes: {
    accent: text('Accent (greeting)'),
    title: text('Title'),
    placeholder: text('Placeholder'),
    showScreen: { name: 'Show answer preview', control: 'boolean', table: { category: 'Parts' } },
    showPanel: { name: 'Show panel fill', control: 'boolean', table: { category: 'Parts' } },
  },
  render: ({ showScreen, showPanel, ...args }) => <HeroPrompt {...args} showPanelFill={showPanel} screen={showScreen ? undefined : null} />,
};

export const WithLogoCloud: StoryObj<React.ComponentProps<typeof HeroWithLogoCloud> & { showLogos: boolean }> = {
  name: 'With Logo Cloud',
  args: { title: 'Get paid faster with invoices that', accent: 'chase themselves', lead: 'Send invoices, collect card and bank payments and reconcile everything in one workspace. Teams save 11 hours a month on average.', logosCaption: 'Trusted by 2,400 finance teams in 30 countries', showLogos: true },
  argTypes: { ...heroArgTypes, logosCaption: text('Logos caption'), showLogos: { name: 'Show logos', control: 'boolean', table: { category: 'Parts' } } },
  render: ({ showLogos, ...args }) => <HeroWithLogoCloud {...args} logos={showLogos ? undefined : []} />,
};

export const WithForm: StoryObj<React.ComponentProps<typeof HeroWithForm>> = {
  name: 'With Form',
  args: { eyebrow: 'Invoicing for small teams', title: 'Invoices sent', accent: 'in two minutes', buttonLabel: 'Start free', hint: 'Free for 14 days. No credit card needed.', proofLabel: 'Join 1,200 finance teams', onSubmit: fn() },
  argTypes: { eyebrow: text('Eyebrow'), ...heroArgTypes, buttonLabel: text('Button label', 'Form'), hint: text('Hint', 'Form'), proofLabel: text('Proof label', 'Parts') },
  render: args => <HeroWithForm {...args} />,
};

export const WithPhone: StoryObj<React.ComponentProps<typeof HeroWithPhone>> = {
  name: 'With Phone',
  args: { eyebrow: 'Acme for iPhone and Android', title: 'Approve spend', accent: 'from anywhere', lead: 'Snap receipts, approve invoices and see your cash position in real time. Everything syncs with your Acme workspace.' },
  argTypes: { eyebrow: text('Eyebrow'), ...heroArgTypes },
  render: args => <HeroWithPhone {...args} />,
};

export const FullBleedImage: StoryObj<React.ComponentProps<typeof HeroFullBleedImage> & { showNavbar: boolean }> = {
  name: 'Full-bleed Image',
  args: { title: 'Made for the long way home', lead: 'Weatherproof jackets, packs and boots, tested on 2,000 km of coastal trails. Free returns within 60 days.', showNavbar: true },
  argTypes: { title: text('Title'), lead: text('Lead'), showNavbar: { name: 'Show navbar', control: 'boolean', table: { category: 'Parts' } } },
  render: ({ showNavbar, ...args }) => <HeroFullBleedImage {...args} navLinks={showNavbar ? undefined : null} />,
};

export const WithVideo: StoryObj<React.ComponentProps<typeof HeroWithVideo>> = {
  name: 'With Video',
  args: { title: 'See your whole month-end close', accent: 'in one place', lead: 'Watch a finance team of four close October in three days: bank feeds, approvals, reconciliation and the board report.', videoTitle: 'Product tour: month-end close in Acme' },
  argTypes: { ...heroArgTypes, videoTitle: text('Video title', 'Video') },
  render: args => <HeroWithVideo {...args} />,
};

export const WithStats: StoryObj<React.ComponentProps<typeof HeroWithStats>> = {
  name: 'With Stats',
  args: { eyebrow: 'Finance operations platform', title: 'The numbers behind', accent: '38,000 finance teams', lead: 'Acme runs invoicing, approvals and reporting for businesses in 30 countries, from two-person studios to listed companies.' },
  argTypes: { eyebrow: text('Eyebrow'), ...heroArgTypes },
  render: args => <HeroWithStats {...args} />,
};

export const ImageCollage: StoryObj<React.ComponentProps<typeof HeroImageCollage>> = {
  name: 'Image Collage',
  args: { eyebrow: 'Studio management', title: 'Where client work', accent: 'comes together', lead: 'Briefs, files, approvals and invoices for creative studios, in one shared space your clients actually enjoy using.', proofLabel: 'Used by 4,000 studios' },
  argTypes: { eyebrow: text('Eyebrow'), ...heroArgTypes, proofLabel: text('Proof label', 'Parts') },
  render: args => <HeroImageCollage {...args} />,
};

export const Split: StoryObj<React.ComponentProps<typeof HeroSplit>> = {
  args: { media: 'screenshot', showTrust: false, eyebrow: 'For growing teams', title: 'Less admin,', accent: 'more done', lead: 'Automatic reminders, approvals and invoices that run themselves while you work.' },
  argTypes: {
    media: { name: 'Media', control: 'inline-radio', options: ['screenshot', 'image'], description: 'A product screen in a Device Frame, or a photo.', table: { category: 'Parts' } },
    showTrust: { name: 'Show trust', control: 'boolean', description: 'Trust Badges under the actions.', table: { category: 'Parts' } },
    eyebrow: text('Eyebrow'),
    ...heroArgTypes,
  },
  render: args => <HeroSplit {...args} />,
};

export const Paywall: StoryObj<React.ComponentProps<typeof MobilePaywall>> = {
  name: 'Mobile Paywall',
  args: { paywallStyle: 'list', title: 'Unlock Lumora Pro', ctaLabel: 'Start 7-day free trial', onSubmit: fn(), onClose: fn() },
  argTypes: {
    paywallStyle: { name: 'Style', control: 'inline-radio', options: ['list', 'comparison'], description: 'Benefits and plan rows, or a Free vs Pro table with a period switch.', table: { category: 'Parts' } },
    title: text('Title'),
    ctaLabel: text('Button label'),
  },
  parameters: { layout: 'centered' },
  render: args => <div className="w-[390px] border border-border"><MobilePaywall {...args} /></div>,
};

/* Hidden checks: each block at 1440, 768 and 390 */

const WIDTHS = [1440, 768, 390] as const;
const atWidths = (node: () => React.ReactNode) => (
  <div className="flex flex-col gap-8">
    {WIDTHS.map(w => <div key={w} data-width={w} style={{ width: w }}>{node()}</div>)}
  </div>
);
// Three copies of one hero share names: landmark uniqueness is checked on the visible stories.
const multi = { a11y: { config: { rules: [{ id: 'landmark-unique', enabled: false }] } } };

const box = (el: Element) => el.getBoundingClientRect();
const px = (el: Element, prop: string) => parseFloat(getComputedStyle(el).getPropertyValue(prop));

type Layout = 'centered' | 'split' | 'none';
/** Landmark and headings, named controls, no overflow; at 1440 the Figma paddings and widths; split columns collapse under 896. */
async function checkHero(canvasElement: HTMLElement, slot: string, layout: Layout, opts: { top?: number } = {}) {
  for (const w of WIDTHS) {
    const wrap = canvasElement.querySelector<HTMLElement>(`[data-width="${w}"]`)!;
    const c = within(wrap);
    const h1s = c.getAllByRole('heading', { level: 1 });
    await expect(h1s).toHaveLength(1);
    const region = h1s[0]!.closest('section')!;
    await expect(region).toHaveAttribute('data-slot', slot);
    await expect(region).toHaveAttribute('aria-labelledby', h1s[0]!.id);
    for (const el of [...c.queryAllByRole('link'), ...c.queryAllByRole('button')]) {
      await expect((el.textContent ?? '').trim() || el.getAttribute('aria-label') || el.getAttribute('aria-labelledby')).toBeTruthy();
    }
    for (const img of wrap.querySelectorAll('img')) await expect(img.hasAttribute('alt')).toBe(true);
    for (const s of wrap.querySelectorAll('[data-slot="hero-screen"]')) await expect(s.getAttribute('aria-label')).toBeTruthy();
    const wider = [...wrap.querySelectorAll('*')].filter(el => box(el).right > box(wrap).right + 0.5 && !el.closest('[data-slot="device-frame"]')).map(el => `${el.tagName}.${el.getAttribute('data-slot') ?? ''}`);
    await expect({ w, wider: wider.slice(0, 5) }).toEqual({ w, wider: [] });
    await expect(wrap.scrollWidth).toBeLessThanOrEqual(w);
    await expect(region.scrollWidth).toBeLessThanOrEqual(w);
    const content = region.querySelector('[data-slot="hero-content"]')!;
    if (w === 1440) {
      await expect(px(region.querySelector('[data-slot="hero-body"]') ?? region, 'padding-top')).toBe(opts.top ?? 96);
      const inner = region.querySelector('[data-slot="hero-body"] > div');
      if (inner) await expect(Math.round(box(inner).width)).toBe(1152);
      await expect(Math.round(box(h1s[0]!).height) % 60).toBe(0);
    }
    if (layout === 'split') {
      const media = content.nextElementSibling!;
      if (w === 1440) {
        await expect(Math.round(box(content).width)).toBe(544);
        await expect(Math.round(box(media).width)).toBe(544);
        await expect(box(media).left).toBeGreaterThan(box(content).right);
      } else {
        await expect(box(media).top).toBeGreaterThanOrEqual(box(content).bottom);
      }
    }
    if (layout === 'centered') {
      await expect(getComputedStyle(content).textAlign).toBe('center');
    }
  }
}

export const CenteredCheck: Story = {
  tags: ['!dev'],
  parameters: multi,
  render: () => atWidths(() => <HeroCentered />),
  play: async ({ canvasElement }) => {
    await checkHero(canvasElement, 'hero-centered', 'centered');
    const wide = canvasElement.querySelector('[data-width="1440"]')!;
    await expect(Math.round(box(wide.querySelector('[data-slot="hero-content"]')!).width)).toBe(768);
    await expect(Math.round(box(wide.querySelector('[data-slot="device-frame"]')!).width)).toBe(1152);
    // Buttons 40 high (Button size lg), primary first.
    const links = within(wide.querySelector('[data-slot="action-bar"]') as HTMLElement).getAllByRole('link');
    await expect(links.map(l => l.textContent)).toEqual(['Start free trial', 'Book a demo']);
    await expect(Math.round(box(links[0]!).height)).toBe(40);
    // The screen is one image: its widgets are out of the tab order.
    await expect(within(wide as HTMLElement).getByRole('img', { name: /Acme dashboard/ })).toBeInTheDocument();
    await expect(wide.querySelector('[data-slot="hero-screen"] [inert]')).not.toBeNull();
  },
};

export const WithScreenshotCheck: Story = {
  tags: ['!dev'],
  parameters: multi,
  render: () => atWidths(() => <HeroWithScreenshot />),
  play: async ({ canvasElement }) => {
    await checkHero(canvasElement, 'hero-with-screenshot', 'centered');
    const wide = canvasElement.querySelector('[data-width="1440"]')!;
    await expect(Math.round(box(wide.querySelector('[data-slot="hero-content"]')!).width)).toBe(896);
    await expect(Math.round(box(wide.querySelector('[data-slot="device-frame"]')!).width)).toBe(1184);
  },
};

const onAsk = fn();
export const PromptCheck: Story = {
  tags: ['!dev'],
  parameters: multi,
  render: () => atWidths(() => <HeroPrompt onSubmit={onAsk} />),
  play: async ({ canvasElement }) => {
    await checkHero(canvasElement, 'hero-prompt', 'none');
    const wide = within(canvasElement.querySelector<HTMLElement>('[data-width="1440"]')!);
    // Accent above the title, both in the one h1.
    await expect(wide.getByRole('heading', { level: 1 })).toHaveTextContent('Welcome backAsk about your invoices');
    const prompt = wide.getByRole('textbox', { name: 'Ask a question or start a task' });
    await userEvent.click(wide.getByRole('button', { name: 'Revenue by customer' }));
    await waitFor(() => expect(prompt).toHaveValue('Revenue by customer'));
    await userEvent.click(prompt);
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(onAsk).toHaveBeenCalledWith('Revenue by customer'));
    await expect(wide.getAllByRole('listitem').length).toBeGreaterThanOrEqual(3);
  },
};

export const WithLogoCloudCheck: Story = {
  tags: ['!dev'],
  parameters: multi,
  render: () => atWidths(() => <HeroWithLogoCloud />),
  play: async ({ canvasElement }) => {
    await checkHero(canvasElement, 'hero-with-logo-cloud', 'centered');
    const cols = (w: number) => {
      const tiles = [...canvasElement.querySelectorAll(`[data-width="${w}"] [data-slot="logo-tile"]`)];
      return new Set(tiles.map(t => Math.round(box(t).top))).size;
    };
    // Six logos: one row of 192 wide tiles at 1440, two rows at 768, three at 390.
    const wideTile = canvasElement.querySelector('[data-width="1440"] [data-slot="logo-tile"]')!;
    await expect(Math.round(box(wideTile).width)).toBe(192);
    await expect(cols(1440)).toBe(1);
    await expect(cols(768)).toBe(2);
    await expect(cols(390)).toBe(3);
    await expect(within(canvasElement.querySelector<HTMLElement>('[data-width="1440"]')!).getByRole('list', { name: 'Customers' })).toBeInTheDocument();
  },
};

const onEmail = fn();
export const WithFormCheck: Story = {
  tags: ['!dev'],
  parameters: multi,
  render: () => atWidths(() => <HeroWithForm onSubmit={onEmail} />),
  play: async ({ canvasElement }) => {
    await checkHero(canvasElement, 'hero-with-form', 'split');
    const wide = within(canvasElement.querySelector<HTMLElement>('[data-width="1440"]')!);
    const email = wide.getByRole('textbox', { name: 'Work email' });
    await userEvent.type(email, 'ana@acme');
    await userEvent.click(wide.getByRole('button', { name: 'Start free' }));
    await waitFor(() => expect(email).toHaveAttribute('aria-invalid', 'true'));
    await expect(onEmail).not.toHaveBeenCalled();
    await userEvent.type(email, '.com');
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(onEmail).toHaveBeenCalledWith('ana@acme.com'));
    await expect(await wide.findByText(/Check your inbox/)).toBeInTheDocument();
    await expect(wide.getByRole('img', { name: /Rated 4\.9 out of 5/ })).toBeInTheDocument();
  },
};

export const WithPhoneCheck: Story = {
  tags: ['!dev'],
  parameters: multi,
  render: () => atWidths(() => <HeroWithPhone />),
  play: async ({ canvasElement }) => {
    await checkHero(canvasElement, 'hero-with-phone', 'split');
    const wide = canvasElement.querySelector<HTMLElement>('[data-width="1440"]')!;
    await expect(within(wide).getByRole('link', { name: /App Store/ })).toHaveAttribute('href', '#app-store');
    await expect(within(wide).getByRole('link', { name: /Google Play/ })).toBeInTheDocument();
    await expect(Math.round(box(wide.querySelector('[data-slot="hero-visual"]')!).height)).toBe(560);
    await expect(Math.round(box(wide.querySelector('[data-device="phone"]')!).width)).toBe(390);
  },
};

export const FullBleedImageCheck: Story = {
  tags: ['!dev'],
  parameters: multi,
  render: () => atWidths(() => <HeroFullBleedImage />),
  play: async ({ canvasElement }) => {
    await checkHero(canvasElement, 'hero-full-bleed-image', 'none', { top: 0 });
    const wide = canvasElement.querySelector<HTMLElement>('[data-width="1440"]')!;
    await expect(Math.round(box(wide.querySelector('[data-slot="hero-full-bleed-image"]')!).height)).toBe(720);
    await expect(wide.querySelector('[data-slot="site-navbar"]')).toHaveAttribute('data-variant', 'on-image');
    await expect(wide.querySelector('[data-slot="scrim"], [data-tone="media"]')).not.toBeNull();
    await expect(Math.round(box(wide.querySelector('[data-slot="hero-content"]')!).width)).toBe(720);
  },
};

export const WithVideoCheck: Story = {
  tags: ['!dev'],
  parameters: multi,
  render: () => atWidths(() => <HeroWithVideo />),
  play: async ({ canvasElement }) => {
    await checkHero(canvasElement, 'hero-with-video', 'centered');
    const wide = within(canvasElement.querySelector<HTMLElement>('[data-width="1440"]')!);
    const play = wide.getByRole('button', { name: /Play/ });
    await expect(play).toBeInTheDocument();
    const player = canvasElement.querySelector('[data-width="1440"] [data-slot="video-player"]') ?? play.closest('[data-state]')!;
    await expect(Math.round(box(player).width)).toBe(1152);
    await expect(Math.round(box(player).height)).toBe(648);
  },
};

export const WithStatsCheck: Story = {
  tags: ['!dev'],
  parameters: multi,
  render: () => atWidths(() => <HeroWithStats />),
  play: async ({ canvasElement }) => {
    await checkHero(canvasElement, 'hero-with-stats', 'none');
    const wide = canvasElement.querySelector<HTMLElement>('[data-width="1440"]')!;
    await expect(Math.round(box(wide.querySelector('[data-slot="image-placeholder"]')!).height)).toBe(440);
    const items = [...wide.querySelectorAll('[data-slot="metric-strip-item"]')];
    await expect(items).toHaveLength(4);
    await expect(new Set(items.map(i => Math.round(box(i).top))).size).toBe(1);
    await expect(Math.round(box(items[0]!).width)).toBe(288);
    const narrow = [...canvasElement.querySelectorAll('[data-width="390"] [data-slot="metric-strip-item"]')];
    await expect(new Set(narrow.map(i => Math.round(box(i).top))).size).toBeGreaterThan(1);
  },
};

export const ImageCollageCheck: Story = {
  tags: ['!dev'],
  parameters: multi,
  render: () => atWidths(() => <HeroImageCollage />),
  play: async ({ canvasElement }) => {
    await checkHero(canvasElement, 'hero-image-collage', 'split');
    const wide = canvasElement.querySelector<HTMLElement>('[data-width="1440"]')!;
    const imgs = [...wide.querySelectorAll('[data-slot="hero-collage"] [data-slot="image-placeholder"]')];
    await expect(imgs).toHaveLength(5);
    await expect(Math.round(box(imgs[0]!).width)).toBe(171);
    // Staggered columns: 72 and 136 px offsets.
    const collage = wide.querySelector('[data-slot="hero-collage"]')!;
    await expect(Math.round(box(imgs[0]!).top - box(collage).top)).toBe(72);
    await expect(Math.round(box(imgs[4]!).top - box(collage).top)).toBe(136);
  },
};

export const SplitCheck: Story = {
  tags: ['!dev'],
  parameters: multi,
  render: () => atWidths(() => <HeroSplit showTrust />),
  play: async ({ canvasElement }) => {
    await checkHero(canvasElement, 'hero-split', 'split');
    const wide = within(canvasElement.querySelector<HTMLElement>('[data-width="1440"]')!);
    await expect(wide.getByRole('list', { name: 'Certifications' })).toBeInTheDocument();
    await expect(wide.getByRole('img', { name: /PR-2041/ })).toBeInTheDocument();
  },
};

export const SplitImageCheck: Story = {
  tags: ['!dev'],
  parameters: multi,
  render: () => atWidths(() => <HeroSplit media="image" />),
  play: async ({ canvasElement }) => {
    await checkHero(canvasElement, 'hero-split', 'split');
    const media = canvasElement.querySelector('[data-width="1440"] [data-slot="hero-content"]')!.nextElementSibling!;
    await expect(media).toHaveAttribute('data-slot', 'image-placeholder');
    await expect(Math.round(box(media).height)).toBe(408);
  },
};

const onPlan = fn();
export const PaywallCheck: Story = {
  tags: ['!dev'],
  parameters: { layout: 'centered' },
  render: () => (
    <div className="flex items-start gap-8">
      <div data-paywall="list" className="w-[390px]"><MobilePaywall onSubmit={onPlan} /></div>
      <div data-paywall="comparison" className="w-[390px]"><MobilePaywall paywallStyle="comparison" title="Go further with Lumora Pro" onSubmit={onPlan} /></div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const list = within(canvasElement.querySelector<HTMLElement>('[data-paywall="list"]')!);
    await expect(list.getByRole('heading', { level: 2, name: 'Unlock Lumora Pro' })).toBeInTheDocument();
    await expect(list.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    const yearly = list.getByRole('radio', { name: /Yearly/ });
    await expect(yearly).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(list.getByRole('radio', { name: /Monthly/ }));
    await waitFor(() => expect(list.getByRole('radio', { name: /Monthly/ })).toHaveAttribute('aria-checked', 'true'));
    await userEvent.click(list.getByRole('button', { name: 'Start 7-day free trial' }));
    await expect(onPlan).toHaveBeenLastCalledWith('monthly');
    const cmp = within(canvasElement.querySelector<HTMLElement>('[data-paywall="comparison"]')!);
    await expect(cmp.getByRole('table', { name: 'Free and Pro compared' })).toBeInTheDocument();
    await expect(cmp.getAllByText('Included').length).toBe(2);
    await userEvent.click(cmp.getByRole('radio', { name: 'Monthly' }));
    await waitFor(() => expect(cmp.getByText('€11.99')).toBeInTheDocument());
    for (const el of canvasElement.querySelectorAll('[data-slot="mobile-paywall"]')) await expect(el.scrollWidth).toBeLessThanOrEqual(390);
  },
};

/* Theme copies for contrast (axe) */
export const CenteredDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, render: () => <HeroCentered /> };
export const CenteredBackOffice: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: () => <HeroCentered /> };
export const FullBleedDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, render: () => <HeroFullBleedImage /> };
