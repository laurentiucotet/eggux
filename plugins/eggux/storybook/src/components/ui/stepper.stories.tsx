import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { Stepper, type StepData } from './stepper';

const steps: StepData[] = [
  { id: 'customer', title: 'Customer', description: 'Name and contact' },
  { id: 'details', title: 'Details', description: 'Plan, seats, billing' },
  { id: 'confirm', title: 'Confirm', description: 'Review and send' },
];
const four: StepData[] = [
  { id: 'account', title: 'Account', description: 'Name and contact' },
  { id: 'company', title: 'Company details', description: 'Plan, seats, billing' },
  { id: 'team', title: 'Team', description: 'Invite people' },
  { id: 'done', title: 'Confirm', description: 'Review and send' },
];

const meta = {
  title: 'Components/Stepper/Stepper',
  component: Stepper,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Progress through a multi-step form or wizard of 3-6 steps, above the form (horizontal) or in a side column (vertical). Completed steps show a check and can be clicked to go back; upcoming steps cannot; an invalid step that was left shows error. Dots: compact progress for onboarding and mobile flows, always with "Step 2 of 4" and the title next to it. Figma: Stepper page / Stepper, Step. Guide: eggux build-ui/components/stepper.md, build-ui/patterns/multi-step-form.md' } },
  },
  args: { steps, current: 1 },
  render: function Render(args) {
    const [current, setCurrent] = React.useState(args.current);
    return (
      <div className="w-[960px]">
        <Stepper {...args} current={current} onStepClick={setCurrent} />
        <p className="mt-6 text-sm">Showing: {steps[current]!.title}</p>
      </div>
    );
  },
} satisfies Meta<typeof Stepper>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma: 960 × 36, the last step hugs (139), aria-current on Details, completed step goes back.
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const list = canvas.getByRole('list', { name: 'Progress' });
    await expect(Math.round(box(list).height)).toBe(36);
    const items = canvasElement.querySelectorAll('[data-slot="step"]');
    // Figma 139; the caption renders a few px narrower in code (as in Pagination).
    await expect(Math.abs(Math.round(box(items[2]!).width) - 139)).toBeLessThanOrEqual(8);
    await expect(items[1]).toHaveAttribute('aria-current', 'step');
    await expect(canvas.queryByRole('button', { name: /Confirm/ })).toBeNull();
    await userEvent.click(canvas.getByRole('button', { name: /Customer.*Completed/ }));
    await expect(canvas.getByText('Showing: Customer')).toBeInTheDocument();
    await expect(canvasElement.querySelectorAll('[data-slot="step"]')[0]).toHaveAttribute('aria-current', 'step');
  },
};

// Vertical default (66 rows), vertical dots (52 rows), horizontal dots with "Step 2 of 4", error.
export const Styles: Story = {
  render: () => (
    <div className="flex flex-col gap-10">
      <div className="flex items-center gap-4">
        <Stepper steps={four} current={1} variant="dots" />
        <span className="text-xs leading-4 text-muted-foreground">Step 2 of 4</span>
        <span className="text-sm leading-5 font-medium">Company details</span>
      </div>
      <div className="flex items-start gap-12">
        <div className="w-[320px]"><Stepper steps={steps} current={1} orientation="vertical" aria-label="Setup" /></div>
        <div className="w-[320px]"><Stepper steps={four} current={1} orientation="vertical" variant="dots" aria-label="Onboarding" /></div>
      </div>
      <div className="w-[960px]"><Stepper steps={[{ ...steps[0]!, error: true }, steps[1]!, steps[2]!]} current={1} aria-label="With error" /></div>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const [dots, vertical, vdots, withError] = canvasElement.querySelectorAll('[data-slot="stepper"]');
    await expect(Math.round(box(dots!).width)).toBe(72);
    await expect(Math.round(box(dots!.querySelector('[aria-current="step"] [data-slot="step-dot"]')!).width)).toBe(24);
    await expect(canvas.getByText('Step 2 of 4, Company details, current')).toHaveClass('sr-only');
    await expect(Math.round(box(vertical!).height)).toBe(198);
    await expect(Math.round(box(vdots!).height)).toBe(208);
    await expect(withError!.querySelector('[data-state="error"]')).not.toBeNull();
    await expect(canvas.getByRole('list', { name: 'With error' })).toHaveTextContent(/Customer.*Error/);
  },
};

// Stress: at 276 the titles truncate and the last step keeps its width. Tests only.
export const Stress: Story = {
  tags: ['!dev'],
  render: () => (
    <div className="w-[276px]">
      <Stepper steps={[{ id: 'a', title: 'Customer and billing contact', description: 'Name and contact' }, steps[1]!, steps[2]!]} current={1} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const list = canvasElement.querySelector('[data-slot="stepper"]')!;
    await expect(Math.round(box(list).width)).toBe(276);
    await expect(list.scrollWidth).toBeLessThanOrEqual(276);
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, render: Styles.render };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: Styles.render };
