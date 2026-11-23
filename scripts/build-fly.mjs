// this_file: scripts/build-fly.mjs
// Builds the fly-january theme assets into theme/fly_january/assets/fly/ (committed: the
// wheel ships them and site builds need no Node):
// - fly.css: src/fly/fly.css with its @imports inlined in order, cascade layers flattened
//   into selector weight (scripts/cascade.mjs), since MaterialX's CSS is unlayered.
// - fly-tokens.css: the token files alone, for pages outside MkDocs.
// - fly-utilities.css: every named Tailwind utility (Tailwind's own class list, no
//   arbitrary values, no mask-*), tw: prefixed, !important in native layer fly.utilities.
// - fly.js, fly-bridge.js, fly-debug.js: copied from src/fly/js/.
import { execFileSync } from 'node:child_process';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import { compileCascade } from './cascade.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SRC = join(ROOT, 'src/fly');
export const OUT = join(ROOT, 'theme/fly_january/assets/fly');
export const LAYERS = ['fly.tokens', 'fly.base', 'fly.layout', 'fly.components', 'fly.chrome', 'fly.utilities'];
export const LAYER_STATEMENT = `@layer ${LAYERS.join(', ')};`;
export const SCRIPTS = ['fly.js', 'fly-bridge.js', 'fly-debug.js'];
const IMPORT = /^@import '([^']+)';$/gm;
const TAILWIND_SKIP = ['mask-', '-mask-'];
// Responsive variants (tw:sm:flex-row, tw:md:w-auto) for the layout families the page
// prototypes used: display, flex and grid, sizing, alignment, text alignment, spacing, order.
// Every utility at every breakpoint would triple the file.
export const VARIANTS = ['sm', 'md'];
export const VARIANT_FAMILIES = /^(?:-?(?:m|p)[trblxyse]?-|(?:block|inline|inline-block|inline-flex|flex|grid|hidden|contents|flow-root|table)$|flex-|grid-|col-|row-|gap-|space-[xy]-|w-|h-|min-w-|max-w-|min-h-|max-h-|size-|items-|justify-|content-|self-|place-|order-|grow|shrink|basis-|text-(?:left|center|right|justify|start|end)$|float-|clear-|overflow-)/;
export const TAILWIND_CORE = `@import "tailwindcss/theme.css" prefix(tw);
@import "tailwindcss/utilities.css" layer(fly.utilities) important source(none) prefix(tw);
@custom-variant dark (&:where([data-md-color-scheme=slate], [data-md-color-scheme=slate] *));
@theme {
  --breakpoint-lg: 60rem;
  --breakpoint-xl: 76.25rem;
  --breakpoint-2xl: 100rem;
}
`;
const header = (name, from) => `/* this_file: theme/fly_january/assets/fly/${name} (built by scripts/build-fly.mjs from ${from}; do not edit) */\n`;

/** The entry's imports, in order, as paths relative to src/fly. */
export async function entryImports() {
  const entry = await readFile(join(SRC, 'fly.css'), 'utf8');
  return [...entry.matchAll(IMPORT)].map((match) => match[1]);
}

/** The files' CSS concatenated, comments dropped (layer flattening would strand them). */
async function inline(paths) {
  const css = (await Promise.all(paths.map((path) => readFile(join(SRC, path), 'utf8')))).join('\n');
  const root = postcss.parse(css);
  root.walkComments((comment) => comment.remove());
  return root.toString();
}

/** fly.css and fly-tokens.css as strings, layers flattened. */
export async function buildFlyCss() {
  const imports = await entryImports();
  const tokens = imports.filter((path) => path.startsWith('tokens/'));
  const fly = await compileCascade({ 'fly.css': `${LAYER_STATEMENT}\n${await inline(imports)}` });
  const only = await compileCascade({ 'fly-tokens.css': `${LAYER_STATEMENT}\n${await inline(tokens)}` });
  return {
    'fly.css': header('fly.css', 'src/fly/fly.css') + fly['fly.css'],
    'fly-tokens.css': header('fly-tokens.css', 'src/fly/tokens') + only['fly-tokens.css'],
  };
}

/** Every named utility of the installed Tailwind, prefixed, minus mask-*. */
async function tailwindClasses() {
  const base = join(ROOT, 'node_modules/tailwindcss/');
  const tailwind = createRequire(base)('tailwindcss');
  const loadStylesheet = async (id) => {
    const path = base + (id.replace(/^tailwindcss\/?/, '') || 'index.css');
    return { path, base, content: await readFile(path, 'utf8') };
  };
  // __unstable__loadDesignSystem is a private Tailwind API; package-lock.json pins the version.
  const design = await tailwind.__unstable__loadDesignSystem(TAILWIND_CORE, { base, loadStylesheet });
  const names = design.getClassList().map(([name]) => name);
  if (!names.length) throw new Error('Tailwind class list is empty');
  const kept = names.filter((name) => !TAILWIND_SKIP.some((skip) => name.startsWith(skip)));
  const responsive = kept.filter((name) => VARIANT_FAMILIES.test(name)).flatMap((name) => VARIANTS.map((variant) => `${variant}:${name}`));
  return [...kept, ...responsive].map((name) => `tw:${name}`);
}

async function buildUtilities() {
  const work = join(ROOT, '.cache/fly-tailwind');
  await mkdir(work, { recursive: true });
  await writeFile(join(work, 'classes.txt'), `${(await tailwindClasses()).join('\n')}\n`);
  await writeFile(join(work, 'input.css'), `${TAILWIND_CORE}@source "./classes.txt";\n`);
  const output = join(work, 'fly-utilities.css');
  execFileSync('node', [join(ROOT, 'node_modules/@tailwindcss/cli/dist/index.mjs'), '-i', join(work, 'input.css'), '-o', output, '--minify'], { stdio: 'inherit', cwd: work });
  const css = await readFile(output, 'utf8');
  if (!css.includes('@layer fly.utilities')) throw new Error('Tailwind output lacks @layer fly.utilities');
  return header('fly-utilities.css', 'scripts/build-fly.mjs TAILWIND_CORE') + css;
}

export async function buildFly() {
  await mkdir(OUT, { recursive: true });
  for (const [name, css] of Object.entries(await buildFlyCss())) await writeFile(join(OUT, name), css);
  for (const name of SCRIPTS) await copyFile(join(SRC, 'js', name), join(OUT, name));
  await writeFile(join(OUT, 'fly-utilities.css'), await buildUtilities());
  console.log(`Built fly assets in ${OUT.slice(ROOT.length)}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) await buildFly();
