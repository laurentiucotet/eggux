import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { SectionHeader } from './section-header-block';

interface Args {
  title: string;
  overline: string;
  description: string;
  showOverline: boolean;
  showDescription: boolean;
  align: 'center' | 'left';
}

const meta = {
  title: 'Blocks/Sections/Section Header',
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'The header that opens every marketing section (Features, Stats, CTA, Pricing): overline in the brand color, an h2 title that states the answer, and one lead sentence; 768 wide, centered or left. Not the app Section Heading (muted overline, actions on the right). Figma: BLOCKS / Sections, Section Header (Align center, left; Show overline; Show description). Guide: eggux build-ui/patterns/marketing-pages.md' } },
  },
  args: {
    title: 'Everything your team runs on',
    overline: 'FEATURES',
    description: 'From the first lead to the last invoice, in one place your whole team can use.',
    showOverline: true,
    showDescription: true,
    align: 'center',
  },
  argTypes: {
    title: { name: 'Title', control: 'text', description: 'The answer the section gives, not the topic.', table: { category: 'Section Header' } },
    overline: { name: 'Overline', control: 'text', description: 'One or two words, shown upper case.', table: { category: 'Section Header' } },
    description: { name: 'Description', control: 'text', description: 'One or two sentences.', table: { category: 'Section Header' } },
    showOverline: { name: 'Show overline', control: 'boolean', table: { category: 'Section Header' } },
    showDescription: { name: 'Show description', control: 'boolean', table: { category: 'Section Header' } },
    align: { name: 'Align', control: 'inline-radio', options: ['center', 'left'], description: 'Center over grids; left next to an image or a screen.', table: { category: 'Section Header' } },
  },
  render: (a: Args) => (
    <div className="bg-background px-6 py-24">
      <SectionHeader title={a.title} overline={a.showOverline ? a.overline : undefined} description={a.showDescription ? a.description : undefined} align={a.align} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// Figma at 1440: 768 wide (layout/container/3xl), 12 gap, overline 12/16 brand, title h2 30/36, lead 20/28.
export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: a => (
    <div className="flex w-[1440px] flex-col gap-16 bg-background px-6 py-24">
      <SectionHeader title={a.title} overline={a.overline} description={a.description} />
      <SectionHeader title="Approvals that never stall a payment" overline="APPROVALS" description="Left aligned next to a screen." align="left" level={3} />
      <div className="w-[390px]"><SectionHeader title="A very long section title that has to wrap over several lines on a phone without overflowing" overline="WRAPS" description="A long description that also wraps on narrow screens and never scrolls sideways, whatever the length." /></div>
    </div>
  ),
  play: async ({ canvasElement, canvas }) => {
    const [center, left, narrow] = Array.from(canvasElement.querySelectorAll<HTMLElement>('[data-slot="section-header"]'));
    await expect(Math.round(center!.getBoundingClientRect().width)).toBe(768);
    await expect(getComputedStyle(center!).rowGap).toBe('12px');
    await expect(center!.getBoundingClientRect().left).toBeCloseTo((1440 - 768) / 2, 0);
    await expect(getComputedStyle(center!).textAlign).toBe('center');
    const h2 = canvas.getByRole('heading', { level: 2, name: 'Everything your team runs on' });
    await expect(getComputedStyle(h2).fontSize).toBe('30px');
    await expect(getComputedStyle(h2).lineHeight).toBe('36px');
    await expect(getComputedStyle(center!.querySelector('p')!).fontSize).toBe('12px');
    await expect(getComputedStyle(left!).textAlign).toBe('left');
    await expect(Math.round(left!.getBoundingClientRect().left)).toBe(24);
    await expect(canvas.getByRole('heading', { level: 3, name: 'Approvals that never stall a payment' })).toBeInTheDocument();
    await expect(narrow!.scrollWidth).toBeLessThanOrEqual(390);
    await expect(narrow!.getBoundingClientRect().width).toBeLessThanOrEqual(390);
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
