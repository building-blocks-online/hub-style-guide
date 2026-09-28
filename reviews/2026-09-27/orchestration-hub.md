# Orchestration Hub — design review against Kridt

**For:** the agent that maintains Orchestration Hub (`https://orchestration-hub.building-bricks.online`)
**Reviewed:** 27 September 2026, signed in and signed out, 1440×900 and 390×844, light and dark
**Screens:** Workflows (empty for the review account), How this works, and the sign-in screen
**Evidence:** `evidence/orchestration-hub/` next to this file — local only, do not commit it

> **Not reviewed: the workflow editor.** The review account has no workflows, and creating one
> would change your data, so the canvas was not opened. Its checklist is at the end of this
> report and will be applied when a workflow exists.

---

## Read this first

The owner has decided that **every app in the hub ecosystem uses Kridt**, the hub design
system, so the seven apps read as one premium product suite. This overrides the default in
the `hub-design-system` skill that lets a project keep its own design system. The skill now
states that exception itself. Use the skill for *how*; this report is the decision about *what*.

- Source: https://github.com/building-blocks-online/hub-style-guide — `QUICKREF.md`,
  `skills/hub-design-system/SKILL.md`, `references/tokens.css`, `layout.css`, `layout.md`,
  `components.md`, `writing.md` and, for you above all, **`references/react-flow.md`**.
- **Pull the latest style guide first.** It sets `strong` to 600 (13 elements on your help
  page are at 700) and adds the shared pieces below (see `00-ecosystem.md`).

---

## Verdict

Orchestration Hub already speaks Kridt at the level of the page. The title is 39/600, the
primary is an ink pill, the tabs are underlined, the empty state is a sunken well, dark mode
follows the system, and there is not a shadow in sight. Its help page explains the app well.
**What it lacks is the Kridt frame.** Like Communication Hub, it has a top bar of app links, a
theme control, a name and a sign-out instead of the sidebar shell the other apps share. It also
**scrolls sideways on a phone**. Move it onto the shell, and it looks like part of the family.

| Area | Score (1–5) | Note |
|---|---|---|
| Kridt tokens | 5 | Current tokens loaded |
| Shell and navigation | 1 | No sidebar or breadcrumb; app links, theme, name and sign-out in the bar |
| Layout and archetype | 3 | The help page scrolls inside a container, not the document |
| Components | 4 | Pills, underline tabs, a Kridt empty state; the primary appears twice |
| Typography | 4 | On scale; 700 emphasis on the help page |
| Colour discipline | 3 | Success green used for navigation chips |
| Icons | 3 | Few icons; the feedback glyph looks like an emoji |
| Empty and error states | 4 | Clear, with actions |
| Accessibility | 4 | No contrast failures measured |
| Narrow screens | 1 | The page is 461px wide on a 390px phone |
| Premium finish | 3 | Calm and correct; the frame keeps it from feeling finished |

---

## P0 — fix first

**P0-1. The page scrolls sideways on a phone.**
Measured at 390px: the document is 461px wide. The bar keeps the mark, "How this works", the
theme control, the name and "Sign out" on one row, so "Sign out" runs off the screen. Fix: the
Kridt shell (P0-2). Below 720px the sidebar becomes a drawer, the breadcrumb collapses to the
current page, and the bar keeps only round tools and the avatar.

**P0-2. Adopt the Kridt shell.**
Rebuild the frame on `.hub-shell` from `layout.css`, as the other apps are doing:
- **Sidebar.** The App mark and "Orchestration Hub" on one line, at bar height, weight 600.
  Nav: Workflows, then How it works in the last group; Archive stays a tab of Workflows. The
  **Person block** at the foot.
- **Bar.** A breadcrumb on the left ("Workflows", or "Workflows › Campaign landing page" in a
  workflow). On the right, round icon buttons for the **App switcher** and the theme, then the
  neutral avatar disc, which opens the account menu with Sign out.

