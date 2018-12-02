import { generatePerlinNoise } from 'perlin-noise'
import { Observable } from 'rxjs'
import { List } from 'immutable'
import log from 'caballo-vivo/src/log'

console.log('generateNoise', generatePerlinNoise)

const noise$ = Observable.of(List(generatePerlinNoise(10, 10)))
  .do(log('Noise'))
  .map(noise => state => state.set('noise', noise))

export default noise$
