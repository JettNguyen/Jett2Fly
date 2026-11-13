/* ==========================================================================
   Jett2Fly: build.js
   Writes the music, videos and credits from releases.js into the pages
   themselves, with structured data saying who Jett2Fly is and what he has
   produced, so search engines and AI crawlers can read it all without
   running any scripts. (Most AI crawlers don't run them.)

   The site deploys straight from the repo, so run this after changing
   releases.js and commit the pages it changes:

     node build.js

   site.js still draws everything again in the browser, so a visitor always
   sees the current releases.js even if this wasn't run. Only crawlers would
   be behind.
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = __dirname;
const SITE = 'https://jett2fly.com';

// releases.js and render.js expect a browser window, so run them against a stand-in
const sandbox = vm.createContext({ window: {} });
for (const file of ['releases.js', 'render.js']) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, file), 'utf8'), sandbox, { filename: file });
}
const R = sandbox.window.J2F;
const RELEASES = R.newestFirst(sandbox.window.RELEASES);
const VIDEOS = sandbox.window.VIDEOS;
const FILMS = sandbox.window.FILMS || [];

/* ---------- check the data before writing anything ---------- */
for (const r of RELEASES) {
  for (const size of ['covers', 'thumbs']) {
    if (!fs.existsSync(path.join(ROOT, 'images', size, `${r.slug}.jpg`))) throw new Error(`${r.slug} has no images/${size}/${r.slug}.jpg`);
  }
}
for (const v of VIDEOS) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v.date || '')) throw new Error(`the ${v.title} video needs a "date"`);
}

/* ---------- page editing ----------
   Each page marks the spots this fills with <!-- build:name --> and
   <!-- /build:name -->. The build stops if a page has lost one, so a changed
   page can't quietly ship without its text. */
function region(html, file, name, markup) {
  const re = new RegExp(`(<!-- build:${name} -->)[\\s\\S]*?(<!-- /build:${name} -->)`);
  if (!re.test(html)) throw new Error(`${file} has no build:${name} spot`);
  return html.replace(re, (m, open, close) => open + markup + close);
}

// The stats rows: <span data-count="releases">25</span>
const counts = html => html.replace(/(<span data-count="(\w+)">)[^<]*(<\/span>)/g, (m, open, key, close) => {
  const values = R.stats(RELEASES, VIDEOS, FILMS);
  if (!(key in values)) throw new Error(`no number for data-count="${key}"`);
  return open + values[key] + close;
});

// The "Sound for film" section shows once FILMS has an entry
const films = (html, file) => region(html, file, 'films', FILMS.map(R.filmCard).join(''))
  .replace(/(<section\b[^>]*\bid="film"[^>]*?)(\s+hidden)?>/, (m, open) => `${open}${FILMS.length ? '' : ' hidden'}>`);

// Structured data as a script tag. "<" is escaped so no title can end the tag early.
const jsonLd = data =>
  `<script type="application/ld+json">\n${JSON.stringify({ '@context': 'https://schema.org', ...data }, null, 2).replace(/</g, '\\u003c')}\n  </script>`;

/* ---------- structured data ---------- */
const PERSON_ID = `${SITE}/#person`;
const producer = { '@type': 'Person', '@id': PERSON_ID, name: 'Jett2Fly', url: `${SITE}/` };

// Artists with their own site get the same id that site uses, so search
// engines can tell it's one artist. sywavy.com calls SyWavy https://sywavy.com/#artist.
const ARTISTS = {
  SyWavy: { '@type': 'MusicGroup', '@id': 'https://sywavy.com/#artist', name: 'SyWavy', url: 'https://sywavy.com/' }
};
const RELEASE_TYPE = { Album: 'AlbumRelease', EP: 'EPRelease', Single: 'SingleRelease' };

