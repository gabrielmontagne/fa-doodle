import React from 'react'
import log from 'caballo-vivo/src/log'
import { render } from 'react-dom'
import { Subject } from 'rxjs'
import { partialRight } from 'ramda'
import Timeline from './Timeline'

const domSink = partialRight(render, [document.getElementById('root')])
const render$ = new Subject().share().do(log('Render state'))

render$.map(toView).subscribe(domSink)

export default render$

function toView(state) {
  return <div><Timeline /><h1>{state.get('oka')}</h1></div>
}
