import path from 'path'
import fs from 'fs'
import globby from 'globby'
import { createGlob } from '../_utils'
import getSections from '../_sections'
import getPkgInfo from '../_package'
import strings from '../_strings'
import constants from '../_constants'

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
        extensions: ['md', 'json', 'html'],
      },
    })

    const [README, packageJson] = ['README.md', 'package.json']

    let sections = null
    if(__DEV__) console.log('paths: ', paths);
    const examples = paths.filter(f => f.indexOf('/example/') !== -1)

    const hasExamples = examples && examples.length > 0;

    const components = paths.reduce(
      (pkg, file) => {
        const fileName = path.basename(file)
        const filePath = path.join(packageRoot, file)

        if (fileName === packageJson) {
          pkg.info = getPkgInfo(filePath, Slug)
        } else if (fileName === README) {
          // Get directory README.md
          if (!sections)
            sections = getSections(filePath, {
              mambaSlub: Slug,
              examplePath: packageRoot,
              anchorPath: `components/${slug}`,
              toFile: true,
              example: hasExamples ? examples : null,
            })

          pkg.docs = sections && sections.find(item => item.file === fileName)
        }

        return pkg
      },
      {
        docs: { html: '', metadata: { title: Slug } },
        changelog: {},
        hasExamples,
        scope: constants.npmScope,
      },
    )

    lookup.set(slug, __DEV__ ? JSON.stringify(components, null, 2) : JSON.stringify(components))
  }

  if (lookup.has(slug)) {
    res.set({
      'Content-Type': 'application/json',
      'Cache-Control': `max-age=${5 * 60 * 1e3}`, // 5 minutes
    })

    res.end(lookup.get(slug))
  }
}
