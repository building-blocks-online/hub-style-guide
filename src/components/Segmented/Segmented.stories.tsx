import type { Meta, StoryObj } from '@storybook/react-vite';
import { Segmented, THEME_OPTIONS } from './Segmented';

const meta = {
  title: 'Components/Segmented control',
  component: Segmented,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A choice of parameter: a time range, a unit, the theme. It changes how the same ' +
          'content is shown. If the choice switches to different content, it is tabs — and tabs ' +
          'are underlined, so the two never look alike. The selected option is the ink block, the ' +
          'same "here" as the current nav item. Labels never wrap; below 720px the control takes ' +
          'its own row.',
      },
    },
  },
  args: {
    label: 'Time range',
    defaultValue: '30',
    options: [
      { value: '7', label: '7 days' },
      { value: '30', label: '30 days' },
      { value: '90', label: '90 days' },
    ],
  },
} satisfies Meta<typeof Segmented>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TimeRange: Story = { name: 'Time range' };

export const Theme: Story = {
  name: 'Theme (every app)',
  args: { label: 'Theme', defaultValue: 'system', options: THEME_OPTIONS },
};
