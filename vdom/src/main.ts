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
		createElement("img", {
			attrs: {
				src: "https://media.giphy.com/media/jpbnoe3UIa8TU8LM13/giphy.gif",
			},
		}),
	],
})

let count = 0
let vApp = createVApp(count)
const $app = render(vApp)

let $rootEl: Text | HTMLElement | null = document.getElementById('app')

const main = ($rootEl: Text | HTMLElement) => {
	$rootEl = mount($app, $rootEl)
	setInterval(() => {
		count++
		const vNewApp = createVApp(count)
		const patch = diff(vApp, vNewApp)
		patch($rootEl)
		vApp = vNewApp
		//if ($rootEl)
		//	$rootEl = mount(render(createVApp(count)), $rootEl)
	}, 1000)
}

if ($rootEl) {
	main($rootEl)
}
