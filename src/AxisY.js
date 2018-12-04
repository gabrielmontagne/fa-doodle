import React from 'react'
import style from './AxisY.module.css'

export default function AxisY({ scale, className }) {
  const format = scale.tickFormat()
  return (
    <g className={`${style.axis} ${className}`}>
      <path d="M25,0V400" />
      {scale.ticks(7).map((t, i) => (
        <g key={i} transform={`translate(0,${scale(t)})`}>
          <line className={style.tick} x1="100%" x2={scale.range()[1] - 50} />
          <text className={style.label} dy="-0.4em">{format(t)}</text>
        </g>
      ))}
    </g>
  )
}
