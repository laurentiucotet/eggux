import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { TrustBadge } from './trust-badge';

const meta = {
  title: 'Components/Badge/Trust Badge',
  component: TrustBadge,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'A certification or compliance claim: SOC 2, ISO 27001, GDPR, PCI DSS. Name and what backs it (audit date, region). Only current claims that can be shown on request; link to the trust page. Tone default on page and card backgrounds, on-primary on primary bands, inverted on inverted cards; never override the colors by hand. Figma: Badge page / Trust Badge. Guide: eggux build-ui/components/badge.md' } },
  },
  args: { name: 'SOC 2 Type II', description: 'Audited September 2026' },
  render: args => <div className="w-[199px]"><TrustBadge {...args} /></div>,
} satisfies Meta<typeof TrustBadge>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma Tone=default: 199 × 54, 20 shield, name and detail.
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const badge = canvasElement.querySelector('[data-slot="trust-badge"]')!;
    await expect(Math.round(box(badge).height)).toBe(54);
    await expect(Math.round(box(badge.querySelector('svg')!).width)).toBe(20);
    await expect(canvas.getByText('Audited September 2026')).toBeInTheDocument();
  },
};

// The three tones on their backgrounds; with href the badge links to the trust page.
export const Tones: Story = {
  render: args => (
    <div className="flex flex-wrap gap-4">
      <div className="rounded-lg bg-background p-4"><TrustBadge {...args} href="#trust" /></div>
      <div className="rounded-lg bg-primary p-4"><TrustBadge {...args} name="ISO 27001" description="Certified 2026" tone="on-primary" /></div>
      <div className="rounded-lg bg-foreground p-4"><TrustBadge {...args} name="GDPR" description="EU data residency" tone="inverted" /></div>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('link', { name: /SOC 2 Type II/ })).toHaveAttribute('href', '#trust');
    const onPrimary = canvasElement.querySelector('[data-tone="on-primary"]')!;
    await expect(getComputedStyle(onPrimary).borderTopColor).toBe(getComputedStyle(onPrimary).color);
  },
};

// Stress: at 120 wide long names wrap, the badge grows; no description gives 1 line. Tests only.
export const Stress: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => (
    <div className="flex gap-4">
      <div className="w-[120px]"><TrustBadge name="PCI DSS Level 1 Service Provider" description="Assessed March 2026" /></div>
      <div className="w-[199px]"><TrustBadge name="HIPAA" /></div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [narrow, bare] = canvasElement.querySelectorAll('[data-slot="trust-badge"]');
    await expect(box(narrow!).height).toBeGreaterThan(54);
    await expect(Math.round(box(narrow!).width)).toBe(120);
    await expect(Math.round(box(bare!).height)).toBe(38);
  },
};

export const DefaultDark: Story = { parameters: { controls: { disable: true } }, tags: ['!dev'], globals: { theme: 'Dark' }, render: Tones.render };
export const DefaultCorporate: Story = { parameters: { controls: { disable: true } }, tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: Tones.render };
