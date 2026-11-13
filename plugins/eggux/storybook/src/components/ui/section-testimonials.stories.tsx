import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  TestimonialCarousel,
  TestimonialGrid,
  Testimonials,
  TestimonialSingle,
  TestimonialSplit,
  TestimonialVideo,
  TestimonialWall,
} from './section-testimonials';

const meta = {
  title: 'Blocks/Sections/Testimonials',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Customer proof for marketing pages: real name, role and company, specific results over praise. Testimonials: three cards. Single: one strong quote. Grid: breadth, six cards on the muted band. Split: a case study for enterprise buyers, with result numbers. Carousel: only past six quotes. Wall: a customers or reviews page (featured story, then a masonry). Video: when a customer recorded the story (a line from the video plus 3 result figures). Figma: BLOCKS / Sections (Testimonials). Guide: eggux build-ui/patterns/marketing-pages.md',
      },
    },
  },
} satisfies Meta;
export default meta;

const cat = (category: string) => ({ table: { category } });
const text = (name: string, description: string, category = 'Content') => ({ name, control: 'text' as const, description, ...cat(category) });
const bool = (name: string, description: string, category = 'Content') => ({ name, control: 'boolean' as const, description, ...cat(category) });

type HeaderArgs = { overline: string; title: string; description: string };
const headerArgTypes = {
  overline: text('Overline', 'Section Header overline.', 'Section Header'),
  title: text('Title', 'Section Header title: says the answer, not the topic.', 'Section Header'),
  description: text('Description', 'Section Header description.', 'Section Header'),
};
const header = (a: HeaderArgs) => ({ overline: a.overline, title: a.title, description: a.description });

export const Default: StoryObj<HeaderArgs> = {
  name: 'Testimonials',
  args: { overline: 'Customers', title: 'Teams that run on Acme', description: 'What changed after the first three months.' },
  argTypes: headerArgTypes,
  render: a => <Testimonials header={header(a)} />,
};

type SingleArgs = { showLogo: boolean; quote: string; name: string; role: string };
export const Single: StoryObj<SingleArgs> = {
  name: 'Testimonial Single',
  args: {
    showLogo: true,
    quote: 'We closed the books four days faster in the first quarter. Approvals no longer live in email, and our auditors see every change.',
    name: 'Elena Popa',
    role: 'CFO, Northwind Traders',
  },
  argTypes: {
    showLogo: bool('Show logo', 'The customer logo above the quote.'),
    quote: text('Quote', 'One strong, specific quote (no quote marks: the Quote adds them).'),
    name: text('Name', 'Real name.', 'Attribution'),
    role: text('Role', 'Role and company.', 'Attribution'),
  },
  render: a => <TestimonialSingle company={a.showLogo ? 'Northwind' : null} quote={a.quote} by={{ name: a.name, role: a.role }} />,
};

export const Grid: StoryObj<HeaderArgs> = {
  name: 'Testimonial Grid',
  args: { overline: 'Customers', title: 'Teams that run on Acme', description: 'From 10-person agencies to 4,000-person enterprises.' },
  argTypes: headerArgTypes,
  render: a => <TestimonialGrid header={header(a)} />,
};

type SplitArgs = { overline: string; quote: string; name: string; role: string; showResults: boolean; showLink: boolean };
export const Split: StoryObj<SplitArgs> = {
  name: 'Testimonial Split',
  args: {
    overline: 'Case study',
    quote: '“Month-end used to take nine days. With approvals and reports in one place, we close in five.”',
    name: 'Elena Popa',
    role: 'CFO, Northwind Traders',
    showResults: true,
    showLink: true,
  },
  argTypes: {
    overline: text('Overline', 'Short label above the quote.'),
    quote: text('Quote', 'The result in the customer’s words.'),
    name: text('Name', 'Real name.', 'Attribution'),
    role: text('Role', 'Role and company.', 'Attribution'),
    showResults: bool('Show results', 'Three result numbers, the same as in the case study.'),
    showLink: bool('Show link', 'Link to the case study.'),
  },
  render: a => (
    <TestimonialSplit
      overline={a.overline}
      quote={a.quote}
      by={{ name: a.name, role: a.role }}
      figures={a.showResults ? undefined : []}
      link={a.showLink ? undefined : null}
    />
  ),
};

export const CarouselStory: StoryObj<HeaderArgs> = {
  name: 'Testimonial Carousel',
  args: { overline: 'Customers', title: 'What our customers say', description: 'Stories from finance, sales and operations teams.' },
  argTypes: headerArgTypes,
  render: a => <TestimonialCarousel header={header(a)} />,
};

type WallArgs = HeaderArgs & { showScore: boolean; showAction: boolean };
export const Wall: StoryObj<WallArgs> = {
  name: 'Testimonial Wall',
  args: {
    overline: 'Customer stories',
    title: 'Loved by 1,200 finance teams',
    description: 'Real quotes from customers who moved invoicing, approvals and reporting to Acme.',
    showScore: true,
    showAction: true,
  },
  argTypes: { ...headerArgTypes, showScore: bool('Show rating', 'The overall score and review count.'), showAction: bool('Show action', 'Link to all reviews.') },
  render: a => <TestimonialWall header={header(a)} score={a.showScore ? undefined : null} action={a.showAction ? undefined : null} />,
};

