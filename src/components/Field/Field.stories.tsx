import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field } from './Field';

const meta = {
  title: 'Components/Field',
  component: Field,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Label above the input, always visible. Helper text is present from the start ' +
          'wherever a format is required, rather than appearing only after someone gets it ' +
          'wrong. Errors say what to do next, not that something is invalid.',
      },
    },
  },
  args: { label: 'Region', placeholder: 'Hovedstaden' },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHelp: Story = {
  name: 'With help',
  args: {
    label: 'Table',
    placeholder: 'FOLK1A',
    help: 'The Statbank table ID, for example FOLK1A or BEV3A.',
  },
};

export const Invalid: Story = {
  args: {
    label: 'Table',
    defaultValue: 'FOLK-1A',
    invalid: true,
    help: 'No table called FOLK-1A. IDs have no hyphen — try FOLK1A.',
  },
};

export const Disabled: Story = {
  args: { label: 'Region', defaultValue: 'Hovedstaden', disabled: true },
};

/** The icon comes from a wrapper, so no padding utility can put it on top of the text. */
export const WithIcon: Story = {
  name: 'With an icon',
  args: { label: 'Search graphs', icon: 'search', type: 'search', placeholder: 'Name or table ID' },
};
