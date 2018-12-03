import React from 'react'
import sizeMe from 'react-sizeme'
import style from './Timeline.module.css'
import { Motion, spring } from 'react-motion'
import { extent } from 'd3-array'
import { format } from 'd3-format'
import { line } from 'd3-shape'
import { scaleLinear, scaleTime } from 'd3-scale'
import createTransition$ from './transition'
import log from 'caballo-vivo/src/log'

const x = scaleTime()
const y = scaleLinear().range([400, 0])
const generator = line()
  .x(d => x(d.get('t')))
  .y(d => y(d.get('d')))

const dFormat = format('.3f')

export default sizeMe()(function Timeline({ data, size }) {
  const { width } = size
  const series = data.toArray()
  const dateExtent = extent(series, d => d.get('t'))
  const pointExtent = extent(series, d => d.get('d'))

  x.domain(dateExtent)
    .range([0, width])
    .nice()
  y.domain(pointExtent).nice()

  const xFormat = x.tickFormat()
  const yFormat = y.tickFormat()
  window.x = x
  window.xFormat = xFormat
  window.y = y

  return (
    <React.Fragment>
      <svg className={style.frame} height="500">
        <g className={style.series}>
          <path d={generator(data.toArray())} />
        </g>
        <g className={style.xAxis}>
          <path d={`M0,0H${width}`} className={style.line}/>
          {
            x.ticks().map(
              t =>
              <g
                transform={`translate(${x(t)}, 0)`}
              >
                <line className={style.tick} y2="6" />
                <text className={style.label} y="9" dy="0.71em">{xFormat(t)}</text>
              </g>
            )
          }
        </g>

        <g className={style.yAxis}>
          <path d='M0,0V400'/> 
          {
            y.ticks().map(
              t => 
              <g
                transform={`translate(0,${y(t)})`}
              >
                <line className={style.tick} x2="6"/>
                <text className={style.label} y="9" dx="0.71em">{yFormat(t)}</text>
              </g>
            )
          }
        </g>
      </svg>
      <p>
        {series.map((d, i) => (
          <span key={i}>{dFormat(d.get('d'))} → </span>
        ))}
      </p>
      <Motion
        defaultStyle={{ x: series[0].get('d') }}
        style={{ x: spring(series[0].get('d')) }}
      >
        {value => <h1>{dFormat(value.x)}</h1>}
      </Motion>
    </React.Fragment>
  )
})
