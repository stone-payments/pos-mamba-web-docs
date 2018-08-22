import fs from 'fs';
import path from 'path';

import * as fleece from 'golden-fleece';
import capitalize from 'lodash.capitalize';
import cheerio from 'cheerio';
import marked from 'marked';
import Prism from 'prismjs';

import { unescape, insertTag, replaceTag } from './_utils';
import processMarkdown from './_processMarkdown';
import classNameUtils from './_classNameUtils';
import strings from './_strings';
import escape from './_escape';
import './_processLineNumbers';

const blockTypes = 'blockquote html heading hr list listitem paragraph table tablerow tablecell'.split(
  ' ',
)

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

const cheerioOption = {
  decodeEntities: false,
}

const SELECTOR = 'pre>code[class*="language-"]'

export const demos = new Map()

export default function(dir, fileSlug, anchorPath, mambaSlub = undefined) {
  let read;

  try {
    read = fs.readdirSync(dir);
  } catch(e) {
    console.warn(e.code, e.path);
    return null;
  }

  return read.filter(file => file[0] !== '.' && (!!fileSlug || file === `${fileSlug}.md`) && path.extname(file) === '.md')
    .map(file => {

      const sectionSlug = file.replace(/^\d+-/, '').replace(/\.md$/, '');

      const markdown = fs.readFileSync(`${dir}/${file}`, 'utf-8');
      
      const { content, metadata, examples } = processMarkdown(markdown, dir);

      const groups = [];
      let group = null;
      let uid = 1;

      const renderer = new marked.Renderer();

      renderer.code = (source, lang) => {
        source = source.replace(/^ +/gm, match =>
          match.split('    ').join('\t'),
        )
        
        const lines = source.split('\n');

        const meta = extractMeta(lines[0], lang);

        let prefix = '';
        let className = 'code-block';

        if (lang === 'html' && !group) {
          group = { id: uid++, blocks: [] }
          groups.push(group);
        }

        if (meta) {
          source = lines.slice(1).join('\n')
          const filename = meta.filename || (lang === 'html' && 'App.html')
          if (filename) {
            if(mambaSlub) {
              prefix = `<div class='source-header'><i class="fas fa-external-link-alt svelte-co345y"></i><a class='filename' href='https://github.com/stone-payments/pos-mamba-sdk/blob/develop/packages/components/${capitalize(mambaSlub)}/example/${filename}'><span>${strings.sourceCode}</span></a></div>`;
            }else {
              prefix = `<span class='filename'>${filename}</span>`;
            }
            className += ' named';
          }
        }

        if (group) group.blocks.push({ meta: meta || {}, lang, source });

        if (meta && meta.hidden) return '';

        // Start Code highlight with Prism

        // Define proper language type from `lang` param
        const properLanguage =
          (lang === 'js' ? 'javascript' : lang) || 'markdown'

        // Create a inline code tag
        const html = `<pre class="code-block line-numbers language-${properLanguage}"><code class="language-${properLanguage}">${source.replace(
          /[&<>]/g,
          replaceTag,
        )}</code></pre>`

        // Load cheerio with Code component output
        const $ = cheerio.load(html, cheerioOption);

        // Select element with cheerio
        const $elements = $(SELECTOR);

        // Default options for Prism
        const options = {
          languages: ['bash', 'markup', 'markdown', 'javascript', 'css'],
          fontSize: 16,
        }

        // Import language support of every souce code block
        if ($elements.length !== 0) {
          options.languages.forEach(language =>
            require(`prismjs/components/prism-${language}`),
          )
        }
        
        // Apply Prism js to every source code
        $elements.each(function(index, element) {
          let $element = $(this);

          let $parent = $element.parent();

          let language = classNameUtils.getLanguageFromClassName(
            $element.attr('class'),
          )

          let grammar = Prism.languages[language];

          $parent
            .addClass(`language-${language}`)
            .css('font-size', options.fontSize + 'px');

          let code = $element.html();

          // &amp; -> &
          code = escape.amp(code);
          // &lt; -> '<', &gt; -> '>'
          code = escape.tag(code);

          let env = {
            $element: $element,
            language: language,
            grammar: grammar,
            code: code,
            options: options,
          }

          Prism.hooks.run('before-sanity-check', env);

          if (!env.code || !env.grammar) {
            if (env.code) {
              env.$element.textContent = env.code;
            }
            Prism.hooks.run('complete', env);
            return
          }

          Prism.hooks.run('before-highlight', env);

          let highlightedCode = Prism.highlight(code, grammar);

          env.highlightedCode = highlightedCode;
          Prism.hooks.run('before-insert', env);

          $element.text(highlightedCode);

          Prism.hooks.run('after-highlight', env);
          Prism.hooks.run('complete', env);
        })
        
        let renderBlock = `<div class='${className} code-block-container'>${prefix}${$.html()}</div>`;

        if(examples) {
          examples[0].source = renderBlock;
          examples[0].endIndex = renderBlock.length;
          return '';
        }

        return renderBlock;
      }

      blockTypes.forEach(type => {
        const fn = renderer[type];
        renderer[type] = function() {
          group = null;
          return fn.apply(this, arguments);
        }
      })

      let html = marked(content, { renderer });
      

      // Add anchors to h3
      let match;
      let pattern = /<h3 id="(.+?)">(.+?)<\/h3>/g;
      while ((match = pattern.exec(html))) {
        const slug = match[1];
        const anchor = match[0].replace(match[2], `<span>${match[2]}</span><a href="${anchorPath || ''}#${slug}" class="anchor">#</a>`);
        html = html.replace(match[0], anchor);
      }

      const hashes = {}
      
      groups.forEach(group => {

        const main = group.blocks[0];
        if (main.meta.repl === false) return;

        const hash = getHash(group.blocks.map(block => block.source).join(''));
        hashes[group.id] = hash;

        const json5 = group.blocks.find(block => block.lang === 'json');
        // console.log('main, main.meta: ', main, main.meta);
        const title = main.meta.title;
        if (!title) console.error(`Missing title for demo in ${file}`);

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
        );
      })

      // Create subsections with H2 heading match
      const subsections = [];
      pattern = /<h2 id="(.+?)">(.+?)<\/h2>/g;
      match;

      while ((match = pattern.exec(html))) {
        const slug = match[1];
        const title = unescape(
          match[2]
            .replace(/<\/?code>/g, '')
            .replace(/\.(\w+)(\((.+)?\))?/, (m, $1, $2, $3) => {
              if ($3) return `.${$1}(...)`
              if ($2) return `.${$1}()`
              return `.${$1}`
            }),
        )

        subsections.push({ slug, title });
      };

      // Add class to numbers before h3 Headings
      let output = insertTag(
        /<h3 id=".+?">(\d\.).+?<\/h3>/g,
        html,
        'span',
        'counter',
        'h3'
      );
      
      // Add Span to tables td content to allow customization
      output = insertTag(/<td>(.+?)<\/td>/gm, output, 'span');

      output = output.replace(/@@(\d+)/g, (m, id) => hashes[id] || m);

      let paramsIndex = output.search(/<h2 id="par-metros">/);
      paramsIndex = paramsIndex === -1 ? false : paramsIndex;

      return {
        html: paramsIndex && output.slice(0, paramsIndex) || output,
        paramsHtml: paramsIndex && output.slice(paramsIndex) || '',
        metadata,
        subsections,
        slug: file.replace(/^\d+-/, '').replace(/\.md$/, ''),
        file,
        examples,
        filePath: `${dir}/${file}`,
      }
    })
}
