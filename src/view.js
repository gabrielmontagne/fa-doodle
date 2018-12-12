import React from 'react'
import Error from './view/Error'
import Loading from './view/Loading'
import Model from './view/Model'
import Nav from './view/Nav'
import Timeline from './view/Timeline'
import log from 'caballo-vivo/src/log'
import { Router, Switch, Route } from 'react-router-dom'
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
  if (state.has('loading')) return <Loading loading={state.get('loading')} />
  if (!state.has('location')) return <Loading />
  return (
    <React.Fragment>
      <h1>× FA doodle ×</h1>
      <Router history={history}>
        <div>
          <Nav favCurves={state.get('favCurves')} />
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
              exact
              path="/mesh/:mesh/:rx/:ry/:rz"
              render={({
                match: {
                  params: { mesh, rx, ry, rz },
                },
              }) => (
                <Model
                  model={state.getIn(['models', mesh])}
                  mesh={mesh}
                  rx={rx}
                  ry={ry}
                  rz={rz}
                />
              )}
            />
            <Route render={() => <h1>█▓▓▒</h1>} />
          </Switch>
        </div>
      </Router>
    </React.Fragment>
  )
}