type VideoArgs = { quote: string; name: string; role: string; showResults: boolean };
export const Video: StoryObj<VideoArgs> = {
  name: 'Testimonial Video',
  args: {
    quote: '“Our drivers’ invoices used to wait two weeks for a signature. Now approvals happen the same day, and we know our cash position every morning.”',
    name: 'Pieter de Vries',
    role: 'Finance Director, Kestrel Logistics',
    showResults: true,
  },
  argTypes: {
    quote: text('Quote', 'A line from the video.'),
    name: text('Name', 'Real name.', 'Attribution'),
    role: text('Role', 'Role and company.', 'Attribution'),
    showResults: bool('Show results', 'Three result figures.'),
  },
  render: a => <TestimonialVideo quote={a.quote} by={{ name: a.name, role: a.role }} figures={a.showResults ? undefined : []} />,
};

/* Hidden checks */

const box = (el: Element) => el.getBoundingClientRect();
const r = (n: number) => Math.round(n);
const tops = (els: Element[]) => new Set(els.map(e => r(box(e).top))).size;
const lefts = (els: Element[]) => new Set(els.map(e => r(box(e).left))).size;
const slot = (root: Element, name: string) => root.querySelector(`[data-slot="${name}"]`)!;
const items = (root: Element, name: string) => [...root.querySelectorAll(`[data-slot="${name}"]`)];

const All = ({ width }: { width: number }) => (
  <div className="flex flex-col" style={{ width }}>
    <Testimonials />
    <TestimonialSingle />
    <TestimonialGrid header={{ overline: 'Customers', title: 'Six teams, six results', description: 'From 10-person agencies to 4,000-person enterprises.' }} />
    <TestimonialSplit />
    <TestimonialCarousel />
    <TestimonialWall />
    <TestimonialVideo />
  </div>
);

const names = {
  three: 'Teams that run on Acme',
  single: 'Customer quote',
  split: 'Northwind Traders case study',
  carousel: 'What our customers say',
  wall: 'Loved by 1,200 finance teams',
  video: 'Kestrel Logistics customer story',
};
const section = (root: HTMLElement, slotName: string) => root.querySelector(`section[data-slot="${slotName}"]`) as HTMLElement;

async function common(root: HTMLElement, width: number) {
  const c = within(root);
  await expect(root.querySelectorAll('h1')).toHaveLength(0);
  const sections = [...root.querySelectorAll(':scope > div > section')];
  await expect(sections).toHaveLength(7);
  for (const s of sections) {
    await expect(s).toHaveAccessibleName();
    await expect(s.scrollWidth).toBeLessThanOrEqual(width);
  }
  // Four blocks carry a visible title (h2); Single, Split and Video are named by their label.
  await expect(c.getAllByRole('heading', { level: 2 })).toHaveLength(4);
  for (const el of [...c.queryAllByRole('link'), ...c.queryAllByRole('button')]) await expect(el).toHaveAccessibleName();
  for (const img of root.querySelectorAll('img')) await expect(img).toHaveAttribute('alt');
  for (const q of root.querySelectorAll('figure blockquote')) await expect(q.closest('figure')!.querySelector('figcaption')).not.toBeNull();
  await expect((root.firstElementChild as HTMLElement).scrollWidth).toBeLessThanOrEqual(width);
}

