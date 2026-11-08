import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { CodeBlock, CommandSnippet, DiffLine, DiffViewer, EndpointRow, InlineCode, JsonViewer, LogRow } from './code-block';

const meta = {
  title: 'Components/Code Block/Code Block',
  component: CodeBlock,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Code and developer content. Code Block: a snippet with the language and Copy, optional tabs (npm, pnpm, yarn), line numbers and one highlighted line; it scrolls instead of wrapping. Command Snippet: one command to copy (the $ is never copied). Endpoint Row: one API endpoint with its method color. Log Row: one log line. Diff Viewer: what changed between versions. JSON Viewer: a collapsible payload. Inline Code: a short value inside text. Figma: Code Block page. Guide: eggux build-ui/components/content.md' } },
  },
  args: { code: 'npx shadcn@latest add button\nnpx shadcn@latest add dialog', language: 'bash', label: 'Install commands' },
  render: args => <div className="w-[640px]"><CodeBlock {...args} /></div>,
} satisfies Meta<typeof CodeBlock>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma: 640 × 119 with the header; Copy names the language; the code region is focusable.
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const block = canvasElement.querySelector('[data-slot="code-block"]')!;
    await expect(Math.round(box(block).height)).toBe(119);
    await expect(canvas.getByRole('button', { name: 'Copy bash code' })).toBeInTheDocument();
    const region = canvas.getByRole('region', { name: 'Install commands' });
    await expect(region).toHaveAttribute('tabindex', '0');
    await expect(region).toHaveTextContent('npx shadcn@latest add dialog');
  },
};

// Tabs, line numbers and a highlighted line; a command snippet and inline code.
export const TabsAndLines: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[640px] flex-col gap-4">
      <CodeBlock
        label="Install"
        samples={[
          { value: 'npm', label: 'npm', code: 'npm install @acme/sdk', language: 'bash' },
          { value: 'pnpm', label: 'pnpm', code: 'pnpm add @acme/sdk', language: 'bash' },
          { value: 'yarn', label: 'yarn', code: 'yarn add @acme/sdk', language: 'bash' },
        ]}
      />
      <CodeBlock label="Client" language="ts" lineNumbers highlightLine={3} code={"import { Acme } from '@acme/sdk';\n\nconst acme = new Acme({ apiKey: process.env.ACME_KEY });\nconst invoice = await acme.invoices.retrieve('INV-1041');"} />
      <div className="w-[480px]"><CommandSnippet command="npm install @acme/sdk" /></div>
      <p className="m-0 text-sm">Send the <InlineCode>invoice_id</InlineCode> with every request.</p>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole('tab', { name: 'pnpm' }));
    await expect(canvas.getByRole('region', { name: 'Install, pnpm' })).toHaveTextContent('pnpm add @acme/sdk');
    const hl = canvasElement.querySelector('[data-highlighted]')!;
    await expect(hl).toHaveAttribute('data-line', '3');
    await expect(Math.round(box(hl).height)).toBe(20);
    const snippet = canvasElement.querySelector('[data-slot="command-snippet"]')!;
    await expect(Math.round(box(snippet).height)).toBe(36);
    await expect(canvas.getByRole('button', { name: 'Copy command' })).toBeInTheDocument();
    await expect(Math.round(box(canvasElement.querySelector('[data-slot="inline-code"]')!).height)).toBe(24);
  },
};

