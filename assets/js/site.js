/* SATTVA — shared chrome for the inner pages (Investors, Media) + their page modules. */
(() => {
'use strict';
const $ = (s, r=document) => r.querySelector(s), $$ = (s, r=document) => [...r.querySelectorAll(s)];
const clamp = (v, a=0, b=1) => Math.min(b, Math.max(a, v)), lerp = (a, b, t) => a + (b - a) * t, ease = t => 1 - Math.pow(1 - t, 3);
const pad = (n, l=2) => String(n).padStart(l, '0');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, fine = matchMedia('(hover:hover) and (pointer:fine)').matches;

/* ---------- smooth scroll ---------- */
let lenis = null;
if (!reduce && window.Lenis) { lenis = new Lenis({ lerp: 0.09, smoothWheel: true }); const r = t => { lenis.raf(t); requestAnimationFrame(r); }; requestAnimationFrame(r); }
$$('a[href^="#"]').forEach(a => a.addEventListener('click', e => { const el = $(a.getAttribute('href')); if (!el) return; e.preventDefault(); toggleMenu(false); lenis ? lenis.scrollTo(el, { duration: 1.6, offset: -80 }) : el.scrollIntoView({ behavior: 'smooth' }); }));

/* ---------- header: theme by section, hide on scroll down, live kitchen status ---------- */
const hdr = $('#hdr'), THEME = []; let hTheme = '', lastY = 0, hHide = false, menuOpen = false;
function measure() { THEME.length = 0; $$('[data-hdr]').forEach(el => { const r = el.getBoundingClientRect(); THEME.push([r.top + scrollY, r.top + scrollY + r.height, el.dataset.hdr]); }); }
function hdrTick(y) {
  let t = 'paper'; for (const s of THEME) if (y + 36 >= s[0] && y + 36 < s[1]) { t = s[2]; break; }
  if (t !== hTheme) { hTheme = t; hdr.classList.toggle('dark', t === 'dark'); }
  const dy = y - lastY; if (Math.abs(dy) > 5) { const h = dy > 0 && y > 500 && !menuOpen; if (h !== hHide) { hdr.classList.toggle('hide', h); hHide = h; } lastY = y; }
}
const hdrLive = $('#hdrLive'), liveTxt = $('#liveTxt'), liveClock = $('#liveClock');
function liveTick() {
  let parts; try { parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()); } catch (e) { return; }
  const g = t => (parts.find(p => p.type === t) || {}).value, day = g('weekday'), h = +g('hour'), m = +g('minute'), mins = h * 60 + m;
  const open = day !== 'Mon' && ((mins >= 720 && mins < 930) || (mins >= 1140 && mins < 1410));
  liveClock.textContent = `${pad(h)}:${pad(m)} IST`; hdrLive.classList.toggle('closed', !open);
  liveTxt.textContent = open ? 'Kitchen live · 7 stations firing' : day === 'Mon' ? 'Closed today · back Tuesday' : mins < 720 ? 'Kitchen opens 12:00' : mins < 1140 ? 'Prepping · fires up 19:00' : 'Kitchen closed · opens 12:00';
}
if (hdrLive) { liveTick(); setInterval(liveTick, 20000); }
const burger = $('#burger'), mnav = $('#mnav');
function toggleMenu(v = !menuOpen) { menuOpen = v; mnav.classList.toggle('open', v); mnav.setAttribute('aria-hidden', String(!v)); burger.setAttribute('aria-expanded', String(v)); if (lenis) v ? lenis.stop() : lenis.start(); }
burger.addEventListener('click', () => toggleMenu());

/* ---------- reveals, counters, toast, cursor ---------- */
const rio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } }), { threshold: .15 });
$$('.rv-up').forEach(el => { el.innerHTML = el.innerHTML.split('<br>').map(l => `<span class="ln"><span>${l}</span></span>`).join(''); rio.observe(el); });
$$('.rv-fade').forEach(el => rio.observe(el));
const fmt = (v, d) => v.toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d });
function countTo(el, to, d = 0, dur = 1400) { if (reduce) { el.textContent = fmt(to, d); return; } const t0 = performance.now(); (function s(t) { const k = ease(clamp((t - t0) / dur)); el.textContent = fmt(to * k, d); if (k < 1) requestAnimationFrame(s); })(t0); }
const toastEl = $('#toast'); let toastT; function toast(m) { toastEl.textContent = m; toastEl.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('on'), 3000); }
$$('[data-demo]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); toast(a.dataset.demo); }));
const cur = $('#cursor'); let cx = -99, cy = -99, tx = -99, ty = -99;
if (fine) { addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; }, { passive: true }); document.addEventListener('pointerover', e => cur.classList.toggle('big', !!e.target.closest('a, button, .md-item, [data-tip]'))); }
let rz; const remeasure = () => { clearTimeout(rz); rz = setTimeout(() => { measure(); ir && ir.draw(); }, 140); };
addEventListener('resize', remeasure); addEventListener('load', measure); if (window.ResizeObserver) new ResizeObserver(remeasure).observe(document.body); measure();
(function loop() { hdrTick(scrollY); if (fine) { cx = lerp(cx, tx, .25); cy = lerp(cy, ty, .25); cur.style.transform = `translate3d(${cx.toFixed(1)}px,${cy.toFixed(1)}px,0)`; } requestAnimationFrame(loop); })();
addEventListener('keydown', e => { if (e.key === 'Escape') toggleMenu(false); });
requestAnimationFrame(() => document.body.classList.add('ready'));

