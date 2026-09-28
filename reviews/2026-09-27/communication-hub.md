# Communication Hub — design review against Kridt

**For:** the agent that maintains Communication Hub (`https://communication-hub.building-bricks.online`)
**Reviewed:** 27 September 2026, 1440×900 and 390×844, light and dark
**Screens:** Runs (signed in; the review account has no runs, so no transcript was reviewed),
How this works (public route `#/how-it-works`), and the Sign in with Orbit screen
**Evidence:** `evidence/communication-hub/` next to this file — local only, do not commit it

---

## Read this first

The owner has decided that **every app in the hub ecosystem uses Kridt**, the hub design
system, so the seven apps read as one premium product suite. This overrides the default in
the `hub-design-system` skill that lets a project keep its own design system. Use the skill
for *how*; this report is the decision about *what*.

- Source: https://github.com/building-blocks-online/hub-style-guide — `QUICKREF.md`,
  `skills/hub-design-system/SKILL.md`, `references/tokens.css`, `layout.css`, `layout.md`,
  `components.md` and `writing.md`.
- Reference screens: Storybook, *Layout → Page archetypes*.
- **Pull the latest style guide first.** It fixes the contrast of `--hub-color-ink-subtle`
  (your "No runs yet" line fails today) and adds the components several findings below rely
  on (see `00-ecosystem.md`).

---

## Verdict

Communication Hub has the **best writing in the ecosystem**. "The log is the point." and its
How this works page explain a hard idea in plain language. Its colours, type and pills are
already Kridt. But it is the one app that **does not use the Kridt shell**. It has a top bar
of inline app links, a text sign-out and a three-way theme control, where every other app has
a sidebar, a breadcrumb and round tools. It also breaks on a phone: the page scrolls sideways.
Moving onto the shell is the single change that makes it look like part of the family.

| Area | Score (1–5) | Note |
|---|---|---|
| Kridt tokens | 5 | Current tokens loaded |
| Shell and navigation | 1 | No sidebar, no breadcrumb; app links, theme control and sign-out in the bar |
| Layout and archetype | 2 | A runs list and an empty canvas, not the split archetype |
| Components | 3 | Ink pills right; two primaries for one action; labelled feedback pill |
| Typography | 4 | Weights 400–500 in the app; 700 emphasis on the help page |
| Colour discipline | 4 | Restrained; decorative green dots |
| Icons | 2 | One Boxicon in the app; the rest inline SVG |
| Empty and error states | 3 | Has an action; the copy contradicts itself |
| Accessibility | 3 | "No runs yet" fails contrast (fixed upstream) |
| Narrow screens | 1 | The page is 538px wide on a 390px phone |
| Premium finish | 3 | The voice is premium; the frame is not |

---

## P0 — fix first

**P0-1. The page scrolls sideways on a phone.**
Measured at 390px: the document is 538px wide. The bar does not collapse, so the theme control
is cut off. The runs panel keeps its width and squeezes the log into a column about 150px wide.
Fix: the Kridt shell and page structure in P0-2 remove the cause. Below 720px the sidebar
becomes a drawer, and each page has one column and one scroll container.

**P0-2. Adopt the Kridt shell.**
Rebuild the frame on `.hub-shell` from `layout.css`, the same as the other six apps:
- **Sidebar.** The **App mark** and "Communication Hub" on one line, at bar height. Nav: Runs,
  How it works, Feedback. The **Person block** at the foot.
- **Bar.** A breadcrumb on the left ("Runs", or "Runs › Quarterly newsletter" inside a run).
  On the right, round icon buttons for the **App switcher** (`bx-grid-alt`) and the theme,
  then the neutral avatar disc that opens the account menu with Sign out.
- **Pages.** Kridt allows one scroll container per page (`layout.md`, *Scroll*). Today the
  runs list and the log sit side by side, each needing its own scroll. Split them into routes:
  - Runs is a table page (`.hub-page--table`), with "Start a run" in the page head.
  - A run opens as its own reading page, "Runs › Quarterly newsletter". The transcript is the
    document and scrolls as one.
  - A step's detail opens as an overlay, never as a column.

This replaces, from today's bar:
- the inline app links;
- the three-way theme control;
- the "Hub S." text and the "Sign out" text button;
- the two-line brand ("Communication Hub" over "task execution & decision log").

**P0-3. One primary, and one story about where runs start.**
"New run" (runs panel) and "Start a run" (canvas) are two ink pills for one action. Meanwhile
the panel says "No runs yet. Start one from an Orchestration Hub workflow." Decide where runs
start and say it once:
- If runs start here, keep one ink pill. While the list is empty, the empty state carries
  "Start a run". Once runs exist, "Start a run" sits in the page head.
- If runs start in Orchestration Hub, the action is a ghost pill, "Open Orchestration Hub",
  with its app mark.

---

## P1 — make it Kridt

