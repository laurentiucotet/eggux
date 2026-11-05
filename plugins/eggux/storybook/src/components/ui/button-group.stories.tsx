import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test';
import { Archive, ChevronLeft, ChevronRight, Copy, Minus, Pencil, Plus } from '@/components/icons';
import { ButtonGroup, ButtonGroupItem } from './button-group';
import { TooltipProvider } from './tooltip';

const meta = {
  title: 'Components/Button/Button Group',
  component: ButtonGroup,
  parameters: {
    docs: { description: { component: 'Related actions of equal weight joined in one control: Edit / Duplicate / Archive, previous / next, zoom − / +. 2–5 items, a labelled group, each item its own tab stop. Never to set a value (use Toggle Group); one main action with variants is a Split Button. Hugs its items (at least 80 each), labels truncate. Figma: Button page / Button Group, Button Group Item. Guide: eggux build-ui/components/button.md' } },
  },
  decorators: [Story => <TooltipProvider delayDuration={0}><Story /></TooltipProvider>],
  args: { 'aria-label': 'Invoice actions' },
} satisfies Meta<typeof ButtonGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

const probe = (cls: string) => { const p = document.createElement('span'); p.className = cls; document.body.append(p); return { style: getComputedStyle(p), remove: () => p.remove() }; };
const box = (el: Element) => { const r = el.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; };
const actions = { edit: fn(), duplicate: fn(), archive: fn() };

// Figma Button Group default content: Edit / Duplicate / Archive.
export const Default: Story = {
  render: args => (
    <ButtonGroup {...args}>
      <ButtonGroupItem label="Edit" onClick={actions.edit} />
      <ButtonGroupItem label="Duplicate" onClick={actions.duplicate} />
      <ButtonGroupItem label="Archive" onClick={actions.archive} />
    </ButtonGroup>
  ),
  play: async ({ canvas }) => {
    const group = canvas.getByRole('group', { name: 'Invoice actions' });
    const [edit, duplicate, archive] = canvas.getAllByRole('button');
    await userEvent.click(duplicate);
    await expect(actions.duplicate).toHaveBeenCalledTimes(1);
    // Figma Button Group Item: 36 high, at least 80 wide, 12 px sides, background fill, input border.
    for (const item of [edit, duplicate, archive]) {
      await expect(box(item)[1]).toBe(36);
      await expect(box(item)[0]).toBeGreaterThanOrEqual(80);
      await expect(getComputedStyle(item).paddingLeft).toBe('12px');
    }
    const ref = probe('bg-background text-foreground border border-input');
    await expect(getComputedStyle(edit).backgroundColor).toBe(ref.style.backgroundColor);
    await expect(getComputedStyle(edit).color).toBe(ref.style.color);
    await expect(getComputedStyle(edit).borderTopColor).toBe(ref.style.borderTopColor);
    ref.remove();
    // Position: first has all borders and the left pill end; middle and last drop the left border
    // (the previous item's right border is the divider); last has the right pill end.
    await expect([edit, duplicate, archive].map(b => getComputedStyle(b).borderLeftWidth)).toEqual(['1px', '0px', '0px']);
    await expect(parseFloat(getComputedStyle(edit).borderTopLeftRadius)).toBeGreaterThan(0);
    await expect(getComputedStyle(duplicate).borderTopLeftRadius).toBe('0px');
    await expect(getComputedStyle(duplicate).borderTopRightRadius).toBe('0px');
    await expect(parseFloat(getComputedStyle(archive).borderTopRightRadius)).toBeGreaterThan(0);
    // The group hugs its items with no gaps.
    await expect(Math.abs(box(group)[0] - [edit, duplicate, archive].reduce((w, b) => w + box(b)[0], 0))).toBeLessThanOrEqual(1);
  },
};

// Keyboard: each item is its own tab stop with the focus ring; Enter and Space activate.
export const Keyboard: Story = {
  render: Default.render,
  play: async ({ canvas }) => {
    const [edit, duplicate] = canvas.getAllByRole('button');
    await userEvent.tab();
    await expect(edit).toHaveFocus();
    await waitFor(() => expect(getComputedStyle(edit).boxShadow).toContain('0px 0px 0px 4px'));
    await userEvent.keyboard('{Enter}');
    await expect(actions.edit).toHaveBeenCalled();
    await userEvent.tab();
    await expect(duplicate).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(actions.duplicate).toHaveBeenCalled();
  },
};

