import path from 'path';
import globby from 'globby';
import { createGlob } from '../_utils';
import getSections from '../_sections';
import getPkgInfo from '../_package';
import constants from '../_constants.js';

let lookup;

export async function get(req, res) {
  const { slug } = req.params;

  if (!lookup || process.env.NODE_ENV !== 'production') {

    lookup = new Map();

    // Resolve package absolute path from slug, through package.json
    // Webpack performs a static analyse at build time with require.resolve function. It doesn't try to infer variables, so dont even try call it with variables like requeire.resolve(var)
    let packagePath;
    
    try {
      if (slug === 'progress') {
        packagePath = path.resolve(path.dirname(__non_webpack_require__.resolve(`/Users/jaimecostamarques/Workspace/pos-mamba-web/packages/components/Progress/package.json`)));
      }
      else {
        packagePath = path.resolve(path.dirname(__non_webpack_require__.resolve(`${constants.npmScope}/${slug}/package.json`)));
      }
    }catch(e) {
      res.writeHead(404, {
        'Content-Type': 'application/json',
      });

      res.end(JSON.stringify({
        error: 'not found',
      }));
    }
    
    console.log('packagePath: ', packagePath);
    let packageRoot = path.resolve(packagePath);

    // Create globs with our desired files
    const globs = [
      ...createGlob(''),
    ].filter(p => !!p);

    const exclude = ['**/node_modules/** ', 'dist/**'];
  
    // Append exclude globs
    const patterns = []
      .concat(globs)
      .concat((exclude || []).map(p => `!${p}`));

    const files = await globby(patterns, {
      cwd: packageRoot,
    });
    
    // Get directory README.md and CHANGELOG.md sections
    const sections = getSections(packagePath, 'README');

    const components = files
      .reduce((pkg, file) => {
        const ext = path.extname(file);
        const filePath = [packageRoot, file].join('/');
        const filename = file.replace(ext, '');
        
        switch(filename) {
          case "package":
            pkg.info = getPkgInfo(filePath, path.basename(packagePath));
            break;
          case "README":
            pkg.docs = sections.find(item => item.slug === filename);
            break;
          case "CHANGELOG":
            pkg.changelog = sections.find(item => item.slug === filename);
            break;
        }

        return pkg
      }, { docs: { html: '', metadata: { title: slug.charAt(0).toUpperCase() + slug.slice(1) }}, changelog: {}, scope: constants.npmScope });

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