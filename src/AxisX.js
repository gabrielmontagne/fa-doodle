import React from 'react'
import style from './AxisX.module.css'

export default function AxisX({ scale, className }) {
  const format = scale.tickFormat()
  return (
    <g className={`${style.axis} ${className}`}>
      <path d={`M0,0H${scale.range()[1]}`} className={style.line} />
      {scale.ticks().map(t => (
        <g transform={`translate(${scale(t)}, 0)`}>
          <line className={style.tick} y2="6" />
          <text className={style.label} y="9" dy="0.71em">
            {format(t)}
          </text>
        </g>
      ))}
    </g>
  )
}
