import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { AboutHero, MissionWithFigures, OurStory, TimelineSection, Values } from './section-about';

const meta = {
  title: 'Blocks/Sections/About',
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'The About page, in this order: About Hero (the page h1 and four photos), Mission with Figures, Our Story (with Milestones), Values; then Team, a testimonial, partners and a CTA. Timeline Section for 3 to 5 milestones on about, careers or investor pages. Figma: BLOCKS / Sections (About). Guide: eggux build-ui/patterns/marketing-pages.md' } },
  },
} satisfies Meta;
export default meta;

const cat = (category: string) => ({ table: { category } });
const text = (name: string, description: string, category = 'Content') => ({ name, control: 'text' as const, description, ...cat(category) });
const bool = (name: string, description: string, category = 'Content') => ({ name, control: 'boolean' as const, description, ...cat(category) });

type HeadArgs = { overline: string; title: string; description: string };
const headArgTypes = (titleHint: string) => ({
  overline: text('Overline', 'Short label above the title.'),
  title: text('Title', titleHint),
  description: text('Description', 'One or two sentences.'),
});

export const Hero: StoryObj<HeadArgs> = {
  name: 'About Hero',
  args: {
    overline: 'About Acme',
    title: 'We help finance teams get paid on time',
    description: 'Acme started in 2017 in a Bucharest accounting office. Today 140 people in Bucharest, Berlin and London build the tools 1,200 companies use to send invoices, approve spend and chase late payments, kindly.',
  },
  argTypes: headArgTypes('The page h1: what the company does for whom.'),
  render: a => <AboutHero overline={a.overline} title={a.title} description={a.description} />,
};

export const Mission: StoryObj<HeadArgs & { showImage: boolean }> = {
  name: 'Mission with Figures',
  args: {
    overline: 'Our mission',
    title: 'Every invoice paid on time, without a single awkward email',
    description: 'Late payments sink more small companies than bad products. We build the reminders, approvals and reports that keep cash coming in, so finance teams can spend Friday on something else.',
    showImage: true,
  },
  argTypes: { ...headArgTypes('Section title (h2): the mission in one line.'), showImage: bool('Show image', 'The 1:1 photo on the right.') },
  render: a => <MissionWithFigures overline={a.overline} title={a.title} description={a.description} image={a.showImage ? undefined : null} />,
};

export const Story: StoryObj<{ overline: string; title: string; showImage: boolean; milestonesTitle: string }> = {
  name: 'Our Story',
  args: { overline: 'Our story', title: 'Started in an accounting office tired of chasing invoices', showImage: true, milestonesTitle: 'Milestones' },
  argTypes: {
    overline: text('Overline', 'Short label above the title.'),
    title: text('Title', 'Section title (h2).'),
    showImage: bool('Show image', 'The Image Figure under the story.'),
    milestonesTitle: text('Milestones title', 'Title of the milestones card (h3).'),
  },
  render: a => <OurStory overline={a.overline} title={a.title} image={a.showImage ? undefined : null} milestonesTitle={a.milestonesTitle} />,
};

export const ValuesStory: StoryObj<HeadArgs> = {
  name: 'Values',
  args: { overline: 'Our values', title: 'What we hold ourselves to', description: 'Six habits that decide how we build, support and sell Acme.' },
  argTypes: headArgTypes('Section Header title (h2).'),
  render: a => <Values overline={a.overline} title={a.title} description={a.description} />,
};

export const TimelineStory: StoryObj<HeadArgs> = {
  name: 'Timeline Section',
  args: { overline: 'Our journey', title: 'Nine years of getting finance teams paid', description: 'From a two-person studio in Bucharest to 1,200 customers in 30 countries.' },
  argTypes: headArgTypes('Section Header title (h2).'),
  render: a => <TimelineSection overline={a.overline} title={a.title} description={a.description} />,
};

/* Hidden checks */

const box = (el: Element) => el.getBoundingClientRect();
const r = (n: number) => Math.round(n);
const slot = (root: Element, name: string) => root.querySelector(`[data-slot="${name}"]`)!;
const items = (root: Element, name: string) => [...root.querySelectorAll(`[data-slot="${name}"]`)];
const tops = (els: Element[]) => new Set(els.map(e => r(box(e).top))).size;
const lefts = (els: Element[]) => new Set(els.map(e => r(box(e).left))).size;

const HERO = 'We help finance teams get paid on time';
const MISSION = 'Every invoice paid on time, without a single awkward email';
const STORY = 'Started in an accounting office tired of chasing invoices';
const VALUES = 'What we hold ourselves to';
const JOURNEY = 'Nine years of getting finance teams paid';

const All = ({ width }: { width: number }) => (
  <div className="flex flex-col" style={{ width }}>
    <AboutHero />
    <MissionWithFigures />
    <OurStory />
    <Values />
    <TimelineSection />
  </div>
);

async function common(root: HTMLElement, width: number) {
  const c = within(root);
  // One h1 (About Hero); the other blocks use h2.
  const h1 = c.getAllByRole('heading', { level: 1 });
  await expect(h1).toHaveLength(1);
  await expect(h1[0]).toHaveTextContent(HERO);
  await expect(c.getAllByRole('heading', { level: 2 })).toHaveLength(4);
  const regions = c.getAllByRole('region');
  await expect(regions).toHaveLength(5);
  for (const s of regions) {
    await expect(s).toHaveAccessibleName();
    await expect(s.scrollWidth).toBeLessThanOrEqual(width);
  }
  for (const el of [...c.queryAllByRole('link'), ...c.queryAllByRole('button')]) await expect(el).toHaveAccessibleName();
  for (const img of root.querySelectorAll('img')) await expect(img).toHaveAttribute('alt');
  await expect(c.getByRole('list', { name: 'Milestones' }).children).toHaveLength(5);
  await expect(c.getByRole('list', { name: JOURNEY }).children).toHaveLength(5);
  await expect((root.firstElementChild as HTMLElement).scrollWidth).toBeLessThanOrEqual(width);
}

