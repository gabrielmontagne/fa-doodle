import location$ from './location'
import model3D$ from './gltf'
import noise$ from './noise'
import stow from '@zambezi/caballo-vivo/src/stow'
import { Map } from 'immutable'
import { catchError, scan } from 'rxjs/operators'
import { of, merge } from 'rxjs'
import { distinctUntilChanged, shareLast } from './rx-immutable'

const store$ = merge(
  noise$.pipe(stow('noise')),
  location$.pipe(stow('location')),
  model3D$,
)
  .pipe(
    catchError(error => of(state => state.set('error', error))),
    scan((state, reduce) => reduce(state), Map()),
    distinctUntilChanged,
    shareLast
  )

export default store$
