/* SATTVA — Open Kitchen. Scroll-film engine, camera HUD, live stations, menu, KOT booking. No build step.
   Content: TOUR (kitchen tour stops), STATIONS (live loops), STOPS (one plate), MENU. All vegetarian & eggless. */
(() => {
'use strict';

/* ================= CONTENT ================= */
const TOUR = [
  { cam:'CAM 01', where:'The approach',    t:'The Glasshouse', d:'A Victorian-style glasshouse in Bodakdev, lit by four hundred lanterns. Doors open at seven.', k1:'Seats', v1:'84', k2:'Lanterns', v2:'400', who:'Doors 19:00', mm:[100,128] },
  { cam:'CAM 02', where:'Dining room',     t:'Table 07',       d:'Brass thali, linen, one candle — and a clear line of sight to the fire.', k1:'Covers', v1:'02', k2:'To the kitchen', v2:'18 m', who:'Ishaan, your host', mm:[100,92] },
  { cam:'CAM 03', where:'The open kitchen',t:'Nothing hidden', d:'No doors, no walls. Seven stations cook in full view of every table.', k1:'Chefs on', v1:'21', k2:'Burners', v2:'34', who:'Chef Meera Raval', mm:[100,50] },
  { cam:'CAM 04', where:'Station 01',      t:'Tandoor',        d:'A clay oven fired with charcoal. Naan is slapped onto the wall and is ready in ninety seconds.', k1:'Clay wall', v1:480, u1:'°C', k2:'Naan / hour', v2:'140', who:'Arjun Bhatt · 14 yrs', mm:[58,30] },
  { cam:'CAM 05', where:'Station 02',      t:'Wok hei',        d:'A roaring burner and a carbon-steel wok: pad thai without egg, chilli tofu, hakka noodles.', k1:'Flame', v1:650, u1:'°C', k2:'Toss / min', v2:'38', who:'Somchai Pradit · 9 yrs', mm:[100,24] },
  { cam:'CAM 06', where:'Station 03',      t:'Dosa',           d:'Rice-and-lentil batter fermented for fourteen hours, spread in one spiral on a 36-inch tawa.', k1:'Tawa', v1:220, u1:'°C', k2:'Ferment', v2:'14 h', who:'Lakshmi Rao · 22 yrs', mm:[140,30] },
  { cam:'CAM 07', where:'The pass',        t:'Service!',       d:'Every plate is checked here before it walks to your table — and every one of them is vegetarian.', k1:'Tickets live', v1:'live', k2:'Avg. ticket', v2:'11 min', who:'Chef Meera Raval', mm:[152,46] }
];
const STATIONS = [
  { n:'01', name:'Tawa',    now:'Masala dosa',          temp:'220°C', chef:'Lakshmi R.' },
  { n:'02', name:'Wok',     now:'Pad thai, no egg',     temp:'650°C', chef:'Somchai P.' },
  { n:'03', name:'Grill',   now:'Paneer tikka',    temp:'390°C', chef:'Arjun B.' },
  { n:'04', name:'Pasta',   now:'Tagliatelle, eggless', temp:'98°C',  chef:'Giulia M.' },
  { n:'05', name:'Mithai',  now:'Saffron gulab jamun',  temp:'72°C',  chef:'Farah K.' },
  { n:'06', name:'Mezze',   now:'Hummus Beiruti',       temp:'Cold',  chef:'Rami H.' }
];
const STOPS = [
  { c:'Departure', w:'DEPART', t:'The empty thali', lat:23.03, lon:72.58, tz:'Asia/Kolkata', d:'A brass thali, hammered by hand in Moradabad. Every journey at Sattva begins here.', dishes:[['Seven cuisines','07'],['One plate','01'],['Meat, fish, eggs','00']] },
  { c:'India', w:'INDIA', t:'The Royal Thali', lat:28.61, lon:77.21, tz:'Asia/Kolkata', d:'Paneer in smoked tomato butter, dal simmered for eighteen hours, saffron rice, naan from the tandoor.', dishes:[['Paneer makhani','₹645'],['Dal makhani, 18-hour','₹525'],['Saffron jeera rice','₹325'],['Garlic butter naan','₹145']] },
  { c:'Italy', w:'ITALIA', t:'La Tavola', lat:41.90, lon:12.50, tz:'Europe/Rome', d:'Eggless tagliatelle rolled every morning, burrata split at the table, porcini risotto with truffle.', dishes:[['Tagliatelle al pomodoro','₹745'],['Burrata, heirloom tomato','₹845'],['Truffle mushroom risotto','₹895'],['Rosemary focaccia','₹395']] },
  { c:'Mexico', w:'MÉXICO', t:'La Milpa', lat:17.07, lon:-96.72, tz:'America/Mexico_City', d:'Corn, beans and chilli — the ancient milpa. Chipotle jackfruit tacos, guacamole crushed in stone.', dishes:[['Chipotle jackfruit tacos','₹695'],['Molcajete guacamole','₹545'],['Elote callejero','₹395'],['Frijoles negros','₹325']] },
  { c:'Japan', w:'NIHON', t:'Shōjin Omakase', lat:35.01, lon:135.77, tz:'Asia/Tokyo', d:'The plant cuisine of Kyoto’s temples: kombu-shiitake dashi, tempura and maki — never fish, never egg.', dishes:[['Avocado & cucumber maki','₹645'],['Vegetable tempura','₹695'],['Tofu shoyu ramen','₹795'],['Edamame, sea salt','₹345']] },
  { c:'Lebanon', w:'LUBNAN', t:'The Mezze Table', lat:33.89, lon:35.50, tz:'Asia/Beirut', d:'Silky hummus Beiruti, falafel from the fryer, smoky baba ganoush, grilled halloumi, warm pita.', dishes:[['Hummus Beiruti','₹445'],['Falafel, tahini','₹495'],['Baba ganoush','₹445'],['Grilled halloumi','₹645']] },
  { c:'Thailand', w:'THAI', t:'Jay Kitchen', lat:13.76, lon:100.50, tz:'Asia/Bangkok', d:'Green curry with tofu, pad thai without egg, fiery som tam — no fish sauce, ever.', dishes:[['Green curry, tofu','₹745'],['Pad thai, no egg','₹695'],['Som tam','₹495'],['Crystal spring rolls','₹445']] },
  { c:'Home', w:'HOME', t:'The Sweet Return', lat:23.03, lon:72.58, tz:'Asia/Kolkata', d:'Dessert from every stop: saffron kulfi, eggless tiramisu, mango sticky rice, churros, gulab jamun.', dishes:[['Kesar pista kulfi','₹395'],['Eggless tiramisu','₹545'],['Mango sticky rice','₹495'],['Churros & chocolate','₹445']] }
];
/* item: [name, description, price ₹, tags (vegan · jain = no onion/garlic/root veg · gf), heat 0–5] */
const MENU = [
  { id:'in', tab:'India', img:'plate-1', items:[
    ['Sattva Royal Thali','Twelve preparations that change daily — paneer, two dals, sabzi, raita, saffron rice, naan, gulab jamun.',1450,[],2],
    ['Masala Dosa','Fourteen-hour batter, potato masala, coconut chutney and sambar. From the tawa station.',395,['vegan','gf'],2],
    ['Paneer Makhani','Malai paneer in a smoked tomato and cashew butter gravy, kasuri methi.',645,['gf'],1],
    ['Dal Makhani, 18-hour','Black urad slow-cooked overnight over coal, finished with white butter.',525,['gf'],1],
    ['Jain Paneer Tikka','Hung-curd marinade, charcoal grill. No onion, no garlic, no root vegetables.',595,['jain','gf'],2],
    ['Garlic Butter Naan','Straight off the tandoor wall, garlic butter and coriander.',145,[],0]
  ]},
  { id:'it', tab:'Italy', img:'plate-2', items:[
    ['Tagliatelle al Pomodoro','Eggless semolina pasta cut at the pasta station, San Marzano tomato, torn basil.',745,['vegan'],0],
    ['Burrata, Heirloom Tomato','Burrata split at the table, roasted vine tomatoes, olive oil, cracked pepper.',845,['gf'],0],
    ['Truffle Mushroom Risotto','Carnaroli, porcini, rennet-free vegetarian hard cheese, black truffle.',895,['gf'],0],
    ['Rosemary Focaccia','A 48-hour dough baked in olive oil with rosemary and flaky salt.',395,['vegan'],0],
    ['Jain Pizza Bianca','Ricotta, courgette, capsicum and basil. No onion or garlic.',695,['jain'],0]
  ]},
  { id:'mx', tab:'Mexico', img:'plate-3', items:[
    ['Chipotle Jackfruit Tacos','Slow-braised young jackfruit, pickled onion, avocado, hand-pressed corn tortillas.',695,['vegan','gf'],3],
    ['Molcajete Guacamole','Hass avocado crushed in stone with lime and serrano, warm totopos.',545,['vegan','gf'],1],
    ['Elote Callejero','Charred corn, chilli-lime, aged cheese crumble.',395,['gf'],2],
    ['Black Bean Enchiladas','Sweet potato and black beans, salsa roja, cashew crema.',745,['vegan'],2],
    ['Jain Quesadilla','Corn, capsicum and three cheeses. No onion, no garlic.',595,['jain'],1]
  ]},
  { id:'jp', tab:'Japan', img:'plate-4', items:[
    ['Shōjin Omakase','Nine courses of Buddhist temple cuisine. Kombu-shiitake dashi, never bonito.',2400,['vegan'],0],
    ['Avocado & Cucumber Maki','Seasoned rice, nori, avocado, cucumber, tamari.',645,['vegan','gf'],0],
    ['Vegetable Tempura','Asparagus, sweet potato and shiso in an eggless rice-flour batter.',695,['vegan','gf'],0],
    ['Tofu Shoyu Ramen','Kombu-shiitake broth, tofu, bok choy, corn and mushrooms. No egg.',795,['vegan'],1],
    ['Edamame, Sea Salt','Steamed and tossed with flaky salt.',345,['vegan','jain','gf'],0]
  ]},
  { id:'lb', tab:'Lebanon', img:'plate-5', items:[
    ['The Grand Mezze, for two','Hummus, falafel, baba ganoush, tabbouleh, vine leaves, halloumi, olives and pita.',1250,[],1],
    ['Hummus Beiruti','Silky chickpea and tahini, olive oil, paprika, whole chickpeas.',445,['vegan','gf'],0],
    ['Falafel, Tahini','Herb-green chickpea falafel, tahini, pickled turnip.',495,['vegan','gf'],1],
    ['Baba Ganoush','Fire-charred aubergine, tahini, pomegranate.',445,['vegan','gf'],0],
    ['Grilled Halloumi','Za’atar, wildflower honey, mint.',645,['gf'],0]
  ]},
  { id:'th', tab:'Thailand', img:'plate-6', items:[
    ['Green Curry, Tofu','Thai aubergine, bamboo shoots, holy basil, jasmine rice. No fish sauce or shrimp paste.',745,['vegan','gf'],3],
    ['Pad Thai, No Egg','Rice noodles from the wok station, tamarind, tofu, peanuts, lime.',695,['vegan','gf'],2],
    ['Som Tam','Green papaya, lime, palm sugar and bird’s-eye chilli. No fish sauce.',495,['vegan','gf'],4],
    ['Crystal Spring Rolls','Glass noodles and vegetables, sweet chilli dip.',445,['vegan'],1],
    ['Jain Pineapple Fried Rice','Jasmine rice, pineapple, cashews, capsicum. No onion or garlic.',595,['vegan','jain','gf'],1]
  ]},
  { id:'ds', tab:'Sweets', img:'plate-7', items:[
    ['Saffron Gulab Jamun','Khoya dumplings, warm saffron syrup poured at the mithai station.',345,['jain'],0],
    ['Kesar Pista Kulfi','Slow-reduced milk, Kashmiri saffron, pistachio.',395,['jain','gf'],0],
    ['Eggless Tiramisu','Mascarpone, espresso-soaked eggless savoiardi, cocoa.',545,[],0],
    ['Mango Sticky Rice','Alphonso mango, coconut cream, toasted sesame.',495,['vegan','gf'],0],
    ['Churros & Chocolate','Eggless churros, cinnamon sugar, 70% chocolate.',445,['vegan'],0]
  ]}
];
const LAND = '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ff9ffffe0000000000000000000000000133fcfffff000700000000c000000000000129900fffff00000000e001f8000000000003c034003fff00000006007ff80080008040007c6fe01ffe000000061dfffff7f80007ffffd43b381ff80001fe05ebfffffffffff3fffffffc3e1fc04007fd3fffffffffffff00fffffff51c1f00800f7ffffffffffffffe03ffffffc0600e00003e7ffffffffffffef801e07fffe07e0000003e7fffffffffff808000801ffff87e00000214fffffffffffe038000000ffffeff80000d1fffffffffffff0300000007ffffffc00003ffffffffffffff0000000003fffff4e00003ffffffffffffff0000000003fffffc000001fff5f7fffffffe0000000003fffff0000001ebe0effffffffc4000000003ffffe000000f86f6f3fffffff08000000001ffffc000000f029ff3fffffe208000000001ffffc0000000f007ffffffff1300000000007fff80000007f003ffffffff0400000000005ffe0000000ffeebffffffff8000000000003fc10000000fffffefffffff8000000000000f810000003ffffdf3ffffff00000000000007800000003ffffdfe1ffffe80000000000003880000007ffffeff0fe7e000000000000003d81800003ffffefe07c3d000000000000000780000007fffff780781e0800000000000000e0000007fffffe00301f0c0000000000000002800003fffff9003016000000000000000017f00001ffffff000010020000000000000007f80000fbffff000808000000000000000007ff000000fffe00001860000000000000000fff000000fffc00000ce0000000000000000fffc00000fff800000ce8c00000000000000ffff80000fff0000004083c0000000000000ffffc00007ff0000002001e0000000000000ffffc00007ff00000001a0800000000000007fff800007ff0000000000000000000000007fff000007ff100000000c000000000000001fff000007ff300000007e400000000000000fff000007fc300000007fe00000000000000fff000007fc60000003fff00000000000000ffc000003fc60000007fff00000000000000ff8000003f800000007fff80000000000001ff0000001f800000003fff80000000000001ff0000001f000000003fff80000000000001fe0000001c000000003c3f80000000000001f80000000000000000000f00000000000001f00000000000000000000200200000000003c00000000000000000000200400000000001c000000000000000000000008000000000038000000000000000000000010000000000038000000000000000000000000000000000030800000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';

/* ================= HELPERS ================= */
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const clamp = (v, a=0, b=1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const range = (p, a, b) => clamp((p - a) / (b - a));
const ease = t => 1 - Math.pow(1 - t, 3);
const eio = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;
const inr = n => '₹' + Math.round(n).toLocaleString('en-IN');
const pad = (n, l=2) => String(n).padStart(l, '0');
const isMobile = () => innerWidth < 860;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
const conn = navigator.connection || {};
const saveData = !!conn.saveData || /2g/.test(conn.effectiveType || '');
const RAD = Math.PI / 180;
const toVec = (lat, lon) => [Math.cos(lat*RAD)*Math.cos(lon*RAD), Math.cos(lat*RAD)*Math.sin(lon*RAD), Math.sin(lat*RAD)];
const toLL = v => [Math.asin(clamp(v[2], -1, 1)) / RAD, Math.atan2(v[1], v[0]) / RAD];
function slerp(a, b, t) { const A = toVec(a[0], a[1]), B = toVec(b[0], b[1]); const w = Math.acos(clamp(A[0]*B[0]+A[1]*B[1]+A[2]*B[2], -1, 1));
  if (w < 1e-6) return a.slice(); const s1 = Math.sin((1-t)*w)/Math.sin(w), s2 = Math.sin(t*w)/Math.sin(w); return toLL([A[0]*s1+B[0]*s2, A[1]*s1+B[1]*s2, A[2]*s1+B[2]*s2]); }
const km = (a, b) => { const A = toVec(a[0], a[1]), B = toVec(b[0], b[1]); return 6371 * Math.acos(clamp(A[0]*B[0]+A[1]*B[1]+A[2]*B[2], -1, 1)); };
/* piecewise hold/transition timeline: n stops, weights per hold, returns pos 0..n-1 */
function timeline(n, holdW) { const K = []; let acc = 0; const segs = [];
  for (let i = 0; i < n; i++) { segs.push(['h', i, holdW(i)]); if (i < n - 1) segs.push(['t', i, 1]); }
  const sum = segs.reduce((a, s) => a + s[2], 0);
  segs.forEach(s => { K.push({ type: s[0], i: s[1], a: acc / sum, b: (acc + s[2]) / sum }); acc += s[2]; });
  return { pos: p => { for (const k of K) if (p <= k.b) return k.type === 'h' ? k.i : k.i + range(p, k.a, k.b); return n - 1; },
           hold: i => { const k = K.find(k => k.type === 'h' && k.i === i); return (k.a + k.b) / 2; } };
}

/* ================= SMOOTH SCROLL ================= */
let lenis = null;
if (!reduce && window.Lenis) { lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.95 }); const r = t => { lenis.raf(t); requestAnimationFrame(r); }; requestAnimationFrame(r); }
const scrollToY = y => lenis ? lenis.scrollTo(y, { duration: 2 }) : scrollTo({ top: y, behavior: 'smooth' });
$$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const id = a.getAttribute('href'); if (id.length < 2) return; const el = $(id); if (!el) return; e.preventDefault(); toggleMenu(false);
  if (a.id === 'startTour') return scrollToY(tourFilm.top + tourFilm.total * (ZP + (1 - ZP) * tourTL.hold(1)));
  lenis ? lenis.scrollTo(el, { duration: 2 }) : el.scrollIntoView({ behavior: 'smooth' });
}));

