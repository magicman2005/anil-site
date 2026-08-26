/* ===========================================================================
   Deck controller — rendering, navigation, modals.
   Classic script (no modules) so the deck also runs straight from disk.
   =========================================================================== */

(function () {
  "use strict";

  var D = window.DECK;
  if (!D) return;

  var SLIDES = D.slides;
  var idx = 0;
  var stackMode = false;
  var lastFocus = null;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var $ = function (s, r) { return (r || document).querySelector(s); };

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  var ICON = {
    left:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
    right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13M12 5l7 7-7 7"/></svg>',
  };

  /* ---------- render ---------- */

  function cardHTML(c, i, slideHue) {
    var hue = c.hue == null ? slideHue : c.hue;
    var label = c.go ? "Open" : "Read";
    return '' +
      '<button class="card" type="button" style="--c-hue:' + hue + '" ' +
        'data-card="' + i + '" aria-haspopup="dialog">' +
        '<span class="c-meta">' + esc(c.meta || "") + '</span>' +
        '<span class="c-title">' + esc(c.title) + '</span>' +
        '<span class="c-teaser">' + esc(c.teaser || "") + '</span>' +
        '<span class="c-go">' + label + ' ' + ICON.arrow + '</span>' +
      '</button>';
  }

  function headHTML(s) {
    return '' +
      '<div class="s-head">' +
        (s.kicker ? '<p class="kicker">' + esc(s.kicker) + '</p>' : '') +
        '<h2 class="s-title">' + esc(s.title) + '</h2>' +
        (s.lede ? '<p class="s-lede">' + esc(s.lede) + '</p>' : '') +
      '</div>';
  }

  function slideHTML(s, i) {
    var inner = "";

    if (s.kind === "home") {
      inner =
        '<div class="home-copy">' +
          (s.kicker ? '<p class="kicker">' + esc(s.kicker) + '</p>' : '') +
          '<h2 class="s-title">' + esc(s.title) + '</h2>' +
          (s.lede ? '<p class="s-lede">' + esc(s.lede) + '</p>' : '') +
          '<p class="home-hint"><kbd>&larr;</kbd><kbd>&rarr;</kbd> to travel &middot; ' +
            'click any card for detail</p>' +
        '</div>' +
        '<div class="cards" data-n="' + s.cards.length + '">' +
          s.cards.map(function (c, ci) { return cardHTML(c, ci, s.hue); }).join("") +
        '</div>';

    } else if (s.kind === "statement") {
      inner = headHTML(s) +
        (s.facts
          ? '<ul class="facts">' + s.facts.map(function (f) {
              return '<li><b>' + esc(f.k) + '</b><span>' + esc(f.v) + '</span></li>';
            }).join("") + '</ul>'
          : '');

    } else if (s.kind === "connect") {
      var p = D.profile;
      var hasLi = /linkedin\.com\/in\/.+/i.test(p.linkedin || "");
      inner = headHTML(s) +
        '<div class="actions">' +
          '<a class="btn btn-1" href="' + (hasLi ? esc(p.linkedin) : "#") + '"' +
            (hasLi ? ' target="_blank" rel="noopener"' : ' aria-disabled="true"') + '>' +
            (hasLi ? 'Connect on LinkedIn' : 'LinkedIn — link coming soon') + '</a>' +
          '<a class="btn btn-2" href="mailto:' + esc(p.email) + '">' + esc(p.email) + '</a>' +
        '</div>' +
        (s.note ? '<p class="fine">' + esc(s.note) + '</p>' : '');

    } else {
      inner = headHTML(s) +
        '<div class="cards" data-n="' + s.cards.length + '">' +
          s.cards.map(function (c, ci) { return cardHTML(c, ci, s.hue); }).join("") +
        '</div>';
    }

    return '' +
      '<section class="slide" id="' + esc(s.id) + '" data-kind="' + esc(s.kind) + '" ' +
        'data-i="' + i + '" role="group" aria-roledescription="slide" ' +
        'aria-label="' + (i + 1) + ' of ' + SLIDES.length + ': ' + esc(s.label) + '">' +
        inner +
      '</section>';
  }

  function build() {
    $("#deck").innerHTML = SLIDES.map(slideHTML).join("");

    $("#dots").innerHTML = SLIDES.map(function (s, i) {
      return '<button class="dot" type="button" data-i="' + i + '" ' +
        'aria-label="Go to ' + esc(s.label) + '">' +
        '<span class="dot-tip">' + esc(s.label) + '</span></button>';
    }).join("");

    $("#prev").innerHTML = ICON.left;
    $("#next").innerHTML = ICON.right;
    $("#m-close").innerHTML = ICON.close;
  }

  /* ---------- navigation ---------- */

  function go(i, opts) {
    opts = opts || {};
    i = Math.max(0, Math.min(SLIDES.length - 1, i));
    var s = SLIDES[i];
    idx = i;

    if (stackMode) {
      var el = document.getElementById(s.id);
      if (el && !opts.silent) el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    } else {
      var nodes = document.querySelectorAll(".slide");
      for (var n = 0; n < nodes.length; n++) {
        nodes[n].classList.toggle("is-active", n === i);
        nodes[n].classList.toggle("is-prev", n < i);
        nodes[n].setAttribute("aria-hidden", n === i ? "false" : "true");
      }
    }

    document.documentElement.style.setProperty("--hue", s.hue);
    if (window.__atmoOK) window.Atmosphere.goTo(s.scene, s.hue);

    var dots = document.querySelectorAll(".dot");
    for (var d = 0; d < dots.length; d++) {
      dots[d].setAttribute("aria-current", d === i ? "true" : "false");
    }

    $("#counter").innerHTML = "<b>" + String(i + 1).padStart(2, "0") + "</b> / " +
      String(SLIDES.length).padStart(2, "0");
    $("#now").textContent = s.label;
    $("#prev").disabled = i === 0;
    $("#next").disabled = i === SLIDES.length - 1;
    $("#live").textContent = "Slide " + (i + 1) + " of " + SLIDES.length + ": " + s.label;

    try { history.replaceState(null, "", "#" + s.id); } catch (e) { /* file:// */ }
  }

  var next = function () { go(idx + 1); };
  var prev = function () { go(idx - 1); };

  /* ---------- modal ---------- */

  var modal = null, mOpen = false;

  function openModal(slide, ci, trigger) {
    var c = slide.cards[ci];
    var hue = c.hue == null ? slide.hue : c.hue;
    lastFocus = trigger || null;

    modal.style.setProperty("--m-hue", hue);
    $("#m-meta").textContent = c.meta || slide.label;
    $("#m-title").textContent = c.title;

    var body = c.body && c.body.length
      ? c.body.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("")
      : "<p>" + esc(c.teaser || "") + "</p>";

    if (c.takeaway) {
      body += '<div class="modal-take"><b>So what</b><span>' + esc(c.takeaway) + "</span></div>";
    }
    $("#m-body").innerHTML = body;

    var foot = (c.tags || []).map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("");

    if (c.go) {
      var t = SLIDES.findIndex(function (s) { return s.id === c.go; });
      foot += '<button class="modal-link" type="button" data-goto="' + t + '">' +
        "Open the full slide " + ICON.arrow + "</button>";
    } else if (c.link) {
      var live = c.link.href && /^https?:\/\//i.test(c.link.href);
      foot += live
        ? '<a class="modal-link" href="' + esc(c.link.href) + '" target="_blank" rel="noopener">' +
            esc(c.link.label) + " " + ICON.arrow + "</a>"
        : '<span class="modal-link is-off">Link coming soon</span>';
    }
    $("#m-foot").innerHTML = foot;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    mOpen = true;
    $("#m-close").focus();
  }

  function closeModal() {
    if (!mOpen) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    mOpen = false;
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
    lastFocus = null;
  }

  function trapTab(e) {
    var f = modal.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])');
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ---------- layout mode ---------- */

  // In stack mode the active slide is whichever section is nearest the middle
  // of the viewport. Called on scroll, and once on boot so the initial state
  // is correct even when no scroll event ever fires.
  function syncFromScroll() {
    if (!stackMode) return;
    var mid = window.innerHeight / 2, best = 0, bd = Infinity;
    var nodes = document.querySelectorAll(".slide");
    for (var n = 0; n < nodes.length; n++) {
      var r = nodes[n].getBoundingClientRect();
      var d = Math.abs(r.top + r.height / 2 - mid);
      if (d < bd) { bd = d; best = n; }
    }
    if (best !== idx) go(best, { silent: true });
  }

  function evalMode() {
    var want = window.innerWidth < 720 || window.innerHeight < 480;
    if (want === stackMode) return;
    stackMode = want;
    document.documentElement.classList.toggle("stack", stackMode);

    if (stackMode) {
      var nodes = document.querySelectorAll(".slide");
      for (var n = 0; n < nodes.length; n++) {
        nodes[n].classList.remove("is-active", "is-prev");
        nodes[n].setAttribute("aria-hidden", "false");
      }
    }
    go(idx, { silent: true });
    if (stackMode) requestAnimationFrame(syncFromScroll);
  }

  /* ---------- wire up ---------- */

  function bind() {
    $("#next").addEventListener("click", next);
    $("#prev").addEventListener("click", prev);

    $("#dots").addEventListener("click", function (e) {
      var b = e.target.closest(".dot");
      if (b) go(+b.dataset.i);
    });

    $("#deck").addEventListener("click", function (e) {
      var b = e.target.closest(".card");
      if (!b) return;
      var s = SLIDES[+b.closest(".slide").dataset.i];
      openModal(s, +b.dataset.card, b);
    });

    modal.addEventListener("click", function (e) {
      if (e.target.closest("#m-close") || e.target.classList.contains("modal-scrim")) {
        closeModal(); return;
      }
      var g = e.target.closest("[data-goto]");
      if (g) { closeModal(); go(+g.dataset.goto); }
    });

    document.addEventListener("keydown", function (e) {
      if (mOpen) {
        if (e.key === "Escape") { e.preventDefault(); closeModal(); }
        else if (e.key === "Tab") trapTab(e);
        return;
      }
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test((e.target.tagName || ""))) return;

      switch (e.key) {
        case "ArrowRight": case "ArrowDown": case "PageDown":
          e.preventDefault(); next(); break;
        case "ArrowLeft": case "ArrowUp": case "PageUp":
          e.preventDefault(); prev(); break;
        case " ":
          if (e.target === document.body) { e.preventDefault(); next(); } break;
        case "Home": e.preventDefault(); go(0); break;
        case "End":  e.preventDefault(); go(SLIDES.length - 1); break;
        default:
          if (/^[0-9]$/.test(e.key)) {
            var n = e.key === "0" ? 9 : +e.key - 1;
            if (n < SLIDES.length) { e.preventDefault(); go(n); }
          }
      }
    });

    // touch swipe
    var sx = 0, sy = 0, t0 = 0;
    document.addEventListener("touchstart", function (e) {
      if (stackMode || mOpen) return;
      sx = e.changedTouches[0].clientX; sy = e.changedTouches[0].clientY; t0 = Date.now();
    }, { passive: true });

    document.addEventListener("touchend", function (e) {
      if (stackMode || mOpen) return;
      var dx = e.changedTouches[0].clientX - sx;
      var dy = e.changedTouches[0].clientY - sy;
      if (Date.now() - t0 > 700) return;
      if (Math.abs(dx) > 52 && Math.abs(dx) > Math.abs(dy)) { dx < 0 ? next() : prev(); }
      else if (Math.abs(dy) > 52) { dy < 0 ? next() : prev(); }
    }, { passive: true });

    window.addEventListener("resize", evalMode, { passive: true });

    // in stack mode, keep the dots in sync with scroll position
    window.addEventListener("scroll", syncFromScroll, { passive: true });
  }

  /* ---------- boot ---------- */

  function boot() {
    build();
    modal = $("#modal");
    bind();

    window.__atmoOK = window.Atmosphere.init($("#bg"));
    if (window.__atmoOK) window.Atmosphere.setReduced(reduced);

    var mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    (mq.addEventListener ? mq.addEventListener.bind(mq, "change") : mq.addListener.bind(mq))(function (e) {
      reduced = e.matches;
      if (window.__atmoOK) window.Atmosphere.setReduced(reduced);
    });

    stackMode = !(window.innerWidth < 720 || window.innerHeight < 480);
    evalMode();

    var start = 0;
    if (location.hash) {
      var h = location.hash.slice(1);
      var f = SLIDES.findIndex(function (s) { return s.id === h; });
      if (f > -1) start = f;
    }
    go(start, { silent: true });
    if (stackMode) requestAnimationFrame(syncFromScroll);

    document.body.classList.add("ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
