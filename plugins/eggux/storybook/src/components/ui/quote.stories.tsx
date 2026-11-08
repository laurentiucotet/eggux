import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Footnote, FootnoteRef, Footnotes, Quote, TestimonialCard } from './quote';

const maria = { name: 'Maria Ilie', role: 'Head of Finance Operations, Acme', initials: 'MI' };
const elena = { name: 'Elena Popa', role: 'CFO, Northwind Traders', initials: 'EP' };
const text = 'We closed the books four days faster in the first quarter. Approvals no longer live in email.';
const photo = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400"><rect width="300" height="400" fill="#b9c7d6"/><circle cx="150" cy="150" r="70" fill="#e2b49a"/><rect x="60" y="250" width="180" height="150" rx="70" fill="#7f1d1d"/></svg>');
const logo = (
  <span className="flex items-center gap-2 text-lg font-semibold text-foreground">
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6 fill-current"><path d="M12 1l2.5 8.5L23 12l-8.5 2.5L12 23l-2.5-8.5L1 12l8.5-2.5z" /></svg>
    Northwind
  </span>
);

const meta = {
  title: 'Components/Quote/Quote',
  component: Quote,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'A quotation in running content: default with a left rule inside an article, pull (centered, h3 size) to break up a long page, large (display size) for one quote that is a section on its own, under 20 words, once per page. Testimonial Card holds a customer quote for grids (default, minimal, logo) or one lead story (featured). Footnote explains a claim at the end of an article and links back to it. Quote real people word for word, with permission. Figma: Quote page / Quote, Testimonial Card, Footnote. Guide: eggux build-ui/components/content.md' } },
  },
  args: { quote: 'The best onboarding is the product itself, with the next step always visible.', by: maria },
  render: args => (
    <div className="flex w-[720px] flex-col gap-16">
      <Quote {...args} />
      <Quote {...args} variant="pull" />
      <Quote {...args} variant="large" />
    </div>
  ),
} satisfies Meta<typeof Quote>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma Variant=default (64 high, 2 px rule, 24 in), pull (48 mark, 24 px quote), large (72 mark, 48 px quote).
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const [def, pull, large] = canvasElement.querySelectorAll('[data-slot="quote"]');
    await expect(Math.round(box(def!).height)).toBe(64);
    await expect(getComputedStyle(def!).borderLeftWidth).toBe('2px');
    await expect(getComputedStyle(def!).paddingLeft).toBe('24px');
    await expect(getComputedStyle(pull!.querySelector('blockquote')!).fontSize).toBe('24px');
    await expect(getComputedStyle(large!.querySelector('blockquote')!).fontSize).toBe('48px');
    await expect(canvas.getAllByRole('figure')).toHaveLength(3);
  },
};

// Testimonial Card: default with rating (352), minimal, logo, featured with photo (720).
export const Testimonials: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="grid w-[1120px] grid-cols-3 items-start gap-8">
        <TestimonialCard quote={text} by={elena} rating={5} />
        <TestimonialCard quote={text} by={elena} variant="minimal" />
        <TestimonialCard quote={text} by={elena} variant="logo" logo={logo} />
      </div>
      <div className="w-[720px]"><TestimonialCard quote={text} by={elena} variant="featured" logo={logo} image={photo} /></div>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const cards = canvasElement.querySelectorAll('[data-slot="testimonial-card"]');
    await expect(getComputedStyle(cards[0]!).paddingTop).toBe('24px');
    await expect(getComputedStyle(cards[1]!).borderTopWidth).toBe('0px');
    await expect(canvas.getByRole('img', { name: /Rated 5\.0 out of 5/ })).toBeInTheDocument();
    await expect(Math.round(box(cards[3]!.querySelector('[data-slot="image-placeholder"]')!).width)).toBe(215);
  },
};

// Footnotes: the superscript links down, Back to text links up.
export const Footnotes_: Story = {
  parameters: { controls: { disable: true } },
  name: 'Footnotes',
  render: () => (
    <div className="flex w-[560px] flex-col gap-6">
      <p className="m-0 text-sm">Invoices are paid in 18 days on average<FootnoteRef id="ref-1" noteId="note-1" number={1} />.</p>
      <Footnotes aria-label="Notes">
        <Footnote id="note-1" refId="ref-1" number={1}>Amounts include VAT at the standard rate. Exchange rates from the European Central Bank on the invoice date.</Footnote>
      </Footnotes>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: /1 \(footnote\)/ })).toHaveAttribute('href', '#note-1');
    await expect(canvas.getByRole('link', { name: /Back to text 1/ })).toHaveAttribute('href', '#ref-1');
  },
};

export const DefaultDark: Story = { parameters: { controls: { disable: true } }, tags: ['!dev'], globals: { theme: 'Dark' }, render: Testimonials.render };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
