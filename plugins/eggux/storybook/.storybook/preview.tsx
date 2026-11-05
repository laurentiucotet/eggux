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
