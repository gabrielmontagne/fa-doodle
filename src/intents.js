import log from './caballo-vivo/log'
import { Subject } from 'rxjs'
import { tap } from 'rxjs/operators'

export const showNoise$ = new Subject().pipe(tap(log('Show noise')))
export const showModel$ = new Subject().pipe(tap(log('Show model')))
export const resetToHome$ = new Subject().pipe(tap(log('Reset to home')))