/* ================= IMAGE-SEQUENCE FILM =================
   WebP stills on <canvas>: no video seeking, so scrubbing is smooth both ways. Coarse-to-fine
   loading (every 16th → 8th → 4th → 2nd → 1st frame), lazy until ~1.5 screens away, frames
   around the playhead pre-decoded, DPR capped at 1.5, data-saver loads half. */
class SeqFilm {
  /* WebP stills on <canvas>. Three things keep scrubbing smooth:
     1. loading follows the playhead (frames you're about to see load first, then a coarse-to-fine sweep);
     2. frames near the playhead are decoded off the main thread into ImageBitmaps ahead of time,
        so drawImage never stalls on a JPEG/WebP decode mid-scroll (the cause of the "stuck, then jump" feel);
     3. the playhead cross-fades neighbouring frames, so 12 fps footage moves continuously. */
  constructor(sec, hooks = {}) {
    this.sec = sec; this.hooks = hooks;
    this.cv = $('canvas[data-seq]', sec); this.ctx = this.cv.getContext('2d', { alpha: false });
    this.count = +this.cv.dataset.count; this.mobile = isMobile();
    this.base = this.cv.dataset.seq + (this.mobile ? 'm/' : 'd/');
    sec.style.height = `calc(${+sec.dataset.vh || 300}vh + 100vh)`;
    const n = this.count;
    this.imgs = new Array(n); this.ok = new Uint8Array(n); this.req = new Uint8Array(n);
    this.bmp = new Array(n); this.pend = new Uint8Array(n); this.nPend = 0; this.blobs = new Array(n); this.dec = new Uint8Array(n);
    // over http(s): fetch → Blob → createImageBitmap decodes OFF the main thread. From file:// fall back to <img> + decode().
    this.useBmp = /^https?:/.test(location.protocol) && typeof createImageBitmap === 'function' && typeof fetch === 'function' && !/nobmp/.test(location.search);
    this.cur = 0; this.dir = 1; this.drawn = -1; this.drawnKey = ''; this.p = 0; this.loaded = 0; this.inflight = 0; this.started = false; this.top = 0; this.h = 1; this.total = 1;
    const order = [], seen = new Set();
    [16, 8, 4, 2, 1].forEach(s => { for (let i = 0; i < n; i += s) if (!seen.has(i)) { seen.add(i); order.push(i); } });
    if (!seen.has(n - 1)) order.splice(1, 0, n - 1);
    if (saveData) order.length = Math.ceil(n / 2);
    this.order = order; this.q = 0; this.firstPass = Math.ceil(n / 16) + 1;
    this.ready = new Promise(r => this._res = r);
    this.measure(); this.resize();
    addEventListener('resize', () => this.resize());
    if (this.cv.hasAttribute('data-eager')) this.start();
    else new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { this.start(); o.disconnect(); } }), { rootMargin: '150% 0px' }).observe(sec);
  }
  measure() { this.top = this.sec.getBoundingClientRect().top + scrollY; this.h = this.sec.offsetHeight; this.total = Math.max(1, this.h - innerHeight); }
  start() { if (this.started) return; this.started = true; this.pump(); }
  pump() { while (this.inflight < 8) { const i = this.pick(); if (i < 0) return; this.load(i); } }
  pick() {
    const c = Math.round(this.cur), d = this.dir;
    for (let o = 0; o < 40; o++) for (const i of [c + o * d, c - Math.ceil(o / 3) * d]) if (i >= 0 && i < this.count && !this.req[i] && (!saveData || i % 2 === 0)) return i;
    while (this.q < this.order.length) { const i = this.order[this.q++]; if (!this.req[i]) return i; }
    return -1;
  }
  load(i) {
    this.req[i] = 1; this.inflight++;
    const url = this.base + pad(i + 1, 3) + '.webp';
    const done = okk => { this.inflight--; if (okk) { this.ok[i] = 1; if (Math.abs(i - this.cur) < 30) this.drawnKey = ''; } this.loaded++; if (this.loaded >= this.firstPass) this._res(); this.pump(); };
    if (this.useBmp) { fetch(url).then(r => r.ok ? r.blob() : Promise.reject()).then(b => { this.blobs[i] = b; done(true); }).catch(() => done(false)); return; }
    const im = new Image(); im.decoding = 'async'; im.onload = () => done(true); im.onerror = () => done(false); im.src = url; this.imgs[i] = im;
  }
  resize() { const d = Math.min(devicePixelRatio || 1, 1.5), cw = this.cv.clientWidth, ch = this.cv.clientHeight;
    const cap = Math.sqrt((this.mobile ? 1.0e6 : 1.6e6) * (LOWRES ? .5 : 1) / Math.max(1, cw * ch));
    const k = Math.min(d, cap); this.cv.width = Math.round(cw * k); this.cv.height = Math.round(ch * k); this.drawnKey = ''; }
  /* keep a sliding window of decoded bitmaps around the playhead; close the rest to free memory */
  warm() {
    if (!this.useBmp) { const c = Math.round(this.cur); for (let o = -6; o <= 14; o++) { const i = c + o * this.dir; if (i < 0 || i >= this.count || !this.ok[i] || this.dec[i]) continue; this.dec[i] = 1; this.imgs[i].decode && this.imgs[i].decode().catch(() => {}); } return; }
    const c = Math.round(this.cur), d = this.dir, ahead = 22, behind = 6;
    const lo = d > 0 ? c - behind : c - ahead, hi = d > 0 ? c + ahead : c + behind;
    for (let o = 0; o <= ahead && this.nPend < 3; o++) for (const i of [c + o * d, c - o * d]) {
      if (i < lo || i > hi || i < 0 || i >= this.count || !this.ok[i] || this.bmp[i] || this.pend[i] || this.nPend >= 3) continue;
      this.pend[i] = 1; this.nPend++;
      createImageBitmap(this.blobs[i]).then(b => { this.pend[i] = 0; this.nPend--; const cc = Math.round(this.cur);
        if (Math.abs(i - cc) > ahead + 10) { b.close && b.close(); return; } this.bmp[i] = b; if (Math.abs(i - cc) < 3) this.drawnKey = ''; })
        .catch(() => { this.pend[i] = 0; this.nPend--; });
    }
    for (let i = Math.max(0, lo - 40); i < Math.min(this.count, hi + 40); i++) if (this.bmp[i] && (i < lo - 10 || i > hi + 10)) { this.bmp[i].close && this.bmp[i].close(); this.bmp[i] = null; }
  }
  /* best drawable for frame f: a ready bitmap, else the nearest ready bitmap, else the raw image */
  src(f) {
    if (f < 0 || f >= this.count) return null;
    if (this.bmp[f]) return [f, this.bmp[f]];
    if (this.useBmp) for (let o = 1; o < 10; o++) { const a = f - o * this.dir, b = f + o * this.dir; if (a >= 0 && a < this.count && this.bmp[a]) return [a, this.bmp[a]]; if (b >= 0 && b < this.count && this.bmp[b]) return [b, this.bmp[b]]; }
    if (this.useBmp) { for (let o = 10; o < 60; o++) { const a = f - o, b = f + o; if (a >= 0 && this.bmp[a]) return [a, this.bmp[a]]; if (b < this.count && this.bmp[b]) return [b, this.bmp[b]]; } return null; }
    for (let o = 0; o < this.count; o++) { if (f - o >= 0 && this.ok[f - o]) return [f - o, this.imgs[f - o]]; if (f + o < this.count && this.ok[f + o]) return [f + o, this.imgs[f + o]]; }
    return null;
  }
  draw(cur) {
    const f0 = Math.floor(cur), fr = cur - f0, A = this.src(f0); if (!A) return;
    const B = (!NOBLEND && A[0] === f0 && fr > .04 && fr < .96 && this.bmp[f0 + 1]) ? [f0 + 1, this.bmp[f0 + 1]] : null;
    const al = B ? Math.round(fr * 16) / 16 : 0;
    const key = A[0] + ':' + (B ? B[0] : -1) + ':' + al + ':' + (this.useBmp ? 'b' : 'i') + (this.hooks.zoom ? this.hooks.zoom().toFixed(4) : '');
    if (key === this.drawnKey) return; this.drawnKey = key;
    const c = this.ctx, cw = this.cv.width, ch = this.cv.height, im = A[1], iw = im.naturalWidth || im.width, ih = im.naturalHeight || im.height;
    let L = this.hooks.layout && this.hooks.layout(cw, ch, iw, ih, this.mobile);
    if (!L) { const s = Math.max(cw / iw, ch / ih) * (this.hooks.zoom ? this.hooks.zoom() : 1); L = { w: iw * s, h: ih * s }; L.x = (cw - L.w) / 2; L.y = (ch - L.h) / 2; }
    if (L.fill) { c.fillStyle = L.fill; c.fillRect(0, 0, cw, ch); }
    c.globalAlpha = 1; c.drawImage(im, L.x, L.y, L.w, L.h);
    if (B && al > 0) { c.globalAlpha = al; c.drawImage(B[1], L.x, L.y, L.w, L.h); c.globalAlpha = 1; }
    this.drawn = A[0];
  }
  tick(sy) {
    const r0 = this.top - sy; if (!(r0 + this.h > -100 && r0 < innerHeight + 100)) return false;
    this.p = clamp(-r0 / this.total);
    const target = this.hooks.map ? this.hooks.map(this.p) : this.p * (this.count - 1);
    if (Math.abs(target - this.cur) > .3) this.dir = target > this.cur ? 1 : -1;
    // Lenis already eases the scroll, so the playhead follows it closely instead of easing twice
    this.cur = Math.abs(target - this.cur) < 0.01 ? target : lerp(this.cur, target, lenis ? .4 : .22);
    this.warm(); if (this.started && this.inflight < 8) this.pump();
    this.draw(this.cur);
    this.hooks.onProgress && this.hooks.onProgress(this.p, this.cur);
    return true;
  }
}
const films = []; let NOBLEND = /noblend/.test(location.search), LOWRES = false;
/* adaptive quality: if this device can't hold ~60 fps while a film is playing, drop the
   frame cross-fade first, then the canvas resolution — smoothness beats pixels */
