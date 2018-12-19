import log from './caballo-vivo/log'
import { createLocation$ } from './caballo-vivo/location'
import { showNoise$, showModel$ } from './intents'
import { OrderedMap } from 'immutable'

const pathToIntent = OrderedMap([
  ['/curve/:h/:v/:u', coords => showNoise$.next(coords)],
  ['/mesh/:mesh/:rx/:ry/:rz', coords => showModel$.next(coords)],
])
const location$ = createLocation$(pathToIntent)
  .do(log('Location'))
  .map(location => state => state.set('location', location))

export default location$
