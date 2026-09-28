# Prototype Hub — design review against Kridt

**For:** the agent that maintains Prototype Hub (`https://prototype-hub.building-bricks.online`)
**Reviewed:** 27 September 2026, signed in, 1440×900 and 390×844, light and dark
**Screens:** Dashboard, Prototypes, Tests, Archetypes, Settings, Feedback, How it works, plus the signed-out entry
**Evidence:** `evidence/prototype-hub/` next to this file — local only, do not commit it

---

## Read this first

The owner has decided that **every app in the hub ecosystem uses Kridt**, the hub design
system, so the seven apps read as one premium product suite. This overrides the default in
the `hub-design-system` skill that lets a project keep its own design system. Use the skill
for *how*; this report is the decision about *what*.

- Source: https://github.com/building-blocks-online/hub-style-guide — `QUICKREF.md`,
  `skills/hub-design-system/SKILL.md`, `references/tokens.css` and `layout.css`.
- Reference screens: Storybook, *Layout → Page archetypes*.
- **Pull the latest `tokens.css` first.** It fixes the contrast of `--hub-color-ink-subtle`,
  which currently fails on your nav group labels, search placeholder and `Ctrl K` hint, and it
  adds the components several findings below rely on (see `00-ecosystem.md`).

---

## Verdict

**Prototype Hub is the most Kridt-conformant app in the ecosystem**, and in places it is the
reference the others should copy: the sheet with hairline regions, grouped sidebar nav, the
ink block for the current item, a real breadcrumb, a search pill with a keyboard hint, and a
stat row whose cells touch. What stands between it and premium is finish: the stat cells are
empty rooms, buttons are 8px rectangles, two screens have lost their page padding or their
list style, tags are bordered pills everywhere, and the orange avatar is the only off-palette
colour on the screen.

| Area | Score (1–5) | Note |
|---|---|---|
| Kridt tokens | 5 | Current tokens loaded |
| Shell and navigation | 4 | Breadcrumb, search pill, grouped nav; person and feedback placement off |
| Layout and archetype | 4 | Dashboard is the archetype; Settings has lost its padding |
| Components | 3 | 8px buttons, pill tags, card-vs-row inconsistency |
| Typography | 4 | 39px/600 titles; figures and strong text slightly off |
| Colour discipline | 3 | Orange avatar; two ink buttons on the dashboard |
| Icons | 5 | Boxicons throughout |
| Empty and error states | 4 | Clean |
| Accessibility | 3 | Nav labels and hints fail contrast (fixed upstream); unnamed avatar button |
| Narrow screens | 3 | Works; stat cells stack one per row |
| Premium finish | 3 | Close — needs gauges and discipline |

---

## P0 — fix first

**P0-1. Settings has lost its page padding.**
Measured: the integration plates start at the sidebar edge (x = 232), so their left border
sits on the sidebar's border and the rounded corner hangs off it. Fix: Settings is a reading
page — wrap it in `.hub-page--reading` (padding `--hub-space-6 --hub-space-5`) and let the
plates sit inside it.

**P0-2. The avatar button has no name.**
Measured: `button.flex.items-center` (the avatar and chevron in the bar) has no text,
`aria-label` or `title`. Fix: `aria-label="Account menu"`.

**P0-3. Two primary buttons on one screen.**
Dashboard shows "Start a test" and "Run it again" both as ink blocks. Kridt: one primary per
view. Keep "Start a test" as the ink block; make "Run it again" a ghost pill.

---

## P1 — make it Kridt

**P1-1. Buttons are pills.**
Every button is 8px ("Start a test", "View prototypes", "New prototype", "Open last run",
"Connect Figma"). Use `--hub-button-radius` (pill). Primary is the ink block; secondary the
ghost pill with a hairline; tertiary the quiet text button.

**P1-2. Stat cells get gauges and figures at weight 500.**
The cells touch and have icon discs — that is right. But the figures are light (≈28px/400),
there is nothing under most of them, and each cell is mostly white space. Give each cell the
Kridt anatomy: a note under the label ("1 completed", "Avg score 7 of 10"), a gauge where the
number is a share (Success rate 100% is a full arc; Avg score 7/10 is a 70% arc), and the
figure at `--hub-text-figure` (28px/500). See Storybook *Components → Stat row*.

