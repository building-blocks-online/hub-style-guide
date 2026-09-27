# Layout

Components were never the hard part. This is where a screen either reads as
considered or as a pile of correct parts.

**The CSS lives in `layout.css`** — import it the way you import `tokens.css`.
This file is the reasoning; classes below are quoted from it, not a second
copy.

## An app is one sheet

The ground is flat. On it sits one white sheet — `.hub-shell` — and the
sidebar, the bar and the page are *regions of that sheet*, divided by 1px
hairlines. Nothing floats, nothing casts a shadow, nothing has a gap between
it and its neighbour. In an app the sheet is the viewport; in a demo,
`.hub-shell--framed` gives it the ground around it and 14px corners.

```
┌─ sheet ──────────────────────────────────────────────────────┐
│ brand   │ Dashboards › Overview          [search] (◦) (◦) (UK) │
│─────────│───────────────────────────────────────────────────── │
│ Main    │                                                       │
│ ▪ Overv │  page                                                 │
│   Sourc │                                                       │
│   Runs  │                                                       │
│ Insight │                                                       │
│─────────│                                                       │
│ (UK) me │                                                       │
└──────────────────────────────────────────────────────────────┘
```

**The bar** (`.hub-shell__bar`, 64px): a breadcrumb on the left with the
current page in ink; on the right a search pill, round icon buttons and the
avatar. **The sidebar** (`.hub-shell__nav`): the brand at bar height, grouped
nav with small group labels, and the signed-in person at the foot. The current
item is a solid ink block — the same black as the primary button, which is not
a coincidence: it means "here" and "do this" in the same voice.

Sidebar nav, not top nav. These apps have more destinations than a top bar
holds, and a vertical list survives a name getting longer. Below 720px it
becomes a drawer (`data-open="true"`) and the search pill hides.

## Regions

A page is built from `.hub-region`s: padded areas that touch, with a hairline
between consecutive ones. A region opens with `.hub-region__head` — a heading
at subtitle size, a one-line caption under it, and a round "more" button or a
ghost button on the right. That head row is the only place a region gets
chrome.

## Breakpoints are constants, not tokens

A media query cannot read a custom property, so these are written literally
everywhere. Two of them, named for what the layout does:

| Constant | Below it |
|---|---|
| **720px** — compact | One column everywhere. Sidebar becomes a drawer. Toolbars wrap. |
| **1100px** — wide | A side panel becomes an overlay instead of sitting beside content. |

Above 1440px content stops growing. Break where the content stops fitting,
never at a device name.

## Four page archetypes

Almost everything we build is one of these. Start from the right one rather
than composing a page from scratch. If a screen is genuinely none of them, say
so and build from the rules — four is not a closed set.

### 1. Canvas page

The signature layout: a graph filling the viewport with an inspector beside it.

```
┌─ bar ───────────────────────────────────────────┐
│ Graphs › Population by region     [Run] [Share] │
├───────────────────────────────┬─────────────────┤
│  canvas — pans and zooms,     │  inspector      │
│  never scrolls the page       │  320px, scrolls │
├───────────────────────────────┴─────────────────┤
│ source version · upload · evidence · ran in     │
└─────────────────────────────────────────────────┘
```

`.hub-page--canvas`: `100dvh`, `overflow: hidden`, the inspector owns the
only scrollbar. The canvas gets `.hub-paper` for the dot grid — the one place
engineer's paper still appears. An optional `.hub-page__foot` adds a third row
for a provenance strip; it spans the panel because what it cites is the whole
run.

**The inspector goes on the right.** Graphs flow left to right, so a left
panel covers the upstream nodes you are tracing back from. Below 1100px it
becomes an overlay, and an overlay must be dismissible — give it a close
control and a way to reopen it from the bar. `fitView` does not know the
panel is there; fit once with it closed, do not refit on every toggle.

A docked inspector and a transient one are different components. A panel that
opens on demand — a step detail, a record viewer — is an overlay at every
width and never gets a grid column.

### 2. Table page

Dense, scanned rather than read. `.hub-page--table`: `--hub-width-wide`,
a page head with the primary action on the right, filters directly above the
rows, and a sticky `thead` at `top: var(--hub-height-bar)`. **The page header
does not also stick** — two sticky bands eat a laptop screen.

### 3. Dashboard page

Summary first, then detail — as rows of the sheet, not cards on a page.

```
┌─ region ────────────────────────────────────────┐
│ Overview                    [New upload] [Link] │
├─ stat row: four cells that touch ───────────────┤
│ Runs today │ Rows ingested │ Sources │ Failure  │
│  ◠ 34      │  ◠ 1.28M      │  ◠ 12   │  ◠ 5.9%  │
├─ split 1.6 : 1, divided by a line ──────────────┤
│ chart                       │ needs attention   │
├─────────────────────────────┴───────────────────┤
│ recent runs table                               │
└─────────────────────────────────────────────────┘
```

