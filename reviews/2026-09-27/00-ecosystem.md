# The hub ecosystem — design review summary

**For:** the owner, and every agent that maintains a hub app. Read this before your own report.
**Reviewed:** 27 September 2026, with Playwright, against Kridt (the hub design system),
at 1440×900 and 390×844, light and dark. Evidence (screenshots, measurements, console logs)
is in `evidence/` next to this file, local only. **Do not commit it anywhere.**

---

## Read this first

**Every hub app uses Kridt, wholesale.** The owner decided this so the seven apps read as one
premium product. It overrides the default in the `hub-design-system` skill that lets a
project keep its own design system. The skill now states the exception itself, in
`SKILL.md`, *Precedence*. Where an app's local style and Kridt disagree, Kridt wins.

The style guide changed today, in commit `fda70d2`. **Pull it before you start**, because
several findings in your report are fixed simply by pulling:

- **Contrast.** `--hub-color-ink-subtle` failed WCAG AA: 3.14:1 by day and 4.34:1 at night.
  It is now `#636F68` by day and `#869690` at night, 4.5:1 or better on every surface. Nav
  group labels, placeholders, table headers and keyboard hints pass without any change.
- **Weights.** Kridt's own sidebar brand was weight 700; it is now 600. `tokens.css` sets
  `strong, b { font-weight: 600 }`. The font links no longer load 700.
- **Stat figures.** The stat-row component set tabular digits on a lone figure, which made
  "0.0/10" read "0 . 0/10". That setting is removed.
- **Narrow bar.** Below 720px the breadcrumb collapses to the current page, on one line.
- **New pieces.** Everything in *Kridt expansions* below.

Repository: https://github.com/building-blocks-online/hub-style-guide (public). Start with
`QUICKREF.md`, *Across the hub apps*.

---

## Coverage

| App | Reviewed | Report |
|---|---|---|
| Orbit | Signed in: Dashboard, App Catalog, Skills & Agents, Snippets, Feedback, Admin | `orbit.md` |
| Prototype Hub | Signed in: 7 screens | `prototype-hub.md` |
| GEO Observatory | Signed in: 7 screens | `geo-observatory.md` |
| Persona Hub | Signed in: all 3 screens | `persona-hub.md` |
| Communication Hub | Signed in: Runs (no runs exist for the account); public How it works | `communication-hub.md` |
| Orchestration Hub | Signed in: Workflows (empty for the account), How this works | `orchestration-hub.md` |
| Client Hub | Signed in: Clients, API access, How it works | `client-hub.md` |

Every app was reviewed signed in, and the sign-in screens were reviewed signed out. The one
screen not reviewed is Orchestration Hub's workflow editor: the review account has no
workflows, and creating one would change the owner's data. Its checklist is in
`orchestration-hub.md`.

---

## The state of the ecosystem

**The foundation is already shared.** All seven apps load the current Kridt tokens:
porcelain ground `#F2F4F1`, Skagen action `#0F6C86`, no gradients, no glass, no blur, and
dark mode that follows the system. All seven use Schibsted Grotesk. Prototype Hub, GEO
Observatory, Persona Hub and Client Hub use Boxicons. Orbit uses Lucide, Communication Hub
draws inline SVG, and Orchestration Hub has almost no icons.

**The drift is in everything built on top of the tokens.** Each app built its own shell
pieces, and each built them differently. There are seven sign-in experiences, six treatments
of the signed-in person, three spellings of the same person's name, four help-button styles,
five theme controls, and four empty-state styles in one app alone. That is why the apps look
related but not like one product. The fix is to share those pieces, not to restyle each app.

| App | Premium today (1–5) | Biggest gap |
|---|---|---|
| Prototype Hub | 3 | Finish: gauges, pills, one primary per view |
| Persona Hub | 3 | The landing page is an empty dead end |
| Client Hub | 3 | Detail: two avatars, its own type sizes, raw IDs, a table that breaks on phones |
| Communication Hub | 3 | Not on the Kridt shell; the page scrolls sideways on phones |
| Orchestration Hub | 3 | Not on the Kridt shell; the page scrolls sideways on phones |
| Orbit | 2 | A tray of floating cards; Lucide icons; type too small and too bold |
| GEO Observatory | 2 | The most drift: padding, buttons, banners, figures, nav |

---

## Consistency matrix

What each app does today, where one app differs from the next. "—" means none was observed,
and "not seen" means the screen was not reviewed. The last column is the target for all.

