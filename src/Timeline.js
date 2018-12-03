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
  .x(d => x(d.get('t')))
  .y(d => y(d.get('d')))

const dFormat = format('.3f')

class Timeline extends React.Component {
  render() {
    const {
      size: { width },
      data,
    } = this.props

    const series = data.toArray()
    const dateExtent = extent(series, d => d.get('t'))
    const pointExtent = extent(series, d => d.get('d'))

    x.domain(dateExtent)
      .range([0, width])
      .nice()

    y.domain(pointExtent).nice()

    return (
      <React.Fragment>
        <svg className={style.frame} height="500">
          <g className={style.series}>
            <path d={generator(data.toArray())} />
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
