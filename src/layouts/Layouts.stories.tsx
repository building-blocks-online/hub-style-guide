import { useState } from 'react';
import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ReactFlow, Background, BackgroundVariant, Controls, MiniMap } from '@xyflow/react';
import type { Edge } from '@xyflow/react';
import { nodeTypes } from '../components/Canvas/HubNode';
import type { HubFlowNode } from '../components/Canvas/HubNode';
import { Button } from '../components/Button/Button';
import { Select } from '../components/Select/Select';
import { Field } from '../components/Field/Field';
import { Chip } from '../components/Chip/Chip';
import { DataTable } from '../components/DataTable/DataTable';
import { StatRow } from '../components/StatRow/StatRow';
import { BarChart } from '../components/BarChart/BarChart';
import { Icon } from '../components/Icon/Icon';
import { AppMark, AppSwitcher, HelpButton, Person } from '../components/Ecosystem/Ecosystem';
import { FAMILY } from '../components/Ecosystem/family';
import '../components/Canvas/canvas.css';

const nf = new Intl.NumberFormat('da-DK');

const MENU: [group: string, items: [label: string, icon: string][]][] = [
  ['Main', [['Overview', 'grid-alt'], ['Sources', 'data'], ['Runs', 'time-five'], ['Hierarchies', 'sitemap']]],
  ['Insight', [['Dashboards', 'bar-chart-alt-2'], ['Trends', 'trending-up']]],
  ['Admin', [['Reports', 'file'], ['Settings', 'cog']]],
];

/** The sheet: sidebar, bar with breadcrumb and tools, and the page inside. */
function Shell({ children, current, crumb }: { children: ReactNode; current: string; crumb: string }) {
  return (
    <div className="hub-shell hub-shell--framed">
      <aside className="hub-shell__nav">
        <div className="hub-shell__brand"><AppMark glyph="git-branch" name="Graphs" />Graphs</div>
        <nav className="hub-shell__menu" aria-label="Sections">
          {MENU.map(([group, items]) => (
            <div key={group} style={{ display: 'contents' }}>
              <span className="hub-nav-group">{group}</span>
              {items.map(([label, icon]) => (
                <a key={label} className="hub-nav-item" href="#main" aria-current={label === current ? 'page' : undefined}>
                  <Icon name={icon} />{label}
                </a>
              ))}
            </div>
          ))}
        </nav>
        <Person name="Ulrich K." role="Owner" />
      </aside>

      <div className="hub-shell__bar">
        <div className="hub-crumb"><span>{crumb}</span><i /><b>{current}</b></div>
        <div className="hub-shell__tools">
          <span className="hub-search"><Icon name="search" />Search</span>
          <Button variant="round" aria-label="Notifications"><Icon name="bell" /></Button>
          <AppSwitcher apps={FAMILY} current="graphs" />
          <button type="button" className="hub-avatar" aria-label="Account menu">UK</button>
        </div>
      </div>

      <main className="hub-shell__main" id="main">{children}</main>
      <HelpButton />
    </div>
  );
}

