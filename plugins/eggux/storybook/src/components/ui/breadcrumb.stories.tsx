import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './breadcrumb';

const probe = (className: string) => {
  const el = document.createElement('span');
  el.className = className;
  document.body.append(el);
  const style = getComputedStyle(el);
  const copy = { bg: style.backgroundColor, color: style.color };
  el.remove();
  return copy;
};

const PATH = [
  { label: 'Home', href: '#home' },
  { label: 'Projects', href: '#projects' },
  { label: 'Website redesign' },
];
const DEEP = [
  { label: 'Customers', href: '#customers' },
  { label: 'Europe', href: '#europe' },
  { label: 'Germany', href: '#germany' },
  { label: 'Acme GmbH', href: '#acme' },
  { label: 'Invoices', href: '#invoices' },
  { label: 'INV-2041' },
];

const meta = {
  title: 'Components/Navigation/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    docs: {
      description: {
        component:
          'Path from a meaningful root to the current page: nav "Breadcrumb" > ol; every item but the last is a link, the last is aria-current="page" and matches the page title. Past 4 levels the middle collapses into a "Show path" menu. Style=background (muted pill track) only on marketing and docs pages, on background/default. Figma: Navigation page / Breadcrumb. Guide: eggux build-ui/components/navigation.md',
      },
    },
  },
  args: { items: PATH },
} satisfies Meta<typeof Breadcrumb>;
export default meta;
type Story = StoryObj<typeof meta>;

