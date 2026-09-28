# Client Hub — design review against Kridt

**For:** the agent that maintains Client Hub (`https://client-hub.building-bricks.online`)
**Reviewed:** 27 September 2026, signed in and signed out, 1440×900 and 390×844, light and dark
**Screens:** Clients, API access, How it works, and the sign-in screen
**Evidence:** `evidence/client-hub/` next to this file — local only, do not commit it

---

## Read this first

The owner has decided that **every app in the hub ecosystem uses Kridt**, the hub design
system, so the seven apps read as one premium product suite. This overrides the default in
the `hub-design-system` skill that lets a project keep its own design system. The skill now
states that exception itself. Use the skill for *how*; this report is the decision about *what*.

- Source: https://github.com/building-blocks-online/hub-style-guide — `QUICKREF.md`,
  `skills/hub-design-system/SKILL.md`, `references/tokens.css`, `layout.css`, `layout.md`,
  `components.md` and `writing.md`.
- **Pull the latest style guide first.** You use Kridt's own `layout.css` classes, so pulling
  fixes three findings with no work: the brand at weight 700, `strong` at 700, and the
  table headers, nav label and diagram captions that fail contrast today.

---

## Verdict

**Client Hub is the only "Sign in with Orbit" app already on the Kridt shell**: a sidebar with
grouped nav and the ink block, a breadcrumb, a person at the sidebar foot, and a table page with
its search directly above the rows. Its **How it works page is one of the two best explanatory
pages in the ecosystem**, with Persona Hub's. Its diagram inverts the one app you are looking at
to ink, which is exactly the Kridt Flow diagram. What holds it back is detail: two different
avatars, a type scale of its own, a raw 36-character ID in every row, and a table that breaks
on a phone.

| Area | Score (1–5) | Note |
|---|---|---|
| Kridt tokens | 5 | Current tokens loaded; Kridt's own layout classes |
| Shell and navigation | 4 | The Kridt shell; brand without a mark, menu button at desktop |
| Layout and archetype | 4 | Table and reading pages; the document scrolls |
| Components | 4 | Search, checkboxes, table; raw IDs and copy pills in the list |
| Typography | 3 | Sizes of its own between the Kridt steps; 700 on brand and emphasis |
| Colour discipline | 4 | Restrained; an orange avatar |
| Icons | 4 | Boxicons; the feedback glyph looks like an emoji |
| Empty and error states | — | None visible for this account |
| Accessibility | 3 | Table headers and captions fail contrast (fixed upstream) |
| Narrow screens | 2 | The table is cut off; the bar is crowded |
| Premium finish | 3 | The best-structured of the three; the list page is still plain |

---

## P0 — fix first

**P0-1. The client table breaks on a phone.**
At 390px the table is cut off at the right edge. The ClientID wraps over four lines, and its
Copy button is clipped. Kridt's rule is that a wide table scrolls sideways inside its own
container (`components.md`, *Table*). For a register people scan on a phone, go further:
- Below 720px, show each client as a stacked row with the name, the website and the enrichment
  count.
- Drop the ClientID column below 720px; it belongs on the client's page.

---

## P1 — make it Kridt

**P1-1. The brand carries the mark.**
The sidebar brand is "Client Hub" as text, at weight 700 from the older Kridt `layout.css`.
Pulling fixes the weight. Add your mark: the ink tile with the network glyph you already use on
the sign-in screen, 32px, beside the name (`.hub-mark`). Your mark is the model for the
ecosystem's **App mark**.

**P1-2. One avatar, drawn the same in both places.**
The bar ends with an orange "HU" disc; the sidebar foot has a grey disc with a person icon. Kridt
has both places and draws them identically: a neutral disc with the person's initials
(`.hub-avatar`). Avatars are never a brand colour. Sign out moves into the account menu that the
bar avatar opens, or becomes a round `bx-log-out` button on the person row. A centred text link
under the block reads as an afterthought.

**P1-3. The theme control is one round button.**
The bar holds the three-way System, Light and Dark control, with the current choice as a white
chip. In the app, the theme is a round icon button showing the current mode, as in the other
apps. The three-way control belongs on the Sign-in sheet and in the account menu, with the
current choice as the ink block.

**P1-4. The menu button belongs to phones.**
A round menu button sits in the bar at desktop width, next to a sidebar that is already open.
Kridt shows it only below 720px, where the sidebar becomes a drawer. If it collapses the sidebar
at desktop, give it `bx-sidebar` and `aria-label="Collapse navigation"` so it does not read as
a phone menu.

**P1-5. Use the Kridt type scale.**
Measured sizes include 12.48px, 13.12px, 13.6px and 14.4px, which are 0.78rem, 0.82rem, 0.85rem
and 0.9rem. They sit between the Kridt steps: caption 12px, code 13px, body-sm 14px and body
16px. Use the `--hub-text-*` tokens only, so Client Hub's text matches the other six apps line
for line.

