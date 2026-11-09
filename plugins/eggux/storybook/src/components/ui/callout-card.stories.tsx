import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { Sparkles } from '@/components/icons';
import { Button } from './button';
import { CalloutCard } from './callout-card';
import { IconTile } from './icon-tile';

const meta = {
  title: 'Components/Card/Callout Card',
  component: CalloutCard,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'An in-app card that suggests one thing (upgrade, tip, announcement). Layout horizontal (560, below 400 use stacked) or stacked (280: media on top, the X in the corner). A region named by its title; title 2 lines, description 3 lines, actions wrap; one primary action at most; the X is named "Dismiss" and the app remembers the choice. One per view. Figma: Card page / Callout Card. Guide: eggux build-ui/components/card.md, monetization.md' } },
  },
  args: {
    title: 'Get more from Acme',
    description: 'Upgrade to Pro for unlimited projects, custom roles and priority support.',
    media: <IconTile tileStyle="brand" icon={<Sparkles />} />,
    actions: (
      <>
        <Button size="sm">Upgrade</Button>
        <Button size="sm" variant="ghost">See plans</Button>
      </>
    ),
    onDismiss: fn(),
  },
} satisfies Meta<typeof CalloutCard>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma Layout=horizontal: 560 wide, padding 20, media 40 on the left.
export const Default: Story = {
  play: async ({ canvas, canvasElement, args }) => {
    const region = canvas.getByRole('region', { name: 'Get more from Acme' });
    await expect(Math.round(box(region).width)).toBe(560);
    await expect(Math.round(box(canvasElement.querySelector('[data-slot="icon-tile"]')!).width)).toBe(40);
    const dismiss = canvas.getByRole('button', { name: 'Dismiss' });
    await expect(Math.round(box(dismiss).width)).toBe(24);
    await expect(Math.round(box(canvas.getByRole('button', { name: 'Upgrade' })).height)).toBe(32);
    await userEvent.click(dismiss);
    await expect(args.onDismiss).toHaveBeenCalledTimes(1);
  },
};

// Layout=stacked: 280 wide, media on top, the X in the corner.
export const Stacked: Story = {
  args: { layout: 'stacked' },
  play: async ({ canvas, canvasElement }) => {
    const region = canvas.getByRole('region', { name: 'Get more from Acme' });
    await expect(Math.round(box(region).width)).toBe(280);
    const media = canvasElement.querySelector('[data-slot="callout-card-media"]') as HTMLElement;
    const title = canvas.getByRole('heading', { name: 'Get more from Acme' });
    await expect(box(media).bottom).toBeLessThanOrEqual(box(title).top);
    const dismiss = canvas.getByRole('button', { name: 'Dismiss' });
    await expect(Math.round(box(region).right - box(dismiss).right)).toBe(12);
    await expect(Math.round(box(dismiss).top - box(region).top)).toBe(12);
  },
};

// Keyboard: Tab goes to the actions, then the X. Dismissing moves focus to a stable target in a real app.
const Dismissible = () => {
  const [open, setOpen] = React.useState(true);
  const restore = React.useRef<HTMLButtonElement>(null);
  return (
    <div className="flex flex-col items-start gap-3">
      {open ? (
        <CalloutCard
          {...meta.args}
          layout="stacked"
          onDismiss={() => {
            setOpen(false);
            requestAnimationFrame(() => restore.current?.focus());
          }}
        />
      ) : null}
      <Button ref={restore} size="sm" variant="outline" onClick={() => setOpen(true)}>Show tip again</Button>
    </div>
  );
};
export const Keyboard: Story = {
  parameters: { controls: { disable: true } },
  render: () => <Dismissible />,
  play: async ({ canvas }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Upgrade' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'See plans' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Dismiss' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.queryByRole('region')).toBeNull();
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Show tip again' })).toHaveFocus());
  },
};

export const NoMediaNoActionsNoClose: Story = {
  args: { media: undefined, actions: undefined, onDismiss: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button')).toBeNull();
    await expect(canvas.getByRole('region', { name: 'Get more from Acme' })).toBeVisible();
  },
};

// Stress test: title cut at 2 lines, description at 3, actions wrap; 220 is the stacked minimum.
const long = {
  title: 'Send invoices automatically every month and never chase a late payment again with Acme',
  description: 'Upgrade to Pro for unlimited projects, custom roles, audit logs, single sign-on and priority support with a named account manager who knows your setup.',
  actions: (
    <>
      <Button size="sm">Upgrade to the Pro plan</Button>
      <Button size="sm" variant="ghost">Compare all plans</Button>
    </>
  ),
};
export const LongTextStacked276: Story = { tags: ['!dev'],
  args: { layout: 'stacked', ...long },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  play: async ({ canvas, canvasElement }) => {
    const region = canvas.getByRole('region');
    await expect(Math.round(box(region).width)).toBe(276);
    await expect(region.scrollWidth).toBeLessThanOrEqual(region.clientWidth);
    await expect(Math.round(box(canvas.getByRole('heading')).height)).toBe(56);
    await expect(Math.round(box(canvasElement.querySelector('[data-slot="callout-card-description"]')!).height)).toBe(60);
    // Actions wrap to a second line.
    await expect(box(canvas.getByRole('button', { name: 'Compare all plans' })).top).toBeGreaterThan(box(canvas.getByRole('button', { name: 'Upgrade to the Pro plan' })).bottom - 1);
  },
};
export const LongTextHorizontal368: Story = { tags: ['!dev'],
  args: { ...long },
  decorators: [Story => <div className="w-[368px]"><Story /></div>],
  play: async ({ canvas }) => {
    const region = canvas.getByRole('region');
    await expect(Math.round(box(region).width)).toBe(368);
    await expect(region.scrollWidth).toBeLessThanOrEqual(region.clientWidth);
  },
};

const Both = () => (
  <div className="flex flex-col gap-4">
    <CalloutCard {...meta.args} />
    <CalloutCard {...meta.args} layout="stacked" />
  </div>
);
export const BothLight: Story = { parameters: { controls: { disable: true }, a11y: { config: { rules: [{ id: 'landmark-unique', enabled: false }] } } }, render: () => <Both />, name: 'Both layouts' };
export const BothDark: Story = { parameters: { controls: { disable: true }, a11y: { config: { rules: [{ id: 'landmark-unique', enabled: false }] } } }, render: () => <Both />, tags: ['!dev'], globals: { theme: 'Dark' }, name: 'Both layouts (Dark)' };
export const BothCorporate: Story = { parameters: { controls: { disable: true }, a11y: { config: { rules: [{ id: 'landmark-unique', enabled: false }] } } }, render: () => <Both />, tags: ['!dev'], globals: { theme: 'Corporate Light' }, name: 'Both layouts (Corporate Light)' };
