import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { AutomationRule, MappingRow, WorkflowNode } from './automation';
import { DropdownMenuItem, DropdownMenuSeparator } from './dropdown-menu';

const meta = {
  title: 'Components/Automation/Automation Components',
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Automation Rule: one rule as a sentence (When trigger and condition then action) with an on / off switch and a menu; say how often it ran. Workflow Node: one step on an automation canvas (trigger, condition, action) with ports; the title selects it, error says what is missing. Mapping Row: a source field mapped to a target field during import, with mapped, skipped and error states. Figma: Automation page.' } },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();
const onToggle = fn();

// Figma: 640 × 108; the sentence reads as one line of text; switch named by the rule.
export const Rule: Story = {
  name: 'Automation Rule',
  render: () => (
    <div className="flex w-[640px] flex-col gap-4">
      <AutomationRule
        name="Route large invoices to finance"
        meta="Ran 48 times this month · last run 2 h ago"
        trigger={{ label: 'Invoice is received' }}
        condition={{ label: 'Amount > EUR 10,000' }}
        action={{ label: 'Assign to Finance team' }}
        onEnabledChange={onToggle}
        menu={<><DropdownMenuItem>Edit</DropdownMenuItem><DropdownMenuItem>Duplicate</DropdownMenuItem><DropdownMenuItem>Run history</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem variant="destructive">Delete</DropdownMenuItem></>}
      />
      <AutomationRule name="Remind customers 3 days before due" meta="Off since 2 Oct 2026" enabled={false} trigger={{ label: 'Due date is in 3 days' }} action={{ label: 'Send reminder email' }} />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const [on, off] = canvas.getAllByRole('article');
    await expect(Math.round(box(on!).height)).toBe(108);
    await expect(canvasElement.querySelector('[data-slot="rule-sentence"]')).toHaveTextContent('WhenInvoice is receivedandAmount > EUR 10,000thenAssign to Finance team');
    const toggle = canvas.getByRole('switch', { name: 'Route large invoices to finance' });
    await userEvent.click(toggle);
    await expect(onToggle).toHaveBeenCalledWith(false);
    await expect(within(off!).getByRole('switch')).not.toBeChecked();
    await expect(within(off!).queryByText('and')).toBeNull();
    await userEvent.click(canvas.getByRole('button', { name: 'More actions for Route large invoices to finance' }));
    await expect(await within(document.body).findByRole('menuitem', { name: 'Run history' })).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
  },
};

function Canvas() {
  const [sel, setSel] = React.useState('condition');
  return (
    <div className="flex flex-col items-center gap-8 py-2">
      <WorkflowNode type="trigger" title="Invoice is received" detail="Finance workspace" selected={sel === 'trigger'} onSelect={() => setSel('trigger')} menu={<DropdownMenuItem>Delete step</DropdownMenuItem>} />
      <WorkflowNode type="condition" title="Amount over EUR 10,000" detail="Otherwise: skip" selected={sel === 'condition'} onSelect={() => setSel('condition')} />
      <WorkflowNode type="action" title="Assign to a reviewer" detail="Choose who reviews the invoice" error selected={sel === 'action'} onSelect={() => setSel('action')} />
    </div>
  );
}

// Figma: 260 wide; default 107, selected 109 (2 px ring), error 108 with the detail in red.
export const Workflow: Story = {
  name: 'Workflow Node',
  render: () => <Canvas />,
  play: async ({ canvas, canvasElement }) => {
    const nodes = [...canvasElement.querySelectorAll('[data-slot="workflow-node"]')];
    await expect(Math.round(box(nodes[0]!).width)).toBe(260);
    await expect(Math.round(box(nodes[0]!).height)).toBe(107);
    await expect(Math.round(box(nodes[1]!).height)).toBe(109);
    // 1.5 px border renders as 1 or 2 px depending on the screen.
    await expect(Math.abs(Math.round(box(nodes[2]!).height) - 108)).toBeLessThanOrEqual(1);
    await expect(nodes[0]!.querySelector('[data-slot="port-in"]')).toBeNull();
    await expect(nodes[1]!.querySelector('[data-slot="port-in"]')).not.toBeNull();
    await expect(nodes[2]).toHaveTextContent('Error: Choose who reviews the invoice');
    const trigger = canvas.getByRole('button', { name: 'Trigger: Invoice is received' });
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByRole('button', { name: 'Condition: Amount over EUR 10,000' })).toHaveAttribute('aria-pressed', 'false');
    await expect(canvas.getByRole('button', { name: 'More actions for Invoice is received' })).toBeInTheDocument();
  },
};

