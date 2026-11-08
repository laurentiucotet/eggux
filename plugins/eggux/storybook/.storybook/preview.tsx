import type { Preview } from '@storybook/react-vite';
import { withThemeByClassName } from '@storybook/addon-themes';
import '../src/styles/globals.css';

// Themes match the Figma modes of the Semantic collection; Density is a second toolbar.
const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: { expanded: true, matchers: { color: /(background|color)$/i } },
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
  initialGlobals: { density: 'comfortable' },
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
