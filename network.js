/* Animated supply chain network for the home page hero.
   Nodes drift slowly, lines are routes, small dots are shipments.
   Respects reduced motion and pauses when off screen. */
(function () {
  var canvas = document.getElementById("network");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var w = 0, h = 0, dpr = 1;
  var nodes = [], edges = [], packets = [];
  var accent = "#3347d1", warm = "#b45309";
  var running = false, visible = true, raf = 0;

  function readColors() {
    var cs = getComputedStyle(document.documentElement);
    accent = cs.getPropertyValue("--accent").trim() || accent;
    warm = cs.getPropertyValue("--warm").trim() || warm;
  }

  function build() {
    var rect = canvas.getBoundingClientRect();
    w = rect.width; h = rect.height;
    if (!w || !h) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var count = Math.max(14, Math.min(46, Math.round((w * h) / 16000)));
    nodes = [];
    for (var i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: 1.8 + Math.random() * 2.2,
        hub: Math.random() < 0.18
      });
    }

    // connect each node to its 2 nearest neighbors
    edges = [];
    var seen = {};
    for (var a = 0; a < nodes.length; a++) {
      var ds = [];
      for (var b = 0; b < nodes.length; b++) {
        if (a === b) continue;
        var dx = nodes[a].x - nodes[b].x, dy = nodes[a].y - nodes[b].y;
        ds.push({ i: b, d: dx * dx + dy * dy });
      }
      ds.sort(function (p, q) { return p.d - q.d; });
      for (var k = 0; k < 2; k++) {
        var j = ds[k].i;
        var key = a < j ? a + "-" + j : j + "-" + a;
        if (!seen[key]) { seen[key] = 1; edges.push([a, j]); }
      }
    }

    packets = [];
    var pc = Math.min(edges.length, Math.round(count / 2));
    for (var p = 0; p < pc; p++) {
      packets.push({
        e: Math.floor(Math.random() * edges.length),
        t: Math.random(),
        s: 0.0015 + Math.random() * 0.002,
        dir: Math.random() < 0.5 ? 1 : -1
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    ctx.lineWidth = 1;
    ctx.strokeStyle = accent;
    ctx.globalAlpha = 0.22;
    ctx.beginPath();
    for (var i = 0; i < edges.length; i++) {
      var A = nodes[edges[i][0]], B = nodes[edges[i][1]];
      ctx.moveTo(A.x, A.y);
      ctx.lineTo(B.x, B.y);
    }
    ctx.stroke();

    ctx.fillStyle = accent;
    for (var n = 0; n < nodes.length; n++) {
      var nd = nodes[n];
      ctx.globalAlpha = nd.hub ? 0.55 : 0.4;
      ctx.beginPath();
      ctx.arc(nd.x, nd.y, nd.hub ? nd.r + 1.6 : nd.r, 0, 6.2832);
      ctx.fill();
    }

    ctx.fillStyle = warm;
    ctx.globalAlpha = 0.9;
    for (var q = 0; q < packets.length; q++) {
      var pk = packets[q];
      var E = edges[pk.e];
      var P = nodes[E[0]], Q = nodes[E[1]];
      var t = pk.dir === 1 ? pk.t : 1 - pk.t;
      ctx.beginPath();
      ctx.arc(P.x + (Q.x - P.x) * t, P.y + (Q.y - P.y) * t, 2.2, 0, 6.2832);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function step() {
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    }
    for (var p = 0; p < packets.length; p++) {
      var pk = packets[p];
      pk.t += pk.s;
      if (pk.t >= 1) {
        pk.t = 0;
        pk.e = Math.floor(Math.random() * edges.length);
        pk.dir = Math.random() < 0.5 ? 1 : -1;
      }
    }
  }

  function loop() {
    if (!running) return;
    step();
    draw();
    raf = requestAnimationFrame(loop);
  }

  function start() {
    if (reduce || running || !visible || document.hidden) return;
    running = true;
    raf = requestAnimationFrame(loop);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  function init() {
    readColors();
    build();
    draw();
    start();
  }

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { build(); draw(); }, 150);
  });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop(); else start();
  });
  if (window.IntersectionObserver) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) start(); else stop();
    }).observe(canvas);
  }
  var mq = window.matchMedia("(prefers-color-scheme: dark)");
  if (mq.addEventListener) mq.addEventListener("change", function () { readColors(); draw(); });

  init();
})();
