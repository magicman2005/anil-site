# anil-site

An exec-grade interactive deck: field notes and LinkedIn posts on deploying
Microsoft 365 Copilot, Cowork, Microsoft Scout, Copilot Studio and Agent 365.

Fixed-viewport slides, Fluent 2 styling, a live three.js atmosphere layer, and
modal deep-dives. **No build step, no npm, no CDN.** Open `index.html` directly
or serve the folder — both work.

## The deck

Seven slides, deliberately: **Home → M365 Copilot → Cowork → Scout →
Copilot Studio → Posts → Connect.**

Home is the control center — five cards, each opening a modal for detail or
jumping to the full slide. Product slides hold 2–4 cards. Posts is `dense` —
twelve compact cards, each linking to the original on LinkedIn. Nothing scrolls.

Each slide has `#id` deep links (`/#cowork`), so you can hand someone a link
that opens exactly where you want them.

---

## Design principles

1. **It's a deck, not a page with slides.** `100vh`, `overflow:hidden`, one idea
   per slide. If content doesn't fit, it goes in a modal — never a scrollbar.
2. **Home is a control center.** Slide 0 is the map. Every card is a preview and
   a launch point.
3. **Breadth on slides, depth in modals.** This is what makes 100vh honest.
4. **three.js is atmosphere, never furniture.** One persistent canvas. It holds
   no information and is entirely disposable.
5. **Fluent 2, properly.** Segoe UI Variable ramp, elevation tokens, acrylic
   layering, 4px grid, Fluent motion curves.
6. **One signature hue per scene**, driving both DOM accent and 3D scene.
7. **Procedural imagery.** No stock photography, no licensing exposure.
8. **Three navigation paths**, plus swipe. No scroll-jacking, no hamburger.
9. **Motion has an off-switch.** `prefers-reduced-motion` is fully honoured.
10. **Degrades, never collapses.** No WebGL → CSS gradients. Phone → readable stack.

---

## Editing content

Everything on screen comes from `data/content.js`. You never touch markup.

### Add a LinkedIn post

Open the `posts` slide in `data/content.js`, copy a card block, paste at the top:

```js
{
  meta:   "4 Aug 2026",
  title:  "The headline",
  teaser: "One or two lines shown on the card face.",
  body:   ["Paragraph one.", "Paragraph two."],   // shown in the modal
  takeaway: "Optional 'So what' panel.",
  tags:   ["Microsoft Scout", "Agentic AI"],
  stat:   "23 reactions · 2 comments",            // optional, shown in modal footer
  link:   { href: "https://www.linkedin.com/feed/update/urn:li:activity:.../", label: "Read on LinkedIn" },
},
```

Leave `href` empty and the card shows *"Link coming soon"* rather than a dead link.

**Keep this list to twelve.** The Posts slide is `dense: true` — four columns,
smaller cards — and twelve is what fits one viewport. Past twelve, retire the
weakest rather than adding a thirteenth.

### Dense slides

Set `dense: true` on any `cards` slide to switch it to the compact variant:
four columns, tighter type, smaller padding, and a slide head that gives up
vertical space to the grid. Same visual language, roughly double the density.

Below 800px tall the card teaser is hidden and titles clamp to two lines;
below 660px the slide lede goes too. That's deliberate — at those heights
twelve rows cannot show meta + title + teaser without clipping text mid-line,
and a clipped sentence looks broken in a way a missing one does not. The full
text is always in the modal.

To get a permalink: open the post on LinkedIn → **…** menu → **Copy link**.
Or note that LinkedIn activity IDs encode their own timestamp — `id >> 22n`
gives milliseconds since epoch, which is how the dates here were derived.

### Add a multi-part series

Series get **one card**, not one card per part. Add a `parts` array and the modal
renders a numbered, individually-linked list:

```js
{
  meta:  "Jul 2026 · series · 10 parts",
  title: "The M365 Copilot series",
  teaser: "One line on what the series covers.",
  body:  ["Why it exists.", "How it's structured."],
  parts: [
    { label: "Part title", href: "https://www.linkedin.com/feed/update/urn:li:activity:.../" },
  ],
  stat: "3,091 impressions · 56 reactions across the ten",
  link: { href: "<first part>", label: "Start at part one" },
}
```

Put a series on the slide it belongs to — the Cowork Deep Dive sits on the
Cowork slide, not in Posts. That keeps Posts for standalone writing.

### Add a field note

Same card shape, on whichever product slide it belongs to. Add `takeaway:` for
the highlighted "So what" panel at the bottom of the modal.

### Add a slide

Append to the `slides` array:

```js
{
  id: "newthing",        // used for #hash deep links
  kind: "cards",         // home | statement | cards | connect
  label: "New thing",    // progress-dot tooltip
  hue: 96,               // 0-360, drives DOM accent AND the 3D scene colour
  scene: "helix",        // sphere | grid | helix | wave | ring | scatter
  kicker: "Field notes",
  title: "Headline",
  lede: "Supporting line.",
  cards: [ /* ... */ ],
}
```

Dots, counter, keyboard jumps and hue transitions all pick it up automatically.

