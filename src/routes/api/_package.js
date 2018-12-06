import fs from 'fs'

export default function(path, slug) {
  const source = fs.readFileSync(path, 'utf-8')
  const { name, version } = JSON.parse(source)
  return { package: { name, version }, slug: slug }
}
