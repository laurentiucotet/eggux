import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { ApprovalChain, ApprovalStep } from './approval-step';

const meta = {
  title: 'Components/Approvals/Approval Step',
  component: ApprovalStep,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'One approver in an approval chain: marker, name, role and rule, status, time and comment. The whole chain is visible before anyone acts; current shows the due date; rejected always has a reason; the last step has no connector. Field changes use Change Item; form steps use Stepper. Figma: Approvals page / Approval Step. Guide: eggux build-ui/patterns/approvals.md' } },
  },
  args: { name: 'Elena Dumitru', role: 'Finance manager · approves over €10,000', status: 'approved', time: '22 Oct 2026, 10:30', comment: 'Within budget, vendor is approved.' },
  render: () => (
    <ApprovalChain className="w-[400px]" aria-label="Approval chain">
      <ApprovalStep name="Elena Dumitru" role="Finance manager · approves over €10,000" status="approved" time="22 Oct 2026, 10:30" comment="Within budget, vendor is approved." />
      <ApprovalStep name="Andrei Pop" role="Head of Engineering · approves all hosting" status="current" time="Assigned 2 h ago · due tomorrow" />
      <ApprovalStep name="Maria Ilie" role="CFO · approves over €15,000" status="upcoming" time="After Finance" />
    </ApprovalChain>
  ),
} satisfies Meta<typeof ApprovalStep>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma: approved 400 × 120 with comment, current with "Waiting for you", upcoming without connector (last).
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const list = canvas.getByRole('list', { name: 'Approval chain' });
    const steps = within(list).getAllByRole('listitem');
    await expect(steps).toHaveLength(3);
    await expect(Math.round(box(steps[0]!).height)).toBe(120);
    await expect(within(steps[1]!).getByText('Waiting for you')).toBeInTheDocument();
    const connectors = canvasElement.querySelectorAll<HTMLElement>('[data-slot="approval-connector"]');
    await expect(getComputedStyle(connectors[2]!).display).toBe('none');
    await expect(Math.round(box(steps[0]!.querySelector('[aria-hidden="true"]')!).width)).toBe(24);
  },
};

// Figma Status=rejected: destructive marker and badge, the reason in the comment.
export const Rejected: Story = {
  render: () => (
    <ApprovalChain className="w-[400px]">
      <ApprovalStep name="Elena Dumitru" role="Finance manager" status="rejected" time="22 Oct 2026, 10:30" comment="Over the Q4 hosting budget by €2,400. Ask the vendor for a 12-month discount." connector={false} />
    </ApprovalChain>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Rejected')).toBeInTheDocument();
    await expect(canvas.getByText(/Over the Q4 hosting budget/)).toBeInTheDocument();
  },
};

// Stress: at 276 the role clamps to 2 lines and the time to 1; the badge keeps its size. Tests only.
export const Stress: Story = {
  tags: ['!dev'],
  render: () => (
    <ApprovalChain className="w-[276px]">
      <ApprovalStep name="Alexandra-Maria Constantinescu" role="Regional finance director for Central and Eastern Europe · approves purchases over €10,000 and all multi-year contracts" status="current" time="Assigned 2 days ago · due tomorrow at 17:00 Europe/Bucharest" />
    </ApprovalChain>
  ),
  play: async ({ canvas }) => {
    const role = canvas.getByTitle(/Regional finance director/);
    await expect(Math.round(box(role).height)).toBe(32);
    const time = canvas.getByTitle(/Assigned 2 days ago/);
    await expect(Math.round(box(time).height)).toBe(16);
    await expect(Math.round(box(canvas.getByText('Waiting for you')).height)).toBeLessThanOrEqual(16);
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
