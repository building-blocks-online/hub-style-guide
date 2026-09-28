# Persona Hub — design review against Kridt

**For:** the agent that maintains Persona Hub (`https://persona-hub.building-bricks.online`)
**Reviewed:** 27 September 2026, signed in, 1440×900 and 390×844, light and dark
**Screens:** Clients, How it works, Feedback, plus the signed-out entry
**Evidence:** `evidence/persona-hub/` next to this file — local only, do not commit it

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
  (your "Workspace" nav label fails today) and adds the components several findings below rely
  on (see `00-ecosystem.md`).

---

## Verdict

Persona Hub is clean, calm and honest, and its **How it works page is the best piece of
explanatory design in the ecosystem**. The flow diagram with the one focal box inverted in ink
has been lifted into Kridt as the Flow diagram, for every other app to copy. What holds the app
back is the first impression. A signed-in user lands on "No clients yet" with no way forward,
the person is drawn with two different avatars, and the bar is a bare title. Three screens
cannot carry a premium impression if one of them is an empty room.

| Area | Score (1–5) | Note |
|---|---|---|
| Kridt tokens | 5 | Current tokens loaded |
| Shell and navigation | 3 | Two-line brand, plain bar title, two different avatars |
| Layout and archetype | 4 | Reading archetype done well |
| Components | 4 | Few components, mostly right |
| Typography | 4 | 39/600 titles; emphasis at 700 |
| Colour discipline | 3 | Orange avatar; tinted diagram boxes |
| Icons | 5 | Boxicons throughout |
| Empty and error states | 2 | The landing page is an empty state with no action |
| Accessibility | 4 | One unnamed button; nav label contrast (fixed upstream) |
| Narrow screens | 4 | Works |
| Premium finish | 3 | The explanation is premium; the product around it is not yet |

---

## P0 — fix first

**P0-1. The landing page is a dead end.**
Clients shows "No clients yet — Clients come from Client Hub" and nothing to do. Kridt's
empty state is a sunken well, one line, **one action** (`components.md`, *Empty state*). Add
"Open Client Hub" as a ghost pill with the app mark of Client Hub, linking to it.

**P0-2. The client list is empty when it should not be.**
For the review account, Clients is empty. Yet Client Hub lists a client for the same account,
and Client Hub's How it works says everyone who signs in can see every client. Prototype Hub
shows that client too, and your own How it works reports nine archetypes in the library. So the
list is wrong, not the account. Check how Persona Hub reads clients from Client Hub, for example
whether it asks on behalf of the signed-in person. First-run users must never land on an
unexplained zero.

**P0-3. The avatar button has no name.**
Measured: `button.flex.items-center` (avatar and chevron in the bar) has no text,
`aria-label` or `title`. Fix: `aria-label="Account menu"`.

---

## P1 — make it Kridt

**P1-1. One avatar, one person block.**
Today the bar has an orange "HU" avatar and the sidebar foot a grey "HU" disc, with the email
truncated twice beside it. Kridt has both places, drawn the same way. The bar ends with the
avatar disc, which opens the account menu. The sidebar foot holds the new **Person block**: the
same neutral disc, the display name once (email only as a fallback, never twice), and the role.
The orange disappears, because avatars are never a brand colour.

**P1-2. The bar is a breadcrumb with round tools.**
The bar holds a plain title ("Clients"), a "Feedback" ghost pill and the avatar. Use the Kridt
bar: `.hub-crumb` on the left ("Persona Hub › Clients"), then on the right the round icon
buttons and the avatar. The round buttons are the App switcher (`bx-grid-alt`) and the theme
toggle. Feedback moves to the **Floating help button**, 48px ink, bottom-right, and stays in
the nav. It should not appear in the bar too.

**P1-3. The brand is one line with a mark.**
"Persona Hub" over "Shared archetypes" is two lines at two sizes. Use the **App mark** (32px
ink tile with the app's glyph) and the name on one line. The tagline belongs on the Sign-in
sheet and How it works.

**P1-4. Emphasis at 600.**
Six `strong` elements on How it works render at 700, such as "dimensions" and "nobody can
choose it". Kridt stops at 600. The latest `tokens.css` sets `strong, b` to 600, so pulling it
fixes this unless a utility such as `font-bold` overrides it.

**P1-5. Diagram tones come from the palette's soft steps, with a tone edge.**
The honesty-grade and grounding diagrams use tinted fills with tinted borders, green for
research-informed and amber for hypothesis. The meaning is right. Make the tone the edge and
the icon, not the fill. Use paper boxes with a hairline, a 3px tone edge on the left, and a
tone icon (`bx-check-shield`, `bx-help-circle`). That is the same grammar as the Banner. Keep
the focal box inverted in ink.

**P1-6. "Where the library stands right now" is a stat row.**
It holds "9 archetypes in the library", "33 / 49 dimensions state a source" and an amber
"9 hypothesis" pill. Make it a Kridt stat row with three touching cells: Archetypes 9;
Dimensions with a source, 33 of 49, as a 67% gauge; Graded hypothesis, 9 of 9, with a note.
Figures at 28/500.

---

## P2 — premium finish

- **Feedback empty state.** "Nothing yet" echoes "Nothing to see here", which `writing.md`
  rules out. Say what will live there: "No feedback yet. Messages sent with the help button
  appear here."
- **Diagram widths.** The grounding flow's four boxes have four widths. Give nodes one width
  in one row, as the Flow diagram does.
- **Diagram captions.** The captions under each diagram are centred 12px lines up to 60
  characters wide. Left-align them under the diagram at caption size, max 66ch.
- **Section spacing.** Sections are divided by hairlines, which is right. Use `--hub-space-9`
  above each section title so the page breathes like the Kridt reading archetype.

---

## The wow — what premium looks like for Persona Hub

1. **Archetypes as people.** The library deserves a face. Show a hairline grid of archetype
   cells with a line-art portrait (Prototype Hub already has them), name, role, and a grade
   gauge that shows how evidenced each one is. The grade is the idea the product is built
   around, so make it the thing you see first.
2. **The grade as an instrument.** On an archetype's page, the dimensions form a ladder of
   touching cells, each with its tone edge. The weakest one is marked, because it sets the
   grade. You see why the grade is what it is without reading.
3. **How it works stays the reference.** Keep the page. Move its diagrams onto the Kridt Flow
   diagram so they match the rest of the ecosystem, and link it from the Sign-in sheet.

---

## Kridt expansions to adopt

From `00-ecosystem.md`: **Person block**, **App mark**, **Floating help button**,
**App switcher**, **Flow diagram**, **Banner** (tone-edge grammar), **Sign-in sheet**, **Tag**.

## Definition of done

- [ ] Clients never lands on a dead end; the empty state links to Client Hub.
- [ ] Client access for the review account is confirmed or explained.
- [ ] Neutral avatar disc in the bar; Person block at the sidebar foot; name shown once.
- [ ] Breadcrumb bar with round tools; help button bottom-right; brand with app mark.
- [ ] Emphasis at 600; diagrams on the Flow diagram with tone edges.
- [ ] Library status as a stat row with a gauge.
- [ ] Avatar button named; latest tokens pulled; both themes and 390px checked.
