import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { FileText, Lock, Plus, Search, Upload } from '@/components/icons';
import { EmptyState } from './empty-state';
import { Button } from './button';

const meta = {
  title: 'Components/Empty State',
  component: EmptyState,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'What to show when there is nothing: first use, no results, no access or an error, with a next step. Size default for pages, sm inside tables, cards and panels. Media icon (default), illustration or image, never replacing the title and action. Tone error says what failed and offers Try again. The Spot Illustration and Image Placeholder are not in code yet: pass them as the `illustration` and `image` props. Figma: Empty State page / Empty State. Guide: eggux build-ui/patterns/empty-state.md' } },
  },
  decorators: [Story => <div className="w-[400px] max-w-full"><Story /></div>],
} satisfies Meta<typeof EmptyState>;
export default meta;
type Story = StoryObj<typeof meta>;

const size = (el: Element) => {
  const r = el.getBoundingClientRect();
  return { w: Math.round(r.width), h: Math.round(r.height) };
};
// Resolve a token class to a computed value with a probe element.
const probe = (cls: string, prop: 'backgroundColor' | 'color' | 'borderRadius') => {
  const el = document.createElement('div');
  el.className = cls;
  document.body.appendChild(el);
  const v = getComputedStyle(el)[prop];
  el.remove();
  return v;
};
const root = (canvas: { getByRole: (r: string, o?: object) => HTMLElement }) =>
  canvas.getByRole('heading').closest('[data-slot="empty-state"]') as HTMLElement;
const media = (el: HTMLElement) => el.querySelector('[data-slot="empty-state-media"]')!;

const Actions = ({ sm = false }: { sm?: boolean }) => (
  <>
    <Button size={sm ? 'sm' : 'default'} leadingIcon={<Plus aria-hidden="true" />}>New invoice</Button>
    <Button variant="outline" size={sm ? 'sm' : 'default'} leadingIcon={<Upload aria-hidden="true" />}>Import</Button>
  </>
);

// Stand-ins for the Spot Illustration and the Image Placeholder (not in code yet).
const IllustrationStandIn = () => (
  <div className="flex size-full items-center justify-center rounded-full bg-muted text-foreground [&_svg]:size-1/2"><FileText aria-hidden="true" /></div>
);
const ImageStandIn = () => (
  <div className="flex size-full items-center justify-center bg-muted text-muted-foreground [&_svg]:size-8"><Search aria-hidden="true" /></div>
);

const w320 = [(Story: React.ComponentType) => <div className="w-[320px] max-w-full"><Story /></div>];

