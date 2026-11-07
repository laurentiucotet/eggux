import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { AnnouncementBanner, BannerCountdown, BannerFloating, BannerWithAction, Countdown } from './site-banners';

const NOW = new Date('2026-10-27T14:32:00Z');
const later = (d: number, h: number, m: number, s: number) => new Date(NOW.getTime() + ((d * 24 + h) * 3600 + m * 60 + s) * 1000);
const onDismiss = fn();

const meta = {
  title: 'Blocks/Navigation/Banners',
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Bars above the navbar and a floating banner. Announcement Banner: one primary line with a link. Banner with Action: the quiet sibling on the muted section background (events, policy updates). Banner Countdown: a dated offer with a Countdown that removes the bar at zero; screen readers get the end time, not the ticking digits. Banner Floating: an elevated card for a launch or an offer, pinned near the bottom with `floating`. Each is a named region with a dismiss button; remember the dismissal on the page. Figma: BLOCKS / Navigation (Banner). Guide: eggux build-ui/patterns/marketing-pages.md' } },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma 1440 × 40: New badge, message, link, dismiss 20 from the right.
export const Announcement: Story = {
  render: () => (
    <div className="w-[1440px]">
      <AnnouncementBanner badge="New" message="Approvals and audit log are now in every plan." link={{ label: 'Read the announcement', href: '#news' }} onDismiss={onDismiss} />
    </div>
  ),
  play: async ({ canvas }) => {
    const region = canvas.getByRole('region', { name: 'Announcement' });
    await expect(Math.round(box(region).height)).toBe(40);
    await expect(canvas.getByRole('link', { name: 'Read the announcement' })).toHaveAttribute('href', '#news');
    const close = canvas.getByRole('button', { name: 'Dismiss announcement' });
    await expect(Math.round(box(region).right - box(close).right)).toBe(20);
    await userEvent.click(close);
    await expect(onDismiss).toHaveBeenCalled();
    await expect(canvas.queryByRole('region', { name: 'Announcement' })).toBeNull();
  },
};

// Figma 1440 × 49: soft badge, message with date and time zone, brand link, bottom border.
export const WithAction: Story = {
  name: 'Banner with Action',
  render: () => (
    <div className="w-[1440px]">
      <BannerWithAction label="Webinar" badge="Webinar" message="Close the books in five days: live session on Thu 12 Nov 2026, 15:00 CET." link={{ label: 'Save your seat', href: '#webinar' }} onDismiss={fn()} />
    </div>
  ),
  play: async ({ canvas }) => {
    const region = canvas.getByRole('region', { name: 'Webinar' });
    await expect(Math.round(box(region).height)).toBe(49);
    await expect(canvas.getByRole('link', { name: 'Save your seat' })).toBeInTheDocument();
  },
};

// Figma 1440 × 90: Sale badge, title and terms, four 64 tiles (04 09 27 45), secondary button.
export const CountdownBanner: Story = {
  name: 'Banner Countdown',
  render: () => (
    <div className="w-[1440px]">
      <BannerCountdown
        badge="Sale"
        title="Autumn sale: 30% off every annual plan"
        terms="Ends Fri 31 Oct 2026 at 23:59 CET. Applies to new and upgraded plans."
        now={NOW}
        endsAt={later(4, 9, 27, 45)}
        showSeconds
        action={{ label: 'Claim 30% off', href: '#sale' }}
        onDismiss={fn()}
      />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const region = canvas.getByRole('region', { name: 'Offer' });
    await expect(Math.round(box(region).height)).toBe(90);
    const tiles = canvasElement.querySelectorAll('[data-slot="countdown-tile"]');
    await expect(tiles).toHaveLength(4);
    await expect(Math.round(box(tiles[0]!).width)).toBe(64);
    await expect(tiles[0]).toHaveTextContent('04days');
    await expect(tiles[1]).toHaveTextContent('09hours');
    await expect(tiles[2]).toHaveTextContent('27min');
    await expect(tiles[3]).toHaveTextContent(/4[3-5]sec/);
    // Screen readers get the end time, not the digits.
    await expect(canvasElement.querySelector('[data-slot="countdown"]')).toHaveTextContent('Ends Fri 31 Oct 2026 at 23:59 CET');
    await expect(canvas.getByRole('link', { name: 'Claim 30% off' })).toBeInTheDocument();
  },
};

// Figma 1440 × 142: card 1040 wide with brand Icon Tile, title, line, two buttons and dismiss.
export const Floating: Story = {
  name: 'Banner Floating',
  render: () => (
    <div className="w-[1440px]">
      <BannerFloating
        label="What is new"
        title="Acme Invoices 2.0 is live"
        description="Automatic reminders, approvals and a new reports page. Free on every plan until 31 Dec 2026."
        secondaryAction={{ label: 'See what is new', href: '#new' }}
        action={{ label: 'Try it now', href: '#try' }}
        onDismiss={fn()}
      />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const region = canvas.getByRole('region', { name: 'What is new' });
    await expect(Math.round(box(region).height)).toBe(142);
    await expect(Math.round(box(region.firstElementChild!).width)).toBe(1040);
    await expect(canvasElement.querySelector('[data-slot="icon-tile"]')).not.toBeNull();
    await userEvent.click(canvas.getByRole('button', { name: 'Dismiss announcement' }));
    await expect(canvas.queryByRole('region', { name: 'What is new' })).toBeNull();
  },
};

// Countdown at zero removes the bar and calls onEnd; seconds show on their own in the last hour.
export const CountdownEnds: Story = {
  tags: ['!dev'],
  render: () => {
    const end = new Date(Date.now() + 1500);
    return (
      <div className="flex w-[1440px] flex-col gap-4">
        <BannerCountdown title="Flash sale" endsAt={end} action={{ label: 'Buy', href: '#buy' }} onEnd={onEnded} />
        <Countdown endsAt={later(0, 0, 42, 10)} now={NOW} label="Session expires at 15:14" />
        <Countdown endsAt={later(2, 3, 0, 0)} now={NOW} label="Webinar starts Thu 29 Oct" />
      </div>
    );
  },
  play: async ({ canvas, canvasElement }) => {
    const counters = canvasElement.querySelectorAll('[data-slot="countdown"]');
    await expect(counters[1]!.querySelectorAll('[data-slot="countdown-tile"]')).toHaveLength(4);
    await expect(counters[2]!.querySelectorAll('[data-slot="countdown-tile"]')).toHaveLength(3);
    await waitFor(() => expect(canvas.queryByRole('region', { name: 'Offer' })).toBeNull(), { timeout: 4000 });
    await expect(onEnded).toHaveBeenCalledTimes(1);
  },
};
const onEnded = fn();

// Stress: 390 wide; text wraps, nothing scrolls sideways; floating pinned to the viewport.
export const Narrow: Story = {
  tags: ['!dev'],
  parameters: { a11y: { config: { rules: [{ id: 'landmark-unique', enabled: false }] } } },
  render: () => (
    <div className="flex w-[390px] flex-col gap-4">
      <AnnouncementBanner badge="New" message="Approvals and audit log are now in every plan." link={{ label: 'Read the announcement', href: '#news' }} onDismiss={fn()} />
      <BannerWithAction badge="Webinar" message="Close the books in five days: live session on Thu 12 Nov 2026, 15:00 CET." link={{ label: 'Save your seat', href: '#w' }} onDismiss={fn()} />
      <BannerCountdown title="Autumn sale: 30% off every annual plan" terms="Ends Fri 31 Oct 2026 at 23:59 CET." now={NOW} endsAt={later(4, 9, 27, 45)} action={{ label: 'Claim 30% off', href: '#s' }} onDismiss={fn()} />
      <BannerFloating label="Floating" title="Acme Invoices 2.0 is live" description="Automatic reminders, approvals and a new reports page." action={{ label: 'Try it now', href: '#t' }} onDismiss={fn()} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const s of canvasElement.querySelectorAll('section')) await expect(s.scrollWidth).toBeLessThanOrEqual(390);
  },
};

const All = () => (
  <div className="flex w-[1440px] flex-col gap-6">
    <AnnouncementBanner badge="New" message="Approvals and audit log are now in every plan." link={{ label: 'Read the announcement', href: '#news' }} onDismiss={() => {}} />
    <BannerWithAction label="Webinar" badge="Webinar" message="Close the books in five days: live session on Thu 12 Nov 2026, 15:00 CET." link={{ label: 'Save your seat', href: '#w' }} onDismiss={() => {}} />
    <BannerCountdown badge="Sale" title="Autumn sale: 30% off every annual plan" terms="Ends Fri 31 Oct 2026 at 23:59 CET." now={NOW} endsAt={later(4, 9, 27, 45)} action={{ label: 'Claim 30% off', href: '#s' }} onDismiss={() => {}} />
    <BannerFloating label="What is new" title="Acme Invoices 2.0 is live" description="Automatic reminders, approvals and a new reports page." secondaryAction={{ label: 'See what is new', href: '#n' }} action={{ label: 'Try it now', href: '#t' }} onDismiss={() => {}} />
  </div>
);
export const AllDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, render: () => <All /> };
export const AllCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: () => <All /> };