**P1-1. The page title names the page.**
The `h1` is "The log is the point." at 25px/500, a slogan in the title's place. Title the page
"Runs" with `.hub-page__title` (39/600). Keep the line, because it is good: it becomes the
empty state's lead, a subtitle at 20/500 with the paragraph under it.

**P1-2. The App switcher replaces the app links.**
The bar links to five apps with green dots. The list includes Communication Hub itself and
leaves out Orbit and GEO Observatory. The ecosystem standard is the **App switcher**: a round
`bx-grid-alt` button that opens a sheet with all seven app marks, the current one inverted.
If the dots mean service health, keep that idea. It is the wow, for every app (below).

**P1-3. Theme is one round button.**
In the app, the theme is a round icon button in the bar, the same as in the other apps. The
three-way System, Light and Dark control stays on the Sign-in sheet and in the account menu.

**P1-4. The help button is round.**
"Feedback" is an ink pill with a label, bottom-right. The ecosystem standard is the
**Floating help button**: a 48px ink circle, `bx-message-rounded-dots`, `aria-label="Feedback"`,
bottom-right, 24px from the edges.

**P1-5. Boxicons for UI icons.**
The app draws one Boxicon; everything else is inline SVG, and the help page has no icons.
Use Boxicons for every UI icon: `bx-play` for start, `bx-check-shield` for a verified log,
`bx-help-circle` for a step waiting on a person. The app mark keeps its own glyph (see
`00-ecosystem.md`, *App mark*).

**P1-6. Status is a chip in the page head.**
"agent offline" is an amber pill between the app links and the help link. Make it a Kridt
status chip in sentence case, "Agent offline", in the Runs page head beside the title. Add one
line that says what it means: "New runs wait until the agent is back."

**P1-7. How it works, not How this works.**
Every other app calls this page "How it works". Use the same name. When signed in, render it
inside the shell as a reading page (`.hub-page--reading`), reached from the nav. Signed out,
it stays public, with the app mark at the top and a quiet "Back to sign in" button in place
of the small "Close" pill.

**P1-8. The help page's finish.**
- Eight `strong` elements render at 700. Kridt stops at 600, and the latest `tokens.css` sets
  `strong, b` to 600, so pulling it fixes these.
- "Missing facts · a review below the pass mark · a decision that is yours" is a middle-dot
  string. Make it a short list, or three Tags.
- The title wraps onto two lines at 1440px because "Close" shares its row. Move the way back
  above the title, at bar height.

**P1-9. The Sign-in sheet.**
Signed out, Communication Hub is the only one of the three "Sign in with Orbit" apps without a
sheet. The mark sits beside the title, and at 390px the title breaks into "Communication / Hub"
with the mark hanging to its left. Use the new **Sign-in sheet**, the same as Orchestration Hub
and Client Hub: a white sheet on the ground, the mark above the title, and the name at
display-2. Then one line, the ink pill, the "How it works" quiet link, and the theme control.

---

## P2 — premium finish

- **Browser tab title.** "Communication Hub — Task Execution & Decision Log" is Title Case and
  never names the page. The ecosystem pattern is "Page — App", for example "Runs — Communication Hub".
- **Reading width.** The help column is about 516px wide at 1440px. Use `--hub-width-prose`
  so it matches the other apps' reading pages.
- **Empty list contrast.** "No runs yet…" is set in ink-subtle (3.14:1). The token fix raises
  it; empty-state copy should be ink-muted anyway.

---

## The wow — what premium looks like for Communication Hub

1. **The transcript is the product.** A run reads like a conversation. The moments are the
   decisions, especially the ones a person made. Give each decision a tone edge, who decided,
   and what was rejected folded under it. At the top of every run, a seal (`bx-check-shield`
   in a disc) says "Chain intact, verified 2 minutes ago", so the trust claim is visible, not
   just described.
2. **A runs list that shows who is waiting.** Each row has a status disc (running, waiting for
   a person, finished), the workflow, the client and relative time. A run waiting on *you* is
   lifted to the top with a tone edge. That is the one thing the list exists to tell you.
3. **The ecosystem pulse.** Your status dots, elevated into the App switcher for all seven
   apps: every app mark with its live status. Communication Hub invented it; everyone gets it.

---

## Kridt expansions to adopt

From `00-ecosystem.md`: **App mark**, **App switcher**, **Person block**, **Floating help
button**, **Sign-in sheet**, **Banner** (tone-edge grammar for decisions), **Tag**, and the
shared **How it works** page pattern.

## Definition of done

- [ ] Built on `.hub-shell`: sidebar with app mark and nav, breadcrumb bar, round tools, avatar.
- [ ] Runs is a table page and a run is its own reading page; nothing scrolls sideways at 390px.
- [ ] One primary for starting a run, and the copy says once where runs start.
- [ ] Page title "Runs" at 39/600; the slogan leads the empty state.
- [ ] App switcher replaces the app links; round theme button; round help button.
- [ ] How it works inside the shell when signed in; Sign-in sheet matches the other two apps.
- [ ] Emphasis at 600; no middle-dot strings; latest tokens pulled; both themes checked.
