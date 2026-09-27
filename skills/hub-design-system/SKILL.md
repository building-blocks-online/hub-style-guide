---
name: hub-design-system
description: Apply the hub house style ("Kridt" — one white sheet on a flat ground, divided by hairlines, colour only where it means something) — colours, typography, spacing, layout, components, icons, node canvases and UI copy. Use when starting a new UI, when working in any app of the hub ecosystem (the apps that share one sign-in and the app switcher — they use Kridt wholesale), or in a project that has no design system of its own. In any other project that already has one, this skill DEFERS to it and only supplies the parts it lacks — see the precedence rule first. Also use for its portable half: layout archetypes, accessibility floor, UI copy rules, library recommendations, and the generated-design tells to avoid.
---

# hub design system

The visual identity shared by every hub app. Its job is consistency across
projects and a look that reads as one studio's work rather than one model's
default.

## Precedence — read this before applying anything

Order, highest first:

1. **What the user asked for**, in their own words.
2. **The project's own design system**, if it has one.
3. **This skill.**

**Check for an existing system before writing a line of CSS.** It is there if
any of these are:

- a token block in the project's stylesheet (`:root { --... }`), a
  `tokens.*`/`theme.*` file, or a Tailwind theme config
- design guidance in `CLAUDE.md` / `AGENTS.md`
- a design reference file kept in the repo
- a project-specific design agent under `.claude/agents/`

If one exists, **it wins.** Do not introduce `--hub-*` tokens, do not
re-palette, do not change its radius or its typeface. A project that has
thought about its own look has usually thought about it *for that app*, and
that is a better decision than consistency with a sibling app.

Adopt this identity wholesale only when the project has no system, or when the
user asks for it by name.

**The hub apps are the exception.** Every app in the hub ecosystem — the
family that shares one sign-in and the app switcher — uses this identity
wholesale, whatever local system it grew. The owner decided this so the apps
read as one product. In those projects this skill outranks the local system;
only rule 1 stands above it. Replace the local tokens with ours rather than
mapping between them, and use the shared pieces in `layout.md`, *Across the
ecosystem*, exactly as drawn.

## What still applies when a project has its own system

The visual half does not travel. The rest does, because none of it names a
colour:

- **Layout** — the sheet, the four page archetypes, one scroll container, the
  sticky budget, two densities, placement. Shapes, not colours.
- **Writing** — `references/writing.md`, all of it.
- **Accessibility floor** — visible focus, native elements over rebuilt ones,
  state readable without colour, reduced motion honoured.
- **Libraries** — React Flow for graphs, PixiJS for GPU-drawn visuals, and
  when not to reach for either.
- **Tells to avoid** — the table near the end of this file.
- **Behaviour** — one primary action per view, dismissible overlays, warnings
  that do not time out, motion only in answer to an action.

Express these through *that project's* tokens, never ours.

## Applying the identity

When this skill does own the look: **load `references/tokens.css` and
`references/layout.css`, and style from those custom properties. Never
hard-code a hex.** If a value you need has no token, that is a design decision:
add the token, don't inline the value.

Icons come from Boxicons (the free set, `boxicons` on npm): import
`boxicons/css/boxicons.min.css` once and write `<i class="bx bx-name">`. Rules
below.

## The argument

Danish design runs an argument with itself. Kaare Klint measured furniture
against the human body and built systems out of it — proportion, modules,
restraint. Verner Panton answered with saturated orange rooms and moulded
plastic. Both are Nordic; only one is the postcard.

**Kridt** — Danish for chalk — is Klint's side of the argument, all the way.
One flat ground. White sheets that touch and are divided by hairlines rather
than gaps. Spruce as the black. No shadows, no gradients, no glass. Colour
appears only where it means something: status, and the one action colour. The
pop comes from contrast and figure, not from atmosphere.

## Six rules

1. **Colour only where it means something.** Status pills and the action
   colour. Everything else is ink on paper. If a screen has a third colour,
   something is decorated.
2. **Lines, not gaps, and never shadows.** Regions of a sheet touch and share a
   1px hairline. Depth does not exist; hierarchy is size, weight and position.
