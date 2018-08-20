import path from 'path';
import globby from 'globby';
import { createGlob } from '../_utils';
import getSections from '../_sections';
import getPkgInfo from '../_package';
import constants from '../_constants.js';
import capitalize from 'lodash.capitalize';

let lookup;

export async function get(req, res) {
  const { slug } = req.params;
  
  console.info('Slug: ', slug);

  if (!lookup || process.env.NODE_ENV !== 'production') {

    lookup = new Map();

    const Slug = capitalize(slug);
    const packageRoot = path.resolve(`Packages/${Slug}`);

    // Create globs with our desired files
    const globs = [
      ...createGlob('', {
        cwd: packageRoot,
      }),
    ].filter(p => !!p);

    const exclude = ['**/node_modules/** ', 'dist/**'];
  
    // Append exclude globs
    const patterns = []
      .concat(globs)
      .concat((exclude || []).map(p => `!${p}`));

    const files = await globby(patterns);

    const components = files
      .reduce((pkg, file) => {

        const fileName = path.basename(file);

        switch(fileName) {
          case "package.json":
            pkg.info = getPkgInfo(path.join(packageRoot, fileName), Slug);
            break;
          case "README.md":

            // Get directory README.md and CHANGELOG.md sections
            const sections = getSections(packageRoot, fileName, '', slug);
            pkg.docs = sections && sections.find(item => item.file === fileName);
            break;
        }

        return pkg
      }, { docs: { html: '', metadata: { title: Slug }}, changelog: {}, scope: constants.npmScope });

    lookup.set(slug, JSON.stringify(components));
  }

  if (lookup.has(slug)) {
    
    res.set({
      'Content-Type': 'application/json',
      // 'Cache-Control': `max-age=${5 * 60 * 1e3}`, // 5 minutes
    });

    res.end(lookup.get(slug))
  }
}