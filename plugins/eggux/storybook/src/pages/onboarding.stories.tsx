import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { OnboardingPage, onboardingSteps } from './onboarding';
import { phoneGlobals, phoneStory } from './mobile-parts';

const meta = {
  title: 'Pages/Mobile/Onboarding',
  parameters: {
    ...phoneStory,
    docs: { description: { component: 'First-run intro: three steps with an illustration placeholder, a title, one sentence and Page Dots. Next moves on, the last step offers Get started, Skip leaves at any time. Swipe, the Left and Right arrow keys on the steps, or the dots move between steps. Opens at the 375 px viewport.' } },
  },
  globals: phoneGlobals,
  render: () => <OnboardingPage />,
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The last step: the primary action becomes Get started. */
export const LastStep: Story = { render: () => <OnboardingPage initialStep={2} /> };

/** After Get started or Skip. */
export const Finished: Story = { render: () => <OnboardingPage initialDone /> };

/* Hidden checks */

export const FlowCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('heading', { level: 1, name: onboardingSteps[0].title })).toBeVisible();
    await userEvent.click(c.getByRole('button', { name: 'Next' }));
    await waitFor(() => expect(c.getByRole('heading', { level: 1, name: onboardingSteps[1].title })).toBeVisible());
    await expect(c.getByRole('button', { name: 'Page 2 of 3' })).toHaveAttribute('aria-current', 'page');
    const steps = c.getByRole('group', { name: 'Welcome steps' });
    steps.focus();
    await userEvent.keyboard('{ArrowLeft}');
    await waitFor(() => expect(c.getByRole('heading', { level: 1, name: onboardingSteps[0].title })).toBeVisible());
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    await waitFor(() => expect(c.getByRole('heading', { level: 1, name: onboardingSteps[2].title })).toBeVisible());
    await expect(c.queryByRole('button', { name: 'Next' })).toBeNull();
    await userEvent.click(c.getByRole('button', { name: 'Get started' }));
    await waitFor(() => expect(c.getByText('Welcome to Acme')).toBeVisible());
  },
};
export const SkipCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole('button', { name: 'Skip' }));
    await waitFor(() => expect(c.getByRole('heading', { level: 1, name: 'You are all set' })).toBeVisible());
  },
};
export const DefaultDark: Story = { tags: ['!dev'], globals: { ...phoneGlobals, theme: 'Dark' } };
export const DefaultBackOffice: Story = { tags: ['!dev'], globals: { ...phoneGlobals, theme: 'Corporate Light' } };
