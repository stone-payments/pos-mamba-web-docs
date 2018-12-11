import path from 'path';
import fs from 'fs';
import globby from 'globby';
import { createGlob } from '../_utils';
import getSections from '../_sections';
import getPkgInfo from '../_package';
import strings from '../_strings';
import constants from '../_constants';

let lookup;

export async function get(req, res) {
  const { slug } = req.params;

  if (process.env.NODE_ENV === 'development' || !lookup || !lookup.has(slug)) {
    lookup = new Map();

    const packageRoot = path.join(process.cwd(), 'packages/components/');

    const hasProperSlug = fs
      .readdirSync(packageRoot)
      .filter(name => name.toLowerCase() === slug);

    if (!hasProperSlug.length) {
      console.warn(strings.errors.notFound);
      res.writeHead(404, {
        'Content-Type': 'application/json',
      });

      res.end(JSON.stringify({ error: strings.errors.notFound }));
      return;
    }

    const Slug = hasProperSlug[0];

    // Create globs with our desired files
    const globs = [...createGlob(`${Slug}/`)].filter(p => !!p);

    const exclude = ['**/node_modules/** ', 'dist/**'];

    // Append exclude globs
    const patterns = [].concat(globs).concat((exclude || []).map(p => `!${p}`));

    const paths = await globby(patterns, {
      cwd: packageRoot,
      deep: true,
      onlyFiles: false,
      expandDirectories: {
        extensions: ['md', 'json', 'html'],
      },
    });

    const [README, packageJson] = ['README.md', 'package.json'];

    let sections = null;

    let examples = paths.filter(f => f.indexOf('/example/') !== -1);

    const components = paths.reduce(
      (pkg, file) => {
        const fileName = path.basename(file);
        const filePath = path.join(packageRoot, file);

        switch (fileName) {
          case packageJson:
            pkg.info = getPkgInfo(filePath, Slug);
            break;

          case README:
            // Get directory README.md
            if (!sections)
              sections = getSections(filePath, {
                mambaSlub: Slug,
                examplePath: packageRoot,
                examples: examples,
                toFile: true,
              });

            pkg.docs =
              sections && sections.find(item => item.file === fileName);

            break;
        }

        return pkg;
      },
      {
        docs: { html: '', metadata: { title: Slug } },
        changelog: {},
        scope: constants.npmScope,
      },
    );

    lookup.set(slug, JSON.stringify(components));
  }

  if (lookup.has(slug)) {
    res.set({
      'Content-Type': 'application/json',
      'Cache-Control': `max-age=${5 * 60 * 1e3}`, // 5 minutes
    });

    res.end(lookup.get(slug));
  }
}
