import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Attachment, AttachmentList } from './ai-attachment';
import { PromptInput } from './prompt-input';
import { UserMessage } from './user-message';

const meta = {
  title: 'Components/AI Chat/Attachment',
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'A file or image attached to a prompt or sent with a message. File: 224 row with the type tile, name (truncates in the middle), meta and remove. Image: 64 thumbnail with remove on the corner. States ready, uploading (progress bar, percent) and error (reason, Retry). Read-only without onRemove; href opens the file. Goes in the Prompt Input Attachments slot and above the User Message bubble. Figma: AI Chat docs (Attachment). Guide: eggux build-ui/components/ai-chat.md' } },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();
// A local picture (no network): a soft gradient standing in for a photo.
const photo = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#93c5fd"/><stop offset="1" stop-color="#c4b5fd"/></linearGradient></defs><rect width="128" height="128" fill="url(#g)"/><circle cx="44" cy="46" r="14" fill="#fff" opacity=".7"/><path d="M0 128 48 76l28 26 22-18 30 44Z" fill="#fff" opacity=".55"/></svg>')}`;
const onRemove = fn();
const onRetry = fn();

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <AttachmentList>
        <Attachment name="Q3-report.pdf" size={245760} onRemove={onRemove} />
        <Attachment name="customers-october.csv" size={88000} state="uploading" progress={40} onRemove={() => {}} />
        <Attachment name="contract-draft.docx" state="error" error="File is larger than 20 MB" onRetry={onRetry} onRemove={() => {}} />
      </AttachmentList>
      <AttachmentList>
        <Attachment name="whiteboard.png" src={photo} onRemove={() => {}} />
        <Attachment name="receipt.jpg" src={photo} state="uploading" progress={70} onRemove={() => {}} />
        <Attachment name="scan.heic" type="image" state="error" onRetry={() => {}} onRemove={() => {}} />
      </AttachmentList>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const files = canvasElement.querySelectorAll('[data-type="file"]');
    await expect(box(files[0]).width).toBe(224);
    await expect(box(files[0]).height).toBe(54);
    await expect(c.getByText('PDF · 240 KB')).toBeVisible();
    await expect(c.getByRole('progressbar', { name: 'Uploading customers-october.csv' })).toHaveAttribute('aria-valuenow', '40');
    await expect(c.getByText('File is larger than 20 MB')).toHaveClass('text-destructive');
    await userEvent.click(c.getByRole('button', { name: 'Remove Q3-report.pdf' }));
    await expect(onRemove).toHaveBeenCalled();
    await userEvent.click(c.getByRole('button', { name: 'Retry upload of contract-draft.docx' }));
    await expect(onRetry).toHaveBeenCalled();
    const img = canvasElement.querySelector('[data-type="image"]')!;
    await expect(box(img).width).toBe(64);
    await expect(c.getByRole('img', { name: 'whiteboard.png' })).toBeVisible();
    await expect(c.getByRole('button', { name: 'Cancel upload of receipt.jpg' })).toBeVisible();
  },
};

function Composer() {
  const [files, setFiles] = React.useState(['Q3-report.pdf', 'Q2-report.pdf', 'chart.png']);
  return (
    <div className="w-[640px]">
      <PromptInput
        defaultValue="Compare these two reports and explain the chart."
        onAttach={() => {}}
        attachments={files.map((f) =>
          f.endsWith('.png') ? (
            <Attachment key={f} name={f} src={photo} onRemove={() => setFiles((x) => x.filter((y) => y !== f))} />
          ) : (
            <Attachment key={f} name={f} size={245760} onRemove={() => setFiles((x) => x.filter((y) => y !== f))} />
          ),
        )}
      />
    </div>
  );
}

export const InPromptInput: Story = {
  render: () => <Composer />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(canvasElement.querySelectorAll('[data-slot="attachment"]')).toHaveLength(3);
    await userEvent.click(c.getByRole('button', { name: 'Remove Q2-report.pdf' }));
    await expect(canvasElement.querySelectorAll('[data-slot="attachment"]')).toHaveLength(2);
  },
};

export const InUserMessage: Story = {
  render: () => (
    <div className="flex w-[640px] flex-col">
      <UserMessage
        attachments={
          <>
            <Attachment name="Q3-report.pdf" size="12 pages" href="#q3" />
            <Attachment name="chart.png" src={photo} href="#chart" />
          </>
        }
      >
        Compare these two reports and explain the chart.
      </UserMessage>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.queryAllByRole('button', { name: /^Remove/ })).toHaveLength(0);
    await expect(c.getByRole('link', { name: 'Q3-report.pdf' })).toHaveAttribute('href', '#q3');
    await expect(c.getByRole('link', { name: 'Open chart.png' })).toHaveAttribute('href', '#chart');
  },
};

export const EdgeCases: Story = {
  tags: ['!dev'],
  render: () => (
    <AttachmentList className="w-60">
      <Attachment name="a-very-long-file-name-for-the-quarterly-board-meeting-final-v12.xlsx" size={12_582_912} onRemove={() => {}} />
      <Attachment name="noextension" />
      <Attachment name="archive.zip" state="uploading" progress={140} />
    </AttachmentList>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    for (const el of Array.from(canvasElement.querySelectorAll('[data-slot="attachment"]'))) await expect(el.scrollWidth).toBeLessThanOrEqual(el.clientWidth + 1);
    await expect(c.getByText(/v12\.xlsx$/)).toBeVisible();
    await expect(c.getByText('XLSX · 12.0 MB')).toBeVisible();
    await expect(c.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  },
};

const All = () => (
  <div className="flex flex-col gap-6 bg-background p-6">
    <AttachmentList>
      <Attachment name="Q3-report.pdf" size={245760} onRemove={() => {}} />
      <Attachment name="customers.csv" state="uploading" progress={40} onRemove={() => {}} />
      <Attachment name="contract.docx" state="error" onRetry={() => {}} onRemove={() => {}} />
      <Attachment name="whiteboard.png" src={photo} onRemove={() => {}} />
      <Attachment name="scan.heic" type="image" state="error" onRemove={() => {}} />
    </AttachmentList>
  </div>
);
export const AllDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, render: () => <All /> };
export const AllCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: () => <All /> };
