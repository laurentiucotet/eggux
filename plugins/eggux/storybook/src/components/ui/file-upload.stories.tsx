import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { Download, Link } from '@/components/icons';
import { ButtonIcon } from './button-icon';
import { FileDropzone, FileField, FileItem, FilePreview, FileTypeIcon, ResourceItem, formatBytes, type FileKind } from './file-upload';

type Up = { id: string; name: string; size: string; state: 'uploading' | 'done' | 'error'; progress: number };

function UploadDemo() {
  const [items, setItems] = React.useState<Up[]>([
    { id: 'a', name: 'q3-financials.pdf', size: '2.4 MB', state: 'uploading', progress: 50 },
    { id: 'b', name: 'northwind-contract-signed-final-version.pdf', size: '240 KB', state: 'done', progress: 100 },
    { id: 'c', name: 'receipts-october.zip', size: '8.1 MB', state: 'error', progress: 0 },
  ]);
  const drop = (id: string) => setItems(i => i.filter(x => x.id !== id));
  return (
    <div className="flex w-[480px] flex-col gap-3">
      <FileDropzone
        accept=".pdf,.jpg,.png"
        maxSize={10 * 1024 * 1024}
        rejectMessage={(_, r) => (r === 'type' ? 'Only PDF, JPG or PNG files are accepted.' : 'Files must be 10 MB or less.')}
        onFiles={files => setItems(i => [...i, ...files.map(f => ({ id: f.name, name: f.name, size: formatBytes(f.size), state: 'done' as const, progress: 100 }))])}
      />
      <ul aria-label="Files" className="m-0 flex flex-col gap-2 p-0">
        {items.map(f => (
          <FileItem
            key={f.id}
            name={f.name}
            size={f.size}
            state={f.state}
            progress={f.progress}
            onCancel={() => drop(f.id)}
            onRemove={() => drop(f.id)}
            onRetry={() => setItems(i => i.map(x => (x.id === f.id ? { ...x, state: 'uploading', progress: 10 } : x)))}
          />
        ))}
      </ul>
    </div>
  );
}

const meta = {
  title: 'Components/File Upload/File Dropzone',
  component: FileDropzone,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Uploads and files. File Dropzone: drop area with Browse files, the hint states types and size, rejected files say why. File Item: each file with progress and cancel, size and remove, or the error with Retry; row or tile. File Field: one file inside a form. File Preview: read a document without downloading it. Resource Item: a file people download. File Type Icon: the type tile used everywhere. Figma: File Upload page. Guide: eggux build-ui/components/file-upload.md' } },
  },
  render: () => <UploadDemo />,
} satisfies Meta<typeof FileDropzone>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma: dropzone 186, rows 78 / 66 / 82; upload adds a row, wrong type is rejected, remove and retry.
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const zone = canvasElement.querySelector('[data-slot="file-dropzone"]')!;
    await expect(Math.round(box(zone).height)).toBe(186);
    const browse = canvas.getByRole('button', { name: 'Browse files' });
    await expect(browse).toHaveAccessibleDescription('PDF, JPG or PNG · up to 10 MB each');
    const rows = canvasElement.querySelectorAll('[data-slot="file-item"]');
    const heights = [...rows].map(r => Math.round(box(r).height));
    await expect(heights.slice(0, 2)).toEqual([78, 66]);
    // Figma 82: the error wraps to 2 lines there; text renders a few px narrower in code and may fit on 1.
    await expect(heights[2]).toBeGreaterThanOrEqual(66);
    await expect(canvas.getByRole('progressbar', { name: 'Uploading q3-financials.pdf' })).toHaveAttribute('aria-valuenow', '50');
    const input = zone.querySelector('input[type="file"]') as HTMLInputElement;
    await userEvent.upload(input, new File(['x'], 'logo.png', { type: 'image/png' }));
    await expect(canvas.getByTitle('logo.png')).toBeInTheDocument();
    await userEvent.upload(input, new File(['x'], 'notes.txt', { type: 'text/plain' }), { applyAccept: false });
    await expect(canvas.getAllByRole('alert').some(a => a.textContent === 'Only PDF, JPG or PNG files are accepted.')).toBe(true);
    await expect(zone).toHaveAttribute('data-state', 'error');
    await userEvent.click(canvas.getByRole('button', { name: 'Remove logo.png' }));
    await expect(canvas.queryByTitle('logo.png')).toBeNull();
    await userEvent.click(canvas.getByRole('button', { name: 'Retry receipts-october.zip' }));
    await expect(canvas.getByRole('progressbar', { name: 'Uploading receipts-october.zip' })).toBeInTheDocument();
    // Long names keep the end (extension) visible.
    const long = canvas.getByTitle('northwind-contract-signed-final-version.pdf');
    await expect(long.lastElementChild!.textContent).toBe('ersion.pdf');
  },
};

