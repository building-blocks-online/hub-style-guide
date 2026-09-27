# Component recipes

Every component reads semantic or component tokens only. If a value has no
token, add one rather than inlining it. There are no shadows and no gradients
in any recipe below.

**With Tailwind, import these rules into a cascade layer.** Tailwind v4 puts
its utilities in `@layer utilities`, and unlayered CSS beats every layer — so
an unlayered `.hub-input { padding }` silently wins over `pl-9`, and an icon
lands on top of the text. Import the recipes into the components layer, below
the utilities; tokens are custom properties and are unaffected:

```css
@import "tailwindcss";
@import "hub-style-guide/tokens.css";
@import "hub-style-guide/layout.css" layer(components);
@import "./hub-components.css" layer(components);   /* your copy of these recipes */
```

## Button

Pills. Four variants and no more. **Primary is the ink block** — the one
action the screen exists for, the darkest thing on it, at most one per view.
The action colour is not a button fill.

```css
.hub-btn {
  font: var(--hub-text-label);
  padding: var(--hub-button-pad);
  border-radius: var(--hub-button-radius);   /* pill */
  border: 1px solid transparent;
  display: inline-flex; align-items: center; gap: var(--hub-space-2);
  cursor: pointer;
}
.hub-btn--primary { background: var(--hub-button-primary-bg); color: var(--hub-button-primary-ink); }
.hub-btn--ghost   { background: var(--hub-button-ghost-bg); border-color: var(--hub-button-ghost-border); }
.hub-btn--quiet   { background: transparent; color: var(--hub-button-quiet-ink); padding-inline: var(--hub-space-2); }
.hub-btn--danger  { background: var(--hub-color-danger); color: var(--hub-color-ink-on-action); }
/* a round icon button: bell, messages, "more". needs aria-label. */
.hub-btn--round   { width: 38px; height: 38px; padding: 0; border-radius: 50%;
                    background: var(--hub-button-ghost-bg); border-color: var(--hub-button-ghost-border); }
```

No arrow suffixes. The verb already says what happens.

A disabled button keeps its variant at `opacity: .45` — never a grey fill
that reads as a different kind of button — and the reason sits next to it,
not in a banner somewhere else. Use `aria-disabled="true"` when it should
stay focusable so the reason can be read.

```css
.hub-btn:disabled, .hub-btn[aria-disabled="true"] { opacity: .45; cursor: not-allowed; }
```

## Icon

Boxicons, the free set (`boxicons` on npm). Import
`boxicons/css/boxicons.min.css` once.

```html
<!-- beside text: decoration -->
<button class="hub-btn hub-btn--primary"><i class="bx bx-upload" aria-hidden="true"></i>New upload</button>
<!-- alone: a control, so it has a name -->
<button class="hub-btn hub-btn--round" aria-label="Notifications"><i class="bx bx-bell" aria-hidden="true"></i></button>
<!-- in a disc, on a KPI cell or a list row -->
<span class="hub-disc"><i class="bx bx-time-five" aria-hidden="true"></i></span>
```

```css
.hub-disc {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--hub-icon-disc-bg); border: 1px solid var(--hub-icon-disc-border);
  display: grid; place-content: center; color: var(--hub-color-ink);
}
```

Regular (outlined) by default; `bxs-` solid only for a filled state. One
vocabulary per app.

## Field and select

Sunken paper with a hairline; focus is the action colour.

```css
.hub-input, .hub-select {
  font: var(--hub-text-body-sm); color: var(--hub-color-ink);
  background: var(--hub-input-bg);
  border: 1px solid var(--hub-input-border);
  border-radius: var(--hub-radius-control);
  padding: 9px var(--hub-space-3);
}
.hub-input:focus-visible { border-color: var(--hub-input-border-focus); }
```

Labels sit above their input, always visible. Helper text is present from the
start where a format is required. A `<select>` stays native; only the shell is
ours, with a chevron drawn from a rotated border corner.

### Field with an icon