3. **Lines mean connection.** A rule, border or edge asserts that two things
   relate. Nothing is drawn to fill space.
4. **One family, weight does the work — quietly.** Schibsted Grotesk alone, at
   500–600 for headings and figures, never 700 or heavier. Chalk is written,
   not shouted.
5. **Radius is a role, not a habit.** 0 for a cell inside a sheet, 8px for
   controls and nav items, 14px for a sheet that stands alone, pills for
   buttons and status, circles for icon buttons and discs.
6. **Semantic colour is separate.** Success, info, warning and danger own their
   tokens. The action colour never stands in for state.

## Colour

Ground is porcelain, flat: `#F2F4F1` by day, `#0E1B18` by night. The sheet is
paper. Ink is spruce, a green-black rather than a tinted grey.

| Role | Token | Day | Night |
|---|---|---|---|
| ground | `--hub-color-ground` | `#F2F4F1` | `#0E1B18` |
| sheet | `--hub-color-surface` | `#FFFFFF` | `#16221E` |
| sunken (inputs, discs, thumbs) | `--hub-color-surface-sunken` | `#F5F7F4` | `#1B2823` |
| band (chart columns, gauge track) | `--hub-color-band` | `#EDF0EC` | `#1F2D28` |
| hairline | `--hub-color-line` | `#E3E7E1` | `#26332E` |
| ink | `--hub-color-ink` | `#132420` | `#EAF0EA` |
| action (Skagen) — links as fills, focus, selection, chart accent | `--hub-color-action` | `#0F6C86` | `#5FD0DC` |
| action as text — links, quiet buttons | `--hub-color-action-text` | `#0A5062` | `#A9ECF1` |

**The primary button is the ink block, not the action colour.** The one
action a screen exists for is the darkest thing on it — the same black as the
current nav item. Skagen is for links, focus rings, selection, and the one
chart mark that carries the point.

**Small type takes the text step, never the fill colour.** Measured on paper
over the darkest sunken surface: the fill value clears AA but not AAA as 14px
text by day and is marginal by night; the text step clears AAA by day and AA
with margin by night. Links also keep an underline.

**Status** is its own set, soft fill with tone-coloured text, never the accent:

| | Token | Soft fill |
|---|---|---|
| success | `--hub-color-success` | `--hub-color-success-soft` |
| info | `--hub-color-info` | `--hub-color-info-soft` |
| warning | `--hub-color-warning` | `--hub-color-warning-soft` |
| danger | `--hub-color-danger` | `--hub-color-danger-soft` |

**Glazes** (`--hub-color-glaze-1` … `-6`) survive only as category colours for
canvas nodes. They are not a ground and not a tint any more.

## Type

**Schibsted Grotesk** alone; **JetBrains Mono** only where characters must
line up. Weights come down in Kridt: display at 600, titles, labels and
figures at 500, body at 400. **Weights stop at 600** — nothing is 700 or
heavier, and emphasis in running text (`strong`, `b`) is 600, which
`tokens.css` sets for you. Remove `font-bold` wherever it appears.

| Step | Size / leading | Weight | For |
|---|---|---|---|
| `display-1` | 61 / 1.03 | 600 | Page opener, one per screen |
| `display-2` | 39 / 1.10 | 600 | Page titles |
| `title` | 25 / 1.20 | 500 | Card and dialog titles |
| `subtitle` | 20 / 1.30 | 500 | Region headings, KPI labels |
| `figure` | 28 / 1 | 500 | The number under a gauge |
| `body` | 16 / 1.55 | 400 | Running text, 66ch max |
| `body-sm` | 14 / 1.50 | 400 | Dense UI, table cells |
| `label` | 14 / 1.00 | 500 | Buttons, tabs, form labels |
| `caption` | 12 / 1.45 | 400 | Deltas, helper and meta text |
| `code` | 13 / 1.50 | 400 | JetBrains Mono only |

Load: `https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap`

Headings get `text-wrap: balance`; stacked digits get
`font-variant-numeric: tabular-nums`. A single figure keeps proportional
digits — tabular gives "." a digit's width and "0.0" reads "0 . 0". Nothing
is set below 12px, in a diagram or anywhere else.

