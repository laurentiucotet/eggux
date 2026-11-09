import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { CodeBlock, InlineCode } from './code-block';
import { ImagePlaceholder } from './image-placeholder';
import { Highlight, Prose, ProseBlockquote, ProseHeading, ProseList, ProseListItem, ProseParagraph, type ProseSize } from './prose';
import { Separator } from './separator';

const meta = {
  title: 'Components/Prose/Prose',
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Long text: help articles, docs, release notes. Prose sets the reading width and the gaps, and its parts follow its Size (sm, default, lg): Prose Heading (h2, h3, h4, each with its own top space), Prose Paragraph, Prose List with bullet or number markers, Prose Blockquote with a cite. Links are brand and underlined, inline code uses Inline Code, Highlight marks a run of text (default = match, ai = text an AI added or changed). Figma: Prose page. Guide: eggux build-ui/components/content.md' } },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function Article({ size = 'default' }: { size?: ProseSize }) {
  return (
    <Prose size={size}>
      <ProseHeading level={2}>Getting paid on time</ProseHeading>
      <ProseParagraph>
        Most late payments come from unclear invoices, not from unwilling clients. Put the <Highlight>due date</Highlight> and the amount at the top, and link to the <a href="#terms">payment terms</a> in every email.
      </ProseParagraph>
      <ProseList>
        <ProseListItem>Send the invoice on the day the work is done.</ProseListItem>
        <ProseListItem>Add the purchase order number when the client asks for one.</ProseListItem>
        <ProseListItem>Offer card and bank transfer, and show both on the invoice.</ProseListItem>
      </ProseList>
      <ProseHeading level={3}>Set up reminders</ProseHeading>
      <ProseParagraph>
        Reminders go out from the invoices list. Use the <InlineCode>{'{{due_date}}'}</InlineCode> field in the template so each email shows the right date.
      </ProseParagraph>
      <ProseList ordered>
        <ProseListItem>Open Settings and choose Reminders.</ProseListItem>
        <ProseListItem>Pick when the first reminder goes out.</ProseListItem>
        <ProseListItem>Turn on the <Highlight tone="ai">late fee</Highlight> only if your contract allows it.</ProseListItem>
      </ProseList>
      <ProseBlockquote cite="Ana Popescu, Finance lead at Acme">We stopped chasing late payments once every invoice showed the due date and a pay button at the top.</ProseBlockquote>
      <CodeBlock language="bash" code={'npx shadcn@latest add button\nnpx shadcn@latest add dialog'} />
      <figure className="m-0 flex flex-col gap-2">
        <ImagePlaceholder ratio="4:3" showCaption={false} />
        <figcaption className="text-sm leading-5 text-muted-foreground">The Bucharest office kitchen, where the team meets for lunch.</figcaption>
      </figure>
      <Separator />
      <ProseHeading level={4}>Need help?</ProseHeading>
      <ProseParagraph>
        Write to <a href="#support">support</a> from the help menu. We answer within one working day.
      </ProseParagraph>
    </Prose>
  );
}

