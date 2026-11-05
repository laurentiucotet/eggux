import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, mocked, screen, spyOn, userEvent, waitFor } from 'storybook/test';
import { SocialShare } from './social-share';
import { TooltipProvider } from './tooltip';

const url = 'https://acme.example/blog/month-end-close';
const title = 'How we cut month-end close from 10 days to 4';

const meta = {
  title: 'Components/Button/Social Share',
  component: SocialShare,
  parameters: {
    docs: { description: { component: 'Share buttons for a public page: copy link (confirms with a Toast), email, the system share sheet where the browser supports it, and up to three networks the audience uses. Replace the letter marks with the official logos in product. Inside the app, sharing with people uses the Sharing components. Figma: Button page / Social Share. Guide: eggux build-ui/patterns/sharing-and-invites.md' } },
  },
  decorators: [Story => <TooltipProvider delayDuration={0}><Story /></TooltipProvider>],
  args: { url, title, systemShare: true, onCopyLink: fn() },
  beforeEach: () => {
    if (!navigator.clipboard) Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => undefined } });
    const spy = spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    return () => spy.mockRestore();
  },
} satisfies Meta<typeof SocialShare>;
export default meta;
type Story = StoryObj<typeof meta>;

const probe = (cls: string) => { const p = document.createElement('span'); p.className = cls; document.body.append(p); return { style: getComputedStyle(p), remove: () => p.remove() }; };
const box = (el: Element) => { const r = el.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; };

// Copy link copies the page URL and confirms; every button and mark is 32 px, 8 px apart.
export const Default: Story = {
  render: args => <div className="w-[279px]"><SocialShare {...args} /></div>,
  play: async ({ canvas, args }) => {
    const copy = canvas.getByRole('button', { name: 'Copy link' });
    await userEvent.hover(copy);
    await expect(await screen.findByRole('tooltip')).toHaveTextContent('Copy link');
    await userEvent.click(copy);
    await expect(mocked(navigator.clipboard.writeText)).toHaveBeenCalledWith(url);
    await expect(args.onCopyLink).toHaveBeenCalledWith(url);
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Link copied'));
    await userEvent.unhover(copy);
    // Figma: outline sm Button Icons (32) and 32 px network tiles with a border and radius md.
    const controls = [copy, canvas.getByRole('link', { name: 'Share by email' }), canvas.getByRole('button', { name: 'Share' }), ...canvas.getAllByRole('link', { name: /^Share on/ })];
    await expect(controls.map(box)).toEqual(Array(6).fill([32, 32]));
    const outline = probe('bg-background border border-input');
    await expect(getComputedStyle(copy).borderTopColor).toBe(outline.style.borderTopColor);
    outline.remove();
    const tile = probe('border border-border rounded-md text-foreground');
    const linkedIn = canvas.getByRole('link', { name: 'Share on LinkedIn (opens in a new tab)' });
    await expect(getComputedStyle(linkedIn).borderTopColor).toBe(tile.style.borderTopColor);
    await expect(getComputedStyle(linkedIn).borderTopLeftRadius).toBe(tile.style.borderTopLeftRadius);
    tile.remove();
    await expect(linkedIn).toHaveAttribute('target', '_blank');
    await expect(linkedIn.getAttribute('href')).toContain(encodeURIComponent(url));
    await expect(canvas.getByRole('link', { name: 'Share by email' }).getAttribute('href')).toMatch(/^mailto:\?subject=/);
  },
};

// Keyboard: every control is a tab stop in visual order.
export const Keyboard: Story = { tags: ['!dev'],
  render: args => <SocialShare {...args} />,
  play: async ({ canvas }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Copy link' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('link', { name: 'Share by email' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Share' })).toHaveFocus();
    await userEvent.tab();
    const linkedIn = canvas.getByRole('link', { name: /LinkedIn/ });
    await expect(linkedIn).toHaveFocus();
    await waitFor(() => expect(getComputedStyle(linkedIn).boxShadow).toContain('0px 0px 0px 4px'));
  },
};

// The system share button opens the share sheet with the title and URL.
export const SystemShare: Story = {
  render: args => <SocialShare {...args} />,
  play: async ({ canvas }) => {
    const share = fn().mockResolvedValue(undefined);
    const original = navigator.share;
    Object.defineProperty(navigator, 'share', { configurable: true, value: share });
    await userEvent.click(canvas.getByRole('button', { name: 'Share' }));
    await expect(share).toHaveBeenCalledWith({ title, url });
    Object.defineProperty(navigator, 'share', { configurable: true, value: original });
  },
};

// Figma Show label off and Show networks off: only the three icon buttons.
export const AllOff: Story = {
  args: { showLabel: false, showNetworks: false },
  play: async ({ canvas }) => {
    await expect(canvas.queryByText('Share', { selector: 'span' })).toBeNull();
    await expect(canvas.queryAllByRole('link', { name: /^Share on/ })).toHaveLength(0);
    await expect(canvas.getAllByRole('button')).toHaveLength(2);
  },
};
