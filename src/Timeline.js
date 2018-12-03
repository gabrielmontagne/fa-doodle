import AxisX from './AxisX'
import AxisY from './AxisY'
import React from 'react'
import createTransition$ from './transition'
import log from 'caballo-vivo/src/log'
import sizeMe from 'react-sizeme'
import style from './Timeline.module.css'
import { equals } from 'ramda'
import { extent } from 'd3-array'
import { format } from 'd3-format'
import { line } from 'd3-shape'
import { scaleLinear, scaleTime } from 'd3-scale'

const x = scaleTime()
const y = scaleLinear().range([400, 0])
const generator = line()
  .x(d => x(d.get('t')))
  .y(d => y(d.get('d')))

const dFormat = format('.3f')

class Timeline extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    console.log('%ccomponentDidMount', 'color: orange; background: blue; padding: 20px;')
    this.tween$ = createTransition$(getExtents(this.props.data))
      .do(log('Extents tween'))

    this.subscription = this.tween$.subscribe(extents =>
      this.setState(extents)
    )
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('%ccomponentDidUpdate', 'color: purple;')
    if (prevProps.data.equals(this.props.data)) return
    this.tween$.next(getExtents(this.props.data))
  }

  componentWillUnmount() {
    console.log('%ccomponentWillUnmount', 'color: red;')
    this.subscription.unsubscribe()
  }

  render() {
    console.log('%crender!', 'color: #AF0;')
    const {
      data,
      size: { width },
    } = this.props

    if (!data) return null

    const { dateExtent, pointExtent } = this.state
    const series = data.toArray()

    if (!dateExtent) return null
    if (!pointExtent) return null

    x.domain(dateExtent).range([0, width])
    y.domain(pointExtent)

    return (
      <React.Fragment>
        <svg className={style.frame} height="500">
          <g className={style.series}>
            <path d={generator(series)} />
          </g>

          <AxisY scale={y} className={style.yAxis} />
          <AxisX scale={x} className={style.xAxis} />
        </svg>
        <p>
          {series.map((d, i) => (
            <span key={i}>{dFormat(d.get('d'))} → </span>
          ))}
        </p>
      </React.Fragment>
    )
  }
}

export default sizeMe()(Timeline)

function getExtents(data) {
  console.log('getExtents', data)
  const dateExtent = extent(data, d => d.get('t'))
  const pointExtent = extent(data, d => d.get('d'))
  console.log('getExtents', data, dateExtent, pointExtent)
  return { dateExtent, pointExtent }
}
