import type { Meta, StoryObj } from '@storybook/react-vite';
import { Banner } from './Banner';

const meta = {
  title: 'Components/Banner',
  component: Banner,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A notice about the page or the data on it: cached figures, a missing setting, sample ' +
          'data. It sits under the page head, above what it is about. Paper and a hairline, with ' +
          'the tone on a 3px left edge and in the icon — the grammar of the toast and the error ' +
          'plate. One banner per page; if it names a fix, it links to it.',
      },
    },
  },
  args: {
    tone: 'warning',
    title: 'Figures are from the 06:00 sweep',
    children: (
      <>Statbank has not answered since, so this page shows cached data. <a href="#source">Check the source</a></>
    ),
  },
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Warning: Story = {};

export const Info: Story = {
  args: {
    tone: 'info',
    title: 'This is a sample workspace',
    children: 'The graphs here run on last year\'s figures, so you can try every step without touching live data.',
    onDismiss: () => {},
  },
};

export const Danger: Story = {
  args: {
    tone: 'danger',
    title: 'Scheduled runs are paused',
    children: <>The Statbank credentials expired on 3 September. <a href="#credentials">Renew them</a> to resume the queue.</>,
  },
};

export const Success: Story = {
  args: {
    tone: 'success',
    title: 'All sources answered this morning',
    children: 'Twelve sources, 1.28M rows, no retries.',
    onDismiss: () => {},
  },
};
