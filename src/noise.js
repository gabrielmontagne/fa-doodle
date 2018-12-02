import Simplex from 'perlin-simplex'
import { Observable } from 'rxjs'
import { List } from 'immutable'
import log from 'caballo-vivo/src/log'
import { range } from 'ramda'


const simplex = new Simplex()

const noise$ = Observable.of(range(60, 66))
  .map(x => x.map((x,i) => simplex.noise(x, i)))
  .map(List)
  .do(log('Noise'))
  .map(noise => state => state.set('noise', noise))

export default noise$
