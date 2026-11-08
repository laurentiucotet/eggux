import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { TableOfContents, TableOfContentsItem, TableOfContentsList, type TableOfContentsEntry } from './table-of-contents';

const ITEMS: TableOfContentsEntry[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'installation', label: 'Installation' },
  { id: 'using-the-cli', label: 'Using the CLI', level: 2 },
  { id: 'manual-setup', label: 'Manual setup', level: 2 },
  { id: 'theming', label: 'Theming' },
  { id: 'dark-mode', label: 'Dark mode', level: 2 },
  { id: 'next-steps', label: 'Next steps' },
];

const PARAGRAPH =
  'Acme Billing sends invoices in EUR and keeps every customer record in one place. This section explains what to set up, which defaults to keep and where the settings live, so your team can start sending invoices the same day.';

/** A docs page that scrolls inside its own container, with the table of contents beside it. */
function DocsPage({ onActiveChange, offset = 16 }: { onActiveChange?: (id: string) => void; offset?: number }) {
  const scroller = React.useRef<HTMLDivElement>(null);
  return (
    <div className="flex w-[720px] gap-8">
      <div ref={scroller} data-testid="scroller" className="h-80 flex-1 overflow-y-auto rounded-md border border-border p-4">
        {ITEMS.map(item => {
          const Heading = item.level === 2 ? 'h3' : 'h2';
          return (
            <section key={item.id}>
              <Heading id={item.id} className={item.level === 2 ? 'mt-4 text-base font-semibold' : 'mt-6 text-lg font-semibold first:mt-0'}>
                {item.label}
              </Heading>
              <p className="mt-2 text-sm text-muted-foreground">{PARAGRAPH}</p>
              <p className="mt-2 text-sm text-muted-foreground">{PARAGRAPH}</p>
            </section>
          );
        })}
      </div>
      <div className="w-56 shrink-0">
        <TableOfContents items={ITEMS} scrollContainer={scroller} offset={offset} onActiveChange={onActiveChange} />
      </div>
    </div>
  );
}

const meta = {
  title: 'Components/Navigation/Table of Contents',
  component: TableOfContents,
  parameters: {
    docs: {
      description: {
        component:
          'On-page navigation for long articles and docs (3+ sections): links to the h2 / h3 headings, the section in view active (scroll spy, aria-current="true"); clicking scrolls with an offset for sticky headers and moves focus to the heading. Sticky on the right from 1280; below that an "On this page" disclosure at the top (page layout). Figma: Navigation page / Table of Contents. Guide: eggux build-ui/components/content.md',
      },
    },
  },
  args: { items: ITEMS },
} satisfies Meta<typeof TableOfContents>;
export default meta;
type Story = StoryObj<typeof meta>;

const activeLink = (root: HTMLElement) => root.querySelector('nav a[aria-current="true"]')?.textContent;

// Scroll spy in a scrolling container: click jumps and focuses the heading; scrolling moves the active item.
export const Default: Story = {
  args: { onActiveChange: fn() },
  render: args => <DocsPage onActiveChange={args.onActiveChange} />,
  play: async ({ canvas, canvasElement, args }) => {
    const nav = canvas.getByRole('navigation', { name: 'On this page' });
    const scroller = canvas.getByTestId('scroller');
    await expect(nav.querySelectorAll('a')).toHaveLength(7);
    await expect(activeLink(canvasElement)).toBe('Introduction');

    // Click: the heading lands 16 px below the top of the scroller and takes focus.
    await userEvent.click(canvas.getByRole('link', { name: 'Theming' }));
    const theming = canvasElement.querySelector('#theming') as HTMLElement;
    await waitFor(() => expect(Math.round(theming.getBoundingClientRect().top - scroller.getBoundingClientRect().top)).toBe(16));
    await expect(theming).toHaveFocus();
    await expect(activeLink(canvasElement)).toBe('Theming');
    await expect(args.onActiveChange).toHaveBeenCalledWith('theming');

    // Scrolling by hand moves the active item.
    const install = canvasElement.querySelector('#installation') as HTMLElement;
    scroller.scrollTop = install.offsetTop - scroller.offsetTop - 8;
    await waitFor(() => expect(activeLink(canvasElement)).toBe('Installation'));
    scroller.scrollTop = scroller.scrollHeight;
    await waitFor(() => expect(activeLink(canvasElement)).toBe('Next steps'));
    scroller.scrollTop = 0;
    await waitFor(() => expect(activeLink(canvasElement)).toBe('Introduction'));

    // Keyboard: Tab to a link, Enter jumps.
    const cli = canvas.getByRole('link', { name: 'Using the CLI' });
    cli.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvasElement.querySelector('#using-the-cli')).toHaveFocus());
    await waitFor(() => expect(activeLink(canvasElement)).toBe('Using the CLI'));
  },
};

// Figma: 224 wide, title ui/overline muted 16 high, 12 above the items, items 28 each.
export const Layout: Story = {
  args: { activeId: 'installation' },
  decorators: [Story => <div className="w-56"><Story /></div>],
  play: async ({ canvas, canvasElement }) => {
    const nav = canvas.getByRole('navigation', { name: 'On this page' });
    await expect(Math.round(nav.getBoundingClientRect().width)).toBe(224);
    await expect(getComputedStyle(nav).rowGap).toBe('12px');
    const title = canvas.getByText('On this page');
    await expect(Math.round(title.getBoundingClientRect().height)).toBe(16);
    await expect(getComputedStyle(title).textTransform).toBe('uppercase');
    await expect(getComputedStyle(title).fontWeight).toBe('600');
    await expect(Math.round(nav.querySelector('ul')!.getBoundingClientRect().height)).toBe(7 * 28);
    await expect(activeLink(canvasElement)).toBe('Installation');
  },
};

// Another title for a list of other pages; items composed by hand.
export const OtherPages: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => (
    <div className="w-56">
      <TableOfContents title="Other policies">
        <TableOfContentsList>
          <TableOfContentsItem href="#privacy">Privacy policy</TableOfContentsItem>
          <TableOfContentsItem href="#terms" active>Terms of service</TableOfContentsItem>
          <TableOfContentsItem href="#cookies">Cookie policy</TableOfContentsItem>
        </TableOfContentsList>
      </TableOfContents>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('navigation', { name: 'Other policies' })).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Terms of service' })).toHaveAttribute('aria-current', 'true');
  },
};

// Figma "Stress test / Table of Contents": long title wraps to 2 lines with ellipsis; 112 wide column.
export const Stress: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => (
    <div className="flex gap-8">
      <div className="w-56" data-testid="long">
        <TableOfContents title="On this page with a much longer label than planned for the column" items={ITEMS.slice(0, 3)} activeId="installation" />
      </div>
      <div className="w-28" data-testid="narrow">
        <TableOfContents title="Contents" items={ITEMS.slice(0, 3)} activeId="installation" />
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    const title = canvas.getByTestId('long').querySelector('[data-slot="table-of-contents-title"]') as HTMLElement;
    await expect(Math.round(title.getBoundingClientRect().height)).toBe(32);
    const narrow = canvas.getByTestId('narrow').querySelector('nav')!;
    await expect(Math.round(narrow.getBoundingClientRect().width)).toBe(112);
    for (const a of narrow.querySelectorAll('a')) await expect(a.getBoundingClientRect().right).toBeLessThanOrEqual(narrow.getBoundingClientRect().right + 0.5);
  },
};

export const LayoutDark: Story = { ...Layout, tags: ['!dev'], globals: { theme: 'Dark' } };
export const LayoutCorporate: Story = { ...Layout, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
