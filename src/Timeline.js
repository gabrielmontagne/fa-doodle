import React from 'react'
import style from './Timeline.module.css'
import { line } from 'd3-shape'
import { scaleLinear } from 'd3-scale'


const x = scaleLinear().domain([-1, 1]).range([0, 500])
const y = scaleLinear().domain([-1, 1]).range([500, 0])
const generator = line().x(d => x(d.get('t'))).y(d => y(d.get('d')))


export default function Timeline({data}) {
  return <svg className={style.frame}>
    <path d={generator(data.toArray())}/>
  </svg>
}