| | Orbit | Prototype Hub | GEO Observatory | Persona Hub | Communication Hub | Orchestration Hub | Client Hub | **Kridt, every app** |
|---|---|---|---|---|---|---|---|---|
| **Sign-in** | Unbranded Auth0 page | Unbranded Auth0 page | Unbranded Auth0 page | Unbranded Auth0 page | Own screen, no sheet | Own sheet, pale mark | Own sheet, ink mark | One Sign-in sheet, then a branded Auth0 page |
| **Shell** | Sidebar and bar | Sidebar and bar | Sidebar and bar | Sidebar and bar | Top bar, no sidebar | Top bar, no sidebar | Sidebar and bar | `.hub-shell` |
| **Bar, left** | Page title as the `h1`; goes stale | Breadcrumb | Brand selector, then crumb | Plain title | Inline links to five apps | Brand, then green chips for three apps | Menu button, then breadcrumb | Breadcrumb |
| **Bar, right** | Moon, bell, raw email, "Admin" pill | Search, Feedback button, avatar | One theme button | Feedback pill, avatar | Status pill, help link, 3-way theme, name, sign-out text | Help link, 3-way theme, name, sign-out pill | 3-way theme, avatar | Round tools, switcher last, then the avatar |
| **Brand** | Name, 18/700 | Name only | Name at 700 | Name over tagline | Mark, name over tagline | Pale mark, name over tagline | Name at 700, no mark | Mark and name, one line, 600 |
| **Person** | Email in the bar | App description at the foot | Email twice over 4 lines | Twice: bar and foot | "Hub S." text in the bar | "Hub Style" text in the bar | "Hub S." block at the foot | Person block at the sidebar foot |
| **Avatar** | — | Orange | Orange | Orange and grey | — | — | Orange in the bar, grey icon at the foot | Neutral disc |
| **Help** | Ink round button | Nav item and bar button | Skagen round button | Nav item and bar pill | Ink labelled pill | Ink labelled pill, emoji glyph | Ink labelled pill, emoji glyph | Round ink help button |
| **Theme control** | Bare moon icon | — | Round button | — | 3-way, in the bar | 3-way, ink when chosen | 3-way, chip when chosen | Round button; 3-way on sign-in |
| **Buttons** | 8px | 8px | 8px and pills; a Skagen fill | Pills | Pills | Pills; the primary twice | Pills | Pills; one ink primary per view |
| **Categories** | Pills | Pills | Grey pills | — | — | — | Grey pills for API methods | Tags |
| **Tabs** | Two kinds of segmented pills | — | Underline and segmented | — | — | Underline | — | Underline; segmented is for parameters |
| **Stat row** | 5 floating cards, 24/700 | Touching cells, no gauges | Four anatomies, one gauge | Inline figures | — | — | — | Touching cells, gauges, 28/500 |
| **Page title** | 24/700, an `h2` | 39/600 | 39/600, 24/600 and 36/700 | 39/600 | 25/500 slogan | 39/600 | 39/600 | 39/600 `h1` |
| **Weight 700** | Titles, figures, brand | `strong` | Brand, `strong`, tour title | `strong` | `strong` on help | `strong` on help | Brand, `strong` | None |
| **Type sizes** | Adds 10px, 18px and 24px | Adds 11px, 15px and 18px | Adds 9–11px, 15px, 18px and 24px | Kridt steps | Kridt steps | Kridt steps | Own rem sizes between the steps | Kridt text tokens only |
| **Icons** | Lucide | Boxicons | Boxicons | Boxicons | Inline SVG | Almost none | Boxicons | Boxicons |
| **Notices** | — | — | Filled amber panels | — | Amber pill in the bar | — | — | Banner |
| **Empty states** | No action; literal backticks | Clean | Four styles, no actions | Landing has no action | Action, but conflicting copy | Kridt well; primary repeated | — | Well, one line, one action |
| **How it works** | not seen | "How it works" | "How GEO Observatory works" | "How it works" | "How this works" | "How this works"; scrolls a container | "How it works" | "How it works", same structure |
| **Phone, 390px** | Cards one per row | Cells one per row | Bar overlaps; strip clipped | Fine | Page 538px wide | Page 461px wide | Table cut off | Two columns; 16px gutter |
| **Tab title** | "Orbit Dashboard" | "Prototype Hub" | "GEO Observatory" | "Persona Hub" | App name and tagline | App name and tagline | App name and tagline | "Page — App" |

---

## Problems shared by several apps

Each item appears in two or more reports. Fix them the same way everywhere.

