import Error from './Error'
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
  console.log('toView', state)

  if (state.has('error')) return <Error error={state.get('error')} />
  if (!state.has('location')) return <p>λoading</p>

  return (
    <React.Fragment>
      <h1>× {state.get('oka')}</h1>
      <Router history={history}>
        <Switch location={state.get('location').toObject()}>
          <Route
            path="/curve/:h/:v/:u"
            exact
            render={() => <Timeline 
              data={state.get('noise')} 
              h={state.get('noiseH')}
              v={state.get('noiseV')}
              u={state.get('noiseU')}
            />}
          />
          <Route
            render={() => (
              <React.Fragment>
                <h2>▓</h2>
                <Link to="/curve/0.2/0.1/0.5">start</Link>
              </React.Fragment>
            )}
          />
        </Switch>
      </Router>
    </React.Fragment>
  )
}
