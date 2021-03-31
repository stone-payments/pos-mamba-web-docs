import path from 'path'
import fs from 'fs'
import globby from 'globby'
import Prism from 'prismjs'
import loadLanguages from 'prismjs/components/index.js'
import { createGlob } from '../_utils'
import getSections from '../_sections'
import strings from '../_strings'
import constants from '../_constants'
import 'prism-svelte';

loadLanguages(['javascript', 'markup', 'svelte']);

let lookup

export async function get(req, res) {
  const { slug } = req.params

  if (process.env.NODE_ENV === 'development' || !lookup || !lookup.has(slug)) {
    lookup = new Map()

    const packageRoot = path.join(process.cwd(), 'mamba-sdk/packages/components/')

    const hasProperSlug = fs
      .readdirSync(packageRoot)
      .filter(name => name.toLowerCase() === slug)

    if (!hasProperSlug.length) {
      console.warn(strings.errors.notFound)
      res.writeHead(404, {
        'Content-Type': 'application/json',
      })

      res.end(JSON.stringify({ error: strings.errors.notFound }))
      return
    }

    const Slug = hasProperSlug[0]

    // Create globs with our desired files
    const globs = [...createGlob(`${Slug}/`)].filter(p => !!p)

    const exclude = ['**/node_modules/** ', 'dist/**']

    // Append exclude globs
    const patterns = [].concat(globs).concat((exclude || []).map(p => `!${p}`))

    const paths = await globby(patterns, {
      cwd: packageRoot,
      deep: true,
      onlyFiles: false,
      expandDirectories: {
        extensions: ['json'],
      },
    })

    const [packageJson] = ['package.json']

    if(__DEV__) console.log('paths: ', paths);

    const output  = await paths.reduce(
      async (pkg, file) => {
        const fileName = path.basename(file)
        const filePath = path.join(packageRoot, file)

        if (fileName === packageJson) {
          try {
            const source = fs.readFileSync(filePath, 'utf-8');
            const pkgInfo = JSON.parse(source);
            const { examples } = pkgInfo;

            if (examples) {
              let examplesWithSources;
              if (examples.length > 0) {
                examplesWithSources = examples.map(item => {
                  try {
                    const { path: itemPath } = item;
                    const _path = path.resolve(packageRoot, Slug, itemPath);
                    const exampleSource = fs.readFileSync(_path, 'utf-8');
                    const highlighted = Prism.highlight(exampleSource, Prism.languages.svelte, 'svelte');
                    item.source = `<pre class="code-block"><code class="language-svelte">${highlighted}</code></pre>`
                  } catch (e) {
                    if(__DEV__) console.log(e);
                  }

                  return item;
                });
              }
              return { slug, package: Slug, examples: examplesWithSources || examples };
            }
          } catch (e) {
            console.error(e);
          }
        }
        return pkg
      },
      {},
    )


    /* if (paths && paths.length > 0) paths.forEach(file => {
      const _path = path.resolve(packageRoot, file);
      const source = fs.readFileSync(_path, 'utf-8');
      output = source;
    }); */

    lookup.set(slug, __DEV__ ? JSON.stringify(output, null, 2) : JSON.stringify(output))
  }

  if (lookup.has(slug)) {
    res.set({
      'Content-Type': 'application/json',
      'Cache-Control': `max-age=${5 * 60 * 1e3}`, // 5 minutes
    })

    res.end(lookup.get(slug))
  }
}
