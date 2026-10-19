SATTVA — Open Kitchen (v3) · pure-vegetarian multi-cuisine restaurant scroll website (static)
==============================================================================================
Open index.html through any web server (e.g. `npx http-server .`). No build step.

CONCEPT — "Walk in. Watch it cooked."
A light editorial site with a live-camera language: the visitor scrolls through one continuous
camera move from the street, through the dining room, into the open kitchen and past live stations.
100% vegetarian and eggless; Jain, vegan and gluten-free dishes are tagged.

SECTIONS
0. Preloader – film-leader countdown 3·2·1 with a sweeping hand, then a vertical cut.
1. OPEN + KITCHEN TOUR (one pinned stage, 367-frame film, data-vh 980)
   - Hero: paper-coloured page with a giant SATTVA wordmark; the film plays inside the letters.
     Scrolling dives through the first "T" into the film (canvas mask, destination-out).
   - Tour: approach → Table 07 → the open kitchen → tandoor → wok → dosa tawa → the pass.
     Camera HUD: viewfinder corners, REC + CAM 01–07, running timecode, focus ruler,
     floor-plan minimap with a moving dot and trail, documentary lower-thirds with
     station temperature counters, chef on station and a live ticket count.
2. Live stations – 6 looping cooking clips (tawa, wok, grill, pasta, mithai, mezze) in an expanding
   accordion; only the open card decodes video. LIVE badge + running timer. Swipe-snap on phones.
3. One plate, seven countries – 428-frame overhead film; the plate morphs India → Italy → Mexico →
   Japan → Lebanon → Thailand → desserts, with giant outlined country names, dotted globe and a ruler.
4. Menu – 7 cuisine tabs (37 dishes), outlined condensed tab type, Vegan/Jain/GF filters,
   cursor-following plate preview, "fire" to order, kitchen-ticket (KOT) order drawer.
5. Book a table – the form is a kitchen ticket that prints your confirmation.
6. Footer – vermilion marquee + giant wordmark.

HEADER
- mix-blend-mode: difference, so it reads on paper and on film. Live kitchen status uses real
  Asia/Kolkata time and the opening hours (closed Mondays).

EDITING
- assets/js/app.js top: TOUR (stops / HUD copy / minimap points), STATIONS, STOPS, MENU
  ([name, description, price ₹, tags, heat 0–5]).
- data-vh on #tour / #plate sets scroll length. ZP in app.js = share of the tour spent on the wordmark dive.
- Frames: assets/seq/{tour,journey}/d (desktop 1200–1280w WebP) and /m (portrait crops, <860px).
- Loops: assets/live/s1–s6.mp4 (720×896 H.264, crossfaded seamless loops) + .webp posters.

PERFORMANCE
- Image-sequence canvases (no video seeking), coarse-to-fine loading, stop keyframes first, lazy films,
  pre-decode around the playhead, DPR ≤ 1.5, data-saver loads half. Mask redraws only while zooming.
- Live loops: preload="none", one video decoding at a time, paused off-screen.

WOOCOMMERCE / WORDPRESS
- Page template + enqueue style.css/app.js; copy assets into the theme.
- MENU → WC products (tags → attributes); "+" should POST /wc/store/v1/cart/add-item.
- KOT booking form → CF7 / WPForms / booking plugin endpoint.

Sattva is a fictional demo brand; all imagery and film is AI-generated for representation only.


v3 ADDITIONS
PAGES
- investors.html – Investor Relations for "Sattva Hospitality Ltd" (fictional demo data): share ticker strip,
  Q1 / Q2 / H1 FY27 period switch, KPI tiles with YoY deltas, operating KPIs, quarterly Revenue/EBITDA/PAT chart,
  monthly revenue chart (Apr–Sep 2026), revenue-mix bar, shareholding bars, full statement of profit & loss
  (Q2 FY27, Q1 FY27, Q2 FY26, QoQ, YoY, H1 FY27, H1 FY26), filings list, IR calendar and contact.
  Data lives in assets/js/site.js → PL (per-quarter P&L inputs; EBITDA, PBT, PAT, EPS are derived), MONTHS, MIX, KPI.
- media.html – kitchen film (31 s reel), filterable masonry gallery (Food / Kitchen / Spaces / Films, 29 items),
  full-screen lightbox (keyboard ←/→/Esc, swipe, download), press kit and fast facts.
  Items live in assets/js/site.js → ITEMS. Images: assets/media/*-s.webp (grid, 720w) and *.webp (lightbox, 1600w).
SMOOTHNESS (kitchen tour)
- Frames are cross-faded between neighbours, so the 12 fps sequence plays as continuous motion.
- Canvas backing store capped to the source resolution (no 2× upscaled redraws); redraws skipped when nothing changed.
- All per-frame DOM writes are write-if-changed; HUD ruler, minimap dot and progress bars move with transforms only.
- Header no longer uses mix-blend-mode (it forced re-blending every frame); it switches theme per section (data-hdr).
- Adaptive quality: if a device drops frames while a film plays, the cross-fade turns off, then canvas resolution drops.


v4 — KITCHEN TOUR SMOOTHNESS
- The tour now moves on every scroll tick: the long "dwell" pauses at each station were removed
  (tiny 0.12 holds remain) and the camera moves linearly through each leg. Scroll length 980vh → 620vh
  (one plate film 900vh → 700vh).
- Frames are fetched as Blobs and decoded OFF the main thread with createImageBitmap into a sliding
  window around the playhead (22 ahead / 6 behind, the rest released). drawImage never waits on a decode,
  which was the cause of the "stuck for a few scrolls, then jumps" behaviour.
- Loading follows the playhead and scroll direction first, then the coarse-to-fine sweep (8 parallel).
- The playhead follows Lenis directly (no second easing layer), so the film reacts to the wheel at once.
IMPORTANT: serve the site over http(s) (any host, or `npx http-server .` locally). Opened from file://
the browser blocks fetch, so it falls back to the slower <img> path.
