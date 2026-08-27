# Deploying

**Live at: https://magicman2005.github.io/anil-site/**

Published from `magicman2005/anil-site`, branch `main`, root. GitHub Pages
rebuilds on every push — there is no build step, so what you commit is what ships.

The site is fully static and self-contained. It works from `file://` with no
server at all, which means any static host will serve it correctly.

---

## Switching to anil.madhok.uk

The custom domain is **parked, not active**. As of 27 Aug 2026 `madhok.uk`
returns NXDOMAIN from `dns1.nic.uk` and 404 from Nominet's RDAP — it does not
resolve, so Pages would serve nothing if the `CNAME` file were live. The file is
kept as `CNAME.pending`.

GitHub Pages serves at **either** the default URL **or** the custom domain, not
both — a live `CNAME` redirects the `github.io` address. So do this only once
the domain actually resolves:

1. **Register `madhok.uk`** and confirm it resolves:
   ```powershell
   Invoke-RestMethod "https://dns.google/resolve?name=madhok.uk&type=NS"
   ```
   Status `0` (NOERROR) means live. `3` is NXDOMAIN — not ready.

2. **Add the DNS record** at your registrar:

   | Type | Name | Value |
   |---|---|---|
   | CNAME | `anil` | `magicman2005.github.io` |

3. **Activate the file and flip the URLs:**
   ```powershell
   Move-Item CNAME.pending CNAME

   # six absolute URLs in index.html: canonical, og:url, og:image,
   # twitter:image, and the JSON-LD url + image
   (Get-Content index.html -Raw) `
     -replace 'https://magicman2005\.github\.io/anil-site/', 'https://anil.madhok.uk/' `
     | Set-Content index.html -NoNewline

   # the footer of the social card
   (Get-Content tools/og.html -Raw) `
     -replace 'magicman2005\.github\.io/anil-site', 'anil.madhok.uk' `
     | Set-Content tools/og.html -NoNewline

   node tools/build-og.js
   git add -A; git commit -m "Switch to anil.madhok.uk"; git push
   ```

4. **Tick Enforce HTTPS** in Settings → Pages once the certificate provisions
   (usually a few minutes).

`anil.madhok.uk` is a subdomain, so a `CNAME` record is correct — you do not
need the apex `A` records a root domain would require.

---

## Publishing an update

```powershell
git add -A
git commit -m "..."
git push
```

Live in a minute or two. Check the build with:

```powershell
gh api repos/magicman2005/anil-site/pages/builds/latest --jq '.status'
```

## Two GitHub accounts on this machine

This repo needs the personal one:

```powershell
gh auth switch --user magicman2005     # before working on this site
```

Git pushes use `gh` as the credential helper, so whichever account is active is
the one that pushes. If a push 403s, check `gh auth status` first.

**The work account cannot host this site.** Tested 27 Aug 2026: public repos are
returns `HTTP 422 — your current plan does not support GitHub Pages for this
repository`. Both routes are closed, which is why this lives on a personal account.

## After it's live

- **Check the unfurl.** Paste the URL into LinkedIn's Post Inspector
  (`linkedin.com/post-inspector`) to confirm `assets/og.jpg` renders and to
  prime LinkedIn's cache. Teams and Slack read the same tags.
  on the profile. This site is the obvious thing to put there.
- **Regenerate the OG card** whenever the headline, portrait or URL changes:
  `node tools/build-og.js`.

