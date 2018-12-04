import Error from './Error'
import Nav from './Nav'
import React from 'react'
import Timeline from './Timeline'
import log from 'caballo-vivo/src/log'
import { Router, Link, Switch, Route } from 'react-router-dom'
import { Subject } from 'rxjs'
import { history } from 'caballo-vivo/src/location'
import { partialRight } from 'ramda'
import { render } from 'react-dom'

const domSink = partialRight(render, [document.getElementById('root')])
const render$ = new Subject().share().do(log('Render state'))

render$.map(toView).subscribe(domSink)

export default render$

function toView(state) {
  if (state.has('error')) return <Error error={state.get('error')} />
  if (!state.has('location')) return <p>λoading</p>
  return (
    <React.Fragment>
      <h1>×</h1>
      <Router history={history}>
        <div>
        <Nav favCurves={state.get('favCurves')}/>
        <Switch location={state.get('location').toObject()}>
          <Route
            path="/curve/:h/:v/:u"
            exact
            render={({
              match: {
                params: { h, v, u },
              },
            }) => <Timeline data={state.get('noise')} h={h} v={v} u={u} />}
          />
          <Route
            render={() => (
              <React.Fragment>
                <h1>▓</h1>
                <p>Click on one of the other curves above</p>
              </React.Fragment>
            )}
          />
        </Switch>
        </div>
      </Router>
    </React.Fragment>
  )
}
