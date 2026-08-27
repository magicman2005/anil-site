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
jumping to the full slide. Every other slide holds 2–3 cards. Nothing scrolls.

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
  meta:   "18 Aug 2026",
  title:  "The headline",
  teaser: "One or two lines shown on the card face.",
  body:   ["Paragraph one.", "Paragraph two."],   // shown in the modal
  tags:   ["M365 Copilot", "Governance"],
  link:   { href: "https://www.linkedin.com/posts/...", label: "Read on LinkedIn" },
},
```

Leave `href` empty and the card shows *"Link coming soon"* rather than a dead link.

Set your profile URL once, at the top of the file:

```js
profile: { ..., linkedin: "https://www.linkedin.com/in/your-handle/" }
```

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

### GitHub Pages
```powershell
gh repo create anil-site --public --source=. --push
gh api -X POST repos/:owner/anil-site/pages -f "source[branch]=main" -f "source[path]=/"
```

### Azure Static Web Apps
```powershell
az staticwebapp create -n anil-site -g <resource-group> -l westeurope `
  --source https://github.com/<user>/anil-site --branch main `
  --app-location "/" --output-location "/" --login-with-github
```

No build command — it's already static.

---

## Structure

```
index.html              deck shell (slides are generated, not authored)
css/deck.css            Fluent 2 tokens, slide layouts, modal, stack fallback
js/scene.js             three.js atmosphere — particles, formations, transitions
js/deck.js              navigation, modals, focus management, layout mode
data/content.js         ALL content
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
- Verified with zero slide overflow at 1920×1080, 1440×900, 1366×768,
  1280×620 and 1024×768.

## Content safety

Public site. No customer names, no tenant specifics, no internal data.
Keep it that way when adding notes.
