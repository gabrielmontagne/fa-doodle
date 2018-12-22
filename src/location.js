import log from '@zambezi/caballo-vivo/src/log'
import { OrderedMap } from 'immutable'
import { createLocation$ } from '@zambezi/caballo-vivo/src/location'
import { map, tap } from 'rxjs/operators'
import { showNoise$, showModel$ } from './intents'

const pathToIntent = OrderedMap([
  ['/curve/:h/:v/:u', coords => showNoise$.next(coords)],
  ['/mesh/:mesh/:rx/:ry/:rz', coords => showModel$.next(coords)],
])

const location$ = createLocation$(pathToIntent).pipe(
  tap(log('Location')),
  map(location => state => state.set('location', location))
)

export default location$
