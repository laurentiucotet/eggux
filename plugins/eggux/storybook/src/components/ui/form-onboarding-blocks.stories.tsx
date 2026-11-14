import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { InviteTeamStep, PlanSelectStep, WelcomeRoleSelect, WorkspaceSetup } from './form-onboarding-blocks';

const meta = {
  title: 'Blocks/Forms/Onboarding',
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Onboarding steps after sign-up, 672 wide for Page Shell / Wizard: role and team size, workspace, invites, plan. Every step can be skipped except the workspace name. Turn Show progress and Show actions off inside the Wizard shell, which has its own. Figma: BLOCKS / Forms, Block / Welcome Role Select ... Plan Select Step. Guide: eggux build-ui/patterns/multi-step-form.md' } },
  },
} satisfies Meta;
export default meta;

const Stage = ({ children }: { children: ReactNode }) => <div className="flex justify-center bg-background px-6 py-10">{children}</div>;
const cat = (c: string) => ({ table: { category: c } });
const box = (el: Element) => el.getBoundingClientRect();
const described = (el: HTMLElement, text: string) => expect(el).toHaveAccessibleDescription(expect.stringContaining(text));

type FrameArgs = { showProgress: boolean; showActions: boolean };
const frameArgTypes = {
  showProgress: { name: 'Show progress', control: 'boolean' as const, description: 'Off inside Page Shell / Wizard.', ...cat('Parts') },
  showActions: { name: 'Show actions', control: 'boolean' as const, description: 'Off inside Page Shell / Wizard.', ...cat('Parts') },
};

export const WelcomeRoleSelectStory: StoryObj<FrameArgs & { name: string }> = {
  name: 'Welcome Role Select',
  args: { name: 'Ana', showProgress: true, showActions: true },
  argTypes: { name: { name: 'First name', control: 'text', ...cat('Content') }, ...frameArgTypes },
  render: a => <Stage><WelcomeRoleSelect name={a.name} defaultRole="project-manager" defaultTeamSize="11-50" showProgress={a.showProgress} showActions={a.showActions} /></Stage>,
};

export const WorkspaceSetupStory: StoryObj<FrameArgs & { title: string }> = {
  name: 'Workspace Setup',
  args: { title: 'Set up your workspace', showProgress: true, showActions: true },
  argTypes: { title: { name: 'Title', control: 'text', ...cat('Content') }, ...frameArgTypes },
  render: a => <Stage><WorkspaceSetup title={a.title} showProgress={a.showProgress} showActions={a.showActions} /></Stage>,
};

export const InviteTeamStepStory: StoryObj<FrameArgs & { title: string }> = {
  name: 'Invite Team Step',
  args: { title: 'Invite your team', showProgress: true, showActions: true },
  argTypes: { title: { name: 'Title', control: 'text', ...cat('Content') }, ...frameArgTypes },
  render: a => <Stage><InviteTeamStep title={a.title} showProgress={a.showProgress} showActions={a.showActions} /></Stage>,
};

export const PlanSelectStepStory: StoryObj<FrameArgs & { billing: 'monthly' | 'yearly' }> = {
  name: 'Plan Select Step',
  args: { billing: 'yearly', showProgress: true, showActions: true },
  argTypes: { billing: { name: 'Billing', control: 'inline-radio', options: ['monthly', 'yearly'], ...cat('State') }, ...frameArgTypes },
  render: a => <Stage><PlanSelectStep key={a.billing} defaultBilling={a.billing} showProgress={a.showProgress} showActions={a.showActions} /></Stage>,
};

/* Hidden checks */

