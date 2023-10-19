import { useAwesome } from '../lib/awesome'

export function setup() {
  const awsome = useAwesome()
  console.log(awsome.do())
  awsome.setName('foo')
  console.log(awsome.do())
  console.log(useAwesome().do())
}
