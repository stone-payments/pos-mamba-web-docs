import primary from './primary.js'
import secondary from './secondary.js'

export default Object.entries([...primary, ...[{ type: 'hr' }], ...secondary])
