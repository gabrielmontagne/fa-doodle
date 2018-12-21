import GLTFLoader from 'three-gltf-loader'
import log from './caballo-vivo/log'
import { fromJS, Map } from 'immutable'
import { Observable, concat, of } from 'rxjs'
import { tap, switchMap, map } from 'rxjs/operators'
import { createNavigateTo$ } from './caballo-vivo/location'
import { format } from 'd3-format'
import { showModel$ } from './intents'

const formatProgress = format('.1f')
let modelCache = Map()

const model$ = showModel$.pipe(
  switchMap(({ mesh, rx, ry, rz }) => {
    return modelCache.has(mesh)
      ? concat(
          of(modelCache.get(mesh)).pipe(
            tap(log('Restore cached model')),
            map(model => state => state.setIn(['models', mesh], model))
          ),
          createNavigateTo$(`/mesh/${mesh}/${rx}/${ry}/${rz}`)
        )
      : concat(
          of(state => state.set('loading', `model ‘${mesh}’`)),
          createNavigateTo$(`/mesh/${mesh}/${rx}/${ry}/${rz}`),
          createLoader$(
            `${process.env.PUBLIC_URL}/models/${mesh}/scene.gltf`
          ).pipe(
            tap(({ result }) => (modelCache = modelCache.set(mesh, result))),
            tap(log('Model loader')),
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

export default model$

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
