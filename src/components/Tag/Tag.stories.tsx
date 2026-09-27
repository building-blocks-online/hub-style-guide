import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tag, TagList } from './Tag';
import { Chip } from '../Chip/Chip';

const meta = {
  title: 'Components/Tag',
  component: Tag,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A category — a client, a segment, a type, a goal. A chip says what state something ' +
          'is in; a tag says what kind of thing it is. Squarer than a chip, lined, never filled ' +
          'and never coloured. At most three on a row or card, then "+n"; the full set belongs ' +
          'on the thing\'s own page. Not a button and not a filter.',
      },
    },
  },
  args: { children: 'Commercial' },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Overflow: Story = {
  name: 'Three, then +n',
  render: () => (
    <TagList
      label="Goals"
      tags={['Track population', 'Compare regions', 'Spot outliers', 'Share weekly', 'Keep every run']}
    />
  ),
};

export const BesideStatus: Story = {
  name: 'Beside a status',
  render: () => (
    <div className="hub-row">
      <b style={{ fontWeight: 500 }}>Population by region</b>
      <Tag>Statbank</Tag>
      <Tag>Weekly</Tag>
      <Chip status="ok">Finished</Chip>
    </div>
  ),
};