const PG = { t: 0, n: 0, slow: 0 };
function perfGuard(now, active) {
  if (!active) { PG.t = now; return; } const dt = now - PG.t; PG.t = now; if (dt > 200) return;
  PG.n++; if (dt > 24) PG.slow++;
  if (PG.n >= 90) { const r = PG.slow / PG.n; PG.n = PG.slow = 0;
    if (r > .15 && !NOBLEND) NOBLEND = true; else if (r > .2 && NOBLEND && !LOWRES) { LOWRES = true; films.forEach(f => f.resize()); } }
}
/* write-if-changed: the scroll loop touches the DOM only when a value actually changes */
const _w = new WeakMap();
function setS(el, prop, v) { let m = _w.get(el); if (!m) _w.set(el, m = {}); if (m[prop] === v) return; m[prop] = v; el.style[prop] = v; }
function setT(el, v) { let m = _w.get(el); if (!m) _w.set(el, m = {}); if (m._t === v) return; m._t = v; el.textContent = v; }

/* ================= 1. OPEN: type-mask hero → camera tour ================= */
const ZP = 0.075;                                  // share of the tour section spent zooming through the wordmark
const NT = TOUR.length;
const tourTL = timeline(NT, i => i === 0 ? .06 : i === NT - 1 ? .35 : .12);
const tourSec = $('#tour'), hero = $('#hero'), hud = $('#hud'), l3 = $('#l3'), mask = $('#mask'), mctx = mask.getContext('2d');
let zoomZ = 0, maskKey = '', fontOK = false;
const PAPER = '#eee8dc';
function maskResize() { const d = Math.min(devicePixelRatio || 1, 1.5); mask.width = Math.round(mask.clientWidth * d); mask.height = Math.round(mask.clientHeight * d); maskKey = ''; }
function drawMask(z) {
  const key = z.toFixed(4) + mask.width; if (key === maskKey) return; maskKey = key;
  const W = mask.width, H = mask.height, c = mctx;
  c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'source-over'; c.clearRect(0, 0, W, H);
  if (z >= 1) return;
  c.fillStyle = PAPER; c.fillRect(0, 0, W, H);
  c.globalCompositeOperation = 'destination-out';
  try { c.fontStretch = 'expanded'; } catch (e) {}
  c.font = `800 100px ${fontOK ? 'Archivo' : 'Arial Black, sans-serif'}`; c.textBaseline = 'alphabetic';
  const word = 'SATTVA', w100 = c.measureText(word).width;
  const mob = isMobile(), fs = 100 * (W * (mob ? .94 : .9)) / w100;
  c.font = `800 ${fs}px ${fontOK ? 'Archivo' : 'Arial Black, sans-serif'}`;
  const tw = c.measureText(word).width, capH = c.measureText('T').actualBoundingBoxAscent || fs * .72;
  const x0 = (W - tw) / 2, base = H * (mob ? .52 : .56) + capH / 2;
  // zoom origin: centre of the first T's stem, so the camera dives through a letter into the film
  const ox = x0 + c.measureText('SAT').width - c.measureText('T').width / 2, oy = base - capH * .32;
  const s = 1 + Math.pow(z, 2.4) * 140, k = ease(range(z, .05, .7));
  // drift the zoom origin to screen centre so the opening ends symmetric
  c.translate(lerp(ox, W / 2, k), lerp(oy, H / 2, k)); c.scale(s, s); c.translate(-ox, -oy);
  c.fillText(word, x0, base);
}
let focusH = 0; const tc = $('#tc'), camNo = $('#camNo'), focusIn = $('#focusIn'), mmDot = $('#mmDot'), mmTrail = $('#mmTrail');
const l3Cam = $('#l3Cam'), l3Where = $('#l3Where'), l3Title = $('#l3Title'), l3Desc = $('#l3Desc'), l3K1 = $('#l3K1'), l3V1 = $('#l3V1'), l3K2 = $('#l3K2'), l3V2 = $('#l3V2'), l3Who = $('#l3Who');
$$('.l3-tag, #l3Title, #l3Desc, .l3-stats').forEach(el => el.classList.add('swap'));
const MM_LEN = []; { let L = 0; MM_LEN.push(0); for (let i = 1; i < NT; i++) { const a = TOUR[i-1].mm, b = TOUR[i].mm; L += Math.hypot(b[0]-a[0], b[1]-a[1]); MM_LEN.push(L); } MM_LEN.total = L; }
let tIdx = -1, tSwap = 0, tickets = 23;
function setTourStop(i) {
  if (i === tIdx) return; tIdx = i; const s = TOUR[i];
  camNo.textContent = s.cam;
  l3.classList.add('out'); clearTimeout(tSwap);
  tSwap = setTimeout(() => {
    l3Cam.textContent = s.cam; l3Where.textContent = s.where; l3Title.textContent = s.t; l3Desc.textContent = s.d;
    l3K1.textContent = s.k1; l3K2.textContent = s.k2; l3V2.textContent = s.v2; l3Who.textContent = s.who;
    if (typeof s.v1 === 'number') countTo(l3V1, s.v1, 1100, s.u1); else l3V1.textContent = s.v1 === 'live' ? tickets : s.v1;
    l3.classList.remove('out');
  }, 380);
}
const tourFilm = new SeqFilm(tourSec, {
  keys: TOUR.map((_, i) => 0),                     // replaced below once count is known
  map(p) { return p < ZP ? 0 : tourTL.pos(range(p, ZP, 1)) / (NT - 1) * (tourFilm.count - 1); },
  zoom() { return 1 + (1 - ease(zoomZ)) * .14; },
  onProgress(p, cur) {
    const z = range(p, 0, ZP); zoomZ = z;
    if (z < 1) drawMask(z);
    setS(mask, 'display', z >= 1 ? 'none' : 'block');
    setS(mask, 'opacity', (1 - range(z, .62, .95)).toFixed(2));
    setS(hero, 'opacity', (1 - range(z, 0, .3)).toFixed(2));
    setS(hero, 'visibility', z > .32 ? 'hidden' : 'visible');
    setS(hero, 'transform', `translate3d(0,${(-z * 60).toFixed(0)}px,0)`);
    setS(hud, 'opacity', range(z, .8, 1).toFixed(2)); setS(l3, 'opacity', range(z, .9, 1).toFixed(2));
    const pos = cur / (tourFilm.count - 1) * (NT - 1);
    setTourStop(clamp(Math.round(pos), 0, NT - 1));
    // timecode (24 fps) from film time, as if a camera is rolling
    const secs = pos * 5.17 + 3600 * 1 + 42 * 60; const fr = Math.floor((secs % 1) * 24);
    setT(tc, `${pad(Math.floor(secs / 3600))}:${pad(Math.floor(secs / 60) % 60)}:${pad(Math.floor(secs) % 60)}:${pad(fr)}`);
    setS(focusIn, 'transform', `translate3d(0,${(pos / (NT - 1) * focusH).toFixed(1)}px,0)`);
    const a = Math.min(Math.floor(pos), NT - 2), t = pos - a, A = TOUR[a].mm, B = TOUR[a + 1].mm;
    setS(mmDot, 'transform', `translate(${lerp(A[0], B[0], t).toFixed(1)}px,${lerp(A[1], B[1], t).toFixed(1)}px)`);
    setS(mmTrail, 'strokeDashoffset', (1 - (MM_LEN[a] + (MM_LEN[a + 1] - MM_LEN[a]) * t) / MM_LEN.total).toFixed(3));
  }
});
tourFilm.order = tourFilm.order; // keyframes of every stop jump the queue so holds are sharp
{ const kf = TOUR.map((_, i) => Math.round(i * (tourFilm.count - 1) / (NT - 1))); kf.slice().reverse().forEach(i => { const k = tourFilm.order.indexOf(i); if (k > 0) { tourFilm.order.splice(k, 1); tourFilm.order.splice(1, 0, i); } }); }
films.push(tourFilm); window.__tour = tourFilm;
maskResize(); addEventListener('resize', maskResize);
setInterval(() => { tickets = clamp(tickets + Math.round(Math.random() * 4 - 2), 14, 38); if (tIdx === NT - 1) l3V1.textContent = tickets; }, 2600);

