import Simplex from 'perlin-simplex'
import { Observable } from 'rxjs'
import { Map, List } from 'immutable'
import log from 'caballo-vivo/src/log'
import { range } from 'd3-array'

const seed = () => 0.3
const simplex = new Simplex({ random: seed })

const noise$ = Observable.interval(3000)
  .startWith(-1)
  .map(x => range(10 + x, 20 + x))
  .map(x =>
    x.map((x, i) =>
      Map({
        t: new Date(2000 + x, 0, 1),
        d: simplex.noise(x * 0.2, i),
      })
    )
  )
  .map(List)
  .take(10)
  .do(log('Noise'))
  .map(noise => state => state.set('noise', noise))

export default noise$
