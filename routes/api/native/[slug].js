import path from 'path';
import globby from 'globby';
import { createApiGlob } from '../_utils';
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
      packagePath = path.resolve(path.dirname(__non_webpack_require__.resolve(`${constants.npmScope}/${constants.nativePackageName}/package.json`)));
    }catch(e) {
      res.writeHead(404, {
        'Content-Type': 'application/json',
      });

      res.end(JSON.stringify({
        error: 'not found',
      }));
    }
    
    // Get directory README.md and CHANGELOG.md sections
    const sections = getSections(`${packagePath}/docs`, slug.toLowerCase());
    const section = sections.find(item => item.slug === slug);
    const components = { docs: { html: section && section.html || '', metadata: { title: slug.charAt(0).toUpperCase() + slug.slice(1) }}, scope: constants.npmScope };
    components.info = getPkgInfo(`${packagePath}/package.json`, section.file)
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