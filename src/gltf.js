import GLTFLoader from 'three-gltf-loader'
import flog from '@zambezi/caballo-vivo/src/flog'
import { Observable, concat, of } from 'rxjs'
import { createNavigateTo$ } from '@zambezi/caballo-vivo/src/location'
import { format } from 'd3-format'
import { fromJS, Map } from 'immutable'
import { showModel$ } from './intents'
import { tap, switchMap, map } from 'rxjs/operators'
import { cached$ } from './rx-immutable'

const formatProgress = format('.1f')
const createCachedLoader$ = cached$(createLoader$)

const model3D$ = showModel$.pipe(
  switchMap(({ mesh, rx, ry, rz }) => {
    return concat(
          of(state => state.set('loading', `model ‘${mesh}’`)),
          createNavigateTo$(`/mesh/${mesh}/${rx}/${ry}/${rz}`),
          createCachedLoader$(`${process.env.PUBLIC_URL}/models/${mesh}/scene.gltf`)
      .pipe(
            flog('Model loader'),
            map(({ progress, result }) => state =>
              state
                .set(
                  'loading',
                  `model ‘${mesh}’ (${formatProgress(progress)})`
                )
                .setIn(['models', mesh], result)
            )
          ),
          of(state => state.delete('loading'))
        )
  })
)

export default model3D$

function createLoader$(url) {
  return Observable.create(o => {
    const loader = new GLTFLoader()
    loader.load(
      url,
      result => {
        o.next({ progress: 1, result: fromJS(result) })
        o.complete()
      },
      xhr => {
        const { loaded, total } = xhr
        if (!total) return
        o.next({ progress: loaded / total })
      },
      error => o.error(error)
    )
  })
}
