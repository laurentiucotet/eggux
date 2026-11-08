import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { NavLink } from './nav-link';

const colors = (className: string) => {
  const el = document.createElement('span');
  el.className = className;
  document.body.append(el);
  const s = getComputedStyle(el);
  const copy = { bg: s.backgroundColor, color: s.color };
  el.remove();
  return copy;
};

const radius = (className: string) => {
  const el = document.createElement('span');
  el.className = className;
  document.body.append(el);
  const r = getComputedStyle(el).borderTopLeftRadius;
  el.remove();
  return r;
};

const meta = {
  title: 'Components/Navigation/Nav Link',
  component: NavLink,
  parameters: {
    docs: {
      description: {
        component:
          'Top-level link of a marketing Navbar (4-6 per bar). Active = the current section (aria-current="page"); Show chevron when it opens a Navigation Menu Panel (aria-expanded on the trigger). App navigation uses Sidebar Item. Figma: Navigation page / Nav Link. Guide: eggux build-ui/components/navigation.md',
      },
    },
  },
  args: { href: '#features', children: 'Features' },
} satisfies Meta<typeof NavLink>;
export default meta;
type Story = StoryObj<typeof meta>;

// Figma State=default: 91 x 36 (control height), 16 sides, radius md, ui/label foreground.
export const Default: Story = {
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Features' });
    const s = getComputedStyle(link);
    await expect(Math.round(link.getBoundingClientRect().height)).toBe(36);
    await expect(s.paddingLeft).toBe('16px');
    await expect(s.paddingRight).toBe('16px');
    await expect(s.borderTopLeftRadius).toBe(radius('rounded-md'));
    await expect(s.fontWeight).toBe('500');
    await expect(s.color).toBe(colors('text-foreground').color);
    await expect(link).not.toHaveAttribute('aria-current');
    await expect(link.className).toContain('hover:bg-accent');
    await userEvent.tab();
    await expect(link).toHaveFocus();
    await expect(getComputedStyle(link).boxShadow).not.toBe('none');
  },
};

// Figma State default, active and Show chevron in a navbar row.
export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <nav aria-label="Main" className="flex items-center gap-1">
      <NavLink href="#product" showChevron>Product</NavLink>
      <NavLink href="#pricing" active>Pricing</NavLink>
      <NavLink href="#customers">Customers</NavLink>
      <NavLink href="#docs">Docs</NavLink>
    </nav>
  ),
  play: async ({ canvas }) => {
    const active = canvas.getByRole('link', { name: 'Pricing' });
    await expect(active).toHaveAttribute('aria-current', 'page');
    const ref = colors('bg-accent text-accent-foreground');
    await expect(getComputedStyle(active).backgroundColor).toBe(ref.bg);
    await expect(getComputedStyle(active).color).toBe(ref.color);
    const product = canvas.getByRole('link', { name: 'Product' });
    const chevron = product.querySelector('[data-slot="nav-link-chevron"]') as SVGElement;
    await expect(Math.round(chevron.getBoundingClientRect().width)).toBe(12);
    await expect(getComputedStyle(product).columnGap).toBe('4px');
  },
};

// A trigger that opens a panel: asChild on a button with aria-expanded; the chevron turns.
export const Trigger: Story = {
  render: function Render() {
    const [open, setOpen] = React.useState(false);
    return (
      <NavLink asChild showChevron>
        <button type="button" aria-expanded={open} onClick={() => setOpen(o => !o)}>Solutions</button>
      </NavLink>
    );
  },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Solutions' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    const chevron = trigger.querySelector('[data-slot="nav-link-chevron"]') as SVGElement;
    await expect(getComputedStyle(chevron).rotate).toBe('none');
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(getComputedStyle(chevron).rotate).toBe('180deg');
    await expect(getComputedStyle(trigger).backgroundColor).toBe(colors('bg-accent').bg);
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  },
};

// Figma "Stress test / Nav Link": long labels stay on one line and hug; short label.
export const Stress: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => (
    <div className="flex flex-col items-start gap-2">
      <NavLink href="#a" showChevron>Features with a much longer label than planned</NavLink>
      <NavLink href="#b">A</NavLink>
    </div>
  ),
  play: async ({ canvas }) => {
    const long = canvas.getByRole('link', { name: /much longer/ });
    await expect(Math.round(long.getBoundingClientRect().height)).toBe(36);
    await expect(Math.round(long.querySelector('svg')!.getBoundingClientRect().width)).toBe(12);
    await expect(Math.round(canvas.getByRole('link', { name: 'A' }).getBoundingClientRect().height)).toBe(36);
  },
};

export const StatesDark: Story = { ...States, tags: ['!dev'], globals: { theme: 'Dark' } };
export const StatesCorporate: Story = { ...States, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