A search field or a date gets its icon from a wrapper, never from a padding
utility fighting `.hub-input`. The icon is decoration; the label still names
the field.

```html
<label class="hub-field__label" for="q">Search responses</label>
<span class="hub-input-wrap">
  <i class="bx bx-search" aria-hidden="true"></i>
  <input id="q" class="hub-input" type="search" placeholder="Brand, engine or phrase">
</span>
```

```css
.hub-input-wrap { position: relative; display: flex; align-items: center; }
.hub-input-wrap > .bx { position: absolute; left: var(--hub-space-3); font-size: 1.1rem;
                        color: var(--hub-color-ink-subtle); pointer-events: none; }
.hub-input-wrap > .hub-input { width: 100%; padding-left: calc(var(--hub-space-3) + 1.1rem + var(--hub-space-2)); }
```

A date range is one control with one label, "Date range", not two bare
`dd/mm/yyyy` inputs. Native date pickers are the least finished element on
any page they appear on.

## Segmented control

A choice of **parameter** — a time range, a unit, the theme. It changes how
the same content is shown. If the choice switches to different content, it is
tabs, and tabs are underlined.

```css
.hub-segmented { display: inline-flex; gap: 2px; padding: 3px;
                 background: var(--hub-segmented-bg); border: 1px solid var(--hub-segmented-border);
                 border-radius: var(--hub-radius-pill); }
.hub-segmented__option { font: var(--hub-text-label); color: var(--hub-segmented-ink);
                         padding: 7px 14px; border: 0; border-radius: var(--hub-radius-pill);
                         background: transparent; display: inline-flex; align-items: center;
                         gap: 6px; white-space: nowrap; cursor: pointer; }
.hub-segmented__option[aria-checked="true"] { background: var(--hub-segmented-selected-bg);
                                             color: var(--hub-segmented-selected-ink); }
```

`role="radiogroup"` with an `aria-label`; each option `role="radio"` with
`aria-checked`, one tab stop, arrow keys move the choice. The selected option
is the ink block — the same "here" as the current nav item. The theme control
is always System, Light, Dark with `bx-desktop`, `bx-sun`, `bx-moon`, in that
order. Labels never wrap; below 720px a segmented control takes its own row.

## Checkbox

The input **is** the box: `appearance: none` on the real element, 6px radius,
ink fill when checked. Indeterminate is a bar, not a faded tick. A checkbox
labels a choice, so its label takes `body-sm`; the 500-weight `label` step
belongs on the `<legend>` above a group.

## Tabs

The ARIA pattern in full: `role="tablist"` / `tab` / `tabpanel`, roving
tabindex, arrow keys, Home and End, automatic activation. The indicator is a
2px ink underline sitting on the tablist hairline — the selected tab is drawn
joined to its panel.

## Plate

The standalone container: paper, a hairline, 14px corners. **Inside a sheet,
do not use plates** — use regions divided by hairlines (`.hub-region` in
`layout.css`). A plate is for the case where something genuinely stands alone
on the ground: a dialog, a toast, a component in isolation.

```css
.hub-plate { background: var(--hub-plate-bg); border: 1px solid var(--hub-plate-border);
             border-radius: var(--hub-plate-radius); padding: var(--hub-space-5); }
.hub-plate--flat  { background: var(--hub-color-surface-sunken); border-color: transparent; }  /* a well */
```

## Stat cell

The summary at the top of a dashboard: one instrument, N cells that touch.

```css
.hub-stats { display: grid; grid-template-columns: repeat(var(--hub-stats-count, 4), minmax(0, 1fr)); }
.hub-stat  { padding: var(--hub-space-4) var(--hub-space-5); border-right: 1px solid var(--hub-color-line); }
.hub-stat:last-child { border-right: 0; }
.hub-stat__label { font: var(--hub-text-subtitle); font-size: 1rem; }
.hub-stat__note  { font: var(--hub-text-caption); color: var(--hub-color-ink-muted); }   /* "+6 vs yesterday" */
.hub-stat__value { font: var(--hub-text-figure); letter-spacing: var(--hub-tracking-figure); }
.hub-stat--attention .hub-stat__value { color: var(--hub-color-danger); }
```