// Figma Size=default, Media=icon, Tone=default: 400 x 286, 48 tile.
export const Default: Story = {
  args: { actions: <Actions /> },
  play: async ({ canvas }) => {
    const el = root(canvas);
    await expect(size(el)).toEqual({ w: 400, h: 286 });
    const title = canvas.getByRole('heading', { name: 'No invoices yet', level: 3 });
    await expect(title).toBeInTheDocument();
    const description = canvas.getByText('Create your first invoice or import them from your accounting system.');
    const tile = media(el);
    await expect(size(tile)).toEqual({ w: 48, h: 48 });
    await expect(tile.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    await expect(getComputedStyle(tile).backgroundColor).toBe(probe('bg-muted', 'backgroundColor'));
    await expect(getComputedStyle(tile).borderRadius).toBe(probe('rounded-lg', 'borderRadius'));
    await expect(getComputedStyle(title).color).toBe(probe('text-foreground', 'color'));
    await expect(getComputedStyle(description).color).toBe(probe('text-muted-foreground', 'color'));
    await expect(canvas.getByRole('button', { name: 'New invoice' })).toBeInTheDocument();
  },
};

// Figma Size=sm, Media=icon: 320 x 210, 40 tile, 14 px title.
export const Small: Story = {
  args: { size: 'sm', title: 'No customers yet', description: 'Customers you add appear here.', actions: <Actions sm /> },
  decorators: w320,
  play: async ({ canvas }) => {
    const el = root(canvas);
    await expect(size(el).w).toBe(320);
    await expect(size(media(el))).toEqual({ w: 40, h: 40 });
    await expect(getComputedStyle(canvas.getByRole('heading')).fontSize).toBe('14px');
    await expect(size(canvas.getByRole('button', { name: 'New invoice' })).h).toBe(32);
  },
};

// Figma Size=default, Media=image: 400 x 418, media 320 x 180 (16:9).
export const WithImage: Story = {
  args: { media: 'image', image: <ImageStandIn />, actions: <Actions /> },
  play: async ({ canvas }) => {
    const el = root(canvas);
    await expect(size(el)).toEqual({ w: 400, h: 418 });
    await expect(size(media(el))).toEqual({ w: 320, h: 180 });
    await expect(canvas.getByRole('heading', { name: 'No invoices yet' })).toBeInTheDocument();
    await expect(canvas.getAllByRole('button')).toHaveLength(2);
  },
};

// Figma Size=sm, Media=image: 320 x 323.
export const SmallWithImage: Story = {
  args: { size: 'sm', media: 'image', image: <ImageStandIn />, actions: <Actions sm /> },
  decorators: w320,
  play: async ({ canvas }) => {
    const el = root(canvas);
    await expect(size(el)).toEqual({ w: 320, h: 323 });
  },
};

// Figma Media=illustration: 400 x 358 with a 120 illustration.
export const WithIllustration: Story = {
  args: { media: 'illustration', illustration: <IllustrationStandIn />, actions: <Actions /> },
  play: async ({ canvas }) => {
    const el = root(canvas);
    await expect(size(el)).toEqual({ w: 400, h: 358 });
    await expect(size(media(el))).toEqual({ w: 120, h: 120 });
    await expect(media(el)).toHaveAttribute('aria-hidden', 'true');
  },
};

// Figma Size=sm, Media=illustration: 320 x 250 with 80.
export const SmallWithIllustration: Story = {
  args: { size: 'sm', media: 'illustration', illustration: <IllustrationStandIn />, actions: <Actions sm /> },
  decorators: w320,
  play: async ({ canvas }) => {
    const el = root(canvas);
    await expect(size(el)).toEqual({ w: 320, h: 250 });
    await expect(size(media(el))).toEqual({ w: 80, h: 80 });
  },
};

// Figma Tone=error: soft destructive tile, own title and description, Try again outline button.
export const ErrorState: Story = {
  name: 'Error',
  args: { tone: 'error', onRetry: fn() },
  play: async ({ canvas, args }) => {
    const el = root(canvas);
    await expect(size(el)).toEqual({ w: 400, h: 286 });
    await expect(el).toHaveAttribute('role', 'alert');
    await expect(canvas.getByRole('heading', { name: 'Could not load invoices' })).toBeInTheDocument();
    await expect(canvas.getByText(/Check your connection/)).toBeInTheDocument();
    const tile = media(el);
    await expect(getComputedStyle(tile).backgroundColor).toBe(probe('bg-[var(--badge-soft-destructive-bg)]', 'backgroundColor'));
    await expect(getComputedStyle(tile).color).toBe(probe('text-[var(--badge-soft-destructive-fg)]', 'color'));
    await userEvent.click(canvas.getByRole('button', { name: 'Try again' }));
    await expect(args.onRetry).toHaveBeenCalledTimes(1);
  },
};

// Figma Size=sm, Tone=error: 320 x 210.
export const ErrorSmall: Story = {
  args: { tone: 'error', size: 'sm' },
  decorators: w320,
  play: async ({ canvas }) => {
    const el = root(canvas);
    await expect(size(el)).toEqual({ w: 320, h: 210 });
    await expect(size(media(el))).toEqual({ w: 40, h: 40 });
    await expect(size(canvas.getByRole('button', { name: 'Try again' })).h).toBe(32);
  },
};

// The five cases of "empty state types": each with its own icon and action.
export const Types: Story = {
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[848px] max-w-full"><Story /></div>],
  render: () => (
    <div className="grid gap-6 md:grid-cols-2">
      <EmptyState title="No results" description="Nothing matches this search. Try another word or clear the filters." icon={<Search />} actions={<Button variant="outline">Clear filters</Button>} />
      <EmptyState title="No access" description="Ask a workspace admin to give you access to billing." icon={<Lock />} actions={<Button variant="outline">Request access</Button>} />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'No results' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Request access' })).toBeInTheDocument();
  },
};

// Show description and Show actions off: 320 x 120.
export const TitleOnly: Story = {
  args: { size: 'sm', title: 'No invoices yet', description: null, actions: null },
  decorators: w320,
  play: async ({ canvas }) => {
    await expect(size(root(canvas)).h).toBe(120);
    await expect(canvas.queryByRole('button')).toBeNull();
  },
};

export const Keyboard: Story = {
  args: { actions: <Actions /> },
  play: async ({ canvas }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'New invoice' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Import' })).toHaveFocus();
  },
};

// Stress test: long text wraps inside 400 and never overflows.
export const LongText: Story = { tags: ['!dev'],
  args: {
    title: 'No invoices match the filters you applied to this very long workspace name',
    description: 'Create your first invoice or import them from your accounting system, and when you are done come back here to review the long list of drafts, sent invoices and the ones waiting for approval from the finance team.',
    actions: <Actions />,
  },
  play: async ({ canvas }) => {
    const el = root(canvas);
    await expect(size(el).w).toBe(400);
    await expect(el.scrollWidth).toBeLessThanOrEqual(400);
    await expect(size(el).h).toBeGreaterThan(286);
  },
};

// Works from 276 (Size=sm).
export const Narrow276: Story = { tags: ['!dev'],
  args: { size: 'sm', actions: <Actions sm /> },
  decorators: [Story => <div className="w-[276px] max-w-full"><Story /></div>],
  play: async ({ canvas }) => {
    const el = root(canvas);
    await expect(size(el).w).toBe(276);
    await expect(el.scrollWidth).toBeLessThanOrEqual(276);
    await expect(canvas.getAllByRole('button')).toHaveLength(2);
  },
};

export const DefaultDark: Story = { ...Default, globals: { theme: 'Dark' }, tags: ['!dev'] };
export const ErrorDark: Story = { ...ErrorState, globals: { theme: 'Dark' }, tags: ['!dev'] };
export const DefaultCorporate: Story = { ...Default, globals: { theme: 'Corporate Light' }, tags: ['!dev'] };
export const ErrorCorporate: Story = { ...ErrorState, globals: { theme: 'Corporate Light' }, tags: ['!dev'] };
