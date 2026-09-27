import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyChart } from './EmptyChart';
import { Button } from '../Button/Button';

const meta = {
  title: 'Components/Empty chart',
  component: EmptyChart,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A chart with no data keeps its frame: the floor and faint gridlines at the chart\'s ' +
          'real height, with one line and one action on paper in the middle. The page does not ' +
          'jump when data arrives, and the reader learns what will be drawn here. Never a grey ' +
          'rectangle.',
      },
    },
  },
  args: {
    title: 'No runs this week yet',
    body: 'The chart draws once the first scheduled run has finished, at 06:00.',
    action: <Button variant="ghost">Run now</Button>,
  },
} satisfies Meta<typeof EmptyChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InARegion: Story = {
  name: 'In a region',
  render: (args) => (
    <div className="hub-region" style={{ background: 'var(--hub-color-surface)', border: '1px solid var(--hub-color-line)', borderRadius: 'var(--hub-radius-sheet)' }}>
      <div className="hub-region__head"><div><h2>Runs per day</h2><p>This week</p></div></div>
      <EmptyChart {...args} />
    </div>
  ),
};
