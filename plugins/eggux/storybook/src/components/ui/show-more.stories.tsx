import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { ShowMore } from './show-more';

const NOTE = 'Northwind Traders has bought from Acme since 2019 and pays on average 6 days after the due date. Their finance team prefers invoices by email in German, with the purchase order number in the subject. Approvals above €10,000 go to Laura Becker; smaller ones to the accounts payable inbox. In 2026 they moved to quarterly contracts with volume pricing from 50 seats.';

const meta = {
  title: 'Components/Accordion/Show More',
  component: ShowMore,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'One long text cut to 3 lines with Show more / Show less. Only when the full text is rarely needed; key information stays above the cut. Several sections: Accordion. Figma: Accordion page / Show More. Guide: eggux build-ui/components/accordion.md' } },
  },
  args: { children: NOTE },
  decorators: [Story => <div className="w-[560px] max-w-full"><Story /></div>],
} satisfies Meta<typeof ShowMore>;
export default meta;
type Story = StoryObj<typeof meta>;

const root = (el: HTMLElement) => el.querySelector('[data-slot="show-more"]') as HTMLElement;

// Figma State=collapsed: 3 lines (84) + toggle 32 = 124; expanded shows the whole text.
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const toggle = canvas.getByRole('button', { name: 'Show more' });
    await expect(Math.round(root(canvasElement).getBoundingClientRect().height)).toBe(124);
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    // The full text is in the DOM even when cut, so screen readers reach it.
    await expect(canvas.getByText(/volume pricing from 50 seats/)).toBeInTheDocument();
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(toggle).toHaveAccessibleName('Show less');
    await expect(toggle).toHaveFocus();
    await expect(root(canvasElement).getBoundingClientRect().height).toBeGreaterThan(124);
  },
};

export const Expanded: Story = {
  args: { defaultExpanded: true },
  play: async ({ canvas }) => {
    const toggle = canvas.getByRole('button', { name: 'Show less' });
    await expect(toggle).toHaveAttribute('aria-controls', canvas.getByText(/Northwind/).id);
    await userEvent.keyboard('{Tab}');
    await expect(toggle).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(toggle).toHaveAccessibleName('Show more');
  },
};

// Text of 3 lines or less: no toggle.
export const ShortText: Story = { tags: ['!dev'],
  args: { children: 'Pays on time. Prefers invoices by email.' },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
  },
};

// Stress test (Figma "Stress test / Show More"): a 276 column still cuts at 3 lines.
export const Narrow: Story = { tags: ['!dev'],
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  play: async ({ canvas }) => {
    const text = canvas.getByText(/Northwind/);
    await expect(Math.round(text.getBoundingClientRect().height)).toBe(84);
    await expect(canvas.getByRole('button', { name: 'Show more' })).toBeVisible();
  },
};

export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
