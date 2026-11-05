import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test';
import { InfoTip, InfoTipTrigger } from './info-tip';

const meta = {
  title: 'Components/Tooltip/Info Tip',
  component: InfoTip,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'A definition next to a label, opened by click or tap on a 20 px info button (works on touch, unlike Tooltip). One or two sentences and at most one link. Figma: Tooltip page / Info Tip, Info Tip Trigger. Guide: eggux build-ui/components/tooltip.md' } },
  },
  args: {
    label: 'Tax ID',
    title: 'What is a tax ID?',
    children: 'The number your tax authority gives your business. It appears on every invoice you send.',
    link: { href: '#tax-id', label: 'Learn more' },
    onOpenChange: fn(),
  },
  decorators: [Story => <div className="flex h-56 items-start gap-1 pt-2"><span className="text-sm font-medium">Tax ID</span><Story /></div>],
} satisfies Meta<typeof InfoTip>;
export default meta;
type Story = StoryObj<typeof meta>;

// Click opens below, focus stays on the trigger, the text is its description; Escape closes.
export const Default: Story = {
  play: async ({ canvas, args }) => {
    const trigger = canvas.getByRole('button', { name: 'More about Tax ID' });
    await expect(Math.round(trigger.getBoundingClientRect().width)).toBe(20);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    await expect(args.onOpenChange).toHaveBeenCalledWith(true);
    const tip = await screen.findByRole('dialog');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(trigger).toHaveFocus();
    await expect(trigger).toHaveAccessibleDescription(/tax authority gives your business/);
    await expect(Math.round(tip.getBoundingClientRect().width)).toBe(280);
    await expect(tip.getBoundingClientRect().top).toBeGreaterThan(trigger.getBoundingClientRect().bottom);
    await expect(screen.getByRole('link', { name: 'Learn more' })).toHaveAttribute('href', '#tax-id');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
  },
};

// Keyboard: Tab reaches the trigger, Enter opens, a second Enter closes.
export const Keyboard: Story = {
  play: async ({ canvas }) => {
    await userEvent.tab();
    const trigger = canvas.getByRole('button', { name: 'More about Tax ID' });
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(await screen.findByRole('dialog')).toBeVisible();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  },
};

// Figma Side=top.
export const Top: Story = {
  args: { side: 'top', defaultOpen: true },
  decorators: [Story => <div className="flex h-56 items-end gap-1 pb-2"><span className="text-sm font-medium">Tax ID</span><Story /></div>],
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'More about Tax ID' });
    const tip = await screen.findByRole('dialog');
    await expect(tip.getBoundingClientRect().bottom).toBeLessThan(trigger.getBoundingClientRect().top);
  },
};

// Figma "All options off": text only.
export const TextOnly: Story = {
  args: { title: undefined, link: undefined, defaultOpen: true },
  play: async () => {
    const tip = await screen.findByRole('dialog');
    await expect(tip.querySelectorAll('p')).toHaveLength(1);
    await expect(screen.queryByRole('link')).not.toBeInTheDocument();
  },
};

// Stress test: long text wraps inside 280.
export const LongText: Story = { tags: ['!dev'],
  args: { defaultOpen: true, children: 'The number your tax authority gives your business, also called VAT number, EIN or CUI depending on the country. It appears on every invoice you send and on the reverse-charge note for EU customers.' },
  play: async () => {
    const tip = await screen.findByRole('dialog');
    await expect(Math.round(tip.getBoundingClientRect().width)).toBe(280);
    await expect(tip.scrollWidth).toBeLessThanOrEqual(tip.clientWidth);
  },
};

// Figma Info Tip Trigger states: default, open (muted fill, brand icon), disabled.
export const TriggerStates: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <InfoTipTrigger label="SLA" />
      <InfoTipTrigger label="Webhook URL" data-state="open" />
      <InfoTipTrigger label="Role" disabled />
    </div>
  ),
  decorators: [],
  play: async ({ canvas }) => {
    const open = canvas.getByRole('button', { name: 'More about Webhook URL' });
    await expect(getComputedStyle(open).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    await expect(canvas.getByRole('button', { name: 'More about Role' })).toBeDisabled();
  },
};

export const OpenDark: Story = { args: { defaultOpen: true }, tags: ['!dev'], globals: { theme: 'Dark' } };
export const OpenCorporate: Story = { args: { defaultOpen: true }, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