/* =====================================================================
   INVESTOR RELATIONS  (all figures ₹ crore unless stated; fictional demo data)
   ===================================================================== */
let ir = null;
if ($('#ir')) ir = (() => {
  const P = ['Q1 FY26', 'Q2 FY26', 'Q1 FY27', 'Q2 FY27'];
  const PL = {          // statement of profit & loss by period
    'Q1 FY26': { rev:118.9, oi:1.0, fb:40.2, emp:28.4, oth:27.2, dep:8.1, fin:2.4, tax:3.4 },
    'Q2 FY26': { rev:132.4, oi:1.2, fb:44.1, emp:31.0, oth:30.7, dep:8.4, fin:3.2, tax:4.1 },
    'Q1 FY27': { rev:148.6, oi:1.5, fb:48.3, emp:35.6, oth:33.5, dep:9.6, fin:3.3, tax:5.0 },
    'Q2 FY27': { rev:171.2, oi:1.8, fb:54.8, emp:39.4, oth:38.1, dep:10.6, fin:3.9, tax:6.6 }
  };
  const SHARES = 4.0; // crore shares, face value ₹10
  const sum = (a, b) => { const o = {}; for (const k in PL[a]) o[k] = +(PL[a][k] + PL[b][k]).toFixed(1); return o; };
  PL['H1 FY26'] = sum('Q1 FY26', 'Q2 FY26'); PL['H1 FY27'] = sum('Q1 FY27', 'Q2 FY27');
  for (const k in PL) { const r = PL[k]; r.ti = +(r.rev + r.oi).toFixed(1); r.ebitda = +(r.rev - r.fb - r.emp - r.oth).toFixed(1); r.margin = r.ebitda / r.rev * 100;
    r.pbt = +(r.ebitda + r.oi - r.dep - r.fin).toFixed(1); r.pat = +(r.pbt - r.tax).toFixed(1); r.eps = r.pat / SHARES; r.patm = r.pat / r.rev * 100; }
  const MONTHS = [['Apr', 46.1, 'Q1'], ['May', 49.3, 'Q1'], ['Jun', 53.2, 'Q1'], ['Jul', 55.0, 'Q2'], ['Aug', 56.4, 'Q2'], ['Sep', 59.8, 'Q2']];
  const MIX = { 'Q1 FY27': [['Dine-in', 65], ['Delivery & pickup', 27], ['Private dining & events', 8]], 'Q2 FY27': [['Dine-in', 64], ['Delivery & pickup', 29], ['Private dining & events', 7]], 'H1 FY27': [['Dine-in', 64.5], ['Delivery & pickup', 28.1], ['Private dining & events', 7.4]] };
  const KPI = { 'Q1 FY27': { outlets:14, covers:'6.1 L', bill:1320, sssg:11.4 }, 'Q2 FY27': { outlets:16, covers:'7.0 L', bill:1385, sssg:13.8 }, 'H1 FY27': { outlets:16, covers:'13.1 L', bill:1355, sssg:12.7 } };
  const PREV = { 'Q1 FY27': 'Q1 FY26', 'Q2 FY27': 'Q2 FY26', 'H1 FY27': 'H1 FY26' };
  const pct = (a, b) => (a / b - 1) * 100;
  const SER = [['rev', 'Revenue', 'var(--s1)'], ['ebitda', 'EBITDA', 'var(--s2)'], ['pat', 'Net profit (PAT)', 'var(--s3)']];
  let sel = 'Q2 FY27';

  /* ---- tiles ---- */
  const tiles = $('#irTiles');
  function renderTiles() {
    const c = PL[sel], p = PL[PREV[sel]], vs = 'vs ' + PREV[sel];
    const T = [
      ['Revenue from operations', c.rev, 1, '₹', ' Cr', pct(c.rev, p.rev), '%', vs],
      ['EBITDA', c.ebitda, 1, '₹', ' Cr', (c.margin - p.margin) * 100, ' bps margin', `${c.margin.toFixed(1)}% margin · ${vs}`],
      ['Net profit (PAT)', c.pat, 1, '₹', ' Cr', pct(c.pat, p.pat), '%', vs],
      ['Earnings per share', c.eps, 2, '₹', '', pct(c.eps, p.eps), '%', vs]
    ];
    tiles.innerHTML = T.map(t => { const up = t[5] >= 0; return `<div class="ir-tile"><small>${t[0]}</small><b><span class="u">${t[3]}</span><span data-v="${t[1]}" data-d="${t[2]}">0</span><span class="u">${t[4]}</span></b>
      <p class="delta ${up ? 'up' : 'dn'}"><i aria-hidden="true">${up ? '▲' : '▼'}</i>${up ? '+' : '−'}${Math.abs(t[5]).toFixed(t[6] === '%' ? 1 : 0)}${t[6]}<span>${t[7]}</span></p></div>`; }).join('');
    $$('[data-v]', tiles).forEach(el => countTo(el, +el.dataset.v, +el.dataset.d));
    const k = KPI[sel]; $('#irK').innerHTML = [['Restaurants', k.outlets], ['Covers served', k.covers], ['Avg. bill per cover', '₹' + k.bill.toLocaleString('en-IN')], ['Same-store sales growth', k.sssg + '%']].map(x => `<div><small>${x[0]}</small><b>${x[1]}</b></div>`).join('');
  }

  /* ---- SVG helpers ---- */
  const NS = 'http://www.w3.org/2000/svg';
  const el = (n, a = {}, p) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); p && p.appendChild(e); return e; };
  const col = (x, y, w, h, r = 4) => { r = Math.min(r, w / 2, h); return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`; };
  const tip = $('#irTip');
  function bindTip(node, html) {
    node.setAttribute('tabindex', '0'); node.setAttribute('role', 'img'); node.setAttribute('aria-label', html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
    const show = e => { tip.innerHTML = html; tip.classList.add('on'); const r = node.getBoundingClientRect(); const x = e && e.clientX ? e.clientX : r.left + r.width / 2, y = e && e.clientY ? e.clientY : r.top;
      tip.style.transform = `translate(${Math.min(innerWidth - 220, Math.max(8, x + 14))}px,${Math.max(8, y - 64)}px)`; node.classList.add('hot'); };
    const hide = () => { tip.classList.remove('on'); node.classList.remove('hot'); };
    node.addEventListener('pointermove', show); node.addEventListener('pointerleave', hide); node.addEventListener('focus', () => show()); node.addEventListener('blur', hide);
  }
  const niceMax = v => { const s = [20, 25, 40, 50, 100, 150, 200, 250]; for (const n of s) if (n >= v) return n; return Math.ceil(v / 50) * 50; };

  /* ---- chart 1: quarterly revenue / EBITDA / PAT (grouped columns, one ₹ Cr axis) ---- */
  function drawQuarters() {
    const box = $('#chQ'); box.innerHTML = ''; const W = box.clientWidth, H = 320, m = { l: 44, r: 8, t: 26, b: 34 };
    const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, class: 'ch' }, box);
    const max = niceMax(Math.max(...P.map(q => PL[q].rev))), ih = H - m.t - m.b, iw = W - m.l - m.r, y = v => m.t + ih - v / max * ih;
    for (let v = 0; v <= max; v += max / 4) { el('line', { x1: m.l, x2: W - m.r, y1: y(v), y2: y(v), class: v ? 'grid' : 'base' }, svg); el('text', { x: m.l - 8, y: y(v) + 4, class: 'tick', 'text-anchor': 'end' }, svg).textContent = v; }
    const gw = iw / P.length, bw = Math.min(24, (gw * .62 - 4) / 3);
    P.forEach((q, gi) => {
      const x0 = m.l + gi * gw + (gw - (bw * 3 + 4)) / 2, last = gi === P.length - 1;
      el('text', { x: m.l + gi * gw + gw / 2, y: H - 12, class: 'tick' + (q === sel || (sel.startsWith('H1') && q.endsWith('FY27')) ? ' strong' : ''), 'text-anchor': 'middle' }, svg).textContent = q;
      SER.forEach(([k, name, c], si) => {
        const v = PL[q][k], x = x0 + si * (bw + 2), g = el('g', { class: 'hit' }, svg);
        el('rect', { x: x - 3, y: m.t, width: bw + 6, height: ih, fill: 'transparent' }, g);
        el('path', { d: col(x, y(v), bw, y(0) - y(v)), fill: c, class: 'bar', style: `--d:${gi * 90 + si * 40}ms` }, g);
        if (last && (W > 520 || k === 'rev')) el('text', { x: x + bw / 2, y: y(v) - 7, class: 'val', 'text-anchor': 'middle' }, svg).textContent = v.toFixed(1);
        bindTip(g, `<b>${q}</b><span><i style="background:${c}"></i>${name}</span><em>₹${v.toFixed(1)} Cr</em>`);
      });
    });
  }
  /* ---- chart 2: monthly revenue, Apr–Sep (two quarters, one axis) ---- */
  function drawMonths() {
    const box = $('#chM'); box.innerHTML = ''; const W = box.clientWidth, H = 280, m = { l: 36, r: 8, t: 26, b: 52 };
    const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, class: 'ch' }, box);
    const max = 60, ih = H - m.t - m.b, iw = W - m.l - m.r, y = v => m.t + ih - v / max * ih;
    for (let v = 0; v <= max; v += 20) { el('line', { x1: m.l, x2: W - m.r, y1: y(v), y2: y(v), class: v ? 'grid' : 'base' }, svg); el('text', { x: m.l - 8, y: y(v) + 4, class: 'tick', 'text-anchor': 'end' }, svg).textContent = v; }
    const sw = iw / 6, bw = Math.min(24, sw * .5);
    MONTHS.forEach(([mo, v, q], i) => {
      const x = m.l + i * sw + (sw - bw) / 2, c = q === 'Q1' ? 'var(--s2)' : 'var(--s1)', g = el('g', { class: 'hit' }, svg);
      el('rect', { x: m.l + i * sw, y: m.t, width: sw, height: ih, fill: 'transparent' }, g);
      el('path', { d: col(x, y(v), bw, y(0) - y(v)), fill: c, class: 'bar', style: `--d:${i * 70}ms` }, g);
      el('text', { x: x + bw / 2, y: H - m.b + 18, class: 'tick', 'text-anchor': 'middle' }, svg).textContent = mo;
      if (i === 5) el('text', { x: x + bw / 2, y: y(v) - 7, class: 'val', 'text-anchor': 'middle' }, svg).textContent = v.toFixed(1);
      bindTip(g, `<b>${mo} 2026 · ${q} FY27</b><span><i style="background:${c}"></i>Revenue</span><em>₹${v.toFixed(1)} Cr</em>`);
    });
    [[0, W > 520 ? 'Q1 FY27 · ₹148.6 Cr' : 'Q1 · ₹148.6'], [3, W > 520 ? 'Q2 FY27 · ₹171.2 Cr' : 'Q2 · ₹171.2']].forEach(([i, t]) => { const x1 = m.l + i * sw + 6, x2 = m.l + (i + 3) * sw - 6, yy = H - 16;
      el('path', { d: `M${x1},${yy - 6}V${yy}H${x2}V${yy - 6}`, class: 'brk' }, svg); el('text', { x: (x1 + x2) / 2, y: yy + 13, class: 'tick strong', 'text-anchor': 'middle' }, svg).textContent = t; });
  }
  /* ---- chart 3: revenue mix (100% bar, 2px surface gaps, labels only where they fit) ---- */
  function drawMix() {
    const box = $('#chX'); box.innerHTML = ''; const W = box.clientWidth, H = 56, data = MIX[sel] || MIX['Q2 FY27'], cols = ['var(--s1)', 'var(--s2)', 'var(--s3)'];
    const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, class: 'ch' }, box); let x = 0; const gap = 2, usable = W - gap * (data.length - 1);
    data.forEach(([n, v], i) => { const w = usable * v / 100, g = el('g', { class: 'hit' }, svg);
      const r = 4, first = i === 0, lastS = i === data.length - 1;
      el('rect', { x, y: 0, width: w, height: H, rx: (first || lastS) ? r : 0, fill: cols[i], class: 'seg' }, g);
      const label = `${v}%`; const t = el('text', { x: x + 12, y: H / 2 + 5, class: 'in' + (i === 2 ? ' ink' : '') }, svg); t.textContent = label;
      if (t.getComputedTextLength() + 24 > w) t.remove();
      bindTip(g, `<b>${sel} revenue mix</b><span><i style="background:${cols[i]}"></i>${n}</span><em>${v}%</em>`); x += w + gap; });
    $('#mixLegend').innerHTML = data.map(([n, v], i) => `<li><i style="background:${cols[i]}"></i>${n}<b>${v}%</b></li>`).join('');
  }
  /* ---- chart 4: shareholding (single series → one hue, values at the tips, no legend) ---- */
  function drawHolding() {
    const D = [['Promoters & promoter group', 62.4], ['Public & retail', 16.2], ['Foreign institutions (FII)', 11.8], ['Domestic institutions (DII)', 9.6]];
    $('#chS').innerHTML = D.map(([n, v]) => `<div class="hb" data-tip><span>${n}</span><div class="hb-track"><i style="--w:${v}%"></i></div><b>${v.toFixed(1)}%</b></div>`).join('');
  }
  /* ---- results table ---- */
  const ROWS = [['Revenue from operations', 'rev'], ['Other income', 'oi'], ['Total income', 'ti', 1], ['Food & beverage cost', 'fb'], ['Employee benefits', 'emp'], ['Other expenses', 'oth'],
    ['EBITDA', 'ebitda', 1], ['EBITDA margin', 'margin', 2], ['Depreciation & amortisation', 'dep'], ['Finance costs', 'fin'], ['Profit before tax', 'pbt', 1], ['Tax expense', 'tax'], ['Net profit (PAT)', 'pat', 1], ['PAT margin', 'patm', 2], ['EPS (₹, basic)', 'eps', 3]];
  const COLS = ['Q2 FY27', 'Q1 FY27', 'Q2 FY26', 'QoQ', 'YoY', 'H1 FY27', 'H1 FY26'];
  function renderTable() {
    const f = (k, v) => k === 'margin' || k === 'patm' ? v.toFixed(1) + '%' : k === 'eps' ? v.toFixed(2) : v.toFixed(1);
    const ch = (a, b, k) => { if (k === 'margin' || k === 'patm') { const d = (a - b) * 100; return `<span class="${d >= 0 ? 'up' : 'dn'}">${d >= 0 ? '+' : '−'}${Math.abs(d).toFixed(0)} bps</span>`; } const d = pct(a, b); return `<span class="${d >= 0 ? 'up' : 'dn'}">${d >= 0 ? '+' : '−'}${Math.abs(d).toFixed(1)}%</span>`; };
    const hi = c => (c === sel) || (sel === 'Q2 FY27' && (c === 'QoQ' || c === 'YoY'));
    $('#irTable').innerHTML = `<thead><tr><th scope="col">₹ crore</th>${COLS.map(c => `<th scope="col" class="${hi(c) ? 'sel' : ''}">${c}</th>`).join('')}</tr></thead><tbody>${ROWS.map(([n, k, b]) => {
      const q2 = PL['Q2 FY27'][k], q1 = PL['Q1 FY27'][k], p2 = PL['Q2 FY26'][k];
      const cells = [f(k, q2), f(k, q1), f(k, p2), ch(q2, q1, k), ch(q2, p2, k), f(k, PL['H1 FY27'][k]), f(k, PL['H1 FY26'][k])];
      return `<tr class="${b === 1 ? 'b' : b === 2 ? 'm' : b === 3 ? 'b' : ''}"><th scope="row">${n}</th>${cells.map((c, i) => `<td class="${hi(COLS[i]) ? 'sel' : ''}">${c}</td>`).join('')}</tr>`; }).join('')}</tbody>`;
  }
  function drawAll() { drawQuarters(); drawMonths(); drawMix(); }
  $('#irPeriod').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; sel = b.dataset.p;
    $$('#irPeriod button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); }); renderTiles(); renderTable(); drawAll(); });
  renderTiles(); renderTable(); drawHolding(); drawAll();
  // animate bars once the charts scroll into view
  const cio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); cio.unobserve(e.target); } }), { threshold: .25 });
  $$('.ir-chart, #chS').forEach(c => cio.observe(c));
  return { draw: drawAll };
})();

/* =====================================================================
   MEDIA — filterable masonry gallery + lightbox (images and films)
   ===================================================================== */
if ($('#media')) (() => {
  const B = 'assets/media/';
  const ITEMS = [
    ['plate1', 'food', 'The Royal Thali — twelve preparations in brass', 'India'], ['plate7', 'food', 'The sweet return — one dessert from every stop', 'Desserts'],
    ['glasshouse', 'spaces', 'The Glasshouse at blue hour', 'Bodakdev, Ahmedabad'], ['plate2', 'food', 'La Tavola — tagliatelle, burrata, truffle risotto', 'Italy'],
    ['film:s2', 'film', 'Wok hei — vegetables and noodles over a roaring flame', 'Live loop · wok'], ['kitchen-t3', 'kitchen', 'Naan pressed onto the tandoor wall', 'Tandoor · 480°C'],
    ['plate3', 'food', 'La Milpa — chipotle jackfruit tacos and guacamole', 'Mexico'], ['still3', 'food', 'Paneer tikka over glowing charcoal', 'Grill station'],
    ['table', 'spaces', 'Table 07, set for two', 'The dining room'], ['kitchen-t4', 'kitchen', 'A burst of flame at the wok station', 'Wok · 650°C'],
    ['plate4', 'food', 'Shōjin omakase — maki, tempura, tofu ramen', 'Japan'], ['film:s1', 'film', 'Dosa on the 36-inch tawa', 'Live loop · tawa'],
    ['still5', 'food', 'Saffron syrup over gulab jamun', 'Mithai station'], ['kitchen-t2', 'kitchen', 'The open kitchen, seen from the aisle', 'No doors, no walls'],
    ['plate5', 'food', 'The mezze table — hummus, falafel, halloumi', 'Lebanon'], ['chef', 'kitchen', 'Basil on hand-rolled tagliatelle', 'Pasta station'],
    ['film:s5', 'film', 'Saffron syrup, poured at the pass', 'Live loop · mithai'], ['plate6', 'food', 'Jay kitchen — green curry, pad thai, som tam', 'Thailand'],
    ['private', 'spaces', 'The Fern Room — a long table under the rain', 'Private dining · 12 seats'], ['still2', 'food', 'Pad thai, no egg, mid-toss', 'Wok station'],
    ['kitchen-t5', 'kitchen', 'Dosa station with a folded masala dosa', 'Tawa · 220°C'], ['still1', 'food', 'Masala dosa batter spread in one spiral', 'Tawa station'],
    ['film:s3', 'film', 'Paneer tikka basted over charcoal', 'Live loop · grill'], ['still4', 'food', 'Eggless tagliatelle, cut to order', 'Pasta station'],
    ['garden', 'food', 'Heirloom produce from 84 partner farms', 'The garden'], ['kitchen-t6', 'kitchen', 'Service! The finished thali at the pass', 'The pass'],
    ['still6', 'food', 'Olive oil into hummus Beiruti', 'Mezze station'], ['film:s6', 'film', 'Hummus, finished with olive oil', 'Live loop · mezze'], ['film:s4', 'film', 'Tagliatelle, cut by hand', 'Live loop · pasta']
  ];
  const grid = $('#mdGrid');
  grid.innerHTML = ITEMS.map(([id, cat, cap, sub], i) => { const film = id.startsWith('film:'), f = id.slice(5);
    return `<figure class="md-item${film ? ' film' : ''}" data-cat="${cat}" data-i="${i}" tabindex="0" role="button" aria-label="Open ${cap}">
      ${film ? `<video muted playsinline loop preload="none" poster="assets/live/${f}.webp" data-src="assets/live/${f}.mp4"></video><span class="md-play">▶ Film</span>`
             : `<img src="${B}${id}-s.webp" alt="${cap}" loading="lazy" decoding="async">`}
      <figcaption><b>${cap}</b><span>${sub}</span></figcaption></figure>`; }).join('');
  const figs = $$('.md-item', grid);
  if (fine) figs.filter(f => f.classList.contains('film')).forEach(f => { const v = $('video', f);
    f.addEventListener('mouseenter', () => { if (!v.src) v.src = v.dataset.src; v.play().catch(() => {}); }); f.addEventListener('mouseleave', () => v.pause()); });
  const counts = {}; ITEMS.forEach(it => counts[it[1]] = (counts[it[1]] || 0) + 1);
  $$('#mdFilter button').forEach(b => { const c = b.dataset.f; const s = document.createElement('sup'); s.textContent = c === 'all' ? ITEMS.length : counts[c] || 0; b.appendChild(s); });
  let filt = 'all';
  $('#mdFilter').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; filt = b.dataset.f;
    $$('#mdFilter button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
    figs.forEach(f => { const show = filt === 'all' || f.dataset.cat === filt; f.classList.toggle('hide', !show); }); });
  /* lightbox */
  const lb = $('#lb'), lbMedia = $('#lbMedia'), lbCap = $('#lbCap'), lbNo = $('#lbNo'), lbDl = $('#lbDl'); let at = -1;
  const visible = () => figs.filter(f => !f.classList.contains('hide')).map(f => +f.dataset.i);
  function open(i) { at = i; const [id, , cap, sub] = ITEMS[i], film = id.startsWith('film:'), f = id.slice(5);
    lbMedia.innerHTML = film ? `<video src="assets/live/${f}.mp4" poster="assets/live/${f}.webp" autoplay muted loop playsinline controls></video>` : `<img src="${B}${id}.webp" alt="${cap}">`;
    lbCap.innerHTML = `<b>${cap}</b><span>${sub}</span>`; const v = visible(); lbNo.textContent = `${pad(v.indexOf(i) + 1)} / ${pad(v.length)}`;
    lbDl.href = film ? `assets/live/${f}.mp4` : `${B}${id}.webp`; lbDl.setAttribute('download', film ? `sattva-${f}.mp4` : `sattva-${id}.webp`);
    lb.classList.add('on'); lb.setAttribute('aria-hidden', 'false'); if (lenis) lenis.stop(); $('#lbClose').focus(); }
  function close() { lb.classList.remove('on'); lb.setAttribute('aria-hidden', 'true'); lbMedia.innerHTML = ''; if (lenis) lenis.start(); const f = figs[at]; f && f.focus(); }
  function step(d) { const v = visible(); const k = (v.indexOf(at) + d + v.length) % v.length; open(v[k]); }
  figs.forEach(f => { f.addEventListener('click', () => open(+f.dataset.i)); f.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(+f.dataset.i); } }); });
  $('#lbClose').addEventListener('click', close); $('#lbPrev').addEventListener('click', () => step(-1)); $('#lbNext').addEventListener('click', () => step(1));
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  addEventListener('keydown', e => { if (!lb.classList.contains('on')) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); });
  let sx = 0; lb.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true }); lb.addEventListener('touchend', e => { const d = e.changedTouches[0].clientX - sx; if (Math.abs(d) > 50) step(d < 0 ? 1 : -1); });
  /* reel */
  const reel = $('#reel'), rv = $('video', reel), rb = $('#reelPlay');
  rb.addEventListener('click', () => { if (rv.paused) { rv.muted = false; rv.play(); reel.classList.add('playing'); } else { rv.pause(); reel.classList.remove('playing'); } });
  rv.addEventListener('ended', () => reel.classList.remove('playing'));
  new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting && !rv.paused) { rv.pause(); reel.classList.remove('playing'); } }), { threshold: .2 }).observe(reel);
})();
})();
