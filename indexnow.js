/*
  Tells Bing (and the other IndexNow search engines) that the site changed,
  so they read the new pages the same day instead of whenever they next come
  around. Bing's index feeds ChatGPT's search and Copilot.

  .github/workflows/indexnow.yml runs it after each GitHub Pages deploy. It
  sends every page in sitemap.xml, since there are only a few.

    node indexnow.js

  IndexNow checks that the site owns the key by loading https://jett2fly.com/<KEY>.txt,
  so that file must stay at the root of the repo with the key as its only text.
*/
const fs = require('fs');
const path = require('path');

const HOST = 'jett2fly.com';
const KEY = '8e97d4ab163ce6d50bb6bf734ed62da1';

async function send() {
  const sitemap = fs.readFileSync(path.join(__dirname, 'sitemap.xml'), 'utf8');
  const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
    signal: AbortSignal.timeout(30000)
  });
  // 200 and 202 both mean it was taken; 202 means the key is still being checked
  console.log(`IndexNow answered ${res.status} for ${urlList.length} pages.`);
  if (!res.ok) {
    console.log(await res.text());
    process.exit(1);
  }
}

send();
