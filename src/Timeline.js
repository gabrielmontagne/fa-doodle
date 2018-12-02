import React from 'react'
import style from './Timeline.module.css'
import { extent } from 'd3-array'
import { line } from 'd3-shape'
import { scaleLinear } from 'd3-scale'
import sizeMe from 'react-sizeme'

const x = scaleLinear()
const y = scaleLinear().range([400, 0])
const generator = line().x(d => x(d.get('t'))).y(d => y(d.get('d')))

export default sizeMe()(function Timeline({data, size}) {

  const { width } = size
  const series = data.toArray()
  const dateExtent = extent(series, d => d.get('t'))
  const pointExtent = extent(series, d => d.get('d'))

  x.domain(dateExtent).range([0, width])
  y.domain(pointExtent)

  console.log(
    size,
    'ε', dateExtent,
    'δ', pointExtent,
    React
  )

  return <React.Fragment>
    <svg className={style.frame}>
      <path className={style.series} d={generator(data.toArray())}/>
    </svg>
  </React.Fragment>
})
