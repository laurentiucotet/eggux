import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { TableOfContentsItem } from './table-of-contents-item';

const probe = (className: string) => {
  const el = document.createElement('span');
  el.className = className;
  document.body.append(el);
  const s = getComputedStyle(el);
  const copy = { color: s.color, border: s.borderLeftColor };
  el.remove();
  return copy;
};

const meta = {
  title: 'Components/Navigation/Table of Contents Item',
  component: TableOfContentsItem,
  parameters: {
    docs: {
      description: {
        component:
          'Entry of an on-page table of contents: a link to a heading. Level 1 = h2, Level 2 = h3 (indented). Active = the section in view (scroll spy): primary left bar, aria-current="true". Labels match the heading text. Figma: Navigation page / Table of Contents Item. Guide: eggux build-ui/components/content.md',
      },
    },
  },
  args: { href: '#installation', children: 'Installation' },
  decorators: [Story => <ul className="m-0 w-56 list-none p-0"><Story /></ul>],
} satisfies Meta<typeof TableOfContentsItem>;
export default meta;
type Story = StoryObj<typeof meta>;

const link = (el: HTMLElement, name: string) => el.querySelector(`a[href="#${name}"]`) as HTMLAnchorElement;

// Figma Level=1/2 x State=default/active: 224 x 28, padding 4 / 12 (level 2: 24), 1 px border/default rule;
// active: 2 px background/primary rule, ui/label foreground.
export const Default: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <>
      <TableOfContentsItem href="#introduction">Introduction</TableOfContentsItem>
      <TableOfContentsItem href="#installation" active>Installation</TableOfContentsItem>
      <TableOfContentsItem href="#cli" level={2}>Using the CLI</TableOfContentsItem>
      <TableOfContentsItem href="#manual" level={2} active>Manual setup</TableOfContentsItem>
    </>
  ),
  play: async ({ canvasElement, canvas }) => {
    const intro = link(canvasElement, 'introduction');
    const s = getComputedStyle(intro);
    await expect(Math.round(intro.getBoundingClientRect().height)).toBe(28);
    await expect(Math.round(intro.getBoundingClientRect().width)).toBe(224);
    await expect(s.paddingLeft).toBe('12px');
    await expect(s.paddingTop).toBe('4px');
    await expect(s.borderLeftWidth).toBe('1px');
    await expect(s.borderLeftColor).toBe(probe('border-l border-border').border);
    await expect(s.color).toBe(probe('text-muted-foreground').color);
    await expect(intro.className).toContain('hover:text-foreground');
    await expect(intro).not.toHaveAttribute('aria-current');

    const active = canvas.getByRole('link', { name: 'Installation' });
    await expect(active).toHaveAttribute('aria-current', 'true');
    await expect(getComputedStyle(active).borderLeftWidth).toBe('2px');
    await expect(getComputedStyle(active).borderLeftColor).toBe(probe('border-l border-primary').border);
    await expect(getComputedStyle(active).color).toBe(probe('text-foreground').color);
    await expect(getComputedStyle(active).fontWeight).toBe('500');

    await expect(getComputedStyle(link(canvasElement, 'cli')).paddingLeft).toBe('24px');
    await expect(getComputedStyle(link(canvasElement, 'manual')).borderLeftWidth).toBe('2px');

    await userEvent.tab();
    await expect(intro).toHaveFocus();
    await expect(getComputedStyle(intro).boxShadow).not.toBe('none');
  },
};

// Long labels wrap inside the column (no truncation); short label keeps 28.
export const Stress: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => (
    <>
      <TableOfContentsItem href="#long">Installation with a much longer label than planned for the column</TableOfContentsItem>
      <TableOfContentsItem href="#a" level={2}>A</TableOfContentsItem>
    </>
  ),
  play: async ({ canvasElement }) => {
    const long = link(canvasElement, 'long');
    await expect(long.getBoundingClientRect().height).toBeGreaterThan(28);
    await expect(Math.round(long.getBoundingClientRect().width)).toBe(224);
    await expect(Math.round(link(canvasElement, 'a').getBoundingClientRect().height)).toBe(28);
  },
};

export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
