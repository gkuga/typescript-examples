async function doSomeAsyncThingA() {
	const data = await doSomeAsyncThingB().catch(err => {
		console.log('--- catch in A ---')
		console.error(err)
		console.log('--- catch in A ---')
		throw err
	})
	return data
}

async function doSomeAsyncThingB() {
	if (new Date().getTime() % 2 === 0) {
		throw 'fatal error: the earth has been destroyed';
	}
	return 'data'
}

(async () => {
	const data = await doSomeAsyncThingA().catch(err => {
		console.log('--- catch ---')
		console.error(err)
		console.log('--- catch ---')
		throw (err)
	})
	console.log(`data: ${data}`)
})().catch(err => console.error(err))
