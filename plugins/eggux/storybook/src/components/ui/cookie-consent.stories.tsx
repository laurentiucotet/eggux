import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { CookieConsent, CookiePreferences, type CookieCategory } from './cookie-consent';

const categories: CookieCategory[] = [
  { id: 'necessary', label: 'Necessary', description: 'Sign-in, security and saving your choices. Always on.', required: true },
  { id: 'preferences', label: 'Preferences', description: 'Remember language, theme and layout.' },
  { id: 'analytics', label: 'Analytics', description: 'Count visits and measure performance, without identifying you.' },
  { id: 'marketing', label: 'Marketing', description: 'Show relevant ads on other sites.' },
];

const meta = {
  title: 'Components/Cookie Consent/Cookie Consent',
  component: CookieConsent,
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Consent for non-essential cookies (GDPR, ePrivacy). Banner at the bottom of a marketing site, card in the bottom-left corner of an app; Reject all and Accept all have the same weight; Customize opens the preferences dialog where Necessary is always on and optional categories start off. Never block the page; remember the choice and link "Cookie settings" in the footer. Figma: Cookie Consent page / Cookie Consent.' } },
  },
  args: { onAcceptAll: fn(), onRejectAll: fn(), onCustomize: fn() },
} satisfies Meta<typeof CookieConsent>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma Type=banner: 1440 × 101, region named by the title, Reject and Accept the same style.
export const Default: Story = {
  render: args => <div className="w-[1440px]"><CookieConsent {...args} /></div>,
  play: async ({ canvas, args }) => {
    const region = canvas.getByRole('region', { name: 'We use cookies' });
    await expect(Math.round(box(region).height)).toBe(101);
    const reject = canvas.getByRole('button', { name: 'Reject all' });
    const accept = canvas.getByRole('button', { name: 'Accept all' });
    await expect(reject.className).toBe(accept.className);
    await userEvent.click(accept);
    await expect(args.onAcceptAll).toHaveBeenCalled();
    await expect(canvas.getByRole('link', { name: 'Cookie policy' })).toBeInTheDocument();
  },
};

// Figma Type=card: 400 wide, Reject and Accept side by side, Customize under them.
export const Card: Story = {
  args: { type: 'card' },
  render: args => <div className="p-6"><CookieConsent {...args} /></div>,
  play: async ({ canvas, args }) => {
    const region = canvas.getByRole('region', { name: 'We use cookies' });
    await expect(Math.round(box(region).width)).toBe(400);
    const reject = canvas.getByRole('button', { name: 'Reject all' });
    const accept = canvas.getByRole('button', { name: 'Accept all' });
    await expect(Math.round(box(reject).top)).toBe(Math.round(box(accept).top));
    await userEvent.click(canvas.getByRole('button', { name: 'Customize' }));
    await expect(args.onCustomize).toHaveBeenCalled();
  },
};

// Figma Type=preferences: Customize opens the dialog; Necessary on and disabled, others off; Save sends the choice.
export const Preferences: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [saved, setSaved] = React.useState<string[] | null>(null);
    return (
      <div className="p-6">
        <CookieConsent type="card" onCustomize={() => setOpen(true)} />
        <CookiePreferences open={open} onOpenChange={setOpen} categories={categories} onSave={setSaved} />
        {saved ? <p className="mt-4 text-sm">Saved: {saved.join(', ') || 'none'}</p> : null}
      </div>
    );
  },
  play: async ({ canvas }) => {
    const customize = canvas.getByRole('button', { name: 'Customize' });
    await userEvent.click(customize);
    const dialog = await screen.findByRole('dialog', { name: 'Cookie preferences' });
    const necessary = within(dialog).getByRole('switch', { name: 'Necessary' });
    await expect(necessary).toBeChecked();
    await expect(necessary).toBeDisabled();
    const analytics = within(dialog).getByRole('switch', { name: 'Analytics' });
    await expect(analytics).not.toBeChecked();
    await userEvent.click(analytics);
    await userEvent.click(within(dialog).getByRole('button', { name: 'Save choices' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(canvas.getByText('Saved: analytics')).toBeInTheDocument();
    await waitFor(() => expect(customize).toHaveFocus());
  },
};

// Stress: banner at 768 wraps the actions under the text; card at 320 with a long body. Tests only.
export const Stress: Story = {
  tags: ['!dev'],
  render: args => (
    <div className="flex flex-col gap-6 p-6">
      <div className="w-[768px]"><CookieConsent {...args} /></div>
      <div className="w-[320px]"><CookieConsent {...args} type="card" title="Cookies on Acme" body="We use cookies to keep you signed in, remember your language, theme and layout, count visits to improve the product and, with your consent, show relevant ads on other sites." /></div>
    </div>
  ),
  play: async ({ canvas }) => {
    const [banner] = canvas.getAllByRole('region');
    const text = within(banner!).getByText(/We use cookies to keep/);
    await expect(box(within(banner!).getByRole('button', { name: 'Accept all' })).top).toBeGreaterThan(box(text).bottom);
    const card = canvas.getByRole('region', { name: 'Cookies on Acme' });
    await expect(Math.round(box(card).width)).toBe(320);
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, args: { type: 'card' }, render: Card.render };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, args: { type: 'card' }, render: Card.render };
