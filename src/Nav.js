import React from 'react'
import { NavLink } from 'react-router-dom'
import style from './Nav.module.css'

export default function Nav({favCurves}) {
  return <nav className={style.nav}>
    Other curves,
    { favCurves.map((path, i) => <NavLink className={style.link} activeClassName={style.active} key={path} to={path}>{path}</NavLink>) }
  </nav>
}
