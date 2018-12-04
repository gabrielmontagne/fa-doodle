import { Observable } from 'rxjs'
import log from 'caballo-vivo/src/log'
import { format } from 'd3-format'
import { range } from 'd3-array'

const coords = 3
const favCurves$ = Observable.from(range(5 * coords))
  .map(Math.random)
  .map(format('.1f'))
  .bufferCount(3)
  .map(([h,v,u]) => `/curve/${h}/${v}/${u}`)
  .bufferCount(5)
  .do(log('Favourite curves'))
  .map(curves => state => state.set('favCurves', curves))

export default favCurves$