1. **The shell pieces were each built locally.** The mark, person, help, theme, sign-in and
   app links are now shared in `layout.css` (*Kridt expansions*). Use them unchanged; a
   local variant is a fork.
2. **Weight 700.** It appears in all five apps reviewed in depth, mostly in `strong` and the
   brand. The latest style guide fixes both; remove every `font-bold` that remains.
3. **Orange avatars.** Prototype Hub, GEO Observatory, Persona Hub and Client Hub use them,
   and Persona Hub and Client Hub draw a second, grey avatar at the sidebar foot. People are
   not status, so the avatar is one neutral initials disc, the same in both places.
4. **Help in two places, four ways.** Feedback sits in the nav and the bar in Prototype Hub
   and Persona Hub. Help buttons are ink, Skagen, labelled or missing, and Orchestration Hub
   and Client Hub draw an emoji instead of an icon. Use one round ink button with
   `bx-message-rounded-dots`, bottom-right. On canvas pages it moves into the bar.
5. **One person, three spellings.** The review account appears as "Hub Style" in Orchestration
   Hub, "Hub S." in Client Hub and Communication Hub, and as a raw email address in Orbit, GEO
   Observatory and Persona Hub. Every app shows the display name from the Orbit profile, in one
   format, in the Person block.
6. **Two apps off the shell.** Orchestration Hub and Communication Hub share a top-bar frame
   with inline app links, a theme control, a name and a sign-out, and both scroll sideways on a
   phone. Moving both onto `.hub-shell` fixes both problems at once.
7. **Status colour used for navigation.** Orchestration Hub's app links are success-green
   chips, and Communication Hub's carry green dots. Green means healthy everywhere else. The
   App switcher replaces both.
8. **The primary, twice.** Orchestration Hub and Communication Hub show their ink primary in
   the page head and again in the empty state. While a list is empty, the empty state carries
   the action; once it has items, the page head does.
9. **Pills that are not status.** Orbit, Prototype Hub, GEO Observatory and Client Hub draw
   categories as pills, so every label reads as state. Categories become Tags.
10. **Stat rows without instruments.** Orbit, Prototype Hub and GEO Observatory have counts
    with no gauge or note, and GEO colours its figures. Every cell gets the same anatomy;
    shares get gauges; figures are ink.
11. **Empty screens with no way forward.** Orbit, Persona Hub and GEO Observatory have them.
    Each empty state names what will live there and offers one action. Charts keep their frame.
12. **Type sizes off the scale.** Orbit, Prototype Hub, GEO Observatory and Client Hub add sizes
    between or below the Kridt steps, down to 9px. Use the `--hub-text-*` tokens only.
13. **Test data in production.** GEO Observatory's titles read "Persona Seed Brand (spec 105)".
    Orbit's catalog leads with "check-113" and "This is and end to end test". Hide seed and
    test records in production; they read as unfinished.
14. **Persona Hub reads clients wrongly.** Client Hub lists a client for the review account,
    and its help says everyone who signs in sees every client; Prototype Hub shows it too.
    Persona Hub shows none. The fix is in Persona Hub.
15. **Tailwind overruling Kridt.** In GEO Observatory, unlayered Kridt CSS beats Tailwind's
    padding utilities and puts icons on top of text. Any app on Tailwind should import the
    Kridt CSS with `layer(components)`.
16. **Tab titles that never change.** Every app shows its own name on every page. Use
    "Page — App", so seven open tabs can be told apart.

---

## Kridt expansions — what landed in the style guide

Copy these from the repository, never from this report. The repository is the only source
of truth, and a copy here would drift.

| Expansion | Where | Replaces what the review found |
|---|---|---|
| **App mark** `.hub-mark`, `.hub-mark--lg` | `layout.css`, `Ecosystem/` | Three different sign-in marks, and brands without marks |
| **Brand** `.hub-shell__brand` | `layout.css` | Two-line brands, 700 weights, taglines and versions |
| **App switcher** `.hub-switcher` | `layout.css`, `Ecosystem/` | The app links in Communication Hub and Orchestration Hub, and nothing in the other apps |
| **Person block** `.hub-person` | `layout.css`, `Ecosystem/` | Six different person treatments and three spellings of one name |
| **Help button**, the "floating help button" in the app reports, `.hub-help` | `layout.css`, `Ecosystem/` | Four help-button styles and duplicated entry points |
| **Sign-in sheet** `.hub-signin` | `layout.css`, `Ecosystem/` | Three custom screens and four unbranded Auth0 pages |
| **Theme control** | A round button in the bar; `Segmented` with the theme options on sign-in | Five different theme controls |
| **Segmented control** `.hub-segmented` | `components.md`, `Segmented/` | Segmented pills used as tabs, and tabs used as segments |
| **Tag** `.hub-tag` | `components.md`, `Tag/` | Pills for categories |
| **Banner** `.hub-banner` | `components.md`, `Banner/` | Filled amber panels |
| **Field with an icon** `.hub-input-wrap` | `components.md`, `Field/` | Icons drawn on top of input text |
| **Empty chart** `.hub-empty-chart` | `components.md`, `EmptyChart/` | Grey rectangles where charts should be |
| **Flow diagram** `.hub-flow` | `components.md`, `FlowDiagram/` | Explanatory diagrams drawn differently in every app. Persona Hub's and Client Hub's, with the current node in ink, are the model |
| **Rules** | `SKILL.md`, `layout.md` | Weights stop at 600; nothing under 12px; a lone figure keeps proportional digits; the Tailwind layer rule; "Page — App"; one "How it works" pattern |

