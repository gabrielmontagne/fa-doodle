import AxisX from './AxisX'
import AxisY from './AxisY'
import React from 'react'
import createTransition$ from './transition'
import sizeMe from 'react-sizeme'
import style from './Timeline.module.css'
import { List } from 'immutable'
import { extent } from 'd3-array'
import { line, curveCardinal as curve } from 'd3-shape'
import { scaleLinear, scaleOrdinal, scaleTime } from 'd3-scale'
import { schemeSet1 as colors } from 'd3-scale-chromatic'

const x = scaleTime()
const y = scaleLinear().range([400, 0])
const generator = line()
  .curve(curve.tension(0.3))
  .x(d => x(d.get('t')))
  .y(d => y(d.get('d')))
const color = scaleOrdinal().range(colors)

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
    this.tween$.next(getExtents(this.props.data))
  }

  componentWillUnmount() {
    this.subscription.unsubscribe()
  }

  render() {
    const {
      data,
      size: { width },
      h,
      v,
      u,
    } = this.props
    const { dateExtent, pointExtent } = this.state
    x.domain(dateExtent).range([0, width])
    y.domain(pointExtent)

    return (
      <React.Fragment>
        <h1>
          ΤΛ {h}×{v}×{u}
        </h1>
        <svg className={style.frame} height="500">
          <g className={style.series}>
            {data.map((s, i) => (
              <path key={i} stroke={color(i)} d={generator(s.toArray())} />
            ))}
          </g>
          <AxisY scale={y} className={style.yAxis} />
          <AxisX scale={x} className={style.xAxis} />
        </svg>
      </React.Fragment>
    )
  }
}

export default sizeMe()(Timeline)

function getExtents(data) {
  const dateExtent = extent(data.first().slice(2, -1), d => d.get('t'))
  const pointExtent = extent(
    data
      .reduce((acc, n) => n.reduce((a, d) => a.push(d.get('d')), acc), List())
      .toArray()
  )
  return { dateExtent, pointExtent }
}
