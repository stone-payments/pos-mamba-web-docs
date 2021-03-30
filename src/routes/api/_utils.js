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

function createGlob(glob = '') {
  return [
    `${glob}README.md`,
    `${glob}package.json`,
    `${glob}example/Example.html`,
  ]
}

function createApiGlob() {
  return [`docs/*.md`, `README.md`]
}

const unescaped = Object.keys(escaped).reduce(
  (unescapedObj, key) => ((unescapedObj[escaped[key]] = key), unescapedObj),
  {},
)

function unescape(str) {
  return String(str).replace(/&.+?;/g, match => unescaped[match] || match)
}

// Insert tag at desired regex group
// @param {regex}  regex - Regex expression
// @param {string} content - The content to replace
// @param {string} tag - The html tag name to insert
// @param {string} spanClass - The new tag class
// @param {string} parentTag - Add span class to parentClass with prefix 'has-'
function insertTag(regex, content, tag, spanClass = '', parentTag = null) {
  return content.replace(regex, (m, $1) => {
    if (parentTag) {
      return m
        .replace(`<${parentTag}`, `<${parentTag} class="has-${spanClass}" `)
        .replace($1, `<${tag} class="${spanClass}">${$1}</${tag}>`)
    }
    return m.replace($1, `<${tag} class="${spanClass}">${$1}</${tag}>`)
  })
}

const createBuffer = () => {
  const normalize = s => s.replace(/\r?\n|\r|\s/gm, '')
  return n => Buffer.from(normalize(n))
}

const accentsMap = {
  a: 'á|à|ã|â|À|Á|Ã|Â',
  e: 'é|è|ê|É|È|Ê',
  i: 'í|ì|î|Í|Ì|Î',
  o: 'ó|ò|ô|õ|Ó|Ò|Ô|Õ',
  u: 'ú|ù|û|ü|Ú|Ù|Û|Ü',
  c: 'ç|Ç',
  n: 'ñ|Ñ',
};

export const slugify = text => Object.keys(accentsMap).reduce((acc, cur) => acc.replace(new RegExp(accentsMap[cur], 'g'), cur), text);

export {
  createGlob,
  createApiGlob,
  unescape,
  insertTag,
  unescaped,
  replaceTag,
  createBuffer,
}
