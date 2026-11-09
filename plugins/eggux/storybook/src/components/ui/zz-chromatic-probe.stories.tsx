// TEMPORARY: diagnostics for Chromatic's capture browser (focus and Toast timing). Hidden from the
// sidebar and from vitest; it always throws so Chromatic shows the report as the error message.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, waitFor } from 'storybook/test';
import { Toast, ToastProvider, ToastViewport } from './toast';

const meta = { title: 'Debug/Chromatic probe', tags: ['!dev', '!test', '!autodocs'] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const describe = (el: Element | null) => (el ? `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${el.getAttribute('aria-label') ? '[' + el.getAttribute('aria-label') + ']' : ''}${el.getAttribute('data-slot') ? '{' + el.getAttribute('data-slot') + '}' : ''}` : 'null');

export const FocusProbe: Story = {
  render: () => (
    <div>
      <textarea aria-label="Probe note" />
      <button type="button">Next</button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const report: Record<string, unknown> = {};
    report.hasFocus = document.hasFocus();
    report.visibility = document.visibilityState;
    report.activeBefore = describe(document.activeElement);
    const tabbables = Array.from(document.querySelectorAll<HTMLElement>('a[href],button,input,textarea,select,[tabindex]')).filter(e => e.tabIndex >= 0).slice(0, 6).map(describe);
    report.firstTabbables = tabbables;
    await userEvent.tab();
    report.activeAfterTab = describe(document.activeElement);
    const box = canvasElement.querySelector('textarea')!;
    box.blur();
    box.focus();
    report.activeAfterFocusCall = describe(document.activeElement);
    let focusEvent = false;
    const btn = canvasElement.querySelector('button')!;
    btn.addEventListener('focus', () => { focusEvent = true; });
    btn.focus();
    report.focusEventFired = focusEvent;
    await userEvent.click(box);
    report.activeAfterClick = describe(document.activeElement);
    report.ua = navigator.userAgent;
    report.lang = navigator.language;
    report.tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    report.size = `${innerWidth}x${innerHeight}`;
    throw new Error('PROBE ' + JSON.stringify(report));
  },
};

export const ToastProbe: Story = {
  render: () => (
    <ToastProvider>
      <div style={{ width: 384 }}>
        <Toast defaultOpen duration={Infinity} title="Changes saved" />
        <ToastViewport className="static! inset-auto! w-full! translate-x-0! p-0!" />
      </div>
    </ToastProvider>
  ),
  play: async ({ canvasElement }) => {
    const report: Record<string, unknown> = {};
    const find = () => canvasElement.querySelector('[data-slot="toast"]');
    report.immediate = !!find();
    report.anywhereInDocument = !!document.querySelector('[data-slot="toast"]');
    const t0 = performance.now();
    try {
      await waitFor(() => { if (!find()) throw new Error('no toast'); }, { timeout: 3000 });
      report.foundAfterMs = Math.round(performance.now() - t0);
    } catch {
      report.foundAfterMs = 'never (3 s)';
    }
    const vp = canvasElement.querySelector('ol, [role="region"]');
    report.viewport = describe(vp);
    report.viewportHtml = (vp?.outerHTML ?? '').slice(0, 300);
    report.hasFocus = document.hasFocus();
    report.visibility = document.visibilityState;
    throw new Error('PROBE ' + JSON.stringify(report));
  },
};
