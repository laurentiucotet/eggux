import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { BackLink } from './back-link';

const color = (className: string) => {
  const el = document.createElement('span');
  el.className = className;
  document.body.append(el);
  const c = getComputedStyle(el).color;
  el.remove();
  return c;
};

const meta = {
  title: 'Components/Navigation/Back Link',
  component: BackLink,
  parameters: {
    docs: {
      description: {
        component:
          'Way back to the list a record came from, above the page title: "← All invoices". A real link to a fixed URL, never history.back(); names the destination, never "Back". Deeper hierarchies use Breadcrumb. Figma: Navigation page / Back Link. Guide: eggux build-ui/components/navigation.md',
      },
    },
  },
  args: { href: '#invoices', children: 'All invoices' },
} satisfies Meta<typeof BackLink>;
export default meta;
type Story = StoryObj<typeof meta>;

// Figma State=default: 96 x 20, arrow 16, gap 6, ui/label muted; hover = foreground.
export const Default: Story = {
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'All invoices' });
    await expect(link).toHaveAttribute('href', '#invoices');
    await expect(Math.round(link.getBoundingClientRect().height)).toBe(20);
    await expect(getComputedStyle(link).columnGap).toBe('6px');
    await expect(getComputedStyle(link).fontWeight).toBe('500');
    await expect(getComputedStyle(link).color).toBe(color('text-muted-foreground'));
    await expect(link.className).toContain('hover:text-foreground');
    const icon = link.querySelector('svg')!;
    await expect(icon).toHaveAttribute('aria-hidden', 'true');
    await expect(Math.round(icon.getBoundingClientRect().width)).toBe(16);
    await userEvent.tab();
    await expect(link).toHaveFocus();
    await expect(getComputedStyle(link).boxShadow).not.toBe('none');
  },
};

// Router links: asChild keeps the arrow and the styles on your link element.
export const AsChild: Story = {
  tags: ['!dev'],
  args: { asChild: true, children: <a href="#settings">Settings</a> },
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Settings' });
    await expect(link).toHaveAttribute('data-slot', 'back-link');
    await expect(link.querySelector('svg')).not.toBeNull();
  },
};

// Figma "Stress test / Back Link": long label in a 276 column wraps, the arrow keeps 16; short label.
export const Stress: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="w-[276px]" data-testid="col"><BackLink href="#a">All invoices with a much longer label than planned</BackLink></div>
      <BackLink href="#b">A</BackLink>
    </div>
  ),
  play: async ({ canvas }) => {
    const long = canvas.getByRole('link', { name: /much longer/ });
    await expect(long.getBoundingClientRect().width).toBeLessThanOrEqual(276);
    await expect(Math.round(long.querySelector('svg')!.getBoundingClientRect().width)).toBe(16);
    await expect(Math.round(canvas.getByRole('link', { name: 'A' }).getBoundingClientRect().height)).toBe(20);
  },
};

export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