const meta = {
  title: 'Layout/Page archetypes',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'An app is one white sheet on a flat ground. Regions inside it touch and are divided ' +
          'by hairlines, never by gaps or shadows. Almost every screen is one of four archetypes; ' +
          'the CSS lives in the skill next to the tokens (`references/layout.css`), so these ' +
          'stories and the guidance Claude loads cannot drift apart. Resize to see the two ' +
          'breakpoints: 720px turns the nav into a drawer, 1100px turns the inspector into an overlay.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/**
 * Summary first, then detail. The stat row is four cells that touch; the
 * split below it is unequal on purpose and divided by a line, not a gap.
 */
export const DashboardPage: Story = {
  name: 'Dashboard page',
  render: () => (
    <Shell current="Overview" crumb="Dashboards">
      <div className="hub-page--dashboard" data-density="compact">
        <div className="hub-region">
          <div className="hub-page__head">
            <div>
              <h1 className="hub-page__title">Overview</h1>
              <p className="hub-caption" style={{ marginTop: 6 }}>Thursday 4 September, the 06:00 sweep finished</p>
            </div>
            <div className="hub-row">
              <Button variant="primary"><Icon name="upload" />New upload</Button>
              <Button variant="ghost"><Icon name="link" />Connect a source</Button>
            </div>
          </div>
        </div>

        <StatRow
          stats={[
            { label: 'Runs today', value: '34', note: '+6 vs yesterday', icon: 'time-five', gauge: 0.85 },
            { label: 'Rows ingested', value: '1.28M', note: '+18.2% vs last week', icon: 'list-ul', gauge: 0.64 },
            { label: 'Sources connected', value: '12', note: '+2 this week', icon: 'plus-circle', gauge: 0.8 },
            { label: 'Failure rate', value: '5.9%', note: '−0.8% vs last month', icon: 'error', gauge: 0.06, attention: true },
          ]}
        />

        <div className="hub-page__split">
          <div className="hub-region">
            <div className="hub-region__head">
              <div><h2>Runs per day</h2><p>This week</p></div>
              <Button variant="round" aria-label="More"><Icon name="dots-horizontal-rounded" /></Button>
            </div>
            <BarChart
              data={[28, 31, 24, 33, 36, 34, 0]}
              labels={{ 0: 'Mon', 1: 'Tue', 2: 'Wed', 3: 'Thu', 4: 'Fri', 5: 'Sat', 6: 'Sun' }}
              accentIndex={4}
              ariaLabel="Runs per day this week: 28, 31, 24, 33, 36 on Friday, 34 on Saturday, none on Sunday."
            />
          </div>
          <div className="hub-region">
            <div className="hub-region__head">
              <div><h2>Needs attention</h2><p>3 sources</p></div>
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {[
                ['Boligbyggeri', 'Timed out twice. Try a narrower region filter.', 'time-five'],
                ['Energimix', 'Statbank last answered 28 August.', 'list-ul'],
                ['Ledige stillinger', 'Credentials expire in 6 days.', 'link'],
              ].map(([name, why, icon], i, all) => (
                <li key={name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i === all.length - 1 ? 'none' : '1px solid var(--hub-color-line)' }}>
                  <span className="hub-avatar" style={{ borderRadius: 10, width: 40, height: 40 }}><Icon name={icon} /></span>
                  <span><b style={{ display: 'block', fontWeight: 500 }}>{name}</b><span className="hub-caption">{why}</span></span>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 'var(--hub-space-3)' }}><Button variant="ghost">Review sources</Button></div>
          </div>
        </div>

        <div className="hub-region">
          <div className="hub-region__head">
            <div><h2>Recent runs</h2><p>Latest five</p></div>
            <Button variant="ghost">View all</Button>
          </div>
          <DataTable
            caption="Example rows. Not live figures."
            columns={[
              { key: 'source', label: 'Source' },
              { key: 'run', label: 'Run', mono: true },
              { key: 'table', label: 'Table', mono: true },
              { key: 'status', label: 'Status' },
              { key: 'rows', label: 'Rows', numeric: true },
            ]}
            rows={[
              { source: 'Befolkning, region', run: 'r_9f21c4', table: 'FOLK1A', status: <Chip status="ok">Finished</Chip>, rows: nf.format(5940000) },
              { source: 'Pendling', run: 'r_c48e02', table: 'PEND100', status: <Chip status="info">Running</Chip>, rows: nf.format(902311) },
              { source: 'Energimix', run: 'r_7b1d55', table: 'ENE2HA', status: <Chip status="warn">Stale data</Chip>, rows: nf.format(4410) },
              { source: 'Boligbyggeri', run: 'r_3a17bd', table: 'BYGV80', status: <Chip status="fail">Timed out</Chip>, rows: nf.format(18422) },
              { source: 'Befolkning, kommune', run: 'r_e02a91', table: 'FOLK1A', status: <Chip>Draft</Chip>, rows: nf.format(1284902) },
            ]}
          />
        </div>
      </div>
    </Shell>
  ),
};

/** Dense and scanned. The table header sticks under the bar; the page header does not. */
export const TablePage: Story = {
  name: 'Table page',
  render: () => (
    <Shell current="Runs" crumb="Main">
      <div className="hub-page--table" data-density="compact">
        <div className="hub-page__head">
          <h1 className="hub-page__title">Runs</h1>
          <div className="hub-row">
            <Button variant="primary"><Icon name="upload" />New upload</Button>
            <Button variant="ghost">Import</Button>
          </div>
        </div>
        <div className="hub-toolbar">
          <Select label="Region" placeholder="All regions" options={[{ value: '1084', label: 'Hovedstaden' }, { value: '1082', label: 'Midtjylland' }, { value: '1083', label: 'Syddanmark' }]} />
          <Select label="Status" placeholder="Any" options={[{ value: 'ok', label: 'Finished' }, { value: 'warn', label: 'Stale' }, { value: 'fail', label: 'Failing' }]} />
          <Field label="Search" placeholder="Name or table ID" />
        </div>
        <DataTable
          caption="Example rows. Not live figures."
          columns={[
            { key: 'name', label: 'Graph' },
            { key: 'table', label: 'Source', mono: true },
            { key: 'rows', label: 'Rows', numeric: true },
            { key: 'ran', label: 'Last run', mono: true },
            { key: 'status', label: 'Status' },
          ]}
          rows={Array.from({ length: 14 }, (_, i) => ({
            name: ['Population by region', 'Housing starts', 'Commuting flows', 'Energy mix'][i % 4],
            table: ['FOLK1A', 'BYGV80', 'PEND100', 'ENE2HA'][i % 4],
            rows: nf.format([5940000, 18422, 902311, 4410][i % 4]),
            ran: `2026-09-${String(3 - (i % 3)).padStart(2, '0')} 06:00`,
            status: [<Chip key="a" status="ok">Finished</Chip>, <Chip key="b" status="warn">Stale data</Chip>, <Chip key="c" status="fail">Timed out</Chip>, <Chip key="d">Draft</Chip>][i % 4],
          }))}
        />
      </div>
    </Shell>
  ),
};

/** One column, generous; text held at 66ch; sections open on a hairline. */
export const ReadingPage: Story = {
  name: 'Reading page',
  render: () => (
    <Shell current="Settings" crumb="Admin">
      <div className="hub-page--reading">
        <div className="hub-page__head">
          <h1 className="hub-page__title">Settings</h1>
          <Button variant="primary">Save changes</Button>
        </div>
        <section className="hub-section">
          <div className="hub-section__head"><h2 className="hub-subtitle">Workspace</h2><span className="hub-caption hub-code">3 members</span></div>
          <div className="hub-stack">
            <p className="hub-body">Everything in this workspace shares one set of credentials for Statbank and one schedule queue. Splitting a project out later means re-authorising its sources, so it is worth deciding now.</p>
            <Field label="Workspace name" defaultValue="Forte Advice" />
          </div>
        </section>
        <section className="hub-section">
          <div className="hub-section__head"><h2 className="hub-subtitle">Deletion</h2><span className="hub-caption hub-code">irreversible</span></div>
          <div className="hub-stack">
            <p className="hub-body">Deleting the workspace removes every graph, its run history and any dashboard reading from it. Exports already downloaded are unaffected.</p>
            <Button variant="danger">Delete workspace</Button>
          </div>
        </section>
      </div>
    </Shell>
  ),
};

const nodes: HubFlowNode[] = [
  { id: 'src', type: 'hub', position: { x: 0, y: 40 }, data: { name: 'Fetch table', detail: 'statbank / FOLK1A', kind: 'source', inputs: false } },
  { id: 'flt', type: 'hub', position: { x: 260, y: 0 }, data: { name: 'Filter rows', detail: 'region = "Hovedstaden"', kind: 'transform' } },
  { id: 'sum', type: 'hub', position: { x: 260, y: 150 }, data: { name: 'Summarise', detail: 'claude-opus-5', kind: 'model' } },
  { id: 'out', type: 'hub', position: { x: 520, y: 75 }, data: { name: 'Dashboard', detail: '/reports/population', kind: 'output', outputs: false } },
];
const edges: Edge[] = [
  { id: 'e1', source: 'src', target: 'flt' },
  { id: 'e2', source: 'src', target: 'sum' },
  { id: 'e3', source: 'flt', target: 'out' },
  { id: 'e4', source: 'sum', target: 'out', animated: true },
];

function CanvasPageDemo() {
  const [open, setOpen] = useState(true);
  return (
    <div className="hub-page--canvas" data-density="compact">
      <div className="hub-page__bar">
        <div className="hub-crumb"><span>Graphs</span><i /><b>Population by region</b></div>
        <div className="hub-row">
          <Button variant="primary">Run</Button>
          <Button variant="ghost">Share</Button>
          {open ? null : <Button variant="ghost" onClick={() => setOpen(true)}>Inspect</Button>}
        </div>
      </div>
      <div className="hub-page__canvas hub-paper">
        <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} defaultEdgeOptions={{ type: 'smoothstep' }} colorMode="system" fitView fitViewOptions={{ padding: 0.25 }}>
          <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="var(--hub-color-dot)" />
          <Controls />
          <MiniMap pannable zoomable />
        </ReactFlow>
      </div>
      {open ? (
        <aside className="hub-page__panel" aria-label="Node inspector">
          <div className="hub-region__head" style={{ marginBottom: 0 }}>
            <div><h2>Summarise</h2><p>Reads from Filter rows. Writes to Dashboard.</p></div>
            <span className="hub-row" style={{ gap: 'var(--hub-space-2)' }}><Chip status="ok">Ready</Chip><Button variant="quiet" onClick={() => setOpen(false)}>Close</Button></span>
          </div>
          <Select label="Model" defaultValue="opus" options={[{ value: 'opus', label: 'claude-opus-5' }, { value: 'sonnet', label: 'claude-sonnet-5' }, { value: 'haiku', label: 'claude-haiku-4-5' }]} />
          <Field label="Instruction" defaultValue="One paragraph, plain Danish." />
          <Field label="Max rows" defaultValue="500" help="Above 500 the model starts summarising its own summary." />
          <Button variant="ghost">Run this node only</Button>
        </aside>
      ) : null}
      <div className="hub-page__foot">
        <span>source version <span className="hub-code">sv_9f21c4</span></span>
        <span>upload <span className="hub-code">up_3a17bd</span></span>
        <span>evidence <span className="hub-code">ev_c48e02</span></span>
        <span>ran in <span className="hub-code">4,2 s</span></span>
      </div>
    </div>
  );
}

/** The signature layout: the page never scrolls; the inspector owns the only scrollbar. */
export const CanvasPage: Story = {
  name: 'Canvas page',
  render: () => <CanvasPageDemo />,
};
