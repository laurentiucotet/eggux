import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { Ellipsis, FileText } from '@/components/icons';
import { Button } from './button';
import { Card, CardContent, CardFooter, CardHeader, type CardVariant } from './card';
import { ImagePlaceholder } from './image-placeholder';

const meta = {
  title: 'Components/Card/Card',
  component: Card,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Content about one object or topic, set apart from the page. Variant default, outline, muted, inverted (one per view); Size default or sm; Elevation for one card only; State hover/focus only for a card that is one link. Header, Content and Footer are slots; never nest cards. Padding comes from density/card-* tokens. Figma: Card page / Card, Card Header, Card Footer. Guide: eggux build-ui/components/card.md' } },
  },
  decorators: [Story => <div className="w-96 max-w-full"><Story /></div>],
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

const height = (el: Element) => Math.round(el.getBoundingClientRect().height);
const width = (el: Element) => Math.round(el.getBoundingClientRect().width);

const Placeholder = () => (
  <div className="flex h-[120px] items-center justify-center rounded-md border border-dashed border-border bg-muted px-4 text-center text-xs text-foreground">
    Slot: replace this placeholder with any content
  </div>
);

const Sample = ({ variant, size, elevated, icon = false }: { variant?: CardVariant; size?: 'default' | 'sm'; elevated?: boolean; icon?: boolean }) => (
  <Card variant={variant} size={size} elevated={elevated} data-testid="card">
    <CardHeader
      icon={icon ? <FileText /> : undefined}
      title="Recent activity"
      description="Next 7 days, all locations."
      action={<Button variant="ghost" size="icon" aria-label="More actions about recent activity"><Ellipsis aria-hidden="true" /></Button>}
    />
    <CardContent><Placeholder /></CardContent>
    <CardFooter>
      <Button variant={variant === 'inverted' ? 'secondary' : 'outline'}>Cancel</Button>
      <Button variant={variant === 'inverted' ? 'outline' : 'default'}>Save</Button>
    </CardFooter>
  </Card>
);

// A probe element carrying token classes: colors are compared to the same classes on the card.
const probe = (className: string) => {
  const el = document.createElement('span');
  el.className = className;
  document.body.append(el);
  const style = getComputedStyle(el);
  const copy = { bg: style.backgroundColor, color: style.color, border: style.borderTopColor, borderWidth: style.borderTopWidth };
  el.remove();
  return copy;
};

// Figma Variant=default, Size=default: 384 x 308, radius 12, padding 24.
export const Default: Story = {
  parameters: { controls: { disable: true } },
  render: () => <Sample />,
  play: async ({ canvas }) => {
    const card = canvas.getByTestId('card');
    await expect(width(card)).toBe(384);
    await expect(height(card)).toBe(308);
    await expect(getComputedStyle(card).borderTopLeftRadius).toBe('12px');
    const ref = probe('bg-card border border-border text-card-foreground');
    await expect(getComputedStyle(card).backgroundColor).toBe(ref.bg);
    await expect(getComputedStyle(card).borderTopColor).toBe(ref.border);
    // The title is a heading and the description follows it; the action button has a name.
    await expect(canvas.getByRole('heading', { name: 'Recent activity' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'More actions about recent activity' })).toBeVisible();
    await expect(getComputedStyle(canvas.getByTestId('card')).boxShadow).toBe('none');
  },
};

// Variants: outline is border only (308), muted is tinted with no border (306), inverted flips the colors.
export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-6">
      {(['default', 'outline', 'muted', 'inverted'] as const).map(v => (
        <Card key={v} variant={v} data-testid={v}>
          <CardHeader title={`${v} card`} description="Next 7 days, all locations." />
          <CardContent><Placeholder /></CardContent>
          <CardFooter><Button variant={v === 'inverted' ? 'secondary' : 'outline'}>Cancel</Button></CardFooter>
        </Card>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const outline = canvas.getByTestId('outline');
    await expect(getComputedStyle(outline).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    await expect(getComputedStyle(outline).borderTopWidth).toBe('1px');
    const muted = canvas.getByTestId('muted');
    await expect(getComputedStyle(muted).borderTopWidth).toBe('0px');
    await expect(getComputedStyle(muted).backgroundColor).toBe(probe('bg-[var(--card-muted)]').bg);
    const inverted = canvas.getByTestId('inverted');
    const ref = probe('bg-foreground text-background border border-foreground');
    await expect(getComputedStyle(inverted).backgroundColor).toBe(ref.bg);
    await expect(getComputedStyle(inverted).color).toBe(ref.color);
    await expect(getComputedStyle(inverted).borderTopColor).toBe(ref.border);
    // Inverted description is background/default at 70%.
    const desc = inverted.querySelector('[data-slot="card-description"]') as HTMLElement;
    await expect(getComputedStyle(desc).color).not.toBe(getComputedStyle(inverted).color);
  },
};

// Size=sm: padding and gap 16, 384 x 276.
export const Small: Story = {
  parameters: { controls: { disable: true } },
  render: () => <Sample size="sm" />,
  play: async ({ canvas }) => {
    const card = canvas.getByTestId('card');
    await expect(height(card)).toBe(276);
    await expect(getComputedStyle(card).paddingTop).toBe('16px');
    await expect(getComputedStyle(card.querySelector('[data-slot="card-header"]')!).paddingLeft).toBe('16px');
  },
};

// Elevation: shadow md, never a whole grid. An outline card gets the card background.
export const Elevated: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-6">
      <Card elevated data-testid="flat-elevated"><CardHeader title="Elevated card" description="One card that must stand out." /></Card>
      <Card variant="outline" elevated data-testid="outline-elevated"><CardHeader title="Elevated outline card" description="Has the card background." /></Card>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(getComputedStyle(canvas.getByTestId('flat-elevated')).boxShadow).not.toBe('none');
    await expect(getComputedStyle(canvas.getByTestId('outline-elevated')).backgroundColor).toBe(probe('bg-card').bg);
  },
};

