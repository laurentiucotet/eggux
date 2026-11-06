// Runs before the story tests (npm test only, never in the Storybook UI).
// Theme copies switch the theme class right before their play function; colors with a CSS
// transition would still be halfway and fail exact color checks. Tests read end states, so
// transitions are off. Animations (spinner, skeleton pulse) stay on: some tests check them.
const style = document.createElement('style');
style.dataset.test = 'no-transitions';
style.textContent = '*, *::before, *::after { transition: none !important; }';
document.head.appendChild(style);
