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
const bufferSize = 5
const series = 2
const bump = add(bufferSize)
const toItem = curry((h, v, u, i) =>
  Map({ t: new Date(2000 + i, 0, 1), d: simplex.noise3d(i * h, i * v, i * u) })
)

window.simplex = simplex
window.showNoise$ = showNoise$

const noise$ = showNoise$
  .map(coords => map(toFloat, coords))
  .switchMap(({ h, v, u }) =>
    Observable.merge(
      Observable.interval(1000)
        .startWith(-1)
        .map(bump)
        .scan(
          (series, next) => { 
            console.log('series', series, next)
            return series.map(
              acc =>
              acc.slice(1).push(toItem(h, v, u)(next))
            )
          },
          List(range(series).map(
            i => List(range(bufferSize).map(toItem(h, v, u)))
          ))
        )
        .do(log('Noise'))
        .take(3)
        .map(noise => state => state.set('noise', noise)),
      createNavigateTo$(`/curve/${h}/${v}/${u}`)
    )
  )

export default noise$

function toFloat(i, k) {
  const result = parseFloat(i)
  if (isNaN(result)) throw new Error(`Unable to parse ${i} as number`)
  return result
}
