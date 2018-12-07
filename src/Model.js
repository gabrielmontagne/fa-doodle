import React from 'react'
import createTransition$ from './transition'
import sizeMe from 'react-sizeme'
import style from './Model.module.css'
import log from 'caballo-vivo/src/log'
import toFloat from './to-float'
import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three'
import { pick, pipe, difference, equals } from 'ramda'

const angles = pipe(
  pick(['rx', 'ry', 'rz']),
  toFloat,
  ({ rx, ry, rz }) => ({ x: rx, y: ry, z: rz })
)

class Model extends React.Component {
  constructor(props) {
    super(props)
    const rotation = angles(props)
    this.canvas = React.createRef()
    this.state = initializeState(this.props.size.width, 500, rotation)
    this.tween$ = createTransition$(rotation)
      .do(r => console.log('ρ', r))
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
    const rotation = angles(this.props)
    const prevRotation = angles(prevProps)
    if (equals(rotation, prevRotation)) return
    this.tween$.next(rotation)
  }

  componentWillUnmount() {
    this.subscription.unsubscribe()
  }

  render() {
    const { scene, camera, mesh, rotation } = this.state
    if (mesh) Object.assign(mesh.rotation, rotation)
    if (this.renderer) this.renderer.render(scene, camera)
    return <canvas className={style.canvas} ref={this.canvas} />
  }
}

export default sizeMe()(Model)

function initializeState(width, height, rotation) {
  const scene = new Scene()
  const camera = new PerspectiveCamera(75, width / height)
  const geometry = new BoxGeometry(1, 1, 1)
  const material = new MeshBasicMaterial({ color: 0xff0000 })
  const mesh = new Mesh(geometry, material)
  mesh.position.z = -2
  scene.add(mesh)
  return { scene, mesh, camera, rotation }
}
