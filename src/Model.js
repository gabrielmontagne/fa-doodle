import Annotation from './Annotation'
import React from 'react'
import Rotation from './Rotation'
import createTransition$ from './transition'
import sizeMe from 'react-sizeme'
import style from './Model.module.css'
import toFloat from './to-float'
import { map } from 'ramda'
import {
  AmbientLight,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Vector3,
  Object3D,
  Box3,
  Math,
} from 'three'
import { pick, pipe, equals } from 'ramda'

const height = 500
const cameraZ = 40
const { DEG2RAD: d2r } = Math

const propsToRadians = pipe(
  pick(['rx', 'ry', 'rz']),
  toFloat,
  map(n => n * d2r),
  ({ rx, ry, rz }) => ({ x: rx, y: ry, z: rz })
)

class Model extends React.Component {
  constructor(props) {
    super(props)
    const rotation = propsToRadians(props)
    const {
      size: { width },
      model,
    } = this.props

    this.canvas = React.createRef()
    this.state = initializeState(width, height, rotation, model)
    this.tween$ = createTransition$(rotation)
  }

  componentDidMount() {
    const { width } = this.props.size
    const renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas: this.canvas.current,
    })
    renderer.setSize(width, height)
    this.setState({ renderer })
    this.subscription = this.tween$.subscribe(rotation =>
      this.setState({ rotation })
    )
  }

  componentDidUpdate(prevProps, prevState) {
    const { model } = this.props
    const { model: prevModel } = prevProps
    let skipTransition = false

    if (model && !model.equals(prevModel)) {
      const { scene } = this.state
      scene.remove(prevModel.get('scene'))
      scene.add(model.get('scene'))
      skipTransition = true
    }

    const rotation = propsToRadians(this.props)
    const prevRotation = propsToRadians(prevProps)
    if (equals(rotation, prevRotation)) return
    this.tween$.next({ ...rotation, skipTransition })
  }

  componentWillUnmount() {
    this.subscription.unsubscribe()
  }

  render() {
    const { renderer, scene, camera, rotation, cameraPivot } = this.state
    const { model, size, rx, ry, rz, mesh } = this.props
    const title = model.getIn(['asset', 'extras', 'title'], 'Unititled')
    const author = model.getIn(
      ['asset', 'extras', 'author'],
      'unknown author'
    )

    if (cameraPivot) Object.assign(cameraPivot.rotation, rotation)
    if (renderer) renderer.render(scene, camera)

    return (
      <React.Fragment>
        <section>
          <canvas className={style.canvas} ref={this.canvas} />
          <Annotation
            size={{ ...size, height }}
            camera={camera}
            title={title}
            author={author}
            rotation={rotation}
          />
        </section>
        <Rotation rx={rx} ry={ry} rz={rz} mesh={mesh} />
      </React.Fragment>
    )
  }
}

export default sizeMe()(Model)

function initializeState(width, height, rotation, model) {
  const scene = new Scene()
  const cameraPivot = new Object3D()
  const camera = new PerspectiveCamera(50, width / height)

  camera.position.z = cameraZ
  cameraPivot.add(camera)
  scene.add(cameraPivot)

  if (model) scene.add(prepModel(model.get('scene')))
  scene.add(new AmbientLight(0xffffff, 0.5))
  return { scene, camera, rotation, cameraPivot }
}

function prepModel(model) {
  const bounds = new Box3().setFromObject(model)
  const center = new Vector3()
    .addVectors(bounds.min, bounds.max)
    .divideScalar(2)
    .multiplyScalar(-1)
  Object.assign(model.position, center)
  return model
}
