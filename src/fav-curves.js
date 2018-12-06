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
  .map(([h,v,u]) => `/curve/${h}/${v}/${u}`)
  .bufferCount(5)
  .map(l => l.concat(
    '/', 
    '/mesh/aa/5/22/0',
    '/mesh/aa/15/2/30'
  ))
  .map(List)
  .do(log('Favourite curves'))
  .map(curves => state => state.set('favCurves', curves))

export default favCurves$
