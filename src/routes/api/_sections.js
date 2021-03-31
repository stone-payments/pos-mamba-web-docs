/* eslint-disable no-cond-assign */
import fs from 'fs'
import { basename, extname } from 'path'

import * as fleece from 'golden-fleece'
import capitalize from 'lodash.capitalize'
import cheerio from 'cheerio'
import marked from 'marked'
import Prism from 'prismjs'
import loadLanguages from 'prismjs/components/index.js'
import 'prism-svelte';

loadLanguages(['javascript', 'jsx', 'css', 'typescript', 'markup', 'bash', 'json']);

import { unescape, insertTag, replaceTag, createBuffer, slugify } from './_utils'
import processMarkdown from './_processMarkdown'
import classNameUtils from './_classNameUtils'
import strings from './_strings'
import escape from './_escape'
import './_processLineNumbers'

// This function extract metadata in code comments
// parse it and return the js object using fleece
function extractMeta(line, lang = 'markup') {
  try {
    if (lang === 'html' && line.startsWith('<!--') && line.endsWith('-->')) {
      return fleece.evaluate(line.slice(4, -3).trim())
    }

    if (
      lang === 'js' ||
      (lang === 'json' && line.startsWith('/*') && line.endsWith('*/'))
    ) {
      return fleece.evaluate(line.slice(2, -2).trim())
    }
  } catch (err) {
    // TODO report these errors, don't just squelch them
    return null
  }
}

// https://github.com/darkskyapp/string-hash/blob/master/index.js
function getHash(str) {
  let hash = 5381
  let i = str.length

  while (i--) hash = ((hash << 5) - hash) ^ str.charCodeAt(i)
  return (hash >>> 0).toString(36)
}

// const SELECTOR = 'pre>code[class*="language-"]'

export const demos = new Map()

/*
  options: {
    anchorPath; String
    mambaSlub: String
    examplePath: String
    toFile: Boolean
  }
*/
export default function(path, options = {}) {
  let read = [path]

  if (!options.toFile) {
    try {
      read = fs.readdirSync(path)
    } catch (e) {
      return null
    }

    read = read.filter(file => file[0] !== '.' && extname(file) === '.md')
  }

  return read.map(file => {
    const sectionSlug = file.replace(/^\d+-/, '').replace(/\.md$/, '')
    const filePath = (options.toFile ? '' : `${path}/`).concat(file)

    const markdown = fs.readFileSync(filePath, 'utf-8');

    const { content, metadata } = processMarkdown(
      markdown,
      `${options.examplePath}`,
    )

    const groups = []
    let group = null
    let uid = 1

    const renderer = new marked.Renderer();

    renderer.code = (code, lang) => {
      const properLanguage = (lang === 'js' ? 'javascript' : lang) || 'javascript';
      let source = code;

      if (Prism.languages[lang]) {
        source = Prism.highlight(code, Prism.languages[lang], lang);
      }

      source = `<pre class="code-block language-${properLanguage}"><code class="language-${properLanguage}">${source}</code></pre>`;

      return `<div class="code-block code-block-container">${source}</div>`;;
    }

    renderer.table = (header, body) => {
      return `<div class="table-wrapper"><table><thead>${header}</thead><tbody>${body}</tbody></table></div>`;
    }

    // Process markdown with marked
    let html = marked(content, { renderer });

    // Add anchors to h3
    let match
    let pattern = /<h3 id="(.+?)">(.+?)<\/h3>/g
    while ((match = pattern.exec(html))) {
      const slug = slugify(match[1]);
      const anchor = match[0].replace(
        match[2],
        `<span>${match[2]}</span><a href="${options.anchorPath ||
          ''}#${slug}" class="anchor">#</a>`,
      )
      html = html.replace(match[0], anchor)
    }

    const hashes = {}

    groups.forEach(group => {
      const main = group.blocks[0]
      if (main.meta.repl === false) return

      const hash = getHash(group.blocks.map(block => block.source).join(''))
      hashes[group.id] = hash

      const json5 = group.blocks.find(block => block.lang === 'json')
      // console.log('main, main.meta: ', main, main.meta);
      const {title} = main.meta
      if (!title) console.error(`Missing title for demo in ${file}`)

      demos.set(
        hash,
        JSON.stringify({
          title: title || 'Example from guide',
          components: group.blocks
            .filter(block => block.lang === 'html' || block.lang === 'js')
            .map(block => {
              const [name, type] = (block.meta.filename || '').split('.')
              return {
                name: name || 'App',
                type: type || 'html',
                source: block.source,
              }
            }),
          json5: json5 && json5.source,
        }),
      )
    })

    // Create subsections with H2 heading match
    const subsections = []
    pattern = /<h2 id="(.+?)">(.+?)<\/h2>/g
    match

    while ((match = pattern.exec(html))) {
      const slug = slugify(match[1]);


      const title = unescape(
        match[2]
          .replace(/<\/?code>/g, '')
          .replace(/\.(\w+)(\((.+)?\))?/, (m, $1, $2, $3) => {
            if ($3) return `.${$1}(...)`
            if ($2) return `.${$1}()`
            return `.${$1}`
          }),
      )

      if (metadata.title !== title) subsections.push({ slug, title })
    }

    // Add class to numbers before h3 Headings
    let output = insertTag(
      /<h3 id=".+?">(\d\.).+?<\/h3>/g,
      html,
      'span',
      'counter',
      'h3',
    )

    // Add Span to tables td content to allow customization
    output = insertTag(/<td>(.+?)<\/td>/gm, output, 'span')

    output = output.replace(/@@(\d+)/g, (m, id) => hashes[id] || m)

    return {
      html: output,
      slug: options.toFile
        ? basename(file).replace(/\.md$/, '')
        : file.replace(/^\d+-/, '').replace(/\.md$/, ''),
      file: basename(file),
      filePath: options.toFile ? path : `${path}/${file}`,
      metadata,
      subsections,
    }
  })
}
