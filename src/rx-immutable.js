import { distinctUntilChanged as d, map, publishReplay, refCount } from 'rxjs/operators'
import { equals, memoizeWith, identity } from 'ramda'
import { isImmutable } from 'immutable'
import flog from '@zambezi/caballo-vivo/src/flog'

export function distinctUntilChanged(source) {
  return source.pipe(d(diligentEquals))
}

export function pluck(keyOrPath, notSetValue) {
  return function pluck(source) {
    return Array.isArray(keyOrPath)
      ? source.pipe(map(x => x.getIn(keyOrPath, notSetValue)))
      : source.pipe(map(x => x.get(keyOrPath, notSetValue)))
  }
}

export function shareLast(source) {
  return source.pipe(
    publishReplay(1),
    refCount()
  )
}

export function cached$(create$, key=identity) {
  return memoizeWith(key, withReplay$)
  function withReplay$(key) {
    return create$(key).pipe(
      flog(`cache miss ${key}`),
      shareLast,
      flog(`after cache ${key}`)
    )
  }
}

function diligentEquals(a, b) {
  if (isImmutable(a)) return a.equals(b)
  return equals(a, b)
}


