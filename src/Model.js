import React from 'react'
import createTransition$ from './transition'
import sizeMe from 'react-sizeme'
import style from './Model.module.css'
import { map, multiply } from 'ramda'
import toFloat from './to-float'
import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Vector3,
  Box3
} from 'three'
import { pick, pipe, equals, values, max, reduce } from 'ramda'

const targetSize = 20
const propsToRadians = pipe(
  pick(['rx', 'ry', 'rz']),
  toFloat,
  map(pipe(multiply(Math.PI / 180))),
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
    this.state = initializeState(width, 500, rotation, model)
    this.tween$ = createTransition$(rotation)
  }

  componentDidMount() {
    const { width } = this.props.size
    this.renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas: this.canvas.current,
    })
    this.renderer.setSize(width, 500)
    this.subscription = this.tween$.subscribe(rotation =>
      this.setState({ rotation })
    )
  }

  componentDidUpdate(prevProps, prevState) {
    const { model } = this.props
    const { model: prevModel } = prevProps

    if (model && !model.equals(prevModel)) {
      const { scene } = this.state
      scene.remove(prevModel.get('scene'))
      scene.add(model.get('scene'))
    }

    const rotation = propsToRadians(this.props)
    const prevRotation = propsToRadians(prevProps)
    if (equals(rotation, prevRotation)) return
    this.tween$.next(rotation)
  }

  componentWillUnmount() {
    this.subscription.unsubscribe()
  }

  render() {
    const { scene, camera, rotation } = this.state
    const { model } = this.props
    const modelScene = model && model.get('scene')
    if (modelScene) Object.assign(modelScene.rotation, rotation)
    if (this.renderer) this.renderer.render(scene, camera)
    return <canvas className={style.canvas} ref={this.canvas} />
  }
}

export default sizeMe()(Model)

function initializeState(width, height, rotation, model) {
  const scene = new Scene()
  const camera = new PerspectiveCamera(75, width / height)
  camera.position.z = 20
  camera.position.y = 10
  const modelScene = prepModel(model.get('scene'))
  if (model) scene.add(modelScene)
  return { scene, camera, rotation }
}

function prepModel(model) {
  const bounds = new Box3().setFromObject(model)
  const size = bounds.getSize(new Vector3())
  const maxSide = reduce(max, [], values(size))
  const scale = targetSize / maxSide
  console.log('%cbounds', 'background: powderblue', bounds, size, maxSide, targetSize, bounds, scale)
  Object.assign(model.scale, { x: scale, y: scale, z: scale})
  return model
}
