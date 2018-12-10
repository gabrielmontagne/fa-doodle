import log from 'caballo-vivo/src/log'
import { List } from 'immutable'
import { Observable } from 'rxjs'
import { format } from 'd3-format'
import { range } from 'd3-array'

const coords = 3
const favCurves$ = Observable.from(range(5 * coords))
  .map(Math.random)
  .map(format('.1f'))
  .bufferCount(3)
  .map(([h, v, u]) => `/curve/${h}/${v}/${u}`)
  .bufferCount(5)
  .map(l =>
    l.concat(
      '/',
      '/mesh/table/-35/10/0',
      '/mesh/table/0/0/0',
      '/mesh/louis-xiv/0/0/0',
      '/mesh/louis-xiv/0/35/0',
      '/mesh/mercure/0/0/0',
      '/mesh/house/-40/0/0',
      '/mesh/house/-50/20/0',
      '/mesh/house/0/0/0',
    )
  )
  .map(List)
  .do(log('Favourite curves'))
  .map(curves => state => state.set('favCurves', curves))

export default favCurves$
