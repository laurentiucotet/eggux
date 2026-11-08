import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { ImagePlaceholder } from './image-placeholder';
import { LinkPreview } from './link-preview';

const meta = {
  title: 'Components/Card/Link Preview',
  component: LinkPreview,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'A pasted URL as a card in comments, chat and notes: site, title (2 lines), description (2 lines), image. The whole card is one link that opens in a new tab; the image is decorative; the author can remove the preview and keep the plain link. Figma: Card page / Link Preview. Guide: eggux build-ui/components/card.md, comments-and-chat.md' } },
  },
  args: {
    href: 'https://acme.com/blog/month-end-close',
    domain: 'acme.com',
    title: 'How we cut month-end close from nine days to five',
    description: 'Three changes to approvals and bank matching, and the numbers behind them.',
    image: <ImagePlaceholder ratio="1:1" />,
  },
} satisfies Meta<typeof LinkPreview>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma Layout=horizontal: 480 x 122, image 120 square on the right.
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const link = canvas.getByRole('link', { name: /How we cut month-end close/ });
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
    await expect(link).toHaveAccessibleName(/opens in a new tab/);
    await expect(Math.round(box(link).width)).toBe(480);
    await expect(Math.round(box(link).height)).toBe(122);
    const img = canvasElement.querySelector('[data-slot="link-preview-image"]') as HTMLElement;
    await expect(Math.round(box(img).width)).toBe(120);
    await expect(img).toHaveAttribute('aria-hidden', 'true');
  },
};

// Layout=vertical: 320 wide, the image on top (the text keeps the reading order first).
export const Vertical: Story = {
  args: { layout: 'vertical', image: <ImagePlaceholder ratio="16:9" /> },
  play: async ({ canvas, canvasElement }) => {
    const link = canvas.getByRole('link');
    await expect(Math.round(box(link).width)).toBe(320);
    const img = canvasElement.querySelector('[data-slot="link-preview-image"]') as HTMLElement;
    const text = canvasElement.querySelector('[data-slot="link-preview-text"]') as HTMLElement;
    await expect(box(img).bottom).toBeLessThanOrEqual(box(text).top + 1);
    await expect(Math.abs(box(link).height - 301)).toBeLessThan(10);
  },
};

export const NoImage: Story = {
  args: { image: undefined },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvasElement.querySelector('[data-slot="link-preview-image"]')).toBeNull();
    await expect(Math.round(box(canvas.getByRole('link')).width)).toBe(480);
  },
};

// Keyboard: Tab reaches the link, then the Remove button (aria-label "Remove preview").
const Removable = ({ onRemove }: { onRemove: () => void }) => {
  const [open, setOpen] = React.useState(true);
  return open ? <LinkPreview {...meta.args} onRemove={() => { onRemove(); setOpen(false); }} /> : <a href="https://acme.com/blog/month-end-close">https://acme.com/blog/month-end-close</a>;
};
export const Removal: Story = {
  parameters: { controls: { disable: true } },
  render: () => <Removable onRemove={fn()} />,
  play: async ({ canvas }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('link', { name: /How we cut/ })).toHaveFocus();
    await userEvent.tab();
    const remove = canvas.getByRole('button', { name: 'Remove preview' });
    await expect(remove).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    // The author keeps the plain link.
    await expect(canvas.queryByRole('button', { name: 'Remove preview' })).toBeNull();
    await expect(canvas.getByRole('link', { name: 'https://acme.com/blog/month-end-close' })).toBeVisible();
  },
};

// Stress test: title and description cut at 2 lines; the domain truncates; 276 and 368 columns.
const long = {
  domain: 'finance-operations.internal.acme-corporation-international.example.com',
  title: 'How the Berlin, Paris and Madrid finance teams cut month-end close from nine working days to five without adding headcount',
  description: 'Three changes to approvals and bank matching, the numbers behind them, and what we would do differently next time if we started again from scratch.',
};
export const LongTextNarrow: Story = {
  args: { ...long, layout: 'vertical' },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  play: async ({ canvas, canvasElement }) => {
    const link = canvas.getByRole('link');
    await expect(Math.round(box(link).width)).toBe(276);
    await expect(link.scrollWidth).toBeLessThanOrEqual(link.clientWidth);
    await expect(Math.round(box(canvasElement.querySelector('[data-slot="link-preview-title"]')!).height)).toBe(40);
    await expect(Math.round(box(canvasElement.querySelector('[data-slot="link-preview-description"]')!).height)).toBe(32);
  },
};
export const LongTextHorizontal368: Story = {
  args: long,
  decorators: [Story => <div className="w-[368px]"><Story /></div>],
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link');
    await expect(Math.round(box(link).width)).toBe(368);
    await expect(link.scrollWidth).toBeLessThanOrEqual(link.clientWidth);
  },
};

const Both = () => (
  <div className="flex flex-col gap-4">
    <LinkPreview {...meta.args} />
    <LinkPreview {...meta.args} layout="vertical" image={<ImagePlaceholder ratio="16:9" />} />
  </div>
);
export const BothLight: Story = { parameters: { controls: { disable: true } }, render: () => <Both />, name: 'Both layouts' };
export const BothDark: Story = { parameters: { controls: { disable: true } }, render: () => <Both />, tags: ['!dev'], globals: { theme: 'Dark' }, name: 'Both layouts (Dark)' };
export const BothCorporate: Story = { parameters: { controls: { disable: true } }, render: () => <Both />, tags: ['!dev'], globals: { theme: 'Corporate Light' }, name: 'Both layouts (Corporate Light)' };
