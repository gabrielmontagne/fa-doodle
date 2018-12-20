import { of } from 'rxjs'
import { Map } from 'immutable'

const store$ = of(Map({ error: 'X-P' }))

export default store$
