import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlowDiagram } from './FlowDiagram';

const meta = {
  title: 'Components/Flow diagram',
  component: FlowDiagram,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'For explaining, not editing: how an app fits the family, how a run moves, how a ' +
          'grade is earned. Nodes of one width in one row, joined by hairline edges; the node ' +
          'the reader is looking at is inverted to ink. A cycle says so in words under the row. ' +
          'Five nodes at most — anything that needs editing or more nodes is a React Flow canvas.',
      },
    },
  },
  args: {
    label: 'Where graphs sit',
    steps: [
      { name: 'Statbank', note: 'Where the numbers come from' },
      { name: 'Graphs', note: 'Clean and join them', current: true },
      { name: 'Dashboards', note: 'Where people read them' },
    ],
    caption: 'Sources are read-only. This app owns the graphs, and dashboards read from them.',
  },
} satisfies Meta<typeof FlowDiagram>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WhereThisAppSits: Story = { name: 'Where this app sits' };

export const ALoop: Story = {
  name: 'A loop',
  args: {
    label: 'How a sweep works',
    steps: [
      { name: 'Fetch', note: 'Read every source' },
      { name: 'Check', note: 'Compare with last run' },
      { name: 'Publish', note: 'Update the dashboards' },
      { name: 'Watch', note: 'Flag what moved' },
    ],
    loopsTo: 'Fetch, at 06:00 tomorrow',
    caption: undefined,
  },
};

export const WithTone: Story = {
  name: 'With tone',
  args: {
    label: 'How a figure earns trust',
    steps: [
      { name: 'Draft', note: 'Someone believes it', tone: 'warning' },
      { name: 'Sourced', note: 'A table backs it' },
      { name: 'Checked', note: 'A person accepted it', tone: 'success' },
    ],
    caption: 'Only a checked figure reaches a dashboard.',
  },
};