The gauge: a semicircle, centre (60,60), radius 48, in a 120×68 viewBox — a
10px track in `--hub-gauge-track`, a 2px arc in `--hub-gauge-arc` to the
fraction, 3px end dots, a 4px needle ring. The value sits beneath it at
`figure` size. The note goes under the label, not the number. At most one cell
per row takes colour, and only when the figure asks for action.

Every cell in a row has the same anatomy — label, note, disc, gauge, figure —
even when one of them has no gauge to draw. A value that is a share or a score
gets a gauge; a signed value (sentiment, change) gets a plain figure and a note.
The figure is ink. Tone belongs in the note, never on the number, except
`--attention`. **A single figure uses proportional digits**: tabular digits
give "." and "/" a full digit's width and "0.0/10" reads "0 . 0/10". Tabular
is for digits that stack in a column.

## Chip and status

Pills, soft fill, tone text. Status only, never a button or a filter toggle.
The dot changes shape with the status so state survives greyscale.

```css
.hub-chip { font: var(--hub-text-caption); font-weight: 500; padding: 4px 10px;
            border-radius: var(--hub-chip-radius); background: var(--hub-color-surface-sunken); }
.hub-chip--ok   { background: var(--hub-color-success-soft); color: var(--hub-color-success); }
.hub-chip--info { background: var(--hub-color-info-soft);    color: var(--hub-color-info); }
.hub-chip--warn { background: var(--hub-color-warning-soft); color: var(--hub-color-warning); }
.hub-chip--fail { background: var(--hub-color-danger-soft);  color: var(--hub-color-danger); }
```

## Tag

A **category** — a client, a segment, a type, a goal. Where a chip says what
state something is in, a tag says what kind of thing it is. Squarer than a
chip, lined, never filled, never coloured.

```css
.hub-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.hub-tag  { display: inline-flex; align-items: center; gap: 4px;
            font: var(--hub-text-caption); font-weight: 500; color: var(--hub-tag-ink);
            padding: 2px 8px; border: 1px solid var(--hub-tag-border);
            border-radius: var(--hub-tag-radius); white-space: nowrap; }
```

At most three on a row or card, then a "+4" tag; the full set belongs on the
thing's own page. A tag is not a button and not a filter. Sentence case —
"Danmarks Statistik" keeps its own capitals, "Weekly run" does not gain any.

## Banner

A notice about the page or the data on it: degraded collection, a missing
setting, sample data. Paper, a hairline, the tone on a 3px left edge and in
the icon — the same grammar as a toast and an error plate. Never a filled
panel of warning colour.

```html
<div class="hub-banner" data-tone="warning" role="status">
  <i class="bx bx-error hub-banner__icon" aria-hidden="true"></i>
  <div class="hub-banner__body">
    <p class="hub-banner__title">Figures are from the 06:00 sweep</p>
    <p class="hub-banner__text">Statbank has not answered since, so this page shows cached data. <a href="/sources/statbank">Check the source</a></p>
  </div>
  <button class="hub-btn hub-btn--round hub-banner__dismiss" aria-label="Dismiss"><i class="bx bx-x" aria-hidden="true"></i></button>
</div>
```

