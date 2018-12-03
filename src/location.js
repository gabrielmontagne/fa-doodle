import log from 'caballo-vivo/src/log'
import { createLocation$ } from 'caballo-vivo/src/location'
import { showNoise$ } from './intents'

const pathToIntent = {
  '/curve/:h/:v/:u': ({ h, v, u }) => showNoise$.next({ h, v, u }),
}
const location$ = createLocation$(pathToIntent)
  .do(log('location'))
  .map(location => state => state.set('location', location))

export default location$
