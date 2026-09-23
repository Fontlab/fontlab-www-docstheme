// this_file: scripts/cascade.mjs
import postcss from 'postcss';
import layers from '@csstools/postcss-cascade-layers';
import nesting from 'postcss-nesting';
import { resolve } from 'node:path';

/** Transform the complete CSS bundle together, then retain its delivery files. */
export async function compileCascade(files) {
  const root = postcss.root();
  const outputs = new Map();
  for (const [name, css] of Object.entries(files)) {
    root.append(postcss.parse(css, { from: name }));
    outputs.set(resolve(name), { name, root: postcss.root() });
  }
  const result = await postcss([nesting(), layers()]).process(root, { from: undefined, map: false });
  if (result.warnings().length) throw new Error(result.warnings().join('\n'));
  for (const node of [...result.root.nodes]) {
    const output = outputs.get(node.source?.input.from);
    if (!output) throw new Error(`Missing CSS provenance: ${node.toString().slice(0, 100)}`);
    output.root.append(node);
  }
  return Object.fromEntries([...outputs.values()].map(({ name, root }) => [name, root.toString()]));
}
