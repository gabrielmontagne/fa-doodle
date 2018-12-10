import React from 'react'
import style from './Annotation.module.css'
import { range } from 'd3-array'
import { curry } from 'ramda'
import { Vector3 } from 'three'

export default function Annotation({ size: { width, height }, camera }) {
  const ranges = {
    x: range(-20, 21, 5),
    y: range(-20, 21, 5),
    z: range(-20, 21, 5),
  }

  const coords = toCoords(ranges)
    .map(curry(project)(width, height, camera))
    .filter(({x, y}) => isFinite(x) && isFinite(y))

  return (
    <svg className={style.annotation}>
      {
        coords.map(
          ({x, y}, i) => 
          <circle key={i} 
            cx={x}
            cy={y}
            r="3"
            fill="none"
            stroke="rgba(0, 0, 255, 0.5)"
          />
        )
      }
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

function toCoords({ x, y, z }) {
  return x.reduce(
    (acc, x) =>
      y.reduce(
        (acc, y) =>
          z.reduce((acc, z) => acc.concat(new Vector3(x, y, z)), acc),
        acc
      ),
    []
  )
}

function project(width, height, camera, v) {
  const { x, y } = v.project(camera)
  return {
    x: Math.round(((x + 1) * width) / 2),
    y: Math.round(((y + 1) * height) / 2),
  }
}
