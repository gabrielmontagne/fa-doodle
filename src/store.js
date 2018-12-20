import { of, merge } from 'rxjs'
import { catchError, scan, distinctUntilChanged, publishReplay, refCount } from 'rxjs/operators'
import { Map } from 'immutable'
import location$ from './location'

const noise$ = of(Map({ error: 'X-P' }))
const model$ = of(state => state.set('okaloka', 666))

const store$ = merge(noise$, model$, location$)
  .pipe(
    catchError(error => of(state => state.set('error', error))),
    scan((state, reduce) => reduce(state)),
    distinctUntilChanged((a, b) => a.equals(b)),
    publishReplay(1),
    refCount()
  )

export default store$
