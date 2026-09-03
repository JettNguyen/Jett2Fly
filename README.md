# [Jett2Fly.com](https://jett2fly.com)

Static site, hosted on GitHub Pages. No build step.

| File | What it is |
| --- | --- |
| `releases.js` | All music, videos and playlists. Edit this to add a release. |
| `style.css` | Every style, for every page. |
| `site.js` | Shared behaviour: waveform, reveals, release dialog, video facades. |
| `images/covers/` | 800px square cover JPEGs, named by slug. |
| `images/thumbs/` | 240px versions of the same. |
| `images/original/` | Untouched source art (not used by the site). |

## Adding a release

1. Save the cover as `images/covers/<slug>.jpg` (800×800) and `images/thumbs/<slug>.jpg` (240×240).
2. Add an entry to the top of `RELEASES` in `releases.js`. The comment at the top of that file lists the fields.

The home page, discography, credits and stats all update from that one entry.
