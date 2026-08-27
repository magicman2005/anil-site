# Deploying

The site is fully static and self-contained. It works from `file://` with no
server at all, which means any static host will serve it correctly. There is no
build step — what's in this folder is what ships.

Target domain: **anil.madhok.uk** (set in `CNAME`).

---

## Before you start

Two things to confirm:

1. **The domain is registered.** As of 27 Aug 2026, Nominet's RDAP returns 404
   for `madhok.uk` and `dns1.nic.uk` returns an authoritative NXDOMAIN. If you
   registered it very recently that's just propagation lag — but check, because
   nothing below works until the domain resolves. Change `CNAME` if it differs.

   and **cannot create public repositories** — `gh repo create --public` fails
   the enterprise, so that route cannot host a public personal site.

   This is a personal site on a personal domain containing personal posts, so
   personal infrastructure is also the right call on its own merits.

---

## Option A — Cloudflare Pages (recommended)

No GitHub account needed, free, fast UK edge, and handles DNS for `.uk` in the
same place.

1. Register `madhok.uk` if you haven't, and point its nameservers at Cloudflare.
2. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** →
   **Upload assets**.
3. Drag this whole folder in. No build command, no output directory.
4. **Custom domains** → add `anil.madhok.uk`. Cloudflare writes the DNS record
   itself and provisions TLS.

Updating later is another drag-and-drop, or connect a Git repo once you have one.

## Option B — GitHub Pages from a personal account

```powershell
git remote add origin https://github.com/<personal-account>/anil-site.git
git push -u origin master
```

Then **Settings → Pages → Source: Deploy from a branch → master / (root)**.
The `CNAME` file already in this folder tells Pages the custom domain, so you
only need the DNS side:

```
CNAME   anil   <personal-account>.github.io
```

Tick **Enforce HTTPS** once the certificate provisions (a few minutes).

## Option C — Azure Static Web Apps

Sensible if you'd rather keep it in Azure. Use a **personal** subscription, not
a Microsoft-managed one — this is personal content.

```powershell
az staticwebapp create -n anil-site -g <resource-group> -l westeurope
# then upload via the SWA CLI or connect a repo
az staticwebapp hostname set -n anil-site --hostname anil.madhok.uk
```

---

## DNS, whichever route

`anil.madhok.uk` is a subdomain, so a `CNAME` record is correct — you don't need
the apex `A` records that a root domain would require.

| Type | Name | Value |
|---|---|---|
| CNAME | `anil` | your host's target (e.g. `<account>.github.io`) |

## After it's live

- **Check the unfurl.** Paste the URL into LinkedIn's Post Inspector
  (`linkedin.com/post-inspector`) to confirm `assets/og.jpg` renders and to
  prime LinkedIn's cache. Teams and Slack pick up the same tags.
  on the profile. This site is the obvious thing to put there.
- **Regenerate the OG card** whenever the headline or portrait changes:
  `node tools/build-og.js`.
