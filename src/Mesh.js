import React from 'react'
import { WebGLRenderer } from 'three'
import style from './Mesh.module.css'
import sizeMe from 'react-sizeme'

class Mesh extends React.Component {
  constructor(props) {
    super(props)
    this.canvas = React.createRef()
  }

  componentDidMount() {
    this.renderer = new WebGLRenderer({ canvas:this.canvas.current })
    console.log('%c componentDidMount', 'color: darkred', this.canvas, this.renderer, this.props.size)
  }
  componentDidUpdate() {
    console.log('%c componentDidUpdate', 'color: crimson', this.canvas)
  }
  componentWillUnmount() {
    console.log('%c componentWillUnmount', 'color: red', this.canvas)
  }

  render() {
    console.log('%c props', 'color: firebrick', this.props)
    return <canvas className={style.canvas} ref={this.canvas} />
  }
}

export default sizeMe()(Mesh)
