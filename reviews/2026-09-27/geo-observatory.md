# GEO Observatory — design review against Kridt

**For:** the agent that maintains GEO Observatory (`https://geo-observatory.building-bricks.online`)
**Reviewed:** 27 September 2026, signed in, 1440×900 and 390×844, light and dark
**Screens:** Overview, How GEO Observatory works, Collection, Prompts, Responses, Domains, Keywords, plus the signed-out entry
**Evidence:** `evidence/geo-observatory/` next to this file — local only, do not commit it

---

## Read this first

The owner has decided that **every app in the hub ecosystem uses Kridt**, the hub design
system, so the seven apps read as one premium product suite. This overrides the default in
the `hub-design-system` skill that lets a project keep its own design system. Use the skill
for *how*; this report is the decision about *what*.

- Source: https://github.com/building-blocks-online/hub-style-guide — `QUICKREF.md`,
  `skills/hub-design-system/SKILL.md`, `references/tokens.css`, `layout.css`,
  `components.md` and `writing.md`.
- Reference screens: Storybook, *Layout → Page archetypes*.
- **Pull the latest style guide first.** It fixes the contrast of `--hub-color-ink-subtle`
  (48 text elements fail on your tour page because of it), adds the cascade-layer rule that
  causes P0-2 below, and adds the components several findings rely on (see `00-ecosystem.md`).

---

## Verdict

GEO Observatory has adopted Kridt's tokens, shell, Boxicons and dark theme — the foundation is
right. On top of it, the app has drifted further than any other in the ecosystem: two pages
have lost their padding, input icons sit on top of the text, there are three button styles,
four empty-state styles, filled amber banners, coloured figures, tracked capitals, weight 700
and 9px text. **It is also the app with the most to gain.** An observatory is instruments,
gauges and trends — the exact thing Kridt's stat row and gauges were drawn for. Done right,
this is the ecosystem's showpiece.

| Area | Score (1–5) | Note |
|---|---|---|
| Kridt tokens | 5 | Current tokens loaded |
| Shell and navigation | 2 | Eight nav groups, How it works first and wrapping, 125px person block |
| Layout and archetype | 2 | Prompts and Responses have no page padding and 24px titles |
| Components | 2 | Three button styles, four empty states, filled banners, segmented tabs |
| Typography | 3 | 39/600 on most pages; 36/700 tour title, 700 emphasis, 9–11px text |
| Colour discipline | 2 | Amber and green figures, Skagen fills, amber for good news |
| Icons | 4 | Boxicons throughout |
| Empty and error states | 2 | Four styles; no actions; empty charts are grey blocks |
| Accessibility | 2 | Contrast (fixed upstream), five unlabelled inputs, icons over text |
| Narrow screens | 2 | Bar overlaps, button labels wrap, metrics strip clipped |
| Premium finish | 2 | The potential is the highest in the ecosystem |

---

## P0 — fix first

**P0-1. Prompts and Responses have no page padding.**
Measured: `<main>` has `padding: 0` and the page wrapper (`mx-auto w-full max-w-7xl`) has none
either, so the title, tabs, filter plate and empty state start on the sidebar's hairline
(x = 232) and run to the window's right edge. Other pages pad themselves, which is why this
slipped. Fix: padding belongs to the archetype, not to each page. Wrap every route in its
archetype class — `.hub-page--table` for Prompts, Responses, Domains and Keywords
(`padding: var(--hub-space-6) var(--hub-space-5) var(--hub-space-9)`), `.hub-page--dashboard`
for Overview and Collection, `.hub-page--reading` for the tour.

**P0-2. Icons sit on top of the input text.**
Measured: the Keywords search has class `pl-9` but computes `padding-left: 12px`, so the
placeholder starts at x = 268 under the magnifier (268–282). The Responses date inputs have
`pl-8` and compute 12px too. Cause: the Kridt CSS in your build is unlayered, and unlayered
CSS beats Tailwind's `@layer utilities`, so `.hub-input { padding }` wins over every padding
utility. Fix both ways:
1. Import the Kridt component CSS into Tailwind's components layer —
   `@import "./hub/components.css" layer(components);` — so utilities can override it
   (tokens are custom properties and are unaffected).
