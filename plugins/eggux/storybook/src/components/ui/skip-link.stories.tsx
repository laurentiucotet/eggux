import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { SkipLink } from './skip-link';

const colors = (className: string) => {
  const el = document.createElement('span');
  el.className = className;
  document.body.append(el);
  const s = getComputedStyle(el);
  const copy = { bg: s.backgroundColor, color: s.color };
  el.remove();
  return copy;
};

const meta = {
  title: 'Components/Navigation/Skip Link',
  component: SkipLink,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'First focusable element of every page: hidden until keyboard focus, then shown top left; it moves focus to the main content (<main id="main" tabindex="-1">). One more before each long repeated block. Never remove it. Figma: Navigation page / Skip Link. Guide: eggux build-ui/components/navigation.md',
      },
    },
  },
  render: args => (
    <div>
      <SkipLink {...args} />
      <nav aria-label="Main" className="flex gap-4 border-b border-border p-4 text-sm">
        <a href="#dashboard">Dashboard</a>
        <a href="#invoices">Invoices</a>
        <a href="#customers">Customers</a>
      </nav>
      <main id="main" className="p-4 outline-none">
        <h1 className="text-xl font-semibold">Invoices</h1>
        <p className="text-sm text-muted-foreground">12 open invoices, EUR 48,200 due this month.</p>
      </main>
    </div>
  ),
} satisfies Meta<typeof SkipLink>;
export default meta;
type Story = StoryObj<typeof meta>;

// Hidden (sr-only) until focused; then 169 x 36 top left, primary fill, ring; Enter moves focus to main.
export const Default: Story = {
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Skip to main content' });
    await expect(link).toHaveAttribute('href', '#main');
    // Visually hidden, but not display:none: still in the tab order and the accessibility tree.
    await expect(getComputedStyle(link).display).not.toBe('none');
    await expect(Math.round(link.getBoundingClientRect().width)).toBeLessThanOrEqual(1);
    await userEvent.tab();
    await expect(link).toHaveFocus();
    const box = link.getBoundingClientRect();
    await expect(Math.round(box.height)).toBe(36);
    await expect(Math.round(box.left)).toBe(16);
    await expect(Math.round(box.top)).toBe(16);
    await expect(getComputedStyle(link).position).toBe('fixed');
    const ref = colors('bg-primary text-primary-foreground');
    await expect(getComputedStyle(link).backgroundColor).toBe(ref.bg);
    await expect(getComputedStyle(link).color).toBe(ref.color);
    await expect(getComputedStyle(link).boxShadow).not.toBe('none');
    await userEvent.keyboard('{Enter}');
    const main = canvas.getByRole('main');
    await expect(main).toHaveFocus();
    await expect(main).toHaveAttribute('tabindex', '-1');
    // Focus left the link: it hides again.
    await expect(Math.round(link.getBoundingClientRect().width)).toBeLessThanOrEqual(1);
  },
};

// A second skip link before a long filter block.
export const ToResults: Story = {
  tags: ['!dev'],
  args: { href: '#main', children: 'Skip to results' },
  play: async ({ canvas }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('link', { name: 'Skip to results' })).toHaveFocus();
  },
};

// Figma "Stress test / Skip Link": up to 320 wide, then the label wraps to 2 lines, centered.
export const Stress: Story = {
  tags: ['!dev'],
  args: { children: 'Skip to main content with a much longer label than planned for this page' },
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: /much longer/ });
    await userEvent.tab();
    const box = link.getBoundingClientRect();
    await expect(Math.round(box.width)).toBeLessThanOrEqual(320);
    await expect(Math.round(box.height)).toBe(56);
    await expect(getComputedStyle(link).textAlign).toBe('center');
  },
};

export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
