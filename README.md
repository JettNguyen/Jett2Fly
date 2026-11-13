# [Jett2Fly.com](https://jett2fly.com)

Static site, hosted on GitHub Pages straight from `main`.

| File | What it is |
| --- | --- |
| `releases.js` | All music, videos and playlists. Edit this to add a release. |
| `render.js` | The markup for releases, videos and credits, shared by `site.js` and `build.js`. |
| `site.js` | Shared behaviour: waveform, reveals, release dialog, video facades, clean addresses. |
| `build.js` | Writes the releases, videos and credits into the pages, with structured data, so search engines and AI crawlers can read them without running scripts. |
| `indexnow.js` | Tells Bing the pages changed. A workflow runs it after each deploy; the `<key>.txt` file at the root has to stay. |
| `style.css` | Every style, for every page. |
| `images/covers/` | 800px square cover JPEGs, named by slug. |
| `images/cards/` | 480px versions of the same. Phones and the release cards load these. |
| `images/thumbs/` | 240px versions of the same. |
| `images/original/` | Untouched source art (not used by the site). |

## Adding a release

1. Save the cover as `images/covers/<slug>.jpg` (800×800), `images/cards/<slug>.jpg` (480×480) and
   `images/thumbs/<slug>.jpg` (240×240). `node build.js` stops and names any that are missing.
2. Add an entry to the top of `RELEASES` in `releases.js`. The comment at the top of that file lists the fields.
3. Run `node build.js` and commit the pages it changes along with `releases.js`.

The home page, discography, credits and stats all update from that one entry. Visitors see a new
release even if step 3 is skipped, since `site.js` draws everything from `releases.js` in the
browser, but search engines and AI crawlers only see what `build.js` wrote into the pages.

## Previewing

    npx serve -l 4180 .

Then open http://localhost:4180.

## Addresses

The address bar never shows `index.html` or a `#`. Links still carry their `#` so they work in a new
tab, but `site.js` scrolls or opens the release without putting it in the address. Don't add links
or code that put one there.
