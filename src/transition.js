import { Subject, Observable } from 'rxjs'
import { interpolate } from 'd3-interpolate'
import { easeExpInOut } from 'd3-ease'

export default function createTransition$(
  start,
  duration = 1000,
  interval = 20,
  interpolator = interpolate,
  ease = easeExpInOut
) {
  const ticks = duration / interval
  let current = start
  const to$ = new Subject()
  const out$ = to$.switchMap(t => {
    const i = interpolator(current, t)
    return Observable.interval(interval)
      .take(ticks)
      .map(t => (t + 1) / ticks)
      .startWith(0)
      .map(ease)
      .map(i)
      .do(v => (current = v))
  })
  return Subject.create(to$, out$)
}
