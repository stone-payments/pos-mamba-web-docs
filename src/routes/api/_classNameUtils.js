const LANG = /\blang(?:uage)?-(\w+)\b/i
const SPACE = /\s+/g

export const notIncludeLanguage = className => {
  if (typeof className !== 'string') {
    return true
  }
  return !LANG.test(className)
}

export const getLanguageFromClassName = className => {
  if (typeof className !== 'string') {
    return ''
  }
  const val = (className.match(LANG) || [''])[1].toLowerCase();
  return val;
}

export const addLanguageIfNotPresent = (className, language) => {
  if (typeof className !== 'string') {
    className = ''
  }
  return `${className
    .replace(LANG, '')
    .replace(SPACE, ' ')} language-${language}`
}

export default {
  notIncludeLanguage,
  getLanguageFromClassName,
  addLanguageIfNotPresent,
}
