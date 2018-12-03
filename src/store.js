import { Observable } from 'rxjs'
import { Map } from 'immutable'
import noise$ from './noise'
import location$ from './location'

const initialState = Map({ oka: '▓▒' })
const store$ = Observable.merge(noise$, location$)
  .catch(err => Observable.of(state => state.set('error', err)))
  .scan((state, reduce) => reduce(state), initialState)
  .distinctUntilChanged((s1, s2) => s1.equals(s2))
  .publishReplay(1)
  .refCount()

export default store$