// Endpoint rows (selected on accent), log rows, diff viewer, JSON viewer.
export const Developer: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-6">
      <ul aria-label="Invoices API" className="m-0 w-[560px] p-0">
        <EndpointRow method="GET" path="/v1/invoices" summary="List invoices" href="#list" />
        <EndpointRow method="GET" path="/v1/invoices/{id}" summary="Retrieve an invoice" href="#get" selected />
        <EndpointRow method="POST" path="/v1/invoices" summary="Create an invoice" href="#create" />
        <EndpointRow method="DELETE" path="/v1/invoices/{id}" summary="Delete a draft invoice" href="#delete" />
      </ul>
      <ul aria-label="Logs" className="m-0 w-[720px] p-0">
        <LogRow time="12:04:31.120" level="debug" message="Cache miss for customer 4821" />
        <LogRow time="12:04:31.180" level="info" message="POST /v1/invoices 201 in 182 ms" />
        <LogRow time="12:04:31.200" level="warn" message="Rate limit at 80% for key pk_live_…3f" />
        <LogRow time="12:04:31.220" level="error" message="Webhook delivery failed: 503 from https://hooks.northwind.com/acme" />
      </ul>
      <div className="w-[640px]">
        <DiffViewer file="payment-terms.md" added={1} removed={1}>
          <DiffLine line={11}>## Payment terms</DiffLine>
          <DiffLine line={12} type="removed">Payment is due within 30 days of the invoice date.</DiffLine>
          <DiffLine line={12} type="added">Payment is due within 14 days of the invoice date.</DiffLine>
          <DiffLine line={13}>Late payments carry 1% interest per month.</DiffLine>
        </DiffViewer>
      </div>
      <div className="w-[480px]">
        <JsonViewer label="Webhook payload" data={{ id: 'INV-1041', amount: 2450, paid: false, customer: { name: 'Northwind Traders' } }} />
      </div>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const rows = canvasElement.querySelectorAll('[data-slot="endpoint-row"]');
    await expect(Math.round(box(rows[0]!).height)).toBe(37);
    await expect(canvas.getByRole('link', { name: '/v1/invoices/{id}', current: 'page' })).toHaveAttribute('href', '#get');
    const logs = canvasElement.querySelectorAll('[data-slot="log-row"]');
    await expect(Math.round(box(logs[0]!).height)).toBe(28);
    await expect(logs[3]).toHaveTextContent('ERROR');
    const diff = canvas.getByRole('region', { name: 'payment-terms.md' });
    await expect(Math.round(box(diff).height)).toBe(151);
    await expect(diff).toHaveTextContent('Removed: Payment is due within 30 days');
    await expect(diff.querySelector('del')).not.toBeNull();
    const json = canvas.getByRole('tree', { name: 'Webhook payload' });
    await expect(Math.round(box(json).height)).toBe(198);
    const customer = canvas.getByRole('treeitem', { name: /^"customer"/ });
    await expect(customer).toHaveAttribute('aria-expanded', 'true');
    json.querySelector<HTMLElement>('[role="treeitem"]')!.focus();
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}{ArrowLeft}');
    await expect(customer).toHaveAttribute('aria-expanded', 'false');
    await expect(json).toHaveTextContent('"customer": { … }');
  },
};

// Stress: a long command truncates, a long line scrolls, long log messages wrap. Tests only.
export const Stress: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => (
    <div className="flex w-[320px] flex-col gap-3">
      <CommandSnippet command="npx @acme/cli@latest init --template invoices --region eu-central-1 --yes" />
      <CodeBlock code="curl -X POST https://api.acme.com/v1/invoices -H 'Authorization: Bearer sk_test_123' -d customer=cus_4821" language="bash" label="Request" />
      <ul className="m-0 p-0"><LogRow time="12:04:31.220" level="error" message="Webhook delivery failed after 5 attempts: 503 Service Unavailable from https://hooks.northwind.com/acme/invoices" /></ul>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const cmd = canvas.getByTitle(/npx @acme\/cli/);
    await expect(cmd.scrollWidth).toBeGreaterThan(cmd.clientWidth);
    const region = canvas.getByRole('region', { name: 'Request' });
    await expect(region.scrollWidth).toBeGreaterThan(region.clientWidth);
    await expect(Math.round(box(canvasElement.querySelector('[data-slot="log-row"]')!).height)).toBeGreaterThan(28);
  },
};

export const DefaultDark: Story = { parameters: { controls: { disable: true } }, tags: ['!dev'], globals: { theme: 'Dark' }, render: Developer.render };
export const DefaultCorporate: Story = { parameters: { controls: { disable: true } }, tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: Developer.render };
export const TabsDark: Story = { parameters: { controls: { disable: true } }, tags: ['!dev'], globals: { theme: 'Dark' }, render: TabsAndLines.render };