// Store pages only, without tracking parameters
const storePage = url => {
  const m = url.match(/^https:\/\/(open\.spotify\.com|music\.apple\.com|soundcloud\.com|(?:www\.)?youtube\.com|youtu\.be)\//);
  if (!m) return null;
  return /youtube|youtu\.be/.test(m[1]) ? url : url.split('?')[0];
};

const albumData = r => ({
  '@type': 'MusicAlbum',
  name: r.title,
  url: r.link,
  image: `${SITE}${R.cover(r)}`,
  datePublished: r.date,
  ...(RELEASE_TYPE[r.type] && { albumReleaseType: `https://schema.org/${RELEASE_TYPE[r.type]}` }),
  numTracks: R.tracksOf(r),
  byArtist: ARTISTS[r.artist] || { '@type': 'MusicGroup', name: r.artist },
  producer,
  ...(r.tracks && { track: r.tracks.map((name, i) => ({ '@type': 'MusicRecording', name, position: i + 1 })) }),
  sameAs: Object.values(r.streamingLinks || {}).map(storePage).filter(Boolean)
});

const discography = {
  '@type': 'ItemList',
  name: 'Releases produced by Jett2Fly',
  numberOfItems: RELEASES.length,
  itemListElement: RELEASES.map((r, i) => ({ '@type': 'ListItem', position: i + 1, item: albumData(r) }))
};

const videoData = v => ({
  '@type': 'VideoObject',
  name: `${v.title} (${v.kind})`,
  description: `${v.kind} for ${v.artist}'s "${v.title}", produced by Jett2Fly.`,
  thumbnailUrl: `https://i.ytimg.com/vi/${v.id}/maxresdefault.jpg`,
  uploadDate: v.date,
  url: `https://www.youtube.com/watch?v=${v.id}`,
  embedUrl: `https://www.youtube.com/embed/${v.id}`,
  creator: ARTISTS[v.artist] || { '@type': 'MusicGroup', name: v.artist }
});

/* ---------- pages ---------- */
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
let changed = 0;
function write(file, html) {
  if (html === read(file)) return;
  fs.writeFileSync(path.join(ROOT, file), html);
  changed++;
  console.log(`  wrote ${file}`);
}

// Home
{
  const file = 'index.html';
  let html = read(file);
  const latest = RELEASES[0], video = VIDEOS[0];
  // Who he is: the follow links on the home page, plus his MusicBrainz entry
  // (only the links: the icons inside them have hrefs like #i-instagram too)
  const follow = [...(html.match(/<ul class="social-list">[\s\S]*?<\/ul>/) || [''])[0].matchAll(/<a\b[^>]*\shref="(https?:[^"]+)"/g)].map(m => m[1]);
  if (!follow.length) throw new Error('index.html has no follow links in .social-list');
  const description = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  html = region(html, file, 'data', jsonLd({
    '@graph': [
      { '@type': 'WebSite', '@id': `${SITE}/#website`, url: `${SITE}/`, name: 'Jett2Fly', publisher: { '@id': PERSON_ID } },
      {
        ...producer,
        image: `${SITE}/images/logo.png`,
        jobTitle: ['Music producer', 'Sound designer', 'Film composer'],
        description,
        email: 'jett2fly@gmail.com',
        sameAs: [...follow, 'https://musicbrainz.org/artist/e065c1e5-39be-4824-9a4c-f59d3e79d0da']
      }
    ]
  }));
  html = region(html, file, 'cta', R.heroCta(latest));
  html = region(html, file, 'featured', R.featured(latest));
  html = region(html, file, 'recent', R.recent(RELEASES));
  html = region(html, file, 'video-title', R.esc(video.title));
  html = region(html, file, 'video-meta', `${R.esc(video.artist)} · ${R.esc(video.kind)}`);
  html = films(html, file);
  write(file, counts(html));
}

// Music
{
  const file = 'latest/index.html';
  let html = read(file);
  html = region(html, file, 'data', jsonLd(discography));
  html = region(html, file, 'catalog', R.catalog(RELEASES));
  write(file, html);
}

// Videos
{
  const file = 'videos/index.html';
  let html = read(file);
  const [first, ...rest] = VIDEOS;
  html = region(html, file, 'data', jsonLd({
    '@type': 'ItemList',
    name: 'Music videos for songs produced by Jett2Fly',
    numberOfItems: VIDEOS.length,
    itemListElement: VIDEOS.map((v, i) => ({ '@type': 'ListItem', position: i + 1, item: videoData(v) }))
  }));
  html = region(html, file, 'video-featured', first ? `${R.videoBox(first)}\n          ${R.videoCaption(first)}` : '');
  html = region(html, file, 'video-grid', rest.map(R.videoCard).join(''));
  html = films(html, file);
  write(file, html);
}

// Credits
{
  const file = 'credits/index.html';
  let html = read(file);
  html = region(html, file, 'data', jsonLd(discography));
  html = region(html, file, 'credits', R.credits(RELEASES));
  write(file, counts(html));
}

console.log(changed ? `${changed} page${changed === 1 ? '' : 's'} updated.` : 'Every page was already up to date.');
