import fs from 'fs'
import path from 'path'

export default function processMarkdown(markdown, dir) {
  let hasExamples = false
  const examples = []

  // Match files or code to include
  // Process example filename to include and metadata
  while ((match = /(\w*@iframe)\s(.+)\s-->$/gm.exec(markdown))) {
    // console.log(dir, match);
    const fileContents = fs.readFileSync(path.join(dir, match[2]), 'utf-8')
    const matchTitle = match.input.match(/#\s.+?\n/)
    const title = (matchTitle && matchTitle[0].trim()) || match[2]
    const {index} = match

    // const { html, css, head } = Example.render();
    // console.log(html, css, head);

    const source = `${
      !hasExamples ? `\n${strings.examplesTitle}` : ''
    }\n\r\`\`\`html\n<!-- {title: '${title}', repl: false, filename: '${path.basename(
      match[2],
    )}'} -->\n${fileContents}\`\`\``
    markdown = markdown.replace(`<!-- `.concat(match[0]), source)
    examples.push({ index, fileContents, source })
    hasExamples = true
  }
}
