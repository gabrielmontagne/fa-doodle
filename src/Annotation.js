import React from 'react'
import style from './Annotation.module.css'
import { range } from 'd3-array'

export default function Annotation({}) {
  const ranges = {
    x: range(-20, 21, 5),
    y: range(-20, 21, 5),
    z: range(-20, 21, 5),
  }

  const coords = ranges.x.reduce((acc, x) =>
    ranges.y.reduce(
      (acc, y) => ranges.z.reduce(
        (acc, z) => acc.concat({ x, y, z }), acc
      ), acc
    ), []
  )

  console.log('%ccoords', 'padding: 10px; background: yellow', coords)

  return (
    <svg className={style.annotation}>
      <circle
        cx="50%"
        cy="50%"
        r="50"
        fill="none"
        stroke="rgba(255, 0, 0, 0.5)"
      />
      <circle
        cx="50%"
        cy="50%"
        r="40"
        fill="none"
        stroke="rgba(255, 127, 0, 0.5)"
      />
    </svg>
  )
}
