import Simplex from 'perlin-simplex'
import log from 'caballo-vivo/src/log'
import { Map, List } from 'immutable'
import { Observable } from 'rxjs'
import { add, curry } from 'ramda'
import { range } from 'd3-array'
import { showNoise$ } from './intents'

const seed = () => 0.3
const simplex = new Simplex({ random: seed })
const bufferSize = 6
const bump = add(bufferSize)
const toItem = curry((h, v, i) =>
  Map({ t: new Date(2000 + i, 0, 1), d: simplex.noise(i * h, i * v) })
)

const noise$ = showNoise$
  .switchMap(({ h, v }) =>
    Observable.interval(1000)
      .startWith(-1)
      .map(bump)
      .scan((acc, next) => {
        console.log('scan', acc, next)
        return acc.slice(1).push(toItem(h, v)(next))
      }, List(range(bufferSize).map(toItem(h, v))))
      .do(log('Tic'))
      .take(30)
  )
  .do(log('Noise'))
  .map(noise => state => state.set('noise', noise))

export default noise$