const onRole = fn();
export const WelcomeRoleSelectCheck: StoryObj = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <Stage><WelcomeRoleSelect onSubmit={onRole} /></Stage>,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByText('Step 1 of 4 · About you')).toBeVisible();
    await expect(c.getByRole('heading', { level: 1, name: 'Welcome to Acme, Ana' })).toBeVisible();
    const roles = c.getByRole('radiogroup', { name: 'What best describes your role?' });
    await expect(within(roles).getAllByRole('radio')).toHaveLength(6);
    await userEvent.click(c.getByRole('button', { name: 'Continue' }));
    await waitFor(() => expect(within(roles).getAllByRole('radio')[0]).toHaveFocus());
    const group = roles.closest('fieldset')!;
    await expect(group).toHaveAttribute('aria-invalid', 'true');
    await expect(group).toHaveAccessibleDescription(expect.stringContaining('Choose the role closest to yours'));
    await expect(onRole).not.toHaveBeenCalled();
    await userEvent.click(c.getByRole('radio', { name: 'Developer' }));
    await waitFor(() => expect(group).not.toHaveAttribute('aria-invalid'));
    await userEvent.click(c.getByRole('radio', { name: '2-10' }));
    await userEvent.click(c.getByRole('button', { name: 'Continue' }));
    await expect(onRole).toHaveBeenCalledWith({ role: 'developer', teamSize: '2-10' });
    await expect(c.getByRole('button', { name: 'Skip for now' })).toBeVisible();
  },
};

const onWorkspace = fn();
export const WorkspaceSetupCheck: StoryObj = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <Stage><WorkspaceSetup onSubmit={onWorkspace} defaultValues={{ name: '', slug: '' }} /></Stage>,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole('button', { name: 'Continue' }));
    const name = c.getByRole('textbox', { name: /^Workspace name/ });
    await waitFor(() => expect(name).toHaveFocus());
    await described(name, 'Enter a workspace name.');
    // The URL follows the name until people edit it.
    await userEvent.type(name, 'Acme');
    const url = c.getByRole('textbox', { name: /^Workspace URL/ });
    await expect(url).toHaveValue('acme');
    await described(url, 'app.acme.com/acme is taken.');
    await userEvent.type(name, ' Studio Ș');
    await expect(url).toHaveValue('acme-studio-s');
    await waitFor(() => expect(url).not.toHaveAttribute('aria-invalid'));
    await described(url, 'app.acme.com/');
    await userEvent.clear(url);
    await userEvent.type(url, 'a!');
    await userEvent.tab();
    await waitFor(() => described(url, 'Use 3 to 40 lowercase letters'));
    await userEvent.clear(url);
    await userEvent.type(url, 'acme-studio');
    await userEvent.click(c.getByRole('button', { name: 'Continue' }));
    await expect(onWorkspace).toHaveBeenCalledWith({ name: 'Acme Studio Ș', slug: 'acme-studio', currency: 'EUR', timeZone: 'Europe/Bucharest' });
    await expect(c.getByRole('group', { name: /Workspace logo/ })).toBeVisible();
  },
};

const onInvite = fn();
const onTeam = fn();
export const InviteTeamStepCheck: StoryObj = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <Stage><InviteTeamStep onInvite={onInvite} onSubmit={onTeam} /></Stage>,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('heading', { level: 2, name: 'Invited (3)' })).toBeVisible();
    const input = c.getByRole('textbox', { name: 'Email addresses' });
    await userEvent.click(c.getByRole('button', { name: 'Invite' }));
    await waitFor(() => expect(input).toHaveFocus());
    await described(input, 'Enter at least one email address.');
    await userEvent.type(input, 'ion@acme.com,bad-address,');
    await userEvent.click(c.getByRole('button', { name: 'Invite' }));
    await waitFor(() => described(input, 'bad-address is not an email address.'));
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await userEvent.click(c.getByRole('button', { name: 'Remove bad-address' }));
    await waitFor(() => expect(input).not.toHaveAttribute('aria-invalid'));
    await userEvent.click(c.getByRole('button', { name: 'Invite' }));
    await expect(onInvite).toHaveBeenCalledWith(['ion@acme.com'], 'member');
    await expect(await c.findByRole('heading', { level: 2, name: 'Invited (4)' })).toBeVisible();
    await expect(c.getByRole('combobox', { name: 'Role of Maria Ilie' })).toBeVisible();
    await expect(c.getByRole('textbox', { name: 'Invite link' })).toHaveValue('app.acme.com/join/7Kq2xF');
    await userEvent.click(c.getByRole('button', { name: 'Continue' }));
    await expect(onTeam).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ email: 'ion@acme.com', role: 'member' })]));
  },
};

