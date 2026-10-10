import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// Cloudflare Pages serves these static HTML shells at /ua, /en, and /it.
// React supplies the page; search crawlers can read localized SEO metadata
// without waiting for the JavaScript bundle to execute.
const root = process.cwd();
const content = await readFile(resolve(root, 'src/content.ts'), 'utf8');
const builtHTML = await readFile(resolve(root, 'dist/index.html'), 'utf8');
const matches = [...content.matchAll(/metaTitle: '([^']+)', metaDescription: '([^']+)'/g)];
if (matches.length !== 3) throw new Error('Expected metadata for UA, EN and IT in src/content.ts');
const meta = Object.fromEntries(['ua', 'en', 'it'].map((lang, i) =>
  [lang, { title: matches[i][1], description: matches[i][2] }]
));

const escape = (value) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
function substitute(html, pattern, value, label) {
  if (!pattern.test(html)) throw new Error('Missing metadata placeholder: ' + label);
  return html.replace(pattern, value);
}
for (const language of ['ua', 'en', 'it']) {
  const { title, description } = meta[language];
  const url = 'https://marinaravliuk.com/' + language;
  const ogLocale = language === 'ua' ? 'uk_UA' : language === 'en' ? 'en_US' : 'it_IT';
  let html = builtHTML;
  html = substitute(html, /<html lang="[^"]*"/, '<html lang="' + (language === 'ua' ? 'uk' : language) + '"', 'html-lang');
  html = substitute(html, /<title>[^<]*<\/title>/, '<title>' + escape(title) + '</title>', 'title');
  html = substitute(html, /<meta name="description" content="[^"]*"\s*\/>/, '<meta name="description" content="' + escape(description) + '" />', 'description');
  html = substitute(html, /<link rel="canonical" href="[^"]*"\s*\/>/, '<link rel="canonical" href="' + url + '" />', 'canonical');
  for (const key of ['og:title', 'twitter:title']) {
    html = substitute(html, new RegExp('<meta (property|name)="' + key + '" content="[^"]*"\\s*\\/>'), '<meta ' + (key.startsWith('og:') ? 'property' : 'name') + '="' + key + '" content="' + escape(title) + '" />', key);
  }
  for (const key of ['og:description', 'twitter:description']) {
    html = substitute(html, new RegExp('<meta (property|name)="' + key + '" content="[^"]*"\\s*\\/>'), '<meta ' + (key.startsWith('og:') ? 'property' : 'name') + '="' + key + '" content="' + escape(description) + '" />', key);
  }
  html = substitute(html, /<meta property="og:url" content="[^"]*"\s*\/>/, '<meta property="og:url" content="' + url + '" />', 'og:url');
  html = substitute(html, /<meta property="og:locale" content="[^"]*"\s*\/>/, '<meta property="og:locale" content="' + ogLocale + '" />', 'og:locale');
  const directory = resolve(root, 'dist', language);
  await mkdir(directory, { recursive: true });
  await writeFile(resolve(directory, 'index.html'), html, 'utf8');
  console.log('SEO HTML ready:', '/' + language);
}