**P1-3. Tags are not pills.**
Client ("D LINE A/S"), journey type ("Specifier journey"), archetype segment ("Commercial",
"High tech"), goals and dimensions are all bordered pills. Use the new **Tag** (8px radius,
hairline, no fill, caption 12/500, ink-muted). On Archetypes, show at most three goals and
three dimensions as tags plus a "+4" tag; the full set belongs on the archetype's own page.
Pills are reserved for status ("Completed", "Active", "Not connected").

**P1-4. No middle-dot meta strings.**
"Avoid replica products — dline.com · 1 archetype", "Efficient Pro · Operations lead · 36 yrs",
"3 questions Sep 27, 2026 · ulrich@…". Kridt lists `A · B · C` as a tell. Give each fact its
own slot: separate spans with `gap: var(--hub-space-3)`, or a small definition row.

**P1-5. One list style for one kind of object.**
Prototypes are list rows divided by hairlines; Tests are cards. Both are the same kind of
object — a list of things you made. Use hairline rows on both.

**P1-6. The person block.**
The sidebar foot holds the app's description; the person is only an orange avatar in the bar.
Kridt: the person — neutral avatar disc (`.hub-avatar`, sunken, never a brand colour), display
name, role — sits in the sidebar foot (`.hub-shell__me`). The avatar in the bar stays neutral.
Move the description to the sign-in sheet and How it works.

**P1-7. One feedback entry point.**
Feedback is both a nav item and a button in the bar. Keep one. The ecosystem standard is the
**Floating help button** (ink, 48px, bottom-right) plus the nav item; drop the bar button.

**P1-8. App mark in the brand.**
The sidebar brand is the words "Prototype Hub" only. Add the app's mark (32px ink tile, the
same glyph as in Orbit's catalog) — see the **App mark** expansion.

---

## P2 — premium finish

- **Emphasis weight.** `strong` in prose renders at 700 (How it works: "archetypes",
  "scenario", "success criteria"). Kridt stops at 600, and the latest `tokens.css` sets
  `strong, b` to 600, so pulling it fixes this.
- **Step connector.** On How it works, the vertical line joining the numbered steps touches
  the step text. Give the text `padding-left: var(--hub-space-4)` from the line.
- **"SUCCESS" label.** On Tests, the uppercase "SUCCESS" prefix is an eyebrow in capitals.
  Use sentence case, "Success criteria", at caption size in ink-muted.
- **Raw emails.** Prototype rows show a truncated email ("ulrich@building-blocks.onli…").
  Show the person's name, or their avatar with the name on hover and in `aria-label`.
- **Narrow screens.** At 720px and below the stat row goes to 2 columns, not one per row.
- **Sizes off the scale.** Measured across the screens: 11px text in 7 places, 15px in 7 and
  18px in 2. Kridt's steps are 12, 13 (code), 14, 16, 20, 25, 28 and 39px; nothing goes below 12.
- **Console.** Eight warnings per session: "Analytics disabled: VITE_POSTHOG_KEY was not set at
  build time". Log it once, or set the key.

---

## The wow — what premium looks like for Prototype Hub

1. **The success instrument.** A stat row with a full gauge for success rate and a 70% arc
   for the average score makes the dashboard read like an instrument panel, not a count.
2. **Archetypes as a gallery of people.** The line-art portraits are the most characterful
   thing in the ecosystem. Give them room: a hairline grid of archetype cells, portrait at
   64px, name, role, three tags — and move the long lists to each archetype's page.
3. **The run as a moment.** When a run finishes, the result is the one orchestrated moment:
   the success gauge draws once, 600ms on `--hub-ease`. Nothing else animates.

---

## Kridt expansions to adopt

From `00-ecosystem.md`: **Tag**, **Person block**, **App mark**, **Floating help button**,
**Sign-in sheet**, **App switcher**. Pull the style guide first; do not build local versions.

## Definition of done

- [ ] Settings sits inside page padding; no plate touches the sidebar.
- [ ] One ink button per screen; every button is a pill.
- [ ] Stat cells have notes, gauges where the value is a share, and 28px/500 figures.
- [ ] Categories are Tags; pills are status only; no `·` meta strings.
- [ ] Prototypes and Tests use the same hairline row.
- [ ] Person block in the sidebar foot; neutral avatar; one feedback entry point.
- [ ] Avatar button named; latest `tokens.css` pulled (nav labels pass contrast).
- [ ] Both themes checked, plus the un-stamped system default; 390px width checked.
