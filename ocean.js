/* Цифровой океан — фоновый canvas: матрица из 0/1 + дрейфующие цифры + пузырьки.
   Лёгкий, за контентом (.ocean-bg, z-index:-1), уважает reduced-motion. */
(function () {
  var cv = document.getElementById('ocean');
  if (!cv || !cv.getContext) return;
  var cx = cv.getContext('2d');
  var W, H, DPR, fs, cols, motes, bubbles;
  var R = Math.random;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    DPR = Math.min(2, window.devicePixelRatio || 1);
    W = cv.width = window.innerWidth * DPR;
    H = cv.height = window.innerHeight * DPR;
    cv.style.width = window.innerWidth + 'px';
    cv.style.height = window.innerHeight + 'px';
    fs = Math.round(15 * DPR);
    cols = [];
    var step = fs * 1.7, n = Math.floor(W / step), i, len;
    for (i = 0; i < n; i++) {
      if (R() < 0.55) {
        len = 7 + (R() * 10 | 0);
        cols.push({ x: Math.round(i * step + R() * fs), y: R() * H, sp: (0.45 + R() * 1.2) * DPR, len: len,
          ch: Array.from({ length: len }, function () { return R() < 0.5 ? '0' : '1'; }) });
      }
    }
    motes = Array.from({ length: 42 }, function () {
      return { x: R() * W, y: R() * H, v: (0.15 + R() * 0.5) * DPR, c: R() < 0.5 ? '0' : '1', o: 0.05 + R() * 0.12, sz: Math.round((10 + R() * 8) * DPR) };
    });
    bubbles = Array.from({ length: 44 }, function () {
      return { x: R() * W, y: R() * H, r: (2 + R() * 5) * DPR, s: (0.2 + R() * 0.7) * DPR, o: 0.06 + R() * 0.12 };
    });
  }
  resize();
  window.addEventListener('resize', resize);

  function draw() {
    cx.clearRect(0, 0, W, H);
    // матрица
    cx.font = '600 ' + fs + 'px Consolas, monospace';
    for (var c = 0; c < cols.length; c++) {
      var col = cols[c];
      for (var k = 0; k < col.len; k++) {
        var yy = col.y - k * fs;
        if (yy < -fs || yy > H + fs) continue;
        cx.globalAlpha = (1 - k / col.len) * 0.5;
        cx.fillStyle = (k === 0) ? '#cffaf0' : '#2dd4bf';
        cx.fillText(col.ch[k], col.x, yy);
      }
      if (!reduce) {
        if (R() < 0.06) col.ch[(R() * col.len) | 0] = R() < 0.5 ? '0' : '1';
        col.y += col.sp;
        if (col.y - col.len * fs > H) { col.y = -R() * 80; col.x = Math.round(R() * W); col.sp = (0.45 + R() * 1.2) * DPR; }
      }
    }
    // одиночные дрейфующие цифры
    for (var m = 0; m < motes.length; m++) {
      var mo = motes[m];
      cx.globalAlpha = mo.o; cx.fillStyle = '#5eead4';
      cx.font = '600 ' + mo.sz + 'px Consolas, monospace';
      cx.fillText(mo.c, mo.x, mo.y);
      if (!reduce) { mo.y -= mo.v; if (mo.y < -12) { mo.y = H + 12; mo.x = R() * W; mo.c = R() < 0.5 ? '0' : '1'; } }
    }
    // пузырьки
    cx.lineWidth = 1 * DPR; cx.strokeStyle = '#7de8d6';
    for (var b = 0; b < bubbles.length; b++) {
      var bu = bubbles[b];
      cx.globalAlpha = bu.o; cx.beginPath(); cx.arc(bu.x, bu.y, bu.r, 0, 7); cx.stroke();
      if (!reduce) { bu.y -= bu.s; if (bu.y < -6) { bu.y = H + 6; bu.x = R() * W; } }
    }
    cx.globalAlpha = 1;
    if (!reduce) requestAnimationFrame(draw);
  }
  draw();
})();
