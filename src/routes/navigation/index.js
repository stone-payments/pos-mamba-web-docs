import primary from './primary'
import secondary from './secondary'

export default Object.entries([...primary, ...[{ type: 'hr' }], ...secondary])
