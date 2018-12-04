import { Observable } from 'rxjs'
import { Map } from 'immutable'
import noise$ from './noise'
import favCurves$ from './fav-curves'
import location$ from './location'

const store$ = Observable.merge(noise$, location$, favCurves$)
  .catch(err => Observable.of(state => state.set('error', err)))
  .scan((state, reduce) => reduce(state), Map())
  .distinctUntilChanged((s1, s2) => s1.equals(s2))
  .publishReplay(1)
  .refCount()

export default store$
