import { Subject, of, interval } from 'rxjs'
import { take, map, switchMap, startWith, tap } from 'rxjs/operators'
import { interpolate } from 'd3-interpolate'
import { easeExpInOut } from 'd3-ease'
import { omit } from 'ramda'

const minusSkip = omit(['skipTransition'])

export default function createTransition$(
  start,
  duration = 1000,
  period = 20,
  interpolator = interpolate,
  ease = easeExpInOut
) {
  const ticks = duration / period
  let current = start
  const to$ = new Subject()
  const out$ = to$.pipe(
    switchMap(to => {
      return to.skipTransition
        ? of(minusSkip(to)).pipe(tap(v => (current = v)))
        : interval(period).pipe(
            take(ticks),
            map(t => (t + 1) / ticks),
            startWith(0),
            map(ease),
            map(interpolator(current, minusSkip(to))),
            tap(v => (current = v))
          )
    })
  )

  return Subject.create(to$, out$)
}
