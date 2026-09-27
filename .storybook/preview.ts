import type { Preview } from '@storybook/react-vite';
import '../src/styles/index.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    backgrounds: { disable: true },
    options: {
      storySort: {
        order: [
          'Introduction',
          'Foundations',
          ['Colour', 'Typography', 'Space and shape', 'Writing'],
          'Layout',
          ['Page archetypes', 'Across the ecosystem'],
          'Components',
          [
            'Button', 'Icon', 'Field', 'Select', 'Checkbox',
            'Segmented control', 'Tabs',
            'Plate', 'Dialog',
            'Toast', 'Banner', 'Chip', 'Tag',
            'Data table', 'Stat row', 'Bar chart', 'Empty state', 'Empty chart',
            'Flow diagram',
          ],
          'Canvas',
        ],
      },
    },
  },

  globalTypes: {
    theme: {
      description: 'Which climate the story renders in',
      toolbar: {
        title: 'Theme',
        icon: 'contrast',
        items: [
          { value: 'light', title: 'Daylight' },
          { value: 'dark', title: 'Winter night' },
        ],
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: { theme: 'light' },

  decorators: [
    (Story, context) => {
      const theme = String(context.globals.theme ?? 'light');
      document.documentElement.setAttribute('data-theme', theme);
      // React Flow reads .dark on an ancestor; tokens.css treats it as an alias.
      document.documentElement.classList.toggle('dark', theme === 'dark');
      return Story();
    },
  ],
};

export default preview;