Storybook shows all of them: *Layout → Across the ecosystem* and *Components*. The page
archetypes now use the shared shell pieces too.

---

## The shared sign-in, owned by Orbit

The first screen a user sees is currently the least premium screen in the ecosystem:

- Four apps send signed-out users straight to Auth0's Universal Login, which is **unbranded**.
  It shows a black page, Auth0's logo, a stock blue button, "Log in to building-blocks-dev",
  a Sign up link and a red development-keys badge. Tab titles read "Log in | orbit-persona-hub".
- The other three apps show their own "Sign in with Orbit" screens, all built differently.

The fix, in order:

1. **Orbit brands the Universal Login** and renames the tenant and applications to human
   names. `orbit.md`, *Owned by Orbit*, has the settings.
2. **Every app shows the Sign-in sheet first**, then hands off to the branded login. The
   sheet has the large mark, the name at display-2 and one line, then "Sign in with Orbit" at
   full width. A quiet "How it works" link and the theme control follow.
3. **The same mark everywhere.** Each app's mark on its Sign-in sheet is the one in its
   sidebar, in the App switcher and in Orbit's catalog.

---

## Order of work

1. **Pull the style guide** in every app. Contrast, `strong`, the brand weight and the figure
   digits are fixed on pull.
2. **Orbit: brand the Universal Login** and rename the tenant and apps. It is one afternoon of
   settings and changes the first impression of four apps.
3. **Every app: the shared pieces.** Adopt the App mark, brand, Person block, App switcher,
   Help button, Sign-in sheet and theme control. The apps will look like one family before
   any page changes.
4. **Each app's P0 list**, from its report.
5. **Each app's P1 list**, then its wow items.
6. **Review Orchestration Hub's workflow editor** once a workflow exists, then run a second
   full pass of all seven apps side by side.

---

## The wow — premium across the family

1. **One family, visibly.** Seven marks in one system, the same sign-in, the same shell, and
   the App switcher in every bar. Moving between apps feels like moving between rooms of one
   building.
2. **The ecosystem pulse.** The green dots in Communication Hub and Orchestration Hub, grown
   into the App switcher: every app's mark with its live status, shaped so it reads without
   colour.
3. **Instruments, not counts.** Every dashboard leads with a stat row of gauges: Orbit's app
   health, Prototype Hub's success rate, GEO Observatory's visibility and Persona Hub's
   evidence grade. Each draws once, in 600ms, as the page's one orchestrated moment.
4. **The family explains itself the same way.** Every "How it works" page has the same
   structure and the same Flow diagram, and each shows where its app sits among the others.
5. **Small things done everywhere.** Tab titles name the page. Favicons are the app marks, as
   SVG, so seven tabs read as seven rooms of one house. Nothing is bolder than 600.

---

## Definition of done, for the ecosystem

- [ ] All seven apps on the latest style guide; no local copies of shared pieces.
- [ ] Signed out, every app shows the same Sign-in sheet, then the branded Universal Login.
- [ ] Signed in, every app has the same shell: App mark brand, breadcrumb, round tools,
      App switcher, neutral avatar, Person block, round help button.
- [ ] No weight 700, no text under 12px, no tracked capitals, no middle-dot strings.
- [ ] Categories are Tags, status is chips, notices are Banners, and every empty state has an action.
- [ ] Every dashboard's stat row has gauges and ink figures.
- [ ] Tab titles read "Page — App"; every app has a "How it works" page.
- [ ] Both themes, the un-stamped system default and a 390px phone checked in every app.
- [ ] No seed or test records visible in production.
