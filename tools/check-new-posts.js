#!/usr/bin/env node
/*
 * check-new-posts.js — which LinkedIn posts are not yet on the site?
 *
 *   node tools/check-new-posts.js scraped.json
 *
 * scraped.json is whatever the browser step collected, either:
 *   [{ urn, text }, ...]         or   { posts: [ ... ] }
 * urn may be a full "urn:li:activity:123" or a bare id.
 *
 * Compares against every LinkedIn URL already in data/content.js — both the
 * card `link.href` values and the individual `parts` entries — so a post that
 * only appears inside a series is still correctly treated as known.
 *
 * Prints JSON: { known, scraped, new: [...], site: {...} }
 * Exit code 0 always; the caller decides what to do with an empty list.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

function urnId(s) {
  const m = String(s).match(/(\d{10,})/);
  return m ? m[1] : null;
}

/* ---- what the site already links to ---- */

function siteIds() {
  global.window = {};
  require(path.join(ROOT, "data", "content.js"));
  const D = global.window.DECK;

  const ids = new Set();
  let cards = 0, parts = 0;

  D.slides.forEach(sl => {
    (sl.cards || []).forEach(c => {
      if (c.link && c.link.href) {
        const id = urnId(c.link.href);
        if (id) { ids.add(id); cards++; }
      }
      (c.parts || []).forEach(p => {
        const id = urnId(p.href || "");
        if (id) { ids.add(id); parts++; }
      });
    });
  });

  return { ids, cards, parts, slides: D.slides.length };
}

/* ---- decode the post date from the activity id ----
   LinkedIn activity ids embed a millisecond timestamp in the high bits. */

function dateFromId(id) {
  try {
    return new Date(Number(BigInt(id) >> 22n)).toISOString().slice(0, 10);
  } catch (e) {
    return null;
  }
}

/* ---- main ---- */

const file = process.argv[2];
if (!file) {
  console.error("usage: node tools/check-new-posts.js <scraped.json>");
  process.exit(2);
}

let raw;
try {
  raw = JSON.parse(fs.readFileSync(file, "utf8"));
} catch (e) {
  console.error("could not read " + file + ": " + e.message);
  process.exit(2);
}

const scraped = Array.isArray(raw) ? raw : (raw.posts || []);
const site = siteIds();

const seen = new Set();
const fresh = [];

scraped.forEach(p => {
  const id = urnId(p.urn || p.id || p.url || "");
  if (!id || seen.has(id)) return;
  seen.add(id);
  if (site.ids.has(id)) return;

  const text = (p.text || "").replace(/\s+/g, " ").trim();
  fresh.push({
    id,
    date: dateFromId(id),
    url: "https://www.linkedin.com/feed/update/urn:li:activity:" + id + "/",
    firstLine: text.split(". ")[0].slice(0, 120),
    words: text ? text.split(" ").length : 0,
    // A one-line caption almost always means the substance is in a carousel,
    // so it needs the deck opened before it can be judged or written up.
    likelyCarousel: text.length > 0 && text.length < 90,
    engagement: (p.social || "").replace(/\s+/g, " ").trim() || null,
  });
});

fresh.sort((a, b) => String(b.date).localeCompare(String(a.date)));

console.log(JSON.stringify({
  checkedAt: new Date().toISOString().slice(0, 16).replace("T", " ") + " UTC",
  site: { slides: site.slides, cardLinks: site.cards, seriesParts: site.parts, uniqueIds: site.ids.size },
  scraped: seen.size,
  newCount: fresh.length,
  new: fresh,
}, null, 1));