```css
.hub-banner { display: flex; align-items: flex-start; gap: var(--hub-space-3);
              padding: var(--hub-space-3) var(--hub-space-4);
              background: var(--hub-banner-bg); border: 1px solid var(--hub-banner-border);
              border-left: var(--hub-tone-edge) solid var(--hub-color-info);
              border-radius: var(--hub-radius-control); font: var(--hub-text-body-sm); }
.hub-banner__icon  { font-size: 1.25rem; line-height: 1.2; color: var(--hub-color-info); }
.hub-banner__body  { flex: 1; min-width: 0; }
.hub-banner__title { font-weight: 600; margin: 0; }
.hub-banner__text  { margin: 2px 0 0; color: var(--hub-color-ink-muted); }
.hub-banner[data-tone="success"] { border-left-color: var(--hub-color-success); }
.hub-banner[data-tone="warning"] { border-left-color: var(--hub-color-warning); }
.hub-banner[data-tone="danger"]  { border-left-color: var(--hub-color-danger); }
.hub-banner[data-tone="success"] .hub-banner__icon { color: var(--hub-color-success); }
.hub-banner[data-tone="warning"] .hub-banner__icon { color: var(--hub-color-warning); }
.hub-banner[data-tone="danger"]  .hub-banner__icon { color: var(--hub-color-danger); }
```

It sits under the page head, above what it is about. One banner per page —
if there are two, the second is a list inside the first. If the notice names
a fix, it links to it. Warning and danger stay until the cause is gone;
dismissing hides it for the session, not forever.

## Dialog

Native `<dialog>` with `showModal()`: focus trap, Esc, top layer and inert
background come from the platform. A sheet over a scrim — paper, hairline,
14px, no shadow. Padding on an inner wrapper so a backdrop click is
unambiguous. Title names the decision and the thing; actions are primary
first; a destructive dialog sets `dismissible={false}`.

## Toast

Paper, hairline, 14px, a 3px tone edge on the left. Confirms an outcome in the
same words as the action. Neutral and success time out after five seconds;
warning and danger stay until dismissed. `role="status"` / `role="alert"`.
Defaults to bottom-centre because React Flow owns both bottom corners.

## Table

```css
.hub-table th { font: var(--hub-text-caption); font-weight: 500; color: var(--hub-color-ink-subtle);
                padding: 8px; border-bottom: 1px solid var(--hub-color-line); }
.hub-table td { padding: 14px 8px; border-bottom: 1px solid var(--hub-color-line); }
.hub-table .is-num { text-align: right; font-weight: 600; font-variant-numeric: tabular-nums; }
```

No zebra striping. Numeric columns right-aligned and tabular. A "who" column
gets an initials disc (`.hub-avatar`). Wide tables scroll inside their own
container.

## Bar chart

A light column for the range, an ink dash at the value; the one mark that
carries the point takes the action colour and its column is lifted a step.
Labels are HTML in a grid, never SVG text. A zero is a dash on the floor;
missing data draws no dash.

## Empty state

A sunken well, one line saying what will live here, one action.

```html
<div class="hub-plate hub-plate--flat">
  <p class="hub-subtitle">No graphs yet</p>
  <p>A graph connects a data source to whatever reads it. Start with a source.</p>
  <button class="hub-btn hub-btn--primary">Add a source</button>
</div>
```

One empty state per app, drawn this way everywhere — not a dashed box on one
page and a grey block on the next. The action is the next step, not a
description of it: "Create prompts on the Prompts page" is a link to Prompts.

### Empty chart

A chart with no data keeps its frame: the axis floor and faint gridlines at
the chart's real height, with the one line and the one action on paper in
the middle. The reader learns what will be drawn here and where — a grey
rectangle teaches nothing.

```html
<div class="hub-empty-chart" style="--hub-chart-height: 240px">
  <div class="hub-empty-chart__grid" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
  <div class="hub-empty-chart__say">
    <p class="hub-empty-chart__title">No visibility data yet</p>
    <p class="hub-empty-chart__text">The trend draws once the first queries have run.</p>
    <button class="hub-btn hub-btn--ghost">Set up prompts</button>
  </div>
</div>
```

```css
.hub-empty-chart { position: relative; height: var(--hub-chart-height, 240px);
                   display: grid; place-items: center;
                   border-bottom: 1px solid var(--hub-color-line-strong); }
.hub-empty-chart__grid { position: absolute; inset: 0 0 1px; pointer-events: none;
                         display: flex; flex-direction: column; justify-content: space-between; }
.hub-empty-chart__grid span { border-top: 1px dashed var(--hub-color-line); }
.hub-empty-chart__say { position: relative; max-width: 40ch; text-align: center;
                        display: flex; flex-direction: column; align-items: center; gap: var(--hub-space-2);
                        padding: var(--hub-space-3) var(--hub-space-4); background: var(--hub-color-surface); }
.hub-empty-chart__title { font: var(--hub-text-label); margin: 0; }
.hub-empty-chart__text  { font: var(--hub-text-caption); color: var(--hub-color-ink-muted); margin: 0; text-wrap: balance; }
```

