import React from 'react'
import Timeline from './Timeline'
import log from 'caballo-vivo/src/log'
import { Subject } from 'rxjs'
import { partialRight } from 'ramda'
import { render } from 'react-dom'

const domSink = partialRight(render, [document.getElementById('root')])
const render$ = new Subject().share().do(log('Render state'))

render$.map(toView).subscribe(domSink)

export default render$

function toView(state) {
  return <div>
    <Timeline data={state.get('noise')}/>
    <h1>{state.get('oka')}</h1>
  </div>
}
