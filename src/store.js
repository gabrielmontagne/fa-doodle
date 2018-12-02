import { Observable } from 'rxjs'
import { Map } from 'immutable'

const store$ = Observable.of(Map({oka: '▒'}))

export default store$
