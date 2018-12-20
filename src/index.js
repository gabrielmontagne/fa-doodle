import './index.css'
import render$ from './view'
import store$ from './store'

store$.subscribe(render$)

