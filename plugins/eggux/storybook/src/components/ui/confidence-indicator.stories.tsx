import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor } from 'storybook/test';
import { ConfidenceIndicator } from './confidence-indicator';

const meta = {
  title: 'AI Chat/Confidence Indicator',
  component: ConfidenceIndicator,
  parameters: {
    docs: { description: { component: 'How sure the AI is about an extracted value, match or answer: high, medium, low in bars and words, never raw percentages. The info button opens a Tooltip with why; low asks people to check and never auto-applies. Figma: AI Chat / Confidence Indicator. Guide: eggux build-ui/patterns/ai-chat.md' } },
  },
} satisfies Meta<typeof ConfidenceIndicator>;
export default meta;
type Story = StoryObj<typeof meta>;

const bars = (el: HTMLElement) => Array.from(el.querySelectorAll('[data-slot="confidence-bar"]')) as HTMLElement[];

// Figma Level=high (16 px tall): meter with the level in words; focus on info opens the Tooltip.
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const meter = canvas.getByRole('meter', { name: 'Confidence' });
    await expect(meter).toHaveAttribute('aria-valuenow', '3');
    await expect(meter).toHaveAttribute('aria-valuetext', 'High confidence');
    await expect(Math.round((canvasElement.querySelector('[data-slot="confidence-indicator"]') as HTMLElement).getBoundingClientRect().height)).toBe(16);
    // Bars 4 wide, 6 / 9 / 12 tall.
    await expect(bars(canvasElement).map(b => Math.round(b.getBoundingClientRect().height))).toEqual([6, 9, 12]);
    await expect(Math.round(bars(canvasElement)[0].getBoundingClientRect().width)).toBe(4);
    // Keyboard: Tab reaches the info button, the Tooltip opens on focus, Escape closes it.
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Why high confidence' })).toHaveFocus();
    await waitFor(() => expect(screen.getByRole('tooltip')).toHaveTextContent('Found in the source document.'));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  },
};

// Figma Level=high, medium, low: filled bars match the level.
export const Levels: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <ConfidenceIndicator level="high" />
      <ConfidenceIndicator level="medium" />
      <ConfidenceIndicator level="low" />
    </div>
  ),
  play: async ({ canvas }) => {
    const meters = canvas.getAllByRole('meter');
    await expect(meters.map(m => m.getAttribute('aria-valuetext'))).toEqual(['High confidence', 'Medium confidence', 'Low confidence · check this']);
    await expect(meters.map(m => m.getAttribute('aria-valuenow'))).toEqual(['3', '2', '1']);
    await expect(canvas.getByRole('button', { name: 'Why low confidence' })).toBeVisible();
  },
};

export const Medium: Story = {
  args: { level: 'medium' },
  play: async ({ canvasElement }) => {
    const [, second, third] = bars(canvasElement);
    await expect(second.className).toContain('bg-warning');
    await expect(third.className).toContain('bg-border');
  },
};

export const Low: Story = {
  args: { level: 'low', reason: 'A guess: the invoice total was not found on the scanned page.' },
  play: async ({ canvas }) => {
    await userEvent.hover(canvas.getByRole('button', { name: 'Why low confidence' }));
    await waitFor(() => expect(screen.getByRole('tooltip')).toHaveTextContent('the invoice total was not found'));
  },
};

// Figma Show info off: no button, nothing to tab to.
export const WithoutInfo: Story = {
  args: { showInfo: false },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
    await expect(canvas.getByRole('meter')).toHaveAccessibleName('Confidence');
  },
};

// Next to the value it describes, in a 276 px column: the words truncate, the info button stays.
export const NextToValue: Story = {
  args: { level: 'low' },
  decorators: [Story => (
    <div className="flex w-[276px] flex-col gap-1">
      <span className="text-sm text-foreground">Invoice total: €4,820.00</span>
      <Story />
    </div>
  )],
};

export const Narrow: Story = { tags: ['!dev'],
  args: { level: 'low', label: 'Low confidence · check this value against the scanned invoice' },
  decorators: [Story => <div className="w-[200px]"><Story /></div>],
  play: async ({ canvas, canvasElement }) => {
    const root = canvasElement.querySelector('[data-slot="confidence-indicator"]') as HTMLElement;
    await expect(root.getBoundingClientRect().width).toBeLessThanOrEqual(200);
    await expect(canvas.getByRole('button', { name: 'Why low confidence' })).toBeVisible();
  },
};

export const LevelsDark: Story = { ...Levels, tags: ['!dev'], globals: { theme: 'Dark' } };
export const LevelsCorporate: Story = { ...Levels, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