2. Use the new **Field with icon** recipe (`00-ecosystem.md`) instead of hand-placing icons.

**P0-3. One name per page.** The nav item and the breadcrumb say "Domains"; the page title says
"Sources" (which is also the name of the nav group). Title it "Domains".

**P0-4. Narrow screens break.** At 390px:
- the theme button in the bar covers the breadcrumb ("Ove…w");
- "Generate report" and "7 days / 30 days / 90 days" wrap onto two lines inside their buttons;
- the metrics strip is cut off at the right edge ("0 sources D…").
Fix: below 720px the bar keeps the menu button, the brand selector and one round tool, and
drops the breadcrumb; buttons never wrap (`white-space: nowrap`); the time range becomes a
full-width segmented control on its own row; the metrics fold into the stat row (P1-6).

---

## P1 — make it Kridt

**P1-1. One button system.**
Today there are three: ink pill ("Collect Fresh Data"), Skagen-filled 8px ("Add Prompt"), and
8px ghosts ("Generate report", "Recompute"), plus ghost pills elsewhere. Kridt: **one ink pill
per view** for the primary; ghost pills with a hairline for secondary; quiet text buttons for
tertiary; every button a pill (`--hub-button-radius`). "Add prompt" becomes the ink pill.
Labels in sentence case: "Collect fresh data", "Add prompt", "Refresh from Ahrefs".

**P1-2. Operator tools are not page content.**
Domains shows six maintenance pills ("Refresh Authority Scores", "Refresh Traffic Data",
"Re-run AIO citations", "Fix Gemini source domains", "Fix AI Overview search records",
"Fix source labels") that wrap onto two rows above the content. Move them into one overflow
menu — a round button (`bx-dots-horizontal-rounded`, `aria-label="Maintenance"`) at the end of
the page head — or onto the Manage pages. Same for Keywords: one primary ("Refresh keywords",
with the source as a choice inside it) and CSV import and export in the overflow menu.

**P1-3. Disabled actions say why.**
On Keywords, "Refresh from Ahrefs" is a grey-filled block and "Refresh from DataForSEO" and
"Download CSV" are greyed ghosts, while the reason sits in a separate amber strip. Keep the
button in its normal style at `opacity: .45` with `aria-disabled="true"`, and put the reason
directly under the page head as a Banner with the fix as a link ("Add a domain").

**P1-4. Banners, not filled blocks.**
"AI engine collection is degraded" (Overview, Collection) and "This brand has no domain set"
(Keywords) are filled amber panels; in dark they are brown slabs. Use the new **Banner**:
paper, hairline, a 3px warning edge on the left, warning icon, one bold line and one plain
line, and the dismiss as a round icon button with `aria-label="Dismiss"`. Every banner that
names a fix links to it.

**P1-5. The stat row: one anatomy, gauges, ink figures.**
Overview's four cells have four different anatomies (a green pill under one, a gauge in one,
a green figure in one, nothing in one); Collection's three cells are a label and a zero.
Give every cell the Kridt anatomy — icon disc, label, figure, note:
- **Gauges where the value is a share or a score:** Quality (0–10), Mention rate (%) and Share
  of voice (%). Sentiment runs −1 to +1, so use a centred bar or a plain figure with a note.
- **Figures in ink** at `--hub-text-figure` (28/500). Today they are Tailwind `text-amber-700`
  and `text-green-700`. Tone goes in the note ("Directional, n = 0"), never in the figure,
  except `.hub-stat--attention` for a real problem.
- **No `tabular-nums` on a single figure.** Measured: every `.hub-stat__value` has
  `font-variant-numeric: tabular-nums`, which gives "." and "/" a full digit's width. That is
  why the figures read "0 . 0/10" and "+0 . 00". The Kridt stat-row component set it too, and
  the latest style guide removes it. Re-copy the component, or delete the property. Tabular
  figures are for digits that stack in a column (`writing.md`, *Numbers and units*).