**Keep 2–3 cards per `cards` slide** (5–6 max on `home`). That's what keeps every
slide inside one viewport.

---

## Navigation

| Input | Action |
|---|---|
| `→` `↓` `PageDown` `Space` | Next slide |
| `←` `↑` `PageUp` | Previous slide |
| `Home` / `End` | First / last |
| `1`–`7` | Jump to slide |
| `Esc` | Close modal |
| Swipe | Next / previous (touch) |
| Progress dots, arrows | Click |

`PageUp`/`PageDown` means presenter remotes work.

---

## Running it

```powershell
python -m http.server 8099   # then open http://localhost:8099
```

## Deploying

See **[DEPLOY.md](DEPLOY.md)**. Short version: push to `main` and GitHub Pages
rebuilds. No build step.

---

## Structure

```
index.html              deck shell (slides are generated, not authored)
CNAME                   custom domain for GitHub Pages / Cloudflare
css/deck.css            Fluent 2 tokens, slide layouts, modal, stack fallback
js/scene.js             three.js atmosphere — particles, formations, transitions
js/deck.js              navigation, modals, focus management, layout mode
data/content.js         ALL content
tools/og.html           source for the social card
tools/build-og.js       renders it: node tools/build-og.js
tools/check-new-posts.js diffs a LinkedIn scrape against what the site links to
assets/anil.jpg         portrait
assets/og.jpg           1200×630 social card
vendor/three.min.js     three.js r160.1, vendored
```

## Implementation notes

- **Classic scripts, not ES modules**, so the deck also runs from `file://`.
  three.js r160.1 is the last version shipping a UMD build; it logs a
  deprecation warning on load, which is inert here because the file is
  vendored and pinned. Moving to ES modules would silence it but would
  require a server for local viewing.
- **Particle formations** are precomputed once, then eased per frame toward the
  active slide's target. Hue lerps along the shortest path around the wheel.
- **Stack mode** engages below 720px wide or 480px tall: WebGL off, slides
  become scrollable sections, dots follow scroll position.
- **Modals** trap Tab, close on `Esc` or scrim click, and restore focus to the
  card that opened them.
- **Deep links resolve before first render.** `evalMode()` calls `go()`, which
  rewrites the hash — so the intended slide is captured at the very top of
  `boot()`, before anything else runs.
- **three.js loads after first paint**, on `window.load`, then calls
  `window.__startAtmosphere()`. Content is interactive at roughly 68 KB; the
  654 KB library arrives afterwards and the CSS veil covers the gap. Measured
  at 176 ms to seven rendered slides with `THREE` still undefined.
- **Works from `file://`** with no server and no failed requests — which is
  also the reason data lives in `.js` rather than `.json`.
- Verified with zero slide overflow and zero clipped cards at 1920×1080,
  1600×900, 1440×900, 1366×768, 1280×700, 1280×620, 1100×800, 1024×768,
  1024×700, 1024×640, 900×700, 820×620, 760×900 — plus stack mode at
  760×560 and 390×844.

## Voice and language

**UK English throughout.** organisation, recognise, labelling, artefact, licence
(noun), centre. CSS and JS keywords stay American — `color`, `center`, `dialog`,
`Math` — those are language APIs, not prose. The schema.org `Organization` type
is likewise fixed.

**Written in the author's register**, checked against his actual LinkedIn posts rather
than by feel:

| | his posts | Site |
|---|---|---|
| "I" per 1,000 words | 13.0 | 14.9 |
| "you" per 1,000 words | 3.5 | 4.1 |
| "actually" per 1,000 words | 4.0 | 3.2 |
| em-dashes per 1,000 words | 14.0 | 13.3 |

The rule that matters: **report what happened, don't instruct the reader.**
He writes "I've seen a tenant look almost dormant in one view", not "you should
instrument at the interaction layer". Takeaways are observations, not advice.

Avoid: consultant register (leverage, unpack, double down, move the needle),
jargon he doesn't use (idempotent, delta, corpus), and literary flourishes that
sound written rather than lived.

## Keeping it current

Posts arrive in bursts, so the site drifts stale without a nudge. A scheduled
assistant task runs weekly, scans LinkedIn for posts published since the site
was last updated, and sends a proposal with ready-to-paste card blocks.

It **proposes only, never edits.** The author decides what ships.

It is silent when there is nothing new, so most weeks send nothing.

The diffing is deterministic rather than left to judgement:

```powershell
node tools/check-new-posts.js scraped.json
```

It matches on the LinkedIn activity id and checks **both** card links and series
`parts` entries, so a post that only appears inside a series still counts as
known. It also decodes each post's date from the activity id (`id >> 22n`) and
flags one-line captions as `likelyCarousel`, which means the substance is in the
attached deck and someone has to open it before the post can be written up.

## Content safety

Public site. Everything on it is drawn from the author's own public LinkedIn posts
and published material. Some posts name Barclays — that is his own public
wording, already on LinkedIn, and the Connect slide's disclaimer reflects this.

Do not add anything confidential, internal-only, or non-public about a customer
or tenant. If in doubt, leave it out.
