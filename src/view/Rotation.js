import React from 'react'
import style from './Rotation.module.css'
import { showModel$ } from '../intents'

export default function Rotation(props) {
  const { rx, ry, rz, mesh } = props
  return (
    <div>
      <button
        onClick={() => showModel$.next({ mesh, rx: 0, ry: 0, rz: 0 })}
        disabled={!parseFloat(rx) && !parseFloat(ry) && !parseFloat(rz)}
      >
        Reset rotation
      </button>
      {'yxz'.split('').map(k => (
        <p key={k}>
          <label>{k}</label>
          <input
            type="range"
            className={style.slider}
            min="-180"
            value={props['r' + k]}
            max="180"
            step="5"
            onChange={e => handleRotationChange(k, e)}
          />
        </p>
      ))}
    </div>
  )

  function handleRotationChange(k, { target: { value } }) {
    showModel$.next({ rx, ry, rz, mesh, ...{ ['r' + k]: value } })
  }
}
