import React from 'react'
import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three'
import style from './Model.module.css'
import sizeMe from 'react-sizeme'

class Model extends React.PureComponent {
  constructor(props) {
    super(props)
    this.canvas = React.createRef()
    this.state = createInitialState(this.props.size.width, 500)
  }

  componentDidMount() {
    const { width } = this.props.size
    const renderer = new WebGLRenderer({ canvas: this.canvas.current })
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
    if (mesh) mesh.rotation.z = Math.random() * 360
    if (renderer) renderer.render(scene, camera)

    console.log( '%c RENDER props', 'color: firebrick', scene, camera, renderer)

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
  mesh.rotation.x = 5
  scene.add(mesh)

  return { scene, mesh, camera }
}
