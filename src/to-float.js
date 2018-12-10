import { map } from 'ramda'
function toFloat(i, k) {
  const result = parseFloat(i)
  if (isNaN(result)) throw new Error(`Unable to parse ${i} as number`)
  return result
}

export default map(toFloat)
