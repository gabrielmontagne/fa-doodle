import React from 'react'
import style from './Loading.module.css'

export default function Loading({ loading = '' }) {
  return (
    <div>
      <h1>Loading</h1>
      <p>Loading {loading} <span className={style.waiting}>▄</span></p>
    </div>
  )
}
