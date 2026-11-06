import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from './breadcrumb-item';

const probe = (className: string) => {
  const el = document.createElement('span');
  el.className = className;
  document.body.append(el);
  const color = getComputedStyle(el).color;
  el.remove();
  return color;
};

const meta = {
  title: 'Components/Navigation/Breadcrumb Item',
  component: BreadcrumbItem,
  parameters: {
    docs: {
      description: {
        component:
          'One level of a Breadcrumb. Type=link: an ancestor page (muted, foreground on hover); Type=current: this page, not a link, aria-current="page", no separator; Type=ellipsis: a "Show path" button for collapsed middle levels. The separator sits inside its item (Figma Show separator). Figma: Navigation page / Breadcrumb Item. Guide: eggux build-ui/components/navigation.md',
      },
    },
  },
} satisfies Meta<typeof BreadcrumbItem>;
export default meta;
type Story = StoryObj<typeof meta>;

// Figma Type=link, current and ellipsis side by side (each in its own list, as a Breadcrumb holds them).
const Types = () => (
  <div className="flex items-center gap-8">
    <ol className="m-0 flex list-none p-0" aria-label="Link">
      <BreadcrumbItem data-testid="link">
        <BreadcrumbLink href="#projects">Projects</BreadcrumbLink>
        <BreadcrumbSeparator />
      </BreadcrumbItem>
    </ol>
    <ol className="m-0 flex list-none p-0" aria-label="Current">
      <BreadcrumbItem data-testid="current">
        <BreadcrumbPage>Projects</BreadcrumbPage>
      </BreadcrumbItem>
    </ol>
    <ol className="m-0 flex list-none p-0" aria-label="Ellipsis">
      <BreadcrumbItem data-testid="ellipsis">
        <BreadcrumbEllipsis />
        <BreadcrumbSeparator />
      </BreadcrumbItem>
    </ol>
  </div>
);

// Figma: link 76 x 20 (label 56 + 6 + chevron 14), current 20 high, ellipsis 16 icon; body/small.
export const Default: Story = {
  render: () => <Types />,
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Projects' });
    await expect(link).toHaveAttribute('href', '#projects');
    await expect(getComputedStyle(link).color).toBe(probe('text-muted-foreground'));
    await expect(getComputedStyle(link).fontSize).toBe('14px');
    await expect(link.className).toContain('hover:text-foreground');
    const linkItem = canvas.getByTestId('link');
    await expect(Math.round(linkItem.getBoundingClientRect().height)).toBe(20);
    await expect(getComputedStyle(linkItem).columnGap).toBe('6px');
    const sep = linkItem.querySelector('[data-slot="breadcrumb-separator"]') as HTMLElement;
    await expect(sep).toHaveAttribute('aria-hidden', 'true');
    await expect(Math.round(sep.querySelector('svg')!.getBoundingClientRect().width)).toBe(14);
    await expect(getComputedStyle(sep).color).toBe(probe('text-muted-foreground'));

    // Current: not a link, aria-current="page", foreground, no separator.
    const current = canvas.getByText('Projects', { selector: '[data-slot="breadcrumb-page"]' });
    await expect(current).toHaveAttribute('aria-current', 'page');
    await expect(current.closest('a')).toBeNull();
    await expect(getComputedStyle(current).color).toBe(probe('text-foreground'));
    await expect(canvas.getByTestId('current').querySelector('[data-slot="breadcrumb-separator"]')).toBeNull();

    // Ellipsis: a labeled button, 16 icon.
    const ellipsis = canvas.getByRole('button', { name: 'Show path' });
    await expect(Math.round(ellipsis.querySelector('svg')!.getBoundingClientRect().width)).toBe(16);

    // Keyboard: the link, then the ellipsis; the current page is not in the tab order.
    await userEvent.tab();
    await expect(link).toHaveFocus();
    await expect(getComputedStyle(link).boxShadow).not.toBe('none');
    await userEvent.tab();
    await expect(ellipsis).toHaveFocus();
  },
};

// Stress: long labels stay on one line inside an item; the separator never shrinks.
export const Stress: Story = {
  tags: ['!dev'],
  render: () => (
    <ol className="m-0 flex w-[276px] list-none flex-wrap gap-1.5 p-0">
      <BreadcrumbItem data-testid="long">
        <BreadcrumbLink href="#a">Website redesign for the spring campaign</BreadcrumbLink>
        <BreadcrumbSeparator />
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbPage>A</BreadcrumbPage>
      </BreadcrumbItem>
    </ol>
  ),
  play: async ({ canvas }) => {
    const long = canvas.getByTestId('long');
    await expect(Math.round(long.getBoundingClientRect().height)).toBe(20);
    const svg = long.querySelector('svg')!;
    await expect(Math.round(svg.getBoundingClientRect().width)).toBe(14);
  },
};

export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
