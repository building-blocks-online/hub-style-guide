import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppMark, AppSwitcher, HelpButton, Person, SignInSheet } from './Ecosystem';
import { FAMILY } from './family';

const meta = {
  title: 'Layout/Across the ecosystem',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The pieces every hub app shares: the app mark, the app switcher, the person, the help ' +
          'button and the sign-in sheet. Their CSS lives in `layout.css` next to the shell, so an ' +
          'app that imports it draws them identically. A local variant is a fork, and forks are ' +
          'what make a family of apps look unrelated. `layout.md`, "Across the ecosystem", has ' +
          'the rules.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/** The first screen of every app when signed out. Identical everywhere but the mark, the name and the line. */
export const SignIn: Story = {
  name: 'Sign-in sheet',
  render: () => (
    <SignInSheet
      appName="Graphs"
      glyph="git-branch"
      lede="Clean and join public statistics into graphs your dashboards can trust."
      note="One account opens every app in the family."
    />
  ),
};

/** One glyph per app, used everywhere. An app without a glyph gets its initial, never nothing. */
export const Marks: Story = {
  name: 'App marks',
  render: () => (
    <div className="hub-stack" style={{ padding: 'var(--hub-space-6)' }}>
      <div className="hub-row">
        {FAMILY.map((a) => <AppMark key={a.id} glyph={a.glyph} name={a.name} />)}
        <AppMark name="Ledger" />
      </div>
      <div className="hub-row">
        <AppMark glyph="git-branch" name="Graphs" size="lg" />
        <AppMark name="Ledger" size="lg" />
      </div>
      <p className="hub-caption">32px with 8px corners in the sidebar, the switcher and the catalog; 56px with 14px corners on the sign-in sheet.</p>
    </div>
  ),
};

/** Opened for the documentation. In an app it opens from the round button and closes on Escape or a click outside. */
export const Switcher: Story = {
  name: 'App switcher',
  render: () => (
    <div className="hub-shell hub-shell--framed" style={{ minHeight: 560 }}>
      <aside className="hub-shell__nav">
        <div className="hub-shell__brand"><AppMark glyph="git-branch" name="Graphs" />Graphs</div>
      </aside>
      <div className="hub-shell__bar">
        <div className="hub-crumb"><span>Graphs</span><i /><b>Population by region</b></div>
        <div className="hub-shell__tools">
          <AppSwitcher apps={FAMILY} current="graphs" defaultOpen />
          <button type="button" className="hub-avatar" aria-label="Account menu">UK</button>
        </div>
      </div>
      <main className="hub-shell__main" />
    </div>
  ),
};

/** Once, at the foot of the sidebar. The email stands in only when there is no name. */
export const PersonBlock: Story = {
  name: 'Person',
  render: () => (
    <div className="hub-stack" style={{ padding: 'var(--hub-space-6)' }}>
      <div style={{ width: 'var(--hub-width-nav)', background: 'var(--hub-color-surface)', border: '1px solid var(--hub-color-line)', borderRadius: 'var(--hub-radius-sheet)' }}>
        <Person name="Ulrich K." role="Owner" onSignOut={() => {}} />
      </div>
      <div style={{ width: 'var(--hub-width-nav)', background: 'var(--hub-color-surface)', border: '1px solid var(--hub-color-line)', borderRadius: 'var(--hub-radius-sheet)' }}>
        <Person email="analyst@example.com" role="Viewer" />
      </div>
    </div>
  ),
};

/** Bottom-right in every app; on a canvas page it steps aside for React Flow's minimap. */
export const Help: Story = {
  name: 'Help button',
  render: () => (
    <div style={{ minHeight: 320, padding: 'var(--hub-space-6)' }}>
      <p className="hub-body">The round ink button in the corner is the one way to ask a question or send feedback, in every app.</p>
      <HelpButton />
    </div>
  ),
};
