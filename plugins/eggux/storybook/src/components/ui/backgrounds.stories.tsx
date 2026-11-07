import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { BackgroundBeam, BackgroundDots, BackgroundGlow, BackgroundGrid } from './backgrounds';
import { Button } from './button';

const meta = {
  title: 'Components/Background/Backgrounds',
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Decorative layers for the back of a hero, feature or CTA section: Grid (1 px lines, 40 px cells), Dots (24 px pitch), Glow (top, center, bottom-right) and Beam. Put one first inside a `relative isolate` section; it fills the section, ignores the pointer and is hidden from screen readers and in forced-colors mode. One device per page (Grid + Glow count as one hero treatment). Figma: Background page. Guide: eggux build-ui/patterns/marketing-pages.md' } },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();
const Hero = ({ children, align = 'center' }: { children: React.ReactNode; align?: 'center' | 'left' }) => (
  <section className="relative isolate flex h-[800px] w-[1440px] flex-col justify-center gap-6 overflow-hidden bg-background px-36" style={{ alignItems: align === 'center' ? 'center' : 'flex-start', textAlign: align }}>
    {children}
    <h1 className="m-0 max-w-[768px] text-5xl leading-[60px] font-semibold tracking-[-1.2px] text-foreground">Invoices that get paid on time</h1>
    <p className="m-0 max-w-[768px] text-lg leading-7 text-muted-foreground">Send, track and reconcile invoices in one place, with reminders that go out on their own.</p>
    <div className="flex gap-2"><Button size="lg">Start free trial</Button><Button size="lg" variant="outline">Book a demo</Button></div>
  </section>
);

// Figma hero example: Grid + Glow (top) behind a centered headline.
export const GridAndGlow: Story = {
  render: () => <Hero><BackgroundGrid /><BackgroundGlow /></Hero>,
  play: async ({ canvasElement }) => {
    const grid = canvasElement.querySelector('[data-slot="background-grid"]')!;
    await expect(grid).toHaveAttribute('aria-hidden', 'true');
    await expect(Math.round(box(grid).width)).toBe(1440);
    await expect(Math.round(box(grid).height)).toBe(800);
    await expect(getComputedStyle(grid).pointerEvents).toBe('none');
    await expect(getComputedStyle(grid).backgroundSize).toContain('40px 40px');
    await expect(getComputedStyle(grid).maskImage).toContain('radial-gradient');
    // Content stays on top and clickable.
    const button = canvasElement.querySelector('button')!;
    const r = box(button);
    await expect(document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)?.closest('button')).toBe(button);
  },
};

// Dots, no fade.
export const Dots: Story = {
  render: () => <Hero><BackgroundDots fade={false} /></Hero>,
  play: async ({ canvasElement }) => {
    const dots = canvasElement.querySelector('[data-slot="background-dots"]')!;
    await expect(getComputedStyle(dots).backgroundSize).toContain('24px 24px');
    await expect(getComputedStyle(dots).maskImage).toBe('none');
  },
};

// Glow: top, center, bottom-right.
export const Glow: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(['top', 'center', 'bottom-right'] as const).map(p => (
        <section key={p} className="relative isolate h-[400px] w-[720px] overflow-hidden border border-border bg-background">
          <BackgroundGlow position={p} />
          <p className="m-4 text-sm text-muted-foreground">Position={p}</p>
        </section>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const glows = canvasElement.querySelectorAll('[data-slot="background-glow"]');
    await expect([...glows].map(g => g.getAttribute('data-position'))).toEqual(['top', 'center', 'bottom-right']);
  },
};

// Beam behind a left-aligned hero.
export const Beam: Story = {
  render: () => <Hero align="left"><BackgroundBeam /></Hero>,
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('[data-slot="beam"]')).toHaveLength(3);
  },
};

// Narrow columns and Dark: the pattern keeps its pitch. Tests only.
export const Narrow: Story = {
  tags: ['!dev'],
  render: () => (
    <div className="flex gap-4">
      {[276, 368, 564].map(w => (
        <section key={w} className="relative isolate h-[400px] overflow-hidden border border-border bg-background" style={{ width: w }}>
          <BackgroundGrid />
        </section>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const g of canvasElement.querySelectorAll('[data-slot="background-grid"]')) await expect(getComputedStyle(g).backgroundSize).toContain('40px 40px');
  },
};
export const GridDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, render: GridAndGlow.render };
export const BeamCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: Beam.render };
