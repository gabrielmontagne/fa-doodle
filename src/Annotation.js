import React from 'react'
import style from './Annotation.module.css'
import { Vector3 } from 'three'
import { curry } from 'ramda'
import { format } from 'd3-format'
import { range } from 'd3-array'

const tickFormat = format('1i')

export default function Annotation({ size: { width, height }, camera }) {
  const ranges = {
    x: range(-15, 16, 5),
    y: range(-1, 1, 1),
    z: range(-3, 4, 1),
  }

  const coords = toCoords(ranges)
    .map(curry(project)(width, height, camera))
    .filter(({ x, y }) => isFinite(x) && isFinite(y))

  return (
    <svg className={style.annotation}>
      {coords.map(({ x, y, t }, i) => (
        <g key={i} transform={`translate(${x},${y})`}>
          <circle key={i} r="2" className={style.marker} />
          <text className={style.label}>{t}</text>
        </g>
      ))}
      <circle
        cx="50%"
        cy="50%"
        r="50"
        fill="none"
        stroke="rgba(255, 0, 0, 0.5)"
      />
      <circle
        cx="50%"
        cy="0"
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
          z.reduce(
            (acc, z) =>
              acc.concat(
                Object.assign(new Vector3(x, y, z), {
                  t: `${tickFormat(x)},${tickFormat(y)},${tickFormat(z)}`,
                })
              ),
            acc
          ),
        acc
      ),
    []
  )
}

function project(width, height, camera, v) {
  const { x, y } = v.project(camera)
  return {
    x: Math.round(((x + 1) * width) / 2),
    y: height - Math.round(((y + 1) * height) / 2),
    t: v.t,
  }
}
