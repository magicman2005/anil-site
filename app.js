/* ===========================================================================
   Anil Madhok — site behaviour
   Vanilla JS. Data comes from data/*.js (globals: NOTES, POSTS, BUILDS).
   =========================================================================== */

(function () {
  "use strict";

  var $ = function (s) { return document.querySelector(s); };

  var NOTES  = window.NOTES  || [];
  var POSTS  = window.POSTS  || [];
  var BUILDS = window.BUILDS || [];
  var PROFILE = window.LINKEDIN_PROFILE || "";

  /* ---------- helpers ---------- */

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  var MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  // Accepts "YYYY-MM" or "YYYY-MM-DD". Parsed manually so it never shifts timezone.
  function fmtDate(v) {
    var m = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(String(v || ""));
    if (!m) return esc(v);
    var out = MONTHS[parseInt(m[2], 10) - 1] + " " + m[1];
    return m[3] ? parseInt(m[3], 10) + " " + out : out;
  }

  function sortByDateDesc(a, b) {
    return String(b.date || "").localeCompare(String(a.date || ""));
  }

  /* ---------- theme ---------- */

  var themeBtn = $("#theme");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) { /* private mode */ }
    });
  }

  /* ---------- portrait fallback ---------- */

  var img = $("#portrait-img");
  if (img) {
    var hide = function () { img.classList.add("missing"); };
    img.addEventListener("error", hide);
    if (img.complete && img.naturalWidth === 0) hide();
  }

  /* ---------- LinkedIn profile links ---------- */

  var hasProfile = /linkedin\.com\/in\/.+/i.test(PROFILE);
  ["#follow-inline", "#follow-footer"].forEach(function (sel) {
    var a = $(sel);
    if (!a) return;
    if (hasProfile) {
      a.href = PROFILE;
    } else {
      a.removeAttribute("target");
      a.setAttribute("href", "#posts");
    }
  });

  /* ---------- generic filter wiring ---------- */

  function buildFilter(opts) {
    var chipBox = $(opts.chips);
    var grid    = $(opts.grid);
    var empty   = $(opts.empty);
    if (!chipBox || !grid) return;

    var cats = ["All"];
    opts.items.forEach(function (item) {
      opts.catsOf(item).forEach(function (c) {
        if (c && cats.indexOf(c) === -1) cats.push(c);
      });
    });

    chipBox.innerHTML = cats.map(function (c, i) {
      return '<button class="chip" type="button" aria-pressed="' + (i === 0) +
             '" data-cat="' + esc(c) + '">' + esc(c) + "</button>";
    }).join("");

    function render(cat) {
      var list = cat === "All"
        ? opts.items
        : opts.items.filter(function (it) { return opts.catsOf(it).indexOf(cat) !== -1; });

      grid.innerHTML = list.map(opts.tpl).join("");
      if (empty) empty.hidden = list.length > 0;
      reveal(grid);
    }

    chipBox.addEventListener("click", function (e) {
      var btn = e.target.closest(".chip");
      if (!btn) return;
      chipBox.querySelectorAll(".chip").forEach(function (c) {
        c.setAttribute("aria-pressed", String(c === btn));
      });
      render(btn.dataset.cat);
    });

    render("All");
  }

  /* ---------- templates ---------- */

  function noteTpl(n) {
    return '' +
      '<article class="note reveal">' +
        '<div class="note-meta">' +
          '<span class="note-tag">' + esc(n.product) + '</span>' +
          '<span class="note-date">' + fmtDate(n.date) + '</span>' +
        '</div>' +
        '<h3>' + esc(n.title) + '</h3>' +
        '<p>' + esc(n.body) + '</p>' +
        (n.takeaway
          ? '<div class="note-take"><b>So what</b>' + esc(n.takeaway) + '</div>'
          : '') +
      '</article>';
  }

  function postTpl(p) {
    var live = p.url && /^https?:\/\//i.test(p.url);
    return '' +
      '<article class="post reveal' + (p.featured ? ' is-featured' : '') + '">' +
        '<div class="post-top">' +
          (p.featured ? '<span class="pin">★ Pinned</span>' : '') +
          '<span>' + fmtDate(p.date) + '</span>' +
        '</div>' +
        '<h3>' + esc(p.hook) + '</h3>' +
        '<p>' + esc(p.excerpt) + '</p>' +
        '<div class="post-tags">' +
          (p.tags || []).map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') +
        '</div>' +
        (live
          ? '<a class="post-go" href="' + esc(p.url) + '" target="_blank" rel="noopener">Read on LinkedIn →</a>'
          : '<span class="post-go disabled">Link coming soon</span>') +
      '</article>';
  }

  function buildTpl(b) {
    return '' +
      '<article class="build reveal">' +
        '<p class="kicker">' + esc(b.kind) + '</p>' +
        '<h3>' + esc(b.name) + '</h3>' +
        '<p>' + esc(b.body) + '</p>' +
        '<ul>' + (b.stack || []).map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>' +
      '</article>';
  }

  /* ---------- scroll reveal ---------- */

  var io = ("IntersectionObserver" in window)
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: .05 })
    : null;

  function reveal(scope) {
    var els = (scope || document).querySelectorAll(".reveal:not(.in)");
    if (!io) { els.forEach(function (el) { el.classList.add("in"); }); return; }
    els.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i, 8) * 45 + "ms";
      io.observe(el);
    });
  }

  /* ---------- boot ---------- */

  buildFilter({
    items: NOTES.slice().sort(sortByDateDesc),
    catsOf: function (n) { return [n.product]; },
    tpl: noteTpl,
    chips: "#note-chips", grid: "#note-grid", empty: "#note-empty",
  });

  buildFilter({
    items: POSTS.slice().sort(function (a, b) {
      if (!!b.featured !== !!a.featured) return b.featured ? 1 : -1;
      return sortByDateDesc(a, b);
    }),
    catsOf: function (p) { return p.tags || []; },
    tpl: postTpl,
    chips: "#post-chips", grid: "#post-grid", empty: "#post-empty",
  });

  var bg = $("#build-grid");
  if (bg) bg.innerHTML = BUILDS.map(buildTpl).join("");

  reveal(document);
})();
