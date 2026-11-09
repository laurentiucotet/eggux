import type { Preview } from '@storybook/react-vite';
import { withThemeByClassName } from '@storybook/addon-themes';
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

// Themes match the Figma modes of the Semantic collection; Density is a second toolbar.
const preview: Preview = {
  parameters: {
    layout: 'centered',
    // Technical props (handlers, asChild, className, style, ref, dir) never show in Controls.
    controls: { expanded: true, matchers: { color: /(background|color)$/i }, exclude: /^(on[A-Z]\w*|asChild|className|style|ref|dir)$/ },
    // Accessibility violations fail the story test (vitest) and show in the a11y panel.
    a11y: { test: 'error' },
    backgrounds: { disable: true },
    options: {
      // Sidebar: Introduction and Foundations first, then every section, group and component
      // A-Z. Stories inside one component keep the order of their file (Default first).
      // Storybook reads this function as plain JavaScript from the source: no TypeScript-only
      // syntax (no `!`, `as`, type annotations) and nothing from outside it.
      storySort: (a, b) => {
        const pinned = ['Introduction', 'Foundations'];
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
    density: {
      description: 'Density (Figma Density collection)',
      toolbar: { title: 'Density', icon: 'component', items: ['comfortable', 'compact'], dynamicTitle: true },
    },
  },
  loaders: [loadFonts],
  initialGlobals: { density: 'comfortable' },
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
    withThemeByClassName({
      themes: {
        Light: '',
        Dark: 'dark',
        'Corporate Light': 'theme-corporate',
        'Corporate Dark': 'theme-corporate dark',
        'Showcase Light': 'theme-showcase',
        'Showcase Dark': 'theme-showcase dark',
      },
      defaultTheme: 'Light',
    }),
    (Story, ctx) => {
      document.documentElement.classList.toggle('density-compact', ctx.globals.density === 'compact');
      return <Story />;
    },
  ],
};
export default preview;