## Space and shape

Everything is a multiple of **8**. Scale `4 8 12 16 24 32 48 64 96`
(`--hub-space-1` … `-9`). Regions inside a sheet take `--hub-space-5` padding.

Radius is a role: `--hub-radius-cell` 0, `--hub-radius-control` 8px,
`--hub-radius-sheet` 14px, `--hub-radius-pill` for buttons and status, 50%
for icon buttons and discs.

**There are no shadows.** `--hub-shadow-*` resolve to `none` and exist only so
older CSS keeps working. Separation is a hairline or a step to the sunken
surface. Three separations, picked by role: a hairline, a sunken band, or a
standalone sheet with corners. One per object type on a screen.

## Layout

**An app is one white sheet.** Sidebar, bar and page are regions of it,
divided by hairlines. Start from one of **four page archetypes** rather than
composing from scratch; skeletons with working CSS are in
`references/layout.md` and `references/layout.css`.

- **Canvas** — a graph filling the viewport, inspector docked right, an
  optional footer band. The page never scrolls; the inspector does.
- **Table** — dense and scanned; sticky `thead`, filters directly above.
- **Dashboard** — a region for the title and actions, a stat row of cells
  that touch, an unequal split divided by a line, a table region. Rows of the
  sheet, not cards on a page.
- **Reading** — docs, settings, forms; text held at `--hub-width-prose`.

If a screen is none of them, say so and build from the rules.

**The bar** holds a breadcrumb on the left ("Dashboards › Overview", the
current page in ink) and, on the right, a search pill, round icon buttons —
the app switcher last — and the avatar. **The sidebar** holds the brand (the
app mark and the name on one line), grouped nav with small group labels, and
the signed-in person at the foot. The current nav item is a solid ink block.

**Across the ecosystem**, the app mark, the app switcher, the person block, the
help button, the sign-in sheet, the theme control and the "How it works" page
are drawn once in `layout.css` and used as they are — `layout.md` has the
table. A local variant of any of them is a fork, and forks are what make a
family of apps look unrelated.

**Breakpoints are constants, not tokens** — a media query cannot read a custom
property: **720px** (one column, nav becomes a drawer) and **1100px** (a side
panel becomes an overlay). Break where the content stops fitting.

**One scroll container per page.** Sticky is spent on the bar and a table's
`thead`. **Two densities**: comfortable for reading and forms, compact for
tables, canvases and dashboards.

## Icons

Boxicons, the free set (`boxicons` npm, CC-BY-4.0 / OFL / MIT). Regular,
outlined icons by default; `bxs-` solid only for a filled state.

- An icon **next to text** is decoration: `aria-hidden="true"`, and the text is
  the label.
- An icon **alone** is a control and gets a real name: `aria-label` on the
  button, never a `title` tooltip as the only name.
- Icons sit in a **disc** (`--hub-icon-disc-bg`, 36px, hairline) on KPI cells
  and list rows; bare in buttons and nav.
- One vocabulary per app. The set the archetypes use: `grid-alt`, `data`,
  `time-five`, `sitemap`, `bar-chart-alt-2`, `trending-up`, `file`, `cog`,
  `search`, `bell`, `message-rounded`, `dots-horizontal-rounded`, `list-ul`,
  `plus-circle`, `error`, `upload`, `link`, `refresh`, `check`, `x`,
  `chevron-right`, `filter`, `calendar`, `user`, `message-rounded-dots` (help),
  `desktop` / `sun` / `moon` (theme), `info-circle`, `check-circle`,
  `error-circle`, `revision`. Add to it; do not fork it.

## Libraries

**React Flow** (`@xyflow/react`) for any node graph, pipeline or flow editor.
It is the canvas archetype's foundation; `references/react-flow.md` maps every
`--xy-*` variable onto a token so a graph follows the theme for free. Do not
draw a graph by hand and do not reach for a charting library to fake one.

**PixiJS** (`pixi.js`) when the DOM cannot keep up: thousands of animated
marks, a large zoomable canvas beyond what React Flow handles, a genuine
visual effect. It renders to WebGL and knows nothing about tokens, so read the
colours from `getComputedStyle` at mount and re-read on theme change. Do not
use it for anything a CSS transition, an SVG or React Flow can do — Kridt is a
quiet system, and an effect answers an action or it does not happen.