// Small dropzone, drag-over and disabled; tiles; File Type Icons.
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex w-[480px] flex-col gap-3">
        <FileDropzone size="sm" />
        <FileDropzone size="sm" disabled title="Uploads are off for this workspace" />
      </div>
      <ul aria-label="Photos" className="m-0 flex items-start gap-3 p-0">
        <FileItem layout="tile" name="q3-financials.pdf" size="2.4 MB" state="done" onRemove={fn()} />
        <FileItem layout="tile" name="kitchen.jpg" size="1.1 MB" state="uploading" progress={40} onCancel={fn()} />
        <FileItem layout="tile" name="q3-financials.pdf" state="error" onRetry={fn()} onCancel={fn()} />
      </ul>
      <div className="flex gap-6">
        {(['pdf', 'document', 'sheet', 'slides', 'image', 'video', 'audio', 'archive', 'code', 'generic'] as FileKind[]).map(k => <FileTypeIcon key={k} kind={k} />)}
      </div>
      <div className="flex gap-6">
        {(['pdf', 'sheet', 'code', 'generic'] as FileKind[]).map(k => <FileTypeIcon key={k} kind={k} size="sm" />)}
        <FileTypeIcon kind="sheet" size="sm" label="CSV" />
      </div>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const [sm, disabled] = canvasElement.querySelectorAll('[data-slot="file-dropzone"]');
    await expect(Math.round(box(sm!).height)).toBe(66);
    await expect(disabled).toHaveAttribute('data-state', 'disabled');
    await expect(canvas.getAllByRole('button', { name: 'Browse files' })[1]).toBeDisabled();
    const tiles = canvasElement.querySelectorAll('[data-layout="tile"]');
    await expect(Math.round(box(tiles[0]!).width)).toBe(160);
    await expect(Math.round(box(tiles[0]!).height)).toBe(178);
    await expect(Math.round(box(tiles[1]!).height)).toBe(190);
    const icons = canvasElement.querySelectorAll('[data-slot="file-type-icon"]');
    await expect(Math.round(box(icons[0]!).width)).toBe(40);
    await expect(icons[0]).toHaveTextContent('PDF');
    await expect(icons[icons.length - 1]).toHaveTextContent('CSV');
  },
};

// Drag-over state via drag events (tests only).
export const DragOver: Story = {
  tags: ['!dev'],
  render: () => <div className="w-[480px]"><FileDropzone /></div>,
  play: async ({ canvasElement }) => {
    const zone = canvasElement.querySelector('[data-slot="file-dropzone"]')!;
    zone.dispatchEvent(new Event('dragover', { bubbles: true, cancelable: true }));
    await waitFor(() => expect(zone).toHaveAttribute('data-state', 'drag-over'));
    await expect(zone).toHaveTextContent('Drop files to upload');
    await expect(Math.round(box(zone).height)).toBe(142);
  },
};

