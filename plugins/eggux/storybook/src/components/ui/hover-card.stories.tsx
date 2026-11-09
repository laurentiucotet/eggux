import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { Avatar } from './avatar';
import { HoverCard, HoverCardContent, HoverCardPerson, HoverCardTrigger } from './hover-card';

const meta = {
  title: 'Components/Popover/Hover Card',
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Read-only preview of a person, record or link, opened after ~500 ms on hover or keyboard focus of a real link; never on touch (a tap goes to the page). Anything in the card must also be on the target page. Figma: Popover page / Hover Card. Guide: eggux build-ui/components/popover.md' } },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => { const r = el.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; };

function PersonLink({ open }: { open?: boolean }) {
  return (
    <p className="text-sm text-foreground">
      Assigned to{' '}
      <HoverCard defaultOpen={open}>
        <HoverCardTrigger asChild>
          <a href="#people/maria" className="font-medium text-brand underline-offset-4 hover:underline focus-visible:underline outline-none focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)] rounded-sm">Maria Ilie</a>
        </HoverCardTrigger>
        <HoverCardContent>
          <HoverCardPerson
            avatar={<Avatar size="lg" initials="MI" />}
            name="Maria Ilie"
            handle="@maria · Product designer"
            detail="Leads the design system and the onboarding squad."
            meta="Joined March 2024"
          />
        </HoverCardContent>
      </HoverCard>
    </p>
  );
}

const card = () => document.querySelector<HTMLElement>('[data-slot="hover-card-content"]');

// Hover opens after the delay, not at once; leaving closes it.
type Playground = {
  open: boolean;
  side: 'top' | 'right' | 'bottom' | 'left';
  align: 'start' | 'center' | 'end';
  name: string;
  showAvatar: boolean;
  showHandle: boolean;
  showDetail: boolean;
  showMeta: boolean;
};

/** Playground: every Hover Card option in Controls. Hover or focus the link to open it. */
export const Default: StoryObj<Playground> = {
  argTypes: {
    open: { name: 'Open', control: 'boolean', description: 'Open on load (otherwise hover or focus the link)', table: { category: 'Hover Card' } },
    side: { name: 'Side', control: 'inline-radio', options: ['top', 'right', 'bottom', 'left'], table: { category: 'Hover Card' } },
    align: { name: 'Align', control: 'inline-radio', options: ['start', 'center', 'end'], table: { category: 'Hover Card' } },
    name: { name: 'Name', control: 'text', table: { category: 'Hover Card Person' } },
    showAvatar: { name: 'Show avatar', control: 'boolean', table: { category: 'Hover Card Person' } },
    showHandle: { name: 'Show handle', control: 'boolean', description: 'A second line: handle and role', table: { category: 'Hover Card Person' } },
    showDetail: { name: 'Show detail', control: 'boolean', description: 'A short bio', table: { category: 'Hover Card Person' } },
    showMeta: { name: 'Show meta', control: 'boolean', description: 'A line with an icon ("Joined March 2024")', table: { category: 'Hover Card Person' } },
  },
  args: { open: false, side: 'bottom', align: 'center', name: 'Maria Ilie', showAvatar: true, showHandle: true, showDetail: true, showMeta: true },
  render: a => (
    <p className="text-sm text-foreground">
      Assigned to{' '}
      <HoverCard key={String(a.open)} defaultOpen={a.open}>
        <HoverCardTrigger asChild>
          <a href="#people/maria" className="font-medium text-brand underline-offset-4 hover:underline focus-visible:underline outline-none focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)] rounded-sm">{a.name}</a>
        </HoverCardTrigger>
        <HoverCardContent side={a.side} align={a.align}>
          <HoverCardPerson
            avatar={a.showAvatar ? <Avatar size="lg" initials={a.name.split(' ').map(p => p[0]).join('').slice(0, 2)} /> : undefined}
            name={a.name}
            handle={a.showHandle ? '@maria · Product designer' : undefined}
            detail={a.showDetail ? 'Leads the design system and the onboarding squad.' : undefined}
            meta={a.showMeta ? 'Joined March 2024' : undefined}
          />
        </HoverCardContent>
      </HoverCard>
    </p>
  ),
};

// The checks that used to run on Default (hidden; the playground has no play function).
export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <PersonLink />,
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Maria Ilie' });
    await userEvent.hover(link);
    await new Promise(r => setTimeout(r, 200));
    await expect(card()).toBeNull();
    await waitFor(() => expect(card()).not.toBeNull(), { timeout: 2000 });
    // Figma: 320 x 142, 4 px below the link.
    await expect(box(card()!)).toEqual([320, 142]);
    await expect(Math.round(card()!.getBoundingClientRect().top - link.getBoundingClientRect().bottom)).toBe(4);
    await expect(within(card()!).getByText('Joined March 2024')).toBeVisible();
    await expect(box(card()!.querySelector('[data-slot="hover-card-meta"] svg')!)).toEqual([14, 14]);
    await userEvent.unhover(link);
    await waitFor(() => expect(card()).toBeNull(), { timeout: 2000 });
  },
};

// Keyboard focus on the link opens it too; Escape closes it; the link stays a real link.
export const KeyboardFocus: Story = {
  parameters: { controls: { disable: true } },
  render: () => <PersonLink />,
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Maria Ilie' });
    await expect(link).toHaveAttribute('href', '#people/maria');
    await userEvent.tab();
    await expect(link).toHaveFocus();
    await waitFor(() => expect(card()).not.toBeNull(), { timeout: 2000 });
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(card()).toBeNull(), { timeout: 2000 });
    await expect(link).toHaveFocus();
  },
};

export const Open: Story = {
  parameters: { controls: { disable: true } },
  render: () => <PersonLink open />,
  play: async () => {
    await waitFor(() => expect(card()).not.toBeNull());
    await expect(screen.getByText('@maria · Product designer')).toBeVisible();
  },
};

// Long name, handle and bio: one line for name and handle, three for the detail, no overflow.
export const Stress: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => (
    <HoverCard open>
      <HoverCardTrigger asChild><a href="#people/alexandra">Alexandra</a></HoverCardTrigger>
      <HoverCardContent>
        <HoverCardPerson
          avatar={<Avatar size="lg" initials="AC" />}
          name="Alexandra Constantinescu-Vasilescu de la Acme Holdings"
          handle="@alexandra.constantinescu · Senior product designer, Payments platform"
          detail="Leads the design system, the onboarding squad and the accessibility guild, and reviews every change to the invoice flows before release across all regions."
          meta="Joined March 2024 in the Bucharest office of Acme Holdings"
        />
      </HoverCardContent>
    </HoverCard>
  ),
  play: async () => {
    await waitFor(() => expect(card()).not.toBeNull());
    const el = card()!;
    await expect(box(el)[0]).toBe(320);
    await expect(el.scrollWidth).toBeLessThanOrEqual(el.clientWidth);
    const lines = Array.from(el.querySelectorAll<HTMLElement>('[data-slot="hover-card-person"] p'));
    await expect(box(lines[0])[1]).toBe(20);
    await expect(box(lines[1])[1]).toBe(16);
    await expect(box(lines[2])[1]).toBe(60);
  },
};

export const OpenDark: Story = { ...Open, tags: ['!dev'], globals: { theme: 'Dark' } };
export const OpenCorporate: Story = { ...Open, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
