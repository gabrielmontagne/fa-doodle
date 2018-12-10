import React from 'react'
import style from './Annotation.module.css'
import { Vector3 } from 'three'
import { curry } from 'ramda'
import { format } from 'd3-format'
import { range } from 'd3-array'
import { scaleLinear } from 'd3-scale'

const angleFormat = format('+05.2f')
const ranges = {
  x: scaleLinear().domain([-40, 40]),
  y: scaleLinear().domain([-10, 10]),
  z: scaleLinear().domain([-30, 30]),
}

export default function Annotation({
  size: { width, height },
  camera,
  author,
  title,
  rotation: { x, y, z },
}) {
  const coords = toCoords({
    x: ranges.x.ticks(3),
    y: ranges.y.ticks(10),
    z: ranges.z.ticks(4),
  })
    .map(curry(project)(width, height, camera))
    .filter(({ x, y }) => isFinite(x) && isFinite(y))

  return (
    <svg className={style.annotation}>
      {coords.map(({ x, y, t }, i) => (
        <g key={i} transform={`translate(${x},${y})`}>
          <path className={style.marker} d="M-5,0L0,0M0,-5L0,0" />
          <text dy="0.2em" dx="0.4em" className={style.label}>{t}</text>
        </g>
      ))}

      <text transform="translate(0, 40)" className={style.title}>
        {title}
      </text>
      <text transform="translate(0, 60)" className={style.author}>
        {author}
      </text>
      <text transform="translate(0, 80)" className={style.rotation}>
        {`rot x:${angleFormat(x)}° y:${angleFormat(y)}° z:${angleFormat(z)}°`}
      </text>
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
                  t: `${ranges.x.tickFormat()(x)},${ranges.y.tickFormat()(
                    y
                  )},${ranges.z.tickFormat()(z)}`,
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