const targets = [{ value: 'amount', label: 'Amount (EUR)' }, { value: 'number', label: 'Invoice number' }, { value: 'customer', label: 'Customer' }, { value: 'due', label: 'Due date' }];
function Mapping() {
  const [v, setV] = React.useState<Record<string, string>>({ invoice_total: 'amount', client: '', due_on: 'amount' });
  return (
    <div className="w-[720px]">
      <MappingRow source="invoice_total" sample="e.g. 1,240.00" targets={targets} value={v.invoice_total!} onValueChange={x => setV(s => ({ ...s, invoice_total: x }))} />
      <MappingRow source="client" sample="e.g. Northwind Traders" targets={targets} value={v.client!} onValueChange={x => setV(s => ({ ...s, client: x }))} />
      <MappingRow source="due_on" sample="e.g. 2026-11-30" targets={targets} value={v.due_on!} error={v.due_on === 'amount' ? "A date can't go into a number field" : undefined} onValueChange={x => setV(s => ({ ...s, due_on: x }))} />
    </div>
  );
}

// Figma: 720 × 55; mapped (check), skipped (no target), error (red Select, reason read with it).
export const Mappings: Story = {
  name: 'Mapping Row',
  render: () => <Mapping />,
  play: async ({ canvas, canvasElement }) => {
    const rows = [...canvasElement.querySelectorAll('[data-slot="mapping-row"]')];
    await expect(Math.round(box(rows[0]!).height)).toBe(55);
    await expect(rows.map(r => r.getAttribute('data-status'))).toEqual(['mapped', 'unmapped', 'error']);
    const due = canvas.getByRole('combobox', { name: 'Target field for due_on' });
    await expect(due).toHaveAttribute('aria-invalid', 'true');
    await expect(due).toHaveAccessibleDescription("Error: A date can't go into a number field");
    await expect(canvas.getByRole('combobox', { name: 'Target field for client' })).toHaveTextContent("Don't import");
    await userEvent.click(due);
    await userEvent.click(await within(document.body).findByRole('option', { name: 'Due date' }));
    await expect(rows[2]).toHaveAttribute('data-status', 'mapped');
  },
};

// Stress: long labels in chips and nodes, rule at 360. Tests only.
export const EdgeCases: Story = {
  tags: ['!dev'],
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="w-[360px]">
        <AutomationRule name="A rule with a very long name that must be cut on one line" meta="Never ran" trigger={{ label: 'A customer replies to any invoice email in any language' }} condition={{ label: 'Subject contains “dispute” or “refund”' }} action={{ label: 'Create a task for the account owner and notify the finance channel' }} />
      </div>
      <WorkflowNode type="condition" title="Customer is in the European Union and has a valid VAT number on file" detail="Checks the VAT number against VIES every time" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const rule = canvasElement.querySelector('[data-slot="automation-rule"]')!;
    await expect(rule.scrollWidth).toBeLessThanOrEqual(360);
  },
};

const All = () => (
  <div className="flex flex-col gap-8">
    <div className="w-[640px]"><AutomationRule name="Route large invoices to finance" meta="Ran 48 times" trigger={{ label: 'Invoice is received' }} condition={{ label: 'Amount > EUR 10,000' }} action={{ label: 'Assign to Finance team' }} /></div>
    <Canvas />
    <Mapping />
  </div>
);
export const AllDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, render: () => <All /> };
export const AllCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: () => <All /> };