/* ================= 2. LIVE STATIONS ================= */
const stWrap = $('#stations'); const T0 = Date.now() - (2 * 3600 + 17 * 60) * 1000;
stWrap.innerHTML = STATIONS.map((s, i) => `
  <article class="st${i === 0 ? ' on' : ''}" data-i="${i}" tabindex="0" aria-label="${s.name} station, now cooking ${s.now}">
    <video muted playsinline loop preload="none" poster="assets/live/s${i + 1}.webp" data-src="assets/live/s${i + 1}.mp4"></video>
    <div class="st-top"><span class="st-live"><i></i>Live</span><span class="st-t" data-t>00:00:00</span></div>
    <div class="st-bot"><span class="st-no">STATION ${s.n}</span><h3>${s.name}</h3>
      <div class="st-more"><div><small>Now cooking</small><b><i class="veg"></i>${s.now}</b></div><div><small>Heat</small><b>${s.temp}</b></div><div><small>On station</small><em>${s.chef}</em></div></div></div>
  </article>`).join('');
const stCards = $$('.st', stWrap); let stVisible = false, stOn = 0;
function playOnly(idx) {
  stCards.forEach((c, i) => { const v = $('video', c);
    if (i === idx && stVisible) { if (!v.src) v.src = v.dataset.src; const pr = v.play(); pr && pr.catch(() => {}); } else if (!v.paused) v.pause(); });
}
function setStation(i) { if (i === stOn) return; stOn = i; stCards.forEach((c, k) => c.classList.toggle('on', k === i)); playOnly(i); }
stCards.forEach((c, i) => { c.addEventListener('mouseenter', () => !isMobile() && setStation(i)); c.addEventListener('focus', () => setStation(i)); c.addEventListener('click', () => setStation(i)); });
new IntersectionObserver(es => es.forEach(e => { stVisible = e.isIntersecting; playOnly(stOn); }), { threshold: .15 }).observe(stWrap);
// on phones, the card snapped in the middle is the one that plays
if ('IntersectionObserver' in window) { const io2 = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && isMobile()) setStation(+e.target.dataset.i); }), { root: stWrap, threshold: .7 }); stCards.forEach(c => io2.observe(c)); }
setInterval(() => { const s = Math.floor((Date.now() - T0) / 1000); const t = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`; $$('[data-t]', stWrap).forEach(el => el.textContent = t); }, 1000);

/* ================= 3. ONE PLATE ================= */
const NP = STOPS.length, LEG_KM = STOPS.slice(1).map((s, i) => km([STOPS[i].lat, STOPS[i].lon], [s.lat, s.lon]));
const plTL = timeline(NP, i => i === 0 ? .15 : i === NP - 1 ? .4 : .22);
const plCard = $('#plCard'), plNum = $('#plNum'), plCountry = $('#plCountry'), plTitle = $('#plTitle'), plDesc = $('#plDesc'), plDishes = $('#plDishes'), plWord = $('#plWord'), plScale = $('#plScale');
const gCity = $('#gCity'), gTime = $('#gTime'), gKm = $('#gKm');
['plCountry', 'plTitle', 'plDesc', 'plDishes'].forEach(id => $('#' + id).classList.add('swap'));
plScale.innerHTML = '<span class="pl-prog" id="plProg"></span>' + STOPS.map((s, i) => `<li><button type="button" data-i="${i}" data-n="${pad(i)}">${pad(i)} ${s.c}</button></li>`).join('');
const plProg = $('#plProg'), plLis = $$('li', plScale);
plScale.addEventListener('click', e => { const b = e.target.closest('button'); if (b) scrollToY(plate.top + plate.total * plTL.hold(+b.dataset.i)); });
let pIdx = -1, pSwap = 0, tzFmt = null;
function setPlate(i) {
  if (i === pIdx) return; pIdx = i; const s = STOPS[i];
  plCard.classList.add('out'); plWord.classList.add('out'); clearTimeout(pSwap);
  pSwap = setTimeout(() => {
    plNum.textContent = pad(i); plCountry.textContent = s.c; plTitle.textContent = s.t; plDesc.textContent = s.d;
    plDishes.innerHTML = s.dishes.map(d => `<li><span>${i ? '<i class="veg"></i>' : ''}${d[0]}</span><em>${d[1]}</em></li>`).join('');
    $('span', plWord).textContent = s.w; plCard.classList.remove('out'); plWord.classList.remove('out');
  }, 330);
  gCity.textContent = s.c === 'Departure' || s.c === 'Home' ? 'Ahmedabad' : s.t === 'La Tavola' ? 'Rome' : ({ India:'New Delhi', Mexico:'Oaxaca', Japan:'Kyoto', Lebanon:'Beirut', Thailand:'Bangkok' })[s.c];
  try { tzFmt = new Intl.DateTimeFormat('en-GB', { timeZone: s.tz, hour: '2-digit', minute: '2-digit' }); } catch (e) { tzFmt = null; }
  gTime.textContent = tzFmt ? tzFmt.format(new Date()) : '--:--';
  plLis.forEach((li, k) => li.classList.toggle('cur', k === i));
}
const LAND_PTS = []; for (let r = 0; r < 60; r++) { const row = LAND.substr(r * 36, 36); for (let c = 0; c < 144; c++) if (parseInt(row[c >> 2], 16) & (8 >> (c & 3))) LAND_PTS.push(toVec(88.75 - r * 2.5, -178.75 + c * 2.5)); }
const gcv = $('#globe'), g = gcv.getContext('2d'); let gLast = '';
function drawGlobe(pos) {
  const a = Math.floor(clamp(pos, 0, NP - 1.0001)), t = pos - a;
  const here = slerp([STOPS[a].lat, STOPS[a].lon], [STOPS[a + 1].lat, STOPS[a + 1].lon], t);
  const key = here[0].toFixed(2) + ',' + here[1].toFixed(2); if (key === gLast) return; gLast = key;
  const W = gcv.width, R = W / 2 - 6, cx = W / 2, cy = W / 2, lat0 = clamp(here[0], -10, 40) * RAD * .8, lon0 = here[1] * RAD;
  const sl = Math.sin(lat0), cl = Math.cos(lat0), so = Math.sin(-lon0), co = Math.cos(-lon0);
  const proj = v => { const x = v[0] * co - v[1] * so, y = v[0] * so + v[1] * co, z = v[2]; return [cx + y * R, cy - (-x * sl + z * cl) * R, x * cl + z * sl]; };
  g.clearRect(0, 0, W, W); g.fillStyle = '#12110f'; g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.fill(); g.strokeStyle = 'rgba(242,236,224,.5)'; g.lineWidth = 1.5; g.stroke();
  const bk = [new Path2D(), new Path2D(), new Path2D(), new Path2D()];
  for (const v of LAND_PTS) { const p = proj(v); if (p[2] > 0) bk[Math.min(3, p[2] * 4 | 0)].rect(p[0] - 1.4, p[1] - 1.4, 2.8, 2.8); }
  bk.forEach((path, i) => { g.fillStyle = `rgba(242,236,224,${(.2 + i * .2).toFixed(2)})`; g.fill(path); });
  g.strokeStyle = '#e4472b'; g.lineWidth = 2.4;
  for (let l = 0; l <= a; l++) { const end = l < a ? 1 : t; if (end <= 0) continue; const P = [STOPS[l].lat, STOPS[l].lon], Q = [STOPS[l + 1].lat, STOPS[l + 1].lon];
    g.beginPath(); let pen = false; for (let k = 0; k <= 40; k++) { const ll = slerp(P, Q, end * k / 40), q = proj(toVec(ll[0], ll[1])); if (q[2] <= 0) { pen = false; continue; } pen ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]); pen = true; } g.stroke(); }
  const me = proj(toVec(here[0], here[1])); g.fillStyle = '#e4472b'; g.fillRect(me[0] - 5, me[1] - 5, 10, 10);
}
const plate = new SeqFilm($('#plate'), {
  map(p) { return plTL.pos(p) / (NP - 1) * (plate.count - 1); },
  layout(cw, ch, iw, ih, mob) {
    if (mob) { const s = cw / iw * 1.02, w = iw * s, h = ih * s; return { w, h, x: (cw - w) / 2, y: Math.max(-h * .06, ch * .3 - h * .465), fill: '#050605' }; }
    const s = Math.max(cw / iw, ch / ih) * 1.02, w = iw * s, h = ih * s; return { w, h, x: (cw - w) / 2 + cw * .16, y: (ch - h) / 2, fill: '#070807' };
  },
  onProgress(p, cur) {
    const pos = cur / (plate.count - 1) * (NP - 1); setPlate(clamp(Math.round(pos), 0, NP - 1)); drawGlobe(pos);
    const a = Math.floor(pos); let d = 0; for (let l = 0; l < Math.min(a, NP - 1); l++) d += LEG_KM[l]; if (a < NP - 1) d += LEG_KM[a] * (pos - a);
    setT(gKm, Math.round(d).toLocaleString('en-IN')); setS(plProg, 'transform', `scaleX(${(pos / (NP - 1)).toFixed(4)})`);
  }
});
{ const kf = STOPS.map((_, i) => Math.round(i * (plate.count - 1) / (NP - 1))); kf.slice().reverse().forEach(i => { const k = plate.order.indexOf(i); if (k > 0) { plate.order.splice(k, 1); plate.order.splice(1, 0, i); } }); }
films.push(plate); setPlate(0); drawGlobe(0);

/* ================= 4. MENU ================= */
const tabs = $('#tabs'), mList = $('#mList'), mFloat = $('#mFloat'), mFloatImg = $('#mFloatImg');
let mCur = 0, mFilter = 'all';
tabs.innerHTML = MENU.map((c, i) => `<button class="tab${i ? '' : ' on'}" role="tab" aria-selected="${!i}" data-i="${i}">${c.tab}<sup>${pad(c.items.length)}</sup></button>`).join('');
const TAGN = { vegan:'Vegan', jain:'Jain', gf:'GF' };
function renderMenu() {
  const c = MENU[mCur];
  mList.innerHTML = c.items.map((it, k) => `<li class="m-item" style="--i:${k}" data-tags="${it[3].join(' ')}">
      <span class="m-no">${c.id.toUpperCase()}—${pad(k + 1)}</span>
      <div><h4><i class="veg" title="Vegetarian"></i>${it[0]}${it[4] ? `<span class="heat" title="Heat ${it[4]} of 5">${'<i></i>'.repeat(it[4])}</span>` : ''}</h4><p>${it[1]}</p></div>
      <div class="m-tags">${it[3].map(t => `<span class="tag ${t}">${TAGN[t]}</span>`).join('')}</div>
      <span class="m-price">${inr(it[2])}</span>
      <button class="add" data-k="${k}" aria-label="Add ${it[0]} to order">+</button></li>`).join('');
  applyFilter(); mFloatImg.src = `assets/img/${c.img}.webp`;
}
function applyFilter() { $$('.m-item', mList).forEach(li => li.classList.toggle('hide', mFilter !== 'all' && !li.dataset.tags.split(' ').includes(mFilter))); }
tabs.addEventListener('click', e => { const b = e.target.closest('.tab'); if (!b || +b.dataset.i === mCur) return; mCur = +b.dataset.i;
  $$('.tab', tabs).forEach(t => { t.classList.toggle('on', t === b); t.setAttribute('aria-selected', t === b); });
  tabs.scrollTo({ left: b.offsetLeft - tabs.clientWidth / 2 + b.offsetWidth / 2, behavior: 'smooth' }); renderMenu(); });
$('#filters').addEventListener('click', e => { const b = e.target.closest('.tg'); if (!b) return; mFilter = b.dataset.f; $$('.tg').forEach(t => t.classList.toggle('on', t === b)); applyFilter(); });
renderMenu();
let fx = 0, fy = 0, ftx = 0, fty = 0, fOn = false;
if (fine) {
  mList.addEventListener('pointermove', e => { ftx = e.clientX; fty = e.clientY; const on = !!e.target.closest('.m-item') && !e.target.closest('.add'); if (on !== fOn) { fOn = on; mFloat.style.opacity = on ? 1 : 0; } });
  mList.addEventListener('pointerleave', () => { fOn = false; mFloat.style.opacity = 0; });
}

/* ---- order (KOT drawer) ---- */
const cart = new Map(), cartN = $('#cartN'), cartBtn = $('#cartBtn'), drawer = $('#drawer'), scrim = $('#scrim'), drList = $('#drList'), drTotal = $('#drTotal');
const itemOf = key => { const [c, k] = key.split(':'); const cat = MENU.find(m => m.id === c); return { cat, it: cat.items[+k] }; };
function renderCart() {
  let n = 0, tot = 0; cart.forEach((q, key) => { n += q; tot += q * itemOf(key).it[2]; }); cartN.textContent = n; drTotal.textContent = inr(tot);
  drList.innerHTML = n ? [...cart].map(([key, q]) => { const { cat, it } = itemOf(key); return `<li><b>${it[0]}</b><div class="dr-q"><button data-q="-1" data-key="${key}" aria-label="Remove one">−</button><span>${q}</span><button data-q="1" data-key="${key}" aria-label="Add one">+</button></div><small>${cat.tab} · ${inr(it[2])} · ${inr(it[2] * q)}</small></li>`; }).join('')
    : '<li class="dr-empty">No tickets yet. Fire something from the menu.</li>';
}
let hdrPin = 0;
mList.addEventListener('click', e => { const b = e.target.closest('.add'); if (!b) return; const key = MENU[mCur].id + ':' + b.dataset.k; cart.set(key, (cart.get(key) || 0) + 1);
  hdrPin = performance.now() + 2500; hdr.classList.remove('hide'); hHide = false; fly(b); renderCart(); toast(`Fired: ${MENU[mCur].items[+b.dataset.k][0]}`); });
drList.addEventListener('click', e => { const b = e.target.closest('button[data-q]'); if (!b) return; const q = (cart.get(b.dataset.key) || 0) + +b.dataset.q; q > 0 ? cart.set(b.dataset.key, q) : cart.delete(b.dataset.key); renderCart(); });
function openDrawer(v) { drawer.classList.toggle('open', v); scrim.classList.toggle('on', v); drawer.setAttribute('aria-hidden', String(!v)); if (lenis) v ? lenis.stop() : lenis.start(); }
cartBtn.addEventListener('click', () => openDrawer(true)); $('#drClose').addEventListener('click', () => openDrawer(false)); scrim.addEventListener('click', () => openDrawer(false));
$('#drCheckout').addEventListener('click', () => cart.size ? toast('Demo checkout — wire to WooCommerce /wc/store/v1/cart') : toast('Add a dish first'));
function fly(from) { const a = from.getBoundingClientRect(), d = document.createElement('div'); d.className = 'fly'; document.body.appendChild(d); const x0 = a.left + a.width / 2 - 6, y0 = a.top + a.height / 2 - 6, t0 = performance.now();
  (function st(t) { const k = clamp((t - t0) / 800), e = eio(k), b = cartBtn.getBoundingClientRect(), x1 = b.left + b.width / 2 - 6, y1 = b.top + b.height / 2 - 6;
    d.style.transform = `translate3d(${lerp(x0, x1, e)}px,${lerp(y0, y1, e) - Math.sin(k * Math.PI) * 160}px,0) rotate(${k * 360}deg)`;
    if (k < 1) requestAnimationFrame(st); else { d.remove(); cartBtn.classList.add('bump'); setTimeout(() => cartBtn.classList.remove('bump'), 320); } })(t0); }
renderCart();

/* ================= 5. RESERVE (KOT) ================= */
const form = $('#rvForm'), kot = $('#kot'), fErr = $('#fErr'), guests = $('#guests'), kotNo = $('#kotNo');
kotNo.textContent = '#' + pad(1000 + Math.floor(Math.random() * 8999), 4);
{ const t = new Date(); t.setMinutes(t.getMinutes() - t.getTimezoneOffset()); form.elements.date.min = t.toISOString().slice(0, 10); }
$$('.stepper button', form).forEach(b => b.addEventListener('click', () => { guests.textContent = pad(clamp(+guests.textContent + +b.dataset.s, 1, 12)); }));
guests.textContent = '02';
form.addEventListener('submit', e => {
  e.preventDefault(); let bad = null;
  ['name', 'phone', 'date', 'time'].forEach(n => { const el = form.elements[n]; const ok = el.checkValidity() && el.value.trim(); el.classList.toggle('bad', !ok); if (!ok && !bad) bad = el; });
  if (bad) { fErr.textContent = '! Fill the highlighted lines'; bad.focus(); return; }
  fErr.textContent = ''; const f = form.elements, d = new Date(f.date.value + 'T00:00');
  $('#okName').textContent = f.name.value.trim().toUpperCase(); $('#okG').textContent = guests.textContent;
  $('#okD').textContent = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }).toUpperCase();
  $('#okT').textContent = f.time.value; $('#okS').textContent = f.seat.value.toUpperCase(); $('#okP').textContent = f.diet.value.toUpperCase();
  $('#okNo').textContent = kotNo.textContent; kot.classList.add('done'); toast('Table printed — confirmation on WhatsApp');
});
$('#rvAgain').addEventListener('click', () => { kot.classList.remove('done'); form.reset(); guests.textContent = '02'; kotNo.textContent = '#' + pad(1000 + Math.floor(Math.random() * 8999), 4); });

/* ================= HEADER: live kitchen status ================= */
const hdr = $('#hdr'), hdrLive = $('#hdrLive'), liveTxt = $('#liveTxt'), liveClock = $('#liveClock'); let lastY = 0, hHide = false;
function liveTick() {
  let parts; try { parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()); } catch (e) { return; }
  const get = t => (parts.find(p => p.type === t) || {}).value; const day = get('weekday'), h = +get('hour'), m = +get('minute'), mins = h * 60 + m;
  const open = day !== 'Mon' && ((mins >= 720 && mins < 930) || (mins >= 1140 && mins < 1410));
  liveClock.textContent = `${pad(h)}:${pad(m)} IST`; hdrLive.classList.toggle('closed', !open);
  liveTxt.textContent = open ? 'Kitchen live · 7 stations firing' : day === 'Mon' ? 'Closed today · back Tuesday' : mins < 720 ? 'Kitchen opens 12:00' : mins < 1140 ? 'Prepping · fires up 19:00' : 'Kitchen closed · opens 12:00';
}
liveTick(); setInterval(liveTick, 20000);
const THEME = []; function measureTheme() { THEME.length = 0; $$('[data-hdr]').forEach(el => { const r = el.getBoundingClientRect(); THEME.push([r.top + scrollY, r.top + scrollY + r.height, el.dataset.hdr]); }); }
let hTheme = '';
function themeTick(y) { const probe = y + 36; let t = 'paper'; for (const s of THEME) if (probe >= s[0] && probe < s[1]) { t = s[2]; break; }
  if (t === 'tour') t = zoomZ > .45 ? 'dark' : 'paper'; if (t !== hTheme) { hTheme = t; hdr.classList.toggle('dark', t === 'dark'); } }
function headerTick(y) { themeTick(y); const dy = y - lastY; if (Math.abs(dy) > 5) { const h = dy > 0 && y > innerHeight * 1.5 && !menuOpen && performance.now() > hdrPin; if (h !== hHide) { hdr.classList.toggle('hide', h); hHide = h; } lastY = y; } }
const burger = $('#burger'), mnav = $('#mnav'); let menuOpen = false;
function toggleMenu(v = !menuOpen) { menuOpen = v; mnav.classList.toggle('open', v); mnav.setAttribute('aria-hidden', String(!v)); burger.setAttribute('aria-expanded', String(v)); if (lenis) v ? lenis.stop() : lenis.start(); }
burger.addEventListener('click', () => toggleMenu());
addEventListener('keydown', e => { if (e.key === 'Escape') { toggleMenu(false); openDrawer(false); } });

/* ================= MISC: counters, reveals, toast, parallax, cursor ================= */
function countTo(el, to, dur = 1500, unit = '') { const t0 = performance.now(); (function s(t) { const k = ease(clamp((t - t0) / dur)); el.textContent = Math.round(to * k) + unit; if (k < 1) requestAnimationFrame(s); })(t0); }
const rio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } }), { threshold: .2 });
$$('.rv-up').forEach(el => { el.innerHTML = el.innerHTML.split('<br>').map(l => `<span class="ln"><span>${l}</span></span>`).join(''); rio.observe(el); });
const toastEl = $('#toast'); let toastT; function toast(m) { toastEl.textContent = m; toastEl.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('on'), 3000); }
const rsImg = $('.rs-img img'), rsBox = $('.rs-img'); const M = {};
function measureAll() { const r = rsBox.getBoundingClientRect(); M.rs = { top: r.top + scrollY, h: r.height }; focusH = $('#focus').clientHeight; films.forEach(f => f.measure()); measureTheme(); }
function parallaxTick(sy) { const t = M.rs.top - sy; if (t + M.rs.h > 0 && t < innerHeight) setS(rsImg, 'transform', `translate3d(0,${(((t + M.rs.h / 2) - innerHeight / 2) / innerHeight * -50).toFixed(0)}px,0)`); }
const cur = $('#cursor'); let cx = -99, cy = -99, tx = -99, ty = -99;
if (fine) { addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; }, { passive: true });
  document.addEventListener('pointerover', e => cur.classList.toggle('big', !!e.target.closest('a, button, input, select, label, .st'))); }

/* ================= LOOP ================= */
let rzT; const remeasure = () => { clearTimeout(rzT); rzT = setTimeout(measureAll, 120); };
addEventListener('resize', remeasure); addEventListener('load', measureAll); measureAll();
if (window.ResizeObserver) new ResizeObserver(remeasure).observe(document.body);
function loop() {
  const y = scrollY; let act = false; films.forEach(f => { if (f.tick(y)) act = true; }); perfGuard(performance.now(), act); headerTick(y); parallaxTick(y);
  if (fine) { cx = lerp(cx, tx, .25); cy = lerp(cy, ty, .25); setS(cur, 'transform', `translate3d(${cx.toFixed(1)}px,${cy.toFixed(1)}px,0)`);
    if (fOn || mFloat.style.opacity !== '0') { fx = lerp(fx, ftx, .14); fy = lerp(fy, fty, .14); mFloat.style.transform = `translate3d(${(fx - 130).toFixed(1)}px,${(fy - 130).toFixed(1)}px,0) scale(${fOn ? 1 : .6}) rotate(${((ftx - fx) * .08).toFixed(2)}deg)`; } }
  requestAnimationFrame(loop);
}

/* ================= PRELOADER: film leader 3-2-1 ================= */
const leader = $('#leader'), ldNum = $('#ldNum'), ldPct = $('#ldPct'), sweep = $('.ld-sweep');
document.body.classList.add('locked'); if (lenis) lenis.stop();
const t0 = performance.now(); let shown = 0, done = false;
const fontP = document.fonts ? Promise.all([document.fonts.load('800 100px Archivo'), document.fonts.ready]).then(() => { fontOK = document.fonts.check('800 100px Archivo'); maskKey = ''; }) : Promise.resolve();
Promise.all([tourFilm.ready, fontP]).then(() => { done = true; });
setTimeout(() => { done = true; }, 8000);
(function lt() {
  const real = done ? 1 : Math.min(.95, tourFilm.loaded / tourFilm.firstPass), cap = clamp((performance.now() - t0) / 2100);
  shown = lerp(shown, Math.min(real, cap), .09); if (done && cap >= 1 && shown > .985) shown = 1;
  ldNum.textContent = 3 - Math.min(2, Math.floor(shown * 3)); sweep.style.setProperty('--a', ((shown * 3) % 1 * 360).toFixed(1) + 'deg');
  ldPct.textContent = pad(Math.round(shown * 100), 3) + '%';
  if (shown < 1) return requestAnimationFrame(lt);
  ldNum.textContent = '●'; maskKey = ''; drawMask(zoomZ);
  setTimeout(() => { leader.classList.add('cut'); document.body.classList.remove('locked'); if (lenis) lenis.start(); hero.classList.add('ready'); }, 220);
  setTimeout(() => leader.classList.add('gone'), 1400);
})();
requestAnimationFrame(loop);
})();
