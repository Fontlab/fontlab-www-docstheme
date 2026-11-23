// this_file: scripts/check-links.mjs
// Link check over the built site: every internal href/src/srcset in every HTML file of
// <dir> (default docs/) must name an existing file. Internal means relative, root-absolute
// under the site path, or absolute under the site URL. Query strings (?v=) and fragments
// are ignored; a directory URL needs its index.html; a malformed percent-escape is broken.
// Exits 1 and lists the broken links.
// Run by ../build.sh after the site build; usage: node scripts/check-links.mjs [dir].
import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const SITE_URL = 'https://fontlab.dev/fontlab-www-docstheme/';
const SITE_PATH = new URL(SITE_URL).pathname;
const ATTR = /\s(?:href|src|srcset|data-src)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
const OPAQUE = /<!--[\s\S]*?-->|<(script|style|pre|code|textarea)\b[\s\S]*?<\/\1\s*>/gi;

async function exists(path) {
  try {
    const info = await stat(path);
    return info.isFile() || (info.isDirectory() && (await stat(join(path, 'index.html'))).isFile());
  } catch {
    return false;
  }
}

/** The file a link points at, or null when the link is external or page-local. */
export function target(root, page, link) {
  let url = link.trim().replace(/[?#].*$/s, '');
  if (!url || /^(mailto|tel|data|javascript|blob):/i.test(link)) return null;
  if (url.startsWith(SITE_URL)) url = SITE_PATH + url.slice(SITE_URL.length);
  if (/^[a-z][a-z0-9+.-]*:|^\/\//i.test(url)) return null;
  if (url.startsWith('/')) return url.startsWith(SITE_PATH) ? join(root, decodeURI(url.slice(SITE_PATH.length))) : join(root, '__outside_site__', url);
  return resolve(dirname(page), decodeURI(url));
}

export async function checkLinks(root) {
  const pages = (await readdir(root, { recursive: true, withFileTypes: true }))
    .filter((e) => e.isFile() && e.name.endsWith('.html'))
    .map((e) => join(e.parentPath, e.name));
  const broken = [];
  let count = 0;
  for (const page of pages) {
    const html = (await readFile(page, 'utf8')).replace(OPAQUE, (m) => (/^<script\b[^>]*\ssrc=/i.test(m) ? m.slice(0, m.indexOf('>') + 1) : ''));
    for (const m of html.matchAll(ATTR)) {
      const value = m[1] ?? m[2];
      const links = /srcset/i.test(m[0].split('=')[0]) ? value.split(',').map((part) => part.trim().split(/\s+/)[0]) : [value];
      for (const link of links) {
        let path;
        try {
          path = target(root, page, link);
        } catch (error) {
          if (!(error instanceof URIError)) throw error;
          count += 1;
          broken.push(`${relative(root, page)}: ${link} (malformed URL)`);
          continue;
        }
        if (path === null) continue;
        count += 1;
        if (!(await exists(path))) broken.push(`${relative(root, page)}: ${link}`);
      }
    }
  }
  return { pages: pages.length, links: count, broken };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const root = resolve(process.argv[2] ?? fileURLToPath(new URL('../docs', import.meta.url)));
  const { pages, links, broken } = await checkLinks(root);
  console.log(`Checked ${links} internal links in ${pages} pages under ${root}: ${broken.length} broken`);
  for (const line of broken) console.log(`  ${line}`);
  if (broken.length) process.exit(1);
}