const onPlan = fn();
export const PlanSelectStepCheck: StoryObj = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <Stage><PlanSelectStep onSubmit={onPlan} /></Stage>,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const plans = c.getByRole('radiogroup', { name: 'Plan' });
    await expect(c.getByRole('radio', { name: 'Pro' })).toBeChecked();
    await expect(plans.querySelectorAll('[data-slot=plan-price]')[1]).toHaveTextContent('Was €24€19per user / month');
    await userEvent.click(c.getByRole('radio', { name: 'Monthly' }));
    await expect(plans.querySelectorAll('[data-slot=plan-price]')[1]).toHaveTextContent('€24per user / month');
    await userEvent.click(c.getByRole('radio', { name: 'Business' }));
    await userEvent.click(c.getByRole('button', { name: 'Start Business trial' }));
    await expect(onPlan).toHaveBeenCalledWith({ plan: 'business', billing: 'monthly' });
    await expect(c.getByRole('button', { name: 'Skip, stay on Free' })).toBeVisible();
  },
};

// Every step at 1440, 768 and 390: 672 wide (the width at 390), choices in 2 columns from 560, one column below; no overflow.
export const LayoutCheck: StoryObj = {
  tags: ['!dev'],
  parameters: { controls: { disable: true }, a11y: { config: { rules: [{ id: 'page-has-heading-one', enabled: false }, { id: 'landmark-unique', enabled: false }, { id: 'heading-order', enabled: false }] } } },
  render: () => (
    <div className="flex flex-col gap-8 bg-background">
      {[1440, 768, 390].map(w => (
        <div key={w} data-width={w} style={{ width: w }} className="flex flex-col items-center gap-10 px-4">
          <WelcomeRoleSelect defaultRole="project-manager" /><WorkspaceSetup /><InviteTeamStep /><PlanSelectStep />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const w of [1440, 768, 390]) {
      const frame = canvasElement.querySelector<HTMLElement>(`[data-width="${w}"]`)!;
      await expect(frame.scrollWidth).toBeLessThanOrEqual(w);
      const steps = frame.querySelectorAll<HTMLElement>('[data-slot=onboarding-step]');
      await expect(steps).toHaveLength(4);
      for (const step of steps) {
        await expect(Math.round(box(step).width)).toBe(Math.min(672, w - 32));
        await expect(step.scrollWidth).toBeLessThanOrEqual(Math.ceil(box(step).width));
        await expect(within(step).getAllByRole('heading', { level: 1 })).toHaveLength(1);
        for (const el of step.querySelectorAll('a, button')) await expect(el).toHaveAccessibleName();
      }
      const cards = steps[0].querySelectorAll('[data-slot=option-card]');
      const sameRow = Math.round(box(cards[0]).top) === Math.round(box(cards[1]).top);
      await expect(sameRow).toBe(w >= 768);
    }
    const wide = canvasElement.querySelector<HTMLElement>('[data-width="1440"] [data-slot=onboarding-step]')!;
    const cards = wide.querySelectorAll('[data-slot=option-card]');
    await expect(Math.round(box(cards[1]).left - box(cards[0]).right)).toBe(12);
    await expect(Math.round(box(wide.querySelector('[data-slot=onboarding-actions] button[type=submit]')!).height)).toBe(36);
  },
};

export const WelcomeRoleSelectDark: StoryObj<FrameArgs & { name: string }> = { ...WelcomeRoleSelectStory, name: 'Welcome Role Select Dark', tags: ['!dev'], globals: { theme: 'Dark' } };
export const PlanSelectStepBackOffice: StoryObj<FrameArgs & { billing: 'monthly' | 'yearly' }> = { ...PlanSelectStepStory, name: 'Plan Select Step Back office', tags: ['!dev'], globals: { theme: 'Corporate Light' } };
