import { createElement } from './vdom/createElement'
import { render } from './vdom/render'
import { mount } from './vdom/mount'

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

const count = 0
const vApp = createVApp(count)
const $app = render(vApp)
const root = document.getElementById('app')

if (root)
	mount($app, root)

console.log($app)
