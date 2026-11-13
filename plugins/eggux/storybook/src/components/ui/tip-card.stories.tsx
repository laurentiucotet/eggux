import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { Button } from './button';
import { TipCard } from './tip-card';

type Args = { title: string; text: string; showLink: boolean; showNeverShow: boolean; width: number };

const meta = {
  title: 'Components/Onboarding/Tip Card',
  parameters: {
    docs: {
      description: {
        component:
          'A dismissible tip: lightbulb, title, one or two sentences, a link and two ways out, the X and "Don\'t show again". When it goes away focus moves to the next focusable element (or a ref you give), never to the page, and a polite status says what happened. Code only (no Figma component yet). Guide: eggux build-ui/patterns/onboarding.md',
      },
    },
  },
  args: { title: 'Tip: pay faster with a link', text: 'Add a payment link to any invoice and customers can pay by card or bank transfer in two clicks.', showLink: true, showNeverShow: true, width: 440 },
  argTypes: {
    title: { name: 'Title', control: 'text', description: 'Heading of the tip.', table: { category: 'Card' } },
    text: { name: 'Text', control: 'text', description: 'The tip, one or two sentences.', table: { category: 'Card' } },
    width: { name: 'Width', control: { type: 'range', min: 240, max: 520, step: 4 }, description: 'Container width in px.', table: { category: 'Card' } },
    showLink: { name: 'Show link', control: 'boolean', description: 'The Learn more link.', table: { category: 'Parts' } },
    showNeverShow: { name: 'Show "Don\'t show again"', control: 'boolean', description: 'The second way out.', table: { category: 'Parts' } },
  },
  render: ({ title, text, showLink, showNeverShow, width }) => (
    <div style={{ width }} className="flex max-w-full flex-col items-start gap-3">
      <TipCard title={title} linkLabel={showLink ? 'Learn more' : ''} neverShowLabel={showNeverShow ? "Don't show again" : ''}>
        {text}
      </TipCard>
      <Button variant="outline" size="sm">Create invoice</Button>
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const onDismiss = fn();
const onNeverShow = fn();

export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[440px] max-w-full flex-col items-start gap-3">
      <Button variant="outline" size="sm">Before</Button>
      <TipCard onDismiss={onDismiss} onNeverShow={onNeverShow} />
      <Button variant="outline" size="sm">After</Button>
    </div>
  ),
  play: async ({ canvas }) => {
    const region = canvas.getByRole('region', { name: 'Tip: pay faster with a link' });
    await expect(region).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Learn more' })).toHaveAttribute('href', '#payment-links');
    // Keyboard path: Tab from the button before reaches link, never-show, X in order.
    canvas.getByRole('button', { name: 'Before' }).focus();
    await userEvent.tab();
    await expect(canvas.getByRole('link', { name: 'Learn more' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: "Don't show again" })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Dismiss tip' })).toHaveFocus();
    // Enter on the X dismisses; focus goes to the next control, not to the body.
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.queryByRole('region')).toBeNull());
    await expect(canvas.getByRole('button', { name: 'After' })).toHaveFocus();
    await expect(canvas.getByRole('status')).toHaveTextContent('Tip dismissed.');
    await expect(onDismiss).toHaveBeenCalled();
  },
};

export const NeverShow: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => {
    const target = React.createRef<HTMLButtonElement>();
    return (
      <div className="flex w-[440px] max-w-full flex-col items-start gap-3">
        <TipCard onNeverShow={onNeverShow} returnFocusRef={target} />
        <Button variant="outline" size="sm">Other</Button>
        <Button ref={target} variant="outline" size="sm">Create invoice</Button>
      </div>
    );
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: "Don't show again" }));
    await waitFor(() => expect(canvas.queryByRole('region')).toBeNull());
    // The given ref wins over the next element.
    await expect(canvas.getByRole('button', { name: 'Create invoice' })).toHaveFocus();
    await expect(canvas.getByRole('status')).toHaveTextContent("You won't see it again.");
    await expect(onNeverShow).toHaveBeenCalled();
  },
};

/** Both ways out and the shortest form side by side. */
export const Forms: Story = {
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="flex w-[440px] max-w-full flex-col gap-4"><Story /></div>],
  render: () => (
    <>
      <TipCard />
      <TipCard title="Tip: keyboard shortcuts" linkLabel="" neverShowLabel="">Press N to start a new invoice from anywhere.</TipCard>
    </>
  ),
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <TipCard title="Tip: connect Supercalifragilisticexpialidocious_accounting_software_today" linkLabel="Learn more about connecting accounting software">
      A very long sentence with an unbreakable_token_that_keeps_going_and_going_and_going_without_any_spaces_at_all that must wrap.
    </TipCard>
  ),
  play: async ({ canvas }) => {
    const region = canvas.getByRole('region');
    await expect(region.scrollWidth).toBeLessThanOrEqual(region.clientWidth + 1);
    for (const el of [...canvas.getAllByRole('button'), canvas.getByRole('link')]) {
      await expect(el.getBoundingClientRect().right).toBeLessThanOrEqual(region.getBoundingClientRect().right + 1);
    }
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