## Motion

Motion answers an action: expanding, confirming, connecting. 160–240ms on
`--hub-ease`. One orchestrated moment per page is allowed. **Banned:**
fade-and-slide-up on every section as it scrolls into view, and a hover-lift
on every card. `prefers-reduced-motion` is honoured globally in `tokens.css`.

## Charts and figures

**A figure gets a gauge.** A thin ink arc over a light track, end dots, a
needle ring, the value beneath at `figure` size and medium weight. The delta
("+6 vs yesterday") sits under the label, not the number.

**Charts are monochrome.** Bars are light columns with an ink dash at the
value; the one mark that carries the point takes the action colour and its
column is lifted a step. Lines are ink over a grey trend; a target range is a
hatched band; a reference is a dashed line; the point that matters gets one
ink pill.

**Axis and value labels go in HTML, not in SVG `<text>`.** A `viewBox` scales
everything inside it, text included. Lay labels in an HTML grid with one
column per mark, and check one rendered label at real size.

Every chart says where its numbers come from and explains a visible anomaly.
For anything past a simple bar or line — categorical palettes, sequential and
diverging scales — **use the `dataviz` skill**.

## Tells to avoid

These read as generated. If a review turns one up, it is a defect.

| Tell | Instead |
|---|---|
| Cream ground, serif display, terracotta accent | Flat porcelain, one grotesque, spruce |
| Tracked-out capitals as an eyebrow above headings | Let the heading start the section |
| Identical rounded cards under the same grey shadow | One sheet, regions divided by hairlines |
| A gradient behind a headline, a glass or blur effect | Flat. Colour comes from the marks, not the ground |
| `01 / 02 / 03` markers on non-sequential content | Number only real sequences and timelines |
| `→` glued to every button and link | The verb already says what happens |
| Meta strung together with middle dots | Give each fact its own slot |
| Near-black `#111` standing in for black | Spruce `#132420`, a dark that has hue |
| Mono for small labels to look technical | Mono only where digits must align |
| A coloured button for every action | One ink primary; the rest paper or quiet |
| A filled slab of warning colour across the page | A banner: paper, hairline, the tone on its edge |
| Pills for categories, so everything looks like status | Tags for categories; pills say state |

## Reference files

- `references/tokens.css` — the token file itself. Copy or import; source of truth.
- `references/layout.css` — the sheet, bar, sidebar, the four archetypes, and the pieces every hub app shares (app mark, switcher, person, help, sign-in sheet) as CSS.
- `references/layout.md` — why the layout is shaped that way, scroll and placement rules, and the across-the-ecosystem table.
- `references/components.md` — recipes for button, icon, field (and field with an icon), select, checkbox, segmented control, tabs, plate, dialog, toast, chip, tag, banner, stat cell, table, empty state and empty chart, flow diagram, and error states — plus the cascade-layer rule for Tailwind builds.
- `references/react-flow.md` — canvas rules and the full `--xy-*` variable map.
- `references/writing.md` — how UI copy is written in this system.

## Checklist before calling UI work done

- Every colour comes from a token; no literal hex in component CSS.
- The page is one of the four archetypes — or you have said why it is not —
  with exactly one scroll container.
- Regions touch and share hairlines; nothing casts a shadow; nothing is a
  gradient or glass.
- Colour appears only in status and the action colour; the primary button is
  the ink block.
- Both themes checked: light, night, and the un-stamped system default.
- Keyboard focus is visible on every interactive element; every icon-only
  control has a name.
- Running text is at most 66ch; headings balance; figures are 500–600 weight;
  nothing is 700 or heavier, and nothing is under 12px.
- In a Tailwind build, the Kridt CSS sits in `@layer components`, so no
  utility is silently overruled.
- In a hub app: the mark, switcher, person block, help button and sign-in
  sheet are the shared ones, unchanged.
- Any chart's labels are HTML, not SVG text. Check one rendered size.
- Nothing depends on hover alone to be discoverable.
- No item from the tells table is present.
