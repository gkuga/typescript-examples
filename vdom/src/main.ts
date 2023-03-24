import { createElement } from './vdom/createElement'
import { render } from './vdom/render'
import { mount } from './vdom/mount'
import { diff } from './vdom/diff'

const createVApp = (count: number) => createElement('div', {
	attrs: {
		id: 'app',
		dataCount: String(count),
	},
	children: [
		String(count),
		createElement("input", {}),
		createElement("img", {
			attrs: {
				src: "https://media.giphy.com/media/jpbnoe3UIa8TU8LM13/giphy.gif",
			},
		}),
	],
})

const main = ($rootEl: Element) => {
	let count = 0
	let vApp = createVApp(count)
	// State in which VDOM is consistent with DOM.
	// Real DOM of vApp is $app.
	const $app = mount(render(vApp), $rootEl)
	setInterval(() => {
		count++
		// New VDOM is in a state of difference from the previous VDOM
		const vNewApp = createVApp(count)
		const patch = diff(vApp, vNewApp)
		// Resolve inconsistencies between VDOM and DOM.
		// Resolution is compared from the root of the DOM tree and the VDOM tree.
		patch($app)
		vApp = vNewApp
	}, 1000)
}

const $rootEl: Text | Element | null = document.getElementById('app')

if ($rootEl) {
	main($rootEl)
}
