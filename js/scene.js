/* ===========================================================================
   Atmosphere layer.
   One persistent WebGL scene behind every slide. It carries no information,
   never blocks input, and is entirely disposable — if this fails to start,
   the CSS veil in deck.css is a complete visual fallback.
   =========================================================================== */

window.Atmosphere = (function () {
  "use strict";

  var N = 2600;          // particle count
  var LERP = 0.055;      // position easing per frame
  var HUE_LERP = 0.06;

  var renderer, scene, camera, group, points, geo, mat, shell;
  var posAttr, colAttr;
  var cur, target;                    // Float32Array position buffers
  var jitter = [];                    // per-particle hue/lightness variance
  var forms = {};                     // precomputed formations
  var camTargets = {};
  var curHue = 210, tgtHue = 210;
  var camTgt, camCur;
  var running = false, reduced = false, raf = null;
  var flat = false, spinBlend = 0;
  var pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  var clock = 0;

  /* ---------- formation builders ---------- */

  function fSphere(a) {
    var R = 17, gr = Math.PI * (1 + Math.sqrt(5));
    for (var i = 0; i < N; i++) {
      var phi = Math.acos(1 - 2 * (i + 0.5) / N), th = gr * i;
      var r = R * (0.86 + Math.random() * 0.2);
      a[i * 3]     = Math.cos(th) * Math.sin(phi) * r;
      a[i * 3 + 1] = Math.sin(th) * Math.sin(phi) * r;
      a[i * 3 + 2] = Math.cos(phi) * r;
    }
  }

  function fGrid(a) {
    var cols = Math.ceil(Math.sqrt(N)), sp = 52 / cols;
    for (var i = 0; i < N; i++) {
      var c = i % cols, r = Math.floor(i / cols);
      a[i * 3]     = (c - cols / 2) * sp + (Math.random() - .5) * sp * .35;
      a[i * 3 + 1] = (Math.random() - .5) * 2.4;
      a[i * 3 + 2] = (r - cols / 2) * sp + (Math.random() - .5) * sp * .35;
    }
  }

  function fHelix(a) {
    var turns = 5.5, H = 42;
    for (var i = 0; i < N; i++) {
      var t = i / N, ang = t * turns * Math.PI * 2 + (i % 2 ? Math.PI : 0);
      var r = 12 + (i % 3) * 1.4 + Math.random() * 1.8;
      a[i * 3]     = Math.cos(ang) * r;
      a[i * 3 + 1] = (t - .5) * H;
      a[i * 3 + 2] = Math.sin(ang) * r;
    }
  }

  function fWave(a) {
    var cols = Math.ceil(Math.sqrt(N)), sp = 56 / cols;
    for (var i = 0; i < N; i++) {
      var c = i % cols, r = Math.floor(i / cols);
      var x = (c - cols / 2) * sp, z = (r - cols / 2) * sp;
      a[i * 3]     = x;
      a[i * 3 + 1] = Math.sin(x * .16) * 4.2 + Math.cos(z * .19) * 3.4;
      a[i * 3 + 2] = z;
    }
  }

  function fRing(a) {
    var R = 20, r2 = 5.4;
    for (var i = 0; i < N; i++) {
      var u = Math.random() * Math.PI * 2, v = Math.random() * Math.PI * 2;
      var rr = r2 * (0.55 + Math.random() * 0.5);
      a[i * 3]     = (R + rr * Math.cos(v)) * Math.cos(u);
      a[i * 3 + 1] = rr * Math.sin(v);
      a[i * 3 + 2] = (R + rr * Math.cos(v)) * Math.sin(u);
    }
  }

  function fScatter(a) {
    for (var i = 0; i < N; i++) {
      a[i * 3]     = (Math.random() - .5) * 60;
      a[i * 3 + 1] = (Math.random() - .5) * 34;
      a[i * 3 + 2] = (Math.random() - .5) * 60;
    }
  }

  /* The word "Copilot", sampled from rendered type into the point cloud.
     Home only. Centred, so the headline and card grid sit over it — it reads
     as background texture rather than a legible standalone word. */
  function fWord(a) {
    var WORD = "Copilot";
    var W = 1024, H = 256;
    var c = document.createElement("canvas");
    c.width = W; c.height = H;
    var g = c.getContext("2d");
    g.fillStyle = "#fff";
    g.textAlign = "center";
    g.textBaseline = "middle";

    var size = 190;
    var font = function (s) {
      return '700 ' + s + 'px "Segoe UI Variable Display","Segoe UI",system-ui,sans-serif';
    };
    g.font = font(size);
    while (g.measureText(WORD).width > W * 0.92 && size > 20) {
      size -= 4;
      g.font = font(size);
    }
    g.fillText(WORD, W / 2, H / 2);

    var d = g.getImageData(0, 0, W, H).data;
    var pts = [];
    for (var y = 0; y < H; y += 2) {
      for (var x = 0; x < W; x += 2) {
        if (d[(y * W + x) * 4 + 3] > 60) pts.push([x, y]);
      }
    }
    if (!pts.length) { fSphere(a); return; }

    var SPAN = 64, LIFT = 0;
    for (var i = 0; i < N; i++) {
      var p = pts[(Math.random() * pts.length) | 0];
      a[i * 3]     = ((p[0] + (Math.random() - .5) * 2) / W - 0.5) * SPAN;
      a[i * 3 + 1] = -((p[1] + (Math.random() - .5) * 2) / H - 0.5) * (SPAN * 0.25) + LIFT;
      a[i * 3 + 2] = (Math.random() - .5) * 3;   // shallow: depth mushes the letterforms
    }
  }

  var BUILDERS = {
    sphere: fSphere, grid: fGrid, helix: fHelix,
    wave: fWave, ring: fRing, scatter: fScatter, word: fWord,
  };

  // Formations that spell something have to stay roughly face-on. A full spin
  // turns the word edge-on for most of each revolution, where it collapses to
  // a bar. These sway instead.
  var FLAT = { word: true };

  var CAMS = {
    sphere:  { x: 0,   y: 2,   z: 46 },
    grid:    { x: 0,   y: 15,  z: 36 },
    helix:   { x: 4,   y: 0,   z: 42 },
    wave:    { x: 0,   y: 13,  z: 40 },
    ring:    { x: 0,   y: 11,  z: 44 },
    scatter: { x: 0,   y: 0,   z: 48 },
    word:    { x: 0,   y: 0,   z: 46 },
  };

  /* ---------- soft round sprite so points aren't squares ---------- */

  function sprite() {
    var c = document.createElement("canvas");
    c.width = c.height = 64;
    var g = c.getContext("2d");
    var rg = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    rg.addColorStop(0,   "rgba(255,255,255,1)");
    rg.addColorStop(.35, "rgba(255,255,255,.55)");
    rg.addColorStop(1,   "rgba(255,255,255,0)");
    g.fillStyle = rg;
    g.fillRect(0, 0, 64, 64);
    var t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }

  /* ---------- colours ---------- */

  function paint() {
    var col = colAttr.array, c = new THREE.Color();
    for (var i = 0; i < N; i++) {
      var j = jitter[i];
      c.setHSL(
        (((curHue + j.h) % 360) + 360) % 360 / 360,
        j.s,
        j.l
      );
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    colAttr.needsUpdate = true;

    if (shell) shell.material.color.setHSL(((curHue % 360) + 360) % 360 / 360, .8, .58);
  }

  /* ---------- public ---------- */

  function init(canvas) {
    if (!window.THREE) return false;

    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvas, alpha: true, antialias: false, powerPreference: "high-performance",
      });
    } catch (e) { return false; }

    if (!renderer || !renderer.getContext()) return false;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight, false);

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070b, 0.0125);

    camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 400);
    camCur = { x: 0, y: 2, z: 46 };
    camTgt = { x: 0, y: 2, z: 46 };
    camera.position.set(camCur.x, camCur.y, camCur.z);

    group = new THREE.Group();
    scene.add(group);

    Object.keys(BUILDERS).forEach(function (k) {
      var a = new Float32Array(N * 3);
      BUILDERS[k](a);
      forms[k] = a;
    });

    for (var i = 0; i < N; i++) {
      jitter.push({
        h: (Math.random() - .5) * 46,
        s: 0.62 + Math.random() * 0.34,
        l: 0.40 + Math.random() * 0.42,
      });
    }

    cur = new Float32Array(forms.sphere);
    target = new Float32Array(forms.sphere);

    geo = new THREE.BufferGeometry();
    posAttr = new THREE.BufferAttribute(cur, 3);
    posAttr.setUsage(THREE.DynamicDrawUsage);
    colAttr = new THREE.BufferAttribute(new Float32Array(N * 3), 3);
    colAttr.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute("position", posAttr);
    geo.setAttribute("color", colAttr);

    mat = new THREE.PointsMaterial({
      size: 0.8,
      map: sprite(),
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    points = new THREE.Points(geo, mat);
    group.add(points);

    shell = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(26, 1)),
      new THREE.LineBasicMaterial({ transparent: true, opacity: 0.055, depthWrite: false })
    );
    group.add(shell);

    paint();

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop(); else start();
    });
    canvas.addEventListener("webglcontextlost", function (e) { e.preventDefault(); stop(); });
    canvas.addEventListener("webglcontextrestored", start);

    start();
    return true;
  }

  function onPointer(e) {
    pointer.tx = (e.clientX / window.innerWidth - .5) * 2;
    pointer.ty = (e.clientY / window.innerHeight - .5) * 2;
  }

  function resize() {
    if (!renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
  }

  function goTo(form, hue) {
    if (!renderer) return;
    var f = forms[form] || forms.sphere;
    target.set(f);
    flat = !!FLAT[form];
    var c = CAMS[form] || CAMS.sphere;
    camTgt = { x: c.x, y: c.y, z: c.z };
    tgtHue = hue;

    if (reduced) {                    // snap, don't animate
      cur.set(target);
      posAttr.needsUpdate = true;
      camCur = { x: camTgt.x, y: camTgt.y, z: camTgt.z };
      camera.position.set(camCur.x, camCur.y, camCur.z);
      curHue = tgtHue;
      paint();
      draw();
    }
  }

  function setReduced(v) {
    reduced = !!v;
    if (reduced) { stop(); draw(); } else { start(); }
  }

  function draw() {
    if (renderer) { camera.lookAt(0, 0, 0); renderer.render(scene, camera); }
  }

  function tick() {
    raf = requestAnimationFrame(tick);
    clock += 0.0045;

    // positions ease toward the target formation
    var moved = false, a = cur, b = target;
    for (var i = 0, n = a.length; i < n; i++) {
      var d = b[i] - a[i];
      if (d > 0.004 || d < -0.004) { a[i] += d * LERP; moved = true; }
    }
    if (moved) posAttr.needsUpdate = true;

    // hue eases toward the slide's signature colour
    var hd = tgtHue - curHue;
    if (hd > 180) hd -= 360; else if (hd < -180) hd += 360;
    if (hd > 0.12 || hd < -0.12) { curHue += hd * HUE_LERP; paint(); }

    // camera glides, with a little pointer parallax
    pointer.x += (pointer.tx - pointer.x) * 0.035;
    pointer.y += (pointer.ty - pointer.y) * 0.035;
    camCur.x += (camTgt.x - camCur.x) * 0.035;
    camCur.y += (camTgt.y - camCur.y) * 0.035;
    camCur.z += (camTgt.z - camCur.z) * 0.035;
    camera.position.set(
      camCur.x + pointer.x * 3.4,
      camCur.y - pointer.y * 2.6,
      camCur.z
    );

    // A flat formation sways so it stays legible; everything else spins.
    // Eased, so the two behaviours blend rather than snap on slide change.
    spinBlend += ((flat ? 1 : 0) - spinBlend) * 0.05;
    var spin = clock * 0.42;
    var sway = Math.sin(clock * 0.55) * 0.30;
    group.rotation.y = spin * (1 - spinBlend) + sway * spinBlend;
    group.rotation.x = Math.sin(clock * 0.5) * 0.07 * (1 - spinBlend * 0.7);
    shell.rotation.y = -clock * 0.7;
    shell.rotation.z = clock * 0.28;

    draw();
  }

  function start() { if (renderer && !running && !reduced) { running = true; tick(); } }
  function stop()  { running = false; if (raf) cancelAnimationFrame(raf); raf = null; }

  return { init: init, goTo: goTo, setReduced: setReduced };
})();
