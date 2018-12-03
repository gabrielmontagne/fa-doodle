import React from 'react'
import sizeMe from 'react-sizeme'
import style from './Timeline.module.css'
import { extent } from 'd3-array'
import { format } from 'd3-format'
import { line } from 'd3-shape'
import { scaleLinear, scaleTime } from 'd3-scale'
import AxisX from './AxisX'
import AxisY from './AxisY'
import createTransition$ from './transition'
import log from 'caballo-vivo/src/log'

const x = scaleTime()
const y = scaleLinear().range([400, 0])
const generator = line()
  .x(d => x(d.t))
  .y(d => y(d.d))

const dFormat = format('.3f')

class Timeline extends React.Component {
  constructor(props) {
    super(props)
    const series = props.data.toJS()
    this.state = { series: [] }
    this.tween$ = createTransition$(series)
  }

  componentDidMount() {
    this.subscription = this.tween$
      .do(log('Series tween'))
      .subscribe(series => this.setState({ series }))
    this.tween$.next(this.props.data.toJS())
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.data.equals(this.props.data)) return
    this.tween$.next(this.props.data.toJS())
  }

  componentWillUnmount() {
    this.subscription.unsubscribe()
  }

  render() {
    const {
      size: { width },
    } = this.props

    const { series } = this.state
    const dateExtent = extent(series, d => d.t)
    const pointExtent = extent(series, d => d.d)

    x.domain(dateExtent)
      .range([0, width])
      .nice()

    y.domain(pointExtent).nice()

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
            <span key={i}>{dFormat(d.d)} → </span>
          ))}
        </p>
      </React.Fragment>
    )
  }
}

export default sizeMe()(Timeline)
