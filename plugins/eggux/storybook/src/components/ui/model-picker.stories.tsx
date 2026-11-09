import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { ModelOption, ModelPicker } from './model-picker';

// The menu is portaled to document.body: query it with `screen`.
const meta = {
  title: 'Components/AI Chat/Model Picker',
  component: ModelPicker,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Chooses the model in the Prompt Input Tools slot or a chat header. Opens a menu of Model Options (name, one-line trade-off, optional badge, check on the selected one). Show it only when users really choose. Figma: AI Chat / Model Picker, Model Option. Guide: eggux build-ui/components/ai-chat.md' } },
  },
  args: { onModelChange: fn(), onOpenChange: fn() },
  decorators: [Story => <div className="min-h-80"><Story /></div>],
} satisfies Meta<typeof ModelPicker>;
export default meta;
type Story = StoryObj<typeof meta>;

// Figma State=default: 121 × 32 trigger; picking an option updates the trigger and closes the menu.
export const Default: Story = {
  play: async ({ canvas, args }) => {
    const trigger = canvas.getByRole('button', { name: 'Model: Acme Pro' });
    await expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(Math.round(trigger.getBoundingClientRect().height)).toBe(32);
    await userEvent.click(trigger);
    const menu = await screen.findByRole('menu');
    const options = within(menu).getAllByRole('menuitemradio');
    await expect(options).toHaveLength(3);
    await expect(options[0]).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(within(menu).getByRole('menuitemradio', { name: /Acme Fast/ }));
    await expect(args.onModelChange).toHaveBeenCalledWith('Acme Fast');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    await expect(canvas.getByRole('button', { name: 'Model: Acme Fast' })).toHaveFocus();
  },
};

// Keyboard: Enter opens on the selected option, arrows move, Enter selects; ArrowDown opens too;
// Escape closes and focus returns to the trigger.
export const Keyboard: Story = {
  play: async ({ canvas, args }) => {
    const trigger = canvas.getByRole('button', { name: 'Model: Acme Pro' });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    const menu = await screen.findByRole('menu');
    await waitFor(() => expect(within(menu).getByRole('menuitemradio', { name: /Acme Pro/ })).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    await expect(within(menu).getByRole('menuitemradio', { name: /Acme Private/ })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onModelChange).toHaveBeenCalledWith('Acme Private');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    const updated = canvas.getByRole('button', { name: 'Model: Acme Private' });
    await waitFor(() => expect(updated).toHaveFocus());

    await userEvent.keyboard('{ArrowDown}');
    await screen.findByRole('menu');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    await expect(updated).toHaveFocus();
    await expect(updated).toHaveAttribute('aria-expanded', 'false');
  },
};

// Open menu with Model Option Selected=true (check, aria-checked) and Selected=false; 288 wide rows.
export const Open: Story = {
  args: { defaultOpen: true },
  play: async () => {
    const menu = await screen.findByRole('menu');
    const selected = within(menu).getByRole('menuitemradio', { name: /Acme Pro/ });
    await expect(selected).toHaveAttribute('aria-checked', 'true');
    await expect(selected.querySelector('svg[data-icon="check"]')).not.toBeNull();
    await expect(Math.round(selected.getBoundingClientRect().width)).toBe(288);
    await expect(within(selected).getByText('Best quality')).toBeVisible();
    const other = within(menu).getByRole('menuitemradio', { name: /Acme Fast/ });
    await expect(other).toHaveAttribute('aria-checked', 'false');
  },
};

// Opens above the Prompt Input (Figma "model picker open above the prompt").
export const OpenAbove: Story = {
  args: { defaultOpen: true, side: 'top', model: 'Acme Fast' },
  decorators: [Story => <div className="flex min-h-80 items-end"><Story /></div>],
  play: async ({ canvas }) => {
    const menu = await screen.findByRole('menu');
    const trigger = canvas.getByRole('button', { name: 'Model: Acme Fast' });
    await expect(menu.getBoundingClientRect().bottom).toBeLessThanOrEqual(trigger.getBoundingClientRect().top);
  },
};

// Model Option composed as children; Show badge off on one option, Selected follows the model.
export const CustomOptions: Story = {
  args: {
    defaultOpen: true,
    defaultModel: 'Acme Mini',
    children: (
      <>
        <ModelOption name="Acme Pro" description="Long reports, analysis and code. Slower." />
        <ModelOption name="Acme Mini" description="Short answers in a second. Cheapest." showBadge={false} />
      </>
    ),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Model: Acme Mini' })).toBeVisible();
    const menu = await screen.findByRole('menu');
    await expect(within(menu).getByRole('menuitemradio', { name: /Acme Mini/ })).toHaveAttribute('aria-checked', 'true');
    await expect(within(menu).getAllByText('Best quality')).toHaveLength(1);
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Model: Acme Pro' })).toBeDisabled();
  },
};

// Stress test: a long model name and description in a 276 px column. The trigger truncates in
// one line, the option name truncates, the description wraps inside the 288 px menu.
export const LongText: Story = { tags: ['!dev'],
  args: {
    defaultOpen: true,
    defaultModel: 'Acme Reasoning Large with extended context',
    options: [
      { name: 'Acme Reasoning Large with extended context', description: 'Best for multi-step analysis across many documents. Slower and uses more credits.', badge: 'Best quality' },
      { name: 'Acme Fast', description: 'Quick answers and short drafts.' },
    ],
  },
  decorators: [Story => <div className="min-h-80 w-[276px]"><Story /></div>],
  play: async ({ canvas, canvasElement }) => {
    const trigger = canvas.getByRole('button', { name: /^Model: Acme Reasoning Large/ });
    await expect(Math.round(trigger.getBoundingClientRect().height)).toBe(32);
    await expect(trigger.getBoundingClientRect().width).toBeLessThanOrEqual(276);
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
    const menu = await screen.findByRole('menu');
    const option = within(menu).getByRole('menuitemradio', { name: /Acme Reasoning Large/ });
    await expect(Math.round(option.getBoundingClientRect().width)).toBe(288);
    await expect(option.scrollWidth).toBeLessThanOrEqual(option.clientWidth);
  },
};

export const OpenDark: Story = { ...Open, tags: ['!dev'], globals: { theme: 'Dark' } };
export const OpenCorporate: Story = { ...Open, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
