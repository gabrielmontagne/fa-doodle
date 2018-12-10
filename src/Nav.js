import React from 'react'
import { NavLink } from 'react-router-dom'
import style from './Nav.module.css'

export default function Nav({ favCurves }) {
  return (
    <nav className={style.nav}>
      Click on the following links to see some curves,
      {[
        '/curve/0.9/0.2/0.1',
        '/curve/0.1/5.0/3.0',
        '/curve/0.0/0.2/0.1',
        '/curve/0.9/0.2/0.2',
        '/curve/0.1/0.8/0.8',
        '/curve/0.3/0.5/0.6',
      ].map(toLink)}
      — Or perhaps load any of the following meshes,
      {[
        '/mesh/house/0/0/0',
        '/mesh/house/-45/10/15',
        '/mesh/house/-80/-20/0',
        '/mesh/table/0/0/0',
        '/mesh/table/20/-10/4',
        '/mesh/louis-xiv/-40/15/0',
        '/mesh/louis-xiv/0/0/0',
        '/mesh/mercure/0/0/0',
        '/mesh/mercure/30/-30/10',
      ].map(toLink)}
    </nav>
  )
}

function toLink(path) {
  return (
    <NavLink
      className={style.link}
      activeClassName={style.active}
      key={path}
      to={path}
    >
      {path}
    </NavLink>
  )
}