export const Check1440: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={1440} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 1440);
    const c = within(canvasElement);
    // Testimonials: 3 cards of 368 in a row, 24 apart, 48 under the header, 96 padding.
    const three = section(canvasElement, 'testimonials');
    await expect(three).toHaveAccessibleName(names.three);
    await expect(section(canvasElement, 'testimonial-split')).toHaveAccessibleName(names.split);
    await expect(section(canvasElement, 'testimonial-video')).toHaveAccessibleName(names.video);
    await expect(section(canvasElement, 'testimonial-wall')).toHaveAccessibleName(names.wall);
    await expect(section(canvasElement, 'testimonial-carousel')).toHaveAccessibleName(names.carousel);
    const cards = items(three, 'testimonial-card');
    await expect(cards).toHaveLength(3);
    await expect(tops(cards)).toBe(1);
    await expect(r(box(cards[0]!).width)).toBe(368);
    await expect(r(box(cards[1]!).left - box(cards[0]!).right)).toBe(24);
    await expect(r(box(cards[0]!).top - box(slot(three, 'section-header')).bottom)).toBe(48);
    await expect(r(box(slot(three, 'section-header')).top - box(three).top)).toBe(96);
    // Single: logo 32 above a centered 896 pull quote.
    const single = c.getByRole('region', { name: names.single });
    const quote = slot(single, 'quote');
    await expect(r(box(quote).width)).toBe(896);
    await expect(r(box(quote).left)).toBe(r((1440 - 896) / 2));
    // Grid: 6 cards, 3 per row, on the muted band.
    const grid = section(canvasElement, 'testimonial-grid-section');
    await expect(tops(items(grid, 'testimonial-card').slice(0, 3))).toBe(1);
    await expect(lefts(items(grid, 'testimonial-card'))).toBe(3);
    // Split: image and story side by side, 544 each, 64 apart; 3 figures in a row.
    const split = section(canvasElement, 'testimonial-split');
    const row = slot(split, 'testimonial-split-row');
    await expect(r(box(row.children[0]!).width)).toBe(544);
    await expect(r(box(row.children[1]!).left - box(row.children[0]!).right)).toBe(64);
    await expect(tops(items(split, 'figure'))).toBe(1);
    // Carousel: 3 slides of 368 in view, arrows move one slide.
    const carousel = within(section(canvasElement, 'testimonial-carousel'));
    const slides = carousel.getAllByRole('group');
    await expect(slides).toHaveLength(7);
    await waitFor(() => expect(r(box(slides[0]!).width)).toBe(368));
    await expect(slides.filter(s => !s.hasAttribute('inert'))).toHaveLength(3);
    const prev = carousel.getByRole('button', { name: 'Previous slide' });
    await expect(prev).toBeDisabled();
    await userEvent.click(carousel.getByRole('button', { name: 'Next slide' }));
    await waitFor(() => expect(slides[0]).toHaveAttribute('inert'));
    await userEvent.click(prev);
    await waitFor(() => expect(slides[0]).not.toHaveAttribute('inert'));
    // Wall: featured card next to the minimal one; masonry in 3 columns; the score.
    const wall = section(canvasElement, 'testimonial-wall');
    await expect(within(wall).getByRole('img', { name: 'Rated 4.8 out of 5, from 1,240 reviews' })).toBeVisible();
    const highlight = slot(wall, 'testimonial-wall-highlight');
    await expect(tops([...highlight.children])).toBeLessThanOrEqual(2);
    await expect(r(box(highlight.children[1]!).left)).toBeGreaterThan(r(box(highlight.children[0]!).right));
    await expect(lefts(items(slot(wall, 'testimonial-wall-masonry'), 'testimonial-card'))).toBe(3);
    // Video: thumbnail 640 wide (16:9), story 448; play opens the player in place.
    const video = section(canvasElement, 'testimonial-video');
    const thumb = within(video).getByRole('button', { name: /^Play: How Kestrel Logistics/ });
    await expect(r(box(thumb).width)).toBe(640);
    await expect(r(box(thumb).height)).toBe(360);
    await expect(tops(items(video, 'figure'))).toBe(1);
    await userEvent.click(thumb);
    await waitFor(() => expect(slot(video, 'testimonial-video-media').querySelector('[data-slot="video-thumbnail"]')).toBeNull());
  },
};

export const Check768: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={768} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 768);
    // Cards 2 per row; split and video stack; carousel shows 2; masonry 2 columns.
    await expect(lefts(items(section(canvasElement, 'testimonials'), 'testimonial-card'))).toBe(2);
    const row = slot(section(canvasElement, 'testimonial-split'), 'testimonial-split-row');
    await expect(box(row.children[1]!).top).toBeGreaterThan(box(row.children[0]!).bottom - 1);
    const slides = within(section(canvasElement, 'testimonial-carousel')).getAllByRole('group');
    await waitFor(() => expect(slides.filter(s => !s.hasAttribute('inert'))).toHaveLength(2));
    await expect(lefts(items(slot(section(canvasElement, 'testimonial-wall'), 'testimonial-wall-masonry'), 'testimonial-card'))).toBe(2);
    const vrow = slot(section(canvasElement, 'testimonial-video'), 'testimonial-video-row');
    await expect(box(vrow.children[1]!).top).toBeGreaterThan(box(vrow.children[0]!).bottom - 1);
  },
};

export const Check390: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={390} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 390);
    // One per row with 24 px gutters; carousel shows 1 slide; masonry one column.
    const three = section(canvasElement, 'testimonials');
    const cards = items(three, 'testimonial-card');
    await expect(lefts(cards)).toBe(1);
    await expect(r(box(cards[0]!).left - box(three).left)).toBe(24);
    const slides = within(section(canvasElement, 'testimonial-carousel')).getAllByRole('group');
    await waitFor(() => expect(slides.filter(s => !s.hasAttribute('inert'))).toHaveLength(1));
    await expect(r(box(slides[0]!).width)).toBe(342);
    await expect(lefts(items(slot(section(canvasElement, 'testimonial-wall'), 'testimonial-wall-masonry'), 'testimonial-card'))).toBe(1);
  },
};

export const AllDark: StoryObj = { tags: ['!dev'], globals: { theme: 'Dark' }, render: () => <All width={1440} /> };
export const AllBackOffice: StoryObj = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: () => <All width={1440} /> };
