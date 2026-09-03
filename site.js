/* ==========================================================================
   Jett2Fly — site.js
   Shared behaviour for every page. Page-specific work is keyed off
   <body data-page="…">. Data comes from releases.js.
   ========================================================================== */
(() => {
  'use strict';
  document.documentElement.classList.remove('no-js');

  const RELEASES = (window.RELEASES || []).slice().sort((a, b) => b.date.localeCompare(a.date));
  const VIDEOS = window.VIDEOS || [];
  const PLAYLISTS = window.PLAYLISTS || {};
  const FILMS = window.FILMS || [];
  const PLATFORMS = [['spotify', 'Spotify', 'spotify'], ['apple', 'Apple Music', 'applemusic'], ['youtube', 'YouTube', 'youtube'], ['soundcloud', 'SoundCloud', 'soundcloud']];
  const icon = n => `<svg class="ico ico-${n}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- helpers ---------- */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const cover = (r, size = 'covers') => `/images/${size}/${r.slug}.jpg`;
  const fmtDate = iso => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); };
  const year = r => r.date.slice(0, 4);
  const tracksOf = r => r.tracks ? r.tracks.length : (r.songs || 1);
  const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
  const meta = r => `${r.type} · ${plural(tracksOf(r), 'track')} · ${year(r)}`;
  const dot = ' <span class="dot">·</span> ';

  function platformPills(r) {
    const links = r.streamingLinks || {};
    const pills = PLATFORMS.filter(([k]) => links[k]).map(([k, name, ic]) =>
      `<a class="pill" href="${esc(links[k])}" target="_blank" rel="noopener">${icon(ic)}${name}</a>`);
    if (r.link) pills.push(`<a class="pill" href="${esc(r.link)}" target="_blank" rel="noopener">All platforms <span class="arrow">↗</span></a>`);
    return pills.join('');
  }
  const trackList = r => r.tracks && r.tracks.length ? `<ol class="tracklist">${r.tracks.map(t => `<li>${esc(t)}</li>`).join('')}</ol>` : '';

  function releaseCard(r, i, tag = 'a') {
    const attrs = tag === 'a' ? `href="/latest/#${r.slug}"` : `type="button" data-slug="${r.slug}"`;
    return `<${tag} class="card card-btn" ${attrs} data-reveal style="--i:${i % 6}">
      <div class="cover"><img src="${cover(r)}" alt="${esc(r.title)} cover art" loading="lazy" width="800" height="800"></div>
      <div class="body"><h3>${esc(r.title)}</h3><div class="mono">${esc(meta(r))}</div></div>
    </${tag}>`;
  }

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
    const years = RELEASES.map(r => +year(r));
    const values = {
      releases: RELEASES.length,
      tracks: RELEASES.reduce((n, r) => n + tracksOf(r), 0),
      years: years.length ? Math.max(...years) - Math.min(...years) + 1 : 0,
      artists: new Set(RELEASES.map(r => r.artist)).size,
      videos: VIDEOS.length,
      films: FILMS.length
    };
    $$('[data-count]').forEach(el => {
      el.dataset.target = values[el.dataset.count] ?? 0;
      el.textContent = '0';
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
  const videoCard = (v, i) => `<div data-reveal style="--i:${i % 6}">
      <div class="yt" data-id="${esc(v.id)}" data-title="${esc(v.artist + ' – ' + v.title)}"></div>
      <div class="video-caption"><h3>${esc(v.title)}</h3><span class="mono">${esc(v.artist)} · ${esc(v.kind)}</span></div>
    </div>`;

  /* ---------- Film work ---------- */
  function filmCard(f, i) {
    const bits = [f.year, f.role, f.runtime, f.director && `dir. ${f.director}`].filter(Boolean).map(esc).join(' · ');
    const media = f.youtube
      ? `<div class="yt" data-id="${esc(f.youtube)}" data-title="${esc(f.title)}"${f.poster ? ` data-poster="${esc(f.poster)}"` : ''}></div>`
      : `<a class="card" href="${esc(f.url || '#')}" target="_blank" rel="noopener"><div class="cover" style="aspect-ratio:16/9">${f.poster ? `<img src="${esc(f.poster)}" alt="" loading="lazy">` : ''}</div></a>`;
    return `<div data-reveal style="--i:${i % 6}">${media}
      <div class="video-caption stack"><h3>${esc(f.title)}</h3><span class="mono">${bits}</span></div>
      ${f.note ? `<p class="film-note">${esc(f.note)}</p>` : ''}</div>`;
  }
  function renderFilms() {
    const sec = $('#film'), grid = $('#film-grid');
    if (!sec || !grid || !FILMS.length) return;
    grid.innerHTML = FILMS.map(filmCard).join('');
    sec.hidden = false;
  }

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
        const cta = $('#hero-cta');
        if (cta) cta.innerHTML = `Listen to ${esc(latest.title)} <span class="arrow">↓</span>`;
        $('#featured').innerHTML = `
          <a class="featured-cover" href="/latest/#${latest.slug}" data-reveal>
            <img src="${cover(latest)}" alt="${esc(latest.title)} cover art" width="800" height="800" fetchpriority="high">
            <span class="tag">Latest release</span>
          </a>
          <div class="featured-info" data-reveal style="--i:1">
            <div class="eyebrow">${latest.type}${dot}${fmtDate(latest.date)}${dot}${plural(tracksOf(latest), 'track')}</div>
            <h2>${esc(latest.title)}</h2>
            <p class="with">with ${esc(latest.artist)}</p>
            ${trackList(latest)}
            <div class="featured-actions">${platformPills(latest)}</div>
          </div>`;
      }
      $('#recent').innerHTML = RELEASES.slice(1, 5).map((r, i) => releaseCard(r, i)).join('');
      const group = list => `<div class="marquee-group">${list.map(r =>
        `<a href="/latest/#${r.slug}" aria-label="${esc(r.title)}"><img src="${cover(r, 'thumbs')}" alt="" loading="lazy" width="240" height="240"></a>`).join('')}</div>`;
      const a = RELEASES, b = RELEASES.slice().reverse();
      $('#marquee-a').innerHTML = group(a) + group(a);
      $('#marquee-b').innerHTML = group(b) + group(b);
      const v = VIDEOS[0], vb = $('#latest-video');
      if (v && vb) vb.innerHTML = `<div class="yt" data-id="${esc(v.id)}" data-title="${esc(v.artist + ' – ' + v.title)}"></div>`;
      const vt = $('#latest-video-title');
      if (v && vt) vt.textContent = v.title;
      const vm = $('#latest-video-meta');
      if (v && vm) vm.textContent = `${v.artist} · ${v.kind}`;
    },

    music() {
      const catalog = $('#catalog'), filters = $('#filters'), dialog = $('#release-dialog'), content = $('#dialog-content');
      const order = ['Album', 'EP', 'Mixtape', 'Single'].filter(t => RELEASES.some(r => r.type === t));
      const years = [...new Set(RELEASES.map(year))];
      let type = 'All', yr = 'all', opener = null;

      filters.innerHTML = `${['All', ...order].map(t =>
        `<button class="chip" type="button" data-type="${t}" aria-pressed="${t === 'All'}">${t === 'All' ? 'All' : t + 's'}</button>`).join('')}
        <span class="spacer"></span>
        <label class="mono" for="year-filter">Year</label>
        <select class="select" id="year-filter"><option value="all">Any</option>${years.map(y => `<option>${y}</option>`).join('')}</select>
        <span class="count" id="count"></span>`;

      const render = () => {
        const list = RELEASES.filter(r => (type === 'All' || r.type === type) && (yr === 'all' || year(r) === yr));
        $('#count').textContent = plural(list.length, 'release');
        if (!list.length) { catalog.innerHTML = '<p class="empty">Nothing matches those filters.</p>'; return; }
        const groups = new Map();
        list.forEach(r => { const y = year(r); if (!groups.has(y)) groups.set(y, []); groups.get(y).push(r); });
        catalog.innerHTML = [...groups].map(([y, rs]) => `<section class="year-group">
            <h2 class="year-label">${y}</h2>
            <div class="release-grid">${rs.map((r, i) => releaseCard(r, i, 'button')).join('')}</div>
          </section>`).join('');
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
        const r = RELEASES.find(x => x.slug === slug); if (!r) return;
        content.innerHTML = `
          <div class="dialog-cover"><img src="${cover(r)}" alt="${esc(r.title)} cover art" width="800" height="800"></div>
          <div class="dialog-body">
            <div class="eyebrow">${r.type}${dot}${fmtDate(r.date)}${dot}${plural(tracksOf(r), 'track')}</div>
            <h2 id="dialog-title">${esc(r.title)}</h2>
            <p class="with">with ${esc(r.artist)}</p>
            <div class="pills">${platformPills(r)}</div>
            ${trackList(r)}
          </div>`;
        if (!dialog.open) dialog.showModal();
        $('.dialog-body', dialog).scrollTop = 0;
        history.replaceState(null, '', `#${slug}`);
      };
      catalog.addEventListener('click', e => {
        const card = e.target.closest('[data-slug]'); if (!card) return;
        opener = card; open(card.dataset.slug);
      });
      dialog.addEventListener('click', e => { if (e.target === dialog || e.target.closest('[data-close]')) dialog.close(); });
      dialog.addEventListener('close', () => {
        history.replaceState(null, '', location.pathname);
        if (opener) { opener.focus(); opener = null; }
      });
      const fromHash = () => { const s = location.hash.slice(1); if (s) open(s); };
      addEventListener('hashchange', fromHash);
      fromHash();
    },

    videos() {
      const [first, ...rest] = VIDEOS;
      if (first) {
        $('#video-featured').innerHTML = `<div class="yt" data-id="${esc(first.id)}" data-title="${esc(first.artist + ' – ' + first.title)}"></div>
          <div class="video-caption"><h3>${esc(first.title)}</h3><span class="mono">${esc(first.artist)} · ${esc(first.kind)}</span></div>`;
      }
      $('#video-grid').innerHTML = rest.map(videoCard).join('');
      const pl = $('#playlist');
      if (pl && PLAYLISTS.youtube) pl.dataset.list = PLAYLISTS.youtube;
    },

    credits() {
      $('#credits').innerHTML = RELEASES.map((r, i) => `
        <a class="credit" href="/latest/#${r.slug}" data-reveal style="--i:${i % 6}">
          <img src="${cover(r, 'thumbs')}" alt="" loading="lazy" width="56" height="56">
          <div><h3>${esc(r.title)}</h3><div class="mono">${esc(r.artist)} · ${r.type} · ${plural(tracksOf(r), 'track')}</div></div>
          <span class="year"><span class="full">${fmtDate(r.date)}</span><span class="short">${year(r)}</span></span>
        </a>`).join('');
      const sp = $('#spotify-playlist');
      if (sp && PLAYLISTS.spotify) sp.href = PLAYLISTS.spotify;
      const yt = $('#youtube-playlist');
      if (yt && PLAYLISTS.youtube) yt.href = `https://www.youtube.com/playlist?list=${PLAYLISTS.youtube}`;
    }
  };

  const page = document.body.dataset.page;
  if (pages[page]) pages[page]();
  if (RELEASES[0] && page !== 'home') accentFrom(cover(RELEASES[0], 'thumbs'));
  renderFilms();
  $$('.yt[data-id], .yt[data-list]').forEach(ytFacade);
  fillStats();
  observeReveals();
})();
