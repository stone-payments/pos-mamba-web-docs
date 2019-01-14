import path from 'path';
import fs from 'fs';
import getSections from '../_sections';
import getPkgInfo from '../_package';
import strings from '../_strings';
import constants from '../_constants.js';

let lookup;

export async function get(req, res, next) {
  const { slug } = req.params;

  if (process.env.NODE_ENV === 'development' || !lookup || !lookup.has(slug)) {
    lookup = new Map();

    const packageRoot = path.join(process.cwd(), 'packages/pos/docs');

    const hasProperSlug = fs
      .readdirSync(packageRoot)
      .filter(name => name.toLowerCase() === `${slug}.md`);

    if (!hasProperSlug.length) {
      console.warn(strings.errors.notFound);
      res.writeHead(404, {
        'Content-Type': 'application/json',
      });

      res.end(JSON.stringify({ error: strings.errors.notFound }));
      return;
    }

    const Slug = hasProperSlug[0];

    // Get directory README.md and CHANGELOG.md sections
    const sections = getSections(path.join(packageRoot, Slug), {
      anchorPath: `native/${slug}`,
      toFile: true,
    });

    const section = sections.find(
      item => item.slug.toLowerCase() === slug.toLowerCase(),
    );

    const components = {
      docs: {
        html: (section && section.html) || '',
        metadata: { title: slug.charAt(0).toUpperCase() + slug.slice(1) },
      },
      scope: constants.npmScope,
    };

    components.info = getPkgInfo(
      path.join(packageRoot, '../package.json'),
      section.file,
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