**P1-6. The list shows clients, not identifiers.**
Every row shows the full ClientID in a mono chip with a Copy pill beside it.
- In the list, keep one round copy button, `bx-copy` with `aria-label="Copy ClientID"`. The full
  ID belongs on the client's page.
- Show the website as "dline.com"; the link keeps the full address.
- The chevron says the row opens, so make the whole row the link.

**P1-7. Show the way to add a client.**
Clients has no primary action for this account, while How it works walks through adding one.
If members can add clients, put "Add a client" in the page head as the ink pill. If they cannot,
say who can, in one line under the title.

**P1-8. The help button is round, with a Boxicon.**
"Feedback" is an ink pill with a label, and its speech bubble keeps its own colours in both
themes, like an emoji. Use the shared **Help button**: a 48px ink circle with
`bx-message-rounded-dots` and `aria-label="Feedback"`.

**P1-9. The API page.**
- One name: the nav and breadcrumb say "API access"; the title says "API".
- "openapi.json" is a pill with underlined text. Make it a quiet button with `bx-download`, or a
  plain link, not both.
- The method labels are grey pills, with DELETE in the danger tone. Methods are categories, so
  use Tags in mono. DELETE may keep the danger text, because destructive is a meaning.

**P1-10. How it works: keep it, and finish it.**
- The focal node reads "name · other names · CVR · websites · socials · Figma · analytics ·
  material", a middle-dot string. Use a short list, or Tags.
- Keep the ink inversion and the fan-in, fan-out shape. It is the model for the Kridt Flow
  diagram in the ecosystem report.

---

## P2 — premium finish

- **Tab title.** "Client Hub — Client Registry" never names the page. Use "Page — App":
  "Clients — Client Hub", "API access — Client Hub".
- **Search label.** The search field is labelled for screen readers but has no visible label.
  Kridt keeps labels visible above the field; "Search clients" is enough.

---

## You are the source other apps point to

- **Access: resolved in your favour.** The review account sees the client "D LINE A/S" here, and
  your How it works says everyone who signs in can see every client. Prototype Hub agrees.
  Persona Hub's empty Clients page is therefore Persona Hub's to fix, and its report says so.
- **Give every client a stable face.** Use one display name and an initials disc, so a client
  looks the same in Client Hub, Persona Hub, Prototype Hub and Communication Hub.
- **The person, the same everywhere.** You show the account as "Hub S.", Orchestration Hub as
  "Hub Style", and three apps as a raw email. Use the display name from the Orbit profile, in
  one format.

---

## The sign-in screen

A white sheet with a hairline and 14px corners on the porcelain ground, an ink mark tile, the
name, a description, a full-width ink pill and a theme control. Your full-width button is the
model for the shared Sign-in sheet. Measured against the other two:

| | Client Hub | Orchestration Hub | Communication Hub |
|---|---|---|---|
| Sheet | 420px wide, 40px padding | 462px, 48px | none |
| Name | 32/600 | 39/600 | not a heading |
| Button | full width, 51px, 16/500 | 158×40, 14/500 | 172×49, 16/400 |
| Theme control, current | white chip, Skagen text | ink block | ink block |

Adopt the shared **Sign-in sheet**:
- **Name.** Display-2, 39/600, one step larger than today.
- **Lede.** One line. "Sign in with your Orbit account to continue" repeats the button, so cut it.
- **Button.** The Kridt label size, 14/500, with a 44px minimum height, still full width.
- **Theme.** The current choice is the ink block, as in the other apps.
- **Help.** A quiet "How it works" link under the button.

---

## The wow — what premium looks like for Client Hub

1. **The registry as the family's address book.** Each client row shows which apps use it: a
   row of small App marks, lit where the client has archetypes, prototypes or runs. Client Hub
   becomes the one place where the ecosystem is visible from the client's side.
2. **Access you can see.** On a client's page, "Who can see this" lists people with initials
   discs and their roles. It is the rule your How it works describes, made visible.
3. **Enrichment as an instrument.** Instead of "0 records", a small gauge shows how complete a
   client's record is: CVR, websites, socials, analytics. Filling a client in becomes visible
   progress.

## Kridt expansions to adopt

From `00-ecosystem.md`: **App mark**, **App switcher**, **Person block**, **Help button**,
**Sign-in sheet**, **Segmented control** for the theme, **Tag**, **Banner**, **Flow diagram**,
and the **cascade-layer rule** for Tailwind builds.

## Definition of done

- [ ] Latest style guide pulled: brand and emphasis at 600, contrast passing.
- [ ] Brand with the App mark; App switcher, round theme button and neutral avatar in the bar.
- [ ] One neutral initials disc for the person, in the bar and at the sidebar foot.
- [ ] Only Kridt text tokens; no rem sizes of your own.
- [ ] Client rows show clients: short website, one copy button, the whole row a link.
- [ ] The way to add a client is visible, or who can do it is stated.
- [ ] The table works at 390px; both themes checked.
- [ ] Sign-in screen on the shared Sign-in sheet.