// Show icon on, and icon-only items (Show label off): aria-label and a tooltip with the same text.
export const WithIcons: Story = {
  render: args => (
    <div className="flex flex-col items-start gap-4">
      <ButtonGroup {...args}>
        <ButtonGroupItem label="Edit" icon={<Pencil aria-hidden="true" />} />
        <ButtonGroupItem label="Duplicate" icon={<Copy aria-hidden="true" />} />
        <ButtonGroupItem label="Archive" icon={<Archive aria-hidden="true" />} />
      </ButtonGroup>
      <ButtonGroup aria-label="Pages">
        <ButtonGroupItem label="Previous page" showLabel={false} icon={<ChevronLeft aria-hidden="true" />} />
        <ButtonGroupItem label="Next page" showLabel={false} icon={<ChevronRight aria-hidden="true" />} />
      </ButtonGroup>
      <ButtonGroup aria-label="Zoom">
        <ButtonGroupItem label="Zoom out" showLabel={false} icon={<Minus aria-hidden="true" />} />
        <ButtonGroupItem label="Zoom in" showLabel={false} icon={<Plus aria-hidden="true" />} />
      </ButtonGroup>
    </div>
  ),
  play: async ({ canvas }) => {
    const next = canvas.getByRole('button', { name: 'Next page' });
    await expect(box(next.querySelector('svg')!)).toEqual([16, 16]);
    await userEvent.hover(next);
    await expect(await screen.findByRole('tooltip')).toHaveTextContent('Next page');
    await userEvent.unhover(next);
  },
};

// Pressed item (the description's "active"): accent fill and aria-pressed.
export const Active: Story = {
  render: args => (
    <ButtonGroup {...args} aria-label="Invoice view">
      <ButtonGroupItem label="Details" active />
      <ButtonGroupItem label="Activity" active={false} />
    </ButtonGroup>
  ),
  play: async ({ canvas }) => {
    const [details, activity] = canvas.getAllByRole('button');
    await expect(details).toHaveAttribute('aria-pressed', 'true');
    await expect(activity).toHaveAttribute('aria-pressed', 'false');
    const ref = probe('bg-accent');
    await expect(getComputedStyle(details).backgroundColor).toBe(ref.style.backgroundColor);
    ref.remove();
  },
};

// Figma State=disabled: 50 % opacity, no click.
export const Disabled: Story = {
  render: args => (
    <ButtonGroup {...args}>
      <ButtonGroupItem label="Edit" />
      <ButtonGroupItem label="Duplicate" disabled onClick={actions.duplicate} />
      <ButtonGroupItem label="Archive" />
    </ButtonGroup>
  ),
  play: async ({ canvas }) => {
    actions.duplicate.mockClear();
    const duplicate = canvas.getByRole('button', { name: 'Duplicate' });
    await expect(duplicate).toBeDisabled();
    await expect(getComputedStyle(duplicate).opacity).toBe('0.5');
    await userEvent.click(duplicate, { pointerEventsCheck: 0 });
    await expect(actions.duplicate).not.toHaveBeenCalled();
  },
};

// Figma Position on a single item, outside a group.
export const Positions: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <ButtonGroupItem label="First" position="first" />
      <ButtonGroupItem label="Middle" position="middle" />
      <ButtonGroupItem label="Last" position="last" />
    </div>
  ),
  play: async ({ canvas }) => {
    const [first, middle, last] = canvas.getAllByRole('button');
    await expect(getComputedStyle(first).borderLeftWidth).toBe('1px');
    await expect(getComputedStyle(middle).borderLeftWidth).toBe('0px');
    await expect(getComputedStyle(last).borderLeftWidth).toBe('0px');
    await expect(parseFloat(getComputedStyle(last).borderBottomRightRadius)).toBeGreaterThan(0);
  },
};

// Stress test (Figma "Stress test / Button Group"): long labels truncate to one line (at most 160
// per item); in a column narrower than the group, the group keeps its size (never shrinks).
export const LongLabels: Story = {
  render: args => (
    <div className="w-[276px] overflow-x-auto rounded-md border border-dashed p-3">
      <ButtonGroup {...args}>
        <ButtonGroupItem label="Edit the billing contact" />
        <ButtonGroupItem label="Duplicate as a new draft invoice" />
        <ButtonGroupItem label="Archive" />
      </ButtonGroup>
    </div>
  ),
  play: async ({ canvas }) => {
    const items = canvas.getAllByRole('button');
    for (const item of items) await expect(box(item)[1]).toBe(36);
    await expect(box(items[1])[0]).toBe(160);
    const label = items[1].querySelector('span')!;
    await expect(label.scrollWidth).toBeGreaterThan(label.clientWidth);
    // The full label stays the accessible name.
    await expect(canvas.getByRole('button', { name: 'Duplicate as a new draft invoice' })).toBe(items[1]);
  },
};

export const DefaultDark: Story = { ...Default, play: undefined, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Default, play: undefined, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
