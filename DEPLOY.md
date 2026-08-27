# Deploying

**Live at: https://magicman2005.github.io/anil-site/**

Published from this repo, branch `main`, root. GitHub Pages rebuilds on every
push — there is no build step, so what you commit is what ships.

The site is fully static and self-contained. It works from `file://` with no
server at all, which means any static host will serve it correctly.

---

## Publishing an update

```powershell
node tools/stamp.js     # cache-bust changed assets
git add -A
git commit -m "..."
git push
```

Live in a minute or two. Check the build with:

```powershell
gh api repos/magicman2005/anil-site/pages/builds/latest --jq '.status'
```

### Why `stamp.js` matters

GitHub Pages serves CSS and JS with a 10-minute cache, and browsers hold them
longer still. Without a changing URL, anyone who has visited before sees stale
styles and stale behaviour after a deploy — which looks exactly like "the change
didn't work", including to you.

`tools/stamp.js` rewrites the `?v=` query on every local asset reference in
`index.html` to a short hash of that file's contents. Only files that actually
changed get a new URL, so unchanged assets stay cached. It is idempotent, so
running it when nothing changed does nothing.

Skip it and the deploy still works — it just won't be visible until caches
expire.

## Local preview

```powershell
python -m http.server 8099   # then open http://localhost:8099
```

Or just open `index.html` directly — it works from disk with no server.

---

## Custom domain

The site currently serves at the default GitHub Pages address. To move it to a
custom domain:

1. **Confirm the domain resolves** before doing anything else:
   ```powershell
   Invoke-RestMethod "https://dns.google/resolve?name=example.com&type=NS"
   ```
   Status `0` (NOERROR) means live. `3` is NXDOMAIN — not ready.

2. **Add a DNS record** at your registrar. For a subdomain, `CNAME` is correct —
   you do not need the apex `A` records a root domain would require.

   | Type | Name | Value |
   |---|---|---|
   | CNAME | `your-subdomain` | `magicman2005.github.io` |

3. **Add a `CNAME` file** to the repo root containing just the domain, then
   update the absolute URLs — there are six in `index.html` (canonical,
   `og:url`, `og:image`, `twitter:image`, and the JSON-LD `url` and `image`)
   plus the footer of `tools/og.html`. Regenerate the card afterwards:

   ```powershell
   node tools/build-og.js
   git add -A; git commit -m "Switch to custom domain"; git push
   ```

4. **Tick Enforce HTTPS** in Settings → Pages once the certificate provisions.

> GitHub Pages serves at **either** the default URL **or** the custom domain,
> never both. A `CNAME` file pointing at a domain that doesn't resolve will make
> the site unreachable — so only add it once step 1 passes.

## After a domain change

- **Check the unfurl.** Paste the URL into LinkedIn's Post Inspector
  (`linkedin.com/post-inspector`) to confirm `assets/og.jpg` renders and to
  prime LinkedIn's cache. Teams and Slack read the same tags.
- **Regenerate the OG card** whenever the headline, portrait or URL changes:
  `node tools/build-og.js`.