- **Notes under every figure** ("Across 5 engines", "Last 30 days", "Scheduled over 7 days").

**P1-6. No middle-dot strips.**
The grey strip "○ 0 queries · ○ 0 analyzed · ○ 0 scores · ○ 0 gaps · ○ 0 sources" repeats the
stat row in a smaller voice and is clipped on phones. Fold these counts into the stat cells'
notes, or give each its own slot in a definition row with no dots and no hollow circles.

**P1-7. One empty state.**
There are four today: a sunken well (Prompts, Keywords), a dashed box (Responses), a bordered
plate (Collection) and a large grey block (both empty charts). Kridt: a sunken well, one line
saying what will live here, **one action** (`components.md`, *Empty state*):
- Prompts → "Add prompt". Responses → "Set up prompts". Keywords → "Add a domain".
- Collection's "Create templates on the Prompts page" becomes a link to Prompts.
- Empty charts use the new **Empty chart** state: ghosted axes at the chart's real size, one
  line, one action — not a grey rectangle.

**P1-8. Good news is not a warning.**
"No gaps detected yet" shows a check in an amber disc with amber text, next to an amber
"⚠ —" pill. Nothing is wrong. Use ink-muted text, the check in a neutral disc, and the
small-sample caveat as a caption.

**P1-9. Type.**
- The tour title "The quick tour" is 36px/700 (`text-3xl font-bold`). Use `--hub-text-display-2` (39/600).
- Prompts and Responses titles are 24px/600, while the other pages use 39/600. All page titles
  use display-2 (`.hub-page__title`).
- The brand "GEO Observatory" and every `strong` render at 700. Kridt stops at 600. Both come
  free with the latest style guide: `layout.css` now sets the brand at 600, and `tokens.css`
  sets `strong, b` to 600. Remove any `font-bold` that overrides them.
- The tour's illustrations use 9px, 9.5px, 10px and 11px text. Nothing goes below 12px (caption).
- Mono only for literal code (`robots.txt`, `llms.txt`, `<h1>`), at 13px (`--hub-text-code`).
  Words like "link" and "structured data" are prose.
- The italic caption on Collection ("Jobs are scheduled across 7 days…") is roman caption text.

**P1-10. No eyebrows, no capitals.**
"HOW GEO OBSERVATORY WORKS" (a tinted pill above the title) and "ON THIS PAGE" are tracked
capitals — a tell in `SKILL.md`. Delete the eyebrow; the title starts the page. "On this page"
is a sentence-case caption.

**P1-11. Tabs are underlined; segmented is for parameters.**
Prompts uses underline tabs — correct. Domains uses a segmented control for "Domains | Gap
Analysis", which switches views, so it is tabs. The time range (7/30/90 days) is a parameter,
so it correctly stays segmented — see the new **Segmented control**.

**P1-12. The sidebar.**
Measured: eight nav groups (General, Sources, Optimize, Actions, Measure, Project, Manage,
Observatory) in a scroll area holding 1,483px of nav in 711px of height. Items are cut off
behind the person block. "How GEO Observatory works" is the first item and wraps onto two lines.
- Consolidate to five groups at most, one line per item.
- Move How it works to the last group, or behind the help button.
- The person block (125px, the email twice over four lines) becomes the **Person block**:
  neutral avatar, display name, role — two lines.
- The orange avatar becomes neutral. The bar ends with the same disc as the account menu,
  after the round tools, as in every Kridt shell.

**P1-13. One title rule.** Every page's title is the page's name — except Overview, whose title
is the brand name. Title Overview "Overview"; the brand already lives in the bar's selector.
Give the selector the full name in its popover and a `title` attribute, since it truncates
("Persona Seed Brand (spec 1").

