import { Observable } from 'rxjs'
import { Map } from 'immutable'
import noise$ from './noise'
import location$ from './location'

const initialState = Map({ oka: '▓▒' })
const store$ = Observable.merge(noise$, location$)
  .scan((state, reduce) => reduce(state), initialState)
  .distinctUntilChanged((s1, s2) => s1.equals(s2))
  .publishReplay(1)
  .refCount()
  .catch(e => console.warn('Error', e))

export default store$