This replaces everything in today's bar:
- the two-line brand ("Orchestration Hub" over "workflow designer");
- the three green app chips;
- the "How this works" link;
- the three-way theme control;
- the name "Hub Style" as plain text;
- the "Sign out" ghost pill.

**P0-3. One primary per view.**
"New workflow" is an ink pill in the page head and again in the empty state, with "Start from
example" beside it both times. Kridt allows one primary per view. While the list is empty, the
empty state carries both actions and the page head holds none. Once workflows exist, "New
workflow" moves to the page head.

---

## P1 — make it Kridt

**P1-1. Navigation is not status.**
The app links are soft-green chips with green dots, `--hub-color-success-soft` and
`--hub-color-success`. Green says "healthy" everywhere else in the ecosystem. The App switcher
replaces them: a round `bx-grid-alt` button that opens every app's mark in the same order in
every app. Your chips list three apps; Communication Hub's lists five, and neither includes
Orbit or GEO Observatory. If the dots were meant as live status, the switcher shows that per
app, with a shaped marker.

**P1-2. The document scrolls, not a container.**
On How this works, the page scrolls inside an inner container. The document stays 900px tall
while the content runs on, and a second scrollbar appears inside the page. Kridt allows one
scroll container per page, and on a reading page it is the document (`layout.md`, *Scroll*).
The inner scroll also breaks browser find, scroll restoration, full-page capture and the
collapsing address bar on phones.

**P1-3. The theme control is one round button.**
In the app, the theme is a round icon button in the bar showing the current mode, as in every
other app. The three-way segmented control belongs on the Sign-in sheet and in the account
menu.

**P1-4. The help button is round, with a Boxicon.**
"Feedback" is an ink pill with a label, bottom-right. Its speech bubble keeps its own colours in
both themes: white on the ink pill by day, lavender on the light pill by night. It looks like an
emoji rather than an icon. Use the shared **Help button**: a 48px ink circle with
`bx-message-rounded-dots` and `aria-label="Feedback"`. On the canvas it moves into the bar,
because React Flow owns both bottom corners.

**P1-5. "How it works", drawn like the others.**
- Name the page "How it works", as every other app does. The title can stay "How Orchestration
  Hub works".
- "Back to workflows" is a pill with underlined text, half button and half link. Inside the
  shell, the breadcrumb is the way back, so the pill goes.
- "Where this sits" marks the current node with a sunken fill and Skagen text. Persona Hub and
  Client Hub invert the current node to ink, and so does the Kridt **Flow diagram**. Use the
  ink inversion.
- `strong` renders at 700 in 13 places. The latest `tokens.css` sets it to 600.

**P1-6. The person, once and the same everywhere.**
The bar shows the account as "Hub Style". Client Hub and Communication Hub show the same
account as "Hub S.", and three other apps show a raw email address. Use the Person block with
the display name from the Orbit profile, in one format across the ecosystem.

---

## P2 — premium finish

- **Tab title.** "Orchestration Hub — Workflow Designer" is Title Case and never names the page.
  Use "Page — App": "Workflows — Orchestration Hub".
- **Lede width.** The Workflows lede runs about 950px wide beside the buttons. Hold it at
  `--hub-width-prose` and let the actions sit at the end of the page head.

---

## The sign-in screen

This is the **closest of the three "Sign in with Orbit" screens to Kridt**. It is a white sheet
with a hairline and 14px corners on the porcelain ground. The name is at display-2 (39/600),
the primary is an ink pill, and the theme control marks the current choice with the ink block.
Measured against the other two:

| | Orchestration Hub | Client Hub | Communication Hub |
|---|---|---|---|
| Sheet | 462px wide, 48px padding | 420px, 40px | none |
| Mark | pale sunken tile, ink and Skagen glyph | 52px ink tile | 40px ink tile beside the name |
| Name | 39/600 `h1` | 32/600 `h1` | not a heading |
| Button | 158×40, 14/500 | full width, 51px, 16/500 | 172×49, 16/400 |
| Theme control, current | ink block | white chip, Skagen text | ink block |

