import Simplex from 'perlin-simplex'
import { Observable } from 'rxjs'
import { Map, List } from 'immutable'
import log from 'caballo-vivo/src/log'
import { range } from 'd3-array'

const seed = () => 0.3
const simplex = new Simplex({ random: seed })

const noise$ = Observable.interval(2000)
  .startWith(-1)
  .map(i => range(10 + i * 0.01, 50 + i * 1.01))
  .map(x =>
    x.map((x, i) =>
      Map({
        t: new Date(2010 + i, 0, 1),
        d: simplex.noise(x, i),
      })
    )
  )
  .map(List)
  .do(log('Noise'))
  .map(noise => state => state.set('noise', noise))

export default noise$
