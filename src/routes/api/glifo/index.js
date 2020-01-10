import path from 'path'
import fs from 'fs'

const emptySample = () => JSON.stringify('[]')
const samplePath = path.join(process.cwd(), 'static/sample.json')

const createSample = (content, cb) => {
  fs.writeFileSync(samplePath, JSON.stringify(content), cb)
}

export function get(req, res) {
  res.writeHead(200, { 'Content-Type': 'application/json' })

  fs.readFile(samplePath, 'utf8', (err, data) => {
    if (err) res.end(emptySample())
    res.end(data)
  })
}

export function post(req, res) {
  /* Initializes */
  res.setHeader('Content-Type', 'application/json')
  /* Retrieves the data */
  const entries = req.body

  if (entries && entries.length) {
    createSample(entries, err => {
      if (err) throw err
    })
  }

  // Do something with the data...
  /* Returns the result */
  return res.end(JSON.stringify({ success: true }))
}
