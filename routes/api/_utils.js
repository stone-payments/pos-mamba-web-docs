const escaped = {
  '"': '&quot;',
  "'": '&#39;',
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
}

function replaceTag(tag) {
  return escaped[tag] || tag
}

function createGlob(glob) {
  return [
    `${glob}README.md`,
    `${glob}package.json`,
    `${glob}CHANGELOG.md`,
    `${glob}(examples|example)/*.+(html|svelte)`,
  ]
}

function unescape(str) {
  return String(str).replace(/&.+?;/g, match => unescaped[match] || match)
}

const unescaped = Object.keys(escaped).reduce(
  (unescaped, key) => ((unescaped[escaped[key]] = key), unescaped),
  {},
)

function insertTag(regex, content, tag, spanClass = '') {
  return content.replace(regex, (m, $1) =>
    m.replace($1, `<${tag} class="${spanClass}">${$1}</${tag}>`),
  )
}

export { createGlob, unescape, insertTag, unescaped, replaceTag }
