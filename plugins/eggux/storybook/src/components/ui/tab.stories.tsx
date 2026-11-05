import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { Tabs, TabsContent, TabsList, TabsTrigger, type TabsVariant } from './tabs';

// Tab states (default, active, focus, disabled) per Variant. The Tab trigger lives in tabs.tsx.
const meta = {
  title: 'Components/Tabs/Tab',
  component: TabsTrigger,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Tab trigger, put inside TabsList with the Variant of its Tabs. States: default, active (aria-selected), focus (ring) and disabled (50 percent, not focusable). Show count adds a Badge Count, Show icon a 16 px icon. Figma: Tabs page / Tab. Guide: eggux build-ui/components/tabs.md' } },
  },
} satisfies Meta<typeof TabsTrigger>;
export default meta;
type Story = StoryObj<typeof meta>;

const variants: TabsVariant[] = ['default', 'line', 'pills', 'boxed'];
const probe = (cls: string, prop: 'color' | 'backgroundColor') => {
  const el = document.createElement('div');
  el.className = cls;
  (document.getElementById('storybook-root') ?? document.body).appendChild(el);
  const v = getComputedStyle(el)[prop];
  el.remove();
  return v;
};

const States = () => (
  <div className="flex flex-col gap-6">
    {variants.map(v => (
      <Tabs key={v} variant={v} defaultValue="active" data-case={v}>
        <TabsList aria-label={`${v} states`}>
          <TabsTrigger value="active">Overview</TabsTrigger>
          <TabsTrigger value="idle">Projects</TabsTrigger>
          <TabsTrigger value="off" disabled>Invoices</TabsTrigger>
        </TabsList>
        <TabsContent value="active">Overview panel.</TabsContent>
        <TabsContent value="idle">Projects panel.</TabsContent>
        <TabsContent value="off">Invoices panel.</TabsContent>
      </Tabs>
    ))}
  </div>
);

export const Default: Story = {
  args: { value: 'x', children: 'Overview' },
  render: () => <States />,
  play: async ({ canvasElement }) => {
    for (const v of variants) {
      const scope = canvasElement.querySelector(`[data-case="${v}"]`) as HTMLElement;
      const [active, idle, off] = Array.from(scope.querySelectorAll<HTMLElement>('[role="tab"]'));
      await expect(active).toHaveAttribute('aria-selected', 'true');
      await expect(active).toHaveAttribute('data-state', 'active');
      await expect(idle).toHaveAttribute('aria-selected', 'false');
      // Disabled: 50 percent opacity, not focusable, ignores clicks.
      await expect(off).toBeDisabled();
      await expect(getComputedStyle(off).opacity).toBe('0.5');
      await expect(getComputedStyle(off).pointerEvents).toBe('none');
      await expect(off).toHaveAttribute('aria-selected', 'false');
      if (v === 'pills') {
        await waitFor(() => expect(getComputedStyle(active).backgroundColor).toBe(probe('bg-primary', 'backgroundColor')));
        await waitFor(() => expect(getComputedStyle(active).color).toBe(probe('text-primary-foreground', 'color')));
      }
      if (v === 'boxed') await expect(getComputedStyle(idle).color).toBe(probe('text-muted-foreground', 'color'));
    }
  },
};

// Focus state: a 2 px background gap and a 4 px ring, only for keyboard focus.
export const Focus: Story = {
  args: { value: 'x', children: 'Overview' },
  render: () => <States />,
  play: async ({ canvasElement }) => {
    for (const v of variants) {
      const scope = canvasElement.querySelector(`[data-case="${v}"]`) as HTMLElement;
      const active = scope.querySelector<HTMLElement>('[role="tab"][data-state="active"]')!;
      await userEvent.click(document.body);
      active.focus();
      await userEvent.keyboard('{ArrowRight}');
      const next = scope.querySelectorAll<HTMLElement>('[role="tab"]')[1];
      await expect(next).toHaveFocus();
      await waitFor(() => expect(getComputedStyle(next).boxShadow).toContain('4px'));
    }
  },
};

