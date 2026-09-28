# Orbit — design review against Kridt

**For:** the agent that maintains Orbit (`https://orbit.building-bricks.online`)
**Reviewed:** 27 September 2026, signed in as an Admin account, 1440×900 and 390×844, light and dark
**Screens:** Dashboard, App Catalog, Skills & Agents, Snippets, Feedback, Admin, plus the signed-out entry
**Evidence:** `evidence/orbit/` next to this file — local only, do not commit it

---

## Read this first

The owner has decided that **every app in the hub ecosystem uses Kridt**, the hub design
system, so the seven apps read as one premium product suite. This overrides the default in
the `hub-design-system` skill that lets a project keep its own design system. Here, Kridt
wins. Use the skill for *how*; this report is the decision about *what*.

- Source: https://github.com/building-blocks-online/hub-style-guide
- One page: `QUICKREF.md`. Full rules: `skills/hub-design-system/SKILL.md`.
- Source of truth: `skills/hub-design-system/references/tokens.css` and `layout.css`.
- Reference screens: run the Storybook (`npm run storybook`) and open
  *Layout → Page archetypes → Dashboard page*. That page is the target for Orbit's dashboard.
- **Pull the latest `tokens.css` before starting.** This review fixed a contrast bug in
  `--hub-color-ink-subtle` and added components that several findings below rely on
  (see `00-ecosystem.md`, *Kridt expansions*).

**Orbit has a second job the other apps don't:** it is the home of the ecosystem and the
identity provider ("Sign in with Orbit"). Its screens set the bar the others are measured
against, and the shared sign-in finding at the end of this report is Orbit's to own.

---

## Verdict

Orbit already loads the current Kridt tokens, has no shadows, blur or gradients, follows the
system dark mode cleanly, and uses the ink block for the current nav item. The foundation is
right. What keeps it from looking premium is that **it is built as a tray of floating cards
rather than one sheet**, its type is smaller and bolder than Kridt, it uses Lucide where Kridt
and most of the apps use Boxicons, and a handful of visible bugs (a stale bar title, literal backticks,
an orphaned KPI card) read as unfinished.

| Area | Score (1–5) | Note |
|---|---|---|
| Kridt tokens | 5 | Current tokens loaded; ground, ink and action are correct |
| Shell and navigation | 3 | Right structure; bar shows a page title, not a breadcrumb; person in the bar as a raw email |
| Layout and archetype | 2 | Cards in a tray with gaps; Kridt is one sheet divided by hairlines |
| Components | 2 | 8px buttons, pills used for categories and filters, two status styles |
| Typography | 2 | Page titles 24px/700 and figures 24px/700; Kridt is 39px/600 and 28px/500 |
| Colour discipline | 3 | Red and amber icons on zero values |
| Icons | 1 | Lucide; Kridt and four of the other six apps use Boxicons |
| Empty and error states | 3 | Present and calm, but no action and one shows literal backticks |
| Accessibility | 4 | No contrast failures measured; heading order is off (see P1-4) |
| Narrow screens | 3 | No overflow, but KPI cards stack one per row |
| Premium finish | 2 | Correct, not yet premium |

---

## P0 — fix first

**P0-1. The bar title goes stale.**
Where: Skills & Agents. Measured: the bar reads "Dashboard" while the nav and the page heading
read "Skills & Agents". Fix: derive the bar content from the current route, and replace the
bar title with the Kridt breadcrumb (see P1-1), which removes the duplication entirely.

**P0-2. Literal backticks in the empty state.**
Where: Skills & Agents, empty state. Measured: "Publish one with \`rig skill publish\` to see it
here." renders the backticks. Fix: render the command in `<code>` with `font: var(--hub-text-code)`
on `--hub-color-surface-sunken`, no backticks.

**P0-3. An orphaned KPI card.**
Where: Dashboard. Measured: five KPI cards in a four-column grid; "Pending" sits alone on a
second row. Fix: one stat row with five cells (P1-2) — `.hub-stats` takes
`--hub-stats-count: 5` and never orphans.

**P0-4. Colour on figures that are zero.**
Where: Dashboard, "Degraded" (amber icon) and "Unhealthy" (red icon), both showing 0.
Rule: *colour only where it means something*. Fix: icons are ink in a disc; a figure takes
`--hub-color-danger` only when it is non-zero and needs action (`.hub-stat--attention`).

---

## P1 — make it Kridt

