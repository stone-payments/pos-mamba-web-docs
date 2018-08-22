import fs from 'fs';
import path from 'path';
import strings from './_strings';
// import Example from './components/_components/Example.html';

// const { html, css, head } = Example.render();

export default function processMarkdown(markdown, dir) {
  const metadata = {};
  
  const pattern = /(\w*@example)\s(.+)\s?-->$/gm;
  let match;
  let examples = [];

  // Match files ou code to include
  // Process example filename to include and metadata
  while ((match = pattern.exec(markdown))) {
    
    const fileContents = fs.readFileSync(path.join(dir, match[2]), 'utf-8');

    const matchTitle = match.input.match(/#\s.+?\n/);
    const title = matchTitle && matchTitle[0].trim() || match[2];
    const index = match.index;
    
    let source = `\n\r\`\`\`html\n<!-- {title: '${title}', repl: false, filename: '${path.basename(
      match[2],
    )}'} -->\n${fileContents}\`\`\``;
    markdown = markdown.replace(`<!-- `.concat(match[0]), source);
    
    examples.push({ index, fileContents, fileName: path.basename(match[2]), source: source });
  }

  // Create component props heading for multiple components in page
  markdown = markdown.replace(
    /\`<([a-zA-Z]+)(\s\.\.\.props\s?)\/>\`/gm,
    (m, $1, $2) => {
      const scaped = `<span class="token punctuation">&lt;</span>${$1} <span class="attr-name">${$2}</span> <span class="token punctuation">/&gt;</span>`;
      return `<h2 class="props-heading token tag">${scaped}</h2>`;
    },
  )
  
  /* import('./components/_components/Example.html').then(mod => {
    console.log('mod: ', mod);
  }).catch(() => {}); */

  // This match for custom tag of:
  // ---
  // title: Text
  // description: Text
  // Another: Value ...
  // ---
  // to define a section and fetch metadatas.
  // If not found, markdown must have a least H1.
  match = /<!--([\s\S]*(@*:[\s]?).+?)-->\n*#/isu.exec(markdown);

  // Match/Found H1 heading
  if (match === null) {
    match = /#{1}(\s?)(\w.+)/.exec(markdown)
    
    metadata.title = match[2]
    const content = markdown.slice(match[0].length)
    return { metadata, content, examples }
  }

  // Process metadatas
  const frontMatter = match[1];
  const content = markdown.slice(match[0].length);

  frontMatter.split('\n').forEach(pair => {
    const colonIndex = pair.indexOf(':')
    const arIndex = pair.indexOf('@') + 1
    if (colonIndex > -1)
      metadata[pair.slice(arIndex, colonIndex).trim()] = pair
        .slice(colonIndex + 1)
        .trim()
  })
  
  return { metadata, content, examples }
}