**P1-14. Filters are a toolbar.**
Responses stacks eight controls in a bordered plate with three field styles: Tailwind
`border-gray-300`, a 30px field at 12px text, and native `dd/mm/yyyy` date inputs with the icon
over the text. Use the table archetype's toolbar (`.hub-toolbar`), directly above the results.
Put the search field first, then labelled selects for Engine, Brand mentioned, Sentiment and
Prompt category. Then one date-range control, with Sort at the end. The five grey engine pills
become the same "All engines" select that Domains already uses, because Kridt chips are status
only, never a filter toggle. Every field is `.hub-input` with a visible label. Measured: four
inputs here and one on Keywords have no label.

**P1-15. Colour is for marks, not decoration.**
- The chat button is Skagen-filled. It becomes the **Floating help button**: ink, 48px.
- Collection's "Next run" plate has a decorative Skagen edge; the 3px edge is for tone only.
- Its engine cost pills are grey fills; use Tags, or a small definition table.
- "$0.00" is 24px/700 in Skagen; use a figure (28/500) in ink.
- The tour's contents list marks the current section with a tinted block; use ink text with a
  2px ink rule on the left.
- The numbered discs are Skagen-filled; use ink outline discs. They are a real sequence, so
  numbers are right.

---

## P2 — premium finish

- **Radii.** A 4px radius appears once on Overview and Collection and twelve times on the
  tour. Kridt controls are 8px.
- **Shadows.** Two on the tour (`span.inline-flex.items-center`); Kridt has none.
- **Tour spacing.** About 130px of blank space sits between the intro and the first section,
  because the contents column starts lower than the text. Align both to the first section.
- **Tour loop diagram.** Four cards of different widths with loose arrows. Use the new **Flow
  diagram** (Persona Hub's "How it works" is the model): equal nodes in one hairline row, the
  loop drawn as a return path, the stage you are reading about inverted in ink.
- **Seed data in production.** Every page title and subtitle reads "Persona Seed Brand (spec
  105)". Rename the seed brand or hide seed tenants in production; test names read as unfinished.
- **Console.** The Search Console endpoints `…/search-console/backfill/status` and
  `…/search-console/connection` return 503 on every page load (16 errors in one session).
  Do not poll an unconfigured integration; show its state in Settings instead.

---

## The wow — what premium looks like for GEO Observatory

1. **An observatory that reads like one.** Overview opens on four instruments — Quality,
   Mention rate, Share of voice as gauges, Sentiment as a centred bar — drawing once in 600ms.
   Below them the visibility trend is a real line chart: the brand's line in Skagen, everything
   else in ink-muted, with a ghosted frame while empty.
2. **The engine strip.** Replace the degraded-collection paragraph with five engine cells in one
   hairline row — engine name, a status dot (live, sample, off) and last run. The state of
   collection becomes glanceable.
3. **The loop as the map.** The tour's Monitor → Analyze → Playbooks → Track loop, drawn as a
   Kridt flow diagram, doubles as navigation. Each node links to its page, and the current
   page's node is inverted in ink.

---

## Kridt expansions to adopt

From `00-ecosystem.md`: **Banner**, **Field with icon**, **Segmented control**, **Empty chart**,
**Flow diagram**, **Person block**, **Floating help button**, **Tag**, **App mark**, **App
switcher**, **Sign-in sheet**, and the **cascade-layer rule** for Tailwind builds.

## Definition of done

- [ ] Every route sits in its archetype; nothing touches the sidebar or the window edge.
- [ ] Kridt CSS imported into `@layer components`; no icon overlaps text.
- [ ] One ink pill per view; all buttons pills in sentence case; maintenance behind one menu.
- [ ] Stat cells share one anatomy with gauges, ink figures, notes and no tabular single figures.
- [ ] Banners, empty states and empty charts use the Kridt recipes, each with its action.
- [ ] Titles at 39/600; nothing at 700 or under 12px; no eyebrows; no italics.
- [ ] Five nav groups at most; Person block; neutral avatar; ink help button.
- [ ] Every input labelled; latest tokens pulled; both themes and 390px checked.
