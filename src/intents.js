import { Subject } from 'rxjs'
import log from 'caballo-vivo/src/log'

export const showNoise$ = new Subject().do(log('Show noise'))

window.showNoise$ = showNoise$