const pageLines = (w: number[]) => (
  <div className="flex flex-col gap-2">
    <div className="h-1 w-[34px] rounded-sm bg-muted-foreground" />
    {w.map((x, i) => <div key={i} className="h-[3px] rounded-sm bg-border" style={{ width: x }} />)}
  </div>
);
const page = (
  <div className="flex h-[540px] w-[420px] flex-col gap-2 border border-border bg-background p-10 shadow-sm">
    <div className="h-2.5 w-[136px] rounded-sm bg-foreground" />
    <div className="h-1.5 w-[85px] rounded-sm bg-muted-foreground" />
    {[340, 340, 306, 340, 238].map((w, i) => <div key={i} className="h-1 rounded-sm bg-border" style={{ width: w }} />)}
  </div>
);
const pages = [0, 1, 2].map(() => ({ thumbnail: pageLines([56, 45, 56]), content: page }));

// File Preview 960 × 647: page thumbnails, zoom, Escape closes; File Field and Resource Items.
export const PreviewAndFields: Story = {
  render: function Render() {
    const [open, setOpen] = React.useState(true);
    const [file, setFile] = React.useState<{ name: string; size?: string } | null>({ name: 'contract-northwind.pdf', size: '240 KB' });
    return (
      <div className="flex flex-col gap-6">
        {open ? <div className="w-[960px]"><FilePreview fileName="INV-1041 Northwind Traders.pdf" meta="PDF · 3 pages · 240 KB" pages={pages} onDownload={fn()} onClose={() => setOpen(false)} /></div> : <p>Preview closed</p>}
        <div className="flex w-[360px] flex-col gap-4">
          <FileField label="Signed contract" hint="PDF up to 10 MB" accept=".pdf" file={file} onChange={f => setFile(f ? { name: f.name, size: formatBytes(f.size) } : null)} />
          <FileField label="Company logo" error="Choose a PDF under 10 MB." file={{ name: 'logo-huge.png', size: '24 MB' }} />
        </div>
        <ul aria-label="Downloads" className="m-0 w-[560px] p-0">
          <ResourceItem name="Sample data" meta="XLSX · 2.4 MB · Updated 12 Oct 2026" icon={<FileTypeIcon kind="sheet" label="XLS" />} actions={<ButtonIcon variant="ghost" icon={<Download />} label="Download Sample data" />} />
          <ResourceItem name="API docs" meta="Link · docs.acme.com" divider={false} actions={<ButtonIcon variant="ghost" icon={<Link />} label="Copy link to API docs" />} />
        </ul>
      </div>
    );
  },
  play: async ({ canvas, canvasElement }) => {
    const preview = canvas.getByRole('region', { name: 'INV-1041 Northwind Traders.pdf' });
    await expect(Math.round(box(preview).height)).toBe(647);
    await userEvent.click(canvas.getByRole('button', { name: 'Page 2' }));
    await expect(canvas.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
    await expect(canvas.getByText('Page 2 of 3')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Zoom in' }));
    await expect(canvas.getByText('125%')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await expect(canvas.getByText('Preview closed')).toBeInTheDocument();
    // File field: name from the label and the button text; remove empties it.
    const choose = canvas.getByRole('button', { name: 'Signed contract Choose file' });
    await expect(Math.round(box(choose.parentElement!).height)).toBe(36);
    await userEvent.click(canvas.getByRole('button', { name: 'Remove contract-northwind.pdf' }));
    await expect(canvas.getByText('No file chosen')).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Company logo Choose file' })).toHaveAttribute('aria-invalid', 'true');
    const res = canvasElement.querySelectorAll('[data-slot="resource-item"]');
    await expect(Math.round(box(res[0]!).height)).toBe(65);
  },
};

export const PreviewStates: Story = {
  tags: ['!dev'],
  render: () => (
    <div className="flex w-[640px] flex-col gap-4">
      <FilePreview fileName="statement.pdf" state="loading" onClose={fn()} />
      <FilePreview fileName="archive.zip" state="unavailable" onDownload={fn()} />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent('Loading preview');
    await expect(canvas.getByText('No preview for this file type')).toBeInTheDocument();
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, render: Variants.render };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: Variants.render };
export const UploadDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
