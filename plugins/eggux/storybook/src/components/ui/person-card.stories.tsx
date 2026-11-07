import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Button } from './button';
import { PersonCard } from './person-card';

const portrait = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500"><rect width="400" height="500" fill="#9ec5d8"/><circle cx="200" cy="200" r="90" fill="#e2b49a"/><rect x="90" y="320" width="220" height="180" rx="90" fill="#475569"/></svg>');

const meta = {
  title: 'Components/Card/Person Card',
  component: PersonCard,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'One person: author, expert, speaker, contact or team member. vertical (avatar, name, role, organization, tags, contact) in grids of 3-4; horizontal in asides and lists; photo (a 4:5 portrait with the name below, no card surface) for team and speaker pages. Same Layout and photo crop across a grid; on photo cards keep tags and contact off unless the page is a directory. Figma: Card page / Person Card. Guide: eggux build-ui/components/card.md' } },
  },
  args: {
    name: 'Maria Ilie',
    role: 'Head of Finance Operations',
    organization: 'Acme',
    initials: 'MI',
    tags: ['Collections', 'Cash flow'],
    email: 'm.ilie@acme.com',
    phone: '+49 30 1234 5678',
  },
  render: args => <div className="w-[280px]"><PersonCard {...args} /></div>,
} satisfies Meta<typeof PersonCard>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma Layout=vertical: 280 × 266 (code 264), 48 avatar, h3 name, tags list, mail and phone links.
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const card = canvasElement.querySelector('[data-slot="person-card"]')!;
    // Figma 266; code 264 (2 px not traced, see COMPONENTS.md).
    await expect(Math.round(box(card).height)).toBe(264);
    await expect(Math.round(box(card.querySelector('[data-slot="avatar"]')!).width)).toBe(48);
    await expect(canvas.getByRole('heading', { level: 3, name: 'Maria Ilie' })).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: 'm.ilie@acme.com' })).toHaveAttribute('href', 'mailto:m.ilie@acme.com');
    await expect(canvas.getByRole('link', { name: '+49 30 1234 5678' })).toHaveAttribute('href', 'tel:+493012345678');
    await expect(canvas.getByRole('list', { name: 'Expertise' })).toBeInTheDocument();
  },
};

// Figma Layout=horizontal (400, 40 avatar beside the text) and photo (4:5 portrait, no surface) with an action.
export const Layouts: Story = {
  render: args => (
    <div className="flex items-start gap-8">
      <div className="w-[400px]"><PersonCard {...args} layout="horizontal" /></div>
      <div className="w-[280px]"><PersonCard {...args} layout="photo" photo={portrait} tags={undefined} email={undefined} phone={undefined} actions={<Button variant="outline" size="sm">View profile</Button>} /></div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [horizontal, photo] = canvasElement.querySelectorAll('[data-slot="person-card"]');
    await expect(Math.round(box(horizontal!.querySelector('[data-slot="avatar"]')!).width)).toBe(40);
    await expect(Math.round(box(photo!.querySelector('[data-slot="image-placeholder"]')!).height)).toBe(350);
    await expect(getComputedStyle(photo!).borderTopWidth).toBe('0px');
  },
};

// Stress: a long name and role wrap at 240; a long email truncates. Tests only.
export const Stress: Story = {
  tags: ['!dev'],
  args: { name: 'Alexandra-Maria Constantinescu-Ionescu', role: 'Regional Director of Finance Operations, Central and Eastern Europe', email: 'alexandra.constantinescu-ionescu@acme-enterprise.com' },
  render: args => <div className="w-[240px]"><PersonCard {...args} /></div>,
  play: async ({ canvas, canvasElement }) => {
    const card = canvasElement.querySelector('[data-slot="person-card"]')!;
    await expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth + 1);
    await expect(box(canvas.getByRole('heading')).height).toBeGreaterThan(28);
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