// Figma Style=default: 266 x 20, items 6 apart, no surface.
export const Default: Story = {
  play: async ({ canvas }) => {
    const nav = canvas.getByRole('navigation', { name: 'Breadcrumb' });
    const list = nav.querySelector('ol') as HTMLOListElement;
    await expect(list.children).toHaveLength(3);
    await expect(Math.round(nav.getBoundingClientRect().height)).toBe(20);
    await expect(getComputedStyle(list).columnGap).toBe('6px');
    await expect(getComputedStyle(list).rowGap).toBe('4px');
    await expect(getComputedStyle(nav).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    await expect(canvas.getAllByRole('link')).toHaveLength(2);
    const current = canvas.getByText('Website redesign');
    await expect(current).toHaveAttribute('aria-current', 'page');
    await expect(current.closest('li')!.querySelector('[data-slot="breadcrumb-separator"]')).toBeNull();
    await userEvent.tab();
    await expect(canvas.getByRole('link', { name: 'Home' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('link', { name: 'Projects' })).toHaveFocus();
  },
};

// Figma Style=background: card/muted-background track, button/radius, 12 x 6 padding, 32 high.
export const Background: Story = {
  args: { breadcrumbStyle: 'background', items: [{ label: 'Customers', href: '#customers' }, { label: 'Acme', href: '#acme' }, { label: 'Invoices' }] },
  play: async ({ canvas }) => {
    const nav = canvas.getByRole('navigation', { name: 'Breadcrumb' });
    const style = getComputedStyle(nav);
    await expect(style.backgroundColor).toBe(probe('bg-[var(--card-muted)]').bg);
    await expect(style.paddingLeft).toBe('12px');
    await expect(style.paddingTop).toBe('6px');
    await expect(Math.round(nav.getBoundingClientRect().height)).toBe(32);
    await expect(parseFloat(style.borderTopLeftRadius)).toBeGreaterThan(0);
  },
};

// Deep path (6 levels, maxItems 4): Customers > … > Invoices > INV-2041. The ellipsis opens the collapsed levels.
export const Collapsed: Story = {
  args: { items: DEEP, onNavigate: fn() },
  play: async ({ canvas, args }) => {
    const nav = canvas.getByRole('navigation', { name: 'Breadcrumb' });
    await expect(nav.querySelectorAll('li')).toHaveLength(4);
    await expect(canvas.getAllByRole('link').map(l => l.textContent)).toEqual(['Customers', 'Invoices']);
    const ellipsis = canvas.getByRole('button', { name: 'Show path' });
    await expect(ellipsis).toHaveAttribute('aria-haspopup', 'menu');
    await userEvent.click(ellipsis);
    await screen.findByRole('menu');
    await expect(screen.getAllByRole('menuitem').map(i => i.textContent)).toEqual(['Europe', 'Germany', 'Acme GmbH']);
    await userEvent.click(screen.getByRole('menuitem', { name: 'Germany' }));
    await expect(args.onNavigate).toHaveBeenCalledWith('#germany');
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());

    // Keyboard: Enter opens, arrows move, Escape closes and returns focus.
    ellipsis.focus();
    await userEvent.keyboard('{Enter}');
    await screen.findByRole('menu');
    await waitFor(() => expect(screen.getAllByRole('menuitem')[0]).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}');
    await expect(screen.getByRole('menuitem', { name: 'Germany' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    await expect(ellipsis).toHaveFocus();
  },
};

// The parts composed by hand, for router links (asChild) or custom content.
export const Composed: Story = {
  args: { items: undefined },
  render: args => (
    <Breadcrumb {...args}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <a href="#settings">Settings</a>
          </BreadcrumbLink>
          <BreadcrumbSeparator />
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="#billing">Billing</BreadcrumbLink>
          <BreadcrumbSeparator />
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbPage>Invoices</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
  play: async ({ canvas }) => {
    const settings = canvas.getByRole('link', { name: 'Settings' });
    await expect(settings).toHaveAttribute('data-slot', 'breadcrumb-link');
    await expect(canvas.getByText('Invoices')).toHaveAttribute('aria-current', 'page');
  },
};

// Figma "Stress test / Breadcrumb": a narrow column wraps items with their separators (row gap 4);
// a separator never starts a line; long labels and Style=background with long text.
export const Stress: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="w-[120px]" data-testid="narrow">
        <Breadcrumb aria-label="Breadcrumb, narrow" items={PATH} />
      </div>
      <div className="w-[276px]" data-testid="col">
        <Breadcrumb aria-label="Breadcrumb, long labels" items={[{ label: 'Customers', href: '#c' }, { label: 'Acme International Holdings', href: '#a' }, { label: 'Invoices for the spring campaign' }]} />
      </div>
      <div className="w-[368px]" data-testid="bg">
        <Breadcrumb aria-label="Breadcrumb, background" breadcrumbStyle="background" items={[{ label: 'Customers', href: '#c' }, { label: 'Acme', href: '#a' }, { label: 'Invoices for the spring campaign' }]} />
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    const narrow = canvas.getByTestId('narrow');
    const items = Array.from(narrow.querySelectorAll('li'));
    // Each level on its own line, 20 high with 4 between.
    const tops = items.map(li => Math.round(li.getBoundingClientRect().top));
    await expect(new Set(tops).size).toBe(3);
    await expect(tops[1] - tops[0]).toBe(24);
    // The separator stays on its label's line.
    for (const li of items.slice(0, 2)) {
      const sep = li.querySelector('[data-slot="breadcrumb-separator"]')!.getBoundingClientRect();
      const label = li.querySelector('a')!.getBoundingClientRect();
      await expect(Math.abs(sep.top + sep.height / 2 - (label.top + label.height / 2))).toBeLessThan(1);
    }
    // Labels never break inside a word: every item stays 20 high.
    for (const li of canvas.getByTestId('col').querySelectorAll('li')) await expect(Math.round(li.getBoundingClientRect().height)).toBe(20);
    const bg = canvas.getByTestId('bg').querySelector('nav')!;
    await expect(bg.getBoundingClientRect().width).toBeLessThanOrEqual(368);
  },
};

export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
export const BackgroundDark: Story = { ...Background, tags: ['!dev'], globals: { theme: 'Dark' } };
export const BackgroundCorporate: Story = { ...Background, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