**P1-1. Bar: breadcrumb, round tools, no raw email.**
Now: page title (18px/600, and it is the page's `h1`), a bare moon icon, a bare bell, and the
full account email plus an "Admin" pill. Kridt: `.hub-crumb` on the left ("Orbit › Dashboard",
current page in ink); on the right `.hub-search` (optional), then round hairline icon buttons
(`.hub-btn--round`, 38px, `aria-label`) for theme and notifications, then the avatar disc.
Move the person — avatar, display name, role — to the sidebar foot (`.hub-shell__me`), where
"Orbit v0.1.0" is now; the version can live in Admin → System Health.

**P1-2. Dashboard as one sheet, not a tray of cards.**
Now: five KPI cards with gaps, then a separate "Recent Applications" card, all floating on the
ground. Kridt dashboard archetype: `.hub-page--dashboard` — a head region, a stat row of cells
that **touch** and are divided by 1px hairlines, then regions divided by hairlines. See the
Storybook *Dashboard page*. Each stat cell: label (`subtitle`, 16px/500), note under the label
("Registered applications"), icon in a 36px disc top-right, a **gauge**, and the figure beneath
it at `--hub-text-figure` (28px/500). Give "Healthy" a gauge of healthy ÷ total — that one
gauge tells the whole story at a glance.

**P1-3. Type: bigger, lighter.**
Measured: page titles `h2.text-2xl.font-bold` = 24px/700; KPI figures 24px/700; brand
"Orbit" 18px/700. Kridt: page title `--hub-text-display-2` (39px/600, tracking −0.028em);
figures `--hub-text-figure` (28px/500); nothing at 700 or above. Remove every `font-bold`.

**P1-4. Heading order.**
The bar title is the `h1` on every page and the visible page title is an `h2`. Make the page
title the `h1`; the breadcrumb is not a heading.

**P1-5. Icons: switch to Boxicons.**
Measured: 35 Lucide icons, 0 Boxicons. Kridt's icon set is Boxicons, and four of the other six
apps already use it, so Orbit — the home screen — looks different. Replace with the Boxicons free set (`boxicons` on
npm, `<i class="bx bx-…" aria-hidden="true">`). Mapping for the nav: Dashboard `grid-alt`,
App Catalog `package`, Skills & Agents `extension`, Snippets `code-block`, Feedback
`message-rounded`, Admin `shield`.

**P1-6. Buttons are pills.**
Measured: "Register New App", "New" and the filter buttons use 8px radius. Kridt: every button
is a pill (`--hub-button-radius`); primary is the ink block; secondary is the ghost pill with a
hairline. Also sentence case: "Register new app".

**P1-7. Pills are for status only.**
Now: "Full UI" and "API First" type labels, and "database" / "container" on Admin, are drawn
as pills. Use the new **Tag** (8px radius, hairline, no fill, caption 12/500, ink-muted) for
categories, and keep pills for status alone.

**P1-8. One status style.**
Dashboard uses soft-fill status chips ("Healthy"); Admin uses a green dot and text. Use the
Kridt chip (`.hub-chip--ok|info|warn|fail`) everywhere. "Deploy Failed" in the App Catalog is
drawn neutral grey — it is a failure and must use `--fail`.

**P1-9. Filters: a toolbar, not two rows of toggles.**
App Catalog shows eight status toggles and three type toggles as button rows. Kridt: filters sit
directly above the thing they filter, as a toolbar — a segmented control for the three types
(new **Segmented control** expansion) and a native `<select>` for the eight statuses. On Feedback,
replace the two bare `dd/mm/yyyy` date inputs with one labelled date-range control; native
date pickers are the least premium element on the page.

**P1-10. Tabs look like tabs.**
Skills & Agents and Admin use a segmented pill control for tabs, and the two differ from each
other. Kridt tabs: text labels with a 2px ink underline sitting on the tablist hairline
(`.hub-tab`). The segmented control is only for switching a parameter, such as a time range.

**P1-11. Catalog as a hairline grid.**
App Catalog cards are separate tiles with gaps, and only some carry an app mark, placed
mid-right. Make the catalog one sheet with a 3-column hairline grid (cells touch), every cell
with the same anatomy: app mark (32px ink tile, top-left), name, status chip, type tag,
one-line description (2 lines max). Apps without a mark get a monogram tile, never nothing.

---

## P2 — premium finish

- **Empty states need an action.** Skills & Agents and Snippets explain the CLI but offer
  nothing to click; add one quiet action ("Copy command") beside the code.
- **Measure.** The "How to add a skill" callout runs full width; hold body text at
  `--hub-width-prose` (66ch).
- **"--" placeholders.** The Version column shows `--` for every row. If nothing is versioned,
  hide the column; otherwise use an em dash in `--hub-color-ink-subtle`.
- **Units.** Admin shows "Latency Ms" as a label and a bare number. Write the value with its
  unit: "11 ms", label "Latency".
- **Copy.** "Feedback Dashboard" (the nav says Feedback) → "Feedback". "No feedback found"
  with no filters applied → "No feedback yet". App Catalog: "export to an coding agent" →
  "export to a coding agent".
- **Test entries.** "check-113" and "This is and end to end test" sit first in the production
  catalog. Hide deploy-failed and test registrations behind a filter.
- **Narrow screens.** At 720px and below the stat row goes to 2 columns (Kridt default), not
  one tall card per row.
- **Text under 12px.** Measured: 10px text in 6 places. Nothing goes below the 12px caption.
- **Floating chat button.** Keep it (ink, 48px, bottom-right, `aria-label`) — it is the
  ecosystem standard. Geo Observatory will be asked to match yours.

---

## The wow — what premium looks like for Orbit

Orbit is the front door, so it gets the most finished dashboard in the ecosystem.

1. **The health instrument.** Replace the five cards with one stat row of five touching
   cells, each with a gauge. "Healthy 8 of 10" as an 80% arc is the single most premium
   thing you can put on this screen.
2. **A living catalog.** The hairline-grid catalog with every app's mark in the same place
   turns a list into a product portfolio. The marks are the same ones used on each app's
   sign-in sheet and sidebar, so Orbit becomes the place the family resemblance is obvious.
3. **The app switcher.** Add the ecosystem **App switcher** (new Kridt expansion): a round
   `grid-alt` button in the bar that opens a sheet of the seven app marks. Orbit is the first
   to ship it; every other app follows.
4. **One orchestrated moment.** On first load of the dashboard, the gauges draw from 0 to their
   value in 600ms on `--hub-ease`, once. Nothing else on the page moves.

---

## Owned by Orbit: the shared sign-in experience

Four apps (Orbit, Prototype Hub, Geo Observatory, Persona Hub) send signed-out users straight
to the Auth0 Universal Login, which is **completely unbranded**: black background, Auth0's
logo, a stock blue button, "Log in to building-blocks-dev", a "Sign up" link and a red
dev-tenant warning badge. It is the first screen those users see and the least premium screen
in the ecosystem. The tab titles read "Log in | orbit-persona-hub".

Because it is "Sign in with Orbit", Orbit owns the fix:

1. **Brand the Universal Login** (Auth0 dashboard → Branding → Universal Login): logo = the
   Orbit mark; primary colour `#132420` (spruce — the ink block); page background `#F2F4F1`;
   font URL = Schibsted Grotesk from Google Fonts; widget corner radius 14px, input radius
   8px, button radius as round as the tenant allows.
2. **Rename the tenant's friendly name** from "building-blocks-dev" to "Orbit", and each
   application's display name to its human name ("Persona Hub", not "orbit-persona-hub").
3. **Remove the dev-keys warning** by configuring your own Google OAuth client for the
   Google connection.
4. **Turn off "Sign up"** unless self-registration is intended.
5. **Every app shows the Kridt Sign-in sheet first** (new expansion — see `00-ecosystem.md`),
   with one ink pill "Sign in with Orbit", then hands off to the branded Universal Login. Three
   apps already do this, each differently; Orbit and the other three should adopt the
   standard version so the first impression is identical everywhere.

---

## Kridt expansions Orbit should adopt

From `00-ecosystem.md`: **Tag**, **Segmented control**, **Sign-in sheet**, **Person block**,
**App mark**, **App switcher**, **Floating help button**, **Banner**. Pull the style guide
first; do not build local versions.

## Definition of done

- [ ] No Lucide imports remain; all icons are Boxicons.
- [ ] Bar: breadcrumb left; round icon buttons and avatar right; no email in the bar.
- [ ] Person block in the sidebar foot; version moved out of it.
- [ ] Dashboard is one sheet: stat row of touching cells with gauges, regions divided by hairlines.
- [ ] Page title is the `h1`, 39px/600; no text at weight 700 anywhere.
- [ ] Every button is a pill; categories use Tag; status uses one chip style.
- [ ] Tabs are underline tabs; filters are a toolbar; the date range is one labelled control.
- [ ] No coloured icon or figure on a zero value.
- [ ] Both themes checked, plus the un-stamped system default; 390px width checked.
- [ ] Universal Login branded; tenant and app display names are human names.
