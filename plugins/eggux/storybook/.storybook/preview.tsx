import type { Preview } from '@storybook/react-vite';
import { viewportOptions } from '../src/styles/breakpoints';
import '../src/styles/globals.css';
// Self-hosted fonts (the families in tokens.css), bundled with the Storybook build.
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/500.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';
import '@fontsource/plus-jakarta-sans/800.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/roboto-mono/400.css';
import '@fontsource/roboto-mono/500.css';

// Wait for the fonts before a story renders, so sizes measured in play functions and in
// Chromatic snapshots never use a fallback font. Fonts load on first use, so ask for each one.
const fontFaces = [
  ...[400, 500, 600, 700, 800].map(w => `${w} 1em "Plus Jakarta Sans"`),
  ...[400, 500, 600, 700].map(w => `${w} 1em "Inter"`),
  ...[400, 500].map(w => `${w} 1em "Roboto Mono"`),
];
const loadFonts = async () => {
  await Promise.all(fontFaces.map(face => document.fonts.load(face).catch(() => [])));
  await document.fonts.ready;
  return {};
};

// Chromatic starts a story's play function right after the first render and takes its snapshot
// from the end state. A CSS transition would still be halfway when a play function reads a color
// or an opacity ("rgb(106, 146, 233)" instead of the focus color), so transitions are off there,
// as in the vitest run (.storybook/vitest.setup.ts). Animations stay on.
if (typeof navigator !== 'undefined' && /Chromatic/i.test(navigator.userAgent)) {
  const style = document.createElement('style');
  style.dataset.test = 'no-transitions';
  style.textContent = '*, *::before, *::after { transition: none !important; }';
  document.head.appendChild(style);
}

// A theme is two choices, the way the Figma modes are used together:
//   Scheme: light or dark.
//   Look: Platform (the default: pill controls, what customers see), Back office (the Corporate
//   modes: square controls, small radius, Inter; pair it with Density compact) or Showcase (a
//   brand re-aliasing the same tokens).
// They map to classes on <html>: `dark`, `theme-corporate`, `theme-showcase` (tokens.css has one
// block per class, so the two combine). Density is a third toolbar (`density-compact`).
// Stories and links can still set the old combined name (`globals: { theme: 'Corporate Dark' }`):
// it wins over the two selectors, which keeps every theme copy story working.
const looks: Record<string, string> = { platform: '', 'back-office': 'theme-corporate', showcase: 'theme-showcase' };
const combined: Record<string, [string, string]> = {
  Light: ['light', 'platform'],
  Dark: ['dark', 'platform'],
  'Corporate Light': ['light', 'back-office'],
  'Corporate Dark': ['dark', 'back-office'],
  'Showcase Light': ['light', 'showcase'],
  'Showcase Dark': ['dark', 'showcase'],
};

// Sizes come from src/styles/breakpoints.ts (the same list as Foundations / Breakpoints).
const preview: Preview = {
  parameters: {
    layout: 'centered',
    viewport: { options: viewportOptions },
    // Technical props (handlers, asChild, className, style, ref, dir) never show in Controls.
    controls: { expanded: true, matchers: { color: /(background|color)$/i }, exclude: /^(on[A-Z]\w*|asChild|className|style|ref|dir)$/ },
    // Accessibility violations fail the story test (vitest) and show in the a11y panel.
    a11y: { test: 'error' },
    backgrounds: { disable: true },
    options: {
      // Sidebar: Introduction, Foundations, Components, Blocks, Pages in that order, then every
      // group and component A-Z. Stories inside one component keep the order of their file (Default first).
      // Storybook reads this function as plain JavaScript from the source: no TypeScript-only
      // syntax (no `!`, `as`, type annotations) and nothing from outside it.
      storySort: (a, b) => {
        const pinned = ['Introduction', 'Foundations', 'Components', 'Blocks', 'Pages'];
        const pa = a.title.split('/');
        const pb = b.title.split('/');
        const ra = pinned.indexOf(pa[0] ?? '');
        const rb = pinned.indexOf(pb[0] ?? '');
        if (ra !== rb) return (ra === -1 ? pinned.length : ra) - (rb === -1 ? pinned.length : rb);
        for (let i = 0; i < Math.min(pa.length, pb.length); i++) {
          const c = (pa[i] ?? '').localeCompare(pb[i] ?? '', 'en', { sensitivity: 'base', numeric: true });
          if (c !== 0) return c;
        }
        return pa.length - pb.length;
      },
    },
  },
  globalTypes: {
    scheme: {
      description: 'Color scheme',
      toolbar: {
        title: 'Scheme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
    look: {
      description: 'Look: which surface and brand the tokens describe',
      toolbar: {
        title: 'Look',
        icon: 'paintbrush',
        items: [
          { value: 'platform', title: 'Platform' },
          { value: 'back-office', title: 'Back office' },
          { value: 'showcase', title: 'Showcase (brand)' },
        ],
        dynamicTitle: true,
      },
    },
    // The old combined name, set by stories and links only (no toolbar item).
    theme: { description: 'Combined theme (stories and links)' },
    density: {
      description: 'Density (Figma Density collection)',
      toolbar: { title: 'Density', icon: 'component', items: ['comfortable', 'compact'], dynamicTitle: true },
    },
  },
  loaders: [loadFonts],
  initialGlobals: { scheme: 'light', look: 'platform', density: 'comfortable' },
  // Controls show only what a designer can change: text, numbers, switches and choices.
  // Props that are functions, React nodes, arrays or objects (raw JSON editors) are hidden, unless
  // the story gives them a text or number value, which then gets a plain field. A story that sets
  // its own `control` keeps it.
  argTypesEnhancers: [
    context => {
      const out: typeof context.argTypes = {};
      for (const [key, argType] of Object.entries(context.argTypes)) {
        const initial = context.initialArgs?.[key];
        const name = argType.type && typeof argType.type === 'object' ? argType.type.name : argType.type;
        const summary = String(argType.table?.type?.summary ?? '');
        const complex =
          name === 'function' || name === 'array' || name === 'object' || name === 'other' || /ReactNode|ReactElement|JSX|=>|\[\]|\{/.test(summary);
        if (argType.control !== undefined || !complex) out[key] = argType;
        else if (typeof initial === 'string') out[key] = { ...argType, control: 'text' };
        else if (typeof initial === 'number') out[key] = { ...argType, control: 'number' };
        else if (typeof initial === 'boolean') out[key] = { ...argType, control: 'boolean' };
        else out[key] = { ...argType, control: false, table: { ...argType.table, disable: true } };
      }
      return out;
    },
  ],
  decorators: [
    (Story, ctx) => {
      const pair = ctx.globals.theme ? combined[String(ctx.globals.theme)] : undefined;
      const scheme = pair ? pair[0] : String(ctx.globals.scheme ?? 'light');
      const look = pair ? pair[1] : String(ctx.globals.look ?? 'platform');
      const root = document.documentElement;
      root.classList.remove('dark', 'theme-corporate', 'theme-showcase');
      if (looks[look]) root.classList.add(looks[look]!);
      if (scheme === 'dark') root.classList.add('dark');
      return <Story />;
    },
    (Story, ctx) => {
      document.documentElement.classList.toggle('density-compact', ctx.globals.density === 'compact');
      return <Story />;
    },
  ],
};
export default preview;
