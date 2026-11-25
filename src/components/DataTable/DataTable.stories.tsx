import type { Meta, StoryObj } from '@storybook/react-vite';
import { DataTable } from './DataTable';
import { Chip } from '../Chip/Chip';
import { Plate } from '../Plate/Plate';

const meta = {
  title: 'Components/Data table',
  component: DataTable,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'No zebra striping — the hairline already separates rows. Numeric columns are ' +
          'right-aligned with tabular figures so digits stack. Mono is for characters that ' +
          'must line up, never for labels that want to look technical. On a phone the table ' +
          'scrolls sideways inside its own container so the page never does; above 720px ' +
          'it does not, so the header can pin under the bar. Set `wide` only for a table ' +
          'too wide for a laptop: it always scrolls sideways and its header scrolls away.',
      },
    },
  },
  // A table lives on a plate; hairlines alone over the sky read as floating.
  decorators: [
    (Story) => (
      <Plate style={{ width: '100%' }}>
        <div style={{ width: '100%' }}><Story /></div>
      </Plate>
    ),
  ],
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

const nf = new Intl.NumberFormat('da-DK');

export const Default: Story = {
  args: {
    caption: 'Example rows modelled on Statbank FOLK1A. Not live figures.',
    columns: [
      { key: 'region', label: 'Region' },
      { key: 'code', label: 'Code', mono: true },
      { key: 'people', label: 'People', numeric: true },
      { key: 'share', label: 'Share', numeric: true },
    ],
    rows: [
      { region: 'Hovedstaden', code: '1084', people: nf.format(1895000), share: '31,9 %' },
      { region: 'Midtjylland', code: '1082', people: nf.format(1364000), share: '23,0 %' },
      { region: 'Syddanmark', code: '1083', people: nf.format(1230000), share: '20,7 %' },
      { region: 'Sjælland', code: '1085', people: nf.format(851000), share: '14,3 %' },
      { region: 'Nordjylland', code: '1081', people: nf.format(600000), share: '10,1 %' },
    ],
  },
};

/** Status belongs in the row as form and colour, not as a bare coloured word. */
export const WithStatus: Story = {
  name: 'With status',
  args: {
    caption: 'Example rows. Not live figures.',
    columns: [
      { key: 'graph', label: 'Graph' },
      { key: 'ran', label: 'Last run', mono: true },
      { key: 'rows', label: 'Rows', numeric: true },
      { key: 'status', label: 'Status' },
    ],
    rows: [
      { graph: 'Population by region', ran: '2026-09-03 06:00', rows: nf.format(5940000), status: <Chip status="ok">Running</Chip> },
      { graph: 'Housing starts', ran: '2026-09-02 06:00', rows: nf.format(18422), status: <Chip status="warn">Stale data</Chip> },
      { graph: 'Commuting flows', ran: '2026-08-28 06:00', rows: nf.format(0), status: <Chip status="fail">Timed out</Chip> },
      { graph: 'Energy mix', ran: '—', rows: nf.format(0), status: <Chip>Draft</Chip> },
    ],
  },
};