- **P0.** At 390px the sheet is 390px wide at x = 0, so its corners hang off the screen. Use
  the shared width, `min(440px, calc(100vw - 32px))`, which keeps a 16px gutter.
- **P1.** Adopt the shared **Sign-in sheet**. The mark becomes the ink App mark, "Sign in with
  Orbit" goes full width with a 44px minimum height, a quiet "How it works" link follows, then
  the standard theme control labelled "System", "Light" and "Dark".

---

## Still to review: the workflow editor

When a workflow exists, the editor will be checked against these points, all from
`references/react-flow.md` and `layout.md`:

- [ ] The designer uses `.hub-page--canvas`: the graph fills the viewport with a 320px
      inspector beside it. The page never scrolls (`100dvh`, `overflow: hidden`); the
      inspector owns the only scrollbar. The canvas carries `.hub-paper` for the dot grid, and
      an optional foot holds a provenance strip.
- [ ] Controls sit bottom-left and the minimap bottom-right, React Flow's defaults. Toasts are
      bottom-centre. Because both bottom corners are taken, **the help button becomes a round
      tool in the bar on canvas pages** (`layout.md`, *Where things sit*).
- [ ] The `--xy-*` variables are mapped onto semantic tokens exactly as in the variable map, and
      `colorMode="system"` is set so the canvas follows the theme.
- [ ] Every node is a header and a body, 208px wide. The header has an 8px category square and
      the name at label size. The body has one line of real configuration in mono at caption
      size.
- [ ] A glaze appears only in the category square, and one category uses one glaze. Output is
      flare, and a failing node is danger.
- [ ] Idle edges are `line-strong`; the selected edge is Skagen; strokes are 1.5px. One edge
      type is used per graph. **Only real flow animates.**
- [ ] The background is dots with a 24px gap in `--hub-color-dot`. Controls and MiniMap are
      plates.
- [ ] Nodes are reachable by keyboard with visible focus. Selection changes the border weight
      as well as its colour. Labels still read at 50% zoom.

---

## The wow — what premium looks like for Orchestration Hub

1. **The canvas is the showpiece of the ecosystem.** Paper nodes on a dot grid, with one glaze
   square per node as the only colour. The one live path is drawn in Skagen while a run moves
   through it. It should look like a precise instrument, not a whiteboard.
2. **Runs you can watch.** When a workflow runs, its edges animate only where data is moving,
   and each node's body line reports its step. When the run finishes, the path settles back to
   line-strong, and the node that asked a person keeps a tone edge. It links to that decision
   in Communication Hub.
3. **A first workflow in one move.** "Start from example" is the best onboarding in the
   ecosystem. Show the example as a small, live Flow diagram in the empty state, so people see
   what they will get before they press it.

## Kridt expansions to adopt

From `00-ecosystem.md`: **App mark**, **App switcher**, **Person block**, **Help button**,
**Sign-in sheet**, **Segmented control** for the theme, **Flow diagram**, **Banner**, **Tag**,
and the **cascade-layer rule** for Tailwind builds.

## Definition of done

- [ ] Built on `.hub-shell`: sidebar with mark and nav, breadcrumb bar, round tools, avatar.
- [ ] Nothing scrolls sideways at 390px; every page scrolls the document, not a container.
- [ ] One primary per view; the empty state carries the actions while the list is empty.
- [ ] App switcher instead of green chips; round theme button; round help button with a Boxicon.
- [ ] "How it works" named and drawn like the other apps, with the current node in ink.
- [ ] Person block with the Orbit display name; latest tokens pulled; both themes checked.
- [ ] Sign-in screen on the shared Sign-in sheet, with a 16px gutter on phones.
