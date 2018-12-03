import React from 'react'
import style from './AxisY.module.css'

export default function AxisY({scale, className}) {
  const format = scale.tickFormat()
  return <g className={`${style.axis} ${className}`}>
    <path d='M25,0V400'/> 
    {
      scale.ticks(5).map(
        (t, i) => 
        <g
          key={i}
          transform={`translate(0,${scale(t)})`}
        >
          <line className={style.tick} x1="5" x2={scale.range()[1] -50}/>
          <text className={style.label}>{format(t)}</text>
        </g>
      )
    }
  </g>
}