## Flow diagram

For explaining, not editing: how an app fits the family, how a run moves, how
a grade is earned. Nodes of one width in one row, joined by hairline edges;
the node the reader is looking at is inverted to ink. When it needs to be
edited, it is a React Flow canvas instead (`react-flow.md`).

```html
<figure class="hub-flow-figure">
  <ol class="hub-flow" aria-label="Where graphs sit">
    <li class="hub-flow__node"><span class="hub-flow__name">Statbank</span><span class="hub-flow__note">Where the numbers come from</span></li>
    <li class="hub-flow__edge" aria-hidden="true"></li>
    <li class="hub-flow__node" aria-current="step"><span class="hub-flow__name">Graphs</span><span class="hub-flow__note">Clean and join them</span></li>
    <li class="hub-flow__edge" aria-hidden="true"></li>
    <li class="hub-flow__node"><span class="hub-flow__name">Dashboards</span><span class="hub-flow__note">Where people read them</span></li>
  </ol>
  <figcaption class="hub-flow__caption">Sources are read-only; this app owns the graphs.</figcaption>
</figure>
```

```css
.hub-flow { list-style: none; margin: 0; padding: 0; display: flex; align-items: stretch; }
.hub-flow__node { flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; gap: 4px;
                  padding: var(--hub-space-4); background: var(--hub-color-surface);
                  border: 1px solid var(--hub-color-line-strong); border-radius: var(--hub-radius-control); }
.hub-flow__name { font: var(--hub-text-label); }
.hub-flow__note { font: var(--hub-text-caption); color: var(--hub-color-ink-muted); }
.hub-flow__node[aria-current="step"] { background: var(--hub-color-ink); border-color: var(--hub-color-ink);
                                       color: var(--hub-color-ink-on-ink); }
.hub-flow__node[aria-current="step"] .hub-flow__note { color: var(--hub-color-ink-on-ink); }
.hub-flow__node[data-tone="success"] { border-left: var(--hub-tone-edge) solid var(--hub-color-success); }
.hub-flow__node[data-tone="warning"] { border-left: var(--hub-tone-edge) solid var(--hub-color-warning); }
.hub-flow__edge { flex: 0 0 var(--hub-space-6); align-self: center; height: 1px; position: relative;
                  background: var(--hub-color-line-strong); }
.hub-flow__edge::after { content: ""; position: absolute; right: 0; top: -3px; width: 6px; height: 6px;
                         border-right: 1.5px solid var(--hub-color-ink-subtle);
                         border-top: 1.5px solid var(--hub-color-ink-subtle); transform: rotate(45deg); }
.hub-flow__caption { font: var(--hub-text-caption); color: var(--hub-color-ink-muted);
                     margin: var(--hub-space-3) 0 0; max-width: var(--hub-width-prose); }
@media (max-width: 720px) {
  .hub-flow { flex-direction: column; }
  .hub-flow__edge { flex-basis: var(--hub-space-5); width: 1px; height: auto; align-self: center; }
  .hub-flow__edge::after { top: auto; bottom: 0; right: -3px; transform: rotate(135deg); }
}
```

A loop says so in words under the row — "Then back to Monitor" with
`bx-revision` — rather than a curve drawn around the nodes. Tone rides on the
left edge of a node, as everywhere else; a node is never filled with a tone.
Five nodes at most in a row; more than that is a canvas.

## Error state

Errors explain what went wrong and how to fix it. Never an apology, never
vague. A plate with `data-tone="danger"` gets a 3px danger edge on the left.
