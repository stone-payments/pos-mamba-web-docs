import { readFileSync } from 'fs'
import { compose } from 'lodash/fp'
// import tls from 'tls';

const { entries, assign } = Object

const readCert = path => readFileSync(path).toString()

const createSecureContextOptions = certs =>
  certs.map(([k, some]) => {
    if (Array.isArray(some)) return { [k]: some.map(cert => readCert(cert)) }
    if (!['cert', 'key'].includes(k)) return { [k]: some }
    return { [k]: readCert(some) }
  })

export default compose(
  // tls.createSecureContext,
  map => assign(...map),
  createSecureContextOptions,
  entries,
)
