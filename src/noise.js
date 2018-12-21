import Simplex from 'perlin-simplex'
import log from './caballo-vivo/log'
import toFloat from './to-float'
import { Map, List } from 'immutable'
import { merge, interval } from 'rxjs'
import { startWith, map, switchMap, scan, tap, take } from 'rxjs/operators'
import { add, curry } from 'ramda'
import { createNavigateTo$ } from './caballo-vivo/location'
import { format } from 'd3-format'
import { range } from 'd3-array'
import { showNoise$ } from './intents'

const seed = () => 0.3
const simplex = new Simplex({ random: seed })
const bufferSize = 7
const series = 4
const bump = add(bufferSize)
const toItem = curry((h, v, u, i) =>
  Map({
    t: new Date(2020 + i, 0, 1),
    d: simplex.noise3d(i * h, i * v, i * u),
  })
)
const coordFromat = format('.1f')

const noise$ = showNoise$.pipe(
  map(toFloat),
  switchMap(({ h, v, u }) =>
    merge(
      interval(1200).pipe(
        startWith(-1),
        map(bump),
        scan(
          (series, next) =>
            series.map((acc, i) =>
              acc.slice(1).push(toItem(h, v, u * i)(next))
            ),
          List(
            range(series).map(i =>
              List(range(bufferSize - 1).map(toItem(h, v, u * i)))
            )
          )
        ),

        tap(log('Noise')),
        take(5),
        map(noise => state => state.set('noise', noise))
      ),
      createNavigateTo$(
        `/curve/${coordFromat(h)}/${coordFromat(v)}/${coordFromat(u)}`
      )
    )
  )
)

export default noise$
