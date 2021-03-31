import path from 'path'
import fs from 'fs'
import globby from 'globby'
import getSections from '../../_sections'
import strings from '../../_strings'
import constants from '../../_constants'
import { compile } from 'svelte/compiler/svelte.js';

let lookup

export async function get(req, res) {
  const { params: { folder, file }, query: { slug } } = req

  if (process.env.NODE_ENV === 'development' || !lookup || !lookup.has(file)) {
    lookup = new Map()

    const packageRoot = path.join(process.cwd(), 'mamba-sdk/packages/components/')

    let output = {};
    const globs = [slug, folder, file].join('/');

    if (slug) {
      const exclude = ['**/node_modules/** ', 'dist/**'];
      const patterns = [].concat(globs).concat((exclude || []).map(p => `!${p}`));

      const paths = await globby(patterns, {
        cwd: packageRoot,
        deep: false,
        onlyFiles: true,
        expandDirectories: {
          extensions: ['html', 'svelte'],
        },
      });

      if (paths && paths.length > 0) paths.forEach(file => {
        const _path = path.resolve(packageRoot, file);
        const source = fs.readFileSync(_path, 'utf-8');
        output = source;
      });
    }

    lookup.set(file, __DEV__ ? JSON.stringify(output, null, 2) : JSON.stringify(output))
  }

  if (lookup.has(file)) {
    res.set({
      'Content-Type': 'application/json',
      'Cache-Control': `max-age=${5 * 60 * 1e3}`, // 5 minutes
    })

    res.end(lookup.get(file))
  }
}
