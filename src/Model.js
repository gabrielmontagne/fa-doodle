import React from 'react'
import sizeMe from 'react-sizeme'
import style from './Model.module.css'
import toFloat from './to-float'
import { BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer, } from 'three'
import { pick, compose } from 'ramda'

const angles = compose(toFloat, pick(['rx', 'ry', 'rz']))

class Model extends React.PureComponent {
  constructor(props) {
    super(props)
    this.canvas = React.createRef()
    this.state = createInitialState(this.props.size.width, 500)
  }

  componentDidMount() {
    const { width } = this.props.size
    const renderer = new WebGLRenderer({ alpha: true, antialias: true, canvas: this.canvas.current })
    renderer.setSize(width, 500)
    console.log('%c componentDidMount', 'color: darkred', renderer)
    this.setState({ renderer })
  }

  componentDidUpdate() {
    console.log('%c componentDidUpdate', 'color: crimson', this.canvas)
  }

  componentWillUnmount() {
    console.log('%c componentWillUnmount', 'color: red', this.canvas)
  }

  render() {
    const { scene, camera, renderer, mesh } = this.state
    const { rx, ry, rz } = angles(this.props)
    if (mesh) Object.assign(mesh.rotation, {x:rx, y:ry, z:rz})
    if (renderer) renderer.render(scene, camera)
    return <canvas className={style.canvas} ref={this.canvas} />
  }
}

export default sizeMe()(Model)

function createInitialState(width, height) {
  const scene = new Scene()
  const camera = new PerspectiveCamera(75, width / height)
  const geometry = new BoxGeometry(1, 1, 1)
  const material = new MeshBasicMaterial({ color: 0xff0000 })
  const mesh = new Mesh(geometry, material)
  mesh.position.z = -5
  scene.add(mesh)
  return { scene, mesh, camera }
}
