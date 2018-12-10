import log from 'caballo-vivo/src/log'
import { createLocation$ } from 'caballo-vivo/src/location'
import { showNoise$, showModel$ } from './intents'

const pathToIntent = {
  '/curve/:h/:v/:u': (coords) => showNoise$.next(coords),
  '/mesh/:mesh/:rx/:ry/:rz': (coords) => showModel$.next(coords),
}
const location$ = createLocation$(pathToIntent)
  .do(log('location'))
  .map(location => state => state.set('location', location))

export default location$