export const Default: Story = {
  render: () => <Article />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const prose = canvasElement.querySelector('[data-slot="prose"]')!;
    await expect(prose.getBoundingClientRect().width).toBeLessThanOrEqual(672);
    await expect(c.getByRole('heading', { level: 2, name: 'Getting paid on time' })).toBeVisible();
    await expect(c.getByRole('heading', { level: 3, name: 'Set up reminders' })).toBeVisible();
    await expect(c.getByRole('heading', { level: 4, name: 'Need help?' })).toBeVisible();
    const lists = c.getAllByRole('list');
    await expect(lists[0].tagName).toBe('UL');
    await expect(lists[1].tagName).toBe('OL');
    await expect(within(lists[1]).getAllByRole('listitem')).toHaveLength(3);
    // Number markers come from a CSS counter.
    const marker = lists[1].querySelectorAll('[data-slot="prose-list-marker"]')[2];
    await expect(getComputedStyle(marker, '::before').content).toContain('counter');
    const h2 = c.getByRole('heading', { level: 2 });
    await expect(getComputedStyle(h2).paddingTop).toBe('24px');
    await expect(getComputedStyle(h2).fontSize).toBe('24px');
    await expect(getComputedStyle(c.getAllByRole('paragraph')[0]).lineHeight).toBe('28px');
    await expect(c.getByRole('link', { name: 'payment terms' })).toHaveAttribute('href', '#terms');
    await expect(canvasElement.querySelectorAll('mark')).toHaveLength(2);
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-12">
      {(['sm', 'default', 'lg'] as const).map((s) => (
        <section key={s} aria-label={`Size ${s}`}>
          <Prose size={s}>
            <ProseHeading level={2}>Getting paid on time</ProseHeading>
            <ProseParagraph>Most late payments come from unclear invoices, not from unwilling clients.</ProseParagraph>
            <ProseHeading level={3}>Set up reminders</ProseHeading>
            <ProseList ordered>
              <ProseListItem>Open Settings and choose Reminders.</ProseListItem>
              <ProseListItem>Pick when the first reminder goes out.</ProseListItem>
            </ProseList>
            <ProseHeading level={4}>Need help?</ProseHeading>
            <ProseBlockquote cite="Ana Popescu, Finance lead at Acme">We stopped chasing late payments once every invoice showed the due date.</ProseBlockquote>
          </Prose>
        </section>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [sm, def, lg] = Array.from(canvasElement.querySelectorAll('[data-slot="prose"]'));
    const fs = (el: Element, sel: string) => getComputedStyle(el.querySelector(sel)!).fontSize;
    await expect(fs(sm, 'p')).toBe('14px');
    await expect(fs(def, 'p')).toBe('16px');
    await expect(fs(lg, 'p')).toBe('18px');
    await expect(fs(lg, 'h2')).toBe('30px');
    await expect(getComputedStyle(sm).rowGap).toBe('12px');
    await expect(getComputedStyle(lg).rowGap).toBe('20px');
  },
};

export const Highlights: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Prose>
        <ProseParagraph>
          Search match: <Highlight>late fee</Highlight>. Changed by AI: <Highlight tone="ai">late fee</Highlight>.
        </ProseParagraph>
      </Prose>
      <div className="w-56">
        <Prose className="min-w-0">
          <ProseParagraph>
            A long highlight wraps with the line: <Highlight>the due date and the amount at the top of the invoice</Highlight> and stays readable.
          </ProseParagraph>
        </Prose>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const marks = canvasElement.querySelectorAll('mark');
    await expect(marks[0]).toHaveAttribute('data-tone', 'default');
    await expect(marks[1]).toHaveAttribute('data-tone', 'ai');
    await expect(getComputedStyle(marks[0]).backgroundColor).not.toBe(getComputedStyle(marks[1]).backgroundColor);
    // The wrapped mark spans several lines.
    await expect(marks[2].getClientRects().length).toBeGreaterThan(1);
  },
};

function Edge() {
  const long = 'Supercalifragilisticexpialidocious-invoice-reference-without-spaces-0001-0002-0003';
  return (
    <div className="flex flex-col gap-10">
      <div className="w-[280px]">
        <Prose className="break-words">
          <ProseHeading level={2}>A very long heading that wraps onto three lines in the narrowest column</ProseHeading>
          <ProseParagraph>{long}</ProseParagraph>
          <ProseList>
            <ProseListItem className="break-words">{long}</ProseListItem>
          </ProseList>
          <ProseList ordered>
            {Array.from({ length: 12 }, (_, i) => (
              <ProseListItem key={i}>Step {i + 1}</ProseListItem>
            ))}
          </ProseList>
          <ProseBlockquote>A quote with no cite.</ProseBlockquote>
        </Prose>
      </div>
      <div className="w-[1200px]">
        <Prose>
          <ProseParagraph>In a wide container Prose stops at its reading width.</ProseParagraph>
        </Prose>
      </div>
    </div>
  );
}

export const EdgeCases: Story = {
  tags: ['!dev'],
  render: () => <Edge />,
  play: async ({ canvasElement }) => {
    const [narrow, wide] = Array.from(canvasElement.querySelectorAll('[data-slot="prose"]'));
    await expect(narrow.scrollWidth).toBeLessThanOrEqual(narrow.clientWidth + 1);
    await expect(wide.getBoundingClientRect().width).toBe(672);
    await expect(narrow.querySelector('figcaption')).toBeNull();
    const markers = narrow.querySelectorAll('ol [data-slot="prose-list-marker"]');
    await expect(markers[11].getBoundingClientRect().width).toBe(20);
  },
};

const All = () => (
  <div className="flex flex-col gap-8 bg-background p-6">
    <Article />
  </div>
);
export const AllDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, render: () => <All /> };
export const AllCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: () => <All /> };
