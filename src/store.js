import { Observable } from 'rxjs'
import { Map } from 'immutable'
import noise$ from './noise'

const initialState = Map({ oka: '▓▒' })
const store$ = Observable.merge(noise$)
  .scan((state, reduce) => reduce(state), initialState)
  .distinctUntilChanged((s1, s2) => s1.equals(s2))
  .publishReplay(1)
  .refCount()

export default store$
