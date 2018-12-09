import log from 'caballo-vivo/src/log'
import { Subject } from 'rxjs'

export const showNoise$ = new Subject().do(log('Show noise'))
export const showModel$ = new Subject().do(log('Show model'))
export const resetToHome$ = new Subject().do(log('Reset to home'))
