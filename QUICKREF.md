# hub design system — quick reference

**This is the one file to keep in a consuming project.** Everything below is
the substance; the reasoning, the recipes and the components live in the
repository: https://github.com/UlrichKronvoldPrivate/hub-style-guide
(public). Nothing else from that repository needs to be copied for this file
to be useful, and nothing in it will resolve next to this file — that is
expected.

The system is called **Kridt** (Danish for chalk). One flat ground; white
sheets that touch and are divided by hairlines; spruce as the black; no
shadows, no gradients, no glass. Colour only where it means something. Type is
Schibsted Grotesk alone, JetBrains Mono only where characters must align.
Icons are Boxicons, the free set.

## Three-tier tokens

```
--hub-skagen-40   →   --hub-color-action   →   --hub-tab-indicator
   primitive              semantic                  component
```

A component names a semantic or component token, never a primitive. Never
hard-code a hex; if a value has no token, add the token in the repository.

## The rules people break first

**The primary button is the ink block, not the action colour.** The one action
a screen exists for is the darkest thing on it — the same black as the current
nav item. Skagen, sea petrol, is for links, focus, selection and the one chart
mark that carries the point:

| | Day | Night | For |
|---|---|---|---|
| `--hub-color-action` | `#0F6C86` | `#5FD0DC` | focus ring, selection, chart accent |
| `--hub-color-action-text` | `#0A5062` | `#A9ECF1` | links, quiet buttons — small type |

**No shadows, no gaps.** Regions of a sheet touch and share a 1px hairline.
`--hub-shadow-*` resolve to `none`. Separation is a line, a sunken band, or a
standalone sheet with 14px corners.

**Colour only where it means something.** Status pills (soft fill, tone text)
and the action colour. A third colour on a screen is decoration.

## Four archetypes, one scroll container

`.hub-page--canvas`, `.hub-page--table`, `.hub-page--dashboard`,
`.hub-page--reading`, inside `.hub-shell` (sidebar with grouped nav and an ink
block for the current item; a bar with breadcrumb, search pill, round icon
buttons). Decide which element owns the scroll before writing CSS. Sticky is
spent on the bar and a table's `thead`.

Breakpoints are literal constants — a media query cannot read a custom
property: **720px** (one column, nav becomes a drawer) and **1100px** (a side
panel becomes an overlay).

## Six rules

1. **Colour only where it means something.**
2. **Lines, not gaps, and never shadows.**
3. **Lines mean connection.** Nothing is drawn to fill space.
4. **One family, weight does the work — quietly.** 500–600, never 700 or
   heavier; `strong` is 600. Nothing under 12px.
5. **Radius is a role, not a habit.** 0 cell, 8px control, 14px sheet, pill
   buttons and status, circle icon buttons.
6. **Semantic colour is separate.** Status never borrows the accent.

## Across the hub apps

Every app in the hub ecosystem uses Kridt wholesale — the owner's decision, so
the apps read as one product. Its own older system does not win here. These
pieces live in `layout.css` and are used as drawn, never re-made locally:

| Piece | Rule |
|---|---|
| App mark | An ink tile with the app's Boxicon glyph; 32px in the sidebar, switcher and catalog, 56px on sign-in |
| Brand | Mark and name on one line, 600; no tagline, no version |
| App switcher | Round `bx-grid-alt` in the bar, last before the avatar; every app, same order, current one inked |
| Person | Sidebar foot: neutral disc, name, role. The bar ends with the same disc for the account menu |
| Help | One round ink button, 48px, bottom-right; in the bar on canvas pages |
| Sign-in sheet | Mark, name at display-2, one line, one full-width ink action, "How it works", theme control |
| How it works | Every app has one, by that name, in the last nav group |
| Tab title | "Page — App" |

Categories are **tags** (8px, lined, never filled); **chips** are status only.
Notices are **banners** (paper, hairline, tone on a 3px edge), never a filled
slab. A **segmented control** chooses a parameter; switching content is tabs.
An empty chart keeps its frame.

**Tailwind:** import the Kridt CSS with `layer(components)`, or unlayered
`.hub-*` rules will silently beat your utilities.

## Icons

`<i class="bx bx-name" aria-hidden="true">` beside text; an icon-only button
gets `aria-label`. Regular (outlined) by default, `bxs-` solid only for a
filled state. Icons sit in a 36px hairline disc on KPI cells and list rows.

## Charts and figures

A figure gets a gauge: thin ink arc over a light track, value beneath at
medium weight, delta under the label. Bars are light columns with an ink dash
at the value; the one mark that matters takes the action colour. Labels are
HTML in a grid, never SVG text. Anything past a simple bar or line: the
`dataviz` skill.

## Libraries

React Flow for any node graph or flow editor. PixiJS only when the DOM cannot
keep up — thousands of animated marks, a large zoomable canvas, a real effect —
and never for what a CSS transition can do.

## Writing

A control names its outcome and keeps that name through the flow: "Publish",
then "Published". Errors say what happened and what to try, never an apology.
Empty states say what will live here and offer one action. Sentence case, no
trailing arrows, no eyebrow labels in tracked capitals.

## Done-checklist

- Every colour comes from a token; no literal hex in component CSS.
- The page is one of the four archetypes — or you have said why not — with
  exactly one scroll container.
- Regions touch and share hairlines; nothing casts a shadow; nothing is a
  gradient or glass.
- Colour only in status and the action colour; the primary button is ink.
- Both themes checked: light, night, **and the un-stamped system default**.
- Keyboard focus visible everywhere; every icon-only control has a name.
- Running text at most 66ch; headings balance; figures at 500–600; nothing at
  700 or under 12px; a single figure in proportional digits.
- In a hub app: the shared mark, switcher, person, help button and sign-in
  sheet, unchanged.
- Chart labels are HTML, not SVG text.
- Nothing depends on hover alone to be discoverable.
- No tell from the skill's list: cream ground, serif display, tracked-caps
  eyebrows, identical shadowed cards, gradients or glass, numbered
  non-sequences, arrows on buttons, `#111` for black, mono for labels, a
  coloured button for every action.
