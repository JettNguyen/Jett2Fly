/* ==========================================================================
   Jett2Fly: site.js
   Shared behaviour for every page. Page-specific work is keyed off
   <body data-page="…">. Data comes from releases.js and markup from
   render.js. build.js has already written the same markup into each page
   for search engines; this draws it again from releases.js, so a visitor
   always sees the current data even if build.js wasn't run.
   ========================================================================== */

/* An old link to /latest/index.html still loads, so show the clean address */
if (/\/index\.html$/.test(location.pathname)) {
  history.replaceState(null, '', location.pathname.replace(/index\.html$/, '') + location.search + location.hash);
}

(() => {
  'use strict';
  document.documentElement.classList.remove('no-js');

  const R = window.J2F;
  const RELEASES = R.newestFirst(window.RELEASES || []);
  const VIDEOS = window.VIDEOS || [];
  const PLAYLISTS = window.PLAYLISTS || {};
  const FILMS = window.FILMS || [];
  const { esc, cover, fmtDate, year, tracksOf, plural, dot } = R;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const page = document.body.dataset.page;

  /* ---------- helpers ---------- */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const fill = (sel, html) => { const el = $(sel); if (el) el.innerHTML = html; return el; };

  /* ---------- header ---------- */
  const header = $('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', scrollY > 8);
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    const path = location.pathname.replace(/\/$/, '') || '/';
    $$('.site-nav a:not(.btn)').forEach(a => {
      const p = a.getAttribute('href').replace(/\/$/, '') || '/';
      if (p === path) a.setAttribute('aria-current', 'page');
    });
  }
  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -6% 0px', threshold: .05 });
  const observeReveals = (root = document) => $$('[data-reveal]:not(.in)', root).forEach(el => io.observe(el));

  /* ---------- count-up numbers ---------- */
  const counted = new WeakSet();
  const cio = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting || counted.has(e.target)) return;
    counted.add(e.target);
    const el = e.target, target = +el.dataset.target || 0;
    if (reduceMotion) { el.textContent = target; return; }
    const t0 = performance.now(), dur = 1400;
    const tick = now => {
      const p = Math.min(1, (now - t0) / dur), ease = 1 - Math.pow(2, -10 * p);
      el.textContent = Math.round(target * ease);
      if (p < 1) requestAnimationFrame(tick); else el.textContent = target;
    };
    requestAnimationFrame(tick);
  }), { threshold: .4 });

  function fillStats() {
    const values = R.stats(RELEASES, VIDEOS, FILMS);
    $$('[data-count]').forEach(el => {
      el.dataset.target = values[el.dataset.count] ?? 0;
      if (!reduceMotion) el.textContent = '0';
      cio.observe(el);
    });
  }

  /* ---------- accent colour pulled from the latest cover ---------- */
  function accentFrom(src) {
    const img = new Image();
    img.src = src;
    img.decode().then(() => {
      const c = document.createElement('canvas'), n = 40;
      c.width = c.height = n;
      const x = c.getContext('2d', { willReadFrequently: true });
      x.drawImage(img, 0, 0, n, n);
      const d = x.getImageData(0, 0, n, n).data;
      let r = 0, g = 0, b = 0, k = 0;
      for (let i = 0; i < d.length; i += 4) {
        const R = d[i], G = d[i + 1], B = d[i + 2], mx = Math.max(R, G, B), mn = Math.min(R, G, B);
        const sat = mx ? (mx - mn) / mx : 0, l = (mx + mn) / 510;
        if (sat > .4 && l > .2 && l < .8) { r += R; g += G; b += B; k++; }
      }
      if (k < 30) return;
      r /= k; g /= k; b /= k;
      const [h, s] = rgbToHsl(r, g, b);
      const S = Math.min(92, s * 1.25), L = 56;
      const root = document.documentElement.style;
      root.setProperty('--accent', `hsl(${h} ${S}% ${L}%)`);
      root.setProperty('--accent-soft', `hsl(${h} ${S}% ${L}% / .3)`);
    }).catch(() => {});
  }
  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
    if (mx === mn) return [0, 0, l * 100];
    const d = mx - mn, s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn);
    let h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return [Math.round(h * 60), Math.round(s * 100), Math.round(l * 100)];
  }

  /* ---------- hero waveform ---------- */
  function waveform(canvas) {
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, bars = [], t = 0, raf = 0, visible = true, px = -1, hover = 0, last = 0;

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2), r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.max(40, Math.floor(w / 4.5));
      bars = Array.from({ length: n }, () => ({ p: Math.random() * Math.PI * 2, s: .5 + Math.random() * 1.1, j: .7 + Math.random() * .6 }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const n = bars.length, bw = w / n;
      for (let i = 0; i < n; i++) {
        const x = i / (n - 1), b = bars[i];
        const env = Math.exp(-Math.pow((x - .5) / .3, 2));                 // bell, like the logo
        const wob = .5 + .5 * Math.sin(t * b.s * 1.5 + b.p) * (.65 + .35 * Math.sin(t * .6 + i * .12));
        let amp = env * (.35 + .65 * wob) * b.j;
        if (px >= 0 && hover > 0) { const d = x - px; amp += Math.exp(-(d * d) / .0022) * .55 * hover; }
        const bh = Math.max(2, Math.min(h, amp * h * .95));
        ctx.fillStyle = `rgba(244,244,241,${(.18 + .82 * env).toFixed(3)})`;
        ctx.fillRect(i * bw + bw * .3, (h - bh) / 2, bw * .4, bh);
      }
    };
    const loop = now => {
      const dt = Math.min(.05, (now - last) / 1000 || .016); last = now;
      t += dt;
      hover += ((px >= 0 ? 1 : 0) - hover) * Math.min(1, dt * 6);
      draw();
      if (visible && !document.hidden) raf = requestAnimationFrame(loop); else raf = 0;
    };
    const start = () => { if (!raf && !reduceMotion) { last = performance.now(); raf = requestAnimationFrame(loop); } };

    resize();
    addEventListener('resize', () => { resize(); draw(); }, { passive: true });
    if (reduceMotion) { t = 3; draw(); return; }
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); }).observe(canvas);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) start(); });
    if (matchMedia('(hover: hover)').matches) {
      const zone = canvas.closest('.hero') || canvas;
      zone.addEventListener('pointermove', e => { const r = canvas.getBoundingClientRect(); px = (e.clientX - r.left) / r.width; });
      zone.addEventListener('pointerleave', () => { px = -1; });
    }
    start();
  }

  /* ---------- split hero title into letters ---------- */
  function splitTitle(el) {
    const text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    el.innerHTML = `<span class="w" aria-hidden="true">${[...text].map((ch, i) =>
      `<span class="l${ch === '2' ? ' two' : ''}" style="--i:${i}">${esc(ch)}</span>`).join('')}</span>`;
  }

  /* ---------- YouTube facade: poster + play, iframe only on click ---------- */
  function ytFacade(el) {
    const { id, list, title = 'Video', poster } = el.dataset;
    const src = poster || `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
    el.innerHTML = `<button class="yt-btn" type="button" aria-label="Play ${esc(title)}">
      <img src="${esc(src)}" alt="" loading="lazy" width="1280" height="720">
      <span class="yt-play"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></span></button>`;
    const img = $('img', el);
    img.addEventListener('load', () => { if (!poster && img.naturalWidth < 200) img.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`; }, { once: true });
    $('button', el).addEventListener('click', () => {
      const url = list
        ? `https://www.youtube-nocookie.com/embed/videoseries?list=${encodeURIComponent(list)}&autoplay=1`
        : `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`;
      el.innerHTML = `<iframe src="${url}" title="${esc(title)}" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    });
  }

  /* ---------- Film work ---------- */
  function renderFilms() {
    const sec = $('#film'), grid = $('#film-grid');
    if (!sec || !grid || !FILMS.length) return;
    grid.innerHTML = FILMS.map(R.filmCard).join('');
    sec.hidden = false;
  }

  /* ---------- clean addresses ----------
     Jett wants no # in the address bar (11/10/2026, same as sywavy.com). Links
     keep their # so they still work in a new tab or without scripts, but a
     plain click scrolls on the same page, or hands the section or release to
     the next page in sessionStorage. Any # that arrives anyway (an old or
     shared link) is used, then dropped from the address. */
  const GOTO = 'j2f_goto';
  const hashId = h => { try { return decodeURIComponent(h.slice(1)); } catch (_) { return ''; } };
  const dirOf = p => p.replace(/index\.html$/, '');
  const dropHash = () => history.replaceState(history.state, '', location.pathname + location.search);
  function take() {
    try { const v = sessionStorage.getItem(GOTO); sessionStorage.removeItem(GOTO); return v; } catch (_) { return null; }
  }
  function keep(v) {
    try { sessionStorage.setItem(GOTO, v); return true; } catch (_) { return false; }
  }

  // The stylesheet makes scrolling glide, but landing on a spot as a page opens shouldn't
  function jump(scroll) {
    const root = document.documentElement;
    root.style.scrollBehavior = 'auto';
    scroll();
    root.style.scrollBehavior = '';
  }

  // Scroll to a section and move keyboard focus there, the way following a #link does
  function goToSection(el, glide) {
    const scroll = () => el.scrollIntoView({ behavior: glide && !reduceMotion ? 'smooth' : 'auto', block: 'start' });
    if (glide && !reduceMotion) scroll(); else jump(scroll);
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  }

  // Land on a section as the page opens. Fonts and images that arrive afterwards
  // can still move it, so land again once they're in, unless the visitor has
  // started scrolling by then.
  function landOn(el) {
    let touched = false;
    ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(type =>
      addEventListener(type, () => { touched = true; }, { once: true, passive: true }));
    const land = () => { if (!touched) goToSection(el, false); };
    requestAnimationFrame(() => requestAnimationFrame(land));
    if (document.fonts) document.fonts.ready.then(land);
    addEventListener('load', land, { once: true });
  }

  // What each page does with a # it is handed: a section id, or on the Music page, a release
  let handleTarget = id => {
    const el = id && document.getElementById(id);
    if (el) landOn(el);
    return !!el;
  };

  document.addEventListener('click', e => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = e.target.closest('a[href*="#"]');
    if (!link || link.target === '_blank') return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || !url.hash) return;
    const id = hashId(url.hash);
    if (dirOf(url.pathname) === dirOf(location.pathname)) {
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      goToSection(el, true);
    } else if (keep(id)) {
      e.preventDefault();
      location.href = url.pathname + url.search;
    }
  });

  /* ==========================================================================
     Pages
     ========================================================================== */
  const pages = {
    home() {
      const latest = RELEASES[0];
      const title = $('.hero-title[data-split]');
      if (title) splitTitle(title);
      const wave = $('canvas.wave');
      if (wave) waveform(wave);
      if (latest) {
        accentFrom(cover(latest, 'thumbs'));
        fill('#hero-cta', R.heroCta(latest));
        fill('#featured', R.featured(latest));
      }
      fill('#recent', R.recent(RELEASES));
      // The marquee is hidden from screen readers, so its links stay out of the
      // tab order too. Every release is still a link on the Music page.
      const group = list => `<div class="marquee-group">${list.map(r =>
        `<a href="${R.releaseHref(r)}" tabindex="-1" aria-label="${esc(r.title)}"><img src="${cover(r, 'thumbs')}" alt="" loading="lazy" width="240" height="240"></a>`).join('')}</div>`;
      const a = RELEASES, b = RELEASES.slice().reverse();
      fill('#marquee-a', group(a) + group(a));
      fill('#marquee-b', group(b) + group(b));
      const v = VIDEOS[0];
      if (v) {
        fill('#latest-video', R.videoBox(v));
        fill('#latest-video-title', esc(v.title));
        fill('#latest-video-meta', `${esc(v.artist)} · ${esc(v.kind)}`);
      }
    },

    music() {
      const catalog = $('#catalog'), filters = $('#filters'), dialog = $('#release-dialog'), content = $('#dialog-content');
      const order = ['Album', 'EP', 'Mixtape', 'Single'].filter(t => RELEASES.some(r => r.type === t));
      const years = [...new Set(RELEASES.map(year))];
      let type = 'All', yr = 'all', opener = null;

      filters.innerHTML = `${['All', ...order].map(t =>
        `<button class="chip" type="button" data-type="${t}" aria-pressed="${t === 'All'}">${t === 'All' ? 'All' : t + 's'}</button>`).join('')}
        <span class="spacer"></span>
        <span class="year-pick"><label class="mono" for="year-filter">Year</label>
        <select class="select" id="year-filter"><option value="all">Any</option>${years.map(y => `<option>${y}</option>`).join('')}</select></span>
        <span class="count" id="count"></span>`;

      const render = () => {
        const list = RELEASES.filter(r => (type === 'All' || r.type === type) && (yr === 'all' || year(r) === yr));
        $('#count').textContent = plural(list.length, 'release');
        catalog.innerHTML = list.length ? R.catalog(list) : '<p class="empty">Nothing matches those filters.</p>';
        observeReveals(catalog);
      };
      filters.addEventListener('click', e => {
        const chip = e.target.closest('.chip'); if (!chip) return;
        type = chip.dataset.type;
        $$('.chip', filters).forEach(c => c.setAttribute('aria-pressed', c === chip));
        render();
      });
      $('#year-filter').addEventListener('change', e => { yr = e.target.value; render(); });
      render();

      const open = slug => {
        const r = RELEASES.find(x => x.slug === slug); if (!r) return false;
        content.innerHTML = `
          <div class="dialog-cover"><img src="${cover(r)}" alt="${esc(r.title)} cover art" width="800" height="800"></div>
          <div class="dialog-body">
            <div class="eyebrow">${r.type}${dot}${fmtDate(r.date)}${dot}${plural(tracksOf(r), 'track')}</div>
            <h2 id="dialog-title">${esc(r.title)}</h2>
            <p class="with">with ${esc(r.artist)}</p>
            <div class="pills">${R.platformPills(r)}</div>
            ${R.trackList(r)}
          </div>`;
        if (!dialog.open) dialog.showModal();
        $('.dialog-body', dialog).scrollTop = 0;
        $('.dialog-grid', dialog).scrollTop = 0;
        return true;
      };
      catalog.addEventListener('click', e => {
        const card = e.target.closest('[data-slug]'); if (!card) return;
        opener = card; open(card.dataset.slug);
      });
      dialog.addEventListener('click', e => { if (e.target === dialog || e.target.closest('[data-close]')) dialog.close(); });
      dialog.addEventListener('close', () => {
        if (opener) { opener.focus(); opener = null; }
      });
      // A release handed over from another page opens in the dialog
      const sectionTarget = handleTarget;
      handleTarget = id => open(id) || sectionTarget(id);
    },

    videos() {
      const [first, ...rest] = VIDEOS;
      if (first) fill('#video-featured', `${R.videoBox(first)}
          ${R.videoCaption(first)}`);
      fill('#video-grid', rest.map(R.videoCard).join(''));
      const pl = $('#playlist');
      if (pl && PLAYLISTS.youtube) pl.dataset.list = PLAYLISTS.youtube;
    },

    credits() {
      fill('#credits', R.credits(RELEASES));
      const sp = $('#spotify-playlist');
      if (sp && PLAYLISTS.spotify) sp.href = PLAYLISTS.spotify;
      const yt = $('#youtube-playlist');
      if (yt && PLAYLISTS.youtube) yt.href = `https://www.youtube.com/playlist?list=${PLAYLISTS.youtube}`;
    }
  };

  if (pages[page]) pages[page]();
  if (RELEASES[0] && page !== 'home') accentFrom(cover(RELEASES[0], 'thumbs'));
  renderFilms();
  $$('.yt[data-id], .yt[data-list]').forEach(ytFacade);
  fillStats();
  observeReveals();

  /* ---------- the section or release this page was opened for ---------- */
  const arrived = take() || hashId(location.hash);
  if (location.hash) dropHash();
  if (arrived) handleTarget(arrived);
  // A # typed into the address while already on the page
  addEventListener('hashchange', () => {
    const id = hashId(location.hash);
    if (!id) return;
    dropHash();
    handleTarget(id);
  });
})();
