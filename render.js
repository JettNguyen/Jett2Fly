/* ==========================================================================
   Jett2Fly: render.js
   The markup for the music, videos and credits. site.js draws it in the
   browser, and build.js writes the same markup into the pages ahead of time
   so search engines and AI crawlers can read them without running scripts.
   Data comes from releases.js.
   ========================================================================== */
window.J2F = (() => {
  'use strict';

  const PLATFORMS = [['spotify', 'Spotify', 'spotify'], ['apple', 'Apple Music', 'applemusic'], ['youtube', 'YouTube', 'youtube'], ['soundcloud', 'SoundCloud', 'soundcloud']];

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icon = n => `<svg class="ico ico-${n}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
  const cover = (r, size = 'covers') => `/images/${size}/${r.slug}.jpg`;
  // Every size of a cover, so the browser loads the smallest one that is still sharp
  const coverSet = r => `${cover(r, 'thumbs')} 240w, ${cover(r, 'cards')} 480w, ${cover(r)} 800w`;
  const fmtDate = iso => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); };
  const year = r => r.date.slice(0, 4);
  const tracksOf = r => r.tracks ? r.tracks.length : (r.songs || 1);
  // A no-break space, so "18 tracks" never splits across two lines
  const plural = (n, w) => `${n}\u00a0${w}${n === 1 ? '' : 's'}`;
  const meta = r => `${r.type} · ${plural(tracksOf(r), 'track')} · ${year(r)}`;
  const dot = ' <span class="dot">·</span> ';
  const newestFirst = list => list.slice().sort((a, b) => b.date.localeCompare(a.date));

  // Every release opens in the Music page's dialog. The # keeps the link working
  // in a new tab or without scripts; site.js reads it and drops it from the address.
  const releaseHref = r => `/latest/#${r.slug}`;

  function platformPills(r) {
    const links = r.streamingLinks || {};
    const pills = PLATFORMS.filter(([k]) => links[k]).map(([k, name, ic]) =>
      `<a class="pill pill-stream" data-platform="${k}" href="${esc(links[k])}" target="_blank" rel="noopener">${icon(ic)}${name}</a>`);
    if (r.link) pills.push(`<a class="pill" href="${esc(r.link)}" target="_blank" rel="noopener">All platforms <span class="arrow">↗</span></a>`);
    return pills.join('');
  }
  const trackList = r => r.tracks && r.tracks.length ? `<ol class="tracklist">${r.tracks.map(t => `<li>${esc(t)}</li>`).join('')}</ol>` : '';

  function releaseCard(r, i, tag = 'a', eager = false) {
    const attrs = tag === 'a' ? `href="${releaseHref(r)}"` : `type="button" data-slug="${r.slug}"`;
    return `<${tag} class="card card-btn" ${attrs} data-reveal style="--i:${i % 6}">
      <div class="cover"><img src="${cover(r)}" srcset="${coverSet(r)}" sizes="(max-width: 640px) 45vw, 300px" alt="${esc(r.title)} cover art"${eager ? '' : ' loading="lazy"'} width="800" height="800"></div>
      <div class="body"><h3>${esc(r.title)}</h3><div class="mono">${esc(meta(r))}</div></div>
    </${tag}>`;
  }

  /* ---------- home ---------- */
  const heroCta = r => `Listen to ${esc(r.title)} <span class="arrow">↓</span>`;

  const featured = r => `
          <a class="featured-cover" href="${releaseHref(r)}" data-reveal>
            <img src="${cover(r)}" srcset="${coverSet(r)}" sizes="(max-width: 640px) 132px, (max-width: 900px) 90vw, 544px" alt="${esc(r.title)} cover art" width="800" height="800" fetchpriority="high">
            <span class="tag">Latest release</span>
          </a>
          <div class="featured-info" data-reveal style="--i:1">
            <div class="eyebrow">${r.type}${dot}${fmtDate(r.date)}${dot}${plural(tracksOf(r), 'track')}</div>
            <h2>${esc(r.title)}</h2>
            <p class="with">with ${esc(r.artist)}</p>
            ${trackList(r)}
            <div class="featured-actions">${platformPills(r)}</div>
          </div>`;

  const recent = releases => releases.slice(1, 5).map((r, i) => releaseCard(r, i)).join('');

  /* ---------- music ---------- */
  function catalog(list) {
    const groups = new Map();
    list.forEach(r => { const y = year(r); if (!groups.has(y)) groups.set(y, []); groups.get(y).push(r); });
    let n = 0; // the first two covers sit at the top of the page, so they load right away
    return [...groups].map(([y, rs]) => `<section class="year-group">
            <h2 class="year-label">${y}</h2>
            <div class="release-grid">${rs.map((r, i) => releaseCard(r, i, 'button', n++ < 2)).join('')}</div>
          </section>`).join('');
  }

  /* ---------- videos ---------- */
  // An empty box that site.js turns into a poster with a play button
  const videoBox = v => `<div class="yt" data-id="${esc(v.id)}" data-title="${esc(v.title + ' by ' + v.artist)}"></div>`;
  const videoCaption = v => `<div class="video-caption"><h3>${esc(v.title)}</h3><span class="mono">${esc(v.artist)} · ${esc(v.kind)}</span></div>`;
  const videoCard = (v, i) => `<div data-reveal style="--i:${i % 6}">
      ${videoBox(v)}
      ${videoCaption(v)}
    </div>`;

  function filmCard(f, i) {
    const bits = [f.year, f.role, f.runtime, f.director && `dir. ${f.director}`].filter(Boolean).map(esc).join(' · ');
    const media = f.youtube
      ? `<div class="yt" data-id="${esc(f.youtube)}" data-title="${esc(f.title)}"${f.poster ? ` data-poster="${esc(f.poster)}"` : ''}></div>`
      : `<a class="card" href="${esc(f.url || '#')}" target="_blank" rel="noopener"><div class="cover" style="aspect-ratio:16/9">${f.poster ? `<img src="${esc(f.poster)}" alt="" loading="lazy">` : ''}</div></a>`;
    return `<div data-reveal style="--i:${i % 6}">${media}
      <div class="video-caption stack"><h3>${esc(f.title)}</h3><span class="mono">${bits}</span></div>
      ${f.note ? `<p class="film-note">${esc(f.note)}</p>` : ''}</div>`;
  }

  /* ---------- credits ---------- */
  const credits = releases => releases.map((r, i) => `
        <a class="credit" href="${releaseHref(r)}" data-reveal style="--i:${i % 6}">
          <img src="${cover(r, 'thumbs')}" alt="" loading="lazy" width="56" height="56">
          <div><h3>${esc(r.title)}</h3><div class="mono">${esc(r.artist)} · ${r.type} · ${plural(tracksOf(r), 'track')}</div></div>
          <span class="year"><span class="full">${fmtDate(r.date)}</span><span class="short">${year(r)}</span></span>
        </a>`).join('');

  /* ---------- the numbers in the stats rows ---------- */
  function stats(releases, videos, films) {
    const years = releases.map(r => +year(r));
    return {
      releases: releases.length,
      tracks: releases.reduce((n, r) => n + tracksOf(r), 0),
      years: years.length ? Math.max(...years) - Math.min(...years) + 1 : 0,
      artists: new Set(releases.map(r => r.artist)).size,
      videos: videos.length,
      films: films.length
    };
  }

  return {
    esc, cover, fmtDate, year, tracksOf, plural, dot, newestFirst, releaseHref,
    platformPills, trackList, releaseCard, heroCta, featured, recent, catalog,
    videoBox, videoCaption, videoCard, filmCard, credits, stats
  };
})();
