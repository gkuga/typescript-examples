const delay = <T>(ms: number, arg:T) => new Promise(resolve => setTimeout(resolve, ms, arg));

console.log('start')

Promise.resolve(3000)
  .then(rlt=> delay<number>(rlt,3))
  .then(res=>{console.log(res)})

console.log('end')
