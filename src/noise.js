import Simplex from 'perlin-simplex'
import log from 'caballo-vivo/src/log'
import { Map, List } from 'immutable'
import { Observable } from 'rxjs'
import { add, curry, map } from 'ramda'
import { createNavigateTo$ } from 'caballo-vivo/src/location'
import { range } from 'd3-array'
import { showNoise$ } from './intents'

const seed = () => 0.3
const simplex = new Simplex({ random: seed })
const bufferSize = 10
const bump = add(bufferSize)
const toItem = curry((h, v, i) =>
  Map({ t: new Date(2000 + i, 0, 1), d: simplex.noise(i * h, i * v) })
)

window.showNoise$ = showNoise$

const noise$ = showNoise$.map(parseParams).switchMap(({ h, v, u }) =>
  Observable.concat(
    createNavigateTo$(`/curve/${h}/${v}/${u}`),
    Observable.interval(1000)
      .startWith(-1)
      .map(bump)
      .scan((acc, next) => {
        console.log('scan', acc, next)
        return acc.slice(1).push(toItem(h, v)(next))
      }, List(range(bufferSize).map(toItem(h, v))))
      .do(log('Noise'))
      .take(5)
      .map(noise => state => state.set('noise', noise))
  )
)

export default noise$

function parseParams(coords) {
  return map(toFloat, coords)
}
function toFloat(i, k) {
  const result = parseFloat(i)
  if (isNaN(result)) throw new Error(`Unable to parse ${i} as number`)
  return result
}
