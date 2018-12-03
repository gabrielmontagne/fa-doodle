import AxisX from './AxisX'
import AxisY from './AxisY'
import React from 'react'
import createTransition$ from './transition'
import log from 'caballo-vivo/src/log'
import sizeMe from 'react-sizeme'
import style from './Timeline.module.css'
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
    const initialExtents = getExtents(this.props.data)
    this.state = initialExtents
    this.tween$ = createTransition$(initialExtents)
  }

  componentDidMount() {
    this.subscription = this.tween$.subscribe(extents =>
      this.setState(extents)
    )
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.data.equals(this.props.data)) return
    console.log(
      '%ccomponentDidUpdate for real -- push new extents!',
      'background: green; padding: 50px;'
    )
    this.tween$.next(getExtents(this.props.data))
  }

  componentWillUnmount() {
    console.log('%ccomponentWillUnmount', 'color: red;')
    this.subscription.unsubscribe()
  }

  render() {
    const {
      data,
      size: { width },
    } = this.props
    const { dateExtent, pointExtent } = this.state
    x.domain(dateExtent).range([0, width])
    y.domain(pointExtent)
    const series = data.toArray()
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
  const dateExtent = extent(data, d => d.get('t'))
  const pointExtent = extent(data, d => d.get('d'))
  return { dateExtent, pointExtent }
}