// Card Header: Show icon puts a 20 px decorative icon before the title.
export const HeaderIcon: Story = {
  parameters: { controls: { disable: true } },
  render: () => <Sample icon />,
  play: async ({ canvas, canvasElement }) => {
    const icon = canvasElement.querySelector('[data-slot="card-header-icon"]') as HTMLElement;
    await expect(width(icon)).toBe(20);
    await expect(icon).toHaveAttribute('aria-hidden', 'true');
    await expect(canvas.getByRole('heading', { name: 'Recent activity' })).toBeVisible();
  },
};

// Media=top: a full-bleed 16:9 image at the top, rounded top corners, Header and Content below.
export const MediaTop: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Card media={<ImagePlaceholder ratio="16:9" />} data-testid="card">
      <CardHeader title="Recent activity" description="Next 7 days, all locations." />
      <CardContent><Placeholder /></CardContent>
      <CardFooter><Button variant="outline">Cancel</Button><Button>Save</Button></CardFooter>
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const media = canvasElement.querySelector('[data-slot="image-placeholder"]') as HTMLElement;
    await expect(width(media)).toBe(382);
    await expect(Math.abs(media.getBoundingClientRect().height - (382 * 9) / 16)).toBeLessThan(1);
    const card = canvasElement.querySelector('[data-slot="card"]') as HTMLElement;
    await expect(getComputedStyle(card).paddingTop).toBe('0px');
  },
};

// State hover and focus: a card that is one link as a whole. It gets shadow md and a 2 px focus ring.
export const AsLink: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Card asChild interactive>
      <a href="#use-cases">
        <CardHeader title="Use cases" description="See how teams use Acme." />
        <CardContent><Placeholder /></CardContent>
      </a>
    </Card>
  ),
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: /Use cases/ });
    await userEvent.tab();
    await expect(link).toHaveFocus();
    await expect(link.matches(':focus-visible')).toBe(true);
    await userEvent.hover(link);
    await expect(getComputedStyle(link).boxShadow).not.toBe('none');
  },
};

// A slot with px-0 runs edge to edge (a table, an image, a map).
export const FullBleedSlot: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Card data-testid="card">
      <CardHeader title="Recent activity" />
      <CardContent className="px-0"><div data-testid="bleed" className="h-12 w-full bg-muted" /></CardContent>
    </Card>
  ),
  play: async ({ canvas }) => {
    await expect(width(canvas.getByTestId('bleed'))).toBe(382);
  },
};

// Stress test (Figma "Stress test / Card"): long title and description, 276 and 368 columns.
const Long = () => (
  <Card data-testid="card">
    <CardHeader
      title="Quarterly reconciliation of intercompany invoices across every Acme subsidiary"
      description="All open balances between the Berlin, Paris and Madrid entities, converted to EUR at the closing rate of the last working day."
      action={<Button variant="ghost" size="icon" aria-label="More actions"><Ellipsis aria-hidden="true" /></Button>}
    />
    <CardContent><Placeholder /></CardContent>
    <CardFooter><Button variant="outline">Cancel</Button><Button>Save changes</Button></CardFooter>
  </Card>
);
export const LongText: Story = { tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <Long />,
  play: async ({ canvas }) => {
    const card = canvas.getByTestId('card');
    await expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth);
    await expect(width(canvas.getByRole('button', { name: 'More actions' }))).toBe(36);
  },
};
export const Narrow276: Story = { tags: ['!dev'],
  ...LongText,
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  play: async ({ canvas }) => {
    const card = canvas.getByTestId('card');
    await expect(width(card)).toBe(276);
    await expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth);
    await expect(width(canvas.getByRole('button', { name: 'More actions' }))).toBe(36);
  },
};
export const Narrow368: Story = { tags: ['!dev'],
  ...LongText,
  decorators: [Story => <div className="w-[368px]"><Story /></div>],
  play: async ({ canvas }) => {
    await expect(width(canvas.getByTestId('card'))).toBe(368);
  },
};

// Theme copies: axe checks every Variant in Dark and Corporate Light.
const AllVariants = () => (
  <div className="flex flex-col gap-6">
    {(['default', 'outline', 'muted', 'inverted'] as const).map(v => <Sample key={v} variant={v} />)}
  </div>
);
export const AllVariantsLight: Story = { parameters: { controls: { disable: true } }, render: () => <AllVariants />, name: 'All variants' };
export const AllVariantsDark: Story = { parameters: { controls: { disable: true } }, render: () => <AllVariants />, tags: ['!dev'], globals: { theme: 'Dark' }, name: 'All variants (Dark)' };
export const AllVariantsCorporate: Story = { parameters: { controls: { disable: true } }, render: () => <AllVariants />, tags: ['!dev'], globals: { theme: 'Corporate Light' }, name: 'All variants (Corporate Light)' };
// Other themes change radius and density tokens, so these copies check the heading and run axe.
const themed = async ({ canvas }: { canvas: any }) => { await expect(canvas.getByRole('heading', { name: 'Recent activity' })).toBeVisible(); };
export const DefaultDark: Story = { ...Default, play: themed, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Default, play: themed, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
