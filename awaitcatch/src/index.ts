async function doSomething() {
	if (new Date().getTime() % 2 === 0) {
		throw 'fatal error: the earth has been destroyed';
	}
	return ['data', null]
}

(async () => {
	const [data, err] = await doSomething().catch(err => {
		console.log('--- catch ---')
		console.error(err)
		console.log('--- catch ---')
		return [null, err]
	})
	if (err) {
		console.log(`err: ${err}`)
		return
	}
	console.log(`data: ${data}`)
})()