export const Check1440: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={1440} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 1440);
    const c = within(canvasElement);
    // About Hero: header 896, 96 top; four photos 232 / 416 / 232 / 200, 24 apart, 64 under the header.
    const hero = c.getByRole('region', { name: HERO });
    const header = slot(hero, 'about-hero-header');
    await expect(r(box(header).width)).toBe(896);
    await expect(r(box(header).top - box(hero).top)).toBe(96);
    const photos = items(slot(hero, 'about-hero-images'), 'image-placeholder');
    await expect(photos.map(p => r(box(p).width))).toEqual([232, 416, 232, 200]);
    await expect(r(box(photos[1]!).left - box(photos[0]!).right)).toBe(24);
    await expect(r(box(slot(hero, 'about-hero-images')).top - box(header).bottom)).toBe(64);
    // Mission: 608 text, 64 gap, 480 photo; figures 2 × 256, 32 apart.
    const mission = c.getByRole('region', { name: MISSION });
    const mText = slot(mission, 'mission-text');
    const mImg = slot(slot(mission, 'mission-row'), 'image-placeholder');
    await expect(r(box(mText).width)).toBe(608);
    await expect(r(box(mImg).width)).toBe(480);
    await expect(r(box(mImg).left - box(mText).right)).toBe(64);
    const figs = items(mission, 'figure');
    await expect(lefts(figs)).toBe(2);
    await expect(r(box(figs[0]!).width)).toBe(256);
    await expect(r(box(figs[1]!).left - box(figs[0]!).right)).toBe(32);
    // Our Story: 640 text, 64 gap, 448 card with 32 padding.
    const story = c.getByRole('region', { name: STORY });
    const sText = slot(story, 'our-story-text');
    const card = slot(story, 'our-story-milestones');
    await expect(r(box(sText).width)).toBe(640);
    await expect(r(box(card).width)).toBe(448);
    await expect(r(box(card).left - box(sText).right)).toBe(64);
    await expect(r(box(card.querySelector('h3')!).left - box(card).left)).toBe(33);
    // Values: three columns of 362, 32 apart, 48 under the header.
    const values = c.getByRole('region', { name: VALUES });
    const vItems = items(values, 'feature-item');
    await expect(lefts(vItems)).toBe(3);
    await expect(Math.abs(box(vItems[0]!).width - 362)).toBeLessThan(1);
    await expect(r(box(vItems[1]!).left - box(vItems[0]!).right)).toBe(32);
    await expect(r(box(slot(values, 'values-grid')).top - box(slot(values, 'section-header')).bottom)).toBe(48);
    // Timeline Section: five columns of 230 in one row; cards 206 (24 right padding); years row visible.
    const journey = c.getByRole('region', { name: JOURNEY });
    const tItems = items(journey, 'timeline-item');
    await expect(tops(tItems)).toBe(1);
    await expect(r(box(tItems[1]!).left - box(tItems[0]!).left)).toBe(230);
    await expect(r(box(tItems[0]!).width)).toBe(230);
    await expect(slot(journey, 'timeline-section-years')).toBeVisible();
  },
};

export const Check768: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={768} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 768);
    const c = within(canvasElement);
    // Hero photos keep one row; Mission and Story stack; Values two columns; timeline cards stack.
    await expect(lefts(items(slot(c.getByRole('region', { name: HERO }), 'about-hero-images'), 'image-placeholder'))).toBe(4);
    const mission = c.getByRole('region', { name: MISSION });
    await expect(box(slot(slot(mission, 'mission-row'), 'image-placeholder')).top).toBeGreaterThan(box(slot(mission, 'mission-text')).bottom);
    const story = c.getByRole('region', { name: STORY });
    await expect(box(slot(story, 'our-story-milestones')).top).toBeGreaterThan(box(slot(story, 'our-story-text')).bottom);
    await expect(lefts(items(c.getByRole('region', { name: VALUES }), 'feature-item'))).toBe(2);
    const journey = c.getByRole('region', { name: JOURNEY });
    await expect(tops(items(journey, 'timeline-item'))).toBe(5);
    await expect(slot(journey, 'timeline-section-years')).not.toBeVisible();
  },
};

export const Check390: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={390} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 390);
    const c = within(canvasElement);
    // Hero photos 2 × 2; figures and values one column; 24 px gutters.
    const hero = c.getByRole('region', { name: HERO });
    await expect(lefts(items(slot(hero, 'about-hero-images'), 'image-placeholder'))).toBe(2);
    await expect(r(box(slot(hero, 'about-hero-images')).left - box(hero).left)).toBe(24);
    await expect(lefts(items(c.getByRole('region', { name: MISSION }), 'figure'))).toBe(1);
    await expect(lefts(items(c.getByRole('region', { name: VALUES }), 'feature-item'))).toBe(1);
  },
};

export const AllDark: StoryObj = { tags: ['!dev'], globals: { theme: 'Dark' }, render: () => <All width={1440} /> };
export const AllBackOffice: StoryObj = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: () => <All width={1440} /> };
