import flog from '@zambezi/caballo-vivo/src/flog'
import { Subject } from 'rxjs'

export const showNoise$ = new Subject().pipe(flog('Show noise'))
export const showModel$ = new Subject().pipe(flog('Show model'))
export const resetToHome$ = new Subject().pipe(flog('Reset to home'))
