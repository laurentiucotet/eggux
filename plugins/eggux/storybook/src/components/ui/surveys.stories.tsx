import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { CsatRating, FeedbackWidget, NpsSurvey } from './surveys';

const meta = {
  title: 'Components/Surveys/Feedback Widget',
  component: FeedbackWidget,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Short in-product questions. Feedback Widget: Yes or No at the end of an article or AI answer, an optional comment, then thanks in place. NPS Survey: 0-10 with anchors, then an optional reason; at most every 90 days. CSAT Rating: five faces with words after one interaction. None of them blocks the page; send the answer with the page, ticket or order id. Figma: Surveys page. Guide: eggux build-ui/components/rating.md' } },
  },
  args: { onSubmit: fn() },
  render: args => <div className="w-[320px]"><FeedbackWidget {...args} /></div>,
} satisfies Meta<typeof FeedbackWidget>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma: ask 106, comment 226, thanks 62; focus moves to the comment; thanks in a status.
export const Default: Story = {
  play: async ({ args, canvas, canvasElement }) => {
    const widget = canvasElement.querySelector('[data-slot="feedback-widget"]')!;
    await expect(Math.round(box(widget).height)).toBe(106);
    await userEvent.click(canvas.getByRole('button', { name: 'Yes' }));
    await expect(canvas.getByRole('button', { name: 'Yes' })).toHaveAttribute('aria-pressed', 'true');
    const comment = canvas.getByRole('textbox', { name: 'What could be better? (optional)' });
    await waitFor(() => expect(comment).toHaveFocus());
    await expect(Math.round(box(widget).height)).toBe(226);
    await userEvent.type(comment, 'More examples');
    await userEvent.click(canvas.getByRole('button', { name: 'Send' }));
    await expect(args.onSubmit).toHaveBeenCalledWith('yes', 'More examples');
    await expect(canvas.getByRole('status')).toHaveTextContent('Thanks for the feedback.');
    await expect(Math.round(box(canvasElement.querySelector('[data-slot="feedback-widget"]')!).height)).toBe(62);
  },
};

// NPS: radiogroup with arrows, anchors in the end names, follow-up after a score; 158 / 322.
export const Nps: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="w-[600px]"><NpsSurvey onDismiss={fn()} /></div>
      <div className="w-[276px]"><NpsSurvey question="How likely are you to recommend the mobile app?" /></div>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const [nps, narrow] = canvasElement.querySelectorAll('[data-slot="nps-survey"]');
    await expect(Math.round(box(nps!).height)).toBe(158);
    const group = canvas.getAllByRole('radiogroup')[0]!;
    await expect(canvas.getAllByRole('radio', { name: '0, Not likely' })[0]).toBeInTheDocument();
    const eight = canvas.getAllByRole('radio', { name: '8' })[0]!;
    await userEvent.click(eight);
    await userEvent.keyboard('{ArrowRight}');
    const nine = canvas.getAllByRole('radio', { name: '9' })[0]!;
    await expect(nine).toHaveAttribute('aria-checked', 'true');
    await expect(nine).toHaveFocus();
    await expect(group.querySelectorAll('[tabindex="0"]')).toHaveLength(1);
    await expect(Math.round(box(nps!).height)).toBe(322);
    await expect(canvas.getByRole('button', { name: 'Dismiss survey' })).toBeInTheDocument();
    // Under 420 the scale wraps: 10 sits on the second row.
    const n = narrow!.querySelectorAll('[role="radio"]');
    await expect(box(n[10]!).top).toBeGreaterThan(box(n[0]!).top);
  },
};

// CSAT: five faces named by their words; picking one shows the thanks; 144 / 180.
export const Csat: Story = {
  parameters: { controls: { disable: true } },
  render: () => <div className="w-[420px]"><CsatRating /></div>,
  play: async ({ canvas, canvasElement }) => {
    const el = canvasElement.querySelector('[data-slot="csat-rating"]')!;
    await expect(Math.round(box(el).height)).toBe(144);
    await userEvent.click(canvas.getByRole('radio', { name: 'Good' }));
    await expect(canvas.getByRole('radio', { name: 'Good' })).toHaveAttribute('aria-checked', 'true');
    await expect(canvas.getByRole('status')).toHaveTextContent('Thanks. Tell us more');
    await expect(Math.round(box(el).height)).toBe(180);
    await userEvent.keyboard('{ArrowLeft}');
    await expect(canvas.getByRole('radio', { name: 'OK' })).toHaveAttribute('aria-checked', 'true');
  },
};

// Stress: long question at 276 clamps to 2 lines; CSAT labels truncate. Tests only.
export const Stress: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => (
    <div className="flex w-[276px] flex-col gap-4">
      <FeedbackWidget question="Did this article about reconciling multi-currency bank feeds answer every question you had today?" />
      <CsatRating defaultValue={4} question="How was your onboarding call with the Acme implementation team?" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const q = canvasElement.querySelector('[data-slot="feedback-widget"] p')!;
    await expect(Math.round(box(q).height)).toBe(40);
    const labels = canvasElement.querySelectorAll('[data-slot="csat-rating"] [role="radio"] span:last-child');
    await expect([...labels].some(l => l.scrollWidth > l.clientWidth)).toBe(true);
  },
};

const all = () => (
  <div className="flex flex-col gap-6">
    <div className="w-[320px]"><FeedbackWidget /></div>
    <div className="w-[600px]"><NpsSurvey defaultValue={9} /></div>
    <div className="w-[420px]"><CsatRating defaultValue={3} /></div>
  </div>
);
export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, render: all };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: all };
