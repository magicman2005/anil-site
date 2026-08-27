#!/usr/bin/env node
/*
 * stamp.js — cache-bust the site's own assets.
 *
 *   node tools/stamp.js
 *
 * GitHub Pages serves CSS and JS with a 10-minute cache, and browsers hold on
 * to them for longer than that. Without a changing URL, a visitor who has been
 * to the site before sees stale styles and stale behaviour after a deploy —
 * which looks exactly like "the change didn't work".
 *
 * This rewrites the ?v= query on every local asset reference in index.html to
 * a short hash of that file's contents. Only files that actually changed get a
 * new URL, so unchanged assets stay cached.
 *
 * Run it before committing. It is idempotent — running twice changes nothing.
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.resolve(__dirname, "..");
const HTML = path.join(ROOT, "index.html");

function hash(rel) {
  const f = path.join(ROOT, rel);
  if (!fs.existsSync(f)) return null;
  return crypto.createHash("sha1").update(fs.readFileSync(f)).digest("hex").slice(0, 8);
}

let html = fs.readFileSync(HTML, "utf8");
let changed = 0;
const report = [];

// href="css/deck.css" | src="js/deck.js" | s.src = "vendor/three.min.js"
const RE = /((?:href|src)\s*=\s*["']|\.src\s*=\s*["'])((?:css|js|data|vendor|assets)\/[^"'?]+)(\?v=[a-f0-9]+)?(["'])/g;

html = html.replace(RE, (m, pre, file, oldV, quote) => {
  const h = hash(file);
  if (!h) return m;
  const next = pre + file + "?v=" + h + quote;
  if (next !== m) { changed++; report.push("  " + file + "  " + (oldV ? oldV.slice(3) + " -> " : "") + h); }
  return next;
});

if (changed) {
  fs.writeFileSync(HTML, html, "utf8");
  console.log("stamped " + changed + " asset reference(s):");
  report.forEach(r => console.log(r));
} else {
  console.log("all asset stamps already current");
}