`.hub-page--dashboard` is a column of regions with a hairline between them.
`.hub-page__split` is unequal on purpose — two equal columns make the reader
choose where to start, which is the choice the layout should have made for
them — and its halves are divided by a line, not a gap.

The stat row is one instrument: N cells that touch. Each cell says what is
measured, how it moved and against what, an icon in a disc, a gauge, and the
figure beneath at medium weight. Only a figure that asks for action takes
colour. See the stat cell recipe in `components.md`.

### 4. Reading page

Docs, settings, a form. `.hub-page--reading`: `--hub-width-page` container,
paragraphs and list items held at `--hub-width-prose`, sections opening on a
hairline and a heading row whose right-hand slot holds something **true** — a
count, a timestamp — or stays empty.

## Two densities, chosen by what the screen is for

| | Comfortable | Compact |
|---|---|---|
| Body text | `body` 16 | `body-sm` 14 |
| Row / cell padding | `--hub-space-4` | `--hub-space-3` |
| Used by | Reading pages, forms, dialogs, empty states | Tables, canvases, dashboards, inspectors |

Set with `data-density="compact"`. No third density, no per-user switch.

## Scroll

**One scroll container per page.** Reading and table pages: the document
scrolls. Canvas pages: the document does not scroll; the inspector does. A
wide table scrolls sideways inside its own container. Two nested scrollbars is
a bug. Sticky is spent on exactly two things: the bar, and a table's `thead`.

## Where things sit

| Thing | Where | Why |
|---|---|---|
| Where you are | Breadcrumb, left of the bar; current page in ink | First thing read |
| Search, alerts, messages, you | Right of the bar, in that order | Tools, then identity |
| Page title | Left of the page head | — |
| Primary action | Page head, right side, **first** in its group, as the ink block | Primary-first matches every action row |
| Filters | Directly above the thing they filter | A filter far from its results reads as global |
| Inspector | Right | Graphs flow left to right |
| Canvas controls / minimap | Bottom-left / bottom-right | React Flow's defaults, kept |
| Toasts | Bottom-centre | Both bottom corners are taken |
| Destructive actions | Last, never adjacent to a primary | Distance is the cheapest safeguard |
| App switcher | Right of the bar, the last tool before the avatar | The way to the other apps sits beside who you are |
| Help and feedback | Bottom-right, fixed; a round tool in the bar on canvas pages | One place to ask, the same in every app |

## Across the ecosystem

The hub apps are one family: each has its own job and the same frame. These
pieces are drawn once, in `layout.css`, and every app uses them as they are —
a local variant is a fork, and forks are what make a family look unrelated.

| Piece | Class | Rule |
|---|---|---|
| App mark | `.hub-mark`, `.hub-mark--lg` | An ink tile with the app's Boxicon glyph: 32px with 8px corners in the sidebar, the switcher and the home app's catalog; 56px with 14px corners on the sign-in sheet. One glyph per app, everywhere. An app without one gets its initial. |
| Brand | `.hub-shell__brand` | The mark and the name on one line, at 600. No tagline, no version. |
| App switcher | `.hub-switcher` | A round `bx-grid-alt` button (`aria-label="Apps"`) opens a sheet listing every app, in the same order in every app. Each row: mark, name, one line on what it is for, and a status marker when the app knows it. The current app is the ink block. |
| Person | `.hub-person` inside `.hub-shell__me` | At the sidebar foot: a neutral disc, the display name, the role. The email only stands in for a missing name, and never appears twice. The bar ends with the same disc, which opens the account menu: profile, theme, sign out. |
| Help | `.hub-help` | One round ink button, 48px, `bx-message-rounded-dots`, `aria-label="Feedback"`. The nav may list Feedback too; the bar does not. |
| Sign-in sheet | `.hub-signin` | The first screen when signed out, identical in every app: the large mark, the name at display-2, one line, the one action at full width, a quiet "How it works", the theme control. The identity provider's own page is branded to match. |
| Theme | round button; segmented control | In the bar, one round button showing the current mode (`bx-desktop`, `bx-sun`, `bx-moon`) with an `aria-label` that names it. On the sign-in sheet and in the account menu, the three-way segmented control: System, Light, Dark. |
| How it works | a reading page | Every app has one, named "How it works", in the last nav group and linked from the sign-in sheet. The problem, how it works as a flow diagram, what is in it, what it will not do. |
| Tab title | `<title>` | "Page — App", such as "Runs — Pipelines" or "Sign in — Pipelines". The page comes first, because tabs truncate from the end. |

## Layout tells to avoid

| Tell | Instead |
|---|---|
| Cards in a tray with gaps and shadows | One sheet, regions divided by hairlines |
| Everything centred down the page | Left-aligned; centre only genuinely symmetrical things |
| A `100vh` hero before any content | Size an opener to what it holds |
| Running text at full container width | `--hub-width-prose`, always |
| A sidebar scrolling independently for no reason | One scroll container |
| A layout that only collapses at phone width | Break where the content stops fitting |
