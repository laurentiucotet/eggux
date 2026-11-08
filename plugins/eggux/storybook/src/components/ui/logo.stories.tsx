import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Logo } from './logo';

const meta = {
  title: 'Components/Brand/Logo',
  component: Logo,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Product or client logo. Type mark = the square symbol (collapsed sidebar, favicon), wordmark = the name only, full = both. Replace the symbol once in Logo Mark (an inline SVG in currentColor). The name is the accessible text, visually hidden for mark; wrap the Logo in a link home where it navigates. Figma: Brand page / Logo, Logo Mark.' } },
  },
} satisfies Meta<typeof Logo>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma Type=mark, wordmark, full: mark 32 square, name 18/28 semibold, 8 px apart.
export const Types: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-10">
      <Logo type="mark" />
      <Logo type="wordmark" />
      <Logo type="full" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [mark, wordmark, full] = canvasElement.querySelectorAll<HTMLElement>('[data-slot="logo"]');
    const markBox = mark.querySelector('[data-slot="logo-mark"]')!;
    await expect([Math.round(box(markBox).width), Math.round(box(markBox).height)]).toEqual([32, 32]);
    await expect(markBox).toHaveAttribute('aria-hidden', 'true');
    await expect(mark).toHaveTextContent('Acme');
    await expect(mark.querySelector('[data-slot="logo-name"]')).toHaveClass('sr-only');
    await expect(wordmark.querySelector('[data-slot="logo-mark"]')).toBeNull();
    const name = full.querySelector('[data-slot="logo-name"]')!;
    const s = getComputedStyle(name);
    await expect([s.fontSize, s.lineHeight, s.fontWeight]).toEqual(['18px', '28px', '600']);
    await expect(getComputedStyle(full).columnGap).toBe('8px');
  },
};

// A link home: the name is the link name.
export const AsHomeLink: Story = {
  parameters: { controls: { disable: true } },
  render: () => <a href="#home" className="inline-flex rounded-md outline-none focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]"><Logo type="mark" name="Acme, home" /></a>,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Acme, home' })).toBeInTheDocument();
  },
};

export const TypesDark: Story = { ...Types, tags: ['!dev'], globals: { theme: 'Dark' } };
export const TypesCorporate: Story = { ...Types, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
