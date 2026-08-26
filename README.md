# anil-site

A small, fast personal site: field notes and LinkedIn posts about deploying
Microsoft 365 Copilot, Cowork, Microsoft Scout, Copilot Studio and Agent 365.

Plain HTML, CSS and JavaScript. **No build step, no dependencies, no npm.**
Open `index.html` directly, or serve the folder — both work.

---

## Adding a LinkedIn post (the main thing you'll do)

1. Open the post on LinkedIn → **…** menu → **Copy link**.
2. Open `data/posts.js`.
3. Copy an existing block and paste it at the **top** of the array.
4. Fill in the fields, save, refresh the browser.

```js
{
  date: "2026-08-18",                       // YYYY-MM-DD, drives sort order
  hook: "One strong line — the headline.",
  excerpt: "Two to four sentences from the post.",
  tags: ["M365 Copilot", "Governance"],     // become filter chips automatically
  url: "https://www.linkedin.com/posts/...",
  featured: true,                            // optional — pins ONE post, spans 2 columns
},
```

Set your profile URL once, at the top of the same file:

```js
window.LINKEDIN_PROFILE = "https://www.linkedin.com/in/your-handle/";
```

Until a post has a real `url`, the card shows *"Link coming soon"* instead of a dead link.

## Adding a field note

Same idea, in `data/notes.js`:

```js
{
  product: "Cowork",                 // becomes a filter chip automatically
  date: "2026-08",                   // YYYY-MM or YYYY-MM-DD
  title: "The headline observation",
  body: "Two to four sentences of what you actually saw.",
  takeaway: "The 'so what' line at the bottom of the card.",
},
```

## Adding a build

`data/builds.js` — `name`, `kind`, `body`, `stack: []`.

New tags and products create their own filter chips. You never edit HTML.

---

## Your photo

Drop a square-ish JPG at `assets/anil.jpg` (600×600 or larger).
If the file is missing the hero falls back to a monogram tile — nothing breaks.

---

## Running it locally

```powershell
# simplest — just double-click index.html, or:
python -m http.server 8099
# then open http://localhost:8099
```

## Deploying

### GitHub Pages

```powershell
git init
git add -A
git commit -m "Personal site"
gh repo create anil-site --public --source=. --push
gh api -X POST repos/:owner/anil-site/pages -f "source[branch]=main" -f "source[path]=/"
```

Live at `https://<user>.github.io/anil-site/` in a minute or two.
For a custom domain, add a `CNAME` file containing the domain and point a
`CNAME` DNS record at `<user>.github.io`.

### Azure Static Web Apps

```powershell
az staticwebapp create -n anil-site -g <resource-group> -l westeurope `
  --source https://github.com/<user>/anil-site --branch main `
  --app-location "/" --output-location "/" --login-with-github
```

No build command needed — it's already static.

---

## Structure

```
index.html        markup and section copy
styles.css        design system (light + dark, one accent, system fonts only)
app.js            filters, theme toggle, scroll reveal
data/notes.js     field notes
data/posts.js     LinkedIn posts + profile URL
data/builds.js    things shipped
assets/anil.jpg   hero portrait (optional)
```

Data lives in `.js` files rather than `.json` on purpose — it means the site
works when opened straight from disk, with no local server and no CORS errors.

## Notes

- Light/dark toggle persists in `localStorage`; defaults to the OS preference.
- Scroll reveal is gated behind a `.js` class, so content is still visible if
  scripts fail to load. It's disabled under `prefers-reduced-motion`.
- No webfonts, no analytics, no third-party requests.
- **Keep it public-safe**: no customer names, no tenant specifics, no internal data.
