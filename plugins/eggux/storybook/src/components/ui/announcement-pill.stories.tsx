import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { AnnouncementPill } from './announcement-pill';

const meta = {
  title: 'Components/Badge/Announcement Pill',
  component: AnnouncementPill,
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'A short link above a hero title to the newest launch: "New" tag, one line, arrow. Links to the announcement or changelog. One at a time; remove it after a few weeks. Product notices inside the app use Alert. Figma: Badge page / Announcement Pill. Guide: eggux build-ui/components/badge.md' } },
  },
  args: { label: 'Automations for every team', href: '#changelog' },
} satisfies Meta<typeof AnnouncementPill>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma default: 26 high, pill, primary "New" tag, label and a 14 arrow; one link.
export const Default: Story = {
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'New Automations for every team' });
    await expect(Math.round(box(link).height)).toBe(26);
    await expect(getComputedStyle(link).paddingLeft).toBe('4px');
    const arrow = link.querySelector('svg')!;
    await expect(Math.round(box(arrow).width)).toBe(14);
  },
};

// Show tag off: the label alone with 12 px sides.
export const WithoutTag: Story = {
  args: { tag: null, label: 'Read the 2026 report' },
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Read the 2026 report' });
    await expect(getComputedStyle(link).paddingLeft).toBe('12px');
  },
};

// Stress: a long label truncates on one line at 300. Tests only.
export const Stress: Story = {
  tags: ['!dev'],
  args: { label: 'Automations, approvals and audit logs for every team in every region' },
  render: args => <div className="w-[300px]"><AnnouncementPill {...args} /></div>,
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link');
    await expect(Math.round(box(link).height)).toBe(26);
    const label = link.querySelector<HTMLElement>('[title]')!;
    await expect(label.scrollWidth).toBeGreaterThan(label.clientWidth);
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
